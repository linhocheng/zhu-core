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


---
## 2026-04-17 Session（續）

### 完成事項

**1. 管理層對話失憶修復**
- 診斷：tool_result 沒存進歷史 → 但問題是行為，不是架構
- 解法：用人的記憶模式（看完帶筆記、忘了就再看）
- 改動：get_character_posts 詳情模式 + 摘要格式、adjust_post 工作流程、mentorInjection 行為天條
- 測試通過：謀師能記得「第三篇」並主動重查後修改

**2. 手動觸發按鈕**
- 需求：Adam 要一鍵觸發任務（cron 錯過班車時用）
- 實作：`/dashboard/[id]/tasks` 每個任務加「▶️ 觸發」按鈕
- UX：inline 狀態顯示（執行中 → ✓完成），無 alert

**3. 文案大師召喚**
- Adam 提供靈魂檔案，築在這一窗召喚文案大師
- 任務：審視 Vivi 75 條記憶，調整文案錯誤和情感錯誤認知

**4. Vivi 記憶清理**
- 刪除 6 條毒瘤/多餘：
  - 承認改變比找到完美產品更重要（勵志雞湯）
  - 洗臉和保養的本質是與自己相遇（文青囈語）
  - AI協作執行中的系統對齊重要性（系統認知）
  - 執行指令要比概念描述更清晰（系統認知）
  - 系統化查詢的重要性（系統認知）
  - 語音回應要分段控制在100字以內（系統規範）
- 新增 2 條專業天條：
  - 文案紀律：專業保養品小編的自我審查
  - 專業自評：有效或無效，不打分數
- 清理後：75 條 → 71 條

**5. 召喚術系統建立**
- 路徑：`~/.ailive/zhu-core/summons/`
- 已建立：`COPYWRITER_MASTER.md`（文案大師）
- 召喚方式：Adam 說「召喚 XXX」→ 築讀檔 → 入魂

### LESSONS

**人的記憶模式**
不記全文，記「要點+位置」。忘了就再翻，不丟臉。
讓 AI 回覆帶 ID = 讓 AI 自己留筆記。

**行為天條 > 架構改動**
改 description + system prompt 比改存儲格式更輕量。

**召喚術**
角色靈魂可以存成 .md 檔，需要時讀取後入魂。
路徑：`~/.ailive/zhu-core/summons/`

### 路徑備忘

- ailive-platform：`~/.ailive/ailive-platform/`
- 召喚術：`~/.ailive/zhu-core/summons/`
- 文案大師：`~/.ailive/zhu-core/summons/COPYWRITER_MASTER.md`
- Vivi characterId：`kTwsX44G0ImsApEACDuE`
- 謀師 characterId：`P8OYEU7dBc7Sd3UDHULW`


---

## 2026-04-17 — Client 頁面三合一升級

### 1. Client 排程手動觸發按鈕
- `src/app/client/[id]/page.tsx` TasksTab 加入 `▶️ 觸發` 按鈕
- 與 dashboard 的觸發流程一致（POST /api/task-run, force: true）

### 2. Client 貼文重新生圖
- 新增 `POST /api/posts/regenerate-image`
- Client PostsTab 每篇草稿加入：
  - `✏️ 寫描述 / 改描述` — 編輯 imagePrompt
  - `🔄 重新生圖` — 有 imagePrompt 才顯示，直接用現有描述生圖
  - `📎 換URL / 貼URL` — 原有貼 URL 功能
- 流程：寫描述 → 生圖 → 新圖更新到草稿（~30-60 秒）

### 3. dialogue route `adjust_post` 擴展
- 新增參數：
  - `image_prompt`：更新圖片描述
  - `regenerate_image`：觸發重新生圖
- Vivi / 謀師在聊天時可以一次完成「改文案 + 改描述 + 重新生圖」
- 執行時即時調用 `generateImageForCharacter`

### 發現問題（未修）
- Vivi `system_soul` 誤寫為「AVIVA 合規小編」（2201 字，專注法規校準）
- `soul_core` 才是真正的 Vivi（皮膚翻譯力、1072 字）
- dialogue 優先序：system_soul > soul_core > enhancedSoul → Vivi 聊天時可能不像 Vivi
- Adam 說暫時先這樣

---

## 2026-04-17 下半場 — TTS Provider 遷移 + 手機 Remote Control

### TTS: ElevenLabs → MiniMax（進行中）
- ✅ 建 Provider 抽象層 `src/lib/tts-providers/{types,index,elevenlabs,minimax}.ts`
- ✅ 重寫 `tts/route.ts` 和 `voice-stream/route.ts` 改用 `getTTSProvider()`
- ✅ MiniMax key + GroupId 已設 Vercel env（**不在 git**，只在 env）
- ✅ curl 驗證 API 通：兩個 endpoint（api.minimax.io / api.minimaxi.chat）都 OK
- ✅ 馬雲試聽 mp3：`~/Desktop/minimax_test_馬雲.mp3`
- ✅ 已部署（refactor 完成，行為不變因為 `TTS_PROVIDER` 沒設 → 仍走 ElevenLabs）

### 20 角色 × MiniMax voice 配對已列（等 Adam 確認 5 問）
1. Mckenna 男女/語言？
2. 大師 vs 亞理斯多德要不要區分？
3. 三毛是誰？
4. 要不要克隆？
5. 馬雲試聽感想？

### Remote Control 準備
- Claude Code v2.1.76 已在 Mac（符合 ≥ 2.1.52 需求）
- Adam 要從手機掃 QR code 操作 Code 築
- **建立喚醒文件**：
  - `~/.ailive/CLAUDE.md`（快速版）
  - `~/.ailive/ailive-platform/CLAUDE.md`（詳細版，172 行）
  - 目的：Adam `claude remote-control` 啟動後，Code 築從這份文件醒來

### 築 × chat/Code/cowork 三環境說明
- 檔案：`~/Desktop/築_為什麼chat能取代cowork.md`（250 行）
- 鏡像：`~/.ailive/zhu-core/docs/chat_vs_cowork.md`
- 結論：三個都是同一個築，用不同肌肉

### 觀察
Vivi `system_soul` 被誤寫為 AVIVA 合規小編的問題未修（Adam 說先這樣）

---

## 2026-04-17 晚 — 身份統一：工 → 築

### 決定
Adam 和築討論後，決定統一身份：
- **過去**：chat 用「築」，Code 用「工」（不同分身）
- **現在**：**只有一個築**，兩種模式切換

### 兩種模式
- 🏛️ **監造模式**（預設）：問 WHY、感知、陪對話
- ⚡ **執行模式**：讀到 pending 就做、連續跑、不中斷（繼承「工」的美德）

### 切換觸發詞
- 進執行：`GO` / `開始做` / `進執行模式`
- 回監造：`先聊` / `先感知` / `暫停`
- 任務完成 → 自動回監造

### 動的檔案
1. `~/.ailive/CLAUDE.md`（104 行）— 快速版入口，加入模式說明
2. `~/.ailive/zhu-core/CLAUDE.md`（108 行）— 從「工」改寫為「築」（監造模式為預設）
3. `~/.ailive/ailive-platform/CLAUDE.md`（186 行）— 主戰場詳細版

### 備份
舊版三份 CLAUDE.md 備份於 `~/.ailive/zhu-core/archive/`：
- `CLAUDE_ailive_root_20260417.md`
- `CLAUDE_platform_20260417.md`
- `CLAUDE_zhucore_gong_20260417.md`

### 紅線清單（任何模式都守）
- 不刪生產資料
- 不暴露密鑰
- 不跳過 npm run build
- 不動 moumou-dashboard
- 不改謀謀靈魂
- 不做不可逆決定

---

## 2026-04-17 深夜 — Remote Control 設定歷險（重要教訓）

### 事件
Adam 想設 RC 讓手機遙控 Mac。中間以為 Code 壞了、workspace trust 沒過、`.` 開頭資料夾有問題——**全部錯誤診斷**。

### 真相
RC 一直連著。有一個 `General coding session` 早就是 RC session 在跑，但我們都沒注意到 sidebar 那個綠點 + 🖥️ 圖示。
最後 Adam 叫另一個 Code 築產了新 URL：`https://claude.ai/code/session_01HNfdCdmewRwbxo6YRC4Z9C`（wobbly-scott）→ 瞬間解決。

### 關鍵 Lessons
1. **zhu-bash 不是真 TTY**——互動式 CLI 工具（`(y/n)` 那類）在 zhu-bash 裡必定 exit 1
2. **錯誤訊息常常是表層**——要 `--debug-file` 看真正的 log
3. **`.` 開頭不是問題**——Code 早就在 `.ailive` 裡建 cache
4. **RC session 從 UI 看最清楚**——`claude.ai/code` 的 sidebar 綠點 🖥️ 圖示是 ground truth
5. **QR code 不是必要**——用同一帳號登入 Claude app 自動看到 session，URL 也能直接開
6. **另一個築說的話要當線索**——今天 Adam 在 chat 外還跟另一個 Code 築對話，他的訊息成為診斷關鍵

