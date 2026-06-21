---
name: ailiveX 平台進度
description: ailiveX 語音版本 v2-v14、media-worker HeyGen 分身影片、全平台審計修正（2026-06-21）
type: project
originSessionId: d44171fd-41c9-4648-9b8d-6bd6aaaee3ef
---
**2026-06-21（第十二 session）：HeyGen 分身影片全鏈路修正 + 全平台審計。** GCS uniform bucket-level access 下 `makePublic()` 爆 403 → 移除，改組直接 URL；後台 HeyGen 照片預覽新增（120×120）；GET /api/admin/characters/[id] 補回 `heygenAvatarUrl`；v14 script_draft tool 描述改明確「逐字寫出口播稿再呼叫」，Cloud Run 重部署。**全平台審計修正**：Admin POST ALL_CAPABILITIES 從 4 補到 7（script_draft/story_draft/video_generation）；generate-video idempotency 改為 failed 時允許重試（清 videoTaskId 重送）；gallery AudioCard 偵測 linked video failed → 橘色重試按鈕 + error code 補 no_avatar_url；generate-storyboard addOne 補存 cardText/cardType/intent；stories addNewCard 補送 cardType；generate-story/generate-scripts Phase B 清理擴大到 scripted+failed。**Audit agent 偵測到兩個假陽性**（stories [id] route、gallery DELETE 其實都存在），說明 agent Glob 有盲區，Audit 後必須手動 ls 驗。**Adam 下一步**：重新上傳張立分身照片 → 驗端到端 HeyGen 影片生成。

ailiveX walking skeleton Phase 0-7 全通（2026-06-06 夜）。

**2026-06-10 更新：語音已能用且順**（下方 06-08「沒聲音」斷點已解）。改 MiniMax TTS 串流降延遲後曾「角色說兩次」，根因是串流最後一塊 status==2 整句重送，已修。

**2026-06-10 下半場：語氣優化上線。** TTS 改成 MiniMax **WebSocket 真串流**（`streaming=True`，跨句語調連貫，不再每段重音）+ `opencc` 繁→簡硬轉（發音穩）+ 全角色 emotion=neutral（降戲劇感）。現役 Cloud Run revision `00011-4h5`（image `wsstream20260610`）。回滾 tag：`voice-stable-20260610`（REST版）/`voice-ws-stable-20260610`（WS版）。詳見 `reference_minimax_realtime_voice_quality.md`。

**2026-06-11：即時語音 2.0 平行版上線。** 新服務 `ailivex-realtime-agent-v2`（agent_name `ailivex-realtime-v2`，同 image 不同啟動 `agent/main_v2.py`），前端 `/realtime-v2/[id]` + chat 頁「2.0」按鈕。v2 = Sonnet 4.6 + temp 可調(聖嚴 0.3) + 平實口氣 + speech-2.6-hd + 3a 主動插話 spike + 沒頭沒尾修正；v1 維持 Haiku 快版不動。後台 `admin/characters` 新增「對話手感」面板（convSettings：接話速度/被打斷/主動程度/搶話/溫度，即時生效）+ 角色「對話/語音」測試按鈕。計劃書 `docs/PLAN_voice_group_and_proactive.md`（P2 群聊 + P3 待做）。**ailivex-platform 仍無 git repo，所有 code 改動只在本機+已部署。**

**2026-06-12：v2 記憶連貫大修 + 把 ailive「上次對話」設計搬進來。** 掛斷記憶被砍的根因＝`main_v2.py` 的 `shutdown_process_timeout` 預設 10s 把掛斷後的 LLM 提煉 SIGKILL → 拉 90s。finalize 重構：idempotent（Lock+flag）、transcript 先秒存（第一行 log 證實有跑）、lastSession+記憶 `asyncio.gather` 並行萃取、唯一保證路徑＝`add_shutdown_callback`（不再靠沒通的 end_call/finalize_done data channel）。前端掛斷改「整理中」1.8s 短轉場就斷。從 ailive 搬進 v2 的記憶設計：【上次對話】快照（`extract_session_summary` 走 bridge：summary/endingMood/unfinishedThreads）+【上次聊到最後·原話】（注入逐字稿尾，連貫關鍵）+【當前時間】遠近規則 +【時間感知】距上次多久（should_inject_gap）。「有記憶但不連貫」根因＝greeting 念摘要不接結尾 + lastSession 寫入 ~30s 的回播時間差；解＝原話結尾優先（秒存最快）+「最新未完第一優先不扯舊話題」+ 並行加速。現役 Cloud Run `ailivex-realtime-agent-v2-00016-vdb`。Next：**v3＝群聊+主動插話/內心戲**（內心戲=各角色自己的 soul），築建議序列＝先 1:1 驗 session.say 主動廣播機制 → 群聊多人輸入 → 內心戲評分；計劃書待寫。【最近的事】(platform_insights 事件線) 沒搬（ailivex 無反思管道）。

