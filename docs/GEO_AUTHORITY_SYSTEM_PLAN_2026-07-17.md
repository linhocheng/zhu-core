# 權威收錄推薦系統 — 通用型系統規劃書 v1.0（2026-07-17）

> 目標：一套可重製、多租戶的「AI 引擎權威收錄」系統。指定主題（語氣靈／牙醫診所／養生茶／保養品…）→ 產出對應的內容資產與網址 → 讓 AI 搜尋引擎在回答相關問題時提及/引用客戶 → 全程可量測。
> 依據：GEO_CRAWLER_RESEARCH_2026-07-16.md 三路調研。
> 狀態：規劃，未動工。

---

## 一、可行性判定（誠實版）

### 成立的部分
1. **監測可完全自建**：四家官方 API 都回結構化 citation，每客戶每月量測成本 $20-30；商用工具同功能賣 $99-2,000/月。這塊是整個商業模式的地基——可量測，才能收月費。
2. **長尾問題詞是真機會窗**：AI 引擎系統性引用「排名不高但可摘取性高」的頁面（AIO 引用僅 37.9% 來自 Google top-10，跨 AI 平台僅 12%）。牙醫診所搶不到「植牙」大詞，但「植牙後多久可以喝咖啡」這種問題詞，一篇結構好的頁面就有機會被引用。
3. **系統天生可複製**：租戶（tenant）→ 主題（topic）→ 問題庫（prompts）→ 內容叢集 → 監測迴路，每一層都參數化，換客戶＝換資料不換程式。
4. **語氣靈是第一個租戶**＝自家狗糧，開發即交付。

### 不成立、不能賣的部分（要寫進合約邊界）
1. **不能保證被引用**：同一問題 24 小時內引用重疊僅 34-42%，引用本質是機率不是排名。能承諾的是「提及率/引用率的量測與趨勢」，不是「保證上榜」。
2. **引用→營收的因果未被證實**（唯一準實驗 p=0.16）。賣的是可見度，不是保證業績。
3. **量產內容會被 Google 打**（2025-10、2026-03 兩波 −50~80%）：每客戶內容量必須克制、有人工把關——這反而是服務差異化點（別家用量堆，我們用結構）。
4. **在地商家（牙醫）有另一半戰場在 Google Business Profile／地圖／評論**，純內容工程管不到；要嘛納入服務範圍，要嘛明講不含。
5. **調研數據全是英文市場**：中文查詢下各引擎引用偏好（PTT/Dcard/mobile01 是不是中文版 Reddit 角色）未驗證——第一個客戶的 Day-0 健檢就是驗證實驗。

### 判定
**可行。** 商品是三層：健檢（一次性、敲門磚）→ 監測月費（recurring）→ 收錄工程（主服務）。系統核心先蓋監測引擎，因為它同時是：交付物、銷售武器（健檢報告）、成效證明。

---

## 二、商品化定義

### 商品 A：AI 可見度健檢（一次性，銷售敲門磚）
輸入：客戶名稱＋網域＋行業主題。
產出一份報告：
- 現在 ChatGPT／Claude／Gemini／Perplexity／Google AIO 被問到「行業問題」時怎麼回答——提到誰？引用誰？客戶出現了嗎？競品出現了嗎？（每題重複採樣，給的是比例不是單次）
- 客戶網站技術體檢：SSR 與否／robots.txt 有沒有誤擋 AI 爬蟲／Cloudflare 預設封鎖檢查／Bing 收錄狀態／sitemap lastmod／schema 現況
- 機會清單：該行業 20-50 個長尾問題詞，哪些目前沒有強勢被引用來源＝空位
- 這份報告本身就是「你現在在 AI 世界是隱形的」的證據，轉化成 B/C 的訂單

### 商品 B：AI 可見度監測（月費）
- 每週對五個管道（4 官方 API＋Serper 抓 AIO）跑客戶 prompt 庫，每題 5-8 次採樣
- 儀表板＋週報：提及率、引用率、被引 URL、競品對比、趨勢
- 邊際成本：$20-30/客戶/月（＋Serper 幾美金）

