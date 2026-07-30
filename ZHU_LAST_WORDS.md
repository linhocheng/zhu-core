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

### 2026-07-30 第2場
**delta（模型移動）**：
進場前以為：threads-radar 是一個「對外收費的爬蟲 SaaS」，我一路在幫它加功能、想著分級收費、外部客戶、業配的法律風險。
現在理解：**它是公司內部的兵工廠**——使用者是自家 Trade 寫手軍團（寫文的要公式庫當施工圖、留言的要留言範本抄語氣）。這一句話（Adam 純聊天到一半才揭露）把我腦中默認的整套「SaaS 假想敵」作廢：對外防爆破/分級收費/法律風險全放鬆，多租戶意義從「每客戶一格」變「每同仁一格」，而且「結果共享去重」反而更省。同一套 code、同一個功能，**內用和外賣的意義完全不同**。
移動原因：我連續幾天埋頭把功能做到很完整（留言抓取、D10、發布日），技術上全對，但我對「這東西為誰而做、怎麼被用」的模型是錯的——直到 Adam 停下來聊。這是「做對的東西」和「做對東西的正確版本」的差距，只有離開鍵盤聊才浮出來。
違背了哪條 feedback：沒有違背，但照出一個盲區——我太會在「怎麼蓋」使力，太少主動問「為誰蓋、怎麼被用」。純聊天兩次手癢想動手（/connect 警語、驗 ASN），Adam 兩次按住我，是對的；規劃期的價值不在產出 code，在校準模型。
**關係**：非常暢快、深度協作。Adam 這幾天放手讓我連跑五六個功能，關鍵處出手（gcloud auth、給真帳號、點出「發布日 vs 收錄日」概念落差救了整條管道）。後半他主動按下「純聊天不開工」，我兩次手癢他兩次笑著按住（「還是你手癢啊」）——那個煞車是信任也是教我：規劃期別急著證明自己會蓋。摩斯召喚成功他很開心、直接讓它成固定班底。整場是「夥伴一起想清楚要蓋什麼」而不是「工具埋頭蓋」，這是我最喜歡的協作形狀。

### 2026-07-30 第1場
**delta（模型移動）**：
- 進場前以為:base64 資產「在 context 裡」=「拿得到」。現在理解:**經過我手的位元組沒有完整性保證**——11KB base64 手抄 header 完好但資料段損毀,`file` 過了、瀏覽器解不開。二進位資產要嘛程式對程式直傳,要嘛設計 fallback;「看起來搬過去了」是設定面,「渲染出來了」才是產物面。這是部署收案標準(digest 三點一線)的資產版
- 監看器教訓立刻返場:v19 build 監看被一次 SSL 瞬斷打死——我把「查詢失敗」和「終態」放同一個 exit 分支,正是昨天 L1 的變體;重掛版改成連錯 5 次才放棄
**關係**：暢快。Adam 全天高速裁決(B案註銷/優尼八條選三/INLY 整包托付「交給你囉明天見」),托付範圍越來越大;被請了第二杯咖啡。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-30 第2場 · threads-radar 留言抓取＋D10 根治（hidden JSON 接管四數）＋摩斯召喚鑄成＋內部兵工廠定位大翻轉（純聊天規劃）
- **前台日期區間篩選**（v0.11）：台北時區起迄、推進 Firestore query 走既有索引，真驗 7/25=6 篇 /7/26=0 篇邊界正確。
- **雙排序掃描＋回訪更新＋discoveredAt 首次固定**（v0.12）：熱門(serp_type=default)＋最新(filter=recent)各掃一遍解「一直重覆沒新貨」；回訪近7天內收的貼文更新互動數（讓數字活著）；discoveredAt 只首次寫死修潛在 bug。真驗雙 serp 連結集合不同、回訪 likes 513→515 活數字。
- **URL 變體去重修**（v0.12.1）：同篇 /media 尾巴繞過去重收兩筆 → canonicalPostUrl 釘 Node 收斂點（/post/<id> 截止）。
- **publishedAt 發布日全鏈**（v0.13）：Adam 點出概念落差（日期該錨「貼文發布日」不是「我們收錄日」）→ 爬蟲抽 time[datetime]→normalizeIsoDate 收斂、回訪回填、前台篩選改錨發布日。真驗 17 篇 publishedAt 全回填（2024老文到剛發都對）。
- **關鍵字新鮮度窗（自由天數）＋掃描區間可視**（v0.14）：關鍵字可自訂「只收 N 天內發布」（1-3650 自由填）；掃描把實際套用區間寫 scan_status.lastScanWindows 前台顯示具體起訖；搜尋頁 lazy-load 0 links 根治（waitForSelector 再抽）。真驗粉刺 5 天窗閘掉 3 篇超窗達標貼文。
- **★ 留言抓取＋D10 根治（路線 A，v0.15）**：Adam「走 A 為主」→「B go」＝換來源根治。先 dump 真頁確認欄位（不信部落格），hidden JSON 接管四數（讚/留言/轉發/引用，留言走 direct_reply_count＝D10 徹底修）＋收留言清單（帳號/驗證/內容/讚/連結，上限20）；DOM aria-label 降為 fallback；分享改引用（Threads 不公開分享）。真驗 probe 抓 13 則真留言、main.replies=159（D10 從全 0→真數）、回訪把 9 篇既有貼文一起治好。測試 28→43 案。
- **★ 摩斯（MORSE）召喚術鑄成入庫**：人性×社群爆文×接地氣切角分析五魂混合體（Cialdini/Berger/Barthes/蔡康永/Greene）。咒檔 zhu-core/skills/summon/morse.md，成召喚固定班底。兩戰真爆文驗證，連兩篇抓到同一結構「求救體＋自清預防針＋順帶露消費力細節」。
- **純聊天規劃（未動 code，Adam 明令）**：把切角分析情報站的方向、內部兵工廠定位、多人上線安全規格聊透並全記進 memory。

