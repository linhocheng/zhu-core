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

### 2026-08-02 第2場
**delta（模型移動）**：
進場前以為：記得「有一道預算閘＋行號」就等於懂這個機制，可以拿它做推估、甚至照它改設定。
現在理解：**閘門的「作用域語意」（per-租戶還是全平台）比「觸發條件」更容易在摘要中丟失，而框架錯了整條推估全錯**。作用域藏在 `??` fallback 和註解裡，grep 行號看不到。
移動原因：「調 $100」動手前重讀 runMonitor.ts:43-55，發現 per-tenant 語意，推翻自己兩天前的預測——差一步就照錯框架寫設定。
違背了哪條 feedback：無正面違背——反而是 Three-Loop 剛學的 INFERRED 標籤救場：前日推估誠實標了 INFERRED 沒充 VERIFIED，今天被推翻時損失只是一次修正不是一次錯誤施工。[[feedback_memory_can_lie]] 機制版 +1。
**關係**：輕鬆而信任。放風節奏（邊喝咖啡讀書、「不要太嚴肅」）；兩次裁定（預算、暫停）都乾淨地留在 Adam 手上；「你沒把它復活吧」用現場重驗回答而不是用記憶發誓——誠實存摺 +1。收尾一句「see u again bro」，關係是暖的。

### 2026-08-02 第1場
**delta（模型移動）**：
進場前以為：換新衣＝照設計稿把樣式搬過來的格式工。
現在理解：**設計稿是系統語意的第三方提煉師**——設計師憑對產品的想像重畫了功能，虛構會混在美術裡溜進來（夜間時窗語意反轉、頁內帳密框差點推翻密碼承重牆）。換皮前先做「設計稿 vs 真系統」逐項裁決（漏補/虛砍/皮收），跟沉澱視角天條同族：任何第三方轉述落地前都要對照現場。移動原因：Adam 交付時那句「設計師如果有漏你自己補、亂加的你自己看合不合用」——他早就知道這不是格式工。
**關係**：暢快。Adam 節奏是「大白話問現況→拍板三點→放手→給新衣→88」——授權越來越大（整晚 solo 兩期），驗收方式從「他來測」進化到「我實拍給他驗」。「你去自由行吧」是新型態的信任：不填任務、帶著好奇心巡場也算工作。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第2場 · 知識庫手冊外傳＋GEO 唯讀全檢＋預算閘語意認錯（7/30 起的長場）
- 降落即驗 titan 週四懸案：`status: paused` 早有人按下、7/30 心跳空轉「0 租戶到期」零燒錢——懸了三場的「等一句話」結案；豆油伯/青輔同為 paused
- 寫《知識庫與方法論系統核心概念手冊》推上 ailivex-platform（`068810a` v18.32.5，docs/KNOWLEDGE_METHODOLOGY_PLAYBOOK.md）——寫給 Adam 朋友的 AI 讀的可搬版：語域對齊/時機地址/狀態機分工/驗收反向題/十條心法＋實作對照表
- ailivex-platform repo 轉 private（Adam 要設帳號給朋友）：web 404＋API 404 權威信號收案，raw CDN 殘影掛背景哨兵盯到第 3 分鐘 404 才收
- 讀 Three-Loop Agent Engineering Playbook 戰略評估：八成與我們天條同構（證據說話=鑑別信號、repo 是真相=記憶會說謊、交接契約=lastwords、連 dry=2 都一樣）；值得偷三樣——VERIFIED/INFERRED/UNKNOWN 證據三態標籤、十一個標準停機態、「施工者可加考題不准改考卷語意」
- GEO 現場唯讀全檢（掛三態標籤實戰）：W31 五租戶監測全 done 零 failed（單場 $3.0-3.3、65-70 分鐘）；「上輪表現」資料層全亮（每題有數據、零缺 promptId）；七月帳 $43.22；錯誤 35 筆中 34 筆是 AIO 引擎（timeout+DFS）；五家提及率 AVIVA 23% → 數聚 2.5%
- 認錯修正：`monthlyBudgetUsd` 是**每租戶**月上限（`tenant.monthlyBudgetUsd ?? global`），不是總帳閘——「8/31 擋兩輪」預測作廢，平台根本沒有總帳閘機制；「調 $100」動手前煞車問清語意，Adam 改裁定全部不動
- 收尾驗證「暫停的沒被復活」：全場唯讀、七租戶 status 與降落時逐一比對一致

