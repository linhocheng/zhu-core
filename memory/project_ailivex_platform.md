---
name: ailiveX 平台進度
description: ailiveX walking skeleton 七 Phase 全通狀態 + 待驗項目
type: project
originSessionId: d44171fd-41c9-4648-9b8d-6bd6aaaee3ef
---
ailiveX walking skeleton Phase 0-7 全通（2026-06-06 夜）。

**Why:** Adam 要複刻精簡版 ailive，架構翻成「用戶為中心」——用戶×角色各記記憶，不共享。

**架構要點：**
- Next.js 16 App Router，Vercel 部署，GCP project `ailivex-2026`
- 帳號：scrypt + 簽章 httpOnly cookie，admin 建帳並指派
- 記憶：嚴格綁 (userId, characterId)，Vertex AI embedding-004
- 工具：文字標記 `[[REMEMBER]]` / `[[DOCUMENT]]`（bridge 不支援 tool_use）
- 語音：LiveKit Cloud + Python agent（Cloud Run `ailivex-realtime-agent`）
- 文件：Cloud Tasks → doc-worker（Cloud Run `ailivex-doc-worker`）→ GCS `ailivex-2026-assets`

**已知帳號：** admin / ailiveX2026

**待完成：**
- Phase 6 真機語音撥話驗收（Cloud Run registered，但未真打電話）
- ailiveX-platform git init + push GitHub
- 清 3 個 pending doc jobs

**How to apply:** 處理 ailiveX 相關問題時，認識這是全新 GCP 專案（ailivex-2026）與 ailive 完全隔離。admin 密碼已重設。
