/**
 * write-auth — 寫入端點守門
 *
 * 兩種放行身分：
 * 1. x-zhu-secret header === ZHU_WRITE_SECRET（CLI / 手動維運）
 * 2. zhu-hub cookie === ZHU_HUB_PASSWORD（/hub 面板，middleware 驗過 Basic auth 後種）
 *
 * hasWriteSecret：只認 secret（給無 hub 呼叫者的端點：jie-memory DELETE、zhu-sleep）。
 * hasHubAccess：認 secret 或 hub cookie（給 hub 在用的端點：digest、prompts、xinfa 寫入、memory DELETE）。
 *
 * fail-closed：對應 env 未設 → 拒。這些端點皆無自動呼叫者，寧可全擋。
 * 注意：只鎖 hub 專用端點；zhu-memory POST/PATCH、zhu-orders、zhu-thread 因 CLI/lastwords 在用，維持開放。
 */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export function hasWriteSecret(req: Request): boolean {
  const expected = process.env.ZHU_WRITE_SECRET || '';
  if (!expected) return false; // fail-closed
  const provided = req.headers.get('x-zhu-secret') || '';
  return timingSafeEqualStr(provided, expected);
}

export function hasHubAccess(req: Request): boolean {
  if (hasWriteSecret(req)) return true;
  const pw = process.env.ZHU_HUB_PASSWORD || '';
  if (!pw) return false; // fail-closed
  const cookieHeader = req.headers.get('cookie') || '';
  const m = cookieHeader.match(/(?:^|;\s*)zhu-hub=([^;]+)/);
  const val = m ? decodeURIComponent(m[1]) : '';
  return timingSafeEqualStr(val, pw);
}
