---
name: cloud-run-sop
description: 天條級：有 throttling 的 Cloud Run 上不存在 fire-and-forget（呼叫自己也一樣）；2026-07-06 升級——長任務正解是 Cloud Run Jobs 不是 min=1 常駐 worker；--set-env-vars 會洗機密用 --update-env-vars
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8ef8c0e1-e3c6-4a5a-b395-90a13805cb5c
---

**⚠️ 2026-07-06 升級：no-throttle worker + min=1 已退役，長任務正解是 Cloud Run Jobs**（跑到完成才結束、按執行時間計費、零常駐）。本檔的三件套 SOP 保留為「必須秒級待命的常駐」場景（如 LiveKit 語音）與歷史脈絡；podcast/文件類長任務見 [[standing-cost-only-for-instant-readiness]]。ailivex/UDN podcast 已於 2026-07-06 全搬 Jobs 並實測收案。

**⚠️ 2026-07-02 晚同日重犯後升天條（已刻入 ~/.claude/CLAUDE.md 全局）**：早上在 ailivex worker 修對了這個病，晚上在 UDN 主平台（throttled）寫了「dispatch fire-and-forget 呼叫自己另一條 route + 10s abort」——同款死法：abort 斷線→CPU 掐掉→生成死、log 零蹤跡。**教訓的完整形狀：不是「worker 要開旗標」，是「throttled service 上任何形式的背景工作都不存在」——呼叫自己也不行。** 長活只有一條路：丟給 no-throttle worker（主平台只做驗證＋標狀態＋派工等 202）。連帶雷：worker cloudbuild `--set-env-vars` 整組替換會洗掉 update 注入的機密，一律 `--update-env-vars`。

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

- 驗證+1:2026-08-02 第6場 — setInterval 在 throttled Cloud Run 必死，上雲當天改 Cloud Scheduler

- 驗證+1:2026-08-03 第1場 — Jobs 模式（CASE_ID+JOB_ACTION env override、業務失敗 exit 0、--max-retries=0）照抄全通

- 驗證+1:2026-08-04 第1場 — 收卷同步生圖＝client 斷線 CPU 掐死＝fire-and-forget 天條的同型新臉；解法同天條：圖歸 job
