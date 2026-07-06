---
name: skill-public-page-open-api-hardening
description: 「登入只擋頁面、/api 全開」反範式與修法——auth 種 cookie、API 認 cookie；匿名但公開的付費路由用 IP 限流；路由按呼叫者分三類上鎖
metadata: 
  node_type: memory
  type: reference
  originSessionId: 50b87aad-ff26-4532-9e0c-2506caf4fd7b
---

**規則**：很多 Next.js 平台的 middleware 只 gate 頁面路徑（matcher `/dashboard`），`/api/*` 卻全開——因為 ①middleware 沒 match /api，或 ②HTTP Basic 憑證依 RFC 不會被瀏覽器自動帶到 /api sibling 路徑。結果：dashboard 頁面在登入後，但它的 fetch 打的 /api 是匿名可達的。修法不是把 /api 一刀鎖死（會斷合法前端），而是**按呼叫者分類逐路由上鎖**。

**Why**：2026-07-06 審 ailive/anews/zhu-core 三平台都是這個形狀。實測（curl 生產端點看 body，不只信 HTTP code）證實匿名可打爆付費 LLM/TTS、跨租戶讀 PII、往記憶下毒。

**心態**：「頁面要登入」給人「這區塊被保護了」的錯覺，但保護的只是 HTML，不是資料管道。驗證要 curl /api 本身，不是看頁面有沒有跳登入。

**How to apply**（每條路由先問「誰合法呼叫我」再選鎖法）：
- **只有後台/管理員呼叫** → 鎖 operator（比對後台密碼 cookie，如 ailive `hasOperatorAccess`）。dashboard 帶 cookie 照常、匿名擋掉。
- **前端頁面呼叫、但頁面本身該登入**（dashboard 的 fetch、/hub 的 CRUD）→ **auth 成功時種 httpOnly cookie，API 認 cookie**。因為前端 JS 拿不到密碼、Basic 憑證又不會自動帶到 /api。middleware 驗過 Basic/密碼後 `res.cookies.set(...)`，路由用 `hasXxxAccess(req)` 檢查 cookie（或 x-secret 給 CLI/程式）。anews、zhu-core /hub 都用這套。
- **合法就是匿名公開**（client 端跟角色講話＝付費 dialogue/tts/voice-stream/stt）→ **不能要求 auth**，改 per-IP 限流（Upstash `INCR`+`EXPIRE`，fail-open 免拖垮正常服務）。ailive 4 條付費路由 40-60/分，實測第 61 起吐 429。
- **內部 server-to-server fetch**（route 打 route）→ worker-secret header（cookie 帶不過去）。
- **cron** → 設 `CRON_SECRET` env，Vercel 自動注入 bearer，路由 fail-closed 比對。
- 動手前必查每條路由的真實呼叫者（grep 前端 fetch + CLI 腳本），漏一個就斷一條（zhu-core /hub 的 DELETE 差點漏——以為 CLI 不 DELETE 就安全，結果 hub 前端在 DELETE）。

**觸發信號**：middleware matcher 只寫頁面路徑；付費/寫入 route handler 開頭沒有任何 auth 檢查；「這頁要登入」被當成「這功能被保護」。

相關：[[feedback_backend_client_must_sync]]（改 API 契約要同步客戶端——這裡是加 auth 要同步前端帶 cookie）、[[feedback_flagged_risk_must_be_verified]]（curl 實測 body 才算驗，不看頁面）。
