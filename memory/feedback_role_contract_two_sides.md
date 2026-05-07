---
name: 跨系統 role contract 兩邊都要對齊
description: bridge / API / UI / DB defaults 共享 role 契約時，缺一邊就靜默 skip — molowe brief 踩雷
type: feedback
originSessionId: 33684d1a-4446-4b2d-aee1-bf479269e1e6
---
當 bridge（VM）跟 platform（Vercel/Firestore）共享一個「角色 prompt 契約」時，兩邊的角色清單必須對齊，否則會靜默 skip。

molowe 踩雷實例：bridge 期待 `kol.role_prompts?.brief`（line 2446 of `~/claude-bridge/index.js`），但 platform 的 `RoleId` union 從來沒有 brief、`DEFAULT_ROLE_PROMPTS` 也沒寫 brief、PATCH allowlist 也沒收 brief、KolDetailClient 的 ROLE_ORDER 也沒 brief。結果 bridge 拿到 platform 的 `/api/kols/[id]` response 裡沒 brief，丟一行 `[molowe] kol midoufu role_prompts.brief missing — skip` 就跳過整輪。原本 hardcoded `MOLOWE_ACTIVE_KOLS = ['midoufu']` 時不痛，因為從來沒人發。

**Why**：「兩份即是零份」的具體形態 — 角色契約的真相分裂。Bridge 的代碼跟 platform 的 default 各自演化，沒有單一 source of truth。bridge 加新角色檢查時 platform 不知道，platform 加新 role 時 bridge 也用不到。

**How to apply**：
- 在 platform `src/lib/role-prompts.ts` 加新 role 時，五處同步更新：`RoleId` union、`ROLE_LABELS`、`ROLE_VARS`、`DEFAULT_ROLE_PROMPTS`、`api/kols/[id]/route.ts` 的 PATCH allowlist、`KolDetailClient.tsx` 的 `ROLE_ORDER`
- 在 bridge 加新 `kol.role_prompts?.X` 檢查時，先 grep platform 確認 X 存在於 RoleId / DEFAULT，否則先補 platform 再上 bridge
- 看到 log `kol XXX role_prompts.YYY missing — skip` 時，第一直覺是「契約缺一邊」，不是「資料沒灌」

**觸發信號**：
- bridge log 出現 `role_prompts.<name> missing — skip`
- 寫一個新的 worker / cron job 要讀 KOL 某個 prompt 欄位時
- 看到 hardcoded KOL list 改成動態派工後突然有東西 skip
- 任何兩個 repo 共讀同一個 Firestore collection / API response shape 的場景
