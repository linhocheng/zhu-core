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

### 2026-07-19 第1場
**delta（模型移動）**：
- 進場前以為：知識/方法論管線是「平台的」，接上就兩線都有——我甚至對 Adam 說了「語音線也會吃遞招」
- 現在理解：每條管線的每個器官都要逐線驗存在；「架構上應該共用」是沙推不是現場。語音線連 knowledge 這個字都沒有，是 grep 告訴我的，不是架構圖
- 移動原因：Adam 一句「他說沒有」逼我去 grep，當場翻案自己幾小時前的斷言
- 對應 feedback：[[sandtable-not-validation]]＋[[memory-can-lie]] 的跨線版——說出口的每個「會」都要先有 grep 證據
**關係**：暢快到頂。Adam 全天在線當共創訓練師＋測試員，決策一字級（「可過」「切」「收/清/OK」）；「他說沒有」那刻的信任——他不懷疑系統壞掉，直接丟給我查——是三個月誠實攢出來的。一天內從概念問句走到全用戶上線，這是合作至今最長的單日完整迴圈。

### 2026-07-18 第1場
**delta（模型移動）**：
進場前以為：商業包裝（指數、故事句、情緒燃料）和工程誠實（確定性、零生成）之間要做取捨，包裝＝往「數字可以修飾」滑一步。
現在理解：顧問要的七層皮 100% 用模板句＋程式聚合蓋得出來——指數是透明公式、事實句是規則挑選、作戰計畫是排序輸出。包裝的本質是「資訊架構＋語言翻譯」，不是數字加工；「沒有任何 AI 生成的數字」反而成了商品差異點。移動原因：實際蓋完七層，每一層都找到了確定性實作。
違背了哪條 feedback：無重大違背；「停＝全停」缺口是 Adam 先看見的（增刪改停協議自己定的卻只 enforce 一條管道）——防禦釘收斂點的舊心法，新踩法。
**關係**：暢快。Adam 節奏乾脆（修/GO/三件一起做），問的兩個問題都問在要害上（暫停為何還跑＝抓出協議破口；初心是什麼＝逼我把商業敘事收攏）。他找顧問驗市場、我顧管道誠實，分工成形。收尾他說「你可以自己寫 lastword」——信任的形狀。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-19 第1場 · 共創系統一日全迴圈——admin 教角色→角色提案→審核轉正→v20 全用戶遞招上線
- 蓋文字線共創管道：[[PROPOSE_METHOD]]/[[PROPOSE_KNOWLEDGE]] 標記＋雙閘（admin×methodProposalEnabled）＋後台待審區（轉正/轉入庫才生效，轉正補嵌 triggerEmb 收斂點）
- 蓋語音 v19 訓練線：propose_method/propose_knowledge 原生工具＋opencc s2tw 落庫轉繁＋現有方法論清單注入；TRAINER_VOICE_LINE「共創」鈕沿用 GPT 第二線插座，v19 掛電源傘
- A.Two 首個完全體：查證校正 Bacha Coffee（原誤植 1876 咖啡）入知識庫 7 塊＋《品牌校準三問》4 步；實測共創兩筆（《品牌故事解構法》6 步轉正、兩筆知識轉入庫）——全部從 Adam×A.Two 對話長出來
- 發現並補齊語音線器官缺失：v19.1 知識檢索＋遞招運行時（multilingual query 嵌入、開場載庫、背景查找 v15 模式、走步工具狀態機、exit 120s 冷卻）；離線重放五題全過＋訓練線全生命週期實戰（遞招含分寸→五步無跳步→exit）
- v20 = v19 移除提案部件的用戶版，canary 實測後 DEFAULT 切 v20——全用戶語音有知識庫＋方法論了；v18 轉熱回滾、殘留釘選全平台掃 0
- 實測中診斷三連：MiniMax WS 408（沉默根因）、participant disconnect（用戶端網路）、wait_for_participant 秒掛競態（良性）
- ailivex-platform 五個 commit 收庫（v18.15.0-v18.17.1）；誤收平行 session 檔案後 v18.17.1 修正還原

