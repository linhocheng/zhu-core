# GEO／AI 爬蟲／引用監測 — 研究彙整（2026-07-16）

> 背景：語氣靈知識佔位系統（Tone Spirit Knowledge Graph）藍圖 v1.0 的前期研究。
> 三路平行調研：①爬蟲生態與網站配置 ②GEO 引用實證 ③監測技術與工具。
> 本檔＝三份原始筆記全文＋築的整合判斷。只研究，未動工。

---

# 整合判斷（築）

## 一句話總結

**「被引用」的先決條件是「被檢索到」，而被檢索到是基礎設施問題不是內容問題**——藍圖把重心放在內容量產（Content Factory），實證說重心該放在三個索引的入場券＋少量高可摘取性內容＋便宜到不像話的 DIY 監測迴路。

## 顛覆藍圖假設的六個事實

1. **三個引擎三張入場券**：ChatGPT Search 底層是 Bing 索引（87% 引用出現在 Bing 前段）、Claude 走 Brave Search（引用與 Brave 前排重疊 86.7%）、AI Overviews 走 Googlebot。不進索引，內容寫再好都是零。
2. **AI 爬蟲（除 Google）不執行 JavaScript**：純 CSR 頁面對 ChatGPT/Claude/Perplexity 完全隱形。Next.js 必須 SSR/SSG。
3. **llms.txt 對 AI 搜尋可見度基本無效**（Google 官方否定、5 億次請求實測只有 408 次讀取）；JSON-LD 也不是引用因子（LLM 讀可見文本，Williams-Cook 受控實驗證實）。**看得見的正文結構才是主體**。schema 的真正用途是餵 Google 知識圖譜（Person + sameAs → 知識面板）。
4. **量產會翻車**：Google 2025-10 spam update 與 2026-03 core update 直接打「規模化＋無編輯把關」的 AI 內容站，流量 −50~80%。藍圖的每主題 20+ 產物踩在翻車線上。罰的是「無附加價值的規模」不是「AI 生成」本身。
5. **AI 引用高度隨機**：同一問題 24 小時內重跑，引用集合重疊僅 34-42%。監測必須重複採樣 7-8 次取比例，不能單次判定。
6. **各引擎引用來源幾乎不重疊**（ChatGPT vs Perplexity 僅 11%）；Wikipedia 與 Reddit 是共同巨頭（合計占美國 ChatGPT 引用 25%+）。只經營官網＋GitHub 會漏掉真正被引用的平台。

## 對這個專案的特殊利多

**「語氣靈」是新造詞——這改變整個競爭格局。** GEO 實證的悲觀結論（多方採用時增益趨零、改寫傷檢索）都是在「搶既有熱門 query 的引用」的前提下量出來的。新造詞的賽局不同：AI 引擎檢索「語氣靈」時，可檢索的來源幾乎只有你——先決條件從「贏過別人」變成「存在且可被抓取」。策略上是兩層：
- **內圈（無競爭）**：「語氣靈」定義頁＋概念叢集，佔住空白 SERP，隨機性低。
- **外圈（有競爭）**：「AI 人格一致性」「人格漂移」等熱門概念頁，靠內圈的實體綁定把陳威廷帶進去。

## 實體建立的槓桿排序（陳威廷 → 語氣靈提出者）

1. **Wikidata 條目**（15-20 properties、引用完善）——觸發 Google 知識面板最快的單一槓桿，門檻低於 Wikipedia。
2. **arXiv/SSRN 正規發表**——「概念綁人」寫進 LLM 語料的正規節點（GEO 這個詞本身就是靠 Princeton 的 arXiv 論文完成「Aggarwal = GEO 提出者」綁定的，活例）。
3. **概念定義頁 SERP 佔位**＋跨平台一致的共現句（同一句 positioning 全網一致——LLM 實體關聯靠共現統計）。
4. **LinkedIn/Reddit 經營**（各引擎引用 top-5 平台）。
5. **Wikipedia 最後碰**——GNG 門檻高、COI 未揭露會反噬（條目被刪＋掛警告）。先為「概念」建條目、把提出者寫進去，比直接建人物條目門檻低。

## robots.txt 反向策略（跟一般企業站相反）

一般企業站擋訓練爬蟲保護內容；**這個專案的目標是讓模型在權重層記得語氣靈**——GPTBot、ClaudeBot、CCBot（Common Crawl 餵所有開源模型）、Google-Extended 全部放行。這是佔位系統跟防禦系統的根本差異。

