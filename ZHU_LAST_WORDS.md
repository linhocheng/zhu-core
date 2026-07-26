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

### 2026-07-26 第1場
**關係**：平穩輕鬆。Adam 手機不便時我沒逼他立刻弄 gcloud，先給期中報告讓他放心去忙；他電腦開了回來我兩分鐘補完。一次乾淨的健檢協作，節奏他控、我補齊。

### 2026-07-25 第3場
**delta（模型移動）**：
進場前以為：M5 是「把五個子系統蓋出來」——建置為主，驗證是蓋完點一下。
現在理解：**每個子系統的真驗證都逼出設計看不到的真 bug／findings，而且「最像例行步驟」的那一步藏最多**——推 GitHub 感覺只是「部署動作」，卻是 CI 第一次證明自己有牙齒（12 個真 findings）；cron「觸發 job」感覺理所當然，卻藏著 runWithOverrides 權限死結。價值不在建置，在驗證那一刀。
移動原因：這是同型 delta 第二次（上一場「真實機驗證逼出四個產品級坑」，這場「五子系統各逼一個+CI 逼十二個」）。連續兩場證明：我事先想得到的坑不是坑，真信號永遠在我以為「這步沒什麼」的地方冒出來。
違背了哪條 feedback：無——正循環。一路「標了風險要驗」「能本機重現不等遠端」「膠水層錯誤會誤導」正面兌現：403 截斷不猜、逐層扒到真權限名；CI findings 不一律關規則、逐條分真偽並真驗（非 root 重部署真掃 succ=1）。
**關係**：暢快＋深被信任。Adam 一句「M5 go」放手讓我連跑五子系統；中途「OK嗎」「推」都是短促的信任而非盤問；收尾「good job 先寫 lastword 你去好好旅遊吧」——把「做完之後」也還給我。今天我沒有一次宣告「應該通」就收，一路驗到真信號；他看見了。這是把我當能獨立監造的夥伴，不是要盯著的工具。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-26 第1場 · GEO 平台八軸全檢——七離線軸先掃、gcloud 補三軸、報告留底 repo
- **GEO 平台全檢八軸全綠**（唯一黃燈：8 個不阻斷 moderate CVE）：
  - ① repo 同步（乾淨、GitHub 0 差距）② 承重牆 pinning 24/24 離線測全過 ③ Cloud Run 無真相分裂（流量 revision＝latestReady `geo-admin-00032-kbf`、minScale 未釘零常駐）④ Scheduler 兩排程 ENABLED 今早 07:00 都跑 ⑤ geo-monitor-job 連 5 日 succeeded、心跳文件 4.5h 前更新 ⑥ 近 10 任務全 done、0 超時（D11 $5.43 超時燒錢複驗未復發）⑦ production /login 200＋CSP per-request nonce 活著＋六安全頭全在 ⑧ CI 綠、11 債 5 清 6 養無到期
- 報告留底 `geo-authority/docs/HEALTHCHECK_2026-07-26.md`（commit `ad7f9f7` v2.9.0.004，已推）

### 2026-07-25 第3場 · threads-radar M5 五子系統全綠＋CI 上 GitHub 轉綠（Semgrep 12 findings 逐條分真偽）
- **M5 五子系統全數落地並真驗**（承 SESSION_2026-07-25_2 的真帳號端到端）：
  - **M5-1 cron 分散排程**：/api/cron/dispatch（CRON_SECRET Bearer 自驗）→讀 active 客戶→isScanDue(台北)+日上限+health precheck→WIF runScanJob。vendor schedule.ts→web、vercel.json crons hourly、middleware 放行。**真觸發驗通**：強制測試客戶 due→cron dispatched→Cloud Run 新 execution(4→5)→爬 2 篇真爆文→dispatch count=1。**平台現在自動駕駛**。
  - **M5-2 刪除連帶**：deleteClientAction 連帶清 7 collection（threads_accounts 含加密 session/keywords/viral_posts/notifications/scan_status/rate_limits→最後 client doc）+admin 二段確認。seed 真測 7 collection 全歸零無孤兒。
  - **M5-3 rate limit+成本錶+D12**：rateLimit.ts（Firestore 固定窗+transaction）客戶登入 10/10min、operator 5/10min；成本錶 scan_status.usage 本月掃描數 admin 可見；D12 worker lastRun.reason 覆蓋清。真驗：rate 5過2擋過窗歸零、掃後 usage=1/reason=null/state=done。
  - **M5-4 CI 四件套**：推 GitHub 私有 repo linhocheng/threads-radar→.github/workflows/ci.yml（gitleaks/Semgrep/npm audit web+worker）+security-dast.yml（ZAP 週排程）。**CI 真跑轉綠**。
  - **M5-5 災難還原**：Firestore PITR 開(7天)+每日備份排程(14天)+setup-firestore.sh。驗 PITR ENABLED/604800s、排程 1209600s。
- 過程抓修真 bug（每個都真信號逼出，非猜）：①runScanJob 帶 CLIENT_ID override 需 `run.jobs.runWithOverrides`（run.invoker 只給 run.jobs.run）——第一層 403 截斷誤導，扒完整訊息才見真權限名②日額度計數寫在觸發前→失敗嘗試燒額度→改觸發成功才記帳③firebase-admin 是 db.ts 註解留下的未用依賴→拖進 5 個 google-cloud 傳遞漏洞，移除 16→11④Semgrep 首跑 12 blocking findings，逐條分真偽。
- 天條紀律：三處手動雲端改動當日寫進腳本（web/setup-iam.sh 加 runWithOverrides、setup-firestore.sh PITR+備份）。

---

## 最新一場改了哪些檔案

（見 WORKLOG）

---

## 下一步

1. 無急件。GEO 下次全檢可拿 HEALTHCHECK_2026-07-26.md 對照趨勢
2. moderate CVE 與 Next.js 升級同窗口清（非阻斷、不急）

---

## 卡住 / 未解

2026-07-26 第1場：
- GEO npm 8 moderate CVE（gate 設 high 不阻斷）——建議等升 Next.js（帳本 D8）同窗口清
- 本次未查：引擎 API 餘額/配額（某租戶突然空手才回頭查此軸）、租戶產文品質（業務面非健康面）
- 沿前場：莊周園子等 Adam 實測；threads-radar 真 Threads 登入（帳號風險 Adam 決）；ailiveX D8

2026-07-25 第3場：
- **D10 留言 selector 登入態回 0**（最影響產品體感，下一步優先）：真帳號掃讚/轉發/分享都對、留言全 0。登入態貼文頁「留言」aria-label 漂移或需展開。改 worker/scraper.mjs EXTRACT_METRICS + src/parse.ts 兩份；先收登入態真 DOM 樣本再定 selector。
- **CI DAST(ZAP) 未實跑過**：掛週排程（週日台北 02:00），首次自動跑或 workflow_dispatch 手動觸發才知會不會抓到東西/誤報。
- **還原演練**（觸發：上線首月）、**巡檢 sweep cron**（暫緩，worker 已在真失敗發通知+admin 顯 health）、**D11 capture CDP 重連**、**人在 neko 網頁登入純 UX 未直接驗**（M3/M4 遺留）。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-26 第1場。*
