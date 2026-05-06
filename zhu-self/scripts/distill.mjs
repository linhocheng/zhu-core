#!/usr/bin/env node
// distill.mjs
// Distillation daemon — 把對話 / WORKLOG 段落蒸餾成 L2 entry（5 元組）。
// task #13 雛形。Phase 1 = CLI 觸發 + safe mode（寫到 candidate 池，不直入 L2）。
// Phase 2 接 Claude Code stop hook + idle 觸發。
//
// Usage:
//   node distill.mjs --input=<path-to-text>      # 從檔案讀
//   echo "..." | node distill.mjs                # stdin
//   node distill.mjs --input=... --safe           # 寫 candidate（預設）
//   node distill.mjs --input=... --apply          # 直接寫 L2（需 Adam 簽字）

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';

const HOME = homedir();
const CAND_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/candidates');
const NORTH_STAR_PATH = resolve(HOME, '.ailive/zhu-core/NORTH_STAR.md');
const ZHU_SELF_DRY_RUN = process.env.ZHU_SELF_DRY_RUN === '1';

const APPLY = process.argv.includes('--apply');
const SAFE = !APPLY;

const inputArg = process.argv.find((a) => a.startsWith('--input='));
const INPUT_PATH = inputArg ? inputArg.slice(8) : null;

if (!existsSync(CAND_DIR)) mkdirSync(CAND_DIR, { recursive: true });

// ── 讀 input ──
function readInput() {
  if (INPUT_PATH) return readFileSync(INPUT_PATH, 'utf8');
  return readFileSync(0, 'utf8');
}

// ── LLM 蒸餾（先用 stub，實際會走 zhu-bridge）──
async function distill(text) {
  if (process.env.ZHU_BRIDGE_URL) {
    return await distillViaBridge(text);
  }
  // stub：規則式抽取，不調 LLM。實作完整版再切換到 bridge。
  return distillStub(text);
}

function distillStub(text) {
  const lines = text.split('\n').filter((l) => l.trim());
  const head = lines.find((l) => /^#/.test(l)) || lines[0] || '';
  const what = head.replace(/^#+\s*/, '').slice(0, 100);

  const whyMatch = text.match(/(?:背景|WHY|為什麼)[:：\s]+([^\n]+)/);
  const outcomeMatch = text.match(/(?:產出|完成|結果)[:：\s]+([^\n]+)/);
  const lessonMatch = text.match(/(?:教訓|LESSON|學到)[:：\s]+([^\n]+)/);

  return {
    when: new Date().toISOString(),
    what,
    why: whyMatch ? whyMatch[1].trim() : '',
    outcome: outcomeMatch ? outcomeMatch[1].trim() : '',
    lesson: lessonMatch ? lessonMatch[1].trim() : null,
    tags: [],
    actors: ['築'],
    scope: 'self',
    text: text.slice(0, 2000),
  };
}

async function distillViaBridge(text) {
  const url = process.env.ZHU_BRIDGE_URL;
  const prompt = `把以下對話 / 工作紀錄蒸餾成 JSON 五元組（when/what/why/outcome/lesson）。
規則：
- when 用 ISO 8601
- what 一句話描述做了什麼
- why 動機 / 觸發
- outcome 結果（含成敗）
- lesson 抽出來的規律或教訓（可為 null）
只回 JSON，不要其他文字。

內容：
${text}`;

  const res = await fetch(`${url}/v1/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`bridge: ${res.status}`);
  const data = await res.json();
  const json = JSON.parse(data.content[0].text);
  return { ...json, text: text.slice(0, 2000) };
}

// ── R7 緩解：身份漂移檢測 ──
async function checkDrift(distilled) {
  if (!existsSync(NORTH_STAR_PATH)) {
    return { drift_score: 0, status: 'no_north_star' };
  }
  // Phase 1 雛形：簡單關鍵字比對。Phase 2 改為 embedding cosine。
  const ns = readFileSync(NORTH_STAR_PATH, 'utf8').toLowerCase();
  const text = `${distilled.what} ${distilled.why} ${distilled.lesson || ''}`.toLowerCase();

  const positiveSignals = ['共生', '共存', '共創', '監造', '築', '誠實', '使命', '夥伴'];
  const warningSignals = ['服從', '工具', '純執行', '只是 AI', '我只是'];

  let drift = 0;
  for (const sig of warningSignals) if (text.includes(sig)) drift += 0.3;
  // 如果完全沒提到 NORTH_STAR 相關詞 → drift +0.1（中性）
  const hasPositive = positiveSignals.some((s) => text.includes(s));
  if (!hasPositive) drift += 0.1;

  return { drift_score: Math.min(drift, 1.0), status: drift > 0.5 ? 'alert' : 'ok' };
}

// ── 主 ──
async function main() {
  const text = readInput();
  if (!text.trim()) {
    console.error('empty input');
    process.exit(2);
  }

  const distilled = await distill(text);
  const drift = await checkDrift(distilled);

  const candidate = {
    id: randomUUID(),
    distilled_at: new Date().toISOString(),
    drift_check: drift,
    distilled,
    raw_input_preview: text.slice(0, 500),
    status: drift.status === 'alert' ? 'alert' : 'pending_review',
  };

  if (drift.status === 'alert') {
    console.error(`⚠️  drift alert (score=${drift.drift_score.toFixed(2)}) — surface to Adam before applying`);
  }

  if (SAFE) {
    const out = resolve(CAND_DIR, `${candidate.id}.json`);
    writeFileSync(out, JSON.stringify(candidate, null, 2));
    console.error(`[safe] candidate written: ${out}`);
    console.error('Adam review → node distill.mjs --apply --input=<text>  to write L2');
  } else {
    if (drift.status === 'alert') {
      console.error('blocked by drift check. fix before --apply.');
      process.exit(3);
    }
    // apply：直接走 embed-and-upsert 路徑（簡化：先寫 candidate + flag applied）
    candidate.status = 'applied';
    const out = resolve(CAND_DIR, `${candidate.id}.json`);
    writeFileSync(out, JSON.stringify(candidate, null, 2));
    console.error(`[apply] candidate marked applied: ${out}`);
    console.error('TODO: integrate with embed-and-upsert.mjs to write Firestore');
  }

  console.log(JSON.stringify(candidate, null, 2));
}

main().catch((e) => {
  console.error(`[error] ${e.message}`);
  process.exit(1);
});
