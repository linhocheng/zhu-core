---
name: launchctl unload ≠ disable，plist 還在開機就復活
description: 想停一個 launchd 服務，bootout/unload 不夠，plist 留在 LaunchAgents/ 下次開機 launchd 會再拉起來
type: feedback
originSessionId: 43998a4d-b567-4e17-8762-b3273804909d
---
要永久停一個 launchd 服務，**只 `unload` / `bootout` 不夠**，必須把 plist 從 `~/Library/LaunchAgents/` 搬走（或刪掉、或改副檔名）。

**Why:** OpenClaw 4/30 只 `launchctl unload`，記憶寫「已暫停」。系統 5/5 早上重啟，launchd 掃 LaunchAgents/ 把 plist 重新載入 → gateway 又活了 2 天，Telegram polling 整段崩掉沒人理。「暫停」變成假訊息，下一次 Adam 看 plist 會以為是新裝。

**心態:** 核實姿態，不信「我以為 unload 了」。launchd 服務的「停」要看 plist 是否還在原處 — 系統重啟會說真話。記憶寫「已停」前先眼見為憑，否則記憶會說謊（OpenClaw 就是先例）。

**How to apply:**
- 暫停一個 launchd 服務的最小完整動作：
  1. `launchctl bootout gui/$(id -u)/<label>` — 停當下進程
  2. `mv ~/Library/LaunchAgents/<label>.plist ~/Library/LaunchAgents/_disabled_YYYY-MM-DD/` — 防止重啟復活
- 寫進記憶 / SOP「已停」之前，先確認 plist 不在 LaunchAgents/ 下，否則記憶會說謊
- 復活時把 plist 搬回來 + `launchctl bootstrap gui/$(id -u) <plist-path>`

**觸發信號：**
- 看到自己或記憶寫「已 unload」「已暫停」「已停止」launchd 服務，**檢查 plist 還在不在原處**
- 看到 `KeepAlive=true` + `RunAtLoad=true` 的 plist，要警覺：這種設定下「停」的唯一方法是搬 plist
- 服務 ELAPSED 跟系統最近一次重啟對齊但記憶說「早就停了」→ 99% 是這個雷
