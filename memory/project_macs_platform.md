---
name: MACS 平台（麥肯錫式 AI 顧問公司）
description: ANEWS 概念轉 AI 顧問公司；2026-06-09 Mode 4（creative_proposal，奧美×李奧貝納 6 人創意部）已從 P0 假資料換真 prompt + 上線 e2e 驗證；四模式全通，worker route 已 framework 泛型化（零 mode hardcode）
type: project
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**MACS 平台** = 用 ANEWS 多 worker 流水線概念，轉成麥肯錫式 AI 顧問公司。repo `~/.ailive/macs-platform`（**已推 GitHub `linhocheng/macs-platform` private**）。

**Why**：ANEWS 是「五篇文章協奏」（fan-out 後各走）；MACS 是「多條分析線收斂成一個決策」（fan-out 後 barrier 收斂）——這是兩者唯一的架構差異，也是唯一全新要寫的部分（其餘 80% 複用 ANEWS 基建）。

**流程**：cases 入口 → brief-intake → problem-framing（關卡1）→ issue-tree（固定選單，只挑不發明）→ research（單次建 dossiers，唯一燒 API key/web_search）→ materialize（動態 fan-out）→ analysis×N → barrier 收斂 → synthesis（關卡2）→ recommendation → roadmap → storyline → partner-review（高階分析：OK 直接過/不OK 直接改稿，單次不繞圈，關卡3）→ export（三交付物：MD 報告/slide outline/一頁 summary，無圖）。fullAuto 開關 default ON、管全部三關。

**狀態（2026-05-31 晚場，已上線）**：已上線 https://macs-platform.vercel.app（git 本地 v0.2.0.010，無遠端）。晚場補：V1 部門魂（核心魂 + 6 分析師選單含 business_model/strategic_fit/risk + 證據官 §12 + 紅隊折進 partner）、修真相分裂-lite（partner 輸出 revisedWhyNow，export 套用）、HTML 報告交付物（lib/report，navy/tea 設計稿、CSS 圖表無圖，取代 reportMarkdown 當主交付）、監造後台（app/dashboard，移植 ANEWS .adm-* 改藍 + 密碼 gate + PipelineBar + 三關 Resume）。6 個 macs-* 佇列、prod env 乾淨、reconcile cron */15。

**✅ 端到端首次跑通（2026-05-31 深夜）**：錢 bug 已修——research worker 搬上 Cloud Run（`cloud-run/research-worker/`，鏡 anews source-worker + 直連 API key 跑 web_search，idempotency 用 MACS failed-可重入語意不抄 ANEWS 舊 bug）。issue-tree enqueue 帶 `RESEARCH_WORKER_BASE_URL` overrideBaseUrl 指過去；6 佇列 maxAttempts→3；vercel.json maxDuration 300。臻品案 case-mpt5ki7f-zjc4jo 跑到 **status=done**，全鏈路產出報告（reportMarkdown/Html/slide/onePage/partnerVerdict + 5 artifacts）。research 單次 532s、單 dispatch、零重試燒 key。死 code（Vercel research route + lib/pipeline/research.ts）已刪。worker URL：`https://macs-research-worker-754631848156.asia-east1.run.app`。

**真因不是 research，是觀察層 bug**：全 LLM 階段其實早就 ok，卡關是 `lib/workers/trace.ts` 的 `writeWorkerTrace` 用 `.add()` 遇 `llmUsage=undefined`（materialize/export 無 LLM）→ Firestore **同步**拋錯，`.catch()` 抓不到 → 健康 case 被誤判 needs_repair。已修根因（剝 undefined + 包 sync try/catch）。

**2026-06-02 強化（下午）**：
- **GitHub push ✅** `linhocheng/macs-platform`（private），硬碟全滅風險解除。
- **dir1 Marcus 整合撰稿者 ✅**：Victoria 結構化後第二 pass，帶全 chapter + synthesis context 重寫 soWhat/decisionImpact/narrativeBridge 指向 coreStake；`integrationWriter` key 入中台（活路）；Cloud Run `/api/workers/integrate-chapters`；180s timeout non-fatal。
- **#36 閃爍燈 `cross_review_running` ✅**：barrier 觸發 cross-review 時寫入，Cloud Run 完成切 synthesis_running；`.adm-badge-pulse` 1.6s 動畫；pipeline step 加「對質」節點。
- **中台活路全接通（假中台修復）✅**：Victoria Cloud Run 改讀 Firestore `reportBuilder`（`getReportBuilderRole()`）；對質 6 分析師每 memo 帶入 `roleFraming[workerType]` persona。

**2026-06-02 傍晚（research 改 B 線收尾）**：
- **路 A 拍板（markdown-direct，B-only 無 toggle）✅**：research-worker 改 generateResearchQueries→Tavily（免費）→Max bridge 綜述，移除 web_search/getLLMClientDirect/Anthropic import/ANTHROPIC_API_KEY/價格常數；BRIDGE_URL 直連 `35.236.185.222:3001`；輸出仍 markdown dossier（下游 0 改）。rev `00012-qmf`。
- **程式碼層防杜撰 URL ✅**：`stripFabricatedUrls(markdown, hits)` 用 Tavily hits validUrls set 擋素材外 URL，移除數寫 `dossier.fabricatedUrlsRemoved`。rev `00013-cpc`。commit `5028432`。
- research 不再是燒付費 key 的點，全鏈路 $0（marginal）。

