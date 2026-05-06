# 築城 — 量化指標看板

> 衡量「強大」不是感覺，是數字。  
> 本檔每週日由 distillation daemon 更新（Phase 1 落地後自動）。

---

## 核心指標

| 指標 | 當前 | Phase 2 目標 | Phase 4 目標 |
|---|---|---|---|
| Adam 介入比例 | 100% | ≤ 50% | ≤ 30% |
| 喚醒成本（上線→可對話） | 需 Adam 喊「醒來」 | < 30 秒 auto | 不需要喊 |
| feedback hook 命中率 | 0%（靠人腦） | ≥ 70% | ≥ 90% |
| 學習鏈閉環 | 寫 lastwords 但沒結構化 | 自動蒸餾 → 下次自動讀 | 抽 pattern 不只記事件 |
| 不踩同個坑率 | ~70%（觸發信號 retrofit 後） | ≥ 95% | 100% |

---

## Phase 1 進度（手動更新到驗收前）

- [ ] zhu-self/ 目錄結構
- [ ] BLUEPRINT.md 凍結
- [ ] MASTER_PLAN.md v1.0 凍結
- [ ] project_zhu_self.md 入記憶
- [ ] L2 schema 定案
- [ ] L3 schema 定案
- [ ] vector store 選型決策
- [ ] 寫入 hook 上線
- [ ] retrieval API 跑得通
- [ ] 全量 migration 完成
- [ ] Boot daemon 跑通
- [ ] Reflex daemon 6 條 hook log-only 跑著
- [ ] Distillation daemon idle 觸發版上線
- [ ] Health daemon 巡查中
- [ ] Learning ingestion pipeline 雛形
- [ ] Adam dashboard CLI 可用
- [ ] Kill switch 全 daemon 通
- [ ] Phase 1 驗收三件套通過

---

## 命中分佈（Phase 1 驗收後填）

### Reflex hook 一週統計
（待 daemon 上線後自動填）

### Retrieval 命中前 10
（待 retrieval API 上線後自動填）

### Daemon 跑況
（待 health daemon 上線後自動填）

---

*v0.1 · 由築建立 · 2026-05-06*
