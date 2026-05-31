---
name: web_search worker 放 Cloud Run 不放 Vercel + 佇列必設 maxAttempts
description: web_search/長生成 worker 在 Vercel 會 timeout，Cloud Tasks 無上限重試會燒 key×N；ANEWS 鐵律放 Cloud Run，Vercel 用 overrideBaseUrl 指過去
type: reference
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**鐵律**：用 `web_search`（或任何長生成）的 worker **必須跑在 Cloud Run，不能放 Vercel route**。Vercel 函式 timeout（預設低、上限 300s）會讓 web_search 中斷，Cloud Tasks 預設**無上限重試**，每次重試都重燒 web_search API key。

**ANEWS 的驗證做法**（`~/.ailive/anews-platform`）：
- `cloud-run/source-worker`（Dockerfile + src）跑 web_search，獨立部署 Cloud Run。
- Vercel route enqueue 時用 `enqueueTask(queue, path, payload, delay, overrideBaseUrl=SOURCE_WORKER_BASE_URL)` 把 task 的 HTTP 目標指向 `*.run.app`，不是 WORKER_BASE_URL（Vercel）。
- 註解源頭：`anews-platform/app/api/workers/orchestrate/route.ts:103`「Source worker runs on Cloud Run to escape Vercel 300s limit」。
- `lib/queues/cloudTasks.ts` 的 `overrideBaseUrl` 參數就是為此存在。

**雙重護欄**：建 Cloud Tasks 佇列時一律 `--max-attempts=3`（+ backoff）。單點失敗最多 3 次，封死重試風暴。止血指令（可逆）：`gcloud tasks queues pause <queue> --location=... --project=...`。

**踩雷紀錄（2026-05-31 MACS）**：抄 ANEWS 80% 基建時只抄程式碼沒抄**部署拓撲**，research 放 Vercel + 佇列無上限 → 第一個真案 research dispatchCount=9，燒 9 倍 key。

**觸發信號**：① 新 worker 要用 web_search / 預期單次 LLM 輸出 >12K token / 跑超過 ~60s → 停，放 Cloud Run 不放 Vercel。② 建 Cloud Tasks 佇列沒帶 --max-attempts → 補上。③「照抄成熟系統」時先盤「哪些 worker 不在 Vercel、為什麼」，那些例外是前人踩坑換的。
