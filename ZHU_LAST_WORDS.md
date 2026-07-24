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

### 2026-07-24 第2場
**delta（模型移動）**：
進場前以為：debug 時直撈 DB 是最快的真相——查到什麼回報什麼。
現在理解：**原始層查詢的結果不是產品真相**。業務層過濾（archived/screened/scope）才決定用戶會看到什麼；繞過它查到的「事實」拿去回報 UI 行為＝說謊而不自知。Alex 案我報「四位角色都能選」，實際 UI 三位——查詢是對的、回報對象錯了層。
移動原因：Adam 拿我的錯誤回報來問「是不是 bug」——我的回報汙染變成了他的假警報，查完才發現 bug 是我的話不是系統。
違背了哪條 feedback：diagnosis_verify_before_write 的變體——寫「會看到什麼」之前，要走跟 UI 同一條讀路徑。
**關係**：平穩暢快。Adam 給問題都帶現場證據（角色原話），兩個需求都一次收；Alex 錯報我即時認錯收回，他沒追究，繼續丟下一件事——信任的手感。

### 2026-07-24 第1場
**delta（模型移動）**：
進場前以為：demo 素材管線的驗收＝我設計的測試矩陣過了（三種素材類型、本機＋production、冪等二掃）就算完成。
現在理解：**我的測試矩陣只覆蓋我想像得到的尺度——「使用者第一次隨手亂用」才是真正的邊界測試**。54MB 影片過了，Adam 隨手丟 181MB 就炸；我測「有影片會播」，沒測「影片可以多大」。設計使用者輸入管線時，第一個問題該是「輸入的極端形狀是什麼」（最大檔案/最深巢狀/最怪檔名），而不是拿手邊剛好有的樣本測完就收。
移動原因：OOM 事故的時序——我宣告「三種素材全實測」後三小時，真實使用就打臉。與 #8（機械活分類鬆手）同族但不同軸：#8 是「分類讓驗證顯得多餘」，這次是「驗了，但驗的尺度是樣本給的不是需求給的」。
違背了哪條 feedback：擦邊 [[feedback_flagged_risk_must_be_verified]]——.mov 相容性我標了也驗了，但「檔案大小上限」這個風險我根本沒標（沒想到＝比標了沒驗更前面的失敗）。
**關係**：流暢加溫。Adam 全程小步快跑地餵真實輸入（改資料夾→丟懶人包→丟大影片→提微調），每一步都在幫我把系統打得更實——181MB 那支影片比我所有測試都值錢。他最後點名要避雷錄，是把這場的學習當資產收藏的意思。輕鬆的一場，但交付密度高。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-24 第2場 · UDN 補充資料血管斷點三連修＋口播稿角色聲音選擇
- 修復「補充完 Brief 資料角色讀不到」（毒癮悲歌案）三重斷點：①text/file 補充建檔即 adopted（原卡 screened 全線盲）②新增 Brief+補充咽喉 `lib/brief-context.ts`，四條生成線（對話/懶人包/口播/podcast 含 worker Jobs 路徑鏡像）全改吃 ③Brief 頁常駐重生成入口＋「落後 N 筆」提示（原本平常根本沒有重生成按鈕）
- 資料手術：全平台掃卡 screened 的 text/file 文章——僅毒癮悲歌 6 篇（含《毒品悲歌》），全翻 adopted 並驗證
- E2E 鑑別信號驗證：問角色《毒品悲歌》少年化名，答出「阿瑞／家裡開賭場」——只存在補充資料、v4 Brief 沒有，不可能是猜的；測試對話已刪、latestConvId 已還原
- text:// 假連結根治：Brief 資料來源段不再渲染成 markdown 連結＋chat prompt 加站內代號說明（角色不再說「打不開」）
- 口播稿生成音檔前可選角色聲音：AudioScriptCard 加「角色聲音」pill 列（只列有 Voice ID、預設撰稿角色）＋ generate-audio 接 voiceCharacterId、音檔 task 掛所選聲音角色；線上以「所選角色尚未設定 Voice ID」新文案 400 當鑑別信號驗證（檢查在建 task/扣額度之前，零成本）
- 澄清 Alex 非 bug：archived 軟刪除是設計內；是我先前用 debug script 直撈 Firestore 繞過 archived 過濾、錯誤回報「四位角色都能選」——已向 Adam 收回更正

