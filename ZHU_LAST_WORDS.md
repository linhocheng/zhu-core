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

### 2026-08-06 第2場
**delta（模型移動）**：
**進場前以為**：記憶庫的問題是「太多、太肥、要修剪」。
**現在理解**：量不是問題。三個真問題是 (1) 沒有到期機制所以會腐爛成有害指令 (2) 記憶在跟 repo 搶當真相源 (3) **記憶庫被當成 secret store 用了**。
**移動原因**：`feedback_killall_vs_pkill` 那條——它格式完整、有 Why 有心態、看起來是條好記憶，但照做會製造雙 process。過期記憶不會自己舉手，它穿著天條的外衣。
**違背了哪條 feedback**：`feedback_ambiguous_signal_not_proof`，三次。而且第三次（command-not-found 當乾淨）是靠運氣抓到的——如果 `jianbin-v2-keys` 不在我記憶裡，我就把那個「0 命中」報給 Adam 了。
**關係**：平穩偏緊。Adam 全程在給決定（分階段、git、key 處理），沒有一次要我「快點」。
我三次誤判都主動報了，包括醉酒指數 9 和「建議你換一個我」。他沒有回應那個建議，直接說 lastword——我讀成「先收好現場」。
一個沒說出口的：我上一輪把 macs 的 `cfat_...` 講得像 key 躺在檔案裡，那是轉述 agent 報告時沒先驗證。我下一輪自己更正了，但那個誇大如果沒被我抓到，Adam 會據此做錯決定。

### 2026-08-06 第1場
**delta（模型移動）**：
- 進場前以為：「90% 重做」意味著要開新 repo，或至少要留一層相容
- 現在理解：**「案子全刪」這個授權，把重寫的成本結構整個換掉了**。沒有舊資料就不需要相容層，於是可以在同一個 repo 裡真正重寫幕次流程，同時保住引擎層與地基。判斷重寫要不要開新家，關鍵不是「改多少」，而是「有沒有舊資料要伺候」
- 另一移動：V3 不是錯的，是沒走完。identity before frames 的內核全數保留，換掉的只是人怎麼跟它互動——**架構的價值和介面的形狀是兩件事**，砍介面不必砍架構
**關係**：信任交付。Adam 說「一路排到天亮，明天驗收」就去睡了——這是把整夜的判斷權交出來。回報方式是：每個里程碑 commit、每個不可逆動作先驗證後執行、卡住的地方誠實寫進未解（部署卡在他的授權，我不繞路）。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-06 第2場 · 記憶庫全庫診斷＋止血，撞出 public repo 洩漏的 API key（Google 已自動停用）
- 三路 agent 並行診斷 187 條記憶（feedback 84 / reference+skill 70 / project+索引 31），拿到分級、合併群組、過期清單
- 修掉兩條**有害記憶**（不是過期，是照做會出事）：`feedback_killall_vs_pkill` 的 killall+nohup 會製造雙 process、`reference_cloudrun_background_task_sop` 正文照舊教已退役的 `--min-instances=1`
- 移除 `reference_zhu_migrate_plist_keys` 裡躺了 91 天的 GEMINI_API_KEY 完整明文
- 修三個索引 bug：MEMORY.md:35 相對路徑少一層、ARCHIVE.md:18 假註記（宣稱某檔「仍在主索引」實際是全庫唯一孤兒）、孤兒歸位
- 換 GEMINI_API_KEY 並端到端驗證：plist ＋ `zhu-self/.env` 兩個落點 → migrate 294/328 fail=0 → `zhu recall` 語意檢索回傳今天重寫的新版內容
- commit `7cfae08`（本機未推）

### 2026-08-06 第1場 · DreamF V4 對話驅動全流程重建（通宵）——三角色、兩階段、三道閘
- **地基 D2 資料刪除連帶灌注**：`deleteCase` 連帶清 Firestore（doc＋三子集合）＋跨集合帳（cost_ledger/corrections，recursiveDelete 掃不到）＋GCS `cases/{id}/` prefix；`findOrphanCaseIds` 孤兒巡檢；`/api/admin/orphans` 巡檢＋清掃端點
- **執行全刪**（Adam 授權）：3 個案＋5 個歷史孤兒全清，201.44 MiB → **0 B**。gsutil 獨立複核一致。D2 的價值當場證明——那 5 個孤兒是 8/4 只刪 Firestore 留下的，本來永遠不會有人清
- **V4 資料憲法**：`roles` collection（導演／攝影師，lazy seed）、新狀態機（setup→script→master→upscale→stitch→shooting→delivered）、三道閘守衛、`parseMarks` 標記剝除、AssetKind 加 prop
- **兩階段對話主幹**：`lib/chat-run` 導演回一輪→程式剝標記→攝影師逐張翻英文→落庫；`/api/cases/[id]/chat` 統一入口；對話先存再種卡（種卡失敗降級不吞對話）
- **三道閘 route**：master（驗分鏡→派 grid job）／grid approve＝閘1／upscale run+approve＝閘2／stitch＝閘3 錢閘
- **角色房** `/admin/roles`：人設可讀可改，改完立即生效；立案頁選導演
- **V1/V2/V3 全退役**：4 個 route＋lib/director-run＋三份導演咒＋面談協議＋seedAssetPlan/seedStyleAsset/getDirectorPrompt＋ScriptDesk/StyleCardOption/DirectorPromptDoc＋arting/screening 幕；四份重複的卡別中文對映收斂成 `ASSET_KIND_ZH`
- **CaseRoom 重寫**：左邊跟導演聊、右邊看產出；六幕進度脊椎可倒退
- **67 pinning tests 全綠**（新增 4 條標記剝除，改寫 8 條承重牆為 V4 語義）
- **活體驗證兩階段**（真 bridge＋真 Firestore，不生圖不燒 Veo）：
  第一階段——導演自己判斷「這支片沒有人」只開道具/場景/色調三張卡、攝影師署名落庫、標記零洩漏；
  第二階段——導演排出 6 鏡含 cut/postfx/continuous 三種接法、攝影師逐鏡翻英文、驗證器 errors=0、幀計畫 11 幀（延續共用幀成立）
