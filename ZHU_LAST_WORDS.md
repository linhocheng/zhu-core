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

### 2026-07-15 第1場
**delta（模型移動）**：
進場前以為：資料 backfill 完＋帳目歸零＝那個缺欄問題修好了（前場補 280 條時就是這麼收的）。
現在理解：backfill 是清症狀，觀察者隔天就看著它長回 81 條——壞資料是活的，因為寫手還活著。資料手術收案必須多問一句「這些壞資料是誰寫的、它現在還在寫嗎」，追到寫入端修掉才叫斷根。觀察者的價值恰恰在此：它讓「症狀重現」從半年後的驚嚇變成 24 小時內的例行報告，根因藏不住。
移動原因：巡檢首晚報 8 條、我清完當天又長 73 條——同一天內親眼看兩次「清了又流」。
違背了哪條 feedback：solve_root_not_symptom——前場 backfill 280 條時沒有追寫入端，標準的修症狀不修根因；這場觀察者逼我補課。
**關係**：平穩高效。Adam 給的視覺總監 prompt 本身品質很高（無文字底圖＋圖層分離的方向跟天條同構），對談收斂快（三問三答就定案）；「清掉 開懶人包」四個字連發兩案全速信任。凌晨他還在跟 Lilith 對話——那 73 條記憶就是活的平台在呼吸。

### 2026-07-14 第2場
**delta（模型移動）**：
進場前以為：上場資料手術「總數帳目相符」＝庫是乾淨的。
現在理解：帳目相符只證明「我選的軸」對齊了——角色孤兒查了就只保證角色軸，沒選的用戶軸留著 40 條照樣讓總帳看起來對。這是「複核全過但查錯面＝零資訊」的資料版（費用版已是天條）；解法不是每次多想幾個軸，是把軸窮舉寫進程式讓機器天天掃——觀察者第一輪就抓到，證明這條路對。
移動原因：自己寫的健檢打臉自己上場的「已清理」結論。
違背了哪條 feedback：無——上場手術當下沒有用戶軸的懷疑對象，屬視野邊界不是流程跳步。
**關係**：平穩暢快。Adam 給方向給得準（「選 1 但觀察者由你設計」），拍板快（清＋deploy 一句話）；「以後一起來看角色記憶」是下一場的約。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-15 第1場 · 觀察者首晚抓到活血——writeMemory 斷根（ailivex v18.14.1）＋UDN 懶人包視覺總監管線上線（v0.8.0.001）
- 驗收生產第一次記憶巡檢心跳（台北 04:00 準時，run SivybCtZ4RxN3An3U6Bc）：觀察者首晚值班抓到 8 條新記憶缺 status——證明「軸窮舉進程式天天掃」這條路對
- 追根：extraction / tool:remember 兩路收斂在 TS `writeMemory`（memory.ts:240），咽喉建 doc 根本沒寫 status 欄——前場 backfill 280 條是清症狀，寫手還在寫
- 斷根＋清血：`status: 'active'` 一行進咽喉（v18.14.1 commit+deploy）；補完當日新流的 81 條（觀察者報 8 之後白天又長 73，Adam 與 Lilith 對話所產），全庫零缺
- 查 UDN 議題台「情報收集者」：收集本身是純程式（Tavily＋cheerio），AI 人格只有篩選員周映辰（collect-core.ts:34，p2 移植）；下游資料整理師沈知微
- 診斷懶人包「要 15 張只出 4 張」：cardCount 有存進任務（H10c），但只有 Phase B 讀——寫文案的聊天角色和 Phase A 都瞎，角色憑手感寫 4 段
- 依 Adam 的「品牌懶人包視覺總監」prompt 重構懶人包管線（UDN v0.8.0.001 commit+deploy+push）：
  - Phase B′＝視覺總監產 STYLE BIBLE（定位＋四色 HEX 程式驗＋攝影系統）＋N 張規劃；張數留空跟文案走（3-10）
  - Phase C′＝無文字底圖；卡 1 先生自動當 2..N 風格錨（referenceImageUrl 串接）；收斂點防禦反轉：以前逼模型畫繁中、現在禁畫任何字
  - 排版引擎 `lib/lazypak-compose.ts`＝主標/內文/頁碼/Logo 全程式 SVG 疊（CJK 感知斷行確定性計算）；compose-card 端點改字免重生圖不燒額度
  - 品牌資產選配（Logo 上傳走 /api/uploads raw 模式不燒 vision 額度＋品牌色 HEX）；Dockerfile apk font-noto-cjk
  - 張數貫穿：聊天 DISPATCH 指示＋Phase A prompt 都加「N 張＝剛好 N 段」
- 排版引擎本機真跑驗過（樣張已給 Adam）；部署雙驗證過：revision 00085 流量對齊＋compose-card 401-not-404

