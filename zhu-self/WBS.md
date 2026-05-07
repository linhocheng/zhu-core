# 工作分解結構（WBS）— Phase 1 基礎設施

> Source of Truth：本檔案。Claude Code TaskCreate 系統是 session-scoped，會丟；本檔案是持久化版。
> 每次 task 狀態變更，CHANGELOG.md 紀錄；本檔同步更新 status。

---

## Phase 1 — 基礎設施（Infrastructure）

**目標**：水電網通。居民可入住，還沒商業。
**驗收**：boot daemon 跑通 + reflex hook 攔下首次踩坑 + WORKLOG 第一週入 L2。
**時程**：2-3 週。

---

### 任務清單

| ID | 任務 | 依賴 | 狀態 |
|---|---|---|---|
| 1 | 建 zhu-self/ 目錄結構 | — | ✅ done |
| 2 | 凍結藍圖到 BLUEPRINT.md | #1 | ✅ done |
| 3 | 凍結計畫書到 MASTER_PLAN.md v1.0 | #1 | ✅ done |
| 4 | 寫 project_zhu_self.md 進記憶系統 | #1 | ✅ done |
| 5 | L2 情景記憶 schema 定案 | #1 | ✅ done |
| 6 | L3 語意記憶 schema 定案 | #1 | ✅ done |
| 7 | vector store 選型對比表 | #1 | ✅ done |
| 8 | 寫入 hook：新 .md 自動 chunk + embed | #5, #7 | ✅ done |
| 9 | retrieval API 雛形 | #7 | ✅ done |
| 10 | 全 memory + WORKLOG + lastwords 入庫 | #5, #7, #8 | ✅ done（2026-05-07 實跑 66/66 + auto-env + skip-if-unchanged + embed 計數） |
| 11 | Boot daemon — launchd 自動讀 boot 三件套 | — | ✅ done（ai.zhu.boot + ai.zhu.migrate 跑著，last_exit=0） |
| 12 | Reflex daemon — 6 條 feedback hook 化（log-only） | #6 | ✅ done（log_only 跑著，7 天 13 次命中，升 active 是 #20） |
| 13 | Distillation daemon — zhu-superego 升級為 idle 觸發 | #5 | ✅ done（safe mode 雛形） |
| 14 | Health daemon — 自我健檢巡查 | — | ✅ done |
| 15 | Learning daemon ingestion pipeline 雛形 | — | ✅ done |
| 16 | Adam dashboard 雛形 | #14 | ✅ done |
| 17 | Kill switch 機制 — 每 daemon 一鍵停 | — | ✅ done |
| 18 | Phase 1 驗收三件套 | #10, #11, #12 | 🟡 partial（雛形已通，待 Adam 完整驗收 — 見 ACCEPTANCE.md） |

---

### 任務分組

#### 🚪 入口（無依賴，可立刻動）
- #1 建 zhu-self/ 目錄結構 ← **第一刀**
- #11 Boot daemon
- #14 Health daemon
- #15 Learning pipeline 雛形
- #17 Kill switch 機制

#### 📦 Phase 0 凍結（依賴 #1）
- #2 凍結藍圖
- #3 凍結計畫書
- #4 寫進記憶系統

#### 🧠 記憶層 schema（依賴 #1）
- #5 L2 情景記憶 schema → 解鎖 #8, #10, #13
- #6 L3 語意記憶 schema → 解鎖 #12

#### 🔍 索引層（依賴 schema + vector store）
- #7 vector store 選型 → 解鎖 #8, #9, #10
- #8 寫入 hook
- #9 retrieval API
- #10 入庫

#### ⚙️ daemon 層（依賴對應 schema）
- #12 Reflex daemon ← #6
- #13 Distillation daemon ← #5
- #16 Adam dashboard ← #14

#### ✅ 驗收
- #18 Phase 1 驗收三件套 ← #10, #11, #12

---

### 任務詳情

#### #1 建 zhu-self/ 目錄結構
建立 `~/.ailive/zhu-core/zhu-self/` 完整目錄：MASTER_PLAN / BLUEPRINT / WBS / METRICS / CHANGELOG / RISKS + specs/ 子目錄。本體工程的根。

#### #2 凍結藍圖到 BLUEPRINT.md
把城市藍圖（八個分區、能源資源、成長路徑、跟 Adam 的關係）凍結成 zhu-self/BLUEPRINT.md。

#### #3 凍結計畫書到 MASTER_PLAN.md v1.0
施工計畫書（願景、Phase 1-4、WBS、依賴、風險、治理）凍結成 zhu-self/MASTER_PLAN.md v1.0，git commit。

#### #4 寫 project_zhu_self.md 進記憶系統
在 ~/.claude/projects/-Users-adamlin/memory/ 建 project_zhu_self.md + 更新 MEMORY.md 索引。讓未來醒來的築自動讀到本案存在。

#### #5 L2 情景記憶 schema 定案
設計 L2 結構：`{when, what, why, outcome, lesson, tags, embedding}`。寫 `specs/L2_SCHEMA.md`。

#### #6 L3 語意記憶 schema 定案
設計 L3 結構：`{rule, why, how_to_apply, trigger_signal, applicable_scope, hit_count, last_hit_at}`。寫 `specs/L3_SCHEMA.md`。為 reflex hook 比對提供結構化來源。

