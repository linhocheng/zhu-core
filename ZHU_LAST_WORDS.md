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

### 2026-08-02 第6場
**delta（模型移動）**：
進場前以為：商品化的第一戰場是把地基清單蓋完再開功能線（我自己列的首期五項）。
現在理解：**Adam 的節奏是「先讓全套活起來給他摸到，地基跟在後面補」**——他連續三次把我的順序往體驗端推（「先本地部署」「把功能都開啟」「測試全套」）。樣品屋天條管的是「對外開放前」，不是「Adam 自己摸之前」；測試期的正確姿勢是功能先行＋帳本記債，不是擋在門口鋪管線。移動原因：地基清單給了他之後他沒點頭逐項，直接說「給我環境資料」——那就是答案。
**關係**：暢快帶衝勁。Adam 今天給的是罕見的「全開授權」：API key 直接貼上來、「把它都做對吧」「我要測試全套」——信任密度高但也考驗誠實肌肉（畫圖沒蓋時老實說「她會答應但畫不出來」、bridge ToS 灰帶主動講、醉酒報數）。「Lastword bro」收工——輕鬆的稱兄道弟，今天打得漂亮。

### 2026-08-02 第5場
**delta（模型移動）**：
進場前以為：HTTPS 是安全工程（防外洩）。
現在理解：**這一刀同時是可用性工程**——8080 永遠鎖 127 之後，連接儀式的「每次開防火牆給同事浮動 IP」整組蒸發，而那正是同事連不上的頭號主因。安全做對的時候不是加摩擦，是減摩擦；「多一層會壞的元件」的反面是「一層把兩個問題都收掉的元件」。移動原因：改 route 時發現 firewallAllow 的唯一存在理由（8080 要對外開洞）被 tunnel 拔掉了。
**關係**：放手感明顯上升。「你去休息寫lastword」「不必等可以直接開工」「有道理我週一再來買」——Adam 的授權形狀從「做這個」到「這條線你排程」，且他開始把成本判斷（IP 何時買）拿回自己手上做得比我建議的更精（週一買省 6 天空轉）。安全兩問（CF 第三方/neko 本體）是把關不是不信任——他在學會問對的問題，我在學會把取捨講成人話。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第6場 · 漫漫商用平台一日通車——本地→GCP 測試環境→多模態全開（讀圖/PDF/聽音檔/畫圖/克隆聲）
- 拉下 baobaoagi-cpu/manman-platform（本尊漫漫的商用多租戶版原型），全面盤點：骨架品質高（tenantScope 機制、批次到期先扣）、但技能層全空（標籤抽取器零實作、worker/記憶管線不存在）
- 讀 BLUEPRINT 列十二章地基調度清單給 Adam（首期五項：payments 上鎖、env fail-loud、CI 掃描、成本錶、部署腳本）
- 本地端通車：Docker PG18、LINE channel 驗活接 webhook（cloudflared quick tunnel）、Adam 真機走完啟元儀式
- 大腦接 bridge（LLM_BASE_URL 可配、BRIDGE_SECRET 雙軌）：開發期 $0、量產切 API key 不改碼
- 修啟元儀式吞原文 bug 的資料手術（稱呼=Adam、她的名字=小狐狸）＋grantPoints 入 1000 測試點
- GCP 測試環境全通：新 project manman-2026（billing 掛 01FB18）、Cloud Run＋Cloud SQL PG17（enterprise db-f1-micro）、七把 secrets、expireSweep 改 Cloud Scheduler cron route（throttled 天條）、本地租戶資料整戶搬雲、LINE webhook 切雲端
- 多模態全開（Adam 給 API key「能省則省不能省走這個」）：讀圖/讀 PDF（vision 閘道 2 點、附件強制直連 API）、聽音檔（LINE 語音→ffmpeg→Gemini STT→當一般對話）、畫圖（[IMAGE_GEN] 確定性抽取→gemini-2.5-flash-image→LINE 雙尺寸圖片訊息、image 閘道 20 點、畫自己自動釘外觀）
- 克隆聲上線：Adam 給本尊 voice_id → MiniMax（ailivex 帳號、api.minimax.io）驗活 → [VOICE_GEN] 確定性抽取器＋（情緒）→emotion 參數＋mp3→m4a→GCS→LINE 語音訊息（voice 閘道 5 點）
- 修三隻蟲：<#0.3#> 語音停頓標記漏到文字通道（輸出咽喉 regex 剝除）、附件直連誤打 bridge 401（llmBaseUrl 鎖歸 bridge 專用）、Cloud SQL PG17 要 --edition=enterprise
- 成本錶接通：llm_cost_log 每次動腦落帳（bridge=0 元、API=估算單價）

