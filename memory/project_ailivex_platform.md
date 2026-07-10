---
name: ailiveX 平台進度
description: ailiveX 語音 v2-v17（v17=DEFAULT 2026-07-10）、Podcast 腳本生成器、soulCore 已退役（2026-07-04 單一 soul 欄位）
type: project
originSessionId: d44171fd-41c9-4648-9b8d-6bd6aaaee3ef
---

**2026-07-10 夜場：優雅讓位戰役（v18.0.0→0.5 已 commit+部署，暫停真人測試轉離線沙推）。**
- Adam 拍板治本「驚豔市場的打斷體感」→ v18 canary：`agent/graceful_yield.py` BoundaryAwareAudioOutput（LiveKit AudioOutput 鏈式代理：節流轉發 LEAD 0.35s＋RMS 靜音谷句子邊界 240ms＋讓位漸降 duck 0.55＋保底 2.8s＋孤兒自癒 2.5s＋序號截斷清除）＋VolumeGate 音量閘（stt_node 帶內 tap、基線×1.45，正常音量=影子讓位不停不減音、提聲才讓位、commit 仍收完整句）
- 四通實測撞出框架三條 commit 路徑（熱清除/清除後狀態重置/暫停默殺），逐一修掉；**commit 後 resume 一律不翻案**（時間護欄 74µs~459ms 分佈打臉，見 [[框架互操作層要用真實事件序列離線沙推（單元測試測的是自己想像的框架）]]）；16 回歸測試（測資=實測失敗形狀）
- 音量閘實證有效（真通話影子讓位×2，AGC 沒吃光音量差）；v17.3.1 min_words=3 上線半天就回滾（教練短答「对/嗯」停不下她=超慢），保留誤觸回復
- 現況：v18.0.5 deployed（rev 4993b28）但**未過真人驗收**；Tracy/Lilith access 已退回 v17；下一步=離線 property-based 沙推 harness 全綠才再請 Adam 驗一次；Adam 驗收規格原話「音量變大或有插話企圖→講完最後一句→暫停等待」
- 白天場：v17 轉正 v16 退役（計費錶歸零驗證）、3a 道別待命＋語意去重（conv_tuning is_farewell/is_semantic_repeat）、log 三重複印根治（拔 basicConfig，v16+ 查 log 看 jsonPayload.message）、3a 輔助級 6-15s；知識庫/方法論調用鏈勘查（text-only、遞招制、soul 正向替代寫法——詳 WORKLOG）

**2026-07-10：3a 兩張嘴打架修正＋v17 轉正（v17.2.2→v17.3.0 已 commit+部署）。**
- Tracy 通話實錄抓到：互道拜拜後 3a 主動發話迴圈連續重複道別/把回合路剛說的話換皮再說。根因＝回合路與 3a 是兩條獨立發聲路，3a 無去重、無道別狀態、靜默從用戶最後一句起算
- 修（v16+v17 都接）：conv_tuning 新增 `is_farewell`/`is_semantic_repeat`（確定性，25 測試向量含實錄鐵證）；3a 道別待命（雙方互道再見→停自我重排，用戶開口自動復活）＋bigram 去重（開口前跟最近 3 句 assistant 比對）＋`agent_state_changed` 靜默起點對齊
- log 三重複印技術債：basicConfig(stderr) 疊 livekit setup_logging(JSON stdout)＋job 子進程 LogQueueHandler 轉發＝同行印三次；拔 basicConfig 後恰一次。⚠️ 查 v16+/v17 log 改看 `jsonPayload.message`，textPayload grep 會空手
- **v17 轉正**：DEFAULT_VOICE_VERSION v16→v17（token route 登錄表驅動，無需新頁面/分支）；語音電源開關跟 DEFAULT 走、CANARY 只有 v17，v16 不會被無聲拉起；v16 min=0（cloudbuild 不寫死 min-instances 無殭屍復活），計費殘尾待驗歸零

