#!/usr/bin/env node
/**
 * 端到端 smoke test：寫一筆 fake run + cost 到 Firestore，確認 schema/TTL 都 OK。
 *
 * 跑法：FIREBASE_SERVICE_ACCOUNT_JSON=... node zhu-vitals/scripts/smoke-test.mjs
 * 不會 call bridge（無需 BRIDGE_URL），只寫 zhu_vitals_runs + zhu_vitals_cost 各一筆。
 */
import { withVitals } from '../src/with-vitals.mjs';
import { getDb, expiresAt, uuid } from '../src/firestore.mjs';
import { VITALS_COLLECTIONS, TTL_DAYS } from '../src/manifest.schema.mjs';

const manifest = {
  worker_id: 'zhu-vitals-smoke-test',
  display_name: 'zhu-vitals smoke',
  env: 'vm-systemd',
  expected_interval_seconds: 60,
  report_cadence_seconds: 60,
  reads_from: [],
  writes_to: ['firestore:zhu_vitals_runs', 'firestore:zhu_vitals_cost'],
  llm_route: null,
  owner_notes: 'T3.1 smoke test，可定期刪',
};

const wrapped = withVitals(manifest, async () => {
  // 模擬一個 success run
  await new Promise((r) => setTimeout(r, 20));
  return {
    status: 'success',
    items_processed: 3,
    items_skipped: 0,
    items_failed: 0,
    metrics: { fake: true },
  };
});

console.log('[smoke] writing fake run...');
await wrapped();

console.log('[smoke] writing fake cost record...');
const db = getDb();
await db.collection(VITALS_COLLECTIONS.cost).add({
  call_id: uuid(),
  timestamp: new Date(),
  worker_id: manifest.worker_id,
  project: 'zhu-vitals',
  route: 'bridge',
  model: 'claude-sonnet-4-5',
  input_tokens: 100,
  output_tokens: 50,
  cost_usd_est: (100 * 3 + 50 * 15) / 1_000_000,
  purpose: 'smoke-test',
  expires_at: expiresAt(TTL_DAYS.cost),
});

console.log('[smoke] ✓ 完成。檢查 Firestore zhu_vitals_runs / zhu_vitals_cost 應各有一筆 worker_id=zhu-vitals-smoke-test。');
process.exit(0);
