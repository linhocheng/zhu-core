---
name: strategy-commission-flow
description: ailive-platform 角色委託奧/佐格撰寫長文的完整流程地圖（觸發→Cloud Run→docx/html→Dashboard），含佐格路由改造計畫
activation:
  patterns:
    - "角色發策略"
    - "奧撰寫"
    - "佐格撰寫"
    - "commission_specialist"
    - "strategy worker"
    - "策略書流程"
    - "哲學委託"
  keywords: ["奧", "佐格", "策略書", "commission", "strategy-worker", "philosopher"]
---

# 策略委託流程（ailive-platform）

查詢日期：2026-05-19
source of truth：`~/.ailive/ailive-platform/src/app/api/`

## 已知角色 ID（2026-05-19 確認）

| 角色 | ID | jobType |
|------|----|---------|
| 奧 | `pEWC5m2MOddyGe9uw0u0` | strategy |
| 佐格 Zorg | `aZxrUgUI5bPkwv24SHBe` | philosophy（待實作） |
| 索 | `dQHkL6vvhmKlNho8dA1L` | research |
| 瞬 | `shun-001` | image |

---

## 全鏈路概覽

```
角色對話 → commission_specialist 工具
  ↓
platform_jobs (pending) + Cloud Tasks enqueue
  ↓ ~90-180s
strategy-worker (Cloud Run)
  ├─ 階段1：caller soul 濃縮 brief（可選）
  └─ 階段2：奧寫 ~5000字 markdown → parse → docx → Storage
  ↓
platform_jobs (done) + mdContent + docUrl
+ specialist_delivered system_event 推進對話
  ↓ fire-and-forget
strategy-html-worker (Cloud Run)
  ├─ 自動選 philosophy（eastern-blank/swiss-grid/dark-premium）
  ├─ Sonnet 生成 HTML（max 16000 tokens）
  └─ 七題 QA 自查
  ↓
platform_jobs (htmlUrl) + strategy_html_delivered system_event
  ↓
Dashboard /dashboard/[id]/strategies 顯示按鈕
```

---

## 關鍵檔案路徑

| 步驟 | 檔案 | 重點行 |
|------|------|--------|
| 工具定義 | `src/app/api/dialogue/route.ts` | 160-204（schema）、528-603（執行邏輯） |
| 建 Job + Enqueue | `src/app/api/dialogue/route.ts` | 554-596 |
| Cloud Tasks | `src/lib/cloud-tasks.ts` | 131-135（enqueueStrategy） |
| 奧寫作 Worker | `src/app/api/specialist/strategy/route.ts` | 269-389 |
| HTML Worker | `src/app/api/specialist/strategy-html/route.ts` | 44-142 |
| Dashboard API | `src/app/api/strategies/route.ts` | 24-63 |
| Dashboard UI | `src/app/dashboard/[id]/strategies/page.tsx` | 43-187 |

---

## commission_specialist 工具參數

```typescript
commission_specialist {
  specialist: 'strategist'   // 固定
  brief: string              // 給奧的需求，越具體越好
}
// 角色紀律：決定派就直接呼叫，不預告，不重複整理
```

奧的角色 ID：`pEWC5m2MOddyGe9uw0u0`（platform_characters）

---

## platform_jobs Firestore 欄位

```
requesterId       發起角色 ID
requesterConvId   對話 ID
requesterUserId   使用者 ID
assigneeId        'pEWC5m2MOddyGe9uw0u0'（奧）
jobType           'strategy'
brief             { prompt: string }
status            pending → done → failed
routedTo          'cloud-run'
createdAt         ISO8601
completedAt       ISO8601
result            { docUrl, docTitle, filename, mdChars, stopReason }
output            { type: 'document', docUrl, title }
mdContent         markdown 原始內容（給 strategy-html 讀）
htmlUrl           HTML 設計版 URL
htmlPhilosophy    'eastern-blank' | 'swiss-grid' | 'dark-premium'
htmlGeneratedAt   ISO8601
error / htmlError 失敗訊息
```

---

## system_event 格式（推進對話）

```typescript
// 奧完成 docx 時
{ role: 'system_event', eventType: 'specialist_delivered',
  specialistId: 'pEWC5m2MOddyGe9uw0u0', specialistName: '奧',
  jobId, output: { type: 'document', docUrl, title } }

// HTML 設計版完成時
{ role: 'system_event', eventType: 'strategy_html_delivered',
  jobId, output: { type: 'html', htmlUrl, title, philosophy } }
```

---

