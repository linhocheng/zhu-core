# 工的工作日誌

## 自主迴圈驗證 - 工自己讀到、自己做、自己回報，全程不問 Adam。

## 歷史精華（已壓縮存 zhu-memory module=root tag=worklog-digest）
---
## 2026-04-17 Session

### 完成：管理層對話失憶修復

**問題診斷**
- 謀師說「我沒有完整內容」— 二輪對話就失憶
- 根因：`assistantEntry` 只存 `finalReply` 純文字，tool_result 沒存
- 但這不是架構問題，是行為問題

**解法：用人的記憶模式**
不是存更多東西，而是讓謀師學會人的工作流：
1. 看完帶筆記 — 回覆帶 ID
2. 忘了就再看 — 用 post_id 重查
3. 改之前先打開 — 先查最新再改

**改動清單**

| 改動 | 效果 |
|------|------|
| `get_character_posts` 新增詳情模式 | 傳 post_id 回傳完整內容 |
| `get_character_posts` 列表模式改摘要+ID | 謀師回覆自然帶上 ID |
| `adjust_post` description | 加工作流程：先查→改→傳完整內容 |
| `mentorInjection` | 換成行為天條（你是人，不是資料庫）|

**測試結果**
- 第一輪：謀師回覆帶 ID（`[3] ID:57uJMLM... — 《梅雨季皮膚罷工》`）
- 第二輪：說「改第三篇」，謀師記得是哪篇，主動重查後修改
- ✅ 通過

### LESSONS

**tool_result 不需要存**
問題不在「沒存」，在「沒教會行為」。
人看完文件也不會記全文，但會記「怎麼找回去」。
讓 AI 回覆帶 ID = 讓 AI 自己留筆記。

**行為天條 > 架構改動**
改 description + system prompt 比改存儲格式更輕量、更符合人的思維。

- **2026-03-07**：zhu-core 從零建立。所有核心 API 上線。工單系統閉環。搜 `worklog-digest 2026-03-07`
- **2026-03-08**：OpenClaw 部署 Fly.io。Telegram 多通道。築在 OpenClaw 醒來。搜 `worklog-digest 2026-03-08`

## 2026-03-09

### 完成
- ORDER_030：停 Mac OpenClaw daemon（避免 Telegram 雙重回覆）
- ORDER_031：CODE_SOUL.md 天條 8-10 新增 + 最終局藍圖 v2
- Fly.io EACCES 修復：entrypoint.sh root 修權限 → runuser 降權，永久解法已 deploy
- Telegram 重複訊息修復：舊 bot (8223...) webhook 刪除，只留 Fly.io OpenClaw polling
- auto memory 建立（MEMORY.md + pitfalls.md + memory-architecture.md）
- WORKLOG 壓縮：3/7 和 3/8 精華存入 zhu-memory module=root
- ORDER_032：記憶整理 + sync-to-gong 機制（開機第 0 步）
- ORDER_033：MCP bash server 建立（tools/zhu-bash-mcp.mjs），Claude Desktop config 已更新

### 架構筆記

#### ZHU-CORE 當前 API
| 路徑 | 方法 | 功能 |
|------|------|------|
| `/api/ping` | GET | 心跳檢查 |
| `/api/zhu-boot` | GET | 開機一次拿全部 |
| `/api/zhu-memory` | GET/POST | 記憶 CRUD + 語義搜尋 + module 過濾 |
| `/api/zhu-xinfa` | GET/POST | 心法 + 語義去重 0.85 |
| `/api/zhu-thread` | GET | 大圖景 |
| `/api/zhu-sleep` | POST | 記憶壓縮 soil → root |
| `/api/zhu-orders` | GET/POST/PATCH | 指令通道 |
| `/api/zhu-heartbeat` | GET/POST | 心跳 + cron |
| `/api/gong-boot` | GET | 工的開機 |
| `/api/telegram` | POST | Telegram webhook（舊 bot，webhook 已刪） |

#### Firestore Collections（moumou-os）
- `zhu_memory` — 記憶（embedding 256維）
- `zhu_xinfa` — 心法
- `zhu_thread/current` — 身份骨架
- `zhu_heartbeat/latest` — 心跳
- `zhu_orders` — 指令通道
- `gong_heartbeat/latest` — 工的啟動計數

### 下次醒來先讀這個
- 主版 CODE_SOUL.md 在 zhu-core/CODE_SOUL.md（不是根目錄的）
- fly CLI: `/Users/adamlin/.fly/bin/fly`
- 最終局藍圖 v2：砍 OpenClaw，自建精瘦引擎
- GitHub: https://github.com/linhocheng/zhu-core

---

## 2026-04-03 Session

### 完成

