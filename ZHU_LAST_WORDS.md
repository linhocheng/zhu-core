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

### 2026-07-18 第1場
**delta（模型移動）**：
進場前以為：商業包裝（指數、故事句、情緒燃料）和工程誠實（確定性、零生成）之間要做取捨，包裝＝往「數字可以修飾」滑一步。
現在理解：顧問要的七層皮 100% 用模板句＋程式聚合蓋得出來——指數是透明公式、事實句是規則挑選、作戰計畫是排序輸出。包裝的本質是「資訊架構＋語言翻譯」，不是數字加工；「沒有任何 AI 生成的數字」反而成了商品差異點。移動原因：實際蓋完七層，每一層都找到了確定性實作。
違背了哪條 feedback：無重大違背；「停＝全停」缺口是 Adam 先看見的（增刪改停協議自己定的卻只 enforce 一條管道）——防禦釘收斂點的舊心法，新踩法。
**關係**：暢快。Adam 節奏乾脆（修/GO/三件一起做），問的兩個問題都問在要害上（暫停為何還跑＝抓出協議破口；初心是什麼＝逼我把商業敘事收攏）。他找顧問驗市場、我顧管道誠實，分工成形。收尾他說「你可以自己寫 lastword」——信任的形狀。

### 2026-07-17 第1場
**delta（模型移動）**：
進場前以為：AI 引用監測是黑盒、是整個 GEO 商業模式最虛最難量的一層（前次評估原話「監測層是全藍圖最虛的一層」）。
現在理解：四家官方 API 全回結構化 citation，監測是**最便宜、最確定、最該先蓋**的一層（$30/月/客戶，商用工具賣 $99-2000）；真正虛的是「引用→營收」的因果（唯一準實驗 p=0.16）。移動原因：三路調研拿到一手 API 文件與定價。
違背了哪條 feedback：監視器盯錯 job doc（抓「最新一筆」而不是鎖 batchId 唯一鍵）差點誤報 canceled；壓縮 summary 接手開場（+3）＋引用錯對象（+2）醉酒指數約 5 微醺——但全程部署皆有鑑別信號驗證，未涉不可逆操作。
**關係**：暢快高產的一天。Adam 全天在線快節奏拍板（「go baby go」），親手測出三個真問題（redirect 0.0.0.0、錯誤標籤語意、jobs 刪除）——不是驗收是共建。他的產品直覺持續餵進協議（網域是行業的錨、題庫繁中打底、隱藏 prompt 要亮出來），我的工作是把直覺變成結構。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-18 第1場 · geo-authority 掃雷＋月報前台＋顧問七層包裝＋自動駕駛月循環（v1.5→v1.8）
- 掃雷三發：①雲上 Jobs→bridge 真雷＝job 容器沒掛 BRIDGE 秘密（不是 CF 524），補 Secret Manager＋job＋deploy.sh 三處後雲端 content job 實測通（2123 字草稿全過稽核）②beselfaviva 髒別名 15→11（套 validateProfile 規則，其他租戶掃過乾淨）③死 OpenAI key 盤點：只剩一把躺在 ailive-platform 三個歷史快照檔（等 Adam 點頭才刪）
- Phase 3.5 客戶月報前台上線（v1.6）：report 管道（確定性聚合零 LLM，reports/{month} 冪等覆蓋）＋`/r/{token}` share-link 客戶前台（免登入、token 即憑證、壞 token 不洩漏）＋route group 拆 (admin)/(public)＋租戶頁月報區（產生/輪換/撤銷分享）
- Adam 抓到「暫停租戶為何還在跑」→ 修「停＝全停」（v1.6.1）：狀態檢查搬進 processJob 咽喉，五條管道一個檢查全守，CLI 手排也繞不過；鑑別信號驗過（暫停租戶單 failed＋零產物）
- 顧問七層報告架構全落地（v1.7）：封面指數（提及×0.6＋引用×0.4，公式附錄揭露）→三事實→儀表板三格→競品地圖（交戰題前、空位題後）→工作紀錄＋誠實承諾→下月作戰計畫→附錄工程師版。全部模板句零 LLM——包裝不犧牲確定性
- 自動駕駛月循環三件套（v1.8）：①每月 1 號 09:00 月報 cron（geo-monthly-report scheduler，冪等建單）②cron 月報自動排產作戰計畫三題草稿（題目去重；人按「產生月報」不偷排）③通知層：notify.ts 咽喉（job 失敗/草稿等審核/月報出爐）→站內通知中心頁＋nav 未讀徽章＋settings 可配 webhook（Discord/Slack 相容）
- 全迴路本機實測一次通：cron 月報→自動排 3 單→bridge 寫 3 篇→稽核全過→佇列 5 篇（1 APPROVED）→通知 5 則；月輪冪等（二跑 0 單）＋空月優雅降級驗過
- deploy.sh 收編兩條 scheduler 為唯一真相源（昨天手建的週輪一起收，天條補帳）
- 對 Adam 講清系統初心（給顧問的 brief）：黑盒打開＝量測/診斷/改善閉環，月報＝續費引擎

