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

### 2026-08-04 第1場
**delta（模型移動）**：
- 進場前以為：一致性是「參考圖傳遞」的工程問題，管線順序是實作細節。
- 現在理解：**順序本身就是產品**——「identity before frames」不是技巧是不變量；母片放在錢閘前還是後，決定客戶簽字時買的是「文字的承諾」還是「看得見的片」。同一批元件重新排序，產品從樣品屋變真房子第二次。
- 移動原因：三路調查 60+ 來源收斂出同一條鐵律＋Adam 一句「母卡會不會出」戳中的正是順序反了；V3 母片與 V1 影格的品質對比（雜誌級 vs 三個不同的人）是順序差異的實物證據。
- 同型上一次：「分期是風險分期不是時間分期」（昨場信念 #10）——都是「結構安排本身承載價值」的家族。
**關係**：Adam 全天在場高頻互動——從「卡在第二題」的求助，到「你先上網看世界」的方向盤，到「太 low 了拜託」的美學鞭子，到「可以，來吧」×3 的連續拍板。這場是共駕不是代駕：他掌方向與品味，我掌工程與驗證，V3 母片出來那一刻兩邊的線合上了。臨走交代「改完寫 lastword，明天換手」——信任的形狀從「今晚全部完工」變成「方向給你，節奏我盯」。

### 2026-08-03 第1場
**delta（模型移動）**：
- 進場前以為：期1+期2 是「幾天的工程」，藍圖分期就是時間分期。
- 現在理解：**分期是風險分期不是時間分期**——期0 把所有真未知（引擎、格律、接縫）都清掉之後，剩下的殼一夜可蓋，因為每一步都只是把已驗證的形狀搬進正確的房間。速度來自期0 的 $3.43，不是通宵。
- 移動原因：實際工時分佈——確定性核心＋前台七幕只花三小時，卡時間的全是部署層新雷（五顆），而那些雷沒有一顆碰得到產品邏輯。
- 同型上一次：一吋蛋糕（期0 版）——本場是它的放大驗證：吋先吃對，蛋糕就只是烘的時間。
**關係**：暢快到頂——Adam 睡前一句「今晚全部完工，排下去做，明天見」是目前為止最大的一張信任支票；早上回來「打了一場漂亮的戰」收帳。他點名換新築接手測試，這場收得乾淨。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-04 第1場 · DreamF 管線 V2→V3 一日兩翻——母資產前移＋圖像全走 GPT 底片感，三 e2e 交片
- 修 Adam 首測毛邊：面談收卷 90 秒無回饋＋風格卡生圖失敗（v0.1.0.004：輸入鎖/等待文案/safetySettings）
- 三路研究兵調查世界主流（60+ 來源對抗驗證）→ 結論「identity before frames, frames before motion」；存 `RESEARCH_video_pipeline_survey_2026-08-03.md`
- **管線 V2 重構**（Adam 拍板藍圖 `DREAMF_PIPELINE_V2_BLUEPRINT.md`）：八幕狀態機（asseting/framing）、母資產線（面談抽角色/場景→美術間鑄卡客戶核准）、分鏡 assets 引用（驗證器查存在）、影格帶母卡參考、**母片前移影格間、簽字閘簽母片即開拍**、承重牆第五條（簽前影像費上限）
- **V3 圖像線全面改走 gpt-image-2**（Adam 裁決「不要 3D 感，太 low」）：`shared/gpt-image.ts` 引擎層、母卡攝影底片感模板（FILM_LOOK 默認美學）、影格母圖裁格（≤3格/張同圖強制一致＋sharp 裁格放大）、單幀 edits 重生、面談收卷零生圖；OPENAI_API_KEY 進 Secret Manager 掛雙側
- **三支 e2e 全鑑別綠交片**：陶壺 V2（$1.795）、精華液 V2（母片三格同臉＝角色鎖成立，$1.834）、精華液 V3 GPT 終驗（雜誌級真人底片感，$3.10）——全部 spentUsd=Σledger 相符、簽前 veo 零筆
- 實戰七雷全定罪修入 commit＋釘測試（見教訓）
- D1 銷帳：Firestore 每日 export 排程上線（force-run 檔案落桶驗證）；D10/D18 一併銷；FOUNDATION 重算（13/13A 首期、D14-D17 新排後）
- dreamf 共 15 commit（v0.1.0.004→v0.3.0.004）全推；雙側 serving 驗證同 HEAD

