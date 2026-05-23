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

## 最新完成（2026-05-23）

- Harness Lite 五個 worker 全遷移：source / blueprint / section-write / section-qa / stitch
- 建立 `lib/workers/errors.ts`、`trace.ts`、`harness.ts` 三個基礎設施檔案
- `orchestrate/route.ts` 加入 `needs_repair` 事件——article 三次失敗後 issue 整個標為 needs_repair
- TypeScript build clean（0 errors）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `lib/workers/errors.ts` | WorkerError class + WorkerErrorType union + classifyError |
| `lib/workers/trace.ts` | writeWorkerTrace fire-and-forget |
| `lib/workers/harness.ts` | createHarnessWorker 完整 harness：auth/lock/precondition/handler/verify/trace/repair |
| `app/api/workers/source/route.ts` | createMockWorker → createHarnessWorker，parse 失敗拋 WorkerError |
| `app/api/workers/blueprint/route.ts` | 同上，新 section 補 repairAttempts:0 |
| `app/api/workers/section-write/route.ts` | 同上，空 LLM 回應拋 LLM_ERROR |
| `app/api/workers/section-qa/route.ts` | parse 失敗拋 PARSE_ERROR；QA fail 是 domain 路徑不觸發 repair |
| `app/api/workers/stitch/route.ts` | Storage 上傳失敗拋 STORAGE_ERROR |
| `app/api/workers/orchestrate/route.ts` | needs_repair 事件，寫 issue.status=needs_repair |

---

## 下一步

**寫 `scripts/test-harness.mjs`**——destruction tests A-E：

```
A. malformed JSON body → 400 + 不觸發 repairAttempts
B. valid JSON missing schema fields → SCHEMA_VALIDATION WorkerError
C. missing precondition（article 狀態不對）→ PRECONDITION WorkerError
D. Storage URL missing（mock bucket fail）→ STORAGE_ERROR WorkerError
E. QA fail 三次 → section.repairAttempts=3 → needs_repair 升級 + article 同步升級
```

之後：`vercel --prod` deploy → 小模式 regression（2 articles）→ standard mode dry-run。

---

## 卡住 / 未解

- Cloud Run source worker（`cloud-run/source-worker/src/index.ts`）還是舊的 express 直寫，**尚未 vendor harness/trace/errors**。這個是獨立 service，要把三個 lib 手動 copy 進去再 rebuild deploy。
- test-harness.mjs 尚未動手

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
| ANEWS platform | `~/.ailive/anews-platform/` |
| ANEWS harness | `lib/workers/harness.ts` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-23 · 築*
