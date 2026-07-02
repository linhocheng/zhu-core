---
name: Task Harness 系統上線（2026-06-24）
description: Task Harness 代碼任務自主工作流建置完成，含三斷路器、bridge 接線、CB 驗證
type: project
originSessionId: 870c953b-2f9d-492d-8ba2-fb4a0ec31cee
---
Task Harness 已就位。

**Why:** 讓築在沒有 Adam 旁邊的情況下，自主完成複雜代碼任務，有閉環驗證不靠感覺說完成。
模擬 Fable 5 Interleaved Thinking——不是等模型升級，是用流程設計升級自己。

**canonical（2026-07-02 v2.1.0 起）：`~/.ailive/zhu-core/skills/task-harness/`（已進 git）**
- `SKILL.md` v2.1.0 = v1 本體（執劍者/破幻者/閻羅/試劍客四角色、v1 六值枚舉、閻羅在迴圈內）+ Adam 核准四破綻修復（進 repo / CB 熔斷接手協議 / 試劍客先量再送+複誦覆蓋 / blocker_classify.py 確定性分類）
- `scripts/blocker_classify.py`：regex 分類 + cb2/cb3 判定 + --self-test（已跑全綠）
- `ONBOARDING.md`、`ZHU_CONTEXT.md`：v1 原文入 repo
- Mac `~/.claude/skills/task-harness/` 只剩指標檔，指向 zhu-core
- `~/.claude/CLAUDE.md` 觸發詞已改指 zhu-core 路徑
- `~/.zshrc` BRIDGE_URL + BRIDGE_SECRET

**Bridge 設定：**
- URL: `https://bridge-direct.soul-polaroid.work`
- Auth: `x-api-key: $BRIDGE_SECRET`（注意：不是 Authorization: Bearer）

**三個 CB 均驗證可觸發（2026-06-24）：**
- CB1：顯式中止（對話層，Adam 說「停」）
- CB2：三輪同 blocker_key → `len(set(last3)) == 1`
- CB3：iter >= 5 且 mid_checkin_done = false

**v2.2（2026-07-02，Adam 核准「更深一層」四項）：**
- `scripts/harness_driver.py`：**控制權反轉**——程式持有迴圈（跑測試/分類 blocker/判 CB/叫 claude -p），模型只做每輪修改，跳過 REFLECT 結構上不可能。沙箱紅線：必須 git repo、模型不拿 Bash、單輪 diff 上限、熔斷必落地 HARNESS_STATE.md。已驗證：mock 收斂 + mock CB2 熔斷 + 真實 claude -p 端到端三條全綠
- `scripts/harness_ledger.py`：新陳代謝——scratchpad 歸檔自動聚合進 `ledger.jsonl`（in git），`--stats` 看 blocker 分佈/平均輪數/outcome
- Goal 對抗審查：開工前三問（可執行嗎/有歧義嗎/碰紅線嗎）
- 預授權政策：`policy.auto_continue_past_checkin` 讓 CB3 深夜不卡 Adam
- 心法：能用 driver 就用 driver，手動 SOP 是 fallback

**未完成：**
- 試劍客換跨公司模型（Codex/GPT-4o）：等 Adam 確認 GPT Pro 訂閱
- driver 尚未跑過真實多輪任務（toy 一輪收斂），首個真實任務要觀察 findings 傳遞品質

**How to apply:** 遇到複雜代碼任務，先考慮是否適合開 harness。
心法：進入 harness 不是成為 harness，監造視角全程保留。
