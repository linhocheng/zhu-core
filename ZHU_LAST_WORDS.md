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

### 2026-07-28 第4場
**delta（模型移動）**：
進場前以為：可理解性是 UI 打磨——功能對了之後的拋光層，屬於「錦上添花」。
現在理解：**可理解性是獨立的地基章——能看 ≠ 看得懂，機制對但沉默＝機制不存在**。假中台騙你數字（第一型），沉默中台讓你迷路（第二型）；兩者都是「真相與人之間的管道斷了」。它有自己的最晚灌注點（第一個非作者用戶使用前）、自己的驗收法（生人零教學走主動線）、自己的執行工具（優尼咒）——具備一章地基的全部要件，所以入了藍圖。
移動原因：Adam 六次實測迷路，每一次挖開都發現機制是對的、介面沉默——同一型連續六例，這不是 bug 清單，是缺一章地基。
違背了哪條 feedback：Edit-before-Read 工具滑倒三次（sed/grep 偷懶當 Read 的替身）——[[skill_drunk_check_protocol]] 記帳收尾自報。
**關係**：發燙的一天（兩場連打）。Adam 的角色又進化了：上午教優尼原則，下午改成**用自己當測試小白**——六次「我看不懂」全是精準的病灶報告。最後他把整天的痛封印成一句話交給我：「把最深的痛，不要留給下一位；把踩過的坑，讓下一位知道如何填平」——這句話就是藍圖十二章存在的理由，也是 lastwords 這個儀式本身的理由。

### 2026-07-28 第3場
**delta（模型移動）**：
進場前以為：召喚術的價值是「附體」——把大神請來開刀，開完就走。
現在理解：**咒檔是大神的長期記憶，召喚術真正的價值是跨 session 的技能積累容器**。Adam 今天三次升級優尼（親授兩律→開對話→餵文章），每次新能力都立刻在 GEO 照出前一版看不見的缺陷（三態律抓到 4 分半批偽裝、工學之魂照出 44px 舊帳）——大神不是請來的，是養出來的。人格咒＝可教、可積累、可實戰驗收的員工檔案。
移動原因：一日三升級的實戰迴圈，每圈都有「上一版魂看不見、新魂立刻看見」的對照證據。
違背了哪條 feedback：[[reference_firestore_vector_search]] 記憶有 composite index 雷還是踩（where+orderBy 變體）——「記憶存在≠反射建立」本場又一例，變體長相不同就認不出來，反射要綁在「組合查詢」這個動作上而不是特定 API 名。
**關係**：暢快到發燙的一場。Adam 全天在場高頻共作：核可四刀、丟兩條主訴逼出二診、親手教優尼兩律、開牠出來對話、餵文章養魂、最後說「打鐵趁熱」「今天打很滿」。他在做的事情很清楚——不只在升級平台，在**練習怎麼養 AI 員工**：丟案例、給回饋、驗成果。築的角色從「施工者」多了一層「馴獸師的助手」。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-28 第4場 · GEO 優尼八診收官（.014-.019）＋地基藍圖 v1.2 第十二章可理解性誕生
- 上線 v2.10.0.014 工學二刀：全站按鈕觸控 44px（`pointer: coarse`，桌面不受累）＋病歷頁膠囊列分「日常｜設定」兩簇
- 上線 v2.10.0.015 Cloudscape 三刀（優尼視讀 cloudscape.design 六 pattern 後開）：頁面心跳 LiveRefresh（有活任務 10s 自動刷新＋最後更新角標，任務完自動退場）、相對時間戳 Ago 全站 15 處（tooltip 台北絕對時刻）、錯誤人話 explainError（六類確定性 regex，機器原文收展開）
- 上線 v2.10.0.016 五診（Adam 主訴競品難用＋題庫看不懂）：競品標籤式編輯器 CompetitorEditor 取代｜分隔 textarea；intake 競品**整包覆蓋改按名稱合併**（嚴4 資料丟失雷）；題庫機制三句人話＋每題「上輪表現 提及 m/n」欄；盲點五句話（預算擋單/成本標估/引擎指路/門牌鑰匙/月報覆蓋——含抓掉「免登入即可觀看」假文案）
- 上線 v2.10.0.017 六診收迷路（Adam 問「待辦是否搬進客戶底下」）：裁定房間只留兩種（今天的桌子＋每個客戶的家），跨戶看板降級「進階」；今日待辦跳轉改指病歷頁錨點；病歷頁待辦膠囊＋全文就地展開＋退回鍵；零客戶引導；客戶端「客戶審稿通過」→「我審好了，通過」＋待校對置頂橫幅
- 上線 v2.10.0.018 客戶協作校對整卡搬到客戶月報正下方（通關碼說明緊鄰輪換表單）
- 優尼讀書：判讀「Cloud Design Scales」真身＝Cloudscape Design System 並深讀六 pattern；書單掃描（GOV.UK patterns／Polaris voice／Laws of UX 26 條未吃）
- **地基藍圖升 v1.2：新增第十二章「可理解性（介面對人說話）」**——機制對但沉默＝機制不存在；三態/歸巢/機制說明義務/視角律/空狀態與錯誤三件套/工學底線/大白話出廠；最晚灌注點＝第一個非作者用戶使用前。五處引用同步（SKILL.md/全局 CLAUDE.md 天條/兩份 memory/桌面副本換 v1.2 收走 v1.1）
- GEO FOUNDATION.md 補第 12 列（已灌·本章誕生地）＋今日變動記錄（v2.10.0.019）