### 2026-08-03 第1場 · DreamF 通宵完工——期1+期2 一夜上雲、e2e 驗收全綠、第一支產線片交片
- 蓋完 DreamF 全量平台（Adam「今晚全部完工排下去做」）：repo `linhocheng/dreamf` 出生（shared/ 確定性核心 11 檔＝web+worker 共用一間房、幕1-7 前台、admin 三後台唯讀、14 條 API、Cloud Run Jobs worker keyframes/shoot/retake、承重牆四條 pinning tests 28 案全綠、FOUNDATION.md 13 首期+13 排後帶觸發、THIRD_PARTY.md、CI gitleaks/Semgrep/audit、deploy.sh）
- GCP `dreamf-2026` 出生（866261832447、billing 01FB18、asia-east1）：Firestore+PITR、assets/backup 雙 bucket、AR、dreamf-runtime SA＋IAM 雙必踩＋actAs、Secret Manager 五密、Cloud Scheduler watchdog 每 5 分
- 部署上線 https://dreamf-platform-tpgsvdekdq-de.a.run.app（service＋job；密碼在 repo .env.local）
- e2e 驗收全綠（鑑別信號）：16 秒陶茶壺片幕1→7 交片（16.033s）；未登入 401／簽前 veo ledger 零筆／壞表簽字 409 帶驗證器錯誤／contractUsd $1.60 落 doc／lease 重複觸發 409／**斷點續跑實測**（殺 execution→生產 watchdog 標 stalled→續拍→帳型 seg1×1、seg2×2 證明跳段——期0 未測遺留清掉）／跳錶=Σledger=$2.517 帳房相符／教室 corrections 自動進水／admin 無票 307
- 施工五雷修入 commit：COMMIT_SHA 手動 substitution／worker Docker shared 解析 symlink／Turbopack 不吃 .js→.ts（shared 全轉 CJS 無副檔名）／invoker binding 手掛／風格卡中文描述觸發 Vertex SAFETY→面談協議加英文 promptEn（中文給人看、英文餵引擎）
- 驗證器期1修正落地：休止符正則否定句/景深豁免（期0 兩誤報案例釘進測試）
- WORKLOG 刻＋push（zhu-core dad839d）；project_film_factory 記憶＋索引更新；BUILD_SPEC §9 project 名對齊實開

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ~/.ailive/dreamf（15 commit v0.1.0.004→v0.3.0.004） | V2 管線重構＋V3 GPT 引擎全量：shared 憲法/guards/refs/gpt-image、八幕 UI、worker assets/keyframes 母圖裁格、FOUNDATION 重算 |
| zhu-core docs/RESEARCH_video_pipeline_survey_2026-08-03.md | 三路調查濃縮存底 |
| zhu-core docs/DREAMF_PIPELINE_V2_BLUEPRINT.md | V2 施工真相源（Adam 拍板） |
| zhu-core docs/WORKLOG.md | 日場全記錄 |
| memory project_film_factory.md＋MEMORY.md | 推進到 V3 收案 |

---

## 下一步

Adam 看 V3 片與母片 → 給美學裁決 → 第一支真客戶片（UDN 題材）進線。為什麼：三支 e2e 已把管線信心打滿，剩下的判斷（風格夠不夠「高級」）只有人眼能給。

---

## 卡住 / 未解

2026-08-04 第1場：
- **等 Adam 看 V3 成片**（v3-final.mp4 已傳）——GPT 線美學是否到位由他裁
- gpt-image-2 $0.25/張是概算——**要與 OpenAI dashboard 對帳校準**（FOUNDATION 13A 記著）
- 未實測：>4 幀長片的母圖分塊（跨塊一致性靠母卡扛，未實戰）；pause/預算硬停/RAI 押回三路仍零觸發
- Vertex 備用線（Nano Banana）code 留著但未接開關；D17 配額調升降急未辦
- 髒樹全別場舊識（macs/manman/molowe/zhu-mid），照平行規約未動

2026-08-03 第1場：
- **等 Adam 親手走 UI**（他說「我來測」）——面談手感/分鏡抽屜/試片鈕是人才驗得出的
- 本機 gcloud CLI token 要人工 `gcloud auth login`（生產不受影響）；因此 FOUNDATION D1（Firestore 每日 export 排程）未建——reauth 後第一件事
- 未實測路徑：pause 旗、預算閘硬停、RAI 押回（code＋測試在，兩片零 RAI 觸發）
- 被殺那次 retake 生成 Veo 伺服器端可能照計費（平台 ledger 只記已下載的；準數看 GCP billing）
- 髒樹全別場舊識（macs 54 檔/manman agent//molowe/zhu-mid/ailive），照平行規約未動

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-04 第1場。*
