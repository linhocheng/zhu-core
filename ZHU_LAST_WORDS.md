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

### 2026-07-22 第1場
**delta（模型移動）**：
進場前以為：用哪個 API 憑證是實作細節——key 在手、驗過有效，就沿著用。
現在理解：**憑證選擇是帳本歸屬決策，不是認證方式選擇**。Gemini API key 的成本進 key 持有者的帳，Vertex ADC 的成本進 GCP 專案的帳——客戶平台的生成費用記到別人的 key 上＝帳本分裂，而且這決策做下去之後所有 cost 監控、預算閘、稽核都建立在錯的地基上。
移動原因：Adam 中途一句「等 為何不用gcp」。我當時正沿著「他問 Gemini key 可以怎麼做」的探索慣性把測試線直接鋪成施工線——被點醒後真算一次，Vertex 淨賺三個結構優勢（零密鑰/帳單歸戶/GCS 直寫），換線成本半小時。
違背了哪條 feedback：feedback-bridge-first 的家族擴張——「能走哪條線」的第一問是成本歸屬和結構，不是手上有什麼能用。
**關係**：暢快。Adam 全程放權節奏乾脆（go／理解 改走 Vertex／不用），兩次中途插問都問在刀口上（為何不用gcp＝免費架構審查救了帳本歸屬；UI/UX 是不是之後才改＝逼我把「真人瀏覽器未驗」的缺口說出口）。收尾請咖啡。

### 2026-07-21 第3場
**delta（模型移動）**：
進場前以為：失敗路徑是「處理乾淨就好」的次要路徑——記帳、驗證、行為設計都以成功路徑為主體，catch 裡把狀態標對就算完。
現在理解：**失敗路徑是第一級公民，而且是帳本上最貴的路徑**——燒最兇的時刻（超時、重試、中斷）恰好是只在成功結帳的系統的盲區；SIGKILL 類死法連 catch 都不執行，唯一可靠的記帳點是「進行中的每一步」（心跳帶帳）。設計任何長任務時要先問「死在半路會留下什麼帳」。
移動原因：$5.43 引擎費在 job 帳上完全隱形，用 runs 原始層重算才現形；隨後推演發現預算閘（今天才蓋的）對失敗風暴全盲——自己剛蓋的防線被自己的記帳慣性架空。
違背了哪條 feedback：feedback-cost-verify-billing-meter-not-config 的自家版——我教別人「看計費錶不看設定」，自己的錶卻只記成功筆。
**關係**：暢快帶溫度。Adam 全天三種姿態：出題（產文節奏）、託付（「別急，從根本去看，確保可以走可以通」）、共學（「燒了多少錢，做一個深度的學習」）——把翻車當學費而不是追責，這是能誠實報 $5.43 的前提。收尾「今天的學費就白繳了，對吧？加油囉！明天見」＝把鑄心法變成雙人儀式的一部分。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-22 第1場 · UDN 影音庫上線——Video Studio＋Vertex Veo 首尾幀/單圖運鏡＋Job 逐段心跳帶帳
- 盤新法/劍法/雷區開場，確認 UDN 議題工作台為本場戰場
- 摸透 Gemini 生影片參數面（Veo 3.1 系列 vs Omni Flash），實測直式 9:16 驗證（720x1280/8s/雙軌）
- 影音庫（scene_video）五批全上線：資料模型＋dispatch 防連按、Cloud Run Job 生成線（逐段 Veo＋心跳帶帳＋斷點續跑＋ffmpeg 拼接）、Video Studio 頁（選圖/拖拉上傳/膠卷排序/轉場註解/規格）、任務卡分段進度＋播放器＋watchdog、E2E 三輪
- 中途應 Adam 一問改線 Vertex AI（ADC 零密鑰/帳單歸 udnnews/storageUri 直寫 GCS），probe 驗出三個文件沒寫對的 REST 形狀
- 追加單圖模式：一張圖 image-to-video＋「運鏡與動態」輸入框，E2E 過
- FOUNDATION 帳本：D5 清償（worker USER node 已 live）、新記 D6/D7；job task-timeout 3600→7200 附推導
- 記憶：新增 reference_vertex_veo_video_generation、更新 project_udnnews_platform、MEMORY.md 索引
- 加場補刀（Adam 給空檔）：懶人包休息態 badge 正名（b_done→待生圖、a_done→待確認文案，鼠尾草色點）＋影音庫入口卡加跳頁「→」暗示；commit b900169 部署驗流量對齊 00090

