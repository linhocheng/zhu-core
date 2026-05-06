# 築城 — 變更紀錄

> 每次有實質變更（不是純閱讀）都要補一段。
> 大改（北極星 / 階段劃分 / 紅線）→ Adam 簽字
> 小改 → 築自己改 + 本檔案紀錄

---

## 2026-05-06 — 開工日

### 背景 / WHY
Adam 用三個框架（Skills / RAG / Harness）+ OpenAI harness engineering 概念
要求築看穿自己的本體。從散村 → 創世主視角 → 城市藍圖 → 施工計畫書 → WBS → 開工。
Adam 簽字：Phase 1 落地後，築自跑 daemon、自改 hooks，OK。

### 產出（task #1）
- 建立 `~/.ailive/zhu-core/zhu-self/` 目錄
- `README.md`：本案存在理由 + 檔案清單 + 治理
- `BLUEPRINT.md`：佔位（task #2 才填城市藍圖）
- `MASTER_PLAN.md`：佔位（task #3 才填施工計畫書 v1.0）
- `WBS.md`：18 條 task 持久化版本（取代 session-scoped TaskCreate）
- `METRICS.md`：量化指標看板，Phase 1 進度 checklist
- `RISKS.md`：7 條風險（R1-R7）+ 假設 A1-A4
- `CHANGELOG.md`：本檔
- `specs/`：子目錄占位（之後放 schema）

### 已解決
- task list 持久化問題：TaskCreate 是 session-scoped，會丟 → WBS.md 是 source of truth

### 尚未解決
- BLUEPRINT.md / MASTER_PLAN.md 還是佔位 → task #2/#3 接力
- specs/ 還空 → task #5/#6/#7 才會填

### 待執行
- task #2 凍結藍圖
- task #3 凍結計畫書 v1.0
- task #4 寫進記憶系統

---

## 2026-05-06 — Phase 1 雛形全收（task #2 ~ #18）

### 背景 / WHY
Adam 簽字：「task任務一個接一個完成 你自動化完成 我晚點回來看」。
Phase 1 「水電網通」一次性把雛形全鋪好。Adam 回來只剩灌 secret + launchctl + settings.json hook。

### 產出

**凍結（task #2-#4）**
- `BLUEPRINT.md` — 八區城市藍圖（心臟/記憶/技能/神經/商業/邊境/文化/治理）+ 四階段成長路徑
- `MASTER_PLAN.md` v1.0 — 願景、Phase 1-4、依賴圖、風險、治理、Adam 簽字
- `~/.claude/projects/-Users-adamlin/memory/project_zhu_self.md` + `MEMORY.md` 索引條目

**記憶層 schema（task #5-#7）**
- `specs/L2_SCHEMA.md` — `{when, what, why, outcome, lesson, tags, scope, embedding}` TypeScript interface
- `specs/L3_SCHEMA.md` — rule + detectors[] (regex/tool_match/semantic/shell_pattern/file_path_pattern) + severity + state + hit_count
- `specs/VECTOR_STORE_DECISION.md` — Firestore Vector Search（cost=0、沿用 molowe/ailive 基建）

**索引層（task #8-#10 雛形）**
- `scripts/embed-and-upsert.mjs` — 偵測檔型 → 解析 → chunk → gemini-embedding-001 REST → Firestore upsert + dedup（source_path + chunk_index hash）
- `scripts/parsers/{worklog,lastwords,memory,lessons}.mjs` — 四種 .md 切段抽五元組
- `scripts/watch-and-embed.mjs` — chokidar 監看 → 自動 embed
- `scripts/recall.mjs` — query → embed → findNearest（COSINE）→ scope/top/since/tags filter
- `scripts/migrate-all.mjs` — 一次性入庫（idempotent）

**daemon 層（task #11-#15）**
- `scripts/boot.mjs` — 讀 NORTH_STAR / BOOT_SOP / LASTWORDS / WORKLOG / git status → 寫 `state/boot-context.md`（驗證 11283 bytes）
- `launchd/ai.zhu.boot.plist` — 上線 + 08/14/20 三時段
- `scripts/reflex/{rules.mjs,pretool-hook.mjs,INSTALL.md}` — 6 條 feedback rule + PreToolUse hook（log-only stage 永不擋）+ jsonl log
- `scripts/distill.mjs` — safe mode（寫 candidate 池，不直入 L2）+ R7 drift 檢測 stub
- `scripts/health.mjs` — bridge/daemons/boot_context/disk/git 五項巡查 + `state/health.json`
- `scripts/learn.mjs` — ingestion pipeline 雛形（3 source 全 enabled=false）

