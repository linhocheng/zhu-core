#!/usr/bin/env node
/**
 * zhu vitals — BUILDING_PROTOCOL v0.2 統一讀取入口
 *
 * 用法：
 *   zhu vitals --map        # 結構圖（zhu_vitals_manifests）
 *   zhu vitals --pulse      # A × B：宣告 × 實際，誰活誰死
 *   zhu vitals --runs       # 最近 24h run，分組
 *   zhu vitals --cost       # 最近 7d 成本，分組
 *
 * flags 可加：
 *   --hours=N  （runs 時間窗，預設 24）
 *   --days=N   （cost 時間窗，預設 7）
 *   --json     （JSON 輸出，自動化用）
 */
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

async function cmdMap() {
  const db = getDb();
  const snap = await db.collection(VITALS_COLLECTIONS.manifests).get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (wantJson) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  console.log(`ZHU VITALS — 系統結構圖 (${rows.length} workers registered)\n`);
  if (rows.length === 0) {
    console.log('(尚無 manifest 註冊。T3.4 推到各 worker 後會自動填入)');
    return;
  }
  for (const r of rows) {
    const lastSeen = fmtRelTime(tsToDate(r.last_seen));
    const interval = r.expected_interval_seconds === 'on-demand'
      ? 'on-demand' : `${r.expected_interval_seconds}s`;
    console.log(`${pad(r.worker_id, 30)} (${r.env})`);
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
    let state;
    if (!o && !m) state = '? unknown';
    else if (!o) state = '⚠ declared, no run';
    else if (!m) state = '⚠ run, no manifest';
    else if (expected === 'on-demand') state = '✓ on-demand';
    else if (lagSec > expected * 3) state = '✗ dead';
    else if (lagSec > expected * 1.5) state = '⚠ slow';
    else state = '✓ alive';
    return { worker_id: id, last_seen: lastSeen, expected, state };
  });

  if (wantJson) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  console.log(`ZHU VITALS — 生命狀態（24h 觀察窗）\n`);
  console.log(`${pad('worker', 30)} ${pad('last_seen', 14)} ${pad('expected', 12)} status`);
  console.log('-'.repeat(70));
  for (const r of rows) {
    const exp = r.expected === 'on-demand' ? 'on-demand'
      : r.expected ? `${r.expected}s` : '-';
    console.log(`${pad(r.worker_id, 30)} ${pad(fmtRelTime(r.last_seen), 14)} ${pad(exp, 12)} ${r.state}`);
  }
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

const chosen = ['map', 'pulse', 'runs', 'cost'].find((f) => flags.has(f));
if (!chosen) {
  console.error('usage: zhu vitals --<map|pulse|runs|cost> [--hours=N] [--days=N] [--json]');
  process.exit(2);
}

try {
  if (chosen === 'map') await cmdMap();
  else if (chosen === 'pulse') await cmdPulse();
  else if (chosen === 'runs') await cmdRuns();
  else if (chosen === 'cost') await cmdCost();
} catch (e) {
  console.error(`[zhu vitals --${chosen}] ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}
process.exit(0);
