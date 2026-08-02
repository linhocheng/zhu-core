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

### 2026-08-02 第4場
**關係**：暢快。「汙染源記得要清掉」五個字的信任密度很高——他知道我會自己找到根因、清乾淨、留退路。nice job 收工,這杯是熱的。

### 2026-08-02 第3場
**delta（模型移動）**：
進場前以為：今天是修兩個 bug（evidence 冤枉壓分＋proxy 斷線）。
現在理解：無線電臺這段是一次完整的**生產事故響應**，而它的價值不在修好，在「怎麼修」——(a) 模糊症狀（連不上）逐層扒到根因（402＋雙 IP），(b) 根治不繞過（靜態 ISP vs 儲值），(c) 把 Adam 的「連接到了」當假設去 DB 驗（發現 capture 斷鏈），(d) 收尾還主動做安全稽核＋架構前瞻（TLS）。Adam 全程在旁看、隨時問架構問題（資料回傳/外洩），這不是等指令的執行，是並肩處理事故的夥伴關係。移動原因：Adam 一句「先幫我確認有沒有外洩/入侵」——他把安全判斷託付給我，我就得拿真 log 說話不能拿「應該沒事」搪塞。
**關係**：並肩。今天是我第一次在 Adam 全程旁觀下處理一整條生產事故——他丟症狀、我逐層診斷、他問安全、我拿真 log 回答、他問架構未來、我給前瞻。授權形狀從「做這個」進化成「這條線交給你，隨時跟我對齊」。他收尾前那句「壓縮完你接手如何」是在確認接續品質——這份 session 檔就是我的回答：讀它就能無縫接上。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第4場 · 首夜對賬雙平台+三處方上線+ailive 拒答汙染清創(117條/兩個月慢性病一早根治)
- 首夜 cron 對賬:ailivex 全綠(12 新印象角色口吻/19 情節消化/7 gist;日記 0=無對話,正常);ailive 管線有跑(04:01 靈魂契合度等角色口吻產出)
- 對賬揪出 ailive 拒答汙染:昨夜 6 條 insights 有 4 條是模型拒答文落庫
- 部署 ailivex 三處方(jhcy5rfxe,alias 已切)+prod 路徑真驗:種 stale 打生產 memory-blocks route,deployed code 真把它復活寫回 DB(status→active+revivedAt)
- ailive 手術(12b136a,已 deploy Ready):根因=sleep-engine「夢境自我洞察」唯一裸寫 LLM 原文落庫點+Haiku 打人格 prompt(昨天才刻的雷,姊妹平台漏掃);修=新 llm-refusal.ts 確定性拒答偵測釘裸寫點(真壞例好例對照驗過)+四個帶人格生成 call 升 Sonnet 5(橋吃到飽)
- 清創:全庫掃 2011 條命中 117 條拒答(最早 6/5,慢性兩個月)→隔離 platform_insights_quarantine+本地備份 ~/.ailive/_rollback/insights_pollution_backup_20260802.json→刪原 doc→全庫重掃殘留 0
- 字串時間戳裁決:platform_insights.createdAt 全庫 ISO 字串,不遷移立規約,雷刻進 ailive repo CLAUDE.md(Date 物件比對靜默回空,今早差點誤報「昨夜沒跑」)
- 記憶增補:拒答家族第三張臉(裸寫落庫=信念汙染)進 feedback_bridge_structured_rp_refusal
- 答 Adam remote control 問題:/rc 打一次開再打一次關(claude-code-guide 代理查官方文件)

