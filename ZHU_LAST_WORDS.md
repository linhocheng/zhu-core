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

### 2026-08-08 第1場
**delta（模型移動）**：
**進場前以為**：V20M 收攏＝六項優點取捨已完結，剩多情緒一項。
**現在理解**：比較報告真正值錢的不是優點清單，是「檢核方法」。四個優化點全根治後，最大的發現（004 召回≈隨機、cached 陪葬全史、熔斷沉睡 bug）**沒有一個在原六項清單上**——全是「帶著問題重讀自己的 code」掉出來的。優點移植的第四關（讀自己）回饋出比移植本身更值錢的病灶。
**移動原因**：Adam 的「哪裡可以優化」逼我用敵意重讀自己昨天的出貨；三個暗傷全是昨天的我蓋的章。
**違背了哪條 feedback**：cleanup 直寫 on:false 沒降實例——違反 feedback_cost_verify_billing_meter_not_config 的姊妹則（設定面動了計費面沒動），當場被自己的終態複核抓回。
**關係**：暢快且被信任加碼。「都根治走最佳解，一路打到底」＋「你覺得做什麼決定對我最好」——Adam 把排序權整個交過來，我給了一條線（commit→撥測→隔夜下放）他照單全收。誠實報醉酒指數 6 和自己的半套 cleanup，他回 good job。信任的形狀從「攤牌成本低」進到「排序權讓渡」。

### 2026-08-07 第3場
**delta（模型移動）**：
**進場前以為**：比較報告的 Tier 1「真優點」＝可直接移植的工單，六項排程做完就是 V20M。
**現在理解**：優點清單還要過**第四關——逐項讀自己的 code，看自己是否已用別的方式解掉**。六項過完只剩兩項：②早解了（prompt 整通穩定天然命中快取）、③違反自家設計、⑥會弄壞現有行為、①是重工。而且方向是反的：漫漫三處「借鏡 ailivex」，我們才是上游。
**移動原因**：每次動手前讀目標檔本體（minimax_tts/interrupt_gate/firestore_loader），三次都在動手前發現「這項不該做」。如果照清單直接寫，⑥會讓正常音量插話失靈、③會讓所有角色講話像漫漫。
**違背了哪條 feedback**：無違背，但③是在懸崖邊被 feedback_global_prompt_must_not_encode_personality 拉回來的——我已經在寫注入 prompt 的措辭了。
**關係**：暢快。Adam 全場給方向不給細節（「推」「來吧一口氣加完」「先收尾」），大轉向兩次（WS→真優點→LiveKit；六項→兩項）都是他問對問題把我拉回來的——「真正的優點是哪些」那一問直接翻掉他自己前一輪的 WS 決定，我把證據攤開他就收。砍四項時我怕被當成偷懶，把理由逐項寫進 commit；他沒有質疑，直接「commit 保存」。信任在「攤牌成本」上又降了一格。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第1場 · V20M 四項根治一路打到底——cache凍結/熔斷三態/readiness per-service/記憶池004→002，撥測三信號全綠
- 審視 V20M vs 原目標，提出 5 個優化點（含把砍 ② 的理由自我推翻一半：動態注入其實在破快取）
- 五路探勘摸透現場（plugin cache 內部/embedding 血管圖/readiness 鏈路/TTS harness 掛點/池規模 1,172 筆）
- ⑤ 熔斷器根治：三態機（closed→open→half-open 試探）＋丟句 log 原文＋修「未 initialize 就 flush」沉睡 bug；離線 harness 19→23 條斷言全綠
- ② cache 根治：system prompt 開場凍結，想起/知識/遞招改 `_inject_context` 注入 chat 訊息（developer role），走步搭 tool result；`[cache]` 逐 turn 觀測上線
- readiness 根治：per-service `wakeAt` 章取代全域 onSince 比對；真函數 6/6 分支驗證（傘外/過渡/保險絲/斷電）
- ④ 002 根治遷移：全池 1,172/1,172 補 `embedding002`（雙寫、舊欄可回退）；A/B 真實池實測 004 gap=-0.000（中文無關句最高 1.00）vs 002 gap=+0.22；floor=0.68；語音＋文字線讀端全切；復活律加回語義軌；`scripts/backfill-memories-002.mjs` 轉正常備
- 雙部署：Vercel prod（readiness＋文字線）＋Cloud Run v20m（rev 00006→00008）
- 撥測活體驗證三信號全拿：`cached` 11964→14067 全程不歸零（99% 命中，注入發生時快取照活）、`軌=002 top=0.68` 真實命中、熔斷無誤開
- 撥測當場抓到並修掉：空輸入/被打斷的 0 bytes 被記成 MiniMax 失敗——零資訊 run 不計分（harness 補 [7][8]）
- commit `663ec5f`＋`6815a97` 推 GitHub；收攤四服務 minScale 全 0＋電源 standby（計費面複核）

