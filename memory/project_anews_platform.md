---
name: ANEWS 平台進度（2026-05-24 Batch A+B 驗收 + G1-G4 evidence-pass）
description: 自動化長文編排系統，Next.js + Vercel + Cloud Tasks + Firestore + bridge LLM
type: project
originSessionId: 2fe38ab3-33c4-43ef-b959-5b2fc251b350
---
ANEWS 平台在 `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app

**Why:** Adam 要建獨立長文生成平台，多篇文章（1 主 + 多子），自動從研究→藍圖→段落→QA→發布。

**How to apply:** 進 ANEWS 相關工作先讀 `~/.ailive/anews-platform/ISSUES_AND_FIXES.md` + `git diff --stat HEAD`。

## 當前 pipeline 流程（2026-05-24）
source → blueprint → alignment → awaiting_blueprint_review → section-write → **evidence-pass**（新）→ section-qa → stitch → polish → awaiting_review → coherence → export

## 驗收狀態（2026-05-24 v7）
- Batch A ✅：article.title / section.heading+wordCount / article.stitchedWordCount 全有值
- Batch B ✅：QA retry rate 12.5%（目標 <20%）
- v7 medium mode：3 篇 articles 全 done，標題真實，3 篇字數 897/1872/952

## 未 commit 改動（8 個檔案 + evidence-pass/ 新目錄）
- G1: section-write 拆 blocks 存 Firestore
- G2: evidence-pass/ 新 worker（patch-based fact 插入）
- G3: orchestrate evidence_pass_done handler + section_qa_failed 分流
- G4: section-qa qaMode tracking + qaPassedMarkdownUrl
- retry idempotency fix（workerCall fresh taskId）
- stitch precondition fix（允許 qa_blocked）
- test script skip→qa_blocked fix

## 下一步（醒來第一件）
1. `git add -A && git commit -m "v1.7.0.003 ..."` + `npx vercel --prod --yes`
2. Adam 建 GCP queue `anews-evidence-pass`（`gcloud tasks queues create anews-evidence-pass --location=asia-east1`）
3. 診斷 image queue stuck
4. v8 medium mode 驗 evidence-pass 效果

## 卡住
- image tasks 全 stuck（v8 前要先診斷）
- Batch C coherence 閘門未做
- GCP queue 需 Adam 建