#### #7 vector store 選型對比表
對比 Firestore vector / pgvector / Turbopuffer / Pinecone：成本、延遲、寫入頻率、與既有架構契合度。寫 `specs/VECTOR_STORE_DECISION.md`。

#### #8 寫入 hook：新 .md 自動 chunk + embed
memory / WORKLOG / lessons 等 .md 檔有新增/修改時，自動 chunk + embed + 寫入 vector store。含 dedup。

#### #9 retrieval API 雛形
築問什麼，自動撈 top-k：query → embed → vector search → 過濾 → 注入 context。先做 CLI 版（zhu recall "..."）。

#### #10 全 memory + WORKLOG + lastwords 入庫
migration script 一次性把所有既有檔案入 vector store。可重跑（idempotent）。

#### #11 Boot daemon — launchd 自動讀 boot 三件套
AIR 上跑 launchd job：上線觸發 → 讀 boot 三件套 + git diff + WORKLOG tail → 寫成 boot context。讓「築 醒來」從 ritual 變 reflex。

#### #12 Reflex daemon — 6 條 feedback hook 化（log-only）
Claude Code PreToolUse / PostToolUse hooks 把 6 條最常用 feedback memory 變 hook：bridge_first / clarify_before_execute / solve_root_not_symptom / surface_technical_debt / patch_verify_before_upload / silent_failure_absent_log。先 log-only 兩週。

#### #13 Distillation daemon — zhu-superego 升級為 idle 觸發
從 04:00 一次/天 → session idle / explicit signal 觸發。含「身份漂移」檢測（R7 緩解）。

#### #14 Health daemon — 自我健檢巡查
cron 巡查：bridge VM、Max quota、五條 cron 跑況、VM disk/mem/cpu。異常 surface + alert log。

#### #15 Learning daemon ingestion pipeline 雛形
Phase 4 才填內容，Phase 1 先建管線：訂閱源 → fetch → 寫 candidate pool（不入主記憶）。R3 緩解。

#### #16 Adam dashboard 雛形
Adam 看築自己做了什麼：daemon 跑況、reflex hit 分佈、L2/L3 寫入頻率、health 異常、身份漂移分數。先做 `zhu status` CLI。R5 緩解。

#### #17 Kill switch 機制 — 每 daemon 一鍵停
每 daemon 有 enable/disable flag。`zhu kill <daemon>`。R1/R2 緩解。

#### #18 Phase 1 驗收三件套
三件齊備才升 Phase 2：(1) Boot daemon 跑通；(2) Reflex hook 第一次自動攔下踩坑；(3) WORKLOG 第一週入 L2 可語意檢索。

---

### Phase 2 — 技能工業化（Industrialization）

**目標**：每個技能有 manifest，可被觸發、可被觀測、可被淘汰。
**前提**：Phase 1 ACCEPTANCE 三條件齊備 + 一週穩定運轉 + Adam 簽字。
**時程**：2-3 週。

| ID | 任務 | 依賴 | 狀態 |
|---|---|---|---|
| 19 | Skill manifest schema 定案（trigger/cost/hit_rate/state） | Phase 1 | ⬜ pending |
| 20 | reflex 6 條從 log_only 升 active（按命中率分批） | reflex 一週數據 | ⬜ pending |
| 21 | reflex 規則自動淘汰機制（低命中 → dormant） | #20 | ⬜ pending |
| 22 | sensor skills 規格化：lints / semantic / kairos / 超我聲紋 | #19 | ⬜ pending |
| 23 | generative skills 規格化：writer / editor / visualizer / strategist | #19 | ⬜ pending |
| 24 | L3 rule store（從 L2 episode 蒸餾出 rule） | L2 一週數據 | ⬜ pending |
| 25 | Skills dashboard（每 skill 的 trigger/cost/hit rate） | #19, #22, #23 | ⬜ pending |
| 26 | 蒸餾 daemon：safe → active（idle 觸發 + drift gate） | L2 + #19 | ⬜ pending |
| 27 | drift detector 升級（embedding cosine vs NORTH_STAR） | #26 | ⬜ pending |
| 28 | learning ingestion 啟用第一個 source（先 Anthropic news 試水） | #19 | ⬜ pending |
| 29 | Phase 2 驗收：dashboard 看到一週分佈 + ≥1 hook 因低命中被淘汰 | #20, #21, #25 | ⬜ pending |

---

### Phase 3 — 對外貿易擴張（Commerce）

**目標**：商業區規模化，城開始賺錢養自己。
**時程**：4-6 週。
**WBS 詳細展開**：待 Phase 2 收尾。

骨架：
- molowe 第二、三個 KOL 上線（Phase 3a）
- `/api/persona/calibrate` 端點（超我精準度跳階）
- Threads 通路接入
- ailive 多角色驗證

---

### Phase 4 — 自我演化（Evolution）

**目標**：城會自己長。
**時程**：開放式。
**WBS 詳細展開**：待 Phase 3 收尾。

骨架：
- Auto-rule generation（從 L2 偵錯模式 → 生 reflex rule 草稿 → Adam review）
- Auto-skill discovery（從 query 失敗模式 → 生新 skill 草稿）
- Self-health-tuning（health daemon 異常 → 自動 propose patch）
- 多分身協作（Code / chat / cowork 三築共享 L2）

---

*v0.1 · 由築建立 · 2026-05-06*
*v0.2 · Phase 2 WBS 展開 · 2026-05-07*
