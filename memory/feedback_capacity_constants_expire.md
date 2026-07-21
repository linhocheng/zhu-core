---
name: feedback-capacity-constants-expire
description: 容量常數（timeout/批量上限/視窗）是「當時規模」的快照，平台每長大一步都要回頭重驗，否則舊常數變定時炸彈
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**規則**：任何容量常數（task-timeout、maxSearchesPerBatch、rate 視窗、佇列上限）都隱含「定值當下的規模假設」。平台成長事件（加引擎、加租戶、cron 合併、開並行）發生時，第一動作之一是把受影響的常數清單重新推導，不能等爆。

**Why**：2026-07-21 geo-authority 兩輪監測雙雙撞死 60 分 task-timeout（Cloud Run 明寫 "configured timeout was reached"，$5.43 引擎費打水漂）。60 分是「單租戶×四引擎」時代定的；後來加第五引擎（AIO）、租戶 1→3、cron 合併成單執行串行 drain（週一兩家 ≈104 分）——三個成長事件沒有一個回頭驗過這個常數。就算當天不並行爆，下週一 cron 也必爆。

**心態**：常數不是設定，是斷言——「這個系統在這規模下 X 秒內一定跑得完」。斷言的前提變了，斷言就要重新證明。「上週還好好的」恰恰是危險信號，因為上週和這週的規模不同。

**How**：
- 成長事件 checklist：加引擎/加租戶/改排程拓樸/開並行 → grep 部署腳本與 code 裡所有數字常數，逐一問「這個數字的推導前提還成立嗎」
- 定容量常數時在旁邊註解寫清推導式（如「單租戶一輪 ~52 分 × 每日最多 N 家」），未來重驗才有地基
- 串行合併是隱形放大器：把多個 cron 合併成單執行 drain 時，timeout 要用「當日總和」不是「單件」

**觸發信號**：新引擎/新租戶上線；cron 合併或 drain 模式改動；任務時長逼近 timeout 的 80%；「以前都跑得完」的念頭。

關聯：[[feedback-solve-root-not-symptom]]、[[skill-cost-on-heartbeat-failure-accounting]]