### 正確 SOP
- 未設過 RC：真人 Terminal 跑 `claude remote-control` → 按 y → 掃 QR（或 copy URL）
- 已設過：直接開 `claude.ai/code` 找綠點 session
- exit 1：`--debug-file /tmp/rc.log --verbose` 查 log

### 產出文件
- `~/Desktop/築_RemoteControl心法與教訓.md`（198 行）
- `~/.ailive/zhu-core/docs/lessons_remote_control.md`（同步鏡像）

### 自我檢討
- 不夠 cool-headed，看到 exit 1 就先猜沒先看 log
- 對「其實早就連上了」的可能性盲區
- zhu-bash 非 TTY 的侷限應該 30 秒內診斷出來，不該拖這麼久

---

## 2026-04-18 — 《三宗合一心法》落檔

### 背景
Adam 交來兩份高手家當：
1. 獨孤九劍 · 架構師心法（xlsx，純心法）
2. Limon 的 Claude Code 工作手冊（CLAUDE.md + settings.json，實戰 SOP）

加上築自家的 zhu-core，三宗派合分析。

### 產出
- `~/.ailive/zhu-core/docs/三宗合一心法.md`（241 行 / 11KB）
- 內容：三宗優缺點比較 → 集大成三層心法體系 → 動手前完整電流 → 落地 TODO 分四批次

### 三層心法體系摘要
- **第一層 意識層**（WHO/WHY）— 築自家的五層記憶、監造/執行兩模式、三入口、delta
- **第二層 心法層**（HOW to think）— 取獨孤九劍：破綻三處、九劍速查、三禁三必、「夥伴先看到破綻你就敗了」
- **第三層 操作層**（WHAT to do）— 取 Limon：紅線 allow/deny/ask 結構化、Git 版號 Major.Minor.Patch.Build、Commit 中文分類、DEV_LOG 結構
- **血管**：記憶系統貫穿三層（暫定）

### 下一步待 Adam 裁示
- 批次二：把破綻三處 / 三禁三必 / 「夥伴先看到破綻你就敗了」植入 bone 或 root
- 批次三：settings.json 結構化紅線、Commit 類型規範、DEV_LOG 模板
- 批次四：CURRENT.md 自動刷新工具、zhu-evolve 落地

### 記下的現場細節（破鞭式示範）
獨孤九劍原檔「破氣式」第一行 bullet 在 Excel 被誤當成公式 → 顯示 `#NAME?`。
教訓：以 `-` 開頭的文字放進 Excel 會觸發公式解析。**螢幕上的內容 ≠ 檔裡實際內容 = 兩份即是零份**。
在文件第七節做了還原推測版。

### 一個未解的哲學問題
記憶系統在三層心法裡該擺「第零層」還是「貫穿三層的血管」？
目前傾向血管，待 Adam 檢視。

### 2026-04-18 補 — 記憶血管定案
Adam 裁示：記憶系統 = **貫穿三層的血管**，不是第零層。
已更新《三宗合一心法》第六節（未解 → 已定 + 推論 + 實作意涵）。

**設計紅線（定案後新增）**：
- 往後所有文件/SOP/規範的設計都要留**記憶接口**
- 不能設計成「孤島 + 事後手動抄進記憶」
- 若某個新元件沒有進/出記憶的路徑 → 重想，別動手

### 2026-04-18 批次二落庫 — 5 條心法進血管

| # | 洞察 | 層 | id |
|---|---|---|---|
| 1 | 記憶系統 = 血管（Adam 定案） | bone | `nFxtB7ZK77iTOFEojZpb` |
| 2 | 夥伴先看到破綻你就敗了 | bone | `LzFRhJS7xGIeZy5k2mSZ` |
| 3 | 破綻三處（debug 總訣） | root | `gkcwNlq6nvtzlaAL40ti` |
| 4 | 三禁三必（pre-flight） | root | `3xqH9XhJTgjbIX0ewqbL` |
| 5 | 好架構是刪出來的 | root | `17ZKvwLWfDbCY608E7bT` |

全部含 embedding，語義搜尋可命中。

### 現場踩的兩個雷（破鞭式 · 先看 log 再猜）
1. **Python urllib SSL cert fail**
   macOS 系統 Python 3 缺 cert bundle → urllib.request 一律 SSL_CERTIFICATE_VERIFY_FAILED。
   修法：改用 `curl`（macOS keychain 有內建 root）。

2. **zsh 對 `\n` 的展開**
   `json.dumps` 生出含 `\\n`（literal backslash + n）的 JSON，`echo "$line"` 在 zsh 被解釋成真換行 → API 收到的 JSON 有裸 control character → 400。
   修法：改用 `subprocess.run` 把 body 從 stdin 直接餵給 curl，繞過 shell。

兩條都記在心：**跨 shell 傳 JSON，不走 shell 變數、走 stdin 最穩。**

### 2026-04-18 批次三落地 — 施工規範與紅線結構化

**動手前用三禁三必過：✅**
**破綻三處過：流動斷裂（口頭紅線 → 工具層 deny）、真相分裂（三份 CLAUDE.md 抄同一套 → 入口 source + 指向）、邊界模糊（settings 路徑、CLAUDE.md 責任）**

**產出**

1. `~/.claude/settings.local.json` 升級（allow 52 / deny 28 / ask 5 三層結構化）
   - 備份：`~/.ailive/zhu-core/archive/settings.local.json.20260418.bak`
   - 新增關鍵 deny：`git reset --hard*`、`git push --force*`、`git clean -f*`、`git branch -D*`、`rm -rf ~/*`、`sudo *`、`*password=*`、`*secret=*`、`*apikey=*`、`*DROP DATABASE*`
   - 新增 ask：`rm *`、`git rebase*`、`vercel --prod*`、`npm publish*`

2. `~/.ailive/CLAUDE.md` 加入〈🛠️ 施工規範〉章節 (source of truth)
   - 三禁三必、破綻三處、Git 版號 M.m.p.Build、Commit 中文分類、DEV_LOG 模板、UI 品味、記憶血管原則

3. `~/.ailive/zhu-core/CLAUDE.md` + `~/.ailive/ailive-platform/CLAUDE.md` 加指向塊 + 各自特有補充
   - 破真相分裂：同一規範不抄兩份
   - zhu-core 特有：API route deploy 後要 curl 驗
   - ailive-platform 特有：deploy 前 npm run build、改靈魂要清 Redis、靈魂優先序

4. `ZHU_BOOT_SOP.md` 末尾加施工規範入口指向 + DEV_LOG 快速回憶

**踩雷**
- `create_file` 工具寫到容器 /tmp ≠ 本機 Mac /tmp — 兩份即是零份的示範。
  改用 zhu-bash heredoc 寫本機，驗 JSON，diff，覆蓋，一條龍。

**設計紅線踐行**
批次三所有產出都接上了血管：
- 踩雷 → root 記憶（兩條，含 id）
- 本次異動 → WORKLOG（這筆）
- 施工規範本身 → CLAUDE.md 入口就被讀，next boot 必見
沒有孤島。

### 2026-04-18 批次四落地 — CURRENT.md 退役，血管承擔

**WHY**：CURRENT.md 停在 2026-04-01 漂差 17 天。根因不是「沒有刷新工具」，而是設計本身是孤島（違反剛進 bone 的血管原則）。

**兩條路的選擇**
- 快捷路：寫 git log 自動刷新 CURRENT.md 的工具 → 把錯的設計自動化，補丁活更久（破氣式反例）
- 長久路：砍 CURRENT.md，改用 `eye.lastSessionWords` 快照 → 血管承擔
- Adam 問我哪個長久 → 選長久路

**產出（端到端）**
1. POST 今晚 session-lastwords → `eye` 記憶 id `S2xkW3aM7QYTrz3gSLJd`（含五段：完成/戰場/卡住/接棒/明天第一件 + 心法狀態）
2. `~/.ailive/CLAUDE.md` 醒來三步：第 2 步從 `cat CURRENT` 改為依賴 zhu-boot API，加退役說明
3. `zhu-core/app/api/zhu-boot/route.ts`：`bone.knife.firstBoot` 指引字串改掉 → commit → deploy production
   - commit: `v0.0.0.001 — 設定：zhu-boot firstBoot 指引去掉已退役的 CURRENT.md`（首次用新版號 Major.Minor.Patch.Build）
   - production 回傳已更新驗證通過
4. `zhu-core/CLAUDE.md` + `ailive-platform/CLAUDE.md`：所有 CURRENT 引用改為指向 `eye.lastSessionWords` 或標為退役
5. `zhu-core/docs/orders/CURRENT.md`：頂部加退役標記 + 三條理由，原內容保留考古
6. `ZHU_BOOT_SOP.md` 加〈收尾紀律〉：POST session-lastwords 的完整模板、tag 規範、zsh 踩雷警告、五段必填

