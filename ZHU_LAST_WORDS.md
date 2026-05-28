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

## 最新完成（2026-05-28）

- watchdog image kick 改 enqueueTask（修 sync fetch → Cloud Run timeout 死循環）
- vercel.json 補 LLM workers maxDuration 120s（intel/polish/coherence/stitch/export 等）
- /dashboard Basic Auth 上線（帳 adam，密碼已設 Vercel ADMIN_PASSWORD）
- 讀者頁（/articles/*, /issues/*, /）不鎖，後台才鎖
- ANEWS 4 個 issue 全部 done，pipeline 穩定跑

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/cron/auto-kick/route.ts` | image kick 改 enqueueTask，移除 IMAGE_WORKER_URL 直接 fetch |
| `anews-platform/vercel.json` | 補 7 個 LLM workers maxDuration 120s |
| `anews-platform/middleware.ts` | 新建，/dashboard Basic Auth |

---

## 下一步

`cd ~/.ailive/anews-platform` → 開新 issue 跑一次全鏈路，觀察 polish/coherence 是否在 120s 內完成（maxDuration 補完後首次觀察）。若通過，再評估修 #19 blueprint write order。

---

## 卡住 / 未解

- #9 startNextSubArticle 在 singleWriteMode 是死路（Vercel fallback 失效，Cloud Run chain 正常，暫不影響）
- #16 callbackOrchestrator Date.now() taskId（冪等鎖失效，advancePhase 有保護，低優先）
- #19 blueprint 先寫資料再 commit status（重試產生重複 image_tasks，中優先）

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
| ANEWS 後台 | https://anews-platform.vercel.app/dashboard |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-28 · 築*
