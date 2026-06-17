---
name: LiveKit Agents 1.5.1 即時語音「中途控制」四原語
description: 做語音通話中暫停/打斷/改context/收前端訊息的功能前先讀；1.5.1 驗過的 API 入口，免再翻源碼
type: reference
originSessionId: 45876f35-71c4-410e-b290-198bde424c27
---
在 LiveKit Agents `1.5.1`（rtc `1.1.3`）做「即時語音通話中途控制」類功能（暫停聽、打斷自己、mid-call 改角色 context、收前端指令）時，這四個是驗過存在的原語入口——動碼前不必再沙推，但用前仍 grep 一下版本沒漂：

1. **暫停「聽」**：`session.input.set_audio_enabled(False/True)`（`livekit/agents/voice/io.py` `AgentInput.set_audio_enabled`）。關閉=角色停止接收麥克風/STT；恢復=重新 attach。注意：stream 未設時會 warn，通話進行中是設好的。
2. **掐掉當前發話**：`session.interrupt(force=False)`（回 `asyncio.Future`，可不 await）。
3. **mid-call 改角色 context**（讓角色「現在就讀到新東西」）：`agent.update_instructions(str)`（替換系統 instructions，最簡單；我都維持 base + 累積區塊重設）或 `agent.update_chat_ctx(ChatContext)`（兩者皆 async，`livekit/agents/voice/agent.py`）。
4. **收前端訊息**：`ctx.room.local_participant.register_rpc_method(name, async handler)`（handler 收 `RpcInvocationData`，`.payload:str`，回 str——**前端能 await 到處理完成**，比 data channel 適合「貼了→等角色讀完」）；或 `ctx.room.on("data_received")`（單向廣播）。前端 livekit-client：`room.localParticipant.performRpc({destinationIdentity, method, payload})`，destinationIdentity = agent participant（在 `RoomEvent.ParticipantConnected` 撈 `p.identity`）。

**Why**：2026-06-17 做 ailivex v12「通話中讀網址」，計畫依賴「agent 能暫停+改 context+收前端 data」這個可量測前提。照 `feedback_sandtable_not_validation` 沒假設「應該能」，直接 grep 裝在 `site-packages/livekit/agents` 的源碼，四個全找到 → 計畫有根。產出 = `agent/source_intake.py` 的暫停→「我看一下哦」→抓取→注入→恢復迴圈（ailivex-platform）。

**How to apply**：未來任何「語音通話中要插一個非語音的動作（讀檔/查資料/切狀態）」都用這組：interrupt+set_audio_enabled 做暫停殼，update_instructions 做 context 注入，register_rpc_method 做前端↔agent 握手（前端能 await 完成收掉 loading 動畫）。版本若非 1.5.x 先重驗，API 在 livekit-agents 改名頻繁。
