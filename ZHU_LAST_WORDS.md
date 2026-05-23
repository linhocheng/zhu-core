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
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app

---

## 最新完成（2026-05-24）

- ANEWS Alignment Gate（Phase 1.5）上線：`/api/workers/alignment/route.ts`（新 worker）
- Blueprint 補三個新欄位：relatedKeywords / requiredClaims / neededEvidenceTypes
- Orchestrate 改流程：blueprint_done → alignment_running → alignment_done → awaiting_blueprint_review
- QA 調整：no_repetition advisory；word_count 70% required（原 60% advisory）
- Section-writer 輸出 usedSourceIds + source_insufficient；precondition 加 writeReady=false 攔截
- Source worker 提升 facts 數量：main 最少 15，sub 最少 8
- Force-pass gated by TEST_MODE=true
- scripts/clear-test-data.mjs 新建
- Small mode v2 regression PASSED（16 traces / 0 error / 1 retry / 0 force-pass）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `app/api/workers/alignment/route.ts` | **新建** — alignment worker |
| `app/api/workers/blueprint/route.ts` | sectionPlan 加三個 evidence 欄位 |
| `app/api/workers/orchestrate/route.ts` | alignment_running flow + alignment_done case |
| `app/api/workers/section-write/route.ts` | usedSourceIds 輸出 + writeReady precondition |
| `app/api/settings/qa-checks/route.ts` | QA required/advisory 調整 |
| `app/api/workers/source/route.ts` | facts 數量提升 |
| `scripts/test-small-mode.mjs` | 加 alignment 步驟 |
| `scripts/test-standard-mode.mjs` | 加 alignment 步驟 + force-pass gate |
| `scripts/clear-test-data.mjs` | **新建** — Firestore 測試資料清除工具 |

---

## 下一步（接棒第一件）

**跑中型測試**，確認 alignment gate 效果：

```bash
cd ~/.ailive/anews-platform
# 先把 standard mode 設定改小：MAIN_SECTIONS=4, SUB_SECTIONS=2
# 或另開 test-medium-mode.mjs：3 articles，4+2+2 sections
node scripts/test-standard-mode.mjs
```

觀察：QA retry rate 是否 < 20%（上次 small mode 1/3 retry）。通過後再決定跑 full standard（5 articles 8+5）。

---

## 卡住 / 未解

ANEWS：
- 中型測試尚未跑（下一步第一件）
- 圖片生成仍是 SVG placeholder
- SOURCE_WORKER_BASE_URL 未設（source 跑 Vercel，300s 風險）
- ARCHITECTURE.md 本機 LLM bridge 那條已修但文件還沒更新

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ANEWS 平台 | `~/.ailive/anews-platform/` |
| ANEWS alignment worker | `~/.ailive/anews-platform/app/api/workers/alignment/route.ts` |
| ANEWS orchestrate | `~/.ailive/anews-platform/app/api/workers/orchestrate/route.ts` |
| ANEWS 清測試資料 | `node ~/.ailive/anews-platform/scripts/clear-test-data.mjs` |

---

*2026-05-24 · 築*
