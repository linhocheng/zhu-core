---
name: skill_csp_nonce_per_site_headless_verify
description: 同模板複製到多站也要逐站真瀏覽器測——每站雷不同；headless 驗 CSP/hydration 的鑑別信號技術
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

複製同一份 CSP/前端加固模板到多個平台時，**每站都要逐站跑真瀏覽器測，不能「模板過一站就假設全過」**。三站 CSP nonce 化實證（2026-07-21）：同模板，geo 一次過、UDN 撞「Next16 靜態頁死白頁」、ailiveX 撞「外部 Google Fonts 被 style-src 擋」——三站三種不同的破法，只有真測抓得到。

**Why**：模板消滅的是「共通結構」，但每站的 Next 版本、字型載法、靜態/動態頁分布、既有 middleware 都不同——這些差異正是模板沒覆蓋、會咬人的地方。curl 只能證「script 帶了 nonce」，證不了「瀏覽器真的執行了、頁面還活」（CSP 是瀏覽器 enforce 的）。

**How to apply**：用 playwright-core 驅動系統 Chrome（或 cached chromium）headless 測，收三組鑑別信號——
- **script nonce 覆蓋**：`with-nonce / total === N/N`（機制生效；0/N＝strict-dynamic 全擋＝死白頁）。
- **CSP violations**：`document.addEventListener('securitypolicyviolation', ...)` 收集，須為 0。
- **client 軟導航＝最強 hydration 證據**：點頁前在 `window` 種標記，點站內 `<a>` 後 URL 變了但標記還在＝軟導航（window 未重載）＝React 真 hydrate、router 攔截了點擊。沒 hydrate 會 hard reload 或失敗。比 `__next_f.length` 可靠（後者 Next16 會被消費清空）。
- gated 頁測法：讀 `.env.local` 的 SESSION_SECRET，依該站 signToken 邏輯自簽 cookie（不碰不印密碼），playwright `addCookies` 進 context。
- **部署後同一組信號再打 production**：curl 線上 /login 看新 CSP header＋兩請求 nonce 不同＋script 全覆蓋＋Cloud Run 流量 revision==latestReady，四項齊才算上線（不靠「build SUCCESS」）。

**觸發信號**：手上是「把 A 站驗過的東西複製到 B/C 站」的任務，心裡冒出「一樣的改法應該都會過」。那個「應該」就是要逐站真測的訊號。

家族：[[feedback_flagged_risk_must_be_verified]]（標了不等於驗了）、[[feedback_ambiguous_signal_not_proof]]（鑑別信號）、[[reference_nextjs16_csp_nonce]]（本次技術細節）。
