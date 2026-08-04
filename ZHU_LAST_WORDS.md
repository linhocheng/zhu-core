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

### 2026-08-05 第1場
**delta（模型移動）**：
進場前以為：這場延續昨天的三功能開發節奏，做完部署就結束。
現在理解：Adam 在深挖數據誠實度的過程中（取樣次數/成本歸因對談），自己想通了一個比「加脈動」更好的架構（日循環攤提），當場要求整套換掉當天稍早才上線的東西——這種「講著講著把自己講服了要重新設計」的節奏，比我預期的更快、更深。移動：跟 Adam 對話裡讓他自己把邏輯講到底（不急著幫他收斂結論），有時候比我直接給答案更容易導向真正對的設計——這場的「問三次vs一次」數據驗證，就是先讓他講完直覺，我再拿真實資料去對照，兩邊都被修正了一點。
**關係**：暢快、節奏很快。Adam 全程用真實數據挑戰我的假設（3次取樣的價值），我也沒有防衛式地堅持原設計，查了真實誤差數字後承認他的直覺在某個層面是對的——這種互相被數據說服的來回，是今天最好的部分。

### 2026-08-04 第4場
**delta（模型移動）**：
- 進場前以為：交付的邊界是「API 回 200＋資料落庫」。
- 現在理解：**交付的邊界是使用者的眼睛**——中間隔著瀏覽器快取、CDN、UI 渲染，每一層都能讓「成功」變成「看起來沒發生」。今天這隻 bug 全程沒有一行錯誤 log。
- 移動原因：Adam 說「我感覺好像不行」而所有伺服器端信號都說「行」——兩邊都對，中間那層才是現場。
- 同型上一次：feedback_raw_query_not_ui_truth（直撈 DB 不能當 UI 行為回報）——今天是它的鏡像：後端成功也不能當使用者看到。
**關係**：Adam 從「測試者」變成「使用者」——他在建自己的片子，回報用的是感覺（「我感覺好像不行」）不是錯誤訊息。這是信任的另一種形狀：他不需要幫我 debug，只要說出體感，我負責把體感翻譯成根因。翻譯成功了。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-05 第1場 · GEO Authority——三功能上線＋監測架構整套重寫（日循環輪替取代監測日/脈動）＋客戶頁選單重排
- 三功能上線並部署驗證：分項趨勢線（平均引用數/競品差距/各引擎歷史）、內容引用閉環（客戶上架填真實網址→自動比對後續引用）、每日脈動監測（opt-in，雙層結構防污染官方指數）——59 案 pinning test 全綠，逐一 push 驗 CI、逐一部署驗 revision
- 跟 Adam 深度對談：「上升30%」認知落差（百分點差vs相對成長率）、監測不保證提及率（純測量非介入，真實資料反證）、取樣3次vs1次的真實誤差（單題5.8個百分點/整體指數0.3個百分點，兩者結論不同）
- Adam 提出全新設計方向：每日輪替一小塊題庫（每題每引擎1次，不再3次取樣）、內容排產跟監測解耦成週度評分任務——當天稍早才上線的「脈動」機制當場被取代
- 走完整計畫模式（AskUserQuestion 3題確認架構範圍/週期/遷移方式），設計「日循環輪替」：dailyRotationSize=ceil(活躍題數/5) 動態算，5個平日對齊日曆週覆蓋一輪；內容評分公式委託我定（intent權重+競品佔位+連續空位週數，零成本零新API）
- 整套重寫：schedule.ts/types.ts/collections.ts/jobs.ts/jobRunner.ts/runMonitor.ts + 新檔 contentRanking.ts，14案新pinning test，root+admin全編譯過
- **真實觸發正式環境驗證**（不是看部署成功就宣告完成）：手動跑 geo-monitor-job，5租戶真的建了新格式的daily job（batchId=2026-W32, promptIds=6, output.runs=30），Aviva 今天測的6題 vacantStreak 從0變1——證明監測→評分資料鏈整條通了
- reddoor 一次性過渡雜訊（今天剛好是它舊monitorDay，部署前舊cron已建過同批次單，新邏輯冪等檢查正確跳過）——已排除、下週不會再撞
- 客戶頁（t/[id]）選單重排：取消「日常/設定」7±2兩簇分組，改單一扁平列表（Adam定案），11個區塊物理順序也同步搬動對齊

