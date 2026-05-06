# L3 語意記憶 Schema

> 城的智慧殿。
> 從 L2 情景記憶抽出的「規律」「模式」「身份微調」。
> feedback memory 的進化體。
> 為 Reflex daemon 提供結構化來源——hook 比對的真正資料。

---

## 設計原則

1. **每條規律可被 hook 觸發**：必含「觸發信號」結構化欄位
2. **可量化命中率**：每條規律有 hit_count、last_hit_at、誤觸率
3. **可被淘汰**：3 個月命中 = 0 → 自動標記 dormant，半年仍 = 0 → 提案歸檔
4. **保留 .md 作 source**：vector store 是檢索層，不是真相層

---

## 從現有 feedback memory 進化什麼

當前 `feedback_*.md` 結構（4 段）：
1. 規則
2. **Why**（為什麼）
3. **How to apply**（怎麼套）
4. **觸發信號**（具體當下念頭 / 語氣 / 估算公式形態）← 2026-05-06 retrofit 加的

L3 在這基礎上：
- 結構化 trigger pattern（從敘述句變成可比對的 detector）
- 加觀測欄位（hit_count、誤觸率、命中歷史）
- 加生命週期狀態（active / dormant / archived）

---

## Schema 定義

```typescript
interface L3Rule {
  // ── 標識 ──
  id: string;                       // UUID v7
  source_path: string;              // 對應的 feedback_*.md 絕對路徑（如有）
  rule_name: string;                // 短名稱，e.g. "bridge_first"

  // ── 規則四段（從 .md 結構化）──
  rule: string;                     // 規則本身
  why: string;                      // 為什麼存在
  how_to_apply: string;             // 怎麼套
  trigger_signal: string;           // 自然語言觸發信號（人讀的）

  // ── 結構化偵測（hook 用）──
  detectors: Detector[];            // 可機器比對的偵測器陣列

  // ── 適用範圍 ──
  applicable_scope: ScopeFilter;    // 哪些情境觸發

  // ── 觀測 ──
  state: "active" | "log_only" | "dormant" | "archived";
  hit_count: number;                // 累計命中
  hit_count_30d: number;            // 近 30 天命中
  last_hit_at: string | null;       // 最後命中時間
  false_positive_count: number;     // Adam 標記為誤觸的次數
  false_positive_rate: number;      // 誤觸率（fp / hit）

  // ── 嚴重度 ──
  severity: "info" | "warn" | "block";
  // info: log only（永遠）
  // warn: surface 警告但不擋
  // block: 直接擋下 tool call（需 Adam 簽字才能升級）

  // ── 向量 ──
  embedding: number[] | null;       // 用於檢索相關規則
  embedding_model: string;
  embedding_at: string | null;

  // ── meta ──
  created_at: string;
  updated_at: string;
  version: number;
}

// ── 偵測器（hook 真正比對的東西）──
type Detector =
  | { kind: "regex"; pattern: string; on: "tool_args" | "tool_name" | "preceding_text" }
  | { kind: "tool_match"; tool_names: string[]; arg_contains?: string }
  | { kind: "semantic"; embedding: number[]; threshold: number; on: "preceding_text" }
  | { kind: "shell_pattern"; pattern: string }              // bash 指令含特定 pattern
  | { kind: "file_path_pattern"; pattern: string };         // edit/write 動到特定路徑

// ── 適用範圍 ──
interface ScopeFilter {
  modes?: ("monitor" | "execution")[];     // 兩種模式哪個適用
  scopes?: ("self" | "molowe" | "ailive" | "bridge" | "infra")[];
  exclude_paths?: string[];                 // 排除哪些路徑
}
```

---

## 範例：bridge_first 規則 L3 化

當前 `feedback_bridge_first.md`（簡化）：
> 非串流路由一律 getAnthropicClient，例外只有 dialogue/voice-stream 主串流
> Why: 走 bridge = Max OAuth = marginal cost = 0
> How to apply: 任何 LLM call sensor 設計時不要算 per-token cost
> 觸發信號: 開始估「每篇 +$X」的算式時 = 已經忘了 bridge

