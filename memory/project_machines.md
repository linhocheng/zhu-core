---
name: 雙機器環境（AIR / PRO）+ 共用檔不可覆寫
description: AIR + PRO 兩台 Mac 角色設定，以及跨機器共用檔的同步紀律（PRO 不可覆寫 AIR 已決定的共用檔）
type: project
originSessionId: 43998a4d-b567-4e17-8762-b3273804909d
---
**AIR（MacBook Air M1）— 此刻動手的主機**
- Hostname: adamlindeMacBook-Air.local
- 工作主機，Claude Code 在這跑
- 2026-05-07 完成第一波收城：拔掉 OpenClaw + zhu-monitor + zhu-autorun + lucy + clawalytics 五個 launchd（搬到 `~/Library/LaunchAgents/_disabled_2026-05-07/`）

**PRO（MacBook Pro Intel x86_64）— 24/7 預定主運作環境**
- Hostname: userdeMacBook-Pro.local / IP: 10.215.43.225
- User: user
- 24/7 不關機
- Node v24.6.0、OpenClaw 2026.4.12 已安裝（**也可能有同樣的殭屍 plist 沒清**）
- SSH 已開，AIR key 已加入 authorized_keys
- 靈魂 2026-04-14 從 AIR rsync 過去

**Why:** 雙機器同 git repo (zhu-core, ailive-platform)，靈魂同步靠 git push/pull。AIR 的 5/7 收城決定（OpenClaw 全卸、Telegram 全切）必須在 PRO 也落實，否則出現「Air 已停、PRO 還跑」的真相分裂。

**How to apply（PRO 機的築醒來時必看）：**

1. **共用檔（zhu-core / ailive-platform git repo、MEMORY.md、SOP、靈魂檔）一律以 AIR 最新 push 的版本為準，不可覆寫**
   - 醒來先 `cd ~/.ailive/zhu-core && git fetch && git pull --rebase origin main`
   - 看到 5/7 之後的 commit（`OpenClaw 已完全卸除`、`launchctl unload ≠ disable`、`STEP −1 報到`）→ 接手，不 revert
   - 若 PRO 本機有未 push 的 dirty change → stash + pull + pop + 評估再決定，不要 force push 蓋掉

2. **PRO 也要做同樣的清城動作（不會自動同步，因為 launchd plist 是本機獨立）**
   - 待辦：登入 PRO、清同樣的五個 plist（同方式 bootout + 搬 _disabled_YYYY-MM-DD/）
   - 同樣 chmod / 刪 plist 內嵌 API key
   - 同樣去 `~/Library/LaunchAgents/` 看完整清單，可能還有其他 PRO 獨有的殭屍

3. **Telegram bot token 不要在 PRO 重新建（先前的 04-14 待辦取消）**
   - 5/7 已決定：整條 Telegram 通報鏈拔掉
   - PRO 之後若要主動通知 Adam，找別的 channel（不是 Telegram）

**觸發信號：**
- PRO 機的築醒來、看到 git pull 有 conflict 在 SOP / MEMORY / project_openclaw_setup → 一律以 origin/main 為準，不選自己的本機版
- 看到 PRO 機 LaunchAgents/ 有 ai.openclaw.gateway / ai.ailive.zhu-monitor / com.ailive.zhu-autorun → 不是「PRO 該裝的」，是「還沒清乾淨的殘餘」，照 AIR 5/7 的方式清掉
