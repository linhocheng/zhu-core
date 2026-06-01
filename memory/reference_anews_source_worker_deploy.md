---
name: ANEWS source-worker 部署拓樸 + A/B 雙管道
description: ANEWS source worker 在哪個 GCP 專案、怎麼部署、A/B 情報管道如何分支
type: reference
originSessionId: 13a7f36d-0420-4ca0-b0bc-25a96f5d357e
---
ANEWS source worker（情報步驟）部署在 GCP 專案 **`zhu-cloud-2026`**（proj# 754631848156, region `asia-east1`），**不是** moumou-os。
- moumou-os 只放 ANEWS/moumou 共用的 **default Firestore DB**；Cloud Run worker 在 zhu-cloud-2026。
- Cloud Run service：`anews-source-worker`，URL `https://anews-source-worker-754631848156.asia-east1.run.app`，SA `754631848156-compute@developer.gserviceaccount.com`。
- 部署鐵律：**`gcloud run deploy --source cloud-run/source-worker` 從 source 重 build**，不可單用 `--update-secrets` 重用舊 image（會讀錯設定，踩過）。--source + --update-secrets/--update-env-vars 同時用 OK（會 rebuild + merge，不會掉既有 env）。

**A/B 雙管道**（per-issue，2026-06-01 上線）：
- issue doc 帶 `sourceProvider`（"A" 預設 / "B"），建立表單選，worker 讀 issue doc 分支。
- A = Haiku 4.5 直連 Anthropic web_search（付費 key，secret `anews-anthropic-key`）。
- B = Max 生查詢 → 真 Tavily 搜（secret `TAVILY_API_KEY`，免費 1000 credits/月）→ Max 綜述（走 bridge，secret `BRIDGE_SECRET` + env `BRIDGE_URL=https://bridge.soul-polaroid.work`）。B 在現有量下成本 ~$0。
- B 失靈**不自動 fallback 回 A**（會偷燒付費 key）；停既有 needs_repair，要換 A 由人重建 issue。
- code：`cloud-run/source-worker/src/{schema,tavily,index}.ts`；schema 抽共用避免兩管道真相分裂。
- 已知風險：B 綜述 ~109s 逼近 bridge Cloudflare ~130s 524 天花板（Adam：撞到再處理）。
