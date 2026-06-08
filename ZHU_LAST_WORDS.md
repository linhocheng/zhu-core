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
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-08 夜）

- MACS complete-B：10 條 Vercel worker route 全泛型化（framework 驅動，`isVercelNative` / `stage.writes` / `buildReport` hook），未來加 vercel-native mode 零 route 改動
- 接通 Mode 4 creative_proposal（兩幕 13 章商業企劃書）：framework + buildProposalReport
- 四模式 **e2e 全跑到 done**：M1 86655 字 / M2 88878 字 / M3 28388 字 / M4 26821 字（回歸閘通過，M3 證明泛型化沒打壞既有模式）
- 修 Mode 4 issue-tree compat 映射 mode 耦合 bug（讀 CreativeTerritory 專屬欄位 → 改共享欄位）
- 回補 commit 既有未提交的 Cloud Run hybrid 三修（部署已 live、git 落後）

---

## 今天改了哪些檔案

（白天另有一段「篇幅旋鈕接三模式」，見 WORKLOG 2026-06-08 上半；以下是夜場 complete-B）

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/frameworks/contract.ts` | ModeFramework 加 vercelNative + buildReport hook |
| `macs-platform/lib/frameworks/registry.ts` | 加 isVercelNative（只 creative_lead/proposal 為 true） |
| `macs-platform/lib/frameworks/creative-lead/index.ts` | 設 vercelNative + buildReport |
| `macs-platform/lib/frameworks/creative-proposal/{index,report}.ts` | Mode 4 framework + buildProposalReport（13 章兩幕） |
| `macs-platform/app/api/workers/*.ts`（9 條）+ cases/route | 全改 framework 泛型分派，零 mode hardcode |
| `macs-platform/app/api/workers/issue-tree/route.ts` | territory→workstream 映射改共享欄位（修 Mode 4 needs_repair） |
| `macs-platform/cloud-run/research-worker/src/index.ts` | 回補既有 hybrid 三修（獨立 commit） |

commit：macs-platform `v0.12.0.001` / `v0.12.0.002` / `v0.11.4.002`（皆已 push + prod deploy，alias macs-platform.vercel.app）

---

## 下一步

**Mode 4 把 P0 假資料換成真 prompt**（最該先做、能直接動手）：
- 現況：Mode 4 e2e 通了，但 13 章內文全是 `(P0 假資料)` 佔位 —— 管道/泛型路由/渲染綠，內容是假的。
- 動手點：`macs-platform/lib/pipeline/creativeProposal.ts` 的 `run*` 函式（forge/territories/synthesis/selection/execution…）目前回 fixture，逐個換成真 LLM 呼叫（走 bridge，`<result>` JSON + Zod schema，不用 tool_use）。
- 逐 stage 驗：起一個 creative_proposal 全自動案，盯 artifact 內容不再是 P0、Zod 不炸。
- 起案 curl 範例見 WORKLOG 2026-06-08 夜（admin bearer 在 macs-platform/.env.production.local 的 ADMIN_PASSWORD）。

連帶未清待辦：
- 篇幅真案對照（精簡 vs 深入比字數，白天那段的遺留驗證）
- Task #31 5C：Mode 1 integrate_chapters 仍 legacy，未改 buildReport 框架驅動

---

## 卡住 / 未解

- Mode 4 內容是 P0 假資料（**設計如此**，非 bug；真 prompt 是下一階段）。骨架通了 ≠ 內容對了。
- 篇幅旋鈕仍無真案 e2e 比字數驗證（白天遺留）。

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| MACS 平台 | `~/.ailive/macs-platform/`（Vercel + Cloud Run research worker） |
| MACS Mode 4 計畫 | `~/.ailive/macs-platform/docs/MODE4_CREATIVE_PROPOSAL_PLAN.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-08 夜 · 築*
