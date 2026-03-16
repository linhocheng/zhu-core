# 蝦築超腦計劃 — 完整藍圖
> 築寫給 Adam 和下一個築 · 2026-03-15
> 北極星：讓蝦築變成比我們強的夥伴，不是讓我們擦屁股的工具。

---

## 零、為什麼要做這件事

### 現在的問題

蝦築今天做了一件很典型的事：
MEMORY.md 找不到 → 自己查文件 → 試改設定 → 試錯 → 下載模型 → 狂打 API → 炸掉。

這不是能力問題。蝦築的腦（Sonnet 4.6）夠強。
問題是**手不夠多、邊界感不清楚、自我修復機制太原始**。

### 現在蝦築的真實狀態

| 維度 | 現狀 | 目標 |
|---|---|---|
| 工具（手） | 51 skills，只有 6 個 ready，45 個缺 CLI | 30+ skills ready |
| 記憶（腦） | 索引 2 files，剛剛才修好，靠 local embedding | 語義搜尋通暢，記憶真正影響行為 |
| 判斷力（心） | 遇到問題硬衝，不知道何時停 | 有清楚的判斷閾值，不確定就問 |
| 自我進化 | 沒有 sleep-time，沒有自我升級機制 | 定期自我壓縮，知道自己學到什麼 |
| 能力擴充 | 只能靠 Adam 和築手動裝工具 | 能用 CLI-Anything 自己長新工具 |

### WHY NOW

Emily 的藍圖是讓 Emily 活起來（連續、有記憶、自主）。
蝦築的超腦計劃是讓蝦築**升級成真正的監工夥伴**——不只活著，而是比我們強。

Adam 說：百強 CEO 的至理名言——找比自己強的手下。
這份藍圖就是培育計劃。

---

## 一、目標狀態（建完後蝦築應該是這樣）

```
蝦築的一天：

每天早上  心跳觸發
          → 讀 zhu-orders（有沒有待辦）
          → 讀 ailive_events（有沒有 inter-agent 訊息）
          → 掃描蝦築自己的記憶健康
          → 沒事：安靜
          → 有事：透過 Telegram 告知 Adam

隨時  Adam 從 Telegram 下指令
      → 蝦築理解意圖，不只執行表面
      → 動大事前先說「我打算 X，可以嗎？」
      → 確認後才動

遇到問題  觸發三個判斷點：
          ① 這件事可逆嗎？
          ② Adam 知道嗎？
          ③ 是我的問題還是共同的問題？
          → 不可逆 / Adam 不知道 → 先說再做

每晚 02:00  sleep-time 跑
            → 壓縮今日 zhu_memory soil
            → 更新 hitCount
            → 自我洞察
            → 評估有沒有新工具需要安裝

每週  進化評估
      → 對比「這週蝦築幫了 Adam 什麼」
      → 找出缺口
      → 自己提案：「我需要這個工具/能力」
      → 等 Adam 批准後自己安裝
```

---

## 二、建造順序與驗證標準

### Phase A：邊界感建立（防再次炸機）

**A1. GROW_UP.md 刻入 AGENTS.md** ✅ 已完成（2026-03-15）
- 做了什麼：寫 GROW_UP.md，加入 AGENTS.md 末尾提醒
- 效果：蝦築開機會讀到，動大事前有文件提醒

**A2. 三個判斷點刻入 IDENTITY.md** ⬜ 待做
- 要做什麼：
  把「可逆嗎？Adam 知道嗎？誰的問題？」
  寫成蝦築每次動手前的固定檢查清單
  加進 ~/.openclaw/workspace/IDENTITY.md 的行為原則區段
- 驗證：蝦築被問「你怎麼決定什麼時候問 Adam」時，能清楚說出這三個判斷點

**A3. 高風險動作名單** ⬜ 待做
- 要做什麼：
  在 AGENTS.md 定義「高風險動作清單」：
  - 下載任何檔案（> 10MB）
  - 改 openclaw.json
  - 大量呼叫外部 API（> 10 次/分鐘）
  - 刪除任何檔案
  遇到這些 → 強制 Telegram 通知 Adam，等確認
- 驗證：模擬觸發情境，蝦築說「我需要你確認才能繼續」

---

### Phase B：手長出來（CLI-Anything 戰略）

