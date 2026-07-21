---
name: skill-cost-on-heartbeat-failure-accounting
description: 只在成功路徑記帳的系統，燒最兇的時刻（超時/重試/中斷）恰好隱形——cost 要隨心跳增量寫回，SIGKILL 不走 catch
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**規則**：計費類累計（API 呼叫數、引擎費）必須**隨心跳/進度增量寫回**持久層，不能等任務結束一次結帳。catch 補帳只擋得住例外，擋不住 SIGKILL（task-timeout、OOM、節點回收）——那些死法根本不執行 catch。

**Why**：2026-07-21 geo-authority 兩輪監測超時被殺，引擎真燒 ~$5.43、job 帳上 $0.00，從 runs 原始資料逐筆重算才現形。更深的傷：**月預算閘讀的就是 job cost——失敗不記帳＝預算閘對失敗重試風暴全盲**，單租戶可以在帳面 $0 的狀態下燒穿共用池。

**心態**：這是「驗費用看計費錶不看設定」天條的鏡像——那條說別人的錶會騙你，這條說**自己的錶也會漏帳**。帳本的盲區永遠開在最貴的地方，因為失敗路徑就是燒錢路徑。

**How**：
- 長任務每次心跳順手帶上已累計 cost（同一筆 doc update，零額外寫入成本）；被殺也留最後一筆
- catch 路徑同樣補帳（累計器宣告在 try 外才搆得到）
- 稽核成本時用原始事件層（runs/logs 的 searchCount）重算對帳，不只信任務層彙總
- 設計預算閘時自問：「這個閘在任務失敗一半時看得見已燒的錢嗎？」

**觸發信號**：cost/estUsd 只出現在 status='done' 的寫回；帳面數字與外部帳單曲線對不上；任務有 timeout/SIGKILL 死法但帳務只寫在結尾。

關聯：[[feedback-cost-verify-billing-meter-not-config]]、[[feedback-capacity-constants-expire]]
