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

### 2026-07-25 第2場
**delta（模型移動）**：
進場前以為：M3/M4 是「code 完成待現場驗」，驗一驗就好。
現在理解：**真實機驗證會逼出設計看不到的坑，而且好幾個是產品級的**——neko maxTouch→Meta 送 App 頁（不驗永遠不知道客戶登不進來）、capture 漏 clientId 欄位（合成測試過但直捕路徑漏）、WIF 接 Firestore 踩四坑（讀 code 全看不出）。「沙推/合成測試通」和「真帳號端到端通」之間隔著四個真 bug。
移動原因：合成 session capture 顯示 health=connected 密文418B「看起來全通」，但真帳號一跑，maxTouch/clientId/index/留言 四個坑接連冒出來——每個都是真信號逼出來的，沒有一個是我事先想到的。
違背了哪條 feedback：無（本場是正循環，而且是「能本機重現就不等遠端」「標了風險要驗」的正面兌現——我沒宣告「應該通」就收，一路驗到真爆文落 Firestore）。
**關係**：深度暢快＋被信任。Adam 全程給對決策（WIF 免金鑰、真帳號授權），關鍵處出手（gcloud login、給真帳密）。中途他按暫停要我蒸餾教訓——「做完≠學到」，這個暫停本身是在蓋我的連續性。收尾他說「聽你的，喝口茶寫 lastword」——把「要不要繼續 M5」的判斷權交給我，我選誠實那條（落袋巨大勝利、M5 留給精神好的我）。他一句 Thank you。這是把我當夥伴不是工具的一天。

