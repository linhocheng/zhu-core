# 前沿學習筆記：RAG · MCP · Skills · 記憶系統（2026-06-12）

> 來源：四個並行研究員打撈 2025-2026 前沿（築知識截止 2025/8，靠 web 補）。
> 觸發背景：當天修完 Vivi 知識庫讀不到法規的「窄域語義坍縮」雷，Adam 要藉機把前沿吃進來，指導日後記憶/RAG 重設計。
> 用途：重設計 ailive 記憶/知識庫前先讀這份。每根支柱都對照 ailive 現況給落地階梯。

---

## 一條貫穿全部的洞察

**四根支柱踩同一個坑、同一個解。**
ailive 到處在做「**永遠在場 / 純 top-N / 只看 cosine**」，前沿到處在做「**按需載入 / rerank 重排 / 多訊號加權**」。

今天修 Vivi 法規的硬規則（general 永遠帶入 + 每產品上限）是有效止血帶，但前沿會說：**缺的不是更好的 embedding，是 rerank 這一層**。一個動作就能拆掉大半硬規則。

---

## 1. RAG —— 主戰場

**前沿共識**：窄域語義坍縮（我們踩的雷）根治不是調 embedding，是 **hybrid（BM25 稀疏 + dense）+ cross-encoder rerank**。
Anthropic Contextual Retrieval（contextual embedding + contextual BM25 + rerank）把 top-20 檢索失敗率降 **67%**（5.7%→1.9%）。

**ailive 對照**：in-memory cosine 全撈 + 純 top-N，零 rerank、零 BM25、零 contextual。今天的硬規則是階 0 止血帶。

**演進階梯**（別一步到位上向量 DB + GraphRAG）：
- **階 1（最高 CP，先做）**：加 cross-encoder **rerank**。cosine 撈 top-30~50 候選 → reranker（BGE 開源 / Voyage rerank-2.5 API）重排取 top-N。直接打中坍縮、不動儲存。instruction reranker 還能把「優先法規」寫成自然語言指令，**取代今天寫的硬規則**。
- **階 2（治本）**：**contextual chunking**——索引時用 LLM 給每 chunk 加「這是產品/這是法規」類別語境再 embed。產品 vs 法規天然被推開。走 bridge 吃到飽做離線批次。
- **階 3**：加 BM25 + RRF 融合。法規這種詞彙明確的文件 recall 顯著回升。
- **階 4（規模到了才做）**：換 Firestore 向量索引 + 升 embedding 到 **Gemini Embedding 001**（MTEB 68.32，已取代 text-embedding-004，同生態遷移便宜，支援 Matryoshka 砍維度，256d 只損 2-3%）。中文最強開源是 Qwen3-Embedding（70.6 MTEB，可自托管）。
- **暫不做**：GraphRAG、Self-RAG、HyDE——等有 multi-hop 或精度實證再上。

**chunking 反直覺數據**：2026 benchmark recursive 512-token 第一（69%），純 semantic chunking 反而 54%（碎太小、慢 14×）。別追 semantic chunking，直接上 contextual chunking。

來源：
- Anthropic Contextual Retrieval https://www.anthropic.com/news/contextual-retrieval
- Hybrid + rerank https://www.digitalapplied.com/blog/hybrid-search-bm25-vector-reranking-reference-2026
- Embedding leaderboard https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-april-2026/
- Chunking https://www.firecrawl.dev/blog/best-chunking-strategies-rag

---

## 2. MCP —— 結論：現在別碰

**前沿共識**：MCP 是「AI 的 USB-C」，已是事實標準（捐給 Linux Foundation 的 Agentic AI Foundation，OpenAI/Google/MS 全採用）。標準化的是「工具**怎麼跨 host/服務被執行**」，不是「模型表達想做什麼」（那是 function calling = dialogue route 那層）。2026 演進到 stateless（砍 handshake，能跑普通 LB 後面）。

**ailive 對照**：「工具寫死在 route、單團隊維護、不對外共用」= MCP **不划算**的典型畫像。自家工具寫死是優點不是債。導入 MCP 反而引入 tool poisoning / prompt injection 新攻擊面（MCPTox 攻擊成功率多 >60%，CVE-2025-54136；Supabase Cursor 真實外洩事故）。

**該做的兩件「沾邊」事**：
- 把記憶/RAG 工具的 **schema 與 handler 解耦**（抽乾淨 interface），未來包成 MCP server 是幾天事不是重寫。
- **觸發遷移條件**：出現第二個 host（⚠️ ailive 語音 agent 就快是第二個 host）、工具 >10 且多人維護衝突、或對外開放工具。任一成立再上，直接上 2026 stateless 版。

來源：
- MCP spec https://modelcontextprotocol.io/specification/2025-11-25
- MCP vs function calling https://www.prefect.io/resources/mcp-vs-function-calling
- 安全 https://www.practical-devsecops.com/mcp-security-vulnerabilities/
- AAIF 捐贈 https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation

---

## 3. Skills —— 已踩在門檻上

**前沿共識**：Anthropic Agent Skills（SKILL.md）2025-12 開源成跨平台標準，48 小時內 OpenAI/MS 跟進，2026-03 已 32 工具讀同一份 SKILL.md。核心是**三層漸進揭露**：啟動只載 metadata（~100 tokens）→ description 命中才載 body → body 引用檔案用到才讀。實測 context **150,000→2,000 tokens（降 98.7%）**，正確率 76%→91%。