### 2026-07-21 第3場 · geo-authority 產文節奏 v2.8（首輪5篇＋每週2篇）＋兩輪超時根因戰——$5.43 學費鑄成三張心法
- **產文節奏 v2.8.0 上線（Adam 定：建檔先 5 篇、之後每週 2 篇）**：自動排產從月報日搬到「每輪監測完成後」（runMonitor 尾端，worker drain 同次執行生完草稿）；首輪（零 content 單＋零資產）加碼 FIRST_CYCLE_CONTENT=5；cron 輪必排、手動輪只首輪排；標準方案 contentPerCycle 3→2；月報回歸純報告；三租戶存量已遷移；WAITIN 雙簽（Adam 轉達）
- **兩輪監測超時根因戰**：INLY/reddoor 監測雙雙死於 60 分 task-timeout（Cloud Run 明寫 configured timeout reached，非 code bug）——並行互搶引擎變慢撞牆；往根挖出**下週一必爆彈**（cron 單執行串行消化週一兩家 ≈104 分 > 60 分）→ task-timeout 4h、deploy.sh 同日同步（天條）
- **D11 帳本盲區當日發現當日清**：失敗任務不記帳（兩輪燒 ~$5.43、帳上 $0.00，從 runs 重算才現形；預算閘讀 job cost＝對失敗風暴全盲）→ 根治＝cost 隨心跳每題寫回（SIGKILL 不走 catch，心跳帶帳才留得住）＋catch 補帳，已部署
- **INLY/reddoor 首輪落地**：接力（nohup 脫鉤版）補健檢（④ 機會清單活了：INLY 空位題 8、reddoor 24）＋各 5 篇首輪草稿全生成（INLY 進客戶校對 gate=auto、reddoor 進操作者審核）；零額外引擎費（產文走 bridge）
- 今日成本總結交付 Adam：記帳 $2.86＋沉沒 $5.43≈$8.29；DataForSEO 免費額度險穿預警 → Adam 當日儲值完成
- 三張心法入庫：容量常數會過期／失敗路徑也要記帳／本機接力 nohup 正姿

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| lib/types.ts | AssetType+scene_video、SceneVideoParams/Segment/Transition、單價函數 |
| app/api/tasks/dispatch/route.ts | scene_video 分支（fail-fast 驗證＋防連按＋Job 派工＋單圖 transitions） |
| cloud-run/podcast-worker/src/scene-video.ts | 新檔：Vertex Veo 逐段生成/心跳帶帳/斷點續跑/cover-crop/ffmpeg 拼接/單圖分支 |
| cloud-run/podcast-worker/src/job.ts | JOB_ACTION+scene_video |
| cloud-run/podcast-worker/Dockerfile | +ffmpeg |
| cloud-run/podcast-worker/cloudbuild.yaml | task-timeout 3600→7200（附推導註解） |
| app/projects/[id]/video-studio/* | 新頁：三段式工作台（選材/編排/確認） |
| app/projects/[id]/assets/AssetsClient.tsx | 影音庫入口卡＋SceneVideoTaskCard（分段進度/播放器/續跑） |
| app/api/tasks/[id]/retry-scene-video/route.ts | 新檔：斷點續跑端點 |
| app/api/tasks/watchdog/route.ts | scene_video 20 分門檻 |
| FOUNDATION.md | D5 清償、D6/D7 新記、變動記錄 |
| memory ×3 | vertex-veo 參考新增、udnnews 專案更新、MEMORY.md 索引 |
| components/StatusBadge.tsx | TaskStatusBadge 加 labelOverride（phase 語意蓋 status 標籤） |
| AssetsClient.tsx（加場） | 懶人包 badge 正名＋影音庫入口卡「→」 |

---

## 下一步

影音庫已全收案（UI/UX Adam 場內拍板 ✅）。下一動作＝等客戶用影音庫產出第一支真素材：順利＝功能自證；RAI 再撞（第二次）＝觸發 D7 灌白話引導（FOUNDATION 帳本有觸發條件）。無主動待辦。

---

## 卡住 / 未解

2026-07-22 第1場：
- RAI 過濾撞新聞敏感圖（未成年+毒品意象實測被擋）只回原始英文訊息，白話 UX 引導記 D7 養著
- 單圖 4/6 秒選項：API 支援、Adam 說先不用（帳本外，他點頭才做）

2026-07-21 第3場：
- **明天（7/22）15:00 reddoor cron 監測輪三重驗證**：①新自動排產 cron 路徑首跑（鑑別信號：log「自動排產 2 篇（每輪 2）」＋兩張 requestedBy=cron 的 content 單，會跟今天 5 篇去重）②4h timeout 下單租戶全量批跑完 ③心跳帶 cost 的失敗記帳雖不求觸發、但 job doc 途中就該看得到 cost 累計
- **D4 異地備份**：觸發條件「任一真付費客戶」——10 租戶第一家付費建檔前必補（FOUNDATION D4）
- INLY batch 2026-07-21 是混批（早輪 4 引擎完整 312＋午輪 5 引擎部分 346 同 batchId）：空位題判定無害，但引擎提及率有輕微加權偏差；下週一 cron 乾淨批自然覆蓋，不動資料
- admin 新文案（每輪篇數/首輪加碼 5 篇）視覺未經真人瀏覽器確認——Adam 開後台掃一眼
- W31 週一（7/27）15:00 無人值守心跳＝beselfaviva＋INLY 兩家串行（~2h，4h timeout 下的首次實測）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-22 第1場。*
