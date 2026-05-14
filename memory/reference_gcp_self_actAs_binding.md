---
name: GCP self-actAs 也要明確 IAM binding
description: 同一個 SA 自己 mint OIDC token 給自己 act-as 也要 grant roles/iam.serviceAccountUser，self ≠ 免 IAM
type: reference
originSessionId: bd4daf09-8777-4842-b8e8-5324dd1ef9d6
---
**症狀**：Cloud Tasks `createTask` 帶 `oidcToken.serviceAccountEmail` 收 `403 PERMISSION_DENIED: The principal lacks IAM permission "iam.serviceAccounts.actAs"`

**情境**：caller SA = oidcToken target SA（同一個身份對自己 mint token）

**直覺錯**：「同一個 SA 對自己 actAs 應該不用 grant」── GCP IAM 不認這個直覺。**self-actAs 也要明確 binding**。

**修法**：
```bash
gcloud iam service-accounts add-iam-policy-binding \
  <sa>@<project>.iam.gserviceaccount.com \
  --member="serviceAccount:<sa>@<project>.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```
（`iam.serviceAccountUser` 已含 `actAs`，不需另加 actAs role）

**判斷規則**：任何 SA-mint-OIDC-token 場景，明確列 `(caller, oidcToken.serviceAccountEmail)` 兩個身份 ──
- 不同 → grant 一次
- **相同 → 也要 grant 一次**

「caller 對 oidcToken target」每組獨立 IAM 邊界，新組合 = 新 IAM。先前修過 A→B 不代表 B→B 不用補。

**範例脈絡**：2026-05-11 ailive-platform `strategy-enqueuer` SA 透過 Cloud Tasks 給 Cloud Run worker mint OIDC token，第一次 reach REST 那層就撞，補 grant 即通。先前以為「我之前已經修過 IAM」是認知偏誤 ── 那組是 `html-worker → enqueuer`，不是 `enqueuer → enqueuer`。
