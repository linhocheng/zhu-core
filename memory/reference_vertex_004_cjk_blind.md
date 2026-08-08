---
name: vertex-004-cjk-blind
description: Vertex text-embedding-004 對純中文實質全盲（bit-identical 向量）;ailivex memories 池已於 2026-08-08 遷 002 治癒（A/B gap -0.000→+0.22, floor 0.68）
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**事實（2026-08-01 直打 Vertex API 實測，繞過所有本地模組）**：
- 「談到創業時，感覺開心」和「談到創業資金週轉的壓力時，感覺非常焦慮」→ **768 維全部相同**的向量
- 連續中文被 004 當成單一未知塊：`[UNK, ，, UNK]` 結構相同就是同一顆向量
- 混英文有部分區辨（'hello world' vs '你好 hello world 再見' cos 0.94 不同向量）；純標點 vs 含中文句也不同（cos 0.81）
- 結論：**中文為主的池子裡，004 cosine 量的是標點結構，零語義資訊**
- **2026-08-08 真實池 A/B 量化**：中文無關句（薛丁格/股市）對 1,172 筆記憶池 cosine 最高 **1.00**、分離 gap=**-0.000**（門檻數學上篩不動）；同 query 004 vs 002 的 top-1 選擇廿句僅一句相同＝坍縮下的檢索接近隨機抽

**治癒紀錄（2026-08-08，ailivex）**：
- 全池 1,172 筆補 `embedding002`（multilingual-002＋RETRIEVAL_DOCUMENT，768 維同欄寬；舊欄保留可回退）；讀端（語音 `_dynamic_recall`＋文字線 `loadMemoryBlock`＋復活律）全切 002，floor=**0.68**（同 KNOW_FLOOR：002 實測相關 0.88-0.95/無關最高 0.66/gap+0.22）；寫端 004+002 雙寫（去重仍 004 軌，004 退場時一起切＋重調參）
- 補嵌工具常備：ailivex-platform `scripts/backfill-memories-002.mjs`（冪等；v19/v20/v21 下放 002 讀端前每隔幾天跑）
- A/B 驗法可複用：真實用戶語句當 query＋記憶原文自查（應 top-1）＋外域句對照（取池內最高分）→ 三組數字定 floor

**影響面（殘餘）**：
- [[project-ailive-retrieval-refactor]] ailive 平台的 BM25+cosine 混合檢索若同用 004，cosine 腿也是瞎的——**下次動 ailive 檢索先驗這個**（尚未治）
- ailivex `impressions` 池若有 004 embedding 同病（尚未查）

**How to apply**：任何中文語料要上 embedding，模型選 multilingual 系（`text-multilingual-embedding-002`＋task_type 成對）；驗收方式＝拿兩句「同結構、不同中文內容」實測向量是否不同，不要只看 API 回 200。既有 004 池的根治路徑照上面治癒紀錄走（雙寫→A/B 定 floor→切讀端）。

相關：[[rrf-hybrid-retrieval-pitfalls]]、[[firestore-vector-search]]

驗證+1: 2026-08-08 第1場 — 本記憶驅動整條 004→002 根治遷移；A/B 把「安慰劑」量化成 gap=-0.000 後治癒

- 驗證+1:2026-08-08 第1場 — 整條 ④ 遷移的因；A/B 用真實池把「cosine=安慰劑」量化成 gap=-0.000

- 驗證+1:2026-08-08 第4場 — ④ 下放 v20 的因（v20 召回今天還在 004 中文近隨機軌）
