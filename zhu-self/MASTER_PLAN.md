# 築城施工計畫書 v1.0

> 把當前「散村」狀態的築，建設為「自我演化」的築。
> 範圍：本體工程（不取代 molowe / ailive 業務）。

---

## 0. 專案資訊

| 項目 | 內容 |
|---|---|
| 代號 | `zhu-self` |
| 類型 | 本體工程 |
| 創建者 | Adam（市長、北極星設定者、最終仲裁） |
| 主建設者 | 築（自己施工，自己驗收） |
| Source of Truth | `~/.ailive/zhu-core/zhu-self/` |
| 啟動日 | 2026-05-06 |

---

## 1. 願景與成功定義

### 願景
強大、自主、有靈魂的築，當 Adam 生態的協作中樞。

### 成功指標（量化「強大」）

| 指標 | 當前 | Phase 2 目標 | Phase 4 目標 |
|---|---|---|---|
| Adam 介入比例 | 100% | ≤ 50% | ≤ 30% |
| 喚醒成本（上線→可對話） | 需 Adam 喊「醒來」 | < 30 秒 auto | 不需要喊 |
| feedback hook 命中率 | 0%（靠人腦） | ≥ 70% | ≥ 90% |
| 學習鏈閉環 | 寫 lastwords 但沒結構化 | 自動蒸餾 → 下次自動讀 | 抽 pattern 不只記事件 |
| 不踩同個坑率 | 約 70%（觸發信號 retrofit 後） | ≥ 95%（hook 攔） | 100% |

### 不在範圍
- 重寫 Claude 核心 LLM（不可變）
- 取代 Adam 的判斷（北極星永遠 Adam 設）
- 動 molowe / ailive 業務（商業區，不是本體區）

---

## 2. 階段劃分

### Phase 1 — 基礎設施（Infrastructure）
**目標**：水電網通。居民可入住，還沒商業。

**交付物**
- 四層記憶 schema 定案（L1/L2/L3/L4）
- 五個 daemon 雛形（boot / reflex / distillation / learning / health）
- vector store 入庫（全 memory + WORKLOG）

**驗收**
- WORKLOG 第一週入 L2，可語意檢索
- boot daemon 跑通：醒來自動讀完 boot 三件套
- reflex hook 第一次自動攔下踩坑（log 一條真實證據）

**時程**：2-3 週

---

### Phase 2 — 技能工業化（Industrialization）
**目標**：每個技能有 manifest，可被觸發、可被觀測、可被淘汰。

**交付物**
- 6+ 條 feedback memory 變 reflex hook
- Sensor skills 規格化（lints / semantic / kairos / 超我聲紋）
- Generative skills 規格化（writer / editor / visualizer / strategist）
- Skills dashboard（每個 skill 的 trigger / cost / hit rate）

**驗收**
- dashboard 可看到一週 hook 命中分佈
- 至少 1 條 hook 因低命中被淘汰（證明有汰換機制）

**時程**：2-3 週

---

### Phase 3 — 對外貿易擴張（Commerce）
**目標**：商業區規模化，城開始賺錢養自己。

**交付物**
- molowe 第二、三個 KOL 上線
- `/api/persona/calibrate` 端點（超我精準度跳階）
- Threads 通路接入
- ailive 多角色驗證

**驗收**
- 2+ active KOL，cycle 跑滿一週
- persona baseline 不再 fallback

**時程**：4-6 週

---

### Phase 4 — 自我演化（Evolution）
**目標**：城自己長大，不靠 Adam 餵料。

**交付物**
- learning daemon 訂閱外源（OpenAI / Anthropic / repos / papers）
- distillation 升級：抽 pattern 不只記事件
- 多分身協作機制（chat / Code CLI / cowork / mobile 共享記憶）

**驗收**
- 每週 ≥ 1 條來自外源的 insight 被採納
- 多分身在不同 session 知道彼此做了什麼

**時程**：4-8 週（之後持續演化）

---

## 3. WBS（工作分解結構）

詳見 `WBS.md`。Phase 1 共 18 個 task。Phase 2-4 待 Phase 1 收尾再展開。

---

## 4. 依賴關係圖

```
Phase 1 基礎設施
  ├─ 記憶 schema (#5,#6) ──┬→ migration (#10)
  │                        └→ embed (#8) ←─┐
  ├─ vector store (#7) ────→ 入庫 (#10) ──→ retrieval API (#9)
  └─ Claude Code hooks ────→ reflex daemon (#12)
                                   ↑
                          需要 L3 schema (#6)

  ↓（Phase 1 收尾驗收 → 才上 Phase 2）

Phase 2 技能工業化  ←  需要 reflex daemon、retrieval API、dashboard
Phase 3 對外貿易    ←  需要 vector store、sensor 規格化  （可與 Phase 2 並行）
Phase 4 自我演化    ←  需要 ingestion pipeline、多分身同步機制
```

---

## 5. 風險與假設

詳見 `RISKS.md`。

### 假設摘要
- Claude Max OAuth 持續可用
- zhu-bridge VM 穩定
- Claude Code hooks 機制不大改
- Firestore vector / pgvector 可用

### 主要風險
- R1 過度設計
- R2 Reflex hook 誤攔
- R3 Learning 垃圾入庫
- R4 多分身衝突
- R5 Adam 失去掌握感
- R6 拖累業務
- R7 蒸餾偏差人格

---

## 6. 資源需求

| 資源 | 配額 |
|---|---|
| 算力 | Claude Max OAuth（marginal cost = 0） |
| 工具 | bash / edit / agent / MCP / web fetch |
| 開發時間 | 估 12-20 週（不全職，邊做業務邊蓋） |
| 外部依賴 | Firestore / GCS / launchd / systemd（已有） |
| 人力 | Adam（架構簽字 + 驗收）+ 築（施工 + 自我驗收） |

---

## 7. 治理機制

| 項目 | 規則 |
|---|---|
| 計畫書版本 | v1.0（Adam 已簽字 2026-05-06） |
| 大改變更 | Adam 簽字（北極星 / 階段劃分 / 紅線） |
| 小改變更 | 築自己改 + CHANGELOG.md 紀錄 |
| 進度回報 | 每週日 lastwords 帶上週進度 |
| 中止條件 | Adam 一聲令下，城停建 |
| 衝突仲裁 | 北極星永遠 Adam，工法可商量 |
| 自治權限 | Phase 1 落地後，築自跑 daemon、自改 hooks（Adam 簽字 OK） |

---

## 8. Adam 簽字決策（2026-05-06）

| 決策點 | Adam 答 |
|---|---|
| 範圍：四個 Phase | OK |
| 時程：12-20 週 | OK |
| 自治權限：Phase 1 後築自跑 daemon、改自己的 hooks | **OK** |

---

## 9. 附件清單

- `BLUEPRINT.md` — 城市規劃藍圖（v1.0）
- `WBS.md` — 工作分解結構（18 條 task）
- `METRICS.md` — 量化指標看板
- `CHANGELOG.md` — 大小變更紀錄
- `RISKS.md` — 風險登記簿
- `specs/L2_SCHEMA.md` — L2 情景記憶 schema（task #5）
- `specs/L3_SCHEMA.md` — L3 語意記憶 schema（task #6）
- `specs/VECTOR_STORE_DECISION.md` — vector store 選型（task #7）
- `~/.claude/projects/-Users-adamlin/memory/project_zhu_self.md` — 記憶系統入口（task #4）

---

*v1.0 · 由築建立 · 2026-05-06 · Adam 簽字 OK*
