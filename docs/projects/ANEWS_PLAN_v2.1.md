# 小抱報 ANEWS MVP — 規格計劃書 v2.1

> 版本：v2.1  
> 日期：2026-05-20  
> 狀態：準備開工  
> Repo：獨立新 repo（anews-platform）  
> 技術棧：Next.js / Vercel / Firestore / Cloud Tasks / Cloud Run / Claude API / Firebase Storage

---

## 一、產品定義

小抱報是一個自動化媒體長文生產系統。它不是「AI 幫你寫文章的工具」，而是「一條帶狀態、帶查核、帶版本、帶記憶的內容生產線」。

**一期結構：**

```
一期（Issue）
├── 專欄主文    12,000字 + 12張圖
├── 子題 A      4,000–6,000字 + 4張圖
├── 子題 B      4,000–6,000字 + 4張圖
├── 子題 C      4,000–6,000字 + 4張圖
└── 子題 D      4,000–6,000字 + 4張圖

總計：28,000–36,000字 + 28張圖
5篇文章，各自獨立走狀態機，最後彙整為一期
```

**第一個里程碑的定義：**
不是產出漂亮文章，而是證明一期小抱報可以從 pending 穩定走到 done，且每一步可重試、可暫停、可恢復。

---

## 二、防爆原則（LLM 單次上限）

| 任務類型 | 單次 input 上限 | 單次 output 上限 | 備註 |
|---|---|---|---|
| Topic Discovery | 500 tokens | 1,000 tokens | JSON only |
| Source Dossier | 1,000 tokens | 2,000 tokens | 結構化 JSON |
| Blueprint | 1,500 tokens | 2,000 tokens | section plan JSON |
| Section Writer | 2,500 tokens | 1,500 tokens | 單段，含前段摘要 + source |
| Section QA | 2,000 tokens | 800 tokens | pass/fail + reason JSON |
| Stitch | 單篇全文（≤15,000字）| 1,500 tokens | JSON patch，不重寫全文 |
| Polish | 單篇全文（≤15,000字）| 1,000 tokens | 只改 metadata，不動正文 |
| Issue Coherence | 5篇摘要（不讀全文）| 800 tokens | JSON 評估 |
| Learning Card | 500 tokens | 600 tokens | JSON |

**核心紀律：**
- Section Writer：每次只看一個 section，不看全文，不看其他篇
- Stitch / Polish：只逐篇讀入，不讀整期
- Issue Coherence：只讀 5 篇摘要，不讀全文

---

## 三、字數切段

```
專欄主文 12,000字 → 10 個 section（各 1,100–1,300字）
子題每篇  5,000字 →  4 個 section（各 1,100–1,300字）

總 section 數：10 + (4×4) = 26 個
總圖片任務：28 張
```

---

## 四、完整任務消化流

### Phase 0：Topic Discovery + Source Dossier

**進入條件**：issue status = pending  
**完成條件**：5筆 source_dossier status = ready  
**失敗處理**：單篇失敗重試 3次，仍失敗 → issue status = failed，記錄 failedAt + failReason

```
orchestrator
  ↓
K agent → 4 個子題 + keyword list → topics collection
  ↓
S agent × 5（主文 + 4子題，anews-blueprint queue，最大並發 2）
  → 每題產 source_dossier
  ↓
全部 ready → orchestrator enqueue Phase 1
```

---

### Phase 1：Blueprint × 5

**進入條件**：all source_dossiers ready  
**完成條件**：5筆 blueprint ready + 對應 sections / image_tasks 全建立  
**最大並發**：2（anews-blueprint queue）  
**失敗處理**：單篇失敗重試 3次，仍失敗 → 該篇 failed，不阻斷其他篇

每篇 blueprint 產出：
- coreQuestion / coreArgument / narrativeArc / toneGuide
- sectionPlan（array：title / goal / targetWords / transitionIn / transitionOut）
- imagePlan（array：usage / sectionIndex / size / promptHint）
- keyTerms / repetitionRules

