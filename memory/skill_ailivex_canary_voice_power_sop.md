---
name: ailivex-canary-voice-power-sop
description: ailiveX 電源傘外的 canary 語音版本測試 SOP——readiness 已 per-service 化（2026-08-08），測前抄現狀、旗標先於用戶開頁、收攤三件一組
metadata: 
  node_type: memory
  type: skill
  originSessionId: 4001f2fe-3ac7-4715-b1ca-451d95aa1b28
---

**規則**（2026-08-08 大改：readiness 根治後舊的 onSince 釘法作廢）：測傘外 canary（不在 `CANARY_VOICE_VERSIONS` 的 vN），供電只精準 scale 目標服務，**不碰 `config/voicePower.mode` 的 reconciliation 路徑**（直寫 Firestore 旗標，不走 setVoiceMode/setVoicePower API）。

**SOP**（2026-08-08 v20m 二測驗證）：
1. **測前第一動作：抄下 `config/voicePower` 現狀全文**（收攤要還原到「記錄的前置狀態」，不是假設的預設）
2. `gcloud run services update ailivex-realtime-agent-<vN> --region=asia-east1 --min-instances=1`
3. Firestore 直寫 `config/voicePower` `{on:true, mode:'on'}`——**必須在用戶打開撥號頁之前**：wake 是前端開頁就打的，旗標還是 off 時用戶一開頁就觸發 `wakeVoiceEngine` → 整傘 v19/v20/v21 拉 min=1（2026-08-08 實測踩到）
4. access 指派：`access/{userId}_{characterId}.voiceVersion = '<vN>'`（admin 也吃這個欄位）
5. 等 boot 章新鮮：`system_status/voice_agent_ailivex-realtime-<vN>.agentBootAt` 距今 <5 分鐘才叫用戶撥。readiness 判準已 per-service 化（`voice-power.ts voiceEngineReady`：傘外服務無 wakeAt → boot 章在即 ready），**不再需要釘 onSince**
6. 收攤三件一組：① 旗標照步驟 1 抄的現狀還原 ② **逐服務**（含傘內 v19/v20/v21——測試中可能被合法喚醒拉起）查 `minScale` annotation 歸零 ③ access 指派刪除

**Why**：
- 2026-08-07 首測 onSince race＋mode='on' 拉整傘兩雷 → 2026-08-08 根治：`setVoicePower` 逐服務蓋 `wakeAt` 章、ready 比自己的 wakeAt；傘外無 wakeAt 即 ready。
- 2026-08-08 二測仍踩：用戶開頁先於旗標寫入 → wake 合法拉傘；收攤只還原旗標沒降實例 → 旗標關/實例燒的真相分裂（設定面≠計費面自己造）。

**心態**：測試佈景是和「活著的系統＋活著的用戶」搶時序——佈景要在用戶碰到任何入口之前完成；收攤面對的是「測試期間被合法路徑改過的狀態」，不是你佈景時的快照。

**觸發信號**：要測不在派工輪替的 vN；收攤後帳單/實例數對不上「已關」的認知；傘內服務莫名 min=1。

**家族**：[[feedback_cost_verify_billing_meter_not_config]]（計費面收案）、[[feedback_interface_blood_vessel_check]]（wake 誰觸發）、[[skill_cloudrun_version_retirement]]（LiveKit agent min=0=聾）。

驗證+1: 2026-08-08 第1場 — 供電/access/boot章流程照走全通；同場踩到「旗標晚於開頁」與「收攤半套」兩雷，正文即時重寫

- 驗證+1:2026-08-08 第1場 — 撥測供電照走（本場後半 SOP 被 readiness 根治取代，正文已重寫）
