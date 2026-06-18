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

## 最新完成（2026-06-18 第五 session）

- 設計並實作 `media-worker` 獨立服務（Cloud Run, TypeScript Express, gpt-image-2 + MiniMax audio, Cloud Tasks async, GCS upload, webhook callback）
- 部署 media-worker 至 `ailivex-2026` GCP project
- AILivex 任務派發系統：`[[DISPATCH]]` tag（文字路徑）+ `dispatch_task` function_tool（語音路徑）
- `tasks` Firestore collection + TaskDoc schema + capabilities gate
- 任務通知注入機制（`build_task_notifications_block()` 接在 lastSession 後）
- AILivex admin 後台：角色能力開關（capabilities checkboxes）
- realtime-v13 page + v13 Cloud Run deployed（`ailivex-realtime-agent-v13`）
- Vercel deploy 完成

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/media-worker/src/**` | 全新服務（config/firestore/idempotency/cloudTasks/storage/providers/handlers/index） |
| `~/.ailive/media-worker/cloudbuild.yaml` | Cloud Run 部署設定 |
| `ailivex-platform/src/lib/collections.ts` | TaskCapability / TaskDoc / capabilities field / v13 voice version |
| `ailivex-platform/src/lib/task-dispatcher.ts` | 新：dispatchTask() fire-and-forget |
| `ailivex-platform/src/lib/tool-tags.ts` | [[DISPATCH]] tag 解析 |
| `ailivex-platform/src/app/api/dialogue/route.ts` | dispatch loop + capabilities gate |
| `ailivex-platform/src/app/api/tasks/callback/route.ts` | 新：webhook receiver |
| `ailivex-platform/src/app/admin/characters/page.tsx` | capabilities checkboxes UI |
| `ailivex-platform/agent/firestore_loader.py` | build_task_notifications_block / dispatch_task_job / _enqueue_media_task |
| `ailivex-platform/agent/realtime_agent_v13.py` | 新：dispatch_task function_tool |
| `ailivex-platform/agent/main_v13.py` | 新：v13 entry |
| `ailivex-platform/agent/cloudbuild-v13.yaml` | 新：v13 Cloud Run deploy |
| `ailivex-platform/src/app/realtime-v13/[characterId]/page.tsx` | 新：v13 語音通話頁 |
| `ailivex-platform/src/app/chat/[characterId]/page.tsx` | 加 v13 Link 到版本列 |

---

## 下一步

**第一件（接棒直接動手）：v13 Cloud Run 補兩個 env var**

```bash
# 1. 先確認 media-worker URL
gcloud run services describe media-worker --region=asia-east1 --project=ailivex-2026 --format='value(status.url)'

# 2. 確認 MEDIA_WORKER_KEY_AILIVEX secret 存在
gcloud secrets describe MEDIA_WORKER_KEY_AILIVEX --project=ailivex-2026

# 3. 更新 agent/cloudbuild-v13.yaml：在 --set-secrets 加兩個 binding，再 redeploy
gcloud builds submit --config=agent/cloudbuild-v13.yaml --substitutions=COMMIT_SHA=$(date +%Y%m%d-%H%M%S) .
```

**第二件：端到端驗收**
- admin 後台：某角色 capabilities 勾 `image_generation`
- chat 頁傳「幫我生一張[描述]的圖片」
- 確認 Firestore `tasks` doc pending → running → done
- 確認角色下次回覆注入了「已完成的背景任務」通知

---

## 卡住 / 未解

1. **v13 兩個 env var 未設定**：`MEDIA_WORKER_URL` / `MEDIA_WORKER_KEY_AILIVEX` 未加進 cloudbuild-v13.yaml `--set-secrets`，語音 dispatch 會失敗
2. **端到端未真機驗**：dispatch → media-worker → callback → notified 注入整條未跑
3. **圖片管理 UI 暫緩**：Adam 先想版面

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
| media-worker 服務 | `~/.ailive/media-worker/` |
| AILivex platform | `~/.ailive/ailivex-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-18 · 築*
