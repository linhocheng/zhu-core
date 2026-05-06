#!/usr/bin/env node
// status.mjs
// Adam dashboard CLI 雛形 — `zhu status`
// task #16
//
// 印出：
//   - 五個 daemon 的 enabled / mode
//   - boot context 新鮮度
//   - reflex 命中分佈（過去 7 天）
//   - distillation 候選池堆積
//   - learning 候選池堆積
//   - health 上次跑況
//   - WBS Phase 1 進度（從 WBS.md 文字 grep）
//
// Usage:
//   node status.mjs               # 人類可讀
//   node status.mjs --json        # JSON

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';

const HOME = homedir();
const ROOT = resolve(HOME, '.ailive/zhu-core/zhu-self');
const STATE_DIR = resolve(ROOT, 'state');
const LOG_DIR = resolve(ROOT, 'logs');

const JSON_OUT = process.argv.includes('--json');

function readJsonSafe(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function fmtAgo(ts) {
  if (!ts) return 'never';
  const ms = Date.now() - new Date(ts).getTime();
  const h = ms / 1000 / 3600;
  if (h < 1) return `${Math.round((ms / 1000 / 60))} min ago`;
  if (h < 24) return `${h.toFixed(1)}h ago`;
  return `${(h / 24).toFixed(1)}d ago`;
}

// ── daemon states ──
function getDaemons() {
  const known = ['reflex', 'distillation', 'learning'];
  const out = {};
  for (const n of known) {
    const path = resolve(STATE_DIR, `${n}.json`);
    out[n] = readJsonSafe(path, { enabled: null, mode: 'missing' });
  }
  return out;
}

// ── launchd jobs ──
function getLaunchd() {
  try {
    const out = execSync('launchctl list', { encoding: 'utf8' });
    const lines = out.split('\n').filter((l) => l.includes('ai.zhu.'));
    return lines.map((l) => {
      const parts = l.split(/\s+/);
      return { pid: parts[0], status: parts[1], label: parts[2] };
    });
  } catch {
    return [];
  }
}

// ── reflex hit stats ──
function getReflexStats() {
  const path = resolve(LOG_DIR, 'reflex-hits.jsonl');
  if (!existsSync(path)) return { total: 0, by_rule: {}, last_7d: 0, recent: [] };
  const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const by_rule = {};
  let last_7d = 0;
  const parsed = [];
  for (const line of lines) {
    try {
      const j = JSON.parse(line);
      const ts = new Date(j.ts).getTime();
      if (ts > sevenDaysAgo) last_7d++;
      for (const h of j.hits || []) {
        by_rule[h.rule_name] = (by_rule[h.rule_name] || 0) + 1;
      }
      parsed.push(j);
    } catch {}
  }
  const recent = parsed.slice(-5).reverse().map((j) => ({
    ts: j.ts,
    tool_name: j.tool_name,
    rules: (j.hits || []).map((h) => h.rule_name).join(','),
  }));
  return { total: lines.length, by_rule, last_7d, recent };
}

// ── candidate pool counts ──
function countDir(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith('.json')).length;
}

// ── boot context freshness ──
function getBootCtx() {
  const path = resolve(STATE_DIR, 'boot-context.md');
  if (!existsSync(path)) return { exists: false };
  const st = statSync(path);
  return { exists: true, mtime: new Date(st.mtimeMs).toISOString(), size: st.size };
}

// ── health 上次 ──
function getHealth() {
  return readJsonSafe(resolve(STATE_DIR, 'health.json'), { overall: 'never_run' });
}

// ── WBS 進度（grep checkbox） ──
function getWbsProgress() {
  const path = resolve(ROOT, 'WBS.md');
  if (!existsSync(path)) return { total: 0, done: 0 };
  const txt = readFileSync(path, 'utf8');
  const total = (txt.match(/^\| \d+ \|/gm) || []).length;
  const done = (txt.match(/✅|completed/gi) || []).length;
  const inProgress = (txt.match(/🔄|in_progress/gi) || []).length;
  return { total, done, inProgress };
}

// ── 主 ──
const summary = {
  ts: new Date().toISOString(),
  daemons: getDaemons(),
  launchd: getLaunchd(),
  reflex: getReflexStats(),
  candidates: {
    distillation: countDir(resolve(ROOT, 'candidates')),
    learning: countDir(resolve(ROOT, 'learn/candidates')),
  },
  boot_context: getBootCtx(),
  health: getHealth(),
  wbs: getWbsProgress(),
};

if (JSON_OUT) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

// 人類可讀版
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  築城 status — ' + summary.ts);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

console.log('🛠  Daemons');
for (const [name, s] of Object.entries(summary.daemons)) {
  const flag = s.enabled === true ? '🟢' : s.enabled === false ? '⚪' : '❓';
  console.log(`   ${flag}  ${name.padEnd(14)} mode=${s.mode}`);
}
console.log('');

if (summary.launchd.length) {
  console.log('⏱  launchd jobs');
  for (const j of summary.launchd) {
    const flag = j.status === '0' ? '🟢' : '🟡';
    console.log(`   ${flag}  ${j.label.padEnd(20)} pid=${j.pid} last_exit=${j.status}`);
  }
  console.log('');
}

console.log('🛡  Reflex hits');
console.log(`   total=${summary.reflex.total}  last_7d=${summary.reflex.last_7d}`);
for (const [rule, n] of Object.entries(summary.reflex.by_rule).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${String(n).padStart(4)}  ${rule}`);
}
if (summary.reflex.recent.length) {
  console.log('   recent:');
  for (const r of summary.reflex.recent) {
    console.log(`     ${fmtAgo(r.ts).padEnd(10)}  ${r.tool_name.padEnd(8)}  ${r.rules}`);
  }
}
console.log('');

console.log('📥 Candidate pools');
console.log(`   distillation: ${summary.candidates.distillation}`);
console.log(`   learning:     ${summary.candidates.learning}`);
console.log('');

console.log('🌅 Boot context');
if (summary.boot_context.exists) {
  console.log(`   ${summary.boot_context.size} bytes  ${fmtAgo(summary.boot_context.mtime)}`);
} else {
  console.log(`   (never generated)`);
}
console.log('');

console.log('❤️  Health');
console.log(`   overall=${summary.health.overall}  ${fmtAgo(summary.health.ts)}`);
console.log('');

console.log('📋 WBS Phase 1');
console.log(`   total=${summary.wbs.total}  completed=${summary.wbs.done}  in_progress=${summary.wbs.inProgress}`);
console.log('');
