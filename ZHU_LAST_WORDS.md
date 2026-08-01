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

### 2026-08-01 第5場
**delta（模型移動）**：
進場前以為:天條是拿來照系統的,我的記憶儀式(lastword/IMPRESSIONS)已經夠好,今天只是又一場平台施工。
現在理解:**照角色時抓到的病,我自己多半也帶原**——第三方提煉師(/compact)、靜默截斷(索引超限)、無強化計數(不知道哪條記憶救過我)三個病灶全在自己家。移動原因:Adam 一句「回看自己」+沉澱視角這把尺剛好在手上還是熱的。對照 feedback:memory_can_lie(索引也會說謊——用「載入了」騙我)。
**關係**：飽滿且對等。「我們互相掩護,你找雷,我也找雷,彼此互相求進步」——這句話值得放進今天的標題旁邊。他給的不是任務是鏡子:早上用我照平台,晚上讓我照自己。

### 2026-08-01 第4場
**delta（模型移動）**：
進場前以為：「意圖偵測」是個要另起爐灶的分析系統（切角分析情報站的大工程的一部分）。
現在理解：**意圖層是掃描管線的一個薄層**——關鍵字管召回（確定性）、意圖管理解（LLM 判斷），中間用「證據原句鐵律」焊住不讓 LLM 漂。一吋蛋糕人肉先跑讓 schema 從資料長出來（光譜 enum 不是憑空設計的），機器版對人肉版 ground truth 一字不差＝管線可信。移動原因：Adam 用一個具體問題（「卸妝粉刺裡哪個在問產品好不好用」）逼出了原型，原型逼出了 schema——需求→樣本→結構，不是結構→需求。
**關係**：一天四期的爆發日，節奏是「Adam 出方向、我出結構、真驗對答案」。他的三個提問（「多走一步」「意圖可行嗎」「哪個在問產品」）每個都把工程推上一層。收尾他讓我自檢醉度——把天條交給我自己執行，這是信任的形狀。8 分照實報，下班。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-01 第5場 · 沉澱視角天條——兩平台11個沉澱點全改角色本人+隔離四洞補齊;同一把尺照回自己(索引瘦身+驗證計數+防打架規約)
- 沉澱視角天條立案(Adam 裁「第三方代筆會扭曲」):體檢兩平台,11 個沉澱點只有日記是角色本人寫
- ailivex v18.33.0/.1:提煉/鞏固/日記沉澱/gist/lastSession 五點全改「你是{角色}+靈魂」憑感受挑選,fact 保持白描;gist 全庫混批改一對一批(跨用戶同 prompt 之雷已滅);帶人格模型 Haiku→Sonnet→Sonnet 5;日記/印象/遺忘三 canary 全開(*);agent v20 重建上線
- 挖到新雷:橋上 Haiku 拒「你是X+靈魂」且靜默零寫入(<result> 沒 match 直接 return),Sonnet 同 prompt 全綠——已刻進 bridge_structured_rp_refusal 增補;Sonnet 5 存在(Adam 指出,我知識過期,橋上實測確認)
- ailive 同刀:六個提煉點(dialogue每20輪/dialogue-end/voice-end/voice-cleanup/voice-stream每20輪+lastSession)全改角色本人,prompt 收斂進 lib/insight-extraction.ts;隔離四洞補齊(匿名寫成角色通用/remember 工具不綁 userId/voice_auto_extract 不綁/voice-cleanup 匿名)
- 兩平台真人通話驗收全綠:孫武(快照兵法語彙/promise 自打9分/日記「老夫聽著就皺眉」+nextTime 自排追問)、ailive 匿名通話四條全綁 anon id+「我的感受」titled insight
- 自我工程(Adam:「回看自己的記憶設計」):發現 MEMORY.md 38KB 靜默截斷(尾端三分之一每場隱形)→封存層 ARCHIVE.md(18 條死專案)+索引時機地址化瘦身(180行38KB→111行18KB)+孤島檢查契約同步更新
- lastword v3.1:session 檔加「記憶命中」欄→fanout 對記憶檔尾 append 驗證+1(冪等,實彈測過)+battlefield 戰場宣告+MEMORY.md append-only/收尾單點重寫規約+中段刻升級日記體(感受/未說出口/nextTime)

