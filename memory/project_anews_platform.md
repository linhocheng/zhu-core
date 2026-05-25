---
name: ANEWS 平台進度（2026-05-25 DAG dispatcher + shadow mode + T3）
description: 自動化長文編排系統，Next.js + Vercel + Cloud Tasks + Firestore + bridge LLM
type: project
originSessionId: 3ae68557-a3db-468d-a4f5-764c4665d2be
---
ANEWS 平台在 `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app

**Why:** Adam 要建獨立長文生成平台，多篇文章（1 主 + 多子），自動從研究→藍圖→段落→QA→發布。

**How to apply:** 進 ANEWS 相關工作先讀 `git log --oneline -5` + `~/.ailive/zhu-core/docs/WORKLOG.md` 最後 80 行。

## 當前 pipeline 流程（2026-05-25）
source → blueprint → alignment → awaiting_blueprint_review → section-write →【dispatcher】→ section-qa → evidence-pass → stitch → polish → awaiting_review → coherence → export

## 驗收狀態（2026-05-25 v1.8.0.001）
- Batch A ✅ / Batch B ✅ / evidence-pass ✅
- DAG runtime ✅：lib/workflow/{manifest,schema,contracts,dispatcher}.ts
- Shadow mode ✅：verify-shadow-mode.mjs diff=0，23 nodes / 41 traces 完全一致
- T3 ✅：DISPATCHER_OWNS_SECTION_QA=true 已上線，pipeline PASSED

## 架構重點
- `lib/workflow/dispatcher.ts`：pending→queued atomic Firestore transaction
- `lib/workers/harness.ts`：worldStateVerify 後 fire-and-forget 寫 workflow_node（shadow mode）
- `DISPATCHER_OWNS_SECTION_QA=true`：section_done → 建 section_qa pending node → await reconcileIssue
- 60s cron：`app/api/cron/workflow-reconcile/route.ts`（GCP schedule 未設，靠 orchestrate poke 撐）

## 下一步（醒來第一件）
1. 診斷 image queue stuck：查 Firestore `image_tasks` collection status 分布，或 `worker_traces` where workerType=image-worker
2. Batch C：orchestrate coherence_done 三路分流 + approve-coherence endpoint

## 卡住
- image tasks 卡過（最新 run 通過但歷史有 stuck，需根因確認）
- Batch C coherence 閘門未做
- mock workers（polish/coherence/export/image）未升 harness，shadow mode 無法覆蓋這幾條
- 60s cron GCP schedule 未設
