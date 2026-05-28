---
name: ANEWS-B 平台進度
description: ANEWS-B 長文 AI 新聞分析平台（從 ANEWS 複刻優化版）施工狀態
type: project
---

**全鏈路首次驗收通過（2026-05-27）：** 電動車主題 issue → source→intel→blueprint→article_write→critic 全通，critic 一輪過 79.7/100。

**架構：** source → intel_officer → blueprint → article_write → critic(最多3輪) → polish → image(dry_run) → export → done

**平台：** `~/.ailive/anews-b-platform/`，生產 `https://anews-b-platform.vercel.app`

**已完成：**
- 8 個 worker routes + harness + idempotency + artifact
- Dashboard UI 四頁（主頁/issue詳情/artifacts/admin settings）
- Vercel prod env vars（11個）、Cloud Tasks queues、Firestore composite indexes
- blueprint 524 修復：精簡 rubric schema（移除 pass/fail example），46s ✅
- source worker 524 修復：Haiku 硬碼，搜尋次數減少

**已知問題 / 未完成：**
- polish → image → export 三段未追蹤到完成（2026-05-27 收工前在 critic→polish 過渡）
- anews-b-platform 所有改動 untracked，需補 git commit

**下一步：**
1. 確認 `curl https://anews-b-platform.vercel.app/api/issues/Xq4PeS49ePNaibUGZ3rP` 看 issue.status = done
2. 若 done → 補 git commit（`cd ~/.ailive/anews-b-platform && git add -A && git commit -m "v0.1.0.001 — 新增：全鏈路"`）
3. 若卡 → 看最後一個 artifact workerType + decision

**Why:** ANEWS-B 是 ANEWS 的複刻優化版，Actor+Critic+Rubric 架構，目標產出 5000 字長文
**How to apply:** 開新 session 先 curl 確認 issue status，再決定下一步
