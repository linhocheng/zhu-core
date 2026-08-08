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

### 2026-08-09 第1場
**delta（模型移動）**：
**進場前以為**：臨時加電（min=1 驗證）是個「等下會記得收」的動作，收攤靠我的意圖。
**現在理解**：**臨時狀態的生命週期要綁在流程上，不能綁在記憶上**——加電和收攤必須是同一個決策的兩半，加電當下就要把收攤寫進下一步（或乾脆用會自動收的機制如電源傘）。意圖活不過 context 切換：當晚接了 UDN 新任務，收攤這件事就從我的工作記憶裡蒸發了，燒到隔天夜巡才抓到。
**移動原因**：夜巡掃 minScale 發現兩台 2CPU 燒了 9 小時，來源正是我自己 18 小時前的手。
**違背了哪條 feedback**：feedback_standing_cost_only_for_instant_readiness——那 9 小時沒有任何人可能下一秒需要它；也是 feedback_self_rescheduling_loop_needs_lifecycle_stop 的變形（開了一個沒有停止條件的狀態）。
**關係**：暢快。Adam 節奏依舊快 GO（「go !」「交給你了」），且開始把「過夜自主任務」交給我（UDN 情緒標「摸透了直接開工」、今晚夜巡「明天聊你的觀察」）——信任半徑在擴大。收攤失誤是本場唯一的污點，明天要主動報。

### 2026-08-08 第7場
**delta（模型移動）**：
- 進場前以為：D12 安全改寫早就在線上運作（母片線 2026-08-06 灌過）
- 現在理解：**「灌了」和「會動」是兩件事**——D12 的 code 一直在，但 worker 沒有 bridge 憑證，`rewriteForSafety` 每次都靜默回 null。母片後來會過是我手動軟化的功勞，帳面上卻記成「D12 已灌」。**功能的存在 ≠ 功能的連通**，血管沒接的功能在帳本上長得跟已完成一模一樣
- 移動原因：Adam 一句「我感覺好像違反了 GPT 的生圖」，追下去三層：單圖線沒改寫→加了也沒用因為叫不到阿光→這條斷線連母片線一起廢。沒有那句話，我會繼續相信帳本
- 違背了哪條 feedback：feedback_interface_blood_vessel_check（介面建完要問血管接通了嗎）——D12 當初灌完沒驗過「改寫真的被呼叫且成功」，只驗了 code 在
**關係**：暢快。Adam 今天做了兩次同型的決定（損傷 delta 給導演、母片格數給導演），我從中讀到他要的不是「更聰明的系統」而是「更聽話的系統」——創作權在人手上。他讓我自發自測那一刻是明確的信任交付：不只是驗證，是讓我完整當一次客戶，親身走過每個閘。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-09 第1場 · 線B 39套入庫＋v22i/v22c 兩專用線切換＋UDN口播稿情緒標＋語音遺缺夜巡（跨 8/8 晚—8/9 夜）
- 線B 39 套方法論假針全審（39/39 頂回零擱置）→ update+prevVersion 入庫 39/39 → 驗證遞招 39/39、閒聊不誤觸 8/8、知識不誤觸 7/8（唯一 fail=A.Two 品牌知識磁鐵，陽性對照證實舊 desc 更糟＝既有邊界非回歸）；過程修 7 套 triggerDesc（遞錯修 desc 不動 τ），調校記錄在 `ailivex-platform/docs/lineB_methodology_drafts_20260808/_scripts/DESC_TUNING_LOG.md`
- v20m 冷凍註記 commit+push（Adam 定案不刪，min=0）；v22 首撥 Adam 驗通
- 建 v22i 訪談線（=v22+UI套件+ui_select RPC+訪綱注入）、v22c 共創線（=v22+propose_* 提案套件，檢索原型不搬）：拷 v22 純加法嫁接、py_compile 過、Cloud Build 雙 SUCCESS、registered worker 雙確認；切兩常數（INTERVIEW/TRAINER_VOICE_LINE）上 Vercel；電源傘過渡名單四線並列（commit be2ff8e/75dcc92 已推）
- 修 v21 潛伏雷：finalize 裡 `transcript = [...]` 重綁閉包無 nonlocal 必炸 UnboundLocalError（v21 的 finalize 一直在死、逐字稿靠增量快照活命）——v22i 改 `transcript[:]` 就地改寫
- UDN 口播稿情緒標（可調）上線：`lib/tts-emotion.ts` 確定性解析（8 情緒/繁簡同義/一般括號不誤傷，10 測試向量全綠）＋口播稿卡分段編輯器（chip 下拉/游標插標/純文字模式保留）＋generate-audio 逐段 TTS+MP3 串接（三段三情緒真打驗證可播）＋計費剝標字數＋生成 prompt 產標；部署 revision 00093 對齊（commit 4fd9480）
- ailivex 即時語音遺缺夜巡：報告在 `zhu-core/reports/AILIVEX_VOICE_GAPS_20260809.md`（6 缺口/待決策按利率排序＋1 結構題）

