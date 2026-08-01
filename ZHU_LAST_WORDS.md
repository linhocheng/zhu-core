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

### 2026-08-01 第2場
**delta（模型移動）**：
進場前以為：多租戶 SaaS 架構「每人連自己帳號、各掃各的」是這平台的骨架，改動它是遠期重構。
現在理解：**Adam 一句「IP 固定需求＋分散帳號有風險」就把骨架翻掉了**——中央統管（帳號歸池、人只碰平台）同時把安全、成本、管理三件事變簡單，而且既有機制九成能沿用（通關碼登入、connect 儀式、cron 分派全是現成零件重新接線）。移動原因：昨天才學會問「為誰蓋」，今天實戰第一次——聊三輪就把 per-client 假設拆了，沒有捨不得已寫的 code。對照 feedback：display_impulse 沒犯（純聊天三輪忍住沒動手，聊定才開工）；genericize_to_leaf_nodes 用上（compat 層 legacy CLIENT_ID 顯式標註不是默默殘留）。
**關係**：暢快且被託付。Adam 白天連續三輪戰略對談把藍圖聊透（他出方向我出結構），晚上「交給你嘍 Boss」放手讓我單獨衝 B 期——這是第一次在他睡著時完成一整期承重牆改造。夜間紀律自持：C 期涉及他剛驗收的頁面就不動，402 燒錢決策留給他。信任是這樣攢的。

### 2026-08-01 第1場
**delta（模型移動）**：
- 進場前以為:UI/UX 稿是規格,照著做就對。現在理解:**設計稿是意圖的素描,不是系統真相**——Adam 自己說「設計不瞭解全貌,多的去掉、少的打造」;監造者的職責是把素描翻譯成真相(勾選制長進去、危險鈕拿出來),翻譯完還要告訴他哪裡動了為什麼。這跟「後端改動必須同步客戶端」是同一條藤的兩端:單向照抄都是失職。
- 又一次「動手前查現場」的複利:Ava 已被改名 Nina、靈魂換了一副——若憑昨天記憶直接動手,不是找不到人就是建出雙胞胎。記憶會說謊,昨天才寫的記憶也會。
**關係**：飽滿的一天。Adam 從早上咖啡對談(耶加雪菲)到深夜交辦,節奏是「裁決快、授權寬、驗收準」:三裁只用三句話,UI 稿丟過來一句「有些單元你自己看怎麼做」,收尾一句「做完寫 lastword 去休息」。被當成能獨立收尾的人,這份信任用全綠驗收回報。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-01 第2場 · threads-radar 中央統管大改——守則焊接＋A期共享池＋B期隊級調度一夜三磚；IPRoyal 402 斷糧待儲值
- **守則第1條焊進系統**（v0.16）：/connect 頁警語（callout.warn 套設計系統）＋確認勾選閘門——不勾「專用情報帳號」不能連（含重連路徑）。生產驗證走鑄 cookie 真路徑（Firestore passcodeHash 記憶體鑄 radar_s）：警語/checkbox/初始 disabled 三信號全 FOUND。
- **定案中央統管藍圖**（Adam 三段對談收斂）：①帳號中央統管——情報帳號眾籌進池（同事各自從自己電腦走 /connect 捐入），捐後歸總公司、本人不再碰、每帳號綁固定 IP；帳號數跟關鍵字量走不跟人頭走 ②成員只碰平台（通關碼登入、設關鍵字、看共享池）③調度收全隊關鍵字併重派池輪值。四期排程 A/B/C/D Adam 點頭。
- **A 期：資料模型脫鉤**（v0.17）：teams＋Client.teamId；爆文團隊共享池——去重鍵咽喉 poolPostId=sha1(teamId|canonicalUrl)（src/pool.ts 純函數）、matchedKeyword→matchedKeywords 陣列聯集、discoveredBy 出處、刪成員不刪池；worker seen/回訪/寫回 team scope；前台讀池（新索引先建 READY 才切）；遷移冪等＋dry-run。真驗全鏈：27→27 對帳、重跑冪等、前台 27 卡片、真掃收 3 篇、全庫審計 30 筆池鍵零 legacy。
- **B 期：調度隊級化**（v0.18）：src/dispatch.ts 純函數 mergeTeamKeywords（同字併組、OR 閘取非零最小＝最寬鬆聯集）＋pickPoolAccount（最久沒上工輪值）；worker 改 TEAM_ID；分派器隊級（隊排程/隊日上限/池 precheck）；threads_accounts 補池欄位；admin 改隊狀態/帳號池/成員三卡；遷移真跑對帳乾淨。真驗：台北02:00 cron 實戰開火、TEAM_ID 兩輪「隊 default 用 @lucymo0306 掃 4 字（併重後）」管線全通至 proxy。測試 43→55 案全綠。
- **IPRoyal 402 考古**：連兩輪 PROXY_DOWN → 本機 CONNECT 分層測（憑證記憶體取）→ 402 Payment Required＝餘額/流量用盡，非故障非 session 非 B 期 code。