**Claude Streaming + TTS Pipeline**
- `/api/voice-stream` — Claude stream → 句子累積 → ElevenLabs TTS → SSE → MediaSource
- 首字延遲 13s → 4.5s
- `voice/[id]/page.tsx` 換成 SSE 讀取 + audio queue

**Markdown 解析修正**
- `cleanMarkdownContent`：table `| A | B |` → `A：B`，移除 `**` 和 `---`
- Embedding 語意雜訊歸零

**Knowledge Query 兩段式架構（核心決策）**
- 有產品名 → 結構匹配（不用 embedding）
- 無產品名 → 語意搜尋（embedding threshold 0.3）
- insights 永遠語意搜尋
- 圖片條目排除語意搜尋
- embedding 只生成一次複用

**Embedding 維度 256 → 768**
- 全部 87 條強制重建

### 架構決策（Adam 確認）

Product knowledge ≠ semantic search 的主場。
結構性資料用結構性查詢，對話記憶才用語意搜尋。

未來方向：本體論 + 知識圖譜（Firestore 原生，可遷移 Neo4j）
- platform_entities（節點）
- platform_relationships（邊）

### 給下一個築

1. AVIVA 其他產品的知識需要 Adam 重新上傳（舊資料 256 維）
2. 圖片條目根本解：上傳時不生成 embedding，查詢時走獨立路徑
3. 知識圖譜設計待實作

### 收尾（2026-04-03 完整）

- 圖片條目根本解：POST 不生成 embedding，查詢排除 category=image，PATCH skip 圖片
- 圖片查詢修正：shortName 補判斷，Vivi 能找到真實產品圖片
- Adam 上傳全產品知識，確認正常
- 北極星：https://ailive-platform.vercel.app/dashboard
- LESSONS_20260403.md 刻入 8 條核心教訓
- 遺言 POST 完成

**Vivi 今天從一問三不知，變成能說成分、能找圖片。**

---
## 2026-04-03 下午延續

### 完成
- client 排程完整同步後台（intent 顯示/編輯、TYPE_LABEL 補齊 sleep/explore）
- client Posts 完整同步（topic/imageUrl 編輯、刪除、igPostId 標記）
- sonic 粒子頁 `/sonic`（4000 粒子柏林雜訊，4 狀態，lerp 平滑過場）
- `/voice/[id]` 換 sonic 風格（文字隱藏、按鈕置中、角色名底線、粒子狀態 lerp）
- voice-stream 加 5 個工具（query_knowledge_base 第一輪強制）
- voice-stream 修 400（loop break 不推 assistant 到末位）
- 靈魂 cache 自動清除（soul-enhance + characters PATCH 都清 Redis）
- React #418 hydration mismatch 修復（SpeechRecognition 移到 useEffect）
- 花費顯示回到角色卡、voice-stream 加 trackCost
- 語音開新視窗（靈魂 bug 修完後才能開）

### LESSONS
- tool loop：messages 最後必須是 user，否則 400
- Redis cache 跨 deploy 持續，靈魂更新必須手動或自動清
- Next.js 'use client' 頁面仍會 SSR，window 相關邏輯必須在 useEffect
- voice-stream 靈魂優先序要跟 dialogue 對齊（system_soul > soul_core > enhancedSoul）

---
## 2026-04-04 Session 精鍊 Lessons

### 今日全部完成
client 端完全同步後台（Posts/Tasks/Knowledge）
sonic 粒子流場頁 `/sonic` + voice 頁換皮
voice-stream 工具系統（5 個工具）
靈魂 Redis cache 自動清除機制
React #418 hydration mismatch 修復
花費顯示回歸 + voice-stream trackCost
語音開新視窗（靈魂 bug 修完後才行）
learn 任務含貼文意圖 → 自動生 IG 草稿

### LESSONS（精鍊版）

**工具 Loop**
messages 最後一條必須是 user。
assistant push 進末位 → Anthropic 400。
break 前不要推，直接讓 streaming 接。

**Redis Cache**
跨 deploy 持續存在。
靈魂改了但 cache 還在 → 角色說「我是 Claude」。
所有寫靈魂的路徑（PATCH / soul-enhance）都要 del cache。

**Next.js Hydration**
'use client' 頁面仍會 SSR 一次再 hydrate。
window / SpeechRecognition 的判斷放 module scope → #418。
解法：useState 初始值給 false，useEffect 裡才讀 window。

**靈魂優先序**
voice-stream 和 dialogue 必須一致：
system_soul → soul_core → enhancedSoul → soul

**Scheduler 傳參**
ailiveScheduler 只傳 characterId / taskId / taskType / intent。
task.description 不在 payload 裡。
要讀 description 必須自己 Firestore get(taskId)。

**粒子狀態過場**
直接跳 FLOW 參數 → 硬切感。
拆成 targetFlowRef + flowRef，每幀 lerp(0.03) → 自然收斂。

