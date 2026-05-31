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

## 最新完成（2026-05-31 晚場）

- 把 MACS 從骨架補成真平台：套 V1 部門魂（核心魂 + 3 分析師 + 證據官 + 紅隊改稿）、修真相分裂-lite。
- 建 HTML 報告交付物（report-builder + 設計稿樣板，navy/tea、CSS 圖表無圖）。
- 建監造後台（移植 ANEWS .adm-* 改 MACS 藍，列表 + 詳情 PipelineBar + 三關 Resume + 開報告）。
- **部署上線**：https://macs-platform.vercel.app（6 個 macs-* 佇列、prod env 乾淨、reconcile cron）。
- 跑第一個真案踩到 research 燒錢雷（見下），盤點完 MACS vs ANEWS 五點偏差。

---

## 今天改了哪些檔案（全在 ~/.ailive/macs-platform，git 本地 v0.2.0.006→010，無遠端）

| 檔案 | 改了什麼 |
|---|---|
| `lib/llm/soul.ts` | 新：§0 核心魂，withSoul() 串進 10 個 LLM worker |
| `lib/pipeline/{registry,analysis}.ts` + `firestore/types.ts` | +3 分析師（business_model/strategic_fit/risk）進固定選單 |
| `lib/pipeline/evidenceAlignment.ts` | 新：§12 證據官，synthesis 前非阻擋掃描 |
| `lib/pipeline/partnerReview.ts` + `app/api/workers/export/route.ts` | 紅隊折進 partner、修真相分裂（revisedWhyNow） |
| `lib/report/{types,builder,renderHtml}.ts` | 新：HTML 報告產生器（view-model + bridge pass + 純渲染器） |
| `app/globals.css` `app/layout.tsx` `app/dashboard/**` `lib/ui/**` | 新：監造後台（藍版 .adm-*、列表/詳情頁、status/adminFetch） |
| `vercel.json` `app/api/cron/reconcile/route.ts` | 部署設定（framework nextjs + cron + cron auth） |

> zhu-core：LESSONS_2026-05-31.md 追加 L5/L6、WORKLOG 追加晚場段。

---

## 下一步（接棒第一件：對齊 ANEWS，止血優先）

**核心病灶**：MACS 把 research(web_search) 放 Vercel，timeout→Cloud Tasks 無上限重試→燒 key×9。ANEWS 鐵律是 web_search 放 Cloud Run（`anews-platform/app/api/workers/orchestrate/route.ts:103` 註解）。

1. **止血（最快，已部分做）**：6 佇列設 `--max-attempts=3`。`macs-research` 佇列**已 pause**，先別 resume。
   `gcloud tasks queues update macs-research --max-attempts=3 --location=asia-east1 --project=zhu-cloud-2026`（六個都做）
2. **主修 #1+#4**：建 `cloud-run/macs-research-worker`（鏡 `~/.ailive/anews-platform/cloud-run/source-worker`：Dockerfile+src+web_search），部署 Cloud Run，設 `MACS_RESEARCH_WORKER_BASE_URL`，把 `app/api/workers/research` 的邏輯搬過去；issue-tree enqueue research 時帶 `overrideBaseUrl=MACS_RESEARCH_WORKER_BASE_URL`（`cloudTasks.ts` 已支援該參數）。
3. **#2**：`vercel.json` 補 `functions` 區塊，LLM worker（synthesis/recommendation/roadmap/storyline/partner-review/export）給 maxDuration 120-300。
4. **#5（選配）**：auto-kick watchdog cron。
5. 修完 resume macs-research 佇列、重跑臻品案（case-mpt5ki7f-zjc4jo，卡在 research_running）驗端到端、開 HTML 報告對賬成本。
6. **Adam 待決**：macs-platform repo 遠端放哪（決定後才能 push v0.2.0.006-010）。

驗刀（本機走 bridge 不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。

---

## 卡住 / 未解

- 臻品植萃案（case-mpt5ki7f-zjc4jo）卡在 research_running，macs-research 佇列 paused。**修好 research→Cloud Run 前不要 resume 佇列**，否則再燒一輪。
- macs-platform git 無遠端，本機 commit 推不出去。
- 05-30 session 遺留未提交檔（archive/anews-stuck-del-20260530/ 等）仍在 zhu-core，非今晚的，Adam 確認要不要提交。

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
| **MACS 平台** | `~/.ailive/macs-platform/`（git 本地；上線 https://macs-platform.vercel.app；對齊 ANEWS 待辦見上）|
| **ANEWS 部署參照** | `~/.ailive/anews-platform/`（cloud-run/source-worker = web_search 範本；vercel.json maxDuration 範本）|
| MACS 報告設計稿 | `~/Downloads/MACS/`（styles.css + 範例 HTML + 我產的 _generated_preview.html）|

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-31 晚場 · 築*
