---
name: ailiveX 平台進度
description: ailiveX walking skeleton 七 Phase 全通狀態 + 待驗項目
type: project
originSessionId: d44171fd-41c9-4648-9b8d-6bd6aaaee3ef
---
ailiveX walking skeleton Phase 0-7 全通（2026-06-06 夜）。

**2026-06-10 更新：語音已能用且順**（下方 06-08「沒聲音」斷點已解）。改 MiniMax TTS 串流降延遲後曾「角色說兩次」，根因是串流最後一塊 status==2 整句重送，已修。

**2026-06-10 下半場：語氣優化上線。** TTS 改成 MiniMax **WebSocket 真串流**（`streaming=True`，跨句語調連貫，不再每段重音）+ `opencc` 繁→簡硬轉（發音穩）+ 全角色 emotion=neutral（降戲劇感）。現役 Cloud Run revision `00011-4h5`（image `wsstream20260610`）。回滾 tag：`voice-stable-20260610`（REST版）/`voice-ws-stable-20260610`（WS版）。詳見 `reference_minimax_realtime_voice_quality.md`。

**2026-06-11：即時語音 2.0 平行版上線。** 新服務 `ailivex-realtime-agent-v2`（agent_name `ailivex-realtime-v2`，同 image 不同啟動 `agent/main_v2.py`），前端 `/realtime-v2/[id]` + chat 頁「2.0」按鈕。v2 = Sonnet 4.6 + temp 可調(聖嚴 0.3) + 平實口氣 + speech-2.6-hd + 3a 主動插話 spike + 沒頭沒尾修正；v1 維持 Haiku 快版不動。後台 `admin/characters` 新增「對話手感」面板（convSettings：接話速度/被打斷/主動程度/搶話/溫度，即時生效）+ 角色「對話/語音」測試按鈕。計劃書 `docs/PLAN_voice_group_and_proactive.md`（P2 群聊 + P3 待做）。**ailivex-platform 仍無 git repo，所有 code 改動只在本機+已部署。**

**2026-06-12：v2 記憶連貫大修 + 把 ailive「上次對話」設計搬進來。** 掛斷記憶被砍的根因＝`main_v2.py` 的 `shutdown_process_timeout` 預設 10s 把掛斷後的 LLM 提煉 SIGKILL → 拉 90s。finalize 重構：idempotent（Lock+flag）、transcript 先秒存（第一行 log 證實有跑）、lastSession+記憶 `asyncio.gather` 並行萃取、唯一保證路徑＝`add_shutdown_callback`（不再靠沒通的 end_call/finalize_done data channel）。前端掛斷改「整理中」1.8s 短轉場就斷。從 ailive 搬進 v2 的記憶設計：【上次對話】快照（`extract_session_summary` 走 bridge：summary/endingMood/unfinishedThreads）+【上次聊到最後·原話】（注入逐字稿尾，連貫關鍵）+【當前時間】遠近規則 +【時間感知】距上次多久（should_inject_gap）。「有記憶但不連貫」根因＝greeting 念摘要不接結尾 + lastSession 寫入 ~30s 的回播時間差；解＝原話結尾優先（秒存最快）+「最新未完第一優先不扯舊話題」+ 並行加速。現役 Cloud Run `ailivex-realtime-agent-v2-00016-vdb`。Next：**v3＝群聊+主動插話/內心戲**（內心戲=各角色自己的 soul），築建議序列＝先 1:1 驗 session.say 主動廣播機制 → 群聊多人輸入 → 內心戲評分；計劃書待寫。【最近的事】(platform_insights 事件線) 沒搬（ailivex 無反思管道）。

**2026-06-12 續：文件功能「卡住」雙路徑修復 + v3 一吋蛋糕計劃定稿。** 文件「卡住」有**兩條獨立根因**：①**文字路徑**（`/api/dialogue`→TS `dispatchDocumentJob`→直接 fetch worker）＝Vercel env `CLOUD_RUN_DOC_WORKER_URL` 尾端字面 `\n`→URL 解析成 `/n`→404 靜默吞。修＝`documents.ts` 加 `cleanEnv()`+`r.ok` 檢查，`vercel --prod` 上線。②**語音路徑**（Python `firestore_loader.create_document_job→_enqueue_job→Cloud Tasks`）＝agent 沒設 Cloud Tasks env→靜默 `留 pending`。修＝`_enqueue_job` 改背景 thread 直接 POST doc-worker 根路徑 `/`+`x-worker-secret`（消滅 Cloud Tasks 依賴），`cloudbuild-v2.yaml` 加 `WORKER_SECRET`(secretRef)/`DOC_WORKER_URL`。agent 重部署＝**現役 `ailivex-realtime-agent-v2-00017-rqb`**。**兩條都未端到端驗證**（待 Adam 真撥/真觸發）。關鍵雷：doc-worker 磁碟源碼（`/process` 無鑑權）≠ 線上（`/`+`x-worker-secret`），照線上現實建 fix；doc-worker URL=`https://ailivex-doc-worker-6ybo3vltfq-de.a.run.app`，public(allUsers) 但 app 層擋 secret；agent 與 worker 同 SA(`835615585295-compute`) 故 agent 免額外 grant 即可讀 WORKER_SECRET。**v3 一吋蛋糕計劃定稿**＝`docs/PLAN_voice_group_and_proactive.md` 第 6 節：1:1 沉默後 `session.say` 主動播一句固定文字，證明主動發話管道（至今沒驗過），二元判據+三類 FAIL 探針+平行紀律（新 agent_name `ailivex-realtime-v3` 絕不碰 v2）。卡住的 Lilith 蓝图 doc `FvcErckRl7k5mg6CYfU1`/job `9RTfRDzsPNXLR2PlPzOK` 仍 pending（手動清要讀 secret 值守紅線沒碰）。

