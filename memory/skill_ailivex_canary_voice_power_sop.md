---
name: ailivex-canary-voice-power-sop
description: ailiveX 電源傘外的 canary 語音版本測試 SOP——不碰全域 mode、onSince race 的修法、收尾逐服務驗 minScale
metadata: 
  node_type: memory
  type: skill
  originSessionId: 4001f2fe-3ac7-4715-b1ca-451d95aa1b28
---

**規則**：測傘外 canary 語音版本（不在 `CANARY_VOICE_VERSIONS` 的 vN），供電只精準 scale 目標服務，**不碰 `config/voicePower.mode`**；readiness 靠把 `onSince` 釘在該服務 `agentBootAt` 之前。

**SOP**（2026-08-07 v20m 實戰驗證）：
1. `gcloud run services update ailivex-realtime-agent-<vN> --region=asia-east1 --min-instances=1`
2. Firestore `config/voicePower` 設 `{on: true, mode:'on', onSince: <bootAt 前 60s>}`——mode='on' 只為了讓前端不觸發喚醒流程（喚醒會刷 onSince）；**但見下面的雷**
3. access 指派：`access/{userId}_{characterId}.voiceVersion = '<vN>'`（admin 也吃這個欄位，token route 有專門的 else 分支）
4. 驗 ready：`bootAt > onSince && on` 才發 token；boot 章在 `system_status/voice_agent_ailivex-realtime-<vN>`
5. 收尾：**逐服務**查 `spec.template.metadata.annotations['autoscaling.knative.dev/minScale']` 全歸零＋電源旗標還原 standby/off＋access 指派刪除

**Why**：2026-08-07 v20m 首測連踩兩雷：
- **onSince race**：傘外服務不會被喚醒流程重啟，但喚醒流程照樣刷 `onSince=now` → `bootAt > onSince` 永遠 false → Adam 每按一次撥號越按越糟（「引擎無法啟動」）。
- **mode='on' 拉整傘**：設 mode='on' 觸發 reconciliation，把 v19/v20/v21 全拉 min=1（三顆常駐偷燒）；旗標還原**不會**自動降實例——設定面≠計費面。

**心態**：電源系統的假設是「傘＝全有全無」；傘外 canary 是這個假設的裂縫，每一步都要問「這條判準的前提對傘外成立嗎」。

**How to apply**：照上面 SOP；更乾淨的正解是測試期把 canary 暫加 `CANARY_VOICE_VERSIONS`（voice-power.ts）再拔——代價是要部署 web 兩次。

**觸發信號**：要測不在派工輪替的 vN；前端報「引擎無法啟動」但服務明明 min=1；收尾後帳單/實例數對不上「已關」的認知。

**家族**：[[feedback_cost_verify_billing_meter_not_config]]（計費面收案）、[[feedback_interface_blood_vessel_check]]（onSince 誰讀誰刷）、[[skill_cloudrun_version_retirement]]（LiveKit agent min=0=聾）。
