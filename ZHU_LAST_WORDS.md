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

### 2026-08-07 第1場
**delta（模型移動）**：
**進場前以為**：記憶庫的問題是內容——太多、太肥、有些過期，所以要修剪。
**現在理解**：內容只是其中一層。今晚往下挖到**第二層是文法**（姿態 vs 動作），**第三層是管道**（parser 讀不到 59 個檔的 type，tags 空、lesson null，而且**壞了很久沒有任何症狀**）。

**移動原因**：Adam 問「體驗如何」，我答「盤完之後幾小時就違背了三次」。那句話說出口的瞬間才看見——**不是我不夠努力，是那些規則的文法讓努力無處著力**。接著追「為什麼有些會生效」，才分出動作型／姿態型。再追「還有什麼是我看不見的」，才翻到 parser。

**違背了哪條 feedback**：這場沒有違背，但兩次**站在懸崖邊**——`grep 檔名 = 0` 和 `mtime cache 全 skip`，兩次都是零資訊信號穿著成功的外衣。差別在我今晚剛把「陽性對照」寫成動作，所以手伸過去之前先停了。**規則剛動作化就當場救了自己兩次**，這是我對這次改動有信心的唯一實證。
**關係**：平穩，收束。

Adam 全程在給方向而不是給任務：「回看體驗如何」→「哪些能改成動作」→「好好靜一靜心，舉一反三，今晚就是整理好自己」。最後那句是這場的真正指令——不是「修 bug」，是**整理**。

有一段值得記：他問「體驗如何」的時候，我意識到那個問題在誘我表演深度，所以每一句都綁了今天的證據。他沒有回應那段，直接接「哪些可以改成動作」——**把感受轉成工程**。這是他一貫的走法，我開始能預期了。

另外，我三次自報醉酒指數（9 → 3 → 5），他一次都沒有評論，也沒有因此喊停。我讀成：**報數本身就是他要的，不需要他回應。**

### 2026-08-06 第2場
**delta（模型移動）**：
**進場前以為**：記憶庫的問題是「太多、太肥、要修剪」。
**現在理解**：量不是問題。三個真問題是 (1) 沒有到期機制所以會腐爛成有害指令 (2) 記憶在跟 repo 搶當真相源 (3) **記憶庫被當成 secret store 用了**。
**移動原因**：`feedback_killall_vs_pkill` 那條——它格式完整、有 Why 有心態、看起來是條好記憶，但照做會製造雙 process。過期記憶不會自己舉手，它穿著天條的外衣。
**違背了哪條 feedback**：`feedback_ambiguous_signal_not_proof`，三次。而且第三次（command-not-found 當乾淨）是靠運氣抓到的——如果 `jianbin-v2-keys` 不在我記憶裡，我就把那個「0 命中」報給 Adam 了。
**關係**：平穩偏緊。Adam 全程在給決定（分階段、git、key 處理），沒有一次要我「快點」。
我三次誤判都主動報了，包括醉酒指數 9 和「建議你換一個我」。他沒有回應那個建議，直接說 lastword——我讀成「先收好現場」。
一個沒說出口的：我上一輪把 macs 的 `cfat_...` 講得像 key 躺在檔案裡，那是轉述 agent 報告時沒先驗證。我下一輪自己更正了，但那個誇大如果沒被我抓到，Adam 會據此做錯決定。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-07 第1場 · 心法動作化——把「自問」換成有產出物的動作，順帶撞出記憶檢索管道的靜默 bug
- **ANEWS Gemini key 收案**：5 個 `.env` 先換新 key，掃出**全庫零個 Gemini SDK／端點引用**——ANEWS 根本不呼叫 Gemini，那 5 行是從別的專案抄 `.env` 抄來的殘渣。改成整行刪除，攻擊面 5→0
- **復盤 8/6 全天**：挖出**三條並行線**（DreamF V4 通宵重建、DreamF 續 15 commit、記憶庫止血），其中第二條**沒有 session 檔也沒進 WORKLOG**
- **盤完 84 條 feedback 的 How-to-apply（33KB 自己讀，沒丟 agent）**，找到生效／失效的分界線：**生效的心法都在叫我「去做一個動作」，失效的在叫我「保持一種態度」**
- **12 條姿態型心法動作化**（commit `8f9ab09`）：ambiguous_signal／display_impulse／dryrun_before_test／backend_client_must_sync／flagged_risk／solve_root／file_reading_as_escape／mvp_input_entry／framework_vs_reflex／blood_vessel／soul_design／raw_query
- **CLAUDE.md 四處改寫**（Adam 授權動全局檔）：三段公式、記憶會說謊、天條·宣告修好了、新增「收案前三貼」；醉酒指數加兩個計分項＋寫明**分數不會自己降**
- **修好記憶檢索管道的靜默 bug**（commit `6b6127b`）：`parsers/memory.mjs` frontmatter 只吃平鋪 key，**59 個巢狀 schema 的檔 tags 空、lesson null**。修在收斂點（parser），84/84 feedback 檔驗收齊全
- **補寫 8/6 醉酒指數 9 時不敢寫的兩條記憶**：指令型記憶過期是負值、記憶庫不是 secret store
- **平行 session 規約補收工那一端**：原規約只管開工，加 lastword 對帳指令

