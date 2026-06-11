---
name: humanizer 兩段式去 AI 味工具(獨立未接系統)
description: ~/.ailive/humanizer/ 的 standalone CLI,程式硬擋+LLM改判斷題;刻意未接任何系統,閒置零消耗;接系統時是搬規格不是 import Python
type: project
originSessionId: fe444547-4b36-4a4c-9d43-1ee32c82f4c7
---
`~/.ailive/humanizer/`:把 AI 寫作 24 模式做成兩段式去味工具(2026-06-11 建)。

**狀態:刻意未接系統。** 純 5 個 .py 檔(84KB),無 systemd/cron/launchd/Vercel/Cloud Run。是「叫才動」的 CLI,不是服務,閒置零 CPU/網路/花費。資料夾無 .env,secret 不落地。

**架構**:
- Stage 1 `lint.py`:程式硬擋確定性指標(emoji/彎引號/填充短語/破折號密度/三段式/否定排比),機械類自動修,判斷類只標記。無連網無副作用。
- Stage 2 `humanize.py`:只把判斷類(誇大象徵/模糊歸因/宣傳語言/注入靈魂)交 LLM,走 bridge(/v1/messages,Max $0)。輸出用 <rewritten>/<changes> 標籤+regex 抽不用 JSON。
- `test_lint.py` 17 條全綠。

**Why 這樣設計**:守天條(確定性用程式不丟 LLM)+ bridge-first(不燒付費 key)。

**How to apply**:
- 未來接 MACS/ANEWS(TS 系統)時,是把 `patterns.py` 那張模式表+詞彙黑名單**移植成 TS lint**,釘在 bridgeCreate 回傳後的收斂點——不是跨語言 import 這份 Python。這份 Python 是「規格的可執行參考實作」。
- **邊界教訓**:適合「該像中立專業文件」的場景(MACS memo/ANEWS 新聞)。社群爆款公式文(金句+TakeAway+hashtag)不要無腦套 Stage 2——會變乾淨但拔掉傳播鉤子。公式有沒有效是市場說了算,不是用文學品味判斷(Adam 2026-06-11 點正)。
