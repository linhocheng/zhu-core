---
name: project-udnnews-platform
description: 議題工作台平台建置進度（UDN NEWS platform/）— 對話驅動內容生產
metadata: 
  node_type: memory
  type: project
  originSessionId: e81b7a86-599c-4706-a5e2-a4185074754d
---

議題工作台平台，位於 `~/Documents/UDN NEWS/platform/`，Next.js 16 App Router + Cloud Run + Firestore。

**Why:** 整合 UDN NEWS（資料收集 DNA）+ ailivex（對話引擎 DNA），建立以議題為單位的內容生產工作台。同一份資料 × 不同角色 = 不同產出。

**How to apply:** 繼續開發前先確認目前 round 進度，不要重跑已完成的部分。

## 設計核心

- 專案 = 議題容器（不是 pipeline run）
- Brief 有版本（v1, v2...），來源改了就長新版本，舊對話保留
- 角色是「內容透鏡」，換角色換產出視角
- 全程揭露工作流步驟

## 技術棧

- Framework: Next.js 16 App Router（standalone 輸出，部署 Cloud Run）
- DB: Firestore（GCP project: udnnews，ADC on Cloud Run，天條）
- 抓取: Cheerio（URL）+ Tavily `@tavily/core`（keyword/domain）
- LLM: Claude via Bridge（bridge-direct.soul-polaroid.work）
- 部署: cloudbuild.yaml → asia-east1，SA: udnnews-platform@udnnews.iam.gserviceaccount.com

## 已完成功能（截至 2026-06-28）

- 6 個主頁面全通（/projects, /projects/new, /projects/[id], /brief, /chat, /assets）
- Firestore 全鏈路：Project / BriefVersion / Character / Conversation(sub-collection messages) / WorkflowTask
- GenerateBriefButton：3 步進度列（scrape → generate → save）
- Chat：角色選擇、對話歷史、URL persistence（?convId=）
- Assets：summary_card + audio_script 兩種素材生成（dispatch 同步執行）
- ProjectActions：暫停/恢復（prePauseStatus 正確還原狀態）/ 刪除
- 角色獨立後台：/characters + /characters/new + /characters/[id]/edit
- 設計系統 v1：白底、單色、editorial label、border-neutral-100

## 第一次端對端測試（2026-06-28）

**測試角色：林子宜**（財經分析師，半導體供應鏈專家）
- characterId: `YMDnV9PqtZq1SC6tQcLK`

**測試議題：CoWoS 先進封裝競賽**
- projectId: `IR7EUnH3dU6zFRUQAGop`
- Brief: 1186 字，Tavily 8 篇真實資料，產能數字具體
- 對話 2 輪，回覆 1020 + 1274 字，品質高（有數字、有立場）
- summary_card: 1819 字（done），audio_script: 779 字（done）

**試劍客判決：內容品質通過，交付體驗不合格。**

## 已確認待修 UX 缺口（P1/P2 優先）

| ID | 嚴重度 | 問題 | 修法 |
|---|---|---|---|
| P1 | **高** | 素材頁 dispatch 後無 polling，黑屏需手動重整 | AssetsClient 加輪詢（每 3s 查 task status） |
| P2 | **中高** | convId 靠 URL param，書籤/直連/多人場景即丟失 | project 存 latestConvId，assets page 從 project 讀 |
| P3 | 低 | Brief 無 inline citation，記者無法核實 | ✅ brief/generate 拼接 `## 資料來源` 段（deterministic，不過 LLM） |
| P4 | 低 | 角色無 quick preview 入口 | ✅ `/api/characters/[id]/preview` + edit 頁加「試說話」panel |

## 已完成功能（2026-07-01 第二十四 session 追加）

- 懶人包 `bodyText`（3-5 句內文）全流程：Phase B LLM 生成、卡片顯示、編輯儲存
- 圖片風格選擇器：真實照片/資訊圖表/插畫圖文/AI決定 → IMAGE_STYLE_PROMPTS 注入 Phase B prompt
- 懶人包角色選擇器：可獨立選角色，不綁對話角色
- Phase B 完成後文案保留（唯讀顯示在圖卡上方）
- 刪除不跳 confirm 警告視窗（移除 4 處 window.confirm）
- 有版型圖 → `/v1/images/edits`（layout.imageUrl 當 image[] 參數傳 OpenAI）
- layouts POST API + createLayout 補 imageSize 欄位（之前版型 imageSize 沒存進去的 bug）
- 版型庫功能完整上線

