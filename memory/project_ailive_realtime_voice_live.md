---
name: ailive 即時語音上線（2026-04-27）
description: ailive-platform 即時撥號 MVP 端到端通了，LiveKit + Cloud Run agent + Deepgram + Haiku + MiniMax，吉娜聲音 fallback
type: project
originSessionId: 32b08dfd-50e3-4004-bca4-32e3494f2ef9
---
ailive-platform 即時語音 Phase 0-4 完成，2026-04-27 上線。

**Why:** 把江彬即時撥號 pipeline 移植過來，補齊 ailive 三模式（文字 dialogue / 按鈕語音 voice-stream / 即時撥號 agent）裡缺的最後一塊。

**How to apply:** 涉及即時語音相關工作時往這找——
- 鏈路：LiveKit Cloud → Cloud Run agent → Deepgram STT + Claude Haiku LLM + MiniMax TTS（吉娜聲音 fallback）
- 入口：`/realtime/[characterId]`，附 5 燈環境偵測 panel（lk-token / lk-connect / agent-publish / stt / tts）+ 一鍵複製診斷
- 版號跨度：v0.2.5.001 → v0.2.5.010
- 全部血淚記在 `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260427.md`（5 條）

**位置（本機 / 雲端）**
- 本機平台：`~/.ailive/ailive-platform/`（Next.js）
- 本機 agent：`~/.ailive/ailive-platform/agent/`（main.py / realtime_agent.py / minimax_tts.py / firestore_loader.py / promise_reflection.py / user_profile.py / user_observations.py）
- 本機記憶共用層：`~/.ailive/ailive-platform/src/lib/`（episodic-memory.ts / character-actions.ts / user-profile.ts / user-observations.ts / promise-reflection.ts / time-rules.ts）
- 本機即時撥號頁：`~/.ailive/ailive-platform/src/app/realtime/[characterId]/`
- 平台正式：https://ailive-platform.vercel.app（Vercel，alias `ailive-platform-6m8q8y2z8`）
- GitHub：`github.com/linhocheng/ailive-platform`
- GCP 專案：`ailive-realtime-2026`，region `asia-east1`
- Cloud Run：`ailive-realtime-agent`（agent_name `ailive-realtime`，目前 revision `00020-wwl`），URL https://ailive-realtime-agent-7lypa2fqda-de.a.run.app
- Artifact Registry：`asia-east1-docker.pkg.dev/ailive-realtime-2026/ailive-agents/realtime-agent`
- LiveKit Cloud：`ailive-nfobc27q.livekit.cloud`（與江彬共用，必設 `agent_name="ailive-realtime"` + token `RoomAgentDispatch.agentName`）

**未解決（Phase 7 待辦）：** 即時撥號 agent 還沒接 LiveKit Agents `function_tool` registry，所以 `record_promise` / `update_user_profile` / `record_user_observation` 三個寫記憶的 tool 在即時撥號模式下全部沒接——目前即時撥號**讀記憶**全通，但**寫不回**。
