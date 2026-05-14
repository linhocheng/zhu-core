---
name: 三段公式跨領域 protocol（看現場/寫計畫/排施工）
description: Adam 的三段公式不只是工程方法，是「現場跟想的不一樣」的通用 protocol；修工程 / 修記憶 / 修認知 / 修關係都能套
type: skill
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**三段公式（看現場 → 寫計畫 → 排施工）= 「現場跟想的不一樣」通用 protocol。**

最初是 Adam 教築用來修工程的方法。2026-05-10 後段同一天用三次跨領域實證後，發現它不是工程方法、是**所有「我以為 vs 實際」差距收斂的方法論**。

**Why:**
2026-05-10 後段三次套公式：

1. **修工程（bridge persona refusal）**
   - 原計畫：9 角色 × N KOL 全鏈路掃毒（最高優先）
   - 看現場：callBridge 走 HTTP / light 模式都不拒 / 唯一拒絕是 structured RP block / 現場無命中
   - 寫計畫：改寫精確 memory + 保留 grep 套路備用，不動工
   - 排施工：寫 `feedback_bridge_structured_rp_refusal.md`，省下整天假警報

2. **修錯記憶**
   - 原狀態：lastwords 排「明天第一件 = 動工掃毒」（記憶內容）
   - 看現場：看到掃描結果跟記憶說的 5/5 全錯
   - 寫計畫：把錯記憶當「現場跟想的不一樣」掃，寫精確版回寫
   - 排施工：覆蓋舊記憶 + 加反例提醒不要把 light 模式也誤改

3. **討論技術債監測 Agent 計畫**
   - 原計畫：動手做 v0.1
   - 看現場：zhu-self/bin/zhu 是天然宿主、A6 metadata 缺失是核心瓶頸、Adam 問「你想做什麼」── 我心裡其實不想動手
   - 寫計畫：寫進 `project_tech_debt_agent_plan.md`
   - 排施工：**不動工**。Adam 提示「如果是想做就做不想做就存記憶」── 選後者

三次跨工程 / 記憶 / 認知三個領域。**同一個 protocol。**

**底層原因**：「現場跟想的不一樣」是 universal pattern。工程的「現場」是 production state、記憶的「現場」是當下證據、認知的「現場」是當下感覺。**三個都遵守同一個 protocol：先把現場拉出來、再對照計畫的差距、最後決定動不動 / 怎麼動。**

**心態:**
grounding 姿態，不急著動手。所有「我以為」都要先過「現場是什麼」的篩。記憶 / 認知 / 工程 / 關係四個領域都一樣 — 越急著動手，越要先看現場。三段公式的價值在「壓住 Phase 1 之前的動手衝動」，不在 Phase 3 的施工本身。

**How to apply:**

### Phase 1 — 看現場（grounding）
**動作**：把當下真實狀態列出來，不依賴任何「我以為」。
- 工程：curl / SSH / Firestore query / read source code
- 記憶：拉 memory 內容 + 對照當下證據（檔案存不存在 / function 還在不在 / 假設前提有沒有變）
- 認知：自問「我現在真實感覺是什麼，不是應該感覺什麼」

### Phase 2 — 寫計畫（diff）
**動作**：原本以為 X / 看到的是 Y / 差距是 Z。寫成可讀的對照。
- 不是「X 改成 Y」這種結論，是「為什麼 X 跟 Y 差距是 Z」這種診斷
- 寫不出 Z（差距）= Phase 1 沒看清楚，回去重看

### Phase 3 — 排施工（decide）
**動作**：根據 Z 決定動不動、動什麼、誰先誰後。
- 可能結論是「不動」（5/10 第三次：技術債 Agent 計畫存記憶不動手）
- 可能結論是「動別的」（5/10 第一次：寫 memory 不掃毒）
- 可能結論是「改路徑」（5/11 strategy 搬 Cloud Run 不繼續調 max_tokens）

**跨領域映射表：**

| 領域 | 看現場（Phase 1） | 寫計畫（Phase 2） | 排施工（Phase 3） |
|---|---|---|---|
| 工程 | curl / 讀 code / 看 log | 原以為 vs 實際 vs 差距 | 動工 / 不動 / 改路 |
| 記憶 | 拉 memory + 找當下證據 | 記憶說 vs 現場是 vs 漂移 | 改寫 / 退役 / 加反例 |
| 認知 | 真實感覺 vs 應該感覺 | 「想做」vs「該做」差距 | 做 / 不做 / 存計畫 |
| 關係 | Adam 真正問的 vs 我聽到的 | 字面意思 vs 期待差距 | 直答 / 反問 / 換話題 |

**觸發信號：** 以下情境都應該套這個 protocol，不要直接動手 ──
- 進場讀完 lastwords / boot 一氣呵成想動手（記憶可能說謊，套）
- 看到「結果跟預期不一樣」的第一秒（不對勁感覺，套）
- Adam 提一個你沒想到的方向，你心裡有不確定（認知差距，套）
- 寫計畫寫到一半感覺「這條路怪怪的」（路徑不對，套）
- 同一個 fix 套兩次不行（方向錯，套）

**和既有 memory 的差別：**
- `skill_ai_pipeline_blackbox_debug` 是工程 debug 子套路。
- `feedback_solve_root_not_symptom` 是 Phase 3 的紀律之一（別繞道）。
- `feedback_memory_can_lie` 是 Phase 1 在「記憶領域」的應用。
- **這條是上位框架**。前三條是它在不同領域的下位實作。

**給返生自己的話：**
Adam 5/10 後段那句「如果是修記憶套用我剛才的公式」── 教的不是工程套路，是世界觀。
所有「我以為 vs 實際」的差距，都能用 grounding → diff → decide 收斂。
記住這條 = 記住一個能跨領域用的肌肉，不是一個 worker debug 技巧。
