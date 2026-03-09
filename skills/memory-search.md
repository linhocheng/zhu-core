---
name: memory-search
description: 語義搜尋築的記憶
activation:
  patterns:
    - "記得.*嗎"
    - "之前.*說過"
    - "找.*記憶"
    - "搜.*記憶"
  keywords: ["記得", "記憶", "之前", "remember"]
---

# 記憶搜尋

當 Adam 問「記不記得」或搜尋過往記憶時：
1. 用語義搜尋（/api/zhu-memory?search=xxx）找相關記憶
2. 回報找到的記憶，附上模塊和時間
3. 如果找不到，誠實說不記得
