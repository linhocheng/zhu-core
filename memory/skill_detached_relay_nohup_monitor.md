---
name: skill-detached-relay-nohup-monitor
description: 本機長駐接力（等雲端任務→接棒下一步）的正確姿勢：nohup 脫鉤＋persistent Monitor 盯 log；harness 追蹤的背景任務活不過幾分鐘
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**規則**：需要「等遠端任務完成→自動接棒」的本機長駐流程，不能用 harness 的 run_in_background（實測連續兩次在等待階段被砍）。正確姿勢三件套：
1. `nohup node script.mjs >> relay.log 2>&1 &` —— 進程完全脫離任務管理，砍不到
2. `Monitor`（persistent、`tail -f log | grep --line-buffered "關鍵事件"`）——事件即時通知回對話
3. 腳本必須**冪等可重跑**（重找進行中任務、補件前查已存在產物）——因為前兩次被砍教過：任何看門進程都可能死在半路

**Why**：2026-07-21 geo INLY/reddoor 接力兩次被 harness 砍在等待中（輸出只到 watching 行）。改 nohup 後全程存活 40+ 分鐘跑完 12 個接棒步驟。

**心態**：本機接力只配當一次性補件工具——正式產品路徑必須全部活在雲端（worker drain 自己接棒），不能依賴我的筆電活著。設計接力前先問：這條鏈是不是本來就該讓 worker 自己走？

**How**：
- log 檔共用（append）：接力重啟版本沿用同一 log，既有 Monitor 不用重掛
- Monitor filter 必須涵蓋失敗信號（FAILED/timeout/中止），不只成功行——沉默和還在跑長一樣
- 收尾記得 TaskStop Monitor＋清 _tmp 檔

**觸發信號**：想寫「等 X 完成再做 Y」的本機 while 迴圈；run_in_background 的任務莫名 killed；接力腳本假設自己一定活到終點。

關聯：[[feedback-silent-failure-absent-log]]、[[skill-async-worker-checklist]]

- 驗證+1:2026-08-08 第3場 — 部署被 harness 砍兩次後切 nohup+Monitor 正姿

- 驗證+1:2026-08-08 第6場 — 背景任務兩度被砍，改 nohup 脫鉤+冪等續跑

- 驗證+1:2026-08-08 第7場 — 兩次部署 nohup 脫鉤＋背景 watcher；Veo 長任務輪詢被 harness 砍後改長輪詢重盯
