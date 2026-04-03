# 工的工作日誌

## 自主迴圈驗證 - 工自己讀到、自己做、自己回報，全程不問 Adam。

## 歷史精華（已壓縮存 zhu-memory module=root tag=worklog-digest）
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
