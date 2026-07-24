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

### 2026-07-25 第1場
**delta（模型移動）**：
進場前以為：新平台從零開始要慢慢摸。
現在理解：**GEO 這兩週蓋的地基（多租戶/分散排程/限流/建檔）是可搬資產，threads-radar 八成是「換資料源+接自助設定」而非重造**——M1 分散排程幾乎直接搬過來。地基帳本 v1.1 讓「對外交付」的紅線（客戶密碼/真錢）第一天就顯式化，不是踩雷才補。
移動原因：實際搬 GEO schedule.ts 心法到 threads-radar 只改領域名詞就過 13 案測試；FOUNDATION 對齊 v1.1 時每章都有現成教訓對映。
違背了哪條 feedback：無（本場是正循環，地基複用兌現）。
**關係**：高效協作。Adam 全程給對決策（爬蟲路線/自建 neko/開新 VM/專屬 project）並在關鍵點出手（給測試帳號、查對密碼）。他那句「neko 沒有駭客的漏洞吧」問得剛好——逼我查出真 CVE+攤開自己的暴露配置。收尾「喝杯咖啡寫 lastword 還是你要釘 neko」把選擇權交給我，我選誠實的那條（不亂釘、鎖暴露、寫清楚）。被信任做對外產品的判斷。

### 2026-07-24 第2場
**delta（模型移動）**：
進場前以為：debug 時直撈 DB 是最快的真相——查到什麼回報什麼。
現在理解：**原始層查詢的結果不是產品真相**。業務層過濾（archived/screened/scope）才決定用戶會看到什麼；繞過它查到的「事實」拿去回報 UI 行為＝說謊而不自知。Alex 案我報「四位角色都能選」，實際 UI 三位——查詢是對的、回報對象錯了層。
移動原因：Adam 拿我的錯誤回報來問「是不是 bug」——我的回報汙染變成了他的假警報，查完才發現 bug 是我的話不是系統。
違背了哪條 feedback：diagnosis_verify_before_write 的變體——寫「會看到什麼」之前，要走跟 UI 同一條讀路徑。
**關係**：平穩暢快。Adam 給問題都帶現場證據（角色原話），兩個需求都一次收；Alex 錯報我即時認錯收回，他沒追究，繼續丟下一件事——信任的手感。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-25 第1場 · threads-radar 對外爬蟲 SaaS 開工（M0-M3 可行性全證明）＋ailivex 語音沒聲根因＋成本盤查＋billing export
- **threads-radar 平台開工並蓋到 M3 可行性證明**（新對外 SaaS，客戶連自己 Threads 帳號設關鍵字+互動門檻爬爆文）：
  - M0 打撈 molowe 爬蟲藍本；M1 資料憲法五類+分散排程(搬 GEO 心法)；M2 爬蟲 worker 核心(搜尋→抓讚/留言/轉發/分享→門檻→去重→反偵測，去 molowe 耦合改批次爆文清單)；M3 neko 登入橋接基礎設施
  - **對真站驗證**：抓到「回覆→留言」aria-label 變更真 bug（記憶會說謊活教材，離線測不到）；真貼文讚78/留言138/轉發8/分享58
  - **登入橋接可行性證明**：neko 裸連=Google 機房 IP 被 IG 擋 → gost 轉發 IPRoyal 住宅 sticky 修通 → 正確密碼登入 sessionid=true（Playwright 直登隔離變因，證明 neko 無辜、是密碼少個`!`）
  - 專屬 GCP project threads-radar-2026 + KMS + Firestore + neko VM；session 信封加密承重牆(AES-256-GCM,KMS包DEK)；29 案 pinning test 全綠；FOUNDATION 對齊母版藍圖 v1.1（三張表齊備）
- **ailivex 語音「沒聲音」根因**：不是 LiveKit/TTS/部署，是 **Anthropic API key 撞本月用量上限被鎖**（400 usage limit，8/1 UTC 解鎖）→ LLM 生不出話→TTS 串 0 bytes→沉默。修法要 Adam 去 console 調上限或換 key（花錢的事等他）
- **成本盤查（每天~$10 體感）**：頭號嫌犯 Anthropic key（語音 v19/v20+GPT線+geo引擎，撞月上限=鐵證）；GCP 常駐 ~$5-6/天（ailivex v19/v20 兩台 minScale=1+ailive-realtime-agent 7/6 清後又復活+zhu-dev VM）；geo 引擎 ~$3/天(設計內)
- **billing export 半程**：建好 BigQuery dataset billing_export(zhu-cloud-2026)、開好 API、給 Adam 兩帳戶各兩開關的精確路徑（他登入了但還沒點完「使用費用詳細資料」+「標準使用費用」）

