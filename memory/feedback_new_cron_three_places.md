---
name: new-cron-three-places
description: Next.js 有登入牆 middleware 的專案加新 cron 必動三處：route + vercel.json + middleware 白名單
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a9b7d636-5be7-4a6c-8713-dac420bae156
---

加新 Vercel cron 有**三處**要動，漏任何一處都是靜默斷點：
1. `src/app/api/cron/<name>/route.ts`（自帶 CRON_SECRET fail-closed 鑑權）
2. `vercel.json` crons 陣列（排程）
3. `src/middleware.ts` PUBLIC_PATHS（登入牆白名單）——**最容易漏的就是這個**

**Why**：middleware 的 401 和 route 自己的 401 長得一模一樣（`{"error":"unauthorized"}`），肉眼分不出是哪層擋的。cron 排程器不會登入，被登入牆擋掉後 Vercel cron 只默默記 401，燈號永遠灰。

**心態**：「route 寫好了」不等於「血管接通了」——[[interface-blood-vessel-check]] 的 cron 版。

**How to apply**：加完 cron 後用 CRON_SECRET 打一次生產端點,拿到 `{ok:true}` 才算接通；被 401 時先交叉驗證——同一把 secret 打一條已知會通的舊 cron,通=middleware 問題,不通=secret 問題。

**觸發信號**：新 cron 端點回 `{"error":"unauthorized"}` 但 secret 確定沒錯;或 Vercel cron 面板顯示連續 401。

來源：2026-07-11 ailivex v18.6.1,ops-rollup cron 被 middleware 擋,用交叉驗證法（voice-auto-off 通、ops-rollup 不通）三分鐘定位。
