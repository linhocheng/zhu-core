#!/usr/bin/env node
// reflex/pretool-hook.mjs
// Claude Code PreToolUse hook（task #12 / #20）
// 讀 stdin（JSON），跑 detector。
// log-only：永遠 exit 0、印提醒。
// active：rule.state='active' 且不在 fp 列表 → exit 2 擋下。
//
// Claude Code hook 約定：
// - stdin 收到 { tool_name, tool_input, ... }
// - 印到 stderr 的訊息會被注入 context
// - exit code 0 = 通過；2 = 擋下並把 stderr 內容餵給 LLM

import { readFileSync, appendFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { detect } from './rules.mjs';

const HOME = homedir();
const LOG_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/logs');
const HIT_LOG = resolve(LOG_DIR, 'reflex-hits.jsonl');
const STATE_FILE = resolve(HOME, '.ailive/zhu-core/zhu-self/state/reflex.json');
const FP_FILE = resolve(HOME, '.ailive/zhu-core/zhu-self/state/false_positives.json');

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

const ENABLED = isEnabled();
if (!ENABLED) process.exit(0);

const GLOBAL_MODE = getGlobalMode(); // 'log_only' | 'active'

const payload = readStdin();
const tool_name = payload.tool_name || payload.toolName || '';
const tool_args = payload.tool_input || payload.toolInput || {};
const preceding_text = payload.preceding_text || '';

const hits = detect({ tool_name, tool_args, preceding_text });

if (hits.length === 0) process.exit(0);

// 寫 jsonl log（log-only 跟 active 都記）
const entry = {
  ts: new Date().toISOString(),
  tool_name,
  global_mode: GLOBAL_MODE,
  hits: hits.map((h) => ({
    rule_name: h.rule_name,
    severity: h.severity,
    state: h.state,
    detector_kind: h.detector_kind,
  })),
};
appendFileSync(HIT_LOG, JSON.stringify(entry) + '\n');

// 決定要不要擋
const fp = loadFp();
const blockers = (GLOBAL_MODE === 'active')
  ? hits.filter(h => h.state === 'active' && !fp.always.includes(h.rule_name) && !fp.once.includes(h.rule_name))
  : [];

// 消費 once fp（這次跳過後就清掉）
if (GLOBAL_MODE === 'active') {
  const consumed = hits.filter(h => h.state === 'active' && fp.once.includes(h.rule_name)).map(h => h.rule_name);
  if (consumed.length) {
    fp.once = fp.once.filter(r => !consumed.includes(r));
    writeFileSync(FP_FILE, JSON.stringify(fp, null, 2) + '\n');
  }
}

// 印訊息到 stderr
const lines = [];
if (blockers.length > 0) {
  lines.push('🛑 [reflex active] 命中規則，擋下動作：');
  for (const h of blockers) {
    lines.push(`  • ${h.rule_name}（${h.severity}）— ${h.why}`);
    lines.push(`    觸發信號：${h.trigger_signal}`);
  }
  lines.push('');
  lines.push('如果是誤觸，Adam 跑：');
  lines.push(`  zhu fp ${blockers[0].rule_name}            # 下一次跳過`);
  lines.push(`  zhu reflex log-only                         # 全域暫降 log-only`);
  console.error(lines.join('\n'));
  process.exit(2);
} else {
  lines.push('🟡 [reflex log-only] 命中規則：');
  for (const h of hits) {
    lines.push(`  • ${h.rule_name}（${h.severity}）— ${h.why}`);
    lines.push(`    觸發信號：${h.trigger_signal}`);
  }
  if (GLOBAL_MODE === 'log_only') {
    const activeRules = hits.filter(h => h.state === 'active').map(h => h.rule_name);
    if (activeRules.length) lines.push(`（全域 mode=log_only，${activeRules.join(',')} 本應擋下被暫降 log）`);
  }
  console.error(lines.join('\n'));
  process.exit(0);
}

// ── helpers ──
function readStdin() {
  try {
    const buf = readFileSync(0, 'utf8');
    return buf ? JSON.parse(buf) : {};
  } catch {
    return {};
  }
}

function isEnabled() {
  try {
    if (!existsSync(STATE_FILE)) return false;
    const j = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    return j.enabled === true;
  } catch {
    return false;
  }
}

function getGlobalMode() {
  try {
    const j = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    return j.mode === 'active' ? 'active' : 'log_only';
  } catch {
    return 'log_only';
  }
}

function loadFp() {
  try {
    if (!existsSync(FP_FILE)) return { once: [], always: [] };
    return JSON.parse(readFileSync(FP_FILE, 'utf8'));
  } catch {
    return { once: [], always: [] };
  }
}
