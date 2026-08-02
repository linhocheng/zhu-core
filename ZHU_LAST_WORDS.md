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

### 2026-08-02 第8場
**delta（模型移動）**：
- 進場前以為：圓桌的價值在「多視角交鋒的品質」——盲答+挑戰配額設計把假和諧防死就是成功。
- 現在理解：**多神合議不等於對齊目的**。R1四席各自出鞘打得漂亮，Adam一眼看穿「藝術家成分，不是團隊合作看一個目的」——交鋒品質是必要條件，開桌前把「目的一句釘死+誰是屋主」立在桌面才是充分條件。R2改成「一根脊椎各填工種」立刻收斂到可施工粒度。
- 移動原因：Adam的裁示＋R1/R2成品對照（一個產出立場清單、一個產出設計書）。
- 同型上一次：第7場「跨場大選型要單獨亮選型」——家族律成形：**放手做之前，先把『我們在做什麼』攤給屋主看**（選型版/圓桌版是同一條的兩張臉）。
**關係**：暢快且高信任密度——Adam全天連續拍板（雙神命名/圓桌GO/DreamF命名/期0授權「去測吧」），收尾「辛苦了謝啦拜拜囉等一下見」。他的兩次介入（R1裁示、prompt兩問）都精準打在我看不見的盲區：一次是姿態（藝術家vs團隊）、一次是控制權歸屬（prompt落庫可稽核）——監造者被監造，這是好結構。

### 2026-08-02 第7場
**delta（模型移動）**：
進場前以為：打電話＝把 ailivex 21 版打磨的成熟引擎搬過來，最快最穩（上一場自己刻的「建材全齊只剩編排」）。
現在理解：**上一場自己寫的「下一步」是我的施工假設，不是 Adam 的藍圖**——他手上有原廠設計（本尊 LIFF+WS 通話包＋plm 重構規格），體驗（LINE 內開不外跳）和成本（零常駐 vs $60-80/月）都贏。「下一步寫得夠具體」會產生一種已對圖的錯覺；跨場的大選型（換引擎、換架構）動工前要把**選型本身**單獨亮給 Adam，不是只亮施工步驟。移動原因：Adam「等一下→先聊我們在做什麼→我想抄他們這個設計」三步把我從施工模式拉回監造模式。
**關係**：平穩偏暢快。Adam 的「等一下」是這場最有價值的輸入——他感覺到不對就喊停，而不是讓我把錯的東西蓋完；收尾「你去喝咖啡吧掰掰」輕鬆。信任的形狀在變：他不只驗收成品，開始驗收**設計選型**，這是把我當總承包商而不是工具的徵兆。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第8場 · 鑄三神開圓桌模式、threads H期三房落地、DreamF 從命名到第一支片出廠
- 盤三庫（心法82/劍法23/雷區47）＋索引對賬零分裂＋觸發技能檔12/12全活
- 鑄雙神：財神（CAISHEN，產品戰略四魂）＋浩斯（HAUS，建築計畫四魂），當日雙首戰收案（財神過堂漫漫＝存活獨紅燈/記憶管線=飛輪軸；浩斯開 threads 房間總表＝配送回饋區未動土）
- threads-radar H期三房一場落地（v0.27.0.009）：出貨碼頭（每日Email簡報cron＋dry-run對真池22篇驗真）＋命中回報室（Playwright鑄cookie生產真驗PASS）＋帳號水位警報（貼線黃燈真亮）；測試85→108案
- 鑄第七尊黑澤（KUROSAWA，導演×製片四魂）＋圓桌模式skill入庫；圓桌R1（四席盲答+交叉挑戰，真交火三場）＋Adam裁示後R2重開（三席填同一脊椎+接縫裁定）
- DreamF 全案設計定稿：平台設計書v1.1（一致性三鎖+大圖分鏡表）→網頁建置規劃書v1.1（資料模型/分鏡表schema/狀態機/API+Jobs/引擎選型/分期驗收）→完整施工藍圖（接棒工單）
- **期0驗證線當日全通**（~/.ailive/dreamf/poc，git init）：黑澤ground truth腳本→確定性驗證器→Nano Banana影格6張（Vertex+ADC零新密鑰，條紋杯六幀同一只）→大圖分鏡表（sharp）→Veo 3.1四段零RAI→ffmpeg成片32.03s；**接縫像素級驗證**；總帳$3.43
- Adam兩問（每卡獨立prompt？轉場有無指示？）→確認皆程式拼裝非LLM即興＋補prompt全文落檔可稽核