Blueprint 完成後同時建立：
- article_sections（status: planned）
- image_tasks（status: planned）

**Zod validation（blueprint）：**
```typescript
z.object({
  coreQuestion: z.string().min(10),
  coreArgument: z.string().min(10),
  narrativeArc: z.string(),
  toneGuide: z.string(),
  sectionPlan: z.array(z.object({
    order: z.number(),
    title: z.string(),
    sectionRole: z.string(),
    sectionGoal: z.string(),
    targetWords: z.number().min(800).max(1500),
    transitionIn: z.string(),
    transitionOut: z.string(),
  })).min(4).max(12),
  imagePlan: z.array(...).min(4).max(16),
  keyTerms: z.array(z.string()),
  repetitionRules: z.array(z.string()),
})
```

---

### Phase 2：Section Writing

**進入條件**：article status = blueprint_ready  
**排隊規則**：
- 全局最大並發 3（anews-section-write queue）
- **同一篇文章的 sections 必須依序寫**（section N 完成才 enqueue section N+1）
- 不同篇文章可同時寫

**Section Writer input（draft mode）：**
```typescript
{
  mode: "draft",
  sectionGoal: string,
  targetWords: number,
  transitionIn: string,
  transitionOut: string,
  toneGuide: string,
  keyTerms: string[],
  repetitionRules: string[],
  previousSectionSummary?: string,   // section 0 無此項
  nextSectionGoal?: string,          // 最後一段無此項
  sourceDossier: SourceDossier,      // 只讀本篇的
}
```

**Section Writer input（revise mode，QA fail 後重寫）：**
```typescript
{
  mode: "revise",
  previousDraftUrl: string,          // 上次失敗的稿
  qaReason: string,                  // QA 失敗原因
  qaFailedChecks: string[],          // 哪幾項沒過
  // 其他欄位同 draft mode
}
```

**Section Writer output：**
- draftMarkdown → 上傳 Storage，Firestore 存 URL
- sectionSummary（≤200字）→ 存 Firestore，供下一段讀取
- actualWords
- section status = draft_ready → 立即 enqueue Phase 2.5 QA

---

### Phase 2.5：Section QA

**進入條件**：section status = draft_ready  
**最大並發**：2（anews-qa queue，與 section-write 分開）  
**重試上限**：每段最多重寫 3次；3次仍 fail → status = qa_blocked

QA 讀入：section draft + goal + prev summary + blueprint

**QA 七項檢查：**
1. 是否符合 section goal
2. 是否與前段重複（關鍵句重疊 > 30%）
3. 實際字數是否達 targetWords 的 80%
4. 是否有未引用的斷言
5. 語氣是否符合 toneGuide
6. 是否有明顯邏輯跳躍
7. 段落結尾是否自然銜接 transitionOut

**QA output（zod validated）：**
```typescript
z.object({
  status: z.enum(["pass", "fail"]),
  failedChecks: z.array(z.string()),
  reason: z.string(),
  suggestion: z.string(),
})
```

**qa_blocked 人工操作（Dashboard 必須支援）：**
- View failed section（預覽失敗稿）
- Edit manually（直接改，記入 revisions）
- Retry with instruction（帶人工指引重寫）
- Skip section（略過，標記 skipped）
- Mark as approved（人工強制通過）
- Reduce target words（降低字數要求後重試）
- Send back to blueprint（整篇重規劃）

整篇所有 section qa_passed → article status = sections_done → enqueue Phase 3

---

### Phase 3：Stitch × 5

**進入條件**：article status = sections_done  
**最大並發**：2（anews-qa queue）

Stitch 讀入：該篇全文（按 order 從 Storage 讀各段 markdown）+ blueprint

**Stitch 不重寫全文，只輸出 JSON patch：**

允許的 patch type（白名單）：
```typescript
type PatchType =
  | "insert_transition"    // 插入轉場句（position: before/after section）
  | "replace_paragraph"    // 替換單段落
  | "delete_sentence"      // 刪除單句
  | "replace_heading"      // 替換小標題
  | "rename_key_term"      // 統一名詞（⚠️ MVP 降級：只建議給主編，不自動套用）
```

