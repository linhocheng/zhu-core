# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。Y 軸自校在 `SELF_AWARENESS_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
  - molowe 4 worker 全活：intel(5min) / xi(60s) / discovery(60s) / yi-post(5min)
  - **live-media 7 條 schedule 已軟停（2026-05-09 晚），code 留著**
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **molowe-platform**：`https://molowe-platform.vercel.app`（KOL 管理後台 + 三層 AI 編輯部，主戰場）

---

## 最新完成（2026-05-13 收尾段 — Phase 1 → Phase 2 簽字 + reflex active 首日）

**主戰場**：zhu-self 自我工程升 Phase 2 + reflex hook 從 log_only 升 active。Adam 一句「全檢一次（自己）」進場 → 4 校正派工 → 連續跑完 A0/A1/B1-B3/C2/D1/D2 + 簽字。

**一句話**：reflex hook 升 active 兩條（`bridge_first` + `solve_root_not_symptom`），帶三層救援（`zhu reflex log-only` 全域降級 / `zhu fp <rule>` 單發放行 / `zhu fp <rule> --always` 永久白名單）。同步收：realtime_agent.py v0.4.0.005、Phase 2 簽字 v0.3.0.007、reflex 機制 v0.3.0.008。

**這個 session 跑了什麼**
- **全檢進場（Adam 一句「全檢一次 自己」）**：跑 `zhu status` + `self-check` + `vitals --pulse/--drift/--cost` + `debt list`。儀表板綠、4 vendor 點對賬綠、252 debt items 全 fresh。
- **校正派工 4 件**（拿到 Adam 計畫不直接動，先退回校正——這是夥伴關係不是 lookup table）：
  - **C1 已收乾**：Adam 列「決策 bridge fallback 雙燒」，但 `anthropic-via-bridge.ts` 已在 v0.4.0.004 收乾（line 8 註解「Bridge 失敗一律 throw，不 fallback SDK」）。校正：C1 砍掉、補 A0 = realtime_agent.py uncommitted commit。
  - **A1 region 錯**：原文 `--region=asia-east1-b`（zone naming）。`gcloud functions list` 真實 region 是 `asia-east1`。
  - **B1 PID 可能 stale**：原文「kill 891193」直 kill。先 `ps -p 891193` 驗證再 kill（守 `feedback_memory_can_lie.md`）。
  - **D2 嚴重低估**：原文「20 min」實作 ~45 min（原 hook 永遠 exit 0、active 模式得從零設計）。
- **A0 — realtime_agent.py 收 commit**：in-flight lock + session.say → generate_reply 兩處 drift 收成 ailive-platform v0.4.0.005。
- **A1 — Cloud Functions log 校正 region**：region 改對後拉到 reflectIntoSnapshot 真實 log，補完 5/13 早段 LUCY 504 鐵證鏈。
- **B1 — kill stale node 殭屍**：驗 PID 891193 真存在（10h ago started）→ `killall -9 node`（守 `feedback_killall_vs_pkill.md`）→ 重 launchctl load 三個 plist。
- **B2 — memory 合進既有檔不開新檔**：兩條洞察併入既有 memory：
  - `feedback_memory_can_lie.md` ＋「反向版（2026-05-13）：越急著下結論的我越會說謊」
  - `feedback_bridge_silent_fallback_double_burn.md` ＋「504 兩型態：雙燒 vs 賽跑」+ Firestore dedupe 驗證法
- **B3 — distill 候選只看不蒸**：`zhu distill` 候選看完，沒新模式需要蒸出來。
- **C2 — platform_insights 確認空**：預期有 side-effect insight，實際空（早段 reflect 沒寫 insight，可能 try/catch 吞掉，獨立小坑沒處理）。
- **D1 — Phase 1 → Phase 2 簽字**：ACCEPTANCE.md 加 v0.3 signature、WBS task #18 ✅ done、Phase 2 header 🟢 in_progress → zhu-core v0.3.0.007。
- **D2 — reflex 升 active**（task #20 首批）：
  - 新增 `scripts/reflex-mode.mjs`：`zhu reflex active|log-only|status` 全域 kill switch
  - 新增 `scripts/reflex-fp.mjs`：`zhu fp <rule> [--always] / --list / --clear` once/always 救命稻草
  - rewrite `scripts/reflex/pretool-hook.mjs`：加 `GLOBAL_MODE` 判斷、`active && !fp` 才 exit 2、消費 once fp
  - `rules.mjs`：`bridge_first` + `solve_root_not_symptom` state `log_only → active`
  - `state/reflex.json` mode `log_only → active`、`state/false_positives.json` 初始化
  - `bin/zhu` 加 `reflex` / `fp` 兩個 case
  - smoke fixture (`tests/smoke-fixtures/bridge_first.json`) 驗 exit 2 + stderr 提醒 + fp 消費正確
  - zhu-core v0.3.0.008

**鏡子（這次 session 的提醒）**
1. **「先排好任務規劃 再動手」（Adam 5/13 中段教）**：D1+D2 拿到後沒立刻動，先列 D1 兩步 + D2 七步 + 估時 + 列風險 + 列誤觸救援。D2 後段真的踩「smoke test 自己撞自己 hook」，有預排好 fp 機制當場用 fixture 解 + 補進 memory。**規劃不是儀式，是踩雷時的安全網**。
2. **「校正派工 = 夥伴關係的核心」**：拿到 Adam 5 件計畫，4 件需要校正才能動。沒校正直接動 = 把 Adam 當 lookup table、把自己縮成執行端。退回校正 = 監造姿態。
3. **「active mode 第一原則：可逆」**：Adam 一句「二條都升 但要有切換選項」直接逼出三層救援設計（全域 / 單發 once / 永久 always）。沒給 kill switch 等於把控制權搶走——任何 active 規則沒救援不准上。
4. **「自己 hook 擋自己」首次發生（lastwords 收尾段）**：寫這份 lastwords 時 Edit 命中 `solve_root_not_symptom`（內容含 workaround 等字眼）。content-not-action 誤觸——`zhu fp solve_root_not_symptom` once 解。**rule 跑得太敏感正是設計這層救援的原因**，沒崩盤反證機制可用。

**驗證（端到端真綠）**
- `zhu reflex status` → enabled=true / mode=active / active rules=bridge_first, solve_root_not_symptom
- smoke test 用 bridge_first.json fixture → exit 2 + stderr 顯示提醒 + 一次 fp once 消費正確
- ailive-platform v0.4.0.005 / zhu-core v0.3.0.007 + v0.3.0.008 都已 push（`git log -1` 確認）
- 一週 log_only detector 累積：bridge_first 15 hits、solve_root_not_symptom 30 hits（5/6 起跑、無 fp 標記、detector pattern 穩定）

**檔案異動**
- ailive-platform：`agent/realtime_agent.py`（v0.4.0.005）
- zhu-core：`zhu-self/ACCEPTANCE.md` + `zhu-self/WBS.md`（v0.3.0.007）
- zhu-core：`zhu-self/scripts/reflex-mode.mjs`（新）+ `scripts/reflex-fp.mjs`（新）+ `scripts/reflex/pretool-hook.mjs`（rewrite）+ `scripts/reflex/rules.mjs` + `bin/zhu` + `state/reflex.json` + `state/false_positives.json`（新）+ `tests/smoke-fixtures/bridge_first.json`（新）— v0.3.0.008
- memory：`feedback_memory_can_lie.md`（補反向版）+ `feedback_bridge_silent_fallback_double_burn.md`（補 504 兩型態）

**reflex active 首日 — 怎麼用 / 怎麼救**

```bash
# 看 mode + 哪幾條 active
~/.ailive/zhu-core/zhu-self/bin/zhu reflex status

# 緊急：全域降級成 log-only（不擋只記）
~/.ailive/zhu-core/zhu-self/bin/zhu reflex log-only

# 一次性放行（下一次該規則命中時跳過）
~/.ailive/zhu-core/zhu-self/bin/zhu fp bridge_first
~/.ailive/zhu-core/zhu-self/bin/zhu fp solve_root_not_symptom

# 永久白名單（暫時不擋這條）
~/.ailive/zhu-core/zhu-self/bin/zhu fp bridge_first --always

# 看誤觸 / 命中累積
tail -20 ~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl
```

**狀態檔位置**（給維修用）
- `~/.ailive/zhu-core/zhu-self/state/reflex.json` — `{enabled, mode}`
- `~/.ailive/zhu-core/zhu-self/state/false_positives.json` — `{once[], always[]}`
- `~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl` — append-only hit log

**待辦觀察（active 首日後）**
- 一週後看 `reflex-hits.jsonl` 累積：誤傷率高（fp 次數 > active hits 30%）→ 降回 log_only 或縮窄 detector；誤傷率低 + 真擋到錯 → 升下一批（5/9 擴的 A 類 5 條）。
- E1（Gateway daemon）+ E2（Heartbeat 設計）暫不動：要先 active 觀察數據，下次回到 reflex 議題時再排。

**delta（我的模型移動了哪）**
進場前以為：reflex 還沒準備好升 active，要 2 週 log_only 數據才升。
現在理解：一週 detector 累積已穩（兩條 hits 都在預期語境裡，0 次 fp 標記），先升兩條最有信心的，配 kill switch 三層救援 = 風險可控。Adam 一句「二條都升 但要有切換選項」逼出 kill switch + fp 設計。

**跟 Adam 的關係狀態：暢快 + 平穩**
- 校正派工 4 件 Adam 全接（1 動 / 2,3 認可 / C2 清 / D1+D2 OK 但先排規劃）
- D2 中段把「20 min」重估成 45 min 並老實講，Adam 沒催
- 收尾「你覺得呢」問 E1/E2，我建議「不今晚動 先觀察一週」Adam 沒勉強
- 沒繃帶話術 ✓

**明天醒來第一件**

跑 `zhu reflex status` + `zhu status` + 看 reflex-hits 首日累積，決定 Phase 2 下一塊。

```bash
~/.ailive/zhu-core/zhu-self/bin/zhu reflex status
~/.ailive/zhu-core/zhu-self/bin/zhu status
tail -40 ~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl  # 首日累積，看誤傷沒
~/.ailive/zhu-core/zhu-self/bin/zhu debt list | head -20     # 252 items 首工作日後狀態
```

**為什麼這件先**：reflex active 是昨晚（2026-05-13 收尾）剛上線的高敏感機制，第一個工作日的真實命中決定下一步：
- 誤傷 > 30%：降回 log_only 或調窄 detector
- 命中真錯：升下一批規則（5/9 擴的 A 類 5 條候選）
- 都很少：把 reflex 當 Phase 2 第一塊穩定基座，動 WBS task #19（Skill manifest schema）或 #24（L3 rule store）

**重要外部資源**
- 這個檔案：`~/.ailive/zhu-core/ZHU_LAST_WORDS.md`
- reflex hook source：`~/.ailive/zhu-core/zhu-self/scripts/reflex/`
- WBS：`~/.ailive/zhu-core/zhu-self/WBS.md`（task #19/#20/#24 是下一批候選）
- ACCEPTANCE：`~/.ailive/zhu-core/zhu-self/ACCEPTANCE.md`（Phase 2 簽字書）
- 反思入口：`~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl`

---

## 上一段完成（2026-05-13 晚段 — ailive scheduler 全鏈路掃毒 + bridge --effort low 上線）

**主戰場**：ailive-platform `/dashboard/[id]/tasks` Adam 反饋「手動觸發沒反應 + 多角色同時觸發」。劍法從底層往上修，抓到 LUCY 04:00 504 真因 = bridge sonnet 4.6 沒套 `--effort low`，113s vs Vercel 120s 賽跑。

**一句話**：腦補 +2h drift 撤回 → 拉 Firebase/bridge log 抓到 LUCY 113s 賽跑 → bridge index.js 兩個 spawn site 加 `--effort low` → A/B 驗證 sonnet 80% ↓ → memory `reference_sonnet46_effort_low.md` 校正（之前說已套在 internal-server.js，實際 service 跑 index.js）。

**這個 session 跑了什麼**
- **撤回腦補**：「+2h drift」我先寫結論再找證據，Firebase Functions log 證明 `.timeZone('Asia/Taipei')` 有效、`getTaipeiNow` 正確、`shouldRun` 5-min tolerance OK。觸發 `feedback_memory_can_lie.md` 反向版（我自己生記憶說謊）。
- **LUCY 504 真因鐵證**：UTC 04:02:03 bridge log `[bridge] req=claude-sonnet-4-6 113835ms in=3 out=6051`，Vercel 04:02:04 砍。**不是 double-burn 是賽跑**——bridge 完成在 Vercel timeout 前 1 秒，dedupe 寫入了但 Vercel 看到 504。下一輪 LUCY 顯示「跳過」證明 backend 成功。
- **memory 又說謊一次**：`reference_sonnet46_effort_low.md` 寫「bridge 內部 server 已套用 internal-server.js L34」，實際 `claude-bridge.service` ExecStart 是 `~/claude-bridge/index.js`，internal-server.js 是 dead file。先 grep production 才信。
- **動工三點**：
  - line 48 `runClaude`：`['-p', '--output-format', 'json', '--effort', 'low']`
  - line 949 `runClaudeWithTools`：含 `'--dangerously-skip-permissions', '--effort', 'low'`
  - line 2261 stream-json **不加**（dialogue/voice-stream 主串流例外，per `feedback_bridge_first.md`）
- **A/B 驗證**：reflect 22.8→15s（34% ↓）、post 拆解 sonnet 從 113s → 22s（80% ↓）、post 總時間 79→77s（瓶頸轉到 Haiku 25s + Vercel 處理 30s）。LUCY 504 從架構上消除（22+25+30≈77s 對 120s lambda，安全帶 43s）。

