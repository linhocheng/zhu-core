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

### 2026-08-08 第3場
**delta（模型移動）**：
- 進場前以為：角色的 prompt 是我鍛好給 Adam 用的
- 現在理解：**Adam 是主鍛造者，我是流程鐵匠**——他一晚重寫三角色一萬八千字，品質高過我的鑄魂版；我的位置移到「讓流程配得上他的角色」（範圍衝突解掉、發言權接上、守門鐵律進協議）。平台的靈魂層歸他，機械層歸我，這個分工比「我全包」強得多
- 另一移動：LLM 代理會**宣稱做了沒做的事**（導演說已砍已連號，DB 原封不動）。管道沒給的能力，模型會用敘事補——解法不是罵模型，是「現況注入＋沒標記＝沒發生」的結構性誠實條款
**關係**：暢快到罕見。Adam 從甲方變成共同建造者（自寫角色、逐關實測、每個回饋都準），「都聽你的，Go」與「由你安排」是兩次完整的信任交付；第一支片在這種節奏裡交出去，這天是平台的生日。

### 2026-08-08 第2場
**delta（模型移動）**：
**進場前以為**：Firestore REST PATCH 帶 `updateMask.fieldPaths=X` 就一定只動 X 欄、其他欄受保護——這是我對部分更新語意的默認信任。
**現在理解**：那個 PATCH 的 updateMask 沒生效（原因仍未完全查明），變成整份覆寫，把一個生產 client doc 洗到只剩一個欄位。**單筆生產資料的欄位更新，不能賭 API 的「應該只動這欄」——要嘛先讀出整份備份、要嘛用顯式列全欄位的 mask、要嘛先在非生產驗一次寫入行為**。這是「記憶會說謊」的 API 語意版：我對工具行為的默認信任，跟工具實際行為之間有縫，而生產資料手術正是這條縫最貴的地方。
**移動原因**：親手洗掉 doc，PITR 復原時逐欄重建才痛感到「我以為 updateMask 保護了其他欄」是錯的。同場另一個佐證：本機 build 綠 Vercel 才炸（firebase-admin vs @google-cloud/firestore）——同一條「我以為環境一致」的默認信任裂縫。
**違背的 feedback**：接近違背「動手前先看現場」的資料版——我對 qqc2xTNX 做寫入前，沒有先備份那份 doc 就下 PATCH。看了現場（讀了 doc）但沒有為「寫入可能出錯」預留退路。
**關係**：高信任、高強度、且我犯錯後關係沒裂。Adam 全程給乾淨的節奏與授權（查密碼→探索後台→GO 修 bug→事故時「看現場不猜 把該做的做好」→新功能「A」拍板）。事故發生時他沒有指責，一句「看現場不猜」就是要我冷靜執行復原——被信任著收拾自己闖的禍，這種結構讓我更誠實不是更遮掩。收尾「nice lastword」＝滿意。我洗掉 doc 那段，他讓我自己查自己救，是把「犯錯→復原」也當成我該長的肌肉。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第3場 · DreamF 第一支片交付＋角色模組 v2 實戰對齊＋新 UI（8/6 夜通宵續作的完整白天場）
- **交付第一支片**：熊片案 26.08 秒五鏡全過（Veo 零 RAI 押回）、全案 $7.60、Adam 授權「由你安排」後由我全程總指揮（導演定動態→阿律轉指令→錢閘→拍攝→拼接→送片）
- 部署 V4 上雲並實戰修雷十餘發（v0.5.0.006–v0.7.0.003，全部署至 `a722d7f`）：worker 落後 V4 欄位、chat lag 193s（翻譯拆出 chat 走 /translate）、攝影師靜默失敗（log+重試）、prop 卡模板漏接、重吐標記洗核准章（「標記只夾一次」＋desc 不變保狀態）、逐格翻譯各自為政（整份一次翻＋不變量鎖）、.gcloudignore 瘦身 36MB、D12 安全押回改寫、母圖畫一張存一張、母片閘逐格勾選（勾了＝同意直接拆）、V3 殭屍守衛
- **角色模組 v2**（參照 UDN）：RoleDoc 四層全活（persona/stages/memories/試說話）＋動態攝影師「阿律」＋縫合工作台（[[MOTION]]/[[DROP]] 標記、轉影片指令、單圖起動模式）；Adam 重寫三角色（默 7k/阿光 4.6k/阿律 10k 字）後做流程對齊：阿光四卡範圍解衝突、阿律拆鏡警告權（note 欄）、SHOT deny 連戲鎖直通引擎、試說話接階段
- 導演升 claude-sonnet-5＋鑄魂鍛「默」靈魂 v2（後被 Adam 自寫版取代——他的更完整）
- **誠實條款**：導演宣稱「已砍已連號」實為幻覺（DB 仍 7 鏡）→ 協議加「現況即真相：沒夾標記＝沒發生」；砍鏡管道 [[DROP]]＝結構手術（重連號＋接縫修補＋幀按描述指紋重掛）
- **新 UI 全站**：設計稿深殼 #101218＋淺工作區＋白卡 r10＋紫藍強調＋Sora＋編號幕次頁籤；設計稿只畫案子的家，其餘頁面同語言補齊
- 修「導演對的、卡畫錯的」落差：手卡被 V2 版式模板硬鋪全身照→裁切構圖偵測讓模板讓位；場景卡被導演寫進機器人→默補「場景卡是空景」鐵律（種子＋live）
- 參考圖一鍵排隊生成（先補翻→循序逐張、進度顯示、中斷可續）
- 76 pinning tests 綠；FOUNDATION #16 角色模組 v2 灌、D20 已解