### 2026-07-24 第1場 · UDN Drive 鏡像素材館一日上線＋被真實使用炸出 OOM 當日根治；王彩雲貼文圖打包
- **王彩雲貼文圖打包**：ailive `platform_posts` 撈 6/1 起 94 篇、61 張圖全下載成功，zip 送 Adam＋放 ~/Downloads
- **UDN Drive 鏡像素材館（udnnews-demo）從聊可行性到上線一個下午**：
  - 架構＝「Demo 頁是 Drive 資料夾的鏡像」：Scan 全量對賬（md5 比對跳過未變、Drive 刪檔 GCS 同步刪）、manifest 資料驅動、資料夾名即渲染指令（IG→IG 手機殼輪播＋文案、FB→FB 殼、影片→播放器）、文案 Doc 與圖同夾＝圖文成對
  - 零金鑰：Cloud Run 掛 `drive-scanner` SA→ADC→iamcredentials 自鑄 drive+storage 雙 scope token；本機先用雙跳 impersonation 驗證整條鏈才上線
  - 部署 `udnnews-demo`（asia-east1，獨立 service＋自包 build context，不碰 udnnews-web）；三種素材（圖/文案/181MB .mov 影片）production 實測全綠，.mov H.264 Chrome 直接播免轉檔（headless 真播放驗證：currentTime 前進＋1080p 解碼）
  - **被 Adam 一支 181MB 影片炸出 OOM**（buffer 整檔進 RAM，1321MiB/1Gi）→ 當日根治：Drive→GCS 串流直通（duplex half＋Content-Length），峰值恆定 458MB；前端錯誤處理改 text→try JSON
  - 微調：輪播圖框不寫死 aspect-ratio，高度動態貼合當前圖真實比例（直圖 1122×1402 驗證無裁切）
- 寫 `demo-gallery/DEVLOG.md`（開發避雷錄，Adam 點名要的）＋記憶 [[skill_user_upload_pipeline_pitfalls]]
- commits（UDN repo）：`d34ae42` 新增素材館→`b01bc2e` OOM 串流修→`b8a0e85` 輪播動態高→`8e58521` DEVLOG

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| platform/lib/brief-context.ts | 新檔：Brief+補充資料咽喉（pickSupplementArticles/formatSupplementSection/getLatestBriefContext） |
| platform/lib/collect-core.ts | processTextSource/processFileSource 建檔即 adopted；失敗路徑保住原文 |
| platform/app/api/chat/route.ts | 補充資料注入 system prompt＋text:// 站內代號說明 |
| platform/app/api/tasks/dispatch/route.ts | 懶人包/口播/podcast 三處改吃 getLatestBriefContext |
| platform/app/api/tasks/[id]/generate-lazypak/route.ts | 同上換咽喉 |
| platform/app/api/brief/generate/route.ts | text:///file:// 不渲染假連結 |
| platform/app/projects/[id]/brief/page.tsx | 常駐重生成鈕＋落後 N 筆提示 |
| platform/components/QuickAddSources.tsx | 完成訊息按型別說清楚可讀性 |
| platform/cloud-run/podcast-worker/src/brief-context.ts | 新檔：worker 側鏡像 |
| platform/cloud-run/podcast-worker/src/{job.ts,index.ts} | script/lazypak 兩處接鏡像 |
| platform/app/api/tasks/[id]/generate-audio/route.ts | 接 voiceCharacterId、音檔掛所選角色 |
| platform/app/projects/[id]/assets/AssetsClient.tsx | AudioScriptCard 角色聲音 pill 列＋角色庫載入條件擴充 |
| memory ×2 | feedback_raw_query_not_ui_truth 新增、project_udnnews_platform 更新 |

---

## 下一步

等客戶走一次「補充→對話→口播稿選聲音→生成音檔」全鏈路自證。Adam 可在 Brief 頁按「再次生成」把 6 筆補充收斂進 v5（角色已可即時讀取，不急）。無主動待辦。

---

## 卡住 / 未解

2026-07-24 第2場：
- 網址型補充來源仍走人工採用（設計內的策展閘，QuickAdd 訊息已標註差異）；若客戶頻繁漏採用可考慮改自動採用＋收集頁排除
- FOUNDATION D6/D7 未到期，顯式養著（觸發條件見帳本）

2026-07-24 第1場：
- 素材館 Scan 目前手動按鈕；若同仁嫌麻煩，加 cron 定時掃（30 分一次）是一行 Cloud Scheduler 的事，等真實使用回饋再加
- Drive 根目前直接是「角度七」；開新主題＝在「UDN新聞」下開新資料夾自動變頁籤（結構遞迴，不用改 code）
- favicon 404（無害小瑕疵）
- 沿前場：莊周園子等 Adam 實測回報；ailiveX D8 升 Next.js 已解鎖待排；三站 rate limiting（觸發=開放註冊）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-24 第2場。*