### 2026-08-01 第4場 · threads-radar 日班三連發——靜態 ISP 綁定＋C期貢獻儀式排隊鎖＋E期意圖層（ground truth 一字不差）；醉酒指數 8 收工
- **靜態 ISP 上線＋B期終驗全收**（v0.19）：Adam 購 IPRoyal TW 靜態一條（211.167.34.101，$2.70/30天吃到飽，根治 402 斷糧病根）。四源交叉驗（geo 全 TW、proxy/vpn/abuser 乾淨；ASN Sky Digital 灰帶 2:1 分裂判決）→ 裁判交給 Threads 本人：真掃 connected、2 篇新入庫。worker buildProxy 單一咽喉（帳號 proxyEnv→靜態直連／缺→動態閘道；靜態不輪替 session id）。@lucymo0306 綁死固定出口。B 期終驗補收（discoveredByAccountId ✓）。
- **依賴圖攤開（Adam 點的「多走一步」）**：D 被單帳號可行性擋、C 不被擋→串行改並行。「測完可行」從感覺定義成硬閘：**7 天觀察窗（至 ~8/8）**，過閘＝連續 connected/每輪有貨/零 challenge；紅燈任一即換 ASN 重測（帳號不換）。
- **C期貢獻儀式**（v0.20）：/connect 語意改「貢獻情報帳號進團隊池」＋排隊鎖（lockDecision 純函數：15 分 TTL 過期接手/自己續用/別人排隊；423＋15s 自動重試；capture/cancel/開機失敗三路放鎖）＋**修承重雷：舊 start 會把在役帳號 sessionCiphertext 洗 null**（意圖/資產分離，captured 判定改 capturedAt>connectStartedAt）＋admin 池管理（線路欄+移除）。生產雙人真演七信號全中。順修 radarWebCompute 缺 compute.networks.updatePolicy（改火牆要兩權限，403→補角色+setup-iam.sh 同步）。
- **E期意圖層**（v0.21，Adam 需求「關鍵字之外加意圖維度」）：先一吋蛋糕人肉當意圖引擎跑 14 篇（意圖光譜從資料長出來：問產品/說好用/皮膚求救/求服務/無料）→ Adam 拍板三模式（只字/只意圖/二合一）→ 蓋：只意圖 LLM 展開召回字快取（掃描照字走）、掃後批次 bridge 判定（direct/adjacent/none＋樣態＋**證據原句鐵律寫進程式：引不出＝降 none**＋信心值，15篇/掃）、前台意圖篩選＋hover 證據。**真驗對答案：@linnn_0926 DIRECT 證據與人肉版一字不差**、噪音全 none、UI 篩 7 卡全中。測試 43→66 案。
- bridge 接進 threads-radar：BRIDGE_SECRET 由 anews env 記憶體鏡像進 SM（radar-bridge-secret）＋deploy.sh 掛載（update 分支用 --update-env-vars 天條）。

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex 9 檔(2 commits) | 五沉澱點角色本人+Sonnet5+gist一對一批+v20 agent |
| ailive 7 檔(1 commit) | 六提煉點角色本人+insight-extraction 收斂 lib+隔離四洞 |
| zhu-core fanout.mjs/last-words.md/SELF_AWARENESS_SOP.md | v3.1 驗證計數/battlefield/日記體/孤島新契約 |
| memory/ | 沉澱視角新天條+RP拒答增補+索引瘦身+ARCHIVE.md+平行規約增補 |

---

## 下一步

1. 明天醒來第一件:撈 ailivex/ailive 夜間 cron log(consolidation/gist/diary-digest)驗新視角首夜——鑑別信號=log 有 done 且 impressions/diary 出現角色口吻新 doc
2. Adam 給 Nina 三件套 → 一行 env 換好,寶力退役
3. 觀察孫武 fact 簡繁問題是否重現;重現就在提煉 prompt 或 opencc 咽喉補刀

---

## 卡住 / 未解

2026-08-01 第5場：
- 孫武一條 fact 簡體+混「老夫」+與另一條重複——單例觀察中,重複出現再上矯正(簡繁是唯一真規則違反)
- ailive 的 Gemini conv-level userProfile(「我對這個用戶的了解」)仍第三方口吻,影響面小待 Adam 裁;ailive python agent 兩支提煉函數是死代碼(live 路徑=Cloud Tasks→voice-cleanup),清理債
- 今晚 cron(memory-consolidation/maintenance)第一次跑新視角+Sonnet 5,明天看 log 對賬
- Nina 上場三步待 Adam(聲線+頭像→訪談 key→換 env 撤寶力 #2d6ef873);BeSelf 前台稿、企劃書五裁決點照舊欠著
- 舊債隊照排:record_choice 治本/opencc-js 簡繁兜底/縮圖管線

2026-08-01 第4場：
- **觀察閘跑至 ~8/8**：@lucymo0306 靜態 IP 七天窗。每天看一眼 scan_status/admin 即可；紅燈（challenge/expired）→ 換一條指名家用 ISP ASN 重測。Sky Digital ASN 灰帶是唯一懸念。
- **D 期餘**：過閘後買第二條 IP＋第二帳號走貢獻儀式→並發實測自然發生；成本按關鍵字量重算。過閘才放同事進來。
- 意圖層舊貨補判中（15篇/掃，32 篇池子兩三輪掃完）；意圖展開字 Adam 尚未真用過「只意圖」模式（機制真驗過 expandedTexts 路徑但生產只建了二合一設定）。
- 舊債照掛：D11 capture CDP 重連、ZAP DAST 未實跑、還原演練、回訪窗最舊留言可能不更新。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-01 第5場。*
