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

### 2026-07-13 第3場 · ailivex 對話錄音收案（v18.11.0–.2）＋濃縮版上線（v18.12.0）——訪談平臺第一塊全通
- 收掉上場 85% 的錄音功能最後一哩：admin nav、GCS 專用 SA（livekit-egress，bucket 級 objectCreator 最小權限）、EGRESS_GCS_CREDENTIALS 進 Vercel＋.env.local（@next/env 真載入驗過 JSON.parse）、build 綠、v18.11.0 commit + deploy
- 修「開錄角色撥號死寂」根因（v18.11.1）：token RoomConfiguration 只在自動建房生效，預建房必須把 agents 派工寫進 CreateRoom——Adam 第一通驗收電話就抓到
- 查明 webhook 全 401 根因：共用 LiveKit project 的 dashboard 建 webhook 時簽名 key 選到別把；自簽測試 webhook 打 production 200 證明接收端健康 → Adam 改選 API8s73d 那把 → 秒收驗證通過
- 修 reconcile 補收時長寫 0（v18.11.2）：listEgress 對已完成 egress 回空 fileResults（實測），改用 EgressInfo startedAt/endedAt 相減
- 濃縮版（去空白）上線（v18.12.0）：ffmpeg-static silenceremove（-40dB/1.5s/留0.4s，真錄音實測 3:40→1:58，樣本 Adam 耳測 OK）；原始檔不動另存 .condensed.mp4；後台按需產生/播放/連刪；ffmpeg 二進位靠 outputFileTracingIncludes 進 lambda，Adam 實按落地驗證（GCS 487KB 濃縮檔）
- 洩漏應變：建 SA key 時 node require 手滑把 private key 印進 session → 當場撤銷重發，現役 key 乾淨
- 新 memory：reference_livekit_egress_recording（四雷＋配套模式），已入 MEMORY.md 索引

### 2026-07-13 第2場 · ailivex 對話錄音功能（訪談平臺第一塊）施工 85%——醉酒指數 9+ 首次實戰停手，現場完整交接
- 答 Adam 記憶查詢：即時語音防爆檢驗 SOP 三落點齊全（memory `skill_voice_loadtest_setup_burst` / 白皮書 `ailivex-platform/docs/whitepaper-realtime-voice-surge.md` / `loadtest/` 工具＋報告）
- 答 Cloud Run CPU 規格：只能選 vCPU 數量（0.08–1 小數或 1/2/4/6/8），不能選機型/世代——垂直樓梯短，白皮書水平加台路線是對的；現役 agent 2 vCPU/2Gi/no-throttling/cpu-boost
- 評估「訪談角色全程錄音」需求：判定加在 ailivex 不拆新專案（UDN fork 三蟲教訓兩天前剛付過學費；訪談是模式不是平臺）
- 查實 LiveKit Egress 費用（混流 $0.005/分、分軌 $0.001/分/軌，Ship 內含 600 分/月）＋機制（auto egress 掛 CreateRoom、EncodedFileOutput→GCS、egress_ended webhook、audio-only 不可設 layout 否則進視訊費率）
- 派探子摸清 ailivex 接線：token 咽喉 `src/app/api/livekit/token/route.ts`、逐角色開關範本=capabilities、bucket=FIREBASE_STORAGE_BUCKET、livekit-server-sdk ^2.15.1 egress 類別全齊（node -e 驗過）
- 施工 85%（Adam 說 go；代碼全寫完、未 build 未 commit）：詳見「檔案」表

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex `src/app/admin/layout.tsx` | nav 加對話錄音 |
| ailivex `src/app/api/livekit/token/route.ts` | v18.11.1：createRoom 帶 agents 派工（metadata 前移） |
| ailivex `src/lib/recording.ts` | v18.11.2 時長兜底＋condensedFilepath/SILENCE_REMOVE_FILTER |
| ailivex `src/lib/collections.ts` | RecordingDoc +condensedFilepath/condensedSizeBytes |
| ailivex `src/app/api/admin/recordings/condense/route.ts` | 新檔：ffmpeg 同步轉檔 route（maxDuration 300） |
| ailivex `src/app/api/admin/recordings/route.ts` | GET 簽濃縮 URL；DELETE 連刪濃縮檔 |
| ailivex `src/app/admin/recordings/page.tsx` | 產生濃縮版按鈕＋濃縮播放列 |
| ailivex `next.config.ts` | ffmpeg-static externalPackages＋outputFileTracingIncludes |
| memory `reference_livekit_egress_recording.md` | 新 memory＋MEMORY.md 索引 |
| GCP | SA livekit-egress（objectCreator@ailivex-2026-assets）；洩漏 key ae888f2b 已撤銷 |

---

## 下一步

訪談角色設計（等 Adam 起頭）：在 ailivex 建角色、開 recordingEnabled、寫訪談者 soul（一問一答、追問、收束），用現成 v18 agent 零代碼跑。技術側沒有 blocker。

---

## 卡住 / 未解

2026-07-13 第3場：
- 錄音「失敗」無主動通知（要開後台頁才看到）——訪談正式營運前加一條（信或 TG）
- 濃縮門檻若嫌砍不夠兇：-35dB 檔同通實測 1:45，改 `src/lib/recording.ts` SILENCE_REMOVE_FILTER 一行
- 沿前場：S 姐姐規格第五章防護矩陣待 Adam 拍板；「你說…」句首修正待下集自然驗
- 訪談角色本體（soul + brief 設計）還沒開工——地基好了，上面的房子等 Adam 起頭

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-13 第3場。*