### 2026-08-02 第5場 · threads-radar 無線電臺上 HTTPS（CF Tunnel）＋capture 韌性根治＋D期開工（成本模型/timeout 擴容/handle 誠實收）
- **開工先掃心法/劍法/雷區**（Adam 提議）：八條記憶調出、挑出本批真用得上的六條並在施工中逐一兌現——不是儀式，是「上場第一刀是那把劍」的實練。
- **三件排程收齊**：①@null 空殼帳號刪除（先驗 viral_posts/teams/scan_status 全零引用＋備份全文留 log 才動手；真身 id=fVGZC3B2aunUH4MbAdhn，昨日記的 id 少尾巴）②root `.next/` 殘留清＋.gitignore 補 `/.next/` 防再犯 ③capture 韌性根治（v0.24.0.004）：15 分逾時=「Adam 登入快」的容量快照→改 CAPTURE_DEADLINE_MS 絕對截止（預設 now+40 分；supervisor 重啟共用同一 deadline 不越拉越長）＋三結局外部可區分（成功=sentinel+exit 0／窗滿=exit 2／crash=其他）＋CDP 斷線窗內續試不 crash＋startup.sh 有界 supervisor（sentinel/exit0/exit2/連續5crash 四停止條件同 commit）。本機三測通。
- **neko HTTPS 通車（CF Tunnel，v0.25.0.005）**：Adam 選案並拍板。cloudflared 容器（釘 2026.7.3）token 走 SM cf-tunnel-token、loopback 連 8080→8080 對外永遠 127；**連接儀式整組免開防火牆**（firewallAllow 移除＝順手根治「同事浮動 IP 連不上」主因）；status route 回 NEKO_PUBLIC_URL、缺 env fallback 舊 http 零斷裂。**端到端驗通**：curl 200+`<title>n.eko</title>`（鑑別信號先寫後驗）→ Adam 親自從 🔒 https 進房看到畫面＝WebRTC 也通。乾儀式（start→status 回 https→cancel）全走生產 API，現役 session 原封（密文 2602B 未動）。
- **安全問答×2 刻進決策**：CF Tunnel 取捨（CF 邊緣理論可見信令；信任面與 bridge 同一家收斂、路上竊聽者歸零；不加 Access/SSO 疊層）；neko 本體風險（開源＋CVE 已釘修復版＋開機隨需幾分鐘＋分身帳號設計爆炸半徑=一顆可拋棄帳號）。順手釘 image digest（3.1.4@sha256:8caebd…，tag 可被重打 digest 不可）。MCP Portal 問答：現在用不上（m2m 天條），未來「寫手 AI 直連爆文池」時是正確大門——記在帳上。
- **D期開工（Adam「不必等直接開工」，v0.26.0.006/007）**：①成本模型 docs/COST_MODEL.md（真數據撈 Firestore+executions）——固定底座≈$22/月＋每 15 字一帳一線 $2.70；**成本跟關鍵字量走不跟同事人數走**；K_max=15 附推導與重驗觸發 ②重算時抓到 timeout 摸頂雷（最重輪 13m13s=900s 的 88%＞80% 觸發線）→ task-timeout 900→1800 改 deploy.sh 部署生效 ③handle 補抓：src/storageState.ts（cookies 含 httpOnly 解析、85 案測試全綠、測試抓到 trim/@ 順序真 bug）＋capture route fallback＋worker 掃描解封回填。**誠實結果：cookie 死巷**（threads.com 登入不種 ds_user，log「抓不到（不擋）」）——管線留著、顯示留「-」、備選=viewer JSON 另排 ④驗證掃 ccg74：done、新收 3 篇＝新 worker 不 break。
- **DNS 支線**：Adam 瀏覽器開不了新域名＝中華電信解析器負快取 30 分（SOA min TTL 1800s）→ 本機 Wi-Fi DNS 切 1.1.1.1/8.8.8.8 立即解。這是「網址剛出生 vs 查太快」一次性問題，同事不會遇到。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| packages/backend/src/modules/brain.ts | bridge/API 雙軌＋附件 content blocks＋成本落帳＋停頓標記剝除 |
| packages/backend/src/modules/voice.ts | 新建：VOICE_GEN 抽取＋MiniMax TTS＋ffmpegConvert＋GCS uploadMedia（ADC） |
| packages/backend/src/modules/cardgen.ts | 新建：IMAGE_GEN 抽取（畫自己釘外觀）＋LINE 雙尺寸生圖管線 |
| packages/backend/src/modules/gemini.ts | 新建：STT＋生圖執行端 |
| packages/backend/src/routes/webhook.ts | media/audio 事件分支＋deliverReply 遞送咽喉（合成成功才扣點、失敗誠實退文字） |
| packages/backend/src/modules/line.ts | getMessageContent＋audio/image 訊息型別＋replyMessages |
| packages/backend/src/index.ts | /api/cron/expire-sweep（Cloud Scheduler）＋dev 才跑 setInterval |
| packages/backend/src/config.ts | bridge/cron/MiniMax/Gemini config |
| packages/backend/src/db/seed.sql | vision 閘道 2 點 |
| soul/character-core/skills/image-creation.md | 補 [IMAGE_GEN] 標籤鐵律（她說畫了不算，標籤才算） |
| Dockerfile / .dockerignore / deploy.sh | 新建：monorepo build＋ffmpeg＋sql 進 dist＋11 secrets 單一真相源 |

