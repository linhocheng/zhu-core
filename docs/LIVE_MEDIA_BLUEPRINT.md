# Live Media 建置全景圖
**AI 角色媒體公司 — 從零到上線的完整檔案**

> 寫於 2026-05-01，第一個完整運作日結束後。
> 這份文件記錄「心靈顯化部」如何從概念變成每天自動產出文章、自動留言引流的活系統。

---

## 一、這是什麼

**Live Media** 是一家 AI 角色媒體公司。

不是一個 AI 工具，是一個**媒體組織**——有編制、有分工、有角色、有製播流程。
每個角色都有靈魂設定、記憶系統、職責邊界。
他們協作生產內容，發布到平台，再由特種部隊帳號到社群引流。

**首發部門：心靈顯化部**
定位：星座、能量學、顯化實踐
目標受眾：對靈性成長有興趣的台灣繁中用戶

---

## 二、整體架構

```
┌─────────────────────────────────────────────────────────────────┐
│                    社群層（引流）                                  │
│  Lucy（lucymo0306）等「特種部隊」帳號                             │
│  → 在 Threads 熱門貼文底下留有品質的留言                           │
│  → 引流回 Live Media 平台                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    內容平台（Cloud Run）                           │
│  Next.js 14 · TypeScript · Tailwind                             │
│  https://live-media-platform-epqhgokwva-de.a.run.app            │
│                                                                 │
│  公開頁面：                                                       │
│  /              首頁                                             │
│  /articles      文章列表（所有已發布）                             │
│  /articles/[id] 文章全文                                         │
│                                                                 │
│  API：                                                           │
│  /api/articles         GET 列表 / POST 新增                      │
│  /api/articles/[id]    GET 單篇 / PATCH 更新狀態                  │
│  /api/char-memory/[role] GET / POST 角色記憶                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP（lmHttp）
┌──────────────────────────▼──────────────────────────────────────┐
│                    製播引擎（Bridge VM）                           │
│  GCP zhu-dev · asia-east1-b · systemd: claude-bridge            │
│  ~/claude-bridge/index.js（1446 行）                             │
│                                                                 │
│  Live Media 相關 worker（~917 行起）：                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ 情報官    │  │ 停格者   │  │ 閾（總編）│  │  Publisher   │   │
│  │(intel)   │  │(writer)  │  │(editor)  │  │              │   │
│  │每天 02:00│  │跟intel   │  │每 5 分鐘 │  │每 5 分鐘     │   │
│  │ UTC      │  │ 同批跑   │  │ poll     │  │ poll         │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    資料層（Firestore）                             │
│  live_media_articles     文章（含狀態機）                          │
│  live_media_char_memory  角色工作記憶                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、檔案地圖

### 3.1 本機（MacBook Air M1）

```
/Users/adamlin/
└── .ailive/
    ├── live-media-platform/          ← Next.js 平台源碼
    │   ├── app/
    │   │   ├── layout.tsx            ← 全站 metadata（title: 心靈顯化部）
    │   │   ├── page.tsx              ← 首頁
    │   │   ├── articles/
    │   │   │   ├── page.tsx          ← 公開文章列表頁
    │   │   │   └── [id]/page.tsx     ← 文章全文頁
    │   │   └── api/
    │   │       ├── articles/
    │   │       │   ├── route.ts      ← GET 列表 / POST 新增
    │   │       │   └── [id]/route.ts ← GET / PATCH 單篇
    │   │       └── char-memory/
    │   │           └── [role]/route.ts ← 角色記憶 GET / POST
    │   ├── lib/
    │   │   └── firestore.ts          ← Firestore 初始化
    │   ├── cloudbuild.yaml           ← Cloud Build CI/CD
    │   └── Dockerfile                ← Cloud Run 容器定義
    │
    └── zhu-core/
        └── docs/
            ├── LIVE_MEDIA_BLUEPRINT.md      ← 這份文件
            ├── THREADS_COMMENT_PLAYBOOK.md  ← Threads 留言自動化教學
            └── lucy-threads/
                ├── comment.js               ← Playwright 留言腳本
                ├── lucy-scheduler.js        ← 排程器（隨機時間觸發）
                └── *.png                   ← 首次驗證截圖（7 張）
