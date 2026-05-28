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

## 最新完成（2026-05-28d）

- 讀者頁全面 RWD（768px breakpoint，CSS !important 覆蓋 inline style）
- 子題列表手機爆版修復（數字 80px → 40px）
- Issue Hero 重設計：封面大圖壓底 + gradient overlay，消除重複縮圖
- 修 `inset: 0` React 不認的靜默 bug（改 top/left/right/bottom）
- 稍早：CF 524 根治（BRIDGE_URL 直連 VM IP）、GCP firewall tag 修正、牙齒保健趨勢全鏈路驗證通過

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/globals.css` | 新增 reader RWD 區段，media query + !important |
| `anews-platform/app/issues/[issueId]/page.tsx` | Hero 全幅背景圖、拿掉縮圖、RWD className |
| `anews-platform/app/articles/[articleId]/page.tsx` | RWD className（sidebar/header/grid） |
| `cloud-run/article-write-worker/src/index.ts` | BRIDGE_URL → 35.236.185.222:3001 直連 |
| `anews-platform/app/api/cron/auto-kick/route.ts` | watchdog image 改 enqueueTask |
| `anews-platform/vercel.json` | LLM workers maxDuration 120s |
| `anews-platform/middleware.ts` | /dashboard Basic Auth |

---

## 下一步

`cd ~/.ailive/anews-platform` → 開新 issue 跑一次全鏈路，確認：
1. polish/coherence 在 120s 內完成（maxDuration 修完後首次觀察）
2. RWD 在真實手機上 OK（已在 Android 驗過子題，其他頁待確認）

有空修 **#19 blueprint write order**（重試產生重複 image_tasks，根因：先寫資料再 commit status）。

---

## 卡住 / 未解

- **#9** `startNextSubArticle` status 條件是 `alignment_done`，singleWriteMode 不走（Cloud Run chain 正常，影響低）
- **#16** `callbackOrchestrator` taskId = `Date.now()`，冪等鎖失效（`advancePhase` 有保護，低優先）
- **#19** blueprint 先寫資料再 commit status，重試產生重複 image_tasks（中優先）
- **gpt-image-2** 偶發 >120s，Vercel timeout；Cloud Tasks retry 兜底但慢（可接受）
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
*2026-05-28d · 築*