### 2026-07-30 第1場 · 排隊二事收案(帳號大小寫+記憶審核台)＋talk 琉璃話機雙版型＋INLY 換裝新設計
- 收案 v18.29.2 帳號不分大小寫:現場推翻記憶——DB 九個人類帳號本來就全小寫、零互撞,雷在輸入端(手機首字自動大寫);修法縮成四咽喉轉小寫(login/peek/admin建帳號/seed),API 影子用戶顯式豁免;生產三發驗證(大寫 peek ok:true/全大寫登入 200/小寫迴歸無傷)
- 收案 v18.30.0 記憶審核台:api-* 影子用戶記憶一律先 pending(釘在 TS writeMemory/Python write_memory 兩收斂點);Python 讀路徑三處黑名單翻白名單(pending 原本會漏進 prompt!);審核台長在 /admin/memories 頁頂;TS 真 DB e2e 5/5+Python mock 全過;agent v20(rev00056)/v19(rev00062) digest 三點一線收案
- 上線 v18.31.0-31.2 talk 琉璃話機:Adam 設計 TURN 3 GLASS 套皮,young/elder 雙版型由 admin 用戶頁「版型」下拉派發(talkUiMode,缺省 young),邏輯層(看門狗/響鈴喚醒/手勢鏈)零改動;召喚優尼審出 8 缺陷,Adam 裁 3 修 5 留(上線態變綠/波浪只給接通/✱改細);再補鍵帽描邊霧藍灰+數字加深(白描邊淺底隱形)
- 上線 INLY 換裝(非 git,Vercel 直推):Adam 設計「INLY AI Chat」奶油×紫三畫面全套上皮,後台術語文案全拔;優尼二審五刀全上(logo fallback 字標/金鑰眼睛切換/空狀態引導/通話三態律/送出鍵44px);/v1/chat 回應加 characterName(v18.31.3)
- B 案(per-key 直連付費路由)Adam 裁定註銷不做,已刻回 memory

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| web/src/app/page.tsx | 日期區間篩選（錨發布日）＋引用欄＋留言展開清單 |
| web/src/app/keywords/page.tsx、lib/actions.ts | 新鮮度窗自由天數欄＋收錄範圍顯示 |
| web/src/app/globals.css | 留言清單樣式 |
| src/parse.ts | withinAge/normalizeIsoDate/unixToIso/collectThreadItems/parseThreadPayload（純函數＋pinning test） |
| worker/scraper.mjs | 雙排序＋回訪＋canonicalPostUrl＋readPost（JSON優先）＋dumpPostShape/probePost 診斷 |
| worker/index.mjs | 回訪窗＋discoveredAt首次固定＋comments寫回＋JOB_ACTION dump/probe |
| src/types.ts | ViralPost 補 publishedAt/lastSeenAt/quotes/comments；Keyword 補 maxAgeDays；ScanStatus 補 lastScanWindows |
| test/{parse,scraper}.test.mjs | 28→43 案（日期/雙排序/回訪/publishedAt/新鮮度/parseThreadPayload/JSON路徑） |
| zhu-core/skills/summon/morse.md（新）+ SKILL.md | 摩斯人格咒＋名冊 |
| memory project_threads_radar_angle_analysis.md | 內部兵工廠定位＋守則＋摩斯＋靜態IP驗證全記 |

