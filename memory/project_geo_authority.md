---
name: project-geo-authority
description: GEO 權威收錄代操平台——AI 搜尋可見度監測＋月報＋內容管線；Adam×WAITIN 雙人協作（白皮書 v1.0）
metadata: 
  node_type: memory
  type: project
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

GEO Authority＝AI 搜尋可見度（GEO）代操平台。repo `~/.ailive/geo-authority`（GitHub private：linhocheng/geo-authority）；後台 https://geo-admin-950655569084.asia-east1.run.app；GCP project geo-authority-2026。

- **月循環自動駕駛**：週一 09:00 週輪監測（geo-weekly-monitor）＋每月 1 號月報 cron（geo-monthly-report，觸發最多 3 篇內容草稿自動排產＋通知層）。**五引擎全開**：Claude/Gemini/ChatGPT/Perplexity＋**Google AI 總覽（aio，2026-07-20 上線 v2.5）**。aio 走 DataForSEO organic/live/advanced＋load_async_ai_overview，量品牌是否被 Google 搜尋 AI Overview 摘要框提及/引用；憑證 DATAFORSEO_LOGIN/PASSWORD 在 Secret Manager（login=adam email，密碼不存記憶）；每題 $0.004；live 驗 beselfaviva 18/27 題有 AIO、9 提及 7 引用；DFS 40101 是 DataForSEO 端暫時錯誤非我方 bug。DataForSEO 已儲值（Adam 2026-07-21 完成，免費額度當天差點被兩輪失敗監測燒穿）。
- **商品差異點**：月報全確定性聚合零 LLM（「沒有任何 AI 生成的數字成分」）；設計＝黃框黑面板後台＋亮色信紙月報（2026-07-18 設計稿落地 v2.0）。
- **客戶協作校對系統（2026-07-20 上線 v2.4，正式環境）**：客戶端 `/r/{token}` token＋通關碼登入（`portalPasscodeHash` 以 token 加鹽；輪換連結連帶清碼）→月報/校對兩單元並排→雜誌稿就地編輯(受控 textarea＋JS 自動長高)→快掃重跑稽核→客戶審稿通過(法規紅線 hardBlocked 硬擋)→自行貼官網後上架完成。狀態機 `AUDITED→CLIENT_REVIEW→CLIENT_APPROVED→PUBLISHED`(舊 APPROVED 退役)。每租戶 `contentGate` auto/review 放行閘。稽核收斂點＝`collections.ts` 的 `scanMarkdown`(操作者生成端與客戶快掃共用一把尺)。三雷已修：textarea 表單送 CRLF 破壞段落切分(收斂點 `\r\n→\n`)、相鄰 contentEditable 合併壓平(改受控 textarea)、`field-sizing` Safari 失效(改 JS auto-resize)。beselfaviva 設為測試租戶(通關碼 aviva2026／gate=auto)。
- **雙人協作（2026-07-18 起）**：WAITIN（Waitin Chen，GitHub baobaoagi-cpu，語氣靈/tone-spirit 租戶主）；分工白皮書＝repo `docs/COLLAB_WHITEPAPER.md` v1.0——領地邊界＝檔案邊界（`reportCopy.ts`/`contentPrompt.ts`＝WAITIN；量測/任務/部署/稽核＝Adam；`collections.ts`＝憲法區雙簽）。他的名字是 WAITIN 不是 Wayne。
- **審 WAITIN PR 的 Adam 側不變式**：75-150 瞄準帶 ⊆ 60-220 稽核帶、法規紅線、無網址、`# 標題` 首行（清單在 PR #1 留言）。本機開發只准 emulator（`dev/README.md`）。
- **客戶端網站健檢單元（v2.6，2026-07-21）**：`src/findings.ts` 純函數收斂點（deriveFindings/diffFindings）把 audit 技術體檢翻客戶語言（嚴重度＋白話＋怎麼修＋前後對照），客戶入口第三單元 `/r/{token}/health`。客戶只能看，重掃由操作者觸發。
- **v2.8.1-v2.9（2026-07-22）**：通關碼＝校對權限的鑰匙（**contentGate 與通關碼是兩顆開關**：gate 管草稿走不走操作者審、通關碼管客戶進不進得了校對區；沒碼＝入口唯讀且 token-only 不設防）；建檔強制通關碼＋token 即發、輪換原子換碼。四租戶：週一 beselfaviva（aviva2026）/inlykol（inly2026）、週二 reddoor（justar2026）、週三 dotmoremedia 達摩媒體；v2.8 cron 排產+4h timeout（78 分實跑）+建檔鎖門三信號 7/22 全實證。**承重牆 24 案 pinning test**（test/*.test.mjs，npm test=tsc+node --test 對 dist 測，CI tests job 每 push 咬）；零題庫防呆（intake 沒完排監測會報錯）；手動監測 batchId 帶時分（不疊批）；admin overrides sharp ^0.35（audit gate 復綠）。**push 後必看 CI**（audit gate 紅過半天沒人發現）。
- **產文節奏 v2.8.0（2026-07-21 Adam 定）**：自動排產掛在**每輪監測完成後**（runMonitor.ts 尾端，worker drain 同次執行生完草稿），首輪（零 content 單＋零資產）加碼 5 篇、之後每輪 contentPerCycle 篇（標準=週輪 2 篇）；cron 輪必排、手動輪只首輪排；月報回歸純報告。健檢頁 ④ 空位題有「生成草稿」手動鈕（產文走 bridge 零成本）。**順序雷：健檢在監測前跑＝visibility 空＝④ 不出現**，正確順序＝監測完→健檢。task-timeout 60 分→4h（兩輪並行雙撞超時 $5.43 學費；cron 日單執行串行消化多租戶，timeout 要算當日總和）；失敗任務 cost 隨心跳寫回（D11 清）。三租戶：beselfaviva/inlykol（週一）、reddoor（週二，stagger 配的）。
- **對外多租戶版（v2.7.0，2026-07-21，10 租戶就緒）**：排程真相＝**單一 Cloud Scheduler `geo-daily-heartbeat`（0 15 * * * 台北＝美國深夜離峰，JOB_ACTION=daily）**，舊 weekly/monthly scheduler 已刪；到期判斷資料驅動（`src/schedule.ts` 純函數＋每租戶 `tenant.schedule`：cadence weekly/biweekly/monthly＋monitorDay＋reportDay＋contentPerCycle）；**建檔 assignStagger 自動錯開**各租戶監測/月報日（分散引擎負載）；per-tenant 月預算閘（runMonitor 開跑前查當月累計，缺省用全域值）；公開登入口限流（portal 通關碼 5 次/15 分 token+IP、operator 5 次/IP，失敗計數制，`admin/src/lib/ratelimit.ts`）；建檔 tier（標準=weekly/3 篇、輕量=biweekly/1 篇）＋租戶頁排程與預算卡＋競品編輯 UI。缺省 schedule＝週一/1 號/3 篇＝舊行為零遷移。
- **symlink 共用檔雙雷**：加新 `src/*.ts` 共用檔＝三件套（src 檔＋admin/src/lib symlink＋Dockerfile.admin 逐檔 COPY）；共用檔內相對 import 的目標也要進 symlink 鏈（types.ts 之例）。
- 部署唯一路徑 `./deploy.sh`（build→admin/job；main=prod）；地基帳本 `FOUNDATION.md`（lastword 盤到期；**D4 異地備份觸發條件「任一真付費客戶」——10 租戶第一家建檔前補**）；版本號現行 **v2.7.x**。舊分支 `feat/engine-aio`（stale）已棄用。

- **2026-08-04**：security CI 破窗 6 天現形並清(D12,v2.10.0.020/021)——firebase-admin 12→14＋postcss/uuid override,npm audit 0 vulnerabilities,CI 轉綠。同日跟 Adam 對過月報「上升 30%」的認知落差(百分點差 vs 相對成長率混淆,Aviva 目前只有一份 Day-0 報告無任何 delta)、確認監測動作本身不保證提及率上升(問 AI 是無狀態查詢,不影響未來索引)。寫了三功能計畫書(僅設計未實作)存在 `~/.claude/plans/melodic-questing-fern.md`：**A 內容引用閉環**(客戶上架填真實網址→比對 citedUrls,難度S)、**B 每日脈動監測**(opt-in輕量探針,真實非插值,重點是雙層過濾防止污染官方週/月指數,難度M風險最高)、**C 分項趨勢線**(每引擎/競品差距/平均引用數各自畫趨勢,零風險)。建議順序 C→A→B。尚未開始施工,等 Adam 下次確認 GO。

關聯：[[feedback-parallel-sessions-same-repo]]、[[feedback-memory-can-lie]]、[[feedback-deterministic-work-belongs-in-code]]、[[feedback_terse_responses]]