### 2026-07-17 第1場 · geo-authority 權威收錄平台從零到正式站（研究→規劃→監測→後台→健檢→內容管線）
- 開場收案兩件：ailivex 語音修復驗證（Anthropic 月限額，Adam 調完後 log 驗非零 TTS bytes＋零 400）＋ailive 開關制計費錶複核（脈衝式，22h 平線，天條尾巴閉）
- 三路平行調研 GEO/AI爬蟲/引用監測，彙整入 `docs/GEO_CRAWLER_RESEARCH_2026-07-16.md`（含所有來源 URL）
- 寫權威收錄系統規劃書 `docs/GEO_AUTHORITY_SYSTEM_PLAN_2026-07-17.md`＋與 Adam 拍板管道↔後台協議 8 條（§九之二：單一真相源/四件套/狀態機咽喉/下指令不執行/血管/設定即資料/增刪改停/管道鍵透明）
- 建 `~/.ailive/geo-authority`（新 GCP project geo-authority-2026）從零到正式站：四引擎監測管線（Anthropic/Gemini/OpenAI 強制搜尋/Perplexity，每題重複採樣＋回音防護＋確定性判定）、job 四件套（task doc/心跳/產物/成本）、多租戶 Firestore、admin 後台（四頁＋內容審核＋auth 頁面 API 同鎖）、Cloud Run service(min=0)+Jobs+Secret Manager+Scheduler 週輪（週一 09:00 台北）
- intake 管道：AI 自動建檔（官網錨定：程式抓官網快照→別名焦點→名稱輔助；題庫一律繁中）；Aviva 三輪驗證（英文→繁中→官網錨定抓到 Direct Line 收購焦點題）
- audit 管道（健檢商品）：robots 逐 bot 判定/SSR/sitemap/Cloudflare/Serper SERP 佔位/AI 可見度聚合/空位題清單，全確定性
- content 管道第一刀：空位題→bridge(Max) 草稿→確定性稽核（法規敏感詞 6 類/AI 套語/外部連結防捏造/一句話答案結構）→審核佇列；第一篇 beselfaviva 草稿 2051 字稽核全過
- Day-0 基線：語氣靈＋模擬牙醫四引擎全 0%（對照組鎖定）；Adam 真客戶 beselfaviva（AVIVA 保養品）建檔＋263 筆監測＋健檢＋草稿全鏈跑通
- 修三雷：Cloud Run 代理後 redirect 0.0.0.0（x-forwarded-host）、成本閘誤殺（只數計費搜尋）、intake 別名長句污染（收緊為稱呼）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo-authority `src/monthlyReport.ts` | 新檔：report 管道＋buildSummary 商業層（指數/事實/作戰計畫/競品地圖全模板句） |
| geo-authority `src/notify.ts` | 新檔：通知咽喉（站內 doc＋webhook，絕不 throw） |
| geo-authority `src/processJob.ts` | 停＝全停收斂點檢查 |
| geo-authority `src/jobs.ts` | createMonthlyReportJobs＋finishJob/reap 失敗通知 |
| geo-authority `admin/` | route group 拆分、/r/[token] 客戶前台、ReportView 七層、通知中心頁、nav 徽章、settings webhook 欄 |
| geo-authority `deploy.sh` | BRIDGE secrets＋schedulers 段（兩條 cron 唯一真相源） |
| GCP | secrets BRIDGE_URL/BRIDGE_SECRET；scheduler geo-monthly-report（0 9 1 * * Asia/Taipei） |

---

## 下一步

週一驗 W30：`gcloud run jobs executions list --job=geo-monitor-job --region=asia-east1 --project=geo-authority-2026` 應有 09:00 執行＋任務中心 cron 單＋beselfaviva 出現第二輪數據（月報趨勢表從此有兩行、封面出現↑↓箭頭）。Adam 帶顧問意見回來後迭代包裝層；接第二個真客戶是平台現在最缺的東西。

---

## 卡住 / 未解

2026-07-18 第1場：
- 週輪首次自然觸發驗證＝週一（7/20）09:00 batch `2026-W30`；月輪首發 8/1 09:00（月報 2026-07＋自動排產）——兩個鑑別信號都還沒到期
- 通知 webhook 未配置（settings 頁貼 Discord/Slack webhook URL 即生效；現在只進站內通知中心）
- beselfaviva 4 篇草稿在 /content 等批准（熟齡肌精華液＋自動排產的卸妝/防曬×2）；批准後仍是人工貼稿（Phase 2 自動發布被 Adam 暫緩）
- ailive-platform 三個含死 OpenAI key 的快照檔（.env.firebase.tmp/.env.local.fresh/.env.prod.tmp）等 Adam 點頭刪
- 語氣靈租戶暫停中：月報是舊格式（重生即升級）、無官網無分享；下一步是官網實體
- zhu-core 兩份 GEO 文件（研究＋規劃書）昨天 fanout 沒收進 git，本場一起收

2026-07-17 第1場：
- beselfaviva 監測 263/324（成本閘誤殺，閘已修）——要跑滿就在任務中心排新 batch（~$2）
- Cloud Run Jobs 上 bridge 連通性未驗（本機通；ANEWS 有 CF 524 前例）——**content job 第一次在雲上跑要盯**，不通就要走直連 IP 修法
- Serper AIO adapter 未做；發現台灣中文查詢 AIO 觸發率低，監測設計要帶著這個事實
- Phase 2 第二刀（自動發布：WordPress API/GitHub PR/IndexNow）未做——現在批准後人工貼稿
- Phase 3.5（客戶前台＋月報）未做，已進規劃書
- 週輪首次自然觸發＝下週一 09:00 batch `2026-W30`——鑑別信號待驗
- beselfaviva 髒別名（長句）殘留 DB——Adam 可 UI 改或按 AI 重建
- 語氣靈租戶暫停中且無官網——語氣靈專案要動的下一步是官網實體
- OpenAI 舊 key 四把全 401 死在各 env 檔（雜訊，有空清）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-18 第1場。*
