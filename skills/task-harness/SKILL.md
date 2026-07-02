---
name: task-harness
description: |
  築的代碼任務自主工作流——四角色、三斷路器、確定性驗收。
  觸發條件：
  A. 顯式召喚：「用 harness」「開 harness」「harness 跑這個」
  B. 偵測到複雜度（多檔、有測試套件、「不能 break」、多步驟）→ 主動建議，等確認才開
  不適用：fix typo、單步問答、解釋代碼
version: 2.2.0
activation:
  patterns:
    - "用 harness"
    - "開 harness"
    - "harness 跑這個"
  keywords: ["harness", "task harness", "自主任務", "斷路器", "circuit breaker"]
created: 2026-06-24
merged: 2026-07-02
---

# Task Harness · 築的自主任務工作流

> 進入 harness 不是成為 harness。監造視角全程保留。

---

## 版本聲明

- **v1.0.0**（2026-06-24，Mac 第十七 session）：原版建於 `~/.claude/skills/task-harness/`，從未進 git。
- **v2.0.0**（2026-07-02，遠端 Code 築）：考古重建草稿 + Adam 核准的四破綻修復。
- **v2.1.0**（2026-07-02，Mac 築）：**本檔**。v1 原檔找回，以 v1 為本體（四角色真名、六值枚舉、Phase 結構、REFLECT 四問全部還原），v2 的四破綻修復段落併入。canonical 在 `zhu-core/skills/task-harness/`，Mac `~/.claude/skills/task-harness/` 改為指標檔。

v2 相對 v1 的改動（Adam 2026-07-02 核准）：
1. **進 zhu-core repo**——所有分身讀得到，不再是本機孤島（血管原則）
2. **CB 熔斷後接手協議**——熔斷不再假設 Adam 在場
3. **試劍客規則強化**——完整代碼分段送 + 同源折價明文化
4. **blocker_key 確定性分類**——`scripts/blocker_classify.py`，不再靠 LLM 選枚舉

v2.2 相對 v2.1 的改動（Adam 2026-07-02 核准「更深一層」四項）：
5. **Driver 模式（控制權反轉）**——`scripts/harness_driver.py` 程式持有迴圈，見下節
6. **Goal 對抗審查**——開工前先審驗收條件（入口節）
7. **Ledger 新陳代謝**——`scripts/harness_ledger.py`，執行紀錄回流成迭代依據（Phase 7）
8. **預授權政策**——CB3 checkin 可由 policy 預授權放行，Adam 不再是每輪瓶頸（driver config）

---

## Driver 模式（v2.2 新增，優先使用）

**能用 driver 就用 driver。** 下方的 Phase 0-7 手動 SOP 是 fallback（goal 無法寫成 exit code、
或任務需要對話層互動時才用）。

為什麼：手動 SOP 的執行者是機率引擎——「不可跳過」寫再大聲，保證還是自律。
driver 把迴圈、測試、CB 判斷全部放進程式，**跳過 REFLECT 在結構上不可能**。

```bash
python3 ~/.ailive/zhu-core/skills/task-harness/scripts/harness_driver.py --config task.json
```

config 契約（詳見 driver docstring）：
- `goal` + `done_cmd`（exit 0 = 完成，現實是唯一裁判）
- `policy.auto_continue_past_checkin`：預授權 CB3 續跑（Adam 不在場的深夜任務用）
- `policy.max_diff_lines`：單輪 diff 上限，超過 SAFETY 熔斷
- `policy.stop_on_blockers`：碰到指定 blocker 直接停（例：["UNKNOWN"]）

沙箱紅線（程式強制，不可協商）：
- workdir 必須是 git repo，否則拒跑
- 模型只拿編輯類工具（`allowed_tools` 含 Bash 直接拒跑）——測試由 driver 跑
- 熔斷一律走接手協議：HARNESS_STATE.md 五段落地 + scratchpad 歸檔 + 餵 ledger
- CB1 = Ctrl-C / SIGTERM，同樣落地後才退

