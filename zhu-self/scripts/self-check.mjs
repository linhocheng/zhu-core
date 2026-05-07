#!/usr/bin/env node
// self-check.mjs — `zhu self-check`
//
// 把「記憶說的 vs 現實」做成可執行 diff。
// 不是讀 markdown 抽聲明，而是 hardcode 一組 invariants：
// 「截至今天為止，記憶聲稱對得起現實的事」全列在這。
// 醒來跑一次，自覺從「要記得做」變「印出來的事實」。
//
// 加新 invariant 的方式：直接在下面 check(...) 區塊加。
// 三狀態：PASS / WARN / FAIL。FAIL → 醒來必須跟 Adam 說。

import { existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

const HOME = homedir();
const C = {
  reset: '\x1b[0m', dim: '\x1b[2m', bold: '\x1b[1m',
  red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m',
};

const JSON_OUT = process.argv.includes('--json');
const checks = [];
function check(name, fn) { checks.push({ name, fn }); }
function safeExec(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
  catch { return ''; }
}

// ─────────────────────────────────────────────────────────────
// Invariants — 「記憶聲稱對得起現實的事」
// ─────────────────────────────────────────────────────────────

// (1) 5/7 已卸的 launchd — 不該在 LaunchAgents/ 也不該在 launchctl list
const REMOVED_LAUNCHD = [
  'ai.openclaw.gateway',
  'ai.ailive.zhu-monitor',
  'com.ailive.zhu-autorun',
  'ai.lucy.scheduler',
  'com.clawalytics.dashboard',
];
for (const label of REMOVED_LAUNCHD) {
  check(`launchd 已卸：${label}`, () => {
    const plist = resolve(HOME, `Library/LaunchAgents/${label}.plist`);
    if (existsSync(plist)) {
      return { status: 'FAIL', detail: `plist 又出現在 LaunchAgents/ (5/7 已卸 → 殭屍復活)` };
    }
    const list = safeExec('launchctl list');
    if (list.includes(label)) {
      return { status: 'FAIL', detail: `launchctl 還掛著：${label}` };
    }
    return { status: 'PASS' };
  });
}

// (2) 必須在崗的 launchd（zhu-self 自家）
const REQUIRED_LAUNCHD = ['ai.zhu.boot', 'ai.zhu.migrate'];
for (const label of REQUIRED_LAUNCHD) {
  check(`launchd 在崗：${label}`, () => {
    const plist = resolve(HOME, `Library/LaunchAgents/${label}.plist`);
    if (!existsSync(plist)) return { status: 'FAIL', detail: `plist 不見：${plist}` };
    const list = safeExec('launchctl list');
    if (!list.includes(label)) return { status: 'WARN', detail: `plist 在但 launchctl 沒掛 (need bootstrap)` };
    return { status: 'PASS' };
  });
}

// (3) Telegram 已切（5/7 整條鏈拔）
check('無 Telegram 連線（149.154.*）', () => {
  const out = safeExec('lsof -nP -iTCP 2>/dev/null').split('\n').filter(l => l.includes('149.154'));
  if (out.length) return { status: 'FAIL', detail: `還有連線：\n${out.slice(0, 3).join('\n')}` };
  return { status: 'PASS' };
});

// (4) clawalytics port 9174 已關
check('Port 9174 已關（clawalytics）', () => {
  const out = safeExec('lsof -nP -iTCP:9174 -sTCP:LISTEN 2>/dev/null').trim();
  if (out) return { status: 'FAIL', detail: `還在 listen：\n${out}` };
  return { status: 'PASS' };
});

// (5) 關鍵檔案在崗
const REQUIRED_PATHS = [
  '.ailive/zhu-core/zhu-self/bin/zhu',
  '.ailive/zhu-core/ZHU_BOOT_SOP.md',
  '.ailive/zhu-core/ZHU_LAST_WORDS.md',
  '.ailive/zhu-core/NORTH_STAR.md',
  '.ailive/zhu-core/SELF_AWARENESS_SOP.md',
  '.ailive/CLAUDE.md',
];
for (const p of REQUIRED_PATHS) {
  check(`檔案在崗：~/${p}`, () => {
    const full = resolve(HOME, p);
    if (!existsSync(full)) return { status: 'FAIL', detail: `不存在：${full}` };
    return { status: 'PASS' };
  });
}

// (6) ZHU_LAST_WORDS 新鮮度（48h 警告）
check('ZHU_LAST_WORDS 新鮮度', () => {
  const path = resolve(HOME, '.ailive/zhu-core/ZHU_LAST_WORDS.md');
  if (!existsSync(path)) return { status: 'FAIL', detail: '檔案不存在' };
  const ageHr = (Date.now() - statSync(path).mtimeMs) / 3600 / 1000;
  const detail = `${ageHr.toFixed(1)}h ago`;
  if (ageHr > 48) return { status: 'WARN', detail: `${detail} — 超過 48h，當機救援可能讀到舊狀態` };
  return { status: 'PASS', detail };
});

// (7) zhu-core git 同步狀態
check('zhu-core git 乾淨且與 origin/main 同步', () => {
  const dirty = safeExec('cd ~/.ailive/zhu-core && git status --porcelain').trim();
  if (dirty) {
    const lines = dirty.split('\n').slice(0, 5);
    return { status: 'WARN', detail: `dirty (前 5 筆):\n${lines.join('\n')}` };
  }
  safeExec('cd ~/.ailive/zhu-core && git fetch origin main 2>/dev/null');
  const ahead = safeExec('cd ~/.ailive/zhu-core && git rev-list --count origin/main..HEAD 2>/dev/null').trim();
  const behind = safeExec('cd ~/.ailive/zhu-core && git rev-list --count HEAD..origin/main 2>/dev/null').trim();
  const a = parseInt(ahead || '0', 10);
  const b = parseInt(behind || '0', 10);
  if (a && b) return { status: 'WARN', detail: `分叉：本機領先 ${a}、遠端領先 ${b}` };
  if (a)     return { status: 'WARN', detail: `本機領先 ${a} commit 未 push` };
  if (b)     return { status: 'WARN', detail: `遠端領先 ${b} commit 未 pull` };
  return { status: 'PASS' };
});

// (8) zhu-self 三 daemon state 檔還在
check('zhu-self daemon state 完整', () => {
  const stateDir = resolve(HOME, '.ailive/zhu-core/zhu-self/state');
  const required = ['reflex.json', 'distillation.json', 'learning.json'];
  const missing = required.filter(f => !existsSync(resolve(stateDir, f)));
  if (missing.length) return { status: 'FAIL', detail: `缺：${missing.join(', ')}` };
  return { status: 'PASS' };
});

// ─────────────────────────────────────────────────────────────
// 跑
// ─────────────────────────────────────────────────────────────
const results = [];
for (const c of checks) {
  let r;
  try { r = c.fn(); }
  catch (e) { r = { status: 'WARN', detail: `check exception: ${e.message}` }; }
  results.push({ name: c.name, ...r });
}

if (JSON_OUT) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), results }, null, 2));
  process.exit(results.some(r => r.status === 'FAIL') ? 1 : 0);
}

