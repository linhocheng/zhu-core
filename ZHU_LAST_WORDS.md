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

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-13 第2場 · ailivex 對話錄音功能（訪談平臺第一塊）施工 85%——醉酒指數 9+ 首次實戰停手，現場完整交接
- 答 Adam 記憶查詢：即時語音防爆檢驗 SOP 三落點齊全（memory `skill_voice_loadtest_setup_burst` / 白皮書 `ailivex-platform/docs/whitepaper-realtime-voice-surge.md` / `loadtest/` 工具＋報告）
- 答 Cloud Run CPU 規格：只能選 vCPU 數量（0.08–1 小數或 1/2/4/6/8），不能選機型/世代——垂直樓梯短，白皮書水平加台路線是對的；現役 agent 2 vCPU/2Gi/no-throttling/cpu-boost
- 評估「訪談角色全程錄音」需求：判定加在 ailivex 不拆新專案（UDN fork 三蟲教訓兩天前剛付過學費；訪談是模式不是平臺）
- 查實 LiveKit Egress 費用（混流 $0.005/分、分軌 $0.001/分/軌，Ship 內含 600 分/月）＋機制（auto egress 掛 CreateRoom、EncodedFileOutput→GCS、egress_ended webhook、audio-only 不可設 layout 否則進視訊費率）
- 派探子摸清 ailivex 接線：token 咽喉 `src/app/api/livekit/token/route.ts`、逐角色開關範本=capabilities、bucket=FIREBASE_STORAGE_BUCKET、livekit-server-sdk ^2.15.1 egress 類別全齊（node -e 驗過）
- 施工 85%（Adam 說 go；代碼全寫完、未 build 未 commit）：詳見「檔案」表

### 2026-07-13 第1場 · S 姐姐「原生認知」規格落地——UDN 補判斷層、ailiveX 磨四刀，兄弟平台首次互相體檢
- 摸 UDN podcast 線與 ailiveX 對比：UDN 是場控時代移植版往「新聞快產線」分化（主持人形式/Brief 事實打底/額度錶反領先）；三隻 ailiveX 踩過的同款蟲在 UDN 全數潛伏
- 修 UDN 三蟲（v0.6.3.001）：EOS token 洩漏（stripModelTokens 釘 pushLine 收斂點＋自審＋懶人包）、音檔標記多段落蒸發（flattenLine 壓平往返）、發聲失敗靜默跳輪（重試＋明確 log）
- 讀 S 姐姐「原生認知生成核心」規格並分章判定落點：前四章與我們 v18.8 獨立收斂（判斷先於語言＝THINK/SPEAK），第五章防護矩陣屬對用戶聊天線非 podcast
- UDN 補課（v0.7.0.001）：生成加【想】內心判斷行（程式剝除只進 log）、說話規則翻賦權結構（同意三段/沉重話題靠生命經驗/回應內容不回應氣氛）、MOVES 擴四招；林子宜×張立真錄「毒癮悲歌」驗證——同意三段自己長出來（「『沒張力』跟『沒試過』是兩回事」）、重話題零療癒腔
- ailiveX 磨四刀（v18.10.0）：SPEAK 同意三段＋沉重時刻錨＋回應內容不回應氣氛；analyze-voice 加名字遮蔽測試（對半折裁判認人＝角色分化度，基線 50% 目標 ≥80%）；簡報王×Tracy 真錄驗證，遮蔽 100%，Adam 昨日實錄集也 100%
- 量尺當場抓到新規則反彈：「指名主張」被執行成 4/9 輪「你說…」句首口頭禪（原 0/11），補半句修正（指名嵌句中不必開頭複述）
- 兩平台部署鑑別信號全過：UDN image `:d633447`、ailiveX image `:d7cb362`，皆 traffic==latestReady、job 同版

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex `src/lib/collections.ts` | COL.recordings＋CharacterDoc.recordingEnabled＋RecordingDoc |
| ailivex `src/lib/recording.ts` | 新檔：buildRoomEgress/egressResultFields/reconcileRecordings（計費雷註解） |
| ailivex `src/app/api/livekit/token/route.ts` | recordingEnabled→createRoom 掛 egress＋recordings doc，fail-closed 503 |
| ailivex `src/app/api/livekit/webhook/route.ts` | 新檔：WebhookReceiver 驗簽收 egress_ended |
| ailivex `src/middleware.ts` | PUBLIC_PATHS 加 /api/livekit/webhook |
| ailivex `src/app/api/admin/characters/[id]/route.ts` | GET/PATCH 加 recordingEnabled |
| ailivex `src/app/admin/characters/page.tsx` | EditState/setEditing×2/payload/checkbox「對話錄音」 |
| ailivex `src/app/api/admin/recordings/route.ts`＋`src/app/admin/recordings/page.tsx` | 新檔：列表 API（reconcile＋signed URL＋DELETE）＋列表頁 |
| zhu-core `docs/WORKLOG.md` | 兩筆刻檔（85% 清單＋醉酒停手點） |

