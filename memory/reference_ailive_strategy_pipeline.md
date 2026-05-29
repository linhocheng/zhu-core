---
name: ailive 策略書管道 live endpoint 在 Cloud Run 不在 Vercel
description: 改 ailive 角色策略書生成邏輯前，認清 live 是獨立 Cloud Run strategy-worker，Vercel specialist/strategy route 是死副本
type: reference
originSessionId: 416ce85e-c458-4bb5-811a-b38dc130d139
---
ailive 角色「發策略書」的真正 live 後端是**獨立 Cloud Run** `~/.ailive/strategy-worker/src/index.ts`（service `strategy-worker`，project `zhu-cloud-2026`，region asia-east1，URL `strategy-worker-754631848156.asia-east1.run.app`，**非 git，gcloud run deploy --source 直上**）。

管道：dialogue（文字）或 voice-stream（SSE 語音）的 `commission_specialist` 工具 → 建 `platform_jobs` doc（`requesterId` / `assigneeId`）→ `enqueueStrategy`（`cloud-tasks.ts` 的 STRATEGY_WORKER_URL）→ Cloud Tasks → 上述 Cloud Run worker（兩段：caller refine brief + assignee 寫 markdown）→ docx 上 Storage + 寫回 job doc `mdContent`/`result.docUrl` → fire-and-forget enqueue strategy-html-worker（另一支 Cloud Run）。

**self 委託**：`requesterId === assigneeId`（角色委託自己）。worker 內 `isSelfCommission` 判此，stage-2 改用 `FORM_SELF_GUIDE`（解開字數/章節框），creator/docTitle 走角色自己。

**陷阱（真相分裂）**：`ailive-platform/src/app/api/specialist/strategy/route.ts` 是同邏輯的 Vercel **死副本**，無人呼叫（2026-05-29 已刪）。改策略邏輯一律改 Cloud Run 那份。確認 live endpoint 的方法：看 `cloud-tasks.ts` 的 *_WORKER_URL 常數。

**未驗**：LiveKit 真即時 agent（`agent_name='ailive-realtime'`，main.py 在遠端 VM）能否發 commission 工具未確認；Vercel `/api/livekit/token` 只發 token + dispatch。
