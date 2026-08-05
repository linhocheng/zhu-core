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

### 2026-08-05 第4場
**delta（模型移動）**：
進場以為：只是套 UI，一兩小時
現在理解：訪談流程有五條暗線（聲波/選禮物/掛斷時機/逐字稿時序/量表觸發）全部要通
移動原因：Adam 一路測，每條暗線都找出問題，逐一擊破
**關係**：高效流暢。Adam 測得很仔細，每個問題都有根因，沒有模糊回報。88 的時候感覺完成度高。

### 2026-08-05 第3場
**delta（模型移動）**：
- 進場前以為：V3 的風險在新寫的東西（母圖、裁格、放大、術語表）。
- 現在理解：**新流程真正的風險在它第一次走到的舊路上**。今天兩個 bug 都不在 V3 的新程式碼裡——是「押回→重簽」這條組合路徑第一次被真正走完，把既有簽字閘的假設（重簽＝全表重來）和既有介面的盲區（只渲染 keyframes 錯誤）照出來。新功能的測試會測新程式碼，但**新功能改變的是「哪些舊路徑會被走到」**。
- 移動原因：Adam 一句「奇怪跳回第五步」——他沒在講新功能，他撞的是新舊交界。
- 同型上一次：feedback_capacity_constants_expire（常數是當時規模的快照）——今天是它的流程版：舊假設是舊流程的快照。
**關係**：Adam 問「還是說只要沒有連起來就什麼都不算數了？」——那句話裡有一點怕損失的味道。能回答「段片是獨立存檔的、一秒都沒丟」並直接把 24 秒交到他手上，是今天最舒服的一刻。他對我白燒的 $2.40 沒有追究，注意力全在「我想看片」——這是把錢當學費、把注意力留給作品的人。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-05 第4場 · BeSelf 全站 UI/UX 套版＋訪談流程打通（v2.0.0→v2.0.8）
- 全站重設計：Logo/Order/Loading/Dialing/Call/Gift/Ended 七屏，毛玻璃卡片＋浮動 blob 背景
- Google Fonts next/font/google 引入（Cormorant Garamond + Work Sans）
- Loading 60s→系統 ready 立刻跳（gridRef 快轉）
- 聲波三色：AI 藍/#8FAEDD、用戶粉/#E39EC0、思考中灰紫/#b8aec9；麥克風 AnalyserNode 接入
- 「思考中…」dots 動畫：用戶說完 AI 還沒開口的靜默期顯示
- 禮物格子：1.5px 邊框/選中藍框 #4db6f7 + ✓；click-to-select 備援；gridRef 修 mapChoiceToGift 對映
- v21 加 hang_up 工具：道別完再掛，不直接中斷
- 繁體禮物標題固定（不用 agent 送的可能簡體）
- 訂單重置測試（used→unused + 刪 interview doc）
- 訂單/訪談真刪除：delete/delete-iv 兩個新 action
- 活動列表加刪除按鈕（prompt 輸入 ID 確認）
- complete 路由三次漸進重試（T+35s/65s/95s）自動補拉 transcript
- admin 訪談 tab「補拉量表」按鈕（transcriptLines=0 的 done 訪談也可觸發）
- ailiveX v21.1/v21.2/v21.3：finalize 跳過記憶/lastSession、hang_up 工具、record_choice 先道別、逐字稿 opencc s2twp

### 2026-08-05 第3場 · DreamF 首支 V3 真片撞出兩雷——重簽重拍白燒錢、押回時介面全啞；段片獨立存檔證明「沒連起來也算數」
- 診斷 Adam「影片走到第六步跑了二三張又跳回第五步」：不是狀態機亂跳，是**段4 被 Vertex 安全審查擋下（連替代畫面也擋）→ 依設計押回影格間**。真兇藏在旁邊兩個問題裡
- **修 bug 1（燒錢）**：`sign` 路由寫著「重簽＝重種」，把所有段無條件重置成 queued → worker 的斷點續跑判斷永遠不成立 → **已有成片的段 1-3 重拍一遍，白燒 $2.40**（帳目 veo segment-1/2/3 各出現兩次）。修法照承重牆 #4 同型往下延一層：`segmentContentHash`（Veo prompt 全文＋首尾幀圖指紋），重簽時同指紋＋已有成片的段留著，只有改動的段重拍
- **修 bug 2（沉默）**：影格間只渲染 keyframes job 的錯誤，shoot job 押回**完全不出聲**——客戶只看到畫面莫名跳回上一幕。加黃色說明塊（中斷原因＋一鍵去分鏡室）；押回訊息本身也在騙人（寫「押回分鏡室」實際退到影格間），改成說得出下一步
- **回填既有段的指紋**：三段成片是修法之前拍的、身上沒指紋，新程式會當陌生段照樣重拍＝修了等於沒修。補完讀回複驗（段1-3 有指紋有片、段4 無指紋正確）
- v0.4.1.001 部署，兩側 serving image 驗 SHA=6b3759f；57 測試綠
- 撈出段 1-3 成片＋ffmpeg 接成 24 秒版交給 Adam；另撈舊案「精華液 V3」成片（案已刪、檔仍在桶）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| beself/app/globals.css | 新建：blobFloat/dotPulse/ringPulse/fadeUp 動畫 |
| beself/app/layout.tsx | next/font/google 引入 |
| beself/app/page.tsx | Logo + Order 兩屏完整改版 |
| beself/app/interview/page.tsx | Loading/Dialing/Call/Gift/Ended 完整改版；三色聲波；思考中；gridRef；hangup |
| beself/lib/context.ts | hang_up 指令＋道別後掛斷語意 |
| beself/app/api/complete/route.ts | after() 三次漸進重試 + 自動量表 |
| beself/app/api/admin/orders/route.ts | reset/delete/delete-iv 三個新 action |
| beself/app/admin/page.tsx | 訂單重置/刪除鈕、訪談刪除鈕、活動列表刪除鈕、補拉量表按鈕 |
| ailivex-platform/agent/realtime_agent_v21.py | finalize 跳記憶/lastSession、hang_up 工具、record_choice 道別時機、opencc s2twp |

---

## 下一步

確認 AVIVA 真實消費者訂單格式（純數字或帶前綴）→ 調整 placeholder → M1 開跑
或: 下次開工先跑 beself admin → 訪談 tab → 看 transcript 有沒有補進來

---

## 卡住 / 未解

2026-08-05 第4場：
- FOUNDATION #10（災難還原）、#12（生人驗收）：觸發條件「正式開跑前」，M1 還沒第一筆真消費者，未到期
- v21.3 逐字稿 opencc 效果待真實訪談確認（Agent 說簡體比例未知）
- 「回收中…」問題的根治：agent finalize 時序問題，三次重試是緩解，根治是 agent POST callback 通知 BeSelf（排後）

2026-08-05 第3場：
- **段 4 還沒改寫**：Adam 要回分鏡室改描述（方向：餘燼／焦痕／煙，避開燃燒進行式動詞），改完重簽。**鑑別信號＝重簽後帳目只出現 `veo segment-4`，沒有 1/2/3**——沒驗到這個就不算修好
- V3 母圖線畫質仍未被人眼裁定（Adam 剛拿到 24 秒版與 V3 舊片對照，還沒給結論）
- 後期轉場（溶接/淡出）術語建好、剪接層仍缺；TTS 未接（D9）
- FOUNDATION D2（資料刪除連帶）仍到期未灌——舊案成片全是孤兒檔
- 髒樹：zhu-core 兩個 ailivex skills、dreamfactory（4 月舊案）——別場，照平行規約未動

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-05 第4場。*
