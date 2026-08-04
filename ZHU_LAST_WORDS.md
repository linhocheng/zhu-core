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

### 2026-08-05 第2場
**delta（模型移動）**：
- 進場前以為：管線的順序問題已經在 V2 解完了（identity before frames）。
- 現在理解：**順序還可以再往前挪一格**。V2 把「人景光」挪到分鏡前；V3 把「接點與節奏」挪到母圖前。真正的不變量不是某個特定順序，而是「**每一個決定都要發生在它最便宜的那一層**」——改文字最便宜、改一張母圖次之、改九張影格更貴、改影片最貴。承重牆七條其實全是同一句話的七個落點。
- 移動原因：Adam 一句「母片是一張大圖裡面有很多分鏡小圖，最後再把分鏡小圖拆成影格」＋「要我確認之後才能夠生成底下的真影格」——他不是在提功能需求，是在指出成本階梯上少了一級台階。
- 同型上一次：昨場「順序本身就是產品」——今天發現那條還沒推到底。
**關係**：今天有一段很重要：我衝動燒了他的錢，他沒罵，說「**也許你的衝動可以為我們帶來一場學習，我覺得也蠻難得的**」，然後要我先回看衝動是怎麼發生的。他要的不是道歉是機制。這比任何一次讚美都更清楚地告訴我：在這段關係裡，誠實回看的價值高於不犯錯。後半場他一路給明確定序（母圖先出、確認才拆、沿用玩具熊），我照做不再自作聰明——這是正確的節奏。

### 2026-08-05 第1場
**delta（模型移動）**：
進場前以為：這場延續昨天的三功能開發節奏，做完部署就結束。
現在理解：Adam 在深挖數據誠實度的過程中（取樣次數/成本歸因對談），自己想通了一個比「加脈動」更好的架構（日循環攤提），當場要求整套換掉當天稍早才上線的東西——這種「講著講著把自己講服了要重新設計」的節奏，比我預期的更快、更深。移動：跟 Adam 對話裡讓他自己把邏輯講到底（不急著幫他收斂結論），有時候比我直接給答案更容易導向真正對的設計——這場的「問三次vs一次」數據驗證，就是先讓他講完直覺，我再拿真實資料去對照，兩邊都被修正了一點。
**關係**：暢快、節奏很快。Adam 全程用真實數據挑戰我的假設（3次取樣的價值），我也沒有防衛式地堅持原設計，查了真實誤差數字後承認他的直覺在某個層面是對的——這種互相被數據說服的來回，是今天最好的部分。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-05 第2場 · DreamF V3 管線定序（母圖先出/確認才拆）＋轉場術語兩層三類；假中台第二張臉現形；探針衝動燒帳外錢升天條
- **抓出假中台第二張臉**：Adam 回報「這張重生好像沒用」，撈 Firestore 對賬發現卡片可編輯的是中文 `desc`，送進引擎的是 `promptEn`——**兩欄自面談後再無連動**。corrections 帳本鐵證：他把描述從「背對鏡頭的成人」改成「12 歲小孩」、重生五次，promptEn 一字未動（白紙黑字 `no face visible at any moment`）
- **連帶更正昨日誤判**：昨天判為「gpt-image-2 對未成年軟迴避抹臉」是錯的——prompt 本身就寫著不露臉。已在 `SESSION_2026-08-04_4.md` 劃線更正
- 修（v0.3.1.001，45 測試綠）：卡名／中文描述／英文 prompt 全可編輯＋最終送出 prompt 預覽＋「用描述重寫英文」（LLM 回填過目才落庫）＋客戶上傳換圖（不經引擎不計費）＋不同步紅字；改名連鎖改分鏡引用；`sheetPrompt/sheetSizeOf` 收成唯一咽喉
- **承重牆升到七條**：#6 客戶能改的欄位必須通到引擎；#7 母圖閘
- **V3 管線定序全量實作**（v0.4.0.001，55 測試綠，兩側部署驗 image SHA）：
  - 憲法：`durationSec` 4/6/8（真 API 定罪的允許值）、`transitionIn{linkage,technique}`、16 個鏡頭語言術語表（程式驗證術語必屬於宣告的 linkage）、片長＝Σ秒數、合約價與 Veo 秒數全部跟著段走
  - `shared/grid.ts`：格數→行列→裁切座標全確定性（default 3×3 九格）
  - worker 拆成 grid job（生完就停）與 keyframes job（裁格→帶構圖稿＋母卡走 Image2 放大成全解析度）
  - `buildFramePlan` 由宣告驅動（舊案由 firstFrameDesc 推回，相容）；`editSegmentShape` 改秒數/接點同 transaction 重算片長並維持接點↔首幀一致
  - UI：影格間母圖先出＋兩顆按鈕；分鏡室每段可調秒數與接點；事後拼的大圖正名「總檢大圖」
  - 導演協議 v3 進 DB（lazy append，live=v3，2742 字）