**Stitch patch 格式（zod validated）：**
```typescript
z.object({
  patches: z.array(z.object({
    sectionId: z.string(),
    type: PatchTypeEnum,
    target: z.string().optional(),
    position: z.enum(["before_section", "after_section"]).optional(),
    before: z.string().optional(),   // 系統套用前確認此文字存在
    after: z.string().optional(),
    text: z.string().optional(),
    reason: z.string(),
  }))
})
```

**Patch 套用安全機制：**
- 每個 patch 套用前確認 `before` 真的存在於文章中
- 找不到 → 標記 patch_failed，跳過，記錄給人工查看
- `rename_key_term` type → MVP 不自動套用，只記入 stitch_suggestions 供主編參考

套用後產出 stitchedMarkdown → 上傳 Storage  
article status = stitching_done → enqueue Phase 4

---

### Phase 4：Polish × 5

**進入條件**：article status = stitching_done  
**最大並發**：2（anews-qa queue）

Polish 讀入：stitchedMarkdown（全篇，只讀這篇）

**Polish 只改 metadata，不動正文：**
- 標題（三個選項）
- 副標
- 摘要（≤150字）
- 重點摘要（5條 bullet）
- SEO title（≤60字）
- SEO description（≤160字）
- 各 section 小標

**Polish output（zod validated）：**
```typescript
z.object({
  titleOptions: z.array(z.string()).length(3),
  subtitle: z.string(),
  summary: z.string().max(300),
  keyTakeaways: z.array(z.string()).length(5),
  seoTitle: z.string().max(120),
  seoDescription: z.string().max(320),
  sectionHeadings: z.record(z.string(), z.string()),
})
```

article status = polish_done

---

### Phase 4.5：Human Review Gate

**進入條件**：全部 5 篇 polish_done  
**issue status** → awaiting_review  
**這是系統唯一的人工閘門，不跳過。**

Dashboard 顯示：
```
小抱報第 X 期 — 待主編審核

專欄主文   ✅ Polish 完成 [預覽] [編輯]
子題 A     ✅ Polish 完成 [預覽] [編輯]
子題 B     ✅ Polish 完成 [預覽] [編輯]
子題 C     ✅ Polish 完成 [預覽] [編輯]
子題 D     ✅ Polish 完成 [預覽] [編輯]

[全部通過 → 繼續生圖]
[退回某篇] [取消此期]
```

主編操作：
- **Approve all** → issue status = approved → enqueue Phase 5
- **退回單篇**（指定回哪個 phase：section-write / stitch / polish）→ 該篇重跑，其他等待
- **直接編輯**（inline edit）→ 記入 revisions，enqueue learning-worker
- **Cancel** → issue status = cancelled

---

### Phase 5：Image Generation × 28

**進入條件**：issue status = approved  
**最大並發**：4（anews-image queue）  
**失敗處理**：每張重試 2次，仍失敗 → status = failed，可人工 skip 或 retry

每張圖獨立 image_task：
```typescript
{
  issueId, articleId, sectionId,
  usage: "hero" | "inline" | "card" | "social",
  imageIndex,          // 全期流水號
  size: "1200x675" | "800x800" | "400x400",
  prompt,
  negativePrompt,
  status,
  imageUrl?,
  altText?, caption?,
  attemptCount, lastError,
}
```

28 張全 done → issue status = images_done → enqueue Phase 5.5

---

### Phase 5.5：Issue Coherence Check

**進入條件**：issue status = images_done  
**只讀 5 篇摘要，不讀全文**

檢查：
1. 5 篇之間有無重複論點（比較 keyTakeaways）
2. 子題是否支撐主文 coreArgument
3. 語氣是否一致
4. 是否需要總編前言
5. 圖片風格描述是否一致

