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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-07-04，接 7/3 記憶收官後的日場+夜場）

**ailiveX：**
- 診斷 v15「反應慢」＝付費 key 餘額見底（部分請求 400），Adam 儲值解
- **soulCore 全退役**：查出雙真相分裂（吳念真上場用 540 字舊摘要、完整版 2499 字被晾），14 角色遷移單一 soul 欄位（淘汰版備份 soulLegacy），鑄造 UI/API/lib 全刪，五條讀路徑統一，Vercel 已部署。已部署 v15 靠 fallback 鏈立即生效（資料層修法免重部署）
- 新增角色流程現在＝貼靈魂→建立→即上場，所見即所得

**UDN 議題工作台（大改版，Cloud Run rev 00060→00066）：**
- Podcast 分鐘制＋腳本逐行過濾標記；Brief 人工編輯（存新版本）；「文稿階段必可編輯」立為鐵律（memory 有）
- 全站去冗 8 處（假按鈕/裝飾進度條/重複 CTA 全清）
- Claude Design 換血：陶土橘單強調色（globals.css 收斂點一次換全站）＋宋體標題＋圓角陰影＋按鈕三階（lib/ui.ts）
- AppShell 大改版：桌機側欄／手機抽屜＋底部分頁列，全頁單欄化（根治手機破版）
- 收集頁重生＝分診收件匣（狀態分段/排除壓縮/sticky CTA）
- 破格修：body overflow-wrap 全站保險＋3 處 flex ellipsis minWidth:0

**討論定案未實作**：角色防洩漏三層（Tracy 錨點守則已 review；防背誦補丁＋格式層四條薄禁令＋出戲保險絲 pattern 文字都擬好在對話裡）——等 Adam 說上。

---

## 下一步

1. **Adam 驗收**：UDN 手機底部分頁＋收集頁分診收件匣；ailiveX 新增角色單一靈魂框。回饋決定要不要微調
2. **防洩漏落地**（等點頭）：ailiveX 全局 prompt 加四條格式禁令＋Tracy 天條四加防背誦行＋文字過濾器加「出戲」分類
3. **別名 bug**（Adam 說先不用修）：重現環境 SOP 已打通——escaped SA 系統 env 起 dev、lsof 清 port、SESSION_SECRET 自簽 admin cookie、puppeteer-core 用系統 Chrome。指紋：腳本種的別名有值、手動輸入的全空

---

## 卡住 / 未解

- **兩 repo 未 commit**：ailivex-platform 的 soulCore 退役 8 檔（v15.2.1 之後）；UDN platform 66 檔（整個改版）。Adam 沒說收版控——**線上比 git 新**，接棒者勿信 git 是最新
- UDN 四張表單頁只套殼未細修；素材頁卡片細節未掃（最後一塊拼圖）
- ailiveX 別名「無法輸入」真相未定（Adam 喊停說沒那麼嚴重）——別按舊理解開工，先問他實際看到什麼
- 7/3 遺留：Adam 的文字過濾器文件還沒來；ailive-platform 移植白皮書已交

---

## 天條快取（近兩天實戰過的）

- 模稜兩可信號≠成功證據；「慢」也是模糊信號——先找鑑別信號（這次是 log 裡的 400）
- 雙欄位＋讀取優先序＝靜默的「編輯不生效」；診斷用欄位長度對比表，幾分鐘照出分裂
- 資料層修法能讓已部署舊代碼立即改行為（fallback 鏈當遷移工具）
- 模糊 bug 回報先一句話對齊症狀再開工（好奇先於開工——被「你是不是誤會了什麼」救了一次）
- throttled Cloud Run 無 fire-and-forget；--update-env-vars 不用 --set-env-vars

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-04.md` |
| 記憶白皮書 | `~/.ailive/ailivex-platform/docs/MEMORY_SYSTEM_WHITEPAPER.md` |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**soulCore 退役未 commit**）|
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**66 檔未 commit**，Cloud Run 部署用 `gcloud builds submit --config=cloudbuild.yaml --project=udnnews --region=asia-east1`）|
| UDN 設計 token | `platform/app/globals.css` + `platform/lib/ui.ts`（陶土橘 #C96442） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-04 · 築（UDN 產品化＋soulCore 退役）*
