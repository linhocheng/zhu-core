---
name: 後端改動必須同步客戶端
description: 改了 API schema 或新增欄位，必須同時確認客戶端介面有沒有對應更新
type: feedback
originSessionId: 416ce85e-c458-4bb5-811a-b38dc130d139
---
後端加了新欄位或新功能，必須同步確認客戶端是否需要對應改動，不能只改後端就算完成。

**Why:** 2026-05-29 ailive 生圖管道改動，加了 `scene_reference_url` 欄位但沒檢查客戶端。用戶傳圖是 base64 送進來，沒有 URL，新欄位根本用不到。Adam 指出「本機改但客戶端沒有改」。

**How to apply**（2026-08-07 動作化升級）：改完 schema／欄位／工具參數，**立刻跑 `grep -rn '<改掉的識別字>'` 掃全 repo（含另一個語言的鏡像目錄）**，把命中清單貼進 commit message 或交付訊息。

- 有型別系統就讓它列清單：改 enum／union 後跑 `tsc`，**編譯器比我 grep 可靠**（2026-08-06 改 `CaseStatus` 一次吐出 9 個錯，散在 db/guards/6 個 route）
- 跨語言鏡像（TS ↔ Python）型別系統照不到，**只能靠 grep**，不能靠印象
- 原姿態版（完成後問自己「客戶端有沒有對應到」）留作理由：那一問答得出「有」和答得出「我查過了，清單在這」是兩件事

**觸發信號:** 動到任何 request/response schema、`interface`／`type`／enum、Firestore 欄位名、工具參數；或看到 log 說「某欄位 missing — skip」（第一直覺是契約缺一邊，不是資料沒灌）。

- 驗證+1:2026-08-01 第7場 — 復活律動 TS 前先查 Python 鏡像,legacy 路徑補了 revivedAt 一行

- 驗證+1:2026-08-05 第2場 — schema 改 durationSec/transitionIn 後，驗證器/幀計畫/UI/導演協議四處同步

- 驗證+1:2026-08-06 第1場 — 改 CaseStatus 後型別檢查抓出所有讀寫端，逐一跟上

- 驗證+1:2026-08-08 第3場 — CaseStatus/RoleDoc 改版用 tsc 探照燈掃全讀寫端

- 驗證+1:2026-08-08 第6場 — 走步鬆綁語音+文字兩線同步（兩route共讀只修一邊=沒修）