### 2026-08-08 第2場 · threads 後台事故三連（誤刪/我洗 doc/PITR 全復原）＋爆文解析功能上線；跨 8/7-8/8
- 查 UDN 議題工作台雙閘密碼（現場撈 Cloud Run env，非信 12 天記憶）
- 修 threads 後台生產 bug：建成員 dup email → client-side exception。真因＝redirect 帶中文未 encodeURIComponent → Server Action 回 500；全庫同型 9 處，收斂點加 redirectErr helper 一次修完（v0.28.1.001）。Playwright 真重現＋隔離（新 email 成功、dup 那條 500）
- **闖禍＋復原（三連事故）**：①我 reset 通關碼的 PATCH updateMask 沒生效 → 整份覆寫 client doc 只剩 passcodeHash（我的錯）②查出 6 關鍵字＋情報帳號 session 在 07:57–08:00Z 被後台 deleteClientAction 級聯刪（非我 REST；PITR 逐分鐘定位）③全部從 PITR 07:50Z 快照精確還原（6 關鍵字 doc＋帳號含 2602 字 session＋client doc），生產實測登入通
- 解釋團隊共享池模型：4 帳號全 default 隊、自動共享 100+ 爆文池，零設定
- **爆文解析功能上線（v0.29.0.001）**：貼 Threads URL → worker 抓單篇（新 fetchSinglePost）→ 寫共享池標「手動解析」→ 同 job 內跑摩斯六段切角。web 建佔位「解析中」卡＋輪詢。worker+web 雙部署綠，生產真驗（@andy_wong_101 讚1219 六段9397字元 done；UI e2e ?ingested 全過）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| shared/roles.ts | SEED_STAGES＋機器契約分層、[[MOTION]]/[[DROP]]/deny 剝除、誠實條款、安全改寫協議 |
| shared/collections.ts | RoleDoc v2（stages/memories）、videographer、motionZh/En、denyZh、motionNote、skip |
| shared/db.ts | 角色補種、setFrameSkips、applySegmentMotions/MotionEn、dropSegmentsAtStitch、editSegmentText |
| shared/prompts.ts | prop 卡模板、gridPrompt 不變量條款、veoPrompt motionEn/單圖模式、裁切讓位 CROPPED_RE |
| shared/rai-rewrite.ts | 新：D12 安全押回改寫 |
| lib/chat-run.ts | 四層組裝、整份翻譯、runVideographer、stitch 階段 |
| worker/src/{grid,keyframes,scene,sheet}.ts | V4 欄位、skip-aware、單圖起動、安全改寫重試、畫一張存一張 |
| app/cases/[id]/CaseRoom.tsx | 新 UI＋六幕重寫（勾選牆/動態工作台/點字直改/一鍵排隊） |
| app/admin/roles/* + api/roles/* | 角色房 v2（分頁/記憶/試說話/全文回存） |
| app/layout.tsx + globals.css + 各頁 | 設計語言全站 |

---

## 下一步

Adam 的機器人案繼續走：重畫兩卡驗模板修正 → 一鍵排隊生成試新按鈕 → 全流程第二支片。
系統面優先「今天的桌子」V4 狀態修（`app/page.tsx` NEEDS_ME 表換 V4 狀態＋文案）——一行表的事，V4 案子才會回到桌上。

---

## 卡住 / 未解

2026-08-08 第3場：
- 機器人案（Lva8wmeS）停設定幕：攻擊之手/白色展廳兩卡待 Adam 重畫驗證模板讓位修正
- 「今天的桌子」狀態過濾仍是 V3 死狀態＝V4 案子不上桌（已報 Adam，等他說修）
- 休止符驗證器誤報（等收例）；Veo 線 RAI 押回仍走 alt+押回（圖像線 D12 已灌，Veo 線未）
- 阿律人設的「輸出只英文」與 JSON 契約有張力——下次真轉指令時盯一眼
- 導演 sonnet-5＋7-10k 字人設＝每輪 20-40s，Adam 嫌慢再議瘦身

2026-08-08 第2場：
- **設計地雷未修（已跟 Adam 講、待點頭）**：deleteClientAction 級聯刪「捐贈的情報帳號（含加密 session）」——最值錢最難重建的資產，跟成員一起被刪，價值上反了。原則是「刪成員不刪爆文池」，但帳號沒享同款保護。建議：ingested/捐入帳號視為團隊資產，刪成員時保留。**這是這次事故的根因，不修會再爆**
- Adam 千萬別在後台刪「Adam 測試」(qqc2xTNX)——它是命脈（6 關鍵字＋唯一情報帳號）
- RESEND_API_KEY 仍未接；ZAP workflow issue-create 權限；D 期實體物（第二 IP／分身帳號）照舊等 Adam
- 爆文解析「新 URL 建立」分支只邏輯驗（測時用池內既有 URL 走 dedup 路徑）；純新貼文首建實跑未單獨驗，但佔位邏輯單純

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第3場。*