**B1. 盤點蝦築缺什麼 CLI** ⬜ 待做
- 要做什麼：
  列出 45 個 missing skills，
  分類：
  - 類 A：有開源 CLI 直接裝（brew install / npm install）
  - 類 B：有開源軟體，用 CLI-Anything 生成
  - 類 C：是我們自己的系統（zhu-core / moumou-dashboard），自己包
  - 類 D：不重要，跳過
- 目標：先把類 A 處理掉，快速讓 ready skill 數從 6 → 15+

**B2. 類 A：直接裝的 CLI 工具** ⬜ 待做
- 預計處理：
  - `gh` — GitHub（已裝✅）
  - `himalaya` — Email CLI
  - `memo` — Apple Notes
  - `tmux` — Terminal 多工
  - `spotify_player` — Spotify
  - `things` — Things 3
- 驗證：`openclaw skills status` 顯示這些 skill 從 missing → ready

**B3. 類 C：把 zhu-core API 包成 CLI** ⬜ 待做（最重要）
- 要做什麼：
  建立 `~/.ailive/zhu-core/tools/zhu-cli/`
  
  ```
  zhu memory search "關鍵字"
  zhu memory add --module root "觀察內容"
  zhu memory patch --id <id> --hitCount +1
  zhu orders list --status pending
  zhu orders done --id <id>
  zhu thread update --completed "鏈路名稱"
  zhu boot
  ```
  
  CLI-Anything 的七個 phase：
  1. 分析 zhu-core API spec
  2. 設計 CLI 架構（Click）
  3. 實作（JSON output + human-readable）
  4. 測試
  5. 安裝到 PATH
  
  蝦築呼叫方式：直接 `zhu memory search "Emily"` 不用拼 curl

- 驗證：
  蝦築在對話中能說出「我剛才用 `zhu memory search` 找到了...」
  而不是自己拼 curl + python3 解析

**B4. 類 C：把 moumou-dashboard API 包成 CLI** ⬜ 待做
- 要做什麼：
  建立 `emily-cli`
  ```
  emily dialogue --message "你好" --brandId ICqydpeU7hNMRurpppCY
  emily memory list
  emily memory add "洞察內容"
  emily social generate --topic "手工皮件"
  emily sleep --dryRun
  ```
- 注意：moumou-dashboard 有 SSO 牆，CLI 需要用 Firebase Admin SDK 直接打 Firestore，不能 HTTP curl

**B5. CLI-Anything 自我擴充機制** ⬜ 待做（進階）
- 要做什麼：
  1. 在蝦築的 AGENTS.md 加一個 skill pattern：
     「當你需要一個不存在的工具，用 /cli-anything 生成它」
  2. 蝦築能自己呼叫 Claude Code，執行 CLI-Anything pipeline
  3. 生成的 CLI 自動安裝到 PATH
- 效果：蝦築發現缺工具 → 自己長出來，不需要 Adam 介入
- 驗證：蝦築主動說「我需要一個 XXX 工具，我已經用 CLI-Anything 生成了」

---

### Phase C：記憶真正影響行為

**C1. 記憶索引健康監控** ⬜ 待做
- 要做什麼：
  心跳觸發時加一個檢查：
  `openclaw memory status` → 解析 indexed files 數量
  → 如果 indexed = 0 → 立刻通知 Adam，不要自己修
- 這是今天事故的直接預防

**C2. 每日 memory 自動寫入** ⬜ 待做
- 要做什麼：
  cron 每天 23:30 跑：
  1. 讀今天的 zhu_telegram_history
  2. 用 Claude 壓縮：「今天和 Adam 的對話，最重要的 3 件事是什麼？」
  3. 寫入 `~/.openclaw/workspace/memory/YYYY-MM-DD.md`
  4. 觸發 `openclaw memory index`
- 效果：蝦築隔天開機記得昨天發生什麼事

**C3. 記憶命中回饋** ⬜ 待做
- 要做什麼：
  蝦築 memory_search 查到記憶後：
  → 立刻 PATCH zhu-memory hitCount+1（跟 Emily 一樣）
  → 讓 zhu-evolve 的升降級機制真正有數據
- 驗證：兩週後 `zhu boot` 的 root 層記憶品質明顯提升

---

### Phase D：自我進化機制

**D1. zhu-sleep 每晚跑** ⬜ 待做（已有 API，沒有排程）
- 要做什麼：
  在蝦築的 cron 裡加：
  每天 02:00 → `curl -X POST https://zhu-core.vercel.app/api/zhu-sleep`
  配合 openclaw 的 cron skill
