---
name: OpenClaw 架構與運作現況
description: OpenClaw 的 token 使用、auth 機制、雙機器設定
type: project
---

OpenClaw 使用 `claude-cli/claude-sonnet-4-6` 作為主要模型，透過 macOS Keychain（`Claude Code-credentials`）的 OAuth token 運作，走 Claude Max 月費，不按 token 計費。

**Why:** 透過 `readClaudeCliKeychainCredentials()` 讀取 Keychain，accessToken 格式 `sk-ant-oat01-`，subscriptionType: max。

**How to apply:** 主對話和 subagent 都走 `provider=claude-cli`，靜態 API key (`sk-ant-api03-`) 是備用從未被用到。