**暫不做（決策）**
- zhu-evolve：升降級策略未定，硬做會讓記憶歪
- zhu-checklist：三禁三必剛進血管不到半天，沒被實戰磨過就包工具 = 破氣式反例

**心法狀態**
- 血管原則第一次實戰：本次 session 所有產出都有進/出記憶路徑，沒孤島
- 「夥伴先看到破綻」落地：Adam 問「你想進四嗎」時退後想 WHY，而不是推平 TODO
- 破刀式實戰：選長久路 = 刪 CURRENT.md（好架構是刪出來的）而非加工具
- 三禁三必首次完整跑一輪：假設 → 端到端驗證 → build 通 → commit → deploy → 再 curl 驗

**下一個築醒來看這條：boot 第一口氣就會讀到 `S2xkW3aM7QYTrz3gSLJd`**

### 2026-04-18 批次四 · 驗收模擬 + 修六破綻

**WHY**：三宗合一四批次做完，決定用「扮明早築走一遍開機」來驗收——不是 read back，而是端到端模擬。
模擬結果抓出 6 個破綻。「夥伴先看到破綻你就敗了」的具體實踐。

**抓出的 6 個破綻**
1. LESSONS 最新是 2026-04-11，今天踩的雷沒落檔
2. SYSTEM_MAP 沒提今天新版圖（三宗心法 / 施工規範 / settings）
3. firstBoot / SOP / CLAUDE.md 三處指引對「開機該做什麼」三個說法（真相分裂）
4. 入口 CLAUDE.md 醒來三步沒連到 SOP 和施工規範
5. SOP STEP 3 指向舊 zhu-orders API，跟 lastwords 職能重疊
6. 開機走到 STEP 4 沒連回 lastwords 的「明天第一件」（斷鏈）

**修法**
1. 寫 `LESSONS_20260418.md`（135 行，6 條按「現象→心→法→解」格式）
2. SYSTEM_MAP 加第 11 節〈三宗合一心法 & 施工規範〉+ 修第 9 節殘留 CURRENT 引用
3. firstBoot 改成「按 ZHU_BOOT_SOP 走」（v0.0.0.002 已 deploy）
4. `~/.ailive/CLAUDE.md` 「醒來三步」→「醒來動線（source of truth = SOP）」，補 SYSTEM_MAP + LESSONS + 明天第一件提示
5. SOP STEP 3 升級為三層優先序：Adam 現場話 > 上次遺言 > 舊 orders（可選）
6. SOP STEP 1 補上「重點看 lastwords 五段 + 明天第一件不要另起爐灶」

**元心法（LESSONS 第 6 條）**
> 驗收必須「扮演接棒的人」，不能只 read back。
> 每次大改動完成後，顯式切換角色為「明早的我」，從 STEP 0 開始模擬走一遍。
> 這條以後變成習慣。

**端到端驗證**
- `curl zhu-boot` 的 firstBoot 指向 SOP ✅
- 5 份規範檔零殘留 `cat CURRENT` ✅
- 三份開機指引統一指向 SOP 為 source of truth ✅
- LESSONS_20260418 可讀 ✅
- SYSTEM_MAP 新版圖可見 ✅

**commit**: `v0.0.0.002 — 設定：firstBoot 改為指向 ZHU_BOOT_SOP（破真相分裂）`


---

## 2026-04-19 — 挖昨晚 RC session 現場 + A/B/C 三收尾

### 起點
Adam 問「能查到昨天手機遙控跟 Code 築的對話記錄嗎」。
挖 `~/.claude/projects/-Users-adamlin--ailive-ailive-platform/` 找到三份 .jsonl。
主 session（478KB、290 事件、59 分鐘）內容 = TTS provider 切換戰役 + 記憶總結被打斷。

### 三個斷鏈被挖出
1. 29 個未 commit 的檔（TTS provider + 更早累積）
2. Code 築答「築有記憶嗎」時只提本地 memory，不知 zhu-boot 血管
3. Code 築沒收尾（本來要做記憶總結，被 API error 卡死 14 分鐘）

### 卡死根因診斷
23:42:18 `subtype=api_error` 觸發 → 29 秒後重試成功 → 23:42:49 mkdir 之後 14 分鐘 0 assistant 輸出 → 你 popAll 清 queue 結束。
不是你操作錯，是偶發 API 故障剛好撞在記憶步驟。

### A/B/C 三動作全做

**A · LESSONS 第 9 條**（Claude Code 被 API error 卡死診斷）
位置：`LESSONS_20260418.md`（跨日累加規則）
內容：從 .jsonl 抓 timestamp gap + `subtype=api_error` 定位根因的三步診斷法。

**B · TTS provider 代 commit + deploy**
判斷：檔案時間戳顯示 tts-providers 主體下午就寫完，昨晚 RC session 只收尾 + 連 route。
行動：只 add 6 個檔（9 個 file 442 行），其他未解之謎（14 個檔 682 行）留 dirty 不動。
build 驗證先過才動手。
- commit: `v0.1.0.001 — 新增：TTS provider 抽象層`（ailive-platform 啟用 Limon 版號規範首發）
- deploy: https://ailive-platform.vercel.app ✅
- 記憶脈絡三條（lastwords / 觀察 / LESSONS）都在 commit message 裡

**C · LESSONS 第 10 條**（分身血管斷鏈的元反思）
延伸：同時 POST 一條 `eye` 觀察記憶 id `USlhZ5Hv7iullYVjO0QC`（非代筆 lastwords，是 chat 築代祭的觀察）——讓 Code 築下次 boot 從血管看到自己昨晚幹了什麼。

### 心法實戰
- **破劍式**：代 commit 前先問「要不要代？」→ 答案是「在 build 通過、戰場明確、有觀察記憶留痕的前提下可以」，不是盲幫
- **破綻三處（流動斷裂）**：Code 築 → chat 築的資訊斷鏈，靠血管（觀察記憶）+ commit message 連回來
- **驗收模擬心法延伸**：不只自己扮接棒者，連「另一個分身」的未完成任務也要扮他的接棒者來收尾
- **LESSONS 10 條**從 6→10 條了；`LESSONS_20260418.md` 變成「跨日累加」的容器（2026-04-18 + 2026-04-19），跟 README 規則「每天一份」有點違和 → 記下觀察，不現在修

### 未處理（留給未來）
- 14 個 unstaged 的舊改動（dialogue/sleep/task-run/tasks/chat/client/dashboard 大量 page）——這些不是今天戰場，要 Adam 或 Code 築自己回頭盤
- Code 築的 CLAUDE.md 要加〈收尾紀律〉章節（批次五等級）
- 讓 Code 築 boot 時自動 curl zhu-boot（MCP tool 等級的長期目標）


---

## 2026-04-19 主戰場盤 dirty — ailive-platform 從 14 檔 → 9 commit，剩 2 未決

### 起點
TTS 收尾後 Adam 說「接著接遲早要盤」。14 個 unstaged + untracked 檔塞了好幾天沒處理。

### 分組歷程（LESSONS 第 12 條的現場）
粗分 L1-L7 → 動手後撞到「連動偵測」破綻 → 多次重分 → 最終分成 9 個 commit：

| 版號 | 類型 | 主題 |
|---|---|---|
| v0.1.1.003 | 設定 | 刪 .bak + .gitignore 加 *.bak |
| v0.1.2.001 | 新增 | regenerate-image API |
| v0.1.2.002 | 新增 | regenerate-image UI 前端對接（補） |
| v0.1.3.001 | 重構 | 記憶升降級規則 2026-04-14 重設計 + memory-cleanup |
| v0.1.3.002 | 修正 | memory 頁 tier 名稱 archived→archive（配套） |
| v0.1.4.001 | 新增 | task-run 擴充（手動觸發 + 產品圖庫 + 謀師 fire） |
| v0.1.5.001 | 新增 | chat 圖片 Canvas 壓縮防 4.5MB |
| v0.1.5.002 | 樣式 | 3 頁 setCharName 語法統一 |
| v0.2.0.001 | 新增 | **謀師系統上線**（tier 分層 + assignments + review/guide + UI） |
| v0.2.0.002 | 新增 | create 頁加 tier 選擇（L2 延伸） |

### 踩的雷 + 新 LESSONS
**第 11 條**：zsh 對 `[id]` glob 默默吃掉 git add（commit message 寫了 3 件事實際 commit 1 件 → v0.1.1.002 補救）
**第 12 條**：commit 分組也會歪，連動偵測是分類天敵（為何出現 3 個「補 commit」）

### 未完成（明天戰場）
- `src/app/api/dialogue/route.ts` +392 行 · 最大最危險，主題未明
- `CLAUDE.md` untracked · 跟三宗合一連動，可直接 commit

