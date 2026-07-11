---
name: vercel-void-write-frozen
description: Vercel 回應送出後 lambda 凍結，void promise 的 Firestore 寫入沒 flush 就死；fire-and-forget 寫入一律 next/server after() 排程
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

**Vercel（serverless）上不存在「void promise 寫入」——回應一送出 lambda 就凍結，沒 flush 的寫入直接蒸發，而且零錯誤零 log（看起來像寫了）。**

**Why:** 這是「有 throttling 的 Cloud Run 上不存在 fire-and-forget」天條的 Vercel 變體。2026-07-11 監控事件脊椎實踩：`void db.add().catch()` 在本機必過、部署後 cron 回 200 但 Firestore 零筆——回應後 CPU 凍結，寫入 promise 沒跑完。

**How to apply:**
- 回應後才需要完成的寫入，一律 `import { after } from 'next/server'` → `after(() => work())`——Vercel 保證回應送出後執行完
- 把 after() 包在共用 writer 內部（如 `scheduleWrite()`），call site 保持同步 API 零改動；非 request 環境 try/catch 降級 best-effort
- after() 可以巢狀（after 裡再呼叫含 after 的函數 OK）
- 驗證信號：部署後打一發，**去 DB 查 doc 真的長出來**——「路由回 200」對這個 bug 是零資訊信號

**觸發信號:** 寫了 `void somePromise` / `.catch(console.error)` 不 await 且在 serverless route 裡；「本機有寫入、線上沒有」；監控/log/計量類 best-effort 寫入設計時。
