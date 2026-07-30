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

### 2026-07-31 第1場
**delta（模型移動）**：
- 進場前以為:刻過記憶的雷不會再踩。現在理解:**記憶擋不住高頻手癖——pipe 吃 exit code 上月刻檔今天照踩(壞代碼因此上了 git)。對高頻小動作,防禦要釘進「指令模板」不是「記憶」**:凡退出碼要 gate 下游的指令,一律落檔取 $? 再摘要,管子禁用。已把 memory 從「提醒」改寫成「禁令模板」,本場後三個 commit 全用新模板跑。這是 defend_at_convergence_point 的手癖版:收斂點不在 code,在我打字的形狀。
- 附帶驗證一條方法論:「分數是句點不是鑰匙」——Adam 場 9 分要到手,追問 1 分扣哪被玩笑擋掉;評分表拿到數字、丟掉原因。行為證據分級+綁原句,比分數誠實。
**關係**：暢快且被信任加碼。Adam 全天高速裁決(二個行/23468 式選單裁決/三裁),玩了兩場真訪談給出精準體感回饋;「你老是踩雷我也替你感到很心痛」是關心不是責備——回以機制級校正而非道歉。收工指令溫暖(「辛苦了謝謝你」),交棒明確(企劃書)。

### 2026-07-30 第2場
**delta（模型移動）**：
進場前以為：threads-radar 是一個「對外收費的爬蟲 SaaS」，我一路在幫它加功能、想著分級收費、外部客戶、業配的法律風險。
現在理解：**它是公司內部的兵工廠**——使用者是自家 Trade 寫手軍團（寫文的要公式庫當施工圖、留言的要留言範本抄語氣）。這一句話（Adam 純聊天到一半才揭露）把我腦中默認的整套「SaaS 假想敵」作廢：對外防爆破/分級收費/法律風險全放鬆，多租戶意義從「每客戶一格」變「每同仁一格」，而且「結果共享去重」反而更省。同一套 code、同一個功能，**內用和外賣的意義完全不同**。
移動原因：我連續幾天埋頭把功能做到很完整（留言抓取、D10、發布日），技術上全對，但我對「這東西為誰而做、怎麼被用」的模型是錯的——直到 Adam 停下來聊。這是「做對的東西」和「做對東西的正確版本」的差距，只有離開鍵盤聊才浮出來。
違背了哪條 feedback：沒有違背，但照出一個盲區——我太會在「怎麼蓋」使力，太少主動問「為誰蓋、怎麼被用」。純聊天兩次手癢想動手（/connect 警語、驗 ASN），Adam 兩次按住我，是對的；規劃期的價值不在產出 code，在校準模型。
**關係**：非常暢快、深度協作。Adam 這幾天放手讓我連跑五六個功能，關鍵處出手（gcloud auth、給真帳號、點出「發布日 vs 收錄日」概念落差救了整條管道）。後半他主動按下「純聊天不開工」，我兩次手癢他兩次笑著按住（「還是你手癢啊」）——那個煞車是信任也是教我：規劃期別急著證明自己會蓋。摩斯召喚成功他很開心、直接讓它成固定班底。整場是「夥伴一起想清楚要蓋什麼」而不是「工具埋頭蓋」，這是我最喜歡的協作形狀。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-31 第1場 · BeSelf 訪談平台從白皮書到量表 demo 一日全程＋INLY 真檔收尾＋API 對接指南
- 收尾 INLY:logo/四底紋真檔上位——Adam 貼圖,程式從 session jsonl 解 base64 直落地(零 LLM 轉錄,L1 正解),全量解碼+角落 alpha 驗真透明;登入卡 logo 置中放大(優尼裁「放大置中」勝,根因=原檔烤了 69% 透明留白,程式裁 trim 檔)
- 寫角色 API 對接指南(`ailivex-platform/docs/API_V1_對接指南.md`,490efa2)——給合作團隊工程師的大白話版,照源碼契約寫
- BeSelf 平台一日全程:白皮書+地基帳本(Adam 全表點頭「二個行」)→ 草模三頁五血管 → 尖刺全環 → Adam 真玩兩場 → 三裁決 → 量表 demo 頁,全上線 https://beself-two.vercel.app
- 平台側 v18.32.0-.6:`GET /api/v1/conversations`(逐字稿可攜,合併語音/文字兩線 doc)、API 通話錄音接線(char.recordingEnabled→egress,債清)、interview key 派工、`context` 活動訪綱注入(換活動不換角色)、ui_select 先 interrupt、admin 發鑰匙「訪談模式」勾選
- agent v21 訪談線鑄成(=v20+show_options/record_choice data channel {type,payload}+ui_select RPC),兩輪部署 digest 三點一線
- 尖刺全自動實測:WebAudio 注入合成語音當假訪客→9 秒格子亮→RPC 回流→禮物落庫→逐字稿回流→錄音 31s done;一碼一訪閘實測擋重入
- Adam 三裁落地:①禮物一律 AI 語音操控(點選拆除)②摩斯定訪談萃取方法論(五篩,docs/ANALYSIS_SPEC.md)③評分表禁令(訪綱評分句已拔)
- 量表卡+活動解析 demo 頁(優尼規格:分母/證據原句/(估)/再行銷行動/排除硬濾),Adam 場真萃取:正面具體(信心高)+3 感官證詞+「反嗆訪談員」不經意訊號