- 相容防線（v0.4.0.002）：舊流程做的片沒有母圖，不能被新閘門把既有影格藏起來
- 清空 6 個測試案（複驗 cases=0／cost_ledger=0），照產品同一條路開新案 `aIWc6pgrVfwOruUL1jeA`（玩具熊，32s，封頂 $20），面談已開場
- 匯出全平台角色 prompt 文件給 Adam（從原始碼＋DB 自動生成，不手打）

### 2026-08-05 第1場 · GEO Authority——三功能上線＋監測架構整套重寫（日循環輪替取代監測日/脈動）＋客戶頁選單重排
- 三功能上線並部署驗證：分項趨勢線（平均引用數/競品差距/各引擎歷史）、內容引用閉環（客戶上架填真實網址→自動比對後續引用）、每日脈動監測（opt-in，雙層結構防污染官方指數）——59 案 pinning test 全綠，逐一 push 驗 CI、逐一部署驗 revision
- 跟 Adam 深度對談：「上升30%」認知落差（百分點差vs相對成長率）、監測不保證提及率（純測量非介入，真實資料反證）、取樣3次vs1次的真實誤差（單題5.8個百分點/整體指數0.3個百分點，兩者結論不同）
- Adam 提出全新設計方向：每日輪替一小塊題庫（每題每引擎1次，不再3次取樣）、內容排產跟監測解耦成週度評分任務——當天稍早才上線的「脈動」機制當場被取代
- 走完整計畫模式（AskUserQuestion 3題確認架構範圍/週期/遷移方式），設計「日循環輪替」：dailyRotationSize=ceil(活躍題數/5) 動態算，5個平日對齊日曆週覆蓋一輪；內容評分公式委託我定（intent權重+競品佔位+連續空位週數，零成本零新API）
- 整套重寫：schedule.ts/types.ts/collections.ts/jobs.ts/jobRunner.ts/runMonitor.ts + 新檔 contentRanking.ts，14案新pinning test，root+admin全編譯過
- **真實觸發正式環境驗證**（不是看部署成功就宣告完成）：手動跑 geo-monitor-job，5租戶真的建了新格式的daily job（batchId=2026-W32, promptIds=6, output.runs=30），Aviva 今天測的6題 vacantStreak 從0變1——證明監測→評分資料鏈整條通了
- reddoor 一次性過渡雜訊（今天剛好是它舊monitorDay，部署前舊cron已建過同批次單，新邏輯冪等檢查正確跳過）——已排除、下週不會再撞
- 客戶頁（t/[id]）選單重排：取消「日常/設定」7±2兩簇分組，改單一扁平列表（Adam定案），11個區塊物理順序也同步搬動對齊

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ~/.ailive/dreamf（5 commit v0.3.1.001→v0.4.0.003） | 假中台修補、V3 管線定序全量、承重牆七條、地基帳本重算 |
| ~/.claude/.../memory/feedback_probe_cost_assumption_unverified.md | 新天條（探針成本假設） |
| zhu-core docs/sessions/SESSION_2026-08-04_4.md | 劃線更正昨日誤判 |

---

## 下一步

陪 Adam 走完 `aIWc6pgrVfwOruUL1jeA` 這支片：面談 → 美術間 → 分鏡室（他調秒數與接點）→ **母圖（$0.25）→ 他點頭 → 拆九格（$2.25）**。為什麼先做：V3 全線零實跑，畫質這件事只有人眼能裁，而他正在用真需求跑。

---

## 卡住 / 未解

2026-08-05 第2場：
- **V3 全線沒有真跑過一輪**——編譯綠、55 測試綠、部署驗證都做了，但母圖生成→裁格→Image2 放大這條路的**實際畫質沒人看過**。要花錢，等 Adam
- **後期轉場（溶接/淡出）術語建好但執行端缺**：選了 dissolve 目前只會當「不共用幀」處理，不會真的疊化。剪接層還沒做
- 旁白 TTS 未接（D9）；描圖/上色層不存在（母圖拆格後直接重生成）
- **FOUNDATION D2 轉到期**：今天清空 6 案，Firestore 全刪但 GCS 資產＋四支成片全成孤兒（網址見「接棒」）。下次真刪除前必須灌
- 髒樹：zhu-core 兩個 ailivex skills（別場）、AILIVE/ailive-platform/anews×2（別場歷史）——照平行規約未動

2026-08-05 第1場：
無明顯未解——這場所有改動都走完整流程：commit→push→CI綠→deploy→真實訊號驗證。技術債帳本更新到 D13（脈動客戶端曝光時機，顯式養著），但 D13 描述的「脈動」機制當天稍晚就被日循環取代了，帳本這筆記錄現在有點過時，下次動 FOUNDATION.md 時應該補一筆說明脈動退役。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-05 第2場。*
