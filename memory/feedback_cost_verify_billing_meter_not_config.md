---
name: cost-verify-billing-meter-not-config
description: 天條：宣告「不燒錢了」的鑑別信號是計費錶歸零（billable_instance_time/instance_count），不是 minScale 設定畫面
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0fb48042-7502-4185-8ecc-51985c11164a
---

**規則**：費用清理的收案標準一律是**計費指標歸零**，不是設定值。設定面、實例面、計費面是三件事，中間隔著：流量釘舊 revision（min 跟 serving revision 走）、部署驗證實例（每次設定變更起一顆活最長 15 分鐘）、graceful drain（通話/長連線撐著實例不死）。

**Why**：2026-07-05「16 台降 0 複核全過」複核的是 annotation，實際漏了一台——`ailive-realtime-agent` 流量釘在 5/23 舊 revision（min=1），照燒到隔天用計費指標才抓到。2026-07-06 語音開關「關了還接通」連三次誤判，全是把設定當實例。

**心態**：「複核全過」四個字最危險的時刻，是複核對象選錯的時候——查證流程走完了，查的卻是會說謊的那一面。

**How**：
- 掃常駐：Monitoring API `run.googleapis.com/container/instance_count`（ALIGN_MAX，groupBy service/revision）＋ `billable_instance_time`
- 掃真相分裂：`status.traffic[].revisionName` ≠ `latestReadyRevisionName` 就有詐
- 掃全域：`gcloud run services list` 不帶 --region（抓跨 region 殭屍）

**觸發信號**：「複核全過」但對象是設定值；帳單曲線跟「已清理」認知對不上；查詢視窗蓋在變更時間點之前（零資訊）。

相關：[[feedback_ambiguous_signal_not_proof]]（本條是它的費用版）、[[standing-cost-only-for-instant-readiness]]
