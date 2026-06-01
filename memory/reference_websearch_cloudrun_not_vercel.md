---
name: 長/多呼叫 worker 放 Cloud Run 不放 Vercel（300s 雷）+ 佇列必設 maxAttempts
description: web_search 或「多次序列 LLM 呼叫」的 worker 在 Vercel 撞 300s；且 Vercel 砍函式後 lock+CloudTasks 會把 timeout 轉成「永久 stall」不是重試。鐵律放 Cloud Run，Vercel 用 overrideBaseUrl 指過去
type: reference
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**鐵律（已推廣）**：用 `web_search`、或**任何會跑多次序列 LLM 呼叫 / 預期 >300s** 的 worker，**必須跑在 Cloud Run，不能放 Vercel route**。Vercel 函式上限 300s。

**⚠️ 比「中斷」更陰的：timeout 會變「永久 stall」不是「重試」**（2026-06-01 MACS dir2 cross-review 踩到）：worker 跑 5 趟序列 bridge 修訂（每趟 60-90s）撞 300s → Vercel 砍函式 → Cloud Tasks 在 **10 分鐘 lock 窗內**重送 → `acquireWorkerLock` 看到 status=running 回 `already_running` → harness 回 **200** → Cloud Tasks 以為成功、**停止重試** → 案子永久卡死、repair=0、不會自己好。自癒要靠：① worker skip 已完成的單位（可續跑）② reconciler 偵測 stale-running（>lockTTL 未 done）重發 ③ 終極搬 Cloud Run（無時限，一次跑完）。

**ANEWS 的驗證做法**（`~/.ailive/anews-platform`）：
- `cloud-run/source-worker`（Dockerfile + src）跑 web_search，獨立部署 Cloud Run。
- Vercel route enqueue 時用 `enqueueTask(queue, path, payload, delay, overrideBaseUrl=SOURCE_WORKER_BASE_URL)` 把 task 的 HTTP 目標指向 `*.run.app`，不是 WORKER_BASE_URL（Vercel）。
- 註解源頭：`anews-platform/app/api/workers/orchestrate/route.ts:103`「Source worker runs on Cloud Run to escape Vercel 300s limit」。
- `lib/queues/cloudTasks.ts` 的 `overrideBaseUrl` 參數就是為此存在。

**雙重護欄**：建 Cloud Tasks 佇列時一律 `--max-attempts=3`（+ backoff）。單點失敗最多 3 次，封死重試風暴。止血指令（可逆）：`gcloud tasks queues pause <queue> --location=... --project=...`。

**踩雷紀錄（2026-05-31 MACS）**：抄 ANEWS 80% 基建時只抄程式碼沒抄**部署拓撲**，research 放 Vercel + 佇列無上限 → 第一個真案 research dispatchCount=9，燒 9 倍 key。

**觸發信號**：① 新 worker 要用 web_search / 預期單次輸出 >12K token / **會跑 N 次序列 LLM 呼叫** / 跑超過 ~60s（尤其 N×單次>300s）→ 停，放 Cloud Run 不放 Vercel。② 建 Cloud Tasks 佇列沒帶 --max-attempts → 補上。③「照抄成熟系統」先盤「哪些 worker 不在 Vercel、為什麼」。④ 看到案子卡某階段、worker_run 永遠 "running"、repair=0、不自癒 → 就是這個 300s+lock+200 stall，去現場查 worker_run 的 lockedAt/attemptCount。

**Cloud Run 跑 bridge（非 web_search）**：bridge 是 HTTP（`{BRIDGE_URL}/v1/messages` + Bearer），Cloud Run worker 可直接 fetch，不必用 SDK；需設 BRIDGE_URL/BRIDGE_SECRET env。常變設定（人設 roleFraming）**別 vendor 進 Cloud Run**（會跟 defaults.ts 漂移），走共用 DB settings/roles 即時讀。
