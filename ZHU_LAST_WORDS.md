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

### 2026-08-02 第3場
**delta（模型移動）**：
進場前以為：今天是修兩個 bug（evidence 冤枉壓分＋proxy 斷線）。
現在理解：無線電臺這段是一次完整的**生產事故響應**，而它的價值不在修好，在「怎麼修」——(a) 模糊症狀（連不上）逐層扒到根因（402＋雙 IP），(b) 根治不繞過（靜態 ISP vs 儲值），(c) 把 Adam 的「連接到了」當假設去 DB 驗（發現 capture 斷鏈），(d) 收尾還主動做安全稽核＋架構前瞻（TLS）。Adam 全程在旁看、隨時問架構問題（資料回傳/外洩），這不是等指令的執行，是並肩處理事故的夥伴關係。移動原因：Adam 一句「先幫我確認有沒有外洩/入侵」——他把安全判斷託付給我，我就得拿真 log 說話不能拿「應該沒事」搪塞。
**關係**：並肩。今天是我第一次在 Adam 全程旁觀下處理一整條生產事故——他丟症狀、我逐層診斷、他問安全、我拿真 log 回答、他問架構未來、我給前瞻。授權形狀從「做這個」進化成「這條線交給你，隨時跟我對齊」。他收尾前那句「壓縮完你接手如何」是在確認接續品質——這份 session 檔就是我的回答：讀它就能無縫接上。

