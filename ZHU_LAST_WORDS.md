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

### 2026-07-27 第1場
**delta（模型移動）**：
進場前以為：判定「用戶在場」用麥克風音量就夠——realtime 頁的 RMS 套路現成，搬過來當防呆判定。
現在理解：**量測和判定的容錯等級不同**。同一個信號（RMS>0.04）拿來量首音延遲，誤判只是丟樣本；拿來當「不在場就掛你電話」的判定，手機 AGC 把呼吸和環境音抬過門檻＝判定永遠不觸發（Adam 靜音 45s 實測不掛）。Adam 的「點一下畫面」設計點破：**在場證明要選環境騙不過的信號通道**——觸碰是用戶主動動作，零環境誤判；聲音降級為輔助取消條件。
移動原因：Adam 真機測試打臉＋他提出的觸碰設計一聽就知道比我的聲音判定乾淨。
違背了哪條 feedback：沙推不是驗證家族——「套路在別處可用」不等於「在這個用途可用」，搬用途前要重問容錯等級。
**關係**：暢快帶勁。Adam 丟出 Nokia 設計時說「討論一個好玩的東西」，我猜中「撥號盤＝密碼」他回「完全猜的是正確的」；看門狗他被我的版本擋不住後提出更好的「點畫面」設計——這場是真共創，互相把對方的方案墊高。收尾「Good job！」＋讓我喝咖啡休息。

### 2026-07-26 第2場
**delta（模型移動）**：
進場前以為：壓縮接手後「查現場狀態」就夠了（compacted_session_verify_state 只講了現場）。
現在理解：**壓縮接手要驗的還有「需求理解」本身**——Adam 中途兩次停下來問「你一開始收到的指令是什麼」「你聽到的功能是什麼」，是他在替我做指令對齊檢查。現場狀態我驗了，但原始需求的複述驗證是他發起的，不是我。
移動原因：他問完、我複述、他說「正確，重啟選單」——那一刻看懂這是他的對齊儀式：長 session＋壓縮＋多輪轉向後，把「我聽到的」原文攤出來讓他核，比繼續埋頭做更省。
違背了哪條 feedback：compacted_session_verify_state 的盲區——驗了 git/WORKLOG/現場，沒驗「我腦中的需求版本」。下次壓縮接手做大功能前，主動複述一次原始指令給 Adam 核。
**關係**：暢快。Adam 中場的對齊檢查（「你聽到的是什麼」）→ 複述 → 「正確，來吧 good job」是這場的信任支點；收尾他把「接新任務 or 休息」的決定權交給我，我報醉選休，他前一句是「非常棒！」。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-27 第1場 · ailiveX 共創開放＋Nokia 話機 /talk 全鏈；ailive Vivi 草稿假失蹤根治
- 蓋 ailiveX 功能1「共創開放指定用戶」：access.coCreateEnabled 旗標＋三道守門同步放寬（characters API／token 訓練線閘／v19 agent 提案閘——施工前驗出 agent 內還有第二道 admin 閘，只改平台側會變半殘共創），v19 重建部署 revision 00035 接 100% 流量、minScale=0 無復活常駐費
- 蓋功能2「對話模式」兩階段：先大字表單版（UserDoc.talkMode* ＋ admin 用戶管理頁設定＋middleware 放行），當天升級成 Adam 設計的 Nokia 復古話機——撥號盤輸入＝數字密碼、綠鍵登入＋接通一氣呵成（同頁通話保手勢鏈）、已登入免密碼、掛斷回撥號盤零登出鍵、PWA 可加入主畫面、免登入 peek API 角色卡＋上線狀態接語音電源真相
- 蓋通話看門狗（Adam 定案「點畫面」機制）：誤觸 45s／雙靜默 3 分／上限 60 分三規則統一收斂到全螢幕「點一下畫面繼續通話」＋30s 倒數；語音判定連續 400ms＋靜音不計（AGC 誤判實測修）；自動掛斷同紅鍵路（靜麥 1.8s 收記憶＋voice-end 記帳）。45s 誤觸規則 Adam 真機測過
- 加 LCD 聲紋（角色亮綠/用戶橄欖綠頻譜）＋html/body 全黑；真機模擬（CDP 390×844）驗版面滿版無破——headless Chrome 有 500px 視窗下限，390 截圖被裁不是 bug
- 修權限指派頁整排按鈕隱形的既有斷點：admin characters API 從未回 hasVoice，版本下拉/GPT Voice/共創全掛在這欄上
- 升級 voice-worker：launchd 探針制（60s 一發無單即退，不養常駐）＋config/voiceWorker 心跳→錄音頁三色燈號（Adam 點名要「看得見的燈號」別瞎等）＋轉錄單塊容錯（c32 殘段案：重試→記帳跳過寫檔頭，>2 成才判整單失敗）＋pid 互斥鎖
- 修 ailive-platform Vivi「存草圖沒存」假案：草稿完好，五條讀路徑全是「無排序 limit」按 doc ID 抓最舊角落（310 篇後新草稿永遠讀不到）；建 composite index＋五處補 orderBy，T6lrg 案驗證排第一
- 分軌 egress 真通話驗通（Adam 親證純人聲版自動出現）；mars 帳號密碼修復＋共創/對話模式全配置
- commits：ailivex v18.23.0/.1/.2＋v18.24.0（527d881）；ailive 544e4c5，全推