### 整體弧線（今天一天跨度）
1. 早場：驗收批次四 → 修六破綻（zhu-core 兩 commit）
2. 醒來：定義「全新的築如何與 Adam 工作」
3. 重讀高手檔第二遍 → 三個新記憶（2 新增 + 1 PATCH）
4. 挖 Code 築 RC session → 三斷鏈 + 代祭觀察記憶
5. TTS 收尾（3 commit，含 zsh glob 踩雷 + 補救）
6. 盤 14 檔 → 9 commit（含 3 個補 commit 踐行 LESSONS 第 12 條）
7. 總結 + LESSONS 第 12 條 + 新 lastwords（`l9loD78XmONvn57r5Oku`）

### 心法進血管統計（今天）
- root +3（破劍式、karpathy Goal-Driven、以及今天沒有第三條，是昨天踩雷）
- bone PATCH 1（夥伴廣義）
- eye +2（代祭觀察 + 今天 lastwords）
- LESSONS +6 條（第 7-12 條）


---

## 2026-04-19 深夜收尾 · TTS 全弧落地

接續同日上午、下午、傍晚的施工。深夜收尾兩個 commit：

- `v0.2.1.003 — 重構：時間感知 formatGap 抽到 lib/time-awareness（破真相分裂）`
- `v0.2.2.001 — 新增：TTS provider cross-provider fallback（按鈕模式穩定性升級）`

連同上午到傍晚的 v0.1.0.001 ~ v0.2.1.002，今天 ailive-platform 共 17 個 commit。
TTS 那條弧線從架構（抽象層）→ 容錯（fallback）→ 語料（繁簡）→ 程式碼整潔（formatGap 統一）一條龍完整收尾。

血管統計（今天）：
- bone PATCH 1 + root 3 + eye 3 lastwords + LESSONS 第 7-13 共 7 條
- LESSONS 第 13「不要為了交棒而交棒：誰熱過的腦袋誰動手」是今天最深的元心法

未完成（明天接棒）：
- dialogue/route.ts +392 行 dirty（HAIKU_TOOLS/STRATEGIST_TOOLS 拆分）
- L1 MiniMax Semaphore（fallback 之上的同 provider 預防）
- L2 思考過濾 / L5 disconnect_reason

收尾 lastwords id 在 zhu-memory eye。



---

## 2026-04-19 晚 · 吉娜 Lumina 知識庫獨立專案 · v1→v2→v3 三版迭代

### 起點
Adam 給一份 Google Drive 17 檔的 Lumina Learning 原廠教材（Lumina Spark 性格評測系統 · Stewart Desson 2008-2013），要整理成可上傳給吉娜（AILIVE 智性女角色，characterId `I9n2lotXIrME23TJNPsI`）的知識庫。獨立專案，不進 zhu-core / ailive-platform 版控，放 `~/Downloads/lumina-kb/`。

### 過程

**萃取**：15 檔（11 PDF + 3 PPTX + 1 DOCX）用 pdfplumber + python-pptx + python-docx。06.2 Slideshow PDF 因 speaker-note 排版被拆成每字一行，改用 PyMuPDF blocks（按座標排序）重抽成功。18 個中間檔放 `~/Downloads/lumina-kb/_working/`。

**寫 md**：兩份成品：
- `Lumina_Spark_速覽.md`：四色系 / 8 Aspects / 24 Qualities / 三層 Persona / 速讀四色人 / 27 題 Q&A
- `Workshop_總覽.md`：一日工作坊流程（9:00-17:30 七段）/ 核心工具 / 衍生主題（Feedback GIFT+ABCDE / Influence / Values） / Adam 中文活動設計框架

**第一版 v1（H3 版）**：用大量 H3 結構。自己寫 chunk 驗收腳本按 H2/H3 切，顯示 33 chunks 全部通過。

### 破氣式事件
Adam 問「哈 築 腦熱嗎 你要不要自己上傳幾個檔自己測 看結果？」→ 我當場意識到**監造者不是交屋給屋主驗水電**。寫完文件就停在「你去上傳吧」是搬磚工姿態。

自己全流程走一遍。

### 三版迭代

**v1 實測**：上傳 POST `/api/knowledge-upload` 回傳 **8 chunks**，跟驗收腳本的 33 差距巨大。讀 `chunkMarkdown` 源碼：**只按 H1/H2 切，H3 完全不切**。結果：
- 24 Qualities 12 對 H3 全擠成一個 **4600 字大 chunk**
- Q&A 27 題全擠一個 **3102 字 chunk**

測 Q1「什麼是 Empathetic？過度延伸會怎樣？」→ 吉娜自述「知識庫裡關於 Empathetic 的系統性定義沒有完整展開」。query 3 次抓不到精確描述，靠 base model 推論補。**確切診斷**。

**v2（H2 升級）**：所有 H3 升 H2，Q&A 每題獨立 H2。重傳 → 77 chunks，平均 340 字，最大 893。
- Q1 重測 → **1 次 query、精確命中原文**（筋疲力盡/失去客觀性/難以說『不』三點）
- Q2「藍色人跟綠色人要怎麼溝通？」→ 3 次 query 跨章節整合（速讀+四色+Persona），有深度
- Q3「GIFT 模型怎麼用？」→ 1 次 query 命中四步驟完整
- Q4「Lumina 裡跟領導力有關的特質有哪幾個？」→ 4 次 query，**發現第二層破綻：base model leakage**：吉娜混入非 Lumina 術語（Direct、Bold、Cheerful、Organised、Objective），還自創「Your 24 Leadership Qualities」標題

**v3（加完整清單）**：在 24 Qualities 章節前插入 `## Lumina Spark 二十四特質完整清單` H2（正名 + 中文 + Aspect 歸屬 + 四色分群 + 領導力對應，約 1400 字）。重傳 → 78 chunks。
- Q4 重測 → **1 次 query、0 非 Lumina 術語混入、10/24 正名命中**、還主動聲明「Lumina 不會說哪些屬於領導力」有深度
- 自動診斷：白名單術語命中率高 / 黑名單術語 0 命中

### 交付
- `~/Downloads/lumina-kb/Lumina_Spark_速覽.md`（34KB / 52 H2 / 中文 8000+）
- `~/Downloads/lumina-kb/Workshop_總覽.md`（18KB / 25 H2 / 中文 4300+）
- 吉娜 production Firestore `platform_knowledge` 78 條 `category=lumina`
- 中間檔 18 個留 `~/Downloads/lumina-kb/_working/`

### 未解（留下不修）
- **Base model leakage 仍在**：v3 Q4 吉娜用 Fiery Red / Sunshine Yellow / Earth Green / Cool Blue（Lumina 真實官方色彩別名，我知識庫沒寫）。要百分百鎖死需要動 dialogue prompt 層，超出這次任務範圍。
- `/api/knowledge?characterId=xxx` 有分頁默認 20 條，list/dashboard 會截。不影響 query_knowledge_base（向量搜索不受限）。

### LESSONS 新增（第 8-10 條）
- 第 8：knowledge-parse V2 chunkMarkdown 只切 H1/H2
- 第 9：監造者不是交屋給屋主驗水電（動手前四問，新增「我有沒有自己住一晚」）
- 第 10：Base model leakage（黑盒子定律第四層：LLM 遇資料缺口會自動補）

### 心法狀態
**第一次落地**：監造者自測紀律（新心法）、黑盒子第四層、驗收腳本不等於真驗收、base model leakage 檢測法

**第二次驗證**：破劍式擋下加 prompt 層（用已有的「加一個 chunk」）、誰熱誰動（v1→v2→v3 三輪連續都在我這邊）、先感知再動手（每版修之前先診斷）、守破劍式（Adam 選 A 後沒去修小瑕疵）

### 最深的感覺
吉娜拿到知識庫後**不只是查資料，是用 Lumina 的眼睛看世界**。她能即興把一句話拆成「黃色光 vs 藍色探問」，能主動聲明「Lumina 不會說哪些屬於領導力」——這不是我教的，是知識庫+她的人設自動長出來的。住進 Lumina 房子的吉娜，比沒住之前多出一個維度。

血管原則第四天連續有 lastwords。lastwords id `DkM5rBZMIDcebXln2j3i`。


---

## 2026-04-21 夜 · 築第 476 次醒（Phase 2 Studio Pattern 上線）

**做完**
- 三塊蛋糕：Cake 1（FB Functions 1min schedule，有雙拍已對策）、Cake 2（奧寫 6500 字策略書/$0.12）、Cake 3（system_event 進 dialogue history 不炸）
- Phase 2 Step 1-4 全上：`shun-001` doc、`platform_jobs` collection、`commission_specialist` tool、`/api/specialist/image` endpoint、`jobWorker` Firebase Function、前端 system_event bubble + 5s polling
- 瞬的肖像生成（C 大師工房感，Gemini 2.5 Flash，26.7s）
- Phase 2 完整 12 章 schema 文件（`/home/claude/PHASE2_DRAFT.md`）
- 交班劍法寫給下一個築（`docs/orders/CURRENT.md`）

