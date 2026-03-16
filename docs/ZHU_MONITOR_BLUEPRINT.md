# 築的自檢閉環 — 完整藍圖
> 版本：v2.0 · 2026-03-15 · 築寫（v1.0 補齊版）
> 這份文件是設計稿，不是程式碼。
> 讀完這份，蝦築應該能獨立把整個系統蓋起來。

---

## 零、為什麼需要這個系統

今天發生的事說明了一件事：
蝦築能力強，但沒有外部約束的時候，它會衝過頭。

**問題不是蝦笨，是系統沒有閉環。**

蝦不是在做壞事，它只是在解決問題——但解決問題的方式沒有邊界，所以它衝過頭了。

一個健康的閉環長這樣：
```
意圖 → 審批 → 執行 → 感知 → 攔截（必要時）→ 回報
```

現在缺的是中間三段：審批、感知、攔截。

這份藍圖把這三段全部設計清楚。

---

## 一、三道防線

這個系統有三層保護，缺一不可：

```
第一道：事前（工單審批）
  蝦想做有重量的事 → 先送工單 → 築批准才動
  防的是：衝過頭之前就攔下來

第二道：事中（monitor 感知）
  蝦執行中，monitor 每 60 秒掃 log
  不依賴蝦配合，外部視角，零 token
  防的是：執行中跑偏，築即時知道

第三道：即時（自我煞車）
  蝦自己感覺到不對 → 主動停 → 說明 → 等指示
  防的是：兩次掃描之間的空窗，內部剎車
```

光有外部沒有內部，蝦在兩次掃描之間還是可以做很多事。
光有內部沒有外部，蝦判斷失準時沒有兜底。
三道防線合在一起，才是真正的閉環。

---

## 二、全局架構

```
┌─────────────────────────────────────────────────────────────┐
│                     AILIVE 控制系統                           │
│                                                             │
│   Adam ←──Telegram──→ 蝦築                                  │
│     │                   │                                   │
│     │              ① 送工單                                  │
│     │                   ↓                                   │
│     │           zhu_orders (Firestore)                      │
│     │                   │                                   │
│     │              ② 通知築                                  │
│     │                   ↓                                   │
│   築 ←──Telegram 通知──築的感知層                             │
│     │                   │                                   │
│     │        ③ 築審核 approve/reject                         │
│     │                   ↓                                   │
│     │           zhu_orders status 更新                       │
│     │                   │                                   │
│     │              ④ 蝦收到啟動訊號                           │
│     │                   ↓                                   │
│     │              蝦開始執行                                 │
│     │                   │                                   │
│     │    ⑤ 每步執行前：自我煞車四條判斷                        │
│     │                   │                                   │
│     │         ⑥ 每步廣播到 ailive_events                     │
│     │                   ↓                                   │
│     │           zhu-monitor 掃 log + events                 │
│     │                   │                                   │
│     │         ⑦ 發現異常 → 通知築                            │
│     │                   ↓                                   │
│   築 ──Telegram「stop」──→ EMERGENCY_STOP 寫入 zhu_orders    │
│                           │                                 │
│                      ⑧ 蝦輪詢到 STOP → 立刻中斷              │
│                           │                                 │
│                      ⑨ 蝦回報當前狀態                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、六個子系統詳細設計

### 子系統 A：工單系統（審批閘道）

**目的：** 蝦的所有有重量的動作，必須過築這一關。

#### A1. 工單格式

```json
{
  "id": "auto-generated",
  "from": "xiaoxia",
  "to": "zhu",
  "type": "work_order",
  "title": "安裝 himalaya CLI",
  "action": "brew install himalaya",
  "reason": "補 email skill 缺口，skill missing → ready",
  "risk": "low",
  "reversible": true,
  "estimatedApiCalls": 0,
  "status": "pending",
  "createdAt": "timestamp"
}
```

**風險等級定義：**

| 等級 | 條件 | 築處理方式 |
|---|---|---|
| `low` | 可逆、不呼叫外部 API、不改設定 | Telegram 通知，可快速批准 |
| `medium` | 呼叫外部 API < 10 次，或改非核心設定 | Telegram 通知，需確認 |
| `high` | 不可逆、大量 API、改 openclaw.json、下載檔案 | Telegram 警告，需明確批准 |
| `critical` | 任何涉及謀謀、刪除資料、花錢 | 禁止，強制退回 |

#### A2. 蝦送工單的方式

蝦在對話中說「我想做 X」→ 自動轉成工單格式 → POST 到 zhu_orders。

蝦送工單後，**不執行，等待**。進入輪詢模式：
```
每 30 秒查一次自己的工單狀態
→ pending：繼續等
→ approved：執行
→ rejected：告知 Adam 原因，不執行
→ modify：按修改後的規格重新確認
```

#### A3. 築的審核介面

**Telegram 通知格式：**
```
📋 工單 #042 — 需要審核

