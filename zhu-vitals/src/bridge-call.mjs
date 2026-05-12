/**
 * bridgeCall — 機制 C：LLM call site 成本記錄
 *
 * 走 zhu-bridge HTTP gateway（Max OAuth 吃到飽），同時把成本估算寫進 zhu_vitals_cost。
 * 取代各 repo 自行實作的 callBridge / getAnthropicClient。
 *
 * 用法：
 *   import { bridgeCall } from 'zhu-vitals';
 *   const text = await bridgeCall({
 *     prompt: '...',
 *     worker_id: 'molowe-cron',
 *     project: 'molowe-platform',
 *     purpose: 'draft-summary',
 *     model: 'claude-sonnet-4-5',
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
 * @param {string} opts.prompt
 * @param {string} [opts.worker_id]   - manifest.worker_id（缺則讀 ALS context）
 * @param {string} [opts.project]     - 哪個 repo / app（缺則讀 ALS context）
 * @param {string} [opts.purpose]     - 這個 call 是做什麼用（draft / summary / classify ...）
 * @param {string} [opts.model]
 * @param {number} [opts.maxTokens]
 * @param {string} [opts.system]
 */
export async function bridgeCall(opts) {
  const url = process.env.BRIDGE_URL?.replace(/\/$/, '');
  const secret = process.env.BRIDGE_SECRET;
  if (!url || !secret) throw new Error('[zhu-vitals] BRIDGE_URL / BRIDGE_SECRET missing');

  const ctx = getRunContext();
  const worker_id = opts.worker_id ?? ctx?.worker_id ?? 'unknown';
  const project = opts.project ?? ctx?.project ?? 'unknown';
  const purpose = opts.purpose ?? 'bridge';

  const model = opts.model ?? DEFAULT_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const call_id = uuid();
  const timestamp = new Date();

  const r = await fetch(`${url}/v1/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: opts.system,
      messages: [{ role: 'user', content: opts.prompt }],
    }),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`[zhu-vitals] bridge ${r.status}: ${body.slice(0, 200)}`);
  }
  const data = await r.json();
  const text = data.content?.find((c) => c.type === 'text')?.text ?? '';
  const inTokens = data.usage?.input_tokens ?? 0;
  const outTokens = data.usage?.output_tokens ?? 0;

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
      input_tokens: inTokens,
      output_tokens: outTokens,
      cost_usd_est: estimateCostUsd(model, inTokens, outTokens),
      purpose,
      expires_at: expiresAt(TTL_DAYS.cost),
    });
  } catch (writeErr) {
    console.error('[zhu-vitals] writeCost 失敗:', writeErr instanceof Error ? writeErr.message : writeErr);
  }

  return text.trim();
}
