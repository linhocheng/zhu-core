#!/usr/bin/env node
// watch.mjs
// 即時觀察管道 — `zhu watch`
//
// 長駐 tail 模式：
//   - reflex-hits.jsonl 新行即時印出（含 severity 顏色）
//   - daemon enabled/mode 變動偵測
//   - health overall 變動偵測
//
// Usage:
//   zhu watch                  # tail reflex + daemon + health（預設）
//   zhu watch --reflex-only    # 只 tail reflex
//   zhu watch --interval=10    # daemon/health poll 間隔（秒，預設 5）
//   zhu watch --replay=20      # 啟動時先回放最後 N 筆 reflex

import { readFileSync, statSync, existsSync, openSync, readSync, closeSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

const HOME = homedir();
const ROOT = resolve(HOME, '.ailive/zhu-core/zhu-self');
const STATE_DIR = resolve(ROOT, 'state');
const LOG_DIR = resolve(ROOT, 'logs');
const REFLEX_LOG = resolve(LOG_DIR, 'reflex-hits.jsonl');

const args = process.argv.slice(2);
const REFLEX_ONLY = args.includes('--reflex-only');
const intervalArg = args.find((a) => a.startsWith('--interval='));
const STATE_INTERVAL = intervalArg ? parseInt(intervalArg.split('=')[1], 10) * 1000 : 5000;
const replayArg = args.find((a) => a.startsWith('--replay='));
const REPLAY_N = replayArg ? parseInt(replayArg.split('=')[1], 10) : 0;

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

function nowHMS() {
  return new Date().toISOString().slice(11, 19);
}

function severityColor(sev) {
  if (sev === 'alert' || sev === 'block') return C.red;
  if (sev === 'warn') return C.yellow;
  return C.cyan;
}

function printReflex(j) {
  const time = j.ts ? new Date(j.ts).toISOString().slice(11, 19) : '??:??:??';
  const tool = (j.tool_name || '?').padEnd(8);
  for (const h of j.hits || []) {
    const col = severityColor(h.severity);
    const sev = (h.severity || '?').padEnd(5);
    console.log(
      `${C.dim}${time}${C.reset}  🛡  ${col}${sev}${C.reset}  ${C.bold}${h.rule_name}${C.reset}  ${C.dim}(${tool}/${h.state})${C.reset}`,
    );
  }
}

console.log(`${C.dim}━━━ zhu watch — ${new Date().toISOString()} ━━━${C.reset}`);
console.log(
  `${C.dim}tailing reflex-hits.jsonl${
    REFLEX_ONLY ? '' : ` + daemon/health poll every ${STATE_INTERVAL / 1000}s`
  }${C.reset}`,
);
console.log(`${C.dim}Ctrl+C to exit${C.reset}`);
console.log('');

// ── reflex hits tail ──
let reflexPos = existsSync(REFLEX_LOG) ? statSync(REFLEX_LOG).size : 0;

if (REPLAY_N > 0 && existsSync(REFLEX_LOG)) {
  const all = readFileSync(REFLEX_LOG, 'utf8').split('\n').filter(Boolean);
  const tail = all.slice(-REPLAY_N);
  console.log(`${C.dim}── replay 最後 ${tail.length} 筆 ──${C.reset}`);
  for (const line of tail) {
    try {
      printReflex(JSON.parse(line));
    } catch {}
  }
  console.log(`${C.dim}── live ──${C.reset}`);
}

function tailReflex() {
  if (!existsSync(REFLEX_LOG)) return;
  const sz = statSync(REFLEX_LOG).size;
  if (sz === reflexPos) return;
  if (sz < reflexPos) {
    // truncated / rotated
    reflexPos = 0;
  }
  const len = sz - reflexPos;
  if (len <= 0) return;
  const fd = openSync(REFLEX_LOG, 'r');
  const buf = Buffer.alloc(len);
  readSync(fd, buf, 0, len, reflexPos);
  closeSync(fd);
  reflexPos = sz;
  const lines = buf.toString('utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      printReflex(JSON.parse(line));
    } catch {}
  }
}

// ── daemon state poll ──
const KNOWN = ['reflex', 'distillation', 'learning'];
const lastDaemon = {};

function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function pollDaemons() {
  for (const name of KNOWN) {
    const cur = readJsonSafe(resolve(STATE_DIR, `${name}.json`));
    if (!cur) continue;
    const key = `enabled=${cur.enabled} mode=${cur.mode}`;
    if (lastDaemon[name] === undefined) {
      lastDaemon[name] = key;
      continue;
    }
    if (lastDaemon[name] !== key) {
      console.log(
        `${C.dim}${nowHMS()}${C.reset}  ⚙️  ${C.magenta}daemon${C.reset}  ${C.bold}${name}${C.reset}  ${lastDaemon[name]} → ${key}`,
      );
      lastDaemon[name] = key;
    }
  }
}

// ── health poll ──
let lastHealthKey = null;
function pollHealth() {
  const j = readJsonSafe(resolve(STATE_DIR, 'health.json'));
  if (!j) return;
  const key = `${j.overall}|${j.ts}`;
  if (lastHealthKey === null) {
    lastHealthKey = key;
    return;
  }
  if (lastHealthKey !== key) {
    const col = j.overall === 'ok' ? C.green : C.red;
    console.log(
      `${C.dim}${nowHMS()}${C.reset}  ❤️   ${col}health=${j.overall}${C.reset}  ${C.dim}@ ${j.ts}${C.reset}`,
    );
    lastHealthKey = key;
  }
}

// ── loop ──
const tReflex = setInterval(tailReflex, 1000);
let tDaemon, tHealth;
if (!REFLEX_ONLY) {
  pollDaemons(); // baseline
  pollHealth();
  tDaemon = setInterval(pollDaemons, STATE_INTERVAL);
  tHealth = setInterval(pollHealth, STATE_INTERVAL);
}

process.on('SIGINT', () => {
  clearInterval(tReflex);
  if (tDaemon) clearInterval(tDaemon);
  if (tHealth) clearInterval(tHealth);
  console.log(`\n${C.dim}━━━ zhu watch — exit ━━━${C.reset}`);
  process.exit(0);
});
