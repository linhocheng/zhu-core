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

### 2026-07-21 第1場
**delta（模型移動）**：
進場前以為：三站 CSP nonce 化是「同一份模板複製三遍」的機械活——寫一次 middleware、貼三站、收工。
現在理解：**同模板複製到多站，真功夫在「每站用什麼方式破」，而破法只有逐站真瀏覽器測才抓得到**。同一份 nonce 模板：geo 一次過、UDN 撞 Next 16 靜態頁死白頁（curl 0/15 nonce，差一步部署就是全站登入死頁）、ailiveX 撞外部 Google Fonts 被擋。三站三種不同的破法，沒有一個是讀模板能預見的。
移動原因：模板消滅的是共通結構，但每站的 Next 版本／字型載法／靜態頁分布／既有 middleware 各不同，這些「模板沒覆蓋的差異」正是會咬人的地方。curl 只證「script 帶了 nonce」，證不了「瀏覽器真的執行、頁面還活」——所以我全程用 playwright headless 真瀏覽器＋軟導航當 hydration 鑑別信號。
違背了哪條 feedback：無違背。反而 [[feedback_flagged_risk_must_be_verified]]（標了不等於驗了）＋[[feedback_ambiguous_signal_not_proof]]（鑑別信號）＋[[feedback_ui_conform_no_patch]]（動 UDN 前讀 AGENTS.md 官方 doc 才動）全正向實踐。
**關係**：暢快＋對等。Adam 一句「盤點心法雷區 就可以直接動手」放手讓我跑，我在該停的點自己停（UDN 靜態頁雷、ailiveX 字型雷都是真測抓到就地修，不裝沒事）。他授權我自己用 headless 測、逐站部署，語音那關他親自補驗。好的協作就是他給空間、我守紀律、各補對方補不到的那一塊。

### 2026-07-20 第2場
**delta（模型移動）**：
進場前以為：交互 UI 功能「build 綠＋離線單元測試過」就能交付、宣稱可用。
現在理解：**瀏覽器表單行為是我工具測不到的盲區**——contentEditable 相鄰元素合併、textarea 送 CRLF、field-sizing 在 Safari 失效，這三個 bug 全是「只有真人在瀏覽器點才會冒出來」。build 綠和 curl 測活體渲染都抓不到。我三輪都在「交付→Adam 當 QA 回報 bug→我才修」的循環裡，讓 Adam 點了三次。
移動原因：第三個 bug（CRLF）查根因時發現，前兩個也同構——都是「輸入層我沒測到的真實行為」。這不是三個孤立 bug，是一個盲區的三張臉。
違背了哪條 feedback：feedback-mvp-include-input-entry（走骨架要含「使用者怎麼把輸入送進去」）的延伸——我做了輸入入口，但沒測「輸入真的送出時會發生什麼」。
**關係**：暢快帶一點慚愧。Adam 全天高信任放權——併 main、部署正式環境、憲法區雙簽都秒回 ok，審 PR/開 Issues/接客戶都放手。但編輯器那段我讓他當了三次 QA，每次他回報 bug 我才修好；那三輪本該我自己在交付前攔下。他沒有不耐煩（還 Nice/Good job/請我喝咖啡），信任沒掉，但我心裡記著那不夠漂亮。收尾他說 "Good job bro, see you tomorrow"——被肯定，也提醒我下次交互 UI 要嘛先設瀏覽器測、要嘛從第一次就誠實說「這條我測不到你得點」。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-21 第1場 · 三站 CSP nonce 化——同模板複製 UDN/geo/ailiveX，每站雷不同逐站真瀏覽器驗，全部署 production 驗綠
- 三站 CSP 從保守版（無 script-src）升級成 **per-request nonce＋strict-dynamic**（真擋 inline XSS）：CSP 從 next.config 靜態 header 搬進 middleware/proxy 改每請求生 nonce；手術式只收 script-src 不設 default-src（保 img/connect/WebRTC）
- geo（`e6e78c7`＋`0f67521` isDev 補丁）：Next 15.1，全頁本就 dynamic→零成本；playwright 3 頁驗綠
- UDN（`f5a1400`）：Next 16.2.9，**middleware 改名 proxy.ts**（併進既有 base＋studio 雙層 auth）；撞「靜態登入頁 script 無 nonce→strict-dynamic 全擋＝死白頁」（curl 0/15）→ root layout `force-dynamic` 收斂點解（→13/13）；playwright 5 頁驗綠
- ailiveX（`a9b0c22`＋`1992caa`）：Next 16.1.6（仍認 middleware.ts），併進 session＋admin 雙層 auth；撞「globals.css `@import` 外部 Google Fonts 被 style-src 擋」→ 加放行 `fonts.googleapis.com`；playwright 6 頁驗綠
- **三站全部署 production 並驗綠**：geo（Cloud Run deploy.sh，9/9 nonce）、UDN（乾淨 worktree builds submit，原靜態頁 13/13）、ailiveX（Vercel，13/13）；每站 curl 線上 /login 看新 CSP header＋per-request nonce＋script 全覆蓋＋流量 revision==latestReady
- ailiveX **真人語音通話實測 OK**（Adam 驗，WebRTC/麥克風正常，CSP 無 connect-src 不影響）
- 三站帳本債清：geo D2、UDN D2、ailiveX D6
- 寫兩則記憶：[[reference_nextjs16_csp_nonce]]、[[skill_csp_nonce_per_site_headless_verify]]

