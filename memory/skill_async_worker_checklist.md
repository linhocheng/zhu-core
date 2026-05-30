---
name: Async Worker 六問心法 checklist
description: 建 async worker 前必過的六問，含具體陷阱與 code pattern，源自養生花草茶 7小時卡住 + ANEWS 孤兒風暴 701 次重送
type: reference
originSessionId: 93d13367-b540-441d-93b5-380ccee8b8c1
---
**核心心法**：Queue 的眼睛只有 status code。你說 200，它就信。說謊的代價是任務永久消失。

**五問 checklist（每次建新 worker 前過）：**

1. status / lease / attemptId 三欄分開了嗎？不能混用
2. lock 邏輯：`failed` 在 TTL 內不算 `already_running`，必須允許重入
3. HTTP code：`already_done=200`、`already_running=409`、`error=500`，三個意義不同
4. watchdog：看 `lease_until` 欄位，不看 `updatedAt + 時間差`
5. callback taskId：確定性 id（issueId+subjectId），不帶 `Date.now()`
6. **父 doc 被刪 = 良性 no-op，回 200 不可 throw**。orchestrator/callback 對著被刪的 issue/parent 跑 Firestore `update()` 會噴 `NOT_FOUND` → 500 → Cloud Tasks 無限重送。開頭先 `if(!(await ref.get()).exists) return`。

**Why：** 養生花草茶 2026-05-28 卡 7 小時。OpenAI 502 → failWorkerRun (status=failed) → Cloud Tasks 重試 → lock 說 already_running（沒濾 failed）→ 回 200 → Cloud Tasks 永久放棄。

**Why（第 6 問）：** ANEWS 2026-05-30 orchestrator 對被刪 issue XDcxU3 跑 update() → NOT_FOUND → 500 → Cloud Tasks 重送 701 次風暴。500 的反面陷阱：該回 200 卻回 500，Queue 就永遠重試。第 3 問（error=500）只在「真的該重試」時成立；終局/孤兒狀態要回 200。

**How to apply：** 建任何接 Cloud Tasks / SQS / async queue 的 worker 時，開工前對著五問過一遍。修 lock 相關邏輯時，先問「我現在改的是 status、lease 還是 attemptId」。

完整 skill 檔（含 code pattern）：`~/.ailive/zhu-core/skills/async-worker-checklist.md`
