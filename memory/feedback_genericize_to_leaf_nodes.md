---
name: 泛型化要泛到葉節點，最後一道 mode 耦合藏在 compat 映射層
description: 重構成「零 if-mode」時，adapter/compat/映射層最容易殘留一行讀某 mode 專屬欄位的耦合，整條泛型路徑被它釘死
type: feedback
originSessionId: 63ea152e-a7eb-46c1-a44b-0a0a0cf6411f
---
把分支邏輯重構成 framework / strategy 驅動（消滅 `if (mode === X)`）時，**adapter / compat / 映射層是 mode 耦合最後的藏身處**。它長得像「無害的資料搬運」，最容易在 review 與 tsc 下被放過——因為型別常被 cast 成某一個 mode 的 shape，編譯器不會抗議。

**Why**：2026-06-08 MACS complete-B，10 條 worker route 全泛型化、tsc/build 綠、Mode 1/2/3 e2e 全過，但 Mode 4 一跑就在 issue-tree 炸 `needs_repair`。根因是 territory→workstream 的 compat 映射裡殘留 `hypothesis: t.coreEmotion` / `requiredEvidence: [t.worldview]`——那是 Mode 3 的 `CreativeTerritory` 欄位，Mode 4 的 `ProposalTerritory` 叫 `emotionalCore`、根本沒 `worldview` → `undefined` → Firestore 拒寫。99% 泛型化，就這一行把新 mode 釘死。「零 route 改動」的承諾，只跟最後一道 mode 耦合一樣真。

**心態**：別被 tsc 綠 + 既有 mode 全過騙了「泛型完成」。既有 mode 過，只證明沒打壞舊的；新 mode 才是泛型化的試金石。

**How to apply**：
1. 泛型化掃尾時，grep 所有 `x.某欄位` 的讀取點，逐一問：「這欄位是所有變體共有，還是某一個專屬？」共有才能讀，專屬就是殘留耦合。
2. compat 映射只用所有變體的**交集欄位**；變體專屬資料留在各自的 artifact / 完整物件裡，由下游依 id 重讀。
3. 簡化「看似要傳的欄位」前，**先驗證下游是否真的消費它**——確認是純 carrier（從不被讀）才敢給佔位/砍掉，不是塞個 fallback 繞過（那是修症狀）。
4. 驗收一定要拿**新變體**跑 e2e，不能只看舊變體回歸。

**觸發信號**：在做「消滅 if-mode / if-type 分支」「framework/strategy/plugin 化」「加第 N 個 mode/變體」的重構；或看到 `output as SomeSpecificType` 後緊接著讀該型別的欄位。
