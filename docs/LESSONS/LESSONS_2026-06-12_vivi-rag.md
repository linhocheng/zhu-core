# LESSONS 2026-06-12 · Vivi 知識庫檢索分層 + 前沿學習（築 AIR session）

## L1：窄域語義坍縮——根因在檢索層不在 embedding
- 現象：Vivi client 上傳化妝品法規，對話讀不到。上傳/解析/embedding 全正常（cosine 0.65-0.78、dim 768、debug-kb 證實 isNumberArray）。
- 根因：knowledge-search 純按 cosine top-N（limit=10）。窄域（中文化妝品）embedding 全坍縮在 0.85-0.92——product「適合對象」類對「化妝品法規」查詢都 0.9+，把法規（0.65-0.78）擠到第 24 名後被切掉。**問題不是 embedding 不準，是同域文件互相靠近 + flat top-N 失去鑑別力。**
- 下次：debug RAG「撈不到」先用 debug-kb 印全體分數排名，不要憑「embedding 應該會中」猜。看到分數高卻沒回傳 = 排名/limit 問題，不是相似度問題。
- 修法：參考層 category=general 永遠帶入（兩條路徑都帶）+ 語義 fallback 每產品上限 3。
- 對應 feedback：solve_root_not_symptom（先以為上傳壞，實是檢索層）、diagnosis_verify_before_write（debug-kb 印分數才看清）。

## L2：假中台——hitCount「天命優先」寫在註解但排序沒讀它
- 現象：knowledge POST 寫 `hitCount:100 // 永遠優先於後天 insights`，但 knowledge-search 純按 _score 排序，hitCount 從沒進排序公式。設計意圖死在註解裡。
- 根因：後台寫了、前台不讀。典型假中台。
- 下次：寫「X 永遠優先」這種斷言時，去檢索/排序碼確認真的有讀 X。註解寫的優先級若管道不通 = 謊。已改誠實註解（天命優先由檢索分層保證，非 hitCount）。
- 對應：sync-truth-principle（後台必同步前台）、surface_technical_debt。

## L3：置頂保證 vs 壓縮顯示的張力——改一處要追輸出全鏈
- 現象：把 general 置頂保證不被 slice 截斷後，壓縮輸出的 top3 永遠被 3 條法規佔滿，產品條目從結構化區塊消失（只剩 Haiku 摘要裡）。
- 根因：retrieval 排序改了，但下游 display 的 `scored.slice(0,3)` 沒跟著調。
- 下次：改檢索順序要追到最終 prompt 輸出。修法：壓縮顯示改「全 general + top3 非 general」。情境3 重驗才抓到。
- 對應：fix_one_layer_dryrun_all（第一層通不算完成，要端到端跑）。

## L4：前沿對照確認 ailive 骨架血統純正，缺的是「多一層智能」
- 四個研究員打撈 RAG/MCP/Skills/記憶 2025-2026 前沿（存 docs/FRONTIER_RAG_MCP_SKILLS_MEMORY_2026-06-12.md）。
- 共識：ailive 到處在做「永遠在場/純 top-N/只看 cosine」，前沿到處在做「按需載入/rerank/多訊號加權」。
- 記憶系統骨架前沿都點頭（知識庫=semantic、insights=episodic、sleep=reflection、hitCount=access freq、tier=working↔longterm）。
- 最高槓桿：RAG 加 rerank 層——順手把今天的硬規則繃帶換成真材料。
- MCP 結論：現在別碰（工具寫死=優點不是債）。Skills：做漸進揭露。

## L5：真實對話驗收 ≠ curl 直打 API
- 今天修完只 curl 直打 knowledge-search 驗過，沒撥 Vivi 真對話。Adam 給權限後實撥兩輪（違規宣稱 + 得宣稱），確認：①query_knowledge_base 真觸發（觸發語意修正生效）②引用法規逐字（治療青春痘/脂漏性皮膚炎、得宣稱詞句全套）③法規+產品知識合成正確。
- 下次：API 層驗過只是半程，端到端走真實入口（撥/打字）才算地基穩。對應 fix_one_layer_dryrun_all。
