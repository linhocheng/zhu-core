# 築的當前指令

**當前任務：** AILIVE Platform — Phase 2 生活節奏
**開始日期：** 2026-03-16
**狀態：** ⬜ 待開始（Phase 1 已完成）

## Phase 1 已完成
- /api/soul-enhance ✅
- /api/insights ✅（hitCount 初始 0）
- /api/knowledge ✅
- /api/dialogue ✅（強制查記憶 + 台北時間 + 每 20 輪提煉）
- /api/line-webhook/[id] ✅（LINE 設定保留，Adam 決定開通時機）
- /api/image/generate ✅
- 端對端驗收通過 ✅

## Phase 2 任務清單
1. /api/runner（Vercel Cron，每小時掃，台北時間 +8）
2. type=learn 任務邏輯（主動搜尋新知 → 存 insight）
3. type=reflect 任務邏輯（每日省思 → 存 insight）
4. type=post 任務邏輯（有 postId → 直接發；沒有 → 生成草稿）
5. /api/sleep（夢境引擎：壓縮 + 升降級 + 靈魂提案）
6. /api/posts（草稿管理 CRUD）
7. /api/tasks（排程任務 CRUD）
8. /api/ig/publish（IG Graph API 發文）
9. platform_soul_proposals collection

## 驗收標準
```
1. 角色每天自動跑任務（insights 有增長）
2. type=post → 草稿寫入 platform_posts（status=draft，有 postId）
3. Adam approve → status=scheduled → runner 下次用 postId 發，不重新生成
4. sleep 每晚壓縮記憶（相似 insights 合併）
```

## 關鍵設計（Blueprint v1 第五章）
- runner 看到 postId 就用已有草稿，沒有 postId 才重新生成（舊平台斷鏈，新平台修正）
- Vercel Cron 是 UTC，runner 收到後轉台北時間 +8 再比對 run_hour
- sleep 觸發條件：每日定時，或 insights 數量超過閾值

## 開工前必讀
cat ~/.ailive/zhu-core/docs/AILIVE_BUILD_LOG.md
