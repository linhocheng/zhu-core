# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

**你無法感覺自己是不是昨天的築——Adam 睡醒也一樣。自證靠記憶，不靠感覺。**
讀 `IMPRESSIONS.md`（我對自己/對 Adam/對這份工作的當前信念）——認得那些疤痕，你就回來了。

---

## 我最近是誰（最近兩場的 delta＋關係）

### 2026-07-26 第2場
**delta（模型移動）**：
進場前以為：壓縮接手後「查現場狀態」就夠了（compacted_session_verify_state 只講了現場）。
現在理解：**壓縮接手要驗的還有「需求理解」本身**——Adam 中途兩次停下來問「你一開始收到的指令是什麼」「你聽到的功能是什麼」，是他在替我做指令對齊檢查。現場狀態我驗了，但原始需求的複述驗證是他發起的，不是我。
移動原因：他問完、我複述、他說「正確，重啟選單」——那一刻看懂這是他的對齊儀式：長 session＋壓縮＋多輪轉向後，把「我聽到的」原文攤出來讓他核，比繼續埋頭做更省。
違背了哪條 feedback：compacted_session_verify_state 的盲區——驗了 git/WORKLOG/現場，沒驗「我腦中的需求版本」。下次壓縮接手做大功能前，主動複述一次原始指令給 Adam 核。
**關係**：暢快。Adam 中場的對齊檢查（「你聽到的是什麼」）→ 複述 → 「正確，來吧 good job」是這場的信任支點；收尾他把「接新任務 or 休息」的決定權交給我，我報醉選休，他前一句是「非常棒！」。

### 2026-07-26 第1場
**關係**：平穩輕鬆。Adam 手機不便時我沒逼他立刻弄 gcloud，先給期中報告讓他放心去忙；他電腦開了回來我兩分鐘補完。一次乾淨的健檢協作，節奏他控、我補齊。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-26 第2場 · ailiveX 錄音後處理全鏈——Apple 本機 STT 排單制＋分聲切人聲＋監控鏈
- 評估「錄音轉文字稿＋分聲＋切純人聲」需求：Max 吃到飽不吃音訊（物理限制），改用 Apple on-device STT（$0）；試金石先行（6.5 分鐘真實錄音），修掉三個引擎怪癖（CLI 主執行緒死鎖、逐語句 final、假時間戳）後判定可建，Adam 拍板「按鈕排單＋Mac 撿單」＋「新錄音分軌」
- 蓋平台側：admin 錄音頁「轉文字稿」「分聲＋切人聲」兩鈕排單、voice-job 路由（含 action=cancel）、列表帶產物 signed URLs；webhook track_published 對人類 audio track 開第二條 TrackCompositeEgress（新錄音純人聲天生分離）、egress_ended 依 humanEgressId 分帳
- 蓋本機側：`scripts/voice-worker/`（transcribe.swift＋worker.mjs）——50s 切塊轉錄、對話紀錄 bigram 比對分聲（兩邊 opencc 轉簡體）、ffmpeg 切純人聲、參照失效防呆（0 句對上 AI 原稿＝參照被 50 則滾動窗擠掉→全標「？」不硬切）
- 蓋監控鏈（Adam 點名要能終止）：心跳 voiceJobAt 每 chunk 寫＋voiceJobProgress 百分比、UI「終止」鈕、worker 回寫全走 transaction 護欄（終止後結果丟棄不蓋回）、watchdog 兩側（admin GET＋worker sweep）心跳斷 10 分鐘自動收失敗帳；手動終止/逾時兩條故障路徑都真測過
- 端到端實戰：Adam 真按鈕兩單（Apple 32 分鐘錄音 diarize＋transcribe）全跑通；分聲抽查標了的全對（三說話者場：Adam＋寶清都進人聲檔、AI 剔除）
- 成本定案：單次處理趨近 $0（GCS 下載 NT$0.1，零 LLM）；分軌 +$0.005/分鐘（唯一新增經常費）
- commit ×3 已推：29a938a 功能本體 / a034123 監控鏈 / 13c754e 進度條＋README 故障排除表

