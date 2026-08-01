---
name: skill_retrieval_timing_address
description: 檢索索引的「時機地址」設計——每份知識有內容地址與時機地址兩個地址；狀態導向檢索的配比/稀釋/劫持三定律
metadata: 
  node_type: memory
  type: reference
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

任何「庫」（知識庫/記憶/客服 KB/商品目錄）要讓東西在對的時刻自己浮出來，就給每件東西補**時機地址**：索引不嵌內容摘要，嵌「什麼處境的人此刻需要它」——用那個時刻的人會說出口的話寫。存放照真相（原文/出處不動），索引照需要。莊子 203 塊實戰驗證（2026-07-22，考卷 6/6 全 #1）。

**Why**：求助的人從來不描述文件，他描述自己的處境（沒人說「給我拒絕官位的寓言」，人只說「我覺得沒得選」）。內容地址和真實 query 之間永遠隔一道語域翻譯。同構先例：ailivex 方法論 triggerDesc、築記憶格式 v2 的觸發信號欄——三個場景獨立撞到同一條原理。

**三定律（都流過血）**：
1. **稀釋律**：gist 寫「故事摘要＋結尾一句狀態」→ embedding 重心在敘事語域，狀態句幾乎逐字對上 query 也排 #100。正解配比＝**處境 2/3 先行（第一人稱、2-4 種不同措辭）＋內容錨 1/3 收尾**。
2. **劫持律**：混合狀態的 query（「我學這些沒有用」）被最強語域劫持（學>用），撈到的是學-主題塊且是正當命中——庫內多入口是常態。測試一題只考一個狀態；混合句失敗≠庫壞，是題目標籤錯。
3. **押注律**：時機地址是對未來 query 的預言，會押錯注。所以它是疊加不是取代（hybrid 的 lex/原文通道保逐字引用），且預言必考試（擬真狀態 query 考卷，期望塊進 top3 才算數）。

**How to apply**：入庫走 `ingestKnowledgeDoc` 的可選 `gists` 參數（v18.21.0，長度必須===chunkText 塊數）；生成 prompt 硬限 140-160 字防 200 截斷（狀態在尾巴，截斷＝時機地址蒸發）；防同開頭雷（開頭 4 字頻率掃描）。操作細節在 zhu-core/skills/ailivex-knowledge-ingest.md 雷區 10-14。

**觸發信號**：任何人說「檢索撈不準」「RAG 對不上口語問句」；或設計新庫時只規劃了內容 embedding。先問：query 會用什麼語域來？索引住在那個語域嗎？

家族：[[skill_cross_register_retrieval_gist_index]]（語域翻譯，本條的前身）、[[skill_rrf_hybrid_retrieval_pitfalls]]（融合層）、[[feedback_memory_format_trigger_signal]]（同原理在築記憶的落地）。

- 驗證+1:2026-08-01 第5場 — MEMORY.md 索引瘦身整場用「時機地址」原則重寫