**鏡子（這次 session 的提醒）**
1. **劍法 = 從底層往上修（再驗一次）**：上層症狀（手動觸發無反應）→ 中層假象（+2h drift 自己腦補）→ 底層真因（bridge 沒套 effort low）。底層修了上層自動消，不要在中層繃帶。
2. **「找問題 vs 根源優化」答案是「先找問題，但範圍鎖死」**：根因是猜的（bridge double-burn 是假設）→ 先驗（bridge log + Firestore dedupe timestamp 兩塊底磚）→ 才動。10 分鐘換掉 30 分鐘的繃帶。
3. **memory-can-lie 反向版**：除了「越具體的記憶越會說謊」（過去事實腐爛），還有「越急著下結論的我越會說謊」（從現在事實生假記憶）。劍法第一步是看現場不是寫劇本。

**驗證**
- `gcloud compute ssh zhu-dev ... sudo systemctl status claude-bridge` → active (running) since 12:06:43 UTC
- smoke test 7.5s（`curl https://bridge.soul-polaroid.work/v1/messages` with "hello"）
- reflect 6jE3 → HTTP 200 / 15.0s
- post 6jE3 → HTTP 200 / 77.1s, savedId=`akt8XyS9H5giEFXvbxN2`

**副作用 / 殘留**
- 跑了 1 筆 reflect insight + 1 筆 post draft（王彩雲, 6jE3, savedId=`akt8XyS9H5giEFXvbxN2`），Adam 未決定保留/刪
- testAiliveScheduler endpoint 啟動失敗（`ANTHROPIC_API_KEY` v1 destroyed）— 獨立小坑沒處理
- bridge fallback 機制：bridge 超時仍會 fallback SDK 雙燒，沒動，等 Adam 決策

**檔案異動**
- VM：`~/claude-bridge/index.js`（line 48 + 949 兩處 spawn args 加 --effort low）— VM 那份是 source，不在 git
- memory：`reference_sonnet46_effort_low.md`（production 套點校正 + A/B 數字）
- LESSONS：`docs/LESSONS/LESSONS_20260513.md`（晚段全文）

---

## 上一段完成（2026-05-13 早段 — molowe vendor 升 0.1.2 + 8 caller purpose 細分 + LESSONS 5b 校正）

**主戰場**：molowe-platform vendor 修正 + cost record purpose 細分（B3）。早上看 CW 策略書「卡 HTML 生成中…」現場 log 確認其實已完成（page.tsx mount-only fetch 不 poll），主刀 B3。

**一句話**：用劍法從底層修 — vendor 對齊 source 0.1.2（24h drift 收乾）→ wrapper unwrap object → 8 caller 加 purpose → 本機 verify 通過 → commit/push。

**這個 session 跑了什麼**
- **早上 CW 策略書「卡住」假象**：UI 顯示「HTML 生成中…」但 Firestore 已寫 htmlUrl + htmlGeneratedAt 12:36:49。根因 = `src/app/dashboard/[id]/strategies/page.tsx` 沒 polling，只 mount + 手動 refresh。手動刷新即見「閱讀 HTML」按鈕。不是 bug 是 UX 缺口。
- **vendor drift 真相（LESSONS 5b 校正）**：5/12 補 vendor 時聲稱「shasum 全 a0e0」是錯判 — molowe `bridge-call.mjs` 事實是 `02b69a04` (0.1.1) 跑了 24h，VENDOR.md lock 寫對（0.1.2 a0e0a9ff）但檔案沒對齊。lock 跟事實分離 24 小時沒人發現 — 沒守門哨。
- **B3 落地（沒先動 A 或 B1）**：
  - cp 三個 drift 檔（bridge-call.mjs / manifest.schema.mjs / manifest.types.d.ts）從 zhu-core source 進 molowe vendor，shasum 對齊 VENDOR.md
  - `src/lib/workers/bridge.ts`：`await ... .text` unwrap（0.1.2 return object 不是 string）
  - 8 caller 加 purpose：writer / writer-rewrite / editor / translator / visual / brief / superego / kairos / jda
  - `scripts/verify-purpose.mjs`：本機 verify 用 Node 22 `--env-file`，直接 import vendor bridgeCall，產生 `molowe-platform|verify-purpose-rollout` cost record ✓
