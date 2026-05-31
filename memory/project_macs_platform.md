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

**⚠️ 上線踩雷（接棒第一件）**：research(web_search) 放 Vercel→timeout→Cloud Tasks 無上限重試→燒 key×9（dispatchCount=9）。**macs-research 佇列已 pause 止血**，臻品案 case-mpt5ki7f-zjc4jo 卡 research_running。**修好 research→Cloud Run 前不要 resume 佇列。** 詳見 reference_websearch_cloudrun_not_vercel.md。

**How to apply / 待辦（對齊 ANEWS）**：
- ①research 搬 Cloud Run（鏡 anews source-worker，用 overrideBaseUrl）②vercel.json 補 functions.maxDuration ③6 佇列設 --max-attempts=3 ④建 cloud-run/ ⑤選配 auto-kick watchdog。
- 待 Adam：macs-platform repo 遠端放哪（決定才能 push）、要不要接 zhu-vitals。
- 細節看 `zhu-core/docs/WORKLOG.md` 2026-05-31 晚場段 + `LESSONS_2026-05-31.md` L5/L6 + `ZHU_LAST_WORDS.md`。