**Why:** Adam 要複刻精簡版 ailive，架構翻成「用戶為中心」——用戶×角色各記記憶，不共享。

**架構要點：**
- Next.js 16 App Router，Vercel 部署，GCP project `ailivex-2026`
- 帳號：scrypt + 簽章 httpOnly cookie，admin 建帳並指派
- 記憶：嚴格綁 (userId, characterId)，Vertex AI embedding-004
- 工具：文字標記 `[[REMEMBER]]` / `[[DOCUMENT]]`（bridge 不支援 tool_use）
- 語音：LiveKit Cloud + Python agent（Cloud Run `ailivex-realtime-agent`）
- 文件：Cloud Tasks → doc-worker（Cloud Run `ailivex-doc-worker`）→ GCS `ailivex-2026-assets`

**已知帳號：** admin / ailiveX2026

**語音斷點調查（2026-06-08，未解）：**
- 第一根因已修：us-central1 有重複 `ailivex-realtime-agent` 服務（跨 region 殭屍，跑舊 code thrash 9h），偷一半 LiveKit dispatch → 一半通話沒聲音。已刪，現只剩 asia-east1 `00001-thj`（registered 乾淨，min-instances=1）。
- 第二根因（仍在）：撥通後 `Session started`→`Initial greeting sent` 之後 **整整 95 秒零 log**，TTS 包裝器的 `MiniMax TTS text:` 連印都沒（agent/minimax_tts.py:115）→ 招呼語的 LLM 從沒生出文字 → TTS 沒被呼叫 → 沒聲音。LLM(Bridge 串流)這條鏈卡死。
- 已排除：tool_use-on-bridge（ailive 也帶 tools 走同 bridge）、caching=ephemeral（ailive 也設）、bridge VM 掛掉（/health 200、/v1/messages 401 都 <1s 很快）、zombie dispatch（已修）。
- **最尖的待查線索**：未證實「ailive 語音真的走 Bridge」——若 ailive prod Cloud Run 其實設了 ANTHROPIC_API_KEY 走直連 Haiku，則 **livekit anthropic-plugin + Bridge 串流路徑從沒被驗過**，ailiveX 是第一個踩，串流靜默 hang 就說得通。
- 決定性測試被擋：讀 BRIDGE_SECRET 被 settings 層 deny（不暴露密鑰紅線），curl bridge 帶真 auth 跑不了。
- **下次第一件**：擇一 — (a) agent 加 LLM 級 instrumentation log（llm 呼叫前/首 token/完成/TTS 進入）重部署，Adam 撥一通就定位；(b) Adam 核 ailive Cloud Run env 是否走直連 key；(c) 經 Adam 同意臨時切 ANTHROPIC_API_KEY 直連驗證是否 bridge 串流問題（會燒錢，需同意）。

**Memory Architecture v2 落地（2026-06-08）：**
- T1-T6 全完成：schema 擴展（6種type）、relationships collection、7區塊 system prompt、time-aware、active recall、stale 機制
- `src/lib/memory.ts`、`src/lib/relationship.ts`、`src/lib/collections.ts` 全改
- `agent/firestore_loader.py`：`load_relationship()` 新增、`build_system_prompt` 7區塊、extraction prompt 升 6 types
- `agent/realtime_agent.py`：import `load_relationship`，傳 relationship 給 build_system_prompt
- Vercel 已部署（ailivex-platform.vercel.app）；Cloud Run build 中（asia-east1）

**其他待完成：** ailiveX-platform git init + push GitHub；清 3 個 pending doc jobs。

**How to apply:** 處理 ailiveX 相關問題時，認識這是全新 GCP 專案（ailivex-2026）與 ailive 完全隔離。admin / ailiveX2026。語音「沒聲音」先查 LLM/Bridge 串流斷點，不是 TTS 也不是 dispatch。
