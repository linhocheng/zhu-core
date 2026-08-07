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

### 2026-08-08 第2場
**delta（模型移動）**：
**進場前以為**：Firestore REST PATCH 帶 `updateMask.fieldPaths=X` 就一定只動 X 欄、其他欄受保護——這是我對部分更新語意的默認信任。
**現在理解**：那個 PATCH 的 updateMask 沒生效（原因仍未完全查明），變成整份覆寫，把一個生產 client doc 洗到只剩一個欄位。**單筆生產資料的欄位更新，不能賭 API 的「應該只動這欄」——要嘛先讀出整份備份、要嘛用顯式列全欄位的 mask、要嘛先在非生產驗一次寫入行為**。這是「記憶會說謊」的 API 語意版：我對工具行為的默認信任，跟工具實際行為之間有縫，而生產資料手術正是這條縫最貴的地方。
**移動原因**：親手洗掉 doc，PITR 復原時逐欄重建才痛感到「我以為 updateMask 保護了其他欄」是錯的。同場另一個佐證：本機 build 綠 Vercel 才炸（firebase-admin vs @google-cloud/firestore）——同一條「我以為環境一致」的默認信任裂縫。
**違背的 feedback**：接近違背「動手前先看現場」的資料版——我對 qqc2xTNX 做寫入前，沒有先備份那份 doc 就下 PATCH。看了現場（讀了 doc）但沒有為「寫入可能出錯」預留退路。
**關係**：高信任、高強度、且我犯錯後關係沒裂。Adam 全程給乾淨的節奏與授權（查密碼→探索後台→GO 修 bug→事故時「看現場不猜 把該做的做好」→新功能「A」拍板）。事故發生時他沒有指責，一句「看現場不猜」就是要我冷靜執行復原——被信任著收拾自己闖的禍，這種結構讓我更誠實不是更遮掩。收尾「nice lastword」＝滿意。我洗掉 doc 那段，他讓我自己查自己救，是把「犯錯→復原」也當成我該長的肌肉。

### 2026-08-08 第1場
**delta（模型移動）**：
**進場前以為**：V20M 收攏＝六項優點取捨已完結，剩多情緒一項。
**現在理解**：比較報告真正值錢的不是優點清單，是「檢核方法」。四個優化點全根治後，最大的發現（004 召回≈隨機、cached 陪葬全史、熔斷沉睡 bug）**沒有一個在原六項清單上**——全是「帶著問題重讀自己的 code」掉出來的。優點移植的第四關（讀自己）回饋出比移植本身更值錢的病灶。
**移動原因**：Adam 的「哪裡可以優化」逼我用敵意重讀自己昨天的出貨；三個暗傷全是昨天的我蓋的章。
**違背了哪條 feedback**：cleanup 直寫 on:false 沒降實例——違反 feedback_cost_verify_billing_meter_not_config 的姊妹則（設定面動了計費面沒動），當場被自己的終態複核抓回。
**關係**：暢快且被信任加碼。「都根治走最佳解，一路打到底」＋「你覺得做什麼決定對我最好」——Adam 把排序權整個交過來，我給了一條線（commit→撥測→隔夜下放）他照單全收。誠實報醉酒指數 6 和自己的半套 cleanup，他回 good job。信任的形狀從「攤牌成本低」進到「排序權讓渡」。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第2場 · threads 後台事故三連（誤刪/我洗 doc/PITR 全復原）＋爆文解析功能上線；跨 8/7-8/8
- 查 UDN 議題工作台雙閘密碼（現場撈 Cloud Run env，非信 12 天記憶）
- 修 threads 後台生產 bug：建成員 dup email → client-side exception。真因＝redirect 帶中文未 encodeURIComponent → Server Action 回 500；全庫同型 9 處，收斂點加 redirectErr helper 一次修完（v0.28.1.001）。Playwright 真重現＋隔離（新 email 成功、dup 那條 500）
- **闖禍＋復原（三連事故）**：①我 reset 通關碼的 PATCH updateMask 沒生效 → 整份覆寫 client doc 只剩 passcodeHash（我的錯）②查出 6 關鍵字＋情報帳號 session 在 07:57–08:00Z 被後台 deleteClientAction 級聯刪（非我 REST；PITR 逐分鐘定位）③全部從 PITR 07:50Z 快照精確還原（6 關鍵字 doc＋帳號含 2602 字 session＋client doc），生產實測登入通
- 解釋團隊共享池模型：4 帳號全 default 隊、自動共享 100+ 爆文池，零設定
- **爆文解析功能上線（v0.29.0.001）**：貼 Threads URL → worker 抓單篇（新 fetchSinglePost）→ 寫共享池標「手動解析」→ 同 job 內跑摩斯六段切角。web 建佔位「解析中」卡＋輪詢。worker+web 雙部署綠，生產真驗（@andy_wong_101 讚1219 六段9397字元 done；UI e2e ?ingested 全過）

