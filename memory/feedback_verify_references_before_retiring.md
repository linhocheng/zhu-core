---
name: feedback_verify_references_before_retiring
description: 退役/降冷備/刪除一個資源前，先查真實引用（誰還指向它），別靠「它角色設計上不該有人用」的架構推論
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

要退役、降冷備、刪除、或改變一個資源的可用性之前（語音版本、API 版本、DB 欄位、feature flag、Cloud Run service），**先查真實引用——誰此刻還指向它——用資料查，不用架構推論**。

**Why**：資源的「設計角色」（例如「v18 是熱回滾坑位、不服務真人」）是推論，不是事實。管道存在性/引用關係是每個對象獨立的事實，一次 query 就能換一個不用認錯的斷言。退役一個「應該沒人用」但其實有人釘著的資源＝靜默斷靈魂型的雷（LiveKit agent 降 min=0＝聾，被釘住的用戶通話直接壞）。

**心態**：心裡冒出「這是回滾坑位／舊版／deprecated，應該沒人用了」時，那個「應該」正是要去 query 的訊號。這是 [[reference_zhu_impressions_layer]] 印象 #6（架構推論冒充現場證據）在「資源退役」情境的落地招式。

**How to apply**：動手前寫一次性 query（Firestore/DB/grep 引用），列出所有還指向該資源的對象，數量＋清單都印出來。零引用才安全退；有引用先遷移或先問。ailiveX v18 降冷備前（2026-07-22）：query `access` 集合 34 筆全 `voiceVersion` unset→走 DEFAULT，零人釘 v18→退冷備零風險，驗了才動手。

**觸發信號**：任務是「退掉/降級/清理一個舊資源」，且你對「沒人用它」的信心來自它的角色定位而非一次查詢。

家族：[[feedback_backend_client_must_sync]]（改後端同步客戶端）、[[feedback_defend_at_convergence_point]]（收斂點防禦）、[[skill_cloudrun_version_retirement]]（Cloud Run 版本退役紀律）。
