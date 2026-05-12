/**
 * Manifest schema validator. Pure JS, no deps.
 * 用於 CI lint 與 runtime sanity check。
 */

const VALID_ENV = [
  'vm-systemd',
  'vercel-cron',
  'vercel-lambda',
  'cloud-run-long',
  'cloud-run-job',
];

const VALID_LLM_ROUTE = [
  'bridge',
  'anthropic-sdk',
  'gemini',
  'minimax',
  null,
];

/**
 * @param {unknown} m
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function validateManifest(m) {
  const errs = [];
  if (!m || typeof m !== 'object') {
    return { ok: false, errors: ['manifest 必須是 object'] };
  }
  const o = /** @type {Record<string, unknown>} */ (m);

  if (typeof o.worker_id !== 'string' || !o.worker_id.trim()) {
    errs.push('worker_id 必填（非空 string）');
  } else if (!/^[a-z0-9][a-z0-9-]*$/.test(o.worker_id)) {
    errs.push('worker_id 限小寫 + 數字 + dash');
  }

  if (typeof o.display_name !== 'string' || !o.display_name.trim()) {
    errs.push('display_name 必填');
  }

  if (!VALID_ENV.includes(/** @type {string} */ (o.env))) {
    errs.push(`env 必須是 ${VALID_ENV.join(' | ')}`);
  }

  if (o.expected_interval_seconds !== 'on-demand') {
    if (typeof o.expected_interval_seconds !== 'number' || o.expected_interval_seconds <= 0) {
      errs.push('expected_interval_seconds 必須是正整數或 "on-demand"');
    }
  }

  if (typeof o.report_cadence_seconds !== 'number' || o.report_cadence_seconds <= 0) {
    errs.push('report_cadence_seconds 必須是正整數');
  }

  if (!Array.isArray(o.reads_from)) errs.push('reads_from 必須是 array');
  if (!Array.isArray(o.writes_to)) errs.push('writes_to 必須是 array');

  if (!VALID_LLM_ROUTE.includes(/** @type {string | null} */ (o.llm_route))) {
    errs.push(`llm_route 必須是 ${VALID_LLM_ROUTE.map(String).join(' | ')}`);
  }

  return errs.length === 0 ? { ok: true } : { ok: false, errors: errs };
}

export const VITALS_COLLECTIONS = Object.freeze({
  runs: 'zhu_vitals_runs',
  cost: 'zhu_vitals_cost',
  manifests: 'zhu_vitals_manifests',
});

export const TTL_DAYS = Object.freeze({
  runs: 90,
  cost: 365,
});