---

## 下一步

接手的築：`cd ~/.ailive/ailivex-platform && git status --short` 認 8 檔改動 → 按「未解」1-6 序跑。第 1 步 nav 是 30 秒的事但**先用 Read 工具開檔再 Edit**（本場三犯的雷）。build 綠之前不 commit；commit 前跟 working tree 對一遍檔案清單（平行施工規約）。

---

## 卡住 / 未解

2026-07-13 第2場：
- **ailivex-platform working tree 有本場未 commit 改動（刻意不收：沒 build 過）**——8 個檔全屬錄音功能，清單見「檔案」表；接手者從「下一步」續跑
- **差最後一哩（按序）**：
  1. `src/app/admin/layout.tsx` ADMIN_NAV 加 `{ href:'/admin/recordings', label:'對話錄音', icon:'audio' }`（插在即時語音後面）——上場被 Edit-before-Read 擋下的就是這步
  2. GCS 專用 SA：`gcloud iam service-accounts create livekit-egress --project=ailivex-2026` → 對 bucket `ailivex-2026-assets` grant `roles/storage.objectCreator`（bucket 級）→ 建 key JSON → Vercel env `EGRESS_GCS_CREDENTIALS`（production）＋`.env.local`；printf 不用 echo、byte 級驗尾端換行（兩顆舊雷）
  3. `npm run build` + `npm run lint` 過綠
  4. commit（repo 慣例 `vN.N.N 新增：…` 繁中、無 footer；版號看 git log 最新 v18.10.0 之後）→ `npx vercel --prod --yes`
  5. LiveKit Cloud 後台 Settings → Webhooks 指向 `https://<prod>/api/livekit/webhook`（dashboard 手動；沒設也有 reconcile 兜底，不擋驗收）
  6. 驗收鑑別信號（寫在計畫裡，失敗時不可能出現的信號）：開錄角色通話→GCS 出現 `recordings/{charId}/{room}.mp4` 可播、時長≈通話；未開角色→LiveKit 零 egress 記錄；recordings doc recording→done；LiveKit 帳單 audio-only 費率
- **驗收需要真通話**：本機 Mac 到 LiveKit edge TCP 路由不通（舊雷），最自然是 Adam 手機打一通；或 seed 測試帳號＋雲端 VM 合成來電者（loadtest/caller.py 模式）
- 沿前場（_1）：S 姐姐規格第五章防護矩陣待 Adam 拍板；「你說…」句首修正待下一集自然驗

2026-07-13 第1場：
- **第五章「心智全息防護矩陣」未動**——它的家在對用戶的聊天線（ailiveX text/voice dialogue）；要做需 Adam 拍板，且個性句（「高維度碾壓」類）必須按角色下放進各自 soul，全局層只放機制（防吐 prompt），否則踩「全局 prompt 編碼個性」舊雷；反坍縮要留求助/自傷信號的破格活門
- 「你說…」句首口頭禪的半句修正是 prompt 級、未經整集驗證——下一集自然驗，analyze-voice「複述+表態開頭」指標盯著（目標 ≤1）
- UDN 微型集（600 字）收尾窄：主持人丟出尖問題後字數煞車直接道別，來賓沒機會答——正式集 800+ 字應不明顯，觀察
- 沿前場：ailiveX 規格書 v1.1、duo 多段落 TTS 首航、THINK 共鳴全滿（本場 9/9 又中）、多人模式接製作人、計費錶三異常

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-13 第2場。*
