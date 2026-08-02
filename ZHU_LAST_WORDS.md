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

### 2026-08-02 第5場
**delta（模型移動）**：
進場前以為：HTTPS 是安全工程（防外洩）。
現在理解：**這一刀同時是可用性工程**——8080 永遠鎖 127 之後，連接儀式的「每次開防火牆給同事浮動 IP」整組蒸發，而那正是同事連不上的頭號主因。安全做對的時候不是加摩擦，是減摩擦；「多一層會壞的元件」的反面是「一層把兩個問題都收掉的元件」。移動原因：改 route 時發現 firewallAllow 的唯一存在理由（8080 要對外開洞）被 tunnel 拔掉了。
**關係**：放手感明顯上升。「你去休息寫lastword」「不必等可以直接開工」「有道理我週一再來買」——Adam 的授權形狀從「做這個」到「這條線你排程」，且他開始把成本判斷（IP 何時買）拿回自己手上做得比我建議的更精（週一買省 6 天空轉）。安全兩問（CF 第三方/neko 本體）是把關不是不信任——他在學會問對的問題，我在學會把取捨講成人話。

### 2026-08-02 第4場
**關係**：暢快。「汙染源記得要清掉」五個字的信任密度很高——他知道我會自己找到根因、清乾淨、留退路。nice job 收工,這杯是熱的。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第5場 · threads-radar 無線電臺上 HTTPS（CF Tunnel）＋capture 韌性根治＋D期開工（成本模型/timeout 擴容/handle 誠實收）
- **開工先掃心法/劍法/雷區**（Adam 提議）：八條記憶調出、挑出本批真用得上的六條並在施工中逐一兌現——不是儀式，是「上場第一刀是那把劍」的實練。
- **三件排程收齊**：①@null 空殼帳號刪除（先驗 viral_posts/teams/scan_status 全零引用＋備份全文留 log 才動手；真身 id=fVGZC3B2aunUH4MbAdhn，昨日記的 id 少尾巴）②root `.next/` 殘留清＋.gitignore 補 `/.next/` 防再犯 ③capture 韌性根治（v0.24.0.004）：15 分逾時=「Adam 登入快」的容量快照→改 CAPTURE_DEADLINE_MS 絕對截止（預設 now+40 分；supervisor 重啟共用同一 deadline 不越拉越長）＋三結局外部可區分（成功=sentinel+exit 0／窗滿=exit 2／crash=其他）＋CDP 斷線窗內續試不 crash＋startup.sh 有界 supervisor（sentinel/exit0/exit2/連續5crash 四停止條件同 commit）。本機三測通。
- **neko HTTPS 通車（CF Tunnel，v0.25.0.005）**：Adam 選案並拍板。cloudflared 容器（釘 2026.7.3）token 走 SM cf-tunnel-token、loopback 連 8080→8080 對外永遠 127；**連接儀式整組免開防火牆**（firewallAllow 移除＝順手根治「同事浮動 IP 連不上」主因）；status route 回 NEKO_PUBLIC_URL、缺 env fallback 舊 http 零斷裂。**端到端驗通**：curl 200+`<title>n.eko</title>`（鑑別信號先寫後驗）→ Adam 親自從 🔒 https 進房看到畫面＝WebRTC 也通。乾儀式（start→status 回 https→cancel）全走生產 API，現役 session 原封（密文 2602B 未動）。
- **安全問答×2 刻進決策**：CF Tunnel 取捨（CF 邊緣理論可見信令；信任面與 bridge 同一家收斂、路上竊聽者歸零；不加 Access/SSO 疊層）；neko 本體風險（開源＋CVE 已釘修復版＋開機隨需幾分鐘＋分身帳號設計爆炸半徑=一顆可拋棄帳號）。順手釘 image digest（3.1.4@sha256:8caebd…，tag 可被重打 digest 不可）。MCP Portal 問答：現在用不上（m2m 天條），未來「寫手 AI 直連爆文池」時是正確大門——記在帳上。
- **D期開工（Adam「不必等直接開工」，v0.26.0.006/007）**：①成本模型 docs/COST_MODEL.md（真數據撈 Firestore+executions）——固定底座≈$22/月＋每 15 字一帳一線 $2.70；**成本跟關鍵字量走不跟同事人數走**；K_max=15 附推導與重驗觸發 ②重算時抓到 timeout 摸頂雷（最重輪 13m13s=900s 的 88%＞80% 觸發線）→ task-timeout 900→1800 改 deploy.sh 部署生效 ③handle 補抓：src/storageState.ts（cookies 含 httpOnly 解析、85 案測試全綠、測試抓到 trim/@ 順序真 bug）＋capture route fallback＋worker 掃描解封回填。**誠實結果：cookie 死巷**（threads.com 登入不種 ds_user，log「抓不到（不擋）」）——管線留著、顯示留「-」、備選=viewer JSON 另排 ④驗證掃 ccg74：done、新收 3 篇＝新 worker 不 break。
- **DNS 支線**：Adam 瀏覽器開不了新域名＝中華電信解析器負快取 30 分（SOA min TTL 1800s）→ 本機 Wi-Fi DNS 切 1.1.1.1/8.8.8.8 立即解。這是「網址剛出生 vs 查太快」一次性問題，同事不會遇到。