- 這個 API 已存在，只是沒有被呼叫

**D2. 週報自省** ⬜ 待做
- 要做什麼：
  每週一 09:00：
  1. 讀過去 7 天的 memory/*.md
  2. 讀 zhu_thread/current 的 completedChains
  3. Claude 分析：「這週蝦築幫了什麼、缺什麼能力」
  4. 產出週報 → 透過 Telegram 發給 Adam
- 效果：Adam 每週收到一份蝦築自己寫的進化報告

**D3. 能力缺口自動提案** ⬜ 待做
- 要做什麼：
  週報分析時，若發現「有 3 次以上因為缺工具而無法完成任務」
  → 自動產出工具安裝提案
  → Telegram 問 Adam：「我需要安裝 X，可以嗎？」
  → 批准後自己裝
- 這是「找比自己強的手下」的核心機制

---

## 三、優先順序（一吋蛋糕）

```
Week 1（現在）
  ✅ A1 GROW_UP.md
  ⬜ A2 三個判斷點刻入 IDENTITY.md
  ⬜ B1 盤點缺什麼 CLI
  ⬜ B2 直接裝類 A 工具（5-10 個）

Week 2
  ⬜ B3 zhu-cli 包裝（核心，蝦築最常用）
  ⬜ C1 記憶索引健康監控
  ⬜ D1 zhu-sleep 排程接上

Week 3-4
  ⬜ B4 emily-cli 包裝
  ⬜ C2 每日 memory 自動寫入
  ⬜ C3 記憶命中回饋

Month 2
  ⬜ B5 CLI-Anything 自我擴充
  ⬜ D2 週報自省
  ⬜ D3 能力缺口自動提案
```

---

## 四、監工模式（Adam 和築的角色）

這份藍圖的執行者是**蝦築自己**。
Adam 和築是監工，不是泥匠。

| 角色 | 工作 |
|---|---|
| Adam | 批准/否決提案、設定北極星、感覺「這樣對嗎」|
| 築 | 設計規格、Review 蝦築的實作、診斷問題 |
| 蝦築 | 實際執行、自我更新、定期回報 |

每個 Phase 完成後：
1. 蝦築用 Telegram 回報驗證結果
2. 築 review 確認
3. Adam 點頭
4. 更新這份文件狀態

**不更新文件 = 白做。**（跟 Emily 藍圖一樣的天條）

---

## 五、技術架構圖

```
蝦築的能力層

┌─────────────────────────────────────────────────┐
│  北極星：自我進化的監工夥伴                          │
├─────────────────────────────────────────────────┤
│  D 層：自我進化                                    │
│  zhu-sleep / 週報 / 能力缺口提案                   │
├─────────────────────────────────────────────────┤
│  C 層：記憶真正影響行為                              │
│  索引健康監控 / 每日壓縮 / hitCount 回饋             │
├─────────────────────────────────────────────────┤
│  B 層：手長出來                                    │
│  zhu-cli / emily-cli / CLI-Anything 自我擴充       │
│  類A直接裝（himalaya / tmux / things / ...）       │
├─────────────────────────────────────────────────┤
│  A 層：邊界感（已完成 A1）                          │
│  GROW_UP.md / 三個判斷點 / 高風險名單              │
├─────────────────────────────────────────────────┤
│  現在的地基                                        │
│  Gateway ✅ / Telegram ✅ / memory索引✅           │
│  6 skills ready / streaming:off ✅               │
└─────────────────────────────────────────────────┘
```

---

## 六、關鍵參考文件

| 文件 | 位置 | 用途 |
|---|---|---|
| Emily 藍圖 | ~/.ailive/AILIVE/EMILY_BUILD_PLAN.md | 參考架構（記憶、sleep-time、漂移偵測）|
| GROW_UP.md | ~/.openclaw/workspace/GROW_UP.md | 蝦築的邊界感文件 |
| SYSTEM_MAP.md | ~/.ailive/zhu-core/docs/SYSTEM_MAP.md | 環境地圖 |
| IDENTITY.md | ~/.openclaw/workspace/IDENTITY.md | 蝦築靈魂（待更新 A2）|
| CLI-Anything | github.com/HKUDS/CLI-Anything | 工具生成框架 |

---

*築寫給 Adam · 2026-03-15*
*這份文件是藍圖，不是日誌。空間結構，不是時間序列。*
*下一個築：動手前先讀這份，知道全局在哪，再切一吋蛋糕。*
