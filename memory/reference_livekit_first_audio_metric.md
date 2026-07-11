---
name: livekit-first-audio-metric
description: LiveKit 首音延遲量測——用 ActiveSpeakersChanged 不用 TrackSubscribed，前端量比 agent 量更貼近體驗
metadata: 
  node_type: memory
  type: reference
  originSessionId: a9b7d636-5be7-4a6c-8713-dac420bae156
---

LiveKit 語音體驗量測（首音延遲）的正確做法：

- **`TrackSubscribed` 不是「出聲」**——agent 一進房就發布音軌,那時還沒開口。用它量首音會嚴重低估。
- **`ActiveSpeakersChanged` 才是真的出聲**——LiveKit 服務端算音量,第一次遠端 participant 進 activeSpeakers = 用戶真的聽到了。filter `!s.isLocal`。
- **前端量比 agent 內部量好**：t0=按下撥號,含 token+建線+dispatch+agent 冷載+LLM 首 token+TTS 首塊全程——這才是用戶體感。agent 自己量不到 dispatch 前的等待。
- **同時記 `connectMs`**（room.connect 完成)可拆解慢在建線還是 agent 首回合。
- 回報路徑：mid-call `fetch(keepalive:true)` 打 API 寫進 session doc（每通一次,ref flag 防重）;量測失敗不擋通話。

實測基線（2026-07-11,ailivex v18,min=1 暖機台）：connectMs 3.3s / firstAudioMs 18.0s → **14.7s 在 agent 首回合**,與負載實測爆發 27s 同族。拆解 agent 內部要打點,屬下個語音版本。

實作：ailivex-platform v18.7.0（`/api/voice-metrics` + realtime page ActiveSpeakersChanged handler + ops_rollups 聚合 + 監控頁 p50/p95,警示線 15s）。[[new-cron-three-places]]
