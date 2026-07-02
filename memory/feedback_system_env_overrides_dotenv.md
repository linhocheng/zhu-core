---
name: feedback-system-env-overrides-dotenv
description: 系統 env（.zshrc export）優先於 .env.local，同名變數會被覆蓋，需在 code 層 normalize
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e81b7a86-599c-4706-a5e2-a4185074754d
---

系統環境變數（透過 `.zshrc` `export` 設定）優先於 Next.js 的 `.env.local`。若同名變數格式不同，`.env.local` 的版本完全被忽略。

**Why:** `BRIDGE_URL` 在 `.zshrc` 是 `https://bridge-direct.soul-polaroid.work`（base URL），在 `.env.local` 寫了帶 `/v1/messages` 的完整路徑，但 Next.js dev server 讀到的是系統 env 版本，導致 fetch 打到 base URL → 404 "Cannot POST /"。

**How to apply:** 凡是有可能在系統 env 和 .env.local 同時存在的變數，不要信任格式，在 code 層 normalize：

```typescript
// 正確：去掉尾端路徑再補回，不依賴 env 的格式
const BRIDGE_BASE = (process.env.BRIDGE_URL ?? '').replace(/\/v1\/messages\/?$/, '')
const BRIDGE_ENDPOINT = `${BRIDGE_BASE}/v1/messages`
```

**觸發信號:** 出現 "Cannot POST /" 或 "Cannot GET /" 的 HTML 錯誤，但 curl 直連目標 URL 正常 → 幾乎一定是 URL 被系統 env 截斷了。

**關聯:** [[feedback_env_literal_newline_url]]（另一種 env 格式問題）
