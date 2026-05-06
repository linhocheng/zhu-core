---
name: VM 上跑 claude CLI 必須 source bridge .env 帶 OAuth token
description: GCP VM 的 claude CLI 預設未登入，直接呼叫會回「Not logged in」，要 source claude-bridge/.env 才有 CLAUDE_CODE_OAUTH_TOKEN
type: feedback
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
## 規則

在 GCP VM (zhu-dev) 用 shell script 呼叫 `claude -p` 之前，**必須先 source bridge .env**：

```bash
set -a
source /home/adam_dotmore_com_tw/claude-bridge/.env
set +a
```

這樣 `CLAUDE_CODE_OAUTH_TOKEN` 才會進環境，claude CLI 才能走 Max OAuth。

## Why

2026-05-02 建 IG pipeline 排程腳本，直接跑 `claude -p` 回傳：
```json
{"result":"Not logged in · Please run /login", "is_error": true}
```
3 秒就結束，沒有任何 API 呼叫。

根因：VM 上 claude CLI 的 OAuth token 是存在 claude-bridge/.env 的 `CLAUDE_CODE_OAUTH_TOKEN`，
不在系統 profile 裡。nohup 背景跑的 shell 沒有繼承這個 env var。

## How to apply

任何在 VM 寫 shell script 要呼叫 `claude -p` 的場合，腳本開頭加：
```bash
set -a
source /home/adam_dotmore_com_tw/claude-bridge/.env
set +a
```

systemd service 若要呼叫 claude CLI，確認 `EnvironmentFile=/home/adam_dotmore_com_tw/claude-bridge/.env` 有設定。
