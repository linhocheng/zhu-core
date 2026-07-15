---
name: default-switch-standing-instance
description: 家族雷：切 DEFAULT 時所有「顯式覆蓋」都不會自己跟過去——min 實例、canary 版本釘選、流量釘選皆同構；轉正/退役必掃「還有誰顯式指著舊台」
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6bb05abc-65e0-48f5-a7dd-55ea2fdba82d
---

**家族雷（2026-07-15 升級）：切預設值／轉正／退役時，任何「顯式覆蓋」狀態都不隨預設值走。**
已知三例同構：①min=1 常駐歸屬（本檔主文）②canary 版本釘選（ailivex `access.voiceVersion` 釘 v17，v18 轉正沒清、v17 降 0 後變死通話，Adam 的 tracy/Lilith 中招三週沒人發現）③流量釘舊 revision（[[feedback-cost-verify-billing-meter-not-config]]）。
**根治模式**：與其靠轉正 checklist 記得掃，把防禦寫進解析咽喉——ailivex 解法＝登錄表加 `standby` 旗標，`agentNameForVersion()` 對 standby 一律回 DEFAULT，殘留釘選物理無效（v18.14.1，可複用）。

**雷區原文：切 DEFAULT / 轉正新語音版本時，「誰該 min=1」是獨立的一步，路由切了常駐不會跟著切。**

**Why**：cloudbuild 刻意不寫死 min-instances（由電源開關動態控制），這設計假設「服務曾被開關管過」。當天新建的服務從沒被開關碰過 → minScale 缺席＝0。部署後看到的 `registered worker` 是**部署驗證實例**（最長活 15 分鐘）發的——模稜兩可信號：成功與 15 分鐘後死亡都相容。2026-07-10 ailivex v18 轉正差 15 分鐘就是「上架當晚全平台語音變聾」。

**心態**：上架的興奮期最容易把「現在能打通」當「以後都能打通」。LiveKit agent 降 0＝聾不是慢。

**How to apply**：轉正 checklist 三件套——
1. 新版本 min=1（手動 update 或觸發一次開關），驗 minScale annotation
2. 舊版本先移出開關管理名單（[[feedback-standing-cost-only-for-instant-readiness]]：留在名單裡，power-on 會把降 0 的殭屍復活成 min=1）再降 0
3. 鑑別信號＝「min 設定之後的新常駐實例 registered worker」，不是部署後立刻看到的那個

**觸發信號**：切 DEFAULT_VOICE_VERSION／新服務第一次上生產流量／`gcloud run services list` 掃 min>0 發現現役版本不在名單上。

相關：[[feedback-cost-verify-billing-meter-not-config]]（同族——驗「有在燒」也要看對面）、[[feedback-ambiguous-signal-not-proof]]