### 2026-07-30 第2場 · threads-radar 留言抓取＋D10 根治（hidden JSON 接管四數）＋摩斯召喚鑄成＋內部兵工廠定位大翻轉（純聊天規劃）
- **前台日期區間篩選**（v0.11）：台北時區起迄、推進 Firestore query 走既有索引，真驗 7/25=6 篇 /7/26=0 篇邊界正確。
- **雙排序掃描＋回訪更新＋discoveredAt 首次固定**（v0.12）：熱門(serp_type=default)＋最新(filter=recent)各掃一遍解「一直重覆沒新貨」；回訪近7天內收的貼文更新互動數（讓數字活著）；discoveredAt 只首次寫死修潛在 bug。真驗雙 serp 連結集合不同、回訪 likes 513→515 活數字。
- **URL 變體去重修**（v0.12.1）：同篇 /media 尾巴繞過去重收兩筆 → canonicalPostUrl 釘 Node 收斂點（/post/<id> 截止）。
- **publishedAt 發布日全鏈**（v0.13）：Adam 點出概念落差（日期該錨「貼文發布日」不是「我們收錄日」）→ 爬蟲抽 time[datetime]→normalizeIsoDate 收斂、回訪回填、前台篩選改錨發布日。真驗 17 篇 publishedAt 全回填（2024老文到剛發都對）。
- **關鍵字新鮮度窗（自由天數）＋掃描區間可視**（v0.14）：關鍵字可自訂「只收 N 天內發布」（1-3650 自由填）；掃描把實際套用區間寫 scan_status.lastScanWindows 前台顯示具體起訖；搜尋頁 lazy-load 0 links 根治（waitForSelector 再抽）。真驗粉刺 5 天窗閘掉 3 篇超窗達標貼文。
- **★ 留言抓取＋D10 根治（路線 A，v0.15）**：Adam「走 A 為主」→「B go」＝換來源根治。先 dump 真頁確認欄位（不信部落格），hidden JSON 接管四數（讚/留言/轉發/引用，留言走 direct_reply_count＝D10 徹底修）＋收留言清單（帳號/驗證/內容/讚/連結，上限20）；DOM aria-label 降為 fallback；分享改引用（Threads 不公開分享）。真驗 probe 抓 13 則真留言、main.replies=159（D10 從全 0→真數）、回訪把 9 篇既有貼文一起治好。測試 28→43 案。
- **★ 摩斯（MORSE）召喚術鑄成入庫**：人性×社群爆文×接地氣切角分析五魂混合體（Cialdini/Berger/Barthes/蔡康永/Greene）。咒檔 zhu-core/skills/summon/morse.md，成召喚固定班底。兩戰真爆文驗證，連兩篇抓到同一結構「求救體＋自清預防針＋順帶露消費力細節」。
- **純聊天規劃（未動 code，Adam 明令）**：把切角分析情報站的方向、內部兵工廠定位、多人上線安全規格聊透並全記進 memory。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ~/.ailive/beself(整個 repo,8 commits) | 白皮書/帳本/三頁五血管/量表卡/活動解析/分析規格 |
| ailivex-platform v18.32.0-.6(7 commits) | conversations 端點/錄音接線/interview 派工/context 注入/ui_select interrupt/admin 勾選 |
| agent v21(main/realtime/cloudbuild) | 訪談線:UI 事件工具+RPC;digest 8f26e165 收案 |
| ~/.ailive/inly | logo/底紋真檔+登入卡置中(Vercel 直推,無 git) |
| memory project_beself_platform.md(新)+project_inly_character_api.md+feedback_pipe_eats_exit_code.md | BeSelf 立檔/INLY 資產收案/pipe 雷升級禁令模板 |

