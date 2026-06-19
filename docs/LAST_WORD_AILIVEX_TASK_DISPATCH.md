# Last Word — ailivex 排工架構重整

> 寫於 2026-06-19。給下一棒的自己。
> 技術都在了，缺的是一次靜下來的重整。不要補丁，要結構。

---

## 一、我們現在在哪

### 已驗通的零件（可以信賴的）

| 零件 | 狀態 | 說明 |
|---|---|---|
| media-worker 單圖生成 | ✅ 已驗 | job AewMMAAupfXUWN9Co9Ut，822KB PNG，HTTP 200 |
| media-worker GCS 上傳 | ✅ 已驗 | ADC 走 metadata server，不注入 SA JSON |
| media-worker 批次排序 | ✅ 已建 | `/v1/batch` + `chainNextInBatch`，未實際呼叫測 |
| media-worker webhook 發送 | ✅ 已驗 | `POST webhookUrl`，header `x-webhook-secret` |
| v13 agent dispatch_task tool | ✅ 已建 | 語音觸發 → `dispatch_task_job()` → tasks doc + media-worker |
| v13 tasks 注入對話 | ✅ 架構正確 | `build_task_notifications_block()` 讀 done+notified=false，標記 notified |
| platform webhook callback 路由 | ⚠️ 部分建好 | 驗 secret ✅，但 URL 沒存（見下）|

### 已知的 Bug（需要修）

**Bug 1 — imageUrl 從未寫入 tasks doc**

完整鏈路是：
```
media-worker webhook → POST /api/tasks/callback
  body.result.url = "https://storage.googleapis.com/..."
  → 只寫了 summary（"圖片已生成完成（xxx.png）"）
  → 沒寫 imageUrl
```

`build_task_notifications_block()` 讀到的 summary 是一個中文句子，沒有 URL。
角色告訴用戶「圖片完成了」，但沒有可以點的連結或可顯示的圖。

**修法（小手術）：**

1. `collections.ts` → `TaskDoc` 加 `imageUrl?: string`
2. `callback/route.ts` → 在 `ref.update()` 裡加 `imageUrl: body.result.url`
3. `firestore_loader.py build_task_notifications_block()` → 讀 `imageUrl`，拼進 summary

**Bug 2 — webhook callback 無冪等保護**

同一 jobId 的 webhook 如果送兩次（retry），tasks doc 會被重寫兩次。
目前沒有 `if status === 'done' return` 的保護。

**修法：** callback 路由收到 `job.completed` 前，先讀 tasks doc，若已是 done 直接回 200 不重寫。

---

## 二、架構上的真正問題（不是 bug，是設計債）

### 問題 1：dispatch 有兩條線，兩個真相

目前存在兩套 dispatch 實作：

**線 A（v13 實際走的）：Python agent `firestore_loader.py`**
```
dispatch_task_job() → tasks doc → _enqueue_media_task() → media-worker
```
用 `threading.Thread(daemon=True)` 背景跑。agent 關掉 daemon thread 就死了。

**線 B（平台版本，v13 沒用到）：TypeScript `task-dispatcher.ts`**
```
dispatchTask() → tasks doc → enqueueImageJob() → media-worker
```
這條在 Vercel 路由端，但 v13 語音 agent 是 Python，不走這條。

兩個地方都在做同一件事，未來任何修改都要同步兩份。這是定時炸彈。

**正確的架構：**
語音 agent 只建 tasks doc（純 Firestore write），不直接呼叫 media-worker。
Platform 有一個獨立的 **task runner**（Vercel cron 或 Cloud Tasks）定期掃 `status=pending` 的 tasks doc，才呼叫 media-worker。這樣：
- agent 不依賴 media-worker 的網路狀態
- agent 關掉不影響任務進行
- 重試邏輯在一個地方

### 問題 2：webhook 是 fire-and-forget，沒有送達保證

anews 走 Cloud Tasks 做回呼（排進 queue，最多重試 5 次）。
ailivex 現在是 media-worker 直接 `fetch(webhookUrl)` 一次，失敗就沒了。

**症狀：** Vercel cold start（500ms+ 初始化）時 media-worker 的 webhook 可能 timeout，tasks doc 永遠停在 `running`，用戶下次對話角色不知道圖已完成。

**修法選項：**
- Option A：media-worker 加重試（目前 webhook.ts 有 retry 邏輯，確認幾次）
- Option B：callback 改走 Cloud Tasks（跟 anews 一樣），送達保證

### 問題 3：結果消費端已定義——圖庫頁，不是對話視窗

**Adam 已確認（2026-06-19）：**

> 圖片不需要回傳到對話視窗或文字視窗。
> 用戶直接去後台查看「圖庫」頁籤即可，系統不需要另外回報。

