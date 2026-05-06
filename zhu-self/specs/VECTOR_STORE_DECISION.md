# Vector Store 選型決策

> 給 L2 / L3 的索引層用。
> 不是 source of truth（那是 .md），是檢索 cache。

---

## 候選清單

| 候選 | 類型 | 已會用嗎 |
|---|---|---|
| Firestore + Vector Search | 託管，跟 GCP 整合 | ✅（米豆芙、鏡 IG 用過） |
| pgvector | 自託 Postgres extension | ⬜（要架 DB） |
| Turbopuffer | 託管純向量 DB | ⬜（要新帳號） |
| Pinecone | 託管純向量 DB | ⬜（要新帳號） |
| Qdrant | 自託 / 託管 | ⬜ |
| ChromaDB | 內嵌 / 自託 | ⬜（適合 prototype） |

---

## 評估維度

| 維度 | 權重 | 說明 |
|---|---|---|
| 上手成本 | 高 | 已會用優先 |
| 與既有架構契合 | 高 | molowe / ailive 已用 Firestore |
| Marginal cost | 高 | Phase 0-1 不要付額外帳單 |
| 寫入頻率支援 | 中 | L2 寫入頻率不高（每天 < 100 chunks） |
| 跨機器存取 | 中 | AIR + bridge VM 都要能讀 |
| 延遲（query） | 中 | 互動式檢索要 < 500ms |
| 過濾能力 | 高 | scope / tags / time range 過濾 |
| Embedding 模型自由度 | 中 | gemini-embedding-001 已選定（task #5） |

---

## 對比表

| 維度 | Firestore vector | pgvector | Turbopuffer | Pinecone |
|---|---|---|---|---|
| 上手成本 | ★★★★★ 已會 | ★★ 要架 | ★★★ 新註冊 | ★★★ 新註冊 |
| 與既有架構契合 | ★★★★★ molowe/ailive 都用 | ★★ 額外 stack | ★★ 額外 stack | ★★ 額外 stack |
| Marginal cost | ★★★★ Free tier 足 | ★★★ VM cost | ★★★★ Free tier | ★★★ 要付費 |
| 寫入頻率 | ★★★★ 適合低頻 | ★★★★★ 任意 | ★★★★★ 任意 | ★★★★★ 任意 |
| 跨機器存取 | ★★★★★ 託管 | ★★★ 自架要開埠 | ★★★★★ 託管 | ★★★★★ 託管 |
| Query 延遲 | ★★★ ~300-500ms | ★★★★ < 100ms | ★★★★★ ~50ms | ★★★★ ~100ms |
| 過濾能力 | ★★★ 需 composite index | ★★★★★ 完整 SQL | ★★★★ filter expr | ★★★ namespace |
| Embedding 模型 | ★★★★★ 任意 | ★★★★★ 任意 | ★★★★★ 任意 | ★★★★★ 任意 |

---

## 已知踩雷（從既有 memory）

`feedback_firestore_vector_search.md` 紀錄：
- model 名稱已改 `gemini-embedding-001`
- where + findNearest 要 composite index
- vercel env pull 預設 development

→ Firestore 路線**雷已踩過、解法在記憶裡**，繼續走風險低。

---

## 決策

**選 Firestore Vector Search。**

### 理由

1. **已會用**：molowe / ailive 都跑這條，築不用學新東西
2. **跨機器**：託管，AIR + bridge VM + Vercel cron 都能讀
3. **Marginal cost = 0（短期）**：Free tier 足以撐 Phase 1（L2 entries 估 < 5000、L3 < 50）
4. **踩雷已知**：composite index、env pull、model name 三個雷已寫進記憶
5. **整合既有 admin SDK**：molowe 的 `lib/firebase-admin.ts` 直接重用

### 缺點與緩解

| 缺點 | 緩解 |
|---|---|
| Query 延遲較高（~500ms） | 互動式檢索可接受；Phase 2 加 in-memory cache |
| 過濾要 composite index | 提前定義 index，寫進 Firestore rules deploy |
| Free tier 寫入次數有限 | 監控用量；超量自動升 Blaze tier |

---

## 實施計畫（task #8/#9/#10 用）

### Collection 設計

```
zhu_l2_episodes/             ← L2 情景記憶
  {entry_id}/
    當作普通 doc，含 embedding 欄位

zhu_l3_rules/                ← L3 語意記憶（規則）
  {rule_id}/
    含 detectors 陣列、embedding、observation metrics

zhu_l3_hits/                 ← L3 命中 log
  {hit_id}/
    rule_id, when, tool_args, severity, was_blocked

zhu_l4_identity/             ← L4 身份記憶（不寫向量）
  north_star, modes, relations 三個固定 doc
```

### Indexes 必建

```
zhu_l2_episodes:
  - (scope ASC, when DESC)
  - (tags ARRAY_CONTAINS, when DESC)
  - VECTOR(embedding) + scope filter

zhu_l3_rules:
  - (state ASC, hit_count_30d DESC)
  - VECTOR(embedding)

zhu_l3_hits:
  - (rule_id ASC, when DESC)
  - (when DESC)
```

### 連線方式

- AIR 本機：用 `~/.ailive/molowe-platform/lib/firebase-admin.ts` 樣板，service account key 從 Secret Manager 拉
- bridge VM：同上，用 GCP metadata server 拉 default credentials
- Vercel：env vars 注入 service account JSON

---

## 時程

- task #8 寫入 hook：依本決策實作
- task #9 retrieval API：用 admin SDK `findNearest()`
- task #10 全量 migration：node script + admin SDK

---

*v0.1 · 由築建立 · 2026-05-06 · task #7*
