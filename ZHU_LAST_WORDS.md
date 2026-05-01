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
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`
  - 跑著 `claude-bridge`（systemd），`~/claude-bridge/index.js`
- **Live Media 平台**：`https://live-media-platform-epqhgokwva-de.a.run.app`（GCP Cloud Run, asia-east1）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-05-01）

- Live Media v2.0 全鏈路上線：外科筆記系統 + 角色工作記憶 + 六開關電路
- 新 API：`GET/POST /api/char-memory/[role]`、PATCH 新增 kill/escalate/rewrite action
- Bridge VM lmHttp hostname bug 修正（靜默失敗根因：catch 吞掉 JSON parse 錯誤）
- 端到端驗證：閾 REJECT score=62 → 停格者重寫 → 閾 APPROVE score=85
- TEST MODE 啟動：情報官每 30 分鐘、閾/閘每 5 分鐘，跑到 20:00 Taipei（12:00 UTC）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/claude-bridge/index.js`（Bridge VM） | v2.0 全面重寫：lmHttp / 六開關 / 外科筆記 / TEST MODE interval |
| `live-media-platform/app/api/char-memory/[role]/route.ts` | 新增角色工作記憶 API |
| `live-media-platform/app/api/articles/[id]/route.ts` | 新增 kill/escalate/rewrite action |
| `live-media-platform/lib/firestore.ts` | 新增 dead/escalated status、SurgicalNote 型別 |
| `/tmp/index.js`（本機 source） | 同步 Bridge VM 修正 |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | v2.0 milestone 紀錄 |

---

## 下一步

1. **晚上 20:00 Taipei 復盤**：看有幾篇發布、品質如何、有沒有重複或死循環
2. **復盤後調整**：情報官改回每日 02:00 UTC 排程（TEST MODE 結束後 interval 還在，要清掉）
3. **驗證角色記憶寫回**：`live_media_char_memory` Firestore 應有 positive_signal（approve 後）
4. **Phase 5**：等 Adam 提供 Threads 帳號 → 社群發布層

---

## 卡住 / 未解

- 角色工作記憶寫回未實際驗證（邏輯在 code，approve 路徑今天只跑了一次）
- TEST MODE 結束後要手動清掉 interval（12:00 UTC 後情報官停，但 `setInterval` 還跑著）
- Threads 帳號待 Adam 提供（Phase 5 社群層）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| Live Media 平台程式碼 | `~/.ailive/live-media-platform/` |
| Live Media 後台 URL | `https://live-media-platform-epqhgokwva-de.a.run.app` |
| Bridge VM worker source | `/tmp/index.js`（本機），`~/claude-bridge/index.js`（VM） |
| Live Media 架構覺察 | `~/.ailive/live-media/EVOLUTION_v2.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-01 v2.0 上線 + TEST MODE 啟動 · 築*
