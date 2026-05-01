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
  - SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），五個 worker：strategy + image + design + 築超我（04:00）+ 角色超我（04:30）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-05-01）

### 本日主線：Live Media 完整藍圖設計

**是什麼：** 一個由 AI 角色組成的媒體公司。AI 不活在對話框裡——他們在 Threads 搜集熱帖、寫文章、審稿、發布、追蹤成效、在社群留言。首發領域：心靈顯化部（星座 / 占卜 / 能量學 / 顯化 / 人類圖）。

**16個角色（維命名）：**

| 層次 | 代號 | 靈魂名 |
|---|---|---|
| 管理層 | 執行長 | 弦（Xián） |
| 超我①②③④⑤ | 關鍵字/評分/排重/審核/策略顧問 | 熵謬裁鑑洄 |
| 內容生產線 | 情報官/排重員/寫手/總編輯/發布員/記憶管理員 | SIGINT/齊/停格者/閾/閘/庫 |
| 績效部 | 成效追蹤員/績效優化員 | 痕/析 |
| 社群部 | 引流官/互動員 | 弋/繫 |

**技術決策（鎖定）：**
- GCP Project：`zhu-cloud-2026`（沿用，不開新 project）
- 文章後台：Cloud Run + Next.js，asia-east1
- 排程：Bridge VM 擴充（新增 live-media workers）
- 資料庫：Firestore（5個新 collection）
- 社群自動化：Playwright on Bridge VM + session cookies

**檔案位置：**
- 靈魂檔案：`/Users/adamlin/.ailive/live-media/roles/`（本機）
- 執行計劃：`/Users/adamlin/.ailive/live-media/EXECUTION_PLAN.md`
- 雲端備份：`github.com/linhocheng/zhu-core/tree/main/live-media/`

### 今晨：雙超我 worker 上線
- 築超我（04:00 Taipei）+ 角色超我（04:30 Taipei）已部署 Bridge VM
- Bridge VM log 確認：`[superego] scheduled in 1150 min` + `[char-superego] scheduled in 1180 min`

### 前一批（2026-04-30）
- Bridge VM 接管 strategy/image/design 三 worker
- 排角色（pai-001）建立，香研→奧→排鏈路通

---

## 下一步（明天開工）

**Phase 1（最優先）：建 live-media-platform Cloud Run**
1. 建 Next.js 專案 `live-media-platform`
2. 連接 Firestore（`live_media_articles` collection）
3. 建管理後台 UI（文章列表 / 審核 / 發布開關）
4. 建 API endpoints（`POST /api/articles`、`GET /articles/:id`）
5. Docker 化，部署 Cloud Run asia-east1
6. 驗收：Bridge VM 可 POST 一篇文章，公開 URL 可讀

**Phase 2-3 接續：**
- 情報官 worker（Threads 爬蟲 + 評分）
- 寫手 → 閾 → 發布員完整流水線

---

## 卡住 / 未解

- Threads 帳號待 Adam 提供（Phase 5 社群層需要）
- Cloud Run 文章後台域名未定
- 文章後台 admin 是否需要登入保護（待決）
- 築超我首跑（今晚 04:00）結果待確認

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 超我靈魂規格 | `~/.ailive/zhu-core/docs/SUPEREGO_SPEC_v1.md` |
| Live Media 藍圖 | `~/.ailive/live-media/BLUEPRINT.md` |
| Live Media 執行計劃 | `~/.ailive/live-media/EXECUTION_PLAN.md` |
| Live Media 靈魂檔案 | `~/.ailive/live-media/roles/` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| Bridge VM | `gcloud compute ssh zhu-dev --zone=asia-east1-b` |
| jobWorker 恢復 | 取消注解 `MOUMOU_LIVE/functions/src/index.ts` 最後一行 → build → deploy |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.3.0。*
*2026-05-01 · 築*
