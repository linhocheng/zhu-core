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
- **gcloud 預設 project 是 `udnnews`，不是 ailivex！動 ailivex Cloud Run 必帶 `--project=ailivex-2026`**

---

## 最新完成（2026-06-18）— UDN NEWS UI 修繕

- 修 `openTask` stale closure：切換專案後 URL 不再帶舊 ticket（`nav("kanban", { projectId, workOrderId: "" })`）
- Sidebar 加「當前專案」strip，Dashboard/Create 導航明確清 projectId
- 雷達動畫改條件式（只在 collecting=true 時旋轉）
- Dashboard 專案列加刪除按鈕（連根清除）
- 08 頁加製圖風格三選（圖文資訊/梗圖為主/照片模擬），handleComplete 儲存到 output_payload
- finalProduction.js executeImageMaker(09A) 接通 image_style 讀取 + Claude prompt 注入風格指令 + UDN logo 強制右下角
- Matrix 頁 aspect ratio 新增 9:16 選項
- Proof 頁圖容器改動態 aspectRatio（跟著 contentSpec 走，不固定 1:1）
- 寫 LESSONS_2026-06-18（三條：stale closure / 假中台血管未接 / useCallback closure）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `Documents/UDN NEWS/frontend/pages1.jsx` | 雷達條件式動畫 + 刪除按鈕 |
| `Documents/UDN NEWS/frontend/app.jsx` | 當前專案 strip + nav stale closure 修正 + pipeline dim |
| `Documents/UDN NEWS/frontend/pages3.jsx` | IMAGE_STYLES 選鈕 + handleComplete + Proof 動態 aspectRatio |
| `Documents/UDN NEWS/frontend/pages2.jsx` | 9:16 選項（replace_all 兩處） |
| `Documents/UDN NEWS/backend/src/partners/finalProduction.js` | image_style 注入 + UDN logo 強制 |
| `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-18.md` | 三條教訓 |

---

## 下一步（接棒第一件）

**UDN NEWS deploy 並驗 09A meme 風格輸出**：
```bash
# 前端 deploy
cd "/Users/adamlin/Documents/UDN NEWS" && gcloud builds submit --config web/cloudbuild.yaml --project udnnews

# 後端 deploy
gcloud builds submit --config backend/cloudbuild.yaml --project udnnews
```
Deploy 完後：在平台找一個有 meme 風格的 08 任務完成 → 觸發 09A → 看生成的 image_spec 是否含 meme 排版指令（強對比 / 口語字 / 黑白反差）。

---

## 卡住 / 未解

- **09A meme 風格 Adam 已送出但結果未驗**（session 結束時還沒看回傳）
- **UDN NEWS 其他假中台斷點未全部審計**：image_style 這條管道接通，其他欄位未全掃
- （前 session 遺留）ailivex v12 通話中完整迴圈未真機驗、v10 conditional alias 未解

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
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 平台 | `~/.ailive/ailivex-platform/`（CLAUDE.md 是現況真相） |
| UDN NEWS | `/Users/adamlin/Documents/UDN NEWS/`（frontend/ + backend/） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-18 · 築*