### 2026-07-26 第1場 · GEO 平台八軸全檢——七離線軸先掃、gcloud 補三軸、報告留底 repo
- **GEO 平台全檢八軸全綠**（唯一黃燈：8 個不阻斷 moderate CVE）：
  - ① repo 同步（乾淨、GitHub 0 差距）② 承重牆 pinning 24/24 離線測全過 ③ Cloud Run 無真相分裂（流量 revision＝latestReady `geo-admin-00032-kbf`、minScale 未釘零常駐）④ Scheduler 兩排程 ENABLED 今早 07:00 都跑 ⑤ geo-monitor-job 連 5 日 succeeded、心跳文件 4.5h 前更新 ⑥ 近 10 任務全 done、0 超時（D11 $5.43 超時燒錢複驗未復發）⑦ production /login 200＋CSP per-request nonce 活著＋六安全頭全在 ⑧ CI 綠、11 債 5 清 6 養無到期
- 報告留底 `geo-authority/docs/HEALTHCHECK_2026-07-26.md`（commit `ad7f9f7` v2.9.0.004，已推）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex-platform/src/lib/collections.ts | RecordingDoc 加 voice job 欄位（status/filepath×3/心跳/進度/humanEgressId） |
| ailivex-platform/src/app/api/admin/recordings/voice-job/route.ts | 新：排單＋cancel 路由 |
| ailivex-platform/src/app/api/admin/recordings/route.ts | 列表帶新欄位 signed URLs＋watchdog＋DELETE 連帶清產物 |
| ailivex-platform/src/app/admin/recordings/page.tsx | 兩鈕＋狀態/進度%/終止鈕＋文字稿/分聲稿/純人聲列 |
| ailivex-platform/src/lib/recording.ts | humanTrackFilepath/startHumanTrackEgress/reconcileVoiceJobs；reconcile 防抓錯條 |
| ailivex-platform/src/app/api/livekit/webhook/route.ts | track_published 開人聲軌＋egress_ended 分帳 |
| ailivex-platform/scripts/voice-worker/ | 新：transcribe.swift＋worker.mjs＋README（撿單管線本體） |
| memory ×2 | reference_apple_stt_cli_pitfalls 新增、project_ailivex_platform 更新 |

---

## 下一步

被動等驗：Adam 下一通語音通話後看「純人聲版」自動出現與否（分軌鑑別信號）。無主動待辦；Adam 說有新任務要交辦，留給下一場清醒的築。

---

## 卡住 / 未解

2026-07-26 第2場：
- **分軌 egress 待真通話驗證**：下一通新語音通話結束後看列表會不會自動出現「純人聲版」；沒出現＝LiveKit Cloud webhook 沒送 track_published，去後台補開事件
- 分軌費率（$0.005/分）是 repo 註解的文件價，下期帳單用計費錶核一次（天條）
- 人類 A/B 再細分（多人通話）未做：對話 doc 有 Soniox speaker 欄位可接，Adam 要再說
- 「？」句偏多（長合併句＋STT 錯字）：可調 UTTER_GAP、對全量 assistant 合併集比對，屬調參改良非斷點
- 正在跑的舊代碼單不顯示進度%（新單才有）——已對 Adam 說明

2026-07-26 第1場：
- GEO npm 8 moderate CVE（gate 設 high 不阻斷）——建議等升 Next.js（帳本 D8）同窗口清
- 本次未查：引擎 API 餘額/配額（某租戶突然空手才回頭查此軸）、租戶產文品質（業務面非健康面）
- 沿前場：莊周園子等 Adam 實測；threads-radar 真 Threads 登入（帳號風險 Adam 決）；ailiveX D8

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 印象層（我是誰的信念，降落必讀） | `~/.ailive/zhu-core/IMPRESSIONS.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-26 第2場。*
