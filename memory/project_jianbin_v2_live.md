---
name: jianbin-v2 全鏈路上線（2026-04-25）
description: jianbin-v2 部署後 STT/LLM/TTS 三鏈全通，左腦右腦撥號實測成功
type: project
originSessionId: 68bd6c54-6b9b-4e51-a956-90e82bb13b99
---
2026-04-25 jianbin-v2（GCP project `jianbinv3-2026`）部署完成並通過端對端撥號測試。STT（Deepgram）→ LLM（Anthropic Claude）→ TTS（ElevenLabs）三鏈全通，前端「左腦右腦」狀態正常。

**Why:** 上線當天連續修了三個 bug：(1) ElevenLabs key 從 restricted 升 full access（health endpoint 用 GET /v1/voices 探測，需要 voices_read），(2) deepgram-api-key 重寫 v2 拿掉尾端 `\n`，(3) anthropic-api-key 重寫 v2 同樣拿掉 `\n`。詳見 `~/.ailive/jianbin-v2/DEV_LOG.md` 2026-04-25 三筆。

**How to apply:**
- 之後若再聽到「左腦右腦等待中」「Failed to fetch」，先讀 jiangbin-agent / jiangbin-api log，不要先猜 secret
- 紅線：禁止用 `gcloud run services update` 改 jiangbin-api（會移除 cloudsql-instances → 全站 500，2026-04-02 事故記錄）；agent 可以，限 `--min-instances=1`

**位置（本機 / 雲端）**
- 本機：`~/.ailive/jianbin-v2/`，DEV_LOG `~/.ailive/jianbin-v2/DEV_LOG.md`，key 快照 `~/.ailive/jianbin-v2-keys/jianbin_v2_keys_20260425.json`
- 正式網域：https://jianbin3.tonetown.ai（CNAME → ghs.googlehosted.com）
- GCP 專案：`jianbinv3-2026`（project number 564074498736），region `asia-east1`
- Cloud Run：`jiangbin-api`（FastAPI + 前端靜態檔，port 8080）/ `jiangbin-agent`（LiveKit Agent，port 8081，常駐 min-instances=1，no-cpu-throttling）
- Cloud SQL：`jiangbin-db`（PostgreSQL + pgvector）
- LiveKit Cloud：`ailive-nfobc27q.livekit.cloud`（與 ailive 共用，靠 `agent_name` 隔離）
- 部署：push to main → GitHub Actions（`.github/workflows/deploy-gcp.yml`）約 7 分鐘
