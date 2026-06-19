# 排工流程完整建構 SOP

> 來源：ailivex v13 task dispatch 實戰（2026-06-18/19），從零到第一張圖出廠。
> 適用：任何「AI 角色/對話觸發 → 非同步工廠產出 → 回報結果」的派工架構。

---

## 一、核心概念：兩條線，不要混

```
語音／對話線  ──→  角色說「會幫我安排」，結束，繼續對話
                          ↓
派工線（獨立）  ──→  task created → worker runs → done → 下次對話注入結果
```

**角色是大腦，工廠是工廠。** 派工後對話線立刻解耦，不等工廠完成。
工廠完成後，結果透過 webhook 寫回 Firestore，下次對話時注入 context。

---

## 二、完整鏈路圖

```
[後台] 設角色 capabilities
        ↓
[前端/token route] 版本選擇 → 對應 agent
        ↓
[agent] 工具註冊：有 capabilities → 掛 dispatch_task tool
        ↓
[使用者說話] → LLM 判斷 → 呼叫 dispatch_task(intent, mediaType)
        ↓
[agent/platform] 建 tasks doc（status: pending） + 呼叫 media-worker
        ↓
[media-worker] POST /v1/jobs → Cloud Tasks 排隊
        ↓
[Cloud Tasks] → POST /internal/run → 執行生成（OpenAI/Minimax）
        ↓
[media-worker] uploadMedia → GCS → job.completed + result.url
        ↓
[webhook] POST platform /api/tasks/callback（帶 x-webhook-secret）
        ↓
[platform] 驗 secret → tasks doc status: done + summary + imageUrl
        ↓
[下次對話] 注入「上次你請的圖已完成：{url}」
```

---

## 三、逐層建構 Checklist

### Layer 0：資料模型

- [ ] `CharacterDoc.capabilities: TaskCapability[]`（`image_generation | audio_generation | writing | web_search`）
- [ ] `tasks` collection schema：`taskId, characterId, userId, convId, status（pending/running/done/failed）, intent, mediaType, jobId, imageUrl, summary, notified`
- [ ] `mw_jobs` schema（media-worker 側）：`jobId, platform, status, mediaType, input, result{url,mimeType,sizeBytes}, webhookUrl, webhookSecret, error`

### Layer 1：後台 capabilities 管道（假中台必查）

- [ ] Admin API `GET /admin/characters/[id]` 回傳 `capabilities`
- [ ] Admin API `PATCH /admin/characters/[id]` 接收並寫入 `capabilities`（不能只讀不寫）
- [ ] Admin API `POST /admin/characters` 建角色時帶入 `capabilities`
- [ ] **驗法**：PATCH capabilities → 立刻 GET → 確認值真的變了（不要只信 UI 顯示）

### Layer 2：版本路由

- [ ] `token/route.ts` body type 加 `vN?: boolean`
- [ ] admin 分支：`body?.vN ? 'vN' : ...` 插到 ternary chain 最前
- [ ] `agentNameForVersion(voiceVersion)` 對應到正確 agent_name
- [ ] 前端 realtime-vN 頁面送 `{ characterId, vN: true }`
- [ ] **驗法**：打 token API 帶 vN flag → 看 roomName 建出來後 Cloud Run 哪個服務接到 dispatch

### Layer 3：agent 工具註冊

- [ ] 讀 Firestore character doc，取 `capabilities`
- [ ] `if capabilities: tools.append(dispatch_task_tool)` — 有能力才掛工具，不能無條件掛
- [ ] dispatch_task tool schema：`intent(string), mediaType(string), details(object)`
- [ ] tool handler：建 tasks doc + 呼叫 `_enqueue_media_task`
- [ ] `_enqueue_media_task`：POST media-worker `/v1/jobs`，帶：
  - `mediaType`
  - `idempotencyKey`（用 taskId 確保冪等）
  - `input`（prompt, size, voiceId 等依 mediaType）
  - `webhookUrl`：`{PLATFORM_URL}/api/tasks/callback`  ← **不能空**
  - `webhookSecret`：`{MEDIA_WORKER_WEBHOOK_SECRET}`  ← **不能空**

### Layer 4：media-worker