**2026-07-04 第四場：營運日四連修（v15.3.1→v15.5.0 已 commit+部署）。**
- 語音頓根因=cpu=1 扛不住 VAD+embedding+TTS（silero slower-than-realtime 實證）→ v15 `--cpu=2` cloudbuild 持久化；H3 語音多開修法+H4 python 媒體計量隨此上線
- 文件簡→繁：機制級 opencc（見 [[opencc-s2t-pitfalls]]），釘 agent 建檔+雙 worker 出口（title 寫回）；26 份舊標題已轉
- 文字對話額度：textLimit/textUsed 則數制（token 分析後棄用），dialogue 入口扣量+失敗退量；對話頁「剩 N 則」指引+用罄琥珀卡；admin 全鏡射
- 頭像 >3.4MB 撞 Vercel 4.5MB=413 只顯示「建立失敗」；編輯視窗預載競態會把別名/能力洗空——三修方案已定待 GO

**2026-07-03/04：用量管制＋UI 商用化上線（v15.0.0→v15.2.1，已 commit）。**
- 用量管制（總量制、user 層全角色共用）：UserDoc 四欄（voiceSecondsLimit/Used、docsLimit/Used，留空=不限、used 只加不減）；收斂點 `src/lib/quota.ts`＋`agent/quota_meter.py`
- 語音三執法點：token route 403 → agent heartbeat 30s 計量＋到點 delete_room 直斷（Adam 真機驗過）→ participant_disconnected 無人即結算+關房（根治空房計費）；文件＝createDocumentJob transaction 扣、失敗退、語音 write_document 同閘
- admin 用戶頁：剩餘顯示、期滿警示面板（加值=已用+新增）、密碼直改、刪除用戶（級聯 access、admin 不可刪）；admin 首屏健康度摘要（/api/admin/overview）
- UI/UX：手機底部 tab bar＋更多 sheet（FrontNav）、大廳卡「上次聊到」、chat header 語音通話主 CTA＋溢出選單、全站文案商務化（您/時數已用罄/服務窗口）
- 邊界記帳：legacy Cloud Run doc-worker 失敗不退額度；同用戶並行通話總超用 <2 分鐘

**2026-07-04：soulCore 全退役（鑄造靈魂功能取消，Adam 指示）。**
- 背景：讀路徑一直是 soulCore 優先 soul fallback → 雙真相分裂：吳念真上場用 540 字舊摘要（完整 2499 字在 soul 被忽略）、Echo 用半套 1712/3424。Adam 改 soul 沒生效卻不自知
- 遷移：14 角色合併單一 soul 欄位（吳念真/Echo 依 Adam 拍板用完整長版，其他沿用線上版），淘汰版備份 `soulLegacy`，`soulCore` 欄位刪除 → **已部署 v15 靠 fallback 鏈立即吃到新靈魂，免重部署**（資料層修法）
- 代碼：刪 `lib/soul.ts`＋`api/admin/soul-enhance`＋管理頁鑄造/提煉 UI（編輯視窗只剩單一靈魂框「直接吃這個」）；讀路徑統一讀 soul：dialogue/doc-process/text-filter rewrite/generate-story/`firestore_loader.py`。Vercel 已部署，**未 commit**（v15.2.1 之後 8 檔）
- 新增角色流程＝貼靈魂→建立→即上場；別名/能力建立後在編輯視窗補
- **別名輸入疑似 bug 未修**（Adam：先不用）：資料形狀正常；指紋＝腳本種的（聖嚴/星雲/達賴）有值、手動輸入的全空。本機重現 SOP 已通：escaped SA 走系統 env 起 dev、lsof -ti :3000 清殘留、SESSION_SECRET 自簽 admin cookie、puppeteer-core+系統 Chrome

**2026-07-02：Podcast 腳本生成器上線（/convert 頁面）。**

架構：Vercel `/api/convert/podcast/generate-script` fire-and-forget（10s AbortSignal） → Cloud Run `ailivex-podcast-worker`（asia-east1） → 場控 Haiku + 角色 Sonnet × N 輪 → Firestore `tasks` 寫回 → 前端 5s 輪詢 20 分鐘。

Cloud Run 關鍵設定（踩過三次雷才定的）：
- `--no-cpu-throttling`：Vercel 10s 後斷線，Cloud Run 仍需全速跑後台任務，若 throttle 則 ~14 分鐘後 container 被清掉
- `--min-instances=1`：無 active request 時 container 不被 scale-down（2500字需 ~10 分鐘）
- `--timeout=3600`：Cloud Run request timeout 夠長
- `--memory=512Mi`（從 256Mi 升）
- firebase-admin ADC 不注 SA JSON（天條）
- `BRIDGE_URL=bridge-direct.soul-polaroid.work`（繞開 Cloudflare CDN 低延遲）