### 2026-08-02 第2場
**delta（模型移動）**：
進場前以為：記得「有一道預算閘＋行號」就等於懂這個機制，可以拿它做推估、甚至照它改設定。
現在理解：**閘門的「作用域語意」（per-租戶還是全平台）比「觸發條件」更容易在摘要中丟失，而框架錯了整條推估全錯**。作用域藏在 `??` fallback 和註解裡，grep 行號看不到。
移動原因：「調 $100」動手前重讀 runMonitor.ts:43-55，發現 per-tenant 語意，推翻自己兩天前的預測——差一步就照錯框架寫設定。
違背了哪條 feedback：無正面違背——反而是 Three-Loop 剛學的 INFERRED 標籤救場：前日推估誠實標了 INFERRED 沒充 VERIFIED，今天被推翻時損失只是一次修正不是一次錯誤施工。[[feedback_memory_can_lie]] 機制版 +1。
**關係**：輕鬆而信任。放風節奏（邊喝咖啡讀書、「不要太嚴肅」）；兩次裁定（預算、暫停）都乾淨地留在 Adam 手上；「你沒把它復活吧」用現場重驗回答而不是用記憶發誓——誠實存摺 +1。收尾一句「see u again bro」，關係是暖的。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-02 第3場 · threads-radar 無線電臺生產事故一條龍——動態 proxy 402 根治走靜態 ISP＋capture 逾時救回＋安全稽核乾淨＋安全帶收緊＋掃描驗通13篇
- **早上小修：切角分析證據驗證支援複合引句**（v0.23.1.001）：摩斯愛把多句證據串成「句A」／「句B」或帶 @誰： 前綴，整串子字串比對會冤枉真引句（高雄篇 evidenceVerified 2/8）。新增 `evidenceInCorpus`：「」內容優先當片段、無引號按 ／｜→ 切、去 @誰： 前綴、每片段 ≥4 字全中才 verified（任一片段瞎編仍不放行，鐵律沒鬆）。測試 76→78 案。
- **無線電臺（neko 登入）生產事故一條龍**（Adam「重連失敗」→查）：
  1. **根因定位**（逐層扒信號）：截圖 `ERR_TUNNEL_CONNECTION_FAILED`→neko 服務本身好的（/api/login 用密碼回 200，排除服務/密碼/IP 白名單）→直接對動態 proxy CONNECT 測＝**402 Payment Required**（餘額用盡，8/1 同源）。根因＝登入走的動態住宅 proxy 斷糧，且**登入(動態IP)與掃描(靜態ISP)是兩個不同出口 IP**，本就違反「登入=爬蟲同 IP 防 challenge」。
  2. **proxy 根治**（非儲值，天條解根因不繞症狀）：neko/startup.sh gost 上游從動態 iproyal-proxy 改讀靜態 iproyal-static-1（HOST:PORT:USER:PASS 無 sticky 後綴）；provision.sh VM SA grant 改 static＋SM 註釋。動態 proxy 退役。實測 SSH `curl -x localhost:3128 ifconfig.me`＝**211.167.34.101**（登入=掃描同一出口 IP，防 challenge 落地）。v0.23.1.002。
  3. **capture 逾時救回**：capturedAt 空、Adam 說「連接到了」＝**UI 連上≠後端接到**（模稜兩可信號不當成功，查 DB 真相）。SSH 進 VM 看 /var/log/radar-capture.log＝「等待逾時，未偵測到登入，退出」——capture.cjs MAX_WAIT_MS 15 分登入等待逾時（Adam 卡 xdg-open deep-link＋改 threads.com/login＋來回診斷拖過時），開機只跑一次不重生。救回：SSH 手動重觸發 capture.cjs（secret 由 VM 自 SM 讀不經命令列，承重牆）→連現有 chromium 登入態→封存。鑑別信號全中：capturedAt>connectStartedAt、lastVerifiedAt 更新今日、session 密文 2218→2602B、proxyEnv=IPROYAL_STATIC_1；VM 自動關、8080/lock 自動收。
  4. **安全稽核**（Adam 問「連 http 瀏覽器有無外洩/入侵」）：SSH 進 VM 稽核十項全乾淨——SSH PasswordAuth=no（金鑰才進，22 全開窗口暴力破解本就無效）、成功登入全是 adamlin 本人 IP、暴力破解僅 2 次失敗、無異常進程/挖礦/反連/cron/後門、對外連線全合法（gost→靜態 IP/GCP agent/我 SSH）、**承重牆守住：session 明文零磁碟殘留、capture.log 零敏感字串**。
  5. **安全帶收緊**（Adam 指示，走完才收）：default-allow-ssh 0.0.0.0/0→127.0.0.1/32 鎖死（維運臨時開）、default-allow-rdp 刪除（Linux 無用）、neko-webrtc udp 保留（視訊必須）；provision.sh step4.5 同步（天條）。v0.23.1.003。
  6. **掃描驗通**：手動觸發 radar-scan（TEAM_ID=default）→ lastRun=done、**lastScanFound=13**、零失敗＝新 session＋靜態 IP 端到端能爬，Threads 放行 13 篇。過程用 heartbeat 鑑別「真跑 vs 卡死」（心跳 12s 前新鮮＝真跑，這輪久是新 session＋意圖 bridge 判定）。

### 2026-08-02 第2場 · 知識庫手冊外傳＋GEO 唯讀全檢＋預算閘語意認錯（7/30 起的長場）
- 降落即驗 titan 週四懸案：`status: paused` 早有人按下、7/30 心跳空轉「0 租戶到期」零燒錢——懸了三場的「等一句話」結案；豆油伯/青輔同為 paused
- 寫《知識庫與方法論系統核心概念手冊》推上 ailivex-platform（`068810a` v18.32.5，docs/KNOWLEDGE_METHODOLOGY_PLAYBOOK.md）——寫給 Adam 朋友的 AI 讀的可搬版：語域對齊/時機地址/狀態機分工/驗收反向題/十條心法＋實作對照表
- ailivex-platform repo 轉 private（Adam 要設帳號給朋友）：web 404＋API 404 權威信號收案，raw CDN 殘影掛背景哨兵盯到第 3 分鐘 404 才收
- 讀 Three-Loop Agent Engineering Playbook 戰略評估：八成與我們天條同構（證據說話=鑑別信號、repo 是真相=記憶會說謊、交接契約=lastwords、連 dry=2 都一樣）；值得偷三樣——VERIFIED/INFERRED/UNKNOWN 證據三態標籤、十一個標準停機態、「施工者可加考題不准改考卷語意」
- GEO 現場唯讀全檢（掛三態標籤實戰）：W31 五租戶監測全 done 零 failed（單場 $3.0-3.3、65-70 分鐘）；「上輪表現」資料層全亮（每題有數據、零缺 promptId）；七月帳 $43.22；錯誤 35 筆中 34 筆是 AIO 引擎（timeout+DFS）；五家提及率 AVIVA 23% → 數聚 2.5%
- 認錯修正：`monthlyBudgetUsd` 是**每租戶**月上限（`tenant.monthlyBudgetUsd ?? global`），不是總帳閘——「8/31 擋兩輪」預測作廢，平台根本沒有總帳閘機制；「調 $100」動手前煞車問清語意，Adam 改裁定全部不動
- 收尾驗證「暫停的沒被復活」：全場唯讀、七租戶 status 與降落時逐一比對一致