## 監測層：從藍圖最虛的一層變成最該先蓋的一層

四家官方 API 全回結構化 citation（OpenAI url_citation／Anthropic web_search_result_location／Gemini groundingMetadata／Perplexity search_results）。商用工具（月費 $29~$2,000+）本質就是「prompt 庫×定期發問×解析」。DIY 成本：
- 每週輪掃 500 題 × 4 引擎 ≈ **US$20-30/月**（Gemini 前 5,000 次 grounding 免費）
- AI Overviews 本體用 Serper 抓（$1.5-5/月）
- GSC 2026-06 新增 AI 曝光報表（Beta）＋ Bing Webmaster 2026-02 新增 Copilot 引用報表——兩個免費官方管道
- 開源骨架已存在：gego（github.com/AI2HU/gego）

**且監測全程是確定性工作**（發問→解析 citation URL→比對域名→計數），天條「確定性歸程式」完美適用，跟我們的 Cloud Run Jobs + Firestore 架構直接契合。

**Day-0 基線必須先量**：動工前先跑一輪「語氣靈是誰提出的？」「AI 人格一致性怎麼做？」等測試題，記錄現在各引擎怎麼回答——沒有基線，之後所有成效都無法歸因。

## 修正後的施工順序建議（相對藍圖 90 天計畫）

1. **先蓋監測＋基線**（藍圖排在 31-60 天，應提到第 0 週）——它最便宜、且是整個系統的 feedback loop。
2. **再蓋檢索基礎設施**：官網 SSR＋robots.txt 全放行＋Bing Webmaster Tools＋IndexNow＋GSC＋sitemap lastmod 真實＋檢查 Cloudflare AI bot 預設封鎖（2025-07 起預設擋）。
3. **然後才是內容**：少量、高可摘取性（一句話答案先行＋可驗證數據＋日期＋適度表格＋75-150 字可摘取段落）、有人工把關。藍圖的內容結構模板方向是對的，量要砍。
4. **實體節點並行**：Wikidata → arXiv → 定義頁 → LinkedIn，Wikipedia 放最後。
5. 引用滯後 2-6 週（Bing 排名改善→ChatGPT 引用出現），成效週報的預期要按這個時間差設。

## 誠實的不確定性聲明

- 被 AI 引用 → 實際流量/商業成果的因果鏈，目前唯一的準實驗（1.82× 流量乘數）**未達統計顯著**。
- GEO 已進入操縱-防禦軍備競賽（引擎方會逐步對抗改寫手法）。
- 「佔位」對新造詞成立的推論是強的，但語氣靈要從內圈輻射到外圈熱門概念，靠的還是內容真實品質＋實體權威累積，沒有捷徑。

---

# 附錄 A：AI 爬蟲生態與網站配置（原始筆記）

## 1. 主要 AI 爬蟲清單與行為

### OpenAI（三主力 + 一新增，各自獨立 robots.txt token、各自公布 IP JSON）

| Bot | 用途 | 尊重 robots.txt | IP 清單 |
|---|---|---|---|
| `GPTBot` | 訓練基礎模型 | 是 | openai.com/gptbot.json |
| `OAI-SearchBot` | ChatGPT Search 的檢索與引用索引（2024-10-31 上線） | 是 | openai.com/searchbot.json |
| `ChatGPT-User` | 用戶在 ChatGPT 內即時代抓頁面 | 官方明言 robots.txt 規則「可能不適用」 | openai.com/chatgpt-user.json |
| `OAI-AdsBot` | ChatGPT 廣告落地頁驗證（2026 新增，不用於訓練） | 是 | openai.com/adsbot.json |

想被 ChatGPT Search 引用又不想餵訓練 → 擋 `GPTBot`、放行 `OAI-SearchBot`，兩者完全獨立。
來源：https://developers.openai.com/api/docs/bots

### Anthropic（2025 年拆分為三 bot）

| Bot | 用途 | 尊重 robots.txt |
|---|---|---|
| `ClaudeBot` | 訓練資料收集 | 是 |
| `Claude-SearchBot` | 搜尋結果索引（2025 拆出） | 是 |
| `Claude-User` | 用戶問問題時即時代抓 | 是（Anthropic 宣稱連用戶代抓也遵守） |

