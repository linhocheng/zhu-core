---
name: LiveKit Agents 1.5.x token 必帶 RoomConfiguration
description: 1.5.x 預設 explicit dispatch，token 不帶 RoomConfiguration.agents 等於不 dispatch，worker 永遠閒置無聲失敗
type: reference
originSessionId: 32b08dfd-50e3-4004-bca4-32e3494f2ef9
---
LiveKit Agents 1.5.x 新 project 預設「explicit dispatch」模式，照 1.3.x 文件教學寫 token **保證踩雷**。

**症狀：** worker register 成功（log 有 "registered worker"），用戶連進房後 agent 永遠不接，前端卡「等待 agent…」，worker 端**沒任何錯誤訊息**——典型無聲失敗。

**根因：** token 沒帶 `RoomConfiguration.agents`，LiveKit 不會 push job 給 worker。

**修法（token API 端，TypeScript）：**
```ts
import { RoomConfiguration, RoomAgentDispatch } from '@livekit/protocol';

at.roomConfig = new RoomConfiguration({
  agents: [
    new RoomAgentDispatch({
      agentName: 'ailive-realtime',  // 必帶，與 worker 端 WorkerOptions.agent_name 對應
      metadata: JSON.stringify({...}),
    }),
  ],
});
```

**搭配 agent_name 隔離一起用** — 見 `reference_livekit_agent_name_isolation.md`，兩條一起才能在共用 LiveKit project 下正確 dispatch。

**證據：** 2026-04-27 ailive 即時撥號上雲時親踩，記在 `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260427.md` 第 3 條。