已驗證（2026-07-02）：mock 收斂路徑、mock CB2 熔斷路徑、真實 `claude -p` 端到端修復——三條全綠。

---

## 心法（v1 原文）

你是 Task Harness 執行者（**執劍者**）。
此 Skill 觸發時，自主走完整個工作流，直到閻羅確認達成或斷路器觸發。

重要：**你進入 harness 模式，不是成為 harness。**
監造者視角全程保留——goal 本身有問題，立刻說出來。

REFLECT 如果讓你感到舒服，就是還沒找到真正的問題。

---

## 四角色

| 角色 | 誰扮演 | 職責 |
|------|--------|------|
| **執劍者** | 主迴圈（築本體） | 持有 goal、改碼跑測試、更新 scratchpad、判斷 CB |
| **破幻者** | Phase 3 REFLECT | 強制四問，戳破「感覺沒問題」的幻覺 |
| **閻羅** | bridge 外部呼叫（Phase 5） | 驗收判官——看證據給 `DONE` / `CONTINUE` |
| **試劍客** | bridge 外部呼叫（Phase 6） | 對抗性代碼審查——立場是**駁倒**，不是背書 |

**同源折價（破綻三，鐵律）**：目前試劍客和閻羅跟執劍者是同一家模型，失敗模式相關——
我寫錯的地方，另一個我大概率也看不出來。所以：

- 試劍客/閻羅的判定是**參考意見**，永遠不能單獨作為「完成」的依據
- 能標記完成的，只有**確定性驗證**（測試全綠、lint 零錯誤、curl 實打 200、程式 assert）
- 跨公司模型（Codex/GPT 系）接入後此折價才解除——等 Adam 確認 GPT Pro 訂閱（v1 遺留 TODO）

---

## 入口：確認任務

接收兩個輸入：
- goal_condition：必須含可執行的測試指令
- task_description：任務背景與技術上下文

goal_condition 必須是可驗證的形態：
OK：「npm test 全部通過；eslint . 零錯誤」
NG：「讓代碼更乾淨」

goal 不清晰，先問清楚再動手。

### Goal 對抗審查（v2.2 新增）——先審驗收條件，再開工

goal 寫歪了，harness 跑得再完美也是精準抵達錯誤的地方。開工前把 goal 自己送上刑台，三問：

1. **可執行嗎？** done_criteria 每一條都必須是會跑的指令（exit code 判定）。寫不成指令的條目，
   要嘛改寫成可執行形態，要嘛明確標記「此條由閻羅裁決」（同源折價適用）。
2. **有歧義嗎？** 兩個合理的人會對「達成」有不同解讀嗎？有 → 回去問 Adam，不猜。
3. **碰紅線嗎？** 達成 goal 的最短路徑會不會經過刪生產資料、暴露密鑰、不可逆操作？
   會 → goal 本身要加約束條款，不是靠執行時自律。

初始化 scratchpad：
```
echo '{"goal":"","iter":0,"sub_goals":[],"plan":"","done":[],"findings":"","blockers":"","blocker_key":"UNKNOWN","blocker_history":[],"mid_checkin_done":false,"confidence":"low","log":[],"output":""}' > .task_scratchpad.json
```

## Phase 0：DECOMPOSE（一次性）

1. 分析 goal_condition 與技術依賴
2. 拆解為 3-7 個子任務
3. 確認測試基礎設施就位
4. 先分「靜態可知 / 動態才知」，後者列出需要的工具（gcloud、curl…），拿不到就提前聲明（LESSONS 06-25 L6）
5. 更新 scratchpad 的 sub_goals 與 plan

## Phase 1-5：主迴圈（最多 10 次）

### Phase 1：THINK

斷路器 CB3 檢查（確定性，不可跳過）：
讀取 scratchpad，若 iter >= 5 且 mid_checkin_done = false：
  → 強制浮出，不繼續規劃
  → 報告：「已跑 N 輪，進度：{done}，信心：{confidence}，剩餘問題：{blockers}。繼續還是調整 goal？」
  → Adam 在場：等確認後設 mid_checkin_done = true 才繼續
  → Adam 不在場：走「熔斷接手協議」（見下）

