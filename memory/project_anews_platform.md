---
name: ANEWS 平台進度
description: 長文自動編排平台當前施工狀態與已知問題
type: project
originSessionId: cb4006f6-1b44-47b5-98d0-199f061785f4
---
P1+P2+P3+P4 施工完成（2026-05-25）。Pipeline 端到端跑通 issue=done。
2026-05-26：Dashboard UI/UX 全改版 + 單篇直寫 MVP 完成（未部署）。

**已完成：**
- P3 Intel Officer + sequential pipeline（main→sub_a→sub_b）
- P4 coherence gate three-way split（pass/warning→continue, fail→coherence_failed→human gate）
- Bug fixes（2026-05-25c session）：section-qa 幂等、needs_repair 防傳播、image transaction fix、babysit 節制
- Dashboard UI/UX 全改版（2026-05-26）：Steve Jobs 視角，狀態驅動版面，PipelineBar 分段塊，Action Zone
- 單篇直寫 MVP（2026-05-26）：`article-write` worker，繞過 alignment/section/QA/stitch，max_tokens:8192

**P4 end-to-end 驗收（2026-05-25c）：**
- issue=done ✅ / main+sub_b 全 done ✅ / image race fix 驗證 ✅ / coherence→export→done ✅

**已知問題 / 技術債：**
- **anews-platform 未部署**：2026-05-26 的 10 個改動未 commit 未 push
- IMAGE_DRY_RUN 只在 .env.local，Vercel prod env 沒有 → Cloud Tasks 無法自動 fire image workers
- GCP 60s cron（workflow-reconcile）未設定，靠 babysit.mjs 人工補
- needs_repair design 未討論（sub article 持續 QA 失敗的 recovery path）
- main article 12000 字超出 max_tokens:8192 → 需 extended output beta（後評估）

**下一步：**
1. 部署：`cd ~/.ailive/anews-platform && git add -A && git commit -m "v1.12.0.001..." && npx vercel --prod --yes`
2. 建新 issue 勾「單篇直寫模式」測試 article-write worker 輸出質量
3. 把 IMAGE_DRY_RUN=true 加進 Vercel prod env
4. 設定 GCP Cloud Scheduler 60s cron

**Why:** 每期有靈魂 = 值得花 5x 時間；單篇直寫先驗質量再評估規模
**How to apply:** 下次醒來先部署再測試，不要先聊再做
