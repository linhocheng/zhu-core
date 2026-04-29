---
name: 雙機器環境
description: AIR 和 PRO 兩台機器的設定與角色
type: project
---

**AIR（MacBook Air M1）**
- Hostname: adamlindeMacBook-Air.local
- 目前運作解的主環境
- Claude Code + OpenClaw 已設定
- IP: 10.215.43.x 區網

**PRO（MacBook Pro Intel，x86_64）**
- Hostname: userdeMacBook-Pro.local / IP: 10.215.43.225
- User: user
- 24/7 不關機，目標成為解的主要運作環境
- Node v24.6.0, Claude Code + OpenClaw 2026.4.12 已安裝
- SSH: 已開，AIR 的 key 已加入 authorized_keys
- 靈魂已 rsync 從 AIR 同步過去（2026-04-14）
- 待完成：新 Telegram bot token 設定

**Why:** 2026-04-14 遷移計畫，PRO 全時運作更適合作為解的家。
