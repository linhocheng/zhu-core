---
name: Vercel/Turbopack 不要 bundle Google Cloud SDK
description: "@google-cloud/* 內部 dynamic require，Turbopack 16.x 直接炸；改 fetch + 手 sign JWT + REST API 第一秒就走"
type: reference
originSessionId: bd4daf09-8777-4842-b8e8-5324dd1ef9d6
---
**症狀（Next 16.1.6 + Turbopack）**：
- static import `@google-cloud/tasks` → `npm run build` 炸：`Failed to collect page data ... Cannot find module as expression is too dynamic at r.getJSON`
- 改 `await import(...)` → build 過了，但 production runtime 還是同訊息（**dynamic-import 不是 bundle 救生圈**）
- 加 `next.config.ts` 的 `serverExternalPackages: ['@google-cloud/tasks']` → build 過了，dialogue 直接 HTTP 500（Turbopack 跟 webpack 行為不同）

**根因**：SDK 內部用 dynamic require 載 proto descriptor。Turbopack static analyzer 解不出來。

**正解（碰到第一秒就走這條）**：
1. `node:crypto` `createSign('RSA-SHA256')` 從 SA key 自簽 JWT
2. POST `https://oauth2.googleapis.com/token` 換 `access_token`（in-memory 50min cache）
3. 直接打對應的 REST API 帶 Bearer

**範例**：`ailive-platform/src/lib/cloud-tasks.ts`（~130 行，零 npm dependency 新增，build 秒過）

**判斷流程**（碰到任何 `@google-cloud/*` 套件之前先問）：
1. 套件內部有 dynamic require / proto loader？看 package.json `exports` 跟 issue tracker
2. 有 → 第一秒就走 fetch + REST，不要試 SDK 任何 bundle 配置
3. 沒對應 REST API → 才考慮 server-only route + 複雜 bundle 配置

**衍生天條**：三次嘗試（static / dynamic / serverExternalPackages）都打不通就停手換思路 ── 這正是 `feedback_courage_in_the_moment` 8 句觸發訊號裡的「再試一次這個 fix 應該就好」（同根稻草換握法）。
