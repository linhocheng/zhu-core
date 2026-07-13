---
name: livekit-egress-recording-landmines
description: LiveKit Egress 伺服器端錄音整合四雷——預建房吞派工/listEgress 空 fileResults/webhook 簽名 key 要選對/audio-only 禁 layout
metadata: 
  node_type: memory
  type: reference
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

LiveKit Egress 錄音整合（2026-07-13 ailivex 對話錄音實戰，v18.11.0–v18.12.0）：

1. **預建房吞派工**：token 上的 `RoomConfiguration`（含 RoomAgentDispatch）**只在 join 時自動建房才生效**；為掛 auto egress 而 `RoomServiceClient.createRoom()` 預建房後，用戶 join 既有房間、token 派工設定被無聲忽略 → agent 永遠不進房（死寂）。正解：`createRoom({ name, egress, agents: [new RoomAgentDispatch({agentName, metadata})] })`——派工跟著建房走。
2. **listEgress 對已完成 egress 回空 fileResults**（實測）：duration/size 只在 `egress_ended` webhook payload 裡有。reconcile 兜底要用 EgressInfo 頂層 `startedAt/endedAt`（bigint 奈秒）相減算時長。
3. **webhook 簽名 key 要選對把**：共用 LiveKit project（多業務多把 key）時，dashboard 建 webhook 預設可能選到別把 key → 平台 WebhookReceiver 全 401。鑑別法：自簽一發測試 webhook 打自己的 route（AccessToken + sha256 claim），200 = 接收端健康，問題在 dashboard 選 key。
4. **計費雷**：audio-only 錄音絕不能設 layout / customBaseUrl——一設就進視訊轉碼管線（$0.02/分 vs $0.005/分）。混流 RoomComposite audioOnly = $0.005/分。

配套模式（ailivex 實作，可搬）：fail-closed（開錄角色 egress 建不起來就不發 token，堵死「以為在錄其實沒錄」）；webhook 秒收＋reconcile 十分鐘對帳雙保險；GCS 上傳用專用最小權限 SA（bucket 級 objectCreator only）。去空白濃縮：ffmpeg-static 進 Vercel lambda 可行（serverExternalPackages + outputFileTracingIncludes 指到二進位），`silenceremove` -40dB/1.5s/留0.4s 實測 3:40→1:58。

相關：[[reference_livekit_1_5_room_configuration]]、[[reference_livekit_agent_name_isolation]]