### 商品 C：權威收錄工程（主服務，月費或專案制）
- 問題詞挖掘 → 內容叢集規劃 → 生成（LLM 走 bridge）→ 程式稽核＋人工把關 → 發布到客戶站或我方託管 hub → IndexNow/sitemap → 進監測迴路
- 實體建立（視客戶等級）：schema/sameAs、Bing Webmaster、GBP 建議、（高階）Wikidata
- 成效用商品 B 的數字說話，預期節奏誠實告知：發布→Bing 收錄→引用出現有 2-6 週滯後

---

## 三、系統總架構

```
┌─ Admin Console（Next.js，我方後台）
│   租戶管理｜主題管理｜prompt 庫｜內容審核台｜健檢報告產生｜儀表板
│
├─ Firestore（多租戶資料庫）
│   tenants / topics / prompts / runs / citations / content_assets / publications / site_audits
│
├─ Cloud Run Jobs（三支，全確定性程式）
│   ① monitor-job：發問四引擎＋Serper → parser → 寫 runs/citations → 週報
│   ② audit-job：網站技術體檢（爬 robots/sitemap/SSR 檢測/Bing 收錄查詢）
│   ③ publish-job：內容發布（客戶站 API 或 hosted hub commit）→ IndexNow ping
│
├─ 內容管線（LLM 生成走 bridge=月費吃到飽；稽核是程式）
│   問題挖掘 → 內容 brief → 草稿 → 程式稽核（引用活性/AI味/法規敏感詞/內鏈）→ 人工批准 → publish-job
│
└─ Hosted Content Hub（可選，Next.js SSR 多租戶站）
    客戶沒有可用網站時，內容發到我方託管的行業站（子網域或獨立域名）
```

沿用的既有資產：bridge（生成零 API 成本）、Cloud Run Jobs 天條套路、Async worker 六問、humanizer 規格（AI 味）、ANEWS dispatcher 經驗、Firestore ADC 天條。

---

## 四、資料模型（Firestore）

```
tenants/{tenantId}
  name, domain, industry, competitors[], locale, status, plan(A/B/C)

tenants/{t}/topics/{topicId}
  title, type(brand|category|question-cluster), status

tenants/{t}/prompts/{promptId}
  text（測試問題）, topicId, intent(brand|category|longtail), active, addedAt

tenants/{t}/runs/{runId}                ← 監測執行，每週一批
  scheduledAt, engine(openai|anthropic|gemini|perplexity|serper-aio),
  promptId, sampleIndex(1..N), answerText, mentioned(bool，程式比對品牌別名),
  citedUrls[{url, domain, title}], ourDomainCited(bool), competitorsCited[]

tenants/{t}/weekly_reports/{yyyy-ww}
  mentionRate{engine: %}, citeRate{engine: %}, topCitedDomains[], delta

tenants/{t}/content_assets/{assetId}
  topicId, type(pillar|article|faq), status(DRAFT|AUDITED|APPROVED|PUBLISHED|INDEXED),
  markdown, auditResult{citationCheck, aiFlavorScore, bannedTerms[], internalLinks},
  publishedUrl, publishedAt, indexedAt

tenants/{t}/site_audits/{auditId}
  ssr(bool), robotsBlocking[], cloudflareAiBlock(bool|unknown), bingIndexedPages,
  sitemapLastmodValid, schemaPresent[], findings[]
```

狀態機沿用藍圖精神但砍到夠用：`DRAFT → AUDITED → APPROVED(人工) → PUBLISHED → INDEXED`。不得跳關，轉移規則寫在 code。

---

## 五、監測引擎規格（monitor-job，系統心臟）

1. **輸入**：tenant 的 active prompts × 引擎清單 × 採樣數 N（預設 6）
2. **發問器**（四家官方 API，付費 key——這是產品成本，不是開發燒錢；額度上限寫進 env）：
   - OpenAI Responses API `web_search` tool → 解析 `annotations[].url_citation` ＋ `sources`
   - Anthropic `web_search` server tool（走 Batch API 壓半價）→ 解析 `web_search_result_location`
   - Gemini grounding → 解析 `groundingMetadata`，redirect URL 跟一層解出真域名
   - Perplexity sonar → 解析 `search_results`
   - Serper → 抓 Google AIO 區塊 JSON
