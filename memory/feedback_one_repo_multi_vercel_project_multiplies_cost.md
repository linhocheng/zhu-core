---
name: feedback-one-repo-multi-vercel-project-multiplies-cost
description: 一個 GitHub repo 連到多個 Vercel project → 每次 push 全部自動部署、cron 各跑一遍 = 成本 N 倍且隱形；審計法：掃全 project 的 crons+env+protection
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 50b87aad-ff26-4532-9e0c-2506caf4fd7b
---

**規則**：同一個 GitHub repo 若被連到 N 個 Vercel project，每次 push 會自動部署到全部 N 個，各自跑同一組 cron = LLM/cron 花費 N 倍，而且在帳單曲線上完全看不出來（分散在多個 project）。定期用 API 掃「有沒有幽靈重複部署」。

**Why**：2026-07-06 掃 Vercel 發現 `zhu-core-full` 是 `zhu-core` 的隱形雙胞胎——綁同一個 repo（linhocheng/zhu-core）、同 main 分支、同 commit、同 crons，每天 zhu-daily/heartbeat 的 Haiku 各燒兩遍，跑了數月沒人發現。grep 整個 repo 對 `zhu-core-full` 零命中＝沒人記得它為何存在。

**心態**：新增 Vercel project 很廉價、很容易忘；「多開一個備用/full 版」當下無感，長期是每次部署都翻倍的暗費。跟 Cloud Run 殭屍同族——不主動掃就隱形。

**How to apply**：
- 刪除前先核本體：`GET /v9/projects/{name}` 比對兩個 project 的 `link`（org/repo/type）、latestDeployments 的 commit、crons——完全相同才是真複製品，才敢刪。
- Vercel 全盤審計三件套（API bearer 從 `~/Library/Application Support/com.vercel.cli/auth.json` 的 token）：①`crons.definitions` 每個 project 的排程 ②env 有沒有 `CRON_SECRET`（沒有＝cron 匿名可觸發）③`ssoProtection.deploymentType`（`all_except_custom_domains` 只擋 *.vercel.app 不擋自訂域，且實測常常沒真的生效——要 curl 生產端點看 body 才算數）。
- 刪 project 用 `DELETE /v9/projects/{id}`（回 204）；碼在 git，重建只是重連 repo。

**觸發信號**：看到 Vercel/任何 PaaS 帳單只漲不跌；`vercel projects ls` 出現 `-full`/`-copy`/`-staging` 同名變體；一個 repo 的 settings 裡 Git 連了多個 project。

相關：[[skill_cloudrun_version_retirement]]（Cloud Run 殭屍同族）、[[feedback_standing_cost_only_for_instant_readiness]]、[[feedback_cost_verify_billing_meter_not_config]]（宣告省錢要看計費錶）、[[feedback_manual_cloud_change_sync_deploy_script]]（手動刪 project/改 env 後要記錄，別讓它隱形）。
