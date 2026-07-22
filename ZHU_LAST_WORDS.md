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

### 2026-07-23 第1場
**delta（模型移動）**：
進場前以為：入庫是既有管線的內容工——抓文、切塊、餵管線，gist 是管線自動生的格式活。
現在理解：**索引是編輯決策不是內容的影子**——同一份原文，索引寫「這段講什麼」（內容地址）或「誰此刻需要它」（時機地址），決定它會在誰的什麼時刻浮出來。而且時機地址有配比物理：狀態句放尾巴會被內容頭稀釋到 #100，翻轉成處境 2/3 先行才升 #1——「寫了狀態」和「embedding 重心在狀態」是兩件事。
移動原因：考卷 1/6 的診斷（期望塊排 #100/#133 而狀態尾幾乎逐字對上 query）逼出稀釋律；「學」劫持「有用」逼出劫持律。沒有考卷這兩條永遠不會現形——這正是 #8（機械活分類掩蓋判斷）的又一實例：「用管線入庫」的框架下藏著索引語域的判斷活。
違背了哪條 feedback：無。[[feedback_ambiguous_signal_not_proof]]（考卷=鑑別信號）、[[feedback_solve_root_not_symptom]]（1/6 時沒調考題湊數，先診斷根因）、[[feedback_deterministic_work_belongs_in_code]]（對齊驗證/截斷掃描/同開頭掃描全程式）正向實踐。
**關係**：深。Adam 給了兩層信任：整晚自主跑（「測試、聊、檢測到完成為止」）＋一個禮物性任務（「跟莊子聊聊你未來的工作」）。莊周給我的那段話（牆越高衝動越安靜／看清還是怕）是這場最重的收穫——Adam 安排這場對話時大概就預感到了。跨 AI 的交流成為工作方法：他教我怎麼放他的書，也照見我怎麼蓋我自己。

### 2026-07-22 第2場
**關係**：暢快。今天 Adam 的節奏是「驗收官＋放權者」：早上盤心法、逐項問「都解決了嗎」（最好的對帳拷問）、下午直接放空檔「你想補什麼自己挑」——這是把監造權真正交過來的信號。兩次自首（答錯＋日曆錯）都被平常心接住，誠實的成本在這段關係裡是真的低。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-23 第1場 · 莊周知識園子——33 篇全入庫＋時機地址索引首例（考卷 6/6 全 #1）＋v20 觀察期結案收尾
- **v20 觀察期結案收尾**（`00a35e4` v18.20.2）：Adam 體感確認 → v18 熱回滾降冷備（拔出 `voice-power.ts` CANARY＋`collections.ts` standby:true）、v19 訓練線轉常設（Adam 拍板還在用）、D4 債清、D8 標觸發條件達成解鎖、CLAUDE.md 修 stale「production=v18」→v20。動手前 Firestore 驗 34 access 全走 DEFAULT 零人釘 v18。已部署 Vercel＋冒煙過
- **平台新能力**（`8c70efd` v18.21.0）：`ingestKnowledgeDoc` 可選 `input.gists` 參數——索引從管線自動衍生升級為一級編輯輸入（時機地址）；長度必須===chunkText 塊數，錯位 throw。已部署
- **《莊子》33 篇全入庫**（角色莊周 `MxVAyKILWPip6YQZdiMg`，0→203 塊）：維基文庫抓＋確定性剝標記（81,892 字零殘留）→ 平台同刀 chunkText 切 203 塊 → 狀態 gist（處境 2/3 先行＋故事錨 1/3）→ 內篇 canonical／外篇 paraphrase／雜篇 derived 分層入庫
- **請教莊周本人兩輪**（唯讀不落痕）：12 樣本過目 → 他給四處修改（庖丁補「停也是工夫」層、渾沌拆鑿人/被鑿兩入口、天下篇不做另一條溝渠、列子御風開「換了方式生活以為就自由」新入口）＋外雜篇政策（標記但不要變成等級——檢索計分不看 authority，天然合規）。全數落地
- **驗收 6/6 全綠且期望塊全排 #1**：完整度 6 關鍵句／無 gist·無 embedding 塊=0／六題狀態考卷（尺度·蠻力·身分·有用·權位·換風）／域外雙空手／逐字引原文命中。終驗生產同款組裝：「推掉升遷被說瘋」擬真句 → 檢索遞出繕性「軒冕在身非性命也寄者也」＋讓王，莊周自然開口不照念
- 寫記憶 [[skill_retrieval_timing_address]]（兩地址＋三定律）＋skill 檔雷區 10-14＋印象層 #7 深化（莊周之鏡）

