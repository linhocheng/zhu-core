---
name: vertex-004-cjk-blind
description: Vertex text-embedding-004 對純中文實質全盲——同標點結構、只差 CJK 內容的兩句回 bit-identical 向量;ailivex memories 池的 cosine 量的是標點不是語義
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**事實（2026-08-01 直打 Vertex API 實測，繞過所有本地模組）**：
- 「談到創業時，感覺開心」和「談到創業資金週轉的壓力時，感覺非常焦慮」→ **768 維全部相同**的向量
- 連續中文被 004 當成單一未知塊：`[UNK, ，, UNK]` 結構相同就是同一顆向量
- 混英文有部分區辨（'hello world' vs '你好 hello world 再見' cos 0.94 不同向量）；純標點 vs 含中文句也不同（cos 0.81）
- 結論：**中文為主的池子裡，004 cosine 量的是標點結構，零語義資訊**——比 embeddings.ts 註解裡已知的「cosine 坍縮 0.90+」嚴重得多

**影響面**：
- ailivex `memories`/`impressions` 池（004 建庫）：語義檢索從第一天就是安慰劑，一直是 rank() 裡的 lexOverlap（CJK bigram）＋tier＋importance 在扛；dedup 的 cosine 門檻恆真，實際只有 bigram 門檻在擋
- ailivex 知識庫已逃過：`knowledge_chunks`/`methodologies` 從第一天用 text-multilingual-embedding-002（當時只知坍縮，不知全盲）
- [[project-ailive-retrieval-refactor]] ailive 平台的 BM25+cosine 混合檢索若同用 004，cosine 腿也是瞎的——**下次動 ailive 檢索先驗這個**
- 復活律（薩克處方③，ailivex v18.34.0）因此門檻用詞彙重疊不用 cosine

**How to apply**：任何中文語料要上 embedding，模型選 multilingual 系（`text-multilingual-embedding-002`＋task_type 成對）；驗收方式＝拿兩句「同結構、不同中文內容」實測向量是否不同，不要只看 API 回 200。根治 ailivex memories 池＝整池 re-embed 換模型（大手術：backfill＋門檻全部重校＋TS/Python 兩線同步），待 Adam 裁。

相關：[[rrf-hybrid-retrieval-pitfalls]]、[[firestore-vector-search]]