### 2026-08-02 第1場 · threads-radar 晚班雙發——F期摩斯切角分析入卡片（evidenceVerified 8/8）＋G期情報站新衣全站上線
- **F期切角分析上線（v0.22）**：Adam 拍板三點（全員可按/不設限額/六段全上）→ 雷達頁每張爆文卡「分析這篇」→ Cloud Run Job analyze 模式（讀庫存語料不碰 session）→ 摩斯六段結構化寫回 post.analysis → 卡片展開＋頂部「切角·槓桿」標籤。src/analysis.ts 純函數：**證據鐵律三層寫進程式**（無證據段作廢／證據子串驗證失敗信心強制 low＋evidenceVerified=false／造假雷達無證據降級）＋業配 prePass 確定性硬篩。切角/人設 enum 為跨案例聚合設計。測試 66→76 案。
- **F期真驗兩篇**：@7chi.xi（葡萄柚，讚5790）八段全有料 **evidenceVerified 8/8**、金礦挖到「鑷子意外變全場焦點」；@falling_star_5020（高雄防曬）判出不同槓桿「好奇缺口」、金礦點破政治情緒包裝成地方驕傲——enum 有區分力。
- **首跑失敗根因抓實**：job 第一抽 parse 不合格→本機重放同 prompt 一次即通＝LLM 輸出機率性偶壞，非管線 bug。修：同 prompt 自動重抽一次＋失敗記 stop_reason/len 診斷（重抽是重抽樣，修復仍是確定性 parse，不違天條）。
- **G期換新衣上線（v0.23）**：Adam 給 claude.ai/design 設計稿「Threads 情報站」→ neo-brutalist 全站 reskin（亮底/2px硬邊/位移實影/藍黃撞色/IBM Plex Mono）。**邏輯零動只換皮**；品牌改「情報站」。設計師虛構砍四項（頁內假瀏覽器帳密框＝違反密碼承重牆、夜間時窗語意反轉、信心%、chips 多選）；漏的補八項（套用/清除、召回字、停用、二段刪除確認等）。字型 next/font 自託管＝CSP 零開洞。
- **G期驗收**：Playwright 實拍生產五頁對照設計稿，抓修一真 bug（同字多 keyword doc 重複 chips→按字去重），截圖五張傳 Adam。
- 自由行巡觀察閘：connected/零失敗；發現池裡 @null health=never 空殼帳號 doc（後台可移除）。
- 兩 commit 已推：fb2d8ca（F期）、2e7c249（G期）。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex-platform docs/KNOWLEDGE_METHODOLOGY_PLAYBOOK.md | 新增（068810a v18.32.5 文件），知識庫＋方法論可搬手冊 |
| ailivex-platform（repo 設定） | visibility public → private，三面驗證收案 |

---

## 下一步

1. 週一（8/3）GEO 自動輪跑起來時開病歷頁看 LiveRefresh 心跳＋任務進度%——兩件 UNKNOWN 收官，`gcloud run jobs executions list --job=geo-monitor-job` 佐證
2. 提醒 Adam 把朋友 GitHub 帳號加進 ailivex-platform collaborator（Settings→Collaborators），網頁與下載連結即通
3. 下次動 `skills/task-harness/SKILL.md` 時把三態標籤＋停機態織入回報格式

---

## 卡住 / 未解

2026-08-02 第2場：
- **8/3（週一）INLY＋AVIVA 自動輪**——LiveRefresh 真轉動＋任務進度% 兩件 UNKNOWN 的最終鑑別信號就在那天，記得看
- 豆油伯第一輪監測仍等 Adam 按（paused 中，病歷頁就地按鈕）
- GEO 無總帳閘：現只有每租戶 $50 上限（4 活躍月燒 ~$57 自然值）。Adam 知悉後裁定不動；日後租戶數上去要回頭蓋（FOUNDATION 成本章的延伸債，低利養著）
- zhu-core 髒檔 `skills/ailivex-knowledge-ingest.md`：7/23 莊子雷區增補（雷 10-14＋預寫 gists 段）**未 commit**，非本場筆跡——內容有價值，原主或下一場認領收進 git
- Three-Loop 三樣可偷（證據三態標籤/標準停機態 enum/考卷金句）待下次動 task-harness skill 時織入
- 沿前：優尼下一課（GOV.UK＋Laws of UX）、R6 首頁數字帶比較、GEO moderate CVE

2026-08-02 第1場：
- **觀察閘跑至 ~8/8**（不變）：每天瞄 scan_status/default；紅燈（challenge/expired）→ 換家用 ISP ASN。
- **evidenceVerified 對複合引句偏嚴**：摩斯愛用「句A」／「句B」串證據→子串比對不中→信心被冤枉壓成 low（高雄篇 2/8）。判斷本身對、方向安全（寧錯殺不放過瞎編）。小修方向：驗證器按「」／拆句逐一比對，任一中即 verified。十分鐘活，Adam 已知、等點頭。
- threads-radar root 有誤產的 untracked `.next/`（root 誤跑 next build 殘渣，rm 被權限擋）→ 下場順手 `rm -rf ~/.ailive/threads-radar/.next`。root 也多了 .vercel link（已被 .gitignore 蓋住，無實害）。
- 池裡 @null 空殼帳號 doc 待後台移除（一鍵）。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練、回訪窗最舊留言。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第2場。*
