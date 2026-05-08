---
name: ai.zhu.migrate.plist 的 API key 沒進 git
description: plist 裡的 GEMINI_API_KEY + FIREBASE_SERVICE_ACCOUNT_PATH 是手動寫入的，重建 plist 時要補
type: reference
originSessionId: 33684d1a-4446-4b2d-aee1-bf479269e1e6
---
`~/Library/LaunchAgents/ai.zhu.migrate.plist` 的 `EnvironmentVariables` 區塊有兩個 key 是手動補的，**不在 git 裡**：

```xml
<key>GEMINI_API_KEY</key>
<string>AIzaSy****REDACTED****</string>  <!-- 真實 key 從 1Password / Vercel env 取，永遠不入 git -->
<key>FIREBASE_SERVICE_ACCOUNT_PATH</key>
<string>/Users/adamlin/.ailive/zhu-core/zhu-self/secrets/firebase-sa.json</string>
```

**Why:** 敏感資料不入 git，plist 在 `~/Library/LaunchAgents/` 只在本機。

**How to apply:** 任何時候重建或更新 `ai.zhu.migrate.plist`（upgrade、換機、launchd reset），必須手動把這兩個 key 補回 `EnvironmentVariables` dict，否則 launchd 跑 migrate 時會靜默失敗（GEMINI_API_KEY missing）。

**觸發信號:** 看到 `migrate.err.log` 有 `GEMINI_API_KEY missing`，或 migrate 跑出 `ok=0 fail=66`，立刻查 plist 的 EnvironmentVariables 是否有這兩個 key。
