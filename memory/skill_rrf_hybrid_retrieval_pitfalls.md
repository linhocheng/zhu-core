---
name: skill-rrf-hybrid-retrieval-pitfalls
description: 混合檢索融合的兩個坑：加法計分救不了 cosine 坍縮（rank-based 才免疫）、RRF 並列 0 分文件會偷走好名次（未命中=無貢獻）
metadata: 
  node_type: memory
  type: reference
  originSessionId: 96008891-de26-439a-acd6-f9cc46ed26e0
---

# 混合檢索融合（BM25+cosine）兩個實戰坑

**規則**：
1. 窄域（同品牌/同對人的長敘事）embedding cosine 會坍縮在 0.6-0.9，無關文件也拿高分。加法混合（cos×0.7＋詞彙×0.3）救不了——絕對值已失去鑑別力。用 **rank-based RRF**（只看名次），BM25:cosine = 2:1。
2. 自己實作 RRF 時，**未命中（分數 0）的文件不給名次貢獻**。並列 0 分照 sort 順序發名次 → 一堆 0 分文件拿 rank 1、2、3，反壓過唯一真命中。標準 RRF 語義＝「沒被該檢索器撈到就沒分」。

**Why**：2026-07-03 ailive-platform episodic 檢索移植 ailiveX 白皮書，照抄加法計分實測失敗（「雪玉如初」專名 query 撈不到，無關記憶 cos 0.86）；改 RRF 又踩並列陷阱，兩修才過。同 repo 的 knowledge-search 早已用 RRF——同倉已驗證的解法先抄。

**心態**：設計規範（含自家白皮書）寫的計分公式也要過真實資料才算數；驗證信號要挑「只有做對才出現」的（專名命中對應記憶），泛化信號（兩組結果不同）會漏坑。

**How**：
- score = (bm25>0 ? W_B/(k+rank_b) : 0) + (cos>=門檻 ? W_C/(k+rank_c) : 0)，k=60
- CJK 無分詞器用 bigram 斷詞跑 BM25（idf 自動抬高低頻專名）
- 參考實作：`ailive-platform/src/lib/text-similarity.ts`（bm25Scores）＋ `episodic-memory.ts` query 分支

**觸發信號**：要做「embedding＋關鍵字」混合排序；專名/代號檢索不到；cosine 分數看起來全都很高。

相關：[[skill-filter-unit-matches-error-shape]]、[[feedback-sandtable-not-validation]]
