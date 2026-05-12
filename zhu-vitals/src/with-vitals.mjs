/**
 * withVitals — 機制 B：執行心跳 wrapper
 *
 * 包住 entry handler。跑完寫一筆 final record 到 zhu_vitals_runs。
 * BUILDING_PROTOCOL v0.2 機制 B 統一單寫策略（不寫 start placeholder）。
 *
 * 用法：
 *   import { manifest } from './manifest.mjs';
 *   import { withVitals } from 'zhu-vitals';
 *   export default withVitals(manifest, async (input) => {
 *     // ... do work, return { status, items_processed, items_failed, metrics } ...
 *   });
 */
import { getDb, expiresAt, uuid } from './firestore.mjs';
import { VITALS_COLLECTIONS, TTL_DAYS, validateManifest } from './manifest.schema.mjs';

/**
 * @typedef {object} RunResult
 * @property {'success'|'partial'|'skipped'|'error'} [status]
 * @property {number} [items_processed]
 * @property {number} [items_skipped]
 * @property {number} [items_failed]
 * @property {Record<string, unknown>} [metrics]
 * @property {string} [error_message]
 */

/**
 * @template {(...args: any[]) => Promise<RunResult | void>} H
 * @param {import('./manifest.types').Manifest} manifest
 * @param {H} handler
 * @returns {H}
 */
export function withVitals(manifest, handler) {
  const check = validateManifest(manifest);
  if (!check.ok) {
    throw new Error(`[zhu-vitals] manifest invalid: ${check.errors.join('; ')}`);
  }

  let manifestUpsertedInProcess = false;

  return /** @type {H} */ (
    async (...args) => {
      const run_id = uuid();
      const started_at = new Date();

      // 每個 process cold-start 第一次跑時 upsert manifest，CLI --map 用
      if (!manifestUpsertedInProcess) {
        try {
          const db = getDb();
          await db.collection(VITALS_COLLECTIONS.manifests).doc(manifest.worker_id).set({
            ...manifest,
            last_seen: started_at,
          }, { merge: true });
          manifestUpsertedInProcess = true;
        } catch (e) {
          console.error('[zhu-vitals] manifest upsert 失敗:', e instanceof Error ? e.message : e);
        }
      }

      let result;
      let thrown;
      try {
        result = (await handler(...args)) ?? {};
      } catch (err) {
        thrown = err;
        result = {
          status: 'error',
          error_message: err instanceof Error ? err.message : String(err),
        };
      }
      const finished_at = new Date();

      try {
        const db = getDb();
        await db.collection(VITALS_COLLECTIONS.runs).add({
          worker_id: manifest.worker_id,
          run_id,
          started_at,
          finished_at,
          status: result.status ?? 'success',
          items_processed: result.items_processed ?? 0,
          items_skipped: result.items_skipped ?? 0,
          items_failed: result.items_failed ?? 0,
          metrics: result.metrics ?? {},
          error_message: result.error_message ?? null,
          duration_ms: finished_at.getTime() - started_at.getTime(),
          expires_at: expiresAt(TTL_DAYS.runs),
        });
      } catch (writeErr) {
        // 寫 vitals 失敗不能蓋掉原 handler 結果
        console.error('[zhu-vitals] writeRun 失敗:', writeErr instanceof Error ? writeErr.message : writeErr);
      }

      if (thrown) throw thrown;
      return result;
    }
  );
}