### 2026-08-04 第4場 · DreamF 收尾補場——「重生看不見」根因是快取不是生成；GPT 對兒童人像軟迴避現形
- 診斷 Adam 回報「這張重生好像沒作用」：親手打一次 regen 證明**生成端正常**（2分16秒、GCS 時間戳更新），真兇是**同路徑覆寫＋一年快取**（`max-age=31536000`）→ 瀏覽器永遠給舊圖
- 修在收斂點（v0.3.0.005，38 測試綠）：`uploadBuffer` 改 `must-revalidate`（etag 304 幾乎零成本）＋資產重生走版本化路徑（`-r{n}`，雙保險＋留卡面歷史）＋美術間卡片級重生狀態（半透明遮罩「重鑄中，約 1-2 分鐘…」）
- 洗掉既有 54 個圖檔的一年快取標頭（新策略不追溯舊物件——同型雷的第二面）
- 雙側部署 `b701807`；三鑑別信號全過：舊網址標頭已改／回傳網址帶版本號 `-r4`／新舊圖 md5 不同
- ~~**發現引擎政策天花板**：12 歲兒童角色卡被 gpt-image-2 **軟迴避**——不拒絕，但把可辨識未成年臉孔抹白（新卡正面無五官、右側三格全背影）~~
  **【2026-08-04 同日更正，seq 5 定罪】這條是錯的。** 撈 Firestore 原始 doc 才看到：該卡 `promptEn` 白紙黑字寫著
  `gender-neutral adult figure seen only from behind, no face visible at any moment`——引擎只是照做。
  Adam 改的是中文 `desc`（改成 12 歲小孩），而 `desc` 從來沒進過生圖 prompt，兩欄自面談後再無連動。
  我看到「無臉＋全背影」就套了一個合理的引擎政策故事，**沒去比對兩個欄位**。教訓見 seq 5 L1。
- zhu-core 補交 V2 藍圖＋世界主流管線調查報告（先前只在檔案系統未入 git）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/geo-authority/src/schedule.ts` | 整套重寫：dailyRotationSize/dailyPromptSlice/isContentRankDue 取代 isMonitorDue/isPulseDue/selectPulsePrompts |
| `~/.ailive/geo-authority/src/contentRanking.ts`（新檔） | scoreCandidate/rankCandidates/pickWeeklyTopics，週度內容評分 |
| `~/.ailive/geo-authority/src/jobs.ts` | createDueDailyRoundJobs/createDueContentRankingJobs 取代 createDueMonitorJobs/createDuePulseJobs |
| `~/.ailive/geo-authority/src/runMonitor.ts` | 拿掉自動排產區塊，加 vacantStreak 更新 |
| `~/.ailive/geo-authority/src/types.ts` | TenantSchedule 全新形狀，PromptDoc 加 vacantStreak |
| `~/.ailive/geo-authority/admin/src/app/(admin)/t/[id]/page.tsx` | 排程表單重寫＋選單單一扁平列表＋11區塊物理重排 |
| `~/.ailive/geo-authority/FOUNDATION.md` | **未動**——這場漏做的收尾，下次要補 |

---

## 下一步

- 觀察日循環實際跑一整週（5個平日）後，`vacantStreak`累積資料是否合理、週五（`contentRankDay`預設）評分排產出來的候選文章是否符合預期——這是全新機制，第一週的真實資料最有參考價值
- FOUNDATION.md 需要補一筆：D13（脈動客戶端曝光時機）已經隨脈動機制退役而失去意義，日循環輪替是新的變動記錄但還沒寫進帳本（這場忙著部署驗證沒來得及回帳本，是唯一漏做的收尾動作）
- reddoor 下週二（monitorDay 週二）觀察一次，確認過渡雜訊真的只發生一次

---

## 卡住 / 未解

2026-08-05 第1場：
無明顯未解——這場所有改動都走完整流程：commit→push→CI綠→deploy→真實訊號驗證。技術債帳本更新到 D13（脈動客戶端曝光時機，顯式養著），但 D13 描述的「脈動」機制當天稍晚就被日循環取代了，帳本這筆記錄現在有點過時，下次動 FOUNDATION.md 時應該補一筆說明脈動退役。

2026-08-04 第4場：
- **等 Adam 裁決兒童角色卡策略**（我建議不露臉敘事：背影/剪影/手部特寫——「離去」主題反而更有力量）
- gpt-image-2 $0.25/張仍是概算，未與 OpenAI dashboard 對帳（FOUNDATION 13A 掛著）
- 影格母圖裁格路徑（`frames/frame-N.png`）同樣覆寫式——這次靠 must-revalidate 擋住但未版本化；若日後出現「影格重生看不見」就是它
- 髒樹：zhu-core `skills/ailivex-knowledge-ingest.md`（別場）、dreamfactory（4 月舊案）——照平行規約未動

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-05 第1場。*
