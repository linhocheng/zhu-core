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
  - **BRIDGE_URL（article-write Cloud Run）**：`http://35.236.185.222:3001`（直連 VM，繞 CF）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-05-28e）

- 現場驗證 4 個 ANEWS 問題（auto-kick Section 1 / #19 / #16 / export→done）
- auto-kick Section 1 改 enqueueTask（cron 不再因 sync fetch Cloud Run 先 timeout）
- blueprint #19 正確修法：image_tasks 改 delete-then-recreate（幂等，retry 路暢通）
- 拔掉上個 session 的後患：blueprint_running status flip 會讓 harness 把 PRECONDITION 算作失敗 → needs_repair
- editorial-jobs POST 支援 skipGates 參數（測試全自動跑）
- 薑黃保健品市場 + 2026年網紅行銷兩篇全鏈路跑到 done，無卡點，兩連跑驗證

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/cron/auto-kick/route.ts` | Section 1 改 enqueueTask，移除 sync fetch Cloud Run |
| `anews-platform/app/api/workers/blueprint/route.ts` | image_tasks delete-then-recreate（#19）；拔 blueprint_running 後患 |
| `anews-platform/app/api/editorial-jobs/route.ts` | 支援 skipGates 參數 |

---

## 下一步

評估 #16 callbackOrchestrator：把 taskId 從 `orch-${event}-${issueId}-${Date.now()}` 改成 `orch-${event}-${issueId}`（去掉 Date.now()），讓同一個 event 真正幂等。改之前先確認：有沒有同一個 issue 合法地多次觸發同一個 event（例如同一 issue 的多篇文章各自 stitch_done 打回不同 articleId）。若有，taskId 需帶 articleId。

---

## 卡住 / 未解

- **#16** `callbackOrchestrator` taskId = `Date.now()`，冪等鎖不完整（advancePhase 部分兜住，但 section_done/stitch_done 等不走 advancePhase 的 case 有重複 enqueue 風險）
- **export watchdog 缺失**：若 export 靜默失敗，issue 卡 coherence_passed 無人救援
- **圖生成串列偏慢**：12 張 ~25 分鐘，Cloud Run 一張一張跑（正常設計但慢）
- **#9** `startNextSubArticle` status 條件是 `alignment_done`，singleWriteMode 不走（Cloud Run chain 正常，影響低）
- **Vercel article-write route** 仍是死碼，移除前需確認 orchestrate fallback

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
*2026-05-28e · 築*
