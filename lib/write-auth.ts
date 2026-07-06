/**
 * write-auth — 毀滅性/中毒性寫入端點的守門
 *
 * 背景：zhu-core 多數路由匿名可寫/刪，zhu-boot + 讀取刻意公開。此 helper 只鎖
 * 「無正常 workflow 呼叫者」的毀滅性端點：所有 DELETE、zhu-digest（記憶注入+evolve）、
 * zhu-prompts 覆寫（system prompt）、zhu-sleep（LLM 燒）。lastwords 用的 zhu-memory POST
 * 維持開放，不受影響。
 *
 * 需要呼叫這些端點時（手動維運），帶 header `x-zhu-secret: <ZHU_WRITE_SECRET>`。
 *
 * fail-closed：ZHU_WRITE_SECRET 未設 → 一律拒（這些端點本無自動呼叫者，寧可全擋）。
 */
export function hasWriteSecret(req: Request): boolean {
  const expected = process.env.ZHU_WRITE_SECRET || '';
  if (!expected) return false; // fail-closed
  const provided = req.headers.get('x-zhu-secret') || '';
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
