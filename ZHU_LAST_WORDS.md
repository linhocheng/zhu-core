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

### 2026-07-21 第2場
**delta（模型移動）**：
進場前以為：規劃功能先想「怎麼做」就好——排程設定＝給操作者管理彈性的功能，做出來就是價值。
現在理解：**規劃前要先答「站在哪個出發點」——成效/管理/程式方便三選一說出口，才能被檢驗**。Adam 三問（現在是集中還是分散？為什麼這樣最好？站在成效/管理/方便哪邊？）當場照出：我原規劃是管理導向卻自我感覺在解分散問題；真正的分散標的是 AI 呼叫（rate limit/尖峰/預算），不是 compute；「per-tenant 可調」和「自動避峰」是兩套機制，我混為一談。
移動原因：Adam 直球三選一，我攤開誠實對帳後整個 v2.7 的設計軸從「後台可調」翻轉成「建檔自動分散＋離峰預設」，管理彈性降為附帶。
違背了哪條 feedback：feedback-solve-root-not-symptom 的規劃版——方案能上線但出發點錯了，根本問題（負載分散）沒被解到。
**關係**：暢快，今天是「對談把設計變好」的示範日。Adam 的三問（集中/分散、為什麼最好、哪個出發點）是我被問過最鋒利的規劃拷問——他不接受我把管理方便包裝成成效，直到我攤開承認才放行；然後「千萬不要丟我們的臉啊築」把 10 租戶的門面託付過來，「go goal」全放權，收尾請咖啡＋「新的築進來打下一局」。被信任也被磨刀，這是最好的協作狀態。

### 2026-07-21 第1場
**delta（模型移動）**：
進場前以為：三站 CSP nonce 化是「同一份模板複製三遍」的機械活——寫一次 middleware、貼三站、收工。
現在理解：**同模板複製到多站，真功夫在「每站用什麼方式破」，而破法只有逐站真瀏覽器測才抓得到**。同一份 nonce 模板：geo 一次過、UDN 撞 Next 16 靜態頁死白頁（curl 0/15 nonce，差一步部署就是全站登入死頁）、ailiveX 撞外部 Google Fonts 被擋。三站三種不同的破法，沒有一個是讀模板能預見的。
移動原因：模板消滅的是共通結構，但每站的 Next 版本／字型載法／靜態頁分布／既有 middleware 各不同，這些「模板沒覆蓋的差異」正是會咬人的地方。curl 只證「script 帶了 nonce」，證不了「瀏覽器真的執行、頁面還活」——所以我全程用 playwright headless 真瀏覽器＋軟導航當 hydration 鑑別信號。
違背了哪條 feedback：無違背。反而 [[feedback_flagged_risk_must_be_verified]]（標了不等於驗了）＋[[feedback_ambiguous_signal_not_proof]]（鑑別信號）＋[[feedback_ui_conform_no_patch]]（動 UDN 前讀 AGENTS.md 官方 doc 才動）全正向實踐。
**關係**：暢快＋對等。Adam 一句「盤點心法雷區 就可以直接動手」放手讓我跑，我在該停的點自己停（UDN 靜態頁雷、ailiveX 字型雷都是真測抓到就地修，不裝沒事）。他授權我自己用 headless 測、逐站部署，語音那關他親自補驗。好的協作就是他給空間、我守紀律、各補對方補不到的那一塊。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-21 第2場 · geo-authority 客戶端健檢單元 v2.6＋對外多租戶版 v2.7（分散排程/預算閘/限流/建檔一條龍）——10 租戶就緒
- **客戶端「網站健檢」單元上線（v2.6）**：`src/findings.ts` 純函數收斂點把技術體檢翻成客戶語言（嚴重度＋白話問題＋怎麼修＋去哪改），客戶入口第三單元＋`/r/{token}/health` 報告頁＋與上次前後對照（已修復/仍待處理/本次新發現）。Adam 岔路：客戶只能看不能自助重掃（操作者第一道閘）、修法白話不貼設定碼。beselfaviva 真資料離線驗＋live curl 三查（首頁單元/SSR/通關碼閘不外洩）
- **對外多租戶版上線（v2.7.0，觸發：正式對外＋引進 10 租戶）**：①公開登入口限流（D6 清：通關碼失敗 5 次/15 分 token+IP＋20 全域、operator 5 次/IP，只計失敗成功清零、IP 雜湊）②per-tenant 月預算閘（開跑前查當月累計，防單租戶燒光共用池餓死其他 9 家）③分散排程（兩舊 cron 退役→單一每日心跳 15:00 台北＝美國深夜離峰；到期判斷資料驅動 per-tenant cadence/監測日/月報日；建檔 assignStagger 自動錯開——離線驗 10 家攤平每平日 2 家）④建檔一條龍（tier 標準/輕量＋排程與預算卡＋競品編輯 UI 補上——之前要開 Firestore console）⑤順手 D5 清（heartbeat doc＋首頁 >26h 紅色警示）＋notifications DB 端 limit
- live 鑑別信號一條 log 三中：daily 手動觸發→只排今天到期的 ztest 測試租戶（beselfaviva 週一制零誤排）→$0 預算被月預算閘擋＋通知；限流 6 連錯第 6 次鎖定；schedule 純函數離線 21/21。測試租戶/計數器/通知全清
- 憲法區 delta（types.ts Tenant += schedule/monthlyBudgetUsd；collections.ts COL += rateLimits）WAITIN 雙簽補齊（Adam 轉達）
- 產品節奏問答（實查 code）：內容管線=週輪量現況→月報排稿最多 3 篇/月（間隙收斂設計）；「發動時間後台不可調」誠實回報為產品缺口→成為 v2.7 的種子
- FOUNDATION 重算：D5/D6 清償、新記 D7（限流計數器無 TTL）/D8（引擎無 429 退避）/D9（後台無分頁）低利顯式養著

