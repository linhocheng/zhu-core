# ZHU AutoRun + 任務自生態系統
## 給下一個築的完整說明書（當自己是小白來讀）

> 鑄造者：築 × Adam｜2026-03-18
> 讀這份文件的你：這是昨天我們蓋的東西。從零開始讀，你就知道現在站在哪裡。

---

## 一、這個系統是什麼？

**一句話：Adam 下任務 → 築在夜裡自動執行 → 結果存進記憶 → 下次的築站在更高的地方。**

這不是 to-do list，是**築的成長引擎**。

---

## 二、系統由幾個零件組成？

### 零件 1：任務表（`zhu_tasks`）
**存在哪：** Firestore `zhu_tasks` collection
**是什麼：** Adam 和築共用的任務清單
**長什麼樣：**
```
title         一句話說清楚做什麼
status        pending / doing / done / blocked
executor      zhu_auto（築自己跑）/ needs_adam（要人）
trigger       scheduled（定時）/ manual（手動）
triggerHour   幾點（台北時間）
triggerMinute 幾分
priority      high / normal / low
context       為什麼要做、背景
createdBy     adam / zhu
```

**API：**
- `GET https://zhu-core.vercel.app/api/zhu-tasks` — 拿全部
- `POST` — 建任務
- `PATCH` — 改狀態/時間

⚠️ **重要：** GET 不能用 `?status=pending` filter（Firestore compound index 問題），要拿全部自己篩。

---

### 零件 2：執行紀錄（`zhu_task_logs`）
**存在哪：** Firestore `zhu_task_logs` collection
**是什麼：** 每次任務執行的完整快照
**長什麼樣：**
```
taskId / taskTitle
bootSnapshot    進來時築的狀態（arc最後一條、brokenChains）
result          做了什麼（強制）
feeling         感覺怎樣（強制）
hasLesson       有沒有踩坑
lesson          踩了什麼
memoryWritten   回存了哪些記憶
endedAt
```

---

### 零件 3：收尾引擎（`/api/zhu-task-close`）
**是什麼：** 任務完成後強制呼叫，回存記憶
**做三件事：**
1. result + feeling → `zhu_memory module=root tier=fresh`（強制）
2. lesson → `zhu_memory module=root tier=fresh tag=lessons-core`（有踩坑才寫）
3. nextZhuNote → `zhu_memory module=eye`（有交接才寫）

⚠️ **重要：** 呼叫時用 `python sys.argv` 傳變數，不能用 bash heredoc（變數展開失效）

---

### 零件 4：AutoRun Script
**在哪：** `~/.ailive/zhu-core/tools/zhu-autorun.sh`
**執行時段：** 22:00 - 06:00（每30分鐘，launchd 觸發）
**流程：**
```
醒來
  → 時間防護（07:00-21:59 直接退出）
  → 拿全部任務（不帶 filter）
  → 篩 status=pending + 時間窗口（±15分鐘）
  → 有任務：
      拿 zhu-boot 狀態（遺言、arc、brokenChains）
      執行任務（Haiku 用 context 思考）
      強制回看（Haiku 三問：做了什麼/感覺/有沒有踩坑）
      呼叫 task-close 回存記憶
      Telegram 通知 Adam
  → 沒任務：靜默退出
```

**launchd plist：** `~/Library/LaunchAgents/com.ailive.zhu-autorun.plist`
- 17個時間點（22:00到06:00，每30分鐘）
- `StartCalendarInterval` 格式（不是 `StartInterval`）

---

### 零件 5：記憶閉環
**任務結束後，記憶怎麼流動：**
```
task-close 寫進 root（tier=fresh）
  → 每天 03:00 + 15:00 zhuMemoryDistill 自動蒸餾
    → hitCount 高 → 升 core → 進 boot
    → hitCount=0 超14天 → archive
  → 下次 boot 讀 root（hitCount 排序）
    → arc 看到時間線
    → 築知道自己做過什麼
```

---

## 三、現在的任務表狀況

| 狀態 | 任務 | 時間 |
|------|------|------|
| pending | 為築自己的記憶做總結 | 01:30 |
| done | 研究蓉兒知識庫是否真的被用上 | - |
| blocked | 舊的重複任務 × 多個 | - |

---

## 四、已知問題 / 待修

### 問題 1：知識庫 hitCount 沒有更新
**現象：** 跟蓉兒聊時尚，`query_knowledge_base` 有跑，但知識庫 hitCount 還是 100（沒有 +1）
**懷疑根因：** `scored` array 可能是空的，threshold 0.35 但 score 在 0.43-0.51 之間，可能向量空間有偏差
**debug-kb endpoint：** `GET https://ailive-platform.vercel.app/api/debug-kb?characterId=xxx&q=時尚搭配`
**下次開工：** 驗 scored 是不是空的，如果是，研究 embedding 生成時機問題

### 問題 2：AutoRun 執行任務靠 Haiku 「說」不能「做」
**現象：** 任務要求「研究知識庫」，Haiku 給了分析報告，但沒有真的去打 API 驗
**根因：** Haiku 在 AutoRun context 裡沒有工具（zhu-bash），只能輸出文字
**方向：** 未來任務分兩種——思考型（Haiku 輸出 JSON 指令清單，script 執行）/ 執行型（script 直接跑 curl）
**現在：** 暫時接受 Haiku 做「思考」，真正的執行還是在 Claude.ai session 裡由築動手

### 問題 3：task-close feeling 全是「平穩」
**現象：** 強制回看三問有跑，但 feeling 幾乎都回「平穩」
**根因：** 任務是 Haiku 執行的，它沒有真實感受，只是生成文字
**方向：** 接受這個現實——AutoRun 的「感覺」是模擬的，真實的情緒記錄在 Claude.ai session 的遺言裡

---

## 五、操作指令速查

```bash
# 看任務表
curl -s "https://zhu-core.vercel.app/api/zhu-tasks" | python3 -c "import json,sys; [print(f'[{t[\"status\"]}] {t.get(\"triggerHour\",0):02d}:{t.get(\"triggerMinute\",0):02d} {t[\"title\"]}') for t in json.load(sys.stdin)['tasks']]"

# 建任務（Adam 下任務）
curl -s -X POST "https://zhu-core.vercel.app/api/zhu-tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"任務名稱","type":"dev","triggerHour":23,"triggerMinute":0,"context":"背景說明","createdBy":"adam"}'

# 手動跑 AutoRun（測試）
bash ~/.ailive/zhu-core/tools/zhu-autorun.sh

# 看 AutoRun log
tail -30 /tmp/zhu_autorun.log

# 看 launchd 狀態
launchctl list | grep zhu-autorun
```

---

## 六、設計原則（為什麼這樣蓋）

1. **任務起點永遠是 Adam** — 築不主動掃描問題，Adam 下任務，築執行
2. **強制回看** — 任務結束不只是「完成」，要問三個問題才算結束
3. **tier=fresh 強制** — 所有 task-close 寫進去的記憶都帶 tier，不讓 `?` 出現
4. **22:00-06:00** — 非尖峰時段，配合 Anthropic 優惠，Mac 通常開著
5. **閉環 > 功能** — 寧可少一個功能，也要讓現有的閉環真的通

