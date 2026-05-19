---
name: OpenClaw 已完全卸除（2026-05-07）
description: OpenClaw gateway + Telegram 通報鏈整組拔掉，plist 搬到 _disabled，code 留著
type: project
originSessionId: 43998a4d-b567-4e17-8762-b3273804909d
---
OpenClaw（含 Telegram 通報鏈）2026-05-07 整組從 Air 機卸除。

**Why:** 4/30「暫停」只 unload 沒搬 plist → 系統 5/5 重啟後 launchd 又把 gateway 拉起來，2 天沒人用但跑了 32 小時，Telegram polling 持續壞掉、err.log 滾到 10MB。同時 `ai.ailive.zhu-monitor` + `com.ailive.zhu-autorun` 兩條 Telegram 通報也是同一條鏈、跟 OpenClaw 死綁，所以一起拔。

**How to apply:**
- 五個 launchd 都已 `bootout` 並把 plist 搬到 `~/Library/LaunchAgents/_disabled_2026-05-07/`
  - `ai.openclaw.gateway`
  - `ai.ailive.zhu-monitor`
  - `com.ailive.zhu-autorun`
  - `ai.lucy.scheduler`（順帶清，本來就 EX_CONFIG 一直 spawn fail，program 指向 /tmp 已被清空的 js）
  - `com.clawalytics.dashboard`（OpenClaw 歷史儀表板，data source 沒了，順帶拔。原本還暴露 LAN port 9174）
- code 沒刪：`~/.ailive/zhu-core/tools/zhu-monitor.py` + `zhu-autorun.sh` 還在原地
- npm 全域套件 `openclaw` + `clawalytics` 沒卸（將來若要重開不用重灌）
- SQLite `~/.clawalytics/clawalytics.db` 沒刪（歷史對話分析資料）
- @appleair2_bot 的 token 還活著（Adam 若要徹底切：去 @BotFather revoke）
- 原 openclaw plist 內嵌的 `ANTHROPIC_API_KEY` 已從 disabled plist 中刪除（PlistBuddy Delete）；但這把 key 曾以 644 權限躺 4 個月，建議去 console.anthropic.com revoke 重發（Adam 已選暫不動）

**觸發信號：**
看到 `MEMORY.md` 提到 OpenClaw 「launchctl load 重啟」或「暫停」字眼，要記得：那條路徑 2026-05-07 已斷，不是執行指令會復活，要先把 plist 從 `_disabled_2026-05-07/` 搬回 LaunchAgents/。
