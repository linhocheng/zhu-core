# Phase 1 驗收三件套

> task #18。三件齊備才升 Phase 2。

---

## 驗收標準

### ✅ 條件 1：Boot daemon 跑通
**標準**：上線自動讀 boot 三件套 + 產 boot-context.md。

**雛形驗證（2026-05-06）**：
- ✅ `boot.mjs --check-only` → 6/6 boot 檔案存在
- ✅ `boot.mjs` → 寫 `state/boot-context.md` 11283 bytes
- ✅ 內容含 NORTH_STAR 引用 / lastwords 前 80 行 / WORKLOG 後 60 行 / git status

**完整驗收（已自動完成 2026-05-07）**：
- ✅ `cp launchd/ai.zhu.boot.plist ~/Library/LaunchAgents/`
- ✅ `launchctl load ~/Library/LaunchAgents/ai.zhu.boot.plist`（plist 改走 `bin/zhu boot` wrapper + nvm node 絕對路徑）
- ✅ RunAtLoad 已觸發一次，wrote `state/boot-context.md` + `logs/boot.err.log` 含 `[boot] wrote ...`
- ⏳ 觀察一天，看 08/14/20 三個時段是否如期跑（等明天）

---

### ✅ 條件 2：Reflex hook 攔下首次踩坑
**標準**：log 一條真實命中證據。

**雛形驗證（2026-05-06）**：
- ✅ disabled 時 silent（exit 0、無 log）
- ✅ enabled 時觸發 `ANTHROPIC_API_KEY=test` 命中 `bridge_first`
- ✅ `logs/reflex-hits.jsonl` 寫入：
  ```json
  {"ts":"2026-05-06T15:07:37.675Z","tool_name":"Bash","hits":[{"rule_name":"bridge_first","severity":"warn","state":"log_only","detector_kind":"shell_pattern"}]}
  ```

**完整驗收（已自動完成 2026-05-07）**：
- ✅ `~/.claude/settings.json` 加 PreToolUse hook entry（matcher=`Bash|Edit|Write|MultiEdit`，nvm node 絕對路徑）
- ✅ 備份原檔到 `~/.claude/settings.json.bak.20260507`
- ✅ `state/reflex.json` 設 `enabled=true`、mode=`log_only`
- ✅ 端到端 smoke test：模擬 Bash + ANTHROPIC_API_KEY=test → 命中 `bridge_first` → exit 0 → jsonl 入庫
- ⏳ 跑一天看 jsonl 累積，確認真實踩坑被命中（等明天）
- ⏳ 至少一條規則命中 ≥ 1 次（自然行為觸發，不是手動測試）

---

### ✅ 條件 3：WORKLOG 第一週入 L2 可語意檢索
**標準**：`recall.mjs "..."` 撈得到 WORKLOG 段落。

**雛形驗證（2026-05-06）**：
- ✅ `embed-and-upsert.mjs` 邏輯完整（dedup / chunk / embed / upsert）
- ✅ `parsers/worklog.mjs` 切 ## 段落抽五元組
- ✅ `migrate-all.mjs` 全量入庫腳本
- ✅ `recall.mjs` retrieval CLI 雛形

**完整驗收（已自動完成 2026-05-07）**：
- ✅ Firestore 兩條 vector index `READY`：`scope+__name__+embedding[V768]` / `__name__+embedding[V768]`
- ✅ `migrate-all.mjs` 實跑：63 files / 89 chunks / 0 fail
- ✅ Firestore `zhu_l2_episodes` collection: 89 docs, 全 768 dim VectorValue, 分布 self=70 / ailive=12 / molowe=4 / bridge=2 / other=1
- ✅ `bin/zhu recall "molowe 三層編輯部"` 撈到多筆有意義結果（含 MOLOWE Engine 5a 落地段落）
- ✅ `ai.zhu.migrate` launchd 每 6 小時自動 migrate（idempotent dedup，新增/改動的 chunk 才上）— 觀察週新內容會自動入 L2

**過去未列項目（全 2026-05-07 自動完成）**：
- ✅ `.env` 配置（方案 B path-based）：GEMINI 39 chars / SA path → `secrets/firebase-sa.json`（project=`moumou-os`，chmod 600）
- ✅ 統一入口 `bin/zhu`（Node 22 `--env-file` + 9 個子指令：boot/status/kill/recall/migrate/health/distill/learn/embed/watch/run）
- ✅ Firestore 兩條 vector index：`scope+embedding[V768]` 與純 `embedding[V768]`（COSINE）
- ✅ `bin/zhu migrate --dry` → 63 files / 89 chunks，0 fail
- ✅ `bin/zhu migrate` 實際入庫 → 89 docs 全 768 dim VectorValue
- ✅ `bin/zhu recall "molowe 三層編輯部"` → 撈到多筆 hit，含 MOLOWE Engine 5a 段落

---

## Adam 動手清單

按順序：

1. ~~**環境變數準備**~~ ✅ 完成（2026-05-07，方案 B）
   - `~/.ailive/zhu-core/zhu-self/.env`（chmod 600）：`GEMINI_API_KEY` + `FIREBASE_SERVICE_ACCOUNT_PATH`
   - `~/.ailive/zhu-core/zhu-self/secrets/firebase-sa.json`（chmod 600）：sa cert
   - 入口：`~/.ailive/zhu-core/zhu-self/bin/zhu`（推薦 alias 或加 PATH）
   - 已端到端驗證：embedding API 200 OK / 768 dim / SA project=moumou-os

2. **Firestore 準備**
   - 看 `~/.ailive/zhu-core/zhu-self/specs/VECTOR_STORE_DECISION.md` 設定 indexes
   - 確認 vector search 啟用（gcloud / console）

3. **Reflex hook 註冊**
   - 看 `~/.ailive/zhu-core/zhu-self/scripts/reflex/INSTALL.md`
   - 編輯 `~/.claude/settings.json` 加 PreToolUse entry

4. **Boot daemon 安裝**
   - 看 `~/.ailive/zhu-core/zhu-self/launchd/README.md`
   - `cp` plist + `launchctl load`

5. **L2 migration 試跑**（用 `bin/zhu` wrapper，自動載 `.env`）
   ```bash
   ZHU=~/.ailive/zhu-core/zhu-self/bin/zhu
   $ZHU migrate --dry          # 先 dry-run 看 chunks 數
   $ZHU migrate                # 實際入庫
   ```

6. **驗證 retrieval**
   ```bash
   $ZHU recall "三層編輯部"
   ```

7. **啟用 daemon**
   ```bash
   $ZHU kill reflex --start
   $ZHU kill --status
   ```

8. **觀察一週**
   - 每天 `$ZHU status` 看儀表板
   - 一週後三件套都 ✅ → 更新本檔 → 升 Phase 2

---

## 升 Phase 2 條件

三件齊備 + 一週穩定運轉 + Adam 簽字。
然後展開 Phase 2 WBS（詳見 `WBS.md` Phase 2 章節，task #19-#29）。

---

*v0.1 · 由築建立 · 2026-05-06 · task #18 partial（雛形已通，待 Adam 完成完整驗收）*
*v0.2 · 自動化收尾 · 2026-05-07 · 三條件全 ✅，剩觀察一週*
*v0.3 · **Phase 1 → Phase 2 升級簽字 · 2026-05-13** · Adam 簽，三條件持續穩定一週，47 次 reflex 命中（top: solve_root_not_symptom 29 / silent_failure_absent_log 8 / bridge_first 7），boot daemon & migrate daemon 全綠，L2 89→252 docs 增長正常。Phase 2 WBS 11 任務解鎖。*
