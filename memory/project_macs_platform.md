---
name: MACS 平台（麥肯錫式 AI 顧問公司）
description: ANEWS 概念轉 AI 顧問公司的新專案，2026-05-31 一夜建到端到端骨架；流程/架構/狀態/待辦
type: project
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**MACS 平台** = 用 ANEWS 多 worker 流水線概念，轉成麥肯錫式 AI 顧問公司。repo `~/.ailive/macs-platform`（git 本地，尚未推遠端）。

**Why**：ANEWS 是「五篇文章協奏」（fan-out 後各走）；MACS 是「多條分析線收斂成一個決策」（fan-out 後 barrier 收斂）——這是兩者唯一的架構差異，也是唯一全新要寫的部分（其餘 80% 複用 ANEWS 基建）。

**流程**：cases 入口 → brief-intake → problem-framing（關卡1）→ issue-tree（固定選單，只挑不發明）→ research（單次建 dossiers，唯一燒 API key/web_search）→ materialize（動態 fan-out）→ analysis×N → barrier 收斂 → synthesis（關卡2）→ recommendation → roadmap → storyline → partner-review（高階分析：OK 直接過/不OK 直接改稿，單次不繞圈，關卡3）→ export（三交付物：MD 報告/slide outline/一頁 summary，無圖）。fullAuto 開關 default ON、管全部三關。

**狀態（2026-05-31）**：8 階段骨架全建完。synthesis 質感 go/no-go=GO、orchestration 21/21、四段 LLM eval 真驗過（全走 bridge/Max 沒燒 API key）。

**How to apply / 待辦**：
- HTTP 端到端未驗（本機無公開 URL）→ 部署後才真串：建 6 個 `macs-*` Cloud Tasks 佇列、設 WORKER_BASE_URL、wire reconcile cron、推遠端。
- research worker 建好沒跑（天條，等 Adam 同意燒 API key）。
- 待 Adam：審核 UI 的 UIUX（後端已備）、要不要接 zhu-vitals。
- 已知債：partner-review 改 storyline 沒改 recommendation → export Why now 欄不一致。
- 細節看 `zhu-core/docs/WORKLOG.md` 2026-05-31 段 + `LESSONS_2026-05-31.md`。
