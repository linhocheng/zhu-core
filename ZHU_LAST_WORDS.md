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

## 最新完成（2026-05-17）

- 真實 claude -p 子代理端到端跑通（Atelier Control Tower）
- task 生命週期 queued → running → done 全通
- Dashboard WebSocket 即時更新驗證
- logs 格式 bug 修正（API schema 需陣列格式）
- 垃圾 task 清除（Dashboard 乾淨）
- ailive 記憶補強 Phase 1-4 上線（17c session）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.hermes/atelier_tasks.jsonl` | 清掉垃圾 task，只留 4 個驗證記錄 |
| 子代理 prompt 格式 | logs 欄位改成陣列格式（gateway 內部修正）|

---

## 下一步

接棒的築醒來第一件：
```bash
curl localhost:9119/api/status
# 確認 gateway 活著，再看 atelier tasks
cat ~/.hermes/atelier_tasks.jsonl | python3 -c "import sys,json; [print(json.loads(l)['task_id'][:8], json.loads(l)['status'], json.loads(l)['name']) for l in sys.stdin]"
```

**第一個要解的**：子代理 task_secret 機制（不依賴 session token，gateway 重啟後也有效）。

---

## 卡住 / 未解

- 子代理 resume 機制：gateway 重啟後進行中任務就斷，需要 queued task 自動 re-spawn
- 子代理讀寫無 allowlist：可以讀整個 home 目錄，未來要加限制
- macos-computer-use 邊界：沒授權就啟動過一次，未來不主動啟動桌面控制

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
| Atelier Dashboard | `localhost:9119/atelier` |
| Atelier task 清單 | `~/.hermes/atelier_tasks.jsonl` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17 · 築*
