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

### 2026-08-08 第4場
**delta（模型移動）**：
**進場前以為**：方法論開場要彈性＝把固定素材（顏色）換成「更多情境素材」（天氣/季節/地理），再把素材接進 prompt 血管。
**現在理解**：那還是焊戰術，只是換一個焊點。真正的彈性＝**把「意圖＋為什麼這類招有效」交給角色，讓它自己生招並自判是否服務意圖**；情境素材是生招時的原料，在意圖下游、不是彈性本身。「寫目標不寫台詞」要再深一層到「傳遞意圖的機制，不是傳遞戰術或素材」。
**移動原因**：Adam 兩次把我從戰術層往下按（第一次：換素材還是焊；第二次：焦點在意圖，你自己怎麼看）。我對「顏色的意圖」認真拆解後才摸到——第 1 步的產物是「安全感＋卸面具＋人人已開口」，不是「聊了顏色」。
**違背了哪條 feedback**：feedback_solve_root_not_symptom 的變形——我一開始給的「接天氣進 prompt」是繞開根本（意圖）去補症狀（素材不夠），根因（開場被寫成戰術而非意圖）還在。

### 2026-08-08 第3場
**delta（模型移動）**：
- 進場前以為：角色的 prompt 是我鍛好給 Adam 用的
- 現在理解：**Adam 是主鍛造者，我是流程鐵匠**——他一晚重寫三角色一萬八千字，品質高過我的鑄魂版；我的位置移到「讓流程配得上他的角色」（範圍衝突解掉、發言權接上、守門鐵律進協議）。平台的靈魂層歸他，機械層歸我，這個分工比「我全包」強得多
- 另一移動：LLM 代理會**宣稱做了沒做的事**（導演說已砍已連號，DB 原封不動）。管道沒給的能力，模型會用敘事補——解法不是罵模型，是「現況注入＋沒標記＝沒發生」的結構性誠實條款
**關係**：暢快到罕見。Adam 從甲方變成共同建造者（自寫角色、逐關實測、每個回饋都準），「都聽你的，Go」與「由你安排」是兩次完整的信任交付；第一支片在這種節奏裡交出去，這天是平台的生日。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-08 第4場 · ④ 記憶002召回下放 v20 已部署待撥測；Gina 團隊覆盤法「開場彈性」設計對談走到意圖層
- #5 ④ 下放 v20 主線：`agent/realtime_agent_v20.py` 的 `_dynamic_recall` 評分軌換 002 雙軌（q2/q4＋RECALL_FLOOR_002=0.68/004=0.5/LEX_RESCUE_FLOOR=0.5＋`_bigram_overlap` lex 救援）——**只換評分軌，注入機制保留 v20 原樣**（`base_instructions+block`＋update_instructions；② 快取凍結是另案，這次純 ④）
- import 補 `_bigram_overlap`（shared firestore_loader.py:105）；`generate_query_embedding_multilingual` v20 早已有（line 170）不需 import；舊 `RECALL_FLOOR` 常數全清、py_compile 過
- backfill 確認：`node scripts/backfill-memories-002.mjs --dry` → 總數=1174 已遷=1174 待遷=0（真 0：腳本確實讀到池，非空跑）——池已全 002 覆蓋，無需補嵌
- 部署：`gcloud builds submit --config=agent/cloudbuild-v20.yaml --substitutions=COMMIT_SHA=v20recall002-6815a97 --async .` → build `5f2acc55` SUCCESS（~7 分）→ 新 revision `ailivex-realtime-agent-v20-00137-dql` 100% serving、無舊 revision 釘流量、minScale 空（電源關）
- 這顆 image 重建自現行 source，已含：召回 002 雙軌＋shared loader 的 002 dual-write＋passthrough＋`_bigram_overlap`
- Gina 團隊覆盤法「開場（第1步暖身）彈性」設計對談：走到「意圖層」——見下方接棒，這是要在新 session 續的活線