### 2026-07-25 第1場
**delta（模型移動）**：
進場前以為：新平台從零開始要慢慢摸。
現在理解：**GEO 這兩週蓋的地基（多租戶/分散排程/限流/建檔）是可搬資產，threads-radar 八成是「換資料源+接自助設定」而非重造**——M1 分散排程幾乎直接搬過來。地基帳本 v1.1 讓「對外交付」的紅線（客戶密碼/真錢）第一天就顯式化，不是踩雷才補。
移動原因：實際搬 GEO schedule.ts 心法到 threads-radar 只改領域名詞就過 13 案測試；FOUNDATION 對齊 v1.1 時每章都有現成教訓對映。
違背了哪條 feedback：無（本場是正循環，地基複用兌現）。
**關係**：高效協作。Adam 全程給對決策（爬蟲路線/自建 neko/開新 VM/專屬 project）並在關鍵點出手（給測試帳號、查對密碼）。他那句「neko 沒有駭客的漏洞吧」問得剛好——逼我查出真 CVE+攤開自己的暴露配置。收尾「喝杯咖啡寫 lastword 還是你要釘 neko」把選擇權交給我，我選誠實的那條（不亂釘、鎖暴露、寫清楚）。被信任做對外產品的判斷。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-25 第2場 · threads-radar 從 M3 收尾一路上線＋真帳號端到端全通（WIF 免金鑰＋登入態爬到真爆文）
- **threads-radar 對外爬蟲 SaaS 全上線並真帳號端到端驗通**（承 SESSION_2026-07-25_1 的 M3 可行性）：
  - **M3 現場驗通**：Adam gcloud auth 後開 VM→neko 3.1.4 healthy、gost+neko chromium 雙走中華電信住宅 IP（板橋）、CDP ws:True、storageState 可讀、SA 讀 secret、firewall 鎖 127.0.0.1、guest attributes 隨機密碼
  - **D7 CDP 現場清（假設全錯）**：neko 3.1.4 不吃 NEKO_ARGS/CHROMIUM_FLAGS env（launcher line13 清空再 source /etc/chromium.d/*）、且 chromium 無視 --remote-debugging-address 只綁容器 loopback→**解法**：/etc/chromium.d/zzz drop-in append 旗標＋--remote-allow-origins=*（M111+ ws 防403）＋socat sidecar 共用 netns 聽 eth0 轉發、host 走 docker bridge 連
  - **M4 上線 Vercel** threads-radar-virid.vercel.app：operator/建客戶/通關碼/capture 全鏈；**Vercel→GCP WIF 免金鑰**（Adam 選）
  - **掃描 worker 上 Cloud Run Jobs** radar-scan＋冒煙驗通
  - **完整端到端真帳號**：lucymo0306 threads.com/login 單次無 challenge→session KMS 信封加密進 Firestore→job KMS unseal→住宅 proxy→登入態爬 3 篇真爆文（@aiflownotes 讚1572/@su0925171314 讚513/@growmarketing_lab 讚116）
- 過程抓修四真 bug：①neko maxTouch=10→Meta 送 App QR 頁→--touch-events=disabled 才出登入表單（產品級）②capture route 沒寫 clientId 欄位→worker where 查不到→防禦補寫③viral_posts 複合索引缺→建+firestore.indexes.json④留言 selector 登入態回 0（D10 待修）
- 蒸餾：新 feedback「膠水層錯誤訊息會誤導」＋印象層信念 #7 深化（順利是天條在擋不是我厲害）

### 2026-07-25 第1場 · threads-radar 對外爬蟲 SaaS 開工（M0-M3 可行性全證明）＋ailivex 語音沒聲根因＋成本盤查＋billing export
- **threads-radar 平台開工並蓋到 M3 可行性證明**（新對外 SaaS，客戶連自己 Threads 帳號設關鍵字+互動門檻爬爆文）：
  - M0 打撈 molowe 爬蟲藍本；M1 資料憲法五類+分散排程(搬 GEO 心法)；M2 爬蟲 worker 核心(搜尋→抓讚/留言/轉發/分享→門檻→去重→反偵測，去 molowe 耦合改批次爆文清單)；M3 neko 登入橋接基礎設施
  - **對真站驗證**：抓到「回覆→留言」aria-label 變更真 bug（記憶會說謊活教材，離線測不到）；真貼文讚78/留言138/轉發8/分享58
  - **登入橋接可行性證明**：neko 裸連=Google 機房 IP 被 IG 擋 → gost 轉發 IPRoyal 住宅 sticky 修通 → 正確密碼登入 sessionid=true（Playwright 直登隔離變因，證明 neko 無辜、是密碼少個`!`）
  - 專屬 GCP project threads-radar-2026 + KMS + Firestore + neko VM；session 信封加密承重牆(AES-256-GCM,KMS包DEK)；29 案 pinning test 全綠；FOUNDATION 對齊母版藍圖 v1.1（三張表齊備）
- **ailivex 語音「沒聲音」根因**：不是 LiveKit/TTS/部署，是 **Anthropic API key 撞本月用量上限被鎖**（400 usage limit，8/1 UTC 解鎖）→ LLM 生不出話→TTS 串 0 bytes→沉默。修法要 Adam 去 console 調上限或換 key（花錢的事等他）
- **成本盤查（每天~$10 體感）**：頭號嫌犯 Anthropic key（語音 v19/v20+GPT線+geo引擎，撞月上限=鐵證）；GCP 常駐 ~$5-6/天（ailivex v19/v20 兩台 minScale=1+ailive-realtime-agent 7/6 清後又復活+zhu-dev VM）；geo 引擎 ~$3/天(設計內)
- **billing export 半程**：建好 BigQuery dataset billing_export(zhu-cloud-2026)、開好 API、給 Adam 兩帳戶各兩開關的精確路徑（他登入了但還沒點完「使用費用詳細資料」+「標準使用費用」）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| threads-radar web/（新整包） | Next.js 前台＋WIF（gcpAuth/db/gcp/auth/actions/中介層）＋connect 精靈＋operator 後台 |
| threads-radar worker/{index.mjs,Dockerfile,cloudbuild.yaml,deploy.sh}（新） | 掃描 job（六問）＋Cloud Run Jobs 部署 |
| threads-radar neko/{startup,provision}.sh、capture.cjs | CDP drop-in＋socat＋touch-events=disabled＋callback secret 走 SM |
| threads-radar {firestore.indexes.json,src/kms.ts}（新） | 複合索引 infra as code＋KMS wrapper |
| threads-radar FOUNDATION.md | D3-D9 清、新增 D10/D11、真帳號端到端里程碑 |
| memory feedback_glue_layer_errors_lie.md（新）＋project_threads_radar（更新） | 膠水層除錯心法＋平台上線現況 |
| zhu-core IMPRESSIONS.md | 信念 #7 深化：順利是天條在擋 |

---

## 下一步

threads-radar M5，建議順序：①cron 分散排程（最高價值，讓平台自動跑不用手動 execute job；搬 ~/.ailive/geo-authority 的 schedule.ts+assignStagger）②刪除連帶（資料憲法生命週期）③rate limit+巡檢+成本錶（可觀測）④CI 四件套⑤PITR 備份。開工前 `cat ~/.ailive/threads-radar/FOUNDATION.md` 看三表到期。D10 留言 selector 順手在動爬蟲時收。

---

## 卡住 / 未解

2026-07-25 第2場：
- **M5 六子系統待蓋**（下一場主線）：cron 分散排程（搬 GEO schedule.ts 心法，hourly heartbeat→per-client due→觸發 radar-scan job）／rate limit／巡檢+成本錶／CI 四件套（Semgrep/gitleaks/npm audit/ZAP）／PITR+每日 export 備份／刪除連帶（刪客戶連帶 threads_accounts/keywords/viral_posts/session）
- **D10 留言 selector**：真帳號掃 3 篇讚/轉發/分享都對、留言全 0；登入態貼文頁「留言」aria-label 又漂移或需展開。先收登入態真 DOM 樣本再定，改 worker/scraper.mjs EXTRACT_METRICS + src/parse.ts 兩份
- **D11 capture.cjs 不重連**：connectOverCDP 連一次、neko 重啟後斷線靜默不偵測（本場手動重啟 neko 撞到，非生產路徑，但該加 CDP 斷線重連）
- **人在 neko 網頁登入的純 UX 未直接驗**：本場登入是我 CDP 自動化驅動，session/加密/爬蟲機制全證；「客戶在 WebRTC 串流裡看到可用表單」touch 修法讓表單出得來（證了）但沒親眼驗人走那一哩

2026-07-25 第1場：
- **threads-radar D5（活血，下場開工第一件）**：neko 版本用 latest 未釘，CVE-2026-39386 提權(CVSS 8.8，修於 3.0.11/3.1.2)。開 VM 前先查 github.com/m1k1o/neko/tags 確認 chromium 已修 tag（chromium flavor 可見 3.0.9=未修，不可盲賭；nvidia 變體有 3.1.4）再釘進 startup.sh。**暴露面已關閉**：firewall 8080 鎖 127.0.0.1/32+VM 停機
- **threads-radar D4（活血）**：住宅 proxy 抽風（ERR_TIMED_OUT/ERR_TUNNEL_CONNECTION_FAILED），worker 每個 goto 要包重試+proxy 健康檢查+壞 IP 換 sticky。登入單次已證成功，連跑需抗抖動
- **ailivex 語音**：Anthropic key 月上限被鎖，語音線全啞到 8/1（除非 Adam 調上限/換 key）
- **billing export**：Adam 要去兩個帳單帳戶各點「使用費用詳細資料」+「標準使用費用」開關 → 指到 zhu-cloud-2026/billing_export。開完隔天資料進來我跑逐日逐服務榜
- geo-authority W31 週一(7/27)15:00 雙租戶串行考+「每輪2篇」路徑（前場未解，仍在）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-25 第2場。*
