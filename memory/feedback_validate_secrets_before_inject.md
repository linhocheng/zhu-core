---
name: 動手前驗證 secret／API key 是否真的有效
description: 從 Vercel env / 既有快照拿來的 key 不一定有效，灌進新環境前必先用 curl 直打 API 驗證 200 才動手
type: feedback
originSessionId: 68bd6c54-6b9b-4e51-a956-90e82bb13b99
---
從 Vercel `env pull` 拿到的 production key、或既有專案的 secret 快照檔，**不一定還有效**。Adam 可能在外部 dashboard（Anthropic / ElevenLabs）撤銷過 key，沒同步回 Vercel；或既有服務「看似還在跑」其實用了 fallback / cache。

**Why:** 2026-04-27 ailive 即時撥號上雲時，假設「Vercel production 在用 = 一定有效」連續兩次踩雷：
- ANTHROPIC_API_KEY 從 Vercel pull 灌進 GCP secret → agent log 出現 401 invalid x-api-key
- ELEVENLABS_API_KEY 同樣模式 → agent TTS connection closed
最後是用 `~/.ailive/jianbin-v2-keys/jianbin_v2_keys_20260425.json` 的江彬上線快照才拿到真有效的 key。違反「動手前驗證假設」三必白跑了三輪 deploy。

**How to apply:** 灌任何 API key 進新環境（GCP Secret Manager / Vercel env / Cloud Run secret）前，先 curl 直打對應 API，確認 HTTP 200 才動手。範例：

```bash
# Anthropic
curl -X POST 'https://api.anthropic.com/v1/messages' \
  -H "x-api-key: $KEY" -H "anthropic-version: 2023-06-01" -H "Content-Type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'

# ElevenLabs
curl 'https://api.elevenlabs.io/v1/voices' -H "xi-api-key: $KEY"
```

備援：`~/.ailive/jianbin-v2-keys/jianbin_v2_keys_20260425.json` 是江彬 2026-04-25 上線快照，未來其他專案缺 key 時是第一手備援來源（含 anthropic/deepgram/elevenlabs/minimax/livekit 全套）。
