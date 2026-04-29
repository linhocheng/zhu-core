---
name: 寫架構診斷前必先核 code + 既有記憶
description: 不核就寫的診斷會把錯誤前提傳下去——MEMORY_DIAGNOSIS.md 翻車過 user_profile / 漏即時撥號斷路
type: feedback
originSessionId: 59b65b14-4e63-47ea-bc93-a67ec60b0e30
---
寫設計診斷 / 進化路線 / 缺口分析這類「跨層綜述」文件時，每一條「現狀描述」必須有 file:line 證據；動筆前必須先撈完相關 project / reference 記憶。

**Why:** 2026-04-29 寫 `~/.ailive/zhu-core/MEMORY_DIAGNOSIS.md` 時兩個翻車：
1. 斷言「user_profile 靜態只堆疊」，實際 `agent/user_profile.py:46-60` 用 `ref.set(payload, merge=True)` 是覆蓋。沒 grep 就寫，違反 CLAUDE.md 三禁第三條（沒驗證假設就動手）。
2. 漏掉「即時撥號模式 observations 寫路徑斷」這條重點——但這條早就寫在 `project_ailive_memory_system_upgrade.md` 自己的記憶裡。動筆前沒讀記憶。

漂亮的診斷把錯誤當前提傳給下一個動手的築，比沒診斷更危險。Route C 如果照診斷做就會多動 user_profile 那層白工。

**How to apply:**
- 寫架構診斷 / 進化路線 / 缺口分析前：
  1. 先 `cat MEMORY.md` 撈完相關 project / reference 記憶，把已知 known fact 列出來
  2. 每條「現狀 X 缺 Y」後面附 file:line 證據，不能只憑印象
  3. 寫完先自核一輪：「我聲稱 X 缺，code 真的缺 X 嗎？」
- 看到別人（或上次的自己）寫的診斷時：**動工前每條重核一遍，不相信描述，相信 code**
- 紅旗訊號：「我記得是這樣」「應該是這樣」「之前看過」——全部要去 grep
