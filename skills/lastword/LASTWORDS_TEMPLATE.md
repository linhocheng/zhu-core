# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

{{SESSIONS}}

---

## 最新一場改了哪些檔案

{{FILES}}

---

## 下一步

{{NEXT}}

---

## 卡住 / 未解

{{UNRESOLVED}}

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：{{DATE}} 第{{SEQ}}場。*
