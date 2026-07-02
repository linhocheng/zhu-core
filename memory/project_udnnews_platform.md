---
name: project-udnnews-platform
description: 議題工作台平台建置進度（UDN NEWS platform/）— 對話驅動內容生產
metadata: 
  node_type: memory
  type: project
  originSessionId: e81b7a86-599c-4706-a5e2-a4185074754d
---

議題工作台平台，位於 `~/Documents/UDN NEWS/platform/`，Next.js 16 App Router + Cloud Run + Firestore。

**Why:** 整合 UDN NEWS（資料收集 DNA）+ ailivex（對話引擎 DNA），建立以議題為單位的內容生產工作台。同一份資料 × 不同角色 = 不同產出。

**How to apply:** 繼續開發前先確認目前 round 進度，不要重跑已完成的部分。

## 設計核心

- 專案 = 議題容器（不是 pipeline run）
- Brief 有版本（v1, v2...），來源改了就長新版本，舊對話保留
- 角色是「內容透鏡」，換角色換產出視角
- 全程揭露工作流步驟

## 技術棧

- Framework: Next.js 16 App Router（standalone 輸出，部署 Cloud Run）
- DB: Firestore（GCP project: udnnews，ADC on Cloud Run，天條）
- 抓取: Cheerio（URL）+ Tavily `@tavily/core`（keyword/domain）
- LLM: Claude via Bridge（bridge-direct.soul-polaroid.work）
- 部署: cloudbuild.yaml → asia-east1，SA: udnnews-platform@udnnews.iam.gserviceaccount.com

## 已完成功能（截至 2026-06-28）

- 6 個主頁面全通（/projects, /projects/new, /projects/[id], /brief, /chat, /assets）
- Firestore 全鏈路：Project / BriefVersion / Character / Conversation(sub-collection messages) / WorkflowTask
- GenerateBriefButton：3 步進度列（scrape → generate → save）
- Chat：角色選擇、對話歷史、URL persistence（?convId=）
- Assets：summary_card + audio_script 兩種素材生成（dispatch 同步執行）
- ProjectActions：暫停/恢復（prePauseStatus 正確還原狀態）/ 刪除
- 角色獨立後台：/characters + /characters/new + /characters/[id]/edit
- 設計系統 v1：白底、單色、editorial label、border-neutral-100

## 第一次端對端測試（2026-06-28）

**測試角色：林子宜**（財經分析師，半導體供應鏈專家）
- characterId: `YMDnV9PqtZq1SC6tQcLK`

**測試議題：CoWoS 先進封裝競賽**
- projectId: `IR7EUnH3dU6zFRUQAGop`
- Brief: 1186 字，Tavily 8 篇真實資料，產能數字具體
- 對話 2 輪，回覆 1020 + 1274 字，品質高（有數字、有立場）
- summary_card: 1819 字（done），audio_script: 779 字（done）

**試劍客判決：內容品質通過，交付體驗不合格。**

## 已確認待修 UX 缺口（P1/P2 優先）

| ID | 嚴重度 | 問題 | 修法 |
|---|---|---|---|
| P1 | **高** | 素材頁 dispatch 後無 polling，黑屏需手動重整 | AssetsClient 加輪詢（每 3s 查 task status） |
| P2 | **中高** | convId 靠 URL param，書籤/直連/多人場景即丟失 | project 存 latestConvId，assets page 從 project 讀 |
| P3 | 低 | Brief 無 inline citation，記者無法核實 | ✅ brief/generate 拼接 `## 資料來源` 段（deterministic，不過 LLM） |
| P4 | 低 | 角色無 quick preview 入口 | ✅ `/api/characters/[id]/preview` + edit 頁加「試說話」panel |

## 已完成功能（2026-07-01 第二十四 session 追加）

