---
name: 新 GCP project 第一次 deploy 雙必踩 IAM
description: Cloud Build 預設 global region 被 org policy 擋、Cloud Run 預設 SA 沒 secretAccessor，新 project 第一次 deploy 必踩這兩條
type: reference
originSessionId: 32b08dfd-50e3-4004-bca4-32e3494f2ef9
---
新 GCP project 第一次跑 Cloud Build + Cloud Run + Secret Manager 一定踩這兩條，預備好命令一氣呵成過。

**1. Cloud Build 必帶 `--region`**
- 症狀：`gcloud builds submit` 一直 `PERMISSION_DENIED: The caller does not have permission`，連 project Owner 都擋
- 根因：API 預設 `/v1/projects/.../locations/global/builds`，新 project 或 organisation policy 禁 global region
- 修法：`gcloud builds submit --region=asia-east1 ...`（永遠帶 `--region`）

**2. Cloud Run 預設 compute SA 沒 secretAccessor**
- 症狀：`gcloud run deploy --set-secrets=...` 每個 secret 都 PermissionDenied
- 根因：Cloud Run 預設用 `${PROJECT_NUMBER}-compute@developer.gserviceaccount.com`，新 project 沒 grant `roles/secretmanager.secretAccessor`
- 修法：
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**證據：** 2026-04-27 ailive 即時撥號上雲時親踩，記在 `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260427.md` 第 1、2 條。