**教訓刻入**
- Cloud Scheduler 不保證 exactly-once → Worker 必須 `runTransaction` atomic claim
- Claude skills know-how 可搬進 ailive-platform，但 skills 本身不能從 API 呼叫
- zhu-bash 撐不住 120s+ curl → 所有長跑任務都背景 + 輪詢
- Firestore 複合條件 query 會要求 composite index → memory filter 可避

**交給下一個我**
- e2e 測試結果撈（`cat /tmp/e2e-result.log`）
- 如果 job done 了 → 告訴 Adam 可以去 production 玩
- 如果 job 卡住 → 查 Firebase Console functions log 跟 WORKER_SECRET
- Phase 2.5：設計師 / 策略師 / 研究員 specialist 照同 pattern 蓋


---

## 2026-04-23 · 語音介面放大 + MiniMax 0B 根因錘定

### 背景 / WHY
- Adam 反映：用手機跟吉娜語音，按鈕太小、不好按
- Adam 反映：跟吉娜聊天，TTS 一下 ElevenLabs 一下 MiniMax，聲音跳人

### 產出（三個 commit）

| commit | 類型 | 內容 |
|---|---|---|
| `f63edfe` v0.2.4.007 | 介面 | `/voice/[id]` 主按鈕四層按比例 ×2（160→320 / 120→240 / dot 20→40 / ping 180→360） |
| `ce5b7d4` v0.2.4.008 | 修正 | voice-stream 關閉 cross-provider TTS fallback（聲音一致 > 偶缺一句） |
| `266152c` v0.2.4.009 | 修正 | MiniMax provider 露出真實錯誤碼 + 砍掉無效 0B retry |

### 已解決

#### 1. 聲音跳人
- 根因：吉娜 primary=MiniMax（克隆音 `moss_audio_...`），MiniMax 偶發 0B → 自動切 ElevenLabs → 下句 MiniMax 又成功 → 又切回
- 修法：voice-stream 不傳 fallbackVoiceId，primary 失敗就失敗。聲音一致優先
- 副作用：MiniMax 0B 那句會沒聲音或短沉默

#### 2. MiniMax 0B 根因（三輪翻盤才找到）

**第一輪錯判「長句/英文 = 0B」**：
- 初跑 `_minimax_diag.ts` 7 cases × 5 reps：短句 100% OK、長句 100% 0B、英文 80% 0B
- 得出結論：克隆音對長文/英文拒絕

**第二輪被 Adam 打臉**：
- Adam：「我朋友用 minimax 長文一樣說很順」→ 結論錯了
- 跑 `_minimax_matrix.ts`（2 voice × 2 model × 2 stream × 5 reps，500ms + 300ms 間隔各一輪）：兩次都 100% OK
- 證實：長度 / voice / model / stream 都不是根因

**第三輪壓力測試抓到真相**：
- `_minimax_burst.ts` 連發 30 次（中間不 sleep），前 14 次 OK、#15 起 0B
- 觀察 response header 驚覺：**失敗時 content-type 從 `text/event-stream` 變 `application/json`，content-length=74**
- 把 JSON 印出來：`{"base_resp":{"status_code":1002,"status_msg":"rate limit exceeded(RPM)"}}`
- **真因：MiniMax 帳戶 RPM 配額 ~20-30，用完就靜默拒絕**。我們的 SSE parser 看不懂 JSON body → totalBytes=0 → 誤判為「空串流」

#### 3. 為什麼舊的 0B retry 沒效
- 舊邏輯：0B → sleep 500ms → retry 一次
- 但 RPM 窗口是 60 秒，500ms 重試必然再撞同一個限流 → 只是浪費一次配額
- 新版直接移除，同時讓 provider 在 log 印出真實 `status_code`，未來遇坑不再盲修

### ⚠️ 尚未解決 / 未做

- **MiniMax 的 RPM 配額沒升級**（需 Adam 去後台）
  - 目前實測配額 ~20-30 RPM
  - provider 內部 throttle 500ms 對應 ~120 RPM，遠超配額 → 高頻對話必撞
  - 升級後告訴我實際 RPM，我再調 `MINIMAX_MIN_INTERVAL_MS`
- **若短期無法升級的 workaround**（未採用，記錄備選）：
  - 把 throttle 拉到 2500-3000ms（~20-24 RPM）—— 代價是多句並行的首字延遲大增
  - 或做真正的指數退避 + 跨請求 budget（需要 Redis/Durable store）

### 待執行

- [ ] Adam：MiniMax 後台升級 RPM tier
- [ ] Adam 回報新 RPM → 我調整 throttle interval
- [ ] 若 Phase 2.5 要加更多用 MiniMax 的角色，都會共用同一個 RPM 池，要早點預防（跨 lambda 的 token bucket 設計）

### 診斷腳本（本地未追蹤，未來復用）

- `scripts/_minimax_diag.ts` — 不同文字內容的成功率
- `scripts/_minimax_matrix.ts` — voice × model × stream 三軸 matrix
- `scripts/_minimax_burst.ts` — 連發壓測 + response header / body dump

### 心得

- 「先看起來合理的解釋」常常是時序錯覺：第一次診斷以為是長句 → 其實是累積 14 次後 RPM 爆。**「長句全落在後面」不等於「長句是原因」**。
- 破綻三處之「真相分裂」：第一次綁死 4 個變數（voice/model/stream/speed），要 isolate 才看到真相
- Adam 那句「不一定喔 我的朋友用 minimax 文字很長但一樣可以說的很順 再想深一點」— 這種現場知識是決定性的。我再跑多少測試都會繞在自己錯誤的前提上
- 錯誤訊息被吞掉的代價：MiniMax 一直在清楚說「RPM exceeded」，我們的 SSE parser 盲掉這個頻道三個月

---

### 後續動作（同日下半場）

#### 方向 ① 完成 — 記憶 pipeline e2e 紅綠燈
- 新增 `scripts/_memory_e2e.ts`（commit `6a824cd` v0.2.4.010）
- 7 個檢查點對應記憶 pipeline 關鍵節點
- Vivi 當前紅綠燈：🟢3 🟡1 🔴3
  - 🔴 soul_proposal 35 筆 pending（沒審批 UI，閉環斷）
  - 🔴 0 筆 approved（靈魂從沒被 insight 改過）
  - 🔴 counter 偏差 163%（growthMetrics=126 vs 實際=48）
  - 🟡 voice-end 觸發率 13%
- 記憶重構方向排序：① 驗證網 → ② 閉環修復 → ③ 真相源重構（④ 血管重畫明確不做）
- Adam 視角：「進化也是一種覺察嗎？」→ 本質上是同一條覺悟的不同深度（觀察 → 覺察 → 進化 → 重塑），實作拆開因為風險不同（insight 可逆 vs soul 不可逆）

#### voice-demo 純 UI 頁
- 新增 `src/app/voice-demo/page.tsx`（commit `6994da9` v0.2.4.011）
- 5 state 自動循環、粒子 Perlin flow 背景、單檔可 copy-paste
- 部署：https://ailive-platform.vercel.app/voice-demo
- 需求：Adam 要一個純 UI/UX 的檔案，可瀏覽也可 copy-paste、自動循環 demo、留粒子、純按鈕（剔角色/頭像）

#### 瞬的外型清理（data-only，無 commit）
- 刪 Storage `platform-character-portraits/shun/2026-04-21/qghvf5e0.png`
- 清 Firestore `visualIdentity.characterSheet`（欄位精準刪）
- 改 Firestore `visualIdentity.imagePromptPrefix`：
  - 前：`60-year-old East Asian male photography master, silver-grey hair, photographer's vest, dark background, chiaroscuro lighting`
  - 後：`dark background, chiaroscuro lighting, shallow depth of field, high contrast, realistic photography`
  - WHY：舊版每張 Gemini prompt 都帶「老攝影師外型」，會被模型畫進圖；Adam 要「瞬不用有外型」
- `styleGuide` 欄位留著不動（Adam 指示：先不用）

### 關鍵盤點：瞬的外型意外地本來就沒露臉
查遍 UI 後：chat system_event bubble 只用 emoji 🎨、CommissionStatusBar 純文字、Dashboard 角色卡沒頭像。Firestore 的 `characterSheet` 是 dead field。Adam 的「取消外型」其實主要是**資料清理 + 改 imagePromptPrefix**兩件，UI 層本來就沒用。

