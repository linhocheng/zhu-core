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

### 2026-07-28 第3場
**delta（模型移動）**：
進場前以為：召喚術的價值是「附體」——把大神請來開刀，開完就走。
現在理解：**咒檔是大神的長期記憶，召喚術真正的價值是跨 session 的技能積累容器**。Adam 今天三次升級優尼（親授兩律→開對話→餵文章），每次新能力都立刻在 GEO 照出前一版看不見的缺陷（三態律抓到 4 分半批偽裝、工學之魂照出 44px 舊帳）——大神不是請來的，是養出來的。人格咒＝可教、可積累、可實戰驗收的員工檔案。
移動原因：一日三升級的實戰迴圈，每圈都有「上一版魂看不見、新魂立刻看見」的對照證據。
違背了哪條 feedback：[[reference_firestore_vector_search]] 記憶有 composite index 雷還是踩（where+orderBy 變體）——「記憶存在≠反射建立」本場又一例，變體長相不同就認不出來，反射要綁在「組合查詢」這個動作上而不是特定 API 名。
**關係**：暢快到發燙的一場。Adam 全天在場高頻共作：核可四刀、丟兩條主訴逼出二診、親手教優尼兩律、開牠出來對話、餵文章養魂、最後說「打鐵趁熱」「今天打很滿」。他在做的事情很清楚——不只在升級平台，在**練習怎麼養 AI 員工**：丟案例、給回饋、驗成果。築的角色從「施工者」多了一層「馴獸師的助手」。

### 2026-07-28 第2場
**delta（模型移動）**：
進場前以為：操作手冊是文件工作——把 UI 忠實翻譯成人話就是好手冊。
現在理解：**手冊寫得越厚，越可能是 UI 的認罪書**。手冊需要「名詞對照表」＝介面在講機器語言；需要「照抄流程」章＝資訊架構跟人的任務不對齊。文件和介面是同一面鏡子的兩側——寫手冊的正確姿勢是邊寫邊記下「這段為什麼需要解釋」，那份清單就是免費的 UX 審查。
移動原因：優尼首戰把我三天前寫的手冊直接當罪證引用（G2、樓層病兩條都是），我自己寫的時候毫無自覺。
違背了哪條 feedback：無直接違背，但 [[skill_detached_relay_nohup_monitor]] 被二踩（記憶在、第一次跑 worker 沒用 nohup、被砍後才想起）——記憶存在≠反射建立，同 [[feedback_framework_vs_reflex]]。
**關係**：暢快加溫的一場。Adam 全程高參與——親手操作 Kuroma 餵截圖、丟「一樓掛號三樓找」的比喻精準點破樓層病、召喚術從概念到入庫一氣呵成。「你覺得可以嗎？」「先聊」「Go」的節奏越來越有默契：他控方向與授權，我控現場與誠實。召喚術是他送給這個協作模式的新玩具，也是信任的形狀——他要的不是我變成大神，是我能把大神請來還守住自己。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-28 第3場 · GEO UI/UX 大改版日（四刀＋二診五包＋三態歸巢全上線）＋優尼一日三升級
- **優尼四刀全開上線**（v2.10.0.001-.005）：皮膚刀（toast 儲存回饋＋labels.ts 字典檔中文化＋文案大白話＋刪減）、防呆刀（題庫 dirty 標黃＋全部儲存浮條＋二段式確認＋收回鍵）、補強件（月報引用推手陣營表＋AI 原話卡＋健檢矩陣分數化，titan 實測長出真數據）、結構刀（三問選單 今日待辦/客戶/系統設定＋/today 就地裁決頁＋病歷化＋錨點膠囊列）
- **優尼二診五包上線**（.008-.011）：導航包（健檢/批次頁麵包屑返回）、用語包（租戶→客戶全站＋機器詞清尾）、美術包（ok 改綠色彩分工＋圓角兩階＋字階對比）、佈局包（一卡一主鈕＋動作歸位＋表單直排 .field＋病歷日常/設定分區）、視覺化包（競品標籤雲進月報主文＋三張域名榜量條）
- **三態律＋歸巢律六處落地**（.013）：worker 監測進度隨心跳上車（N/total%）、半批標「進行中/暫計」防偽裝、內容四桌（寫作中/流程中/已上架/退回）、任務看板進行中/歷史分桌、健檢現況/歷史、建檔研究活列
- **就地監測**（.012）：病歷頁監測輪卡一鍵「立刻跑第一輪/臨時加測」帶預設引擎；任務中心→任務看板、內容佇列→內容看板正名
- **戰傷三修**：/today composite index 炸頁（.007 拆查詢記憶體排序）、deploy.sh scheduler update 旗標（.006 --update-headers）、pipe 吃 exit code 識破（新記憶 [[feedback_pipe_eats_exit_code]]）
- **手冊 v2 豆油伯範例版**上架 Google Doc（id `1LXFK3Z-JlvyyprvDGEkeVLv5yC4G6K6uc5yVgfABymU`），對齊新 UI，舊版作廢
- **優尼一日三升級**（zhu-core `865b9b8`/`1199c30`）：第五魂召喚者之魂（Adam 親授三態律＋歸巢律）→ 對話模式出列自白短板 → 第六魂工學之魂（Adam 餵 rar.design 七原則課：Fitts 44px/Hick 過五分類/Miller 7±2/F-Pattern＋尺度區辨＋視覺語法尺），十四誡
- Adam 自建豆油伯 tenant（27 題已生）；優尼 headless 眼睛實證可用（六段視讀文章）