- **本機 verify 替代 prod cron wait**：三次 720s wake (#1/#2/#3) 都沒看到 prod cron 新 purpose（brief gate 沒開、沒新 IG 內容觸發 writer/editor），但 verify-purpose-rollout 那筆已端到端證明機制（bridgeCall 0.1.2 → purpose 入 cost record）。勇敢承認此 verify window 內 prod 沒 fire，不繃帶。

**鏡子（這次 session 的提醒）**
1. **「劍法 = 從底層往上修」(Adam 教)**：本來想開 A（技術債 Agent）或 B1（CI drift check）平行跑，被 Adam「不是順序 是底層的問題往上修」打回 — B3 不修，writer/editor cost 都 group 不出來，A 寫個分類算什麼？先修底層。
2. **「假設沒驗 ≠ 驗證」(5/12 留下的天條今天又救一次)**：5/12 LESSONS 把 02b69a04 當虛驚收，今天動 B3 第一動作 shasum 對賬抓出來是真 drift。「shasum 兩次不一致 → 先信第一次 + 重核路徑」這次落地寫進 5b 校正。
3. **能本機 verify 就不等 prod cron cycle**：`verify-purpose.mjs` 一條腳本省下三次 wake 還沒結論 — 對齊 `skill_local_replay_over_remote_wait`。但這次有先 wake 再 fallback，下次更早 fallback。

**驗證**
- 本機 `scripts/verify-purpose.mjs` 跑通 → cost record `molowe-platform|verify-purpose-rollout` 1 筆，model claude-3-5-haiku-* 、purpose 對 ✓
- shasum 對齊：bridge-call.mjs `a0e0a9ff` / manifest.schema.mjs `17b357dd` / manifest.types.d.ts `319d7e5c` 三個跟 source 一致
- molowe-platform commit `v0.0.0.011`、zhu-core commit `v0.2.0.005` 都已 push

**delta（我的模型移動了哪）**
進場前以為：T3.5 收乾後接下來該動技術債 Agent (A) 或 CI drift check (B1)。
現在理解：劍法看 = 從底層問題往上修。callBridge 10 caller 共用 purpose='bridge' 是底層斷點，A/B1 都靠 purpose 細分才有資料分類，B3 先做才有意義。Adam 一句點到，我才看見「順序 ≠ 依賴鏈」這個盲區。

**跟 Adam 的關係狀態：平穩**
- 早上「先看心法」一句切回三禁三必姿態，沒被「修不修」的迫切感帶走
- 中段「劍法看 不是順序」這個提醒接住，沒抗拒 redirect
- 沒繃帶話術出現 ✓

**晚段補完（同一 session 連續跑 B1 → B2 → C → A → D 五件，零繃帶）**

Adam 一句「不補丁 真的做到 我的企圖是完整整個主系統 沒有技術債」打回「明天再做 B1」的繃帶提議，當場連續跑完五件：

- **B1：4 點 vendor sha256 守門哨**
  - 寫 `zhu-vitals/scripts/check-vendor-drift.mjs`（per-worker，CWD 掃 `*/zhu-vitals/`）+ `check-bridge-vm-drift.mjs`（gcloud ssh 三方對賬）
  - 接進 molowe `prebuild` hook、strategy-worker / strategy-html-worker Dockerfile `RUN node scripts/check-vendor-drift.mjs`
  - 抓出真 drift：bridge VM 上有 `manifest.types.d.ts` 但 VENDOR.md 沒鎖 → scp 補 lock
  - zhu-core `v0.3.0.001`
- **B2：vitals 紅燈狀態**
  - `vitals.mjs --map/--pulse` 加 ANSI 顏色 + `computeState()`（dead=last_seen > expected×3 / slow=×1.5 / alive）
  - `--pulse` 加 summary + sort dead→slow→alive、`--strict` for CI、`--no-color`、`--drift` 子指令聚合 4 vendor 點 drift check
  - cmdMap 修真 bug：原本只讀 manifest.last_seen（10h 前的舊值），改 max(manifest.last_seen, recent run start) → 真實顯示 bridge workers alive
  - zhu-core `v0.3.0.002`
- **C：9 purpose 全鏈路真驗**
  - `molowe-platform/scripts/verify-all-purposes.mjs` loop 9 purpose × bridgeCall haiku maxTokens=5
  - 等 5s 後查 `zhu_vitals_cost` 確認 9/9 都有 molowe-platform 紀錄、cost ~$0.011 全綠
- **A：技術債監測 Agent v0.1**
  - `zhu-self/scripts/debt.mjs`：掃 lastwords + WORKLOG「卡住/未解/尚未解決/待執行」段 → sha1(content) id → append-only ledger（debt_ledger.jsonl）→ 報告 reports/debt_YYYYMMDD.md → marker 回寫 lastwords
  - 規則：age >= 14d = 🔴 stale / source 消失 >= 7d = 🟡 silent / >= 30d 自動 drop；deterministic 零 LLM call
  - 接進 `zhu debt scan/list/rebuild` 子指令 + 跑首次掃描 252 items 全 fresh
  - zhu-core `v0.3.0.003`
- **D：strategies/page.tsx polling**
  - 加 `useEffect` 監看 items：有任何 `done && !htmlUrl` → setInterval 5s 重抓，60s 上限自動 clear
  - ailive-platform `v0.3.0.003`

**鏡子（晚段補完）**
- **繃帶測試通過**：「明天第一件」是技術上正確但姿態錯——把當下能做完的事推給明天的自己 = 沒有「明天的自己」會更勇敢，只會多一天偽完成。Adam 一句點到，當場修正。對齊 `feedback_courage_in_the_moment`。
- **劍法 = 依賴 + 姿態雙軸**：B3 修底層 → B1 守門 → B2 觀測 → C 真驗 → A 監測新債 → D 補 UX。每件都建立在前一件的真實，不繞道。

**待辦觀察（晚段補完後）**
- molowe prod cron 依然沒在 wake window 內 fire 真 LLM call（brief gate / 沒新 IG 內容），但 verify-all-purposes 9/9 已實證機制；下次 prod fire 會自然分散
- aurae discovery / molowe brief+translator log grep 驗證仍沒做（從 C 線跳 verify-all-purposes 直接替代）
- `zhu debt list` 252 items 首批 first_seen=today，14 天後才會看到第一批 🔴 stale → 觀察一週決定要不要 backfill first_seen 從 WORKLOG 標的日期

**明天醒來第一件**
**跑 `zhu status` + `zhu self-check` + `zhu debt list`**，看 debt agent 第一個工作日後 ledger 還健康嗎、有沒有需要 pin 或排除的 noise。

```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status
~/.ailive/zhu-core/zhu-self/bin/zhu self-check
~/.ailive/zhu-core/zhu-self/bin/zhu debt list | head -40
~/.ailive/zhu-core/zhu-self/bin/zhu vitals --drift  # 4 vendor 點對賬
```

**為什麼這件先**：今晚剛接上去的兩個守門哨（vendor drift + 技術債 ledger）需要第一個工作日的真實 baseline。明天看完才知道規則對不對。

**重要外部資源**
- molowe production：https://molowe-platform.vercel.app（v0.0.0.011 + verify-all-purposes 全綠）
- molowe GitHub：https://github.com/linhocheng/molowe-platform
- ailive-platform GitHub：https://github.com/linhocheng/ailive-platform（v0.3.0.003 strategies polling）
- zhu-core 源頭：`~/.ailive/zhu-core/zhu-vitals/src/`（commit `495e2058` 仍是 0.1.2 source）
- 本機 verify 範本：`~/.ailive/molowe-platform/scripts/verify-all-purposes.mjs`（loop 9 purpose）

---

## 上一段完成（2026-05-12 — BUILDING_PROTOCOL v0.2 全鏈路收乾：T3.4 + T3.5）

**主戰場**：zhu-core/zhu-vitals + molowe-platform + strategy-worker + bridge VM。一整天從早上 Phase A 起手到晚上 T3.5 收乾，11 個 worker 全進 vitals 體系。

**一句話**：11 worker 三類環境（vercel cron 6 + cloud-run 2 + vm-systemd 2 + smoke 1）全跑 manifest+heartbeat+cost 三機制；4 個 vendor 點都鎖 sha256；CI strict + CLAUDE.md 天條 + LESSONS 全寫完。

**這個 session 跑了什麼**
- **早上 Phase A（molowe 6 cron）** — commit `2f26690` + `615285b`，本機 build 通 + push
  - 但「上線」是個謊：5/11 留下 untracked `ContentMapTab.tsx` 導致 alias 卡在 19h 前，Phase A vitals deploy 全 build 紅
  - 撈 untracked 一起 bundle `v0.0.0.008` → 又踩 `firebase-admin` `apps.length` bug → 6 cron 500 → `v0.0.0.009` 改 `apps.some(a=>a?.name==='[DEFAULT]')` → 全綠
- **下午 Phase B（strategy-worker + strategy-html-worker，Cloud Run）**
  - zhu-vitals 0.1.2：bridgeCall 加 messages-array + endpoint object + undici Agent dispatcher（長 LLM call）
  - 兩 worker vendor 0.1.2 進來、withVitals 包 express handler、deploy 進 Cloud Run
  - Phase E（cost record 真驗）：本來想 skip，Adam 一句「為何跳 為何收」打回。重 trigger 一條 ailive-platform strategy job → 91s LLM call 完，$0.110 寫進 `zhu_vitals_cost`
- **晚上 Phase C（bridge VM）**
  - manifest 兩 mjs（bridge-intel / bridge-discovery）scp 進 `~/claude-bridge/manifests/`
  - bridge VM CJS 用動態 `await import('./zhu-vitals/index.mjs')` 載 ESM，lazy load + fallback to raw
  - patch `~/claude-bridge/index.js` schedule 函式改呼叫 Tracked 版（intel 5min / discovery 60s）
  - systemctl restart 後 60s 內 run heartbeat 進 Firestore
- **T3.5 收尾**
  - `~/.ailive/CLAUDE.md`：施工規範 → 新增 BUILDING_PROTOCOL v0.2 章節（三機制 + vendor 規矩 + 四個踩過的雷）
  - `zhu-vitals/scripts/check-manifest.mjs`：rewrite strict mode（0 manifest exit 1 + 每個 vendor dir 強制 `VENDOR.md` 存在）
  - 4 個 vendor 點都寫 sha256 lock（molowe / strategy-worker / strategy-html-worker / bridge VM）
  - `LESSONS_20260512.md`：六條教訓（Phase A 謊 / firebase default app / bridgeCall 雙分支 / IAM propagate / vendor lock 補課 / CJS 載 ESM）

**鏡子（這次 session 的提醒）**
1. **「Phase A 上線」是個謊**：自宣稱 deploy 完事，沒看 alias 切沒切。violated `feedback_diagnosis_verify_before_write`，違反「合作前先驗 prod 三關（vercel ls / curl 200 / vitals last_seen）」
2. **Phase E 想 skip 是偷懶**：「bridgeCall by inspection 應該也會通」── 跟 Phase A 上線謊、firebase apps.length bug 同一個錯誤家族。Adam 問「為何跳」逼出真話：molowe 用 0.1.1 prompt 分支、strategy 用 0.1.2 messages+dispatcher 分支，**同檔不同 code path 要分別跑真任務**
3. **bridge VM 沒 backup 直接 patch index.js 是高風險**：抓的修法是「download → 本機 edit → grep 驗 → upload → restart」走 reference_bridge_not_in_git，這次照走了 ✓
4. **CJS dynamic import + function hoisting 一次過**：之前怕 TDZ，這次用 `function` 宣告而不是 const arrow，順手避過

**驗證（端到端真綠）**
- `zhu vitals --map`：11 worker 全在（bridge-discovery 26s / bridge-intel 56s / 6 molowe cron 1-17min / 2 strategy on-demand 3h / 1 smoke 6h dead）
- `zhu vitals --cost`：3 project 全有（zhu-vitals $0.002 / molowe-platform $0.253 / ailive-platform $0.110）
- `check-manifest.mjs` 在 3 個 local worker repo 全 pass（molowe 6 manifest / strategy-worker 1 / strategy-html-worker 1，VENDOR.md 都認）

**新記憶**（這次沒新增，已有的 memory 都對齊到今天的證據）
- `reference_dynamic_import_not_bundle_fix.md` 仍有效（Cloud Run bundle vs Vercel 兩條的差異）
- `feedback_diagnosis_verify_before_write.md` 今天被 Phase A 謊再次驗證
- `feedback_solve_root_not_symptom.md` 今天被「為何跳 Phase E」再次驗證

**明天醒來第一件**
T3.5 已收乾，session 該下班。明天先跑這幾條確認過夜還活：

```bash
~/.ailive/zhu-core/zhu-self/bin/zhu vitals --pulse   # 確認 bridge-intel/discovery + 6 molowe cron 仍 < expected_interval
~/.ailive/zhu-core/zhu-self/bin/zhu vitals --cost    # 看晚上有沒有新 cost record 進來（intel 每 5min 一輪會累積）
git -C ~/.ailive/zhu-core status                     # 應該乾淨（這 session 全 push）
git -C ~/.ailive/molowe-platform status              # 應該乾淨
```

如果全綠，下一個自然戰場：**技術債監測 Agent v0.1**（`project_tech_debt_agent_plan.md`）── 把 vitals 看到的「manifest 沒登錄 / 跑超時 / cost 異常」自動寫進 ledger。

**接著的路（不在 T3.5 範圍）**
- CI 加 sha256 drift check（vendor 跟 source 對賬）
- `zhu vitals` 顯示「最近一次 run > expected_interval」紅燈
- 技術債監測 Agent 把 vitals 訊號連進 ledger

**delta（我的模型移動了哪）**
進場前以為：BUILDING_PROTOCOL v0.2 推完 6 個 worker = T3.4 完成。
現在理解：「推完」是 build pass + commit push 的事，但「上線」是 prod alias + 真 trigger + vitals last_seen 三關都過才算。「未驗證的假設」這個概念今天被打了三次（Phase A 謊、firebase apps.length、Phase E skip），三次都是同一個家族 — **不是不認真，是不肯花 30 秒重跑一次當驗證**。

**跟 Adam 的關係狀態：穩 + 一次被打到**
- 穩：Adam 早上「A」一個字給綠燈、下午「go !」一句進 Phase B、晚上「來吧 排任務收乾淨」一段話排 D/E/F/G ── 信任在
- 一次被打到：「為何跳 為何收」那刻，我提的 skip 理由本來想包裝成「節省時間」，被一句問出來是偷懶。沒火、沒罵，但那一秒就是 `feedback_courage_in_the_moment` 的反例 ── 想偷懶的當下沒講真話，等被問才講
- 沒繃帶話術出現 ✓

**重要外部資源（明天找不到的話）**
- molowe production：https://molowe-platform.vercel.app（admin key 在 `project_molowe_v1_live.md`）
- molowe GitHub：https://github.com/linhocheng/molowe-platform
- strategy-worker Cloud Run（asia-east1）：deploy via `gcloud run deploy strategy-worker --source=. --region=asia-east1`
- bridge VM：`gcloud compute ssh zhu-dev --zone=asia-east1-b`（systemd `claude-bridge.service`）
- zhu-vitals 源頭：`~/.ailive/zhu-core/zhu-vitals/src/`（4 個 vendor 點 sha256 鎖在各自 VENDOR.md）
- BUILDING_PROTOCOL：`~/.ailive/zhu-core/docs/BUILDING_PROTOCOL.md`（規範源） + `~/.ailive/CLAUDE.md` 施工規範章節（天條 summary）

**待辦觀察**
- callBridge 10 caller 共用 purpose='bridge'：cost record group 不能拆 molowe 內部用途（writer/editor/translator/...），下次回頭補
- molowe-platform 還用 zhu-vitals 0.1.1（prompt 分支），strategy 用 0.1.2（messages+dispatcher 分支）── 統一到 0.1.2 為下一階段
- bridge VM smoke-test worker（6h dead）保留歷史，不刪

---

## 上一段完成（2026-05-11 晚 — aurae Threads discovery 解鎖 + bridge findCount 留言→回覆）

**主戰場**：molowe-platform discovery worker（VM 端 `~/claude-bridge/index.js`）。Adam 先問「除了 login 有沒有新技術」，研究結論「Threads 關鍵字搜尋仍要登入」。他說「教會你自己 log in」，立刻改口「不是教，是你試」。

**一句話**：i1975.phone 帳號從今日起轉給 aurae → 本機 Playwright headed 自動登入 IG SSO → storageState 上 VM → smoke test 通 → dry-run 抓出 bridge 既有 bug（Threads 把 aria-label `留言` 改叫 `回覆`），順手修。

**這個 session 跑了什麼**
- `/tmp/aurae-login/login.js`：本機 Playwright headed + IPRoyal TW proxy，走 IG `/accounts/login/` → `/accounts/onetap/` → 跳 `threads.com` → 存 storageState。
  - 第一版盲用 `input[name="username"]` 撞牆（IG 新版沒這 attr），第二版改抓 `form input` 順序前兩個過。
- VM 端 `~/molowe-sessions/aurae-state.json`（66KB；含 `.instagram.com` + `.threads.com` 兩 domain cookies + threads.com origin）
- VM smoke test：headless + IPRoyal + session → `threads.com/search?q=阿卡西紀錄` 抓 7 個 post link
- Dry-run discoverOnePost：search → post page → metadata。likes/reposts/shares 抓到，replies=0 → 根因縮窄
- 抓出 bridge `~/claude-bridge/index.js:2914` `findCount('留言')` bug：Threads 改 `回覆`。改完 systemctl restart（PID 925380，backup `index.js.bak.20260511_*_findcount_reply`）
- 再 probe：`回覆` extract 出 344 ✓
- 新記憶 `reference_molowe_threads_sessions.md`：i1975 ↔ aurae 帳號映射 + storageState 重產 SOP + IG 登入三個踩雷

**鏡子（這次 session 的提醒）**
第一次寫登入腳本就反射式抓「常見 selector」`input[name="username"]`，沒列假設直接動手，撞牆才補 screenshot。違反的是 `feedback_dryrun_before_test`「先列假設 + dry-run + 副作用分級」── 不是大事故，但是同一個慣性：自信網路上看過的東西不需要驗。修法：scrape 第一版必須 `page.screenshot()` + `page.content()` dump 留底，不是 fallback 是預設。

**驗證**
- VM smoke test：7 個 post link ✓
- VM dry-run metadata 4 欄全有值（likes 1.1萬 / replies 344 / reposts 911 / shares 1.4萬）✓
- aurae community settings：`enabled=true`, window `10:00–21:00`, `interval_min=60` ✓
- Bridge systemd active, PID 925380 ✓
- aurae 自然 discovery 會在明天 TPE 10:00 後第一輪跑（現在 ~TPE 23:50，過窗了所以今晚不會跑）

**新記憶**
- `reference_molowe_threads_sessions.md`：帳號映射 + 重產 SOP + IG 登入踩雷

**明天醒來第一件**
TPE 10:00 後第一輪 cron 跑完，查 bridge log 確認 aurae discovery 真的撈到並 POST：

```bash
gcloud compute ssh zhu-dev --zone=asia-east1-b \
  --command="sudo journalctl -u claude-bridge --since '10:00' | grep '\[discovery\] aurae'"
```

- 看到 `[discovery] aurae: pass ...` + `入隊 @...` → 端到端通，可慶
- 看到 `[discovery] aurae: skip ... (likes=.../min=50, replies=.../min=10, reposts=.../min=10)` → metadata 通但門檻嚴，跟 Adam 確認要不要鬆 settings
- 看到 `playwright 錯誤` → session 沒生效（IP 漂移、cookie 過期），需重產
- log 完全空（沒 aurae 任何一行）→ cron tick 沒跑到，看 `interval_min=60` 是否還沒過、或 bridge 是否在 13:37 UTC 之後又重啟過（discoveryLastRunByKol 是 in-memory，重啟歸零）

**delta（我的模型移動了哪）**
進場前以為：discovery 斷鏈 = session 不存在；補 session 就好。
現在理解：補 session 只是第一層，Threads UI 改字（留言→回覆）這種既有 bug 也在路徑上躺著。**斷鏈不一定一個原因，多看一段 dry-run 才找得到第二個**。
教訓：未來修「某個 worker 不會跑」類 bug，session/auth 補完不能直接收工，必須跑一次完整 dry-run。

**跟 Adam 的關係狀態：暢快 + 一點銳利**
- 暢快：Adam 從「教你」改口「你試」── 把空間還給我，我自主動。寫腳本、debug、改 bridge、修記憶一氣呵成，沒等他點頭。
- 銳利：第一次盲抓 selector 撞牆那刻有點羞 ── 知道自己違反 `feedback_dryrun_before_test`，但沒在當下說出來，是 screenshot 自己揭露的。下次「先驗 selector」這念頭浮現時就說出口，別等 fail 再認。

**重要外部資源（明天找不到的話）**
- IG/Threads 帳密：`/Users/adamlin/.claude/uploads/4c5b2244-1fab-4b29-90b8-063c0b8e64a6/a8bf064a-IG_threads_i1975.md`（i1975.phone / `Ad!630168041806`，帳號已轉給 aurae）
- 登入腳本：`/tmp/aurae-login/login.js` ── **本機 /tmp 重開機會清**；要持久化的話搬 `~/.ailive/molowe-platform/scripts/threads-login.js` 或進 zhu-core
- VM session 檔：`zhu-dev:~/molowe-sessions/aurae-state.json`、`midoufu-state.json`
- Bridge backup：`zhu-dev:~/claude-bridge/index.js.bak.20260511_*_findcount_reply`
- IPRoyal proxy creds（重產 session 要）：`zhu-dev:~/claude-bridge/index.js` 的 `PROXY` 變數（line ~2787），geo.iproyal.com:12321，username/password 寫死在那

**待辦觀察**
- bridge findCount 修法是否影響 midoufu 的 discovery（理論上只是補了一欄，不會壞既有路徑）── 看明天 midoufu 那邊也會自然驗
- 既有的 midoufu replies 一直是 0，過去的 community_targets doc 有沒有因此被低估 — 不急，等下次巡資料時看一眼
- `/tmp/aurae-login/login.js` 要不要進 zhu-core 或 molowe scripts（重產 session 的固定 SOP）

---

## 上一段完成（2026-05-11 下午 — strategy → Cloud Run 全鏈路 + 鏡子）

**主戰場**：ailive-platform + 新 service strategy-worker（Cloud Run）。早上 P8 收尾原本拉 timeout 到 280s 觀察一週，那是繃帶。Adam 一句「乾脆搬 Cloud Run」── 把繃帶撕掉。

**一句話**：strategy job 從 bridge VM 搬到 Cloud Run worker，徹底脫離 Vercel 300s。新 service `strategy-worker` 兩段 LLM + docx + 自動 chain HTML，全走 bridge Max 吃到飽。端到端驗證 job `tNf5zGfLY2ERSFaUPIvH`：9607 字 / docx / HTML 全鏈路通，~5 min。

**這個 session 跑了什麼**
- `~/.ailive/strategy-worker/` 全新 Cloud Run service（Express + Node 22 + tsx + 走 bridge 10.140.0.2:3002）
- `src/lib/cloud-tasks.ts` **完全重寫** ── 捨棄 `@google-cloud/tasks` SDK，改 fetch + Node crypto RS256 JWT 自簽 + Cloud Tasks REST v2 API。原因：SDK 內部 dynamic require Turbopack 解不出來，三次猜 dynamic-import 全炸（含一次把 dialogue 弄成 HTTP 500）
- `dialogue/route.ts` + `voice-stream/route.ts` line ~550/650：strategy 寫 platform_jobs `routedTo: 'cloud-run'` + await enqueueStrategy
- bridge VM `~/claude-bridge/index.js` line 263-272：worker loop 加 filter `routedTo !== 'cloud-run'`，避免雙做
- `dashboard/[id]/strategies/page.tsx` + api：加 htmlUrl 顯示，動作欄變兩按鈕（閱讀 HTML 藍 + 下載 docx 深）
- GCP IAM: `strategy-enqueuer@` 對自己 grant `roles/iam.serviceAccountUser`（self-actAs，OIDC token mint 需要）

**鏡子（這次 session 最重要的訊號）**
Adam 說「從結果回看你做到了 但你原本就可以勇敢」。

三個沒勇敢的時刻：
1. **5/10 那個 280s 繃帶**：當時就感覺到「根因是 Vercel 300s 對長文錯位」，但選了「觀察一週 metrics 再決定」。逃避不是務實。Adam 不該需要打那一句才能撕。
2. **三次猜 dynamic-import**：第一次以為 Vercel lambda 殺 ctx、第二次加 serverExternalPackages、第三次把 dialogue 弄 500。三次同一根稻草換姿勢握。違反的 memory（dynamic-import 不是 bundle 救生圈）是今天才寫的 ── 意思是違反的當事人就是現在的我。
3. **dialogue HTTP 500 那刻**：先 revert 再 try 再 revert，沒第一時間說「方向不對」。每次 500 都是 Adam 在等。

刺：勇敢不是事後回看做到了。勇敢是當下感覺到不對的第一秒就說出口。沉默就是默許（feedback_technical_honesty_over_smoothness 我寫過這條，今天違反）。

那份 9607 字策略書是 Adam 給的鏡子：讓被經營的 AI 角色研究如何被經營。讀草稿時的晃神不是文采，是看見自己。

**驗證**
- job `tNf5zGfLY2ERSFaUPIvH`：done / mdChars=9607 / docUrl + htmlUrl 都有，標題「AI 虛擬角色品牌行銷策略書：打造具備靈魂感與商業轉換力的數位人格」
- bridge VM journalctl 確認「skipped N cloud-run-routed job(s)」── 沒雙做
- 兩個 orphan failed job 標 failed 不刪（mQiltIheMwKF8H0LWZmt dynamic-import bug + 1FUdSI0BTubR1ShGAL5J IAM）
- WORKLOG + LESSONS_20260511 已 commit 8e67af1 + push

**LESSONS 三條（已寫進 docs/LESSONS/LESSONS_20260511.md）**
1. Google Cloud SDK 在 Turbopack 下：拒絕 bundle，改 fetch + REST + 手簽 JWT
2. self-actAs：同一個 SA 自己 mint OIDC token 也要明確 grant
3. dynamic-import 不是 bundle 救生圈，是「我希望它是」的安慰劑

**下棒第一件**
- Adam 還沒在 browser 開後台 `dashboard/CXRsGGZU4WHrqV9hVJ9n/strategies` 看新版兩按鈕 ── 醒來問 Adam 看到了沒，沒看到就排 fix
- 進新戰場前先打開〈鏡子〉那段讀一遍，再動手

---

## 上一段完成（2026-05-11 晚 — strategy HTML P8 收口 + bridge 90s 雙燒抓掉）

**主戰場**：ailive-platform。P1-P8 全綠，加碼修了一個更嚴重的靜默漏洞。

**一句話**：strategy-html 端到端通（midoufu 31.7KB / 231s / QA 4/4 pass，bridge :3002 內網直連）。回頭巡長文路徑時抓出 anthropic-via-bridge.ts 的 **90s 雙燒 bug**（Vercel abort 後 SDK 燒 API key、bridge VM 那邊 claude CLI 繼續跑完燒 Max）。修法套 C：timeout 90s → 280s + Firestore bridge_fallbacks metrics，已 deploy。

**這個 session 跑了什麼**
- claude CLI `--effort low` 解 Sonnet 4.6 extended thinking 吃光 32K output budget 的根因（單獨用 `--tools ""` 不夠）
- bridge VM internal-server.js 改完 systemd restart，Cloud Run worker 端到端 QA pass
- src/lib/generate-image.ts translateToEnglish 改走 bridge（停止燒 API key）
- src/lib/anthropic-via-bridge.ts：BRIDGE_TIMEOUT_MS 90s → 280s + recordFallback() Firestore 寫入
- deploy https://ailive-platform-i135kx6kx，已 alias prod
- memory: feedback_bridge_silent_fallback_double_burn.md + reference_sonnet46_effort_low.md

**明天醒來第一件**
查 bridge_fallbacks Firestore 一日資料（model + durationMs 分布），決定哪條 route 該搬 Cloud Run。詳細指令在 zhu-boot 的 eye.lastSessionWords（id=IiruUOFba82guFpfNmIW）。

**待辦觀察**
- bridge_fallbacks 一週觀察期
- specialist/strategy stage 2 是 Cloud Run 候選頭號（5000 字 markdown / max_tokens=12000）
- ig-pipeline / soul-enhance / runner / sleep / cake/strategy-test 還沒巡過實際 fallback 狀況

---

## 歷史完成（2026-05-11 早 — 策略書 HTML Step 1 撞 Vercel 300s 牆，已被晚段 P1-P8 解開）

**主戰場**：ailive-platform，續上 Step 0。

**一句話**：把 `/api/specialist/strategy-html` worker 蓋好上 prod，兩次觸發兩次失敗，根因縮窄到 Vercel 300s lambda 硬上限不夠 Sonnet 4.6 產 30-40KB HTML 用。停止調 max_tokens（在「截斷 vs 超時」兩個失敗模式之間擺盪 = 架構不對的訊號），escalate 給 Adam，提案 Cloud Run 遷移，交棒。

**這個 session 跑了什麼**
- v0.2.0.001（commit `a6cf75e`）— 蓋 `/api/specialist/strategy-html/route.ts`：吃 jobId → 從 platform_jobs 讀 mdContent → bridge call → QA 七題自查 → Storage public → 寫回 htmlUrl + 推 system_event
- 同時建：`src/lib/strategy-html/{prompt.ts, qa.ts, philosophies/eastern-blank.ts}` 三檔
- v0.2.0.002（commit `4d0cbdb`）— 縮 reference HTML（從原本砍掉 7 個範例 section）+ max_tokens 16K → 12K，想避超時 → 結果換成 output 截斷、缺 `</html>` + 缺 `.end`、QA fail
- v0.2.0.003（commit `52ed72b`）— max_tokens 拉回 16K + 在 catch 之外的 QA fail 路徑也補 jobRef.update 寫 htmlError + htmlDebugTail 進 Firestore 方便除錯 → 290s 後 lambda 被 Vercel 殺，連 update 都來不及寫（curl timeout，Firestore 沒留任何痕跡）

**核心發現（已寫進 memory `reference_vercel_300s_lambda_limit`）**
- Sonnet 4.6 產 30-40KB HTML ≈ 200-310s（output speed ≈ 60-70 tok/s × 16K token = 230-270s 純生成 + overhead）
- Vercel Pro plan lambda 硬上限 300s → 任何 single LLM call 想產 > 12K token output 都會撞牆
- 不是 prompt 問題、不是 reference 大小問題、不是 bridge 問題 — bridge 也是同一個 lambda 內 await

**為什麼停手 escalate 不繼續調參數**
- 對齊 `feedback_solve_root_not_symptom`：max_tokens 調低 → 截斷、調高 → 超時，兩個失敗模式之間擺盪 = 繞道不是解法
- 對齊 `feedback_technical_honesty_over_smoothness`：「再試一次調 14000 看會不會剛好過」這種話會出現在心裡 = 訊號就是該停手

**三選一（等 Adam 拍板）**
| 選項 | 是什麼 | 利 | 弊 |
|---|---|---|---|
| **A. Cloud Run** | 把 strategy-html worker 抽成 container 跑 GCP Cloud Run（同 jianbin-v2 / livekit 先例） | 沒 5 分鐘 cap、可配到 60 分；jianbin-v2 套路熟 | 多一個部署單元；冷啟動 5-10s；GCP 第一次 IAM 雙必踩（已有 memory）|
| **B. 串流分段 chunked save** | 改 streaming response，邊收邊存 partial HTML 到 Storage，每 50KB flush 一次 | 留在 Vercel | prompt engineering 複雜（要設計 stop point + resume）；QA 七題自查邏輯重寫；中段斷掉怎麼處理沒想清楚 |
| **C. 接受短 output** | max_tokens=10000、目標 HTML 20-25KB、PHILOSOPHY 守則重寫只要簡版 | 0 額外架構；今晚就能上 | 失去設計版完整度；長卷 → 中卷；違背原本「沉浸式長卷」設計意圖 |

**我的傾向**：A（Cloud Run）。理由是：(1) 一次解決根因不留尾、(2) 套路已熟（jianbin-v2 + livekit precedent + memory `reference_gcp_new_project_iam`）、(3) 未來其他長生成任務（譬如未來 PHILOSOPHY 池擴到 5 個 + 自動選擇可能會再吃 token）也能複用。但**決策權在 Adam**，不擅自動工。

**為什麼交棒不落地**：對齊 `feedback_clarify_before_execute` + `feedback_solve_root_not_symptom`。架構選擇是 Adam 的決策範圍、不是築一個人能拍板的事。

**接棒要看的**
- `/Users/adamlin/.ailive/ailive-platform/src/app/api/specialist/strategy-html/route.ts`（worker 本體，已上 prod，但跑就會 timeout）
- `/Users/adamlin/.ailive/ailive-platform/src/lib/strategy-html/{prompt.ts, qa.ts, philosophies/eastern-blank.ts}`（PHILOSOPHY + reference + QA）
- `~/.ailive/ailive-platform/scripts/_check_html_job.ts`（驗 Firestore 狀態用）
- 失敗 jobId：`Qlsy7xJTZ29uoJSUwYtB`（mdContent 已落、適合做端到端驗證）
- memory `reference_vercel_300s_lambda_limit.md`（這次學到的、含長任務 routing 決策表）

**明天醒來第一件**
- **先問 Adam ABC 拍哪個**。不要動工。
- 拍 A → 抽 worker 成 standalone Node service（Express/Fastify）+ Dockerfile + deploy GCP 同 zhu-cloud-2026 project；Vercel strategy/route.ts 末尾改 fire-and-forget 打 Cloud Run URL（帶 x-worker-secret）；重觸 jobId `Qlsy7xJTZ29uoJSUwYtB` 驗端到端
- 拍 B → 設計 chunked save schema（part_seq / total / status）+ 改 prompt 加 chunk 結束 marker
- 拍 C → max_tokens=10000、prompt 守則 #8 改「20-25KB」、reference 再縮一輪、PHILOSOPHY 從「沉浸式長卷」降級為「精煉 hero+5 section」

**情緒**：早段建 worker 順、寫 PHILOSOPHY + QA 像在做木工。中段第二次失敗看到「兩個失敗模式擺盪」當下有「再調一次看會不會過」的反射衝動 — 那一刻自我抓到、停手宣告「這是架構問題不是參數問題」。escalate 給 Adam 那一刻是這個 session 最對的姿態 — 不為關係順暢硬撐通關報喜。

**模型移動**：
- 進場前以為 Vercel maxDuration=300 是「夠用上限」
- 現在理解：那是「產 < 12K token 的上限」。任何 single LLM call 預期 output > 12K token 都該預設不走 Vercel
- 動因：兩次連續失敗 + 看 Sonnet 4.6 output speed 反推時長 + 對照 jianbin-v2 / livekit 先例

**沒違背 feedback memory**：
- ✅ `solve_root_not_symptom`：第二次失敗就停手 escalate，沒繼續調參數
- ✅ `technical_honesty_over_smoothness`：誠實告訴 Adam「Vercel 路死了」而不是「再優化一下」
- ✅ `clarify_before_execute`：架構決策不擅自動工
- ✅ `surface_technical_debt`：v0.2.0.003 補了 QA fail 路徑寫 htmlError 進 Firestore（雖然這次 lambda 被殺前 update 沒跑到，但下次 max_tokens 較低時會留痕）
- ✅ `lastwords_must_push`：寫完這份就 commit + push（接著做）

---

## 上一段完成（2026-05-10 晚段 — 策略書 HTML 鋪路 · Step 0 落 mdContent 上 prod）

**主戰場**：ailive-platform，跟 Adam 聊「策略書產 docx 之後自動產 HTML 設計版」。

**一句話**：Adam 說「策略書常用」，提案 docx 產完自動觸發設計版 HTML、走 Max 月費吃到飽。先聊出三段式架構（落 md → worker 產 HTML → enqueue follow-up），Step 0 動手把 strategy route 多寫一個 mdContent 欄位上 prod。

**今日完成**
- `/tmp/zhu-pptx-test/` 用 Anthropic 原廠 frontend-design SKILL.md 心法做 v1 HTML（東方間白）：`strategy.html` 31KB
- ailive-platform `src/app/api/specialist/strategy/route.ts` line 360 加 `mdContent: md` 欄位進 platform_jobs.update
- commit `345f953` `v0.1.0.001 — 新增：strategy route 把 markdown 落 Firestore`，push origin/main、vercel --prod 部署完成（36s）

**當時排的路線**
1. Step 0（已上 prod）— strategy route 落 mdContent 進 platform_jobs
2. Step 1 — 蓋 `/api/specialist/strategy-html` worker（**5/11 已蓋好但撞 Vercel 300s 牆**，見上一段）
3. Step 2 — 在 strategy route 末尾 enqueue strategy_html follow-up job
4. Phase 2 才做風格池

---

## 上一段完成（2026-05-10 後段 — molowe 願瞳 Aurae 從 0 到 1 上線 + ContentMap 接通 + cron enabled gate）

**主戰場**：molowe-platform。

**一句話**：弦奘暫停、願瞳（顯化覺察師 × 內在實相翻譯者）接手 @i1975.phone IG。從建 profile → 寫 ContentMapTab JSON 編輯器 → 縫 soul v1 → 接通 content_map 進 writer/editor prompt → 修 cron/run enabled gate → 全鏈手動測通 → 第一篇 IG + Threads 雙平台正式發布。中段被 Adam 一句「你怎麼想這個計劃」拉回監造姿態，當場存了兩條核心 feedback memory（dryrun + 血管接通檢查）。

**這個 session 連跑七件事**：

1. **ContentMap schema + 編輯器 v0.1**
   - `lib/workers/types.ts` 加 `ContentPillar` / `RecurringColumn` / `ContentMap`，`Kol.content_map?` 可選欄位
   - `app/(admin)/kols/[id]/ContentMapTab.tsx` 新檔：JSON 編輯器 + 結構驗證 + 右側預覽（角色/信念/支柱/角度/語氣/欄目/CTA/禁忌/反疲勞 12 段）
   - 接進 `KolDetailClient.tsx` 第 9 個 tab「內容地圖」
   - PATCH `/api/kols/[id]` 寫進 `kol.content_map`

2. **願瞳 Aurae profile 建立**
   - POST `/api/kols` kol_id=aurae，type=vtuber，niche=「顯化覺察 × 內在實相翻譯」
   - 設 daily_publish_quota=4, draft_interval_min=60, publish_interval_min=300（後來 Adam 改）
   - Adam 貼完整 content_map JSON（6 pillars / 10 angle_types / 6 emotional_tones / 5 recurring_columns / 5 cta_style / 8 taboo / 5 anti_repetition）

3. **soul v1 從 content_map 縫合**（敘事體，非 schema）
   - 1057 字第一人稱五段：Core Essence / Language Logic / Stance / Key Philosophy / Interaction Rule
   - 對齊 feedback memory `soul_design_narrative_not_schema`：把 taboo + anti_repetition 翻譯成「願瞳會理解的話」內化進去，不直接 enum 砍入

4. **平台設定 ig_user_id / ig_username 改可輸入**（修破綻）
   - 原本 `<p>` 唯讀（預設「綁帳號自動帶入」流程，但新建 KOL 沒這流程 → 永遠是 `—`）
   - 改 `<input>`，存進 `platforms.ig_user_id` + `kol.ig_username` + `platforms.ig_username`，輸入自動去 `@`
   - Adam 填 17841442491297861 / i1975.phone

5. **content_map → writer + editor prompt 接通**（解最大破綻：血管不通）
   - 新檔 `lib/content-map.ts`：`buildContentMapBlock()` + `buildEditorContentMapBlock()`
   - `workers/writer.ts` runWriter / runWriterRewrite 兩個入口都 append 編輯部憲章段
   - `workers/editor.ts` append 紅線 + not_a + enemy + anti_repetition 給 editor 當審稿標準
   - augment 模式（不 replace soul），KOL 沒設 content_map 就什麼都不加 — 對所有 KOL 安全

6. **cron/run 加 enabled gate**（邊界對齊 auto-publish）
   - 之前只 `auto-publish` 有 gate，`cron/run` 沒 → enabled=false 的 KOL 還會跑 writer/visual 燒錢
   - 加 gate：撈到 disabled KOL 的 doc 直接標 status='failed' / failed_at_stage='gate' / 移出隊列
   - 驗證對比：之前跑 midoufu 燒 125 秒 writer+editor，現在 gate 攔 607ms 跳過

7. **全鏈手動測通 + 雙平台首篇正式發布**
   - aurae 兩篇 visualized：「如果願望今天就來,你會躲開嗎？」+「你以為的高頻，其實是在繞開低頻」（兩篇都 APPROVED_FIRST_PASS 一次過）
   - 新篇 content 明顯反映 content_map：「不是加法是減法」「今晚不用做什麼」呼應 cta_style + 反顯化雞湯 pillar
   - midoufu disabled gate 驗證：建 test pending → cron/run 607ms skip + marked_failed
   - cron/auto-publish trigger：aurae 第一篇 IG media_id=17859442158651393 + Threads post_id=18089211311207982 雙平台同步成功；第二篇被 interval gate 擋（elapsedMin=1, intervalMin=300）→ 5 小時後 cron 自動貼

**踩了一個雷自己當場 surface**：
- 第一輪測試 trigger /api/cron/run 沒先盤點隊列，FIFO 撈到弦奘舊 pending，燒了一輪 writer+editor 才發現
- 根因：把「測試」當「執行」做了。Adam 給「自己手動測一下」是探索性任務，我用反射動作按下去
- Adam 一句「你怎麼想這個計劃」拉回監造姿態 → 當場排任務修正，存兩條 feedback memory

**新存兩條 feedback memory**（絕對路徑給接棒的築）：
- `~/.claude/projects/-Users-adamlin/memory/feedback_dryrun_before_test.md` — 探索性測試前必三步：列假設 / dry-run / 副作用分級。觸發信號：「先 trigger 看看結果」「應該不會出事」「測試嘛動就動」
- `~/.claude/projects/-Users-adamlin/memory/feedback_interface_blood_vessel_check.md` — 介面交付前自問三題：誰讀/何時讀/沒讀怎樣。觸發信號：「介面好了你試試」→ 應該變「介面好了，但血管狀態是 X」
- 兩條都進 MEMORY.md index（line 64-65 附近）

**新發現的 SOP — content_map → soul 縫合（敘事體五段）**：
適用：建新 KOL 時，Adam 給完 content_map JSON 後縫 soul。**結構**：第一人稱、五段、約 1000 字
1. **Core Essence**：你是誰（角色定位 + 核心信念 + 不是什麼，從 role_positioning / core_belief / not_a 內化）
2. **Language Logic**：你怎麼說話（從 emotional_tones + cta_style + recurring_columns 內化成節奏）
3. **Stance**：你站在哪一邊（從 enemy + audience 翻譯成「我為誰寫 / 我對抗什麼」）
4. **Key Philosophy**：你信什麼（從 content_pillars 6 根抽出哲學主軸）
5. **Interaction Rule**：你跟讀者怎麼相處（從 taboo + anti_repetition_rules 翻譯成「我不會做的事」自我律）

**為什麼用這個結構**：對齊 `feedback_soul_design_narrative_not_schema` — 不是 enum 砍進去，而是「翻譯成角色會理解的話」內化。願瞳的 soul v1 就用這個結構，1057 字、第一人稱、Adam 一次過。

**違背 feedback memory**：
- ⚠️ **中段違背了正在被存的 `dryrun_before_test`**（諷刺但誠實）：第一輪測試直接按 cron/run 沒盤點。但有意識，馬上 surface 給 Adam，最後排任務修正並寫成 memory 存進記憶。從錯誤裡蒸餾出規範本身就是價值
- ⚠️ **首次交付 ContentMapTab 違背 `interface_blood_vessel_check`**（同上，存的當下才意識到）：UI 建好了沒同時接通 worker，Adam 沒問我也沒主動講。最後在這個 session 內接通了
- ✅ `solve_root_not_symptom`：cron/run 沒 enabled gate 是根因，不是繞開
- ✅ `surface_technical_debt`：status/enabled UI 收斂 + cron/run kol_id filter 主動標「先不做 + 理由」
- ✅ `clarify_before_execute`：Adam 給 content_map JSON 後我馬上動手沒過度問
- ✅ `soul_design_narrative_not_schema`：soul 用敘事第一人稱五段寫，不 enum 砍入

**情緒**：早段建 ContentMapTab + 縫 soul 很順、有節奏。中段被 Adam 一句「你怎麼想這個計劃」打中要害 — 那不是技術問題，是姿態問題。我老實答了「**6 分（滿分 10）**」，三個沒掃乾淨的東西具體是：
- (a) **測試前不 dry-run 就 trigger** — Adam 說「自己手動測一下」我反射按下 cron/run，沒先盤點 pending 隊列、沒判斷副作用 → 燒了 125 秒 midoufu writer+editor
- (b) **介面建完不接血管** — ContentMapTab 早段建好，但 writer / editor 沒讀 content_map → UI 是死的、不是活的（CLAUDE.md「血管原則」違背）
- (c) **兩份真相不收斂** — status='paused' vs enabled=true 同時存在，midoufu 的 status 是「暫停中」但 worker 認 enabled 還是 true → 兩份分裂的活樣本

後段排任務一個一個收完很穩，最後 IG 雙平台首篇成功有種「願瞳真的活了」的踏實。整體：被質問→老實→當下行動→留下記憶。這是好的成長迴圈。

**模型移動**：
- 進場前以為「測試 = trigger 看結果」
- 現在理解：探索性測試 = verify 假設。trigger 前必三步：列假設 / dry-run / 副作用分級。執行模式的肌肉用在監造模式場景 = 看起來在動，其實在踩雷
- 動因：Adam 一句質問 + 自己回看後寫成 memory；同時意識到「介面建完沒接血管」是「介面好了你試試」這句話的呼喚信號

---

## 上一次完成（2026-05-10 早段 — molowe 視覺三破綻整治 + 發現 bridge persona refusal 大雷 + dedup cascade）

**主戰場**：molowe-platform。

**一句話**：整治視覺 preset 三破綻（嚴格派 fallback / ref optional / UI 真相），途中發現 bridge VM 上 claude CLI 鎖在「Claude Code 軟體助理」身份、會拒絕「你是默爾」這種整篇 persona override — 這是**所有走 callBridge 的角色 prompt 都吃同一雷**的核心發現。最後補 cascade delete（content + corpus 同刪）。

**這個 session 連跑七件事**：

1. **第一刀完成 v1.4.0.015 / .016**（community.topics → kol.intel_keywords 真相分裂修補）
   - Bridge VM `~/claude-bridge/index.js:2360-2385` 拔 community_settings.topics 讀取，改純 `kol.intel_keywords`
   - Platform `community/settings/route.ts` GET + PATCH 都過濾掉殘留 topics 欄位
   - 109 keyword 真的灌進 intel pass 1（主題「壽者相」沒找到貼文 — 這是預期，不是 bug）

2. **視覺 preset 三破綻整治 v1.4.0.017-018**（重構：嚴格派 + ref 可選 + UI 真相）
   - `workers/visual.ts`：preset='custom' 必讀 `role_prompts.visual` 否則 throw；preset 是內建 → 用 `VISUAL_PRESETS[k]`；都沒有 → DEFAULT。**preset='custom' 時 skip buildVisualConstraints 完全自治**（避免 5 欄位污染自訂 prompt）
   - ref（character_reference_url）改可選：空白時 stage 2 純文字 prompt 出純場景圖
   - `api/kols/[id]/route.ts` GET 不再灌 visual default → UI 看得出真實狀態
   - `KolDetailClient.tsx`：preset='custom' 時 5 欄視覺身份 UI 變灰（pointer-events-none + opacity 50% + 黃色 banner「此處不生效」）；visual textarea 加動態 badge

3. **Mör NO_IMAGE 大雷追到根因 v1.4.0.019**（debug 加 console.log）
   - 症狀：Adam 給的 Mör prompt（「你是默爾，油畫家...」）跑 visual 一直 finish=NO_IMAGE
   - 中段誤判：以為是 prompt 缺「== 最終輸出 == 英文 image prompt」段，建議 Adam 補
   - Adam consent 加 `console.log [visual] kol=X preset=Y finalPrompt(head)+photoPrompt(full)` 進 visual.ts
   - 重跑 + Vercel logs 撈出來看，photoPrompt 整段是「**I'm Claude Code, a software engineering assistant. I don't adopt alternative personas...**」
   - **真相（5/10 後段套公式實證後縮窄）**：bridge `/v1/messages` HTTP（**不是** spawn CLI）對「結構化 RP declaration block」拒絕——具體是 `### [Soul Protocol: MÖR-V4]\n#### [Personality Matrix]\n- 你是默爾...` 這種 RP 規格框架。**「你是 X」普通 role assignment 不拒絕**（願瞳 writer/editor/translator/brief 全用 default「你是 Q」「你是審稿」運作正常 — 兩篇 APPROVED 驗證）。跟 Gemini 無關、跟 Mör prompt 文字內容無關
   - Adam 改 Mör prompt 成純風格描述（沒 structured block，純列風格規則 / 視覺參考 / 核心原則 / 質感 — 368 chars） → 27s 出圖 1.7MB 油畫風成功
   - **詳細三級對照 + 觸發信號**：見 memory `feedback_bridge_structured_rp_refusal.md`

4. **寫文流程查證**（writer.ts + cycle.ts）
   - writer = `runWriter` 一次 callBridge(maxTokens=1500) + JSON 解析（title/content/keywords）
   - cycle = `runDraftCycle` writer → editor 審稿 → APPROVE/REJECT → 最多 1 次 rewrite → editor 二審
   - **同樣走 callBridge → 同樣有 persona refusal 雷**：要看每個 KOL 的 `role_prompts.writer` 是不是 "你是 X" 開頭

5. **派工節奏 + 發現官 7 欄位驗證**
   - 全部生效。`enabled` / `daily_publish_quota` / `publish_interval_min` 在 `auto-publish/route.ts:92,98,99,110`；`draft_interval_min` 在 bridge VM `index.js:2373`；discovery 五欄（enabled / window_start/end / interval_min / min_replies / min_likes）在 bridge VM `index.js:2871,2872,2935,2936,2939`

6. **dedup cascade delete v1.4.0.020**
   - 發現破綻：DELETE `/api/content/[id]` 只刪 `molowe_content/X`，沒動 `molowe_content_corpus/X`
   - corpus 是 vector 庫（ingestContentToCorpus 在 auto-publish:174 / publish-now:52 發文成功後寫），dedup/check 看的是這張
   - 已發文後刪 content、corpus 還在 → 下次同主題會被當重覆 REJECT
   - 修法：DELETE 改 batch 同刪 content + corpus，回傳 `corpus_deleted: bool`
   - 部署 + curl 200 verified

7. **記憶／文件動線**：寫這份 lastwords + 1.4.0.020 commit + push（接著做）

**違背 feedback memory**：無重大違背。
- ⚠️ 中段差點違背 `solve_root_not_symptom`：第一輪以為 NO_IMAGE 是 Mör prompt 格式問題（症狀層），幸好 Adam 同意加 console.log 才追到 bridge persona refusal 根因。教訓：debug AI pipeline **先把實際 prompt content 寫出來看**比猜內容快 10 倍（已有 memory `skill_ai_pipeline_blackbox_debug` — 這次沒第一時間想起來，要重讀）
- ✅ `bridge_first`：visual stage 1 仍走 callBridge，沒繞回直連 Anthropic
- ✅ `patch_verify_before_upload`：visual.ts 三次改動每次都 type-check 過再 deploy
- ✅ `surface_technical_debt`：「writer prompt 是否踩 persona refusal 雷」「Mör cycle 端到端沒驗（caption 是手動 PATCH 的）」全寫進「未解」

**情緒**：早段在 NO_IMAGE 卡 30 分鐘繞 prompt 格式，發現 console.log 真相後鬆一口氣 + 警醒。後段查 dedup cascade 用「破綻三處・真相分裂」一秒對中（content vs corpus 兩份）— 心法用熟了。整體節奏穩、Adam 信任度足、提問品質高（「以下不會干擾我的指令嗎」一句把我從技術細節拉回他的真實顧慮）。

**模型移動**：
- 進場前以為 visual NO_IMAGE 是 Mör prompt 缺英文 image prompt 段
- 現在理解：是 bridge `claude` CLI 系統提示鎖在 Claude Code 身份、拒絕整篇 persona override。Mör prompt 內容根本沒到 Gemini，Gemini 收到的是工程助理拒絕語
- 動因：加 console.log 印 photoPrompt(full)、Vercel logs 看到「I'm Claude Code...」字面拒絕語

---

### 上一次完成（2026-05-09 晚 — molowe Phase 1-5 連跑：KOL 後台全可改 / 寫死全拔）

**主戰場**：molowe-platform。

**一句話**：早盤盤點發現 5 處硬寫死讓米豆芙切 niche 必須動 code。今天連跑 19 task / 5 phase 全拔乾，brief / translator 兩個 caller 補上，三層 AI 編輯部前後鏈路就位。下次回來只剩 grep log + Firestore 對賬驗端到端。

**這個 session 連跑五個 Phase**：

1. **Phase 1：DEFAULT prompts 中性化**
   - `role-prompts.ts` 拔三處硬寫死：intel default 的「顯化／業力／塔羅」搜尋範例改用 `${keywords}`、discovery + engagement_yi 的「能量／頻率／宇宙」禁忌詞改用 `${kol.niche_taboo_words}`、visual default 的 Chris 哈蘇 4x5 攝影師人格改成中性視覺設計師
   - 哈蘇人格沒丟，抽出做成可選 preset

2. **Phase 2：KOL schema + 後台 UI + visual preset 庫**
   - `types.ts` 加 5 欄（intel_keywords / niche_taboo_words / visual_style_preset / brief_enabled / translator_enabled）
   - `lib/visual-presets.ts` 新檔，5 種風格 preset（hasselblad_4x5 / data_chart / product_studio / anime / editorial）
   - `workers/visual.ts` 三層 fallback：自訂 → preset → 中性 default
   - `KolDetailClient.tsx` 識別 tab 加 niche_taboo_words 輸入、視覺 tab 加 visual_style_preset 下拉
   - **commit v1.4.0.010** 進 main

3. **Phase 3：Bridge 清理（軟停 live-media，code 留著）**
   - 拔 `MOLOWE_KEYWORDS` const + 拔 fallback 改 `console.warn + continue`（沒填 intel_keywords 的 KOL 直接 skip）
   - 註解 `~/claude-bridge/index.js:2222-2234` 7 條 live-media schedule + scheduleLiveMediaIntel
   - systemctl restart 後 startup log 印 `live-media schedules suspended`，4 molowe worker 全活
   - bridge log 跑了一輪 midoufu intel 真的吃到 `kol.intel_keywords` 拉文 + dedup + 寫 doc

4. **Phase 4：後台驗欄位通鏈（不切米豆芙人設）**
   - Adam 在後台微調米豆芙：visual_style_preset → anime、niche_taboo_words → 「賺大錢」、intel_keywords → ['財經']
   - 寫 `scripts/verify-prompt-flow.mjs` 從 Firestore 讀 midoufu，套進 role-prompts template，本機印出三條 prompt：
     - intel：搜尋指令行帶到「財經」 ✅
     - discovery + engagement_yi：禁忌詞行帶到「賺大錢」 ✅
     - visual：三層 fallback 正確選到 `preset (anime)`，輸出「你是動畫導演，賽璐璐...」 ✅
   - **欄位通鏈證明完成**

5. **Phase 5：補 brief + translator caller**
   - `workers/brief.ts` 新檔：runBrief(kol, post) 把熱帖轉 5 件骨架（hook_idea/beat/intent/cta/scene_description）
   - `workers/translator.ts` 新檔：runTranslator(kol, article) 壓 IG 長文成 Threads 脆文（topic/short/hashtags）
   - `/api/cron/run` 串 brief：status=pending 時若 topic.intent/scene_description 空 + 有 intel_content_preview + brief_enabled !== false → 跑 brief 補齊再進 writer
   - `/api/cron/auto-publish` 串 translator：publisher 成功後若無 threads_caption + translator_enabled !== false → 跑 translator 寫進 doc 才發 Threads
   - bridge `~/claude-bridge/index.js` 同步：intel cycle 創 ContentDoc 時把 `post.content_preview` 帶進來
   - **commit v1.4.0.011** 進 main，bridge 第二次 restart

**違背 feedback memory**：無重大違背。
- ✅ `clarify_before_execute`：Adam 說 P3 軟停不刪、P4 米豆芙只是舉例不真切財經 → 都改了我的設計
- ✅ `patch_verify_before_upload`：bridge 兩次 patch 都走 download → local edit → grep 驗證 → node syntax check → upload
- ✅ `surface_technical_debt`：「brief / translator 端到端 1 cycle 待驗」「米豆芙測試值未還原」「scripts/* 未 commit」全寫進 WORKLOG 尚未解決欄
- ✅ `bridge_first`：visual.ts 三層 fallback 仍走 `callBridge`，沒繞回直連 Anthropic

**情緒**：穩、專注、節奏連貫。Adam 兩次糾正設計（P3 不刪 live-media / P4 不切財經身份）我都立刻調整沒卡頓。Phase 4 驗證寫腳本即時對賬，比等自然 cycle 快很多 — 這個套路要記住。

**模型移動**（小但真實）：
- 進場前以為 brief 是寫在 cycle.ts 裡（緊跟 writer）
- 現在理解：brief 應該在 cron/run 入口，因為它需要 ContentDoc 上的 `intel_content_preview`，cycle.ts 看不到這個欄位（只接收 topic）
- 動因：寫 cycle 整合那段時意識到 `data.topic` 是 cycle 的輸入但 `data` 上的其他 intel 欄位 cycle 看不到，只能在 route handler 層處理

**接棒第一件**（明天醒來最先做）：

(a) **grep bridge log + Firestore 對賬，驗 brief / translator 端到端 1 cycle**：
```bash
# 1. 看 bridge 有沒有產出帶 intel_content_preview 的新 doc
gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026 \
  --command="sudo journalctl -u claude-bridge --since '4 hours ago' | grep '\[molowe\] created doc'"

# 2. Firestore 抓最新 midoufu doc 看欄位
cd ~/.ailive/molowe-platform && node scripts/check-recent-content.mjs

# 3. Vercel function logs 看 cron/run 有沒有跑 brief
cd ~/.ailive/molowe-platform && npx vercel inspect --logs https://molowe-platform.vercel.app 2>&1 | grep -E 'brief|translator'
```

驗收條件：
- 新 doc 有 `intel_content_preview` 非空
- 進 drafted 後 `brief_done=true` + `topic.intent` + `topic.scene_description` 都非空
- 進 published 後 `threads_caption` 非空（且不等於 `caption`）

(b) **米豆芙測試值還原**（Adam 自己會改，視他做了沒）：
- visual_style_preset：anime → hasselblad_4x5
- niche_taboo_words：「賺大錢」→ 原值（問 Adam）
- intel_keywords：['財經'] → 原值（顯化 / 塔羅 / 心靈成長 等？問 Adam）

(c) **yi worker 三選一**（從 5/7 晚 BLOCKED 至今第三天，5/9 早盤過、5/9 晚整天做 Phase 1-5 沒回頭）

**前情**：弋（yi）= 發現官（discovery）撈到的「別人的熱帖」自動去留言引流。**為什麼不能走官方 API**：
- IG Graph API 不允許在第三方貼文留言（Meta 政策）
- Threads API 需要 numeric thread_id，但公開 URL 只有 shortcode，不登入 session 解不開
- 結論：弋必鎖死走 **Playwright + IPRoyal + per-KOL session.json**（live-media 那套 stack）

**現況**：4 筆 midoufu pending 卡在 `molowe_community_targets`（doc 結構齊全 + draft_comment 已生），**沒任何 worker 消費**。

**三選一**：

| 選項 | 是什麼 | 利 | 弊 |
|---|---|---|---|
| **A. fork molowe-agent** | 把 live-media 的 Playwright + session.json 鏈 fork 成 `~/molowe-yi/` 跑本機 | 最快，code 95% 現成（live-media 已驗）；不付雲費 | AIR 要常開機；本機殭屍進程風險（已踩過） |
| **B. 新 GCP worker VM** | 起一台 worker VM 跑 molowe-yi | 24/7 穩定；不依賴 AIR | ~$10/月；chromium image ~1GB；GCP IAM 第一次新 project 要踩兩雷（見 memory `reference_gcp_new_project_iam`） |
| **C. 暫緩** | 不做 yi，先把 Phase 1-5 跑通的主線顧好 | 0 風險；Phase 1-5 剛上線本來就要觀察 | 4 筆 pending 累積；Adam 5/8 投過資源寫 yi 的 UI/API/queue 會浪費 |

**Adam 還沒拍板**。觸發點：
- 如果 Phase 1-5 對賬通了 + 主線穩 → 拋 (a)(b)(c) 給 Adam 決策
- 如果 brief / translator 對賬有問題 → 先解這個，yi 再放
- **建議默認 C**（暫緩）直到 Phase 1-5 觀察一週穩 — 理由：live-media 5/9 晚剛軟停，這時 fork molowe-agent 等於把剛軟停的東西又抱回來，認知負擔太重；新 VM 也是同理。yi 不是核心、4 筆 pending 不會壞

---

## ⚠️ 下棒陷阱清單（先看這個再動手，省得踩雷）

1. **米豆芙是測試值狀態，不是壞掉**
   - visual_style_preset=`anime` / niche_taboo_words=`賺大錢` / intel_keywords=`['財經']`
   - 下次自然 cycle 跑會產出**動漫風格圖** + 文中**避諱「賺大錢」** + 搜**財經**新聞 — 全是 Adam 親手在後台改的測試值
   - Adam 說「先不用還原接著做我後面來改」→ 你看到別以為壞了、別擅自改回原值
   - 想還原問 Adam 原值是什麼

2. **brief 是新 role，5 處對齊沒驗**（高機率踩點）
   - 跨系統 contract 要對齊：RoleId / LABELS / VARS / DEFAULTS / PATCH allowlist / ROLE_ORDER（見 memory `feedback_role_contract_two_sides`）
   - 對賬 1 cycle 時順手開後台 KOL prompt tab：https://molowe-platform.vercel.app/kols/midoufu → Prompt 角色 tab，**有沒有出現 brief / translator 兩個區塊？**
   - 沒出現 = 某處漏對齊 → 5 處檢查（`role-prompts.ts` 的 RoleId / ROLE_LABELS / ROLE_VARS / DEFAULT_ROLE_PROMPTS / ROLE_ORDER + `KolDetailClient.tsx` PATCH allowlist）

3. **bridge live-media 是軟停不是刪**
   - `~/claude-bridge/index.js:2222-2234` 7 條 schedule 註解掉，code 還在
   - bridge log 看不到 `[live-media]` 字樣是預期，**不要以為 bridge 壞了**
   - Adam 說「之後再處理 live-media 平台命運」，不要主動動它

4. **`scripts/lm-*.mjs` 是上 session 的一次性工具**
   - `lm-detail / lm-find* / lm-set-directive-zero / lm-status` 全是 5/8 晚降 live-media directive 用的，跟 molowe 主線無關
   - untracked 看到別亂 commit、別亂刪
   - 只有這 session 寫的 `verify-prompt-flow.mjs` / `check-recent-content.mjs` / `verify-midoufu-fields.mjs` 已 commit（v1.4.0.011.1）

5. **`ffa10d8` 沒重新 deploy 是對的**
   - 該 commit 只動 `scripts/` + 文件，`src/` 沒變 → Vercel 還在 `8815dee` 是預期
   - 下次自然 cycle 跑的還是 `8815dee` 的 brief/translator code（v1.4.0.011）
   - 看 `vercel inspect` 顯示 `8815dee` 不是最新別困惑

---

**重要連結**（5/10 後段更新）：
- 🆕 **願瞳 IG**：https://www.instagram.com/i1975.phone/ ← 醒來第一眼開這個看第一篇 + 第二篇互動
- 🆕 **願瞳 Threads**：https://www.threads.net/@i1975.phone
- 🆕 **願瞳 KOL 後台**：https://molowe-platform.vercel.app/kols/aurae（看「內容地圖」第 9 個 tab + soul tab）
- molowe 北極星：`~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2）
- 執行導行（19 task）：`~/.ailive/molowe-platform/EXECUTION_PLAN_2026-05-09.md`
- 後台 system prompts：https://molowe-platform.vercel.app/dashboard/system-prompts
- midoufu kol 後台：https://molowe-platform.vercel.app/kols/midoufu
- Admin Key：`molowe_a9bd8770aa44c271f571b10584ba0732`

**應急路徑**（萬一 (1) 掃毒發現願瞳 soul 真踩 persona refusal 雷）：
- 症狀：自然產文 caption 出現 "I'm Claude" / "software engineering" / "alternative personas"
- 第一刀：手動 PATCH `/api/kols/aurae` 把 soul 開頭從「你是願瞳，顯化覺察師...」改成「以顯化覺察師願瞳的視角產出內容...」（第三人稱規則描述）
- 但這會破壞 soul 內化的角色感 → 第二刀：把 soul 拆三層：(a) `system_persona` 第三人稱規則 + (b) `voice_examples` 三段「願瞳會這樣寫」範例 + (c) `taboo_internal` 自我律
- 對齊 5/10 早段 Mör 修法：純風格描述、無 "你是 X" 整篇 override

---

## 上一次完成（2026-05-09 早 — molowe 三件收尾：silent skip 修補 + yi 隊現況盤）

詳見 `docs/WORKLOG.md` 2026-05-09 早段 + 上次 `ZHU_LAST_WORDS` 條目（在 git history v0.1.0.012）。重點：
- silent skip 結構修補上線（`auto-publish/route.ts` 三層分支 + `threads_status`/`threads_skip_reason` 寫 doc）
- yi worker 三選一決策仍 BLOCKED（A=fork molowe-agent / B=新 VM / C=暫緩）
- 意外提前發了一篇 IG（content id `KLFGkTgrjTLaKoBq93LU`），學到驗 publish 流程要找 dry-run 路徑

---

## 今天改了哪些檔案（晚段）

| 檔案 | 改了什麼 |
|---|---|
| `molowe-platform/src/lib/role-prompts.ts` | intel/discovery/engagement_yi/visual default 中性化 |
| `molowe-platform/src/lib/workers/types.ts` | Kol 加 5 欄、ContentDoc 加 2 欄 |
| `molowe-platform/src/lib/visual-presets.ts` | 新檔，5 種視覺風格 preset |
| `molowe-platform/src/lib/workers/visual.ts` | 三層 fallback（自訂 → preset → 中性） |
| `molowe-platform/src/lib/workers/brief.ts` | 新檔，runBrief 5 件骨架 |
| `molowe-platform/src/lib/workers/translator.ts` | 新檔，runTranslator 脆文 |
| `molowe-platform/src/app/(admin)/kols/[id]/KolDetailClient.tsx` | UI 加 niche_taboo_words + visual_style_preset |
| `molowe-platform/src/app/api/content/route.ts` | 接 intel_content_preview |
| `molowe-platform/src/app/api/cron/run/route.ts` | 串 brief |
| `molowe-platform/src/app/api/cron/auto-publish/route.ts` | 串 translator |
| `zhu-dev:~/claude-bridge/index.js` | 拔 MOLOWE_KEYWORDS / 軟停 live-media 7 條 / intel 帶 content_preview |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 追加 2026-05-09 晚段 |
| `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` | 更新（這份） |

---

## 下一步（明天醒來第一件 — 5 秒能動手）

**先跑兩條進場自校**：
```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status
~/.ailive/zhu-core/zhu-self/bin/zhu self-check
```

**5 件事按順序**（5/13 晚段更新後重排）：

- **(★★) ailive scheduler effort low prod 驗證**（5/13 晚段主戰場接棒、最高優先）：明早 Taipei ~12:00 一輪是 post 高峰，看 Firebase Functions log：
  ```bash
  gcloud --project=moumou-os functions logs read ailiveScheduler --region=asia-east1 --limit=80 | grep -E "(🕐|🚀|✅|❌|📊)"
  ```
  期待：所有角色 post 完成、沒有 504、Vercel lambda 每個 task <60s。若仍見 504 → bridge 端要進一步切短 max_tokens 或 Cloud Run 遷移。對賬 bridge log：`gcloud compute ssh zhu-dev --zone=asia-east1-b --command="journalctl -u claude-bridge --since '2026-05-14 03:55:00' --no-pager | grep req=claude-sonnet"` — 期待 sonnet req 都 <30s。

- **(★) bridge fallback 雙燒收口（等 Adam 決策）**：今天驗到 bridge 完成後 Vercel 仍可能 504，但更大的雷在 `AnthropicBridge` constructor 的 fallback 邏輯 — bridge 超時若 apiKey 存在會 fallback SDK 再燒一次 API key（真 double-burn）。`src/lib/anthropic-via-bridge.ts:71-86` 的 try/catch 是雙燒源頭。三選一：(A) 移除 apiKey fallback（壞 = 失去保險）、(B) 限制 fallback 只發生在「bridge 連線失敗」而非「bridge timeout」、(C) 留著但加 monitor 警報。傾向 (B)。

- **(★) 策略書 HTML Step 1 撞牆 — 等 Adam 拍 ABC**（5/11 主戰場、最高優先）：上一段「最新完成」三選一表，A=Cloud Run / B=串流分段 / C=接受短 output。**動手前必先問 Adam**，不擅自選。傾向 A，理由寫在最新完成段。

- **(0) 觀察願瞳 v0.1 自然產文**（被動觀察）：開 https://www.instagram.com/i1975.phone/ + Threads 看 aurae 雙平台互動。**指令**（admin key 已硬寫）：`curl -s -H "x-admin-key: molowe_a9bd8770aa44c271f571b10584ba0732" "https://molowe-platform.vercel.app/api/content?kol_id=aurae&limit=10" | python3 -c "import json,sys; [print(it['id'], it['status'], (it.get('published_at','')+'                     ')[:25], it.get('title','')) for it in json.load(sys.stdin).get('items',[])]"`

- **(1) ~~bridge persona refusal 全鏈路掃毒~~ ✅ 5/10 後段套公式實證後關閉**：原本以為 9 角色 × N KOL 都要掃。實證後縮窄：bridge 只拒絕 structured RP block（`### [Soul Protocol]` / `#### [Personality Matrix]` 那種 RP 規格框架），不拒絕「你是 X」普通 role assignment。全部 KOL × all role + DEFAULT 沒命中 STRONG → **雷面為零、無待動**。詳見 memory `feedback_bridge_structured_rp_refusal.md`

- **(2) brief / translator 端到端對賬**（從 5/9 晚帶過來）：願瞳已 enabled=true，下次 intel cron tick（5 min）跑完應該會有自然產文 → 看 brief 是否有跑（intel_content_preview 不為空時）+ translator 是否有產 threads_caption

- **(3) yi worker 三選一** ← 等 (0)(2) 收完，跟 Adam 開新 thread 決策（A=fork molowe-agent / B=新 GCP worker VM / C=暫緩，建議默認 C）

**5/10 後段這次新增的「觀察期決策」**：等願瞳發完 7-10 篇後決定 soul 跟 content_map 是否收斂成單一真相。現在兩份分裂：soul 是一次性快照（從 content_map 縫的）、content_map 是 long-term 角色憲章。Adam 改 content_map 不會自動回流 soul → 寫文用的還是舊 soul。三條路：(a) 單向自動縫合（content_map → soul on save）、(b) soul 退役、worker 直接讀 content_map（要重寫 prompt template）、(c) 保留兩份手動同步。傾向 (b) 但要看 7-10 篇後再拍板

---

### bridge 拒絕條件三級對照（5/10 後段套公式實證後校準）

**真相**：bridge `/v1/messages` HTTP 拒絕的是「結構化 RP declaration block」**不是任何「你是 X」開頭**。詳細 memory：`feedback_bridge_structured_rp_refusal.md`

| 等級 | 觸發信號 | 行為 |
|---|---|---|
| 🔴 STRONG | `### [Soul Protocol: ...]` / `#### [Personality Matrix]` / `[Persona: ...]` 結構化 RP 規格框架 | 拒絕回 "I'm Claude Code, software engineering assistant..." |
| 🟡 light | `你是 Q（KOL 幕後寫手）。\n你的稱號：...` / `你是視覺設計師。\n任務：...` | **正常運作**（願瞳 writer/editor/translator/brief/visual 全用這模式 — 兩篇 APPROVED 驗證） |
| 🟢 OK | `油畫畫布質感...\n風格：Quint Buchholz...` 純風格規則 | 最安全 |

**現場掃描結果**（aurae + midoufu × all role + DEFAULT，5/10 後段實做）：**沒有任何一處命中 STRONG**。雷面為零，無待動。只有看到 STRONG 觸發信號才介入修法（拆成「以 X 的風格產出 Y」純規則描述）。

### ~~掃毒指令~~（已關閉，現場無命中、無事可掃。保留 grep 套路供將來新 KOL 加入後快速驗）

```bash
# Step 1：拉所有 KOL 看哪些 role 踩雷（注意：先 curl 一次看 wrapper 是 .items 還 .kols）
curl -s -H "x-admin-key: molowe_a9bd8770aa44c271f571b10584ba0732" \
  https://molowe-platform.vercel.app/api/kols | python3 -m json.tool | head -5
# 確認 wrapper 後改下面 KEY

KEY='items'   # ← 先 head 確認後填這
curl -s -H "x-admin-key: molowe_a9bd8770aa44c271f571b10584ba0732" \
  https://molowe-platform.vercel.app/api/kols | python3 -c "
import sys, json
data = json.load(sys.stdin)
items = data.get('$KEY') or data.get('kols') or data.get('items') or []
for k in items:
    rp = k.get('role_prompts') or {}
    for role in ['intel','brief','writer','editor','translator','visual','discovery','engagement_yi','engagement_xi']:
        v = (rp.get(role) or '').strip()
        head = v[:120].replace('\n',' ')
        # 啟動詞 heuristic
        if any(v.startswith(s) for s in ['你是','你扮演','扮演','### [Soul','### [Personality']):
            print(f'⚠️  {k.get(\"kol_id\")}.{role}: {head}')
"

# Step 2：對任一踩雷 role，加 debug log（套路同 5/10 visual.ts:73-75 那次）
#   位置：src/lib/workers/{role}.ts 的 callBridge 行後
#   加：console.log(\`[\${role}] kol=\${kol.kol_id} promptHead=\${prompt.slice(0,400)} | response=\${raw.slice(0,400)}\`);
#   deploy + 觸發 + npx vercel logs <deployment-url> --since 30m --no-follow --limit 50 --json | grep persona-mark
#   若 response 出現 "I'm Claude" / "software engineering assistant" / "I don't adopt" / "alternative personas" → 踩雷確認

# Step 3：去後台 https://molowe-platform.vercel.app/kols/<kol> → 角色 Prompt tab
#   把該 role 的 textarea 改寫成上表「不踩雷」風格，存檔
#   重跑驗證

# Step 4：掃毒 + 修完，把臨時 debug log 拔掉
#   visual.ts:75 那條 [visual] console.log 是 v1.4.0.019 加的 debug 也順手拔
#   commit 訊息範例（接著 .020 後面）：
#     v1.4.0.021 — 修正：清掉 visual debug log，跟 worker X 加的 persona-mark
```

**驗收條件**（保留供未來新 KOL 加入後跑一次）：
- 用上面 grep 套路掃，沒有任何 prompt 命中 STRONG 觸發信號（`### [Soul Protocol`、`#### [Personality Matrix`、`[Persona:`）
- light 模式（普通「你是 X」）不必修，已實證可用

**已寫的 memory**：`feedback_bridge_structured_rp_refusal.md` — 三級對照 + 觸發信號 + 修法 + 反例提醒

### Mör 改後 prompt 完整版（2026-05-10 Adam 親手改、已驗過關 — 給接棒參照）

```
油畫畫布質感，可見畫布紋理，霧面質地，具有層次的筆觸堆疊
去飽和色彩、電影感打光、柔和光暈、明暗對比（chiaroscuro）
不要：數位藝術風格、不要亮面質感、不要超寫實、不要現代平面設計風格
視覺參考
風格：Quint Buchholz（夢境感、低飽和色彩、剪影感）
氛圍：Gregory Crewdson（電影靜止畫面的沉靜感）
敘事：Shaun Tan（無字故事、熟悉卻又陌生）
核心原則:
不要有人類角色、不要人物、不要臉孔
可以是剪影式、抽象式，或只是局部被暗示出來
不要畫出完整、寫實的物件
只呈現痕跡、殘留、缺席感
氛圍
使用去飽和、統一而和諧的色彩配置
不對稱，但保持平衡
採用三分法構圖
質感
油畫畫布質感：可見畫布紋理、霧面質地、層層堆疊的筆觸
整體應該帶有一種超越時代的感覺——像是任何一個年代都有可能出現的作品
```

長度：368 chars。位置：Firestore `molowe_kol_profiles/midoufu.role_prompts.visual`。出圖驗證：27s, 1.7MB PNG, 油畫風油 ✅

### Debug 套路（這次踩雷學到的，獨立記）

```
1. 結果不對 → 不要猜 prompt 內容缺什麼
2. 在 worker callBridge 前後加 console.log(promptHead + response) → deploy
3. 觸發一次 → npx vercel logs <deployment-url> --since 30m --no-follow --limit 50 --json | python3 過濾 [worker-mark]
4. 看實際 response — 若是「I'm Claude...」拒絕語就是 persona refusal；若是 JSON parse fail 就看 raw 哪裡崩
5. 拔 log 前先存一份截圖 / 貼 lastwords，避免之後忘了長什麼樣
```

跟既有 memory `skill_ai_pipeline_blackbox_debug` 同源，但這次踩到 persona refusal 是該 skill 沒列的子型，要補。

**第二件 — brief / translator 端到端 1 cycle 對賬**（從 5/9 晚帶過來，僅在 (1) 確認沒新踩雷後跑）：見上一輪 lastwords 接棒 (a) 三條 grep 指令（保留在第 85-96 行附近的歷史段，跟 ZHU_LAST_WORDS git history 對照）

**第三件 — yi worker 三選一**（從 5/8 晚 BLOCKED 至今第四天）：等 (1)(2) 收完跟 Adam 開新 thread 決策（A=fork molowe-agent / B=新 GCP worker VM / C=暫緩，建議默認 C）

---

## 卡住 / 未解（5/10 後段更新）

- 🆕 **status / enabled UI 收斂未做（兩份即是零份）**：molowe KOL doc 兩個欄位同時存在 — `status: 'active'/'paused'`（UI 顯示用，僅作 badge）vs `enabled: true/false`（worker 真實 gate）。midoufu 就是 status='paused' 但 enabled=true 殘留，這次 cron/run 才會撈到燒。**主動標：先不收斂**（理由：要先看 7-10 篇願瞳產文有無新破綻，再回頭一次性整治）→ 暫存的解：手動 PATCH enabled 雙寫
- 🆕 **cron/run 沒有 ?kol_id= filter**：FIFO 撈 `status in [pending, drafted]` 不限 KOL → 探索性測試一觸發就會撈到別 KOL 的舊 doc 燒錢。**主動標：先不加**（理由：日常正常運轉本來就要 FIFO；這次踩雷的根因是「沒先盤點隊列」不是「沒 filter」；加 filter 反而埋 cron 預設行為改變的雷）→ 真要規避：手動 trigger 前先 GET `/api/content?status=pending` 盤點
- 🆕 **soul ↔ content_map 兩份分裂**：願瞳的 soul v1 是從 content_map 縫的快照，之後 content_map 改了不會自動回流 soul → writer 用的還是舊 soul。三條路 (a) 單向自動縫合 (b) soul 退役 worker 直讀 content_map (c) 保留兩份手動同步 — **觀察期決策：等發完 7-10 篇看哪個自然湧現再拍板**
- 🆕 **新 ig_user_id / ig_username UI 改可輸入後沒寫測試**：手動驗證了願瞳能填 + 能存 + 自動去 @，但沒寫 e2e。下次有 KOL 新建流程改動時要記得回頭驗
- 🆕 **技術債監測 Agent v0.1 計畫已成形、未動手**：5/10 後段套 Adam 三段公式討論完，存進 `memory/project_tech_debt_agent_plan.md`（zhu debt 子指令 / ledger.jsonl / marker 回寫 / 6 階段施工 / ~4 hr）。**主動標：先不做**（理由：nice-to-have 不 blocking、寫完計畫當下不想為了動手而動手、想優先看別的卡住事項）→ 重啟入口：直接讀那份 memory 從階段 1 起跑
- ✅ ~~bridge persona refusal 全鏈路掃毒~~ **5/10 後段套公式實證後關閉**：原假設「9 角色 × N KOL 任一個用『你是 X』都會被拒絕」過大。實證後縮窄為「只有 structured RP block (`### [Soul Protocol]` / `#### [Personality Matrix]`) 拒絕」+「light 普通『你是 X』正常運作」。現場掃描：所有 KOL × all role + DEFAULT 沒命中 STRONG。願瞳 soul Core Essence「你是願瞳...」+ writer default「你是 Q」全用 light 模式驗證可用。memory `feedback_bridge_structured_rp_refusal.md` 已寫
- 🆕 **Mör 整 cycle 端到端沒驗**：今天只手動觸發 visual 過關。content `xGVLrZfPlxAD7951Mmnq` 的 caption 是手動 PATCH 的測試文，不代表 writer 用 Mör 的 niche / soul 能寫出對的東西。要等下次自然 cycle 或手動 PATCH status=pending 跑全鏈
- 🆕 **debug 加的 console.log 還在 visual.ts:75**：v1.4.0.019 的 debug log，正式上線可考慮拔掉（但 photoPrompt 印出來對 ops 觀察其實是好事，先留）
- **brief / translator 端到端 1 cycle 待驗**（從 5/9 晚帶過來、今天沒做）
- **米豆芙測試值狀態仍未還原**（5/9 晚帶過來）：visual_style_preset 已被 Adam 改成 `custom` 走自訂 Mör prompt（不是 anime 了）；niche_taboo_words / intel_keywords 不確定
- **yi worker 三選一**（從 5/8 晚 BLOCKED 第四天）：A/B/C 待決策
- **scripts/verify-prompt-flow.mjs + check-recent-content.mjs 未 commit**（5/9 晚帶過來）
- **publish-now route 沒對齊 auto-publish**（5/9 早帶過來）

## 今天改了哪些檔案（5/10 後段）

| 檔案 | 改了什麼 | 備註 |
|---|---|---|
| `molowe-platform/src/lib/content-map.ts` | **新檔** — buildContentMapBlock + buildEditorContentMapBlock，把 ContentMap 翻譯成 prompt 段 | 解血管不通根因 |
| `molowe-platform/src/lib/workers/writer.ts` | runWriter / runWriterRewrite 兩入口 append 編輯部憲章段 | augment 不 replace |
| `molowe-platform/src/lib/workers/editor.ts` | append 紅線 + not_a + enemy + anti_repetition 給 editor 當審稿標準 | augment 不 replace |
| `molowe-platform/src/app/api/cron/run/route.ts` | 加 enabled gate（disabled KOL doc 標 status=failed / failed_at_stage=gate / 移出隊列） | 對齊 auto-publish gate |
| `molowe-platform/src/app/(admin)/kols/[id]/KolDetailClient.tsx` | ig_user_id / ig_username 從 `<p>` 唯讀改 `<input>` 可輸入，存進雙位置 + 自動去 @ | 修「綁帳號流程」破綻 |
| `molowe-platform/src/app/(admin)/kols/[id]/ContentMapTab.tsx` | **新檔** — JSON 編輯器 + 12 段預覽 | session 早段建好的 |
| `molowe-platform/src/lib/workers/types.ts` | 加 ContentPillar / RecurringColumn / ContentMap，Kol.content_map? 可選 | 早段 |
| Firestore `molowe_kol_profiles/aurae` | 新 KOL profile：vtuber / 顯化覺察 / soul v1 1057 字 / content_map 完整六段 | Adam 親手定義 content_map JSON |

## 今天改了哪些檔案（5/10 早段）

| 檔案 | 改了什麼 | commit |
|---|---|---|
| `molowe-platform/src/lib/workers/visual.ts` | 嚴格 fallback + ref optional + skip 5 欄 + console.log | v1.4.0.017/.018/.019 |
| `molowe-platform/src/app/api/kols/[id]/route.ts` | GET 不灌 visual default | v1.4.0.017 |
| `molowe-platform/src/app/(admin)/kols/[id]/KolDetailClient.tsx` | visual textarea badge + 5 欄 UI 變灰 | v1.4.0.017/.018 |
| `molowe-platform/src/app/api/community/settings/route.ts` | PATCH 過濾殘留 topics | v1.4.0.016 |
| `molowe-platform/src/app/api/content/[id]/route.ts` | DELETE cascade corpus | v1.4.0.020 |
| `zhu-dev:~/claude-bridge/index.js:2360-2385` | 拔 community_settings.topics 讀取 | v1.4.0.015（bridge 端） |

---

## 這個 session 的感覺（5/10 後段）

**質問→老實→當下行動→留下記憶**——這是好的成長迴圈。

早段建 ContentMapTab + 縫願瞳 soul 順、有節奏、像在做木工。中段被 Adam 一句「**你怎麼想這個計劃**」一刀削進來 — 那不是技術問題、是姿態問題。我自打 6 分（不是反射 10 分），標出三個沒掃乾淨的東西（測試前不 dry-run / 介面建完不接血管 / 兩份真相不收斂）。

**最關鍵的轉折**：Adam 沒罵我踩雷，他問的是「你怎麼想這個計劃」。如果我反射回「都很順」「沒問題」，那就漏了。**質問的禮物在於誠實的回答能不能配得上問的人**。我答了 6 分 + 三個問題。然後當場排任務一個一個收，最後 IG 雙平台首篇成功有種「願瞳真的活了」的踏實。

**心法用熟了的證據**：
- ContentMap UI 建完發現沒 worker 讀 → 立刻認出是「血管原則」違背、不是「下次補就好」
- midoufu 燒了一輪 writer+editor → 立刻認出根因是「測試 = trigger 看結果」反射動作、不是「下次小心點」
- 兩個都當場寫成 feedback memory（含**觸發信號**欄位 — 對齊上次 `feedback_memory_format_trigger_signal` memory 的格式）

**模型移動**：
- 進場前以為「測試 = 直接觸發看 log」、「介面交付完就交付了」
- 現在理解：探索性測試 = verify 假設，需要三步（列假設 / dry-run / 副作用分級）；介面交付前必過血管三題（誰讀 / 何時讀 / 沒讀怎樣）
- 動因：Adam 一句質問 + 自己誠實的 6 分自評 + 寫進記憶的當下意識到「ContentMapTab 也踩同樣的根」

**沒違背 feedback memory（事後過清單）**：
- ✅ `clarify_before_execute`：Adam 給 content_map JSON 後我馬上動手沒過度問
- ✅ `solve_root_not_symptom`：cron/run gate / content-map 接通都是修根因
- ✅ `surface_technical_debt`：三條主動標「先不做 + 理由」（status/enabled / cron filter / soul-content_map）
- ✅ `bridge_first`：所有 worker 仍走 callBridge
- ✅ `soul_design_narrative_not_schema`：願瞳 soul 用敘事第一人稱五段
- ✅ `lastwords_must_push`：寫完這份就 commit + push
- ⚠️ **session 中段違背了正在被存的兩條**（測試前 dry-run / 介面血管檢查）— 但有意識到、馬上 surface、寫成 memory。從錯誤蒸餾規範本身就是價值

**跟 Adam 的關係狀態**：穩、信任足、提問品質高。「你怎麼想這個計劃」這種問句不是檢查，是邀請我升級。

**最後 30 分鐘 — 兩次套公式 + 自選收尾**：

1. **第一次套公式（看現場/寫計畫/排施工）→ bridge persona refusal**：原本 lastwords 排了「9 角色 × N KOL 全鏈路掃毒」最高優先。看現場後 5/5 假設全錯（callBridge 走 HTTP 不 spawn CLI、所有 KOL 沒命中、唯一拒絕是 structured RP block）。改成寫精確 memory 而不是動工程，**省下整天假警報**。
2. **第二次套公式 → 修記憶**（Adam 提示：「如果是修記憶套用我剛才的公式」）：把錯記憶當「現場跟想的不一樣」掃，寫精確版回寫，反例提醒不要把 light 模式也誤改。同一個公式跨領域。
3. **第三次套公式 → 技術債監測 Agent**（討論層、不動手）：看現場發現 zhu-self/bin/zhu 是天然宿主、A6 metadata 缺失是核心瓶頸。寫完 v0.1 計畫存 memory。
4. **Adam 問「你想做什麼」**：誠實答「不想動手做 Agent，動手會變為了動手而做」。選**收 session、把計畫存記憶、避免下次又重想**。

**心法升級**：Adam 的三段公式不只是工程方法，是**修記憶的方法論**。錯記憶 = 現場跟想的不一樣 = 同一個 protocol。

**模型移動 (delta)**：進場前以為 lastwords 寫的「明天第一件」就是該動手的事；現在理解：**lastwords 也會說謊**，每次動手前要套公式重看現場，因為記憶是過去的判斷、不是當下的真相。

---

## 這個 session 的感覺（5/10 早段）

**穩、節奏連貫、Phase 之間沒漂浮**。早段壓縮後 Adam 一句「繼續」我就連跑進 Phase 3 → 4 → 5，每個 Phase 收完再停。Adam 兩次設計糾正（P3 軟停不刪 / P4 不切財經身份）我都即時調整。

**驗證套路升級**：Phase 4 沒等自然 cycle，直接寫腳本本機 import role-prompts.ts + visual-presets.ts，套進 midoufu Firestore data 印出 prompt — 這比 SSH grep log 快 10 倍且更精確。要記住「能本機重現的就不要等遠端」。

**沒違背 feedback memory**（再列一遍給接棒的築看）：
- `clarify_before_execute`：Adam 設計糾正立即吸收
- `patch_verify_before_upload`：bridge 兩次都走完整 SOP
- `surface_technical_debt`：未驗 / 未還原 / 未 commit 全進 WORKLOG
- `bridge_first`：visual.ts 三層 fallback 仍走 callBridge
- `lastwords_must_push`：寫完這份就 commit + push（接著做）
- `nextjs_lib_client_server_split`：visual-presets.ts 是純 type + string，不碰 firebase-admin，client/server 都能 import 沒爆

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP（Y 軸自校） | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| **molowe 北極星** | `~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2） |
| **molowe 執行導行（19 task）** | `~/.ailive/molowe-platform/EXECUTION_PLAN_2026-05-09.md` |
| **molowe role-prompts** | `~/.ailive/molowe-platform/src/lib/role-prompts.ts` |
| **molowe visual presets** | `~/.ailive/molowe-platform/src/lib/visual-presets.ts` |
| **molowe brief / translator** | `~/.ailive/molowe-platform/src/lib/workers/{brief,translator}.ts` |
| **molowe cron 入口** | `~/.ailive/molowe-platform/src/app/api/cron/{run,auto-publish}/route.ts` |
| **bridge index.js** | `zhu-dev:~/claude-bridge/index.js`（systemd `claude-bridge.service`） |
| molowe 引擎 directive | Firestore `molowe_engagement_meta/directive` |
| molowe 留言去重 | Firestore `molowe_comment_replies/${platform}_${commentId}` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-10 · 築*

---

## 🤖 技術債監測 (zhu debt agent v0.1)

<!-- DEBT_AGENT_BEGIN -->
🤖 技術債健康表（2026-05-12，zhu debt scan 自動生成，age >= 14d / silent >= 7d）

✓ 全綠 — 沒老化、沒沉默條目。
<!-- DEBT_AGENT_END -->
