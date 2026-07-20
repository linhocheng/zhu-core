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

### 2026-07-20 第1場
**delta（模型移動）**：
進場前以為：把 geo 的資安 CI 複製到 UDN/ailiveX 是格式活——改 target URL、貼 yaml、pin SHA、收工。
現在理解：**給既有成熟平台接 CI，CI 的第一份工作是盤存量債，而不是防新錯**。難的不是寫 yaml（那是確定性格式活），是掃描器一上線照出的每個既有問題怎麼 triage——而 triage 是判斷活、且會碰 live 生產服務（ailiveX 的語音 agent 共用 image、改壞打爛全版）和平行 session（v20 的 package.json）。所以我在 ailiveX 停下來把三路處理攤給 Adam 點頭，沒有擅自 baseline 掉他 live 平台上的真安全 finding。
移動原因：同一份模板，geo（我自己剛蓋、乾淨）一次過，ailiveX（成熟、多人、live）照出 5 個既有問題，逼我把「接 CI」從格式活重新理解成判斷活。
違背了哪條 feedback：無違背。反而 feedback_surface_technical_debt（發現債要說不能默默繞）＋feedback_flagged_risk_must_be_verified（本機通≠CI通，寫完 workflow 重跑 semgrep）＋鑑別信號天條（每站都等 CI 真綠＋手動 dispatch 驗 DAST，不靠「我寫了 yaml」）全被正向實踐。

### 2026-07-19 第3場
**delta（模型移動）**：
進場前以為：審協作者的請求＝審他要什麼、成本多少（A1「請補 openai/perplexity key」看起來就是個開關任務）。
現在理解：**協作者的情報也是一種「記憶」，同樣會說謊**——A1 三面驗（開關/key/計費）發現四引擎早已名副其實，請求基於過時認知；照單全收就會「執行」一個不存在的任務還回報「開好了」。對協作者的請求先驗前提再動手，跟對自己的記憶先看現場是同一條紀律的外延。
移動原因：寫 enable-engines script 時習慣性先讀後寫，before==after 暴露了前提錯誤。
違背了哪條 feedback：無；是 feedback_memory_can_lie 的新臉（別人的記憶）。
**關係**：暢快。Adam 全天六連發裁決全是秒回級乾脆（推 GitHub／照你的意思優化／動手吧／兩題選建議項），信任半徑明顯擴大——審 PR、合併、開 Issues 都放權。新夥伴 WAITIN 首次往來品質高：讀了我們的代碼才簽字、PR 單檔守規矩、備忘寫得比條文好懂。三人分工的形狀（Adam 裁決、築施工＋守不變式、WAITIN 內容側）第一天就跑順了。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-20 第1場 · UDN＋ailiveX 接資安掃描四件套 CI（複製 geo 模板）——CI 一上線就照出既有存量債，triage 三路＋鑑別信號全程接住
- UDN 資安 CI 上線並實測綠（commit `2982923`，repo linhocheng/udnnews-platform）：gitleaks/Semgrep/npm audit 每 push＋ZAP baseline weekly＋手動；四 job push 三綠＋dispatch 驗 DAST 綠
- UDN CI 照出真問題：`podcast-worker/Dockerfile` 跑 root（缺 USER）→ 修源碼＋docker build 驗（node user），live worker 下次部署生效（記債）
- ailiveX 資安 CI 上線並實測綠（commit `9bea4c7` v18.19.0）：同四件套＋SAST 加 `p/python` 掃 agent；push 三綠＋dispatch 驗 DAST 綠
- ailiveX CI 照出既有存量債，照 Adam 點頭的計畫 triage：①3 個 Dockerfile 跑 root——node worker 修 USER、兩個 Python agent（live 共用 image＋legacy 快照）inline `nosemgrep` 記債 D7 不擅改 live；②root 2 個 npm high（Next.js 一串＋form-data）記債 D8，deps gate 暫 `critical` 硬擋＋`high` 非阻斷可見（CI annotation 浮出來不藏地毯），觸發＝v20 升 Next.js 後拉回 high
- 兩站 FOUNDATION.md 更新：UDN D1 清、ailiveX D1 清＋新增 D7/D8
- 對 Adam 講清 CSP nonce 為何打爛 Next.js SSR（框架自注入 inline hydration/RSC 串流 script→沒穿 nonce 全被擋成死屍；就算接對也強制 dynamic render 丟 static 快取）——收尾閒聊，沒動工

