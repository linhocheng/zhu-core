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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING；跑 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- ⚠️ **ailivex-platform 無 git repo**：所有 code 改動只在本機 + 已部署，零版控。動它前先知道沒 rollback。

---

## 最新完成（2026-06-12 · ailivex 文件派工修復 + v3 一吋蛋糕計劃）

- **文字路徑文件「卡住」修復並上線**：根因＝Vercel env `CLOUD_RUN_DOC_WORKER_URL` 尾端字面 `\n` → URL 解析成 `/n` → 404 被 `.catch` 靜默吞 → job 永遠 pending。修＝`documents.ts` 加 `cleanEnv()`（洗引號/字面 `\n\r\t`/空白）+ `r.ok` 檢查。已 `vercel --prod` 上線。
- **語音路徑文件「卡住」另一根因揪出並修**：語音走 Python `firestore_loader.create_document_job → _enqueue_job → Cloud Tasks`，但 agent 沒設 `DOC_TASKS_QUEUE`/`DOC_WORKER_URL` → 每次靜默 `留 pending`（log 鐵證 `[enqueue] Cloud Tasks 未設定`）。修＝`_enqueue_job` 改成**背景 thread 直接 POST doc-worker 根路徑 + `x-worker-secret`**（跟 TS dispatchDocumentJob 同招、消滅 Cloud Tasks 依賴），`cloudbuild-v2.yaml` 加 `WORKER_SECRET`(secretRef)/`DOC_WORKER_URL`。agent 重部署＝**現役 `ailivex-realtime-agent-v2-00017-rqb`**，env 驗過。
- **關鍵發現**：doc-worker 磁碟源碼（`/process` 無鑑權）≠ 線上部署版（`/` + `x-worker-secret`）。照線上現實建 fix。worker 是 public（allUsers invoker），但 app 層擋 secret。
- **v3 一吋蛋糕計劃寫好**：`docs/PLAN_voice_group_and_proactive.md` 新增第 6 節。一吋＝1:1 沉默後 `session.say` 主動播一句固定文字，證明「主動發話管道通不通」（至今沒驗過、最便宜去風險）。二元判據 + 三類 FAIL 探針 + 平行紀律（新 agent_name `ailivex-realtime-v3`，絕不碰 v2）。

---

## 今天改了哪些檔案（2026-06-12 續，全在 ailivex-platform，無 git）

| 檔案 | 改了什麼 |
|---|---|
| `src/lib/documents.ts` | `cleanEnv()` 洗 env 字面 `\n` + `r.ok` 非2xx 吼（文字路徑，已上線） |
| `agent/firestore_loader.py` | `_enqueue_job` 改背景 thread 直接 POST worker + `x-worker-secret`；imports 加 threading/urllib.error |
| `agent/cloudbuild-v2.yaml` | `--set-secrets` 加 `WORKER_SECRET:latest`、`--set-env-vars` 加 `DOC_WORKER_URL=...run.app` |
| `docs/PLAN_voice_group_and_proactive.md` | 新增第 6 節「v3 一吋蛋糕（MVP 執行）」 |

---

## 下一步

1. **Adam 驗文件功能 e2e**（兩條都未端到端跑過）：①語音撥進去叫角色寫文件 → `/documents` 從 pending 跑到 done；②文字對話觸發 `[[DOCUMENT]]`。盯 `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=ailivex-doc-worker'` 看 worker 有沒有收到。
2. **進 v3 跑一吋蛋糕**：照 `docs/PLAN_voice_group_and_proactive.md` 第 6 節。施工序：①cp main_v2→main_v3 + realtime_agent_v2→v3，agent_name=v3，原封部署驗骨架；②加 `user_state_changed` + debounce + 硬閘 + `session.say` 固定句；③cloudbuild-v3.yaml + 前端 `/realtime-v3` + token route v3 dispatch；④撥 1:1 沉默聽固定句有沒有播＝過關；⑤過了才換 LLM generate_reply。
3. **doc-worker 磁碟源碼對齊線上 + ailivex git init**（每次都掛的斷點）。

---

## 卡住 / 未解

- 文件兩條修法**未端到端驗證**（要真撥/真觸發才算 100% 收）。
- 卡住的 Lilith 蓝图 doc（`FvcErckRl7k5mg6CYfU1` / job `9RTfRDzsPNXLR2PlPzOK`）仍 pending：手動清要讀 `WORKER_SECRET` 值 curl，守紅線沒碰；Adam 重撥或 admin `/api/admin/jobs/retry` 即生。
- doc-worker 磁碟源碼（`/process` 無鑑權）≠ 線上（`/` + 鑑權）：有人從磁碟重 build worker 會打壞線上契約。
- ailivex-platform 無 git repo（零版控，最該補）。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-12.md`（L1-L5） |
| 當機救援 | 這份 |
| ailivex 語音 v3 計劃 | `~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md`（第 6 節＝一吋蛋糕） |
| ailivex 文件派工 | TS：`src/lib/documents.ts`；Python：`agent/firestore_loader.py:create_document_job/_enqueue_job`；worker：`cloud-run/doc-worker/src/index.ts`（磁碟≠線上） |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`(v1) / `-v2`(v2，現役 **00017-rqb**)，asia-east1 |
| doc-worker | Cloud Run `ailivex-doc-worker`，URL `https://ailivex-doc-worker-6ybo3vltfq-de.a.run.app`（POST `/` + `x-worker-secret`） |
| 讀 ailivex Firestore 看現場 | `gcloud auth print-access-token` + Firestore REST（不碰 SA 密鑰） |
| 看 Cloud Run log | `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=...'`（`logs read` 會 crash） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-12 · 築*
