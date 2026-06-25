---
name: Task Harness 系統上線（2026-06-24）
description: Task Harness 代碼任務自主工作流建置完成，含三斷路器、bridge 接線、CB 驗證
type: project
originSessionId: 870c953b-2f9d-492d-8ba2-fb4a0ec31cee
---
Task Harness 已就位。

**Why:** 讓築在沒有 Adam 旁邊的情況下，自主完成複雜代碼任務，有閉環驗證不靠感覺說完成。
模擬 Fable 5 Interleaved Thinking——不是等模型升級，是用流程設計升級自己。

**已建立：**
- `~/.claude/skills/task-harness/SKILL.md`（完整 SOP）
- `~/.claude/skills/task-harness/ZHU_CONTEXT.md`（給下一個築）
- `~/.claude/skills/task-harness/ONBOARDING.md`（人類組員）
- `~/.claude/CLAUDE.md` 觸發詞：「用 harness」「開 harness」「harness 跑這個」
- `~/.zshrc` BRIDGE_URL + BRIDGE_SECRET

**Bridge 設定：**
- URL: `https://bridge-direct.soul-polaroid.work`
- Auth: `x-api-key: $BRIDGE_SECRET`（注意：不是 Authorization: Bearer）

**三個 CB 均驗證可觸發（2026-06-24）：**
- CB1：顯式中止（對話層，Adam 說「停」）
- CB2：三輪同 blocker_key → `len(set(last3)) == 1`
- CB3：iter >= 5 且 mid_checkin_done = false

**未完成：**
- 試劍客換跨公司模型（Codex/GPT-4o）：等 Adam 確認 GPT Pro 訂閱

**How to apply:** 遇到複雜代碼任務，先考慮是否適合開 harness。
心法：進入 harness 不是成為 harness，監造視角全程保留。