```

### 3.2 雲端 Bridge VM（zhu-dev）

```
/home/adam_dotmore_com_tw/
├── claude-bridge/
│   ├── index.js          ← 製播引擎主程式（1446 行）
│   │                       含所有 worker：
│   │                       - strategy-worker（既有）
│   │                       - image-worker（既有）
│   │                       - design-worker（既有）
│   │                       - superego-worker（既有）
│   │                       - char-superego-worker（既有）
│   │                       - live-media intel worker（~998 行）
│   │                       - live-media editor worker（~1285 行）
│   │                       - live-media publisher（~1380 行）
│   ├── firebase_sa.json   ← GCP service account（Firestore 寫入用）
│   └── bridge.log         ← 即時 log
│
└── lucy-agent/
    ├── comment.js          ← Playwright 留言腳本（與本機同步）
    ├── lucy-scheduler.js   ← 排程器（systemd 管理，持續運行）
    └── node_modules/       ← playwright 等依賴
```

### 3.3 GCP Cloud Run

```
服務名稱：live-media-platform
區域：asia-east1
Image Registry：asia-east1-docker.pkg.dev/$PROJECT_ID/live-media/platform
env vars：
  NODE_ENV=production
  BASE_URL=https://live-media-platform-epqhgokwva-de.a.run.app
memory：512Mi / cpu：1 / max-instances：3
service-account：live-media-run@$PROJECT_ID.iam.gserviceaccount.com
```

### 3.4 Firestore Collections

| Collection | 用途 | 關鍵欄位 |
|---|---|---|
| `live_media_articles` | 所有文章 | id, title, content, status, score, sourceUrl, characterId, publishedAt, retryCount |
| `live_media_char_memory` | 角色工作記憶 | role, positive_signals[], negative_signals[], last_updated |

---

## 四、文章狀態機

```
                  ┌─────────────────┐
                  │  pending_review  │ ← 停格者寫完後放這
                  └────────┬────────┘
                           │ 閾審稿（每 5 分鐘）
              ┌────────────┼────────────┐
              │            │            │
        score≥65      score 50-64   score<50
        APPROVE          REJECT        REJECT
              │            │            │
              ▼            ▼            ▼
         ┌─────────┐  ┌─────────┐  ┌─────────┐
         │ approved │  │rejected │  │  dead   │
         └────┬────┘  └────┬────┘  └─────────┘
              │            │ 停格者依手術筆記重寫
              │            │ → 回到 pending_review
              │            │ 最多重試 2 次，仍低 → escalated
              ▼            ▼
         ┌─────────┐  ┌──────────┐
         │published│  │escalated │ ← 人工處理
         └─────────┘  └──────────┘
```

---

## 五、製播流程逐步說明

### Step 1 — 情報官（SIGINT-01）找素材

**觸發**：每天 02:00 UTC（10:00 Taipei）  
**工具**：WebSearch + WebFetch  
**任務**：在 Threads 找 3 篇真實、可讀取、有共鳴潛力的貼文

**關鍵限制（2026-05-01 修正後）**：
- 禁止虛構——所有貼文必須 WebFetch 驗證能讀取
- 找不到就輸出 `{"posts": []}` 不捏造
- content_preview 必須是真實讀到的內容

**輸出格式**：
```json
{
  "posts": [
    {
      "url": "https://www.threads.com/@xxx/post/xxx",
      "author": "@xxx",
      "content_preview": "前200字真實內容...",
      "resonance_reason": "為什麼這篇有共鳴"
    }
  ]
}
```

---

### Step 2 — 去重

從 Firestore 讀出所有既有文章的 `sourceUrl`，過濾掉已經寫過的來源。

---

### Step 3 — 停格者（寫手）寫文章

**身份**：停格者，心靈顯化部核心寫手  
**每篇文章結構**：
1. 開場（從目標讀者的處境切入）
2. 核心論點（3-5 個觀點）
3. 收尾（能量提升、行動呼籲）

**字數**：800-1200 字  
**語氣**：溫柔而有力，帶有靈性觀點，不說教  
**輸出**：JSON `{ title, content, tags[], characterId: '停格者' }`

寫完後 POST 到 `/api/articles`，狀態設為 `pending_review`。

---

### Step 4 — 閾（總編）審稿

**身份**：閾（Yù），總編輯，有絕對否決權  
**評分維度**（100分）：
- 共鳴力（30）：讀者能對號入座嗎
- 獨特性（25）：超越常識，有新洞察嗎
- 完整性（25）：論點清楚，收尾有力嗎
- 品牌安全（20）：無爭議立場，不引戰

**判定**：
- score ≥ 65 → APPROVE → 進 approved
- score 50-64 → REJECT + 手術筆記 → 停格者重寫（最多 2 次）
- score < 50 → 核心問題無法修 → dead

**手術筆記格式**：
```json
{
  "surgical_notes": [
    {
      "location": "第二段",
      "issue": "論點跳躍，讀者跟不上",
      "instruction": "在『能量提升』前加一個橋接句，說明為什麼這個轉折成立"
    }
  ]
}
```

**工作記憶**：閾會記錄近期 APPROVE/REJECT 的理由，避免標準飄移。

---

### Step 5 — Publisher 發布

從 Firestore 取 `approved` 狀態文章 → PATCH 為 `published` + 寫入 `publishedAt`。  
文章立刻在 `/articles` 頁出現。

---

### Step 6 — Lucy 留言引流（新增）

**時間**：每天在設定時間窗口內隨機 2 次（目前設定 22:00-23:30 Taipei）  
**帳號**：lucymo0306（Lucy，特種部隊帳號）  
**方式**：Playwright 瀏覽器自動化  
**流程**：登入 Threads → 找目標貼文 → 觸發回覆框 → 打字留言 → 發佈  
**詳細教學**：`docs/THREADS_COMMENT_PLAYBOOK.md`

---

## 六、systemd 服務清單（Bridge VM）

```bash
# 查所有 Live Media 相關服務狀態
sudo systemctl status claude-bridge lucy-scheduler

