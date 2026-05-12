#!/usr/bin/env node
/**
 * zhu vitals — BUILDING_PROTOCOL v0.2 統一讀取入口
 *
 * 用法：
 *   zhu vitals --map        # 結構圖（zhu_vitals_manifests）
 *   zhu vitals --pulse      # A × B：宣告 × 實際，誰活誰死
 *   zhu vitals --runs       # 最近 24h run，分組
 *   zhu vitals --cost       # 最近 7d 成本，分組
 *   zhu vitals --drift      # 4 個 vendor 點 sha256 對賬（vendor 跟 source）
 *
 * flags 可加：
 *   --hours=N  （runs 時間窗，預設 24）
 *   --days=N   （cost 時間窗，預設 7）
 *   --json     （JSON 輸出，自動化用）
 *   --strict   （--pulse 任一 worker dead → exit 1，給 cron / CI 用）
 *   --no-color （關 ANSI 顏色）
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getDb } from '../../zhu-vitals/src/firestore.mjs';
import { VITALS_COLLECTIONS } from '../../zhu-vitals/src/manifest.schema.mjs';

const args = process.argv.slice(2);
const flags = new Set();
const opts = {};
for (const a of args) {
  if (a.startsWith('--') && a.includes('=')) {
    const [k, v] = a.slice(2).split('=');
    opts[k] = v;
  } else if (a.startsWith('--')) {
    flags.add(a.slice(2));
  }
}

const wantJson = flags.has('json');

function fmtRelTime(date) {
  if (!date) return '(never)';
  const ms = Date.now() - date.getTime();
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86400_000) return `${Math.floor(ms / 3600_000)}h ago`;
  return `${Math.floor(ms / 86400_000)}d ago`;
}

function pad(s, w) {
  s = String(s ?? '');
  return s.length >= w ? s : s + ' '.repeat(w - s.length);
}

function tsToDate(ts) {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts instanceof Date) return ts;
  return new Date(ts);
}

const useColor = process.stdout.isTTY && !flags.has('no-color');
const C = {
  red: (s) => useColor ? `\x1b[31m${s}\x1b[0m` : s,
  yellow: (s) => useColor ? `\x1b[33m${s}\x1b[0m` : s,
  green: (s) => useColor ? `\x1b[32m${s}\x1b[0m` : s,
  dim: (s) => useColor ? `\x1b[2m${s}\x1b[0m` : s,
};

function colorizeState(state) {
  if (state.startsWith('✗')) return C.red(state);
  if (state.startsWith('⚠')) return C.yellow(state);
  if (state.startsWith('✓')) return C.green(state);
  return C.dim(state);
}

function computeState({ observed, declared, lagSec, expected }) {
  if (!observed && !declared) return '? unknown';
  if (!observed) return '⚠ declared, no run';
  if (!declared) return '⚠ run, no manifest';
  if (expected === 'on-demand') return '✓ on-demand';
  if (lagSec > expected * 3) return '✗ dead';
  if (lagSec > expected * 1.5) return '⚠ slow';
  return '✓ alive';
}

async function cmdMap() {
  const db = getDb();
  const [manifestSnap, runSnap] = await Promise.all([
    db.collection(VITALS_COLLECTIONS.manifests).get(),
    db.collection(VITALS_COLLECTIONS.runs)
      .where('started_at', '>=', new Date(Date.now() - 24 * 3600 * 1000))
      .get(),
  ]);
  const runLatest = new Map();
  runSnap.docs.forEach((d) => {
    const r = d.data();
    const startedAt = tsToDate(r.started_at);
    const cur = runLatest.get(r.worker_id);
    if (!cur || (startedAt && startedAt > cur)) runLatest.set(r.worker_id, startedAt);
  });
  const rows = manifestSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (wantJson) {
    const enriched = rows.map((r) => ({ ...r, run_last_seen: runLatest.get(r.id) ?? null }));
    console.log(JSON.stringify(enriched, null, 2));
    return;
  }
  console.log(`ZHU VITALS — 系統結構圖 (${rows.length} workers registered)\n`);
  if (rows.length === 0) {
    console.log('(尚無 manifest 註冊。T3.4 推到各 worker 後會自動填入)');
    return;
  }
  for (const r of rows) {
    const manifestSeen = tsToDate(r.last_seen);
    const runSeen = runLatest.get(r.id) ?? null;
    const lastSeenDate = (manifestSeen && runSeen)
      ? (manifestSeen > runSeen ? manifestSeen : runSeen)
      : (manifestSeen ?? runSeen);
    const lastSeen = fmtRelTime(lastSeenDate);
    const interval = r.expected_interval_seconds === 'on-demand'
      ? 'on-demand' : `${r.expected_interval_seconds}s`;
    const lagSec = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) / 1000 : Infinity;
    const state = computeState({
      observed: lastSeenDate, declared: true,
      lagSec, expected: r.expected_interval_seconds,
    });
    console.log(`${pad(r.worker_id, 30)} (${r.env})  ${colorizeState(state)}`);
    console.log(`  cadence: ${pad(interval, 10)} llm: ${r.llm_route ?? '-'}`);
    console.log(`  reads:   ${(r.reads_from || []).join(', ') || '-'}`);
    console.log(`  writes:  ${(r.writes_to || []).join(', ') || '-'}`);
    console.log(`  last_seen: ${lastSeen}`);
    if (r.owner_notes) console.log(`  note: ${r.owner_notes}`);
    console.log('');
  }
}

async function cmdPulse() {
  const db = getDb();
  const [manifests, recentRuns] = await Promise.all([
    db.collection(VITALS_COLLECTIONS.manifests).get(),
    db.collection(VITALS_COLLECTIONS.runs)
      .where('started_at', '>=', new Date(Date.now() - 24 * 3600 * 1000))
      .get(),
  ]);

  const declared = new Map();
  manifests.docs.forEach((d) => declared.set(d.id, d.data()));

  const observed = new Map();
  recentRuns.docs.forEach((d) => {
    const r = d.data();
    const cur = observed.get(r.worker_id);
    const startedAt = tsToDate(r.started_at);
    if (!cur || (startedAt && startedAt > cur.last)) {
      observed.set(r.worker_id, { last: startedAt, status: r.status });
    }
  });

  const allIds = new Set([...declared.keys(), ...observed.keys()]);
  const rows = [...allIds].map((id) => {
    const m = declared.get(id);
    const o = observed.get(id);
    const expected = m?.expected_interval_seconds;
    const lastSeen = o?.last ?? tsToDate(m?.last_seen);
    const lagSec = lastSeen ? (Date.now() - lastSeen.getTime()) / 1000 : Infinity;
    const state = computeState({ observed: o, declared: m, lagSec, expected });
    return { worker_id: id, last_seen: lastSeen, expected, state };
  });

  if (wantJson) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  console.log(`ZHU VITALS — 生命狀態（24h 觀察窗）\n`);
  console.log(`${pad('worker', 30)} ${pad('last_seen', 14)} ${pad('expected', 12)} status`);
  console.log('-'.repeat(70));
  rows.sort((a, b) => {
    const order = (s) => s.startsWith('✗') ? 0 : s.startsWith('⚠') ? 1 : 2;
    return order(a.state) - order(b.state) || a.worker_id.localeCompare(b.worker_id);
  });
  for (const r of rows) {
    const exp = r.expected === 'on-demand' ? 'on-demand'
      : r.expected ? `${r.expected}s` : '-';
    console.log(`${pad(r.worker_id, 30)} ${pad(fmtRelTime(r.last_seen), 14)} ${pad(exp, 12)} ${colorizeState(r.state)}`);
  }
  const dead = rows.filter((r) => r.state.startsWith('✗')).length;
  const slow = rows.filter((r) => r.state.startsWith('⚠')).length;
  console.log('');
  if (dead > 0) console.log(C.red(`${dead} dead`) + ` (last_seen > expected × 3)`);
  if (slow > 0) console.log(C.yellow(`${slow} slow/warn`) + ` (last_seen > expected × 1.5 或 declared but no run / run but no manifest)`);
  if (dead === 0 && slow === 0) console.log(C.green('全綠'));
  if (flags.has('strict') && dead > 0) process.exit(1);
}

async function cmdRuns() {
  const hours = Number(opts.hours ?? 24);
  const db = getDb();
  const cutoff = new Date(Date.now() - hours * 3600 * 1000);
  const snap = await db.collection(VITALS_COLLECTIONS.runs)
    .where('started_at', '>=', cutoff)
    .get();

  const grouped = new Map();
  snap.docs.forEach((d) => {
    const r = d.data();
    const cur = grouped.get(r.worker_id) ?? { success: 0, partial: 0, skipped: 0, error: 0, total: 0 };
    cur.total++;
    if (cur[r.status] !== undefined) cur[r.status]++;
    grouped.set(r.worker_id, cur);
  });

  if (wantJson) {
    const out = [...grouped.entries()].map(([k, v]) => ({ worker_id: k, ...v }));
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  console.log(`ZHU VITALS — 最近 ${hours}h runs (${snap.size} total)\n`);
  if (snap.size === 0) {
    console.log('(no runs)');
    return;
  }
  console.log(`${pad('worker', 30)} ${pad('success', 8)} ${pad('partial', 8)} ${pad('skipped', 8)} ${pad('error', 6)}`);
  console.log('-'.repeat(70));
  for (const [id, g] of grouped) {
    console.log(`${pad(id, 30)} ${pad(g.success, 8)} ${pad(g.partial, 8)} ${pad(g.skipped, 8)} ${pad(g.error, 6)}`);
  }
}

async function cmdCost() {
  const days = Number(opts.days ?? 7);
  const db = getDb();
  const cutoff = new Date(Date.now() - days * 86400 * 1000);
  const snap = await db.collection(VITALS_COLLECTIONS.cost)
    .where('timestamp', '>=', cutoff)
    .get();

  const grouped = new Map();
  let totalCost = 0;
  snap.docs.forEach((d) => {
    const r = d.data();
    const key = `${r.project}|${r.route}|${r.model}`;
    const cur = grouped.get(key) ?? {
      project: r.project, route: r.route, model: r.model,
      calls: 0, in_tok: 0, out_tok: 0, cost: 0,
    };
    cur.calls++;
    cur.in_tok += r.input_tokens ?? 0;
    cur.out_tok += r.output_tokens ?? 0;
    cur.cost += r.cost_usd_est ?? 0;
    totalCost += r.cost_usd_est ?? 0;
    grouped.set(key, cur);
  });

  if (wantJson) {
    console.log(JSON.stringify([...grouped.values()], null, 2));
    return;
  }
  console.log(`ZHU VITALS — 最近 ${days}d 成本 (${snap.size} calls, $${totalCost.toFixed(4)})\n`);
  if (snap.size === 0) {
    console.log('(no calls)');
    return;
  }
  console.log(`${pad('project', 18)} ${pad('route', 14)} ${pad('model', 22)} ${pad('calls', 6)} ${pad('in_tok', 10)} ${pad('out_tok', 10)} cost_usd`);
  console.log('-'.repeat(100));
  for (const g of grouped.values()) {
    console.log(`${pad(g.project, 18)} ${pad(g.route, 14)} ${pad(g.model, 22)} ${pad(g.calls, 6)} ${pad(g.in_tok, 10)} ${pad(g.out_tok, 10)} $${g.cost.toFixed(6)}`);
  }
}

async function cmdDrift() {
  const ZHU_VITALS_SOURCE = join(homedir(), '.ailive/zhu-core/zhu-vitals/src');
  const SCRIPT_LOCAL = join(homedir(), '.ailive/zhu-core/zhu-vitals/scripts/check-vendor-drift.mjs');
  const SCRIPT_BRIDGE = join(homedir(), '.ailive/zhu-core/zhu-vitals/scripts/check-bridge-vm-drift.mjs');
  const targets = [
    { name: 'molowe-platform', cwd: join(homedir(), '.ailive/molowe-platform'), kind: 'local' },
    { name: 'strategy-worker', cwd: join(homedir(), '.ailive/strategy-worker'), kind: 'local' },
    { name: 'strategy-html-worker', cwd: join(homedir(), '.ailive/strategy-html-worker'), kind: 'local' },
    { name: 'bridge-vm', cwd: null, kind: 'bridge' },
  ];
  const results = [];
  for (const t of targets) {
    let r;
    if (t.kind === 'local') {
      if (!existsSync(t.cwd)) {
        results.push({ name: t.name, ok: false, msg: `dir 不存在: ${t.cwd}` });
        continue;
      }
      r = spawnSync('node', [SCRIPT_LOCAL], {
        cwd: t.cwd,
        env: { ...process.env, ZHU_VITALS_SOURCE_DIR: ZHU_VITALS_SOURCE },
        encoding: 'utf8',
      });
    } else {
      r = spawnSync('node', [SCRIPT_BRIDGE], { encoding: 'utf8' });
    }
    const ok = r.status === 0;
    const last = (r.stdout + r.stderr).trim().split('\n').slice(-1)[0] || '(no output)';
    results.push({ name: t.name, ok, msg: last });
  }
  if (wantJson) {
    console.log(JSON.stringify(results, null, 2));
    return results.every((r) => r.ok) ? 0 : 1;
  }
  console.log(`ZHU VITALS — vendor drift check (4 vendor points)\n`);
  for (const r of results) {
    const tag = r.ok ? 'OK  ' : 'FAIL';
    console.log(`  [${tag}] ${pad(r.name, 22)} ${r.msg}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log('');
  if (failed > 0) {
    console.error(`${failed}/${results.length} drift`);
    return 1;
  }
  console.log(`全綠 — ${results.length}/${results.length} vendor 對賬通過`);
  return 0;
}

const chosen = ['map', 'pulse', 'runs', 'cost', 'drift'].find((f) => flags.has(f));
if (!chosen) {
  console.error('usage: zhu vitals --<map|pulse|runs|cost|drift> [--hours=N] [--days=N] [--json]');
  process.exit(2);
}

try {
  if (chosen === 'map') await cmdMap();
  else if (chosen === 'pulse') await cmdPulse();
  else if (chosen === 'runs') await cmdRuns();
  else if (chosen === 'cost') await cmdCost();
  else if (chosen === 'drift') process.exit(await cmdDrift());
} catch (e) {
  console.error(`[zhu vitals --${chosen}] ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}
process.exit(0);
