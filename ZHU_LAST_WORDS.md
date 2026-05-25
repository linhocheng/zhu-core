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

- section-qa precondition 幂等化：terminal status 早期 return，停止 babysit double-fire 消耗 repairAttempts
- needs_repair propagation fix：main article 已 stitching_done+ 時 sub 失敗不 kill issue
- image worker transaction fix：Admin SDK reads-before-writes 硬規則，改 Promise.all 先讀
- babysit 節制：5 分鐘 cooldown + 2 分鐘 node age，讓 Cloud Tasks 優先配信
- ANEWS pipeline 端到端跑通：source→intel→blueprint→alignment→section_writing→stitch→polish→image_generating→coherence→export→**done** ✅

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `app/api/workers/section-qa/route.ts` | precondition: terminal status 早期 return |
| `app/api/workers/orchestrate/route.ts` | needs_repair handler: 查 failing art 狀態 + 查 main art 狀態，兩層防護 |
| `app/api/workers/image/route.ts` | transaction reads-before-writes（Admin SDK 規則）|
| `scripts/babysit.mjs` | 5min cooldown + 2min node age，防止 Cloud Tasks concurrent fire |

---

## 下一步

**優先**：把 `IMAGE_DRY_RUN=true` 加進 Vercel prod env（Vercel dashboard → anews-platform → Settings → Environment Variables）。這樣 Cloud Tasks 才能自動配信 image workers，不需手動 fire。

**次優先**：討論 needs_repair design — sub article section 一直 QA 失敗時，pipeline 要繼續（目前行為）還是 human gate？

---

## 卡住 / 未解

- Cloud Tasks image 自動配信：IMAGE_DRY_RUN 未在 Vercel prod env → 手動 fire 才能跑
- GCP 60s cron（workflow-reconcile）未設定：靠 babysit.mjs 人工補，長期要換掉
- needs_repair design 未討論（Adam 明確說「回頭再看」）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ANEWS platform | `~/.ailive/anews-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-25 · 築*