## 奧的 Soul 讀取順序

```typescript
const assigneeSoul = `${system_soul}\n\n${soul_core}`.trim();
// enhancedSoul 不用於 strategy 寫作
```

---

## Markdown 撰寫格式規定（strategy route STRUCTURE_GUIDE）

- 第一行必須是 `# 標題`
- 章節：`## 章節`（建議 6-10 個）
- 小節：`### 小節`
- 段落：純文字，每段 2-5 句
- 列點：`- ` 或 `1. `
- **禁止**：粗體、斜體、表格、程式碼塊、emoji
- 第一個字就是 `#`，不要包在 code block 裡

---

## DOCX 樣式

- 字型：微軟正黑體
- Title：40pt bold 居中
- Heading 1：30pt bold
- Heading 2：26pt bold
- ≥3 個 h2 → 自動加目錄

---

## 時間 & 成本

- 整體 docx 完成：90-180 秒
- strategy-html 完成：再加 ~150 秒
- Token 成本：~9000-14000 tokens ≈ $0.05-0.08 USD（docx）
- HTML 另加 ~10000 tokens ≈ $0.06 USD

---

## Firebase Storage 路徑

```
docx: platform-specialist-docs/{assigneeId}/{jobId}-{filename}.docx
html: platform-strategy-html/{assigneeId}/{jobId}-{filename}.html
兩者均 makePublic()
```

---

## Dashboard 輪詢邏輯

- 條件：status='done' 且無 htmlUrl
- 間隔：每 5 秒
- 上限：60 秒後停止

---

## 必要環境變數

```
ANTHROPIC_API_KEY         Claude API
WORKER_SECRET             strategy/html route 驗證
STRATEGY_ENQUEUER_KEY_JSON  Google SA key（Cloud Tasks enqueue）
FIREBASE_*                Firestore + Storage
```

---

## 踩過的雷

- `mdContent` 只在 status='done' 後才有，strategy-html-worker 如果太早觸發會讀到 undefined
- HTML enqueue 失敗不影響 docx status，docx 完成即算 done
- `commission_specialist` 呼叫紀律：決定了就直接呼叫，不要先說「我要呼叫」再呼叫
- brief 濃縮（階段 1）是可選：無 callerSoul 時直接跳到奧寫作

---

## 佐格路由改造計畫（2026-05-19 · 待實作）

### 設計原則
哲學/思辨/思考/辯證類 → 佐格（`aZxrUgUI5bPkwv24SHBe`）
廣告/行銷/策略/品牌/創意/商業 → 奧（`pEWC5m2MOddyGe9uw0u0`）

### 需改的 3 個觸點

**觸點 1：`dialogue/route.ts`**

1a. 工具 description（line 165-166）加佐格說明：
```
philosopher（佐格）：哲學探索／思辨論述／人生提問／觀念深挖，輸出散文式長文（非策略書格式），可下載 docx
```

1b. enum（line 179）加 `philosopher`：
```typescript
enum: ['painter', 'strategist', 'philosopher']
```

1c. SPECIALIST_MAP（line 529）加佐格：
```typescript
philosopher: { id: 'aZxrUgUI5bPkwv24SHBe', jobType: 'philosophy', name: '佐格', etaText: '3-5 分鐘' }
```

1d. enqueue 分支（line 570）加：
```typescript
if (sp.jobType === 'philosophy') await enqueuePhilosophy(jobRef.id);
```

**觸點 2：新建 `src/app/api/specialist/philosophy/route.ts`**

仿 strategy/route.ts 結構，差異：
- `PHILOSOPHY_GUIDE` 替換 `STRUCTURE_GUIDE`（散文式、不限章節數、允許引文迴轉）
- `max_tokens: 8000`（不硬湊 5000 字）
- docx 樣式可加大行距（書本感）

**觸點 3：`src/lib/cloud-tasks.ts`**

加 `enqueuePhilosophy(jobId)`，對應新 queue `philosophy-tasks`

### 環境操作（GCP + Vercel）
- GCP Console 建 Cloud Tasks queue：`philosophy-tasks`
- Vercel env 加：`PHILOSOPHY_WORKER_URL` / `PHILOSOPHY_WORKER_AUDIENCE`

### 最小可行路徑（Phase 1，30 分鐘）
先只改觸點 1，`jobType` 暫用 `'strategy'`（共用奧的 worker）。
佐格靈魂不同 → 寫出來調性就不同，但格式還是策略書。
確認可行後再做 Phase 2（新路由 + 新格式）。