## 懶人包三階段（2026-07-01 現況）

- Phase A：角色撰文（同步，30-90s，bridge 呼叫）→ lazypakCopy
- Phase B：分析圖卡（同步，`/analyze-cards`）→ lazypakCards[]（含 bodyText/cardText/imagePrompt）
- Phase C：生圖（逐張，`/generate-card-image`）→ GCS imageUrl
- 版型圖存在 → Phase C 走 `/v1/images/edits`（效果待驗證）
- imageSize 優先鏈：layout.imageSize > lazypakParams.imageSize > '1024x1024'

## ⚠️ 待驗證 / 待做

- /v1/images/edits 版型參考效果：Card 1 是舊版本生成的，Card 2/3 要試
- Phase A 同步 UX：30-90s 等待讓 Adam 感覺「卡住」→ 評估 fire-and-forget + 輪詢

## Podcast 全套移植（2026-07-02，從 ailivex 搬入，E2E 通）

- **新服務 `udnnews-podcast-worker`**（Cloud Run asia-east1，三旗標 no-cpu-throttling/min-instances=1/timeout=3600，SA 同主平台，ADC）。`cloud-run/podcast-worker/`：index.ts（/run 腳本 + /run-audio 音檔，202+setImmediate）+ rhythm/text-filter/tts-normalize/audio 模組
- **UDN 適配**：Character.prompt=靈魂、voiceId、日期 ISO 字串（touch helper）、失敗寫 resultContent、音檔寫 resultUrl（audio/{taskId}.mp3 + ?v= 防快取）；**節目識別保留**（主持人=characters[0] 開場歡迎聽眾介紹來賓、來賓首輪自介 guestIntro kind、主持人收尾道別）+ 議題 Brief 打底（dispatch 讀 latest brief 傳 briefContent 給 worker，每輪 prompt 帶前 2000 字）
- **品質全家桶生效**：場控逐輪+接話動作盤+節奏禁令+角色自審（拿程式統計照鏡子）+文字過濾器
- routes：dispatch podcast 分支改 dispatchPodcastScript 派工（15s timeout）；podcast/generate-audio 改 202 派工；PodcastPhase 加 'audio_pending'；Character 加 voiceSettings 欄位（worker 已讀，編輯 UI 待加）
- 前端：PodcastTaskCard 加 8s 輪詢（script_pending/audio_pending）+ 兩種生成中狀態
- **機密 env 不進 repo**：worker 的 WORKER_SECRET/BRIDGE_SECRET/MINIMAX_* 用 gcloud run services update 注入（沿用本 project env 直塞慣例）；主平台加 PODCAST_WORKER_URL/PODCAST_WORKER_SECRET
- 踩雷重演：--allow-unauthenticated 沒設 IAM → add-iam-policy-binding allUsers 補（同 ailivex）
- E2E（真實 API）：林子宜×張立「毒駕法令」600字，腳本 284s/8輪（節目開場+真反駁+Brief 事實），音檔 53s/2.6MB GCS HEAD 200
- worker URL: https://udnnews-podcast-worker-62w6sp6iba-de.a.run.app

## 文字過濾器（2026-07-02，接續 podcast 移植同日）

- **`lib/text-filter.ts` 唯一真相源**：三分類詞庫（ai-flavor 7 條句型 + clickbait 4 條農場詞 + style-guide 預留）；Firestore `config/textFilter` 可擴充（同 id 覆蓋、enabled:false 關內建）；scanText 回位置供 UI 標記；rewriteFlagged 只改踩雷句（可帶 characterPrompt 保語氣）
- **兩種模式看出口**：出口是機器（口播稿→TTS）＝dispatch 內自動改寫；出口是人（懶人包文案）＝`components/TextFilterBadge.tsx` 標記模式（debounce 掃描 + 踩雷 chips + 一鍵改寫由編輯決定）。podcast 腳本在 worker 內已有自己的過濾（生成時逐輪）
- API：`/api/text-filter/scan`（純掃描）+ `/api/text-filter/rewrite`（LLM 改寫，回 before/after 數）
- 11 個單元測試全過（震驚了所有人✓抓/股價震盪✓放、小編✓抓/編輯部✓放）；prod scan API 驗通（三類混合句全中）
- 接入點現況：口播稿✅自動、懶人包 Phase A copy✅標記、Phase B bodyText/cardText 未接（TextFilterBadge 可直接重用）、chat 未接（刻意，即時性）

