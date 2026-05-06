# Reflex daemon 安裝

> task #12 雛形。Phase 1 階段 = log-only，不擋 tool call。
> 兩週後評估命中分佈，再決定哪幾條升 active / block。

---

## 安裝步驟

### 1. 啟用 daemon
編輯 `~/.ailive/zhu-core/zhu-self/state/reflex.json`：
```json
{ "enabled": true, "mode": "log_only" }
```
（預設 false，避免擅自上線）

### 2. 把 hook 註冊到 Claude Code 設定

加進 `~/.claude/settings.json`（或專案 `.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "node /Users/adamlin/.ailive/zhu-core/zhu-self/scripts/reflex/pretool-hook.mjs"
          }
        ]
      }
    ]
  }
}
```

> 不要直接覆蓋既有 hooks 區塊，要 merge。

### 3. 驗證
跑一條觸發規則的 bash：
```bash
echo "ANTHROPIC_API_KEY=test"
```
應該看到 `🛑 [reflex] 命中規則：bridge_first` 出現。

```bash
cat ~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl
```
應該看到一條 jsonl entry。

---

## 規則清單（Phase 1）

詳見 `rules.mjs`。6 條：
1. **bridge_first** (warn) — 估 per-token cost 時提醒
2. **clarify_before_execute** (warn) — 「先做再說」這類字眼
3. **solve_root_not_symptom** (warn) — `.catch(() => null)`、`--no-verify`
4. **surface_technical_debt** (info) — TODO/FIXME/HACK 在新 code
5. **patch_verify_before_upload** (warn) — VM 上 Python inline edit
6. **silent_failure_absent_log** (info) — 反覆 tail 同一 log

---

## 觀測指標（Phase 2 升級用）

跑兩週後跑：
```bash
# 每條規則命中次數
jq -s 'group_by(.hits[].rule_name) | map({rule:.[0].hits[0].rule_name, count:length})' ~/.ailive/zhu-core/zhu-self/logs/reflex-hits.jsonl
```

決策依據：
- 命中 ≥ 5 + Adam 沒標誤觸 → 升 active
- 命中 ≥ 5 但 Adam 標 ≥ 50% 誤觸 → 重新校準觸發信號
- 命中 = 0 → 規則沒用，archived

---

## 停用

```json
{ "enabled": false }
```
或從 settings.json 拿掉 hook entry。

---

*v0.1 · 2026-05-06*