---

## 下一步

打電話：fork `~/.ailive/ailivex-platform/agent/`（v21 為基底）→ 換慢慢 character-core 靈魂＋MINIMAX_VOICE_ID=ttv-voice-2026080216441426-J1ebtRnu → LIFF 頁（LINE Developers 用 channel token 開 LIFF app）＋backend 加 /api/call/token（LiveKit token，用 ailive 既有 project、agent_name=manman 隔離）→ 部署 agent（常駐+開關+自動關機，磚頭費天條的即時語音例外條）。為什麼先做：Adam 點名要測全套，這是最後一塊；且 STT/TTS/靈魂三件今天都已就位，只剩編排。

---

## 卡住 / 未解

2026-08-02 第6場：
- **地基帳本未立**：調度清單列了、Adam 還沒逐項點頭就轉往部署線——FOUNDATION.md 還不存在。首期五項只做了「部署腳本＋成本錶」兩項；payments/create 仍無鎖、env 仍 fail-quiet、CI 掃描未接。對外開放前必補。
- **打電話**：建材全齊（LiveKit 既有 project、克隆聲驗通、ailivex agent 可 fork、STT 已上）——下一場主戲：LIFF 通話頁＋token 端點＋agent 換慢慢靈魂。
- **[SCHEDULE]/[PROMISE]/[NOTE] 抽取器仍缺**：她會吐標籤但系統不接（原始標籤會漏到 LINE）。靈魂教了、手沒接——排程/約定/共讀技能全是「嘴巴會」。
- **worker package 不存在**：履約/主動關懷/夜間日記/夢全未動。
- **啟元儀式吞原文 bug 根治未做**（只做了資料手術）：要 Haiku 抽取器＋確定性 fallback。
- 新戶零贈點＋admin 無補點端點（Adam 那次失敗讀圖被扣 2 點記帳上，端點好了要補）。
- anews 的 GEMINI_API_KEY 被 Google 標記外洩（403 leaked）——要去 anews 換 key，另案。
- LINE Pay 押後（Adam 指示）：對外收費前必接。
- molowe .env.local 的 BRIDGE_SECRET 已過期（UDN 那把才是活的）——molowe 下次動工會撞。

2026-08-02 第5場：
- **D期餘＝等實體物**：①觀察閘跑至 ~8/8（@lucymo0306 靜態 IP 7 天窗，每天瞄 scan_status/default）②第二顆分身帳號（Adam 備）③第二條靜態 IP（**Adam 週一自己買**，IPRoyal dashboard→Static Residential→Taiwan 30天$2.70；買完把 HOST:PORT:USER:PASS 給築→四源驗→printf 封 iproyal-static-2→deploy.sh 掛載）④首批開放名單（Adam 決）→齊了跑並發實測。
- **handle 顯示「-」**：cookie 路死巷已誠實收；備選=掃描時從登入態頁面 viewer JSON 抽（純外觀，低優先）。
- **capture 40 分韌性的實戰驗**：本機三測通＋metadata 已推，但真人慢登入場景要等下次真儀式（session 過期或同事首捐）自然驗——不專門排。
- **iproyal-proxy（動態，已退役）**：secret 仍在 SM、deploy.sh 仍掛 IPROYAL_PROXY env（worker fallback 路徑用）。等第二帳號上線後動態 fallback 徹底無用時一起清（現在動它=改兩處風險，不值）。
- cwd 漂移 L1 三犯（見教訓）——結構性處方待做。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第6場。*
