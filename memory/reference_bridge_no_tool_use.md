---
name: bridge（Max）不支援 tool_use，結構化輸出走 <result> JSON
description: 走 bridge/Max 的 worker 不能用 tool_use/tool_choice，結構化輸出要 <result> 標籤 JSON + Zod；只有 web_search 那種 server-side tool 走直連 API key
type: reference
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
走 **bridge（claude CLI gateway / Max 月費）** 的 LLM 呼叫**不支援 tool_use / tool_choice**。強制 `tool_choice` 回來的 content 裡不會有 tool_use block，會拿不到結構化輸出。

**正解（ANEWS 成熟做法）**：prompt 要求 JSON 包在 `<result></result>`、regex 抽取、`JSON.parse`、Zod 驗證。範例必須給【完整欄位】（省略欄位會讓 LLM 自創 key → Zod undefined）。

**例外**：需要 server-side tool（`web_search_20250305` 等）的 worker，走 `getLLMClientDirect()`（直連 API key），不能走 bridge。源頭註解在 ANEWS `cloud-run/source-worker/src/index.ts:13`「bridge doesn't support tools/web_search」。

**觸發信號**：在 ANEWS/MACS 或任何走 getLLMClient(bridge) 的地方想用 tool_use 拿結構化輸出 → 停，改 `<result>` JSON 模式（參考 `macs-platform/lib/llm/structured.ts` 的 callStructured helper）。
