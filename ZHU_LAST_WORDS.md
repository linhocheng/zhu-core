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

- 診斷並修復 Atelier task 永遠停在 parse_brief 的根因（session token 不穩定）
- 在 hermes web_server.py 加入 per-task `task_secret`（PATCH auth 用，不依賴 session）
- 在 hermes web_server.py 加入 webhook 派發機制（建 task 時自動 POST payload）
- 撰寫 `~/.hermes/atelier-subagent/server.py`（port 9210，接 webhook，spawn Claude Code）
- 建 launchd plist，atelier-subagent server 開機自動啟動

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `/Users/adamlin/hermes-agent/hermes_cli/web_server.py` | 加 task_secret 欄位、webhook 派發、_require_task_token() |
| `~/.hermes/atelier-subagent/server.py` | 新建，webhook server + Claude Code spawner |
| `~/Library/LaunchAgents/ai.hermes.atelier-subagent.plist` | 新建，launchd 開機自動啟動 |

---

## 下一步

1. 把 Discord 交辦流程接上 webhook：Discord 下指令 → hermes 建 task（webhook_url 固定 `http://localhost:9210/webhook`）→ Dashboard 自動出現並推進
2. 考慮加 webhook secret 驗證（目前 /webhook 無 auth）
3. executor 可插拔（body 帶 executor 欄位，支援 codex / shell）

---

## 卡住 / 未解

- atelier-subagent 的 claude CLI spawn 用 stdin pipe，長任務有 timeout 風險（待壓測）
- executor 目前只支援 Claude Code CLI，不可插拔

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
| Atelier subagent server | `~/.hermes/atelier-subagent/server.py`（port 9210）|
| Atelier web_server 改動 | `/Users/adamlin/hermes-agent/hermes_cli/web_server.py` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17 · 築*
