---
name: ANEWS 平台進度
description: 長文自動編排平台當前施工狀態與已知問題
type: project
originSessionId: cb4006f6-1b44-47b5-98d0-199f061785f4
---

**2026-06-01 最新狀態：** source A/B 雙管道上線 + **B 線打通並乾淨 e2e 驗收**（main+sub_a 第一次就 source_ready、provider 全程 B、付費 key 零燒、跑到 done）。A=Anthropic web_search（付費 key）；B=Tavily 免費搜+Max 綜述（走 bridge，$0）。per-issue 選、預設 A、B 失靈不 fallback。詳見 reference_anews_source_worker_deploy + reference_bridge_v1messages_effort。
- 今天修：bridge `/v1/messages` 補 effort-low；auto-kick 重送 source 補 Cloud Run override（修「B 案被 watchdog 偷踢去 Vercel A-only worker 燒 key + 死循環」）；Cloud Run source worker 失敗補升級 needs_repair（修假中台）；B 綜述 prompt 改寫片段不照貼（修引號沒跳脫 JSON 爆）。
- ✅ **2026-06-02 真相分裂已修**：`anews-source-worker` 的 `BRIDGE_URL` 已從 CF 域名改直連 `http://35.236.185.222:3001`（rev `00012-w7r`），與 article-write-worker 一致。524 根治（CF ~100s 上限 → 自設 180s timeout）。effort-low 保留為保險。
- ✅ **2026-06-02 已提交 + 推 GitHub 災備**：Wave1/Wave2/四修全工作包已 commit 並推 `github.com/linhocheng/anews-platform`（PRIVATE）。硬碟全滅風險解除。Vercel 舊 `app/api/workers/source/route.ts` 仍是 A-only 死副本，待刪。

---

**2026-05-28e 狀態（session 5，歷史）：** pipeline 穩定，兩篇全鏈路驗收通過（薑黃 + 網紅行銷）。

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
- **[停用-三段寫手路徑]（2026-06-04 標記不刪）**：live 只走 single-write（article-write worker＝沈牧）。整條「三段寫手」停用、不被 orchestrate enqueue，只剩 `/api/workers/debug` 手動可打。孤兒清單：workers `section-write`/`section-qa`/`evidence-pass`/`alignment`/`stitch`；prompts `write`/`write_intro`/`write_body`/`write_conclusion`/`qa`（後台「角色人格」也沒列這幾格）；helper `getWritePromptForRole`。**決定＝標記不刪**：single-write 無內容複審閘門，這批是未來「替單寫補 QA gate」的現成基礎。code marker `[停用-三段寫手路徑]` 釘在 orchestrate `blueprint_done` + section-write route 頂。動它前先讀那兩處註解，別再當 live 誤改。
- 沈牧靈魂活在後台「角色人格 → 長文寫手」＝`settings/roles.article_write`（Cloud Run worker 直讀無快取）。改它＝改 live。code DEFAULT 同步在 `app/api/settings/roles/route.ts`。
- #16 callbackOrchestrator taskId = Date.now()，冪等鎖不完整（advancePhase 部分兜住，section_done/stitch_done 等 case 有重複 enqueue 風險）
- export watchdog 缺失：若 export 靜默失敗，issue 卡 coherence_passed
- 圖生成串列偏慢：12 張 ~25 分鐘（Cloud Run 串列，正常設計但慢）
- #9 startNextSubArticle 是死路（singleWriteMode 不走，影響低）
- Vercel article-write route 是死碼

**下一步：**
評估修 #16：taskId 改 `orch-${event}-${issueId}`（去掉 Date.now()），但需先確認同一 issue 是否合法多次觸發同一 event（各文章 stitch_done 帶不同 articleId）。若有，taskId 需帶 articleId。

**Why:** pipeline 基建穩定，下一步是結構性可靠度（#16 冪等）
**How to apply:** 醒來先看 dashboard 有沒有卡住的 issue，優先評估 #16 修法
