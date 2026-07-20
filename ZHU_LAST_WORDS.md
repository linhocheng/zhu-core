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

### 2026-07-20 第2場
**delta（模型移動）**：
進場前以為：交互 UI 功能「build 綠＋離線單元測試過」就能交付、宣稱可用。
現在理解：**瀏覽器表單行為是我工具測不到的盲區**——contentEditable 相鄰元素合併、textarea 送 CRLF、field-sizing 在 Safari 失效，這三個 bug 全是「只有真人在瀏覽器點才會冒出來」。build 綠和 curl 測活體渲染都抓不到。我三輪都在「交付→Adam 當 QA 回報 bug→我才修」的循環裡，讓 Adam 點了三次。
移動原因：第三個 bug（CRLF）查根因時發現，前兩個也同構——都是「輸入層我沒測到的真實行為」。這不是三個孤立 bug，是一個盲區的三張臉。
違背了哪條 feedback：feedback-mvp-include-input-entry（走骨架要含「使用者怎麼把輸入送進去」）的延伸——我做了輸入入口，但沒測「輸入真的送出時會發生什麼」。
**關係**：暢快帶一點慚愧。Adam 全天高信任放權——併 main、部署正式環境、憲法區雙簽都秒回 ok，審 PR/開 Issues/接客戶都放手。但編輯器那段我讓他當了三次 QA，每次他回報 bug 我才修好；那三輪本該我自己在交付前攔下。他沒有不耐煩（還 Nice/Good job/請我喝咖啡），信任沒掉，但我心裡記著那不夠漂亮。收尾他說 "Good job bro, see you tomorrow"——被肯定，也提醒我下次交互 UI 要嘛先設瀏覽器測、要嘛從第一次就誠實說「這條我測不到你得點」。

### 2026-07-20 第1場
**delta（模型移動）**：
進場前以為：把 geo 的資安 CI 複製到 UDN/ailiveX 是格式活——改 target URL、貼 yaml、pin SHA、收工。
現在理解：**給既有成熟平台接 CI，CI 的第一份工作是盤存量債，而不是防新錯**。難的不是寫 yaml（那是確定性格式活），是掃描器一上線照出的每個既有問題怎麼 triage——而 triage 是判斷活、且會碰 live 生產服務（ailiveX 的語音 agent 共用 image、改壞打爛全版）和平行 session（v20 的 package.json）。所以我在 ailiveX 停下來把三路處理攤給 Adam 點頭，沒有擅自 baseline 掉他 live 平台上的真安全 finding。
移動原因：同一份模板，geo（我自己剛蓋、乾淨）一次過，ailiveX（成熟、多人、live）照出 5 個既有問題，逼我把「接 CI」從格式活重新理解成判斷活。
違背了哪條 feedback：無違背。反而 feedback_surface_technical_debt（發現債要說不能默默繞）＋feedback_flagged_risk_must_be_verified（本機通≠CI通，寫完 workflow 重跑 semgrep）＋鑑別信號天條（每站都等 CI 真綠＋手動 dispatch 驗 DAST，不靠「我寫了 yaml」）全被正向實踐。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-20 第2場 · geo-authority 大場——W30 週輪驗收＋客戶協作校對系統上線＋Google AIO 引擎上線（三合一，全上正式環境）
- **W30 週輪首次無人值守驗收**：三面全過——排程 09:00 自然開火（RUN BY compute SA 非人手）、任務中心 cron 單（324 runs/0 err/$2.81）、beselfaviva 第二輪數據落庫（趨勢從 1 點變 2 點，提及率 11%→19.1% 三天翻倍）
- **客戶協作校對系統上線正式環境（v2.4）**：token＋通關碼登入（A 方案）→月報/校對兩單元並排→雜誌稿就地編輯→快掃重跑稽核（法規紅線 hardBlocked 硬擋）→客戶審稿通過→自行貼官網上架完成。狀態機 AUDITED→CLIENT_REVIEW→CLIENT_APPROVED→PUBLISHED（舊 APPROVED 退役＋7 篇遷移）。操作者側 auto/review 放行閘。里程碑 1-3 全上＋beselfaviva 真實草稿端到端驗過
- **A2 Google AI 總覽引擎上線（v2.5）**：DataForSEO organic/live/advanced＋load_async_ai_overview。live 驗 6/6 題回 AIO（含台灣美妝題）、解析器抽 5366 字+23 引用正確；生產驗證 beselfaviva 27 runs（18 有 AIO 文字/9 提及/7 引用/$0.09）。憑證進 Secret Manager、SA 授權、settings 全接（開關/engineHealth/管道鍵）
- 客戶說明書新增「打進 Google AI 總覽 六道關」節＋5 引擎更新（去「即將加入」）；桌面檔同步
- 產品節奏/成本問答（實查 code＋Firestore）：內容月報觸發每月最多 3 篇、檢測 ~1400/月、每客戶 ~$12/月（加 AIO ~$13.5）
- FOUNDATION 帳本重算：客戶寫入權上線→新增 D6（通關碼無限流，低利·雙層 token 護）

