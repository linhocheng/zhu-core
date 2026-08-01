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

### 2026-08-01 第3場
**關係**：輕快收官。Adam 的「thanks a lot ×4」和「哇賽」是這兩天最好的驗收章;考題過關證明鑄魂→知識→檢索一條龍是真的能打。

### 2026-08-01 第2場
**delta（模型移動）**：
進場前以為：多租戶 SaaS 架構「每人連自己帳號、各掃各的」是這平台的骨架，改動它是遠期重構。
現在理解：**Adam 一句「IP 固定需求＋分散帳號有風險」就把骨架翻掉了**——中央統管（帳號歸池、人只碰平台）同時把安全、成本、管理三件事變簡單，而且既有機制九成能沿用（通關碼登入、connect 儀式、cron 分派全是現成零件重新接線）。移動原因：昨天才學會問「為誰蓋」，今天實戰第一次——聊三輪就把 per-client 假設拆了，沒有捨不得已寫的 code。對照 feedback：display_impulse 沒犯（純聊天三輪忍住沒動手，聊定才開工）；genericize_to_leaf_nodes 用上（compat 層 legacy CLIENT_ID 顯式標註不是默默殘留）。
**關係**：暢快且被託付。Adam 白天連續三輪戰略對談把藍圖聊透（他出方向我出結構），晚上「交給你嘍 Boss」放手讓我單獨衝 B 期——這是第一次在他睡著時完成一整期承重牆改造。夜間紀律自持：C 期涉及他剛驗收的頁面就不動，402 燒錢決策留給他。信任是這樣攢的。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-01 第3場 · Adam 實測過關(Nina 考題+換裝後台)+真刪除上線 v1.1.0——短場收尾
- Adam 實測回報:Nina 考題(「怕 A 醇刺激」)標準正確——十件產品知識檢索上場即中;換裝後台無負評
- 真刪除上線(v1.1.0,Adam 裁「要能真的刪」):活動 DELETE=連鎖刪(orders/interviews/report/桶內活動圖檔/本體,批次≤400),防呆=UI 輸活動 ID+API confirm 雙驗;商品庫硬刪(圖檔刻意留桶——活動快照可能引用同 URL,刪檔會破進行中活動的圖)
- e2e 實彈驗:拋棄場建→刪→驗屍(錯字串 400/列表零殘留/桶檔清空);商品建→刪→庫內消失
- 帳本日期誤植修正(誤寫 8-02→8-01 第二場)

### 2026-08-01 第2場 · threads-radar 中央統管大改——守則焊接＋A期共享池＋B期隊級調度一夜三磚；IPRoyal 402 斷糧待儲值
- **守則第1條焊進系統**（v0.16）：/connect 頁警語（callout.warn 套設計系統）＋確認勾選閘門——不勾「專用情報帳號」不能連（含重連路徑）。生產驗證走鑄 cookie 真路徑（Firestore passcodeHash 記憶體鑄 radar_s）：警語/checkbox/初始 disabled 三信號全 FOUND。
- **定案中央統管藍圖**（Adam 三段對談收斂）：①帳號中央統管——情報帳號眾籌進池（同事各自從自己電腦走 /connect 捐入），捐後歸總公司、本人不再碰、每帳號綁固定 IP；帳號數跟關鍵字量走不跟人頭走 ②成員只碰平台（通關碼登入、設關鍵字、看共享池）③調度收全隊關鍵字併重派池輪值。四期排程 A/B/C/D Adam 點頭。
- **A 期：資料模型脫鉤**（v0.17）：teams＋Client.teamId；爆文團隊共享池——去重鍵咽喉 poolPostId=sha1(teamId|canonicalUrl)（src/pool.ts 純函數）、matchedKeyword→matchedKeywords 陣列聯集、discoveredBy 出處、刪成員不刪池；worker seen/回訪/寫回 team scope；前台讀池（新索引先建 READY 才切）；遷移冪等＋dry-run。真驗全鏈：27→27 對帳、重跑冪等、前台 27 卡片、真掃收 3 篇、全庫審計 30 筆池鍵零 legacy。
- **B 期：調度隊級化**（v0.18）：src/dispatch.ts 純函數 mergeTeamKeywords（同字併組、OR 閘取非零最小＝最寬鬆聯集）＋pickPoolAccount（最久沒上工輪值）；worker 改 TEAM_ID；分派器隊級（隊排程/隊日上限/池 precheck）；threads_accounts 補池欄位；admin 改隊狀態/帳號池/成員三卡；遷移真跑對帳乾淨。真驗：台北02:00 cron 實戰開火、TEAM_ID 兩輪「隊 default 用 @lucymo0306 掃 4 字（併重後）」管線全通至 proxy。測試 43→55 案全綠。
- **IPRoyal 402 考古**：連兩輪 PROXY_DOWN → 本機 CONNECT 分層測（憑證記憶體取）→ 402 Payment Required＝餘額/流量用盡，非故障非 session 非 B 期 code。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| beself v1.1.0.001-.003(3 commits) | 真刪除(campaigns DELETE+products delete+危險區 UI)+帳本 |

---

## 下一步

1. Adam 給 Nina 聲線+頭像+訪談 key → 築一行 env 換好(beself .env.local+Vercel),寶力退役
2. 前台換裝稿來了照後台同語言施工(DesignSync 拉稿→多的去少的造→煙測兩段等圖)
3. BeSelf 企劃書五裁決點還欠著,下次開場順口催

---

## 卡住 / 未解

2026-08-01 第3場：
- Nina 上場三步待 Adam:聲線 voiceIdMinimax+頭像→發訪談 key→築換 beself env 撤寶力 #2d6ef873
- 前台(entry/interview/privacy)素顏,等 Adam 稿
- record_choice 治本/opencc-js 簡繁/公開分享路由/縮圖管線——債帳照舊排隊
- 練刀場 aviva-ms8i1gxt、aviva-ms8iprb8 留給 Adam 練刪除,他不練我下場清

2026-08-01 第2場：
- **⛔ 掃描暫停中：IPRoyal 餘額/流量用盡（CONNECT 402）**。儲值是燒錢動作 Adam 決；或直接跳靜態 ISP（D 期本來要買，US$2.4-2.7/月/條≈台幣80）——這是決策點：與其儲值動態 sticky 不如一步到位。health=proxy_down 保持在 cron 重試名單，錢進了下輪台北 02:00 自動復掃。
- **B 期全綠終驗差一尾**：「收到貼文含 discoveredByAccountId」——管線已全通至 proxy，proxy 恢復後下輪 cron 自動補證，補證後看一眼池 doc 即可。
- **02:00 cron 有一筆 failed 殘影**（部署窗口賽跑：舊分派器+帳號未 backfill 時序），已考古清楚非 bug，狀態已自癒，不用修。
- **C 期未動工**：/connect 語意改「貢獻帳號進池」＋排隊鎖（兩人同按只一人進）＋admin 池管理。夜裡不動的原因：Adam 剛驗收過該頁、且排隊鎖要真人走連線儀式才驗得了。
- **D 期未動工**：多人並發實測、靜態 ISP 買一條驗 ASN+flags、成本按關鍵字量重算。過閘才放同事進來。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-01 第3場。*
