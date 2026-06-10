---
name: 壓縮續跑前先查現場狀態，別盲信摘要
description: 被壓縮(compacted)的 session 摘要可能是已被別處解掉問題的舊快照；續跑前先查 WORKLOG/lastwords/git log
type: feedback
originSessionId: fe444547-4b36-4a4c-9d43-1ee32c82f4c7
---
被壓縮的 session 摘要只描述「卡住時的那條線」，不會告訴你問題是否已在**別的 session / 別台機器**被解掉。續跑前第一件事是查現場真相，不是盲目接著摘要那條線往下鑽。

**Why**：2026-06-10 ailivex「語音說兩次」。我被交接一份全是「前端 AudioContext debug」的壓縮摘要，就繼續鑽前端四輪。其實同一天稍早的 session 早已找到根因（MiniMax 串流 status==2 整句重送）、修好、上線、寫進 WORKLOG + LESSONS + memory。我若進場先 `tail WORKLOG.md` / `git log` / 讀 lastwords，一眼就看到「已解決」，根本不用鑽。摘要是真相的子集，而且是過時的子集。

**心態**：摘要給的是「我上次卡在哪」，不是「現在世界長怎樣」。把摘要當待驗證的線索，不當當前事實。

**How to apply**：續跑被壓縮的 session（尤其是 debug 類）動手前先跑三條——① `tail -60 WORKLOG.md` 看這題是否已有結論 ② `git log --oneline -10` 看有沒有別的 session 已 commit 修復 ③ 讀最新 session-lastwords。任一顯示「已解決」就停止鑽摘要那條線，改去驗證/對齊現況。對應 `feedback_memory_can_lie`（記憶會說謊，先驗現場）的壓縮場景特化版。

**觸發信號**：拿到 conversation summary 開頭、看到「continue debugging X」、發現自己要接著一條卡了很久的線往下做。
