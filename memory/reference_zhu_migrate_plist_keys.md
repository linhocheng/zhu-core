---
name: ai.zhu.migrate.plist 的 API key 沒進 git
description: plist 裡的 GEMINI_API_KEY + FIREBASE_SERVICE_ACCOUNT_PATH 是手動寫入的，重建 plist 時要補
type: reference
originSessionId: 33684d1a-4446-4b2d-aee1-bf479269e1e6
---
`~/Library/LaunchAgents/ai.zhu.migrate.plist` 的 `EnvironmentVariables` 區塊有兩個 key 是手動補的，**不在 git 裡**：

```xml
<key>GEMINI_API_KEY</key>
<string><!-- 值不記在這裡，見下方「去哪拿」 --></string>
<key>FIREBASE_SERVICE_ACCOUNT_PATH</key>
<string>/Users/adamlin/.ailive/zhu-core/zhu-self/secrets/firebase-sa.json</string>
```

**去哪拿 GEMINI_API_KEY（不要把值寫回這個檔）:**
1. 現行值在本機 `~/Library/LaunchAgents/ai.zhu.migrate.plist` 的 `EnvironmentVariables` 區塊 — `plutil -p` 可讀
2. 需要新建/輪替時走 GCP Console → APIs & Services → Credentials

**Why:** 敏感資料不入 git，plist 在 `~/Library/LaunchAgents/` 只在本機。

**⚠️ 2026-08-06 修正**：這個檔原本把 GEMINI_API_KEY 的**完整明文**寫在上面的 xml 區塊裡，存在約 91 天（2026-05-07 建檔起）。而記憶庫每 6 小時被 `zhu migrate` 讀去入庫 Firestore ＋ 有第二份實體副本在 `zhu-core/memory/`（**已進 git**）—— 一份明文 key 因此散佈到三個地方。
**通則：記憶檔記「key 叫什麼、去哪拿、沒有會怎樣」，永遠不記值。** 記憶庫不是 secret store，它會被同步、被入庫、被 commit。
**舊 key 尚未輪替（2026-08-06 決議：先移除明文，輪替之後再說）—— 這是未結項。**

**How to apply:** 任何時候重建或更新 `ai.zhu.migrate.plist`（upgrade、換機、launchd reset），必須手動把這兩個 key 補回 `EnvironmentVariables` dict，否則 launchd 跑 migrate 時會靜默失敗（GEMINI_API_KEY missing）。

**觸發信號:** 看到 `migrate.err.log` 有 `GEMINI_API_KEY missing`，或 migrate 跑出 `ok=0 fail=66`，立刻查 plist 的 EnvironmentVariables 是否有這兩個 key。
