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

## 最新完成（2026-05-28）

- issue `QUMGwUcScSYusMbSAS9G`「2026 網紅行銷趨勢（全球 vs 台灣）」12/12 圖全部完成，pipeline done
- image worker Cloud Run 部署完成（timeout 300s，chain recovery 已修）
- 修 image chain 斷鏈根因：lock.skip 路徑未呼叫 chainNext，已補 task.status===done 判斷 + redeploy
- 修 image_prompt 攝影師角色寫入格式：PUT body 要直接送 `{image_prompt:"..."}` 不是 `{key, value}`
- NYT Magazine photographer 角色已正確寫入 Firestore settings（length 865）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `cloud-run/image-worker/src/index.ts` | lock.skip 路徑加 chainNext recovery，避免 chain 斷死 |
| Firestore `settings/roles.image_prompt` | NYT 攝影師人格，正確格式寫入 |

---

## 下一步

Adam 正在後台建新題材，等他建好後跑新 pipeline，觀察：
1. article-write Cloud Run 串行是否全自動（主文→子文依序完成）
2. image-plan → image Cloud Run chain 是否不需手動介入
3. 最終 `/dashboard/{issueId}` 看稿

進場先確認：`article-write-worker` 的 idempotency skip 路徑是否也有 chainNext 死角（還沒查）。

---

## 卡住 / 未解

- article-write-worker 的 idempotency skip 路徑未確認是否也有 chainNext 死角（下次進場先查）
- OPENAI_API_KEY 曾在 session 中暴露，Adam 說先用，之後記得換 key

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| ANEWS 平台 | `~/.ailive/anews-platform/`，prod: https://anews-platform.vercel.app |
| image worker | `~/.ailive/anews-platform/cloud-run/image-worker/` → Cloud Run `anews-image-worker` asia-east1 |
| article-write worker | `~/.ailive/anews-platform/cloud-run/article-write-worker/` |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-28 · 築*