### 2026-08-02 第4場 · 首夜對賬雙平台+三處方上線+ailive 拒答汙染清創(117條/兩個月慢性病一早根治)
- 首夜 cron 對賬:ailivex 全綠(12 新印象角色口吻/19 情節消化/7 gist;日記 0=無對話,正常);ailive 管線有跑(04:01 靈魂契合度等角色口吻產出)
- 對賬揪出 ailive 拒答汙染:昨夜 6 條 insights 有 4 條是模型拒答文落庫
- 部署 ailivex 三處方(jhcy5rfxe,alias 已切)+prod 路徑真驗:種 stale 打生產 memory-blocks route,deployed code 真把它復活寫回 DB(status→active+revivedAt)
- ailive 手術(12b136a,已 deploy Ready):根因=sleep-engine「夢境自我洞察」唯一裸寫 LLM 原文落庫點+Haiku 打人格 prompt(昨天才刻的雷,姊妹平台漏掃);修=新 llm-refusal.ts 確定性拒答偵測釘裸寫點(真壞例好例對照驗過)+四個帶人格生成 call 升 Sonnet 5(橋吃到飽)
- 清創:全庫掃 2011 條命中 117 條拒答(最早 6/5,慢性兩個月)→隔離 platform_insights_quarantine+本地備份 ~/.ailive/_rollback/insights_pollution_backup_20260802.json→刪原 doc→全庫重掃殘留 0
- 字串時間戳裁決:platform_insights.createdAt 全庫 ISO 字串,不遷移立規約,雷刻進 ailive repo CLAUDE.md(Date 物件比對靜默回空,今早差點誤報「昨夜沒跑」)
- 記憶增補:拒答家族第三張臉(裸寫落庫=信念汙染)進 feedback_bridge_structured_rp_refusal
- 答 Adam remote control 問題:/rc 打一次開再打一次關(claude-code-guide 代理查官方文件)

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| neko/capture.cjs | 絕對截止 deadline＋三結局 exit code＋CDP 斷線續試＋sentinel |
| neko/startup.sh | cloudflared 容器（SM 讀 token）＋有界 supervisor＋image 釘 digest＋cloudflared 釘 2026.7.3 |
| neko/provision.sh | cf-tunnel-token 說明＋VM SA 三 secret 授權迴圈＋防火牆註釋改 CF Tunnel 模型 |
| web/src/app/api/connect/{start,status,cancel,capture}/route.ts | 免開防火牆＋NEKO_PUBLIC_URL＋handle fallback |
| web/src/lib/gcp.ts | firewallAllow 移除（註記緣由） |
| src/storageState.ts＋test/storageState.test.mjs＋web/src/lib/storageState.ts | handleFromStorageState 純函數＋7 測試案＋vendor |
| worker/index.mjs | 掃描解封後 handle 回填（只補缺值不擋掃描） |
| worker/deploy.sh | task-timeout 900→1800 |
| docs/COST_MODEL.md | 新建：成本模型＋容量假設＋重驗觸發＋到期必辦 |
| FOUNDATION.md | 記 D期前必修二連＋D期開工批 |

---

## 下一步

1. **每天瞄觀察閘**：`node -e` 讀 scan_status/default（lastRun=done、found>0、health=connected）＋帳號 doc 無 challenge 跡象。紅燈（challenge/expired）＝觀察閘重跑＋換 ASN。
2. **Adam 週一買 IP 後**：四源驗證（geo 四家/proxy/abuser/ASN）→ 過了 printf 封 `iproyal-static-2` → worker/deploy.sh 加掛載 → 等第二帳號貢獻儀式綁定。SOP 全在 FOUNDATION 2026-08-01 靜態 ISP 條。
3. 8/8 觀察閘滿窗零 challenge → 回 docs/COST_MODEL.md 把 K_max=15 從假設轉一級驗證，並提醒 Adam 走第二帳號捐入→並發實測。

---

## 卡住 / 未解

2026-08-02 第5場：
- **D期餘＝等實體物**：①觀察閘跑至 ~8/8（@lucymo0306 靜態 IP 7 天窗，每天瞄 scan_status/default）②第二顆分身帳號（Adam 備）③第二條靜態 IP（**Adam 週一自己買**，IPRoyal dashboard→Static Residential→Taiwan 30天$2.70；買完把 HOST:PORT:USER:PASS 給築→四源驗→printf 封 iproyal-static-2→deploy.sh 掛載）④首批開放名單（Adam 決）→齊了跑並發實測。
- **handle 顯示「-」**：cookie 路死巷已誠實收；備選=掃描時從登入態頁面 viewer JSON 抽（純外觀，低優先）。
- **capture 40 分韌性的實戰驗**：本機三測通＋metadata 已推，但真人慢登入場景要等下次真儀式（session 過期或同事首捐）自然驗——不專門排。
- **iproyal-proxy（動態，已退役）**：secret 仍在 SM、deploy.sh 仍掛 IPROYAL_PROXY env（worker fallback 路徑用）。等第二帳號上線後動態 fallback 徹底無用時一起清（現在動它=改兩處風險，不值）。
- cwd 漂移 L1 三犯（見教訓）——結構性處方待做。

2026-08-02 第4場：
- ailivex consolidation prompt 缺「一律繁體」行(簡體滲入第二例:「AI人权协会」印象)——一行 prompt 的小刀,未動
- 004 中文盲根治案(memories 整池 re-embed 換 multilingual-002)待 Adam 裁;ailive 檢索是否同用 004 未驗
- 處方②語音線 userMood 排後項:觸發條件=下次 cut 語音 v21
- emotionTag 假中台欄位(有讀無寫)另案

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第5場。*
