# 築的當前指令

**當前任務：** AILIVE Platform — Phase 1 一個角色活起來
**開始日期：** 下次 session
**狀態：** ⬜ 待開始（Phase 0 已完成）

## Phase 0 已完成
- ailive-platform.vercel.app ✅
- /api/ping ✅
- /api/characters GET + POST ✅
- Firebase 接通 ✅

## Phase 1 任務清單
1. /api/soul-enhance（七咒律鑄魂爐）
2. /api/line-webhook/[id]（LINE Webhook，多角色入口）
3. /api/dialogue（對話引擎：靈魂 + 台北時間 + 記憶）
4. /api/insights（platform_insights，hitCount 初始值必須是 0）
5. /api/knowledge（知識庫 + 語義搜尋）
6. /api/image/generate（Gemini 2.5 Flash Image）
7. 時間注入：每次對話 system prompt 加台北時間
8. 強制查記憶：對話前語義搜尋 insights + knowledge

## 驗收標準
```
1. LINE 傳訊息給角色 → 有回覆
2. 對話後 platform_insights 有新 insight（hitCount=0）
3. 再問相同話題 → hitCount 變成 1
4. 生圖：角色臉部一致
```

## 開工前必讀
cat ~/.ailive/zhu-core/docs/AILIVE_BUILD_LOG.md