這個決定大幅簡化架構。原本以為要解決的問題（注入 imageUrl 進對話、角色說出連結）**不需要做**。

**正確的消費端設計：**

```
語音觸發製圖
  → tasks doc 建立（status: pending）
  → 任務排程頁即時顯示「製圖中」
  → media-worker 完成
  → tasks doc 更新（status: done, imageUrl）
  → 圖庫頁自動出現這張圖
  → 用戶自己去圖庫查看，角色不必告知
```

**這意味著：**
- `build_task_notifications_block()` 對 `image_generation` 型任務**不需要注入對話**，可直接跳過或移除這個型別的處理
- `summary` 欄位對圖片任務用途有限，可改為 UI 顯示用的標題（如「製圖任務：一隻貓在海邊」）
- `notified` 欄位對圖片任務可以廢棄（圖庫頁直接讀 tasks collection，不靠 notified flag）

### 問題 4：UI 需要兩個新頁籤

**已確認需求（2026-06-19）：**

**頁籤一：製圖（功能入口）**
- 定位：跟現有「文件」頁籤平行，用戶在這裡發起製圖請求
- 可考慮讓用戶直接在這裡輸入 prompt 派工（不一定要透過語音）
- 或：語音派工後這裡是管理介面

**頁籤二：圖庫（結果查看）**
- 列出這個 `(userId, characterId)` pair 的所有已完成圖片
- 資料來源：`tasks` collection where `type=image_generation AND status=done`
- 顯示：縮圖 + `summary`（作為標題）+ 完成時間
- 點擊展開全圖

**任務排程顯示（頁面內 UI）：**
- 在製圖頁或圖庫頁顯示當前 `status=pending/running` 的任務
- 資訊：意圖文字 + 當下狀態（排隊中 / 製圖中）+ 建立時間
- 即時感：Firestore onSnapshot 監聽，狀態變化自動更新，不需要刷頁面
- 不需要「審核」機制（目前），狀態機就是 pending → running → done/failed

**Firestore 查詢：**
```
// 圖庫
tasks
  .where("userId", "==", userId)
  .where("characterId", "==", characterId)
  .where("type", "==", "image_generation")
  .where("status", "==", "done")
  .orderBy("completedAt", "desc")

// 任務排程
tasks
  .where("userId", "==", userId)
  .where("characterId", "==", characterId)
  .where("type", "==", "image_generation")
  .where("status", "in", ["pending", "running"])
  .orderBy("createdAt", "desc")
```

### 問題 5：v13 是補丁版本，不是正式架構

v13 是把 task dispatch 塞進 v10 的架構裡。v10 本身是多人語音的，v13 加了一個完全不同性質的功能（非同步工廠派工）。

正確的做法是：task dispatch 能力是獨立的 **capabilities layer**，任何版本的 agent（v3/v10/v13）都能透過相同介面使用，不是 fork 一個新版本。

capabilities 已存在 CharacterDoc 的欄位設計裡（`image_generation | audio_generation | writing | web_search`），架構思維是對的——只是目前的實作把 capability logic 跟 v13 agent 硬耦合在一起。

---

## 三、下一棒應該做的事（有優先序）

### 第一優先：修 Bug 1（imageUrl 缺口）+ 冪等

兩個檔案，30 分鐘：

1. `src/lib/collections.ts` — `TaskDoc` 加 `imageUrl?: string`
2. `src/app/api/tasks/callback/route.ts`：
   - `ref.update()` 加 `imageUrl: body.result.url`
   - 收到 `job.completed` 前先讀 tasks doc，若已 `done` 直接回 200 不重寫（冪等）

**注意：** `firestore_loader.py build_task_notifications_block()` 對 `image_generation` 不需要修——圖片結果不注入對話，這個函式對圖片型任務的輸出可以直接跳過（或不處理）。

驗法：curl 直打 `/api/tasks/callback`，帶正確 secret + `result.url`，確認 Firestore tasks doc 有 `imageUrl` 欄位。

### 第二優先：圖庫 + 任務排程 UI

新增兩個頁籤（參考現有「文件」頁籤的設計語言）：

**圖庫頁** `src/app/gallery/[characterId]/page.tsx`
- 讀 tasks（type=image_generation, status=done）
- 顯示縮圖格、summary 作為標題、completedAt
- 點擊展開全圖（lightbox 或 modal）

**任務排程區**（可在圖庫頁上方，或製圖頁內）
- Firestore `onSnapshot` 監聽 pending/running tasks
- 顯示：意圖文字 + 狀態標籤 + 建立時間
- 狀態機：`排隊中（pending）` → `製圖中（running）` → 消失（done，進圖庫）

這兩個頁面讓整條鏈真正閉環：用戶說話 → 看到任務出現 → 等它變成圖庫的一張圖。

