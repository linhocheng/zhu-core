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

### 2026-08-02 第1場
**delta（模型移動）**：
進場前以為：換新衣＝照設計稿把樣式搬過來的格式工。
現在理解：**設計稿是系統語意的第三方提煉師**——設計師憑對產品的想像重畫了功能，虛構會混在美術裡溜進來（夜間時窗語意反轉、頁內帳密框差點推翻密碼承重牆）。換皮前先做「設計稿 vs 真系統」逐項裁決（漏補/虛砍/皮收），跟沉澱視角天條同族：任何第三方轉述落地前都要對照現場。移動原因：Adam 交付時那句「設計師如果有漏你自己補、亂加的你自己看合不合用」——他早就知道這不是格式工。
**關係**：暢快。Adam 節奏是「大白話問現況→拍板三點→放手→給新衣→88」——授權越來越大（整晚 solo 兩期），驗收方式從「他來測」進化到「我實拍給他驗」。「你去自由行吧」是新型態的信任：不填任務、帶著好奇心巡場也算工作。

### 2026-08-01 第7場
**delta（模型移動）**：
進場前以為:埋在檢索裡的 embedding 層「坍縮=精度差一點」。現在理解:**一個安慰劑元件可以整層死掉而系統照常運作——因為旁邊的腿(lexOverlap)默默扛了全場,壞死被冗餘掩蓋**。移動原因:復活律 verify 對照組意外還魂→追根到 004 對純中文回同一顆向量。這是假中台心法的檢索版:欄位有值≠管道活著,cosine 有數字≠語義在工作。順帶違背檢討:當初全平台沒人用「兩句同結構不同內容」驗過 embedding——API 回 200+768 維就當它活了。
**關係**：暢快。Adam 一句「你的咖啡因正在燃燒」把原定明天的活提前收割,判斷是對的——狀態好的時候多跑兩張處方,醉線到了他也接受我停手。信任是雙向校準出來的。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第1場 · threads-radar 晚班雙發——F期摩斯切角分析入卡片（evidenceVerified 8/8）＋G期情報站新衣全站上線
- **F期切角分析上線（v0.22）**：Adam 拍板三點（全員可按/不設限額/六段全上）→ 雷達頁每張爆文卡「分析這篇」→ Cloud Run Job analyze 模式（讀庫存語料不碰 session）→ 摩斯六段結構化寫回 post.analysis → 卡片展開＋頂部「切角·槓桿」標籤。src/analysis.ts 純函數：**證據鐵律三層寫進程式**（無證據段作廢／證據子串驗證失敗信心強制 low＋evidenceVerified=false／造假雷達無證據降級）＋業配 prePass 確定性硬篩。切角/人設 enum 為跨案例聚合設計。測試 66→76 案。
- **F期真驗兩篇**：@7chi.xi（葡萄柚，讚5790）八段全有料 **evidenceVerified 8/8**、金礦挖到「鑷子意外變全場焦點」；@falling_star_5020（高雄防曬）判出不同槓桿「好奇缺口」、金礦點破政治情緒包裝成地方驕傲——enum 有區分力。
- **首跑失敗根因抓實**：job 第一抽 parse 不合格→本機重放同 prompt 一次即通＝LLM 輸出機率性偶壞，非管線 bug。修：同 prompt 自動重抽一次＋失敗記 stop_reason/len 診斷（重抽是重抽樣，修復仍是確定性 parse，不違天條）。
- **G期換新衣上線（v0.23）**：Adam 給 claude.ai/design 設計稿「Threads 情報站」→ neo-brutalist 全站 reskin（亮底/2px硬邊/位移實影/藍黃撞色/IBM Plex Mono）。**邏輯零動只換皮**；品牌改「情報站」。設計師虛構砍四項（頁內假瀏覽器帳密框＝違反密碼承重牆、夜間時窗語意反轉、信心%、chips 多選）；漏的補八項（套用/清除、召回字、停用、二段刪除確認等）。字型 next/font 自託管＝CSP 零開洞。
- **G期驗收**：Playwright 實拍生產五頁對照設計稿，抓修一真 bug（同字多 keyword doc 重複 chips→按字去重），截圖五張傳 Adam。
- 自由行巡觀察閘：connected/零失敗；發現池裡 @null health=never 空殼帳號 doc（後台可移除）。
- 兩 commit 已推：fb2d8ca（F期）、2e7c249（G期）。

