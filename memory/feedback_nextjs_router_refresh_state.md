---
name: feedback-nextjs-router-refresh-state
description: Next.js App Router 的 router.refresh() 不會重置 useState，直接操作 state 才正確
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e81b7a86-599c-4706-a5e2-a4185074754d
---

`router.refresh()` 觸發 server component 重新 render 並傳新 props，但 client component 的 `useState` 不會因此重置——初始值只在 mount 時用一次。

**Why:** 2026-06-28 UDN NEWS platform assets page 發現：dispatch 後呼叫 `router.refresh()`，任務列表沒有更新，因為 `const [tasks, setTasks] = useState(initialTasks)` 的 `tasks` state 維持舊值。

**How to apply:** 需要更新列表時，直接操作 state（`setTasks(...)`），不要靠 `router.refresh()` 刷新 props 來觸發 UI 更新。`router.refresh()` 只適合讓下一次導航取得最新的 server data，不適合當下立刻更新已 mounted 的 client component。
