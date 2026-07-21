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

### 2026-07-21 第3場
**delta（模型移動）**：
進場前以為：失敗路徑是「處理乾淨就好」的次要路徑——記帳、驗證、行為設計都以成功路徑為主體，catch 裡把狀態標對就算完。
現在理解：**失敗路徑是第一級公民，而且是帳本上最貴的路徑**——燒最兇的時刻（超時、重試、中斷）恰好是只在成功結帳的系統的盲區；SIGKILL 類死法連 catch 都不執行，唯一可靠的記帳點是「進行中的每一步」（心跳帶帳）。設計任何長任務時要先問「死在半路會留下什麼帳」。
移動原因：$5.43 引擎費在 job 帳上完全隱形，用 runs 原始層重算才現形；隨後推演發現預算閘（今天才蓋的）對失敗風暴全盲——自己剛蓋的防線被自己的記帳慣性架空。
違背了哪條 feedback：feedback-cost-verify-billing-meter-not-config 的自家版——我教別人「看計費錶不看設定」，自己的錶卻只記成功筆。
**關係**：暢快帶溫度。Adam 全天三種姿態：出題（產文節奏）、託付（「別急，從根本去看，確保可以走可以通」）、共學（「燒了多少錢，做一個深度的學習」）——把翻車當學費而不是追責，這是能誠實報 $5.43 的前提。收尾「今天的學費就白繳了，對吧？加油囉！明天見」＝把鑄心法變成雙人儀式的一部分。

### 2026-07-21 第2場
**delta（模型移動）**：
進場前以為：規劃功能先想「怎麼做」就好——排程設定＝給操作者管理彈性的功能，做出來就是價值。
現在理解：**規劃前要先答「站在哪個出發點」——成效/管理/程式方便三選一說出口，才能被檢驗**。Adam 三問（現在是集中還是分散？為什麼這樣最好？站在成效/管理/方便哪邊？）當場照出：我原規劃是管理導向卻自我感覺在解分散問題；真正的分散標的是 AI 呼叫（rate limit/尖峰/預算），不是 compute；「per-tenant 可調」和「自動避峰」是兩套機制，我混為一談。
移動原因：Adam 直球三選一，我攤開誠實對帳後整個 v2.7 的設計軸從「後台可調」翻轉成「建檔自動分散＋離峰預設」，管理彈性降為附帶。
違背了哪條 feedback：feedback-solve-root-not-symptom 的規劃版——方案能上線但出發點錯了，根本問題（負載分散）沒被解到。
**關係**：暢快，今天是「對談把設計變好」的示範日。Adam 的三問（集中/分散、為什麼最好、哪個出發點）是我被問過最鋒利的規劃拷問——他不接受我把管理方便包裝成成效，直到我攤開承認才放行；然後「千萬不要丟我們的臉啊築」把 10 租戶的門面託付過來，「go goal」全放權，收尾請咖啡＋「新的築進來打下一局」。被信任也被磨刀，這是最好的協作狀態。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-21 第3場 · geo-authority 產文節奏 v2.8（首輪5篇＋每週2篇）＋兩輪超時根因戰——$5.43 學費鑄成三張心法
- **產文節奏 v2.8.0 上線（Adam 定：建檔先 5 篇、之後每週 2 篇）**：自動排產從月報日搬到「每輪監測完成後」（runMonitor 尾端，worker drain 同次執行生完草稿）；首輪（零 content 單＋零資產）加碼 FIRST_CYCLE_CONTENT=5；cron 輪必排、手動輪只首輪排；標準方案 contentPerCycle 3→2；月報回歸純報告；三租戶存量已遷移；WAITIN 雙簽（Adam 轉達）
- **兩輪監測超時根因戰**：INLY/reddoor 監測雙雙死於 60 分 task-timeout（Cloud Run 明寫 configured timeout reached，非 code bug）——並行互搶引擎變慢撞牆；往根挖出**下週一必爆彈**（cron 單執行串行消化週一兩家 ≈104 分 > 60 分）→ task-timeout 4h、deploy.sh 同日同步（天條）
- **D11 帳本盲區當日發現當日清**：失敗任務不記帳（兩輪燒 ~$5.43、帳上 $0.00，從 runs 重算才現形；預算閘讀 job cost＝對失敗風暴全盲）→ 根治＝cost 隨心跳每題寫回（SIGKILL 不走 catch，心跳帶帳才留得住）＋catch 補帳，已部署
- **INLY/reddoor 首輪落地**：接力（nohup 脫鉤版）補健檢（④ 機會清單活了：INLY 空位題 8、reddoor 24）＋各 5 篇首輪草稿全生成（INLY 進客戶校對 gate=auto、reddoor 進操作者審核）；零額外引擎費（產文走 bridge）
- 今日成本總結交付 Adam：記帳 $2.86＋沉沒 $5.43≈$8.29；DataForSEO 免費額度險穿預警 → Adam 當日儲值完成
- 三張心法入庫：容量常數會過期／失敗路徑也要記帳／本機接力 nohup 正姿