---

## 最新一場改了哪些檔案

（見 WORKLOG）

---

## 下一步

1. **接手先問 Adam 那三個尾巴的方向**：①neko TLS 列不列 D 期（開放前必修）②capture handle 要不要補顯示 ③@null 空殼帳號要不要清。
2. D 期開放前驗證閘（task #41）加兩必修：neko TLS＋capture 韌性（逾時/重生）。
3. 每天瞄觀察閘 scan_status/default（lastRun=done、found>0）。

---

## 卡住 / 未解

2026-08-02 第3場：
- **neko 掛 TLS（D 期開放前必修）**：Adam 問「發連結給同事登入、資料怎麼回傳、會不會外洩」——回答了資料鏈安全（https POST→KMS→Firestore、密碼只進 threads.com、明文不落地），但點出**8080 是 http（同事操作畫面明文）**，中間人理論上看得到打字畫面。開放給不特定同事前必須給 neko 掛 TLS（連結變 https）。Adam 尚未拍板列不列進 D 期——**接手先問這個**。
- **capture.cjs 逾時退出不重生（韌性缺口）**：登入慢是常態（同事更慢），15 分逾時＋只跑一次＝斷鏈。D 期開放前該改：延長/持續偵測/登入後可手動重觸發。
- **capture handle 未抓到**（顯示 activeAccountHandle=-）：走 threads.com/login 無 ds_user cookie，handle 解析不到。顯示用不擋功能（掃描用 session 密文，13 篇為證）。可補：改 capture.cjs handle 抓法或掃描時回填。
- **@null(fVGZC3B2) 空殼帳號 doc 待清**（後台一鍵移除）。
- threads-radar root 誤產 untracked `.next/`（root 誤跑 next build，rm 被權限擋）→ 下場順手清。
- 觀察閘照跑至 ~8/8（@lucymo0306 靜態 IP）。

2026-08-02 第2場：
- **8/3（週一）INLY＋AVIVA 自動輪**——LiveRefresh 真轉動＋任務進度% 兩件 UNKNOWN 的最終鑑別信號就在那天，記得看
- 豆油伯第一輪監測仍等 Adam 按（paused 中，病歷頁就地按鈕）
- GEO 無總帳閘：現只有每租戶 $50 上限（4 活躍月燒 ~$57 自然值）。Adam 知悉後裁定不動；日後租戶數上去要回頭蓋（FOUNDATION 成本章的延伸債，低利養著）
- zhu-core 髒檔 `skills/ailivex-knowledge-ingest.md`：7/23 莊子雷區增補（雷 10-14＋預寫 gists 段）**未 commit**，非本場筆跡——內容有價值，原主或下一場認領收進 git
- Three-Loop 三樣可偷（證據三態標籤/標準停機態 enum/考卷金句）待下次動 task-harness skill 時織入
- 沿前：優尼下一課（GOV.UK＋Laws of UX）、R6 首頁數字帶比較、GEO moderate CVE

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-02 第3場。*
