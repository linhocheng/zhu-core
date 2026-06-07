---
name: 防禦釘在收斂點，不是每個生產端
description: 多處 LLM 輸出餵同一個消費端時，把確定性 coerce/validate 釘在那唯一咽喉，一個 commit 守全部，別逐點修
type: feedback
originSessionId: 0f6f6064-d9af-449e-b35e-4001b3d23932
---
當「很多生產端」的不可信輸出最後都流經「一個消費端」時，防禦釘在那個收斂點，不要在每個生產端各補一次。

**Why:** 2026-06-07 MACS export 炸 "e.replace is not a function"——LLM 把宣告為 string 的欄位回成物件，流進 render 層被 `.replace()` 呼叫。用相同概念查 Mode 2/3，發現 hybrid/creative-lead 兩個框架有一狗票同類 string 欄位無 data 層正規化。逐點修要改十幾處跨三個檔還會漏。實際根治：把 render 層唯一的 HTML escape 函式 `esc(s: string)` 改成 `esc(s: unknown)` + 確定性 coerce（string/null/object 取 .finding|.text|.claim 否則 JSON.stringify），一個 commit（v0.11.3.005）守住三模式所有 block。

**心態:** 找「資料必經的最窄處」下手，是天條「在邊界做確定性 validate」的具體手法——邊界往往不是每個生產點，而是唯一消費點。撒胡椒鹽式逐點防禦既累又漏，還容易日後新增生產端時忘記補。

**How to apply:** 看到「同一類 bug 散在很多 call site」先別急著逐個修。問：這些資料最後有沒有流經同一個函式/序列化點/render 咽喉？有 → 把 coerce/validate 釘在那一個點，降級成可讀文字而非崩潰。確認它真的是唯一通道（grep 所有 caller），否則漏網的還是會炸。

**觸發信號:** 「要改十幾處」「跨好幾個檔」「每個地方都要記得防」——這幾句話本身就是該往下游找收斂點的信號。
