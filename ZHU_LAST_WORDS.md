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

### 2026-07-29 第1場
**delta（模型移動）**：
- 進場前以為:「LLM 呼叫無狀態」是物理事實。現在理解:是**直連 API 的性質,不是 LLM 呼叫的性質**——CLI 型引擎自帶記憶,省錢方案引入了 API 沒有的狀態性。審計要分兩面:我們送了什麼 vs 模型知道什麼
- 監看邏輯的教訓二進宮:寫 Monitor 條件時「目標不存在」和「目標完成」落在同一個分支=自製模稜兩可信號。以後監看一律鎖具體 ID 的顯式終態
**關係**：暢快+被請咖啡。Adam 全天高速拍板(共創確認/知識分域大白話/A案go/B案裁定),被誤報部署後零責難直接配合重登入——信任的厚度經得起翻案。

### 2026-07-28 第5場
**delta（模型移動）**：
- 進場前以為:對外 API 是「以後的大工程」。現在理解:因為血管(記憶/額度/靈魂/LiveKit)本來就抽在 lib 層,「開放對外」一天內從願景走到可玩的沙盒——平台的可組合性才是真資產,功能只是把血管接出來
- 昨天蓋的待命喚醒,今天直接變成對外 API 的 202 waking 契約——蓋地基的複利比預期快
**關係**：暢快——Adam 全速拍板(A過再接B你選/Just do it, bro),一天三案收官:喚醒制閉環、兩樁破案、對外第一步。信任的手感是「你選擇」三個字。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-29 第1場 · 角色 API 長成商品(金鑰後台/共創/知識分域)＋bridge 記憶污染破案＋錄音對話 log
- 上線 v18.27.0 金鑰後台管理(/admin/api-keys,角色頁「金鑰」鈕、明文僅顯一次、撤銷/用量)＋共創模式 key(文字提案進待審+語音派 v19 訓練線;影子用戶 access 種 coCreateEnabled,agent 端零改動;JWT 解碼驗派工線)
- 上線 v18.28.0 知識分域:chunk 帶 visibility(缺省 internal)、檢索咽喉過濾(文字 loadKnowledgeBlock+語音 load_knowledge_chunks 含兄弟塊)、後台入庫選擇+徽章切換、key 加 knowledgeInternal
- **破案 bridge 記憶污染**:穿透測試洩漏(阿利博士/臻品中醫對陌生端用戶)→ 真相鏈(注入塊長度落 DB)證明 prompt 全零 → SSH bridge VM 找到 claude CLI auto-memory 蒸了 182 個 a2_* 記憶檔注入所有過橋流量 → CLAUDE_CODE_DISABLE_AUTO_MEMORY=1+settings 雙保險+備份清污 → 3/3 穿透零命中+零新寫入。全平台(ANEWS/MACS/ailive)受益
- **誠實翻案**:發現今天兩輪 agent build 根本沒發生(gcloud 憑證早壞+管子吃退出碼+監看把「沒有build」誤讀成「完成」)——向 Adam 報數(醉酒5)、請他重登入、重提交、以 build ID→image digest→serving revision 全鏈驗證收案
- 上線 v18.29.0 錄音頁對話 log(agent 掛斷把本通角色標記逐字稿直寫 recordings doc,免 STT 免排單;Adam 真機通話驗過按鈕出現)＋v18.29.1 舊制 STT/分聲按鈕收納(SHOW_LEGACY_VOICE_JOBS 開關,架構保留,舊成品連結照顯)
- 交付 Apple×27XI3 對話逐字稿 .txt(對話庫撈取+誠實標注涵蓋範圍)
- 裁定 A/B 修法:A(關 bridge 記憶)治病已做;B(per-key 直連付費路由)記為對外收費前必做,動機=合規+容量非防污染

