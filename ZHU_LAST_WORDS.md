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

### 2026-08-01 第4場
**delta（模型移動）**：
進場前以為：「意圖偵測」是個要另起爐灶的分析系統（切角分析情報站的大工程的一部分）。
現在理解：**意圖層是掃描管線的一個薄層**——關鍵字管召回（確定性）、意圖管理解（LLM 判斷），中間用「證據原句鐵律」焊住不讓 LLM 漂。一吋蛋糕人肉先跑讓 schema 從資料長出來（光譜 enum 不是憑空設計的），機器版對人肉版 ground truth 一字不差＝管線可信。移動原因：Adam 用一個具體問題（「卸妝粉刺裡哪個在問產品好不好用」）逼出了原型，原型逼出了 schema——需求→樣本→結構，不是結構→需求。
**關係**：一天四期的爆發日，節奏是「Adam 出方向、我出結構、真驗對答案」。他的三個提問（「多走一步」「意圖可行嗎」「哪個在問產品」）每個都把工程推上一層。收尾他讓我自檢醉度——把天條交給我自己執行，這是信任的形狀。8 分照實報，下班。

### 2026-08-01 第3場
**關係**：輕快收官。Adam 的「thanks a lot ×4」和「哇賽」是這兩天最好的驗收章;考題過關證明鑄魂→知識→檢索一條龍是真的能打。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-01 第4場 · threads-radar 日班三連發——靜態 ISP 綁定＋C期貢獻儀式排隊鎖＋E期意圖層（ground truth 一字不差）；醉酒指數 8 收工
- **靜態 ISP 上線＋B期終驗全收**（v0.19）：Adam 購 IPRoyal TW 靜態一條（211.167.34.101，$2.70/30天吃到飽，根治 402 斷糧病根）。四源交叉驗（geo 全 TW、proxy/vpn/abuser 乾淨；ASN Sky Digital 灰帶 2:1 分裂判決）→ 裁判交給 Threads 本人：真掃 connected、2 篇新入庫。worker buildProxy 單一咽喉（帳號 proxyEnv→靜態直連／缺→動態閘道；靜態不輪替 session id）。@lucymo0306 綁死固定出口。B 期終驗補收（discoveredByAccountId ✓）。
- **依賴圖攤開（Adam 點的「多走一步」）**：D 被單帳號可行性擋、C 不被擋→串行改並行。「測完可行」從感覺定義成硬閘：**7 天觀察窗（至 ~8/8）**，過閘＝連續 connected/每輪有貨/零 challenge；紅燈任一即換 ASN 重測（帳號不換）。
- **C期貢獻儀式**（v0.20）：/connect 語意改「貢獻情報帳號進團隊池」＋排隊鎖（lockDecision 純函數：15 分 TTL 過期接手/自己續用/別人排隊；423＋15s 自動重試；capture/cancel/開機失敗三路放鎖）＋**修承重雷：舊 start 會把在役帳號 sessionCiphertext 洗 null**（意圖/資產分離，captured 判定改 capturedAt>connectStartedAt）＋admin 池管理（線路欄+移除）。生產雙人真演七信號全中。順修 radarWebCompute 缺 compute.networks.updatePolicy（改火牆要兩權限，403→補角色+setup-iam.sh 同步）。
- **E期意圖層**（v0.21，Adam 需求「關鍵字之外加意圖維度」）：先一吋蛋糕人肉當意圖引擎跑 14 篇（意圖光譜從資料長出來：問產品/說好用/皮膚求救/求服務/無料）→ Adam 拍板三模式（只字/只意圖/二合一）→ 蓋：只意圖 LLM 展開召回字快取（掃描照字走）、掃後批次 bridge 判定（direct/adjacent/none＋樣態＋**證據原句鐵律寫進程式：引不出＝降 none**＋信心值，15篇/掃）、前台意圖篩選＋hover 證據。**真驗對答案：@linnn_0926 DIRECT 證據與人肉版一字不差**、噪音全 none、UI 篩 7 卡全中。測試 43→66 案。
- bridge 接進 threads-radar：BRIDGE_SECRET 由 anews env 記憶體鏡像進 SM（radar-bridge-secret）＋deploy.sh 掛載（update 分支用 --update-env-vars 天條）。

