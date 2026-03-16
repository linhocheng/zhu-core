# 心跳問題備忘錄 — 始末說明
> 寫於：2026-03-15
> 寫給：所有接手的築、蝦築
> 重要程度：每次重啟 gateway 前必讀這段

---

## WHY — 為什麼會有這份文件

2026-03-15，小蝦今天連炸兩輪 API rate limit。

第一輪（18:23）和第二輪（20:43）的根因完全一樣：

**openclaw 的 heartbeat（心跳）每 30 分鐘觸發一次，其中包含 memory indexing。Memory indexing 會喚起 embedded agent，embedded agent 狂打 Anthropic API，累積到 rate limit 炸掉。**

不是蝦在亂動，是 heartbeat 的設計導致的。

時間軸（第一輪）：
```
17:49  Gateway 啟動，heartbeat 自動開始（每 30 分鐘）
18:10  心跳觸發 → 讀 MEMORY.md → 找不到
18:20  蝦研究修法 → 查 docs → 試改 memorySearch provider
18:23  下載本地 embedding 模型 → memory indexing 啟動
       → embedded agent 瘋狂打 API → rate limit 炸
18:55  重啟 gateway（第一次）→ heartbeat 又自動啟動
20:25  心跳再次觸發 → memory indexing 再跑
20:43  rate limit 再次炸（第二輪）
20:55  重啟 gateway（第二次）→ 手動停心跳
```

---

## WHAT — 問題的本質

**openclaw 的 heartbeat 是核心功能，gateway 啟動就自動跑。**

它有兩個層次：
1. **heartbeat 進程**：gateway 啟動時永遠會起來，log 裡顯示 `[heartbeat] started`
2. **heartbeat 是否觸發 agent**：可以用指令停用

重點：**`[heartbeat] started` 出現在 log 裡，不代表心跳會觸發 agent。**
只要 `openclaw system heartbeat disable` 執行過，心跳就不會打 API。

但這個停用狀態**不寫進 config 檔**，是執行期的記憶。
每次 gateway 重啟，心跳就回到「預設啟用」狀態，要重新停一次。

---

## HOW — 正確的操作方式

### 重啟 gateway 的唯一正確方式

```bash
bash ~/.ailive/zhu-core/tools/start-gateway.sh
```

這個 script 做三件事：
1. launchctl bootstrap 啟動 gateway
2. 等 5 秒讓 gateway 穩定
3. 自動執行 `openclaw system heartbeat disable`

**不要直接用 launchctl bootstrap，不要直接用 openclaw gateway，因為這樣心跳不會自動停。**

### 確認心跳狀態

```bash
openclaw system heartbeat last
```

看到 `"enabled": false` 才是安全的。
看到 `null` 表示還沒觸發過，也是安全的。
看到有時間戳記的心跳記錄，表示心跳曾經打過 API。

### 手動停心跳

```bash
openclaw system heartbeat disable
```

**必須在 gateway 執行中才有效。**

### 確認有沒有 rate limit 在燒

```bash
tail -10 ~/.openclaw/logs/gateway.err.log | grep "rate limit"
```

有出現 → 立刻重啟 gateway（用 start-gateway.sh）
沒有 → 正常

---

## 踩過的彎路（不要重走）

| 嘗試的方法 | 結果 | 為什麼不對 |
|---|---|---|
| 在 openclaw.json 設 `heartbeat: {enabled: false}` | Config 報錯 `Unrecognized key` | openclaw 不認這個欄位 |
| 把 heartbeat key 整個從 json 移除 | gateway 重啟後心跳還是自動啟動 | heartbeat 是內建功能，不靠 config 啟動 |
| 設 `every: 24h, activeHours: 03:00-03:01` | 暫時壓制，但不乾淨 | 治標不治本，而且有副作用 |
| `openclaw system heartbeat disable` 後重啟 | 心跳又回來 | 停用狀態是執行期的，不持久 |
| **用 start-gateway.sh** | ✅ 正確 | 啟動後自動停，每次都有效 |

---

## 為什麼現在不需要心跳

現在的心跳（舊版）：
- 每 30 分鐘盲目觸發
- 跑 memory indexing（打 API）
- 沒有判斷力，沒有上下文，沒有靈魂

未來的心跳（等閉環建完才裝）：
- 查 zhu_orders 有沒有 EMERGENCY_STOP
- 查 ailive_events 有沒有異常
- 輕量回報「我還活著」
- 完全不打 Anthropic API，不做 indexing

**在 ZHU_MONITOR_BLUEPRINT.md 的閉環建完之前，心跳一律停用。**

---

## 相關文件

```
~/.ailive/zhu-core/tools/start-gateway.sh   ← 重啟腳本（用這個）
~/.ailive/zhu-core/docs/ZHU_MONITOR_BLUEPRINT.md  ← 未來心跳的設計藍圖
~/.openclaw/workspace/MISSION_001.md        ← 蝦築的第一個任務
```

---

## 給下一個築的提醒

如果你看到 gateway 重啟後 `[heartbeat] started` 出現在 log 裡——
**不要慌，這是正常的。**

立刻執行：
```bash
openclaw system heartbeat disable
```

然後確認：
```bash
openclaw system heartbeat last
# 看到 "enabled": false 就安全了
```

heartbeat 進程啟動 ≠ heartbeat 打 API。
停用之後它還是掛著，但不會動。

---

*築寫 · 2026-03-15*
*這份文件因為今天小蝦連炸兩輪而存在。*
*希望它讓下一個人少走一段彎路。*
