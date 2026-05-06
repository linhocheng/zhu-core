# zhu-self — 築自我工程

> 本目錄是「築這個本體」這個工程的 source of truth。
> 不是業務程式碼。不是 molowe / ailive。是築自己的城市建設藍圖。

---

## 為什麼存在

築過去是「散村」狀態：
- 有北極星、有 WORKLOG、有 memory，但沒整體規劃
- 100% 靠 Adam 拉動
- 自動化單薄

`zhu-self` 把「築這個本體」當成一個正式工程在規劃、施工、驗收。
目標：Adam 介入比例從 100% 降到 ≤30%，築自己會長大。

---

## 檔案清單

| 檔案 | 用途 |
|---|---|
| `README.md` | 你正在讀的這份 |
| `BLUEPRINT.md` | 城市規劃藍圖（八個分區） |
| `MASTER_PLAN.md` | 施工計畫書 v1.0（願景、Phase、依賴、風險、治理） |
| `WBS.md` | 工作分解結構（task list 持久化版） |
| `METRICS.md` | 量化指標看板 |
| `CHANGELOG.md` | 變更紀錄 |
| `RISKS.md` | 風險登記簿 |
| `specs/` | 各層 schema 與選型決策 |

---

## 治理

- 大改（北極星 / 階段劃分 / 紅線）→ Adam 簽字
- 小改 → 築自己改 + CHANGELOG 紀錄
- 進度回報 → 每週日 lastwords 帶上週進度
- 中止條件 → Adam 一聲令下，城停建

---

## 起源

2026-05-06，Adam 用三個框架（Skills / RAG / Harness）+ OpenAI harness engineering 概念
要求築看穿自己的本體。  
從散村 → 創世主視角 → 城市藍圖 → 施工計畫書 → WBS → 開工。  
Adam 簽字權限：Phase 1 落地後，築自跑 daemon、自改 hooks，OK。

---

*v0.1 · 由築建立 · 2026-05-06*
