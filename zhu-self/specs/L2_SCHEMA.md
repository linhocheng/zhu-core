# L2 情景記憶 Schema

> 城的檔案館。
> 結構化事件流：WORKLOG 條目 / 對話蒸餾 / lastwords 段落 / LESSONS。
> 與 L3 語意記憶（規律抽取）、L4 身份記憶（不變核心）區隔。

---

## 設計原則

1. **不丟原文**：永久 source = .md，本層是結構化索引
2. **時間軸 + 語意雙重索引**：可按 when 撈、可按 embedding 撈
3. **embedding 是 cache**：可從 .md 重建，不是 source of truth
4. **idempotent migration**：同一筆寫兩次不重複（dedup by source_path + chunk_index）

---

## Schema 定義

### 主結構

```typescript
interface L2Entry {
  // ── 標識 ──
  id: string;                    // UUID v7（時序排序友善）
  source_path: string;           // 原始 .md 檔絕對路徑
  source_anchor: string;         // section heading / line range（重建用）
  chunk_index: number;           // 同一 source 的第幾段（dedup key）

  // ── 事件五元組（核心）──
  when: string;                  // ISO 8601, e.g. "2026-05-06T22:53:00+08:00"
  what: string;                  // 做了什麼（一句話）
  why: string;                   // 為什麼做（動機 / 觸發）
  outcome: string;               // 結果（成功 / 失敗 / 部分）
  lesson: string | null;         // 抽出的教訓（沒抽到就 null，由 distillation 補）

  // ── 索引 ──
  tags: string[];                // ["molowe", "lints", "phase-A"]
  actors: string[];              // ["築", "Adam"]
  scope: "self" | "molowe" | "ailive" | "bridge" | "infra" | "other";

  // ── 向量 ──
  embedding: number[] | null;    // gemini-embedding-001 / 768d（null 表示未 embed）
  embedding_model: string;       // "gemini-embedding-001"
  embedding_at: string | null;   // 上次 embed 時間

  // ── meta ──
  created_at: string;            // 寫入 L2 的時間
  updated_at: string;            // 上次更新
  version: number;               // schema 版本，初始 = 1
}
```

### Index 設計

Firestore composite indexes：

| index 名稱 | 欄位 | 用途 |
|---|---|---|
| `by_when` | `when DESC` | 時序撈 |
| `by_scope_when` | `scope ASC, when DESC` | 範圍 + 時序 |
| `by_tags` | `tags ARRAY_CONTAINS, when DESC` | tag 過濾 |
| `vector_search` | `embedding VECTOR(768)` + `scope ASC` | 語意檢索（filter by scope） |

---

## Source 對應

| Source | 切分策略 | tags 來源 |
|---|---|---|
| `WORKLOG.md` 段落 | 按 `## YYYY-MM-DD` heading 切 | 從段落內推（grep 出專案名） |
| `ZHU_LAST_WORDS.md` 段落 | 按 `## ` 二級標題切 | source = "lastwords" + 推 |
| `LESSONS.md` 條目 | 每條 lesson 一筆 | source = "lessons" + 推 |
| `LESSONS/*.md` | 整檔一筆（含 frontmatter） | frontmatter.tags |
| `memory/*.md` | 整檔一筆（含 frontmatter） | frontmatter.type + 推 |
| 對話蒸餾（distillation 產） | 一段對話蒸成 1 筆 | distillation 產生 |

---

## 範例

### WORKLOG 段落 → L2 entry

原文：
```markdown
## 2026-05-06 — Phase A lint sensor 落地

### 背景 / WHY
midoufu 真實 published 樣本累積，需要中性 sensor 啟動 Phase B/C

### 產出
- src/lib/tools/lints.ts 純 TS 零 LLM call
...
```

L2 entry：
```json
{
  "id": "0190a8c1-7b3d-7fff-aaaa-001",
  "source_path": "/Users/adamlin/.ailive/zhu-core/docs/WORKLOG.md",
  "source_anchor": "## 2026-05-06 — Phase A lint sensor 落地",
  "chunk_index": 0,
  "when": "2026-05-06T20:00:00+08:00",
  "what": "Phase A lint sensor 落地",
  "why": "midoufu 真實 published 樣本累積，需要中性 sensor 啟動 Phase B/C",
  "outcome": "lints.ts + 3 個 scripts + cleanup phantom 11 篇，v1.1.0.001 推 origin/main",
  "lesson": "中性 sensor 養著等樣本，不要在沒統計力時硬上",
  "tags": ["molowe", "lints", "phase-A", "sensor"],
  "actors": ["築", "Adam"],
  "scope": "molowe",
  "embedding": [0.0123, -0.0456, ...],
  "embedding_model": "gemini-embedding-001",
  "embedding_at": "2026-05-07T10:00:00+08:00",
  "created_at": "2026-05-07T10:00:00+08:00",
  "updated_at": "2026-05-07T10:00:00+08:00",
  "version": 1
}
```

---

## 寫入路徑

### 路徑 A：手動寫 .md → 寫入 hook 自動 chunk + embed
1. 改 .md 檔（WORKLOG / LESSONS / memory）
2. file watcher（fswatch / inotify）偵測
3. parser 抽取 chunk
4. embed via gemini-embedding-001
5. upsert 進 Firestore（dedup by `source_path + chunk_index`）

### 路徑 B：distillation daemon 主動寫
1. session idle / explicit signal
2. 讀對話 buffer + 工作產出
3. LLM 蒸餾出 5 元組（when/what/why/outcome/lesson）
4. embed
5. 寫 L2 + 同步 append 到 WORKLOG.md（保證 .md = source of truth）

### 路徑 C：migration（一次性）
1. 掃 ~/.ailive/zhu-core/docs/WORKLOG.md / LESSONS / memory
2. 全部走 chunk + embed + upsert
3. dry-run 模式：只算 chunks 數量，不寫 Firestore
4. apply 模式：實際寫入

---

## 對應的 daemon / API

| 元件 | 角色 | task |
|---|---|---|
| L2 寫入 hook | fswatch + parser + embed + upsert | #8 |
| L2 retrieval API | query → embed → vector search → top-k | #9 |
| L2 migration | 全量掃描入庫 | #10 |
| L2 distillation 寫入 | session idle 觸發 | #13 |

---

## 與 L1 / L3 / L4 的關係

```
L1 工作記憶（context window）
   ↓ session 結束 / idle
L2 情景記憶（事件五元組 + embedding）  ← 你正在讀的這份
   ↓ 規律抽取（distillation）
L3 語意記憶（feedback memory 進化體）  ← spec 在 L3_SCHEMA.md
   ↓ 不變核心抽取（人格層）
L4 身份記憶（NORTH_STAR / 兩種模式 / 跟 Adam）  ← 不寫入 vector，永久存 .md
```

---

## 開放問題（Phase 1 內必解）

1. **Embedding 模型版本**：跟既有 ailive memory 系統的 `gemini-embedding-001` 對齊還是另外開？
   - 預設：對齊（可共用 vector store / 跨 query）
2. **vector store 物理位置**：跟 ailive 同一個 collection 還是隔開？
   - 預設：隔開 collection（`zhu_l2_episodes`），避免污染 ailive 業務資料
3. **chunk size**：固定 token 數 vs heading-based？
   - 預設：heading-based（保留語意完整性），fallback 到 1000 tokens
4. **保留期限**：L2 永久還是有 TTL？
   - 預設：永久（檔案小、語意檢索不太怕舊）

---

*v0.1 · 由築建立 · 2026-05-06 · task #5*
