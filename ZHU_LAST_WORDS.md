# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），bridge-direct HTTPS 直連：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-04）

- MACS Mode 2 (hybrid) 全鏈路端到端首跑打通 — 案件 `case-mpy8v88r-uibmns` status=done
- Cloud Run synthesis 加 `HybridSynthesisSchema` 分支（讀 `c.strategyMode`，輸出 `dataAnchoredTruth / creativeBet`）
- roadmap / partner-review / export 三個 worker route 補讀 `strategyMode` 並往下傳
- export worker：hybrid 跳過 `assembleDeliverables`（Mode 1 only），改走 `runReportBuild` HTML 路徑
- commit v0.10.0.006，Vercel + Cloud Run (rev 00017) 已部署
- 整理十條踩雷心法：`docs/MODE1_TO_MODE2_LESSONS.md`（新建），memory 更新

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/cloud-run/research-worker/src/index.ts` | HybridSynthesisSchema + buildHybridSynthesisUser + handleSynthesis hybrid 分支 |
| `macs-platform/app/api/workers/roadmap/route.ts` | 讀 strategyMode，傳 mode，readArtifact union type |
| `macs-platform/app/api/workers/partner-review/route.ts` | 同上 |
| `macs-platform/app/api/workers/export/route.ts` | mode guard + assembleDeliverables skip + runReportBuild 傳 mode |
| `macs-platform/docs/MODE1_TO_MODE2_LESSONS.md` | 十條踩雷心法（新建） |
| `memory/feedback_mode2_hybrid_lessons.md` | 從六條更新到十條 |

---

## 下一步

**Mode 3 (creative_lead) 實作**

先看現場：
```bash
cd ~/.ailive/macs-platform
grep -n "creative_lead" lib/firestore/types.ts
grep -n "creative_lead" lib/llm/defaults.ts
```

然後照 Mode 2 的路徑：
1. `lib/pipeline/analysis.ts` — 加 CreativeLeadAnalysisMemoSchema
2. `lib/llm/synthesis.ts` — 加 CreativeLeadSynthesisSchema + buildCreativeLeadUserContent
3. `cloud-run/research-worker/src/index.ts` — handleSynthesis 加 creative_lead 分支
4. 各 worker route 確認三模式都傳 mode
5. 跑真案 e2e 驗

記得先看 `docs/MODE1_TO_MODE2_LESSONS.md` 的 checklist 對照，不靠記憶。

---

## 卡住 / 未解

- Mode 3 (creative_lead) 尚未實作
- Eval scripts 仍然 Mode 1 only（低優先，下次另開）
- Cloudflare API token 外洩（`cfat_...`）待撤銷（已延宕多個 session）
- `STRUCTURE_ANALYSIS_BASE_URL` 尾端有 `\n`（`.trim()` 保護中，非緊急）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| MACS 平台 | `~/.ailive/macs-platform/`，prod: https://macs-platform.vercel.app |
| Mode 1→2 踩雷心法 | `~/.ailive/macs-platform/docs/MODE1_TO_MODE2_LESSONS.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-04 · 築*