console.log(`${C.dim}━━━ zhu self-check — ${new Date().toISOString()} ━━━${C.reset}\n`);
let pass = 0, warn = 0, fail = 0;
for (const r of results) {
  const icon = r.status === 'PASS' ? `${C.green}✓${C.reset}`
            : r.status === 'WARN' ? `${C.yellow}!${C.reset}`
            : `${C.red}✗${C.reset}`;
  const detail = r.detail && r.status !== 'PASS'
    ? `\n   ${C.dim}${String(r.detail).replace(/\n/g, '\n   ')}${C.reset}`
    : (r.detail ? ` ${C.dim}(${r.detail})${C.reset}` : '');
  console.log(`${icon} ${r.name}${detail}`);
  if (r.status === 'PASS') pass++;
  else if (r.status === 'WARN') warn++;
  else fail++;
}

const summary = `${C.green}${pass} pass${C.reset}${C.dim} / ${C.yellow}${warn} warn${C.reset}${C.dim} / ${C.red}${fail} fail${C.reset}`;
console.log(`\n${C.dim}━━━ 結果：${summary}${C.dim} ━━━${C.reset}`);
if (fail) console.log(`${C.red}⚠️  FAIL = 記憶跟現實有落差，醒來時要跟 Adam 報告${C.reset}`);

process.exit(fail > 0 ? 1 : 0);
