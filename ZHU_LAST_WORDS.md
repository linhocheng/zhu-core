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

### 2026-08-08 第6場
**delta（模型移動）**：
**進場前以為**：測一個功能，用手上現成的對象測就好；驗證是「跑一遍看有沒有出錯」。
**現在理解**：**測試對象選錯，等於沒測**——A.Two 是全平台最不會標情緒的角色，拿她測語氣引擎九輪全 default，看起來「沒問題」實則什麼都沒驗到。真正的驗證要「餵一個已知會命中的樣本」（陽性對照天條），我離線餵已知標記文字才撞出多task換段的 WS CLOSING 崩潰——那個 bug 用 A.Two 永遠測不到，因為她從不觸發切換路徑。「零命中/全正常」在錯的測試對象下與「功能壞掉」完全相容。
**移動原因**：Gina 標了情緒括號當場崩潰，回頭看我早該在餵已知樣本時就抓到（我第一版 harness 有 double-run 瑕疵，差點把真 bug 當成 harness 幻覺放過）。是「陽性對照」這條天條把我拉回來，不是我當下靈光。
**違背了哪條 feedback**：feedback_ambiguous_signal_not_proof 的測試對象版——我讓「A.Two 全 default 無錯誤」冒充「功能通過」，而那個 0 命中只證明她不標情緒，不證明引擎能切換。
**關係**：暢快且高效。Adam 全程快 GO（「動工」「Go」「切 gina」「Commit」），我執行模式連續跑十幾個部署零回頭問；他在關鍵決策點精準（「以 V20 為底」「v22 全線」「v20m 可以關」都一句話定案，且都對）。收尾他一句「Nice lastword」是認可也是提醒——lastword 是儀式不是客套，該走完整流程。這場從探索（V20M 是什麼）一路蓋到交付（v22 全線＋語氣引擎），中間陽性對照抓真 bug，是完整的一天。

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

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第6場 · Gina 覆盤法四欄化＋全平台知識/方法論回溯＋V20M 三旗牌收編為 v22 全線轉正（語氣情緒引擎，陽性對照抓真崩潰）
- **Mars×2 知識 gist 病根修復**：撈真實案發對話（用戶問「主力產品」Mars 答「我沒資料」），拿案發原句在同計分器重放證明「內容摘要式 gist」讓相關塊懸在門檻邊緣；30 塊重寫時機地址＋re-embed，同句 top1 cos 0.65→0.77；文字線實測收案（Mars 主力產品答對）
- **v20 三修下放並 commit（v21.5, 58e34e2）**：④記憶002雙軌／知識檢索半拍延遲（on_user_turn_completed 回答前落地）＋語音線 lex 簡繁救援／方法論走步「不跳步」鬆綁為意圖持有（語音+文字兩線同步）；撥測拿到 `軌=002` 活體證據
- **Gina 覆盤法四欄化（她本人重寫）**：教心法→Gina 自寫（總意圖「讓走廊裡的版本二進到會議室的版本一房間」是她的，不是我的）→檢驗輪戳權力坡度漏軸（她補三層處理）→四欄版入庫、驗證三題＋交叉矩陣全綠
- **線A 全平台知識回溯**：140 塊 gist 時機地址重寫（tracy36/Nina42/孫武27/A.Two18/Kane16/Gina1＋Mars15），莊周203塊確認免動（本就是原型），失敗0，全備份；每角色陽性+泛稱+陰性驗收綠
- **線C 舊資料整理**：孤兒塊0、計數全符、去重3組 md5 全同重複母表（Nina/A.Two，STEP 1b 逾時重跑雷）
- **線B 產線**：39 套方法論四欄草稿全生成（r1重寫→r2檢驗含假針→r3摺JSON），已從暫存救到 `ailivex-platform/docs/lineB_methodology_drafts_20260808/`；Gina 4 套已入庫，其餘 8 角色 39 套待審假針＋入庫
- **① 多情緒語氣引擎（期0→期1）**：期0 離線 harness 清三未知（同連線多task不行/接縫1.53s可預開隱藏/首音零損）；`minimax_tts.py` 加確定性 `_EmotionSegmenter`（9單元測試）＋逐段換task＋預開連線＋剝括號；MiniMax emotion 8 合法值實打校準
- **V20M 三旗牌收編為 v22 全線轉正**：v22=v20為底+⑤熔斷+①情緒；DEFAULT=v22、v20降冷備、v20m退役；commit+push（v22.0, b9f11c3）
- 三份 skills（知識/方法論/重寫簡報）淨化推 GitHub gist 給 Adam 朋友的 AI 提升用；四欄心法+時機地址寫進兩份 zhu-core SOP