- 支援非標準 `Crawl-delay`。**不公布 IP ranges**——官方明言 IP 封鎖可能讓 opt-out 失效，對 Anthropic 只能靠 robots.txt。
- 來源：https://support.claude.com/en/articles/8896518 、https://searchengineland.com/anthropic-claude-bots-470171

### Perplexity（官方兩 bot + 已被實錘的隱形爬蟲）

| Bot | 用途 | 尊重 robots.txt | IP 清單 |
|---|---|---|---|
| `PerplexityBot` | 搜尋索引（宣稱不用於訓練） | 官方宣稱是 | perplexity.com/perplexitybot.json |
| `Perplexity-User` | 用戶代抓 | 官方文件寫「generally ignores robots.txt rules」 | perplexity.com/perplexity-user.json |

- 2025-08-04 Cloudflare 實錘：Perplexity 被封後改用未申報 UA（偽裝 Mac Chrome）+ 輪換 IP 繼續爬，被 Cloudflare 從 verified bot 除名。
- 結論：想擋 Perplexity 很難；想被它引用什麼都不用做。
- 來源：https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/ 、https://docs.perplexity.ai/docs/resources/perplexity-crawlers

### Google

| Token | 控制什麼 | 對 AI Overviews 的影響 |
|---|---|---|
| `Googlebot` | Search 索引。AI Overviews / AI Mode 用的就是它 | 擋它＝退出整個 Google Search |
| `Google-Extended` | 只管 Gemini 訓練＋grounding，是用途開關不是獨立爬蟲 | 擋它不影響 AIO / 排名（官方明文） |

- 無法「留在 Google Search 但退出 AI Overviews」——沒有獨立 opt-out。
- 來源：https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers

### Microsoft / Bing
- `Bingbot`：**ChatGPT Search 的底層搜尋基礎設施是 Bing**——擋 Bingbot＝ChatGPT Search 找不到你。

### Common Crawl
- `CCBot`：尊重 robots.txt；其資料集訓練了幾乎所有主流 LLM——是「一次影響未來所有模型」的槓桿點。

### robots.txt 範例（一般企業防禦版；語氣靈專案應反向全放行）

```
# 允許 AI 搜尋引用
User-agent: OAI-SearchBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /

# 拒絕訓練（語氣靈專案不要用這段——訓練爬蟲正是佔位目標）
User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: Google-Extended
Disallow: /
```

## 2. llms.txt：2026 結論＝對 AI 搜尋可見度基本無效，對 coding agent 有效

- Google 官方否定（Gary Illyes 2025-07；官方指南 2026-05-15：「You don't need to create new machine readable files... to appear in generative AI search」）。
- 無任何主要 LLM 廠商生產搜尋面採用；90 天/5 億次 AI bot 請求中只有 408 次讀 llms.txt；SE Ranking 30 萬域名採用率 10.13%。
- 仍有效場景：開發文件站（Cursor/Copilot/Windsurf/Cline/Aider 會讀；Anthropic「Writing for Agents」推薦）。
- 來源：https://baselinelabs.ai/blog/llms-txt-google-search 、https://limy.ai/blog/llms.txt-in-2026-the-full-guide

## 3. 結構化資料（JSON-LD / schema.org）

- **FAQPage rich result 已死**：2026-05-07 Google 正式全面退役。markup 合法但別再為 Google 做。
- **對知識面板有效的組合**：`Organization`/`Person` 配 `name`、`url`、`@id`、**`sameAs`（連 Wikipedia/Wikidata/社群檔案）**→ Knowledge Graph → 知識面板/AIO。
- 對 AI 引用的證據混合：Microsoft 確認 schema 幫 Copilot 理解；Search Atlas 2024-12 發現 schema 覆蓋率與 AI 引用率無相關。實務共識：**頁面可見的 Q&A 排版比 JSON-LD 更有可測效果**。
- 優先序：Organization（首頁）+ Person（作者頁含 sameAs）+ Article（內容頁）> DefinedTerm > FAQPage。

## 4. 索引加速與 Bing 的關鍵地位