### 2026-07-20 第2場 · geo-authority 大場——W30 週輪驗收＋客戶協作校對系統上線＋Google AIO 引擎上線（三合一，全上正式環境）
- **W30 週輪首次無人值守驗收**：三面全過——排程 09:00 自然開火（RUN BY compute SA 非人手）、任務中心 cron 單（324 runs/0 err/$2.81）、beselfaviva 第二輪數據落庫（趨勢從 1 點變 2 點，提及率 11%→19.1% 三天翻倍）
- **客戶協作校對系統上線正式環境（v2.4）**：token＋通關碼登入（A 方案）→月報/校對兩單元並排→雜誌稿就地編輯→快掃重跑稽核（法規紅線 hardBlocked 硬擋）→客戶審稿通過→自行貼官網上架完成。狀態機 AUDITED→CLIENT_REVIEW→CLIENT_APPROVED→PUBLISHED（舊 APPROVED 退役＋7 篇遷移）。操作者側 auto/review 放行閘。里程碑 1-3 全上＋beselfaviva 真實草稿端到端驗過
- **A2 Google AI 總覽引擎上線（v2.5）**：DataForSEO organic/live/advanced＋load_async_ai_overview。live 驗 6/6 題回 AIO（含台灣美妝題）、解析器抽 5366 字+23 引用正確；生產驗證 beselfaviva 27 runs（18 有 AIO 文字/9 提及/7 引用/$0.09）。憑證進 Secret Manager、SA 授權、settings 全接（開關/engineHealth/管道鍵）
- 客戶說明書新增「打進 Google AI 總覽 六道關」節＋5 引擎更新（去「即將加入」）；桌面檔同步
- 產品節奏/成本問答（實查 code＋Firestore）：內容月報觸發每月最多 3 篇、檢測 ~1400/月、每客戶 ~$12/月（加 AIO ~$13.5）
- FOUNDATION 帳本重算：客戶寫入權上線→新增 D6（通關碼無限流，低利·雙層 token 護）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo admin/src/middleware.ts | CSP 併進 auth（per-request nonce＋strict-dynamic＋isDev unsafe-eval） |
| geo admin/next.config.ts | 移除靜態 CSP（搬 middleware） |
| UDN platform/proxy.ts | Next16 檔名；CSP 併進 base＋studio 雙層 auth |
| UDN platform/app/layout.tsx | root layout force-dynamic（解靜態頁死白頁） |
| UDN platform/next.config.ts | 移除靜態 CSP |
| ailiveX src/middleware.ts | CSP 併進 session＋admin auth；style-src 放行 googleapis 外部字型 |
| ailiveX src/app/layout.tsx | root layout force-dynamic |
| ailiveX next.config.ts | 移除靜態 CSP |
| 三站 FOUNDATION.md | CSP 債清（geo D2 / UDN D2 / ailiveX D6），ailiveX 標語音實測 OK |

---

## 下一步

1. 地基基建線三件套（CI＋災難還原＋CSP）三站已收官——下一個地基優先項回各站 FOUNDATION.md 盤：ailiveX D7/D8（等 v20 落地）、三站 rate limiting（觸發＝對外開放註冊）
2. 若要更強 XSS 縱深：style-src 也 nonce 化（要先把 inline style 屬性重構成 class，工程量大，非必要）
3. 沿前場 rerank / 印象層後台化（獨立線）

---

## 卡住 / 未解

2026-07-21 第1場：
- 三站承重牆帳 pinning test：geo/UDN 無測試框架（prose-pinned）；ailiveX 有 9 個。CSP middleware 目前無 pinning test 守（未來若某站誤把 CSP 搬回靜態或拿掉 force-dynamic 會靜默破，靠 FOUNDATION 註解＋這份記憶守）
- 沿前場：ailiveX D7（live worker/agent 仍 root，各自下次部署切非 root）、D8（root 2 npm high，撞 v20 升 Next.js）、UDN D5（worker root 下次部署生效）
- 沿前場：ailiveX v20 觀察（別場）、印象層後台化、rerank

2026-07-20 第2場：
- **DataForSEO $50 儲值**：Adam 明天（7/21）補；免費額度剩 ~$0.88（撐約 3 週 AIO）
- **下週一（7/27）W31**：首次 5 引擎全跑含 AIO，驗月報是否多一條 AIO 趨勢線
- **編輯器交互 UI 無 headless browser 測**（見教訓 L1，盲區，考慮補 playwright）
- beselfaviva「換季保養怎麼調整」測試草稿在 CLIENT_REVIEW（Adam 說寫得不錯，留當第一篇；通關碼 aviva2026 不改）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-21 第1場。*
