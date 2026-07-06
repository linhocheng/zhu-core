---
name: standing-cost-only-for-instant-readiness
description: 天條：磚頭費用（常駐）只為「下一秒可能有人要」的東西付；長任務一律 Cloud Run Jobs，不用 min=1 worker 扛
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0fb48042-7502-4185-8ecc-51985c11164a
---

**規則**：開任何常駐（min-instances≥1）前先問一句：**這台機器閒著時，有沒有人可能下一秒需要它？**
- 有（即時語音 agent 等秒級待命）→ 可以常駐，但必須配「後台開關＋N 小時無用自動關機」
- 沒有（podcast/文件生成/批次）→ Cloud Run Jobs：`jobs.run` 帶 `TASK_ID`+`JOB_ACTION` env override，job 從 Firestore task doc 讀參數，業務失敗寫回 doc 後 exit 0（`--max-retries=0`）

**Why**：舊天條的 no-throttle worker + min=1 是為躲 throttling 付的保護費（每台每月 ~$60）；且 min=0 後長任務會被 ~15 分鐘閒置回收砍掉。Jobs 同時解掉 throttle、回收、常駐費三件事。2026-07-06 全帳戶清查：常駐固定費從 ~$1,200/月清到 $0，功能靠開關＋Jobs 全保留。

**心態**：磚頭費是「聽起來很安全」的錢——每台都有理由，加起來是一年 NT$40 萬。安全感不該用常駐買，該用「用的時候起得來」買。

**How**：新 worker 設計時先分類待命性；cloudbuild 同時部署 service（過渡回退）與 job；平台派工帶 env 開關（如 `PODCAST_JOB_NAME`）可秒回退。

**觸發信號**：想寫 `--min-instances=1`；「這個任務跑很久所以要常駐」的念頭（因果反了——跑很久正是 Jobs 的理由）。

相關：[[cloud-run-sop]]（舊解與 throttle 物理）、[[cost-verify-billing-meter-not-config]]、[[manual-cloud-change-sync-deploy-script]]