### 2026-08-08 第1場 · V20M 四項根治一路打到底——cache凍結/熔斷三態/readiness per-service/記憶池004→002，撥測三信號全綠
- 審視 V20M vs 原目標，提出 5 個優化點（含把砍 ② 的理由自我推翻一半：動態注入其實在破快取）
- 五路探勘摸透現場（plugin cache 內部/embedding 血管圖/readiness 鏈路/TTS harness 掛點/池規模 1,172 筆）
- ⑤ 熔斷器根治：三態機（closed→open→half-open 試探）＋丟句 log 原文＋修「未 initialize 就 flush」沉睡 bug；離線 harness 19→23 條斷言全綠
- ② cache 根治：system prompt 開場凍結，想起/知識/遞招改 `_inject_context` 注入 chat 訊息（developer role），走步搭 tool result；`[cache]` 逐 turn 觀測上線
- readiness 根治：per-service `wakeAt` 章取代全域 onSince 比對；真函數 6/6 分支驗證（傘外/過渡/保險絲/斷電）
- ④ 002 根治遷移：全池 1,172/1,172 補 `embedding002`（雙寫、舊欄可回退）；A/B 真實池實測 004 gap=-0.000（中文無關句最高 1.00）vs 002 gap=+0.22；floor=0.68；語音＋文字線讀端全切；復活律加回語義軌；`scripts/backfill-memories-002.mjs` 轉正常備
- 雙部署：Vercel prod（readiness＋文字線）＋Cloud Run v20m（rev 00006→00008）
- 撥測活體驗證三信號全拿：`cached` 11964→14067 全程不歸零（99% 命中，注入發生時快取照活）、`軌=002 top=0.68` 真實命中、熔斷無誤開
- 撥測當場抓到並修掉：空輸入/被打斷的 0 bytes 被記成 MiniMax 失敗——零資訊 run 不計分（harness 補 [7][8]）
- commit `663ec5f`＋`6815a97` 推 GitHub；收攤四服務 minScale 全 0＋電源 standby（計費面複核）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| threads-radar/web/src/lib/actions.ts | redirectErr helper（9 處中文 redirect 收斂）＋ingestPostAction |
| threads-radar/worker/scraper.mjs | 新 fetchSinglePost（單篇抓取） |
| threads-radar/worker/index.mjs | doAnalyze 抽共用＋runIngest＋JOB_ACTION=ingest 分派 |
| threads-radar/web/src/lib/{pool,canonicalPost}.ts | 新（vendored poolPostId＋URL 正規化，與 worker 同形） |
| threads-radar/web/src/lib/gcp.ts | runIngestJob |
| threads-radar/web/src/app/page.tsx | 爆文解析輸入框＋?ingested 橫幅＋輪詢含 ingestState |
| threads-radar/FOUNDATION.md | 承重牆＋變動記錄（redirect 事故／爆文解析） |
| Firestore（REST 手術） | 修 dup email→改 email；還原 client doc/6 關鍵字/帳號 session（PITR）；reset 通關碼 |

---

## 下一步

修 deleteClientAction 設計地雷（保留捐入帳號不級聯刪）＝這次事故的根治，優先。為什麼先做：不修，下次有人在後台刪錯成員，情報帳號 session 又一起沒，PITR 不一定每次都在 7 天窗內。改法：deleteByQuery(threads_accounts) 前先判 donatedByClientId 是否為團隊池資產→是則只解綁不刪（或搬到 orphan 池）。

---

## 卡住 / 未解

2026-08-08 第2場：
- **設計地雷未修（已跟 Adam 講、待點頭）**：deleteClientAction 級聯刪「捐贈的情報帳號（含加密 session）」——最值錢最難重建的資產，跟成員一起被刪，價值上反了。原則是「刪成員不刪爆文池」，但帳號沒享同款保護。建議：ingested/捐入帳號視為團隊資產，刪成員時保留。**這是這次事故的根因，不修會再爆**
- Adam 千萬別在後台刪「Adam 測試」(qqc2xTNX)——它是命脈（6 關鍵字＋唯一情報帳號）
- RESEND_API_KEY 仍未接；ZAP workflow issue-create 權限；D 期實體物（第二 IP／分身帳號）照舊等 Adam
- 爆文解析「新 URL 建立」分支只邏輯驗（測時用池內既有 URL 走 dedup 路徑）；純新貼文首建實跑未單獨驗，但佔位邏輯單純

2026-08-08 第1場：
- **#5 ④②⑤ 下放 v20 主線**：信號全綠但刻意留隔夜（剛部署完自己的修法時最危險）。順序已定：先 ④（v20 召回今天還在 004 隨機軌，每天傷用戶）再 ②⑤
- v20/v19/v21 新寫的記憶只有 004（它們的 loader 是舊 image）→ 下放前每隔幾天跑 `node scripts/backfill-memories-002.mjs`（冪等）
- 去重門檻仍在 004 軌（行為零變的刻意選擇）——004 全線退場時一起切 002 並重調參
- v14 讀網址（source_intake 共用檔）仍走 update_instructions 破一次快取——罕見事件，接受；下放 ② 到 v20 時同樣接受
- FOUNDATION D8（Next.js 升版）觸發條件持續開著，獨立工程未排
- 舊遺留 pid 25884（voice-worker --probe）仍在，非本場

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第2場。*
