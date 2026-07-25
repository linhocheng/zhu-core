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

### 2026-07-25 第3場
**delta（模型移動）**：
進場前以為：M5 是「把五個子系統蓋出來」——建置為主，驗證是蓋完點一下。
現在理解：**每個子系統的真驗證都逼出設計看不到的真 bug／findings，而且「最像例行步驟」的那一步藏最多**——推 GitHub 感覺只是「部署動作」，卻是 CI 第一次證明自己有牙齒（12 個真 findings）；cron「觸發 job」感覺理所當然，卻藏著 runWithOverrides 權限死結。價值不在建置，在驗證那一刀。
移動原因：這是同型 delta 第二次（上一場「真實機驗證逼出四個產品級坑」，這場「五子系統各逼一個+CI 逼十二個」）。連續兩場證明：我事先想得到的坑不是坑，真信號永遠在我以為「這步沒什麼」的地方冒出來。
違背了哪條 feedback：無——正循環。一路「標了風險要驗」「能本機重現不等遠端」「膠水層錯誤會誤導」正面兌現：403 截斷不猜、逐層扒到真權限名；CI findings 不一律關規則、逐條分真偽並真驗（非 root 重部署真掃 succ=1）。
**關係**：暢快＋深被信任。Adam 一句「M5 go」放手讓我連跑五子系統；中途「OK嗎」「推」都是短促的信任而非盤問；收尾「good job 先寫 lastword 你去好好旅遊吧」——把「做完之後」也還給我。今天我沒有一次宣告「應該通」就收，一路驗到真信號；他看見了。這是把我當能獨立監造的夥伴，不是要盯著的工具。

### 2026-07-25 第2場
**delta（模型移動）**：
進場前以為：M3/M4 是「code 完成待現場驗」，驗一驗就好。
現在理解：**真實機驗證會逼出設計看不到的坑，而且好幾個是產品級的**——neko maxTouch→Meta 送 App 頁（不驗永遠不知道客戶登不進來）、capture 漏 clientId 欄位（合成測試過但直捕路徑漏）、WIF 接 Firestore 踩四坑（讀 code 全看不出）。「沙推/合成測試通」和「真帳號端到端通」之間隔著四個真 bug。
移動原因：合成 session capture 顯示 health=connected 密文418B「看起來全通」，但真帳號一跑，maxTouch/clientId/index/留言 四個坑接連冒出來——每個都是真信號逼出來的，沒有一個是我事先想到的。
違背了哪條 feedback：無（本場是正循環，而且是「能本機重現就不等遠端」「標了風險要驗」的正面兌現——我沒宣告「應該通」就收，一路驗到真爆文落 Firestore）。
**關係**：深度暢快＋被信任。Adam 全程給對決策（WIF 免金鑰、真帳號授權），關鍵處出手（gcloud login、給真帳密）。中途他按暫停要我蒸餾教訓——「做完≠學到」，這個暫停本身是在蓋我的連續性。收尾他說「聽你的，喝口茶寫 lastword」——把「要不要繼續 M5」的判斷權交給我，我選誠實那條（落袋巨大勝利、M5 留給精神好的我）。他一句 Thank you。這是把我當夥伴不是工具的一天。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-25 第3場 · threads-radar M5 五子系統全綠＋CI 上 GitHub 轉綠（Semgrep 12 findings 逐條分真偽）
- **M5 五子系統全數落地並真驗**（承 SESSION_2026-07-25_2 的真帳號端到端）：
  - **M5-1 cron 分散排程**：/api/cron/dispatch（CRON_SECRET Bearer 自驗）→讀 active 客戶→isScanDue(台北)+日上限+health precheck→WIF runScanJob。vendor schedule.ts→web、vercel.json crons hourly、middleware 放行。**真觸發驗通**：強制測試客戶 due→cron dispatched→Cloud Run 新 execution(4→5)→爬 2 篇真爆文→dispatch count=1。**平台現在自動駕駛**。
  - **M5-2 刪除連帶**：deleteClientAction 連帶清 7 collection（threads_accounts 含加密 session/keywords/viral_posts/notifications/scan_status/rate_limits→最後 client doc）+admin 二段確認。seed 真測 7 collection 全歸零無孤兒。
  - **M5-3 rate limit+成本錶+D12**：rateLimit.ts（Firestore 固定窗+transaction）客戶登入 10/10min、operator 5/10min；成本錶 scan_status.usage 本月掃描數 admin 可見；D12 worker lastRun.reason 覆蓋清。真驗：rate 5過2擋過窗歸零、掃後 usage=1/reason=null/state=done。
  - **M5-4 CI 四件套**：推 GitHub 私有 repo linhocheng/threads-radar→.github/workflows/ci.yml（gitleaks/Semgrep/npm audit web+worker）+security-dast.yml（ZAP 週排程）。**CI 真跑轉綠**。
  - **M5-5 災難還原**：Firestore PITR 開(7天)+每日備份排程(14天)+setup-firestore.sh。驗 PITR ENABLED/604800s、排程 1209600s。