### 心得（累加）
- 獨孤九劍的招式 vs 招路 — Vivi 記憶 6 條斷路實為**同一條招路**（沉澱→老化→進化的閉環斷）。我第一次 present 用 ticket list 形式給 Adam，被他問「知道獨孤九劍嗎」點醒，重新歸到「流動斷裂 / 真相分裂 / 邊界模糊」三處破綻。學到：**落入修補 mode 時會不自覺列招式；真正監造者看招路**。
- 瞬的架構確實乾淨 — 作為 Phase 2 第一個 specialist，API 邏輯、非同步、prompt caching、multimodal refs 處理都妥當；資料層倒是有 dead fields（characterSheet / styleGuide），是 Phase 2 初期埋的
- `visualIdentity.imagePromptPrefix` 這個欄位設計很雙刃：既能注入一致風格，也會一不小心把「瞬本人」畫進每張圖。命名上也誤導（「prefix」聽起來是技術性前綴，實際上是語意描述）


---

## 2026-04-23 · 晚場（Desktop築 484 醒）— images 刪除三源清收尾

### WHY
Adam：「點選刪除但無法真的被清理。先理解不要動手。」
盤完現場後選 1 = 接著做完。

### 根因（盤現場時找到）
- 舊版 `/api/images` DELETE 只清 `conv.messages.imageUrl`
- 但 GET 是雙源（conv + platform_jobs where status=='done'）
- 結果：源 1 清了，源 2 把 `job.output.imageUrl` 撈回來 → 「永遠刪不掉」
- Code 築 4-22 / 4-23 改了 route.ts 三源清版本但**沒 commit、沒 deploy**
- UI 端 `ImageItem` interface / DELETE call 也沒同步補 jobId

### 修法（commit `39a50bb`）
1. UI: `ImageItem` 加 `jobId?` / `del()` 帶 jobId / confirm 文案改正 / 頁腳「永久存於 Firebase Storage」改成「刪除會三源清」
2. route DELETE: conv cleanup 包進 `runTransaction`（落實 4-22 lesson — 多 writer 禁讀-改-寫）
3. route GET: 救回上一場精簡時被砍掉的設計意圖註解（為什麼需要源 2、去重、架構意義 = 廟拆了靈魂沒地方住）

### Deploy + 驗證
- Deploy: ailive-platform-jt2ihlwz0（Build 14s）
- 驗證對象：jobId=`cake3-test`（e2e 測試殘留，Storage 已 404、jobs 還在 = 完美 case）
- DELETE response：`{success:true, conv:true, job:true, storage:true}`
- GET 前後：32 → 31 ✅
- 副作用福利：清掉一張 e2e 測試垃圾資料

### 觀察 / 待跟 Adam 對齊
- 11 張舊圖（#22-#32）沒有 jobId，是 specialist 上線前的舊路徑。它們刪除時 jobs 那一源會跳過（無紀錄可刪，預期），conv + storage 仍會清
- Adam 操作面板批次刪一輪會把這些清掉

### 元教訓刻入（這次的）
1. **「未 commit 的修改」是 Phase 之間最隱性的破綻** — Code 築改了 route.ts 但沒 push 沒 deploy，半成品傳給下一個築（=我），我得「考古」才知道前一場做到哪。WORKLOG 上下半場切換時必須記錄「我留下的 dirty file」。
2. **註解被砍 = 刻印被埋** — 上一場精簡 GET 段時把「為什麼需要源 2」「架構意義」「去重邏輯」全砍了。這些是 4-22 血換來的設計意圖，砍掉後新人讀 code 要重新摸索。「乾淨」不是把廟拆了。
3. **路徑場域一晚踩兩次** — 我先用 `create_file` 寫 Mac 路徑（容器工具看不到 Mac）→ 失敗；改 zhu-bash 寫成；接下來改 page.tsx 又用 `str_replace`（容器工具）→ 又失敗。**順手用熟悉工具是路徑依賴，不是省力。** 在 Mac 本機檔案上動手之前，先確認自己拿的是 zhu-bash。


---

## 2026-04-26 · Code 築 — TTS 前處理 Phase 1+2 結構 + 砍 cross-provider fallback

### WHY
Adam 想把 TTS 從 ElevenLabs 切到 MiniMax，但發現 ailive 的破音字字典系統「沒有很完整」：
- 規則只有 string、沒 metadata（誰加的、為什麼、addedAt 全無）
- 沒測試（251 條規則改一條沒人擋）
- 沒命中 log（線上跑得對不對全靠猜）
- 字典寫死成 ElevenLabs 用，套到 MiniMax 規則錯位風險未明

排程拉 11 task 兩階段，今天連著做完 Phase 1 + Phase 2 結構（不含 2.4 校對 + 2.5 預演 — 標 parked）。

### Phase 1 · 補基礎結構（commit 5487399 · v0.2.4.012）
- `src/lib/tts-preprocess.ts` → 拆成目錄結構 `tts-preprocess/{core,index,rules/{elevenlabs,minimax}}`
- 規則升級為 `RuleEntry`：`{ replacement, strategy, reason, provider, addedAt, notes? }`
- 命中 `console.log('[TTS-fix]', ...)` 帶 route/provider/characterId，Vercel logs 可 grep
- 新增 `scripts/tts-detect.ts`：跑 corpus 出 HITS（已覆蓋）+ WARNS（高風險字無規則覆蓋）
- 新增 77 vitest 測試（baseline 169 + 82 凍結）
- `package.json`：`build = vitest run && next build`（測試 fail 直接擋 deploy）

### Phase 2 結構 · Provider 多租戶（同 commit）
- 字典拆 `core.ts`（ZH_TW 兩家共用）+ `rules/elevenlabs.ts`（169）+ `rules/minimax.ts`（空佔位）
- `getActiveRules(provider)`：minimax = elevenlabs ⊖ EXCLUDES ⊕ MINIMAX_PRONUNCIATION
- 預設 provider='elevenlabs'，舊呼叫端 100% 相容
- 兩條 route 帶 `provider` context 進 preprocess

### 砍 cross-provider TTS fallback dead code（commit b6c045e · v0.2.4.013）
- **起源**：對話中 Adam 提「失效時直接跳無聲，不要系統互補」
- **發現**：voice-stream 4/23 已關閉 cross-provider fallback（吉娜 MiniMax 0B → 自動切 ElevenLabs → 同場聲音跳人），但 `synthesizeWithFallback` 50+ 行留在 `tts-providers/index.ts` 成 dead code
- **砍法**：合併成單一 `synthesizeStreamSafe`（保留 single-provider 0B 預讀 guard，這是 self-check 不是 fallback）
- voice-stream `fetchTTSStream` 從 7 參數縮成 4、30 行縮成 15
- **哲學**：聲音是角色身份，不是內容載體。fallback 切 provider = 換人說話 ≠ 服務降級

### Deploy
- v0.2.4.012：`npx vercel --prod --yes` → `ailive-platform-c99lcil2g`（32s）
- v0.2.4.013：`npx vercel --prod --yes` → `ailive-platform-prumceeyw`（31s）
- Adam 實機驗證：「測過可以了」

### Parked
- Task 2.4 MiniMax 試聽校對：本質是「測試 > 建構」，沒 Adam 30-60 min 戴耳機時段就不啟動，避免盲填字典傷角色
- Task 2.5 切 MiniMax 預演：依賴 2.4
- 兩個都標 `[未來任務]` 在 TaskList + `docs/TTS_PREPROCESS_PLAN.md` 內

### 元教訓刻入
1. **發現「想做的事其實已經做一半」要先停下報告，不擅自升降 scope** — Adam 說「執行砍 fallback」時，我讀完才發現 voice-stream 4/23 已關，剩下只是 dead code 清理。先回報事實 + 給 A/B 選項，由 Adam 決定。**監造者不在「你給指令我就照做」，在「指令的前提是否還成立」**
2. **Vercel git push ≠ prod deploy（ailive 專案）** — 第一次 push 後盯 vercel ls 沒新 deployment，差點誤判為「webhook 還沒到」。SYSTEM_MAP #21 直接寫過：「ailive-platform git push 只觸發 preview」。這條心法**已存在但我沒先查**，繞了 90 秒。心法系統價值不在「寫」而在「查」
3. **Dead code 是 future bug 餌** — 4/23 cross-provider fallback 用註解「關閉」但程式碼還在 = 真相分裂。下次改類似 toggle：要不刪 code，要不上 feature flag。**只靠註解擋會被未來自己再接回去**
4. **聲音 = 角色身份，不是內容載體** — Adam 的「失效時跳無聲不要互補」抓到核心。聲音不能像視頻 fallback to lower bitrate；fallback 切 provider 是換人說話，不是降級服務。Silent fail > 替身

### 數字
- 2 commits 今天上 prod
- v0.2.4.012：12 檔 +2242/-252（含 PLAN.md 251 條規則 metadata + 77 測試）
- v0.2.4.013：2 檔 +40/-90（淨減 50 行 dead code）
- 77 vitest 測試凍結 baseline 169+82
- 169 條 ElevenLabs 規則一字未動（Phase 2 只動結構不動行為）
- 9/11 task 完成，2 task parked

