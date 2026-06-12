---
name: 前沿學習筆記 RAG/MCP/Skills/記憶
description: 重設計 ailive 記憶或知識庫/RAG 前先讀；2026-06 打撈的前沿論述 + ailive 對照 + 落地階梯
type: reference
originSessionId: 45876f35-71c4-410e-b290-198bde424c27
---
重設計 ailive 記憶/知識庫/RAG/技能系統前，先讀這份學習筆記：
`~/.ailive/zhu-core/docs/FRONTIER_RAG_MCP_SKILLS_MEMORY_2026-06-12.md`

四根支柱（2025-2026 前沿 + ailive 對照 + MVP 演進階梯，附來源 URL）：
- **RAG**：窄域語義坍縮根治 = hybrid(BM25+dense)+rerank，非調 embedding。階梯：1.rerank（拆掉 Vivi 法規硬規則的單一最大槓桿）2.contextual chunking 3.BM25+RRF 4.換 Gemini Embedding 001 + 向量索引。
- **MCP**：現在別碰（工具寫死=優點不是債，導入反引入 tool poisoning）。先做 schema/handler 解耦。觸發遷移＝第二個 host（語音 agent 快是了）/工具>10/對外開放。
- **Skills**：ailive 技能全塞 system prompt 永遠在場；前沿是 SKILL.md 三層漸進揭露（context 降 98.7%）。階梯：目錄常在、內文按需。
- **記憶**：ailive 骨架血統純正（知識庫=semantic/insights=episodic/sleep=reflection/hitCount=access freq/tier=working↔longterm 前沿都點頭）。補：檢索評分加 recency+importance＝斯坦福公式、隔離釘儲存層、蒸餾語義升維。

跨支柱動手優先序：1.RAG rerank 2.記憶+recency+importance 3.隔離審計 4.Skills 漸進揭露 5.contextual chunking。
一句話：ailive 缺的全是「多一層智能、少一點永遠在場」。
