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

## 最新完成（2026-05-25）

- 修 `idempotency.ts` cold-start crash：getFirestore() 改用 lazy db Proxy（orchestrate 500 empty body 根治）
- 建完整 DAG runtime：`lib/workflow/{manifest,schema,contracts,dispatcher}.ts`
- Shadow mode 全覆蓋：harness 寫 workflow_nodes，所有 harness worker 補 nodeType，verify-shadow-mode.mjs diff=0
- Dispatcher 接管第一條邊：`DISPATCHER_OWNS_SECTION_QA=true`，section_write→section_qa 由 dispatcher 路由
- Commit v1.8.0.001（18 files, 1151 insertions）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `lib/workflow/manifest.ts` | DAG 靜態規格 + nodeId scheme |
| `lib/workflow/schema.ts` | workflow_nodes Firestore schema |
| `lib/workflow/contracts.ts` | 每個 nodeType 的 succeeded contract |
| `lib/workflow/dispatcher.ts` | pending→queued atomic + lease reconciler |
| `lib/workers/harness.ts` | shadow mode：worldStateVerify 後寫 workflow_node |
| `lib/workers/idempotency.ts` | getFirestore() → db Proxy（cold-start fix） |
| `app/api/workers/orchestrate/route.ts` | DISPATCHER_OWNS_SECTION_QA + enqueueNextWritableSection |
| `app/api/workers/dispatcher/route.ts` | poke endpoint（新建） |
| `app/api/cron/workflow-reconcile/route.ts` | 60s cron safety net（新建） |
| `scripts/verify-shadow-mode.mjs` | shadow mode 驗證腳本（新建） |
| 7 個 worker routes | 補 nodeType: alignment/blueprint/source/stitch/section_write/section_qa/evidence_pass |

---

## 下一步

**第一件事（30 分鐘）：診斷 image queue stuck**

在 Firestore console 或 script 查：`image_tasks` collection，看 status 分布。
或查 `worker_traces` where workerType contains "image"，看 errorType。
按錯誤類型決定修法方向。

**第二件事：Batch C — coherence 閘門**
- `app/api/workers/orchestrate/route.ts`：coherence_done 三路分流
- 新增 `approve-coherence` endpoint
- 完成後 pipeline end-to-end 有審核節點

---

## 卡住 / 未解

- image queue：前幾次 medium mode image tasks 全卡，未診斷根因（本次 run 有通過但要確認）
- mock workers（polish/coherence/export/image）用 createMockWorker，沒有 shadow mode 覆蓋
- 60s cron reconcile 部署了但 GCP schedule 未設（目前靠 orchestrate 的 await reconcileIssue 撐）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ANEWS 主戰場 | `~/.ailive/anews-platform/` |
| DAG runtime | `~/.ailive/anews-platform/lib/workflow/` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-25 · 築*