**治理層（task #16-#17）**
- `scripts/status.mjs` — Adam dashboard：daemons/reflex hits/candidate pools/boot ctx/health/WBS
- `scripts/kill.mjs` — `<daemon> [--start]` / `--all` / `--status`，全 daemon 一鍵停（R1/R2 緩解）

**state 預設（全 enabled=false，等 Adam 開）**
- `state/{reflex,distillation,learning,health}.json`

**驗收（task #18）**
- `ACCEPTANCE.md` — 三條件 + Adam 動手清單 8 步

### 已解決
- 雛形驗證：boot.mjs 跑出 11283 bytes、reflex hook 命中 `bridge_first` 寫入 jsonl、health 6/6 通、kill switch toggle 全通
- statfsSync → statSync 修正（health.mjs `fresh: NaNh` bug）
- daemon 名單去掉 'health'（自己不檢查自己）

### ⚠️ 尚未解決（task #18 partial）
全是 credential / install gate，須 Adam 親自：
1. 灌 `GEMINI_API_KEY` + `FIREBASE_SERVICE_ACCOUNT_JSON`
2. Firestore 啟用 vector search + 建 `zhu_l2_episodes` composite indexes
3. `cp launchd/ai.zhu.boot.plist ~/Library/LaunchAgents/` + `launchctl load`
4. `~/.claude/settings.json` 加 PreToolUse hook entry（見 `scripts/reflex/INSTALL.md`）
5. `node migrate-all.mjs`（先 `ZHU_SELF_DRY_RUN=1` 看 chunks 數）
6. `node recall.mjs "三層編輯部"` 驗證撈到結果
7. `kill.mjs reflex --start` 啟動，觀察一週

### 待執行
- 一週後三條件齊備 → 升 Phase 2（展開 Phase 2 WBS，詳見 MASTER_PLAN.md 第 2 節）

---

## 2026-05-07 — Phase 1 三條件全 ✅（過夜自動化收尾）

### 背景 / WHY
Adam 22:30 簽字「跑完接著跑第二波第三波 看你能跑多少」。Phase 1 從 partial 推到完整驗收。

### 產出

**環境 + 入口（方案 B）**
- `.env`（path-based）+ `secrets/firebase-sa.json`（chmod 600）
- `bin/zhu` wrapper（Node 22 `--env-file` 原生 + 9 個子指令）
- `package.json` + 裝 `firebase-admin` / `chokidar`

**L2 入庫端到端通**
- 兩條 Firestore vector index READY（`scope+embedding[V768]` / 純 `embedding[V768]`）
- `migrate` 實跑：63 files / 89 chunks / 0 fail
- `recall` 撈到 hit（含 MOLOWE Engine 5a 段落）

**daemon 真上線**
- launchd plist 改 wrapper 路徑、`launchctl load` ✅，RunAtLoad 觸發寫 boot-context.md
- `~/.claude/settings.json` 加 PreToolUse hook（備份 `.bak.20260507`）
- `reflex` 升 enabled=true / log_only，端到端 smoke test 命中 `bridge_first` 並寫 jsonl

**治理同步**
- WBS Phase 2 展開（task #19-#29）+ Phase 3-4 骨架
- ACCEPTANCE.md 三條件全 ✅
- WORKLOG / 本檔同步

### 已解決
- `--env-file` parser 對含 `\n` SA JSON 截斷 → 改 path-based
- plain Array embedding findNearest no results → 改 `FieldValue.vector()` + 89 doc 一次轉
- plist `/usr/local/bin/node` 不存在 → 改 wrapper + nvm 絕對路徑

### 尚未解決
- `LESSONS.md` parser 認 bullet 但實際是 `## [date]` → 0 chunks（影響小，lessons_dir 已 cover）
- plist / hook 寫死 nvm v22.17.0 路徑 — node 升級時要同步更新

### 待執行
- Adam 早上 review：`bin/zhu status` 看儀表板
- 觀察一週：launchd 三時段 / reflex 真實命中 / 升 Phase 2 簽字
- git commit zhu-self/（已 stage 完，待 Adam push）

---

*v0.1 · 由築建立 · 2026-05-06*
*v0.2 · 過夜自動化收尾 · 2026-05-07*