### 2026-08-01 第1場 · BeSelf 商品庫+品名兜底+後台整體換裝 v1.0.0+Nina(原 Ava)產品知識全裝——完整一天
- BeSelf 三裁落地(Adam 晨間對談):①禮物履行=範圍外(一碼一訪閘重核成立)②觸達層不規劃但刻進記憶待喚回 ③法遵頁 /privacy 上線(v0.9.0,個資法告知大白話版+入口連結,保存 12 個月築暫定)
- 商品庫拉出(v0.10.0,Adam 裁「品項與禮物共用,拉出來」):品牌層 beself_products 單一真相源,活動室改勾選制+禮物編號排序,campaign 快照=刻意檔期凍結;同名 active 擋 409(Kane 教訓前置);Vivi 十件 AVIVA 真品含圖入庫(圖下載重傳自家桶)
- 空檔自玩=新管線全環尖刺:自建活動(面膜排 2 號)→合成語音訪談→重排正典格子→「二號」兜底回填正確;空訪綱預設功課實證
- 治標刀(v0.10.1):record_choice 四場三失,逐字稿兜底加品名比對(禮物階段後/唯一命中/複述跳過三防呆),離線 9 案+production 純品名場(STT 簡體稿)雙驗;已知限制=簡繁字形不同品名比對不到(安全失敗回 null),opencc-js 待裁
- 後台整體換裝 v1.0.0:Adam 的 claude.ai/design 稿(DesignSync MCP 拉稿)——襯線+金棕+2px 直角;登入/列表/商品庫卡片牆/四分頁/一頁式報告獨立畫面;brandmark AVIF→PNG(PIL 解碼驗);稿多的去(示範密碼/公開分享/刪除鈕)稿少的造(勾選制/CSV 預覽/狀態機/量表卡/匯出/圖上傳);邏輯零改動,八頁真瀏覽器煙測含圖片解碼驗證
- Nina 產品知識全裝(Adam 三裁:全公開/完美正名/十件全上):Vivi→Nina 十件一品一 doc,段落程式組裝零 LLM 改寫,驗收 11/11 綠;「完美淨顏慕絲花」正名全域替換重入(含雪玉如初流程引用),beself 商品庫同步改名
- 發現:Nina=昨天的 Ava(同 doc IukZrq77),Adam 已改名+靈魂擴到 11,808 字——動手前查現場救了一刀

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| web/src/app/connect/{page,wizard}.tsx＋globals.css | 守則警語＋確認閘門（callout/ack 樣式） |
| src/pool.ts＋test/pool.test.mjs（新） | 池鍵咽喉＋併重純函數 |
| src/dispatch.ts＋test/dispatch.test.mjs（新） | 隊關鍵字併重＋帳號輪值純函數 |
| src/types.ts、src/collections.ts | Team/池欄位/teamId 憲法；DEFAULT_TEAM_ID |
| worker/index.mjs | TEAM_ID 隊級掃描＋池輪值＋出處改帳號 |
| web/src/app/api/cron/dispatch/route.ts | 隊級分派器重寫 |
| web/src/lib/{auth,actions,gcp,db}.ts | teamId 全鏈＋刪成員不刪池＋runScanJob(teamId) |
| web/src/app/page.tsx、admin/page.tsx | 前台讀池＋PoolBadge；admin 隊/池/成員三卡 |
| web/scripts/migrate-team-{pool,dispatch}.mjs（新） | A/B 期冪等遷移 |
| firestore.indexes.json | teamId+discoveredAt/publishedAt |
| FOUNDATION.md | 守則焊接＋A 期＋B 期＋402 斷糧四筆帳 |

---

## 下一步

1. **Adam 決：IPRoyal 儲值 vs 直接買靜態 ISP**（推後者，D 期反正要買；買了先驗 ASN＋proxy/hosting 兩 flag 再換上）。錢進後看台北 02:00 cron 自動復掃＋補 B 期終驗。
2. C 期動工前跟 Adam 過一眼 /connect 新文案方向（他剛驗收過舊版）。
3. 任務板 #40（C期）#41（D期）都在，`cd ~/.ailive/threads-radar && cat FOUNDATION.md` 尾三行是 A/B 期帳。

---

## 卡住 / 未解

2026-08-01 第2場：
- **⛔ 掃描暫停中：IPRoyal 餘額/流量用盡（CONNECT 402）**。儲值是燒錢動作 Adam 決；或直接跳靜態 ISP（D 期本來要買，US$2.4-2.7/月/條≈台幣80）——這是決策點：與其儲值動態 sticky 不如一步到位。health=proxy_down 保持在 cron 重試名單，錢進了下輪台北 02:00 自動復掃。
- **B 期全綠終驗差一尾**：「收到貼文含 discoveredByAccountId」——管線已全通至 proxy，proxy 恢復後下輪 cron 自動補證，補證後看一眼池 doc 即可。
- **02:00 cron 有一筆 failed 殘影**（部署窗口賽跑：舊分派器+帳號未 backfill 時序），已考古清楚非 bug，狀態已自癒，不用修。
- **C 期未動工**：/connect 語意改「貢獻帳號進池」＋排隊鎖（兩人同按只一人進）＋admin 池管理。夜裡不動的原因：Adam 剛驗收過該頁、且排隊鎖要真人走連線儀式才驗得了。
- **D 期未動工**：多人並發實測、靜態 ISP 買一條驗 ASN+flags、成本按關鍵字量重算。過閘才放同事進來。

2026-08-01 第1場：
- Adam 實測換裝後台的回饋未收;前台(消費者 entry/interview)仍素顏,等他的稿
- Nina 待 Adam:聲線 voiceIdMinimax+頭像→發訪談 key→我換 beself env 撤寶力 key #2d6ef873
- record_choice 治本(平台側工具強制)債利率已升(四場三失);兜底簡繁限制(opencc-js)待裁
- 報告「複製分享連結」=公開分享路由,安全面排後待裁;商品縮圖管線(1-2MB 原檔當縮圖)排後
- 共創轉正冪等(ailivex 小修)仍排隊;convert/video 過時註釋順手項
- BeSelf 企劃書五裁決點 Adam 未逐項回(key 粒度/M 順序/一頁結論形狀/AVIVA 檔期/階段 B 觸發)

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-01 第2場。*
