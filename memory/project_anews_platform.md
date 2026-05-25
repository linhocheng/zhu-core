---
name: ANEWS 平台進度
description: 長文自動編排平台當前施工狀態與已知問題
type: project
originSessionId: cb4006f6-1b44-47b5-98d0-199f061785f4
---
P1+P2+P3+P4 施工完成（2026-05-25）。Pipeline 端到端跑通 issue=done。

**已完成：**
- P3 Intel Officer + sequential pipeline（main→sub_a→sub_b）
- P4 coherence gate three-way split（pass/warning→continue, fail→coherence_failed→human gate）
- Bug fixes（2026-05-25c session）：
  - section-qa precondition 幂等：terminal status 早期 return
  - needs_repair propagation：main 已 stitching_done+ 時 sub 失敗不 kill issue
  - image worker transaction：Admin SDK reads-before-writes（Promise.all 先讀）
  - babysit.mjs：5min cooldown + 2min node age，不與 Cloud Tasks 搶

**P4 end-to-end 驗收結果（2026-05-25c）：**
- issue=done ✅ / main+sub_b 全 done ✅
- image race condition fix 驗證：6 task 全 done → images_all_done 自動發火 ✅
- coherence → export → done 自動流過 ✅
- main 4 節全以 repairAttempts=0 通過 QA ✅

**已知問題 / 技術債：**
- IMAGE_DRY_RUN 只在 .env.local，Vercel prod env 沒有 → Cloud Tasks 無法自動 fire image workers（手動補）
- GCP 60s cron（workflow-reconcile）未設定，靠 babysit.mjs 人工補
- needs_repair design 未討論（sub article 持續 QA 失敗的 recovery path）
- babysit.mjs 是暫時 hack，長期靠 reconcile cron 取代

**下一步：**
- 把 IMAGE_DRY_RUN=true 加進 Vercel prod env
- 討論 needs_repair design
- 設定 GCP Cloud Scheduler 60s cron
- 考慮 P5：evidence-pass prod 驗證 / 技術債清理

**Why:** 每期有靈魂 = 值得花 5x 時間
**How to apply:** 下次 session 先補 IMAGE_DRY_RUN prod env，再討論 needs_repair
