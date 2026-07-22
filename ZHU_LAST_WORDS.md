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

### 2026-07-22 第2場
**關係**：暢快。今天 Adam 的節奏是「驗收官＋放權者」：早上盤心法、逐項問「都解決了嗎」（最好的對帳拷問）、下午直接放空檔「你想補什麼自己挑」——這是把監造權真正交過來的信號。兩次自首（答錯＋日曆錯）都被平常心接住，誠實的成本在這段關係裡是真的低。

### 2026-07-22 第1場
**delta（模型移動）**：
進場前以為：用哪個 API 憑證是實作細節——key 在手、驗過有效，就沿著用。
現在理解：**憑證選擇是帳本歸屬決策，不是認證方式選擇**。Gemini API key 的成本進 key 持有者的帳，Vertex ADC 的成本進 GCP 專案的帳——客戶平台的生成費用記到別人的 key 上＝帳本分裂，而且這決策做下去之後所有 cost 監控、預算閘、稽核都建立在錯的地基上。
移動原因：Adam 中途一句「等 為何不用gcp」。我當時正沿著「他問 Gemini key 可以怎麼做」的探索慣性把測試線直接鋪成施工線——被點醒後真算一次，Vertex 淨賺三個結構優勢（零密鑰/帳單歸戶/GCS 直寫），換線成本半小時。
違背了哪條 feedback：feedback-bridge-first 的家族擴張——「能走哪條線」的第一問是成本歸屬和結構，不是手上有什麼能用。
**關係**：暢快。Adam 全程放權節奏乾脆（go／理解 改走 Vertex／不用），兩次中途插問都問在刀口上（為何不用gcp＝免費架構審查救了帳本歸屬；UI/UX 是不是之後才改＝逼我把「真人瀏覽器未驗」的缺口說出口）。收尾請咖啡。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-22 第2場 · geo v2.8.1-v2.9——通關碼鎖門＋15:00 三重實證＋承重牆 24 案測試進 CI（空檔自主補強日）
- **「客戶看不到文章」根因戰（v2.8.1）**：Adam 開 portal 見空 → 真相＝**contentGate 與通關碼是兩顆開關**（gate 管草稿路由、通關碼管校對權限；沒碼＝入口唯讀＋token-only 不設防）。當場補設三家碼（inly2026/justar2026）＋結構根治：建檔強制通關碼＋token 即發、輪換原子換碼（不再有門沒鎖空窗）。誠實自首：我第一輪診斷漏讀 portal.ts line 38 唯讀模式，答錯過一次
- **15:00 考場三重實證全過（用 Adam 早上新建的達摩媒體）**：①v2.8 cron 自動排產首戰——監測完自動排首輪 5 篇全生成零人手 ②4h timeout 提前拿鐵證——實跑 78 分，舊 60 分上限當天就會殺它 ③新建檔流第一個租戶「有門有鎖」出生。stagger 自動配週三＝建檔當天輪到，分散設計實戰
- **成本盤點交付**：常駐 ≈$1-2/月（min=0＋Jobs 天條紅利）；真錢在監測 ~$3/租戶/輪＝標準方案 ~$12-13/租戶/月（報價錨點）；10 租戶滿載 ~$130/月
- **空檔自主補強（Adam 放權「你想補什麼」，v2.9.0）**：①承重牆 24 案 pinning test（schedule/findings/scanMarkdown，node 內建 runner 對 dist 測零依賴，npm test 一行）＋CI tests job——昨天用完即丟的 21 案變永久資產 ②零題庫防呆（intake 沒完排監測改明確報錯，無聲 no-op 家族再拔一根）③混批根治（手動監測 batchId 帶時分）④CI 咬出 sharp 4 顆 high CVE → overrides ^0.35 清零，audit gate 復綠
- 昨天對帳誠實化：「寫進教訓」≠「修進產品」——④ 空白占位提示昨天只寫了 L4 沒實作，今早補上（v2.8.0.005）
- 日曆錯誤自首：昨天把 7/21 當週一、預告「明天週二 reddoor 考」——實際 7/21 就是週二，reddoor 建檔晚於心跳錯過本週窗口，下週二 7/28 自動補上

