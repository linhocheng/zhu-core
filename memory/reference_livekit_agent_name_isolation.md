---
name: LiveKit Cloud project 共用時必用 agent_name 隔離
description: 多專案共用同一個 LiveKit Cloud project 時，worker 必設 agent_name + token 帶 RoomAgentDispatch.agentName，不要靠 prompt 防呆 reject
type: reference
originSessionId: 68bd6c54-6b9b-4e51-a956-90e82bb13b99
---
LiveKit Cloud 的 dispatch 是「project 級 worker pool」— 同一 project 內所有 registered worker 都可能被分配到任何 room 的 job。如果多個業務（例如江彬 + ailive）共用同一個 LiveKit project，dispatch 會跨業務派工。

**錯誤路徑（光靠 PROJECT_NAMESPACE prompt 防呆）：**
- 江彬 worker 收到 ailive 的 dispatch → 看 room name 不是 `jiangbin-` 前綴 → reject
- 但 LiveKit 認為 dispatch 已被消費，不會 fallback 給其他 worker
- ailive worker 永遠不接，前端永遠 `waiting-agent`，無聲失敗

**正確路徑（agent_name 隔離）：**
1. worker 端：`WorkerOptions(agent_name="ailive-realtime", ...)` 顯式註冊 name
2. token 端：`RoomConfiguration({ agents: [new RoomAgentDispatch({ agentName: "ailive-realtime" })] })` 顯式 dispatch 指定 name

LiveKit explicit dispatch by name → 只有 name 匹配的 worker 會被 dispatch，跨業務不互相干擾。

**對應江彬 CLAUDE.md 第 15 條（治本警告）：** 共用憑證跨專案 dispatch 是高頻事故，**永遠不要**靠 prompt 防呆 reject 解，用 `agent_name`。

**證據：** 2026-04-27 ailive 即時撥號上雲時親踩，已記錄在 `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260427.md` 第 5 條。