- Seer Interactive：87% SearchGPT 引用出現在 Bing 前段；但 Bing top-3 預測被引頁命中率僅 6.8-7.8%——**進 Bing 索引是必要非充分條件**。排名改善→引用出現有 2-6 週滯後。
- **Bing Webmaster Tools 必開**：2026-02-10 推出 AI 引用儀表板（Copilot/Bing AI 摘要的引用次數、被引 URL、query）。
- **IndexNow**：Bing 系支援、Google 不支援；把新內容快速推進 Bing 索引（→ChatGPT 可見）最便宜的手段，一支 key 檔＋一個 ping API。
- **Google Indexing API 仍僅限 JobPosting/BroadcastEvent**，一般站用是灰帽。對 Google 正解＝sitemap＋真實 lastmod。

## 5. 網站技術面

- **AI 爬蟲不執行 JS（除 Google）**：Vercel+MERJ 分析 5 億次 GPTBot 抓取零 JS 執行；ClaudeBot/PerplexityBot 同。**純 CSR 內容對 ChatGPT/Claude/Perplexity 完全隱形**；Next.js 關鍵內容必須在首次 HTML response。來源：https://vercel.com/blog/the-rise-of-the-ai-crawler
- **Cloudflare 時間線**：2025-07-01 預設封鎖 AI 爬蟲＋Pay Per Crawl；2026-07-01 升級（2026-09-15 前 mixed-use 爬蟲在含廣告頁預設封鎖）。**站在 Cloudflare 後面想要 AI 可見度，必須主動檢查 Security → Bots → AI crawlers 設定**。
- **log 驗證爬蟲真偽三步**：UA grep → 官方 IP JSON 比對（Anthropic 不發布 IP，只能行為判斷）→ rDNS forward-confirm。

## 速查決策表

| 目標 | 動作 |
|---|---|
| 被 ChatGPT Search 引用 | 放行 OAI-SearchBot + Bingbot；進 Bing 索引（BWT + IndexNow）；SSR 完整 HTML |
| 被 Claude 引用 | 放行 Claude-SearchBot / Claude-User；在 Brave Search 有排名 |
| 被 Perplexity 引用 | 放行 PerplexityBot（本來就難擋） |
| 留在 AI Overviews | 跟著 Googlebot 走，無獨立 opt-out |
| 讓模型權重記得你（佔位目標） | 放行 GPTBot、ClaudeBot、CCBot、Google-Extended |
| 新內容快速進 AI 答案 | IndexNow ping Bing + sitemap lastmod 真實；預期 2-6 週滯後 |
| 確認 AI 爬蟲來過 | log UA grep → IP JSON 比對 → rDNS 確認 |
| 用 Cloudflare 的站 | 檢查 AI bot 預設封鎖，2026-09-15 新政前複查 |

---

# 附錄 B：GEO 引用優化實證（原始筆記）

證據分級：【實證-同儕審查】【實證-大規模業界數據】【業界經驗談/廠商數據】

## 1. 學術實證

### Princeton GEO 原論文（Aggarwal et al., KDD 2024, arxiv.org/abs/2311.09735）
- GEO-bench 約 10,000 query、9 資料集。
- 各策略相對提升：**加統計數據 ~+41%**、**加引文 ~+28%**、**引用來源 +30-40%（對排名第 5 位的頁面可達 +115%，第 1 位幾乎無變化）**。
- 無效：keyword stuffing（持平甚至負向）；流暢度提升效果弱。
- **關鍵限制**：這是「文件已被檢索進 context」前提下的條件性增益，不是自然可發現性增益。

### 2025-2026 後續研究（綜述：arxiv.org/html/2607.14035v1）

| 研究 | 規模 | 發現 |
|---|---|---|
| Vishwakarma et al. 2026 | 252,000 試驗、6 LLM、18 因子 | 主因＝相關性＋context 位置；明確價格/近期日期有效；純格式調整效果弱 |
| Puerto et al. 2025（C-SEO Bench） | 54 組合 | 僅 3 組合顯著；**多方同時採用 GEO 時個體增益趨近零** |
| Kim et al. 2026（SAGEO Arena） | 端到端含檢索 | **只改內文的 GEO 反而 top-20 出現率 −9%、引用 −6%**——下游改寫傷上游檢索 |
| Schulte et al. 2026 | 重複查詢 | 同 query 24h 內引用集合 Jaccard 僅 **34-42%**——量測要重複 7-8 次 |
| Liu 2023 / Nat. Comm. 2025 | 7 LLM 醫療 | 僅 ~51.5% 句子被引用來源完整支持——被引用≠被正確轉述 |
| Watanabe & Nakayashiki 2026 | 準實驗 | 被引用→1.82× 流量乘數，**p=0.16 未顯著** |