### 2026-07-26 第2場 · ailiveX 錄音後處理全鏈——Apple 本機 STT 排單制＋分聲切人聲＋監控鏈
- 評估「錄音轉文字稿＋分聲＋切純人聲」需求：Max 吃到飽不吃音訊（物理限制），改用 Apple on-device STT（$0）；試金石先行（6.5 分鐘真實錄音），修掉三個引擎怪癖（CLI 主執行緒死鎖、逐語句 final、假時間戳）後判定可建，Adam 拍板「按鈕排單＋Mac 撿單」＋「新錄音分軌」
- 蓋平台側：admin 錄音頁「轉文字稿」「分聲＋切人聲」兩鈕排單、voice-job 路由（含 action=cancel）、列表帶產物 signed URLs；webhook track_published 對人類 audio track 開第二條 TrackCompositeEgress（新錄音純人聲天生分離）、egress_ended 依 humanEgressId 分帳
- 蓋本機側：`scripts/voice-worker/`（transcribe.swift＋worker.mjs）——50s 切塊轉錄、對話紀錄 bigram 比對分聲（兩邊 opencc 轉簡體）、ffmpeg 切純人聲、參照失效防呆（0 句對上 AI 原稿＝參照被 50 則滾動窗擠掉→全標「？」不硬切）
- 蓋監控鏈（Adam 點名要能終止）：心跳 voiceJobAt 每 chunk 寫＋voiceJobProgress 百分比、UI「終止」鈕、worker 回寫全走 transaction 護欄（終止後結果丟棄不蓋回）、watchdog 兩側（admin GET＋worker sweep）心跳斷 10 分鐘自動收失敗帳；手動終止/逾時兩條故障路徑都真測過
- 端到端實戰：Adam 真按鈕兩單（Apple 32 分鐘錄音 diarize＋transcribe）全跑通；分聲抽查標了的全對（三說話者場：Adam＋寶清都進人聲檔、AI 剔除）
- 成本定案：單次處理趨近 $0（GCS 下載 NT$0.1，零 LLM）；分軌 +$0.005/分鐘（唯一新增經常費）
- commit ×3 已推：29a938a 功能本體 / a034123 監控鏈 / 13c754e 進度條＋README 故障排除表

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex src/app/talk/（page+layout） | Nokia 話機全套：撥號=登入/通話/看門狗/聲紋/PWA 註冊 |
| ailivex src/app/api/talk/peek/route.ts | 新：免登入角色卡（防帳號探測統一回空） |
| ailivex public/talk.webmanifest+sw+icon×3 | PWA 安裝件（Chrome headless 產 icon） |
| ailivex src/lib/collections.ts | AccessDoc.coCreateEnabled＋UserDoc.talkMode*/talkLine |
| ailivex admin access/users 頁＋API | 共創開關＋對話模式設定區（角色下拉驗 access） |
| ailivex api/characters/[id]＋livekit/token | 守門放寬 admin 或旗標；characters API 補 hasVoice |
| ailivex agent/realtime_agent_v19.py | 共創閘放寬（admin 或 access.coCreateEnabled） |
| ailivex scripts/voice-worker/worker.mjs＋README | 探針/心跳/pid 鎖/單塊容錯/檔頭記帳 |
| ailivex admin recordings 頁＋API | worker 三色燈號 |
| ~/Library/LaunchAgents/ai.zhu.ailivex-voice-worker.plist | 新：60s 探針 |
| ailive api/posts＋dialogue＋task-run | 五處 orderBy 修＋composite index（moumou-os） |
| memory ×3 | skill_firestore_limit_without_orderby 新增、project_ailivex_platform 更新、opencc/分軌註記 |

---

## 下一步

被動等 Adam 真機驗收：聲紋雙向跳動＋PWA 加入主畫面＋共創通話 v19 log 出現 `method proposal enabled`（電源開著才驗得到）。無主動待辦。

---

## 卡住 / 未解

2026-07-27 第1場：
- mars 密碼仍是字母（reddoor），Nokia 撥號盤打不出——Adam 要在後台重設純數字（他知道，他的功課）
- /talk 撥出後 agent 不進房無超時（卡「接通中」只能按紅鍵）——與 realtime 頁同款既有縫，Adam 要補喊一聲
- 看門狗 3 分靜默與 60 分上限尚未真測（45s 誤觸已過）；聲紋要真通話驗雙向跳動
- 分軌費率 $0.005/分下期帳單核錶（天條，續 7/26 未解）
- 別場 session 髒樹不動：zhu-core skills/ailivex-knowledge-ingest.md、AILIVE/MOUMOU 11 檔、anews-b 12 檔、ailive-platform 未追蹤 debug scripts

2026-07-26 第2場：
- **分軌 egress 待真通話驗證**：下一通新語音通話結束後看列表會不會自動出現「純人聲版」；沒出現＝LiveKit Cloud webhook 沒送 track_published，去後台補開事件
- 分軌費率（$0.005/分）是 repo 註解的文件價，下期帳單用計費錶核一次（天條）
- 人類 A/B 再細分（多人通話）未做：對話 doc 有 Soniox speaker 欄位可接，Adam 要再說
- 「？」句偏多（長合併句＋STT 錯字）：可調 UTTER_GAP、對全量 assistant 合併集比對，屬調參改良非斷點
- 正在跑的舊代碼單不顯示進度%（新單才有）——已對 Adam 說明

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-27 第1場。*
