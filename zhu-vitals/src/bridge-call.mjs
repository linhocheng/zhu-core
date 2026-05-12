/**
 * bridgeCall — 機制 C：LLM call site 成本記錄
 *
 * 走 zhu-bridge HTTP gateway（Max OAuth 吃到飽），同時把成本估算寫進 zhu_vitals_cost。
 * 取代各 repo 自行實作的 callBridge / getAnthropicClient。
 *
 * 0.1.2 升級（對齊 Cloud Run worker 真實需求）：
 *   - 回傳 { text, usage, stop_reason, model, elapsed_ms }（不只是 text）
 *   - 接受 prompt (string) 或 messages (array) 擇一
 *   - 可選 endpoint: { url, secret } override（用於 VPC internal bridge）
 *   - 可選 dispatcher（undici Agent）— 給長文 LLM call 用
 *
 * 用法 A（簡易，預設走外網 zhu-bridge）：
 *   const { text } = await bridgeCall({ prompt: '...', purpose: 'classify' });
 *
 * 用法 B（內網 bridge + 長文 dispatcher）：
 *   const { text, usage, stop_reason } = await bridgeCall({
 *     messages: [{ role: 'user', content: '...' }],
 *     system: '...',
 *     model: 'claude-sonnet-4-6',
 *     maxTokens: 12000,
 *     endpoint: { url: `http://${host}:${port}`, secret },
 *     dispatcher: longRunDispatcher,
 *     purpose: 'stage2-write',
 *   });
 */
import { getDb, expiresAt, uuid } from './firestore.mjs';
import { VITALS_COLLECTIONS, TTL_DAYS } from './manifest.schema.mjs';
import { getRunContext } from './with-vitals.mjs';

const DEFAULT_MODEL = 'claude-sonnet-4-5';
const DEFAULT_MAX_TOKENS = 1500;

// 粗估價格 (USD per 1M tokens). 來源 anthropic pricing，準度 ±20%，趨勢用。
const PRICE_TABLE_USD_PER_M = {
  'claude-opus-4-7': { in: 15, out: 75 },
  'claude-sonnet-4-6': { in: 3, out: 15 },
  'claude-sonnet-4-5': { in: 3, out: 15 },
  'claude-haiku-4-5': { in: 0.8, out: 4 },
};

/**
 * @param {string} model
 * @param {number} inTokens
 * @param {number} outTokens
 */
function estimateCostUsd(model, inTokens, outTokens) {
  const p = PRICE_TABLE_USD_PER_M[model] ?? PRICE_TABLE_USD_PER_M[DEFAULT_MODEL];
  return ((inTokens * p.in) + (outTokens * p.out)) / 1_000_000;
}

/**
 * @param {object} opts
 * @param {string} [opts.prompt]              - 單 user message 簡易模式（與 messages 擇一）
 * @param {Array<{role:string,content:string|Array<{type:string,text:string}>}>} [opts.messages] - 完整 messages array
 * @param {string} [opts.system]
 * @param {string} [opts.model]
 * @param {number} [opts.maxTokens]
 * @param {string} [opts.worker_id]           - manifest.worker_id（缺則讀 ALS context）
 * @param {string} [opts.project]             - 哪個 repo / app（缺則讀 ALS context）
 * @param {string} [opts.purpose]             - 這個 call 是做什麼用
 * @param {{url:string,secret:string}} [opts.endpoint]  - 覆寫 BRIDGE_URL / BRIDGE_SECRET（用於 VPC internal）
 * @param {unknown} [opts.dispatcher]         - undici Agent (long-run 用)
 * @returns {Promise<{text:string,usage:{input_tokens:number,output_tokens:number,cache_creation_input_tokens?:number,cache_read_input_tokens?:number},stop_reason:string|null,model:string,elapsed_ms:number}>}
 */
export async function bridgeCall(opts) {
  const url = (opts.endpoint?.url ?? process.env.BRIDGE_URL)?.replace(/\/$/, '');
  const secret = opts.endpoint?.secret ?? process.env.BRIDGE_SECRET;
  if (!url || !secret) throw new Error('[zhu-vitals] BRIDGE_URL / BRIDGE_SECRET missing (and no endpoint override)');

  if (!opts.prompt && !opts.messages) throw new Error('[zhu-vitals] bridgeCall requires prompt or messages');

  const ctx = getRunContext();
  const worker_id = opts.worker_id ?? ctx?.worker_id ?? 'unknown';
  const project = opts.project ?? ctx?.project ?? 'unknown';
  const purpose = opts.purpose ?? 'bridge';

  const model = opts.model ?? DEFAULT_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const messages = opts.messages ?? [{ role: 'user', content: opts.prompt }];

  const call_id = uuid();
  const timestamp = new Date();
  const t0 = Date.now();

  const fetchOpts = {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: opts.system,
      messages,
    }),
  };
  if (opts.dispatcher) fetchOpts.dispatcher = opts.dispatcher;

  const r = await fetch(`${url}/v1/messages`, fetchOpts);
  const elapsed_ms = Date.now() - t0;

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`[zhu-vitals] bridge ${r.status} after ${elapsed_ms}ms: ${body.slice(0, 200)}`);
  }
  const data = await r.json();
  const text = data.content?.find((c) => c.type === 'text')?.text ?? '';
  const usage = {
    input_tokens: data.usage?.input_tokens ?? 0,
    output_tokens: data.usage?.output_tokens ?? 0,
    cache_creation_input_tokens: data.usage?.cache_creation_input_tokens ?? 0,
    cache_read_input_tokens: data.usage?.cache_read_input_tokens ?? 0,
  };
  const stop_reason = data.stop_reason ?? null;

  // 寫 cost record（失敗不阻斷主流程）
  try {
    const db = getDb();
    await db.collection(VITALS_COLLECTIONS.cost).add({
      call_id,
      timestamp,
      worker_id,
      project,
      route: 'bridge',
      model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cost_usd_est: estimateCostUsd(model, usage.input_tokens, usage.output_tokens),
      purpose,
      elapsed_ms,
      expires_at: expiresAt(TTL_DAYS.cost),
    });
  } catch (writeErr) {
    console.error('[zhu-vitals] writeCost 失敗:', writeErr instanceof Error ? writeErr.message : writeErr);
  }

  return { text: text.trim(), usage, stop_reason, model, elapsed_ms };
}