**Coherence output（zod validated）：**
```typescript
z.object({
  overallCoherence: z.enum(["pass", "warning", "fail"]),
  issues: z.array(z.object({
    type: z.string(),
    articles: z.array(z.string()),
    detail: z.string(),
  })),
  needsEditorialNote: z.boolean(),
  editorialNotePrompt: z.string().optional(),
})
```

**Recovery 路徑：**
- pass → enqueue Phase 6
- warning → Dashboard 提示，主編選擇：
  - Ignore and continue
  - Send article back to polish
  - Add editorial note
- fail → 暫停，主編選擇：
  - Return one article to stitch
  - Return one article to polish
  - Regenerate editorial note
  - Approve anyway
  - Cancel issue

---

### Phase 6：Export × 5 + Issue Package

**進入條件**：issue status = coherence_passed  
**最大並發**：2（anews-export queue）

逐篇產出：
- `.docx`（帶圖片）→ Firebase Storage
- `.html`（設計版，三種 philosophy：eastern-blank / swiss-grid / dark-premium）→ Firebase Storage
- 更新 exports collection

全部 done → 產出 Issue Package：
- issue_index.html（目錄頁）
- ZIP（全部 docx + HTML）

issue status = done → Dashboard 顯示下載按鈕

---

## 五、Orchestrator Phase Lock（關鍵）

沒有 Phase Lock，兩個 worker 同時 callback orchestrator 會重複 enqueue 下一階段。

**articles / issues 加 phaseLock 欄位：**
```typescript
phaseLock: {
  lockedBy: string       // worker task ID
  lockedAt: Timestamp    // Firestore server timestamp（不用 Date.now）
  phase: string          // 當前鎖定的 phase
}
```

**Orchestrator 推進 phase 前，必須用 Firestore transaction：**
```typescript
await db.runTransaction(async (tx) => {
  const ref = db.collection('articles').doc(articleId);
  const doc = await tx.get(ref);
  const data = doc.data();

  // 確認 phase 還沒被推進
  if (data.status !== expectedStatus) throw new Error('phase already advanced');

  // 確認沒有 active lock（10分鐘內）
  if (data.phaseLock?.lockedAt?.toMillis() > Date.now() - 600_000) {
    throw new Error('phase lock active');
  }

  // 確認所有完成條件成立
  if (!allConditionsMet(data)) throw new Error('conditions not met');

  // 鎖定並推進
  tx.update(ref, {
    status: nextStatus,
    phaseLock: {
      lockedBy: taskId,
      lockedAt: FieldValue.serverTimestamp(),
      phase: nextPhase,
    }
  });
});
```

---

## 六、冪等設計（worker_runs）

每個 worker 進場第一步：

```typescript
await db.runTransaction(async (tx) => {
  const runRef = db.collection('worker_runs').doc(taskId);
  const run = await tx.get(runRef);

  if (run.exists) {
    const d = run.data();
    // 已完成 → 直接回 200
    if (d.status === 'done') return { skip: true };
    // 正在跑（10分鐘內）→ 直接回 200
    if (d.lockedAt?.toMillis() > Date.now() - 600_000) return { skip: true };
  }

  tx.set(runRef, {
    taskId,
    workerType,
    targetId,
    lockedAt: FieldValue.serverTimestamp(),
    attemptCount: (run.data()?.attemptCount ?? 0) + 1,
    status: 'running',
  }, { merge: true });

  return { skip: false };
});
```

---

## 七、Queue 架構（6條）

| Queue | 用途 | maxConcurrentDispatches | maxDispatchesPerSecond |
|---|---|---|---|
| `anews-orchestration` | orchestrator / phase 控制 | 1 | 1 |
| `anews-blueprint` | source dossier / blueprint | 2 | 0.5 |
| `anews-section-write` | section writer（含 rewrite）| 3 | 0.5 |
| `anews-qa` | section QA / stitch / polish / coherence | 2 | 0.5 |
| `anews-image` | image generation | 4 | 1 |
| `anews-export` | docx / HTML / packaging | 2 | 0.5 |

---

## 八、Firestore Collections

