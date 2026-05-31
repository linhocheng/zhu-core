---
name: MACS 平台（麥肯錫式 AI 顧問公司）
description: ANEWS 概念轉 AI 顧問公司的新專案，2026-05-31 一夜建到端到端骨架；流程/架構/狀態/待辦
type: project
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**MACS 平台** = 用 ANEWS 多 worker 流水線概念，轉成麥肯錫式 AI 顧問公司。repo `~/.ailive/macs-platform`（git 本地，尚未推遠端）。

**Why**：ANEWS 是「五篇文章協奏」（fan-out 後各走）；MACS 是「多條分析線收斂成一個決策」（fan-out 後 barrier 收斂）——這是兩者唯一的架構差異，也是唯一全新要寫的部分（其餘 80% 複用 ANEWS 基建）。

**流程**：cases 入口 → brief-intake → problem-framing（關卡1）→ issue-tree（固定選單，只挑不發明）→ research（單次建 dossiers，唯一燒 API key/web_search）→ materialize（動態 fan-out）→ analysis×N → barrier 收斂 → synthesis（關卡2）→ recommendation → roadmap → storyline → partner-review（高階分析：OK 直接過/不OK 直接改稿，單次不繞圈，關卡3）→ export（三交付物：MD 報告/slide outline/一頁 summary，無圖）。fullAuto 開關 default ON、管全部三關。

**狀態（2026-05-31 晚場，已上線）**：已上線 https://macs-platform.vercel.app（git 本地 v0.2.0.010，無遠端）。晚場補：V1 部門魂（核心魂 + 6 分析師選單含 business_model/strategic_fit/risk + 證據官 §12 + 紅隊折進 partner）、修真相分裂-lite（partner 輸出 revisedWhyNow，export 套用）、HTML 報告交付物（lib/report，navy/tea 設計稿、CSS 圖表無圖，取代 reportMarkdown 當主交付）、監造後台（app/dashboard，移植 ANEWS .adm-* 改藍 + 密碼 gate + PipelineBar + 三關 Resume）。6 個 macs-* 佇列、prod env 乾淨、reconcile cron */15。

**✅ 端到端首次跑通（2026-05-31 深夜）**：錢 bug 已修——research worker 搬上 Cloud Run（`cloud-run/research-worker/`，鏡 anews source-worker + 直連 API key 跑 web_search，idempotency 用 MACS failed-可重入語意不抄 ANEWS 舊 bug）。issue-tree enqueue 帶 `RESEARCH_WORKER_BASE_URL` overrideBaseUrl 指過去；6 佇列 maxAttempts→3；vercel.json maxDuration 300。臻品案 case-mpt5ki7f-zjc4jo 跑到 **status=done**，全鏈路產出報告（reportMarkdown/Html/slide/onePage/partnerVerdict + 5 artifacts）。research 單次 532s、單 dispatch、零重試燒 key。死 code（Vercel research route + lib/pipeline/research.ts）已刪。worker URL：`https://macs-research-worker-754631848156.asia-east1.run.app`。

**真因不是 research，是觀察層 bug**：全 LLM 階段其實早就 ok，卡關是 `lib/workers/trace.ts` 的 `writeWorkerTrace` 用 `.add()` 遇 `llmUsage=undefined`（materialize/export 無 LLM）→ Firestore **同步**拋錯，`.catch()` 抓不到 → 健康 case 被誤判 needs_repair。已修根因（剝 undefined + 包 sync try/catch）。

**⚠️ 待觀察/待辦**：①export 在 05:02 出現一次 `schema invalid（expected string）` blip，重試一次後自己過了，**根因未查**，可能偶發重現。②bridge 回的 usage inputTokens=3 是 placeholder（非真實計數）。③macs-platform repo 仍無遠端（待 Adam 決定放哪才能 push）、要不要接 zhu-vitals。④下一步建議：跑第二個全新 case 從 brief 進場驗完整鏈路。細節看 `zhu-core/docs/WORKLOG.md` 2026-05-31 段 + `ZHU_LAST_WORDS.md`。