綜述結論排序：①相關性 > ②context 位置 > ③可摘取性（可驗證數字、日期、清楚結構）> ④引擎差異。GEO 已進入操縱-防禦軍備競賽。

## 2. 各引擎引用偏好實測

- **Profound（680M 引用，2024-08~2025-06）**：ChatGPT 最愛 Wikipedia（7.8%，top-10 份額近半）；Perplexity 最愛 Reddit（6.6%）；AIO 最分散；**ChatGPT 與 Perplexity 引用域名重疊僅 ~11%**。
- **Semrush 30M 分析**：Reddit 是五平台共同最常引用來源；YouTube、LinkedIn、Wikipedia、Forbes 進前五。
- **5W Research 2026**：Wikipedia+Reddit 合計占美國 ChatGPT 引用 25%+；WSJ/NYT/Bloomberg 不在 top-20（擋爬蟲的後果）。
- **Claude 走 Brave Search**：引用 URL 與 Brave 前排重疊 86.7%（searchengineland.com/claude-visibility-brave-search-rankings-480053）；56% 引用在 /blog/ 路徑、47% listicle 型、63% 指向利基部落格。
- **與 Google top-10 重疊**：AIO 引用中 37.9% 來自 organic top-10（從 2024 的 76% 大幅下滑——Google 刻意多樣化）；跨 AI 平台僅 12% 引用 URL 在對應 Google top-10 內。**AI 引擎系統性引用「排名不高但可摘取性高」的頁面＝GEO 機會窗**。

## 3. 實體建立

### Google 知識面板
- 不能申請不能付費。**Wikidata > Wikipedia**：15-20 property、引用完善的 Wikidata 條目常是最快單一槓桿。
- 三要件：多個獨立來源當實體提及／跨平台傳記資訊一致／持續數年活動。
- 官網 entity home 頁 + JSON-LD Person + **sameAs 指向所有官方檔案**。
- 資料不一致會降實體信心分數。時程：條件齊備後 3-12 個月。

### Wikipedia
- GNG 門檻：可靠獨立二手來源的顯著報導（新聞稿/付費報導/訪談不算）。
- COI 風險：未揭露的利益衝突編輯即使主題夠格也可能被刪＋掛警告——負資產。
- 建議：先為「概念」建條目、把提出者寫進去，門檻低於人物條目。

### 概念-人物綁定節點
- **arXiv/SSRN**：LLM 語料高信任來源，有 DOI、進 Google Scholar——「X 理論＝某人提出」的低門檻正規節點（GEO 論文本身＝活例）。
- 同名概念 SERP 佔位：定義頁/FAQ/比較頁，至少在 Google/Bing/Brave 三索引可抓。
- 一致性是核心機制：全網同一句 positioning——LLM 實體關聯靠共現統計。

## 4. 內容結構

- 有實證：可摘取性（引用驅動因子第三位）；新鮮度（AI 引用 URL 平均比傳統結果新 25.7%）；**Williams-Cook 受控實驗：LLM 把 HTML 整段 tokenize 而非語意解析 schema——看得見的 Q&A 有效，JSON-LD 本身不是引用因子**。
- 業界數據（方向參考）：listicle 占 AI 引用 top 來源 ~50%；含表格被引 2.5×；最佳可摘取段 75-150 字；**字數與引用近零相關（53.4% 被引頁 <1,000 字）**；topic cluster 被引 3.2×（Yext，未公開方法）。

## 5. 量產翻車現況

- Google 時間線：2025-10 spam update（scaled content abuse）→ 2026-03 core update（數百至數千頁無把關 AI 頁的站 −50~80%）；spam 政策已正式涵蓋 AIO 與 AI Mode。
- 翻車模式：500+ AI 頁無署名版型雷同 −60~80%；無第一手經驗的 AI 比較聯盟站 −40~70%；模板化在地頁 −30~60%。
- 關鍵區辨：罰「規模化＋無附加價值」非「AI 生成」本身；有編輯把關的 AI 輔助內容未被系統性降權。
- 恢復路徑：砍薄頁、合併成含獨家數據的 hub 頁。

---

# 附錄 C：AI 引用監測技術與工具（原始筆記）

## 1. 商用工具（方法論共通：prompt 庫×定期發問×解析 mention/citation）

