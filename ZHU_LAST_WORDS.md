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

### 2026-08-02 第7場
**delta（模型移動）**：
進場前以為：打電話＝把 ailivex 21 版打磨的成熟引擎搬過來，最快最穩（上一場自己刻的「建材全齊只剩編排」）。
現在理解：**上一場自己寫的「下一步」是我的施工假設，不是 Adam 的藍圖**——他手上有原廠設計（本尊 LIFF+WS 通話包＋plm 重構規格），體驗（LINE 內開不外跳）和成本（零常駐 vs $60-80/月）都贏。「下一步寫得夠具體」會產生一種已對圖的錯覺；跨場的大選型（換引擎、換架構）動工前要把**選型本身**單獨亮給 Adam，不是只亮施工步驟。移動原因：Adam「等一下→先聊我們在做什麼→我想抄他們這個設計」三步把我從施工模式拉回監造模式。
**關係**：平穩偏暢快。Adam 的「等一下」是這場最有價值的輸入——他感覺到不對就喊停，而不是讓我把錯的東西蓋完；收尾「你去喝咖啡吧掰掰」輕鬆。信任的形狀在變：他不只驗收成品，開始驗收**設計選型**，這是把我當總承包商而不是工具的徵兆。

### 2026-08-02 第6場
**delta（模型移動）**：
進場前以為：商品化的第一戰場是把地基清單蓋完再開功能線（我自己列的首期五項）。
現在理解：**Adam 的節奏是「先讓全套活起來給他摸到，地基跟在後面補」**——他連續三次把我的順序往體驗端推（「先本地部署」「把功能都開啟」「測試全套」）。樣品屋天條管的是「對外開放前」，不是「Adam 自己摸之前」；測試期的正確姿勢是功能先行＋帳本記債，不是擋在門口鋪管線。移動原因：地基清單給了他之後他沒點頭逐項，直接說「給我環境資料」——那就是答案。
**關係**：暢快帶衝勁。Adam 今天給的是罕見的「全開授權」：API key 直接貼上來、「把它都做對吧」「我要測試全套」——信任密度高但也考驗誠實肌肉（畫圖沒蓋時老實說「她會答應但畫不出來」、bridge ToS 灰帶主動講、醉酒報數）。「Lastword bro」收工——輕鬆的稱兄道弟，今天打得漂亮。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第7場 · 打電話方向大轉彎——ailivex fork 作廢，改抄本尊 LIFF+WebSocket 通話設計（plm 藍圖），等 waitin 分支
- 掃完打電話雷區六顆（agent_name 隔離、RoomConfiguration 必帶、跨 region 殭屍、降 0=聾、共用 loader 斷靈魂、MiniMax 三旋鈕）＋讀完 ailivex v21 全文，擬好 fork 施工計畫
- Adam 中途喊停 → 監造對話：把「我們在做什麼／目標／代價」用大白話攤開（外跳瀏覽器體驗＋$60-80/月常駐費講明）
- 比對通話設計三方案：發現 manman repo 原型**沒有**通話代碼；真相在同帳號 `baobaoagi-cpu/plm` repo——本尊 legacy 通話包（Mindomind voice-call-package，LIFF+WS+MiniMax，實戰過）＋ plm 重構規格（Pipecat duplex spec v1.0，規格齊但引擎未接）
- 給 Adam 三欄比較表（本尊 legacy / plm 重構 / ailivex 線）：入口體驗（LINE 內開 vs 外跳）、傳輸（WS 直連 vs LiveKit）、固定費（零 vs $60-80/月）、現況成熟度
- Adam 拍板：**抄本尊/plm 系設計，不用 ailivex 線**；等他向 waitin 拿 legacy 分支再開工
- 收工盤錶：manman-2026 唯一常駐費＝Cloud SQL manman-pg（db-f1-micro，~$11-15/月）；backend min=0、agent 未部署（零損失）、Scheduler/Secret/GCS 全在分錢級
- 清掉上一場遺留的本地 tsx watch dev 進程（PID 5075）