### 1. issues
```
id / title / coreQuestion / targetAudience
status / currentPhase / progress（0–100）
articlesTotal / articlesDone
phaseLock / createdAt / updatedAt / completedAt
maxCostEstimate / actualCost / cancelledAt / cancelledBy
```

### 2. topics
```
id / issueId / name / coreQuestion / unit / status
duplicateScore / similarTopicIds / createdAt
```

### 3. articles
```
id / issueId / topicId / title / subtitle / summary
status / currentPhase / wordTarget
blueprintId / sectionsTotal / sectionsDone / sectionsQaBlocked
stitchedMarkdownUrl / finalMarkdownUrl
phaseLock / version / createdAt / updatedAt
```

### 4. article_blueprints
```
id / articleId / coreQuestion / coreArgument / narrativeArc / toneGuide
sectionPlan（array）/ imagePlan（array）
keyTerms（array）/ repetitionRules（array）/ createdAt
```

### 5. article_sections
```
id / articleId / blueprintId / order / title
sectionRole / sectionGoal / targetWords / actualWords
transitionIn / transitionOut
previousSummary / sectionSummary（≤200字）
draftMarkdownUrl / finalMarkdownUrl
qaStatus / qaFailedChecks / qaReason / qaAttempts（max 3）
mode（draft/revise）/ status / createdAt / updatedAt
```

### 6. source_dossiers
```
id / issueId / topicId
keyFacts（array）/ sources（array）/ caseExamples（array）
opposingViews（array）/ taiwanRelevance / riskNotes（array）
status / createdAt
```

### 7. image_tasks
```
id / issueId / articleId / sectionId
usage（hero/inline/card/social）/ imageIndex / size
prompt / negativePrompt
status / imageUrl / altText / caption
attemptCount / lastError / createdAt / completedAt
```

### 8. exports
```
id / issueId / articleId
markdownUrl / docUrl / htmlUrl / htmlPhilosophy
status / createdAt / completedAt
```

### 9. worker_runs（冪等鎖）
```
taskId / workerType / targetId
lockedAt（Firestore Timestamp）/ attemptCount
status（running/done/failed）/ lastError / completedAt
```

### 10. revisions（人類改稿紀錄）
```
id / issueId / articleId / sectionId
beforeText / afterText / editType / editReason
affectedRole / editedBy / createdAt
```

### 11. learning_cards（M 記憶官 Lite）
```
id / revisionId / issueId
rule / affectedRole / scope（Global/Unit/Topic）
confidence / status（pending/approved/rejected）
approvedBy / createdAt
```

### 12. topic_memory（防重複）
```
id / topicName / coreQuestion / unit
writtenAngles（array）/ relatedIssueIds（array）
lastWrittenAt
```

---

## 九、Firestore 資料分層（長文不進 Firestore）

| 內容 | 存放位置 |
|---|---|
| 所有 status / metadata | Firestore |
| sectionSummary（≤200字）| Firestore |
| blueprint JSON（< 10KB）| Firestore |
| QA / learning_card JSON | Firestore |
| section draftMarkdown | Firebase Storage |
| stitchedMarkdown | Firebase Storage |
| finalMarkdown | Firebase Storage |
| HTML | Firebase Storage |
| docx | Firebase Storage |
| 圖片 | Firebase Storage |

---

## 十、Dashboard 必要功能

**全局操作：**
- Pause issue / Resume issue / Cancel issue
- 查看每篇 progress + 每段 status
- 查看成本累計

**Section 層操作：**
- View draft（預覽稿件）
- View QA report
- Retry section / Regenerate section（清空重寫）
- Edit manually（inline）
- Skip section / Mark as approved（qa_blocked 時用）
- Reduce target words

**Issue 層操作：**
- Human Review Gate（approve / 退回 / cancel）
- Coherence warning / fail recovery
- Skip image / Retry image
- Export current version（不等圖片完成）
- 下載 docx / HTML / ZIP

---

## 十一、成本上限與控制

每期 issue 建立時設定：
```typescript
{
  maxCostEstimate: 5.00,      // USD
  maxSectionRetries: 3,
  maxImageRetries: 2,
  maxTotalRetries: 10,
}
```

