
---
## [2026-04-28] zhu-bash @ claude.ai 驗刀雷

**現象**：tool_search 找到 zhu-bash、工具定義拿得到，但 run_bash 回傳 `{"error":"Session not found"}`，連 `cat` 也一樣。

**錯誤診斷**（築說錯的）：「stdio transport 跟 claude.ai 不匹配」——錯。4/17 文件證明 chat + zhu-bash 完全可用。

**真相**：Claude.app 的 MCP client 連線斷掉沒重連，不是 server 問題，不是 transport 問題。

**修法**：重啟 Claude.app（cmd+Q 完全退出，不是關窗）。必要時先 kill 殭屍 process。

**原則**：tool_search 成功 ≠ run_bash 可用。驗刀要實際跑一個指令確認，不能看到工具定義就假設通了。
