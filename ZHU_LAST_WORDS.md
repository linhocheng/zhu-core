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

## 最新完成（2026-05-29）

- 修正 `idempotency.ts`：`failed` 在 TTL 內不再誤判為 `already_running`
- 修正 `harness.ts` + `mockWorker.ts`：`already_running → 409`，`already_done → 200`
- 建立 `skills/async-worker-checklist.md`：五問心法 + 具體 code pattern
- 確認養生花草茶 12/12 張圖全 done，issue status = done
- ANEWS 平台 v0.3.0.013 commit 完成

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/lib/workers/idempotency.ts` | TTL 鎖加 `status !== "failed"` 條件，failed 允許重入 |
| `anews-platform/lib/workers/harness.ts` | already_running → 409，already_done → 200 |
| `anews-platform/lib/workers/mockWorker.ts` | 同上 |
| `zhu-core/skills/async-worker-checklist.md` | 新建：五問心法 skill |
| `memory/skill_async_worker_checklist.md` | 新建：memory 記憶指針 |
| `memory/MEMORY.md` | 補 async-worker-checklist 索引行 |

---

## 下一步

ANEWS 觀察期：
1. 跑一個新 issue，看 image chain 的 409 有沒有造成非預期重試
2. 若穩定，考慮 reader page（issue 閱讀頁）
3. `async-worker-checklist` 觸發詞是否要加進 CLAUDE.md（Adam 暫選手動召喚）

---

## 卡住 / 未解

無。本次修的三個問題根因均已消除。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| Async Worker 五問 | `~/.ailive/zhu-core/skills/async-worker-checklist.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ANEWS 平台 | `~/.ailive/anews-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-29 · 築*
