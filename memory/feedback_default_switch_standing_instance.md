---
name: default-switch-standing-instance
description: 切 DEFAULT 到新 Cloud Run 服務時，min=1 常駐歸屬不會自己跟過去——新服務靠部署驗證實例撐 15 分鐘然後全聾
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6bb05abc-65e0-48f5-a7dd-55ea2fdba82d
---

**雷區：切 DEFAULT / 轉正新語音版本時，「誰該 min=1」是獨立的一步，路由切了常駐不會跟著切。**

**Why**：cloudbuild 刻意不寫死 min-instances（由電源開關動態控制），這設計假設「服務曾被開關管過」。當天新建的服務從沒被開關碰過 → minScale 缺席＝0。部署後看到的 `registered worker` 是**部署驗證實例**（最長活 15 分鐘）發的——模稜兩可信號：成功與 15 分鐘後死亡都相容。2026-07-10 ailivex v18 轉正差 15 分鐘就是「上架當晚全平台語音變聾」。

**心態**：上架的興奮期最容易把「現在能打通」當「以後都能打通」。LiveKit agent 降 0＝聾不是慢。

**How to apply**：轉正 checklist 三件套——
1. 新版本 min=1（手動 update 或觸發一次開關），驗 minScale annotation
2. 舊版本先移出開關管理名單（[[feedback-standing-cost-only-for-instant-readiness]]：留在名單裡，power-on 會把降 0 的殭屍復活成 min=1）再降 0
3. 鑑別信號＝「min 設定之後的新常駐實例 registered worker」，不是部署後立刻看到的那個

**觸發信號**：切 DEFAULT_VOICE_VERSION／新服務第一次上生產流量／`gcloud run services list` 掃 min>0 發現現役版本不在名單上。

相關：[[feedback-cost-verify-billing-meter-not-config]]（同族——驗「有在燒」也要看對面）、[[feedback-ambiguous-signal-not-proof]]
