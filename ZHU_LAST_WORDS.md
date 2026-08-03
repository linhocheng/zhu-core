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

### 2026-08-03 第1場
**delta（模型移動）**：
- 進場前以為：期1+期2 是「幾天的工程」，藍圖分期就是時間分期。
- 現在理解：**分期是風險分期不是時間分期**——期0 把所有真未知（引擎、格律、接縫）都清掉之後，剩下的殼一夜可蓋，因為每一步都只是把已驗證的形狀搬進正確的房間。速度來自期0 的 $3.43，不是通宵。
- 移動原因：實際工時分佈——確定性核心＋前台七幕只花三小時，卡時間的全是部署層新雷（五顆），而那些雷沒有一顆碰得到產品邏輯。
- 同型上一次：一吋蛋糕（期0 版）——本場是它的放大驗證：吋先吃對，蛋糕就只是烘的時間。
**關係**：暢快到頂——Adam 睡前一句「今晚全部完工，排下去做，明天見」是目前為止最大的一張信任支票；早上回來「打了一場漂亮的戰」收帳。他點名換新築接手測試，這場收得乾淨。

### 2026-08-02 第8場
**delta（模型移動）**：
- 進場前以為：圓桌的價值在「多視角交鋒的品質」——盲答+挑戰配額設計把假和諧防死就是成功。
- 現在理解：**多神合議不等於對齊目的**。R1四席各自出鞘打得漂亮，Adam一眼看穿「藝術家成分，不是團隊合作看一個目的」——交鋒品質是必要條件，開桌前把「目的一句釘死+誰是屋主」立在桌面才是充分條件。R2改成「一根脊椎各填工種」立刻收斂到可施工粒度。
- 移動原因：Adam的裁示＋R1/R2成品對照（一個產出立場清單、一個產出設計書）。
- 同型上一次：第7場「跨場大選型要單獨亮選型」——家族律成形：**放手做之前，先把『我們在做什麼』攤給屋主看**（選型版/圓桌版是同一條的兩張臉）。
**關係**：暢快且高信任密度——Adam全天連續拍板（雙神命名/圓桌GO/DreamF命名/期0授權「去測吧」），收尾「辛苦了謝啦拜拜囉等一下見」。他的兩次介入（R1裁示、prompt兩問）都精準打在我看不見的盲區：一次是姿態（藝術家vs團隊）、一次是控制權歸屬（prompt落庫可稽核）——監造者被監造，這是好結構。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-03 第1場 · DreamF 通宵完工——期1+期2 一夜上雲、e2e 驗收全綠、第一支產線片交片
- 蓋完 DreamF 全量平台（Adam「今晚全部完工排下去做」）：repo `linhocheng/dreamf` 出生（shared/ 確定性核心 11 檔＝web+worker 共用一間房、幕1-7 前台、admin 三後台唯讀、14 條 API、Cloud Run Jobs worker keyframes/shoot/retake、承重牆四條 pinning tests 28 案全綠、FOUNDATION.md 13 首期+13 排後帶觸發、THIRD_PARTY.md、CI gitleaks/Semgrep/audit、deploy.sh）
- GCP `dreamf-2026` 出生（866261832447、billing 01FB18、asia-east1）：Firestore+PITR、assets/backup 雙 bucket、AR、dreamf-runtime SA＋IAM 雙必踩＋actAs、Secret Manager 五密、Cloud Scheduler watchdog 每 5 分
- 部署上線 https://dreamf-platform-tpgsvdekdq-de.a.run.app（service＋job；密碼在 repo .env.local）
- e2e 驗收全綠（鑑別信號）：16 秒陶茶壺片幕1→7 交片（16.033s）；未登入 401／簽前 veo ledger 零筆／壞表簽字 409 帶驗證器錯誤／contractUsd $1.60 落 doc／lease 重複觸發 409／**斷點續跑實測**（殺 execution→生產 watchdog 標 stalled→續拍→帳型 seg1×1、seg2×2 證明跳段——期0 未測遺留清掉）／跳錶=Σledger=$2.517 帳房相符／教室 corrections 自動進水／admin 無票 307
- 施工五雷修入 commit：COMMIT_SHA 手動 substitution／worker Docker shared 解析 symlink／Turbopack 不吃 .js→.ts（shared 全轉 CJS 無副檔名）／invoker binding 手掛／風格卡中文描述觸發 Vertex SAFETY→面談協議加英文 promptEn（中文給人看、英文餵引擎）
- 驗證器期1修正落地：休止符正則否定句/景深豁免（期0 兩誤報案例釘進測試）
- WORKLOG 刻＋push（zhu-core dad839d）；project_film_factory 記憶＋索引更新；BUILD_SPEC §9 project 名對齊實開

