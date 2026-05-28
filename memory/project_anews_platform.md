---
name: ANEWS 平台進度
description: 長文自動編排平台當前施工狀態與已知問題
type: project
originSessionId: cb4006f6-1b44-47b5-98d0-199f061785f4
---

**2026-05-28e 最新狀態（session 5）：** pipeline 穩定，兩篇全鏈路驗收通過（薑黃 + 網紅行銷）。

**已完成（累積）：**
- singleWriteMode 全鏈路（source→intel→blueprint→article-write Cloud Run→polish→image→coherence→export）
- watchdog image kick 改 enqueueTask（修 sync fetch timeout 死循環）
- watchdog article-write Section 1 改 enqueueTask（修 sync fetch Cloud Run 最長 163s，cron 先 timeout）
- blueprint #19 修正：image_tasks 改 delete-then-recreate（幂等，retry 路暢通，無重複 docs）
- 拔掉 blueprint_running status flip 後患（harness 把 PRECONDITION 算失敗 → needs_repair）
- vercel.json 補 LLM workers maxDuration 120s
- /dashboard Basic Auth（帳 adam，pw 已設 Vercel env ADMIN_PASSWORD）
- 讀者頁（/articles/*, /issues/*, /）不鎖
- article 內頁 hero image 接通（imageUrls[0] 從 image_tasks 撈）
- editorial-jobs POST 支援 skipGates（測試全自動跑）
- CF 524 根治：BRIDGE_URL → 35.236.185.222:3001 直連 VM 繞 CF
- 讀者頁 RWD（768px breakpoint）+ Hero 重設計

**技術債（未解）：**
- #16 callbackOrchestrator taskId = Date.now()，冪等鎖不完整（advancePhase 部分兜住，section_done/stitch_done 等 case 有重複 enqueue 風險）
- export watchdog 缺失：若 export 靜默失敗，issue 卡 coherence_passed
- 圖生成串列偏慢：12 張 ~25 分鐘（Cloud Run 串列，正常設計但慢）
- #9 startNextSubArticle 是死路（singleWriteMode 不走，影響低）
- Vercel article-write route 是死碼

**下一步：**
評估修 #16：taskId 改 `orch-${event}-${issueId}`（去掉 Date.now()），但需先確認同一 issue 是否合法多次觸發同一 event（各文章 stitch_done 帶不同 articleId）。若有，taskId 需帶 articleId。

**Why:** pipeline 基建穩定，下一步是結構性可靠度（#16 冪等）
**How to apply:** 醒來先看 dashboard 有沒有卡住的 issue，優先評估 #16 修法
