---
name: 天條：Cloud Run firebase-admin 一律走 ADC，不注入 SA JSON
description: Cloud Run 上 cert(sa) 打 oauth2/v4/token 會 Premature close；metadata server 才是可靠路徑
type: feedback
originSessionId: 5b2da2b6-04e7-40f3-bdbd-89660277f607
---
Cloud Run 上的 firebase-admin **不要注入 FIREBASE_SERVICE_ACCOUNT_JSON / B64**，讓它走 ADC（Application Default Credentials，metadata server `169.254.169.254`）。

**Why:** cert(sa) 會向 `www.googleapis.com/oauth2/v4/token` 做外部 HTTP token 交換。某些 GCP project 的 Cloud Run 打不通這個端點（Premature close），但 OpenAI、Firestore gRPC 都正常——因為 Firestore gRPC 走不同 auth 路徑、OpenAI 是外部域名不受影響。ADC 走 metadata server（link-local，Cloud Run 保證永遠可達），完全繞開這個外部交換。此坑在 ailive / ailivex / media-worker 多次重踩，每次花整個 session 才找到。

**心態:** 「Firestore 通了 ≠ Storage 也通」——兩者 auth 機制不同，不能混為一談。本機 curl secret 測試成功 ≠ Cloud Run 環境成功。

**How to apply:**
```typescript
// firestore.ts 標準模板
function initIfNeeded() {
  if (getApps().some((a) => a.name === "[DEFAULT]")) return;
  const saB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const saJson = saB64
    ? Buffer.from(saB64, "base64").toString("utf-8")
    : process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (saJson) {
    const sa = JSON.parse(saJson);
    initializeApp({ credential: cert(sa), projectId: sa.project_id, storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
  } else {
    // Cloud Run: ADC via metadata server，不走外部 token 交換
    initializeApp({ projectId: process.env.GCP_PROJECT_ID, storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
  }
}
```
cloudbuild.yaml / Cloud Run deploy **不注入** SA JSON secret → 自動走 ADC。
Cloud Run service 的 `--service-account=<sa>@` 決定 ADC 身份，Storage 權限跟 cert 路徑完全一樣。
本機 / Vercel 有 SA JSON → 走 cert；Cloud Run 沒有 → 走 ADC。一套 code，兩個環境都對。

**觸發信號:**
- 任何 Cloud Run worker 要用 firebase-admin Storage（file.save / getStorageBucket）
- 錯誤訊息：`Invalid response body while trying to fetch https://www.googleapis.com/oauth2/v4/token: Premature close`
- 說「本機測試通了但 Cloud Run 上 Storage 失敗」