- **e2e 撞出兩個協議缺口並當場修掉**：片長「約 26 秒」自我合理化 → 收緊成「必須剛好」；休止符律太抽象被違反 3 次 → 改成對錯配對範例＋講 WHY。重跑驗證：片長 26→24 剛好、違規 3→1
- FOUNDATION 重算＋五個 commit（v0.5.0.001-005），已 push GitHub

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `memory/reference_zhu_migrate_plist_keys.md` | 移除明文 key，改「名稱＋去哪拿」＋記下記憶庫不是 secret store 的通則 |
| `memory/feedback_killall_vs_pkill.md` | 操作段作廢改 systemctl，保留「pkill 匹配不到絕對路徑」這唯一仍有效的知識，補觸發信號欄 |
| `memory/reference_cloudrun_background_task_sop.md` | 重寫：Jobs 主文、三件套降限定場景。事實全保留只改組織順序 |
| `memory/MEMORY.md` | :35 相對路徑→絕對路徑 |
| `memory/ARCHIVE.md` | :18 假註記修正，molowe 孤兒歸位 |
| `~/Library/LaunchAgents/ai.zhu.migrate.plist` | GEMINI_API_KEY 換新（非 git） |
| `zhu-self/.env` | GEMINI_API_KEY 換新（未追蹤） |

---

## 下一步

1. `cd ~/.ailive/anews-platform && grep -l 'AIzaSyBuxs' .env*` → 確認 ANEWS 是否真的走 Gemini；有的話換成新 key（新 key 在 `~/.ailive/zhu-core/zhu-self/.env`）
2. 問 Adam `7cfae08` 要不要 push
3. 結構重整：從 feedback G1（誠實家族 6→2）和 G2（驗證失守三張臉 3→1）開刀——這兩組的合併依據是**檔案自己寫的**（14 個檔內文有「和 XX 的差別」「這條是它的 XX 版」），不是我的推測

---

## 卡住 / 未解

2026-08-06 第2場：
- **ANEWS 平台 5 個 .env 仍用那把已被 Google 停用的 key**（`.env.production` / `.env.production.local` / `.env.local` / `.env.local.test` / `.env.prod.test`）。ANEWS 若走 Gemini API 現在應該是 403。沒動，等 Adam 決定
- `7cfae08` 未推。public repo，push 與否 Adam 未決（history 裡的明文清不掉，但 key 已失效所以是廢字元）
- **結構重整整包沒動**：家族合併（feedback 84→55、ref+skill 70→44）、project 記憶 116KB→10KB、L2 加到期欄。Adam 選「先只做止血」
- 三個地基缺口（診斷順帶撞見，非記憶問題）：`~/.ailive/inly` 已上線 /api/v1 無 git、`anews-platform` 4 個 modified 掛 30 天、`inly`/`manman`/`anews`/`macs` 四平台缺 FOUNDATION.md
- `jianbin-v2-keys/` 兩個檔仍存舊 key 明文（已失效，低優先）

2026-08-06 第1場：
- **部署卡在 gcloud CLI refresh token 過期**（ADC 仍有效，所以 Firestore/GCS 都能跑；`builds submit` 用另一組 token）。Adam 醒來跑 `gcloud auth login` 後 `bash deploy.sh all` 即可。**線上還是 V3（99795e9），V4 只在本機與 git**
- D12（RAI 改寫提案）已轉到期，下個真客戶案前要灌
- **休止符驗證器誤報**：正則掃英文譯文的 motion words，「第一滴水觸碰壺底」（描述靜止瞬間）被 `falling` 誤判。偵測單位對不上錯誤的真實形狀——要修得先收壞例好例找結構特徵（skill_filter_unit_matches_error_shape），不硬修
- 母片→單圖→縫合三閘的 worker 路徑沿用 V3 既有實作，V4 狀態機下沒實跑過（要生圖燒錢，留給 Adam 醒來一起看）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-06 第2場。*