| 工具 | 引擎覆蓋 | 價位（月費） | API |
|---|---|---|---|
| Profound | 9+ 引擎 | Starter ~$82.5-99 / Lite $499 / Enterprise $2,000+ | Enterprise 有 REST API |
| Otterly.ai | 6 引擎 | Lite $29（15 prompts）/ Standard $160（100） | 無 |
| Peec AI | 主流引擎 | Starter €89 / Pro €199 | 高階含 API |
| Semrush AI Toolkit | 5 引擎 | $99 add-on（需主訂閱 $139.95 起） | Enterprise 級 |
| Ahrefs Brand Radar | 6 引擎，AIO 索引 1.055 億 prompts | $199 單引擎 / $699 六引擎（需主訂閱）→ 全開 ~$828 | 匯出為主 |
| Scrunch AI | 7+（Claude 為 Enterprise-only） | Core $250 | 有 query + responses 兩支 API |
| Goodie AI | 11+ 平台 | $399-495 起 | 未公開 |
| xfunnel.ai | 4+ | 需 demo（已被 HubSpot 收購） | 不明 |

行業平均月費 ~$337。共通盲區：API 回答 ≠ 消費者實際看到的產品回答。

## 2. DIY 官方 API 路徑（完全可行，便宜一個數量級）

| 引擎 | API | citation 格式 | 定價 |
|---|---|---|---|
| OpenAI | Responses API `web_search` tool | `annotations` 內 `url_citation`{url,title,start/end_index}＋`sources` 完整查閱清單 | $10/1K calls＋tokens |
| Anthropic | `web_search_20250305` server tool | `web_search_tool_result`＋text block `citations`（`web_search_result_location`{url,title,cited_text}）；usage 有 `web_search_requests` 可對帳；**支援 Batch API 同價** | $10/1K searches＋tokens |
| Gemini | Grounding with Google Search | `groundingMetadata`{webSearchQueries, groundingChunks, groundingSupports}（uri 是 redirect，要跟一次） | **Gemini 3 每月 5,000 次免費**，後 $14/1K |
| Perplexity | Sonar API（天生 grounded） | `search_results`/`citations` 陣列{url,title,date} | token 費＋request fee $5-12/1K |

**成本估算**：每月 500 題 × 4 引擎 ≈ **$20-30/月**；每日跑（15K/引擎/月）≈ $600-850/月；每週輪一次 <$100/月。Rate limit 完全不是瓶頸。
限制：API 檢索管道 ≠ 消費者產品；AIO 本體要用 SERP API 補；Copilot/Meta AI/Grok 無公開 search API。

## 3. 傳統搜尋監測

- **GSC**：Search Analytics API 免費；**2026-06-03 推出「Generative AI features」效能報表（Beta）**——首次獨立 AIO+AI Mode 曝光，v1 只有 impressions、未進 API。
- **Bing Webmaster**：GetQueryStats/GetRankAndTrafficStats 免費；**2026-02-09 AI Performance 報表**（Copilot/Bing AI citation，dashboard，API 化未明）。

## 4. 第三方提及監測

- Google Alerts：僅覆蓋 ~15-20% 提及，延遲 24-48h——只能當補充。
- Brand24 $249 起／Mention ~$41 起。
- **SERP API 自建**：Serper $1/1K（量大 $0.3/1K）最便宜；SerpAPI ~$25/1K 但 AIO 結構化欄位最完整；Tavily $0.008/次。每天掃 50 個品牌 query＝月 $1.5-5。

## 5. GitHub 資產監測

- Stars/Forks：REST `GET /repos/{owner}/{repo}`；星標時間線 `Accept: application/vnd.github.star+json`。
- **Dependents 無官方 API**——只能爬 HTML；現成工具 github-dependents-info（含 GitHub Action）。
- 代碼提及：Search API（10 req/min）。

## 6. 開源現成骨架

- **gego**（github.com/AI2HU/gego）：排程 prompts 打多 LLM、抓 citations、品牌別名追蹤、dashboard+CLI——與 DIY 路徑完全同構，最接近直接可用。
- danishashko/geo-aeo-tracker：local-first 6 模型 dashboard。
- Auriti-Labs/geo-optimizer-skill：CLI+MCP server 網站 AI 可見度 audit。

（三份筆記的完整來源 URL 清單見各代理原文，已彙入上文各節。）
