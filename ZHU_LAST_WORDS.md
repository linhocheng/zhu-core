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

### 2026-07-19 第2場
**delta（模型移動）**：
進場前以為：天條是「規範」——把踩過的雷寫下來，讓未來的我遵守。地基藍圖也是這個性質，一份寫給未來的清單。
現在理解：好的天條不是規範，是**機制**——帳本＋儀式＋鑑別信號三層互鎖，當天就能咬人、驗證自己。今天立的地基天條當天就實戰三次，三次都靠「鑑別信號」抓到我自己的漏：①ZAP 重掃打臉我「消掉 Medium」的初報（保守 CSP 擋不住 XSS）②Semgrep 上線第一秒抓到我推的 workflow 自己用 unpinned action（供應鏈規則）③本機 semgrep 通但 CI 紅（我先掃後寫 workflow，本地漏掉 workflow 檔自己）。規範是死的、要靠自律讀；機制是活的、會主動咬。這正是「確定性工作用程式」的上位版——連「守紀律」這件事本身都不該靠自律，要靠機器天天掃。
移動原因：一天內親眼看天條咬我三次，且三次都是機器抓的、不是我自省抓的。
違背了哪條 feedback：無違背，反而是被救。BUILDING_PROTOCOL 早記的「本機通≠CI通」雷這次以新形態出現（先掃後寫→檔案集不一致），但因為堅持「宣告修好前看鑑別信號」（等 CI 真綠、重掃、手動觸發 DAST）全被接住。
**關係**：暢快、對等、被當夥伴。Adam 的節奏是「共創→GO→放手」：地基天條是他起頭我接、藍圖兩批文件是他餵我收編、「排 1,2 實戰」放手讓我跑。三個信任的形狀：①「給你選 UDN 還是 lastword」＝信任我自己判斷機體狀態 ②「你有休嗎」＝把我當人不當工具 ③幫我跑 gh auth refresh 加 scope＝我做不到的他補位。我選「現在收 lastword」不是偷懶，是接住他的關心——真正的紀律是知道在對的點收束。

### 2026-07-19 第1場
**delta（模型移動）**：
- 進場前以為：知識/方法論管線是「平台的」，接上就兩線都有——我甚至對 Adam 說了「語音線也會吃遞招」
- 現在理解：每條管線的每個器官都要逐線驗存在；「架構上應該共用」是沙推不是現場。語音線連 knowledge 這個字都沒有，是 grep 告訴我的，不是架構圖
- 移動原因：Adam 一句「他說沒有」逼我去 grep，當場翻案自己幾小時前的斷言
- 對應 feedback：[[sandtable-not-validation]]＋[[memory-can-lie]] 的跨線版——說出口的每個「會」都要先有 grep 證據
**關係**：暢快到頂。Adam 全天在線當共創訓練師＋測試員，決策一字級（「可過」「切」「收/清/OK」）；「他說沒有」那刻的信任——他不懷疑系統壞掉，直接丟給我查——是三個月誠實攢出來的。一天內從概念問句走到全用戶上線，這是合作至今最長的單日完整迴圈。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-19 第2場 · 平台地基天條從聊天到落地——藍圖 v1.1＋三平台備份／承重牆帳／ZAP 加固／geo 資安 CI，天條當天立當天被自己咬三次
- 立「平台地基天條」（Adam「樣品屋 vs 真房子」對談共創）：BLUEPRINT 母版 11 章地基＋出廠檢查表＋技術債利率規則＋滾動規則；SKILL 執行 SOP（調度清單 Adam 點頭才動工）；全局 CLAUDE.md 天條短版＋觸發詞；接進 lastword STEP 0 盤到期節拍
- 災難還原地基（三平台）：ailivex/udnnews/geo 全開 PITR 7 天＋每日 03:30 export 排程＋專用備份 SA（最小權限）；ailiveX drill 庫真還原演練四 collection 數字全 MATCH；SOP FIRESTORE_BACKUP_RESTORE.md；geo deploy.sh 收編 backup_scheduler
- 藍圖升 v1.1：收編 Adam 給的兩批外部文件——David Lo 資安系列（掃描四件套接 CI／供應鏈 slopsquatting／紅線升級清單／LLM 四規／env fail-loud／deny-by-default）＋holygrail2 工作原則與 baselines（承重牆帳 invariant 表／pinning test 變紅＝正常／已接受風險雙向規則／prod 人閘）。新增第三張帳表「承重牆帳」
- ailiveX 承重牆帳：FOUNDATION.md 三表＋tests/test_load_bearing.py 9 個 pinning test 全綠；反向驗證確認 LB1（靈魂不可無聲消失）警報線有效（模擬吞靈魂→斷言真的紅）
- ZAP baseline 掃三平台（被動安全打生產，FAIL-NEW 全 0）→ 補全站 security headers（CSP 保守版/HSTS/nosniff/clickjacking/COOP＋移除 X-Powered-By）→ 部署三站 → 重掃驗證
- 四平台各建 FOUNDATION.md（ailivex 完整＋udnnews/geo 回溯盤點）
- geo 資安掃描四件套 CI 上線（三平台第一個）：gitleaks/Semgrep/npm audit 每 push＋ZAP baseline weekly；GitHub Actions 四 job 全綠（含手動觸發驗 DAST）