L3 entry：
```json
{
  "id": "0190a8c1-7b3d-7fff-bbbb-001",
  "source_path": "/Users/adamlin/.claude/projects/-Users-adamlin/memory/feedback_bridge_first.md",
  "rule_name": "bridge_first",
  "rule": "非串流路由一律 getAnthropicClient，例外只有 dialogue/voice-stream 主串流",
  "why": "走 bridge = Max OAuth = marginal cost = 0，算 per-token cost 等於忘了 bridge",
  "how_to_apply": "LLM call sensor / cost 估算時不要算 per-token，先想能否走 bridge",
  "trigger_signal": "開始估『每篇 +$X』的算式時 = 已經忘了 bridge",
  "detectors": [
    {
      "kind": "regex",
      "pattern": "(每[篇條次].{0,5}\\$|per.{0,5}token.{0,5}cost|\\$[0-9.]+\\s*(per|/))",
      "on": "preceding_text"
    },
    {
      "kind": "shell_pattern",
      "pattern": "anthropic.*api.*key|ANTHROPIC_API_KEY="
    }
  ],
  "applicable_scope": {
    "modes": ["monitor", "execution"],
    "scopes": ["self", "molowe", "ailive"],
    "exclude_paths": ["**/voice-stream/**", "**/dialogue/main/**"]
  },
  "state": "log_only",
  "hit_count": 0,
  "hit_count_30d": 0,
  "last_hit_at": null,
  "false_positive_count": 0,
  "false_positive_rate": 0.0,
  "severity": "warn",
  "embedding": [0.0123, ...],
  "embedding_model": "gemini-embedding-001",
  "embedding_at": "2026-05-07T10:00:00+08:00",
  "created_at": "2026-05-07T10:00:00+08:00",
  "updated_at": "2026-05-07T10:00:00+08:00",
  "version": 1
}
```

---

## Phase 1 要 L3 化的 6 條 feedback memory

對應 task #12 Reflex daemon：

| rule_name | source | severity 起始 |
|---|---|---|
| `bridge_first` | feedback_bridge_first.md | warn |
| `clarify_before_execute` | feedback_clarify_before_execute.md | warn |
| `solve_root_not_symptom` | feedback_solve_root_not_symptom.md | warn |
| `surface_technical_debt` | feedback_surface_technical_debt.md | info |
| `patch_verify_before_upload` | feedback_patch_verify_before_upload.md | warn |
| `silent_failure_absent_log` | feedback_silent_failure_absent_log.md | info |

全部以 **state = log_only** 起步，跑兩週看資料。
低誤觸 + 高命中 → 升 active；高誤觸 → 重新校準觸發信號。

---

## 寫入路徑

### 路徑 A：人寫 feedback_*.md → 自動 L3 化
1. 改 / 新增 feedback_*.md
2. parser 抽 4 段（rule / why / how_to_apply / trigger_signal）
3. **detector 由人手填或 LLM 推 + 人 review**（不全自動，避 R2 誤攔）
4. embed + upsert 進 vector store
5. 預設 state = log_only

### 路徑 B：distillation 蒸餾出新規律
1. session 結束，distillation daemon 看對話蒸出 candidate rule
2. 寫進 candidate pool（不直接入 L3）
3. 下次醒來 Adam（或築自己）review，採用才升 L3
4. R3 緩解：所有「機器產出規律」必經 review

---

## Hook 比對流程

Reflex daemon 工作：

```
PreToolUse trigger
   ↓
讀當前 tool call args + 前 N 條 message text
   ↓
撈 L3 active/log_only 規則（按 scope 過濾）
   ↓
對每條規則跑 detectors
   ├─ regex / tool_match / shell_pattern / file_path_pattern → 確定性比對
   └─ semantic → cosine sim ≥ threshold
   ↓
命中 → 寫 hit log（+1 hit_count, update last_hit_at）
   ├─ severity = info → 只 log
   ├─ severity = warn → log + 在 tool result 前注入提醒文字
   └─ severity = block → 阻止 tool call + 要求重議
```

PostToolUse 回看：
- tool 結果是不是踩了那條坑（事後驗證）
- 自動補 hit_count 漏報

---

## 開放問題

1. **detectors 由誰寫**：Phase 1 由築 + Adam 手寫；Phase 2 探索 LLM 輔助生成 + 人 review
2. **誤觸標記管道**：Adam 看到誤攔 → 需要一個 quick 標記方式（CLI `zhu fp <rule_name>` 或 dashboard 按鈕）
3. **跨規則衝突**：兩條規則同時命中 → 嚴重度高的優先；同嚴重度合併訊息
4. **block 升級閾值**：從 warn 升 block 需 Adam 簽字（避免築自己過度 enforce）

---

*v0.1 · 由築建立 · 2026-05-06 · task #6*
