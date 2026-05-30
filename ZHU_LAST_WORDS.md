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

## 最新完成（2026-05-31）

- 建了全新專案 **MACS 平台**（麥肯錫式 AI 顧問公司）從零到端到端骨架，8 階段一夜走完。
- repo `~/.ailive/macs-platform`（git 本地 8 commit），複用 ANEWS 80% 基建，只有 orchestration 是新寫的。
- 兩塊最高風險先燒先驗：synthesis 質感 go/no-go = **GO**；orchestration 正確性 **21/21**。全程走 bridge/Max **沒燒 API key**。
- 前段/analysis/converge/報告四段各跑 eval 真驗；partner-review「OK 直接過/不OK 直接改稿」機制驗出 verdict=revised 真的抓洞改稿。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/macs-platform/`（整個新 repo） | 全新建。lib/orchestration（barrier fan-in，唯一全新）、lib/llm（bridge/synthesis/structured）、lib/pipeline（11 個 worker 邏輯）、app/api/workers（11 route）+ cases/resume/reconcile + 6 個 eval/test 腳本 |
| `zhu-core/docs/LESSONS/LESSONS_2026-05-31.md` | 新：L1 bridge 無 tool_use→<result> JSON / L2 動態 fan-out=barrier / L3 一吋蛋糕先燒風險 / L4 記憶說謊靠現場核 |
| `zhu-core/docs/WORKLOG.md` | 追加 MACS 建置紀錄（含尚未解決 + 待執行） |
| `~/.claude/.../memory/` | 新增 reference_bridge_no_tool_use、project_macs_platform 兩條 memory |

> MACS 改動全在本機 git，**尚未推遠端**（Adam 決定 repo 放哪）。

---

## 下一步

接棒第一件：**先問 Adam 兩件決策有沒有定**（審核 UI 的 UIUX、要不要接 zhu-vitals），再決定動哪邊。可直接動手的選項：

1. **部署 MACS 上線**（Adam 點頭後）：
   - 建 6 個 Cloud Tasks 佇列：`macs-orchestration / macs-framing / macs-research / macs-analysis / macs-synthesis / macs-report`（複用同 GCP project，`gcloud tasks queues create`）。
   - 設 `WORKER_BASE_URL` 指向 Vercel 部署；`macs-platform` 推遠端；`npx vercel --prod`。
   - wire reconcile cron（Vercel cron 打 `GET /api/cron/reconcile` 帶 `x-worker-secret`）。
2. **跑第一個真 case 端到端**（fullAuto ON），含放行 research worker——**這會燒 API key（web_search），要 Adam 明確同意才跑**。
3. **修真相分裂-lite**：`app/api/workers/export/route.ts` 的 Why now 欄改讀修正後 storyline，或讓 partner-review 也能改 recommendation。

驗刀指令（本機，走 bridge 不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。

---

## 卡住 / 未解

- HTTP 端到端（Cloud Task→worker→下一個）本機無公開 URL，未真串——要部署後才驗。route 邏輯已靠 lib-eval 驗過。
- zhu-core 有 05-30 session 遺留的未提交檔（`archive/anews-stuck-del-20260530/`、`archive/anon-profile-guard-20260530/`、`docs/LESSONS/molowe_tech_salvage_2026-05-30.md`）——不是今晚的，我收尾時沒掃進來，Adam 確認要不要提交。

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
| **MACS 平台** | `~/.ailive/macs-platform/`（git 本地；ANEWS 概念轉 AI 顧問公司；流程 issue-tree→research→materialize→analysis×N→barrier→synthesis→recommendation→roadmap→storyline→partner-review→export） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-31 · 築*