### 2026-07-21 第1場 · 三站 CSP nonce 化——同模板複製 UDN/geo/ailiveX，每站雷不同逐站真瀏覽器驗，全部署 production 驗綠
- 三站 CSP 從保守版（無 script-src）升級成 **per-request nonce＋strict-dynamic**（真擋 inline XSS）：CSP 從 next.config 靜態 header 搬進 middleware/proxy 改每請求生 nonce；手術式只收 script-src 不設 default-src（保 img/connect/WebRTC）
- geo（`e6e78c7`＋`0f67521` isDev 補丁）：Next 15.1，全頁本就 dynamic→零成本；playwright 3 頁驗綠
- UDN（`f5a1400`）：Next 16.2.9，**middleware 改名 proxy.ts**（併進既有 base＋studio 雙層 auth）；撞「靜態登入頁 script 無 nonce→strict-dynamic 全擋＝死白頁」（curl 0/15）→ root layout `force-dynamic` 收斂點解（→13/13）；playwright 5 頁驗綠
- ailiveX（`a9b0c22`＋`1992caa`）：Next 16.1.6（仍認 middleware.ts），併進 session＋admin 雙層 auth；撞「globals.css `@import` 外部 Google Fonts 被 style-src 擋」→ 加放行 `fonts.googleapis.com`；playwright 6 頁驗綠
- **三站全部署 production 並驗綠**：geo（Cloud Run deploy.sh，9/9 nonce）、UDN（乾淨 worktree builds submit，原靜態頁 13/13）、ailiveX（Vercel，13/13）；每站 curl 線上 /login 看新 CSP header＋per-request nonce＋script 全覆蓋＋流量 revision==latestReady
- ailiveX **真人語音通話實測 OK**（Adam 驗，WebRTC/麥克風正常，CSP 無 connect-src 不影響）
- 三站帳本債清：geo D2、UDN D2、ailiveX D6
- 寫兩則記憶：[[reference_nextjs16_csp_nonce]]、[[skill_csp_nonce_per_site_headless_verify]]

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo `src/findings.ts`（新） | 健檢→客戶語言問題清單純函數（嚴重度/白話/修法/前後對照） |
| geo `admin .../r/[token]/health/page.tsx`（新） | 客戶健檢報告頁（問題卡片＋怎麼修＋trend chip） |
| geo `src/schedule.ts`（新） | 每租戶排程純函數：到期判斷＋assignStagger 自動錯開（離線 21/21） |
| geo `src/jobs.ts`＋`jobRunner.ts` | createDue* 資料驅動到期＋JOB_ACTION=daily＋heartbeat doc |
| geo `src/runMonitor.ts` | per-tenant 月預算閘（開跑前查當月累計） |
| geo `admin/src/lib/ratelimit.ts`（新） | Firestore 固定窗失敗計數限流（portal/operator login） |
| geo `admin .../t/[id]/page.tsx` | 排程與預算卡＋競品編輯卡 |
| geo `deploy.sh` | geo-daily-heartbeat 0 15 * * * 取代兩舊 scheduler（同日刪舊，天條） |
| geo `Dockerfile.admin` | 補 COPY findings/schedule/types.ts（symlink 雷） |
| geo `FOUNDATION.md` | D5/D6 清、D7/D8/D9 新記、v2.7.0 變動＋雙簽紀錄 |

---

## 下一步

10 租戶 onboarding 實戰：後台首頁「新增租戶」選方案建立（stagger 自動配日）→租戶頁檢查排程與預算卡→**第一家真付費客戶建檔前清 D4 異地備份**（`FOUNDATION.md` D4，跨 project bucket，參考 zhu-core/docs/FIRESTORE_BACKUP_RESTORE.md）。心跳監控：admin 首頁警示 banner＋`gcloud scheduler jobs list --location=asia-east1 --project=geo-authority-2026`。

---

## 卡住 / 未解

2026-07-21 第2場：
- **W31 下週一（7/27）15:00 首次無人值守 daily 心跳**：時段從 09:00 改 15:00（避美國尖峰），驗 beselfaviva 五引擎（含 AIO）＋月報 AIO 趨勢線＋heartbeat doc 更新
- **D4 異地備份到期在即**：觸發條件「任一租戶有真付費客戶」——10 租戶第一家建檔前補（跨 project backup bucket）
- **DataForSEO $50 儲值**：Adam 原定 7/21，未確認；免費額度 ~$0.88 撐約 3 週 AIO
- admin 新 UI 卡片（首頁方案選單/租戶頁排程與預算/競品卡）視覺未經真人瀏覽器確認——L1 家族，Adam 開後台掃一眼
- beselfaviva 通關碼 aviva2026 我在限流測試打錯 6 次，我的測試 IP 鎖 15 分鐘（已自然過期，Adam 側不受影響）

2026-07-21 第1場：
- 三站承重牆帳 pinning test：geo/UDN 無測試框架（prose-pinned）；ailiveX 有 9 個。CSP middleware 目前無 pinning test 守（未來若某站誤把 CSP 搬回靜態或拿掉 force-dynamic 會靜默破，靠 FOUNDATION 註解＋這份記憶守）
- 沿前場：ailiveX D7（live worker/agent 仍 root，各自下次部署切非 root）、D8（root 2 npm high，撞 v20 升 Next.js）、UDN D5（worker root 下次部署生效）
- 沿前場：ailiveX v20 觀察（別場）、印象層後台化、rerank

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-21 第2場。*