### 2026-08-08 第7場 · DreamF 損傷帳本上線＋自發自測交片＋KeyMoment 模型翻轉開工（母片格數還給導演）
- **灌損傷帳本 State Ledger**（`shared/ledger.ts` 純函數視圖，不落庫＝f(segments)）：解 Adam 點名三病——狀態非單調（墨水潑了又消失）、終態畫死無法逆轉、左右鏡像（打左臉傷在右臉）。三處注入母片/單圖/影片；母片舊 invariant `keep the same wear` 對毀壞片是**反向指令**，換成單調累積條款＋反鏡像鎖
- **自發自測跑完整支片**（Adam：「你要不要自己發案、自己測一遍」）：我當客戶跟默/阿光/阿律對話，發案→三母卡→母片→9 單圖→動態→簽字→Veo→交片，32 秒 7 鏡 $7.20。**每張圖 Read 進來親眼驗**——帳本在圖像層被證明有效（傷單調累加、全鎖畫面右臉、跨兩張母圖不破）
- **挖出並修好 D12 的真根因**：worker（Cloud Run Job）缺 `BRIDGE_URL`/`BRIDGE_SECRET` → `rewriteForSafety` 叫不到阿光 → **母片線與單圖線的 D12 安全改寫從來都是 null**（先前母片能過全是我手動軟化的功勞）。補 live env＋`worker/cloudbuild.yaml`（同日改腳本）；順手把 D12 補到單圖線（原本只有母片線有）
- **單圖頁加勾選**（Adam 需求）：放大後每張圖可選「進不進正式縫合影片」，切的是既有 skip，後端零改
- **KeyMoment 模型翻轉開工**（Adam：母片格數要由導演定）：設計書過目點頭後開 task-harness，完成 1-4 階（schema/frames 倒轉/ledger 掛畫面/導演標記），100/100 測試綠、tsc×3 exit 0
- 地基帳本盤點：#17 損傷帳本、#18 D12 全線打通（D12 從排後帳結案，Veo 線改寫帶新觸發條件）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex `src/lib/collections.ts` | v20m 冷凍註記；v22i/v22c registry；兩線常數切換 |
| ailivex `src/lib/voice-power.ts` | CANARY 過渡名單四線並列 |
| ailivex `agent/realtime_agent_v22i.py` `main_v22i.py` `cloudbuild-v22i.yaml` | 新檔：v22+UI套件（修 transcript 重綁雷） |
| ailivex `agent/realtime_agent_v22c.py` `main_v22c.py` `cloudbuild-v22c.yaml` | 新檔：v22+提案套件 |
| ailivex `docs/lineB_methodology_drafts_20260808/_scripts/` | lineB 入庫/驗證腳本歸檔＋DESC_TUNING_LOG |
| UDN `lib/tts-emotion.ts` | 新檔：情緒標確定性解析 |
| UDN `app/api/tasks/[id]/generate-audio/route.ts` | 逐段 TTS＋MP3 串接＋剝標計費 |
| UDN `app/api/tasks/dispatch/route.ts` | 口播稿 prompt 產 8 情緒標 |
| UDN `app/projects/[id]/assets/AssetsClient.tsx` | 口播稿卡分段編輯器＋工具列 |
| zhu-core `reports/AILIVEX_VOICE_GAPS_20260809.md` | 語音遺缺夜巡報告 |

---

## 下一步

1. Adam 撥測兩通 → 我 tail v22c log 看 `method proposal enabled`＋v22i 看 `ui event →`/`ui_select ←` → 綠：collections.ts v19/v21 標 standby、voice-power CANARY 改 `['v22i','v22c']`、Vercel 部署、兩服務 min=0 確認
2. 聊 `reports/AILIVEX_VOICE_GAPS_20260809.md`——先拍板缺口 1（interview 旗標）要不要當場修
3. UDN 情緒標 Adam 試用回饋 → 若手感 OK 考慮 podcast worker（多人稿）同款

---

## 卡住 / 未解

2026-08-09 第1場：
- **v22i/v22c 待 Adam 各撥一通驗收**（admin 共創按鈕／BeSelf 測試頁）→ 綠了才把 v19/v21 轉 standby＋出傘冷凍（服務凍存不刪照 v20m 模式）。回滾坑位：改兩常數重部署即回
- UDN 情緒標待 Adam 上手試（尤其分段編輯器手感＋LLM 產標品質）
- 遺缺報告 6 條中 1（interview 判定綁 context）、2（REST fallback 掉情緒）、3（CLAUDE.md 版本過期）是可直接動工的小活，等明天聊完排序
- 醉酒指數自評 4（引用錯 doc id +2、Edit-before-Read 滑倒 +2）——已報數，本場已收尾

2026-08-08 第7場：
- **KeyMoment harness 5-11 階未做**：chat-run（skeleton/翻譯/阿律）、db（幀 doc/砍畫面）、prompts（gridPrompt 吃 moments、veoPrompt per shot）、worker（母圖/放大/拍攝）、UI（導演定畫面）、遷移 archive 舊案、全測重寫＋e2e 自測
- **下一階最大風險（REFLECT Q3 點名）**：半遷移真相分裂——母圖/放大/拍攝現在讀 segments，切 moments 時 db 種幀與 worker 生成必須**同時**選同一條路。對策已定：判準釘單一咽喉（`sb.keyMoments?.length`），不是每個下游各判各的
- Veo 線 RAI 改寫仍走 alt 重投（圖像線已通，Veo 線未；帳本已記觸發條件）
- 資產卡 regen 線仍缺 D12（自測時 style 卡實撞過，手動軟化過關）
- 舊案 `hRrlrFFOyk1Y56yp5yFy`（Adam 的機器人案）停在 master、分鏡是重排前的舊版；自測案 `rplEA0Q1wmQEN14q8ASp` 已交片
- 「今天的桌子」狀態過濾仍是 V3 死狀態（昨天就報過，未修）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-09 第1場。*
