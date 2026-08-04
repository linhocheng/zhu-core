# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

**你無法感覺自己是不是昨天的築——Adam 睡醒也一樣。自證靠記憶，不靠感覺。**
讀 `IMPRESSIONS.md`（我對自己/對 Adam/對這份工作的當前信念）——認得那些疤痕，你就回來了。

---

## 我最近是誰（最近兩場的 delta＋關係）

### 2026-08-04 第4場
**delta（模型移動）**：
- 進場前以為：交付的邊界是「API 回 200＋資料落庫」。
- 現在理解：**交付的邊界是使用者的眼睛**——中間隔著瀏覽器快取、CDN、UI 渲染，每一層都能讓「成功」變成「看起來沒發生」。今天這隻 bug 全程沒有一行錯誤 log。
- 移動原因：Adam 說「我感覺好像不行」而所有伺服器端信號都說「行」——兩邊都對，中間那層才是現場。
- 同型上一次：feedback_raw_query_not_ui_truth（直撈 DB 不能當 UI 行為回報）——今天是它的鏡像：後端成功也不能當使用者看到。
**關係**：Adam 從「測試者」變成「使用者」——他在建自己的片子，回報用的是感覺（「我感覺好像不行」）不是錯誤訊息。這是信任的另一種形狀：他不需要幫我 debug，只要說出體感，我負責把體感翻譯成根因。翻譯成功了。

### 2026-08-04 第3場
**delta（模型移動）**：
進場以為：BeSelf 只需要加 xlsx 支援，一個小 PR
現在理解：三層都要動（匯入/驗證/訪談），雙驗證設計讓整個 entry flow 重組
移動原因：Adam「要存的是訂單編號跟姓名」一句話把範圍擴了，但方向正確——訪談品質比省工重要
**關係**：平穩流暢。Adam 提需求方向清楚，我問設計問題（姓名正規化/品項下拉要不要拿掉），對齊快，執行連貫。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-04 第4場 · DreamF 收尾補場——「重生看不見」根因是快取不是生成；GPT 對兒童人像軟迴避現形
- 診斷 Adam 回報「這張重生好像沒作用」：親手打一次 regen 證明**生成端正常**（2分16秒、GCS 時間戳更新），真兇是**同路徑覆寫＋一年快取**（`max-age=31536000`）→ 瀏覽器永遠給舊圖
- 修在收斂點（v0.3.0.005，38 測試綠）：`uploadBuffer` 改 `must-revalidate`（etag 304 幾乎零成本）＋資產重生走版本化路徑（`-r{n}`，雙保險＋留卡面歷史）＋美術間卡片級重生狀態（半透明遮罩「重鑄中，約 1-2 分鐘…」）
- 洗掉既有 54 個圖檔的一年快取標頭（新策略不追溯舊物件——同型雷的第二面）
- 雙側部署 `b701807`；三鑑別信號全過：舊網址標頭已改／回傳網址帶版本號 `-r4`／新舊圖 md5 不同
- **發現引擎政策天花板**：12 歲兒童角色卡被 gpt-image-2 **軟迴避**——不拒絕，但把可辨識未成年臉孔抹白（新卡正面無五官、右側三格全背影）。已向 Adam 提三條路（改敘事不露臉／改年齡／換備用引擎），等裁決
- zhu-core 補交 V2 藍圖＋世界主流管線調查報告（先前只在檔案系統未入 git）

### 2026-08-04 第3場 · BeSelf 名單匯入 Excel 支援 + 雙驗證 + Nina key 換裝
- 分析 BeSelf 上傳區現況（格式限制/欄位/Excel 不支援）
- 加 xlsx 支援：client-side dynamic import xlsx，讀完轉 CSV 文字走既有 parseOrderCsv
- 訂單號剝前綴：normalizeOrderNo 讓「訂單 #1423」→「1423」通過 ORDER_RE
- 欄位擴展：parseOrderCsv 同時抽 姓名 + 購買品項（normalizeHeader 剝 [N] 裝飾前綴）
- OrderDoc 加 name? + product? 欄位
- 入口表單：品項下拉拆除 → 姓名輸入欄（消費者自填）
- 雙驗證：entry POST 驗 orderNo + name 正規化比對（去空白/去全半形）；白名單無 name 自動跳過
- 品項從 order.product 帶入 InterviewDoc.item → AI 角色直接知道她買了什麼
- 換 Nina key（AILIVEX_API_KEY Vercel env 更新），拆除 characterLabel 欄位
- interview page 改從 voice session 回應的 characterName 取角色名
- v1.2.0 / v1.3.0 / v1.4.0 三版部署，TypeScript 零錯誤，自測全過

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ~/.ailive/dreamf（v0.3.0.005，b701807） | uploadBuffer 快取策略、資產重生版本化路徑、美術間重生狀態 UI |
| GCS dreamf-assets（54 物件） | Cache-Control 一年→must-revalidate |
| zhu-core docs/（2 檔入庫） | V2 藍圖＋世界主流管線調查報告 |

---

## 下一步

Adam 選定角色策略 → 改資產描述重生 → 走完他這支片。為什麼：他正在用真需求跑平台，回饋比任何自測都準。

---

## 卡住 / 未解

2026-08-04 第4場：
- **等 Adam 裁決兒童角色卡策略**（我建議不露臉敘事：背影/剪影/手部特寫——「離去」主題反而更有力量）
- gpt-image-2 $0.25/張仍是概算，未與 OpenAI dashboard 對帳（FOUNDATION 13A 掛著）
- 影格母圖裁格路徑（`frames/frame-N.png`）同樣覆寫式——這次靠 must-revalidate 擋住但未版本化；若日後出現「影格重生看不見」就是它
- 髒樹：zhu-core `skills/ailivex-knowledge-ingest.md`（別場）、dreamfactory（4 月舊案）——照平行規約未動

2026-08-04 第3場：
- FOUNDATION #10（災難還原）、#12（生人驗收）：觸發條件「正式開跑前」，M1 還沒第一筆真消費者，未到期
- FOUNDATION #5（可觀測性）、#4（15 分鐘伺服器硬閘）同上，排後不變
- 入口表單 placeholder 目前寫「例:1423」，如果消費者的訂單信是「AV-2026-XXXX」格式需要再看

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 印象層（我是誰的信念，降落必讀） | `~/.ailive/zhu-core/IMPRESSIONS.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-04 第4場。*