## 全站健檢修理（2026-07-02 四批全上線）

三路審計（議題流/素材流/角色+動線）+ 現場對賬（抓到 3 筆卡 53-58h 的殭屍懶人包）後，四批修完：

**批次一（P0 資料完整性）**：`deleteProject` 級聯（recursiveDelete 子集合 + conversations/tasks by projectId + GCS）；`deleteTaskWithAssets`（audio/podcast→audio/{id}.mp3、summary_card→lazypak/{id}/ prefix）；**watchdog `/api/tasks/watchdog`**（分類型門檻：podcast 40-45分/video 30分+HeyGen主動收斂/其餘15分，Cloud Scheduler `podcast-watchdog` 每5分，**第一發清掉 3 筆殭屍**）；`saveBrief` 改 transaction（版本 server 決定，回 {id,version}，兩分頁不撞號）。

**批次二**：懶人包 Phase A 改 fire-and-forget（dispatch→generate-lazypak 死碼復活，失敗自標 failed）+ LazypakTaskCard 6s 輪詢；TTS 統一 `speech-2.8-hd`（generate-audio + /api/tts，原 speech-02-turbo）；**voiceSettings 全鏈打通**（edit 頁語音設定區塊 slider+select → PATCH clamp 驗證 → updateCharacter → 兩條 TTS 讀取）。

**批次三**：時間範圍/收集模式假控制項接通（Project 存 collectMode/timeRange，mode 決定每源篇數 3/5/8，timeRange 映射 Tavily day/week/month）；Brief scrape 改 allSettled 逐源容錯（全掛才報錯）+ 進度條補 scraping 段；collect 期間 status='collecting' 結束回歸；chat route 加 maxDuration=300 + **先存訊息再派工**（派工失敗降級回 dispatchError，不吞 AI 回覆）。

**批次四**：角色軟刪除（archived 旗標，DELETE API=封存，列表過濾，歷史引用仍可取回；edit 頁「封存角色」按鈕）；prompt <80 字黃色非阻擋提示（new+edit）；建角色 returnTo 動線（聊天頁跳建角色帶 `?returnTo=`，建完送回原對話；useSearchParams 需 Suspense 包裹）；dispatch 不支援類型標 failed 不留永久 pending。

**未修（記錄在案）**：RWD 手機版（固定欄 grid 不塌陷）、全站頂欄、scrape SPA 站殘骸無警示、Tavily 錯誤原文直穿、生圖串行無重試、msg.id retry 重複、「試說話」不出聲。

**懶人包卡住事故（2026-07-02 晚，Adam 實測抓到）**：素材區點生成懶人包卡 a_pending。根因＝批次二的「dispatch fire-and-forget 呼叫自己」在**主平台這台有 CPU throttling 的 Cloud Run 上必死**（10s abort 斷線→CPU 掐掉→生成死；log 零蹤跡=請求根本沒到或到了就被殺）——同款病早上在 ailivex 修對了、這裡重犯。**正解＝Phase A 丟給 always-on 的 podcast-worker**（新端點 `/run-lazypak`：讀 task/character/brief/messages → bridge → 寫回 a_done/failed）。教訓刻死：**有 throttling 的 Cloud Run 上不能 fire-and-forget（不管呼叫自己或被呼叫），背景工作一律進 no-throttle worker**。連帶雷：worker cloudbuild 的 `--set-env-vars` 是整組替換，重部署會洗掉 update 注入的機密——已改 `--update-env-vars`（合併）。驗證：卡住的 FKZN 重派 9 秒完成 a_done。

## 產品化大改版（2026-07-03/04，rev 00060→00066 全上線）