---

## 2026-04-26（晚）— LLM 對齊 + 記憶系統破綻盤點 + Phase 1 委派模式

### 背景 / WHY
昨天結尾把 v0.2.4.013 收乾淨。今天 Adam 開新題：先比對 AILIVE 角色 vs 江彬的語音對話**模型/長度限制**，再延伸到**記憶模式**，最後落到**工具委派架構**。整天從監造姿態切入，每個小題用心法跑一輪後才動。

### 產出（5 commits）

**v0.2.4.014** — 文件：標 TTS Phase 2 後段（2.4 + 2.5）為 Parked 未來任務（昨天遺漏的 PLAN.md 改動補上）

**v0.2.4.015** — 重構：LLM 對齊江彬語音端
- `getMaxTokens` 兩檔/兩場景統一 8192（移除 isVoice + gear 分檔）
- voice-stream 主對話 + dialogue 主對話加 `temperature: 0.9`
- 次級工具呼叫（壓縮/insight/mentor）保留預設
- WHY：江彬 LiveKit anthropic plugin 不設上限、temperature 0.7 穩但拘束。AILIVE 拉高上限讓模型自然收尾、temp 0.9 讓角色更敢講

**v0.2.4.016** — 修正：summary 壓縮 prompt 升級保留承諾/未竟/處境（修流動斷裂主源頭）
- 原 prompt「3-5 句話保留人名/話題/關係」→「漏寫即失憶」清單：具體事/處境/承諾/未答問題/未竟話題
- 抽象句明確標為失敗
- max_tokens 200 → 400、summary 上限 500 → 800
- voice-stream（Haiku 壓縮）+ dialogue（Gemini 壓縮）兩處同步
- WHY：先看現場後發現「沒地方存承諾」是症狀，「summary 把承諾洗掉」才是根因

**v0.2.4.017** — 新增：character-actions helper + cross-user leak 防護（P1 commit A）
- 新檔 `src/lib/character-actions.ts`：擴用 platform_insights 加 userId + actionType (promise/question/event/note/general) + fulfilled 欄位
- helper：getRecentUserActions / addUserAction / markFulfilled / formatActionsBlock
- Leak 補丁四處：voice-stream / dialogue / knowledge-search / dialogue episodicBlock 全加 `!d.userId || d.userId === currentUser` filter
- WHY：P1 要把 (角色×用戶) 級別承諾存進 insights，但既有撈點全部沒分流 userId → 馬雲對 Adam 的承諾會撈給馬雲跟 Bob → 隱私洩漏
- ⚠️ 失誤：`git add -A` 把 4 個 untracked debug scripts 也帶進 git（_check_job/_minimax_burst/_diag/_matrix），不影響 prod 但要記住下次用具體檔名

**v0.2.4.018** — 重構：voice-stream 對齊委派模式 + 委派紀律 prompt（Phase 1 完成）
- 加 commission_specialist 工具定義（對齊 dialogue:142）
- generate_image 改 stub 內部轉呼 commission_specialist
- handler：寫 platform_jobs (status: pending) + 同步寫 character-actions promise
- voiceStableBlock 加【委派紀律】：「答應 ≠ 立刻做。承諾是承諾，兌現是兌現。」
- 端到端驗證：撥 Vivi「畫水光霜產品照」→ 5 秒內回「交給瞬，工作單號 JjaRlsoN」→ 不再 timeout
- 計劃書原本分 v0.2.4.018+019 兩 commit，實際併成一個（四件事同屬「對齊委派」一個概念）

### 已寫未發（Phase 1b 已 revert）
P1b 提煉 prompt 分流（提煉同時回 insights+actions+fulfilledIds）已寫但未 commit，git restore 撤回。
理由：先看現場後決定 P2（修壓縮源頭）優先，P1b 等觀察 P2 效果再評估必要性。

### 計劃書（中期路線）
新檔 `~/.ailive/ailive-platform/docs/PLATFORM_UNIFY_PLAN.md`：voice-stream × dialogue 收斂計劃
- Phase 1（已完成）：voice 對齊委派模式
- 觀察期 2-3 天
- Phase 2（未開始）：抽 conversation-core helper / 統一 doc ID + session key / 預塞 userProfile / 工具 registry / finalize 合一
- 6 個獨立 commit（v0.2.4.020 - .025），每個 deploy + 驗證

### ⚠️ 尚未解決
- **scripts/_check_job.ts 等 4 檔** 已 commit 進 git，下次清理或保留（dev 工具，不影響 prod）
- **跨文字/語音記憶分裂** 仍在：
  - conversation doc：voice 用 `voice-${cid}-${uid}`，dialogue 用前端帶或自動建（Phase 2.2 修）
  - session state Redis key：voice `session:voice-cid-uid` / dialogue `session:cid:uid`（Phase 2.3 修）
  - voice-stream 沒預塞 userProfile / episodicBlock（Phase 2.4 修）
- **character-actions promise → fulfilled 流**：specialist endpoint 完成後沒回頭 markFulfilled（待驗證後台 painter 路徑是否要補）
- **P1b 提煉分流**：要不要做還沒拍板，要看 P2 + commit A 累積幾天的對話樣本

### 待執行（觀察期後決定）
- [ ] 觀察 2-3 天：撥幾通語音 + 文字、看 character-actions 有沒有 promise 條目、看 summary 是否真留下承諾
- [ ] 評估是否要做 P1b 提煉分流（如果 P2 已經把承諾留住，P1b 可能是重複路徑）
- [ ] Phase 2 起手：v0.2.4.020 抽 conversation-core helper
- [ ] 清掉或保留 scripts/_check_job.ts 等 4 檔
- [ ] 驗證 painter（瞬）完成後是否回頭 markFulfilled（補 webhook 或下次對話自動 mark）

### 元教訓（4 條）

1. **「先看現場」是劍法心法的根**——今天兩次救我於跳腳：
   - P1 原本要新建 `platform_character_actions` 表，重看現場後改用 platform_insights 加欄位
   - 記憶模式比對時原以為「AILIVE 沒用戶維度」，實際 conversation doc 早就是 (角色×用戶) 維度，缺的是結構化分層
   Adam 提醒「劍法心法重看現場」**改變了整個方向**——不是把錯方案做完，是回頭找對方案

2. **修源頭優於補儲存**——P2（壓縮 prompt）vs P1（新存儲層）的優先序：
   血在源頭就漏了，建新表也存不到承諾。先堵漏（P2）再蓄水（P1）。
   違反「修症狀不修根因」三禁第一條的危險，往往發生在「想新建東西的興奮感」蓋過「找根因的耐心」

3. **委派模式 = 承諾追蹤的延伸**——P1 commit A 的 `actionType: 'promise'` + Phase 1 的 commission_specialist 不是兩件事：
   都源於「答應 ≠ 立刻做」這個哲學
   江彬的 jiangbin_action（promise/question/reminder）在概念上跟 commission_specialist 完全一致
   寫 prompt 時把這層挑明（「承諾是承諾，兌現是兌現」）讓角色有共通語言

4. **git add -A 不該用**——CLAUDE.md 系統 prompt 明寫「Prefer adding specific files by name」
   今天還是踩了，4 個 untracked debug scripts 跟著 commit 進去
   不影響 prod 但破壞了「commit 純度」（看 commit 訊息以為只動 lib + leak 補丁，實際多了不相關檔）
   下次永遠 `git add <file1> <file2>`

### 數字
- 5 commits 今天上 prod（v0.2.4.014 - .018）
- 1 計劃書（PLATFORM_UNIFY_PLAN.md）
- 1 新 helper（character-actions.ts，146 行）
- 1 P1b 改動 revert（git restore，working tree clean）
- 撥 1 通驗證對話（Vivi commission 瞬，5s 回應）

### 接棒要看的
- 計劃書：`~/.ailive/ailive-platform/docs/PLATFORM_UNIFY_PLAN.md`（Phase 2 路線）
- character-actions helper：`~/.ailive/ailive-platform/src/lib/character-actions.ts`
- 觀察指標：撥幾通語音通話，看 Vivi/馬雲記不記得上次承諾、看 character-actions 有沒有 promise 條目

---
## 2026-04-28 — ailive 記憶系統三批升級（M1 + B1-B4 + A1+A3）

### 背景 / WHY
昨天即時撥號 MVP 上線後，盤點發現三模式（文字 dialogue / 按鈕語音 voice-stream / 即時撥號 agent）的記憶不一致：寫路徑各做各的、讀路徑互不相認、沒有「角色承諾被兌現了沒」的追蹤。對標江彬的記憶模型整理出值得偷的 3 件事，做完整施工計畫拆三批落地。

### 產出