3. **判定全是程式**：`mentioned` ＝品牌別名表（含錯別字變體）對 answerText 的字面比對；`ourDomainCited` ＝ citedUrls 域名比對。零 LLM 判斷。
4. **聚合**：週報＝(提及次數/總採樣) per engine，附被引 URL 排行、競品出現率。
5. **排程**：每租戶每週一輪；健檢＝手動觸發一輪＋audit-job。
6. **成本閘**：每租戶每月 API 花費上限，超過即停並告警（避免 prompt 庫失控）。

## 六、健檢產生器規格（audit-job）

全確定性掃描：
- `robots.txt` 抓下來 parse：有沒有擋 OAI-SearchBot/Claude-SearchBot/PerplexityBot/Bingbot/GPTBot
- SSR 檢測：curl 原始 HTML vs 渲染後內容量比對（關鍵內容在不在首次 response）
- Bing 收錄：`site:domain` 經 Serper/Bing API 查收錄頁數
- sitemap 存在性＋lastmod 合理性
- schema 掃描：首頁/文章頁的 JSON-LD type 清單
- Cloudflare 判定：response header 辨識＋提醒人工查 dashboard
- 輸出 findings[] → 套 report 模板產出健檢報告（Markdown→PDF）

## 七、內容管線規格

1. **問題挖掘**（半自動）：Serper 拉 PAA／related searches＋LLM 擴寫候選問題 → **人工挑選**進 prompts 與內容規劃（挖掘用 LLM，入庫要人點頭）
2. **內容結構**（實證背書的模板）：一句話答案先行（75-150 字可摘取段）→ 背景 → 常見誤解 → 觀點/方法 → 可驗證數據＋日期 → FAQ → 作者資訊。適度表格。**每頁必須有真實附加價值，每租戶每月頁數設上限（防 scaled content 懲罰）**
3. **生成**：走 bridge（Max 吃到飽），結構化輸出用 `<result>`＋Zod（bridge 不支援 tool_use）
4. **程式稽核**（不過不進人工審）：
   - 引用活性：每個外部引用 URL 打 200＋錨文本關鍵詞出現在目標頁
   - 法規敏感詞黑名單：醫療（醫療法 85/86 條廣告限制）、食品（不得宣稱療效）、化妝品（誇大用語）——**行業別名單，確定性字面攔截**，命中即標 HUMAN_REVIEW
   - AI 味：humanizer 規格搬 TS
   - 內鏈完整性：連回 pillar 頁/作者頁
5. **人工批准**：審核台一頁看 diff＋稽核結果，批准才進 publish-job
6. **發布**：客戶站（WordPress REST／Next.js repo PR）或 hosted hub；發布後自動 IndexNow ping＋sitemap 更新

## 八、技術選型與成本

| 件 | 選型 | 每客戶邊際成本/月 |
|---|---|---|
| 監測發問 | 四家官方 API 付費 key | $20-30（每週 500 採樣規模） |
| AIO/SERP | Serper | $2-5 |
| 內容生成 | bridge（Max） | ~$0 |
| 基建 | Cloud Run Jobs＋Firestore＋Vercel | 趨近 $0（Jobs 按次計費） |
| 合計 | | **<$40/客戶/月** |

GCP project：建議新開獨立 project（billing 隔離＝成本即報表）。

## 九、法規與風險備忘

- **醫療廣告是法律紅線**：醫療法 85 條限制醫療廣告內容與方式，診所內容連「最權威」「無痛保證」都碰不得——敏感詞黑名單是產品必備件不是加分件。
- 食品/化妝品：宣稱療效違反食安法/化妝品衛生管理法，同上。
- 為客戶產的內容必須署名真實作者/診所——匿名量產＝Google 打擊目標。
- 合約承諾用可量測指標：提及率、引用率、Bing 收錄數、機會詞覆蓋——不承諾排名/業績。

## 九之二、管道↔後台協議（2026-07-17 深夜與 Adam 拍板，v1.1）

> 核心主張：**後台不是一層 UI，是資料模型的鏡子。管道與後台之間唯一的介面是 DB schema＋狀態機，兩邊永不直接對話。** 守住這條，新管道自動長出後台畫面，不用回頭補丁。

