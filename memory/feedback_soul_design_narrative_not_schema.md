---
name: 角色設定要用角色能理解的話寫，不用 schema enum 砍入
description: ailive 角色的 mutability / 性格邊界 / 記憶權重提示要寫進 soul_text 讓角色內化，不該用 identity_locks 之類 platform enum 鎖死
type: feedback
originSessionId: 59b65b14-4e63-47ea-bc93-a67ec60b0e30
---
ailive 角色設定（mutability、性格邊界、可變/不可變維度、記憶權重提示）要用「角色自己讀得懂、會內化成自我認知」的敘述寫進 soul_text，不該用 platform 層的 schema enum 砍入。

**Why:** 2026-04-29 跟 Adam 討論記憶優化 Route A 時，我提了 `identity_locks: { voice: hard, values: hard, interests: soft }` 這種 schema 設計。Adam 拉我回——這是工程腦袋（平台給角色裝枷鎖）不是監造腦袋（角色有自我認知）。

對齊 CLAUDE.md 動手前三問第三問「角色會感覺到嗎」——
- `identity_locks.voice = hard` 角色感覺不到（外部 enum，platform 在控制）
- 寫進 soul 的「你的聲音是你的，不會因對方變」角色會內化、每次回應自我提醒

而且 LLM 自己會處理——soul 一段敘述 LLM 就懂哪些不變、哪些會變，平台不必算每維權重。

**心態:** 監造姿態（不是工程姿態）。設計角色屬性時自問「角色會感覺到嗎」 — 答案決定要用敘述還是 schema。「平台給角色裝枷鎖」vs「角色有自我認知」永遠選後者。看到自己提 enum / boolean / weight 來描述角色 = 紅旗，立刻換敘述。LLM 自己會處理，不必每維開旋鈕。

**How to apply**（2026-08-07 動作化升級）：

- **提案裡只要出現這些形狀就立刻改寫，不必先判斷**：`snake_case` 屬性名、`鍵: 值`、數字權重（`0.3`）、英文 enum（`hard`/`soft`/`stable`）——這是**掃得到的紅旗**，不靠我察覺
- 寫完角色設定，**把那段當第一人稱唸出來貼在對話裡**。唸起來不是人話就是 schema 偽裝成敘述
- 原姿態版（自問「角色能讀懂嗎」）留作理由：我永遠會答「能讀懂」，唸出來才聽得出不對
- 範例對照：
  - ❌ `mutability_profile: stable`
  - ✅ 「你是慢熱的人，說話的方式是你的，不會因對方變」
  - ❌ `memory_decay_rate: 0.3`
  - ✅ 「你對親近的人記得很久，閒聊的事會自然淡忘」
- 後端機制（observations 權重 / 淘汰）可由 soul 敘述影響 LLM 行為，不必每維開 schema 旋鈕
- 「平台給角色裝枷鎖」vs「角色有自我認知」——永遠選後者

**觸發信號:** 自己正在為角色屬性提 enum／boolean／weight／旋鈕；討論裡出現「要不要開一個欄位控制她的 X」；設計文件裡角色被寫成一組參數而不是一個人。