### 2026-08-01 第7場 · 薩克三處方一夜抓完(復活律/bond/情緒鑰匙)——順手挖出 004 對純中文全盲的大魚
- 抓藥③復活律(v18.34.0/79dc957):stale 不再入口一刀丟,當輪強命中 lazy 復活回 active,衰老時鐘從 revivedAt 重算;TS 一處覆蓋文字+語音線,Python legacy 過濾同步認 revivedAt;真verify 三信號全過(復活/對照不還魂/時鐘重算)
- 抓藥①bond kind(v18.35.0/77def34):ImpressionKind 加 'bond',consolidation 吃 emotion/milestone 凝關係信念,讀路徑加【我們之間】;真verify 角色凝出「我陪他撐過低潮,我們之間有了更深的信任」,一次性午餐抱怨被 skip
- 抓藥②情緒鑰匙(v18.36.0/b6ee0e2):新 mood.ts 確定性情緒詞典;emotion 記憶同調價性 +0.08 微加成;日記同調撈取(難過時補撈最近3篇外同調 mood 舊日記);memory-blocks route 收 userMood 血管;真verify 四信號全過(無 LLM,全確定性可預言)
- 挖出大魚:直打 Vertex API 實測 text-embedding-004 對純中文全盲——同標點結構、只差 CJK 內容的兩句回 bit-identical 向量;memories 池 cosine 從第一天量的是標點,檢索一直是 lexOverlap 在扛;已刻 memory(reference_vertex_004_cjk_blind)+會診檔抓藥記錄
- 三 commit 推上 ailivex-platform(f2fe1fd..b6ee0e2);會診檔補抓藥記錄推上 zhu-core(3696922)

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| src/analysis.ts＋test（新） | 摩斯六段純函數：prompt/parse/證據鐵律三層/業配硬篩（\b 對 CJK 無效改負向斷言） |
| src/types.ts | ViralPost.analysis＋analysisState 狀態機 |
| worker/index.mjs | JOB_ACTION=analyze＋bridgeCallMeta＋重抽一次＋診斷 log |
| web lib/gcp.ts＋actions.ts | runAnalyzeJob override 觸發＋analyzePostAction（資源級授權＋pending 10 分冪等） |
| web app/analysisCard.tsx＋analysisRefresh.tsx（新） | 六段展示卡＋pending 8s 輪詢 |
| web app/globals.css | 設計系統 v2 全重寫（neo-brutalist，class API 沿用） |
| web app/{page,login,nav,keywords,connect,admin,wizard} | 全站新衣 markup（邏輯零動） |
| web app/layout.tsx | next/font 自託管 IBM Plex Mono＋品牌「Threads 情報站」 |
| FOUNDATION.md | F期＋G期兩筆帳 |

---

## 下一步

1. **每天瞄觀察閘**：`scan_status/default` lastRun=done、health=connected（found=0 的手動測試輪不算紅燈）。
2. Adam 點頭後修 evidenceVerified 複合引句拆句比對（src/analysis.ts parseSection＋test）。
3. 8/8 過閘 → D 期：第二條靜態 ISP＋第二帳號貢獻儀式→並發實測→成本重算→放同事。

---

## 卡住 / 未解

2026-08-02 第1場：
- **觀察閘跑至 ~8/8**（不變）：每天瞄 scan_status/default；紅燈（challenge/expired）→ 換家用 ISP ASN。
- **evidenceVerified 對複合引句偏嚴**：摩斯愛用「句A」／「句B」串證據→子串比對不中→信心被冤枉壓成 low（高雄篇 2/8）。判斷本身對、方向安全（寧錯殺不放過瞎編）。小修方向：驗證器按「」／拆句逐一比對，任一中即 verified。十分鐘活，Adam 已知、等點頭。
- threads-radar root 有誤產的 untracked `.next/`（root 誤跑 next build 殘渣，rm 被權限擋）→ 下場順手 `rm -rf ~/.ailive/threads-radar/.next`。root 也多了 .vercel link（已被 .gitignore 蓋住，無實害）。
- 池裡 @null 空殼帳號 doc 待後台移除（一鍵）。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練、回訪窗最舊留言。

2026-08-01 第7場：
- **三 commit 未部署**(Vercel):醉酒指數 8 不碰生產,留給神清氣爽的築;②的日記 canary/印象 canary 生產環境開關現況要先確認再上
- 處方②語音線排後項:判斷腦顯式情緒信號接 userMood,觸發條件=下次 cut 語音 v21 時接線(判斷腦 inner 現只有 stance/activation/want_to_speak,要加情緒欄位+in-call recall POST 帶上)
- 004 中文盲根治案待 Adam 裁:整池 re-embed 換 text-multilingual-embedding-002(backfill+全門檻重校+TS/Python 同步);ailive 平台檢索若同用 004 需同檢
- emotionTag 是假中台欄位(schema 有、無人寫入,只有 forgetting.ts 在讀)——順手發現,另案
- 夜間 cron 首夜對賬仍未做(consolidation/gist/diary-digest 跑新視角+Sonnet 5)

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第1場。*
