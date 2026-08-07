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

### 2026-08-07 第2場 · 查 UDN 議題工作台密碼＋確認 gcloud 重新登入
- 現場查證 UDN 議題工作台雙閘密碼（不信 12 天前記憶，直接查線上 Cloud Run env）：主工作台 APP_PASSWORD、角色工作室 STUDIO_PASSWORD 皆與記憶一致，回報給 Adam
- 確認 Adam 兩次 `gcloud auth login` 成功（身份 adam@dotmore.com.tw，project ailivex-2026）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.claude/.gitignore`＋git init | 白名單版控，雙 remote |
| `~/.claude/CLAUDE.md` | task-harness 指標去版本號 |
| `~/.claude/skills/task-harness/SKILL.md` | 墓碑去版本號＋事故紀錄 |
| `zhu-core/skills/lastword/fanout.mjs` | audit 照鏡＋STEP 6.5 ~/.claude 自動備份（commit a0fb4a6）|
| `ailivex-platform/agent/main_v20m.py` 等 3 新檔 | V20M 骨架（commit 99b5ff2）|
| `ailivex-platform/agent/minimax_tts.py` | ⑤ 熔斷器加法 flag（+46 行，預設關）|
| `ailivex-platform/agent/realtime_agent_v20m.py` | ④ lex 雙軌＋circuit_breaker=True |
| `ailivex-platform/src/lib/collections.ts` | 註冊 v20m canary |
| `memory/skill_ailivex_canary_voice_power_sop.md` | 新記憶：canary 語音測試電源 SOP |

---

## 下一步

1. **① 多情緒分段**（要做的話）：`~/.ailive/ailivex-platform/agent/minimax_tts.py` 的 `MiniMaxSynthesizeStream._run`——設計 [EMOTION:x] 邊界的 task 重開；先寫離線 harness 餵已知雙情緒句驗證音訊切換＋量首音延遲 delta，才上 v20m。為什麼先做：它是六項裡唯一「一聽就知道」的品質躍升，也是 V20M 存在的最大理由
2. v20m 下次撥測 SOP 已刻進新記憶 `skill_ailivex_canary_voice_power_sop`——直接照做，別再踩 mode=on
3. `~/.claude` 起備份節拍已自動化，無需人工

---

## 卡住 / 未解

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-07 第3場。*