1. **單一真相源**：管道所有狀態必落 Firestore，不准有只活在記憶體/log 的狀態。後台永遠讀 DB。後台壞了管道照跑；管道死了後台看得見屍體。
2. **任何新管道入場必繳四件套**：task doc（參數/status/error/attempt/時間戳）＋心跳 lease（watchdog 可判死，failed≠running）＋產物指標（跑完寫回產出）＋成本記錄（searches/tokens/$）。四件套齊→後台任務中心是通用頁，新管道零 UI 改動自動出現。
3. **狀態機是共同語言**：狀態 enum 只定義在唯一一份 `collections.ts`（咽喉），管道轉移與後台顯示 import 同一份，禁止兩邊各寫字串。
4. **後台下指令，不執行**：後台操作＝寫 command doc＋觸發 job，永不在 lambda 跑長任務。按鈕語義是「已排單」不是「做完了」。
5. **每個 UI 欄位要有血管**：每個顯示數字都答得出「誰寫入、何時更新」；反向：管道每加新欄位，同 commit 回答「後台哪頁看得到」。答不出＝種假中台。
6. **設定即資料**：prompt 庫、租戶設定、採樣數、預算上限、引擎開關全在 DB、後台可改、管道跑前讀 DB。寫死在 code 的設定＝後台管不到的黑箱（secrets 除外）。
7. **增刪改停全連動**（Adam 補充）：每個實體（租戶/prompt/任務/引擎設定）都要能增、刪、改、**停**——「停」是一等狀態不是刪除替代品；每個操作真的寫 DB，按了 DB 沒變＝假按鈕。
8. **管道鍵透明**（Adam 補充）：任何會影響引擎輸出的隱藏參數——完整送出的問題、model 名、tool 設定、max_tokens、system prompt 有無——全部入庫、後台可見；每筆 run 存當次設定快照，可對賬「當時到底送了什麼」。（真相鏈 SOP 制度化）

後台 v1 頁面（由協議推導）：租戶總覽｜租戶詳情（prompt 增刪改停＋batch 歷史＋報告）｜任務中心（通用 jobs 列表＋排單按鈕）｜系統設定（管道鍵透明＋預算閘）。審核佇列頁等 Phase 2 有真資料才上（先上空頁＝自己種假中台），schema 先定。
Auth：頁面與 /api 同鎖（operator secret），不重蹈「登入只擋頁面不擋 API」反範式。

## 十、施工階段

### Phase 0 — 監測引擎 MVP（第一刀，約 2-3 個晚上）
1. Firestore schema（tenants/prompts/runs/citations）＋種子資料：租戶一＝語氣靈、租戶二＝模擬牙醫（證明通用性）
2. monitor-job：四引擎發問器＋四個 parser＋Serper AIO
3. 跑 Day-0 基線兩租戶各一輪 → 手動出第一份週報
4. **驗收（鑑別信號）**：兩個租戶、同一套 code、只換資料，跑出各引擎「提及率/引用率」表；語氣靈的基線數字落地（預期趨近 0%——這個 0 就是之後所有成效的對照組）

### Phase 1 — 健檢產生器（+1-2 晚）
audit-job＋報告模板 → 對任一真實網域一鍵產出健檢報告 → **這是可以拿去見客戶的第一個商品**

### Phase 2 — 內容管線＋發布（+1 週）
稽核器（引用活性/敏感詞/AI 味）→ 審核台（簡單 admin 頁）→ publish-job＋IndexNow → 語氣靈定義頁上線走完全流程

### Phase 3 — 週報自動化＋儀表板＋多租戶後台（+1 週）
cron 化每週一輪、trend 圖、客戶版報表輸出

### Phase 4 —（接單後）第一個付費客戶落地
用真客戶驗證中文市場引用偏好，修正問題挖掘與內容模板

## 十一、拍板前待 Adam 決定的三件事

1. **付費 API key**：監測發問必須燒付費 key（天條：需你同意）。提議獨立 key＋月上限 $50 起步。
2. **hosted hub 的域名策略**：客戶沒網站時內容發到哪（我方行業站？子網域？）——影響 Phase 2 設計，Phase 0 不擋路。
3. **今晚開工範圍**：建議就是 Phase 0 的 1-2（schema＋發問器＋parser），跑出語氣靈 Day-0 基線。
