---
name: Secret Manager 寫入用 printf 不用 echo
description: 寫 GCP Secret Manager（或任何 API key/header 用的 secret）必須用 printf '%s' 或 --data-file，禁止用 echo
type: feedback
originSessionId: 68bd6c54-6b9b-4e51-a956-90e82bb13b99
---
寫 GCP Secret Manager 一律用 `printf '%s' '<value>' | gcloud secrets versions add <name> --data-file=-`，或 `--data-file=` 指向實體檔。**禁止用 `echo`**。

**Why:** 2026-04-25 jianbin-v2 部署後 STT/LLM 全掛。根因是 `deepgram-api-key` 與 `anthropic-api-key` v1 用 `echo` 寫入，結尾帶 `\n`。aiohttp `_serialize_headers` 偵測到 header 含 `\n` → 視為 header injection attack → 拒絕送出 → WebSocket/HTTPS 連線全斷。症狀是「左腦右腦永遠等待中」「APIConnectionError 4 attempts」，但 log 直到深挖才看到 `ValueError: Newline, carriage return, or null byte detected in headers`。

**How to apply:**
- 任何 `gcloud secrets versions add` 一律用 `printf '%s'` pipe 進去
- handoff doc 若寫「-n prefix 問題」是誤導，真因是 `\n` 在 secret 尾端
- 症狀關鍵字：`APIConnectionError`、`Connection error`、`cannot reuse already awaited coroutine`、WebSocket 立即斷線 → 第一個假設就是 secret 尾端換行
- 驗證方式：`gcloud secrets versions access latest --secret=<name> | xxd | tail -3` 看尾端有無 `0a`