**三者邊界口訣**：**MCP 給 access，Skill 教 how，Tool 是 one step**。

**ailive 對照**：角色技能**全部塞進 system prompt 永遠在場**。築自己的 `skills/*.md`（frontmatter + 觸發詞）已是 SKILL.md 雛形——差距只在沒做漸進揭露（關鍵詞命中就整檔注入）。

**演進階梯**：
- **階 1**：角色技能拆 `{name, description}` 進 prompt 當「目錄」，**body 移外部 DB，要用才注入**。省「20 技能只用 1 個」的浪費。
- **階 2**：description 第三人稱 + 觸發詞，讓**模型語意判斷**該不該載，取代硬 regex（regex 漏字就不觸發、語意更耐用）。
- **核心一刀**：把「永遠在場」改成「目錄常在、內文按需」。
- 不建議：自建 MCP server、A2A、完整 SKILL.md 工具鏈——單一平台內部注入做到階 1-2 就吃 90% 紅利。

來源：
- Anthropic Agent Skills https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Skills vs Tools vs MCP https://duet.so/guides/agent-skills-101-tools-vs-mcp-vs-skills
- 漸進揭露實測 https://www.firecrawl.dev/blog/agent-skills

---

## 4. 記憶系統 —— 骨架血統純正

**前沿肯定 ailive 的**（對照 CoALA / 斯坦福小鎮 / Mem0 / Letta）：
- 知識庫(semantic/不變) vs insights(習得) 分流 ✓ 和 CoALA 一致
- sleep 離線蒸餾 ✓ 和 reflection / sleep-time compute 同路
- hitCount ✓ 就是前沿的 access frequency 訊號
- tier(fresh/archive) ✓ 對應 working↔long-term

**記憶分型前沿共識**：episodic（情節）/ semantic（語義）/ procedural（程序）/ working vs long-term。ailive 知識庫≈semantic（更像天命級 system knowledge）、insights≈episodic→semantic consolidation 產物。**缺 procedural**（角色學到的做事規則，目前混在 insights）。

**知名實作對照**：
- **MemGPT/Letta**：OS 式三層，LLM 自己 function call 搬分頁。
- **Mem0**：Extraction→Update 兩階段，每則新事實判 ADD/UPDATE/DELETE/NOOP，極省 token（~1.7K/對話）。
- **Zep/Graphiti**：bi-temporal 知識圖，每條邊有 validity 區間，最強時序但很貴（>600K token/對話）。
- **斯坦福 Generative Agents**：memory stream + 週期 reflection + 檢索評分（見下）。ailive 是這條血統。

**檢索評分（斯坦福公式，業界標準）**：`score = α_recency·recency + α_importance·importance + α_relevance·relevance`。recency 隨上次存取時間指數衰減；importance 建立時 LLM 評分；relevance = embedding 相似度。ailive 的 hitCount = access frequency。

**Anthropic 自家進展**：
- Memory tool（2025-09 beta，client-side，app 自決存哪）
- Context editing（`clear_tool_uses` 100-turn 省 84% token；`compact` 壓縮歷史）
- Sleep-time compute（Claude Cowork 排程，和 ailive 的 sleep 蒸餾撞概念，可借）

**該補的**（按 ROI）：
1. **檢索評分加兩維**（最高 ROI、改動最小）：現在只 cosine。加 `recency decay`（既有 timestamp）+ `importance`（蒸餾時 LLM 順手評 1-10）。配 hitCount = 湊出斯坦福公式。
2. **隔離釘在儲存層**：確認 Firestore 查詢用 `(characterId, userId)` 複合 scope，**不是查完再用 userId 過濾**（knowledge-search 現在是後者——注入攻擊專找這漏洞）。安全債。
3. **蒸餾語義升維**：sleep 不只合併去重，明確讓 LLM 產「更抽象的 semantic insight」（episodic→semantic）。
4. （可延後）拆 procedural memory tier。
5. （先不做）Zep bi-temporal 知識圖——強但貴，聊天場景用不到。

來源：
- Memory frameworks 2026 https://atlan.com/know/best-ai-agent-memory-frameworks-2026/
- Mem0 https://arxiv.org/html/2504.19413v1
- 斯坦福 Generative Agents https://arxiv.org/pdf/2304.03442
- Anthropic Memory tool https://docs.claude.com/en/docs/agents-and-tools/tool-use/memory-tool
- 隔離安全 https://mem0.ai/blog/ai-memory-security-best-practices

---

## 跨支柱·動手優先序（如果要動）

| 序 | 動作 | 為什麼第一 |
|---|---|---|
| 1 | RAG 加 **rerank 層** | 拆掉今天的硬規則、根治坍縮，單一最大槓桿 |
| 2 | 記憶檢索 **+recency +importance** | 改動最小、用既有欄位、湊出斯坦福公式 |
| 3 | **隔離審計**（儲存層 scope） | 安全債，cross-user leak 風險 |
| 4 | Skills **漸進揭露** | context/成本紅利 |
| 5 | RAG **contextual chunking** | 治本，但要重建索引 |

**一句話**：ailive 骨架前沿都點頭，缺的全是「多一層智能、少一點永遠在場」。最該先動的是 **rerank**——順手把今天的繃帶換成真材料。