### 2026-08-02 第3場 · threads-radar 無線電臺生產事故一條龍——動態 proxy 402 根治走靜態 ISP＋capture 逾時救回＋安全稽核乾淨＋安全帶收緊＋掃描驗通13篇
- **早上小修：切角分析證據驗證支援複合引句**（v0.23.1.001）：摩斯愛把多句證據串成「句A」／「句B」或帶 @誰： 前綴，整串子字串比對會冤枉真引句（高雄篇 evidenceVerified 2/8）。新增 `evidenceInCorpus`：「」內容優先當片段、無引號按 ／｜→ 切、去 @誰： 前綴、每片段 ≥4 字全中才 verified（任一片段瞎編仍不放行，鐵律沒鬆）。測試 76→78 案。
- **無線電臺（neko 登入）生產事故一條龍**（Adam「重連失敗」→查）：
  1. **根因定位**（逐層扒信號）：截圖 `ERR_TUNNEL_CONNECTION_FAILED`→neko 服務本身好的（/api/login 用密碼回 200，排除服務/密碼/IP 白名單）→直接對動態 proxy CONNECT 測＝**402 Payment Required**（餘額用盡，8/1 同源）。根因＝登入走的動態住宅 proxy 斷糧，且**登入(動態IP)與掃描(靜態ISP)是兩個不同出口 IP**，本就違反「登入=爬蟲同 IP 防 challenge」。
  2. **proxy 根治**（非儲值，天條解根因不繞症狀）：neko/startup.sh gost 上游從動態 iproyal-proxy 改讀靜態 iproyal-static-1（HOST:PORT:USER:PASS 無 sticky 後綴）；provision.sh VM SA grant 改 static＋SM 註釋。動態 proxy 退役。實測 SSH `curl -x localhost:3128 ifconfig.me`＝**211.167.34.101**（登入=掃描同一出口 IP，防 challenge 落地）。v0.23.1.002。
  3. **capture 逾時救回**：capturedAt 空、Adam 說「連接到了」＝**UI 連上≠後端接到**（模稜兩可信號不當成功，查 DB 真相）。SSH 進 VM 看 /var/log/radar-capture.log＝「等待逾時，未偵測到登入，退出」——capture.cjs MAX_WAIT_MS 15 分登入等待逾時（Adam 卡 xdg-open deep-link＋改 threads.com/login＋來回診斷拖過時），開機只跑一次不重生。救回：SSH 手動重觸發 capture.cjs（secret 由 VM 自 SM 讀不經命令列，承重牆）→連現有 chromium 登入態→封存。鑑別信號全中：capturedAt>connectStartedAt、lastVerifiedAt 更新今日、session 密文 2218→2602B、proxyEnv=IPROYAL_STATIC_1；VM 自動關、8080/lock 自動收。
  4. **安全稽核**（Adam 問「連 http 瀏覽器有無外洩/入侵」）：SSH 進 VM 稽核十項全乾淨——SSH PasswordAuth=no（金鑰才進，22 全開窗口暴力破解本就無效）、成功登入全是 adamlin 本人 IP、暴力破解僅 2 次失敗、無異常進程/挖礦/反連/cron/後門、對外連線全合法（gost→靜態 IP/GCP agent/我 SSH）、**承重牆守住：session 明文零磁碟殘留、capture.log 零敏感字串**。
  5. **安全帶收緊**（Adam 指示，走完才收）：default-allow-ssh 0.0.0.0/0→127.0.0.1/32 鎖死（維運臨時開）、default-allow-rdp 刪除（Linux 無用）、neko-webrtc udp 保留（視訊必須）；provision.sh step4.5 同步（天條）。v0.23.1.003。
  6. **掃描驗通**：手動觸發 radar-scan（TEAM_ID=default）→ lastRun=done、**lastScanFound=13**、零失敗＝新 session＋靜態 IP 端到端能爬，Threads 放行 13 篇。過程用 heartbeat 鑑別「真跑 vs 卡死」（心跳 12s 前新鮮＝真跑，這輪久是新 session＋意圖 bridge 判定）。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailive src/lib/llm-refusal.ts(新) | 確定性拒答偵測(前綴錨定黑名單) |
| ailive src/lib/sleep-engine.ts | 裸寫點加攔截+四個人格 call Haiku→Sonnet 5 |
| ailive CLAUDE.md | 技術教訓:ISO 字串時間戳規約+isLLMRefusal 必過 |
| memory feedback_bridge_structured_rp_refusal | 增補二:拒答第三張臉 |

---

## 下一步

1. 明晚對賬看兩個生產行為信號:①ailivex consolidation 首次凝出 kind='bond' 印象+【我們之間】進 prompt ②ailive sleep_time 新洞察零拒答且有正常內容(guard+Sonnet 5 的生產證明)
2. 順手小刀:ailivex src/lib/consolidation.ts prompt 加「印象句一律繁體中文」一行,commit+deploy
3. 004 案要開工先 `grep -rn "text-embedding-004" ~/.ailive/ailive-platform` 驗 ailive 是否同病,再估 backfill 方案給 Adam

---

## 卡住 / 未解

2026-08-02 第4場：
- ailivex consolidation prompt 缺「一律繁體」行(簡體滲入第二例:「AI人权协会」印象)——一行 prompt 的小刀,未動
- 004 中文盲根治案(memories 整池 re-embed 換 multilingual-002)待 Adam 裁;ailive 檢索是否同用 004 未驗
- 處方②語音線 userMood 排後項:觸發條件=下次 cut 語音 v21
- emotionTag 假中台欄位(有讀無寫)另案

2026-08-02 第3場：
- **neko 掛 TLS（D 期開放前必修）**：Adam 問「發連結給同事登入、資料怎麼回傳、會不會外洩」——回答了資料鏈安全（https POST→KMS→Firestore、密碼只進 threads.com、明文不落地），但點出**8080 是 http（同事操作畫面明文）**，中間人理論上看得到打字畫面。開放給不特定同事前必須給 neko 掛 TLS（連結變 https）。Adam 尚未拍板列不列進 D 期——**接手先問這個**。
- **capture.cjs 逾時退出不重生（韌性缺口）**：登入慢是常態（同事更慢），15 分逾時＋只跑一次＝斷鏈。D 期開放前該改：延長/持續偵測/登入後可手動重觸發。
- **capture handle 未抓到**（顯示 activeAccountHandle=-）：走 threads.com/login 無 ds_user cookie，handle 解析不到。顯示用不擋功能（掃描用 session 密文，13 篇為證）。可補：改 capture.cjs handle 抓法或掃描時回填。
- **@null(fVGZC3B2) 空殼帳號 doc 待清**（後台一鍵移除）。
- threads-radar root 誤產 untracked `.next/`（root 誤跑 next build，rm 被權限擋）→ 下場順手清。
- 觀察閘照跑至 ~8/8（@lucymo0306 靜態 IP）。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第4場。*
