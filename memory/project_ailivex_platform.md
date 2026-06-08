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

**語音斷點調查（2026-06-08，未解）：**
- 第一根因已修：us-central1 有重複 `ailivex-realtime-agent` 服務（跨 region 殭屍，跑舊 code thrash 9h），偷一半 LiveKit dispatch → 一半通話沒聲音。已刪，現只剩 asia-east1 `00001-thj`（registered 乾淨，min-instances=1）。
- 第二根因（仍在）：撥通後 `Session started`→`Initial greeting sent` 之後 **整整 95 秒零 log**，TTS 包裝器的 `MiniMax TTS text:` 連印都沒（agent/minimax_tts.py:115）→ 招呼語的 LLM 從沒生出文字 → TTS 沒被呼叫 → 沒聲音。LLM(Bridge 串流)這條鏈卡死。
- 已排除：tool_use-on-bridge（ailive 也帶 tools 走同 bridge）、caching=ephemeral（ailive 也設）、bridge VM 掛掉（/health 200、/v1/messages 401 都 <1s 很快）、zombie dispatch（已修）。
- **最尖的待查線索**：未證實「ailive 語音真的走 Bridge」——若 ailive prod Cloud Run 其實設了 ANTHROPIC_API_KEY 走直連 Haiku，則 **livekit anthropic-plugin + Bridge 串流路徑從沒被驗過**，ailiveX 是第一個踩，串流靜默 hang 就說得通。
- 決定性測試被擋：讀 BRIDGE_SECRET 被 settings 層 deny（不暴露密鑰紅線），curl bridge 帶真 auth 跑不了。
- **下次第一件**：擇一 — (a) agent 加 LLM 級 instrumentation log（llm 呼叫前/首 token/完成/TTS 進入）重部署，Adam 撥一通就定位；(b) Adam 核 ailive Cloud Run env 是否走直連 key；(c) 經 Adam 同意臨時切 ANTHROPIC_API_KEY 直連驗證是否 bridge 串流問題（會燒錢，需同意）。

**其他待完成：** ailiveX-platform git init + push GitHub；清 3 個 pending doc jobs。

**How to apply:** 處理 ailiveX 相關問題時，認識這是全新 GCP 專案（ailivex-2026）與 ailive 完全隔離。admin / ailiveX2026。語音「沒聲音」先查 LLM/Bridge 串流斷點，不是 TTS 也不是 dispatch。
