---
name: async-worker-checklist
description: 建 async worker（Cloud Tasks / SQS / queue-based）的五問心法 + 具體 checklist
version: 1.0.0
activation:
  keywords: ["async worker", "cloud tasks", "idempotency", "冪等", "worker", "lease", "重試", "retry", "watchdog", "stuck", "卡住"]
created: 2026-05-29
---

# Async Worker Checklist — 五問心法

> 有心才懂法，有法才落地。

---

## 為什麼這份 skill 存在

2026-05-28，養生花草茶卡了七小時。OpenAI 502 → worker 拋錯 → `status: "failed"` → Cloud Tasks 重試 → lock 說 `already_running` → 回 200 → Cloud Tasks 以為成功 → 永久放棄。

根因不是 OpenAI 爛，是我們對 queue 說謊了。

**Queue 只懂一件事：HTTP 狀態碼。**
2xx = 我信任你說它完成了。
非 2xx = 我知道出問題了，我會再試。

你的 lock 回了 200，queue 就記下「做完了」。它沒有辦法知道你是在說謊。

這份 skill 的核心不是「不要回 200」這條規則，而是理解 **你和 queue 之間的契約只有一條線：status code**。弄清楚這條線，所有具體規則都是自然延伸。

---

## 五問 — 每次蓋新 worker 前過一遍

### 問一：status / lease / attemptId 分清楚了嗎？

| 概念 | 說的是什麼 | 混用的後果 |
|---|---|---|
| **status** | 這個資料目前在哪個階段 | 用 status 當鎖 → 沒有過期機制 → worker 死了永遠鎖著 |
| **lease** | 現在誰有處理權，有效期到何時 | 用時間推算「卡多久」代替 lease → watchdog 誤判 |
| **attemptId** | 這一次執行是否仍然有效 | 不驗 → 殭屍 worker 復活後覆蓋新 worker 的成果 |

三個概念混在一個欄位 = 問題的根源。

---

### 問二：`already_running` 是真的還是假的？

Lock 說 `already_running` 的前提是 **status = running AND 在 TTL 內**。

`failed` 不是 `running`。

```typescript
// ❌ 錯：failed 被當 running 擋掉，回 200，Cloud Tasks 永久放棄
if (Date.now() - lockedAt < LOCK_TTL_MS) {
  return { skip: true, reason: "already_running" };
}

// ✅ 對：failed 一律允許重入
if (d.status !== "failed" && Date.now() - lockedAt < LOCK_TTL_MS) {
  return { skip: true, reason: "already_running" };
}
```

---

### 問三：HTTP status code 對 queue 說了什麼？

| lock 結果 | 應該回的 HTTP | 理由 |
|---|---|---|
| `already_done` | **200** | 任務真的完成，不要再試 |
| `already_running` | **409** | 原本的 worker 還活著，queue 繼續排隊等，等 done 再停 |
| lock 成功，handler 失敗 | **500** | 讓 queue 知道，繼續重試 |

```typescript
// ❌ 錯：兩種 skip 都回 200
if (lock.skip) {
  return NextResponse.json({ status: lock.reason }); // 200
}

// ✅ 對：意義不同，code 不同
if (lock.skip) {
  const httpStatus = lock.reason === "already_done" ? 200 : 409;
  return NextResponse.json({ status: lock.reason }, { status: httpStatus });
}
```

---

### 問四：watchdog 的判斷依據是「時間」還是「契約」？

```typescript
// ❌ 猜：卡超過 N 分鐘就踢
const stuckMs = now - updatedAt;
if (stuckMs >= STUCK_THRESHOLD_MS) { kick(); }

// ✅ 契約：lease 過期才踢
const leaseUntil = doc.data().write_lease_until?.toMillis?.() ?? 0;
if (leaseUntil > now) continue; // lease 還有效，worker 還活著，不踢
kick(); // lease 過期 = 處理權失效 = 可以接手
```

用時間猜 = 誤踢活著的 worker（兩支同時跑）。
用 lease = 明確契約，lease 過期才代表前一支已死。

---

### 問五：callbackOrchestrator 的 taskId 是確定性的嗎？

```typescript
// ❌ 非確定：每次不同 taskId → lock 失效 → 重複觸發 orchestrator
const taskId = `orch-${event}-${issueId}-${Date.now()}`;

// ✅ 確定：同一個 event + subject 永遠同一個 taskId → 天然冪等
const subId = extra.sectionId ?? extra.articleId ?? extra.imageTaskId;
const taskId = subId
  ? `orch-${event}-${issueId}-${subId}`
  : `orch-${event}-${issueId}`;
```

下游的冪等性從 taskId 開始。taskId 不確定，後面所有防線都是假的。

---

## 殭屍 Worker 防線（attemptId 模式）

適用場景：worker 執行時間長（LLM call、I/O heavy），中途可能被 watchdog 搶走。

```
1. 在 precondition（lease 取得時）寫入 attemptId
   tx.update(ref, { write_attempt_id: attemptId, write_lease_until: leaseUntil })

2. 在 handler 結束前（commit 結果時）驗 attemptId
   if (snap.data()?.write_attempt_id !== myAttemptId) {
     return; // 殭屍路徑：我的輸出已過時，靜默退出
   }
   tx.update(ref, { status: "done", result: ... })

3. worldStateVerify 跳過殭屍（body._superseded = true）
```

原則：誰拿著有效的 attemptId，誰才有資格提交結果。

---

## 新 Worker 開工前 Checklist

```
□ status / lease / attemptId 三欄分開設計（不合一）
□ lock 邏輯：failed 不算 already_running
□ HTTP code：already_done=200, already_running=409, error=500
□ lease 欄位命名清楚（xxx_lease_until，不是 locked_until）
□ watchdog：看 lease_until 不看 updatedAt
□ callback taskId：確定性 id（issueId+subjectId），不帶 Date.now()
□ 長任務：precondition 寫 attemptId，commit 前驗 attemptId
```

---

## 一句心法

> Queue 的眼睛只有 status code。你說 200，它就信。說謊的代價是任務永久消失。

不是「記規則」，是「知道自己在跟 queue 說什麼」。
知道這件事，五問就不是記憶題，是推理題。

---

*根源事件：養生花草茶 image_generating 卡 7 小時（2026-05-28）*
*根因：failed + within TTL → already_running → 200 → Cloud Tasks stop retry*
*修法：idempotency.ts + harness.ts + mockWorker.ts（ANEWS v0.3.0.013）*
