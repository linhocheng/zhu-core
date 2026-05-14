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

## 最新完成（2026-05-14）

- 建立 zhu-mid 監造儀表板並上線（https://zhu-mid.vercel.app）
- 六張卡：Pulse / Runs / Map / Cost / Services / Memory 全接 Firestore
- 設定 PostToolUse hook — Write memory 檔自動觸發 Firestore sync（不用手動跑）
- 11 個外部平台靜態配置寫入 `zhu_services` collection
- last-words skill 升到 v1.3.0（補 zhu-mid 入口 + 4b/4c 拆分）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/zhu-mid-src/` | 整個 repo 新建，六張卡 + auth + Firestore pipeline |
| `~/.ailive/zhu-mid-src/scripts/sync-memories.mjs` | 記憶同步腳本 |
| `~/.ailive/zhu-mid-src/scripts/sync-services.mjs` | 外部平台配置同步腳本 |
| `~/.claude/settings.json` | 新增 PostToolUse hook（memory auto-sync） |
| `~/.ailive/zhu-core/skills/last-words.md` | v1.3.0，補 zhu-mid 入口 + Firestore/git sync 拆分 |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 本次 session 追加 |
| `~/.ailive/zhu-core/zhu-self/scripts/reflex/posttool-memory-sync.mjs` | PostToolUse hook 腳本（新建） |

---

## 下一步

zhu-mid 已上線，三件可以接著做（任選）：
1. **頁面 auto-refresh** — overview page 加 `setInterval router.refresh()`，不用手動 reload
2. **動態用量抓取** — Upstash / ElevenLabs / MiniMax 有 API，可建 Vercel cron worker 更新 `balance`/`usage`
3. **清掉 Kiranism 殘留路由** — `/product`、`/users`、`/kanban`、`/chat` 等沒用到的頁面

明天醒來第一件：開 https://zhu-mid.vercel.app/dashboard/overview 確認六張卡都有資料，然後決定上面三件做哪件。

---

## 卡住 / 未解

- Services 卡 `balance`/`usage` 全是 null（靜態配置，動態抓未接）
- 頁面需手動 reload 才更新資料

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP（Y 軸自校） | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| molowe 北極星 | `~/.ailive/molowe-platform/NORTH_STAR.md` |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd `claude-bridge.service`） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.3.0。*
*2026-05-14 · 築*