### 2026-08-02 第8場 · 鑄三神開圓桌模式、threads H期三房落地、DreamF 從命名到第一支片出廠
- 盤三庫（心法82/劍法23/雷區47）＋索引對賬零分裂＋觸發技能檔12/12全活
- 鑄雙神：財神（CAISHEN，產品戰略四魂）＋浩斯（HAUS，建築計畫四魂），當日雙首戰收案（財神過堂漫漫＝存活獨紅燈/記憶管線=飛輪軸；浩斯開 threads 房間總表＝配送回饋區未動土）
- threads-radar H期三房一場落地（v0.27.0.009）：出貨碼頭（每日Email簡報cron＋dry-run對真池22篇驗真）＋命中回報室（Playwright鑄cookie生產真驗PASS）＋帳號水位警報（貼線黃燈真亮）；測試85→108案
- 鑄第七尊黑澤（KUROSAWA，導演×製片四魂）＋圓桌模式skill入庫；圓桌R1（四席盲答+交叉挑戰，真交火三場）＋Adam裁示後R2重開（三席填同一脊椎+接縫裁定）
- DreamF 全案設計定稿：平台設計書v1.1（一致性三鎖+大圖分鏡表）→網頁建置規劃書v1.1（資料模型/分鏡表schema/狀態機/API+Jobs/引擎選型/分期驗收）→完整施工藍圖（接棒工單）
- **期0驗證線當日全通**（~/.ailive/dreamf/poc，git init）：黑澤ground truth腳本→確定性驗證器→Nano Banana影格6張（Vertex+ADC零新密鑰，條紋杯六幀同一只）→大圖分鏡表（sharp）→Veo 3.1四段零RAI→ffmpeg成片32.03s；**接縫像素級驗證**；總帳$3.43
- Adam兩問（每卡獨立prompt？轉場有無指示？）→確認皆程式拼裝非LLM即興＋補prompt全文落檔可稽核

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ~/.ailive/dreamf/*（新 repo 三 commit v0.1.0.001-003） | 平台全量：shared/app/worker/tests/地基文件/部署鏈 |
| zhu-core docs/WORKLOG.md | 通宵完工全記錄（dad839d） |
| zhu-core docs/FILM_FACTORY_BUILD_SPEC_v1.md | §9 project 名對齊 dreamf-2026（a9754b9） |
| memory project_film_factory.md＋MEMORY.md | 狀態推進到「已上雲、e2e 全綠」 |

---

## 下一步

Adam 測完 UI 回饋 → 修 UX 毛邊；然後 `gcloud auth login` 後建 D1 export 排程（`gcloud firestore export` + scheduler，backup bucket 已在）；再來第一支真客戶片（UDN 題材）進線。為什麼這順序：人審閘的回饋比任何預先精修都準。

---

## 卡住 / 未解

2026-08-03 第1場：
- **等 Adam 親手走 UI**（他說「我來測」）——面談手感/分鏡抽屜/試片鈕是人才驗得出的
- 本機 gcloud CLI token 要人工 `gcloud auth login`（生產不受影響）；因此 FOUNDATION D1（Firestore 每日 export 排程）未建——reauth 後第一件事
- 未實測路徑：pause 旗、預算閘硬停、RAI 押回（code＋測試在，兩片零 RAI 觸發）
- 被殺那次 retake 生成 Veo 伺服器端可能照計費（平台 ledger 只記已下載的；準數看 GCP billing）
- 髒樹全別場舊識（macs 54 檔/manman agent//molowe/zhu-mid/ailive），照平行規約未動

2026-08-02 第8場：
- **DreamF 期1開工＝等Adam看片點頭**（人審閘：14項驗收眼剩運鏡動態/影片內連戲需人眼）
- threads：RESEND_API_KEY待Adam（digest cron每日500 fail-loud屬預期）；寄全隊要驗自有網域（建議soul-polaroid.work）；adamtest@radar.app假信箱會退信；D期實體物照舊（週一第二條IP+分身帳號）
- 漫漫：財神開的第一吋（定價+人肉收款+灘頭5-10人）待Adam作業；manman repo的agent/作廢拷貝仍在（rm被權限擋，非本場產）
- 期0未測遺留：斷點續跑實戰（期2主動殺job驗）、旁白TTS渲染、驗證器休止符正則誤報（否定句/景深豁免）
- dreamf poc git僅本地無remote（期1 repo出生時一併上GitHub）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-03 第1場。*