- 懶人包 `bodyText`（3-5 句內文）全流程：Phase B LLM 生成、卡片顯示、編輯儲存
- 圖片風格選擇器：真實照片/資訊圖表/插畫圖文/AI決定 → IMAGE_STYLE_PROMPTS 注入 Phase B prompt
- 懶人包角色選擇器：可獨立選角色，不綁對話角色
- Phase B 完成後文案保留（唯讀顯示在圖卡上方）
- 刪除不跳 confirm 警告視窗（移除 4 處 window.confirm）
- 有版型圖 → `/v1/images/edits`（layout.imageUrl 當 image[] 參數傳 OpenAI）
- layouts POST API + createLayout 補 imageSize 欄位（之前版型 imageSize 沒存進去的 bug）
- 版型庫功能完整上線

## 懶人包三階段（2026-07-01 現況）

- Phase A：角色撰文（同步，30-90s，bridge 呼叫）→ lazypakCopy
- Phase B：分析圖卡（同步，`/analyze-cards`）→ lazypakCards[]（含 bodyText/cardText/imagePrompt）
- Phase C：生圖（逐張，`/generate-card-image`）→ GCS imageUrl
- 版型圖存在 → Phase C 走 `/v1/images/edits`（效果待驗證）
- imageSize 優先鏈：layout.imageSize > lazypakParams.imageSize > '1024x1024'

## ⚠️ 待驗證 / 待做

- /v1/images/edits 版型參考效果：Card 1 是舊版本生成的，Card 2/3 要試
- Phase A 同步 UX：30-90s 等待讓 Adam 感覺「卡住」→ 評估 fire-and-forget + 輪詢

## 部署狀態

- Cloud Run 目前版本：**00043-lx8（2026-07-01，懶人包完整 + imageSize fix）**
- 本機與 Cloud Run 同步

## Nav 連結（2026-06-28 補）

- `/projects` header 右上：「角色庫」（border style）→ /characters + 「新增專案」（primary）→ /projects/new
- `/characters` header 右上：「新增專案」（border style）→ /projects/new + 「新增角色」（primary）→ /characters/new

## UI/UX 規格文件（2026-06-28）

- 已輸出 `UDNNEWS_PLATFORM_UIUX_SPEC.docx`（5 章節，一字不差現有設計描述）
- Adam 拿去設計全新 UI/UX，稿回來後套進 Next.js
- **下一棒等待信號**：Adam 發回設計稿

## P1/P2 修法細節（2026-06-28）

**P1（素材頁 polling）：**
- dispatch 前：optimistic 條目插入 tasks state（status=running，id=`__opt_N`）
- dispatch API 回傳後：`GET /api/tasks/[id]` 取完整 task 物件（含 resultContent）
- 用真實 tasks 替換 optimistic → 不再需要 router.refresh()
- Next.js App Router 的 useState 不因 router.refresh() 重置，直接操作 state 才對

**P2（convId 持久化）：**
- `Project` 型別加 `latestConvId?: string`
- `POST /api/chat` 新建對話時同步 `updateProject({ latestConvId: convId })`
- `AssetsClient`：`convId = searchParams.get('convId') ?? project.latestConvId ?? ''`
- 書籤、直接導航、多人場景皆可從 Firestore 恢復 convId

## 已知技術債（較低優先）

- msg.id 每次 server 端 randomUUID()，retry 會重複寫
- 舊 conv doc 殘留 messages array 欄位（可批次清）
- dispatch 無 queue/rate-limit，大量並發打穿 Bridge
- chat double-send 無 server 冪等 key
- Brief 多版本無比較介面

## 環境資訊

- Tavily key: tvly-dev-2iEczc-*（dev tier，1000次/月，上線前換）
- Bridge secret: 在 .env.local
- **Cloud Run URL**: https://udnnews-platform-62w6sp6iba-de.a.run.app
- **Deploy SOP**: `cd "~/Documents/UDN NEWS/platform" && gcloud builds submit --config=cloudbuild.yaml --region=asia-east1 --project=udnnews --substitutions="COMMIT_SHA=v$(date +%Y%m%d%H%M%S)"`
- **Env vars set**: TAVILY_API_KEY, BRIDGE_SECRET, BRIDGE_URL（via gcloud run services update）
