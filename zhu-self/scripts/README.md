# zhu-self / scripts

> Phase 1 基礎設施雛形腳本。
> 全用 Node.js（沿用 molowe 慣例），跑 `node 22+`。
> 不放在 Next.js framework 內 —— 直接 CLI。

---

## 目錄

```
scripts/
├── README.md              本檔
├── embed-and-upsert.mjs   核心：一個 .md → chunks → embed → upsert（task #8）
├── watch-and-embed.mjs    fswatch 監控目錄，新增/修改觸發 embed（task #8）
├── recall.mjs             retrieval API CLI 雛形：zhu recall "..."（task #9）
├── migrate-all.mjs        全量 migration：掃所有 .md 入 L2（task #10）
├── parsers/               各類 .md 切分器
│   ├── worklog.mjs        WORKLOG.md 按 ## YYYY-MM-DD 切
│   ├── lastwords.mjs      lastwords 按 ## 二級標題切
│   ├── memory.mjs         memory/*.md 整檔含 frontmatter
│   └── lessons.mjs        LESSONS.md 條目 / LESSONS/*.md 整檔
├── boot.mjs               Boot daemon 主程式（task #11）
├── reflex/                Reflex daemon hooks（task #12）
│   └── ...
├── distill.mjs            Distillation daemon 主程式（task #13）
├── health.mjs             Health daemon 巡查（task #14）
├── learn.mjs              Learning daemon ingestion 雛形（task #15）
├── status.mjs             Adam dashboard CLI: zhu status（task #16）
└── kill.mjs               Kill switch CLI: zhu kill <daemon>（task #17）
```

---

## 環境變數

跟 molowe 對齊：

| Var | 用途 | 來源 |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Admin SDK 認證 | Secret Manager |
| `FIREBASE_PROJECT_ID` | fallback | Secret Manager |
| `FIREBASE_STORAGE_BUCKET` | （L2 不用，留空） | — |
| `GEMINI_API_KEY` | embedding model | Secret Manager |
| `GEMINI_EMBEDDING_MODEL` | 預設 `gemini-embedding-001` | hardcode |
| `ZHU_SELF_DRY_RUN` | 1 = 只 print 不寫 Firestore | CLI flag |
| `ZHU_SELF_VERBOSE` | 1 = 詳細 log | CLI flag |

---

## 快速指令

```bash
# 入庫單檔（dry-run）
ZHU_SELF_DRY_RUN=1 node embed-and-upsert.mjs ~/.ailive/zhu-core/docs/WORKLOG.md

# 入庫單檔（實際寫入）
node embed-and-upsert.mjs ~/.ailive/zhu-core/docs/WORKLOG.md

# 監控啟動
node watch-and-embed.mjs

# 全量 migration（dry-run）
ZHU_SELF_DRY_RUN=1 node migrate-all.mjs

# 檢索
node recall.mjs "上次蒸餾出什麼規律"

# Boot
node boot.mjs

# 看城裡情況
node status.mjs

# 一鍵停某 daemon
node kill.mjs reflex
```

---

## Daemon 統一規則

- 每個 daemon 開頭讀 enable flag（Firestore `zhu_self_config/{daemon_name}.enabled`）
- 預設 = false（kill switch 預設關，避免暴衝）
- log 統一寫 `~/.ailive/zhu-core/zhu-self/logs/{daemon}.log`
- 每個 daemon 有 health endpoint（檔案：`~/.ailive/zhu-core/zhu-self/state/{daemon}.json`）

---

*v0.1 · 2026-05-06*
