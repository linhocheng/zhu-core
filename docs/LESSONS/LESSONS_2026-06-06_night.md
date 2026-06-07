# LESSONS 2026-06-06 夜 · ailiveX 骨架七 Phase 全通

## L1：@google-cloud/* SDK 在 Vercel/Turbopack 必改 REST
- 現象：`@google-cloud/tasks` 在 Vercel 報 `Cannot find module protos/protos.json`，即使加了 serverExternalPackages 也炸
- 根因：gRPC-based SDK 帶巨大的 protos.json，Turbopack 打包時不包含這些靜態資源；external 只是不 bundle，但部署包仍缺資源
- 下次：在 Vercel 上 **一律**用 REST API + GoogleAuth 取 token，完全避開 SDK。`google-auth-library` 走 serverExternal 就夠
- 對應 feedback：reference_google_cloud_sdk_no_bundle.md

## L2：Cloud Tasks → Cloud Run OIDC 需要三層 IAM
- 現象：Cloud Tasks task 建立成功但 Cloud Run 回 "Empty Authorization header"
- 根因：OIDC token 生成需要三個 IAM binding 全部到位：
  1. SA 對自己有 `roles/iam.serviceAccountUser`（actAs 允許自己當 invoker SA）
  2. Cloud Tasks 服務代理（`service-PROJECT_NUMBER@gcp-sa-cloudtasks.iam.gserviceaccount.com`）對 SA 有 `roles/iam.serviceAccountTokenCreator`（Cloud Tasks 才能替我們 mint OIDC token）
  3. SA 對 Cloud Run 有 `roles/run.invoker`（Cloud Run 才接受這個 token）
- 下次：新建 Cloud Tasks → Cloud Run OIDC 管道，三層一次全補，不要以為二補一
- 對應 feedback：reference_gcp_self_actAs_binding.md（已有但不完整）

## L3：GCS Uniform Bucket-Level Access + public:true = 炸
- 現象：firebase-admin `file.save({ public: true })` 報 "Cannot insert legacy ACL for an object when uniform bucket-level access is enabled"
- 根因：新建 GCS bucket 預設啟用 Uniform Bucket-Level Access，完全禁用 per-object ACL
- 修法：`gcloud storage buckets add-iam-policy-binding allUsers roles/storage.objectViewer` + 移除 `public: true`
- 下次：建 public bucket 第一件事就設 bucket-level allUsers，不用 per-object ACL

## L4：Vercel 部署後必核對所有路由所需 env vars
- 現象：dialogue 500；查出缺 BRIDGE_ENABLED、BRIDGE_URL、GCP_PROJECT_ID、DOC_TASKS_QUEUE
- 根因：逐步加 env var 而沒有一次列清單對照；local .env.local 有但 Vercel 沒有
- 下次：deploy 前對照 local .env.local 把 **所有非秘密的 env var** 也加進 Vercel（`BRIDGE_ENABLED`、`BRIDGE_URL`、`GCP_PROJECT_ID`、`CLOUD_TASKS_LOCATION`、`DOC_TASKS_QUEUE` 這類的容易漏）
