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

## 最新完成（2026-05-30）

- 收乾淨 ANEWS 兩類結構債，達成「乾淨、沒技術債的 ANEWS」目標。
- 建 `lib/workers/articleStages.ts`（ARTICLE_STAGE_ORDER 唯一真相 + isAtOrPast helper），殺手枚舉 stage 清單。
- 建 `WorkerSkip` 機制（errors/harness/trace），讓「已往後走」的重送變良性 no-op，不 revert、不升 needs_repair。
- 所有寫 article.status 的 worker 全套冪等 guard（source/blueprint/alignment/stitch 走 precondition WorkerSkip；polish/visual-brief 走 isAtOrPast 早 return）。
- 修 orchestrator 孤兒風暴：被刪 issue XDcxU3 害 Cloud Tasks 重送 701 次，根因是對不存在 doc 跑 update()→NOT_FOUND→500→無限重送。加 `if(!issue.exists) return` 回 200。
- 端到端驗過：POST needs_repair 給不存在 issue → HTTP 200（修前 500）。風暴已靜默。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/lib/workers/articleStages.ts` | 新：ARTICLE_STAGE_ORDER + stageIndex + isAtOrPast |
| `anews-platform/lib/workers/errors.ts` | 新增 WorkerSkip 類（良性 no-op 信號） |
| `anews-platform/lib/workers/harness.ts` | catch 先攔 WorkerSkip → 200 + trace skip，不 escalate |
| `anews-platform/lib/workers/trace.ts` | TraceData.status 加 "skip" |
| `anews-platform/lib/firestore/types.ts` | ArticleStatus union 補齊全 linear stage，對齊 ORDER |
| `anews-platform/app/api/workers/{source,blueprint,alignment,stitch}/route.ts` | precondition 加 isAtOrPast→WorkerSkip |
| `anews-platform/app/api/workers/{polish,visual-brief}/route.ts` | handler 開頭 isAtOrPast→return |
| `anews-platform/app/api/workers/orchestrate/route.ts` | handleEvent 開頭加孤兒防護 if(!issue.exists) return |
| `zhu-core/docs/WORKLOG.md` | 追加 GO session 除債紀錄 |
| `zhu-core/docs/LESSONS/LESSONS_2026-05-30.md` | 新：L1-L3（一類債/孤兒 500 陷阱/secret 換行） |
| `~/.claude/.../memory/skill_async_worker_checklist.md` | 五問→六問（父 doc 被刪回 200 不 throw） |

> ANEWS 改動全在本機 + Vercel，**anews-platform 不是 git repo**，無 commit 留痕，靠 WORKLOG + code 註解。

---

## 下一步

ANEWS 結構債已清乾淨，無 pending 施工。若要再動：
- 讀者頁 PLATE 01/HERO 標籤是設計取捨（刻意保留），Adam 若要去印刷術語再處理 `app/articles/[articleId]/page.tsx:180-191`。
- 可重用唯讀掃描：`anews-platform/scripts/scan-reentry.mjs`（跑法：`cd anews-platform; set -a; source .env.local; set +a; node scripts/scan-reentry.mjs`）找 article/issue 狀態錯位。
- 新媒體多租戶 + 念叔/鐵幕 personas 仍 PARKED 在 `drafts/publications/draft-media-02.md`，等 Adam 出設計。

---

## 卡住 / 未解

無。本 session 兩件債都端到端驗證關閉。

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| ANEWS 平台 | `~/.ailive/anews-platform/`（非 git，deploy: `npx vercel --prod --yes`） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-30 · 築*
