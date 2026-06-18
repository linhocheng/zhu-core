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

## 最新完成（2026-06-18 · 第三 session）— StraTA 學習 + HD 進度收束

- 把 StraTA 論文可搬的編排層三模式寫進 memory（Top-δ評分 / 最遠點語義多樣性 / 校準自審）+ plan→condition→execute=三段公式上位連結；標明 RL 訓練半部不適用（我們走 bridge 不自訓）
- HD 排盤專案（暫停中）補 `PROGRESS.md`：未提交改動清單 + 環境雷 + 兩個設計決策 WHY + 待辦
- 核實 HD 兩個決策點的程式註解已到位（沒反射性加 noise），追加 LESSONS L4/L5

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.claude/.../memory/reference_strata_agentic_design_patterns.md` | 新建：StraTA 三模式 reference memory |
| `~/.claude/.../memory/MEMORY.md` | 加 StraTA 指標行 |
| `~/.ailive/human-design-mcp/PROGRESS.md` | 新建：HD 暫停狀態快照 |
| `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-18.md` | 追加 L4/L5（第二/三 session） |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 追加第三 session 條目 |

> 註：今天還有前兩個 session 的 UDN NEWS UI 修繕（見 commit 021）。

---

## 下一步（接棒第一件）

兩條 pending，依 Adam 醒來指示擇一：

**A. UDN NEWS 驗 09A meme 風格（前 session 已 deploy 未驗）**
在平台找一個 meme 風格的 08 任務完成 → 觸發 09A → 看 image_spec 是否含 meme 排版指令（強對比 / 口語字 / 黑白反差）。

**B. HD 排盤專案重啟（目前暫停）**
先讀 `~/.ailive/human-design-mcp/PROGRESS.md`。工作區有未提交改動**勿洗**。重啟第一件是決定版號切換並 commit。

---

## 卡住 / 未解

- **UDN NEWS 09A meme 風格 Adam 已送出但結果未驗**
- **HD 工作區未提交改動未入庫**；視角/動力名稱是否對調未確認（動前查權威來源，別憑記憶）
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
| HD 排盤 | `~/.ailive/human-design-mcp/`（PROGRESS.md 是暫停狀態真相） |
| UDN NEWS | `/Users/adamlin/Documents/UDN NEWS/`（frontend/ + backend/） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-18 · 築*
