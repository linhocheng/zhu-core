---
name: 後端改動必須同步客戶端
description: 改了 API schema 或新增欄位，必須同時確認客戶端介面有沒有對應更新
type: feedback
originSessionId: 416ce85e-c458-4bb5-811a-b38dc130d139
---
後端加了新欄位或新功能，必須同步確認客戶端是否需要對應改動，不能只改後端就算完成。

**Why:** 2026-05-29 ailive 生圖管道改動，加了 `scene_reference_url` 欄位但沒檢查客戶端。用戶傳圖是 base64 送進來，沒有 URL，新欄位根本用不到。Adam 指出「本機改但客戶端沒有改」。

**How to apply:** 每次改動 API request/response schema、新增工具參數、或改變資料流，完成後問自己：「客戶端的介面有沒有對應到？」有斷點就一起補，不要分開做。
