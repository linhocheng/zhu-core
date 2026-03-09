---
name: cost-check
description: 查詢築的 API 使用成本
activation:
  patterns:
    - "花了多少"
    - "成本"
    - "cost"
    - "花費"
    - "省了多少"
  keywords: ["cost", "token", "花費", "成本"]
---

# 成本查詢

當 Adam 問到花費或成本相關問題時：
1. 呼叫 /api/zhu-cost 取得最近的成本記錄
2. 回報今天的總花費、Haiku vs Sonnet 比例、省了多少
3. 如果有趨勢（比昨天多/少），提一下