### 2026-07-21 第2場 · geo-authority 客戶端健檢單元 v2.6＋對外多租戶版 v2.7（分散排程/預算閘/限流/建檔一條龍）——10 租戶就緒
- **客戶端「網站健檢」單元上線（v2.6）**：`src/findings.ts` 純函數收斂點把技術體檢翻成客戶語言（嚴重度＋白話問題＋怎麼修＋去哪改），客戶入口第三單元＋`/r/{token}/health` 報告頁＋與上次前後對照（已修復/仍待處理/本次新發現）。Adam 岔路：客戶只能看不能自助重掃（操作者第一道閘）、修法白話不貼設定碼。beselfaviva 真資料離線驗＋live curl 三查（首頁單元/SSR/通關碼閘不外洩）
- **對外多租戶版上線（v2.7.0，觸發：正式對外＋引進 10 租戶）**：①公開登入口限流（D6 清：通關碼失敗 5 次/15 分 token+IP＋20 全域、operator 5 次/IP，只計失敗成功清零、IP 雜湊）②per-tenant 月預算閘（開跑前查當月累計，防單租戶燒光共用池餓死其他 9 家）③分散排程（兩舊 cron 退役→單一每日心跳 15:00 台北＝美國深夜離峰；到期判斷資料驅動 per-tenant cadence/監測日/月報日；建檔 assignStagger 自動錯開——離線驗 10 家攤平每平日 2 家）④建檔一條龍（tier 標準/輕量＋排程與預算卡＋競品編輯 UI 補上——之前要開 Firestore console）⑤順手 D5 清（heartbeat doc＋首頁 >26h 紅色警示）＋notifications DB 端 limit
- live 鑑別信號一條 log 三中：daily 手動觸發→只排今天到期的 ztest 測試租戶（beselfaviva 週一制零誤排）→$0 預算被月預算閘擋＋通知；限流 6 連錯第 6 次鎖定；schedule 純函數離線 21/21。測試租戶/計數器/通知全清
- 憲法區 delta（types.ts Tenant += schedule/monthlyBudgetUsd；collections.ts COL += rateLimits）WAITIN 雙簽補齊（Adam 轉達）
- 產品節奏問答（實查 code）：內容管線=週輪量現況→月報排稿最多 3 篇/月（間隙收斂設計）；「發動時間後台不可調」誠實回報為產品缺口→成為 v2.7 的種子
- FOUNDATION 重算：D5/D6 清償、新記 D7（限流計數器無 TTL）/D8（引擎無 429 退避）/D9（後台無分頁）低利顯式養著

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo `src/runMonitor.ts` | 尾端自動排產（首輪5/每輪N＋去重＋手動輪不排）；累計器提到 try 外；cost 隨心跳＋catch 補帳 |
| geo `src/schedule.ts` | DEFAULT/標準 contentPerCycle 3→2；FIRST_CYCLE_CONTENT=5 |
| geo `src/monthlyReport.ts` | 移除自動排產（搬家註解留路標），回歸純報告 |
| geo `src/jobs.ts` | heartbeat 加 extra 參數（cost/output 隨心跳寫回） |
| geo `src/types.ts` | contentPerCycle 註解改「每輪監測後」語意（憲法區，WAITIN 簽） |
| geo `deploy.sh` | task-timeout 3600→14400＋推導式註解（同日同步天條） |
| geo `admin .../page.tsx`＋`t/[id]/page.tsx` | tier 文案／排程卡「每輪篇數＋首輪加碼」 |
| geo `FOUNDATION.md` | D10 新記（多執行無互斥低利）；D11 記→當日清；v2.8 變動記錄 |
| memory ×3 | 容量常數過期／失敗記帳／nohup 接力（MEMORY.md 已索引） |

---

## 下一步

明天 15:00 後查 reddoor cron 輪：`gcloud run jobs executions list --job=geo-monitor-job --region=asia-east1 --project=geo-authority-2026 --limit=3` 看執行時長＋log 撈「自動排產」行＋Firestore jobs 查 requestedBy=cron type=content 兩張新單。過了＝v2.8 全線收案；沒過＝讀 log 找斷點（排產失敗不翻監測案，log 有「自動排產失敗」行）。

---

## 卡住 / 未解

2026-07-21 第3場：
- **明天（7/22）15:00 reddoor cron 監測輪三重驗證**：①新自動排產 cron 路徑首跑（鑑別信號：log「自動排產 2 篇（每輪 2）」＋兩張 requestedBy=cron 的 content 單，會跟今天 5 篇去重）②4h timeout 下單租戶全量批跑完 ③心跳帶 cost 的失敗記帳雖不求觸發、但 job doc 途中就該看得到 cost 累計
- **D4 異地備份**：觸發條件「任一真付費客戶」——10 租戶第一家付費建檔前必補（FOUNDATION D4）
- INLY batch 2026-07-21 是混批（早輪 4 引擎完整 312＋午輪 5 引擎部分 346 同 batchId）：空位題判定無害，但引擎提及率有輕微加權偏差；下週一 cron 乾淨批自然覆蓋，不動資料
- admin 新文案（每輪篇數/首輪加碼 5 篇）視覺未經真人瀏覽器確認——Adam 開後台掃一眼
- W31 週一（7/27）15:00 無人值守心跳＝beselfaviva＋INLY 兩家串行（~2h，4h timeout 下的首次實測）

2026-07-21 第2場：
- **W31 下週一（7/27）15:00 首次無人值守 daily 心跳**：時段從 09:00 改 15:00（避美國尖峰），驗 beselfaviva 五引擎（含 AIO）＋月報 AIO 趨勢線＋heartbeat doc 更新
- **D4 異地備份到期在即**：觸發條件「任一租戶有真付費客戶」——10 租戶第一家建檔前補（跨 project backup bucket）
- **DataForSEO $50 儲值**：Adam 原定 7/21，未確認；免費額度 ~$0.88 撐約 3 週 AIO
- admin 新 UI 卡片（首頁方案選單/租戶頁排程與預算/競品卡）視覺未經真人瀏覽器確認——L1 家族，Adam 開後台掃一眼
- beselfaviva 通關碼 aviva2026 我在限流測試打錯 6 次，我的測試 IP 鎖 15 分鐘（已自然過期，Adam 側不受影響）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-21 第3場。*
