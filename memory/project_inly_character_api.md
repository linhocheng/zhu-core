---
name: project-inly-character-api
description: "ailiveX 角色 API(/api/v1/*)+ INLY 品牌沙盒——靈魂託管雲的第一條對外線,2026-07-28 MVP 全通"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**角色 API(ailiveX 開放對外第一步)**:API key = 沒有介面的機器用戶。key 綁單一角色,品牌主帶 `externalUserId` → 影子用戶 `api-<shortId>-<externalUserId>` → 走現有 dialogue/記憶/日記血管,記憶按端用戶隔離。

- 端點:`/api/v1/chat`(文字+key層額度)、`/api/v1/tts`(角色開口,聲紋不出門)、`/api/v1/voice/session`(LiveKit 直連;202 waking=待命喚醒響鈴契約)。CORS 全開(key 即門禁)。
- key 存 `api_keys/{sha256}`,scopes=[chat,tts,voice],明文只出現一次、可撤銷。
- **INLY 沙盒**:`~/.ailive/inly`(獨立目錄+獨立 Vercel project,非 git)→ https://inly-one.vercel.app。鐵律:只准碰 /api/v1,不共用平台代碼——API 做不到的它就做不到。紫琥珀配色(Adam 會重設計 UI)。
- 2026-07-28 實測:A.Two 跨 stateless 呼叫記得端用戶(小林/手工皮件+提煉4條記憶)、端用戶隔離 OK、TTS 真 mp3、waking 19s→200 token。
- **治理紅線(實測抓到)**:角色知識庫對所有端用戶全開——A.Two 把達摩內部客戶案例講給陌生端用戶還誤認身份。正式版必做知識分域(per-key scope)。
- 轉正債(顯式養著):v1/chat 與 dialogue route 雙編排要抽共同內核;語音秒數計量掛影子用戶未匯總到 key;無 per-key 併發閘;API 通話不錄音;memory 審核台(pending→審核→active)未建。
- 願景藍圖(Adam 拍板):三平面=品牌現場(對方UI+LiveKit直連)/控制面(key/token/額度)/治理面(記憶審核+知識庫+方法論)。收費=月費額度包,計量全程式。

相關:[[project-ailivex-platform]]、待命喚醒制(v18.25.0,撥號自動開機/閒置30分熄燈,同日上線,voice/session 直接復用)。
