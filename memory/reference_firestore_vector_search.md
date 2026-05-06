---
name: Firestore vector search + Gemini embedding 踩雷
description: 用 firebase-admin findNearest 做 RAG 時的三條 stub：embedding model 命名、composite index、env pull 環境
type: reference
originSessionId: 34482a57-dd4f-454a-b441-d8c9c2f565b9
---
下次在 ailive / molowe / 任何 Firestore 專案上接 RAG 時，這三條一次省 30 分鐘：

**1. Gemini embedding model 名稱已變**
- 過時：`text-embedding-004`（API 回 404 NOT_FOUND）
- 現役：`gemini-embedding-001`（預設 3072 維，可用 `outputDimensionality` 降到 768/1536）
- 端點：`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=$GEMINI_API_KEY`
- body 帶 `taskType`：寫入用 `RETRIEVAL_DOCUMENT`、查詢用 `RETRIEVAL_QUERY`（同題 query 命中分數會差）

**2. Firestore findNearest 搭配 where() 要建 composite index**
- 純 `collection.findNearest({...})` → 只要 single-field vector index
- `collection.where('kol_id','==',x).findNearest({...})` → 必須建 composite：
  ```
  gcloud firestore indexes composite create --project=$PROJ \
    --collection-group=$COLL --query-scope=COLLECTION \
    --field-config=order=ASCENDING,field-path=kol_id \
    --field-config=vector-config='{"dimension":"768","flat":"{}"}',field-path=embedding
  ```
- 第一次 query fail 時 Firestore 會回完整 gcloud 指令，直接複製貼上即可
- 用 try/catch 包 query route 才看得到這個提示，不然 Vercel 噴 500 空 body

**3. `vercel env pull` 預設拉 development，不是 production**
- 直接 `vercel env pull .env.local` → 只有 `VERCEL_OIDC_TOKEN`，其他 secret 全空
- 要 `--environment=production` 才拉得到 GEMINI_API_KEY / FIREBASE_SERVICE_ACCOUNT_JSON 等
- 本機驗 secret 有效性時必踩

**bonus**：`FIREBASE_SERVICE_ACCOUNT_JSON` 是含特殊字元的 JSON 串，bash `set -a; source .env` 會炸（unbound var），用 `grep '^KEY=' .env | cut -d= -f2-` 個別抓會比較乾淨。
