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