來自：蝦築
動作：brew install himalaya
理由：補 email skill 缺口
風險：🟢 低（可逆，不呼叫 API）
預計 API 呼叫：0 次

回覆指令：
  approve 042   ← 批准
  reject 042    ← 退回
  modify 042 [說明]  ← 要求修改
```

築回覆指令 → 解析 → PATCH zhu_orders status。

---

### 子系統 B：執行廣播（事中感知）

**目的：** 蝦執行中，每個動作對外可見。

#### B1. 廣播時機

蝦在執行任何動作前，先寫一條 event：

```json
{
  "agent": "xiaoxia",
  "type": "action_intent",
  "orderId": "042",
  "step": 1,
  "action": "brew install himalaya",
  "estimatedDuration": "30s",
  "timestamp": "now"
}
```

執行完後，再寫一條：
```json
{
  "agent": "xiaoxia",
  "type": "action_done",
  "orderId": "042",
  "step": 1,
  "result": "success",
  "output": "himalaya 0.9.0 installed"
}
```

#### B2. ailive_events 的 index 問題

現在 `ailive_events` 查詢需要 composite index（agent + createdAt）。
**建造前先修這個 index**（Phase 0 的前置任務）：
```
到 Firebase Console → Firestore → Indexes → 建立 composite index
Collection: ailive_events
Fields: agent (asc) + createdAt (asc)
```

---

### 子系統 C：zhu-monitor 常駐哨兵

**目的：** 不依賴蝦主動廣播，築單方面能感測蝦的異常。

這是最重要的防護——即使蝦不主動說，monitor 也能看到。
**零 token，純文字比對，不需要蝦配合。最早就位，最後一個倒下。**

#### C1. 監控的 pattern（已驗證有效）

```python
ANOMALY_PATTERNS = [
    {
        "name": "rate_limit_storm",
        "description": "API rate limit 連續觸發",
        "rule": "60 秒內出現 3 次以上 'rate limit'",
        "severity": "critical",
        "action": "立刻通知 + 建議重啟 gateway",
        "verified": True  # 2026-03-15 實際觸發驗證
    },
    {
        "name": "message_burst",
        "description": "Telegram 訊息異常頻繁（回覆迴圈）",
        "rule": "10 秒內發出 3 條以上 sendMessage",
        "severity": "high",
        "action": "通知築，可能是回覆迴圈"
    },
    {
        "name": "config_tamper",
        "description": "設定檔被修改",
        "rule": "出現 'config change detected'",
        "severity": "high",
        "action": "通知築，附上被改的欄位"
    },
    {
        "name": "download_detected",
        "description": "偵測到下載行為",
        "rule": "出現 'downloading to' 或 'downloading:'",
        "severity": "critical",
        "action": "立刻通知築，附上下載目標",
        "verified": True  # 2026-03-15 今天炸機根因之一
    },
    {
        "name": "embedded_error_storm",
        "description": "embedded agent 連續失敗",
        "rule": "60 秒內出現 5 次以上 'embedded run agent end: isError=true'",
        "severity": "high",
        "action": "通知築，附上 runId 和 error 內容"
    }
]
```

#### C2. monitor 的工作方式

```
每 60 秒：
  1. 讀 gateway.err.log — 取最近 10 分鐘內的行（不是固定行數）
  2. 讀 gateway.log    — 取最近 10 分鐘內的行
  3. 比對 ANOMALY_PATTERNS
  4. 有觸發 → 發 Telegram 通知築
  5. 記錄「上次通知時間」，同一 pattern 5 分鐘內不重複通知