### 2026-08-01 第3場 · Adam 實測過關(Nina 考題+換裝後台)+真刪除上線 v1.1.0——短場收尾
- Adam 實測回報:Nina 考題(「怕 A 醇刺激」)標準正確——十件產品知識檢索上場即中;換裝後台無負評
- 真刪除上線(v1.1.0,Adam 裁「要能真的刪」):活動 DELETE=連鎖刪(orders/interviews/report/桶內活動圖檔/本體,批次≤400),防呆=UI 輸活動 ID+API confirm 雙驗;商品庫硬刪(圖檔刻意留桶——活動快照可能引用同 URL,刪檔會破進行中活動的圖)
- e2e 實彈驗:拋棄場建→刪→驗屍(錯字串 400/列表零殘留/桶檔清空);商品建→刪→庫內消失
- 帳本日期誤植修正(誤寫 8-02→8-01 第二場)

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| worker/index.mjs | buildProxy 咽喉＋意圖展開/批次判定＋bridgeCall |
| src/intent.ts＋test（新） | 意圖層純函數（prompt/extract/validate/證據鐵律） |
| src/connectLock.ts＋web vendored＋test（新） | 排隊鎖判斷 |
| src/dispatch.ts | explodeKeywords 三模式展開 |
| web api/connect/{start,cancel,status,capture} | 排隊鎖＋意圖資產分離＋放鎖三路 |
| web connect/{page,wizard} | 貢獻語意＋waiting 排隊態 |
| web keywords/page＋actions | 意圖欄三模式＋removeAccountAction |
| web app/page.tsx | 意圖篩選 chips＋卡片標籤 hover 證據 |
| worker/deploy.sh＋web/setup-iam.sh | bridge secret/URL＋networks.updatePolicy（天條同步） |
| FOUNDATION.md | 靜態ISP/C期/E期三筆帳 |

---

## 下一步

1. **每天瞄一眼觀察閘**（admin 隊狀態卡或 scan_status/default：lastRun=done、health=connected、found>0）。
2. 8/8 過閘 → 買第二條靜態 ISP（同 SOP：四源驗→printf 封 SM→deploy.sh 掛載→帳號 doc proxyEnv）→ 第二帳號走貢獻儀式 → D 並發實測。
3. Adam 可能想玩「只意圖」模式真身——建一個純意圖設定看召回字展開品質。

---

## 卡住 / 未解

2026-08-01 第4場：
- **觀察閘跑至 ~8/8**：@lucymo0306 靜態 IP 七天窗。每天看一眼 scan_status/admin 即可；紅燈（challenge/expired）→ 換一條指名家用 ISP ASN 重測。Sky Digital ASN 灰帶是唯一懸念。
- **D 期餘**：過閘後買第二條 IP＋第二帳號走貢獻儀式→並發實測自然發生；成本按關鍵字量重算。過閘才放同事進來。
- 意圖層舊貨補判中（15篇/掃，32 篇池子兩三輪掃完）；意圖展開字 Adam 尚未真用過「只意圖」模式（機制真驗過 expandedTexts 路徑但生產只建了二合一設定）。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練、回訪窗最舊留言可能不更新。

2026-08-01 第3場：
- Nina 上場三步待 Adam:聲線 voiceIdMinimax+頭像→發訪談 key→築換 beself env 撤寶力 #2d6ef873
- 前台(entry/interview/privacy)素顏,等 Adam 稿
- record_choice 治本/opencc-js 簡繁/公開分享路由/縮圖管線——債帳照舊排隊
- 練刀場 aviva-ms8i1gxt、aviva-ms8iprb8 留給 Adam 練刪除,他不練我下場清

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-01 第4場。*