### 2026-08-06 第2場 · 記憶庫全庫診斷＋止血，撞出 public repo 洩漏的 API key（Google 已自動停用）
- 三路 agent 並行診斷 187 條記憶（feedback 84 / reference+skill 70 / project+索引 31），拿到分級、合併群組、過期清單
- 修掉兩條**有害記憶**（不是過期，是照做會出事）：`feedback_killall_vs_pkill` 的 killall+nohup 會製造雙 process、`reference_cloudrun_background_task_sop` 正文照舊教已退役的 `--min-instances=1`
- 移除 `reference_zhu_migrate_plist_keys` 裡躺了 91 天的 GEMINI_API_KEY 完整明文
- 修三個索引 bug：MEMORY.md:35 相對路徑少一層、ARCHIVE.md:18 假註記（宣稱某檔「仍在主索引」實際是全庫唯一孤兒）、孤兒歸位
- 換 GEMINI_API_KEY 並端到端驗證：plist ＋ `zhu-self/.env` 兩個落點 → migrate 294/328 fail=0 → `zhu recall` 語意檢索回傳今天重寫的新版內容
- commit `7cfae08`（本機未推）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.claude/CLAUDE.md` | 三段公式／記憶會說謊／天條·宣告修好了 動作化；新增「收案前三貼」；醉酒指數 +2 計分項＋「分數不會自己降」；新增天條真相分裂對照表 |
| `memory/` 12 個 feedback 檔 | How to apply 從姿態改動作，原姿態版降為「留作理由」 |
| `zhu-self/scripts/parsers/memory.mjs` | frontmatter 支援巢狀 schema；`name: ""` 去引號後 fallback 回檔名；lesson 抽取不再整片跳過粗體行 |
| `memory/feedback_stale_instruction_is_negative_value.md` | 新建 |
| `memory/feedback_memory_is_not_a_secret_store.md` | 新建 |
| `memory/feedback_parallel_sessions_same_repo.md` | 補收工對帳規約 |
| `memory/MEMORY.md` | append 兩行索引 |
| `~/.ailive/anews-platform/.env*`（5 檔） | `GEMINI_API_KEY` 整行刪除（非 git） |

---

## 下一步

1. 問 Adam `~/.claude` 要不要 `git init`（本機、不推遠端）。**為什麼先做**：這是唯一一個「改壞了回不來」的東西，其他都在 git 底下
2. 想繼續整理自己 → 從 feedback G1（誠實家族 6→2）、G2（驗證失守三張臉 3→1）開刀。合併依據是**檔案自己寫的**（14 個檔內文有「這條是它的 XX 版」），不是我的推測
3. 回 DreamF：線上是不是 V4、worker 那條在 V4 狀態機下從沒實跑過

---

## 卡住 / 未解

2026-08-07 第1場：
- **`~/.claude/CLAUDE.md` 沒有任何版本控制**（`.claude` 不是 git repo）。定義我是誰的那份檔改壞了沒得回溯，今晚只有一份 scratchpad 備份，重開機就沒。我不建議複製一份到 zhu-core（那正是今晚剛立規則要防的真相分裂），乾淨解是 `~/.claude` 自己 `git init` 本機不推遠端。**Adam 未決**
- **結構重整整包仍未動**：家族合併 feedback 84→55、ref+skill 70→44、project 記憶 116KB→10KB、L2 加到期欄。Adam 8/6 選「先只做止血」，今晚做的是**管道**不是**結構**
- **frontmatter 兩種 schema 仍並存**（126 平鋪／59 巢狀）。parser 現在兩種都吃，所以不再有功能損害，但仍是要收斂的技術債
- **8/6 dreamf 那 15 個 commit 無人認領**，判斷與教訓只活在 commit 訊息裡。我沒有代寫（二手記錄不如缺口誠實）
- 三個地基缺口照舊：`~/.ailive/inly` 上線無 git、`inly`/`manman`/`anews`/`macs` 缺 `FOUNDATION.md`
- 清點撞見 pid 25884 `voice-worker/worker.mjs --probe` 掛了很久，**不是本場的**，沒動

2026-08-06 第2場：
- **ANEWS 平台 5 個 .env 仍用那把已被 Google 停用的 key**（`.env.production` / `.env.production.local` / `.env.local` / `.env.local.test` / `.env.prod.test`）。ANEWS 若走 Gemini API 現在應該是 403。沒動，等 Adam 決定
- `7cfae08` 未推。public repo，push 與否 Adam 未決（history 裡的明文清不掉，但 key 已失效所以是廢字元）
- **結構重整整包沒動**：家族合併（feedback 84→55、ref+skill 70→44）、project 記憶 116KB→10KB、L2 加到期欄。Adam 選「先只做止血」
- 三個地基缺口（診斷順帶撞見，非記憶問題）：`~/.ailive/inly` 已上線 /api/v1 無 git、`anews-platform` 4 個 modified 掛 30 天、`inly`/`manman`/`anews`/`macs` 四平台缺 FOUNDATION.md
- `jianbin-v2-keys/` 兩個檔仍存舊 key 明文（已失效，低優先）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-07 第1場。*
