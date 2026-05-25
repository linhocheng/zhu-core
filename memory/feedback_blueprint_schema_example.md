---
name: blueprint prompt 的 <result> 範例必須含完整 sectionPlan 欄位
description: LLM 會照範例的 JSON 結構輸出，範例裡省略的欄位會變 undefined
type: feedback
---

blueprint worker 的 user prompt 最後有 `<result>{"sectionPlan":[...]}</result>` 範例。`[...]` 省略了 sectionPlan 每個物件的欄位，Sonnet 無從知道要輸出哪些 key，輸出了自己發明的欄位名（中文或不同英文），Zod 驗證全部 undefined → SCHEMA_VALIDATION。

**Why:** 2026-05-25，從 haiku 升到 sonnet 後 SCHEMA_VALIDATION 才變可見（之前 haiku 版有不同問題掩蓋）。真正的根因是 prompt 範例不完整，不是 LLM 的問題。

**心態：** JSON schema 驗證失敗，第一步是看 LLM 到底輸出了什麼欄位名，不要假設 LLM 知道欄位名。

**How to apply:** 任何有 Zod schema 驗證的 LLM 輸出，prompt 裡的範例必須包含所有 required 欄位的完整結構。`[...]` 是 bug。

**觸發信號：** 看到 `path: ["sectionPlan", 0, "order"]` 之類 undefined 錯誤 → 先看 prompt 範例有沒有給完整欄位，不要先懷疑 LLM。
