---
name: ailivex-doc-worker-true-source
description: ailivex 文件生成唯一 worker=~/.ailive/ailivex-doc-worker（asia-east1、POST /、repo linhocheng/ailivex-doc-worker）；死副本已於 2026-07-04 全清
metadata: 
  node_type: memory
  type: reference
  originSessionId: 96008891-de26-439a-acd6-f9cc46ed26e0
---

ailiveX 文件生成的 Cloud Run worker 有**兩台同名服務、兩份不同源碼**：

| | 真身（生產流量） | 死副本 |
|---|---|---|
| 源碼 | `~/.ailive/ailivex-doc-worker/`（**獨立 git repo：linhocheng/ailivex-doc-worker，private**） | ~~ailivex-platform repo `cloud-run/doc-worker/`~~（已刪） |
| region | **asia-east1**（`...-de.a.run.app`，Vercel `CLOUD_RUN_DOC_WORKER_URL` 與 agent `DOC_WORKER_URL` 都指這） | ~~us-central1~~（服務已刪 2026-07-04） |
| route | `POST /`（x-worker-secret） | `POST /process` |
| log 簽名 | `[worker] job=... done` | `[doc-worker] listening` |
| 部署 | `cd ~/.ailive/ailivex-doc-worker && bash scripts/deploy.sh` | repo cloudbuild（別用） |

**Why**：2026-07-04 簡繁轉換修了 repo 版＋部署 us-central1，e2e 也只打了 Vercel doc-process——生產文件照樣簡體。破口=修好的東西沒在生產路徑上，而驗證漏了「文字對話實際走的那台」。ailivex CLAUDE.md 寫「doc-worker 在 us-central1」也是錯的。
**How to apply**：改文件生成邏輯改 `~/.ailive/ailivex-doc-worker/src/index.ts`；驗證必打真身（最穩=走生產鏈：dialogue 建文件→查 mdContent）；抓雙城殭屍用無 --region 的 `gcloud run services list`。
**觸發信號**：改了 doc-worker 沒生效／log 簽名對不上源碼／revision 名不在 revision 列表裡。

同型陷阱：[[reference-ailive-strategy-pipeline]]（strategy-worker Vercel route 死副本）、LiveKit 跨 region 殭屍。真身另有既知小債：secret 檢查是 fail-open 寫法（env 有設所以未爆）、本機跑會撞 bridge CF 524（生產 Secret Manager 的 BRIDGE_URL 疑似直連所以能跑長任務）。～～版控債已還：2026-07-04 git init + push linhocheng/ailivex-doc-worker～～
2026-07-04 晚：真身已接文字過濾器（vendored text-filter.ts，鏈=轉繁→句型過濾→轉繁，rev 00006-pw6 誘餌 e2e 過）。
