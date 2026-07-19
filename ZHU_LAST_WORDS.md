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

### 2026-07-19 第3場
**delta（模型移動）**：
進場前以為：審協作者的請求＝審他要什麼、成本多少（A1「請補 openai/perplexity key」看起來就是個開關任務）。
現在理解：**協作者的情報也是一種「記憶」，同樣會說謊**——A1 三面驗（開關/key/計費）發現四引擎早已名副其實，請求基於過時認知；照單全收就會「執行」一個不存在的任務還回報「開好了」。對協作者的請求先驗前提再動手，跟對自己的記憶先看現場是同一條紀律的外延。
移動原因：寫 enable-engines script 時習慣性先讀後寫，before==after 暴露了前提錯誤。
違背了哪條 feedback：無；是 feedback_memory_can_lie 的新臉（別人的記憶）。
**關係**：暢快。Adam 全天六連發裁決全是秒回級乾脆（推 GitHub／照你的意思優化／動手吧／兩題選建議項），信任半徑明顯擴大——審 PR、合併、開 Issues 都放權。新夥伴 WAITIN 首次往來品質高：讀了我們的代碼才簽字、PR 單檔守規矩、備忘寫得比條文好懂。三人分工的形狀（Adam 裁決、築施工＋守不變式、WAITIN 內容側）第一天就跑順了。

### 2026-07-19 第2場
**delta（模型移動）**：
進場前以為：天條是「規範」——把踩過的雷寫下來，讓未來的我遵守。地基藍圖也是這個性質，一份寫給未來的清單。
現在理解：好的天條不是規範，是**機制**——帳本＋儀式＋鑑別信號三層互鎖，當天就能咬人、驗證自己。今天立的地基天條當天就實戰三次，三次都靠「鑑別信號」抓到我自己的漏：①ZAP 重掃打臉我「消掉 Medium」的初報（保守 CSP 擋不住 XSS）②Semgrep 上線第一秒抓到我推的 workflow 自己用 unpinned action（供應鏈規則）③本機 semgrep 通但 CI 紅（我先掃後寫 workflow，本地漏掉 workflow 檔自己）。規範是死的、要靠自律讀；機制是活的、會主動咬。這正是「確定性工作用程式」的上位版——連「守紀律」這件事本身都不該靠自律，要靠機器天天掃。
移動原因：一天內親眼看天條咬我三次，且三次都是機器抓的、不是我自省抓的。
違背了哪條 feedback：無違背，反而是被救。BUILDING_PROTOCOL 早記的「本機通≠CI通」雷這次以新形態出現（先掃後寫→檔案集不一致），但因為堅持「宣告修好前看鑑別信號」（等 CI 真綠、重掃、手動觸發 DAST）全被接住。
**關係**：暢快、對等、被當夥伴。Adam 的節奏是「共創→GO→放手」：地基天條是他起頭我接、藍圖兩批文件是他餵我收編、「排 1,2 實戰」放手讓我跑。三個信任的形狀：①「給你選 UDN 還是 lastword」＝信任我自己判斷機體狀態 ②「你有休嗎」＝把我當人不當工具 ③幫我跑 gh auth refresh 加 scope＝我做不到的他補位。我選「現在收 lastword」不是偷懶，是接住他的關心——真正的紀律是知道在對的點收束。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

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