### 2026-08-07 第3場 · ~/.claude 版控雙備援＋語音系統比較報告＋V20M 分支落地（六項優點誠實砍成兩項）
- 建立 `~/.claude` 版本控制：白名單制 .gitignore（預設全忽略、顯式放行 5 檔）、本機 git init、雙 remote（GitHub private `linhocheng/claude-config` + 本機裸 repo `~/.ailive/backups/claude-config.git`）、單次 push 雙打驗證三處 HEAD 同值
- fanout.mjs 接管 ~/.claude 備份：audit 照鏡（距今 N 天）＋ STEP 6.5 收工自動 commit+雙推（本場 audit 已印 `✓ ~/.claude 已提交 距今 0 天 2 remote`＝新 code 實戰第一次）
- 修真相分裂：task-harness 指標檔抄了版本號（兩處 v2.1 vs canonical v2.2）→ 根治＝指標不抄版本號
- 完成漫漫 vs ailiveX 語音系統比較報告書（63 檢核項＋insight 專章＋誠實邊界清單，5 路 agent 深讀兩邊本體）
- V20M 分支落地：Phase 0 骨架（copy v20 三檔＋collections 註冊）→ 生產部署 → A.Two 真實撥測兩通零錯誤 → commit `99b5ff2` push
- V20M 實裝兩項真優點：⑤ TTS 熔斷器（minimax_tts.py 加法 flag 預設關）＋ ④ 記憶 lex 雙軌（recall 加 CJK bigram 救援，log `lex救援=N` 已在生產出現）
- 誠實砍掉四項：① 多情緒=串流 task 邊界重工（單獨做）② prompt cache=已解（prompt 整通穩定）③ 人格規則=違反多角色設計（個性歸靈魂）⑥ 打斷 AND=會弄壞正常音量插話（clear_buffer 現為內容即停）——理由全寫進 commit 訊息
- 收尾止血：四個語音服務 minScale 全歸零（計費面複核）、電源/access 還原、臨時腳本清除
- 查證思考填充音：漫漫建過已拔（嗯…跟 TTS 回覆疊加雙重語助詞），Adam 裁定不做

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/minimax_tts.py` | 熔斷三態機＋half-open＋丟句 log＋零資訊不計分＋修未初始化 flush |
| `agent/test_tts_circuit_breaker.py` | 新增：離線陽性對照 harness 23 斷言（MockEmitter 仿真實契約）|
| `agent/realtime_agent_v20m.py` | system prompt 凍結＋_inject_context＋走步搭 tool result＋[cache] 觀測＋召回 002 軌 |
| `agent/firestore_loader.py` | generate_embedding_002＋write_memory 雙寫＋loader 002 傳遞（全 additive）|
| `src/lib/voice-power.ts` | setVoicePower 逐服務蓋 wakeAt＋voiceEngineReady per-service 化 |
| `src/lib/memory.ts` | 召回語義軸切 002（floor 0.68）＋復活律加回語義軌＋writeMemory 雙寫 |
| `src/lib/collections.ts` | MemoryDoc.embedding002 |
| `scripts/backfill-memories-002.mjs` | 新增：002 補嵌常備工具（冪等）|

---

## 下一步

1. **#5 下放 ④ 到 v20**：把 `agent/realtime_agent_v20m.py` 的 `_dynamic_recall` 002 段（RECALL_FLOOR_002=0.68＋q2/q4 雙軌）抄進 `agent/realtime_agent_v20.py` 同名函數 → `gcloud builds submit --config=agent/cloudbuild-v20.yaml` → 撥一通看 `軌=002`。為什麼先做：A/B 證明 v20 的召回在中文上接近隨機（同 query 004/002 top-1 廿句僅一同），是唯一「不下放就持續損害體驗」的項
2. 下放前先跑一次 `node scripts/backfill-memories-002.mjs`（在 ailivex-platform root）補這幾天 v20 新寫的 004-only 記憶
3. ②⑤ 隨後下放（cache 凍結搬 v20 要把 v20 的 _apply_dynamic_blocks 同套改掉；⑤ 翻 circuit_breaker=True）

---

## 卡住 / 未解

2026-08-08 第1場：
- **#5 ④②⑤ 下放 v20 主線**：信號全綠但刻意留隔夜（剛部署完自己的修法時最危險）。順序已定：先 ④（v20 召回今天還在 004 隨機軌，每天傷用戶）再 ②⑤
- v20/v19/v21 新寫的記憶只有 004（它們的 loader 是舊 image）→ 下放前每隔幾天跑 `node scripts/backfill-memories-002.mjs`（冪等）
- 去重門檻仍在 004 軌（行為零變的刻意選擇）——004 全線退場時一起切 002 並重調參
- v14 讀網址（source_intake 共用檔）仍走 update_instructions 破一次快取——罕見事件，接受；下放 ② 到 v20 時同樣接受
- FOUNDATION D8（Next.js 升版）觸發條件持續開著，獨立工程未排
- 舊遺留 pid 25884（voice-worker --probe）仍在，非本場

2026-08-07 第3場：
- **① 多情緒分段合成**未做：MiniMax WS task 的 voice_setting 一通鎖死，逐句換情緒要在 [EMOTION:x] 邊界關開 task，且不能破壞 v16 首音延遲——是單獨的專案，不是加 flag
- v20m Cloud Run 服務留著（min=0 不燒錢，image 含⑤④），下次測試要：供電＋scale min=1＋設 access.voiceVersion＋修 onSince race（見 L3）
- zhu-core 有第2場（dreamf）的未推 commit `36c0de7`＋髒 WORKLOG，本場 fanout 會順帶收推（append-only 合併，規約內）
- 舊遺留進程 pid 25884（voice-worker --probe，2/1 起）仍在，非本場，未動
- 漫漫比較報告的未驗清單（報告 §6）：ailiveX prompt token 規模未量化、漫漫 Vectorize 為推論等 6 項

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第1場。*