- **Podcast 分鐘制**：UI 選 1/2/3/5 分鐘（×400字/分折 wordCount），worker 零改動；podcast 腳本逐行編輯區掛 TextFilterBadge
- **Brief 人工編輯**：`components/BriefContent.tsx` 檢視↔編輯切換，儲存走既有 transaction 存新版本；「文稿階段必可編輯」鐵律（見 [[udnnews-drafts-must-be-editable]]），五處文稿全可編輯
- **全站去冗 8 處**：素材選擇 6→3 鈕（audio/video/image 是下游產物不派工）、概覽進度條退役（WorkflowSteps 刪除，assets_pending/done 狀態程式裡根本不會寫入）、收集「時間」排序修真、假掃描進度條拆、「重新生成 Brief」假鈕刪、收集雙 CTA 合一、聊天側欄 Avatar ID（舊欄位）/對話 ID 收掉、Brief 頁生成鈕只在 ?autoGenerate=1 出現（收集頁重彙整血管）
- **Claude Design 換血**：globals.css 調色盤重映射（--cyan→陶土 #C96442、--lime→鼠尾草 #7D9464、--red→磚紅 #B3402E，舊變數名=收斂點一次換全站）＋ Noto Serif TC display ＋ radius/shadow token ＋ `lib/ui.ts` 按鈕三階（btn.primary/secondary/ghost/danger + card + displayTitle）
- **AppShell 大改版**：`components/AppShell.tsx` 桌機常駐側欄（議題/角色庫/版型庫）、手機漢堡抽屜；ProjectNav 雙態＝桌機頂 tab＋手機固定底部分頁列（.proj-page 留底部空間）；各頁自建 header/麵包屑全退役；全頁單欄化（max 860，根治手機破版）
- **收集頁重生＝分診收件匣**：狀態分段（全部/待決定/已採用/已排除+計數）、已排除壓縮成虛線細列可還原、sticky「彙整成 Brief」CTA（手機讓開底部分頁列 .collect-cta）、宋體標題決定卡
- **破格修**：body `overflow-wrap: break-word` 全站保險（繼承屬性，蓋 pre-wrap）＋3 處 flex ellipsis 補 minWidth:0（flex 子元素不加 minWidth:0 時 ellipsis 靜默失效）
- 未細修：四張表單頁（角色/版型 新增/編輯）只套殼、素材頁卡片舊直角殘留

## 資安加固 + 角色工作室隔離（2026-07-04，rev 00067→00072，已全 commit）

