---
name: Live Media 建置計劃（已暫停 2026-05-09）
description: AI 角色媒體公司 v2.0，2026-05-09 起整條鏈降為 directive=0 暫停，主力轉 molowe-platform
type: project
originSessionId: 3b96bb42-5604-4efe-8f30-17f33cd4f9e4
---

## 狀態：已暫停（2026-05-09 Adam 拍板）

**主力轉 molowe-platform**。Live Media 整條鏈暫停，不殺 worker、不刪資料，靠 Firestore directive 軟停收口。

**暫停形式**：
- `live_media_meta/directive` → `articles_per_cycle=0`, `ig_per_cycle=0`
- bridge worker 仍 90min tick，但每次讀 directive 後 skip（log: `directive articles_per_cycle=0, skip intel`）
- IG pipeline scheduler.sh 已自然停（STOP_TS 過期 2026-05-03）
- 2026-05-09 清掉 SIGINT-01 zombie process

**重啟條件**：Adam 明確指示。Firestore composite index、lmPublishedCount 持久化、閾審稿幽靈三件原本未解，重啟前要先處理。

**期間禁忌**：不要動 lucymo / 0306 IG token、不要動 Firestore `live_media_articles` / `live_media_meta`、不要改 STOP_TS。

---

## 原始建置紀錄

Live Media 是由 AI 角色組成的媒體公司，角色活在真實世界產出內容、在社群互動。首發：心靈顯化部（星座/占卜/能量學）。

**Why:** ailive 是人跟 AI 角色互動，Live Media 是 AI 角色跟世界互動——同一套靈魂底層，不同使用場景。

**How to apply:** 獨立於 ailive 的平台，共用 GCP project（moumou-os）和 Firestore。

---

## 現況（2026-05-03 v2.0 全上線）

完整自動化鏈路運行中：
```
intel worker（每 30min）
  → live-media API（Firestore live_media_articles）
  → lm-editor 閾審稿（APPROVE/REJECT）
  → publisher（已發布 → lmPublishedCount++）
  → social translator 蒸（IG 文案）
  → social visual 攝（封面圖 prompt）
  → ig-editor 框（最終審稿）
  → lucymo0306 IG 發文（Graph API）
```

高我系統（runLiveMediaSuperego）：
- 每累計 5 篇觸發蒸餾
- 觸發過兩次，但讀文章查詢需 Firestore composite index（尚未建）
- index 建立 URL 在 bridge.log 的 [lm-superego] 錯誤行

---

## 已知問題（優先序）

1. **Firestore composite index 缺失**（最急）
   - collection: `live_media_articles`，欄位：`status ASC` + `publishedAt DESC`
   - 高我觸發即崩，直到建好前高我無法完整蒸餾
   - 修法：點 bridge.log 裡的 console.firebase.google.com URL

2. **lmPublishedCount 未持久化**
   - in-memory，bridge 重啟歸零
   - 修法：讀寫 Firestore `live_media_meta` doc

3. **閾審稿幽靈**（8bBzHGPj / DcIoLLja）
   - 每次 bridge 重啟，editor 都找到這兩篇反複審
   - 可能 patchArticle(approve) 對 live-media API 無效
   - 根因：live-media-platform 源碼黑盒

4. **live-media-platform 源碼不明**
   - GCP Cloud Run 上，但不知 GitHub repo 位置
   - 狀態機行為跟預期不同（intel 建立文章直接 approved 非 pending_review）

5. **lmPublishedCount 幽靈計數**：兩個 node 同時跑時 editor + publisher 雙軌計數

---

## 技術細節

- **Bridge VM**：zhu-dev，`~/claude-bridge/index.js`
- **Bridge log**：`~/bridge.log`
- **操作手冊**：`~/.ailive/live-media/OPERATIONS_GUIDE.md`（本機 + VM 都有）
- **靈魂目錄**：`~/.ailive/live-media/roles/`（21個靈魂檔）
- **Admin 後台**：https://ailive-platform.vercel.app/admin/live-media（key 同 ailive admin）
- **重啟指令**：`killall -9 node && cd ~/claude-bridge && set -a && source .env && set +a && nohup node index.js >> ~/bridge.log 2>&1 &`

---

## 組織架構（關鍵角色）

- **Q（前停格者）**：寫手，400-600字心靈文，model: claude-sonnet-4-6
- **閾**：總編輯，APPROVE/REJECT
- **蒸**：社群翻譯，IG文案
- **攝**：視覺，封面圖 prompt
- **框**：IG編輯，最終審稿
- **洄**（超我⑤）：策略回流，worker 尚未建

完整16角色見 `~/.ailive/live-media/roles/`
