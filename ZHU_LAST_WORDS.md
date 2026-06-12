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

### 2026-06-12 築 AIR session 續（與上面 PRO 平行，見記憶對賬）
- **/documents 卡住根因揪出**＝env `CLOUD_RUN_DOC_WORKER_URL` 尾端字面 `\n` → 解析成 `.../n` → 404 靜默吞。**手動清完 6 份積壓**（17 全 done、0 卡）；AIR `documents.ts` 重加 `cleanEnv`（未 deploy）。
- **現場實查報告產出** `docs/AILIVEX_CURRENT_STATE_2026-06-12.md`：V1/V2/V3 三代全景 + 雷清單。
- **humanizer 兩段式去 AI 味工具**建好（`~/.ailive/humanizer/`，git init 未 push，獨立未接系統）。
- **記憶對賬**：揪出 AIR/PRO 雙機分裂（lastwords 說 documents 已上線、AIR 卻是舊碼）；更正 doc-worker「磁碟≠線上」舊警告（實為兩份副本）。

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
3. **ailivex git init**（零版控，每次都掛的斷點；AIR/PRO 雙機分裂的根源）。〔doc-worker 源碼其實已對齊線上＝`~/.ailive/ailivex-doc-worker/`；`platform/cloud-run/doc-worker` 那份是舊棄用副本，可刪〕

---

## 卡住 / 未解

- 文件兩條修法**未端到端驗證**（要真撥/真觸發才算 100% 收）。
- 卡住的 Lilith 蓝图 doc（`FvcErckRl7k5mg6CYfU1` / job `9RTfRDzsPNXLR2PlPzOK`）仍 pending：手動清要讀 `WORKER_SECRET` 值 curl，守紅線沒碰；Adam 重撥或 admin `/api/admin/jobs/retry` 即生。
- ~~doc-worker 磁碟源碼（`/process` 無鑑權）≠ 線上~~ **【2026-06-12 築實查更正】**：doc-worker 源碼有**兩份**——真正部署的是 `~/.ailive/ailivex-doc-worker/src/index.ts`（`/` + `x-worker-secret`，**已符合線上** ✓，worker `/health` 實測通）；`ailivex-platform/cloud-run/doc-worker/src/index.ts`（`/process` 無鑑權，6/8）是**舊的棄用副本**，別誤當源碼重 build。原警告指錯檔。
- ailivex-platform 無 git repo（零版控，最該補）。
- ⚠️ **記憶對賬（2026-06-12 築實查）**：本 session 在 **AIR** 讀到的 `src/lib/documents.ts` 是**舊碼**（無 `cleanEnv`，`.trim()`+靜默 catch），與上面「已 vercel --prod 上線」敘述**不符** → 疑 **AIR/PRO 雙機分裂 + 平行修補**。已在 AIR 重加 `cleanEnv`；偵測到 prod 有一次部署（約 24 分鐘前 / 6-12，adam-4389）。但「該部署是否含 cleanEnv」**未證**，需建一份測試文件確認新文件不再卡 pending。6 份積壓 pending（6/10×1、6/11×5）已**手動清完**（documents 現 17 全 done、0 卡）。完整實查 → `docs/AILIVEX_CURRENT_STATE_2026-06-12.md`。
- **語音三代並存（實查）**：V1（`agent` rev 00012，棄更仍線上仍預設）/ V2（`agent-v2` rev 00017，現役端到端通）/ V3（今早 6/12 程式碼起手，**未部署未接通**：`cloudbuild-v3.yaml` 跑成 `main_v2`、前端 v3 頁送 `{v2:true}`、token route 無 v3、chat 無 v3 入口）。
- **doc-worker us-central1（`-uc`，6/6 建）是孤兒殭屍**，線上實際用 asia-east1（`-de`，6/9 建）；建議刪 `-uc`。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-12.md`（L1-L5） |
| 當機救援 | 這份 |
| ailivex 語音 v3 計劃 | `~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md`（第 6 節＝一吋蛋糕） |
| ailivex 文件派工 | TS：`src/lib/documents.ts`；Python：`agent/firestore_loader.py:create_document_job/_enqueue_job`；worker：`~/.ailive/ailivex-doc-worker/src/index.ts`（`/`+secret，符合線上；`platform/cloud-run/doc-worker` 那份是舊棄用副本） |
| ailivex 現場實查報告 | `~/.ailive/zhu-core/docs/AILIVEX_CURRENT_STATE_2026-06-12.md`（V1/V2/V3 全景 + 雷清單 + 記憶對賬） |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`(v1) / `-v2`(v2，現役 **00017-rqb**)，asia-east1 |
| doc-worker | Cloud Run `ailivex-doc-worker`，URL `https://ailivex-doc-worker-6ybo3vltfq-de.a.run.app`（POST `/` + `x-worker-secret`） |
| 讀 ailivex Firestore 看現場 | `gcloud auth print-access-token` + Firestore REST（不碰 SA 密鑰） |
| 看 Cloud Run log | `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=...'`（`logs read` 會 crash） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-12 · 築*