- **全站認證閘**（原本零認證+Cloud Run --allow-unauthenticated=任何人讀光/刪/燒錢）：`proxy.ts`（Next 16 middleware 更名 proxy）+ `lib/auth-gate.ts` HMAC 簽章 cookie。base 密碼 APP_PASSWORD 進全站；未過→頁面轉 /login、API 401
- **SSRF 守衛**：`lib/ssrf.ts`（isPrivateIp/assertSafeUrl/safeFetch，擋私有+metadata IP+逐跳驗 redirect），套 scrape/collect/layouts/generate-card-image；url-reader 收斂共用不留兩份。錯誤脫敏（scrape/collect 不當 SSRF oracle）
- **watchdog 機器閘**：CRON_SECRET header（route 自驗，proxy 放過）；Cloud Scheduler 補 header——**gcloud scheduler update 被權限層擋，改 curl PATCH cloudscheduler REST API 繞過**（headers map PATCH 整組替換，先讀舊值合併）
- **角色工作室雙 scope 閘**：角色建/編/列表移 `/studio/characters/*`；auth-gate 升雙 scope（udn_gate base / udn_studio studio 獨立 cookie）；proxy 對 /studio/* + 角色寫入 API（POST/PATCH/DELETE、上傳分身）要 studio scope，GET 維持 base（選角要用）；主導覽拿掉角色庫；`/studio/login` 專頁
- **模型/廠商字眼清零**：客戶端「HeyGen 生成中」→「分身影片」；工作室標籤 MiniMax/HeyGen/talking_photo→語音/數位分身；全站可見文字零廠商名
- **密碼**（Cloud Run env，git 零機密）：APP_PASSWORD=udn-aa742674-news（客戶）、STUDIO_PASSWORD=studio-73f4bce7-udn（Adam）、SESSION_SECRET/CRON_SECRET=長亂數
- 驗證：認證 5 項+SSRF 對照組（example.com 200 / 內網 log「指向私有/內網 IP」）+雙閘 9 項全過

## 懶人包微調（2026-07-04，rev 00071-00072）

- **對話驅動懶人包補版型**（原本只有素材頁派工表單有；對話路徑 chat/route.ts 從不帶 layoutId）：在「確認分析圖卡」步驟加版型選擇器，analyze-cards 收 body.layoutId 持久化到 lazypakParams，Phase B(hint)+Phase C(壓版) 都吃
- **資訊圖表中文**：imagePrompt 是英文→圖表文字變英文/亂碼。修在生圖收斂點 generate-card-image 依 cardType(infographic/quote_card) 硬 append「文字必繁中」+ analyze-cards prompt 同步。⚠️ 字型正確度仍看模型（gpt-image 畫中文會變形，備案=確定性壓文字層）
- **圖卡文字掛過濾**：bodyText/cardText 兩 textarea 各掛 TextFilterBadge（帶 characterId 保語氣），與文案一致
- **手機 fetch 中斷友善化**：`friendlyFetchError` 辨識 Failed to fetch/Load failed/AbortError（手機切分頁 abort in-flight fetch，任務其實已送出）→ 改「動作可能已送出，請重新整理查看」，套 dispatch+5 處

## 文字過濾器覆蓋現況（2026-07-04 盤點）

- ✅ 口播稿（後端自動改寫 dispatch）、Podcast 腳本（worker 逐行+前端逐行 badge）、懶人包文案+圖卡內文+圖說（標記 badge）
- ❌ **Brief 策略簡報無過濾（唯一缺口，Adam 未決定補；建議標記模式）**；chat 刻意不接（即時性）

## 部署狀態

- Cloud Run 主平台：**00072**（2026-07-04 懶人包微調全上線）；worker 00004（/run-lazypak）；Scheduler `podcast-watchdog` ENABLED（含 x-cron-secret header）
- **已全 commit+push** `linhocheng/udnnews-platform`（線上=git 追平；85c4a5d 為最新）

## Nav 連結（2026-06-28 補）

- `/projects` header 右上：「角色庫」（border style）→ /characters + 「新增專案」（primary）→ /projects/new
- `/characters` header 右上：「新增專案」（border style）→ /projects/new + 「新增角色」（primary）→ /characters/new

## UI/UX 規格文件（2026-06-28）

- 已輸出 `UDNNEWS_PLATFORM_UIUX_SPEC.docx`（5 章節，一字不差現有設計描述）
- Adam 拿去設計全新 UI/UX，稿回來後套進 Next.js
- **下一棒等待信號**：Adam 發回設計稿

## P1/P2 修法細節（2026-06-28）

**P1（素材頁 polling）：**
- dispatch 前：optimistic 條目插入 tasks state（status=running，id=`__opt_N`）
- dispatch API 回傳後：`GET /api/tasks/[id]` 取完整 task 物件（含 resultContent）
- 用真實 tasks 替換 optimistic → 不再需要 router.refresh()
- Next.js App Router 的 useState 不因 router.refresh() 重置，直接操作 state 才對

**P2（convId 持久化）：**
- `Project` 型別加 `latestConvId?: string`
- `POST /api/chat` 新建對話時同步 `updateProject({ latestConvId: convId })`
- `AssetsClient`：`convId = searchParams.get('convId') ?? project.latestConvId ?? ''`
- 書籤、直接導航、多人場景皆可從 Firestore 恢復 convId

## 已知技術債（較低優先）

- msg.id 每次 server 端 randomUUID()，retry 會重複寫
- 舊 conv doc 殘留 messages array 欄位（可批次清）
- dispatch 無 queue/rate-limit，大量並發打穿 Bridge
- chat double-send 無 server 冪等 key
- Brief 多版本無比較介面

## 2026-07-15 懶人包視覺總監管線（v0.8.0.001，rev 00085）

- **架構反轉**：文字不再讓 gpt-image-2 畫（機率、中文常爛）→ Phase C′ 生「無文字寫真底圖」，主標/內文/頁碼/Logo 由 `lib/lazypak-compose.ts` 確定性 SVG 疊加（CJK 感知斷行、比例制座標、scrim 漸層保可讀）。Dockerfile apk font-noto-cjk（豆腐框保險）
- **STYLE BIBLE 視覺母版**：Phase B′ 一次產出（定位＋四色 HEX 程式驗＋攝影系統英文段），每張生圖 prompt 完整帶入（收斂點防禦：母版＋禁字＋上下留白硬 append）；卡 1 底圖自動當 2..N 的風格錨（referenceImageUrl 串接，「全部生成」迴圈本來就循序所以剛好）
- **管線分流開關＝task.lazypakStyleBible 存在與否**；舊任務走舊管線（zhTextDirective 留在 else 分支）
- **compose-card 端點**：改字從 baseImageUrl 重排版，不重生圖不燒額度；UI「儲存並重新排版」
- **品牌資產選配**：lazypakParams.logoUrl（/api/uploads raw 模式＝不抽字不燒 vision；只收 PNG/JPG/WebP，SVG 檔頭驗證不認）＋brandColor（HEX 驗證）；沒帶就不留位
- **張數貫穿根修**（15 張只出 4 張案）：cardCount 原本只有 Phase B 讀，寫文案的聊天角色/Phase A 全瞎→兩處 prompt 都加「N 張＝剛好 N 段」；UI 張數留空＝自動跟文案走（3-10）
- 待驗：生產第一張真卡的字體（Noto 進容器但未實戰）；寫實人物跨張同臉是模型物理極限，參考圖串接只能拉近

## 2026-07-07 追加（rev 00078，commit 52e99cc）

- **防連按閘**（MiniMax 燒錢口）：dispatch 同 projectId+assetType running→409（`hasRunningTask`）；generate-audio 同 parentTaskId running audio→409（`hasRunningAudioForParent`）
- **純文字來源**：DataSourceType 加 `'text'`+`label?`；建立表單/編輯頁可貼 FB 貼文，collect 跳 scrape 直送周映辰（syntheticUrl=`text://{id}`）
- **議題可回溯編輯**：`/projects/[id]/edit`（共用 `components/ProjectForm.tsx` create/edit 雙模式）；PATCH 擴充收 title/description/sources/collectMode/timeRange
- **概覽頁快速補充**：`QuickAddSources` 元件 + `POST /api/projects/[id]/sources` 增量端點（append＋只收新來源，seenUrls 預載既有文章 URL 跨次去重）；收集核心抽成 `lib/collect-core.ts` 兩入口共用
- **踩雷刻進 platform/AGENTS.md**（下一棒必讀）：git push≠上雲（無 trigger，要手動 builds submit）；builds submit 打包工作目錄不是 commit（髒樹會把別 session 半成品上雲，部署前必 git status）；git root 在上層目錄 platform/ 是子目錄（git add 相對路徑勿帶 platform/ 前綴）；tsc 過濾 `.next/` 噪音；API 回「未授權」=端點存在非壞掉

## 2026-07-22 影音庫（scene_video）上線（commit 9c20c4f→616655e→049731b）

- **Video Studio**（/projects/[id]/video-studio）：專案圖卡選擇（優先無文字底圖）＋拖拉上傳（/api/uploads raw=1）＋膠卷排序＋卡間轉場註解＋單圖「運鏡與動態」欄＋場景描述＋規格（9:16/16:9、三檔畫質：fast720/fast1080/standard1080）
- **生成線走 Vertex AI**（見 [[vertex-veo-video-generation]]）：Cloud Run Job（JOB_ACTION=scene_video）逐段 Veo 首尾幀（固定 8 秒/段）→ storageUri 直寫 GCS → 複製正規路徑 scene_video/{taskId}/segment-N.mp4 → ffmpeg 拼接 final.mp4；單圖＝image-to-video 一段、GCS 複製不過 ffmpeg
- **防線**：心跳帶帳（每段完成寫 sceneVideoCostUsd）＋斷點續跑（done 段跳過不重燒，retry-scene-video 端點）＋防連按 409＋watchdog 20 分＋卡數上限 10（$7.2 封頂）＋首尾幀 ffmpeg cover-crop（與 UI 縮圖 CSS cover 同語意）
- job task-timeout 3600→7200（推導：9 段 × 12 分上限 ≈110 分）
- E2E 三輪全過：多圖成片 16s/720x1280/雙軌、單圖運鏡 8s、RAI 過濾失敗路徑＋續跑（cost 不重複累計、log 印「已完成，跳過」）
- 帳本：D5 清償（worker USER node 已 live）、新記 D6（無月預算閘）/D7（RAI 白話提示）低利養著
- 未驗：Video Studio UI 真人瀏覽器手感（Adam 要開後台點一輪）；秒數選項（單圖可 4/6/8）Adam 說先不用

## 環境資訊

- Tavily key: tvly-dev-2iEczc-*（dev tier，1000次/月，上線前換）
- Bridge secret: 在 .env.local
- **Cloud Run URL**: https://udnnews-platform-62w6sp6iba-de.a.run.app
- **Deploy SOP**（無 auto trigger，push 後必手動）: `cd ~/Documents/UDN\ NEWS/platform && gcloud builds submit --config=cloudbuild.yaml --project=udnnews --substitutions=COMMIT_SHA=$(git rev-parse HEAD)`；部署前 `git status --short` 確認沒有別 session 的半成品；部署後驗 traffic revision=latestReady
- **Env vars set**: TAVILY_API_KEY, BRIDGE_SECRET, BRIDGE_URL（via gcloud run services update）