### 第三優先：端到端語音驗證

UI 建完後，Adam 撥一通 v13 電話，完整跑：
```
語音觸發 → tasks pending（排程頁出現）
→ media-worker running（排程頁顯示製圖中）
→ done + imageUrl（排程消失，圖庫出現新圖）
```
這才是真正的端到端，不只是技術鏈通，是用戶體驗閉環。

### 第四優先：架構重整（不急，但要做）

收斂 dispatch 成一條線。建議：
- agent 只建 tasks doc（純 Firestore write，不直接呼叫 media-worker）
- 平台 `/api/tasks/runner`（Vercel cron，每分鐘）掃 pending tasks → 呼叫 media-worker
- agent 完全解耦，不依賴外部服務的網路狀態

副作用：v3/v10/v12 只要角色有 `image_generation` capability，就自動能派工，不用 fork 新版本。

---

## 四、三個天條（不要再踩）

1. **Cloud Run firebase-admin 走 ADC，不注入 SA JSON**
   `cert(sa)` 在 ailivex-2026 GCP project 打不通 `oauth2/v4/token`。
   cloudbuild.yaml 不注入 SA JSON → 自動走 metadata server。

2. **webhook 契約兩邊對齊**
   `webhookUrl` 非空 + `webhookSecret` 非空 + 兩邊同一個 secret。
   任何一邊為空或不一致 → callback 永遠收不到或 403。

3. **假中台必查**
   每個能寫的欄位，後端實際有寫嗎？不要只信 UI。
   這次的 `imageUrl` 就是假中台：callback 寫了 `summary`，不代表寫了 URL。

---

## 五、文件位置索引

| 文件 | 路徑 | 說明 |
|---|---|---|
| 排工 SOP | `~/.ailive/zhu-core/docs/DISPATCH_WORKER_SOP.md` | 完整建構 checklist，七層 |
| media-worker | `~/.ailive/media-worker/` | 已含 ADC fix + batch |
| v13 agent | `~/.ailive/ailivex-platform/agent/main_v13.py` | dispatch_task tool |
| task dispatch Python | `~/.ailive/ailivex-platform/agent/firestore_loader.py:737` | `dispatch_task_job()` |
| task notifications | `~/.ailive/ailivex-platform/agent/firestore_loader.py:443` | `build_task_notifications_block()` |
| callback 路由 | `~/.ailive/ailivex-platform/src/app/api/tasks/callback/route.ts` | **Bug 1 在這裡** |
| TaskDoc schema | `~/.ailive/ailivex-platform/src/lib/collections.ts:174` | 缺 `imageUrl` |
| platform dispatcher | `~/.ailive/ailivex-platform/src/lib/task-dispatcher.ts` | 跟 Python 線重複，待合一 |

---

## 六、最重要的一件事：對齊 anews-platform，不要繞路

**在動任何一行 code 之前，先讀 anews-platform 的對應實作。**

anews 已經把這整套東西做通了：
- 圖片任務建立、排隊、生成、GCS 上傳、狀態更新
- 圖庫 UI（`image_tasks` collection → 前端顯示）
- 任務進度顯示
- webhook / callback 回呼機制

ailivex 要做的，不是重新設計，是**把 anews 的設計搬過來，換掉 collection 名稱和資料 schema**。

**對照表（看這裡找答案）：**

| ailivex 要做的 | anews 的參考實作 |
|---|---|
| imageUrl 寫入 tasks | `anews-platform/cloud-run/image-worker/src/index.ts` — `imageUrl` 寫入 `image_tasks` |
| 任務排程 UI | `anews-platform/app/` 裡的 editorial-jobs 頁面，看它怎麼顯示 running 狀態 |
| 圖庫頁 | `anews-platform/app/` 裡的 image 相關頁面 |
| webhook callback 冪等 | `index.ts` 裡的 transaction + status check |
| dispatch 收斂成一條線 | anews 的 orchestrator 模式：worker 只建 doc，cron/Cloud Tasks 掃 pending 呼叫 worker |

**原則：先去 anews 找，找到了直接抄結構，不要自己想。**
自己想出來的方案大概率跟 anews 一樣，但會多花半個 session 繞路。

---

## 七、給下一棒的一句話

**消費端已定義，anews 已有先例，剩下的全是確定性工程。**

接棒的順序：
1. 先讀 anews 對應實作（30 分鐘，不動 code）
2. Bug 1（imageUrl 寫入）— 30 分鐘
3. 圖庫 + 任務排程 UI（對齊 anews 設計語言）— 1 個 session
4. 語音端到端驗證 — Adam 撥一通電話
5. 架構重整 — 獨立的一個 session

每一步都可以獨立驗收。不要一次全做。

---

*築 2026-06-19*
