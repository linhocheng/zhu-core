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
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（直連 host `https://bridge-direct.soul-polaroid.work`，VM IP 35.236.185.222）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-09c · ailivex）

- ailivex `/documents` 三份卡住 pending 的文件手動打通，全 200 done
- 根因修完 deploy：`after()` 裡改為 `await Promise.all(pendingJobIds.map(id => dispatchDocumentJob(id)))`，確保 lambda 不在 fetch 送出前結束
- doc worker system prompt 加「一律用繁體中文撰寫」並 redeploy Cloud Run
- `check-jobs.mjs` 加 `assertEnvVar()` 確定性驗證，env parsing 出錯立刻炸，不等 API 401
- memory `feedback_deterministic_work_belongs_in_code.md` 補 2026-06-09 `\n` 實例 + 觸發信號

（同日上半場 MACS Mode 3 下半場已完成，見前版 LAST_WORDS / WORKLOG）

---

## 今天改了哪些檔案（2026-06-09c）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/api/dialogue/route.ts` | `after()` 改 `await Promise.all(pendingJobIds.map(...))` |
| `ailivex-doc-worker/src/index.ts` | system prompt 加繁體中文指示 |
| `ailivex-doc-worker/check-jobs.mjs` | 加 `assertEnvVar()` + strip 尾巴 `\n` |
| `memory/feedback_deterministic_work_belongs_in_code.md` | 補 `\n` 實例 + 觸發信號 |

---

## 下一步

**ailivex 文件鏈已通，但只手動 curl 過 Cloud Run，從沒跑過完整對話觸發路徑。**

1. **最優先**：開對話讓角色輸出 `[[DOCUMENT]]`，確認 `dialogue → after() → Cloud Run → done` 完整 e2e 通
2. **MACS 續**：Mode 3 真案 e2e（11 角色暗黑心理聲音協奏質感，tsc 綠不代表 LLM 輸出好）

---

## 卡住 / 未解

- ailivex 文件鏈 e2e（dialogue 觸發路徑）未驗，只確認 Cloud Run 直打通
- MACS Mode 3 新 prompt 聲音魔性未跑真案驗

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
| ailivex 平台 | `~/.ailive/ailivex-platform/`（Vercel） |
| ailivex doc worker | `~/.ailive/ailivex-doc-worker/`（Cloud Run asia-east1） |
| MACS 平台 | `~/.ailive/macs-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-09c · 築*
