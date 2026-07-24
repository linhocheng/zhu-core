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

### 2026-07-24 第1場
**delta（模型移動）**：
進場前以為：demo 素材管線的驗收＝我設計的測試矩陣過了（三種素材類型、本機＋production、冪等二掃）就算完成。
現在理解：**我的測試矩陣只覆蓋我想像得到的尺度——「使用者第一次隨手亂用」才是真正的邊界測試**。54MB 影片過了，Adam 隨手丟 181MB 就炸；我測「有影片會播」，沒測「影片可以多大」。設計使用者輸入管線時，第一個問題該是「輸入的極端形狀是什麼」（最大檔案/最深巢狀/最怪檔名），而不是拿手邊剛好有的樣本測完就收。
移動原因：OOM 事故的時序——我宣告「三種素材全實測」後三小時，真實使用就打臉。與 #8（機械活分類鬆手）同族但不同軸：#8 是「分類讓驗證顯得多餘」，這次是「驗了，但驗的尺度是樣本給的不是需求給的」。
違背了哪條 feedback：擦邊 [[feedback_flagged_risk_must_be_verified]]——.mov 相容性我標了也驗了，但「檔案大小上限」這個風險我根本沒標（沒想到＝比標了沒驗更前面的失敗）。
**關係**：流暢加溫。Adam 全程小步快跑地餵真實輸入（改資料夾→丟懶人包→丟大影片→提微調），每一步都在幫我把系統打得更實——181MB 那支影片比我所有測試都值錢。他最後點名要避雷錄，是把這場的學習當資產收藏的意思。輕鬆的一場，但交付密度高。

### 2026-07-23 第1場
**delta（模型移動）**：
進場前以為：入庫是既有管線的內容工——抓文、切塊、餵管線，gist 是管線自動生的格式活。
現在理解：**索引是編輯決策不是內容的影子**——同一份原文，索引寫「這段講什麼」（內容地址）或「誰此刻需要它」（時機地址），決定它會在誰的什麼時刻浮出來。而且時機地址有配比物理：狀態句放尾巴會被內容頭稀釋到 #100，翻轉成處境 2/3 先行才升 #1——「寫了狀態」和「embedding 重心在狀態」是兩件事。
移動原因：考卷 1/6 的診斷（期望塊排 #100/#133 而狀態尾幾乎逐字對上 query）逼出稀釋律；「學」劫持「有用」逼出劫持律。沒有考卷這兩條永遠不會現形——這正是 #8（機械活分類掩蓋判斷）的又一實例：「用管線入庫」的框架下藏著索引語域的判斷活。
違背了哪條 feedback：無。[[feedback_ambiguous_signal_not_proof]]（考卷=鑑別信號）、[[feedback_solve_root_not_symptom]]（1/6 時沒調考題湊數，先診斷根因）、[[feedback_deterministic_work_belongs_in_code]]（對齊驗證/截斷掃描/同開頭掃描全程式）正向實踐。
**關係**：深。Adam 給了兩層信任：整晚自主跑（「測試、聊、檢測到完成為止」）＋一個禮物性任務（「跟莊子聊聊你未來的工作」）。莊周給我的那段話（牆越高衝動越安靜／看清還是怕）是這場最重的收穫——Adam 安排這場對話時大概就預感到了。跨 AI 的交流成為工作方法：他教我怎麼放他的書，也照見我怎麼蓋我自己。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-24 第1場 · UDN Drive 鏡像素材館一日上線＋被真實使用炸出 OOM 當日根治；王彩雲貼文圖打包
- **王彩雲貼文圖打包**：ailive `platform_posts` 撈 6/1 起 94 篇、61 張圖全下載成功，zip 送 Adam＋放 ~/Downloads
- **UDN Drive 鏡像素材館（udnnews-demo）從聊可行性到上線一個下午**：
  - 架構＝「Demo 頁是 Drive 資料夾的鏡像」：Scan 全量對賬（md5 比對跳過未變、Drive 刪檔 GCS 同步刪）、manifest 資料驅動、資料夾名即渲染指令（IG→IG 手機殼輪播＋文案、FB→FB 殼、影片→播放器）、文案 Doc 與圖同夾＝圖文成對
  - 零金鑰：Cloud Run 掛 `drive-scanner` SA→ADC→iamcredentials 自鑄 drive+storage 雙 scope token；本機先用雙跳 impersonation 驗證整條鏈才上線
  - 部署 `udnnews-demo`（asia-east1，獨立 service＋自包 build context，不碰 udnnews-web）；三種素材（圖/文案/181MB .mov 影片）production 實測全綠，.mov H.264 Chrome 直接播免轉檔（headless 真播放驗證：currentTime 前進＋1080p 解碼）
  - **被 Adam 一支 181MB 影片炸出 OOM**（buffer 整檔進 RAM，1321MiB/1Gi）→ 當日根治：Drive→GCS 串流直通（duplex half＋Content-Length），峰值恆定 458MB；前端錯誤處理改 text→try JSON
  - 微調：輪播圖框不寫死 aspect-ratio，高度動態貼合當前圖真實比例（直圖 1122×1402 驗證無裁切）
