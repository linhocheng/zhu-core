---
name: feedback-glue-layer-errors-lie
description: 跨系統膠水層(auth/credential/CDP/proxy)的錯誤訊息會誤導，真因在別處——逐層扒真信號不讀 code 推
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**規則**：auth / credential / CDP / proxy 這類「跨系統膠水層」除錯時，錯誤訊息字面上指向 A，真因常在 B。不能讀 code 推斷，只能用「這一層我看得到的最原始真信號」一層層扒——真 OIDC claims、真 listen 介面/port、真 image tag、真 error stack、真 HTTP 狀態碼。

**Why**：膠水層是兩個系統版本/契約假設的交界，錯誤在傳遞過程被外層框架重新包裝，字面訊息離真因隔了好幾層。2026-07-25 threads-radar WIF 接 Firestore 一路踩四坑，每個錯誤訊息都說謊：
- `headers.forEach is not a function` → 不是 headers 問題，是注入 authClient 撞 gRPC 版本歪斜
- `auth.fetch is not a function` → 不是 fetch 問題，是 REST transport 不吃注入的 client
- `Invalid principalSet member` → 不是成員格式亂，是單一 subject 該用 `principal://` 非 `principalSet://`（後者只給 attribute/group set）
- neko CDP：`NEKO_ARGS` env 明明設了 chromium 卻沒吃到 → 真因是 launcher line 13 `CHROMIUM_FLAGS=""` 清空 env，且 chromium 無視 `--remote-debugging-address` 只綁容器 loopback

**心態**：讀到膠水層錯誤時，第一反應不能是「照字面修 A」，要是「這訊息可能在騙我，B 是什麼？」——去拿那一層最原始的真信號（不是猜、不是讀上層 code）。跟「模稜兩可信號不能當成功證據」天條是孿生：那條講零資訊信號別當成功，這條講**誤導性信號別當字面診斷**。

**How to apply**：
1. 膠水層卡住→先問「我能拿到這一層最原始的真信號嗎」：token 就 decode claims、CDP 就 curl `/json/version`、port 就 `ss -tlnp` 看綁哪個介面、image 就 `docker inspect` 看 tag、HTTP 就看真狀態碼。
2. 一次只動一層、動完立刻用真信號驗（不要一次改三處再一起測）。
3. 臨時 probe route/腳本是好工具（回傳真 claims/真 error stack），但驗完立刻刪（安全）。
4. 版本歪斜是膠水層頭號嫌疑：注入自訂 client/adapter 撞兩套版本時，優先讓那個系統用它「內部一致的 auth stack」（如 @google-cloud/firestore 走 external_account 檔 ADC），而非硬塞外來 client。

**觸發信號**：錯誤訊息是 `X is not a function`／`Invalid X member`／`Premature close`／env 設了沒生效——且發生在兩個系統的交界（SDK↔雲、瀏覽器↔自動化、proxy↔應用）。心裡冒出「照字面把 A 修掉」時。

關聯：[[feedback-ambiguous-signal-not-proof]]（孿生：零資訊 vs 誤導性信號）、[[feedback-deterministic-work-belongs-in-code]]、[[feedback-cloudrun-firebase-adc]]（Premature close 也是膠水層說謊的一例）、[[project-threads-radar]]

- 驗證+1:2026-08-02 第3場 — ERR_TUNNEL_CONNECTION_FAILED 指向瀏覽器/網路，真因在 proxy 402 餘額用盡，逐層扒才到根

- 驗證+1:2026-08-02 第6場 — log 寫「Anthropic API 401」實際是 x-api-key 敲到 bridge 門；讀錯誤體格式（{"error":"unauthorized"}=bridge 方言）才定位
