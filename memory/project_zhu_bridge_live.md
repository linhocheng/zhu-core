---
name: zhu-bridge 上線（2026-04-30）
description: claude CLI HTTP gateway，把 Vercel/外部 service 從 Anthropic API key billing 切到 Claude Max 月費
type: project
originSessionId: 59b65b14-4e63-47ea-bc93-a67ec60b0e30
---
zhu-dev VM（GCP zhu-cloud-2026 / asia-east1-b / e2-standard-2）跑 `claude-bridge` Node Express，用 systemd 起；對外經 Cloudflare Tunnel `https://bridge.soul-polaroid.work`，無對外 port、自帶 HTTPS。

**用途**：mimic Anthropic Messages SDK shape（POST /v1/messages 回 `{content,model,stop_reason,usage}`），背後 spawn `claude -p --model X --system-prompt ... --output-format json`，吃 Claude Max OAuth（`~/.claude/oauth_token`）。Vercel batch routes 改一行 import 就能切過來，省 Anthropic API 費用。

**架構元件**
- `/etc/systemd/system/claude-bridge.service`：User=adam_dotmore_com_tw，EnvironmentFile=`~/claude-bridge/.env`（含 `BRIDGE_SECRET` 64-hex + `CLAUDE_CODE_OAUTH_TOKEN`），Restart=always
- `/etc/systemd/system/cloudflared.service`：CF Tunnel `zhu-bridge`（id `41c872cb-058b-479f-b838-a0f0079f7629`），4 條 quic 連線到 hkg01/tpe01
- DNS：`bridge.soul-polaroid.work` CNAME → `<tunnel-id>.cfargotunnel.com`，由 CF 自動建
- Auth：Bearer `BRIDGE_SECRET`，沒有 CF Access（service token 多一層會壞點，捨棄）

**Why**：北極星「用 Max 月費取代 per-token API 費」需要把 Anthropic SDK 路徑 redirect 到 claude CLI。Vercel serverless 沒法跑 CLI（無持久 keychain），所以必須有外部 host。

**How to apply**：要新增 batch route 切到 bridge，做 `lib/anthropic-via-bridge.ts`（同 SDK signature），import 換掉一行；realtime 路徑（LiveKit STT/TTS、低延遲對話）不能切，會 4s+ 太慢。
