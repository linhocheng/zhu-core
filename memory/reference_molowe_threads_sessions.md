---
name: molowe Threads discovery session 帳號 ↔ KOL 映射
description: 哪個 IG/Threads 帳號是哪個 KOL 的 scraper、storageState 存哪、怎麼重產
type: reference
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**Discovery worker 設計**：每 KOL 一份 Playwright storageState，位置 `~/molowe-sessions/{kolId}-state.json`（on zhu-dev VM）。Worker 在 `~/claude-bridge/index.js:2782+`，吃 IPRoyal TW proxy。

**帳號映射**：
- midoufu → midoufu 自己的 IG（既有 session, 2026-05-08 產）
- aurae → `i1975.phone@gmail.com`（2026-05-11 從 i1975 轉給 aurae，credentials 在 `/Users/adamlin/.claude/uploads/.../IG_threads_i1975.md`）

**重產 session SOP**（session 過期或新 KOL）：
1. 本機 `/tmp/aurae-login/login.js` 是參考模板（Playwright headed + IPRoyal proxy + IG SSO → Threads）
2. 跑出 `state.json`（要含 `.threads.com` + `.instagram.com` 兩個 domain 的 cookies）
3. scp 上 `zhu-dev:~/molowe-sessions/{kolId}-state.json`
4. VM smoke test：headless 載入 → goto threads.com/search?q=xxx → 看有沒有抓到 `a[href*="/post/"]`

**踩雷**：
- IG 登入頁的 `input[name="username"]` 已不存在；要抓 `form input` 順序前兩個（text + password）
- Threads 需要從 IG SSO 繼承 session，不能直接登 threads.com
- 登入完 IG 會跳 `/accounts/onetap/`、Threads 第一次會出 "Continue with Instagram" 攔截 — 都要點過去再存 state
