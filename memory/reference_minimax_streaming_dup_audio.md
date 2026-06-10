---
name: MiniMax 串流 TTS 最後一塊 status==2 重複整句
description: 即時語音用 MiniMax T2A v2 stream:true 降延遲時，最後一塊會整句重送導致角色說兩次的坑與修法
type: reference
originSessionId: 1d6fd1e4-c65d-4e5b-badf-953d8930f1b5
---
MiniMax T2A v2 串流（`stream:true`）每個 SSE chunk 帶 `data.status`：`1`=逐塊增量音訊，`2`=**最後一塊，內含整句完整音訊（整包再送一次）**。若逐塊 push 又沒擋 status==2 → 播完整句再播一遍 = **角色說兩次**，100% 必現。

**修法（兩層確定性）：**
1. payload 加 `stream_options.exclude_aggregated_audio:true`（API 不送整包）
2. 解析迴圈硬擋 `if data.get("status")==2: continue`（即使參數被忽略也保證不重複）

**踩過：** 2026-06-10 ailivex 即時語音改串流降延遲後角色說兩次；先往前端 livekit AudioContext 查四輪沒中，根因在 `agent/minimax_tts.py` `_run()`。

**診斷教訓：** 「改 X 之後壞」第一件事是 diff `.bak` 前後版，不是先理論推；本機探針 import 真實協定實打 API 印每塊 status+bytes，當場證實，不等遠端撥號。

完整文件（給大家參考）：`~/.ailive/zhu-core/docs/LESSONS/語音延遲優化_MiniMax串流TTS.md`
另注：MiniMax `speed`/`vol` 是 float（0.5–2.0）不可 int() cast，`pitch` 才是 int。