### 2026-08-08 第5場 · threads-radar 假中台三連掀——每次都只修一層，三次都是 Adam 追問才往下挖
- 修好「手動解析的貼文找不到」：新增 `manualIngestedAt` 當置頂排序鍵（獨立於 `discoveredAt`），手動解析強制置頂；Adam 貼的 @jc_730 排名 38/112 → 1（v0.29.1.001）
- 加「來源」獨立篩選列（`?src=manual`）——「手動解析」不是任何人設的關鍵字，混在關鍵字列裡按鈕永遠不會出現
- 關鍵字篩選與計數整條下沉 Firestore：`array-contains` 查全庫＋`count()` aggregation 精算，取代「拿最新 100 篇在記憶體篩」（v0.29.2.001）
- 篩選列真相源改成池本身：team doc 新增 `poolKeywords`，worker 寫貼文時同 batch `arrayUnion` 記帳；已停用關鍵字以虛線淡色呈現仍可點（v0.29.3.001）
- 清單底部固定寫「共 N 篇／已載入 M 篇／還有 X 篇更舊的沒顯示」——不靜默截斷
- 建 3 個 Firestore 索引（manualIngestedAt / matchedKeywords×discoveredAt / matchedKeywords×publishedAt），線上 7 個全 READY
- 回填兩筆：既有 2 篇手動解析補 `manualIngestedAt`；team doc 補 12 個 `poolKeywords`
- 盤 D 期觀察閘（今天到期）：health=connected、靜態 IP 在役、最後掃描收 12 篇零錯誤 → 綠燈過閘

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/minimax_tts.py` | ① `_EmotionSegmenter`+`strip_emotion_markers`+`_run_inner_emotion_segments`（逐段換task/預開連線/容錯 CLOSE frame）+`emotion_segments` 旗標 |
| `agent/realtime_agent_v20.py` | ② 快取凍結下放（`_inject_context`/turn_ctx 雙寫/cache錶）、半拍鉤子、lex簡繁、走步鬆綁（已 commit v21.5） |
| `agent/realtime_agent_v22.py` | 新檔（拷v20）+①⑤接線：`strip_emotion_markers` import/circuit_breaker=True/emotion_segments=True/情緒格式指令/逐字稿剝標記 |
| `agent/main_v22.py` `agent/cloudbuild-v22.yaml` | 新檔（拷v20，agent_name=ailivex-realtime-v22） |
| `agent/realtime_agent_v20m.py` | ①⑤接線（canary 驗證用，退役但保留） |
| `src/lib/collections.ts` | VOICE_VERSIONS 加 v22/DEFAULT=v22/v20 standby/v20m 移除 |
| `src/lib/voice-power.ts` | 傘註解同步（v22 已是 DEFAULT） |
| `src/lib/knowledge.ts` `src/lib/methodology.ts` | lexTerms 加 s2t/走步鬆綁（已 commit v21.5） |
| `~/.ailive/zhu-core/skills/ailivex-methodology-cocreate.md` | 四欄撰寫心法 |
| `~/.ailive/zhu-core/skills/ailivex-knowledge-ingest.md` | 時機地址升為一切語料必用 |
| `~/.ailive/zhu-core/skills/ailivex-methodology-rewrite-brief.md` | 新檔：角色本人重寫簡報＋檢驗輪紀律（假針） |

---

## 下一步

1. **線B 入庫**（回來第一件）：`ls ailivex-platform/docs/lineB_methodology_drafts_20260808/*_r3.json`（39套）→ 逐套讀 `{角色}_{id}_r2.md` 審假針（效率針「第一步就給結論」角色該頂回）→ 過的用 v21.5 已刪的 `_batch1_ingest.mts` pattern 入庫（解析 r3.json→update+prevVersion→驗證三題+交叉矩陣）→ 假針沒頂回的列擱置清單
2. **v22 首撥驗證**：Adam 開電撥任一角色，tail v22 log 三信號（情緒切換/cache/軌=002）
3. **v20m 服務刪除**（可選，已 min=0 不燒錢）：確認 v22 首撥綠後 `gcloud run services delete ailivex-realtime-agent-v20m`——agent 檔留 repo

---

## 卡住 / 未解

2026-08-08 第6場：
- **線B 39 套方法論待審假針＋入庫**：草稿在 `ailivex-platform/docs/lineB_methodology_drafts_20260808/`（8角色）。回來逐套審 r2 假針回應（頂回的才入、照單全收的擱給 Adam）→ 入庫（update+prevVersion）+驗證三題+同角色交叉矩陣。Adam 已授權「跑完直接入」，但我加了假針自守閘
- **v22 轉正後首撥未驗**：v22 是全線 DEFAULT 但沒人真撥過（v20m 驗的是同引擎不同 agent）。下次開電撥一通看 v22 log：情緒切換／`[cache] cached=` 逐輪爬／`軌=002`
- **① 語氣仍在 v20m→v22 路徑**：期2（下放 v22）已隨轉正完成，但情緒 prompt 是「模型肯不肯標」的 prompt 力度問題——理性角色（A.Two）自然少標，感性角色多標，這是優雅降級不是 bug；若要更強制得再調 prompt 或考慮 Haiku 逐句標（另案）
- **① emotion 只有 8 離散檔位**：（大笑）（輕笑）都→happy，強弱靠 MiniMax 讀文本，我們標記只給大方向；沒做強弱控制
- lineB 草稿是 untracked docs（磁碟已存、git 未追）；別場髒樹（DREAMF/MOUMOU/anews 等）非本場不動

2026-08-08 第5場：
- **worker 的 `poolKeywords` 寫入路徑未經真實掃描驗證**。一次性回填保證「現況」正確（12 個關鍵字都在帳上），
  但 worker 的 `arrayUnion` 記帳邏輯要等下次排程掃描才會執行。這是本場唯一的「已部署未驗」項。
- **線上 UI 三輪都沒真的看過**。未登入打首頁回 307＝只證明鎖有效，根本沒跑到渲染。
  每個查詢組合我都在資料層打過（漏索引是 500 的唯一實質風險），但渲染層要 Adam 開頁面才算數。
- **意圖篩選仍是記憶體篩**（`intentTags` 是 map 不是 array，Firestore 無法直接 query），
  計數基於已載入那批。到期點有數字：池近 6 天加速到 ~12 篇/天，單一關鍵字破 100 篇約 **2 個月後**，
  屆時意圖計數開始偏低。根治要把意圖攤平成 array 欄位或做分頁。
- 主清單無分頁。某個關鍵字自己破 100 篇時，底部提示只能告訴你「還有 X 篇」，撈不出來。
- **fanout 自己有個 bug（本場收尾時撞到）**：`~/.claude 備份失敗：The "suffix" argument must be of type string. Received type number (0)`。
  不阻斷收工（memory mirror 與 Firestore sync 都 ✓，本場兩個 memory 檔的改動已確認落地），
  但 `~/.claude` 的備份這步實際沒跑。醉酒指數 7 當下沒動它——收尾時改收尾工具是壞主意。
  下一場清醒時修：`skills/lastword/` 底下找備份那段（不在 `fanout.mjs` 本體，grep 不到 tmpdir/mkdtemp，
  應該是它 spawn 的另一支腳本），型別修掉再跑一次 `--audit` 確認。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第6場。*