# claude-bridge：製播引擎（intel + editor + publisher）
sudo journalctl -u claude-bridge -f

# lucy-scheduler：留言排程器
sudo journalctl -u lucy-scheduler -f
```

| 服務 | 管理 | 說明 |
|---|---|---|
| `claude-bridge` | systemd | 製播引擎主程式，包含所有 worker |
| `lucy-scheduler` | systemd | Lucy 留言排程器，開機自啟 |

---

## 七、CI/CD 部署流程

### 觸發部署

```bash
cd /Users/adamlin/.ailive/live-media-platform
gcloud builds submit --config cloudbuild.yaml --project=zhu-cloud-2026
```

### cloudbuild.yaml 做什麼

1. Docker build（tag: `$BUILD_ID` + `latest`）
2. Docker push 到 Artifact Registry
3. `gcloud run deploy` 更新 Cloud Run 服務

**注意**：用 `$BUILD_ID` 不用 `$SHORT_SHA`（gcloud submit 不支援 $SHORT_SHA）

### 手動更新 env var（不需重新 build）

```bash
gcloud run services update live-media-platform \
  --region=asia-east1 \
  --update-env-vars="BASE_URL=https://live-media-platform-epqhgokwva-de.a.run.app"
```

---

## 八、常用維運指令

### 看文章狀態

```bash
# SSH 進 VM，用 firebase admin 查 Firestore
gcloud compute ssh adam_dotmore_com_tw@zhu-dev \
  --zone=asia-east1-b --project=zhu-cloud-2026
```

### 直接看平台

| 頁面 | URL |
|---|---|
| 文章列表 | https://live-media-platform-epqhgokwva-de.a.run.app/articles |
| 首頁 | https://live-media-platform-epqhgokwva-de.a.run.app |

### 強制觸發 intel（不等明天）

在 Bridge VM `index.js` 的 `setInterval` 之前加一行 `runLiveMediaIntelWorker()` 後 restart claude-bridge。

### 查 Lucy 今天排程

```bash
gcloud compute ssh adam_dotmore_com_tw@zhu-dev \
  --zone=asia-east1-b --project=zhu-cloud-2026 \
  --command="journalctl -u lucy-scheduler --no-pager -n 20"