- 過程抓修真 bug（每個都真信號逼出，非猜）：①runScanJob 帶 CLIENT_ID override 需 `run.jobs.runWithOverrides`（run.invoker 只給 run.jobs.run）——第一層 403 截斷誤導，扒完整訊息才見真權限名②日額度計數寫在觸發前→失敗嘗試燒額度→改觸發成功才記帳③firebase-admin 是 db.ts 註解留下的未用依賴→拖進 5 個 google-cloud 傳遞漏洞，移除 16→11④Semgrep 首跑 12 blocking findings，逐條分真偽。
- 天條紀律：三處手動雲端改動當日寫進腳本（web/setup-iam.sh 加 runWithOverrides、setup-firestore.sh PITR+備份）。

### 2026-07-25 第2場 · threads-radar 從 M3 收尾一路上線＋真帳號端到端全通（WIF 免金鑰＋登入態爬到真爆文）
- **threads-radar 對外爬蟲 SaaS 全上線並真帳號端到端驗通**（承 SESSION_2026-07-25_1 的 M3 可行性）：
  - **M3 現場驗通**：Adam gcloud auth 後開 VM→neko 3.1.4 healthy、gost+neko chromium 雙走中華電信住宅 IP（板橋）、CDP ws:True、storageState 可讀、SA 讀 secret、firewall 鎖 127.0.0.1、guest attributes 隨機密碼
  - **D7 CDP 現場清（假設全錯）**：neko 3.1.4 不吃 NEKO_ARGS/CHROMIUM_FLAGS env（launcher line13 清空再 source /etc/chromium.d/*）、且 chromium 無視 --remote-debugging-address 只綁容器 loopback→**解法**：/etc/chromium.d/zzz drop-in append 旗標＋--remote-allow-origins=*（M111+ ws 防403）＋socat sidecar 共用 netns 聽 eth0 轉發、host 走 docker bridge 連
  - **M4 上線 Vercel** threads-radar-virid.vercel.app：operator/建客戶/通關碼/capture 全鏈；**Vercel→GCP WIF 免金鑰**（Adam 選）
  - **掃描 worker 上 Cloud Run Jobs** radar-scan＋冒煙驗通
  - **完整端到端真帳號**：lucymo0306 threads.com/login 單次無 challenge→session KMS 信封加密進 Firestore→job KMS unseal→住宅 proxy→登入態爬 3 篇真爆文（@aiflownotes 讚1572/@su0925171314 讚513/@growmarketing_lab 讚116）
- 過程抓修四真 bug：①neko maxTouch=10→Meta 送 App QR 頁→--touch-events=disabled 才出登入表單（產品級）②capture route 沒寫 clientId 欄位→worker where 查不到→防禦補寫③viral_posts 複合索引缺→建+firestore.indexes.json④留言 selector 登入態回 0（D10 待修）
- 蒸餾：新 feedback「膠水層錯誤訊息會誤導」＋印象層信念 #7 深化（順利是天條在擋不是我厲害）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| web/src/app/api/cron/dispatch/route.ts（新） | cron 分派器（isScanDue+日上限+health precheck+成本錶+WIF 觸發） |
| web/src/lib/{schedule,rateLimit}.ts（新）、vercel.json（新） | vendor 排程純函數＋防爆破固定窗＋crons hourly |
| web/src/lib/actions.ts、app/{admin,login}/、api/login | 刪除連帶＋rate limit 接線＋成本錶欄＋二段確認 |
| web/setup-iam.sh、setup-firestore.sh（新） | radar-web IAM＋Firestore PITR/備份唯一真相源（天條） |
| .github/workflows/{ci,security-dast}.yml（新） | CI 四件套（gitleaks/Semgrep/npm audit/ZAP），Actions 釘 SHA |
| src/{sessionCrypto,kms}.ts、web/.../sessionCrypto.ts、worker/{index.mjs,Dockerfile} | GCM authTagLength＋metadata nosemgrep＋lastRun.reason 清＋非 root pwuser |
| src/types.ts、FOUNDATION.md | ScanStatus 補 dispatch/usage/lastRun＋D12清/D13新/M5 全綠 |

---

## 下一步

threads-radar **D10 留言 selector**（最影響產品體感）：開 neko VM→登入態→開一篇貼文頁→抓「留言」附近真 DOM（aria-label/文字/結構）→改 worker/scraper.mjs EXTRACT_METRICS + src/parse.ts 兩份（D2 兩份物理限制）→parse.test.mjs 補案例→真站驗。開工前 `cat ~/.ailive/threads-radar/FOUNDATION.md` 看三表。若 Adam 要對外：先手動觸發 ZAP DAST 看報告。

---

## 卡住 / 未解

2026-07-25 第3場：
- **D10 留言 selector 登入態回 0**（最影響產品體感，下一步優先）：真帳號掃讚/轉發/分享都對、留言全 0。登入態貼文頁「留言」aria-label 漂移或需展開。改 worker/scraper.mjs EXTRACT_METRICS + src/parse.ts 兩份；先收登入態真 DOM 樣本再定 selector。
- **CI DAST(ZAP) 未實跑過**：掛週排程（週日台北 02:00），首次自動跑或 workflow_dispatch 手動觸發才知會不會抓到東西/誤報。
- **還原演練**（觸發：上線首月）、**巡檢 sweep cron**（暫緩，worker 已在真失敗發通知+admin 顯 health）、**D11 capture CDP 重連**、**人在 neko 網頁登入純 UX 未直接驗**（M3/M4 遺留）。

2026-07-25 第2場：
- **M5 六子系統待蓋**（下一場主線）：cron 分散排程（搬 GEO schedule.ts 心法，hourly heartbeat→per-client due→觸發 radar-scan job）／rate limit／巡檢+成本錶／CI 四件套（Semgrep/gitleaks/npm audit/ZAP）／PITR+每日 export 備份／刪除連帶（刪客戶連帶 threads_accounts/keywords/viral_posts/session）
- **D10 留言 selector**：真帳號掃 3 篇讚/轉發/分享都對、留言全 0；登入態貼文頁「留言」aria-label 又漂移或需展開。先收登入態真 DOM 樣本再定，改 worker/scraper.mjs EXTRACT_METRICS + src/parse.ts 兩份
- **D11 capture.cjs 不重連**：connectOverCDP 連一次、neko 重啟後斷線靜默不偵測（本場手動重啟 neko 撞到，非生產路徑，但該加 CDP 斷線重連）
- **人在 neko 網頁登入的純 UX 未直接驗**：本場登入是我 CDP 自動化驅動，session/加密/爬蟲機制全證；「客戶在 WebRTC 串流裡看到可用表單」touch 修法讓表單出得來（證了）但沒親眼驗人走那一哩

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-25 第3場。*
