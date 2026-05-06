---
name: 能走 bridge 吃到飽就不花錢
description: 新路由上線前必查是否串流，非串流一律 getAnthropicClient，不用 new Anthropic 直接接
type: feedback
originSessionId: 1ad44abe-6f55-47f7-8379-101f8e6ed79c
---
能走 bridge 吃到飽就不花錢。

**Why:** Claude Max 月費已付，新路由若直接用 `new Anthropic({ apiKey })` 等於白白燒 API key 餘額。ig-pipeline 就是被發現的漏洞。

**How to apply:** 每次新增或修改 API route 時，先問：這個路徑有沒有 SSE streaming？
- 有串流 → 只能用 `new Anthropic({ apiKey })`（bridge 不支援 SSE）
- 無串流 → 一律換成 `getAnthropicClient(process.env.ANTHROPIC_API_KEY || '')`
- 目前唯二合理的例外：`dialogue` 主串流、`voice-stream` 主串流
