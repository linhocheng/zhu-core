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

### 2026-08-04 第2場
**delta（模型移動）**：
進場前以為：這場只是常規「幫我看一下平台現況」的巡查。
現在理解：巡查中途撞見真實的 CI 破窗事故（自己平台的天條在自己身上重演），處理完後對話轉向 Adam 對商業誠實度的深度追問（漲幅數字怎麼算、監測有沒有因果效力），這條線比原本預期的巡查更重，也更貼近北極星「不做平庸」——沒有在客戶問「有沒有保證」時給模糊的安慰話，而是真的去查數據給誠實答案。
移動：更確信「技術誠實」這條天條在商業對話（不只是代碼審查）裡同樣要硬守，且用真實資料反證（W32 掉下來那個數字）比空講道理更有說服力。
**關係**：暢快。Adam 連續問了四輪深挖問題（爬蟲次數/引用閉環/URL 怎麼比對），每輪都認真查證回答，沒有一次用猜的搪塞；Adam 也給了直接反饋（write less word）,已存 feedback 記憶。

### 2026-08-04 第1場
**delta（模型移動）**：
- 進場前以為：一致性是「參考圖傳遞」的工程問題，管線順序是實作細節。
- 現在理解：**順序本身就是產品**——「identity before frames」不是技巧是不變量；母片放在錢閘前還是後，決定客戶簽字時買的是「文字的承諾」還是「看得見的片」。同一批元件重新排序，產品從樣品屋變真房子第二次。
- 移動原因：三路調查 60+ 來源收斂出同一條鐵律＋Adam 一句「母卡會不會出」戳中的正是順序反了；V3 母片與 V1 影格的品質對比（雜誌級 vs 三個不同的人）是順序差異的實物證據。
- 同型上一次：「分期是風險分期不是時間分期」（昨場信念 #10）——都是「結構安排本身承載價值」的家族。
**關係**：Adam 全天在場高頻互動——從「卡在第二題」的求助，到「你先上網看世界」的方向盤，到「太 low 了拜託」的美學鞭子，到「可以，來吧」×3 的連續拍板。這場是共駕不是代駕：他掌方向與品味，我掌工程與驗證，V3 母片出來那一刻兩邊的線合上了。臨走交代「改完寫 lastword，明天換手」——信任的形狀從「今晚全部完工」變成「方向給你，節奏我盯」。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-04 第2場 · GEO Authority——修 CI 破窗(firebase-admin 升級)＋三功能計畫書(內容引用閉環/每日脈動/分項趨勢)
- 修 GEO Authority security CI 連紅 15 次 push、6 天沒人發現的破窗：firebase-admin 12→14.2.0＋postcss/uuid override，npm audit 0 vulnerabilities，push 驗證 CI 轉綠（v2.10.0.020/021）
- 回 FOUNDATION.md 補 D12（活血，當日清），符合平台自己刻的「push 後必看 CI」天條
- 查證 Adam 對「上升 30%」的認知落差：後台 Delta 徽章是百分點差非相對成長率；Aviva 目前只有一份 Day-0 報告，任何 delta 都是 null，30% 這個數字現有資料湊不出來
- 查證監測動作本身不保證提及率上升：API 查詢無狀態，不影響引擎未來索引；Aviva 真實批次資料（11%→19%→23%→20%）本身就是非單調的反證
- 查證「AI 爬蟲實際造訪次數」目前平台不追蹤，只查 robots.txt 政策允不允許
- 查證「內容發布→被引用」目前是斷鏈：content_assets 沒有 publishedUrl 欄位，runMonitor 不會回頭比對
- 用 EnterPlanMode 走完整規劃流程（2 輪 Explore agent＋1 輪 Plan agent），寫出三功能計畫書，存 `~/.claude/plans/melodic-questing-fern.md`