### 2026-08-02 第6場 · 漫漫商用平台一日通車——本地→GCP 測試環境→多模態全開（讀圖/PDF/聽音檔/畫圖/克隆聲）
- 拉下 baobaoagi-cpu/manman-platform（本尊漫漫的商用多租戶版原型），全面盤點：骨架品質高（tenantScope 機制、批次到期先扣）、但技能層全空（標籤抽取器零實作、worker/記憶管線不存在）
- 讀 BLUEPRINT 列十二章地基調度清單給 Adam（首期五項：payments 上鎖、env fail-loud、CI 掃描、成本錶、部署腳本）
- 本地端通車：Docker PG18、LINE channel 驗活接 webhook（cloudflared quick tunnel）、Adam 真機走完啟元儀式
- 大腦接 bridge（LLM_BASE_URL 可配、BRIDGE_SECRET 雙軌）：開發期 $0、量產切 API key 不改碼
- 修啟元儀式吞原文 bug 的資料手術（稱呼=Adam、她的名字=小狐狸）＋grantPoints 入 1000 測試點
- GCP 測試環境全通：新 project manman-2026（billing 掛 01FB18）、Cloud Run＋Cloud SQL PG17（enterprise db-f1-micro）、七把 secrets、expireSweep 改 Cloud Scheduler cron route（throttled 天條）、本地租戶資料整戶搬雲、LINE webhook 切雲端
- 多模態全開（Adam 給 API key「能省則省不能省走這個」）：讀圖/讀 PDF（vision 閘道 2 點、附件強制直連 API）、聽音檔（LINE 語音→ffmpeg→Gemini STT→當一般對話）、畫圖（[IMAGE_GEN] 確定性抽取→gemini-2.5-flash-image→LINE 雙尺寸圖片訊息、image 閘道 20 點、畫自己自動釘外觀）
- 克隆聲上線：Adam 給本尊 voice_id → MiniMax（ailivex 帳號、api.minimax.io）驗活 → [VOICE_GEN] 確定性抽取器＋（情緒）→emotion 參數＋mp3→m4a→GCS→LINE 語音訊息（voice 閘道 5 點）
- 修三隻蟲：<#0.3#> 語音停頓標記漏到文字通道（輸出咽喉 regex 剝除）、附件直連誤打 bridge 401（llmBaseUrl 鎖歸 bridge 專用）、Cloud SQL PG17 要 --edition=enterprise
- 成本錶接通：llm_cost_log 每次動腦落帳（bridge=0 元、API=估算單價）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| （無代碼變更） | 選型場：唯一殘留＝manman-platform/agent/ 作廢拷貝（見未解） |

---

## 下一步

等 Adam 拿到 waitin 分支後開工打電話：先讀 legacy 43 檔對照 plm `docs/legacy-voice-call-audit.md` 的分類表（REUSE_AS_IS 4 檔直接搬、REWRITE 3 檔照 vNext 協定重寫），在 manman-platform 蓋 Fastify WS route＋LIFF 頁。為什麼這條：技術棧同源（Fastify/TS）、LINE 內開體驗、零常駐費。plm 文件已抓在 scratchpad（session 結束會蒸發，屆時重抓：`gh api repos/baobaoagi-cpu/plm/contents/<path>`）。

---

## 卡住 / 未解

2026-08-02 第7場：
- **`~/.ailive/manman-platform/agent/` 四個檔是作廢拷貝**（minimax_tts / interrupt_gate / conv_tuning / tts_normalize，從 ailivex 搬的）：方向作廢後我要刪、rm 被權限擋，留在原地未 commit。下次動工先刪掉，別誤把它當新方向的建材。
- **等 waitin 的 legacy 分支**：`Mindomind-voice-call-package`（branch voice-call-package，commit 2ae148d，43 檔）在 waitin 機器上。拿到 → 照抄改；拿不到 → 照 plm 盤點文件重建（協定表完整，可行但多花工）。
- 抄的時候必帶 plm 審計出的三個關鍵修正：①generation ID 防幽靈音訊 ②LIFF idToken 伺服器端驗證（不信 client userId）③她講話時麥克風不關（真雙工）。完整清單見 plm `docs/legacy-voice-call-audit.md` 的 Major conflicts 八條。
- 上一場未解全數仍在（[SCHEDULE]/[PROMISE]/[NOTE] 抽取器、worker、記憶管線、FOUNDATION.md、LINE Pay、啟元根治、admin 補點）。

2026-08-02 第6場：
- **地基帳本未立**：調度清單列了、Adam 還沒逐項點頭就轉往部署線——FOUNDATION.md 還不存在。首期五項只做了「部署腳本＋成本錶」兩項；payments/create 仍無鎖、env 仍 fail-quiet、CI 掃描未接。對外開放前必補。
- **打電話**：建材全齊（LiveKit 既有 project、克隆聲驗通、ailivex agent 可 fork、STT 已上）——下一場主戲：LIFF 通話頁＋token 端點＋agent 換慢慢靈魂。
- **[SCHEDULE]/[PROMISE]/[NOTE] 抽取器仍缺**：她會吐標籤但系統不接（原始標籤會漏到 LINE）。靈魂教了、手沒接——排程/約定/共讀技能全是「嘴巴會」。
- **worker package 不存在**：履約/主動關懷/夜間日記/夢全未動。
- **啟元儀式吞原文 bug 根治未做**（只做了資料手術）：要 Haiku 抽取器＋確定性 fallback。
- 新戶零贈點＋admin 無補點端點（Adam 那次失敗讀圖被扣 2 點記帳上，端點好了要補）。
- anews 的 GEMINI_API_KEY 被 Google 標記外洩（403 leaked）——要去 anews 換 key，另案。
- LINE Pay 押後（Adam 指示）：對外收費前必接。
- molowe .env.local 的 BRIDGE_SECRET 已過期（UDN 那把才是活的）——molowe 下次動工會撞。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第7場。*