**2026-06-12 續：文件功能「卡住」雙路徑修復 + v3 一吋蛋糕計劃定稿。** 文件「卡住」有**兩條獨立根因**：①**文字路徑**（`/api/dialogue`→TS `dispatchDocumentJob`→直接 fetch worker）＝Vercel env `CLOUD_RUN_DOC_WORKER_URL` 尾端字面 `\n`→URL 解析成 `/n`→404 靜默吞。修＝`documents.ts` 加 `cleanEnv()`+`r.ok` 檢查，`vercel --prod` 上線。②**語音路徑**（Python `firestore_loader.create_document_job→_enqueue_job→Cloud Tasks`）＝agent 沒設 Cloud Tasks env→靜默 `留 pending`。修＝`_enqueue_job` 改背景 thread 直接 POST doc-worker 根路徑 `/`+`x-worker-secret`（消滅 Cloud Tasks 依賴），`cloudbuild-v2.yaml` 加 `WORKER_SECRET`(secretRef)/`DOC_WORKER_URL`。agent 重部署＝**現役 `ailivex-realtime-agent-v2-00017-rqb`**。**兩條都未端到端驗證**（待 Adam 真撥/真觸發）。關鍵雷：doc-worker 磁碟源碼（`/process` 無鑑權）≠ 線上（`/`+`x-worker-secret`），照線上現實建 fix；doc-worker URL=`https://ailivex-doc-worker-6ybo3vltfq-de.a.run.app`，public(allUsers) 但 app 層擋 secret；agent 與 worker 同 SA(`835615585295-compute`) 故 agent 免額外 grant 即可讀 WORKER_SECRET。**v3 一吋蛋糕計劃定稿**＝`docs/PLAN_voice_group_and_proactive.md` 第 6 節：1:1 沉默後 `session.say` 主動播一句固定文字，證明主動發話管道（至今沒驗過），二元判據+三類 FAIL 探針+平行紀律（新 agent_name `ailivex-realtime-v3` 絕不碰 v2）。卡住的 Lilith 蓝图 doc `FvcErckRl7k5mg6CYfU1`/job `9RTfRDzsPNXLR2PlPzOK` 仍 pending（手動清要讀 secret 值守紅線沒碰）。

**2026-06-12 三：v3 主動發話 + v4 單機群聊上線 + git 首推 GitHub。** **v3**（`ailivex-realtime-agent-v3-00003-gnb`，前端 `/realtime-v3`，chat「3.0」）＝擬真主動發話：冷場 backoff 退讓（間隔 ×2.1+±25% 抖動+自我重排）+ soul 驅動（`imThreshold` 1-5）+ LLM 看脈絡決定開不開口 + 禁通用罐頭（在嗎/還好嗎）改從上下文/角色/默契長出具體話。實測 im=5 冷場 8s 開口、im=3 退讓選沉默（選沉默是性格不是 bug）。**v4**（`ailivex-realtime-agent-v4-00001-nl9`，前端 `/realtime-v4`，chat「4.0」，測試中）＝單機群聊：Soniox `enable_speaker_diarization=True` + livekit-agents 1.5.1 內建 `MultiSpeakerAdapter`（包 STT 自動標 primary/background speaker），一支手機多人辨識，**不需聲紋**（要的是 diarization+自報名，聲紋是假議題）；別人開口→LLM 看到「（旁邊另一位 #N）…」；埋 `v4 STT speaker_id=` 驗證 log，**speaker_id 準度未實機驗**。**ailivex 終於 git init + 首推 GitHub**＝https://github.com/linhocheng/ailivex-platform （public，密鑰掃描零洩漏，README 含 v1→v4 全表），零版控斷點補上、AIR/PRO 雙機分裂根治。**版本隔離鐵律**：每代 = 獨立 agent_name + Cloud Run + 前端 + cloudbuild-vN.yaml，cp 上版再改、絕不碰穩定版，共用同 image 靠 `python -m agent.main_vN start` 區分。查證 diarization 用 `pip download <pkg>==<確切版> --no-deps` 解開讀源碼（不靠記憶/PLAN/main branch）。

**2026-06-12 晚：v5 多角色語音圓桌（一個人對多角色）建了、撞牆、被 Adam 清掉。** 從 v4（多人對一角色 diarization）轉向 v5＝主持人開場→點名→棒子在角色間接力傳。機制 solo 路徑驗通：一房多 agent（LiveKit 1.5.1 原生：`update_agent` 換 active、`on_enter` 發話 race-free、`on_user_turn_completed` raise `StopResponse` 擋自動回、per-agent tts 各角色各聲音）+ 導演按 roster 順序傳棒 + 「誰被叫到」用 LLM 點名（exact 快車道→Haiku→程式比對名冊，log 證實能認自然語音/暱稱）。**但多角色從沒真正驗到**＝roster（誰上桌）要手貼 characterId，Adam 手機一直掉、連測三次都 solo → 體感「完全沒反應 gg」（最笨的「人進房間」那關沒做，見 feedback_mvp_include_input_entry）。Adam 喊停、要求清掉：已刪 Cloud Run `ailivex-realtime-agent-v5`、移除前端 5.0 鈕 + v5 頁、token route 還原 v2-v4、重部署。**v1-v4 完好；v5 code 留磁碟（`agent/{main_v5,realtime_agent_v5,cloudbuild-v5}`）可復原；ailivex-platform git 有未提交改動。** Adam 要的＝活群聊（可插話搶話、非會議）+ 主持人開場接力 + 兩天條（角色不串成別人/點名紀律）+ 暱稱叫人。**狀態需求對齊到一半，Adam 說「有點誤會、先一步步來」——下次別急著重建 v5，先一步步聽他講清楚 + 拍板架構岔路（共享房間多 agent vs 三帳號各自登入聲學疊）。** MiniMax 沒燒完（已用 log 排除）。

