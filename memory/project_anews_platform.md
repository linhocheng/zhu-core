---
name: ANEWS 平台進度（2026-05-21 S2 完成）
description: 自動化長文編排系統，Next.js + Vercel + Cloud Tasks + Firestore + bridge LLM
type: project
---

ANEWS 平台在 `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app

**Why:** Adam 要建獨立長文生成平台，5 篇文章（1 主 + 4 子），自動從研究→藍圖→段落→QA→發布。

**How to apply:** 進 ANEWS 相關工作先讀 `~/.ailive/zhu-core/docs/projects/ANEWS_PLAN_v2.1.md`，然後看最新 git log。

## S1 完成（2026-05-21）
- pipeline mock 全通：pending → source_running → blueprint_running → section_writing → awaiting_review
- 6 個 Cloud Tasks queue，orchestrator phase lock，worker 冪等鎖

## S2 完成（2026-05-21）
- source-worker：真實 LLM 生成研究底稿（keyFacts/caseExamples/taiwanRelevance）
- blueprint-worker：真實 LLM 生成段落藍圖（8 段主文 / 4 段子題），section order normalize
- bridge 走 Max 月費（BRIDGE_URL=https://bridge.soul-polaroid.work）

## ⚠️ 未解技術債
1. blueprint_done allReady 競態：並發 5 篇 blueprint，最後一篇完成時其他已過 blueprint_ready → 沒進 section_writing。手動 `/api/debug kickstart_sections` 補救。
2. section-write 仍是 mock，S3 要接 LLM

## S3 下一步
`app/api/workers/section-write/route.ts` 接 LLM，寫真實 ~1100 字段落，存 Firebase Storage。