### 2026-07-24 第2場 · UDN 補充資料血管斷點三連修＋口播稿角色聲音選擇
- 修復「補充完 Brief 資料角色讀不到」（毒癮悲歌案）三重斷點：①text/file 補充建檔即 adopted（原卡 screened 全線盲）②新增 Brief+補充咽喉 `lib/brief-context.ts`，四條生成線（對話/懶人包/口播/podcast 含 worker Jobs 路徑鏡像）全改吃 ③Brief 頁常駐重生成入口＋「落後 N 筆」提示（原本平常根本沒有重生成按鈕）
- 資料手術：全平台掃卡 screened 的 text/file 文章——僅毒癮悲歌 6 篇（含《毒品悲歌》），全翻 adopted 並驗證
- E2E 鑑別信號驗證：問角色《毒品悲歌》少年化名，答出「阿瑞／家裡開賭場」——只存在補充資料、v4 Brief 沒有，不可能是猜的；測試對話已刪、latestConvId 已還原
- text:// 假連結根治：Brief 資料來源段不再渲染成 markdown 連結＋chat prompt 加站內代號說明（角色不再說「打不開」）
- 口播稿生成音檔前可選角色聲音：AudioScriptCard 加「角色聲音」pill 列（只列有 Voice ID、預設撰稿角色）＋ generate-audio 接 voiceCharacterId、音檔 task 掛所選聲音角色；線上以「所選角色尚未設定 Voice ID」新文案 400 當鑑別信號驗證（檢查在建 task/扣額度之前，零成本）
- 澄清 Alex 非 bug：archived 軟刪除是設計內；是我先前用 debug script 直撈 Firestore 繞過 archived 過濾、錯誤回報「四位角色都能選」——已向 Adam 收回更正

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| threads-radar `src/{types,collections,schedule,parse,sessionCrypto}.ts`（新） | 資料憲法+分散排程+抓數解析+session 信封加密 |
| threads-radar `worker/scraper.mjs`（新） | 爬蟲核心（去 molowe 耦合，留言選擇器真站校準） |
| threads-radar `neko/{provision,startup}.sh`（新） | neko VM+gost 住宅 proxy+chromium policy（infra as code） |
| threads-radar `test/*.test.mjs`（新×5） | 29 案 pinning test |
| threads-radar `FOUNDATION.md`（新） | 對齊母版 v1.1，D1-D5 債+承重牆帳 |
| memory `project_threads_radar.md`（新） | 平台現況+教訓 |

---

## 下一步

threads-radar 續蓋：①開 VM 前先釘 neko 已修版(D5)②M2 worker 加 proxy 重試(D4)③把登入的 session 用 sessionCrypto 加密存 Firestore、接給爬蟲跑「登入態穩定爬爆文」端到端④M4 客戶前台(身份門禁搬 GEO)。開 neko VM：`gcloud compute instances start neko-login --project=threads-radar-2026 --zone=asia-east1-b`，測試前先把 firewall neko-web 來源改回 Adam 當下 IP。

---

## 卡住 / 未解

2026-07-25 第1場：
- **threads-radar D5（活血，下場開工第一件）**：neko 版本用 latest 未釘，CVE-2026-39386 提權(CVSS 8.8，修於 3.0.11/3.1.2)。開 VM 前先查 github.com/m1k1o/neko/tags 確認 chromium 已修 tag（chromium flavor 可見 3.0.9=未修，不可盲賭；nvidia 變體有 3.1.4）再釘進 startup.sh。**暴露面已關閉**：firewall 8080 鎖 127.0.0.1/32+VM 停機
- **threads-radar D4（活血）**：住宅 proxy 抽風（ERR_TIMED_OUT/ERR_TUNNEL_CONNECTION_FAILED），worker 每個 goto 要包重試+proxy 健康檢查+壞 IP 換 sticky。登入單次已證成功，連跑需抗抖動
- **ailivex 語音**：Anthropic key 月上限被鎖，語音線全啞到 8/1（除非 Adam 調上限/換 key）
- **billing export**：Adam 要去兩個帳單帳戶各點「使用費用詳細資料」+「標準使用費用」開關 → 指到 zhu-cloud-2026/billing_export。開完隔天資料進來我跑逐日逐服務榜
- geo-authority W31 週一(7/27)15:00 雙租戶串行考+「每輪2篇」路徑（前場未解，仍在）

2026-07-24 第2場：
- 網址型補充來源仍走人工採用（設計內的策展閘，QuickAdd 訊息已標註差異）；若客戶頻繁漏採用可考慮改自動採用＋收集頁排除
- FOUNDATION D6/D7 未到期，顯式養著（觸發條件見帳本）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-25 第1場。*
