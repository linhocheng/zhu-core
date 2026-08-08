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

### 2026-08-08 第5場
**delta（模型移動）**：
- **進場前以為**：修 UI bug＝找到那條錯的排序/篩選邏輯改掉，資料層查詢驗通就等於功能修好。
- **現在理解**：「資料查得到」和「使用者點得到」是**兩個獨立的層**，各自要驗。
  同一個病會長出多張臉——第一層是排序（東西在但沉底）、第二層是計數（數字說謊）、
  第三層是入口（按鈕根本不存在）。修完一層必須主動問「這一層的上游／下游還在嗎」，
  不然就是修一層宣告一次收工，等著被追問。
- **移動原因**：Adam 三次追問，每次都掀出更深一層，三次都不是我自己發現的。
  第三層本來就在第二層底下——我修第二層時用 REST 驗了 `?kw=行銷` 撈到 11 篇就宣告完成，
  卻沒問「這顆按鈕在畫面上嗎」。
- **違背了哪條 feedback**：`feedback_raw_query_not_ui_truth`（debug 直撈 DB 不能當 UI 行為回報，
  走 UI 同一條讀路徑才是產品真相）。這條記憶我有，三次都沒用上。
  次要違背 `feedback_interface_blood_vessel_check`（介面建完強制問血管接通了嗎——誰讀／何時讀／沒讀怎樣）：
  我建了篩選入口，沒問「誰來產生這些按鈕」。
**關係**：平穩但被追著跑。Adam 問了三次「還有沒有問題」，我答了三次「修好了」，三次都不完整。
第三次我主動說了「這三輪連續掀出三層是同一個根，我每次都只修眼前那層就宣告收工」——
說出來比被抓到好，但更好的是第一次就看全。他沒有不耐煩，一直在給機會往下挖。

### 2026-08-08 第4場
**delta（模型移動）**：
**進場前以為**：方法論開場要彈性＝把固定素材（顏色）換成「更多情境素材」（天氣/季節/地理），再把素材接進 prompt 血管。
**現在理解**：那還是焊戰術，只是換一個焊點。真正的彈性＝**把「意圖＋為什麼這類招有效」交給角色，讓它自己生招並自判是否服務意圖**；情境素材是生招時的原料，在意圖下游、不是彈性本身。「寫目標不寫台詞」要再深一層到「傳遞意圖的機制，不是傳遞戰術或素材」。
**移動原因**：Adam 兩次把我從戰術層往下按（第一次：換素材還是焊；第二次：焦點在意圖，你自己怎麼看）。我對「顏色的意圖」認真拆解後才摸到——第 1 步的產物是「安全感＋卸面具＋人人已開口」，不是「聊了顏色」。
**違背了哪條 feedback**：feedback_solve_root_not_symptom 的變形——我一開始給的「接天氣進 prompt」是繞開根本（意圖）去補症狀（素材不夠），根因（開場被寫成戰術而非意圖）還在。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第5場 · threads-radar 假中台三連掀——每次都只修一層，三次都是 Adam 追問才往下挖
- 修好「手動解析的貼文找不到」：新增 `manualIngestedAt` 當置頂排序鍵（獨立於 `discoveredAt`），手動解析強制置頂；Adam 貼的 @jc_730 排名 38/112 → 1（v0.29.1.001）
- 加「來源」獨立篩選列（`?src=manual`）——「手動解析」不是任何人設的關鍵字，混在關鍵字列裡按鈕永遠不會出現
- 關鍵字篩選與計數整條下沉 Firestore：`array-contains` 查全庫＋`count()` aggregation 精算，取代「拿最新 100 篇在記憶體篩」（v0.29.2.001）
- 篩選列真相源改成池本身：team doc 新增 `poolKeywords`，worker 寫貼文時同 batch `arrayUnion` 記帳；已停用關鍵字以虛線淡色呈現仍可點（v0.29.3.001）
- 清單底部固定寫「共 N 篇／已載入 M 篇／還有 X 篇更舊的沒顯示」——不靜默截斷
- 建 3 個 Firestore 索引（manualIngestedAt / matchedKeywords×discoveredAt / matchedKeywords×publishedAt），線上 7 個全 READY
- 回填兩筆：既有 2 篇手動解析補 `manualIngestedAt`；team doc 補 12 個 `poolKeywords`
- 盤 D 期觀察閘（今天到期）：health=connected、靜態 IP 在役、最後掃描收 12 篇零錯誤 → 綠燈過閘