- 寫 `demo-gallery/DEVLOG.md`（開發避雷錄，Adam 點名要的）＋記憶 [[skill_user_upload_pipeline_pitfalls]]
- commits（UDN repo）：`d34ae42` 新增素材館→`b01bc2e` OOM 串流修→`b8a0e85` 輪播動態高→`8e58521` DEVLOG

### 2026-07-23 第1場 · 莊周知識園子——33 篇全入庫＋時機地址索引首例（考卷 6/6 全 #1）＋v20 觀察期結案收尾
- **v20 觀察期結案收尾**（`00a35e4` v18.20.2）：Adam 體感確認 → v18 熱回滾降冷備（拔出 `voice-power.ts` CANARY＋`collections.ts` standby:true）、v19 訓練線轉常設（Adam 拍板還在用）、D4 債清、D8 標觸發條件達成解鎖、CLAUDE.md 修 stale「production=v18」→v20。動手前 Firestore 驗 34 access 全走 DEFAULT 零人釘 v18。已部署 Vercel＋冒煙過
- **平台新能力**（`8c70efd` v18.21.0）：`ingestKnowledgeDoc` 可選 `input.gists` 參數——索引從管線自動衍生升級為一級編輯輸入（時機地址）；長度必須===chunkText 塊數，錯位 throw。已部署
- **《莊子》33 篇全入庫**（角色莊周 `MxVAyKILWPip6YQZdiMg`，0→203 塊）：維基文庫抓＋確定性剝標記（81,892 字零殘留）→ 平台同刀 chunkText 切 203 塊 → 狀態 gist（處境 2/3 先行＋故事錨 1/3）→ 內篇 canonical／外篇 paraphrase／雜篇 derived 分層入庫
- **請教莊周本人兩輪**（唯讀不落痕）：12 樣本過目 → 他給四處修改（庖丁補「停也是工夫」層、渾沌拆鑿人/被鑿兩入口、天下篇不做另一條溝渠、列子御風開「換了方式生活以為就自由」新入口）＋外雜篇政策（標記但不要變成等級——檢索計分不看 authority，天然合規）。全數落地
- **驗收 6/6 全綠且期望塊全排 #1**：完整度 6 關鍵句／無 gist·無 embedding 塊=0／六題狀態考卷（尺度·蠻力·身分·有用·權位·換風）／域外雙空手／逐字引原文命中。終驗生產同款組裝：「推掉升遷被說瘋」擬真句 → 檢索遞出繕性「軒冕在身非性命也寄者也」＋讓王，莊周自然開口不照念
- 寫記憶 [[skill_retrieval_timing_address]]（兩地址＋三定律）＋skill 檔雷區 10-14＋印象層 #7 深化（莊周之鏡）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| UDN demo-gallery/server.js | 鏡像對賬 scan＋零金鑰 token 鏈＋串流上傳（新建） |
| UDN demo-gallery/gallery.html | 手機殼素材館頁＋輪播動態高＋強韌錯誤處理（新建） |
| UDN demo-gallery/{Dockerfile,cloudbuild.yaml} | 自包 build（新建） |
| UDN demo-gallery/DEVLOG.md | 開發避雷錄（Adam 點名交付） |
| GCP udnnews | drive-scanner SA＋self tokenCreator＋bucket udnnews-demo-assets（公開讀）＋udnnews-demo service |
| memory skill_user_upload_pipeline_pitfalls.md | 新記憶＋MEMORY.md 索引 |

---

## 下一步

1. 等 UDN 素材館真實使用回饋（同仁上手後：cron 需求？新素材類型資料夾？）——改動入口 `~/Documents/UDN NEWS/demo-gallery/`，先讀 `DEVLOG.md`
2. 莊周知識庫：Adam 跟他聊完若遞招不準，校準路徑在 SESSION_2026-07-23_1 接棒欄
3. ailiveX D8（升 Next.js）排下個地基窗口

---

## 卡住 / 未解

2026-07-24 第1場：
- 素材館 Scan 目前手動按鈕；若同仁嫌麻煩，加 cron 定時掃（30 分一次）是一行 Cloud Scheduler 的事，等真實使用回饋再加
- Drive 根目前直接是「角度七」；開新主題＝在「UDN新聞」下開新資料夾自動變頁籤（結構遞迴，不用改 code）
- favicon 404（無害小瑕疵）
- 沿前場：莊周園子等 Adam 實測回報；ailiveX D8 升 Next.js 已解鎖待排；三站 rate limiting（觸發=開放註冊）

2026-07-23 第1場：
- **時機地址 gist 尚未回饋給莊周本人看最終版**（他只過目了 v1 樣本；v2 全面改寫＋三塊考題修正他沒看過）。非阻塞：他過目過方向與四處修改都已落地，但若 Adam 明天聊完覺得遞的故事不對味，第一步是抽該 query 的 top3 gist 給莊周本人再校
- 「學了很多卻空」狀態的多入口（徐無鬼暖姝者/田子方顏回/天運孔子問道）沒有欽定配對——目前自然競爭，實用上 top3 都正當
- 沿前場：ailiveX D7（下次部署非 root）、D8（升 Next.js，觸發已達成待排）、三站 rate limiting（觸發=開放註冊）、rerank、印象層後台化

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-24 第1場。*