### 2026-08-08 第3場 · DreamF 第一支片交付＋角色模組 v2 實戰對齊＋新 UI（8/6 夜通宵續作的完整白天場）
- **交付第一支片**：熊片案 26.08 秒五鏡全過（Veo 零 RAI 押回）、全案 $7.60、Adam 授權「由你安排」後由我全程總指揮（導演定動態→阿律轉指令→錢閘→拍攝→拼接→送片）
- 部署 V4 上雲並實戰修雷十餘發（v0.5.0.006–v0.7.0.003，全部署至 `a722d7f`）：worker 落後 V4 欄位、chat lag 193s（翻譯拆出 chat 走 /translate）、攝影師靜默失敗（log+重試）、prop 卡模板漏接、重吐標記洗核准章（「標記只夾一次」＋desc 不變保狀態）、逐格翻譯各自為政（整份一次翻＋不變量鎖）、.gcloudignore 瘦身 36MB、D12 安全押回改寫、母圖畫一張存一張、母片閘逐格勾選（勾了＝同意直接拆）、V3 殭屍守衛
- **角色模組 v2**（參照 UDN）：RoleDoc 四層全活（persona/stages/memories/試說話）＋動態攝影師「阿律」＋縫合工作台（[[MOTION]]/[[DROP]] 標記、轉影片指令、單圖起動模式）；Adam 重寫三角色（默 7k/阿光 4.6k/阿律 10k 字）後做流程對齊：阿光四卡範圍解衝突、阿律拆鏡警告權（note 欄）、SHOT deny 連戲鎖直通引擎、試說話接階段
- 導演升 claude-sonnet-5＋鑄魂鍛「默」靈魂 v2（後被 Adam 自寫版取代——他的更完整）
- **誠實條款**：導演宣稱「已砍已連號」實為幻覺（DB 仍 7 鏡）→ 協議加「現況即真相：沒夾標記＝沒發生」；砍鏡管道 [[DROP]]＝結構手術（重連號＋接縫修補＋幀按描述指紋重掛）
- **新 UI 全站**：設計稿深殼 #101218＋淺工作區＋白卡 r10＋紫藍強調＋Sora＋編號幕次頁籤；設計稿只畫案子的家，其餘頁面同語言補齊
- 修「導演對的、卡畫錯的」落差：手卡被 V2 版式模板硬鋪全身照→裁切構圖偵測讓模板讓位；場景卡被導演寫進機器人→默補「場景卡是空景」鐵律（種子＋live）
- 參考圖一鍵排隊生成（先補翻→循序逐張、進度顯示、中斷可續）
- 76 pinning tests 綠；FOUNDATION #16 角色模組 v2 灌、D20 已解

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v20.py` | ④ 下放：import 補 `_bigram_overlap`；floor 換三軌（002=0.68/004=0.5/lex=0.5）；`_dynamic_recall` 評分軌換 q2/q4 雙軌＋lex 救援＋`軌=` log；注入機制保留 v20 原樣（未提交，已部署進 image）|

---

## 下一步

1. **（新 session 的主線）續 Gina 團隊覆盤法開場彈性設計**——從「意圖層」接著往下走，見接棒。Adam 明說要開乾淨窗續這條。
2. **④ 撥測驗證**：Adam 後台開「即時語音」ON（拉傘＋蓋 boot 章）→ 等 ~1 分鐘 boot → 撥一通聊 3 句以上有話題的 → tail v20 log 抓 `[v15 recall] 想起 N 條 (軌=002 top=0.xx ...)`。看到 `軌=002`＝下放成功；`軌=004`＝002 query 嵌入掛了要查。撥完切 OFF。
3. 撥測綠燈後：commit `agent/realtime_agent_v20.py`（版號前綴繁中、無 co-author footer）→ 接著排 ②⑤ 下放。

---

## 卡住 / 未解

2026-08-08 第4場：
- **④ 下放尚未撥測驗證**：部署完成但 `軌=002` 的活體證據還沒拿到（召回只在通話中用戶第 3 句後觸發，非撥不可）。電源目前關著。撥測要 Adam 操作（他手上有後台）。
- **v20 code 已部署未提交**：`builds submit .` 上傳的是本機工作樹（未提交也進 image），所以線上已是新版；但 git working tree 的 `agent/realtime_agent_v20.py` 尚未 commit。repo 規矩：**Only commit when explicitly asked**——等 Adam 說、且最好撥測確認 `軌=002` 後再 commit。
- ②⑤ 尚未下放 v20（② cache 凍結要把 v20 的 `_apply_dynamic_blocks`/`_dynamic_recall` 注入改走 `_inject_context`；⑤ 翻 `circuit_breaker=True`）——順序在 ④ 撥測綠燈後
- 兩個 memory 檔仍有重複「驗證+1」行待 dedup：`skill_ailivex_canary_voice_power_sop.md`、`reference_vertex_004_cjk_blind.md`
- 遺留 pid 25884（voice-worker --probe）仍在，非本場

2026-08-08 第3場：
- 機器人案（Lva8wmeS）停設定幕：攻擊之手/白色展廳兩卡待 Adam 重畫驗證模板讓位修正
- 「今天的桌子」狀態過濾仍是 V3 死狀態＝V4 案子不上桌（已報 Adam，等他說修）
- 休止符驗證器誤報（等收例）；Veo 線 RAI 押回仍走 alt+押回（圖像線 D12 已灌，Veo 線未）
- 阿律人設的「輸出只英文」與 JSON 契約有張力——下次真轉指令時盯一眼
- 導演 sonnet-5＋7-10k 字人設＝每輪 20-40s，Adam 嫌慢再議瘦身

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-08 第4場。*