- [ ] `POST /v1/jobs`：建 mw_jobs doc，存 webhookUrl + webhookSecret
- [ ] Cloud Tasks 排隊 → `POST /internal/run`
- [ ] 生成邏輯（OpenAI / Minimax 等）
- [ ] `uploadMedia`：`file.save(bytes, { contentType })` → 公開網址
  - **UBLA bucket**：不呼叫 `file.makePublic()`，靠 bucket-level `allUsers:objectViewer`
  - **非 UBLA bucket**：`file.makePublic()` 才能公開
- [ ] 生成完成 → 呼叫 `webhookUrl`，header 帶 `x-webhook-secret: {webhookSecret}`
- [ ] **firebase-admin 初始化**：Cloud Run **不注入 SA JSON**，走 ADC（metadata server）→ 見天條

### Layer 5：webhook callback

- [ ] `POST /api/tasks/callback`
- [ ] 驗 `req.headers['x-webhook-secret'] === process.env.MEDIA_WORKER_WEBHOOK_SECRET`
- [ ] `job.completed` → 找 tasks doc（by jobId） → status: done, imageUrl, summary
- [ ] `job.failed` → status: failed, error
- [ ] **驗法**：curl 直打 callback endpoint，帶正確/錯誤 secret，確認 403 / 200

### Layer 6：結果注入對話

- [ ] 下次對話 `loadHistory` 或 system prompt 補上：`tasks where notified=false and status=done`
- [ ] 注入後標 `notified: true`（不能重複通知）
- [ ] **驗法**：task done 後發一條新訊息，確認角色提到產出結果

---

## 四、環境變數 Checklist（每個部署單元）

### agent（Cloud Run）
```
MEDIA_WORKER_URL=https://media-worker-xxx.a.run.app
MEDIA_WORKER_KEY_AILIVEX=<api_key>          # 來自 Secret Manager
MEDIA_WORKER_WEBHOOK_SECRET=<secret>         # 來自 Secret Manager
PLATFORM_URL=https://xxx.vercel.app
```

### media-worker（Cloud Run）
```
FIREBASE_STORAGE_BUCKET=<bucket>
GCP_PROJECT_ID=<project>
# 不要注入 FIREBASE_SERVICE_ACCOUNT_JSON → ADC 自動走 metadata server
OPENAI_API_KEY=<key>
MEDIA_WORKER_INTERNAL_URL=<self>
```

### platform（Vercel）
```
MEDIA_WORKER_URL=https://media-worker-xxx.a.run.app
MEDIA_WORKER_KEY_AILIVEX=<api_key>
MEDIA_WORKER_WEBHOOK_SECRET=<secret>
PLATFORM_URL=https://xxx.vercel.app
```

---

## 五、常見假中台斷點（每次必掃）

| 斷點位置 | 症狀 | 驗法 |
|---|---|---|
| Admin capabilities 寫不進去 | 角色 capabilities 永遠空，tool 不掛 | PATCH 後立刻 GET 比對 |
| webhookUrl 空字串 | job 完成但 platform 永遠不知道 | 查 mw_jobs doc 的 webhookUrl 欄位 |
| webhookSecret 不一致 | callback 永遠 403 | 比對 agent env 與 platform env 同一個 secret |
| token route 缺版本分支 | 語音進了舊版 agent，沒有 dispatch tool | 看 Cloud Run logs 哪個服務收到 dispatch |
| tasks notified 沒更新 | 每次對話都重複通知 | 查 tasks doc 的 notified 欄位 |

---

## 六、三個天條

1. **Cloud Run firebase-admin 走 ADC**：不注入 SA JSON，`cert(sa)` 在某些 project 打不通 `oauth2/v4/token`。
2. **webhook 契約兩邊對齊**：`webhookUrl` + `webhookSecret` 缺一不可，兩邊（派工端 + 接收端）同一個 secret。
3. **假中台必查**：每個能寫的欄位，後端實際有寫嗎？不要只信 UI 顯示。

---

## 七、端到端驗證腳本順序

```
1. Admin PATCH capabilities → GET 確認值
2. 打 /api/livekit/token 帶 vN flag → 看 agent_name
3. 語音通話說觸發語 → 看 agent logs「[task] created task=xxx」
4. 查 mw_jobs doc → status running → done
5. 查 tasks doc → status done, imageUrl 非空
6. curl imageUrl → HTTP 200（圖公開可讀）
7. 發一條新訊息 → 角色提到結果 + tasks.notified=true
```

---

*寫於 2026-06-19 · 來源：ailivex v13 task dispatch 首次出圖，7 個斷點的代價。*