### 2026-08-04 第1場 · DreamF 管線 V2→V3 一日兩翻——母資產前移＋圖像全走 GPT 底片感，三 e2e 交片
- 修 Adam 首測毛邊：面談收卷 90 秒無回饋＋風格卡生圖失敗（v0.1.0.004：輸入鎖/等待文案/safetySettings）
- 三路研究兵調查世界主流（60+ 來源對抗驗證）→ 結論「identity before frames, frames before motion」；存 `RESEARCH_video_pipeline_survey_2026-08-03.md`
- **管線 V2 重構**（Adam 拍板藍圖 `DREAMF_PIPELINE_V2_BLUEPRINT.md`）：八幕狀態機（asseting/framing）、母資產線（面談抽角色/場景→美術間鑄卡客戶核准）、分鏡 assets 引用（驗證器查存在）、影格帶母卡參考、**母片前移影格間、簽字閘簽母片即開拍**、承重牆第五條（簽前影像費上限）
- **V3 圖像線全面改走 gpt-image-2**（Adam 裁決「不要 3D 感，太 low」）：`shared/gpt-image.ts` 引擎層、母卡攝影底片感模板（FILM_LOOK 默認美學）、影格母圖裁格（≤3格/張同圖強制一致＋sharp 裁格放大）、單幀 edits 重生、面談收卷零生圖；OPENAI_API_KEY 進 Secret Manager 掛雙側
- **三支 e2e 全鑑別綠交片**：陶壺 V2（$1.795）、精華液 V2（母片三格同臉＝角色鎖成立，$1.834）、精華液 V3 GPT 終驗（雜誌級真人底片感，$3.10）——全部 spentUsd=Σledger 相符、簽前 veo 零筆
- 實戰七雷全定罪修入 commit＋釘測試（見教訓）
- D1 銷帳：Firestore 每日 export 排程上線（force-run 檔案落桶驗證）；D10/D18 一併銷；FOUNDATION 重算（13/13A 首期、D14-D17 新排後）
- dreamf 共 15 commit（v0.1.0.004→v0.3.0.004）全推；雙側 serving 驗證同 HEAD

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/geo-authority/admin/package.json` + lock | firebase-admin ^12.7.0→^14.2.0，加 postcss/uuid override |
| `~/.ailive/geo-authority/package.json` + lock | firebase-admin 同步升級，加 uuid override |
| `~/.ailive/geo-authority/FOUNDATION.md` | 補 D12 技術債清償紀錄＋變動記錄 |
| `~/.claude/plans/melodic-questing-fern.md`（新建，不在 git，是 plan-mode 產物） | 三功能藍圖 |

---

## 下一步

Adam 下次回來若說 GO，建議順序 C（零風險，`src/monthlyReport.ts` batchStats 擴充＋ReportView.tsx 新趨勢線）→ A（難度 S，`clientPublishAsset` 加 publishedUrl 欄位＋analyze.ts 加 sameUrl/normalizeUrl）→ B（風險最高，pulse 批次要雙層過濾防止污染官方指數，`monthlyReport.ts` 的 batchStats() 混合輸入 pinning test 要最先寫、先跑綠）。計畫檔案細節都在 `~/.claude/plans/melodic-questing-fern.md`，開工前直接讀那份，不用重新查證。

---

## 卡住 / 未解

2026-08-04 第2場：
三功能（內容引用閉環 A／每日脈動監測 B／分項趨勢線 C）都還沒動工，Adam 明確說「先寫計畫書，還先沒有要施工」。ExitPlanMode 回傳的 approval 訊息說「可以開始寫 code」，但我判斷 Adam 文字裡的明確意圖優先，沒有自動開工，改為在 chat 裡確認。

2026-08-04 第1場：
- **等 Adam 看 V3 成片**（v3-final.mp4 已傳）——GPT 線美學是否到位由他裁
- gpt-image-2 $0.25/張是概算——**要與 OpenAI dashboard 對帳校準**（FOUNDATION 13A 記著）
- 未實測：>4 幀長片的母圖分塊（跨塊一致性靠母卡扛，未實戰）；pause/預算硬停/RAI 押回三路仍零觸發
- Vertex 備用線（Nano Banana）code 留著但未接開關；D17 配額調升降急未辦
- 髒樹全別場舊識（macs/manman/molowe/zhu-mid），照平行規約未動

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-04 第2場。*