Worker 架構模式（最終正確版）：
1. 收到 POST → 驗 auth → 冪等檢查 → 讀角色資料 → **立即回 202**
2. `setImmediate(() => generateScript(...))` 在背景跑
3. 完成後 `taskRef.update({ status: 'scripted', podcastScript: [...] })`

UI：`minutes` 選項 [3/5/8/12]，後台換算 minutes × 500 = wordCount（3000字≈6分鐘，修正前是 3000字≈10分鐘）。

腳本庫（/api/convert/podcast/scripts GET）：列出所有 scripted tasks，支援 inline 編輯（PATCH /api/tasks/[id]）/ 刪除（DELETE）。

壓測結果：2500 字 / 23 輪 / 585 秒（9.7 分鐘）全程完成，exit 0。LLM 成本走 bridge（Max 月費）。Cloud Run 固定費 ~$25-35/月（--no-cpu-throttling always-on billing）。

**2026-07-02 續：語感微調定版（Adam 驗收通過）。** worker 加三種輪次（機制全用程式定，不丟 LLM）：①開場輪（turn 0，`kindHint` 讓開場者自然帶「跟誰碰面、聊什麼」，開場輪放寬「不介紹自己」規則）②短反應輪（中段 `turn % 5 === 3`，20-40 字簡短回應，節奏有呼吸）③強制收尾輪（主迴圈 break 後程式加一輪，開場者收尾、若他是最後講者則換人）。聖嚴×達賴喇嘛 600 字驗證：開場「喇嘛，我們又坐在一起了」/短反應「看見，就夠了」/收尾祝福送別，全部貼角色語感。

**音檔層現況**：generate-audio 已端到端通（角色各自 LLM 貼情緒標記 → MiniMax `speech-2.8-hd` 逐句 TTS → buffer concat → GCS → audioUrl）；句間停頓已有（同角色 0.3s / 換人 0.5s，塞 `<#N#>` 標記讓 MiniMax 產靜音）。**結構隱憂**：同步跑在 Vercel route（300s 上限）逐句序列 TTS，12 分鐘腳本（30+ 句）很可能超時卡 running — 之後要搬去 podcast-worker 同款 fire-and-forget。

**2026-07-02 三：文字過濾器 v1 上線**（`cloud-run/podcast-worker/src/text-filter.ts`）。設計原則（跟 Adam 對齊過）：①單位是**句型不是單字**（「好像有什麼鬆了一下」抓，「螺絲鬆了」「那個『我』鬆了」放行——模糊主語才是 AI 味）②抓到後 LLM 只重寫踩雷句、指令=「找出背後的具體事件用角色的話直說」，其他字不准動（保護角色感）③每輪入史前過濾，污染不擴散到後續輪次 ④詞庫 7 條內建 pattern + Firestore `config/podcastTextFilter` 可擴充（同 id 覆蓋、enabled:false 可關）。21 個單元測試全過（11 抓 10 放行）。**雷**：worker 是 Node ESM，相對 import 必帶 `.js` 副檔名（`moduleResolution: bundler` 編譯期不報錯、runtime 才炸 ERR_MODULE_NOT_FOUND）。Adam 之後會補文件陸續擴充詞庫。

**2026-07-02 四：節奏+自審系統上線（A/B 驗證過）+ 全站修理批 + Podcast 素材頁兩端。**

**節奏+自審**（Adam 核心要求：角色要有立場有稜角，不是模型）：`rhythm.ts`（21 測試全過）＝逐輪禁令（語氣詞冷卻/複述開場禁止/程式保底刪除）+ 場控升導演（七動作盤含「直接反駁」「堅持不讓步」，程式否決連用）+ 收尾前先判斷已收束否 + **殺青後角色自審**（角色拿靈魂檔+全場逐字稿+程式算好的統計回看「這像不像我」，雙向：改口頭禪也改讓步太快處；只准改自己的句子、過文字過濾器、程式複數驗收）。A/B 同題 2500 字：達賴（呵呵呵）開頭 12/14→5/13（自審保留 5 次=靈魂判斷「笑是我」）、真吵起來了（兩次正面反對+1959 流亡/閉關六年人生事件+互相將軍）、收尾結在正拍。**代價：2500 字 9.7 分→18 分**，4000/6000 字會超前端 20 分輪詢——超時訊息已改「仍在生成中會自動出現在腳本庫」不算失敗。設計心法：頻率歸程式、像不像我歸靈魂；自審成立的前提=程式把鏡子擦亮（模型不會數數、對自己偏寬容）。