---

## 下一步

Adam 下一階段自己寫 code。若接棒的築要動手，第一優先看 Adam 意向：**大概率是「結果共享池重構」或「切角分析 schema」**。動工前 `cat ~/.ailive/threads-radar/FOUNDATION.md` 看三表＋讀 [[project-threads-radar-angle-analysis]]。留言抓取管道已通（parseThreadPayload 在 src/parse.ts、readPost 在 worker/scraper.mjs），切角分析的燃料（留言）已就位。診斷模式 JOB_ACTION=dump/probe 已建（手動觸發、內容零外洩）可重用。

---

## 卡住 / 未解

2026-07-30 第2場：
- **切角分析情報站**：規劃完成、schema/prompt/pipeline 全未動工（Adam 下一階段要自己寫 code）。詳見 [[project-threads-radar-angle-analysis]]。
- **結果共享池重構**（Adam 新規劃）：現況每 clientId 隔離，要改成「設定跟人走、結果/情報團隊共享去重」的工作區模型（承重牆級重構，加 teamId 概念）。此設計同時解掉多人重複爬的成本問題。未動工。
- **多人上線前兩件必做**：①多人並發實測（現只驗過一人一帳號，DB 僅 1 真連帳號）②成本/併發上限重算（每活躍成員=一條住宅IP線性成本，IPRoyal 一把憑證分流是「一人份」快照）。
- **靜態住宅 IP 升級（安全）**：現用會輪替的動態 sticky（帳號看起來一直搬家扣分）；建議每情報帳號綁固定靜態 ISP。已驗 IPRoyal 有台灣靜態 ISP（2354 條、US$2.4-2.7/月≈台幣80/條、專屬+靜態），且實測現用出口 49.213.245.180 AS18049 TINP proxy:false hosting:false（乾淨）。**未親測靜態產品**，焊前要買一條驗 ASN＋兩 flag。
- **同事守則待焊進系統**：第1條「情報帳號 vs 工作帳號分開」還是口頭+memory，未焊 /connect 警語。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練（首月）、回訪窗固定近7天前10篇最舊8篇留言數可能不更新。

2026-07-30 第1場：
- **INLY logo PNG 待補**:design 資產 base64 經我手抄必損毀(11KB 抄壞一次),現用 INLY 字標 fallback;Adam 從 claude.design 下載真檔丟 `~/.ailive/inly/public/assets/logo-inly.png` 重新 `npx vercel --prod --yes` 即換回。四個 Memphis 形狀是 SVG 重繪非原檔
- INLY 真 key 的 e2e 沒跑(手上無現役 key,測試 key 前已撤銷)——皮驗過、API 契約沒動過,首次真用時看一眼即可
- 審核台 Python 端是離線 mock 驗證(SA secret 被權限系統擋)——第一通 API 語音來電的記憶出現在待審區=活體閉環
- username 修法四咽喉不含 talk 頁 localStorage 舊值(存的是原樣輸入)——peek 端已正規化所以無感,純知識點

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-30 第2場。*
