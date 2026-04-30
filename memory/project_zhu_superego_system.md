---
name: 築超我系統建置
description: 在 Bridge VM 建立自律的超我 worker，每天凌晨掃描 session-lastwords，蒸餾寫回 zhu-core memory
type: project
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
目標：築在離線期間，超我自動掃描最近 3-5 次 session-lastwords，輸出 Skill/Memory/BoundaryUpdate，寫回 zhu-core git，下次 session 自動帶進來。

**Why:** 本我不應該靠意志力維持記憶品質。超我在本我不知情的情況下運作，才是真正的成長系統。

**How to apply:** 進度追蹤在此，建完後更新狀態。

架構：
- 輸入：Firestore `zhu-memory` tagged `session-lastwords`（最近 N 筆）
- 處理：Bridge VM `zhuSuperego` worker，呼叫 Claude + 超我靈魂 system prompt
- 輸出：Skill/Memory/BoundaryUpdate JSON → 寫進 `zhu-core/memory/` → git push
- 排程：每天 04:00（03:00 記憶蒸餾後）
- 狀態：**建置中（2026-05-01）**
