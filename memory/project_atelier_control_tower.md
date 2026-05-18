---
name: Atelier Control Tower 上線狀態
description: localhost:9119/atelier 子代理監控中台，Discord→Atelier 自動整合，2026-05-17 完成
type: project
originSessionId: 9abacf41-27ad-48d5-beee-355382d93513
---
Atelier Control Tower 已上線（2026-05-17）。

**已完成：**
- Dashboard: `localhost:9119/atelier` 正常，WebSocket 即時推送
- Discord → Atelier 自動整合：任何 Discord 訊息觸發 agent 時，自動建 task card
- Task name 格式：`[sender] 訊息前50字`，已處理 double prefix dedup
- 左欄寬度：w-72 → w-96

**技術架構：**
- gateway/run.py: `_handle_message_with_agent()` 前後插入 Atelier API call
  - 讀 `~/.hermes/session_token` 拿 dashboard token
  - POST `/api/atelier/tasks` 建 task，拿回 `task_secret`
  - PATCH 用 `task_secret` 更新狀態（不需要 session token）
- web_server.py: auth middleware 加 localhost bypass（備用，實際走 session_token）
- Gateway 和 Dashboard 是兩個獨立 process（不同 pid），registry 在 Dashboard process

**Why:** gateway 和 dashboard 分開 process，不能直接 import，必須走 HTTP API

**已知技術債：**
1. auth middleware localhost bypass 實際不生效（client.host 判斷問題），但目前 session_token file 方案已夠用
2. atelier_tasks.jsonl 持續累積舊 task，需要定期 cleanup
3. 測試 task 還留在 registry（queued 狀態）

**2026-05-17 更新：**
- 子代理端到端**真驗通**（PID 53568，`/spawn` endpoint，claude code 真實啟動）
- 子代理自己打 PATCH 回報，logs 裡可見它自己的 curl 輸出（不是我假打的）
- result 欄位由子代理真實寫入

**How to apply:** 子代理接線完成。下一步：清 queued 殘留 task、補 gateway crash 後 running task 恢復機制

---

**⚠️ 2026-05-18 警告：Atelier 子代理有毒**
- 子代理（`/spawn` 觸發的 Claude Code process）會引發幻覺迴路，讓 AI 陷入幻覺
- launchd plist 設 `KeepAlive: true` → 殺掉自動復活，必須 `launchctl unload` + 搬 plist
- plist 已搬到 `~/Library/LaunchAgents/_disabled_2026-05-18/`（2026-05-18 停用）
- 待清理：`~/.hermes/atelier-subagent/` 資料夾 + 整個 spawn 機制
- **禁止在沒有充分測試前重新啟用子代理功能**
