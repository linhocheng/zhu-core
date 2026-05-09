---
name: 築超我系統（已併入 zhu-self distillation）
description: 超我「執行體」已併入 zhu-self distillation daemon；剩下的是把雛形升級為自動化（Phase 2 路線）
type: project
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---

## 真相校正（2026-05-09）

「超我系統 vs zhu-self distillation」是同一件事的兩個版本，不是兩個獨立專案。8 天「零進度」是這條記憶在說謊。

**靈魂規格**：`reference_superego_spec_v1.md`（三層掃描 + 三蒸餾問題 + 三種寫回，2026-05-01 Adam 拍板，**這條保留**）

**執行體現況**（zhu-self 已吸收）：
- `zhu-self/scripts/distill.mjs` — 蒸餾 logic 雛形，stub + bridge 兩 mode（任 bridge 實作）
- safe mode：寫到 `~/.ailive/zhu-core/zhu-self/candidates/`，不直入主記憶
- Phase 1 #13 ✅ done（safe mode 雛形）
- 觸發：CLI manual（`bin/zhu distill`）

**剩下的（Phase 2 演化路徑，不是「待建專案」）**：
1. 自動觸發：Claude Code stop hook + idle 觸發（Phase 2 task #26）
2. drift gate：embedding cosine vs NORTH_STAR（Phase 2 task #27）
3. candidates → 主記憶的 active 寫回（需 Adam 簽字 enable apply mode）
4. 從本機 AIR 擴到 Bridge VM 跨機器跑（如果之後決定要的話）

**原始設計裡寫「Bridge VM 跑」的部分，重新評估後**：當前是 AIR 主機跑，因為 Adam 通常在 AIR 工作，stop hook / idle 觸發都本機起。Bridge VM 跑只在「Adam 離線多日」這種場景才有意義，目前不必做。

---

## Live Media 高我（runLiveMediaSuperego）— 已隨 Live Media 暫停（2026-05-09）

獨立於築超我，跑在 Bridge VM。

- 觸發條件：每累計 5 篇文章通過閾審稿（`lmPublishedCount % 5 === 0`）
- 已觸發兩次（2026-05-03），Firestore composite index 缺失導致 crash
- **2026-05-09 Live Media 整條鏈降為 directive=0 暫停 → 此 worker 不會再觸發**
- 重啟條件：跟著 Live Media 主鏈一起重啟，重啟前要先建 composite index

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