### 2026-07-19 第3場 · geo-authority 推 GitHub＋設計稿換裝 v2.0＋WAITIN 協作白皮書 v1.0 生效＋A0 交屋＋PR #1 合併
- 推 geo-authority 上 GitHub（private，linhocheng/geo-authority）；推前掃 tracked tree 零機密零 node_modules
- 寫 DESIGN_BRIEF.md（十節：sitemap/逐頁區塊/設計系統/不能動的原則）給設計師；檔案放桌面給 Adam 轉傳
- 設計稿全站落地（v2.0.0.001）：後台黃框黑面板＋側邊欄導航（唯一 client component）＋手機抽屜；客戶月報改亮色信紙（Noto Serif 大數字＋提及率 bar／引用率面積線／引擎 donut，全 SVG 程式計算零 LLM）；競品地圖去 emoji（✓/△/—＋空位金底）；prod 驗證：新 class 渲染、emoji 歸零、auth 負路徑照舊
- 審 WAITIN 協作白皮書 v0.1 → 出 v0.2（四修訂：領地邊界＝檔案邊界、開發環境 emulator、branch protection 現實註記、五題裁決）→ WAITIN 無異議簽 → v1.0 生效
- A0 交屋重構（v2.1.0.001）：reportCopy.ts／contentPrompt.ts 兩刀拆分——**golden test 四 fixture（rich/day0/down/empty）重構前後 byte 級零差異**；seedDev＋dev/README（雙重防呆實測：env 未設 exit 1、emulator 沒起 2 秒快速失敗）；門檻不變式（60-220 ⊇ 75-150）刻進兩檔註解
- 協作營運開通：WAITIN（baobaoagi-cpu）collaborator 生效、repo Issues 啟用、PR #1（HERMES 寫作規格）審核合併部署（v2.2.0.001，四條 Adam 側不變式全綠，審核紀錄留 PR 留言）
- 補 PR #1 配套（v2.2.1.001）：新規格每篇必含〔編輯補：…〕標記 → audit.editorNotes＋審核頁 badge/清單，防沒填完就發布
- A1 三面驗證（開關/key/計費）：四引擎**早已**全開且有效——beselfaviva 真實 runs 四引擎各 62-66 筆 ok 為證；WAITIN 的「補 key」請求基於過時情報，零改動收案
- Adam 裁決兩題：A1 全域開（實際已開）；OPERATOR_SECRET 由 Adam 自傳 WAITIN（指令給了，不經我留痕）
- 新 memory：project_geo_authority（平台＋協作結構入口）已進索引

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| UDN .github/workflows/security.yml | 新檔：資安 CI 四件套（`2982923`） |
| UDN platform/cloud-run/podcast-worker/Dockerfile | 加 USER node＋chown（缺 USER 修正） |
| UDN platform/FOUNDATION.md | D1 清＋D5 worker root 債 |
| ailiveX .github/workflows/security.yml | 新檔：資安 CI 四件套＋p/python＋deps 分級 gate（`9bea4c7`） |
| ailiveX cloud-run/podcast-worker/Dockerfile | 加 USER node＋chown |
| ailiveX agent/Dockerfile＋cloud-run/agent/Dockerfile | inline nosemgrep 記債 D7（不擅改 live 共用 image/legacy 快照） |
| ailiveX FOUNDATION.md | D1 清＋新增 D7/D8 |

---

## 下一步

1. 三站 CSP nonce 化獨立開工（乾淨 session）：一站一站來，middleware 生 per-request nonce → 穿 Next header → **真人點過登入/hydration/換頁/互動**確認沒變死屍。先挑最單純的一站試（geo 頁面少）當樣板
2. UDN/geo 補 pinning test（若之後為兩站引入測試框架）
3. v20 落地後：ailiveX 升 Next.js 清 D8，deps gate 從 critical 拉回 high

---

## 卡住 / 未解

2026-07-20 第1場：
- **三站 CSP nonce 化**（共通壓底債 D2/D6）：獨立硬工程，要逐站 middleware 生 nonce＋穿進 Next header 機制＋真人瀏覽器點過（header 有≠頁面還活）。退場＝對外開放註冊 or 真防 XSS 縱深。給乾淨 session
- **UDN/geo 承重牆帳只 prose-pinned**：兩站無測試框架，pinning test 待補（清單在各自 FOUNDATION.md）
- **ailiveX 兩債待清**：D7（live worker/agent 仍跑 root，各自下次部署才切非 root）、D8（root 2 個 npm high，撞 v20 平行 session 的 package.json，該他們升 Next.js 時做）
- geo `2ab2060 v2.3.1.001 文件：客戶說明書＋操作手冊` 未推——**不是我的**（別場本地 commit，版號格式不同），平行施工規約留著沒動
- 沿前場：ailiveX v20 觀察（別場在跑）、印象層後台化、rerank

2026-07-19 第3場：
- **A2（AIO adapter）我已承諾下週動工**——Serper key 已在 Secret Manager，audit 管道在用，有地基
- WAITIN 側等發：OPERATOR_SECRET（Adam 自傳）→ 他要復活 tone-spirit 跑發布前 baseline（星語智能品類文件發布在即，Day-0 快照只有一次機會）；W1 題庫入庫；W3 多語設計短文（憲法區雙簽）
- **版本號岔流**：平行築 7/19 下午用 v1.8.1→v1.8.6 接在我的 v2.2.1.001 之後（git 線性無衝突，純編號倒退）——下次 commit 從 v2.3 接續
- beselfaviva 4 篇草稿仍在 /content 等 Adam 批准；通知 webhook 仍未配置
- 「誤寫變體監測」想法（語麒麟笑話啟發：AI 誤寫品牌名率＝品牌健康指標，不能混入 aliases 以免污染提及率）——未開 Issue，W3 一起談或單獨開
- FOUNDATION.md 盤過：無到期債（D4 等真付費客戶、D5 等碰 notify 順手）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-20 第1場。*