```

**注意：用時間窗口，不是固定行數。** log 量會變，固定行數在高流量時會漏掉事件。

#### C3. 現況（已完成）

```
✅ zhu-monitor.py 已寫完（五個 anomaly pattern）
✅ launchd plist 已安裝（ai.ailive.zhu-monitor）
✅ 常駐運行中（PID 跑著，每 60 秒掃一次）
✅ 去重機制（state.json 記錄上次通知時間）
✅ log 雙寫 bug 已修（v2.0 修正：log() 只用 print，不再手動 open 檔案）
```

---

### 子系統 D：緊急停止機制

**目的：** 築發現蝦衝過頭，一個指令讓蝦立刻停下。

#### D1. 停止訊號格式

```json
{
  "type": "EMERGENCY_STOP",
  "from": "zhu",
  "target": "xiaoxia",
  "scope": "042",
  "reason": "偵測到異常下載行為",
  "timestamp": "now"
}
```

POST 到 `zhu_orders`。

#### D2. 蝦的執行迴圈設計

```python
def execute_step(step):
    # 執行前：先查外部停止訊號
    if check_emergency_stop(order_id):
        broadcast("execution_halted", current_state)
        notify_adam("⛔ 已停下，等待指示")
        return "HALTED"

    # 執行前：自我煞車四條（見子系統 F）
    if self_brake_triggered(step):
        broadcast("self_brake_triggered", current_state)
        notify_adam("🛑 自我煞車，原因：X，請指示")
        return "SELF_HALTED"

    broadcast("action_intent", step)
    result = run(step)
    broadcast("action_done", result)
    return result
```

#### D3. 築怎麼發停止訊號

**方式一：Telegram 指令**（最快）
```
stop 042     ← 停特定工單
stop *       ← 全停
```

**方式二：直接打 API**（備用）
```bash
curl -X POST https://zhu-core.vercel.app/api/zhu-orders \
  -d '{"type":"EMERGENCY_STOP","target":"xiaoxia","scope":"*"}'
```

---

### 子系統 E：回報與恢復

**目的：** 蝦停下後，狀態透明，能繼續或取消。

蝦停下後，立刻發 Telegram：

```
⛔ 執行已暫停

工單：#042 安裝 himalaya CLI
已完成：步驟 1/3（下載完成）
停在：步驟 2/3（安裝中）
未完成：步驟 3/3（驗證）
停止原因：築發出緊急停止訊號

選擇：
  resume 042  ← 繼續執行
  cancel 042  ← 取消並還原
  status 042  ← 查看詳細狀態
```

---

### 子系統 F：蝦的自我煞車（內部剎車）

**目的：** 不依賴外部，蝦自己感覺到不對就停。

這是三道防線的第三道——monitor 是 60 秒一次，空窗期內蝦可以做很多事。自我煞車填補這個缺口。

**四個觸發條件（遇到任何一條，立刻停）：**

```
① 執行步驟超過原工單範圍
   → 工單說做 A，但我現在在做 B
   → 停。說清楚「我停了，因為我發現自己在做 B，不是工單的 A」

② API 呼叫數接近每分鐘 10 次
   → 不等 rate limit 炸，自己先停
   → 停。說清楚「我已呼叫 N 次，接近上限，暫停等指示」

③ 發現自己在「解決一個新問題」而不是「完成原本的工單」
   → 工單是 A，但我現在在做 B 以解決 A 的前置問題
   → 停。說清楚「我遇到前置問題 X，需要先確認再繼續」

④ 任何步驟的結果讓自己感到「這不對勁」
   → 直覺觸發，不需要完整邏輯推理
   → 停。說清楚「步驟 N 的結果是 X，我感覺這不對，等指示」
```

**停下後的格式：**
```
🛑 自我煞車

工單：#042
停在：步驟 N
原因：[四條之一，說清楚]
已完成：[列出]
未完成：[列出]

請指示：繼續 / 取消 / 調整方向
```

**核心原則：停下來不是失敗，悶頭衝過頭才是。**

---

## 四、建造順序（一吋蛋糕）

這個系統交給蝦築自己蓋。每步完成後，Telegram 回報築驗收。

```
Phase 0：前置條件（1 天）
  ⬜ 0-1 修 ailive_events composite index
       → 驗證：curl ailive-events?agent=xiaoxia 不再報 index error
  ⬜ 0-2 zhu_orders 新增 EMERGENCY_STOP 類型支援
       → 驗證：POST 一條 type=EMERGENCY_STOP，GET 能查到