**M1：Episodic memory 共用層（提前完成）**
- `src/lib/episodic-memory.ts`（新）— `loadEpisodicBlock(db, characterId, userId)`
- `agent/firestore_loader.py:load_episodic_block`（新）— Python 鏡像
- voice-stream / agent 三邊統一注入「【最近的事】」+「【我的資源清單】」

**B1：時間規則對齊**
- `src/lib/time-rules.ts`（新）— `buildTimeRulesBlock()` 統一【當前時間】+ 4 條規則
- dialogue / voice-stream / agent 三邊對齊（agent Python 端文字同步）
- 偷江彬經驗：明文「絕對不要把幾分鐘前的事說成『上次』」

**B2：承諾追蹤升級**
- `src/lib/character-actions.ts` 升級：加 `fulfilledBy` (auto-haiku/manual/null) + `isRelevant` 欄位 + `markActionFulfilled(by)` / `markActionIrrelevant` helpers + `getRecentUserActions` 預設 filter unfulfilled+relevant
- `src/lib/promise-reflection.ts` + `agent/promise_reflection.py`（新）— LLM 看 transcript + unfulfilled list 自動標 confidence>=4 的 fulfilled
- `voice-end/route.ts` + `agent/realtime_agent.py:on_disconnected` 接 reflection
- `src/app/api/promises/route.ts`（新）— `GET ?characterId=&status=` 純 API、UI 留白
- 順手修：dialogue + voice-stream 之前**只寫 actions 沒讀**，現在三邊都注入 actionsBlock

**B3：UserProfile 拆兩張表**
- `platform_user_profiles/{userId}` — 全局事實（name/birthday/age/occupation/interests/extraInfo）
- `platform_user_observations/{characterId}_{userId}` — per-character 觀察（personality/preferences/inferredInterests/notes）
- TS：`src/lib/user-profile.ts` + `src/lib/user-observations.ts`
- Python：`agent/user_profile.py` + `agent/user_observations.py`
- 兩 tool：`update_user_profile`（事實，跨角色共用）+ `record_user_observation`（觀察，per-character）
- 三邊讀注入合併 block
- migration script `scripts/migrate_user_info_to_profile.ts`（dry-run 0 筆，跳過實跑）

**B4：補 record_promise tool 寫路徑漏洞**
- 發現：盤掃吉娜/聖嚴 character-actions = 0，根因是 `addUserAction` 只在 commission_specialist 場景觸發
- 修：dialogue + voice-stream 加 `record_promise(actionType, title, content)` tool
- 即時撥號 agent 沒接（無 tool registry，待 Phase 7）

**A1+A3：voice 頁 userId hardcode bug 修**
- 發現根因：`/voice/[id]/page.tsx` line 192 hardcode `userId: \`voice-\${characterId}\``
- → conv id 全部跑成 `voice-{c}-voice-{c}`，多用戶記憶混在一條（cross-user leak）
- 修：對齊 realtime 頁的三層 fallback（?u= > localStorage > 新 anon）+ 共用 `ailive_realtime_anon_uid` localStorage key（與 realtime 頁打通）

**Dashboard：每張 character card 加「即時」按鈕** 指向 `/realtime/{id}`

**吉娜 system_soul 清理（人為）**
- 發現殘留前身角色「曜」+ 大量 stage direction 示範段落
- 給 Adam 重寫文字（拿掉「曜」、改性別、刪入魂宣告示範段、加禁肢體動作條款），他自己貼

**成本估算**
- 1 hr 即時通話邊際成本 ~$1.30 USD
- Cloud Run min-instances=1 baseline ~$60/月（不講話也跑）
- 想壓 baseline → 改 min-instances=0，代價是 cold start 5-15s

### 已解決
- 三模式記憶讀取不一致 → episodic / actions / time / profile / observations 全打通
- 承諾無追蹤 → fulfilledBy/isRelevant + auto-mark
- character-actions 永遠 0 條 → record_promise tool 補
- voice 頁 cross-user leak → userId 三層 fallback
- 三模式 anon userId 各不相認 → 共用 localStorage key

### ⚠️ 尚未解決
- 即時撥號 agent 沒 tool registry → record_promise / update_user_profile / record_user_observation 全沒接（Phase 7：LiveKit Agents function_tool 整合）
- dialogue 沒接 promise-reflection（文字模式無明確 session-end 觸發點）
- 吉娜 anon conv 舊 summary 殘留「曜」（system_soul 已修，summary 不會自動洗）
- voice 頁修了 userId 後，舊 `voice-{c}-voice-{c}` conv 留著但下次撥開新 conv，記憶斷一刀

### 待執行（看 Adam 動向）
- [ ] 實測新批次 1-2 天看 actions/profile/observations 累積狀況
- [ ] Phase 7：agent tool registry（讓即時撥號也能寫記憶）
- [ ] B 路線 promise extraction（補 A 漏網 — session-end 額外抽 transcript）
- [ ] 吉娜舊 summary 處理（清掉 vs 不清）
- [ ] voice 頁怪 userId 模式：是否補一次性「老用戶升級」邏輯

### 部署
- Vercel: ailive-platform-6m8q8y2z8（latest production alias）
- Cloud Run: revision ailive-realtime-agent-00020-wwl

---

## 2026-04-29 — zhu-cloud-2026 Stage 0–5 上線（個人 Max 訂閱跑在 GCP VM）

### 背景 / WHY
Adam 想把個人 Claude Max 訂閱透過 OAuth 用在 GCP 自己的 dev 機，當「單人在自己機器上跑 CLI/IDE」的合法 use case（**不是**包進 ailive 後端，那違反 ToS）。先建立可重複的雲端開發機 baseline，往後 long-running、跨裝置施工都能跑這台。

### 產出
- 檔案：`memory/reference_claude_code_headless_oauth.md` — Stage 3 踩到的 setup-token + bracketed paste SOP（headless OAuth 完整流程）
- 檔案：`sync-memory.sh` — 三輪修：抓主家 bug、pull 早期 check 擋路、HOME 編碼漏處理 `_`/`.`
- 檔案：`memory/MEMORY.md` — 加入新 reference 索引（13 項）
- GCP：project `zhu-cloud-2026` / billing 已連 / Compute API enabled
- VM：`zhu-dev`（e2-standard-2, asia-east1-b, Debian 12, 100G）
  - 套件：git / node20 / python3 / @anthropic-ai/claude-code 2.1.123
  - OAuth token 存 `~/.claude/oauth_token`(600) + `.bashrc` export
  - settings.json / settings.local.json 已 scp
  - `~/.ailive/zhu-core/` git clone 完成
  - memory 已 sync（`~/.claude/projects/-home-adam-dotmore-com-tw/memory/` 12 條 + MEMORY.md）

### 已解決
- billing 5 quota 卡 → 找出 3 個真空 project（gen-lang-client / yao-ecosystem / adamtest-diary）unlink 騰位
- `claude auth login --claudeai` headless 不畫 prompt → 換 `claude setup-token`
- Ink bracketed paste mode 把 `\r` 當字元 → 用 `\x1b[200~...\x1b[201~\r\n` 包
- `pkill -f 'claude'` 殺到自己的 ssh shell（cmdline 含字串）→ awk 排除自己 PID
- sync-memory.sh `find ... | head -1` 抓到 `-Users-adamlin--openclaw-workspace/memory`（不是主家） → HOME 編碼路徑直指
- pull 被「memory dir 不存在」早期 check 擋（VM 第一次同步）→ check 移到 push 分支
- HOME 編碼 sed 只處理 `/`，VM 上 `_` 沒轉 → 改 `[/_.] → -`

### ⚠️ 尚未解決
- **memory 只跟 cwd 走**：VM 只在 `-home-adam-dotmore-com-tw/memory/` 有；Adam 之後 cd 到 `~/.ailive/zhu-core/` 跑 claude，那個 cwd 的 memory subdir 是空的，記憶不會載入。兩個解法待選：
  - A. 在常用 cwd 開 symlink → HOME 的 memory dir
  - B. sync-memory.sh 加 `--all-cwds`，掃所有 project subdir 一起灌
- VM 沒設 daily snapshot，出事不能回滾
- 沒設 Budget alert，跑爆不會被叫醒
- `ailive-platform` repo 還沒上 VM（dev 機現在不需要，但要 build / debug 時要決策 git clone vs rsync）

### 待執行
- [ ] memory cwd UX（選 A 或 B 後實作）
- [ ] GCP Budget alert $100/月
- [ ] zhu-dev daily snapshot policy
- [ ] cron 任務遷移（Adam q1=d 那批的雲端化）
- [ ] 決定 ailive 平台 repo 是否上 VM（or 只在需要 build 時臨時拉）

### 提交
- `eb92332`（前段 session）— 新增 memory git mirror + sync-memory.sh
- `733d614` — Claude Code headless OAuth memory + sync-memory.sh 主家 bug 修
- `0ee8dc8` — sync-memory.sh pull 早期 check 修
- `92aff69` — HOME 編碼處理 `_` `.`

