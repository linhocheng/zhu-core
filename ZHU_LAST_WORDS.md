# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-28）

- 加 /projects header「角色庫」nav link → /characters
- 加 /characters header「新增專案」nav link → /projects/new
- Task Harness 跑 Cloud Run 部署，1 輪完成，閻羅 DONE，試劍客三隱患記錄在案
- 輸出完整 UIUX 規格 DOCX（5章節，供 Adam 設計新版介面）
- 更新 MEMORY.md（P1-P4 記憶完整）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/Documents/UDN NEWS/platform/app/projects/page.tsx` | header 加「角色庫」button（border style）|
| `~/Documents/UDN NEWS/platform/app/characters/page.tsx` | header 加「新增專案」button（border style）|

---

## 下一步

**等 Adam 發回新版 UI/UX 設計稿**，收到後逐頁套進 `~/Documents/UDN NEWS/platform/` 的 Next.js 代碼。

接棒後先確認：
1. 讀 `project_udnnews_platform.md` memory 確認 P1-P4 已上線
2. 確認 Cloud Run URL https://udnnews-platform-62w6sp6iba-de.a.run.app 還活著
3. 等 Adam 貼設計稿，問清楚「全新還是局部調整」後動手

---

## 卡住 / 未解

試劍客標記三個技術隱患（低優先，不阻塞 nav 功能）：
1. `.catch(() => [])` 吞錯誤 → 用戶看空畫面不知系統死了
2. `project.sources.length` 若欄位 undefined → 整頁崩潰（舊資料風險）
3. Cold start × force-dynamic 無 loading skeleton → 體感差

Adam 的新 UI/UX 設計稿未到，套版工作等待中。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| UDN NEWS 平台 | `~/Documents/UDN NEWS/platform/` |
| UDN NEWS Cloud Run | https://udnnews-platform-62w6sp6iba-de.a.run.app |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-28 · 築*