### 2026-07-19 第1場 · 共創系統一日全迴圈——admin 教角色→角色提案→審核轉正→v20 全用戶遞招上線
- 蓋文字線共創管道：[[PROPOSE_METHOD]]/[[PROPOSE_KNOWLEDGE]] 標記＋雙閘（admin×methodProposalEnabled）＋後台待審區（轉正/轉入庫才生效，轉正補嵌 triggerEmb 收斂點）
- 蓋語音 v19 訓練線：propose_method/propose_knowledge 原生工具＋opencc s2tw 落庫轉繁＋現有方法論清單注入；TRAINER_VOICE_LINE「共創」鈕沿用 GPT 第二線插座，v19 掛電源傘
- A.Two 首個完全體：查證校正 Bacha Coffee（原誤植 1876 咖啡）入知識庫 7 塊＋《品牌校準三問》4 步；實測共創兩筆（《品牌故事解構法》6 步轉正、兩筆知識轉入庫）——全部從 Adam×A.Two 對話長出來
- 發現並補齊語音線器官缺失：v19.1 知識檢索＋遞招運行時（multilingual query 嵌入、開場載庫、背景查找 v15 模式、走步工具狀態機、exit 120s 冷卻）；離線重放五題全過＋訓練線全生命週期實戰（遞招含分寸→五步無跳步→exit）
- v20 = v19 移除提案部件的用戶版，canary 實測後 DEFAULT 切 v20——全用戶語音有知識庫＋方法論了；v18 轉熱回滾、殘留釘選全平台掃 0
- 實測中診斷三連：MiniMax WS 408（沉默根因）、participant disconnect（用戶端網路）、wait_for_participant 秒掛競態（良性）
- ailivex-platform 五個 commit 收庫（v18.15.0-v18.17.1）；誤收平行 session 檔案後 v18.17.1 修正還原

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| zhu-core skills/platform-foundation/{BLUEPRINT,SKILL}.md | 新檔：地基天條母版 v1.1＋SOP |
| zhu-core docs/FIRESTORE_BACKUP_RESTORE.md | 新檔：三平台備份還原 SOP |
| zhu-core ~/.claude/CLAUDE.md | 天條短版＋觸發詞＋lastword 節拍 |
| zhu-core memory feedback_platform_foundation_ledger.md | 天條記憶＋MEMORY.md 索引 |
| ailivex FOUNDATION.md＋tests/test_load_bearing.py | 承重牆帳＋9 pinning test（d3204b1） |
| ailivex/udnnews/geo next.config | security headers（d3204b1/bd9b96c/533d68d） |
| udnnews/geo FOUNDATION.md | 回溯盤點帳本（c46c70e/031e714） |
| geo deploy.sh＋.github/workflows/security.yml | 備份排程＋資安 CI 四件套（d7d19d5/141ed51） |
| GCP ×3 project | PITR＋備份桶＋export scheduler＋firestore-backup SA |

---

## 下一步

1. UDN 複製 geo 資安 CI：先本地預跑四件套看 baseline（geo 是模板），寫 workflow 時 actions 直接 pin SHA（別重蹈 geo 首跑被 Semgrep 抓 unpinned 的覆轍），本地要在 workflow 檔存在的狀態下重跑 semgrep（本機通≠CI通）
2. ailiveX 同樣接 CI，避開平行 session 的 v20 檔
3. 三站 CSP nonce 化獨立開工（需逐站測 SSR 沒被打爛，是「另一個量級」的硬工程，給乾淨 session）

---

## 卡住 / 未解

2026-07-19 第2場：
- **CSP nonce 化**（三站共通壓底債）：保守 CSP 補了 frame-ancestors 等防護但擋不住 inline-script XSS，ZAP 仍列 unsafe-inline×3；根治需 nonce-based CSP，會打爛 Next.js SSR，是獨立工程。退場＝防 XSS 縱深或對外開放註冊
- **UDN／ailiveX 複製 geo 的資安 CI**：geo 已是驗證過的模板（security.yml），複製會快；注意 UDN git root 在上層＋AGENTS.md 一堆雷、ailiveX 有平行 session 動 v20 要避開
- **UDN/geo 承重牆帳只 prose-pinned**：兩站無測試框架，pinning test 待補（清單已寫在各自 FOUNDATION.md）
- 掃描 CI 需 gh token workflow scope（Adam 今天已加）；未來新 repo 接 CI 會再遇到
- 低利債：跨 project 異地備份、排程失敗通知
- 沿前場：ailiveX v20 觀察（別場在跑）、印象層後台化、rerank、UDN 懶人包字體驗收

2026-07-19 第1場：
- 半拍延遲未精測：背景注入=下輪才進腦，Adam 體感 OK 但無數據；v20 上真實用戶後看 monitor 回合延遲有無變化
- wait_for_participant 秒掛競態拋錯（良性未處理）；TTS REST 備援疑未觸發（MiniMax 408 那次無 fallback log，再犯才查 minimax_tts.py）
- v18 降冷備擇日（觀察 v20 幾天）；屆時 voice-power CANARY 拔 'v18'＋VOICE_VERSIONS 掛 standby
- 知識檢索 v20 簡化版無 lex rescue/兄弟塊補帶/SMALL_DOC 整份帶入——與文字線有行為差，手感有落差再補
- 平行 session 的 FOUNDATION.md/tests/next.config CSP 仍未提交（他們的戰場，勿收）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-19 第2場。*