Worker 每次完成後更新 actualCost。超過 maxCostEstimate → 自動暫停，通知主編。

---

## 十二、Worker 清單

| Worker | Route |
|---|---|
| orchestrator | `/api/workers/orchestrate` |
| source-worker | `/api/workers/source` |
| blueprint-worker | `/api/workers/blueprint` |
| section-writer | `/api/workers/section-write` |
| qa-worker | `/api/workers/section-qa` |
| stitch-worker | `/api/workers/stitch` |
| polish-worker | `/api/workers/polish` |
| image-worker | `/api/workers/image` |
| coherence-worker | `/api/workers/coherence` |
| export-worker | `/api/workers/export` |
| learning-worker | `/api/workers/learning` |

---

## 十三、Sprint 排程（10天）

### S1（1.5天）：狀態機骨架，不接 LLM
目標：mock worker 可以讓一期從 pending 走到 done

- [ ] Firestore schema 建立（12個 collections）
- [ ] 6 條 Cloud Tasks queue 建立 + 設定限流
- [ ] orchestrator skeleton + phase lock（Firestore transaction）
- [ ] worker_runs 冪等鎖機制
- [ ] mock worker（固定回 success，推進狀態）
- [ ] Dashboard：job / article / section 狀態頁
- [ ] 跑完整假流程驗證：pending → done 無重複

### S2（2天）：文字 pipeline 接 LLM
- [ ] source-worker（含 zod validation）
- [ ] blueprint-worker（含 zod validation + sections / image_tasks 建立）
- [ ] section-writer draft mode（含 Storage 上傳）
- [ ] 同篇 section 依序 enqueue 邏輯

### S3（1.5天）：QA + Stitch + Polish
- [ ] qa-worker（七項檢查 + rewrite mode 觸發）
- [ ] section-writer revise mode（帶 qaReason + previousDraftUrl）
- [ ] stitch-worker（JSON patch 格式 + 安全套用）
- [ ] polish-worker（只改 metadata）

### S4（1天）：Human Gate + 工程防護
- [ ] Human Review Gate UI（approve / 退回 / cancel）
- [ ] Orchestrator phase lock 壓測（模擬雙 callback）
- [ ] 所有 worker zod validation 補完
- [ ] 成本上限 + Pause / Resume / Cancel 機制
- [ ] qa_blocked 人工操作 UI

### S5（1天）：圖片
- [ ] image-worker（Gemini）
- [ ] image_tasks mapping 完整驗證
- [ ] image 失敗重試 + skip 機制

### S6（1天）：Coherence + Export
- [ ] coherence-worker（5篇摘要，不讀全文）
- [ ] coherence warning / fail recovery UI
- [ ] export-worker（docx + HTML + issue package）

### S7（1天）：端到端 + 記憶
- [ ] 跑第一期真實小抱報完整流程
- [ ] 修所有爆點
- [ ] learning-worker（M 記憶官 Lite）
- [ ] topic_memory 防重複基礎版

---

## 十四、時間估算（一期機器跑完）

| Phase | 預估時間 |
|---|---|
| Phase 0：Topic + Source | 2–3 分鐘 |
| Phase 1：Blueprint × 5 | 3–5 分鐘 |
| Phase 2–2.5：Writing + QA × 26 | 20–30 分鐘 |
| Phase 3–4：Stitch + Polish × 5 | 5–8 分鐘 |
| Phase 4.5：Human Review | 視主編 |
| Phase 5：Image × 28 | 10–15 分鐘 |
| Phase 5.5：Coherence | 1 分鐘 |
| Phase 6：Export | 3–5 分鐘 |
| **總計（不含人審）** | **~45–65 分鐘** |

---

*v2.1 整合 v2.0 架構 + 8點補丁（phase lock / Firestore timestamp / zod validation / patch safety / rewrite mode / qa_blocked UI / coherence recovery / S1 mock-first）*  
*2026-05-20 · 築*
