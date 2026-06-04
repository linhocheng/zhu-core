---
name: Mode 1→2 踩雷心法（MACS hybrid pipeline）
description: 從 market_evidence 升到 hybrid mode 的十條踩雷心法，2026-06-04 兩批落地實際遇到的。完整版在 docs/MODE1_TO_MODE2_LESSONS.md
type: feedback
originSessionId: 0f6f6064-d9af-449e-b35e-4001b3d23932
---
# Mode 1 → Mode 2 踩雷心法（摘要）
_2026-06-04 · 完整版：`docs/MODE1_TO_MODE2_LESSONS.md`_

## 心法一：LLM 說的語言 ≠ TypeScript 說的語言
enum 欄位在中文 prompt 裡出現，必加 `z.preprocess` 正規化。tsc 過了不等於 LLM 不回奇怪的東西。

## 心法二：TypeScript 型別安全 ≠ 執行期安全
加 union type 後，每個讀欄位的地方要人眼逐函式過。tsc 只保證 overlap，不保證「這條分支用了對的那個型別」。

## 心法三：named Firestore DB ≠ default DB
MACS 所有腳本必須 `getFirestore(app, 'macs')`，不靠記憶猜。

## 心法四：改 lib/pipeline 必同步改 app/api/workers
每個 worker route 都要讀 `c.strategyMode` 並往下傳，`readArtifact<T>` 改成 union type。後台改動必同步前台。

## 心法五：eval scripts 加 explicit cast，不改邏輯，Mode 2 另開
`as RecommendationResult` 告訴 tsc「這個 eval 只跑 Mode 1」。

## 心法六：needs_repair SOP — 看 repairCollection 決定從哪裡重進
- `repairCollection: "cases"` → repairErrorMessage 在 case，reset case status 到失敗 stage
- `repairCollection: "analysis_runs"` → repairErrorMessage 在 analysis_runs，reset 那個 doc

**不要**從 brief_intake 重打，從失敗那個 stage 重進。

## 心法七：Cloud Tasks 已交付 ≠ 可重試
reset Firestore 後必手動 curl 打對應 worker。Cloud Tasks 只在 429/500 才重試。

## 心法八：Cloud Run 有自己的 schema — Vercel 改了沒用
synthesis 跑在 Cloud Run（兩次 bridge call > 300s），`cloud-run/research-worker/src/index.ts` 是獨立 source。Vercel lib 的 HybridSynthesisSchema 對 Cloud Run 無效，要分開改。

## 心法九：Cloud Run 改完要 build + deploy 才生效
gcloud builds submit → gcloud run deploy，兩步缺一不可。

## 心法十：Mode 1 only 函式加 mode guard
`assembleDeliverables`、`exportReport` 等讀 `recommendation.options.find()`，hybrid mode 沒有 `options`。加：
```typescript
const deliverables = mode === "hybrid" ? { ... empty } : assembleDeliverables(...);
```

## 根本信條
```
tsc 0 error ≠ LLM 不炸
Vercel 部署 ≠ Cloud Run 也更新
lib/ 改完 ≠ route/ 也改完
reset Firestore ≠ Cloud Tasks 會重試
```