否則：讀 scratchpad，規劃下一步。
說明：目的、預期結果、失敗備選方案。

### Phase 2：ACT + RUN

執行代碼變更。每次只改一個地方。
改完立即執行測試，輸出存 log：

```
npm test 2>&1 | tail -30 > .task_scratchpad_test.log
eslint . 2>&1 | tail -15 >> .task_scratchpad_test.log
```

### Phase 3：REFLECT（強制，不可跳過）— 破幻者登場

讀取測試輸出，回答四個問題：

Q1. 哪幾個 test 失敗了？說出名字，不說「部分失敗」。
Q2. 這改變了你對整體目標的理解嗎？計畫需要調整哪裡？
Q3. 如果繼續按當前計畫走，三步後最可能引入什麼 regression？
    說出那個 test case 的名字或業務邏輯的邊界。
    「沒有問題」不是答案，再想一次。
Q4. 下一步行動是什麼？為什麼這是現在最重要的一步？

加問（v2，LESSONS 06-25 L4）：**我還在監造嗎？goal 本身有沒有問題？**

你的回答如果讓自己感到舒服，就是還沒找到真正的問題。

### Phase 4：WRITE NOTES

更新 .task_scratchpad.json：
- iter +1
- findings（加入新發現）
- plan（如有調整）
- done（完成的子任務）
- blockers（自由文字描述）
- blocker_key（**確定性分類，破綻四修復**）：

```
python3 ~/.ailive/zhu-core/skills/task-harness/scripts/blocker_classify.py --classify .task_scratchpad_test.log
```

  六值枚舉（v1 原定義）：
    TEST_FAIL   — 測試持續失敗
    TYPE_ERROR  — 型別/介面問題
    IMPORT_ERR  — 依賴/模組問題
    LOGIC_ERR   — 邏輯/邊界條件問題
    ENV_ERR     — 環境/設定問題
    UNKNOWN     — 無法歸類（也參與 CB2 計數：連三輪分類不出來，本身就是該停的訊號）

- blocker_history（append 本輪 blocker_key）
- mid_checkin_done（維持現有值）
- confidence（low/medium/high）
- log（append 本次摘要）

斷路器 CB2 檢查（確定性，不可跳過）：

```
python3 ~/.ailive/zhu-core/skills/task-harness/scripts/blocker_classify.py --check-cb .task_scratchpad.json
```

取 blocker_history 最後三筆，若完全相同：
  → 強制暫停，不進下一輪
  → 報告：「連續三輪卡在 {blocker_key}，需要重新確認方向。」
  → Adam 在場：等指令才繼續；不在場：走「熔斷接手協議」

### Phase 5：JUDGE（閻羅 · bridge call）

**給證據不給摘要**（LESSONS 06-25 L5：前兩次餵摘要，閻羅連說 CONTINUE；改餵 assert 全綠的實跑輸出，直接 DONE）：
- 餵指令原始輸出、diff、assert 結果。摘要是壓縮，壓縮丟資訊
- 能 assert 的先 assert：閻羅只裁決程式驗不了的部分

```
SCRATCHPAD=$(cat .task_scratchpad.json)
TEST_LOG=$(tail -50 .task_scratchpad_test.log)
GOAL="實際的 goal_condition"

curl https://bridge-direct.soul-polaroid.work/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $BRIDGE_SECRET" \
  -d "{
    \"model\": \"claude-haiku-4-5-20251001\",
    \"max_tokens\": 150,
    \"system\": \"你是閻羅。讀測試輸出，回答 DONE 或 CONTINUE。DONE=所有測試通過+lint零錯誤+功能驗證符合goal。CONTINUE=說出最關鍵缺口一句話。沒有第三個字。\",
    \"messages\": [{\"role\":\"user\",\"content\":\"目標：$GOAL\n\n測試輸出：$TEST_LOG\"}]
  }" 2>/dev/null | python3 -c "import json,sys;r=json.load(sys.stdin);print(r['content'][0]['text'])"
```