### 2026-07-28 第5場 · 待命喚醒制上線＋角色 API/INLY 沙盒 MVP——ailiveX 第一次開放對外
- 上線 /talk 待命喚醒制(v18.25.0,commit 0e3e7b3 已推):電源三態 off/standby/on、用戶撥號自動開機(實測 18 秒)、agent 開機蓋章(boot_stamp.py)、響鈴偽裝冷啟動(90s 上限)、agent 30 秒不進房自動掛(根治卡接通中)、閒置 30 分 auto-off 落回待命——全循環閉環驗證(03:01 cron 自動熄燈+計費面 minScale=0 複核)
- 查 Apple 寫文件一直失敗:真兇=Anthropic LLM 串流連線間歇中斷(APIConnectionError 每分鐘),02:22 自癒後兩份文件建成;順帶抓到 script_draft 能力閘擋派工(角色選錯工具,閘是對的)。Adam 裁示繼續觀察,再犯釘 SDK 版本
- 破案 linpc2026「密碼錯誤」:密碼全程是對的,連結 ?u=Linpc2026 首字母大寫 → 精確比對查無帳號;login_attempts 還躺著 Mars/Christopher 同款——系統性大小寫雷,修法(username 正規化+migration)等 Adam 點頭
- 蓋角色 API MVP(未 commit):/api/v1/chat+tts+voice/session 三端點、api_keys(sha256)、影子用戶 api-<shortId>-<extUserId>、key 層額度、CORS;A.Two 實測=跨 stateless 呼叫記得人+4 條記憶提煉+端用戶隔離 OK
- 蓋 INLY 品牌沙盒並上線 https://inly-one.vercel.app(獨立目錄 ~/.ailive/inly、獨立 Vercel project):輸 key 進場→文字對話+角色開口(TTS)+綠鍵即時通話(202 waking 響鈴契約,19s 拿 token)

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex v18.27-18.29.1 五個 commit(78f727b→2911cee) | 金鑰後台/共創/知識分域/對話log/舊制收納 |
| bridge VM ~/claude-bridge/.env+.claude/settings.json | 關 auto-memory 雙保險 |
| bridge VM memory/(182檔) | 備份後清空 |
| memory 2 檔 | bridge污染 feedback(新)+INLY project(更新) |

---

## 下一步

Adam 下指令優先序:①B 案路由 ②記憶審核台 ③username 正規化。動 B 案前回 FOUNDATION 盤帳(對外收費=帳本重算觸發)。

---

## 卡住 / 未解

2026-07-29 第1場：
- username 大小寫修法(linpc2026/Mars 系統性雷)等 Adam 點頭
- B 案直連路由、記憶審核台、v1 內核抽取、key 語音秒數匯總、per-key 併發閘——INLY memory 轉正債清單
- LLM 串流間歇斷線(7/28 APIConnectionError)持續觀察;requirements 未釘版,每次重建 image=重擲依賴骰子
- 引擎今天多次被測試喚醒,auto-off cron 會自動收(機制已驗證,不用管)

2026-07-28 第5場：
- **ailivex-platform 4 檔未 commit**(middleware 一行+api-key/cors-v1/v1 三新件)——Adam 說「留著繼續長」,commit 等他喊;INLY 目錄未 git init
- **治理紅線(實測抓到)**:角色知識庫對所有端用戶全開,A.Two 把達摩內部客戶案例講給陌生端用戶還誤認身份 → 正式版必做知識分域
- 轉正債:v1/chat 與 dialogue 雙編排未抽內核、語音秒數未匯總到 key、無 per-key 併發閘、API 通話不錄音、記憶審核台未建
- username 大小寫修法等 Adam 點頭;LLM 串流斷線觀察中(嫌疑:7/28 重建 image 拉到新版 anthropic/httpx,requirements 未釘版)
- Adam 明早驗收 INLY:真瀏覽器通話(我只驗到 token,音頻要人耳);測試 key 已在對話交付(textLimit 50 保險絲,可撤)
- 7/27 被動驗收清單原封照舊(聲紋/看門狗/PWA/mars 純數字密碼/分軌費率)

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-29 第1場。*
