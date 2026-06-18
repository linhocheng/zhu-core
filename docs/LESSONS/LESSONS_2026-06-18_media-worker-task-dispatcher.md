# LESSONS 2026-06-18 · media-worker + AILivex 任務派發系統（第四 session）

## L1：獨立服務比共用 lib 更耐擴充（media-worker 設計決策）
- 現象：UDN NEWS 的圖片生成方式（Cloud Tasks async）很好，想搬到 AILivex
- 根因：如果用 lib，每個平台都要自建 Cloud Tasks queue + worker 基礎設施；用獨立 HTTP 服務，所有平台只需呼叫 API
- 下次：跨平台能力一律先問「要不要做成服務？」不是「要不要做成 lib？」
- 對應 feedback：feedback_solve_root_not_symptom（解根因而非症狀）

## L2：$COMMIT_SHA 在非 git 目錄的 Cloud Build 是空字串
- 現象：`media-worker` 非 git repo，`gcloud builds submit` 的 `$COMMIT_SHA` 是空的，image name 變 `ailivex/media-worker:`（無標籤）
- 根因：Cloud Build 只在 git repo 自動填 `COMMIT_SHA` substitution；非 git 目錄就是空值
- 下次：非 git 目錄的 `cloudbuild.yaml` 一律加 `--substitutions=COMMIT_SHA=$(date +%Y%m%d-%H%M%S)`
- 對應 feedback：feedback_flagged_risk_must_be_verified

## L3：MEDIA_WORKER_INTERNAL_URL chicken-and-egg 要先 optional 再 required
- 現象：第一次 deploy 前無法取得 Cloud Run URL，但 config 把它設成 `required()` → build 失敗
- 根因：服務部署前 URL 未知，但 URL 是必要 secret，雞與蛋問題
- 下次：對「只有部署後才知道」的 secret 先設 `optional()` 首次 deploy，取得 URL 建 secret 後改回 `required()` 再 redeploy
- 對應 feedback：skill_async_worker_checklist

## L4：角色是大腦，工作流是工廠——這個框架一旦清楚，架構決策就快很多
- 現象：討論 AILivex 任務派發設計時，Adam 提出「角色是主要大腦，工廠只是工廠」
- 根因：有了這個隱喻，「通知怎麼回」「多個任務怎麼管」「能力 gate 在哪層」等問題都有直覺答案
- 下次：設計多代理系統前先問「誰是大腦？誰是手腳？」清楚了架構就明了
- 對應 feedback：feedback_deterministic_work_belongs_in_code（確定性 routing/gate 用程式）

## L5：任務完成通知接在 lastSession 同一機制——不創新機制，延伸既有機制
- 現象：需要讓角色知道「背景任務完成了」，但不能假設對話是連續的
- 根因：lastSession 快照本來就是在 system prompt 注入「上次的記憶」；任務通知同樣是在下次對話時注入
- 下次：有「需要在下次對話注入的非同步信號」都可以用這個模式（查 notified=False + 注入 + 標已通知）
- 對應 feedback：feedback_interface_blood_vessel_check（介面血管有沒有接通）