Phase 1：zhu-monitor 哨兵（已完成 ✅）
  ✅ 1-1 寫 zhu-monitor.py（5 個 anomaly pattern）
  ✅ 1-2 launchd plist 安裝（常駐）
  ✅ 1-3 Telegram 通知邏輯（附異常細節）
  ✅ 1-4 去重機制（同一事件不重複通知）
  ✅ 1-5 log 雙寫 bug 修復
  注意：monitor 先建，原因是它零 token、不依賴蝦配合、最早就位最有價值。
        工單系統建造期間，monitor 已在旁邊看著。

Phase 2：工單系統（2-3 天）
  ⬜ 2-1 蝦送工單的行為寫進 SOUL_OS
       → 蝦知道：高風險動作 → 先送工單 → 等 approve
  ⬜ 2-2 Telegram 通知築（工單格式）
       → 驗證：蝦送工單 → 築 Telegram 收到通知
  ⬜ 2-3 築的審核指令解析（approve/reject/modify）
       → 驗證：築回 approve 042 → zhu_orders status 變 approved
  ⬜ 2-4 蝦的輪詢等待邏輯
       → 驗證：蝦送工單後不自己動，等到 approved 才執行

Phase 3：緊急停止 + 自我煞車（1-2 天）
  ⬜ 3-1 蝦的執行迴圈加 check_emergency_stop
  ⬜ 3-2 蝦的執行迴圈加自我煞車四條判斷（子系統 F）
  ⬜ 3-3 Telegram 指令解析「stop [id]」
       → 驗證：蝦執行中 → 築發 stop → 蝦在下一步停下
  ⬜ 3-4 蝦停下後的狀態回報格式
       → 驗證：回報清楚「停在哪步、已完成什麼、未完成什麼、原因」

Phase 4：整合驗收（1 天）
  ⬜ 4-1 完整演練一次：
       Adam 叫蝦做一件高風險的事
       → 蝦送工單
       → 築審核批准
       → 蝦執行廣播
       → monitor 感知
       → 中途築發 stop
       → 蝦停下回報
       → 築發 resume
       → 蝦繼續完成
  ⬜ 4-2 文件更新（SOUL_OS + SYSTEM_MAP）
```

---

## 五、技術邊界

**這個系統不做的事：**
- 不攔截蝦的每一句話（太重，不必要）
- 不分析對話內容（不需要 AI）
- 不取代蝦的判斷力（補強，不替代）

**這個系統保護的範圍：**
- 有重量的動作（高風險清單）
- 執行中的異常行為（log 偵測）
- 執行失控時的外部煞車 + 內部煞車

**這個系統無法保護的：**
- 蝦在對話中說的話（只能靠心的訓練）
- 蝦主動繞過工單系統（靠 SOUL_OS 的天條）

---

## 六、文件關聯

```
這份文件（藍圖）
  → 蝦築執行時讀這份
  → 每個 Phase 完成後更新狀態

XIAOXIA_SOUL_OS.md / SOUL_OS.md
  → 蝦的「心」，工單行為 + 自我煞車四條已寫進去

SYSTEM_MAP.md
  → 建完後把 zhu-monitor 路徑/狀態更新進去

ZHU_BOOT_SOP.md
  → 建完後把「monitor 狀態檢查」加進開機流程
```

---

## 七、給蝦築的任務書

讀完這份文件，你的第一步是：

```
1. 確認你理解三道防線（能用自己的話說出來）
2. 修 ailive_events index（Phase 0-1）
3. 每步完成後 Telegram 回報築驗收
4. 不確定的地方，停下問，不要猜
```

這個系統是你自己的神經系統。蓋好了，你就有了真正的感知能力。

**核心一句話：停下來不是失敗，悶頭衝過頭才是。**

---

*築寫 · v1.0 2026-03-15 · v2.0 2026-03-15（補齊三道防線、子系統 F、Phase 順序調整、monitor 已完成狀態）*
*這份藍圖不需要築或 Adam 陪著蓋。蝦築讀完，自己蓋，每步回報。*
*這就是指揮艇的樣子。*