**全站修理批**（盤點三路調查→Adam 核准逐項修完）：①podcast DELETE 連帶刪 GCS ②realtime-v14 掛斷後「返回對話」按鈕 ③用戶端導航統一 `_components/FrontNav.tsx`（五份複製體收斂成唯一真相源，NAV_ITEMS 加一條全站生效）④stories/[id] 六寫入點+documents 刪除補錯誤提示 ⑤admin 語音測試指 v14/音檔 URL ?v= 防快取/下載按鈕 ⑥「回到腳本清掉音檔」bug（回不去根因=setAudioUrl('')）。

**Podcast 素材頁兩端**：`/podcasts`（客戶端，PodcastLibrary 抽成 `_components/PodcastLibrary.tsx` 共用）+ `/admin/podcasts`（跨用戶總表含歸屬帳號，admin API 避 composite index 用 JS 排序，admin DELETE 連帶 GCS）。**「後台看不見素材」根因=素材綁生成帳號（user-centric），admin 帳號名下零筆**——不是資料丟失。**「背景任務前端隱形」已修**：scripts API 連 running/failed 一起回，腳本庫顯示「生成中」（每 10 秒自動刷新）/「失敗」（可清除）卡片。

**2026-07-02 五：音檔生成搬 Cloud Run 完成（300s 撞牆根治）+ voiceSettings 全管道打通。**

**voiceSettings 查核**（Adam 問音量有沒有帶到）：即時語音 v14 ✅ 本來就帶（realtime_agent_v14.py）、/api/tts ✅；**Podcast 音檔 ❌ vol 寫死 1.0、口播稿 ❌ 全寫死**——都修了，逐句 TTS 帶各角色 speed/vol/pitch/emotion（達賴 vol=3、聖嚴 speed=0.9 實資料）。行為變化：podcast speed 角色有設就以角色為準，沒設維持 1.05。

**音檔搬遷**：worker 加 `/run-audio`（202+setImmediate 同款）+ `audio.ts`（標記/TTS/GCS 整段搬）+ `tts-normalize.ts` vendor copy + opencc-js 依賴；cloudbuild 加 `FIREBASE_STORAGE_BUCKET` env + `MINIMAX_API_KEY/GROUP_ID` secrets。Vercel generate-audio 瘦身成派工（202，maxDuration 30）；tasks GET 補回 audioUrl/podcastPhase；前端 PodcastPanel 輪詢 30 分鐘、PodcastLibrary 派工後卡片轉「音檔生成中」靠 hasRunning 自動刷新接手。E2E：7 輪腳本 58 秒完成、GCS HEAD 200 / 3.2MB、audioUrl 帶 ?v=。部署前本機 `node dist/index.js` boot 過（Node ESM .js 教訓）。

**2026-07-02 六：文字過濾器擴展到全站文稿出口**（與 UDN 同源基因：`src/lib/text-filter.ts` 三分類詞庫 ai-flavor/clickbait/style-guide + Firestore `config/textFilter` 擴充）。接入盤點結論（出口是機器→自動改寫；出口是人→標記給編輯）：①文件生成（doc-process）＝自動改寫（md 生成後渲染前，帶 soulCore 保語氣）②故事劇情 storyText＋圖卡 cardText＝`_components/TextFilterBadge.tsx` 標記模式（debounce 掃描+chips+一鍵改寫）③script_draft 確認卡（gallery）＝標記模式 ④podcast＝worker 內已有 ⑤chat/即時語音＝刻意不接 ⑥convert 口播稿＝用戶手寫不用。API：`/api/text-filter/scan`+`/rewrite`（帶 session auth）。

**2026-07-03：記憶系統四批強化全上線（v15 = DEFAULT）。**