**2026-06-18（第五 session）：media-worker 服務 + AILivex v13 任務派發系統。** 新服務 `~/.ailive/media-worker/`（TypeScript Express，Cloud Run `ailivex-2026`）：Cloud Tasks async pattern / `mw_jobs` collection / OpenAI gpt-image-2 / MiniMax audio / GCS upload / webhook callback / idempotency via `mw_worker_runs`。AILivex 改動：`[[DISPATCH]]` tag（文字路徑，`tool-tags.ts`）+ `dispatch_task` function_tool（語音路徑，v13 agent）+ `tasks` Firestore collection（TaskDoc: userId/characterId/type/intent/params/status/summary/resultRef/notified）+ `capabilities` field on CharacterDoc（admin checkboxes，gate 在 dialogue route + v13 agent）+ `build_task_notifications_block()` 接 lastSession 注入（done+notified=false → 格式化 → 標 notified=true）+ `/api/tasks/callback` webhook。v13 Cloud Run `ailivex-realtime-agent-v13` 部署完成，Vercel 部署完成。**待辦**：v13 cloudbuild-v13.yaml 補 `MEDIA_WORKER_URL` + `MEDIA_WORKER_KEY_AILIVEX` env var → redeploy v13 → 端到端真機驗（admin設能力→[[DISPATCH]]→tasks doc→media-worker job→callback→通知注入）。圖片管理 UI 暫緩。

**2026-06-18（第四 session）：v12 讀網址改版（靜默+主動開口）+ DEFAULT切v12 + UI清理。** `agent/source_intake.py` 大改：靜默取資料（移除 ACK say）+ `asyncio.create_task()` fire-and-forget（解 RPC timeout）+ Sonnet 4.6 摘要（max 1500）+ 主動 `generate_reply`。`DEFAULT_VOICE_VERSION='v12'`（用戶預設 v12）。admin layout：Wordmark→/admin、加前台主頁按鈕。documents：移除 PDF + Slides 按鈕。**source_intake.py 改動尚未重新 deploy** → 需跑 `gcloud builds submit --config=agent/cloudbuild-v12.yaml --project=ailivex-2026 .`，才能驗靜默主動開口。

**2026-06-17：後台指派語音版本（Req 1, v0.2.0）+ 即時語音讀網址工作臺（Req 2 Phase 1, v12.0）上線。** 版本演進已到 v2~v11（無 v7）+ 新 v12；**ailivex 早有 git**（上文 06-12「無 git」已過時，repo=`linhocheng/ailivex-platform`）。**Req 1**：語音版本不再前端按鈕硬選——`AccessDoc.voiceVersion` + `VOICE_VERSIONS` 登錄表(單一真相源) + `agentNameForVersion()`；token route 對一般用戶忽略前端 flag、讀 (userId×characterId) 指派、**缺省走全域預設 `DEFAULT_VOICE_VERSION='v3'`**，admin 帶 vN flag 仍可逐版測試；admin 授權頁加版本下拉(PATCH)；chat 頁實驗版按鈕收 admin-only，用戶只剩一顆「語音通話」(走 base `/realtime/`)。線上端到端自測 11/11（自簽 session cookie 打 prod + base64 解 LiveKit JWT 的 roomConfig 驗實際派的 agentName）。**Req 2 Phase 1**：新 agent **v12 = v3 + 讀網址工作臺**（不碰 live v3，用 Req 1 指派當安全 rollout gate）。流程：通話中前端同步框貼網址 → RPC `share_source` → agent `session.interrupt()`+`session.input.set_audio_enabled(False)` 暫停 → `session.say("我看一下哦")` → 抓正文(打 Vercel `/api/voice-source` 薄端點，複用 `url-reader` SSRF，worker-secret 鑑權，middleware 白名單) → Haiku 摘要 → `agent.update_instructions()` 注入 → `set_audio_enabled(True)` 恢復 + `generate_reply` 帶內容接話。新檔 `agent/source_intake.py`（不 import 進其他版本）。LiveKit 1.5.1 四原語動碼前翻套件源碼驗過(沒沙推)，見 `reference_livekit_agents_voice_control_api`。Cloud Run `ailivex-realtime-agent-v12-00001-dzw` Ready、worker registered 乾淨啟動。**未真機驗通話迴圈**（CLI 跑不了語音）；WORKER_SECRET 三邊對齊是推論非直驗(失敗安全:角色說「打不開」)。**待辦**：Adam 真機撥 v12 驗 → Phase 2(sources collection RAG 持久化) → Phase 3(對話結束結合資料源轉拋企劃案) → 翻全域預設 v3→v12 → 擴充檔案上傳。

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