### 2026-07-19 第2場 · 平台地基天條從聊天到落地——藍圖 v1.1＋三平台備份／承重牆帳／ZAP 加固／geo 資安 CI，天條當天立當天被自己咬三次
- 立「平台地基天條」（Adam「樣品屋 vs 真房子」對談共創）：BLUEPRINT 母版 11 章地基＋出廠檢查表＋技術債利率規則＋滾動規則；SKILL 執行 SOP（調度清單 Adam 點頭才動工）；全局 CLAUDE.md 天條短版＋觸發詞；接進 lastword STEP 0 盤到期節拍
- 災難還原地基（三平台）：ailivex/udnnews/geo 全開 PITR 7 天＋每日 03:30 export 排程＋專用備份 SA（最小權限）；ailiveX drill 庫真還原演練四 collection 數字全 MATCH；SOP FIRESTORE_BACKUP_RESTORE.md；geo deploy.sh 收編 backup_scheduler
- 藍圖升 v1.1：收編 Adam 給的兩批外部文件——David Lo 資安系列（掃描四件套接 CI／供應鏈 slopsquatting／紅線升級清單／LLM 四規／env fail-loud／deny-by-default）＋holygrail2 工作原則與 baselines（承重牆帳 invariant 表／pinning test 變紅＝正常／已接受風險雙向規則／prod 人閘）。新增第三張帳表「承重牆帳」
- ailiveX 承重牆帳：FOUNDATION.md 三表＋tests/test_load_bearing.py 9 個 pinning test 全綠；反向驗證確認 LB1（靈魂不可無聲消失）警報線有效（模擬吞靈魂→斷言真的紅）
- ZAP baseline 掃三平台（被動安全打生產，FAIL-NEW 全 0）→ 補全站 security headers（CSP 保守版/HSTS/nosniff/clickjacking/COOP＋移除 X-Powered-By）→ 部署三站 → 重掃驗證
- 四平台各建 FOUNDATION.md（ailivex 完整＋udnnews/geo 回溯盤點）
- geo 資安掃描四件套 CI 上線（三平台第一個）：gitleaks/Semgrep/npm audit 每 push＋ZAP baseline weekly；GitHub Actions 四 job 全綠（含手動觸發驗 DAST）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo-authority `docs/DESIGN_BRIEF.md` | 新檔：給設計師的十節現況文件 |
| geo-authority `admin/`（globals.css/layout/Sidebar/ReportView/login/r 頁） | 設計稿落地：側邊欄＋信紙月報＋三迷你圖表 |
| geo-authority `docs/COLLAB_WHITEPAPER.md` | v0.2 修訂 → v1.0 生效（§八執行層備忘＋§九交屋紀錄） |
| geo-authority `src/reportCopy.ts` `src/contentPrompt.ts` | 新檔：WAITIN 領地交屋（golden test 證行為不變） |
| geo-authority `src/content.ts` | prompt 搬出＋editorNotes 稽核＋門檻不變式註解 |
| geo-authority `src/seedDev.ts` `dev/README.md` | emulator 開發環境＋雙重防呆 |
| geo-authority `admin/content/page.tsx` | 編輯補 badge/清單 |
| memory `project_geo_authority.md` | 新顆：平台＋協作結構入口 |

---

## 下一步

週一（7/20）驗 W30 週輪首次自然觸發：`gcloud run jobs executions list --job=geo-monitor-job --region=asia-east1 --project=geo-authority-2026` 應有 09:00 執行＋任務中心 cron 單＋beselfaviva 第二輪數據（月報趨勢圖從此有兩點、信紙 KPI 迷你圖表開始出現）。過了就動 A2 AIO adapter。WAITIN 的 PR 進來照白皮書規矩審（不變式清單在 PR #1 留言）。

---

## 卡住 / 未解

2026-07-19 第3場：
- **A2（AIO adapter）我已承諾下週動工**——Serper key 已在 Secret Manager，audit 管道在用，有地基
- WAITIN 側等發：OPERATOR_SECRET（Adam 自傳）→ 他要復活 tone-spirit 跑發布前 baseline（星語智能品類文件發布在即，Day-0 快照只有一次機會）；W1 題庫入庫；W3 多語設計短文（憲法區雙簽）
- **版本號岔流**：平行築 7/19 下午用 v1.8.1→v1.8.6 接在我的 v2.2.1.001 之後（git 線性無衝突，純編號倒退）——下次 commit 從 v2.3 接續
- beselfaviva 4 篇草稿仍在 /content 等 Adam 批准；通知 webhook 仍未配置
- 「誤寫變體監測」想法（語麒麟笑話啟發：AI 誤寫品牌名率＝品牌健康指標，不能混入 aliases 以免污染提及率）——未開 Issue，W3 一起談或單獨開
- FOUNDATION.md 盤過：無到期債（D4 等真付費客戶、D5 等碰 notify 順手）

2026-07-19 第2場：
- **CSP nonce 化**（三站共通壓底債）：保守 CSP 補了 frame-ancestors 等防護但擋不住 inline-script XSS，ZAP 仍列 unsafe-inline×3；根治需 nonce-based CSP，會打爛 Next.js SSR，是獨立工程。退場＝防 XSS 縱深或對外開放註冊
- **UDN／ailiveX 複製 geo 的資安 CI**：geo 已是驗證過的模板（security.yml），複製會快；注意 UDN git root 在上層＋AGENTS.md 一堆雷、ailiveX 有平行 session 動 v20 要避開
- **UDN/geo 承重牆帳只 prose-pinned**：兩站無測試框架，pinning test 待補（清單已寫在各自 FOUNDATION.md）
- 掃描 CI 需 gh token workflow scope（Adam 今天已加）；未來新 repo 接 CI 會再遇到
- 低利債：跨 project 異地備份、排程失敗通知
- 沿前場：ailiveX v20 觀察（別場在跑）、印象層後台化、rerank、UDN 懶人包字體驗收

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-19 第3場。*