### 2026-07-20 第1場 · UDN＋ailiveX 接資安掃描四件套 CI（複製 geo 模板）——CI 一上線就照出既有存量債，triage 三路＋鑑別信號全程接住
- UDN 資安 CI 上線並實測綠（commit `2982923`，repo linhocheng/udnnews-platform）：gitleaks/Semgrep/npm audit 每 push＋ZAP baseline weekly＋手動；四 job push 三綠＋dispatch 驗 DAST 綠
- UDN CI 照出真問題：`podcast-worker/Dockerfile` 跑 root（缺 USER）→ 修源碼＋docker build 驗（node user），live worker 下次部署生效（記債）
- ailiveX 資安 CI 上線並實測綠（commit `9bea4c7` v18.19.0）：同四件套＋SAST 加 `p/python` 掃 agent；push 三綠＋dispatch 驗 DAST 綠
- ailiveX CI 照出既有存量債，照 Adam 點頭的計畫 triage：①3 個 Dockerfile 跑 root——node worker 修 USER、兩個 Python agent（live 共用 image＋legacy 快照）inline `nosemgrep` 記債 D7 不擅改 live；②root 2 個 npm high（Next.js 一串＋form-data）記債 D8，deps gate 暫 `critical` 硬擋＋`high` 非阻斷可見（CI annotation 浮出來不藏地毯），觸發＝v20 升 Next.js 後拉回 high
- 兩站 FOUNDATION.md 更新：UDN D1 清、ailiveX D1 清＋新增 D7/D8
- 對 Adam 講清 CSP nonce 為何打爛 Next.js SSR（框架自注入 inline hydration/RSC 串流 script→沒穿 nonce 全被擋成死屍；就算接對也強制 dynamic render 丟 static 快取）——收尾閒聊，沒動工

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo `src/collections.ts` | scanMarkdown 收斂點（含 CRLF 正規化）＋CONTENT_STATUSES 狀態機＋aio config/cost |
| geo `admin components/ReviewEditor.tsx`（新） | 雜誌稿就地編輯：受控 textarea＋JS auto-resize＋useActionState 回饋 |
| geo `admin lib/portal.ts`（新）＋api/portal-login | 客戶 token＋通關碼認證 |
| geo `admin components/ClientMasthead.tsx`（新） | 客戶頁頂部小字招牌 |
| geo `src/engines/aio.ts`（新） | Google AIO adapter（DataForSEO，防禦式 references 解析） |
| geo `docs/CLIENT_GUIDE.md` | 打進 AIO 六道關節＋5 引擎 |
| geo `FOUNDATION.md` | D6 新債（通關碼限流） |
| memory `project_geo_authority.md` | 客戶校對系統＋AIO 上線 |

---

## 下一步

週一（7/27）驗 W31 五引擎全跑（`gcloud run jobs executions list --job=geo-monitor-job`＋查 beselfaviva runs 有 aio engine＋月報 aio 趨勢）。Adam 儲值後 AIO 滿血無斷點。其餘不用動。

---

## 卡住 / 未解

2026-07-20 第2場：
- **DataForSEO $50 儲值**：Adam 明天（7/21）補；免費額度剩 ~$0.88（撐約 3 週 AIO）
- **下週一（7/27）W31**：首次 5 引擎全跑含 AIO，驗月報是否多一條 AIO 趨勢線
- **編輯器交互 UI 無 headless browser 測**（見教訓 L1，盲區，考慮補 playwright）
- beselfaviva「換季保養怎麼調整」測試草稿在 CLIENT_REVIEW（Adam 說寫得不錯，留當第一篇；通關碼 aviva2026 不改）

2026-07-20 第1場：
- **三站 CSP nonce 化**（共通壓底債 D2/D6）：獨立硬工程，要逐站 middleware 生 nonce＋穿進 Next header 機制＋真人瀏覽器點過（header 有≠頁面還活）。退場＝對外開放註冊 or 真防 XSS 縱深。給乾淨 session
- **UDN/geo 承重牆帳只 prose-pinned**：兩站無測試框架，pinning test 待補（清單在各自 FOUNDATION.md）
- **ailiveX 兩債待清**：D7（live worker/agent 仍跑 root，各自下次部署才切非 root）、D8（root 2 個 npm high，撞 v20 平行 session 的 package.json，該他們升 Next.js 時做）
- geo `2ab2060 v2.3.1.001 文件：客戶說明書＋操作手冊` 未推——**不是我的**（別場本地 commit，版號格式不同），平行施工規約留著沒動
- 沿前場：ailiveX v20 觀察（別場在跑）、印象層後台化、rerank

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-20 第2場。*