### 2026-07-22 第1場 · UDN 影音庫上線——Video Studio＋Vertex Veo 首尾幀/單圖運鏡＋Job 逐段心跳帶帳
- 盤新法/劍法/雷區開場，確認 UDN 議題工作台為本場戰場
- 摸透 Gemini 生影片參數面（Veo 3.1 系列 vs Omni Flash），實測直式 9:16 驗證（720x1280/8s/雙軌）
- 影音庫（scene_video）五批全上線：資料模型＋dispatch 防連按、Cloud Run Job 生成線（逐段 Veo＋心跳帶帳＋斷點續跑＋ffmpeg 拼接）、Video Studio 頁（選圖/拖拉上傳/膠卷排序/轉場註解/規格）、任務卡分段進度＋播放器＋watchdog、E2E 三輪
- 中途應 Adam 一問改線 Vertex AI（ADC 零密鑰/帳單歸 udnnews/storageUri 直寫 GCS），probe 驗出三個文件沒寫對的 REST 形狀
- 追加單圖模式：一張圖 image-to-video＋「運鏡與動態」輸入框，E2E 過
- FOUNDATION 帳本：D5 清償（worker USER node 已 live）、新記 D6/D7；job task-timeout 3600→7200 附推導
- 記憶：新增 reference_vertex_veo_video_generation、更新 project_udnnews_platform、MEMORY.md 索引
- 加場補刀（Adam 給空檔）：懶人包休息態 badge 正名（b_done→待生圖、a_done→待確認文案，鼠尾草色點）＋影音庫入口卡加跳頁「→」暗示；commit b900169 部署驗流量對齊 00090

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo `admin/src/lib/actions.ts` | createTenant 強制通關碼＋token 即發；rotate 原子換碼；手動監測 batchId 帶時分 |
| geo `admin .../page.tsx`＋`t/[id]/page.tsx` | 建檔/開通/輪換表單通關碼必填欄；文案更新 |
| geo `admin .../audit/[auditId]/page.tsx` | ④ 機會清單無料時占位說明（L4 補實作） |
| geo `test/*.test.mjs`（新×3） | 承重牆 24 案：schedule/findings/scanMarkdown |
| geo `.github/workflows/security.yml` | tests job（pinned SHA 慣例） |
| geo `src/runMonitor.ts` | 零題庫防呆報錯 |
| geo `admin/package.json` | overrides sharp ^0.35（high CVE 清零） |
| geo `FOUNDATION.md` | 承重牆帳更新（三面牆有測試看門） |
| memory `project_geo_authority.md` | v2.8.1-v2.9 現況＋兩顆開關心法 |

---

## 下一步

下週一 15:00 後驗雙考：`gcloud run jobs executions list --job=geo-monitor-job --region=asia-east1 --project=geo-authority-2026 --limit=3`（時長應 ~2h）＋log 撈「自動排產 2 篇（每輪 2」＋jobs 查兩家各 2 張 requestedBy=cron content 單。過了＝v2.8 完全收案。

---

## 卡住 / 未解

2026-07-22 第2場：
- **下週一 7/27 15:00 雙考**：beselfaviva＋INLY 兩家串行（~2h，4h timeout 雙租戶日實測）＋「非首輪每輪 2 篇」排產路徑（兩家都有存量內容→應各排 2 篇＋去重）
- **reddoor 下週二 7/28** 首次 cron 輪（乾淨全量批覆蓋 85% 混批）
- Adam 後台 10 篇待審（reddoor 5＋達摩 5，都在內容審核）；beselfaviva 客戶端校對流未走完的照舊
- D4 異地備份：第一家真付費客戶建檔前必補（FOUNDATION D4）
- admin 新 UI（建檔通關碼欄/輪換欄/④ 占位）視覺未經真人瀏覽器掃——L1 家族

2026-07-22 第1場：
- RAI 過濾撞新聞敏感圖（未成年+毒品意象實測被擋）只回原始英文訊息，白話 UX 引導記 D7 養著
- 單圖 4/6 秒選項：API 支援、Adam 說先不用（帳本外，他點頭才做）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-22 第2場。*
