---
name: 自我重排的背景迴圈必須綁 lifecycle 停止條件
description: 寫 self-rescheduling timer/loop（會自己排下一次的）時，第一刻就要有綁到生命週期的停止旗標
type: feedback
originSessionId: c9f23080-9ecc-4ed7-a2dc-ae28676c980a
---
任何「自己排下一次執行」的背景迴圈（timer.call_later 重排自己、setInterval 式、while+sleep 輪詢），**從寫的第一刻就要有一個綁到生命週期的停止條件**，不能只寫排程不寫終止。

**Why：** ailivex 即時語音的 3a 主動發話用 `_arm` 自我重排，但斷線（room disconnected）時沒人喊停 → timer 在房間關閉、process exiting 後**還每幾秒醒來空轉**，造成：①`AgentSession isn't running` error（空轉時想說話就對死 session 開火）②資源洩漏 ③重連時舊迴圈沒死、新 session 疊上來一團亂。我在 **v6/v8/v9/v10 重複踩這同一個 `isn't running`**——重複本身就是訊號：當初每次都只補當下那個 error，沒從根上給 3a 一個 lifecycle 停止條件。

**心態：** 寫 self-rescheduling 迴圈時很容易只想「它怎麼開始、怎麼排下一次」，忘了「它怎麼停」。停止條件不是收尾才補的事，是迴圈設計的一部分——沒有它，這個迴圈就是個會在背景永遠跑的殭屍。

**How to apply：** 寫任何自我重排迴圈時，同一個 commit 內就要有：①一個停止旗標（`_stopped`）②所有結束路徑（disconnect / shutdown / close / error）都設旗標 ③迴圈入口第一行檢查旗標就 return（不再重排）。三件齊全才算寫完。退出路徑常常不只一條（room disconnected ≠ process shutdown），要把它們都涵蓋。

**觸發信號：** 看到 `loop.call_later(... 自己)`、`setInterval`、`while True: ... sleep`、或任何 `_arm()/schedule()` 在 callback 結尾又呼叫自己 → 立刻問「它在 disconnect/shutdown 時怎麼停？」。看到 log 出現「資源/session 已關閉後還有活動」「isn't running / already closed」→ 多半是某個迴圈沒綁 lifecycle。