### 2026-07-14 第2場 · 記憶觀察者上線（ailivex v18.14.0）——健檢第一輪抓到 42 條用戶孤兒並清除
- 盤點 ailivex 記憶系統可檢視/可查詢/可優化全貌（四層：情節→印象→日記→遺忘，斷點：印象層不可見、無檢索真相鏈、admin 無語義搜尋）
- 建記憶健康巡檢（觀察者）：五項確定性檢查（孤兒/缺欄/積壓/鞏固卡住/embedding 脫鉤抽測）＋Haiku via bridge 診斷評語——程式算數字、角色寫評語（天條落地）
- 接線三處雷全動：cron route（每日台北 04:00，排在鞏固/維護之後）＋vercel.json＋middleware PUBLIC_PATHS；監控中台自動多一顆 cron·記憶健檢心跳燈
- 後台面板上線：/admin/memories 頂部顯示狀態燈/觸發時間/觸發來源/發現清單/觀察者評語/管線 canary 現況/近況趨勢＋立即巡檢按鈕
- 本機端到端驗三輪（ADC fallback：FIREBASE_SERVICE_ACCOUNT_JSON 置空＋FIREBASE_PROJECT_ID=ailivex-2026）：第一輪抓到 42 條孤兒、第二輪驗通抽測管道（8 條自符合度 1.0）、第三輪調完觀察者 prompt（canary 關≠故障）
- 驗證健檢發現為真（記憶會說謊，自己的檢查也要驗）：42 條孤兒＝兩個已刪用戶（40+2），上場手術只查角色軸漏了用戶軸
- 清孤兒：驗屍（user doc 確認不存在）→ 42 條全文備份 scratchpad → 批次刪 → 重跑健檢 status=ok 零發現；496→454 帳目相符，缺 type 那條在孤兒裡一併走了
- v18.14.0 commit + deploy，生產 401-not-404 驗過兩條路由

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex `src/lib/memory.ts` | writeMemory 補 status: 'active'（v18.14.1，一行斷根） |
| ailivex Firestore memories | 81 條缺 status 補 active（8 凌晨報＋73 當日新流），全庫零缺 |
| UDN `lib/lazypak-compose.ts` | 新檔：確定性排版引擎（SVG 文字/頁碼/Logo＋CJK 斷行） |
| UDN `lib/types.ts`＋`lib/firestore.ts` | LazypakStyleBible 型別＋card baseImageUrl＋params logo/brandColor＋updater 擴充 |
| UDN `analyze-cards/route.ts` | Phase B′：視覺總監 prompt＋styleBible 程式驗＋張數跟文案走 |
| UDN `generate-card-image/route.ts` | Phase C′：管線分流＋禁文字＋卡1風格錨＋底圖分存＋inline 排版 |
| UDN `compose-card/route.ts` | 新檔：改字重排版端點（免重生圖） |
| UDN `generate-lazypak/route.ts`＋`chat/route.ts` | 張數貫穿：N 張＝剛好 N 段 |
| UDN `uploads/route.ts` | raw 模式（Logo 上傳不抽字不燒 vision） |
| UDN `AssetsClient.tsx` | 母版面板＋主標編輯＋儲存並重新排版＋品牌資產輸入＋張數留空=自動 |
| UDN `Dockerfile` | apk fontconfig＋font-noto-cjk |

---

## 下一步

1. 明早驗 ailivex 巡檢：`node scratchpad/check-heartbeat.mjs` 同款查詢或開 https://ailivex-platform.vercel.app/admin/memories——ok/零 missing-field 才算 writeMemory 斷根收案
2. UDN 生一張新懶人包卡驗字體（任一任務按分析→生成）；順手處理 15 張任務（重新撰寫或清張數）
3. Adam 起頭時回「一起來看角色記憶」線：印象層後台化最優先

---

## 卡住 / 未解

2026-07-15 第1場：
- **ailivex 斷根驗收未到時**：台北 04:00（UTC 20:00）巡檢是鑑別信號——修好＝ok/零 missing-field，沒修好＝新條目。明早看 /admin/memories 或 memory_health_runs 最新 run
- **UDN 排版字體驗收未做**：Noto CJK 進了容器（build 過），但生產第一張真卡出來、字不是豆腐框才算收案——Adam 生一張即驗
- UDN 那個 15 張任務（H10cF3QgHxE8eGOWmI2d）還在 a_done：文案只有 4-5 段，直接分析會硬拆 15 張很稀；建議按重新撰寫（新 prompt 會照 15 段寫）或清掉張數跟文案走；另 wordCount 200 配 15 張太薄，字數要一起放大
- Logo 上傳只收 PNG/JPG/WebP（detectFileKind 檔頭驗證不認 SVG），要 SVG 得另開驗證分支
- 寫實人物跨張一致性是模型物理極限：參考圖串接能拉近，gpt-image-2 不保證同一張臉——期望值已向 Adam 報備
- 沿前場：印象層後台化等四項記憶優化、表達層語音驗收、訪談角色 soul、錄音失敗通知、S 姐姐第五章

2026-07-14 第2場：
- 生產第一次 cron 心跳未發生（今晚台北 04:00）——監控頁灰燈到那時是誠實狀態；Adam 可先在 /admin/memories 按「立即巡檢」看真輪
- 記憶優化清單剩四項未動（按價值排）：印象層後台化、rerank、admin 語義搜尋、檢索真相鏈/模擬器（本場做的是自動觀察者，真相鏈 debug 面板還沒做）
- 本機 dev 環境雙缺（歷史遺留非本場）：.env.local 的 SA JSON 有真換行 JSON.parse 不過、且缺 FIREBASE_PROJECT_ID——本機測法＝FIREBASE_SERVICE_ACCOUNT_JSON= 置空走 ADC＋補 FIREBASE_PROJECT_ID
- 沿前場：表達層語音實戰驗收、訪談角色 soul、錄音失敗主動通知、S 姐姐第五章

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-15 第1場。*