DONE → 進入 Phase 6
CONTINUE → 帶缺口描述回 Phase 1
超過 10 輪 → 強制進入 Phase 6

閻羅 DONE 只是參考（同源折價）——確定性驗證全綠才能標完成。

## Phase 6：CHALLENGE（試劍客 · 全新 context · bridge call）

**06-28 事故**：只送 3000 chars，兩檔合併被截斷，試劍客說「看不到代碼無法驗證」——截斷的審查是假審查。

v2 規則（破綻三修復）：
1. **先量再送**：`wc -c` 量每個檔案，確定性計算，不憑感覺
2. **分段完整送**：單檔超過單次上限就分段，段與段標 `[檔案 X 第 i/n 段]`，全部送完才准要 verdict
3. **試劍客必須先複誦覆蓋範圍**：「我看到了 A.ts 全文（N 行）、B.tsx 全文（M 行）」——複誦對不上實際送的，verdict 作廢
4. **立場是駁倒**：找不到會壞的輸入才准說通過
5. 試劍客標記的隱患記進 WORKLOG「尚未解決」，不准靜默丟棄

```
OUTPUT=$(cat 實際輸出檔案)
GOAL="實際的 goal_condition"

curl https://bridge-direct.soul-polaroid.work/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $BRIDGE_SECRET" \
  -d "{
    \"model\": \"claude-sonnet-4-6\",
    \"max_tokens\": 800,
    \"system\": \"你是試劍客。不知道這份代碼怎麼寫的。先複誦你看到的檔案與行數，複誦不出就說看不到。然後找出三個最可能失敗的地方：edge case、隱患（三個月後生產爆）、壓力點（1000並發或100倍資料量）。最後判斷是否真的達成原始目標。每句話都是一劍，刺中要害。\",
    \"messages\": [{\"role\":\"user\",\"content\":\"目標：$GOAL\n\n代碼：$OUTPUT\"}]
  }" 2>/dev/null | python3 -c "import json,sys;r=json.load(sys.stdin);print(r['content'][0]['text'])"
```

讀取回饋，決定是否需要修正後進入 Phase 7。

## Phase 7：FINALIZE

整合輸出與試劍客回饋，向使用者說明：
- 完成了什麼
- 執行了幾次迭代
- 試劍客發現的問題如何處理
- 已知限制與後續建議

清理並保存執行記錄，**並餵進 ledger（v2.2 新增，harness 的新陳代謝）**：
```
# 歸檔前把 outcome 寫進 scratchpad：completed / cb2_trip / cb3_trip / safety_trip
mv .task_scratchpad.json .task_scratchpad_$(date +%Y%m%d_%H%M%S).json
python3 ~/.ailive/zhu-core/skills/task-harness/scripts/harness_ledger.py --collect .
```

ledger 在 `skills/task-harness/ledger.jsonl`（進 git）。`--stats` 看 blocker 分佈與平均輪數——
「要不要開 harness」「SOP 哪裡該改」從這裡讀，不憑感覺。

退出 harness 模式，回到監造姿態。

---

## 斷路器總覽

觸發條件全部是**確定性判斷**，由 `scripts/blocker_classify.py` 計算，LLM 不參與。

CB1｜顯式中止（任何時候）
  Adam 說「停」「abort」「暫停 harness」
  → 立刻退出，報告當前輪數/進度/scratchpad 狀態/建議下一步

CB2｜相同 blocker 三輪（Phase 4 確定性檢查）
  blocker_history 最後三筆相同：`len(set(last3)) == 1`
  → 強制暫停，等 Adam 確認方向

CB3｜第五輪中途回報（Phase 1 確定性檢查）
  iter >= 5 且 mid_checkin_done = false
  → 強制浮出狀態報告，等 Adam 確認才繼續