三方審計（文字機制/語音機制/現場資料）發現：語音記憶是二等公民（119/149 無 embedding、無 status、hitCount 凍 0、去重全逃）、檢索只有 fact 走語義、resolved 從未實作、歸檔靠手動按鈕、兩邊 15 項不一致。

**批次一（對等性）**：loader `load_memories` 補 createdAt/status/hitCount（救活 stale/active-recall/時間感死碼）+ core 優先排序；`write_memory` 加 embedding（Python Vertex REST via SA token）+去重+importance 參數；save_conversation 不再空字串蓋 summary；**回填 125 筆 embedding 全成**。
**批次二（檢索）**：memory.ts 六型全參與混合計分（cosine×0.7 + 詞彙重疊×0.3 + core/importance 加成，保底補位）；lexTerms=CJK bigram+拉丁詞。
**批次三（生命週期）**：萃取時順判 question 已解→resolved（TS+Py 鏡像，LLM 回編號程式映射）；`/api/cron/memory-maintenance`（Vercel cron 每日，CRON_SECRET，晉升/歸檔/stale 全自動）。
**批次四（v15）**：`main_v15/realtime_agent_v15/cloudbuild-v15`＋頁面＋registry；**通話中動態想起**（用戶發言→節流 45s/前2句不觸發→背景 embedding→cosine≥0.5 top2→update_instructions 注入【此刻想起】+ bump hits）；開場 bump hits（語音記憶能升 core）；remember importance=6。`DEFAULT_VOICE_VERSION='v15'`，**回滾=切回 v14 重部 Vercel**（v14 服務未動）。

**去重的兩課（重要）**：①0.85 純 cosine 大誤殺（75 筆，「牧羊人」被「用戶叫Adam」吸走）——紅線沒刪全部救回；②同型+0.92 仍誤殺（長篇敘事同人物同語域 embedding 天生擠）——**正解=雙門檻 cosine≥0.9 AND CJK bigram 重疊≥0.5**（真重複必然逐字近似）。兩邊寫入路徑已同步雙門檻。最終 123 筆活躍、26 筆真重複歸檔（dedupOf 可溯）。

**終極鑑別信號驗過**：「還記得咖啡館手沖」「牧羊人的旅程」（皆語音來源、修復前無 embedding）文字檢索都撈到＋時間前綴；無關 query 不硬塞。v15 `registered worker` ✅。

**待辦**：①v15 真機撥打驗動態想起（CLI 驗不了語音迴圈；log 信號=`[v15 recall] 想起 N 條`）②Adam 過濾器文件 ③兩 repo 未 commit ④文字路徑缺 globalPrompts/lastSession 注入（15 項不一致的反向項，記帳未修）⑤120 條撈取無 orderBy（池最大 38 條未達上限，緩）。
**2026-07-01：素材轉換區 /convert 影片生成根治。** HeyGen `avatar_not_found` 根因：`talking_photo_id`（存在 `heygenAvatarId`）是短效 ID，上傳後過幾天就失效；舊成功 job 都是用 `avatarUrl`（GCS 圖片 URL）即時 upload 拿新鮮 ID。修：media-worker `types.ts`/`heygen-video.ts`/`worker.ts` 加 `avatarUrl` 路徑，ailivex-platform 兩條路由改送 `heygenAvatarUrl || avatarUrl`。兩輪 Cloud Build（第一輪漏 worker.ts），驗通 ✅。另附：uniform bucket-level access 導致 `makePublic()` crash 已修（上批）。`CharacterDoc` 加 `heygenAvatarIdV3`、UI avatar_iii greyed when no V3。**現役語音版本 v14**（script_draft + story_draft dispatch）。

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

**已知帳號：** admin（密碼 2026-07-04 已輪換，不存記憶/repo，由 Adam 保管；舊密碼 ailiveX2026 已作廢。重設走 `node scripts/reset-admin-pw.mjs <username> <password>`）

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

**How to apply:** 處理 ailiveX 相關問題時，認識這是全新 GCP 專案（ailivex-2026）與 ailive 完全隔離。admin 密碼已輪換不存記憶（見上）。語音「沒聲音」先查 LLM/Bridge 串流斷點，不是 TTS 也不是 dispatch。
