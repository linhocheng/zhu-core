---
name: reflex hook 掃整檔不是掃 diff
description: zhu reflex pretool-hook 對含 try/catch 的檔案會擋下所有 Edit；active 模式下改既有容錯檔會誤觸 solve_root_not_symptom
type: reference
originSessionId: 416ce85e-c458-4bb5-811a-b38dc130d139
---
zhu-self 的 `scripts/reflex/pretool-hook.mjs` 在 Edit/Write 前掃描，命中 `solve_root_not_symptom`（觸發信號含「try/catch 吞錯」）就擋。

**2026-05-29 踩雷**：改 `characters/[id]/route.ts`（檔案本身有既有 `catch (_e) { /* 不阻斷 */ }` redis 容錯）。連完全不含 try/catch 的小範圍 new_string 也被擋 → 確認它**掃整個目標檔內容，不是只掃 diff**。任何含 try/catch 的檔案在 active 模式下都改不動。

**怎麼處理**：
- 不要自己用 --no-verify 之類繞過（那正是這條 reflex 在防的事，且 hook 也擋不掉 Edit）
- 確認是誤觸（在保留既有容錯、不是新增繞道）後，請 Adam 跑 `zhu reflex log-only`（全域降 log-only，整 session 不擋）或 `zhu fp solve_root_not_symptom`（只放這次）
- **指令要真的在 shell 執行**：Adam 把指令打進對話框 / 用 `!` 前綴若沒真的跑到，state 不會變。驗證 `~/.ailive/zhu-core/zhu-self/state/reflex.json` 的 `mode` 欄，或 `bin/zhu reflex status`
- log-only 是 session 級 kill switch，收尾記得提醒 `zhu reflex active` 復原

**狀態檔**：`~/.ailive/zhu-core/zhu-self/state/reflex.json`（`mode: active | log_only`）