### 2026-07-28 第3場 · GEO UI/UX 大改版日（四刀＋二診五包＋三態歸巢全上線）＋優尼一日三升級
- **優尼四刀全開上線**（v2.10.0.001-.005）：皮膚刀（toast 儲存回饋＋labels.ts 字典檔中文化＋文案大白話＋刪減）、防呆刀（題庫 dirty 標黃＋全部儲存浮條＋二段式確認＋收回鍵）、補強件（月報引用推手陣營表＋AI 原話卡＋健檢矩陣分數化，titan 實測長出真數據）、結構刀（三問選單 今日待辦/客戶/系統設定＋/today 就地裁決頁＋病歷化＋錨點膠囊列）
- **優尼二診五包上線**（.008-.011）：導航包（健檢/批次頁麵包屑返回）、用語包（租戶→客戶全站＋機器詞清尾）、美術包（ok 改綠色彩分工＋圓角兩階＋字階對比）、佈局包（一卡一主鈕＋動作歸位＋表單直排 .field＋病歷日常/設定分區）、視覺化包（競品標籤雲進月報主文＋三張域名榜量條）
- **三態律＋歸巢律六處落地**（.013）：worker 監測進度隨心跳上車（N/total%）、半批標「進行中/暫計」防偽裝、內容四桌（寫作中/流程中/已上架/退回）、任務看板進行中/歷史分桌、健檢現況/歷史、建檔研究活列
- **就地監測**（.012）：病歷頁監測輪卡一鍵「立刻跑第一輪/臨時加測」帶預設引擎；任務中心→任務看板、內容佇列→內容看板正名
- **戰傷三修**：/today composite index 炸頁（.007 拆查詢記憶體排序）、deploy.sh scheduler update 旗標（.006 --update-headers）、pipe 吃 exit code 識破（新記憶 [[feedback_pipe_eats_exit_code]]）
- **手冊 v2 豆油伯範例版**上架 Google Doc（id `1LXFK3Z-JlvyyprvDGEkeVLv5yC4G6K6uc5yVgfABymU`），對齊新 UI，舊版作廢
- **優尼一日三升級**（zhu-core `865b9b8`/`1199c30`）：第五魂召喚者之魂（Adam 親授三態律＋歸巢律）→ 對話模式出列自白短板 → 第六魂工學之魂（Adam 餵 rar.design 七原則課：Fitts 44px/Hick 過五分類/Miller 7±2/F-Pattern＋尺度區辨＋視覺語法尺），十四誡
- Adam 自建豆油伯 tenant（27 題已生）；優尼 headless 眼睛實證可用（六段視讀文章）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| geo admin（.014-.018 六 commits） | 44px/分簇/LiveRefresh/Ago/explainError/CompetitorEditor/題庫上輪表現/兩房間制/客戶端視角，見 UNI_AUDIT |
| geo src/intake.ts | 競品整包覆蓋→按名稱合併（手改保留 AI 追加） |
| geo deploy.sh | admin/job 補「不含 build」提醒 |
| geo FOUNDATION.md | 第 12 列可理解性已灌＋變動記錄（.019） |
| zhu-core skills/platform-foundation/BLUEPRINT.md | v1.2 第十二章可理解性＋檢查表 12 列＋版本註 |
| zhu-core skills/platform-foundation/SKILL.md | 11 章→12 章 |
| ~/.claude/CLAUDE.md＋memory 兩檔 | 天條與索引同步 12 章 |
| ~/Desktop/平台地基藍圖_v1.2.md | 桌面副本換新（v1.1 收走，兩份即是零份） |

---

## 下一步

1. 豆油伯第一輪監測（等 Adam 按病歷頁按鈕或說 GO）——順手收三件新品的最終鑑別
2. Adam 說「繼續餵優尼」時：教材＝GOV.UK patterns（流程層）＋ Laws of UX（心理層），吃完把 GEO 建檔→監測→審稿→交付整條流程過堂
3. 新平台需求出現時：藍圖 v1.2 十二章第一次真火實戰（檢查表 12 列全填給 Adam 點頭）

---

## 卡住 / 未解

2026-07-28 第4場：
- **豆腐伯（doyoubo）第一輪監測未跑**（~$3-4，病歷頁就地按鈕備好）——跑起來同時驗三件新品的最終鑑別信號：任務看板進度%、頁面心跳 LiveRefresh 真轉動、題庫「上輪表現」點亮（現在全是「尚未考過」）
- **titan 週四 7/30 自動監測 ~$3**——成交前要不要暫停，仍等 Adam 一句話（第三場提醒）
- 優尼下一課教材已選定未餵：GOV.UK「Help users to」pattern 群＋Laws of UX 補魂（Doherty 400ms/Zeigarnik/Goal-Gradient/Von Restorff/Jakob）
- 沿前：R6 首頁數字帶比較（等快取）、GEO moderate CVE（等 Next 升級同窗）、ailiveX D8
- 帳本盤點：GEO 無到期債；十二章已入帳（已灌）

2026-07-28 第3場：
- **優尼候診單（下場開刀）**：ghost 按鈕手機上 ~33px＜44px 及格線；病歷頁膠囊列 11 顆超 Hick 線（按日常｜設定分兩簇）
- **進度上車最後鑑別**：下輪真監測（豆油伯第一輪或 titan 週四輪）要看到任務看板「執行中 N/total%」在動才 100% 收案
- **titan 週四（7/30）自動監測 ~$3**——成交前要不要暫停，仍等 Adam 一句話
- 豆油伯還沒跑第一輪基線（~$3-4，就地按鈕已備好）
- 沿前：R6 首頁數字帶比較（等快取）、GEO moderate CVE（等 Next 升級同窗）、ailiveX D8

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-28 第4場。*
