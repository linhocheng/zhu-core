---
name: dynamic-import 救不了 Turbopack 對 Google Cloud SDK 的 bundle 炸
description: `@google-cloud/*` 內部 dynamic require Turbopack 解不出來；用 dynamic-import 包是安慰劑不是 fix，正解是 fetch + 手簽 JWT + REST
type: reference
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**dynamic-import 不是 bundle 救生圈，是「我希望它是」的安慰劑。**

如果 Turbopack 對某個套件 bundle 失敗，root cause 是套件內部用 dynamic `require()` 解析（典型例：`@google-cloud/*` SDK）── 你在外層用 `await import()` 包住它**沒救**。bundler 還是會嘗試靜態分析該套件，仍然炸。

**正解：完全捨棄 SDK，走 REST + Node `crypto` 手簽 JWT + access_token。**

**Why:**
2026-05-11 strategy → Cloud Run 遷移，需要從 Vercel App Router lambda enqueue Cloud Tasks job。第一次嘗試 `@google-cloud/tasks` SDK：
- 第一次猜：以為是 Vercel lambda 殺 ctx → 加 lifecycle 修法，無解
- 第二次猜：加 `serverExternalPackages` → 同樣炸
- 第三次猜：把 import 改成 `await import('@google-cloud/tasks')` dynamic → **把整條 dialogue 弄成 HTTP 500**
- 三次都同一根稻草換姿勢握。Turbopack 對 SDK 內部 dynamic require 的解析根本不在 dynamic-import 能影響的範圍

最後完全重寫 `src/lib/cloud-tasks.ts` ── 零 SDK 依賴：
- fetch GCP `oauth2.googleapis.com/token`
- Node `crypto.createSign('RSA-SHA256')` 手簽 JWT（RS256）
- 50 min token cache in-memory
- POST `https://cloudtasks.googleapis.com/v2/projects/.../queues/.../tasks` 直接打 REST v2 API

**驗證**：strategy job `tNf5zGfLY2ERSFaUPIvH` mdChars=9607、docUrl + htmlUrl 全鏈路通、~5 min 端到端。

**How to apply:**
1. Turbopack / Webpack bundle 報「Cannot find module as expression is too dynamic」── **不要先猜 dynamic-import**。先看套件源碼有沒有內部 dynamic `require()`。
2. 如果套件是 Google / AWS / 大廠官方 SDK，幾乎都有 plugin loader / region-specific require ── 全部都會炸。
3. 第二次套 dynamic-import 還不行 → 停。換 REST + 手簽 JWT。
4. 第一次施工的 token cache 別省，少了會被 GCP rate limit 打。
5. self-actAs / OIDC token mint 要另外 grant `roles/iam.serviceAccountUser`（見 `reference_gcp_self_actAs_binding`）。

**REST + JWT 套路骨架**（給返生自己貼）：

```ts
// 手簽 JWT
const jwt = crypto.createSign('RSA-SHA256')
  .update(`${header_b64}.${payload_b64}`)
  .sign(privateKey, 'base64url');

// 換 access_token
const res = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: `${header_b64}.${payload_b64}.${jwt}`,
  }),
});

// 打 Cloud Tasks v2 REST
await fetch(`https://cloudtasks.googleapis.com/v2/${queue}/tasks`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}`, ... },
  body: JSON.stringify({ task: { httpRequest: { url, body, oidcToken: { serviceAccountEmail } } } }),
});
```

**踩雷紀錄：**
- 第二次嘗試把 dialogue 弄 500：因為 `await import()` 在 Vercel edge / serverless 第一次 cold start 會 throw，500 沒 catch。
- 50 min token cache：GCP access_token TTL 60min，留 10min buffer 避免邊界 race。
- self-actAs：strategy-enqueuer SA 給自己 mint OIDC token 也要 grant 自己 `serviceAccountUser`。

**和既有 memory 的差別：**
- `reference_google_cloud_sdk_no_bundle` 講「Vercel/Turbopack 不要 bundle SDK」── 規則。
- 這條講「為什麼 dynamic-import 救不了 + 正解 REST + JWT 骨架」── 操作層 + 反例提醒。