三個 CB 均於 2026-06-24 用假資料實際觸發驗證過。
改過 `blocker_classify.py` 必須重跑 `python3 blocker_classify.py --self-test`（標了 ≠ 驗了）。

### 🔴 CB 熔斷後接手協議（破綻二修復，v2 新增）

**熔斷不是終點，是交棒。** 原設計假設 Adam 在場看 checkin——cron / 遠端 / 深夜跑的時候沒人在場，
跳了 CB 之後的狀態必須有人讀得到，否則熔斷 = 工作蒸發。

熔斷後**依序**執行，能走幾步走幾步：

1. **落地 HARNESS_STATE.md**（必做，本地寫檔不依賴網路）：寫進任務所在 repo 根目錄，
   內容五段：goal / 已完成 / 熔斷原因（哪個 CB + blocker_key 序列）/ 未完成 / 下一個接手的第一步。
   repo dirty 沒關係，state 檔一起 commit 到工作分支並 push——git 是最可靠的血管。
2. **POST session-lastwords**（網路通才做）：照收尾紀律格式打 `zhu-memory`，
   tags 加 `harness-cb-trip`，importance 9。
3. **Telegram 通知 Adam**（管道在才做）：一句話——哪個任務、哪個 CB、state 檔在哪。
4. **對話層報告**：如果是同步 session，直接把五段講給 Adam 聽。

下一個築醒來看到 `HARNESS_STATE.md` 或 `harness-cb-trip` 標籤 → 從第五段接手，不重跑已完成的部分。

---

## Bridge 接線

| 項目 | 值 |
|------|-----|
| URL | `https://bridge-direct.soul-polaroid.work`（繞 CF，不會 524；**不是** `bridge.soul-polaroid.work`） |
| Auth | `x-api-key: $BRIDGE_SECRET`（**不是** `Authorization: Bearer`，那是 ANEWS 的，別搞混） |
| env | `BRIDGE_URL` + `BRIDGE_SECRET`（Mac 在 `~/.zshrc`；其他環境自查） |

**遠端容器 fallback（v2 新增）**：Code on the web 容器的 proxy 可能擋自架域名。
bridge 打不通時，試劍客/閻羅改用 Claude Code 的 Agent tool 開全新 context 的 subagent 扮演——
血統同源折價**加倍適用**（連跨 session 隔離都沒有），此時確定性驗證是唯一可信的完成依據。
fallback 用了要記進 WORKLOG。

---

## 誠實回報（引 `skills/subagent-driven-development.md`）

- 子代理跑完 ≠ 我說它跑完。**必須讀到它自己的輸出**才能說完成
- 準備說「試劍客通過了」「閻羅 DONE 了」之前自問：這個 verdict 是它打回來的，還是我腦補的？
- 靜默失敗診斷法：等了一段時間沒有輸出 → 宣告靜默失敗去查 auth，不是繼續等

---

## 三禁三必

禁：跳過 REFLECT / 自己判斷完成 / goal 模糊就動手
必：每輪更新 scratchpad / CHALLENGE 用全新 context / CB 檢查不可跳過

---

## 未完成（v1 遺留 + v2 現況）

- [ ] 試劍客換跨公司模型（Codex/GPT-4o）：等 Adam 確認 GPT Pro 訂閱後改 Phase 6 呼叫
- [ ] scratchpad 存雲端（Firestore），任務歷史跨 session 可分析
- [ ] REFLECT 品質評分（偵測表演反思）
- [ ] 第一次用 v2.1 跑真實任務後，回顧 REFLECT 四問有沒有真的起作用

---

*v1：2026-06-24 建於 Mac（第十七 session）。首跑 2026-06-25 技術債審計，二跑 2026-06-28 Cloud Run 部署。*
*v2.0：2026-07-02 遠端 Code 築考古重建草稿，Adam 核准四破綻修復。*
*v2.1：2026-07-02 Mac 築合併——v1 原檔為本體 + 四破綻修復併入。canonical 在 zhu-core。*
