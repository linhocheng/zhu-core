/**
 * withVitals — 機制 B：執行心跳 wrapper
 *
 * 包住 entry handler。跑完寫一筆 final record 到 zhu_vitals_runs。
 * BUILDING_PROTOCOL v0.2 機制 B 統一單寫策略（不寫 start placeholder）。
 *
 * 同時透過 AsyncLocalStorage 把 { worker_id, project } 注進 context，
 * 深層的 bridgeCall / 任何 LLM call site 可以 zero-arg 拿到 worker_id。
 *
 * 用法（plain handler，回傳 RunResult）：
 *   import { manifest } from './manifest.mjs';
 *   import { withVitals } from 'zhu-vitals';
 *   export default withVitals(manifest, async (input) => {
 *     return { status, items_processed, items_failed, metrics };
 *   });
 *
 * 用法（Next.js Route，回傳 Response）：
 *   const tracked = withVitals(manifest, handle);
 *   export const GET = tracked;
 *   export const POST = tracked;
 *   // status 自動從 res.status 推導 (>=500 error, >=400 partial, else success)
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { getDb, expiresAt, uuid } from './firestore.mjs';
import { VITALS_COLLECTIONS, TTL_DAYS, validateManifest } from './manifest.schema.mjs';

const als = new AsyncLocalStorage();

/**
 * 讀當前 run context（worker_id / project / run_id）。
 * @returns {{ worker_id: string, project: string|null, run_id: string } | null}
 */
export function getRunContext() {
  return als.getStore() ?? null;
}

function looksLikeResponse(x) {
  return !!x && typeof x === 'object'
    && typeof x.status === 'number'
    && typeof x.headers === 'object';
}

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
 * @template {(...args: any[]) => Promise<any>} H
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
      const ctx = {
        worker_id: manifest.worker_id,
        project: manifest.project ?? null,
        run_id,
      };

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

      let raw;
      let result;
      let thrown;
      try {
        raw = await als.run(ctx, () => handler(...args));
        if (looksLikeResponse(raw)) {
          const s = raw.status;
          result = {
            status: s >= 500 ? 'error' : (s >= 400 ? 'partial' : 'success'),
            metrics: { http_status: s },
          };
        } else {
          result = raw ?? {};
        }
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
      return raw;
    }
  );
}