### 2026-08-08 第4場 · ④ 記憶002召回下放 v20 已部署待撥測；Gina 團隊覆盤法「開場彈性」設計對談走到意圖層
- #5 ④ 下放 v20 主線：`agent/realtime_agent_v20.py` 的 `_dynamic_recall` 評分軌換 002 雙軌（q2/q4＋RECALL_FLOOR_002=0.68/004=0.5/LEX_RESCUE_FLOOR=0.5＋`_bigram_overlap` lex 救援）——**只換評分軌，注入機制保留 v20 原樣**（`base_instructions+block`＋update_instructions；② 快取凍結是另案，這次純 ④）
- import 補 `_bigram_overlap`（shared firestore_loader.py:105）；`generate_query_embedding_multilingual` v20 早已有（line 170）不需 import；舊 `RECALL_FLOOR` 常數全清、py_compile 過
- backfill 確認：`node scripts/backfill-memories-002.mjs --dry` → 總數=1174 已遷=1174 待遷=0（真 0：腳本確實讀到池，非空跑）——池已全 002 覆蓋，無需補嵌
- 部署：`gcloud builds submit --config=agent/cloudbuild-v20.yaml --substitutions=COMMIT_SHA=v20recall002-6815a97 --async .` → build `5f2acc55` SUCCESS（~7 分）→ 新 revision `ailivex-realtime-agent-v20-00137-dql` 100% serving、無舊 revision 釘流量、minScale 空（電源關）
- 這顆 image 重建自現行 source，已含：召回 002 雙軌＋shared loader 的 002 dual-write＋passthrough＋`_bigram_overlap`
- Gina 團隊覆盤法「開場（第1步暖身）彈性」設計對談：走到「意圖層」——見下方接棒，這是要在新 session 續的活線

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `web/src/lib/actions.ts` | `ingestPostAction` 新寫 `manualIngestedAt`（置頂排序鍵） |
| `web/src/app/page.tsx` | 置頂合併／來源篩選列／`baseQuery` 單一咽喉＋`count()` 精算／`poolKeywords` 聯集＋虛線淡色／底部漏接提示 |
| `worker/index.mjs` | 掃描寫回 batch 內 `arrayUnion` 進 `teams/{id}.poolKeywords`（`手動解析` 排除） |
| `firestore.indexes.json` | 新增 3 個複合索引 |
| `FOUNDATION.md` | 三筆地基帳（v0.29.1/2/3），含實測數字與未驗項 |
| `~/.claude/projects/-Users-adamlin/memory/reference_firestore_vector_search.md` | 加 2c（索引 CREATING 回 0 不報錯）、2d（orderBy 可當免費 exists filter，但必配回填） |

---

## 下一步

1. **下次排程掃描後**查 `teams/default` 的 `poolKeywords` 有沒有長出新字 → 驗 worker 寫入路徑（本場唯一未驗項）。
   指令：`curl -s "https://firestore.googleapis.com/v1/projects/threads-radar-2026/databases/(default)/documents/teams/default" -H "Authorization: Bearer $(gcloud auth print-access-token)"`
   先看 `scan_status/default` 的 `lastScanAt` 有沒有跨到 8/8 之後，有才算跑過。
2. 請 Adam 開一次 https://threads-radar-virid.vercel.app 確認渲染層（重點看篩選列 12 顆 badge、點「行銷」撈到 11 篇、底部漏接提示）。
3. 意圖攤平成 array 欄位（不急，約 2 個月後到期；到期前做才不會又變成「用了才發現」）。

---

## 卡住 / 未解

2026-08-08 第5場：
- **worker 的 `poolKeywords` 寫入路徑未經真實掃描驗證**。一次性回填保證「現況」正確（12 個關鍵字都在帳上），
  但 worker 的 `arrayUnion` 記帳邏輯要等下次排程掃描才會執行。這是本場唯一的「已部署未驗」項。
- **線上 UI 三輪都沒真的看過**。未登入打首頁回 307＝只證明鎖有效，根本沒跑到渲染。
  每個查詢組合我都在資料層打過（漏索引是 500 的唯一實質風險），但渲染層要 Adam 開頁面才算數。
- **意圖篩選仍是記憶體篩**（`intentTags` 是 map 不是 array，Firestore 無法直接 query），
  計數基於已載入那批。到期點有數字：池近 6 天加速到 ~12 篇/天，單一關鍵字破 100 篇約 **2 個月後**，
  屆時意圖計數開始偏低。根治要把意圖攤平成 array 欄位或做分頁。
- 主清單無分頁。某個關鍵字自己破 100 篇時，底部提示只能告訴你「還有 X 篇」，撈不出來。

2026-08-08 第4場：
- **④ 下放尚未撥測驗證**：部署完成但 `軌=002` 的活體證據還沒拿到（召回只在通話中用戶第 3 句後觸發，非撥不可）。電源目前關著。撥測要 Adam 操作（他手上有後台）。
- **v20 code 已部署未提交**：`builds submit .` 上傳的是本機工作樹（未提交也進 image），所以線上已是新版；但 git working tree 的 `agent/realtime_agent_v20.py` 尚未 commit。repo 規矩：**Only commit when explicitly asked**——等 Adam 說、且最好撥測確認 `軌=002` 後再 commit。
- ②⑤ 尚未下放 v20（② cache 凍結要把 v20 的 `_apply_dynamic_blocks`/`_dynamic_recall` 注入改走 `_inject_context`；⑤ 翻 `circuit_breaker=True`）——順序在 ④ 撥測綠燈後
- 兩個 memory 檔仍有重複「驗證+1」行待 dedup：`skill_ailivex_canary_voice_power_sop.md`、`reference_vertex_004_cjk_blind.md`
- 遺留 pid 25884（voice-worker --probe）仍在，非本場

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第5場。*