**⚠️ 更正（2026-06-02 接棒 session，去現場驗證後）**：上面「structured-JSON 提案評估後不採（markdown-direct B-only）」這條**已被現實推翻**。現場真相：Cloud Run（rev `00015-bpb`→`00016-xhk`，401 探針確認 deployed=working-tree）跑的就是 structured-JSON 版——某次 session 改了 research→`ResearchDossierSchema`（keyFacts/sources/caseExamples/opposingViews/strategicImplications/dataGaps/sufficiency）+ `dossierToMarkdown` serializer + schema 層防杜撰 URL，且**新增 Cloud Run synthesis worker**（`SynthesisSchema`/`EvidenceAlignmentSchema` + `getSynthesisRole` 讀中台 roleFraming），cross-review enqueue 帶 `SYNTHESIS_WORKER_BASE_URL` override。這些一直在 prod 跑卻沒進 git（git HEAD 落後部署現場）。已 commit `d3e1e47` 對齊並推上 GitHub。教訓：「不採用」是當時的決定，但現場後來改了——記憶凍結在決策點，會說謊。
- **CF 524 根治（2026-06-02 接棒）✅**：bridge VM（zhu-dev，35.236.185.222）裝 Caddy + Let's Encrypt，新 host `https://bridge-direct.soul-polaroid.work`（grey-cloud A record，繞開 cloudflared tunnel 的 CF edge timeout）。Vercel + Cloud Run BRIDGE_URL 都改指這個 https host，~10 個 Vercel LLM 階段 + Cloud Run 全部不再被 CF ~130s 掐死。原 `bridge.soul-polaroid.work` tunnel + :3001 都沒動（純加法）。⚠️ Cloudflare API token（cfat_...）建 record 時曾貼進 chat，待撤銷。

**⚠️ 待辦（2026-06-02 當時）**：①MACS B research path e2e；②看完整資料流；③Marcus 真案驗品質；④#36 閃爍燈驗證。（多數已被後續 session 推進，見下。）

**2026-06-08 — 四模式架構 + complete-B route 泛型化（重大演進）**：
- **四個 strategyMode**：`market_evidence`（Mode 1，麥肯錫式）/ `hybrid`（Mode 2，50% 資料+50% 創意，synthesize 在 Cloud Run）/ `creative_lead`（Mode 3，破格者）/ `creative_proposal`（Mode 4，奧美×李奧貝納 6 人創意部，兩幕 13 章商業企劃書）。
- **framework 架構**：`lib/frameworks/`——`contract.ts`（ModeFramework：pipeline/stages/theme/`vercelNative`/`buildReport`）、`registry.ts`（`getFramework`/`hasFramework`/`isVercelNative`）、各 mode 一個 framework dir（hybrid/creative-lead/creative-proposal）。stage 有 `reads:ResourceKey[]`/`writes:ResourceKey`/`runsOn`，`buildStageContext` 把 ResourceKey 解析成 artifact。
- **complete-B 收尾（commit v0.12.0.001/002）**：10 條 Vercel worker route 從 hardcode `mode === "creative_lead"` 改成 framework 驅動泛型分派——分支只看 `isVercelNative(mode)`（只 creative_lead/creative_proposal 為 true；hybrid 雖有 framework 但有 cloudRun synthesize + legacy route 故 false）、artifact 名走 `stage.writes`、export 用 `buildReport` hook + `deckReadKeys` 泛型 gather。**未來加 vercel-native mode = 註冊 framework + 寫 buildReport，零 route 改動**（但這只對「全 Vercel stage」的 mode 成立，cloudRun-heavy 如 hybrid 不算）。
- **四模式 e2e 全跑到 done**（回歸閘）：M1 86655 字 / M2 88878 字 / M3 28388 字 / M4 26821 字。
- ~~Mode 4 內容仍是 P0 假資料~~（**已於 2026-06-09 換真 prompt，見下**）。
- Cloud Run hybrid 三修（全形標點正規化 / hybrid 不走 chapter 鏈 / SYNTH_TAIL 一份一模式）此前已部署 live、2026-06-08 才 commit 回 git（v0.11.4.002）。

**2026-06-09 — Mode 4 換真 prompt + 上線 e2e 驗證 + 設計層收斂（重大里程碑）**：
- **6 人創意部聲音由 Adam 親自定義**：策略企劃/ECD/品牌語言/市場/社群/製作人，每人「基因屬性 + 召喚咒語」寫進 `lib/llm/defaults.ts` 的 `PROPOSAL_PROMPTS`（取代 6 個 `[ADAM_FILL]` placeholder），且全部可在中台後台編輯（`roles_creative_proposal` Firestore doc，60s 快取，fall back 到 hardcode 預設）。
- **管道接通中台**：synthesize 收斂成 throughline 一條主軸線；roadmap 三 persona 併成單一 execution artifact；`callRole(mode, schema, promptKey, user, tokens)` 收掉 callCreative/callProposal 雙胞胎 helper。
- **設計層收斂（v0.13.0.001，修真相分裂根因）**：mode 宣告原本散在 4 處 → 收斂成單一 client-safe `lib/modes/catalog.ts`（TS 強制四模式齊備）；detail API 改吃 `frameworkArtifactTypes`（讀 `stage.writes`）不再 hardcode Mode-1 清單。
- **e2e 驗證（去現場跑 prod）**：case-mq5w0ui9-9jmgzc status=done，detail API 7 個 proposal_* artifact 零 null（流動斷裂修掉），聲音品質佳。
- **costUsd=0 不是假中台（已驗證澄清）**：research 自 2026-06-02 走 B 線（Tavily 免費 + Max bridge），$0 marginal 是設計正確；webSearches=4 是免費 Tavily call、outputTokens ~5000 證明 research 真的跑了。唯一小瑕疵：dossier `inputTokens:3` 六條一致，是 bridge `/v1/messages` 對 `usage.input_tokens` 沒回真值的已知 reporting quirk，不影響成本（仍 $0），未動手修。
