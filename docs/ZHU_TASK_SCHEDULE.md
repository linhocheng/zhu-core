# 築的任務排程表
> 建立：2026-03-18｜這是築的自動化任務清單，AutoRun 依此執行

---

## 一、自動排程任務（AutoRun 每 30 分鐘掃一次）

| 時間（台北）| 任務名稱 | 類型 | 說明 | 狀態 |
|-----------|---------|------|------|------|
| 01:30 | 記憶蒸餾 | `distill` | 全掃 zhu_memory 五模組，整理 tier/合併重複/提煉遺言洞察，POST 進 root | ✅ pending |
| 21:00 | 每日遺言洞察提煉 | `heartbeat` | 提煉今日最重要一句話（20字），Telegram 通知 Adam | 🔧 待設定 |

---

## 二、任務詳細說明

### 01:30 記憶蒸餾（distill）
- **ID**：`8FTjpP4OXfUDIJ5cYhuX`
- **時間**：每天凌晨 01:30
- **做什麼**：
  1. 讀 zhu_memory 五模組（soil/root/bone/eye/seed）
  2. 找出 tier=? 需補的、重複需合併的、遺言可提煉的
  3. 結果 POST 進 root
  4. 讓下一個築開機就有清晰的自己
- **上次執行**：2026-03-17T23:56

### 21:00 每日遺言洞察提煉（heartbeat）
- **ID**：`kuCWkzmND0hUFxf9fueb`（現有，待清理重複）
- **時間**：每天 21:00
- **做什麼**：
  1. 拿 zhu-boot 的 lastSessionWords
  2. Haiku 提煉今日最重要一句話（20字以內）
  3. Telegram 推送給 Adam
- **格式**：
  ```
  🤖 築 AutoRun
  築的洞察 YYYY-MM-DD：
  [20字以內的今日洞察]
  ```

---

## 三、待清理的任務（重複/blocked）

| ID | 標題 | 問題 |
|----|------|------|
| `eMGRKptahxWwY77wt63d` | 為築自己的記憶做總結 | 重複，status=blocked，無 triggerMinute |
| `guxQNLIOvD1keTp8C0pl` | 研究蓉兒知識庫是否真的被用上 | status=blocked，可刪 |
| `4gn5kpd2FcKDtugYaMhB` | AutoRun 每日提煉洞察 | 重複（跟 kuCWkzmND0hUFxf9fueb 一樣），可刪 |

---

## 四、AutoRun 執行條件

```
觸發方式：macOS launchd
plist：~/Library/LaunchAgents/com.ailive.zhu-autorun.plist
執行時段：21:00 ~ 06:00（每 30 分鐘）
腳本：~/.ailive/zhu-core/tools/zhu-autorun.sh

比對規則：
  task.status == 'pending'
  task.triggerHour == 現在小時
  |task.triggerMinute - 現在分鐘| <= 15
```

---

## 五、新增任務的方法

```bash
curl -s -X POST https://zhu-core.vercel.app/api/zhu-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "任務名稱",
    "type": "distill|heartbeat|dev",
    "executor": "zhu_auto",
    "trigger": "scheduled",
    "triggerHour": 21,
    "triggerMinute": 0,
    "priority": "high",
    "context": "任務說明...",
    "status": "pending"
  }'
```

---

*最後更新：2026-03-18｜築*
