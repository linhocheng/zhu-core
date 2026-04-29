---
name: ailive 角色記憶系統三批升級（2026-04-28）
description: M1 + B1-B4 + A1+A3 全落地，三模式（dialogue / voice-stream / 即時撥號）讀路徑全通，寫路徑除即時撥號 agent 待 Phase 7
type: project
originSessionId: 32b08dfd-50e3-4004-bca4-32e3494f2ef9
---
ailive-platform 記憶系統 2026-04-28 大整修，盤點三模式記憶不一致後對標江彬整理出 7 個小批次落地。

**Why:** 即時語音上線後盤點三模式發現：寫路徑各做各的、讀路徑互不相認、沒有「角色承諾兌現了沒」追蹤。對標江彬偷 3 件事 + 自家補的 4 件事一起做。

**How to apply:** 動到 ailive 記憶相關（episodic / actions / time / profile / observations）先讀這條再開工，避免重做：

- **M1 Episodic memory 共用層**：`src/lib/episodic-memory.ts` + `agent/firestore_loader.py:load_episodic_block`，三邊統一注入「【最近的事】+【我的資源清單】」
- **B1 時間規則對齊**：`src/lib/time-rules.ts:buildTimeRulesBlock()`，三邊統一【當前時間】+ 4 條規則（含「絕對不要把幾分鐘前的事說成『上次』」）
- **B2 承諾追蹤升級**：`src/lib/character-actions.ts` 加 `fulfilledBy` (auto-haiku/manual/null) + `isRelevant` + `markActionFulfilled` / `markActionIrrelevant`；`src/lib/promise-reflection.ts` + `agent/promise_reflection.py` 自動標 confidence≥4 fulfilled；`voice-end/route.ts` + `agent/realtime_agent.py:on_disconnected` 接觸發；`src/app/api/promises/route.ts` 純 API，UI 留白
- **B3 UserProfile 拆兩張表**：`platform_user_profiles/{userId}`（全局事實 name/birthday/age/occupation/interests/extraInfo）+ `platform_user_observations/{characterId}_{userId}`（per-character personality/preferences/inferredInterests/notes）；TS 在 `src/lib/user-profile.ts` + `src/lib/user-observations.ts`，Python 鏡像在 `agent/`
- **B4 record_promise tool 寫路徑補洞**：dialogue + voice-stream 加 `record_promise(actionType, title, content)`；即時撥號 agent 因無 tool registry 沒接（Phase 7）
- **A1+A3 voice 頁 cross-user leak 修**：`/voice/[id]/page.tsx:192` hardcode `userId: voice-{characterId}` → 改三層 fallback（?u= > localStorage > 新 anon）+ 共用 `ailive_realtime_anon_uid` localStorage key 與 realtime 頁打通

**尚未解決：**
- 即時撥號 agent 沒 tool registry → 寫記憶三 tool 全沒接（Phase 7：LiveKit Agents `function_tool` 整合）
- dialogue 沒接 promise-reflection（文字模式無明確 session-end 觸發點）
- voice 頁舊 `voice-{c}-voice-{c}` conv 留著，下次撥開新 conv，記憶斷一刀
- 吉娜舊 summary 殘留前身角色「曜」（system_soul 已修，summary 不會自動洗）

**部署：** Vercel `ailive-platform-6m8q8y2z8`（latest production alias）/ Cloud Run revision `ailive-realtime-agent-00020-wwl`

**完整詳情：** `~/.ailive/zhu-core/docs/WORKLOG.md` 2026-04-28 段落