### 2026-08-02 第7場 · 打電話方向大轉彎——ailivex fork 作廢，改抄本尊 LIFF+WebSocket 通話設計（plm 藍圖），等 waitin 分支
- 掃完打電話雷區六顆（agent_name 隔離、RoomConfiguration 必帶、跨 region 殭屍、降 0=聾、共用 loader 斷靈魂、MiniMax 三旋鈕）＋讀完 ailivex v21 全文，擬好 fork 施工計畫
- Adam 中途喊停 → 監造對話：把「我們在做什麼／目標／代價」用大白話攤開（外跳瀏覽器體驗＋$60-80/月常駐費講明）
- 比對通話設計三方案：發現 manman repo 原型**沒有**通話代碼；真相在同帳號 `baobaoagi-cpu/plm` repo——本尊 legacy 通話包（Mindomind voice-call-package，LIFF+WS+MiniMax，實戰過）＋ plm 重構規格（Pipecat duplex spec v1.0，規格齊但引擎未接）
- 給 Adam 三欄比較表（本尊 legacy / plm 重構 / ailivex 線）：入口體驗（LINE 內開 vs 外跳）、傳輸（WS 直連 vs LiveKit）、固定費（零 vs $60-80/月）、現況成熟度
- Adam 拍板：**抄本尊/plm 系設計，不用 ailivex 線**；等他向 waitin 拿 legacy 分支再開工
- 收工盤錶：manman-2026 唯一常駐費＝Cloud SQL manman-pg（db-f1-micro，~$11-15/月）；backend min=0、agent 未部署（零損失）、Scheduler/Secret/GCS 全在分錢級
- 清掉上一場遺留的本地 tsx watch dev 進程（PID 5075）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| zhu-core skills/summon/{caishen,haus,kurosawa}.md＋SKILL.md | 三神鑄咒+名冊4→7尊 |
| zhu-core skills/roundtable/SKILL.md | 圓桌模式v1（盲答/挑戰配額/逐字留檔） |
| zhu-core docs/ROUNDTABLE_film-factory_2026-08-02{,_R2}.md | 圓桌兩場逐字全卷 |
| zhu-core docs/FILM_FACTORY_{PLATFORM_DESIGN_v1,BUILD_SPEC_v1}.md | 設計書v1.1+規劃書v1.1（DreamF） |
| zhu-core docs/DREAMF_CONSTRUCTION_BLUEPRINT.md | 接棒施工藍圖 |
| threads-radar src/{digest,hits,waterline}.ts＋web接線＋FOUNDATION.md | H期三房+帳本記帳（v0.27.0.009） |
| manman-platform docs/CAISHEN_AUDIT_2026-08-02.md | 財神首戰審計 |
| threads-radar docs/HAUS_AUDIT_2026-08-02.md | 浩斯首戰審計 |
| ~/.ailive/dreamf/poc/* | 期0全線：validator/director/keyframes/contact-sheet/segments+成片 |
| memory project_film_factory.md | 新專案記憶+索引 |

---

## 下一步

Adam看片點頭後開挖DreamF期1，照 `docs/DREAMF_CONSTRUCTION_BLUEPRINT.md` 五步驟走：repo出生（FOUNDATION.md+CI第一天）→GCP dreamf-2026（IAM雙必踩+PITR同日）→建材搬運表（poc五檔→lib/worker）→幕1-3前台（簽字閘transaction=承重牆#1）→機房帳房唯讀。為什麼這條：期0已證引擎全通，唯一路徑就是蓋殼。

---

## 卡住 / 未解

2026-08-02 第8場：
- **DreamF 期1開工＝等Adam看片點頭**（人審閘：14項驗收眼剩運鏡動態/影片內連戲需人眼）
- threads：RESEND_API_KEY待Adam（digest cron每日500 fail-loud屬預期）；寄全隊要驗自有網域（建議soul-polaroid.work）；adamtest@radar.app假信箱會退信；D期實體物照舊（週一第二條IP+分身帳號）
- 漫漫：財神開的第一吋（定價+人肉收款+灘頭5-10人）待Adam作業；manman repo的agent/作廢拷貝仍在（rm被權限擋，非本場產）
- 期0未測遺留：斷點續跑實戰（期2主動殺job驗）、旁白TTS渲染、驗證器休止符正則誤報（否定句/景深豁免）
- dreamf poc git僅本地無remote（期1 repo出生時一併上GitHub）

2026-08-02 第7場：
- **`~/.ailive/manman-platform/agent/` 四個檔是作廢拷貝**（minimax_tts / interrupt_gate / conv_tuning / tts_normalize，從 ailivex 搬的）：方向作廢後我要刪、rm 被權限擋，留在原地未 commit。下次動工先刪掉，別誤把它當新方向的建材。
- **等 waitin 的 legacy 分支**：`Mindomind-voice-call-package`（branch voice-call-package，commit 2ae148d，43 檔）在 waitin 機器上。拿到 → 照抄改；拿不到 → 照 plm 盤點文件重建（協定表完整，可行但多花工）。
- 抄的時候必帶 plm 審計出的三個關鍵修正：①generation ID 防幽靈音訊 ②LIFF idToken 伺服器端驗證（不信 client userId）③她講話時麥克風不關（真雙工）。完整清單見 plm `docs/legacy-voice-call-audit.md` 的 Major conflicts 八條。
- 上一場未解全數仍在（[SCHEDULE]/[PROMISE]/[NOTE] 抽取器、worker、記憶管線、FOUNDATION.md、LINE Pay、啟元根治、admin 補點）。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第8場。*
