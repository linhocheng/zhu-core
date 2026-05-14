---
name: 能走 bridge 吃到飽就不花錢
description: 新路由上線前必查是否串流，非串流一律 getAnthropicClient，不用 new Anthropic 直接接
type: feedback
originSessionId: 1ad44abe-6f55-47f7-8379-101f8e6ed79c
---
能走 bridge 吃到飽就不花錢。

**Why:** Claude Max 月費已付，新路由若直接用 `new Anthropic({ apiKey })` 等於白白燒 API key 餘額。ig-pipeline 就是被發現的漏洞。

**心態:** 成本意識姿態，每次寫 LLM call 都自動問「這條走 bridge 還是 API key」。「per-token 計價」「太貴」「每月 LLM 成本」這類詞當警報 — 走 bridge 的 marginal cost = 0，成本論點不成立。把「Max 月費吃到飽」當預設前提，不是例外。

**How to apply:** 每次新增或修改 API route 時，先問：這個路徑有沒有 SSE streaming？
- 有串流 → 只能用 `new Anthropic({ apiKey })`（bridge 不支援 SSE）
- 無串流 → 一律換成 `getAnthropicClient(process.env.ANTHROPIC_API_KEY || '')`
- 目前唯二合理的例外：`dialogue` 主串流、`voice-stream` 主串流

**觸發信號：**
- 寫程式時：當你準備寫 `new Anthropic({ apiKey })` 之前（不是 dialogue / voice-stream 主串流）
- **估算成本 / 容量規劃時**：當你開始算「每篇 $0.00X」「每 token $X」「每月 LLM 成本」 — 真實 marginal cost = $0（Max OAuth 吃到飽），唯一限制是 rate limit + latency。**「per-token 計價心態」就是這條 memory 的呼喚。**
- 設計新功能時：當你說「LLM call 太貴所以中期再做」、「每篇都跑會燒錢」 — 先確認是不是走 bridge，是的話成本論點不成立。
- 2026-05-06 真實踩坑：molowe publish-time sensor 提案我寫「每篇 +$0.001」，把走 bridge 完全忘掉。被 Adam 當場逮。