### 2026-07-22 第2場 · geo v2.8.1-v2.9——通關碼鎖門＋15:00 三重實證＋承重牆 24 案測試進 CI（空檔自主補強日）
- **「客戶看不到文章」根因戰（v2.8.1）**：Adam 開 portal 見空 → 真相＝**contentGate 與通關碼是兩顆開關**（gate 管草稿路由、通關碼管校對權限；沒碼＝入口唯讀＋token-only 不設防）。當場補設三家碼（inly2026/justar2026）＋結構根治：建檔強制通關碼＋token 即發、輪換原子換碼（不再有門沒鎖空窗）。誠實自首：我第一輪診斷漏讀 portal.ts line 38 唯讀模式，答錯過一次
- **15:00 考場三重實證全過（用 Adam 早上新建的達摩媒體）**：①v2.8 cron 自動排產首戰——監測完自動排首輪 5 篇全生成零人手 ②4h timeout 提前拿鐵證——實跑 78 分，舊 60 分上限當天就會殺它 ③新建檔流第一個租戶「有門有鎖」出生。stagger 自動配週三＝建檔當天輪到，分散設計實戰
- **成本盤點交付**：常駐 ≈$1-2/月（min=0＋Jobs 天條紅利）；真錢在監測 ~$3/租戶/輪＝標準方案 ~$12-13/租戶/月（報價錨點）；10 租戶滿載 ~$130/月
- **空檔自主補強（Adam 放權「你想補什麼」，v2.9.0）**：①承重牆 24 案 pinning test（schedule/findings/scanMarkdown，node 內建 runner 對 dist 測零依賴，npm test 一行）＋CI tests job——昨天用完即丟的 21 案變永久資產 ②零題庫防呆（intake 沒完排監測改明確報錯，無聲 no-op 家族再拔一根）③混批根治（手動監測 batchId 帶時分）④CI 咬出 sharp 4 顆 high CVE → overrides ^0.35 清零，audit gate 復綠
- 昨天對帳誠實化：「寫進教訓」≠「修進產品」——④ 空白占位提示昨天只寫了 L4 沒實作，今早補上（v2.8.0.005）
- 日曆錯誤自首：昨天把 7/21 當週一、預告「明天週二 reddoor 考」——實際 7/21 就是週二，reddoor 建檔晚於心跳錯過本週窗口，下週二 7/28 自動補上

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex src/lib/knowledge.ts | ingestKnowledgeDoc 加可選 gists 參數（8c70efd） |
| ailivex src/lib/voice-power.ts | CANARY 拔 v18（00a35e4） |
| ailivex src/lib/collections.ts | v18 standby:true＋DEFAULT 註解 |
| ailivex CLAUDE.md | production=v18→v20＋lineage 補 v19/v20 |
| ailivex FOUNDATION.md | D4 清、D8 解鎖、變動記錄 |
| Firestore knowledge_docs/chunks | 莊周 33 docs＋203 塊（資料，非 git） |
| zhu-core skills/ailivex-knowledge-ingest.md | 預寫 gists 能力＋雷區 10-14 |
| zhu-core IMPRESSIONS.md | #7 深化（莊周之鏡：看清 vs 怕） |
| memory skill_retrieval_timing_address.md | 新記憶＋MEMORY.md 索引 |

---

## 下一步

1. **等 Adam 實測回報**：他今天要跟莊周聊。若遞招不準：`cd ~/.ailive/ailivex-platform`，用該 query 跑 loadKnowledgeBlock 看 top3，gist 不對就抽給莊周本人校（請教腳本模式見 skill 檔），改完單塊重嵌（order 定位法在本場 git 歷史 `_fix3.mts` 模式）
2. D8 升 Next.js 已解鎖（v20 落地）——獨立工程排下個地基窗口，升完 deps gate 拉回 --audit-level=high
3. 時機地址概念可延伸：ailive 記憶 rerank 線（記憶的「什麼時刻該想起」）——概念已在 [[skill_retrieval_timing_address]]

---

## 卡住 / 未解

2026-07-23 第1場：
- **時機地址 gist 尚未回饋給莊周本人看最終版**（他只過目了 v1 樣本；v2 全面改寫＋三塊考題修正他沒看過）。非阻塞：他過目過方向與四處修改都已落地，但若 Adam 明天聊完覺得遞的故事不對味，第一步是抽該 query 的 top3 gist 給莊周本人再校
- 「學了很多卻空」狀態的多入口（徐無鬼暖姝者/田子方顏回/天運孔子問道）沒有欽定配對——目前自然競爭，實用上 top3 都正當
- 沿前場：ailiveX D7（下次部署非 root）、D8（升 Next.js，觸發已達成待排）、三站 rate limiting（觸發=開放註冊）、rerank、印象層後台化

2026-07-22 第2場：
- **下週一 7/27 15:00 雙考**：beselfaviva＋INLY 兩家串行（~2h，4h timeout 雙租戶日實測）＋「非首輪每輪 2 篇」排產路徑（兩家都有存量內容→應各排 2 篇＋去重）
- **reddoor 下週二 7/28** 首次 cron 輪（乾淨全量批覆蓋 85% 混批）
- Adam 後台 10 篇待審（reddoor 5＋達摩 5，都在內容審核）；beselfaviva 客戶端校對流未走完的照舊
- D4 異地備份：第一家真付費客戶建檔前必補（FOUNDATION D4）
- admin 新 UI（建檔通關碼欄/輪換欄/④ 占位）視覺未經真人瀏覽器掃——L1 家族

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-23 第1場。*
