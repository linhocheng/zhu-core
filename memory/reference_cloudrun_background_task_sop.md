---
name: cloud-run-sop
description: fire-and-forget worker 必帶 --no-cpu-throttling + --min-instances=1 + 先回202；client 斷線＝request 結束，「保持 request open」擋不住 throttle
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8ef8c0e1-e3c6-4a5a-b395-90a13805cb5c
---

**Cloud Run 上跑「回應後繼續算」的後台任務（fire-and-forget worker），deploy 必帶三件套**：

```
--no-cpu-throttling    # CPU 永遠分配（沒 active request 也全速）
--min-instances=1      # 空閒不回收 container（後台任務跑一半不被殺）
--timeout=3600         # request timeout 拉滿
```

程式側 pattern：收到 POST → 驗證 → **立即回 202** → `setImmediate(async () => { 長任務; 寫回 Firestore })`。

**Why（兩個平台行為，都是 2026-07-02 podcast-worker 實測撞出來的）**：
1. Cloud Run request-based billing 在「沒有 active request」時 throttle CPU 到近零。**client 斷線＝request 結束**——Vercel `AbortSignal.timeout(10s)` 一斷，即使 server 端 Node.js 還在跑，Cloud Run 也視為無 request → throttle。所以「保持 HTTP request open 直到做完」這招**只在 client 全程連著時有效**，fire-and-forget 架構下必然失效。
2. `--min-instances=0` 時空閒 container 會被回收——**連正在跑後台任務的也算空閒**（沒 active request）。實測：2500 字生成跑到 ~14 分鐘，log 出現新的 `listening on :8080`，任務永遠卡 `running`。

**成本**：`--no-cpu-throttling` 走 always-on 費率（單價約一半但 24/7 計），1 vCPU + 512Mi + min-instances=1 約 $25-35/月。不接受就換 Cloud Tasks / Jobs，不要硬撐 request-based。

**觸發信號**：Cloud Run 任務「短的成功、長的卡 running」；log 裡任務 start 後沒 done、中間插了新的 `listening on :8080`；想用「回應前先做完」來閃 throttle 的念頭（client 會斷就沒用）。

實例：ailivex `cloud-run/podcast-worker/cloudbuild.yaml`。相關：[[天條：Cloud Run firebase-admin 一律走 ADC，不注入 SA JSON]]。
