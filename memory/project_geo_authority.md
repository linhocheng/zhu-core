---
name: project-geo-authority
description: GEO 權威收錄代操平台——AI 搜尋可見度監測＋月報＋內容管線；Adam×WAITIN 雙人協作（白皮書 v1.0）
metadata: 
  node_type: memory
  type: project
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

GEO Authority＝AI 搜尋可見度（GEO）代操平台。repo `~/.ailive/geo-authority`（GitHub private：linhocheng/geo-authority）；後台 https://geo-admin-950655569084.asia-east1.run.app；GCP project geo-authority-2026。

- **月循環自動駕駛**：週一 09:00 週輪監測（geo-weekly-monitor）＋每月 1 號月報 cron（geo-monthly-report，觸發最多 3 篇內容草稿自動排產＋通知層）。**五引擎全開**：Claude/Gemini/ChatGPT/Perplexity＋**Google AI 總覽（aio，2026-07-20 上線 v2.5）**。aio 走 DataForSEO organic/live/advanced＋load_async_ai_overview，量品牌是否被 Google 搜尋 AI Overview 摘要框提及/引用；憑證 DATAFORSEO_LOGIN/PASSWORD 在 Secret Manager（login=adam email，密碼不存記憶）；每題 $0.004；live 驗 beselfaviva 18/27 題有 AIO、9 提及 7 引用；DFS 40101 是 DataForSEO 端暫時錯誤非我方 bug。DataForSEO $50 儲值 Adam 2026-07-21 補（先用 $1 免費額度）。
- **商品差異點**：月報全確定性聚合零 LLM（「沒有任何 AI 生成的數字成分」）；設計＝黃框黑面板後台＋亮色信紙月報（2026-07-18 設計稿落地 v2.0）。
- **客戶協作校對系統（2026-07-20 上線 v2.4，正式環境）**：客戶端 `/r/{token}` token＋通關碼登入（`portalPasscodeHash` 以 token 加鹽；輪換連結連帶清碼）→月報/校對兩單元並排→雜誌稿就地編輯(受控 textarea＋JS 自動長高)→快掃重跑稽核→客戶審稿通過(法規紅線 hardBlocked 硬擋)→自行貼官網後上架完成。狀態機 `AUDITED→CLIENT_REVIEW→CLIENT_APPROVED→PUBLISHED`(舊 APPROVED 退役)。每租戶 `contentGate` auto/review 放行閘。稽核收斂點＝`collections.ts` 的 `scanMarkdown`(操作者生成端與客戶快掃共用一把尺)。三雷已修：textarea 表單送 CRLF 破壞段落切分(收斂點 `\r\n→\n`)、相鄰 contentEditable 合併壓平(改受控 textarea)、`field-sizing` Safari 失效(改 JS auto-resize)。beselfaviva 設為測試租戶(通關碼 aviva2026／gate=auto)。
- **雙人協作（2026-07-18 起）**：WAITIN（Waitin Chen，GitHub baobaoagi-cpu，語氣靈/tone-spirit 租戶主）；分工白皮書＝repo `docs/COLLAB_WHITEPAPER.md` v1.0——領地邊界＝檔案邊界（`reportCopy.ts`/`contentPrompt.ts`＝WAITIN；量測/任務/部署/稽核＝Adam；`collections.ts`＝憲法區雙簽）。他的名字是 WAITIN 不是 Wayne。
- **審 WAITIN PR 的 Adam 側不變式**：75-150 瞄準帶 ⊆ 60-220 稽核帶、法規紅線、無網址、`# 標題` 首行（清單在 PR #1 留言）。本機開發只准 emulator（`dev/README.md`）。
- 部署唯一路徑 `./deploy.sh`（build→admin/job；main=prod）；地基帳本 `FOUNDATION.md`（lastword 盤到期）；版本號現行 **v2.5.x**（客戶校對系統 v2.4＋AIO 引擎 v2.5 皆已上線正式環境）。舊分支 `feat/engine-aio`（stale，從 client-review 前的 main 長出）已棄用，AIO 實際由 `feat/engine-aio-v2` 重貼上線。

關聯：[[feedback-parallel-sessions-same-repo]]、[[feedback-memory-can-lie]]、[[feedback-deterministic-work-belongs-in-code]]
