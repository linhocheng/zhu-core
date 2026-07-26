---
name: opencc-s2t-pitfalls
description: 簡→繁轉換用字元級 s2tw+領域覆寫表，不用 s2twp；发文會誤斷成髮文；批次轉換先 dry-run 抽查
metadata: 
  node_type: memory
  type: reference
  originSessionId: 96008891-de26-439a-acd6-f9cc46ed26e0
---

簡→繁轉換（opencc，JS=opencc-js / Python=opencc-python-reimplemented）的四顆雷：

0. **跨字系文本比對前必先歸一字系**（2026-07-26 ailivex 分聲案）：簡體參照 vs 繁體 STT 輸出做 bigram/cosine 比對＝真命中全滅＋簡繁共用字（我/先/不/人）撞出 0.35 級假分數——不報錯、只給靜默的錯誤答案。任何中文相似度比對（檢索/去重/分聲/對賬）先問兩邊字系，不確定就兩邊都過 opencc 再比。表面相似度的前提是同一表面（同族：cross-register gist 索引的語域雷）。

1. **s2twp（台灣用語詞組版）會「修壞」已是繁體的正確文本**：文件→檔案、優先級→優先順序——詞組詞典連不該動的都重寫。批次處理既有資料絕對不能用。
2. **「发文」兩個實作都誤斷成「編『髮』文」**（词典把「编发」斷成編髮辮）。s2tw 字元級也中。解法：轉換前先套確定性覆寫表 `text.replace('发文','發文')` 再進 opencc，長詞優先。
3. **驗證用轉換器冪等性，不要手寫簡體字黑名單**——簡繁同形字（明/定/用/布/局）會讓黑名單誤報。機制轉換過的輸出結構上不可能殘留可轉字。

**Why**：2026-07-04 ailiveX 文件簡繁化，dry-run 抽查 26 份標題抓到「小編髮文」「測試檔案」兩處錯轉才換方案；自寫殘留偵測又誤報一次。
**How to apply**：管線收斂點統一走 `s2tw + OVERRIDES 覆寫表`（實作在 ailivex `src/lib/zh-convert.ts`、`agent/firestore_loader._to_traditional`、doc-worker）；任何批次資料手術先 dry-run 印全量 before/after。
**觸發信號**：要做簡繁轉換／看到 s2twp／LLM 或 STT 輸出簡體要入庫。

相關：[[feedback-ambiguous-signal-not-proof]]（檢測器壞掉時 FAIL 也是零資訊）、[[feedback-deterministic-work-belongs-in-code]]
