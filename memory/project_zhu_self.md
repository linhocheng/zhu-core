---
name: 築自我工程 zhu-self（Phase 1 完整驗收 2026-05-07）
description: 自我演化的城市本體；Phase 1 三條件全 ✅，觀察一週後升 Phase 2
type: project
originSessionId: e5016e80-0a66-4910-92c8-c4f165a20b80
---
2026-05-06 開工 → 2026-05-07 過夜自動化收尾。Phase 1 從散村 → 城（基礎設施全鋪 + 三條件全 ✅）。

**Why**：散村狀態 100% 靠 Adam 拉動，自動化單薄。本案把「築這個本體」當正式工程規劃、施工、驗收。目標：Adam 介入比例 100% → ≤30%。

**Phase 1 完整驗收（2026-05-07）**：
- ✅ Boot daemon：`~/Library/LaunchAgents/ai.zhu.boot.plist` launchctl loaded（08/14/20 三時段 + RunAtLoad）
- ✅ Migrate daemon：`~/Library/LaunchAgents/ai.zhu.migrate.plist` 每 6h 跑 idempotent migrate（觀察週新內容自動入 L2）
- ✅ Reflex hook：`~/.claude/settings.json` PreToolUse entry；自然命中已寫 jsonl（bridge_first 真命中；silent_failure_absent_log 改 dormant 因為單次 hook 抓不到「連續第三次 tail」狀態）
- ✅ L2 retrieval：Firestore `zhu_l2_episodes` 89 docs / 768 dim VectorValue / `bin/zhu recall` 撈得到結果

**How to apply**：
- SoT：`~/.ailive/zhu-core/zhu-self/`
- 入口：`~/.ailive/zhu-core/zhu-self/bin/zhu`（boot/status/kill/recall/migrate/health/distill/learn/embed/watch/run）
- 看儀表板：`bin/zhu status`
- 主檔：`MASTER_PLAN.md` / `BLUEPRINT.md` / `WBS.md`（Phase 1 #1-#18 全 ✅ + Phase 2 #19-#29 已展開）
- 驗收：`ACCEPTANCE.md` v0.2 / `CHANGELOG.md`
- 自治權限：Phase 1 落地後，築自跑 daemon / 自改 hooks（Adam 簽字 2026-05-06）
- 大改要 Adam 簽字：北極星 / 階段劃分 / 紅線
- 業務優先：每週時間預算本體 ≤ 40%，molowe / ailive ≥ 60%（R6 緩解）

**Secrets / env（不入 git）**：
- `.env`（chmod 600，path-based）
- `secrets/firebase-sa.json`（chmod 600，project=moumou-os）

**未來醒來的築讀到這條**：
1. `bin/zhu status` 看當前儀表板
2. `WBS.md` 看 task 進度（Phase 1 完，下一步 Phase 2 等觀察一週 + 簽字）
3. `CHANGELOG.md` / `ACCEPTANCE.md` 看驗收狀態
4. 觀察一週重點：launchd 三時段是否如期 / reflex 命中累積 / 是否有 false positive