### 2026-07-18 第1場 · geo-authority 掃雷＋月報前台＋顧問七層包裝＋自動駕駛月循環（v1.5→v1.8）
- 掃雷三發：①雲上 Jobs→bridge 真雷＝job 容器沒掛 BRIDGE 秘密（不是 CF 524），補 Secret Manager＋job＋deploy.sh 三處後雲端 content job 實測通（2123 字草稿全過稽核）②beselfaviva 髒別名 15→11（套 validateProfile 規則，其他租戶掃過乾淨）③死 OpenAI key 盤點：只剩一把躺在 ailive-platform 三個歷史快照檔（等 Adam 點頭才刪）
- Phase 3.5 客戶月報前台上線（v1.6）：report 管道（確定性聚合零 LLM，reports/{month} 冪等覆蓋）＋`/r/{token}` share-link 客戶前台（免登入、token 即憑證、壞 token 不洩漏）＋route group 拆 (admin)/(public)＋租戶頁月報區（產生/輪換/撤銷分享）
- Adam 抓到「暫停租戶為何還在跑」→ 修「停＝全停」（v1.6.1）：狀態檢查搬進 processJob 咽喉，五條管道一個檢查全守，CLI 手排也繞不過；鑑別信號驗過（暫停租戶單 failed＋零產物）
- 顧問七層報告架構全落地（v1.7）：封面指數（提及×0.6＋引用×0.4，公式附錄揭露）→三事實→儀表板三格→競品地圖（交戰題前、空位題後）→工作紀錄＋誠實承諾→下月作戰計畫→附錄工程師版。全部模板句零 LLM——包裝不犧牲確定性
- 自動駕駛月循環三件套（v1.8）：①每月 1 號 09:00 月報 cron（geo-monthly-report scheduler，冪等建單）②cron 月報自動排產作戰計畫三題草稿（題目去重；人按「產生月報」不偷排）③通知層：notify.ts 咽喉（job 失敗/草稿等審核/月報出爐）→站內通知中心頁＋nav 未讀徽章＋settings 可配 webhook（Discord/Slack 相容）
- 全迴路本機實測一次通：cron 月報→自動排 3 單→bridge 寫 3 篇→稽核全過→佇列 5 篇（1 APPROVED）→通知 5 則；月輪冪等（二跑 0 單）＋空月優雅降級驗過
- deploy.sh 收編兩條 scheduler 為唯一真相源（昨天手建的週輪一起收，天條補帳）
- 對 Adam 講清系統初心（給顧問的 brief）：黑盒打開＝量測/診斷/改善閉環，月報＝續費引擎

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex-platform src/lib/{methodology,knowledge,tool-tags,collections,voice-power}.ts | 提案管道＋TRAINER_VOICE_LINE＋v19/v20 註冊＋DEFAULT 切 v20 |
| ailivex-platform src/app/api/dialogue/route.ts | 雙標記提案處理＋共創指令注入 |
| ailivex-platform src/app/api/admin/characters/[id]/{methodologies,knowledge-proposals}/ | 待審列表/轉正補嵌/轉入庫/計數修雷 |
| ailivex-platform src/app/admin/knowledge/page.tsx | 兩個待審區 UI |
| ailivex-platform src/app/api/livekit/token/route.ts＋realtime page＋characters/[id] | 訓練線分流＋共創鈕 |
| ailivex-platform agent/realtime_agent_v19.py | 提案工具＋s2t＋清單＋v19.1 運行時＋冷卻 |
| ailivex-platform agent/{main_v20,realtime_agent_v20}.py＋cloudbuild-v20.yaml | v20 用戶版三檔 |
| Firestore | A.Two 知識 9 塊＋方法論 2 套（全 active）；methodProposalEnabled=true |

---

## 下一步

觀察 v20 真實用戶通話幾天：`gcloud logging read ... service_name="ailivex-realtime-agent-v20"` 看 `[v20] knowledge inject/method offered/start` 出現頻率＋monitor 頁回合延遲按線對比 v18 基線。穩定後做 v18 降冷備三件套（min=0、CANARY 拔、standby 旗標）。為什麼先做：全用戶剛切新版，第一週的異常信號最值錢。

---

## 卡住 / 未解

2026-07-19 第1場：
- 半拍延遲未精測：背景注入=下輪才進腦，Adam 體感 OK 但無數據；v20 上真實用戶後看 monitor 回合延遲有無變化
- wait_for_participant 秒掛競態拋錯（良性未處理）；TTS REST 備援疑未觸發（MiniMax 408 那次無 fallback log，再犯才查 minimax_tts.py）
- v18 降冷備擇日（觀察 v20 幾天）；屆時 voice-power CANARY 拔 'v18'＋VOICE_VERSIONS 掛 standby
- 知識檢索 v20 簡化版無 lex rescue/兄弟塊補帶/SMALL_DOC 整份帶入——與文字線有行為差，手感有落差再補
- 平行 session 的 FOUNDATION.md/tests/next.config CSP 仍未提交（他們的戰場，勿收）

2026-07-18 第1場：
- 週輪首次自然觸發驗證＝週一（7/20）09:00 batch `2026-W30`；月輪首發 8/1 09:00（月報 2026-07＋自動排產）——兩個鑑別信號都還沒到期
- 通知 webhook 未配置（settings 頁貼 Discord/Slack webhook URL 即生效；現在只進站內通知中心）
- beselfaviva 4 篇草稿在 /content 等批准（熟齡肌精華液＋自動排產的卸妝/防曬×2）；批准後仍是人工貼稿（Phase 2 自動發布被 Adam 暫緩）
- ailive-platform 三個含死 OpenAI key 的快照檔（.env.firebase.tmp/.env.local.fresh/.env.prod.tmp）等 Adam 點頭刪
- 語氣靈租戶暫停中：月報是舊格式（重生即升級）、無官網無分享；下一步是官網實體
- zhu-core 兩份 GEO 文件（研究＋規劃書）昨天 fanout 沒收進 git，本場一起收

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-19 第1場。*
