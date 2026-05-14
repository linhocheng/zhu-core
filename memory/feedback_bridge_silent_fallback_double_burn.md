---
name: anthropic-via-bridge fallback 是雙燒不是保險
description: bridge timeout 後 fallback SDK，但 bridge VM 端會繼續跑完 → Max + API key 同時燒
type: feedback
originSessionId: a4e715dd-34d5-4035-a1d9-29960e200739
---
`src/lib/anthropic-via-bridge.ts` fallback 的真相不是「bridge 掛了用 SDK 救回」，而是**雙燒**：
- Vercel 端 timeout 後 abort fetch → 走 SDK 直連 API key
- 但 bridge VM 那邊 claude CLI **不會收到 abort signal，會繼續跑到完**，Max 月費照吃
- 結果：同一個 request，Max 跑一次 + API key 跑一次

**Why:** 2026-05-11 抓到的真實案例。strategy 跑 208s，bridge journalctl 顯示 `req=claude-sonnet-4-6 145079ms` 完整跑完並回 200，但 Vercel 90s 早就 abort 了 → SDK fallback 觸發。Adam 講「整個 WHY 已經被靜默繞過」。

**心態:** 警覺姿態，看到 fallback 設計第一秒問「兩端各自的執行狀態是什麼」。timeout 是 client-side 的，server 有自己的生命週期。「失敗的那一邊不會繼續花錢」是錯誤假設。fallback 不是免費保險，可能是雙燒陷阱。

**How to apply:**
- 評估 fallback 設計時，不要假設「失敗的那一邊不會繼續花錢」。timeout 是 client-side 的，server-side 有自己的生命週期
- bridge / proxy / worker 架構出錯時，先看「兩端各自的執行狀態」，不是只看 client 拿到的結果
- 修法：把 timeout 拉到接近 lambda 上限（Vercel 300s → 280s），讓 bridge 真的有機會完成，fallback 變成最後保險而非常態觸發
- 若 fallback 高頻出現（Firestore `bridge_fallbacks` 觀察），代表 bridge 跟不上量，要搬 Cloud Run（無 lambda 上限）

**觸發信號：**
- 設計或 review 任何「主路徑 + fallback」雙路結構時（不只 LLM bridge，包含 cache fallback、CDN failover、retry queue）
- 看到 `console.warn(...fallback to...)` 沒搭配 metrics 寫入時 → 立刻問「這條 fallback 觸發頻率知道嗎？」
- 部署成本帳單突然變高、Max 用量突然變大時 → 第一個懷疑「是不是有靜默雙燒」

---

## 504 兩種型態：雙燒 vs 賽跑（2026-05-13 補）

bridge + lambda 架構下，Vercel 504 不只一種 ── 真因不同、解法不同。

**雙燒型（5/11 案例）：** bridge 還在跑 + Vercel 已 abort → 兩端都耗，但 client 拿不到結果。
- 證據：bridge journalctl `req=... 145079ms` 完整跑完並回 200，Vercel 90s 早就 abort
- 結果：Max 一次 + API key fallback 一次

**賽跑型（5/13 LUCY 案例）：** bridge 在 Vercel timeout 前 1 秒完成 → backend 成功、Vercel 看到 504。
- 證據：UTC 04:02:03 bridge log `req=claude-sonnet-4-6 113835ms`，Vercel 04:02:04 timeout（早 1 秒）
- 後續 LUCY 顯示「跳過」= dedupe 寫進去 = backend 其實成功
- 不是雙燒（fallback 已拔，無第二次燒），是賽跑

**辨別方法（Firestore dedupe 對賬）：**
- 收到 504 後第一動作不是修 dedupe，是查 Firestore 那筆 task 的 dedupe / `last_run_at` 寫進去沒
- 寫進去 = 賽跑（backend 成功，下次自然跳過）
- 沒寫進去 = 雙燒 or 真失敗

**解法分流：**
- 雙燒 → 拔 fallback（已做，`anthropic-via-bridge.ts` v0.4.0.004）
- 賽跑 → 壓縮 bridge 耗時讓它領先更多（`--effort low`，sonnet 4.6 113s → 22s）
- 不要把賽跑當雙燒修 dedupe ── 那只是繞過症狀
