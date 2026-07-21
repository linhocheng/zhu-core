---
name: reference_nextjs16_csp_nonce
description: Next.js CSP nonce 化的正解與 Next 16 三個破壞性雷（proxy.ts改名/nonce必配force-dynamic/靜態頁死白頁）
metadata: 
  node_type: memory
  type: reference
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

給任何 Next.js 平台上 nonce-based CSP（真擋 inline XSS）時讀。三站（geo Next15.1 / UDN Next16.2.9 / ailiveX Next16.1.6）實戰驗過（2026-07-21）。

**正解模板（middleware/proxy 生 per-request nonce）**：
- 生 nonce 用 `crypto.getRandomValues(new Uint8Array(16))` + `btoa`（Edge runtime 安全，別用 Node 的 `Buffer`）。
- 把 CSP 寫進 **request header** `Content-Security-Policy`（Next 讀它抓 script-src 的 nonce，蓋到自注入 hydration/RSC script）**和 response header**（瀏覽器 enforce）。同時 set `x-nonce`（給你自己的 inline script 用）。
- **手術式**：只收 `script-src 'self' 'nonce-x' 'strict-dynamic'`，**不設 default-src**（避免誤傷 img/connect/font/WebRTC；語音平台 connect 絕不能受限）。`style-src 'self' 'unsafe-inline'`（React inline style *屬性* 無法帶 nonce）。dev 補 `'unsafe-eval'`（React dev 用 eval，`process.env.NODE_ENV==='development'`；prod 不需）。
- CSP 要從 `next.config.ts` 靜態 headers **搬走**，否則雙 CSP header 打架（瀏覽器取交集）。

**Next 16 三個破壞性雷**：
1. **middleware.ts 改名 proxy.ts**：Next 16.2 用 `proxy.ts`（export `proxy`），16.1 仍認 `middleware.ts`。改前先 `find` 既有檔＋看該站 CLAUDE/AGENTS.md，別建錯檔名（建錯＝不會被載＝auth 也漏）。AGENTS.md 常明令「動手前讀 `node_modules/next/dist/docs/`」。
2. **nonce 必配 force-dynamic**：靜態頁 build 時無 request→script 無 nonce→proxy 的 strict-dynamic 把靜態頁 script 全擋＝**死白頁**（curl 看 `with-nonce=0/N` 就是中招）。正解＝root layout 釘 `export const dynamic='force-dynamic'`（收斂點，未來新頁不會再靜默破）。UDN /login 原靜態，差點部署死白頁。
3. **`window.__next_f.length` 不是有效 hydration 探針**：Next 16 hydrate 後把 `.push` 換成消費型 handler，array 清空→length=0 不代表沒 hydrate。用 `window.next`（router 存在）＋軟導航才是真信號。

**外部資源要顯式放行**：用 `next/font/google` 自託管字型走 'self'（geo/UDN）；但若 globals.css `@import url('https://fonts.googleapis.com/...')`（ailiveX），要 `style-src` 加 `https://fonts.googleapis.com`，否則字型被擋掉 fallback。

驗證用 headless 真瀏覽器，見 [[skill_csp_nonce_per_site_headless_verify]]。連帶：[[reference_bridge_v1messages_effort]] 無關，但同屬平台加固線 [[feedback_platform_foundation_ledger]]。