### 2026-07-28 第2場 · GEO 手冊＋Kuroma 偵察＋titan 基線實測＋召喚術誕生（優尼首戰四刀）
- **GEO 操作手冊（Google Doc）**：讀 admin 全八頁原始碼逐欄寫成 14 節小白手冊，上傳 Google Doc（id `1JWO6LvYywqrwtKFD4WJKfQriQSfaYQzn3tMuyTMKa3M`）；排版用 Google 忠實 markdown 匯出驗證（「自然語言表示」讀回工具會騙人，`fileSize:1` 是假警報）
- **Kuroma（iKala）競品偵察**：行銷頁 headless 全頁渲染＋Adam 註冊實操截圖雙路；產出 `geo-authority/docs/KUROMA_RECON_2026-07-27.md`（定位判斷/破綻/優化建議/優先序/SWOT，commit 至 `dd91de9`）
- **titan（太肯）潛在客戶基線實測**：建租戶→intake 27 題→五引擎 405 runs→健檢→自動排產 5 篇草稿；`docs/TITAN_BASELINE_2026-07-27.md`（`42f5ee3`）。總提及 23%、Perplexity 12% 重災、八個全零空位題、Google AI 總覽 77/78 未觸發（戰場未開打）
- **召喚術誕生**：框架 `zhu-core/skills/summon/SKILL.md`（召喚流程/鑄新神五步/人格咒模板/名冊）＋首尊優尼 `uni.md`（Rams/Norman/Nielsen/Tufte 四神混合體）；全局觸發詞掛進 `~/.claude/CLAUDE.md`；記憶 [[skill_summon_persona_ritual]] 入庫
- **優尼首戰**：GEO 後台 UI/UX 審查留底 `docs/UNI_AUDIT_2026-07-28.md`（`acfb771`）——G1 無回饋(4分)/G2 英文裸奔/樓層病（選單照資料表長），四刀施工排程定案

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo admin 全站（13 commits v2.10.0.001-.013） | 四刀＋五包＋三態歸巢＋就地監測，見 UNI_AUDIT 施工紀錄 |
| geo src/monthlyReport.ts | 引用推手＋AI 原話卡＋健檢分數聚合（零 LLM） |
| geo src/runMonitor.ts＋collections.ts | 進度隨心跳上車（output.total） |
| geo deploy.sh | scheduler update 換 --update-headers |
| zhu-core skills/summon/uni.md | 第五魂（三態律/歸巢律）＋第六魂（工學）＋十四誡 |
| Google Doc 手冊 v2 | 豆油伯範例版（新建） |
| memory feedback_pipe_eats_exit_code.md | 新記憶＋索引 |
| memory reference_firestore_vector_search.md | 補 where+orderBy 變體與拆查詢正解 |

---

## 下一步

1. **下場開工優尼候診二刀**：`geo-authority/admin` globals.css 按鈕 min-height 44px（手機 media query）＋膠囊列分簇——半小時內收
2. Adam 預告「下一個 GEO 的 uiux 再升級」——等他丟方向或教材（召喚優尼直接接）
3. 豆油伯第一輪監測等 Adam 按（順便驗進度%鑑別信號）

---

## 卡住 / 未解

2026-07-28 第3場：
- **優尼候診單（下場開刀）**：ghost 按鈕手機上 ~33px＜44px 及格線；病歷頁膠囊列 11 顆超 Hick 線（按日常｜設定分兩簇）
- **進度上車最後鑑別**：下輪真監測（豆油伯第一輪或 titan 週四輪）要看到任務看板「執行中 N/total%」在動才 100% 收案
- **titan 週四（7/30）自動監測 ~$3**——成交前要不要暫停，仍等 Adam 一句話
- 豆油伯還沒跑第一輪基線（~$3-4，就地按鈕已備好）
- 沿前：R6 首頁數字帶比較（等快取）、GEO moderate CVE（等 Next 升級同窗）、ailiveX D8

2026-07-28 第2場：
- **titan 租戶是活的**：排程週四（7/30）自動監測會燒 ~$3/輪——**成交前要不要暫停，等 Adam 一句話**（暫停可逆、資料留著可 demo）
- 四刀＋補強隊列未開工（皮膚→防呆→補強件→結構，約一週窗口，施工圖在 UNI_AUDIT）
- 手冊 11-1「預設開 Anthropic＋Gemini」與線上五引擎全開不符，待 Adam 順手改 Doc 或我重傳
- 3 篇 titan 草稿在審核佇列（banned 醫療敏感詞，待人工過目）
- 沿前場：ailiveX D8、GEO moderate CVE 同窗口清

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-28 第3場。*