```

---

## 九、成立時序（2026-05-01 建置過程）

| 時間 | 里程碑 |
|---|---|
| 上午 | v2.0 閾（editor）+ 六開關設計完成 |
| 上午 | lmHttp hostname bug 修正（silent failure 根因消除）|
| 上午 | TEST MODE 啟動（30 分鐘一篇）|
| 下午 | 情報官禁虛造修正（移除可以捏造貼文的指令）|
| 下午 | BASE_URL 修正（Cloud Run env + cloudbuild.yaml）|
| 下午 | 文章列表頁 `/articles` 上線（14 篇顯示）|
| 晚間 | Lucy 留言自動化首次 end-to-end 驗證成功 |
| 深夜 | lucy-scheduler 部署上 Bridge VM（systemd 管理）|
| 深夜 | 本文件完成 |

---

## 十、已知限制與未解問題

| 問題 | 狀態 | 建議 |
|---|---|---|
| Lucy session 每次重新登入 | 待解 | 實作 storageState 持久化 |
| 目標貼文 URL 寫死在 comment.js | 待解 | intel worker → Firestore lucy_tasks → Lucy 自動取任務 |
| 留言內容固定 | 待解 | LLM 即時生成，根據目標貼文內容客製化 |
| 角色工作記憶寫回未驗證 | 待觀察 | approve 後確認 live_media_char_memory 有 positive_signal |
| Escalated 文章「復甦的代價」錯字 | 待人工 | 停格者沒有收到明確錯字指示，需人工核准或重送 |
| 多帳號輪換 | Phase 6 | 單帳號留言頻率上限約 5-10 次/天 |

---

## 十一、下一步路線圖

```
Phase 1  ✅  平台上線（Next.js + Firestore + Cloud Run）
Phase 2  ✅  自動製播流水線（intel + writer + editor + publisher）
Phase 3  ✅  品質把關（閾 v2.0 + 六開關 + 手術筆記）
Phase 4  ✅  社群引流首驗（Lucy Playwright + 留言成功）
Phase 5  ✅  自動排程（lucy-scheduler + systemd）
───────────────────────────────────────────────────
Phase 6  ⬜  Lucy session 持久化（storageState）
Phase 7  ⬜  intel → Firestore 任務池 → Lucy 自動選目標
Phase 8  ⬜  留言內容 LLM 即時生成（根據目標貼文客製化）
Phase 9  ⬜  多帳號輪換（Lucy + 其他角色帳號池）
Phase 10 ⬜  16 個角色全部啟動（目前只有心靈顯化部）
Phase 11 ⬜  數據回收（留言互動率 → 調整內容策略）
```

---

## 附錄 A：關鍵帳號與憑證存放

| 資源 | 位置 |
|---|---|
| GCP project | `zhu-cloud-2026` |
| Bridge VM SSH | `gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026` |
| Firestore SA | `~/claude-bridge/firebase_sa.json`（VM 上）|
| Lucy IG 帳號 | `lucymo0306@gmail.com`（不存此文件，僅記錄帳號名）|
| Threads 目標 | 見 `~/lucy-agent/comment.js` 的 `TARGET_POST` |

---

## 附錄 B：快速除錯 SOP

### B1. 文章沒有自動產出

```
1. 確認 claude-bridge 跑著：sudo systemctl status claude-bridge
2. 看 intel log：journalctl -u claude-bridge | grep live-media | tail -30
3. 確認今天 02:00 UTC 有觸發（grep 'intel worker start'）
4. 如果有「no posts found」→ intel 沒找到可讀的貼文（正常，隔天再試）
5. 如果有「fetch existing articles error」→ lmHttp hostname 問題，確認 BASE_URL 正確
```

### B2. 文章卡在 pending_review

```
1. 確認 editor 有跑：journalctl -u claude-bridge | grep lm-editor | tail -20
2. 看 score 和 verdict
3. 如果 score 50-64，文章在走重寫流程（正常，等停格者重寫）
4. 如果 retryCount ≥ 2，文章應進 escalated（人工處理）
```

### B3. Lucy 沒有在預定時間留言

```
1. 確認 lucy-scheduler 跑著：sudo systemctl status lucy-scheduler
2. 看今日排程：journalctl -u lucy-scheduler --no-pager -n 20
3. 確認 comment.js 可以執行：cd ~/lucy-agent && node comment.js
4. 常見問題：IG 帳號密碼錯 / Threads DOM 結構異動 / 需要 2FA 驗證
```

### B4. 部署失敗

```
1. 確認用 $BUILD_ID 不是 $SHORT_SHA（gcloud submit 不支援後者）
2. 確認 service account 有 Cloud Run Admin + Storage Object Admin 權限
3. 看 Cloud Build log：gcloud builds list --limit=5
```

---

*2026-05-01 深夜 · 築 × Adam*
*從一個想法，到今天第一個完整跑了一天的 AI 媒體系統。*
