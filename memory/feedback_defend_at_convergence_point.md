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

**但書（旁路盤點）:** 收斂點只覆蓋「真的流經它的」生產端，釘之前必須先盤點旁路。2026-06-08 把報告篇幅 directive 釘在 `callStructured`（結構化輸出唯一咽喉）時，有兩條旁路會漏：(1) Mode 1 analysis 是 raw `llm.messages.create`（prose 輸出，根本不走 callStructured）→ 不手動補就永遠收不到；(2) Mode 3 creativeLead 原本自己也注入過一次 → callStructured 再注入變雙重注入。釘咽喉前先把生產端分三類：走咽喉的（自動收）／繞過咽喉的旁路（手動補）／已自理的（要拆掉避免重複），三類都處理完才算收斂。

**觸發信號:** 「要改十幾處」「跨好幾個檔」「每個地方都要記得防」——這幾句話本身就是該往下游找收斂點的信號。釘下去前再問一句：有沒有 producer 根本不流經這個咽喉？

- 驗證+1:2026-08-04 第4場 — 修在 uploadBuffer 唯一咽喉，一次守住所有覆寫路徑

- 驗證+1:2026-08-05 第2場 — sheetPrompt/sheetSizeOf 收成唯一咽喉，web/worker/UI 預覽共讀

- 驗證+1:2026-08-05 第3場 — 指紋比對釘在 sign 這唯一的種段口

- 驗證+1:2026-08-05 第6場 — 時刻抖動釘在 isScanDue 單一咽喉＋dispatch 傳 seed，不散在各處

- 驗證+1:2026-08-06 第1場 — 四份重複的卡別中文對映收斂成 ASSET_KIND_ZH

- 驗證+1:2026-08-07 第1場 — parser bug 修在解析咽喉，不逐個改 59 個檔的 frontmatter

- 驗證+1:2026-08-08 第2場 — 9 處中文 redirect 用 redirectErr 一個 helper 收斂

- 驗證+1:2026-08-08 第3場 — 版式讓位釘在 sheetPrompt 唯一咽喉

- 驗證+1:2026-08-08 第6場 — lexTerms 收斂點一處加 s2t 守文字+語音兩線

- 驗證+1:2026-08-08 第7場 — 版式讓位/帳本注入釘在 prompts 唯一咽喉；下一階的 KeyMoment 判準也定在收斂點