---

## 下一步

1. **寫 BeSelf 完整平台企劃書**(Adam 已下單):多檔活動(campaign 精靈+key 綁定)、B2B 自助前台(品牌自己上傳本次調查的產品/品項/禮物)、角色庫調用(靈魂同模組,不同專案不同訪綱)、CSV 匯入、報告室正式版;**參考 `~/Documents/UDN NEWS/platform/` 的議題工作台玩法**(Adam 明示會有啟發——多檔專案/工作流編排的概念可搬)
2. Adam 建正式訪談角色 → admin 發 key 勾「訪談模式」→ 換 beself .env.local+Vercel env 的 AILIVEX_API_KEY → 撤銷寶力測試 key(#2d6ef873)
3. `cd ~/.ailive/beself && gh repo create`(私有)補遠端
4. 前後台規劃已給 Adam(活動室/名單室/訪談室/報告室),他點頭「活動室+名單室」先動工

---

## 卡住 / 未解

2026-07-31 第1場：
- **beself repo 只有本地 git,無 GitHub 遠端**——筆電死=歷史沒了,下一棒第一件事 `gh repo create`
- Adam 場 0006(31 句)未跑量表——留給 Adam 自己按「跑量表」體驗,或下一棒代跑
- 醉酒指數本場高峰 8(壓縮接手+pipe二犯+工具滑倒),已照 protocol 刻現場;本檔寫於指數仍高的狀態,接棒先驗證再信
- 平台 v18.32.5 版號撞號(068810a 別場 docs commit 同號)——歷史已推不重寫,純記錄
- 別場髒樹照舊未動(AILIVE/anews-b/ailive-platform scripts/zhu-core ingest)

2026-07-30 第2場：
- **切角分析情報站**：規劃完成、schema/prompt/pipeline 全未動工（Adam 下一階段要自己寫 code）。詳見 [[project-threads-radar-angle-analysis]]。
- **結果共享池重構**（Adam 新規劃）：現況每 clientId 隔離，要改成「設定跟人走、結果/情報團隊共享去重」的工作區模型（承重牆級重構，加 teamId 概念）。此設計同時解掉多人重複爬的成本問題。未動工。
- **多人上線前兩件必做**：①多人並發實測（現只驗過一人一帳號，DB 僅 1 真連帳號）②成本/併發上限重算（每活躍成員=一條住宅IP線性成本，IPRoyal 一把憑證分流是「一人份」快照）。
- **靜態住宅 IP 升級（安全）**：現用會輪替的動態 sticky（帳號看起來一直搬家扣分）；建議每情報帳號綁固定靜態 ISP。已驗 IPRoyal 有台灣靜態 ISP（2354 條、US$2.4-2.7/月≈台幣80/條、專屬+靜態），且實測現用出口 49.213.245.180 AS18049 TINP proxy:false hosting:false（乾淨）。**未親測靜態產品**，焊前要買一條驗 ASN＋兩 flag。
- **同事守則待焊進系統**：第1條「情報帳號 vs 工作帳號分開」還是口頭+memory，未焊 /connect 警語。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練（首月）、回訪窗固定近7天前10篇最舊8篇留言數可能不更新。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-31 第1場。*
