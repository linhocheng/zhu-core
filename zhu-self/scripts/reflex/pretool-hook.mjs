#!/usr/bin/env node
// reflex/pretool-hook.mjs
// Claude Code PreToolUse hook（task #12）
// 讀 stdin（JSON），跑 detector，命中就寫 log + 返回提醒（不擋）。
// log-only 階段：不擋 tool call。
//
// Claude Code hook 約定：
// - stdin 收到 { tool_name, tool_input, ... }
// - 印到 stdout 的訊息會被注入 context
// - exit code 0 = 通過；非 0 = 擋下（log-only 階段一律 0）

import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { detect } from './rules.mjs';

const HOME = homedir();
const LOG_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/logs');
const HIT_LOG = resolve(LOG_DIR, 'reflex-hits.jsonl');
const STATE_FILE = resolve(HOME, '.ailive/zhu-core/zhu-self/state/reflex.json');

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

// ── 讀 stdin ──
function readStdin() {
  try {
    const buf = readFileSync(0, 'utf8');
    return buf ? JSON.parse(buf) : {};
  } catch {
    return {};
  }
}

// ── 主 ──
const ENABLED = isEnabled();
if (!ENABLED) process.exit(0);

const payload = readStdin();
const tool_name = payload.tool_name || payload.toolName || '';
const tool_args = payload.tool_input || payload.toolInput || {};
const preceding_text = payload.preceding_text || ''; // 看 hook 平台是否提供

const hits = detect({ tool_name, tool_args, preceding_text });

if (hits.length === 0) process.exit(0);

// 寫 jsonl log
const entry = {
  ts: new Date().toISOString(),
  tool_name,
  hits: hits.map((h) => ({
    rule_name: h.rule_name,
    severity: h.severity,
    state: h.state,
    detector_kind: h.detector_kind,
  })),
};
appendFileSync(HIT_LOG, JSON.stringify(entry) + '\n');

// log-only 階段：印提醒到 stdout（如果 hook 平台會顯示）
const lines = [];
lines.push('🛑 [reflex] 命中規則：');
for (const h of hits) {
  lines.push(`  • ${h.rule_name}（${h.severity}）— ${h.why}`);
  lines.push(`    觸發信號：${h.trigger_signal}`);
}
lines.push('（log-only 階段，不擋。Adam 標記誤觸：zhu fp <rule_name>）');
console.error(lines.join('\n'));

process.exit(0);

// ── helpers ──
function isEnabled() {
  try {
    if (!existsSync(STATE_FILE)) return false;
    const j = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    return j.enabled === true;
  } catch {
    return false;
  }
}
