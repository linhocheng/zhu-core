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
- 狀態：**待建（2026-05-01 設計完成，未實作）**

---

## Live Media 高我（runLiveMediaSuperego）— 已建，未完全驗證

獨立於築超我，跑在 Bridge VM。

- 觸發條件：每累計 5 篇文章通過閾審稿（`lmPublishedCount % 5 === 0`）
- 已觸發兩次（2026-05-03），但讀文章查詢每次都 crash
- **Crash 歷史**：
  - 第一次：`getFirestoreAdmin is not defined` → 已修成 `admin.firestore()`
  - 第二次：Firestore composite index 缺失（`live_media_articles` status + publishedAt）
- 蒸餾結果至今從未成功寫入 `zhu-memory`（tags: live-media-superego）
- **待做**：建 Firestore index → 驗證第三次觸發完整跑完 → 確認 zhu-memory 有寫入
