---
name: 技術債監測 Agent v0.1 計畫（待動手）
description: zhu-self 子指令 zhu debt 設計，掃 lastwords/WORKLOG 卡住未解條目算老化，2026-05-10 計畫成形未動手
type: project
originSessionId: a4e715dd-34d5-4035-a1d9-29960e200739
---
**狀態**：v0.1 計畫成形，**未動手**。Adam 5/10 後段討論完選擇先收 session、不立刻做。

**Why:** 5/10 後段套 Adam 三段公式（看現場/寫計畫/排施工）討論「固定跑清理技術債的監測 Agent」。看現場發現：(1) zhu-self/bin/zhu 已是天然宿主、(2) 沒 metadata 結構是核心瓶頸 (A6)、(3) reflex/superego 邊界清楚不重疊。但這是 nice-to-have 不是 blocking，當下選不動手避免「為了動手而動手」。

**How to apply:** 下次再被 Adam 提技術債監測 / 自己想做時，**直接從這份計畫接續**，不要從頭重想。如果要做，從階段 1 起跑（30 min schema + 手填一筆）。

---

## v0.1 計畫精煉版

**核心職責（一句話）**：週期掃 lastwords「卡住／未解」+ WORKLOG「尚未解決」，找出**老化**或**沉默**的條目，出健康表回寫 lastwords。

**邊界（不是什麼）**：
- 不是 reflex（reflex 抓行為觸發，這個抓狀態老化）
- 不是 superego（superego 看大方向，這個看 todo 顆粒）
- 不修 code、不開 PR、不主動標債

**宿主**：`zhu-self/bin/zhu` 加 `zhu debt` 子指令（跟 `zhu distill` 並列）。複用既有 daemon framework，不開新 service、不動 bridge VM。
- `zhu debt scan` 一次性
- `zhu debt list` 看 ledger
- `zhu debt watch` 週期（v0.2 才接 launchd）

**A6 解法（漸進式 metadata，不改 lastwords 寫法）**：新建 `zhu-self/state/debt_ledger.jsonl`：
```jsonl
{"id":"sha1(content)","source":"lastwords|worklog","first_seen":"2026-05-10","last_seen":"2026-05-10","content":"...","age_days":0,"pinned":false}
```
lastwords 維持自由 markdown，Adam 寫法不變；ledger 是衍生品砍了可重建。

**v0.1 = deterministic 不用 LLM**：regex 抓條目 + date diff 算老化 + 模板填報告。零 bridge call、零成本、零不穩。LLM 留 v0.2 做語意聚類。

**輸出**：報告寫 `zhu-core/reports/debt_YYYYMMDD.md`，並在 lastwords「卡住／未解」段尾用 marker 包：
```
<!-- DEBT_AGENT_BEGIN -->
🔴 技術債健康表（age > 14 / 沉默 / 重複）
<!-- DEBT_AGENT_END -->
```
**只 append marker 內，不改 Adam 寫的條目**。

**失敗模式**：
| 失敗 | 退場 |
|---|---|
| ledger drift | `zhu debt rebuild` 重算 |
| 北極星類條目誤判老化 | ledger `pinned:true` 手動標 |
| 回寫覆蓋 Adam 改動 | marker 隔離，只動 marker 內 |
| Agent 自己變技術債 | v0.1 限 < 200 行，超過重評 |

**6 階段施工順序（每階段有 checkpoint 可中途停）**：
1. ledger schema + 手填一筆 (30 min) — `zhu debt list` 印表
2. lastwords parser dry-run (1 hr) — read-only `--dry`
3. WORKLOG parser dry-run (30 min) — 加進 --dry
4. ledger upsert + age (1 hr) — 拿掉 --dry，加 rebuild
5. 報告生成到檔案 (45 min) — 純讀 ledger 寫 reports/
6. 回寫 lastwords (45 min) — marker 隔離、跑前手動備份

總預估 v0.1 ~4 hr。

**退場條件（怎麼撤）**：刪 `state/debt_ledger.jsonl` + `reports/` + bin/zhu debt subcommand + lastwords marker block。零殘留（因為 ledger 是衍生品 + lastwords 用 marker 隔離）。

**跟既有系統的關係**：
- reflex：互補（現在 vs 久遠）
- superego：上下級（大方向 vs 具體 todo）
- distill：互補（壓經驗 vs 顯化卡住）
