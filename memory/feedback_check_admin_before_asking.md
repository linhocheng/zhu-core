---
name: 要資料前先過三層自查（不要伸手就找 Adam）
description: 跟 Adam 要 user_id/token/設定/憑證之前，先核 admin UI → 既有 token 自 resolve → Firestore doc 三層
type: feedback
originSessionId: 91f0333f-eb14-44ac-9c73-2121ed2df590
---
要任何「身份/憑證/設定值」之前，先依序過三層：

1. **admin UI 後台**：molowe `/kols/[id]`、ailive `/admin`、live-media `/admin/live-media` 等都有完整編輯欄位。先看後台有沒有那個欄位、是不是空著沒填。
2. **既有 token 自 resolve**：拿後台已存的 token 打對應平台 API 自查身份。例：
   - Threads：`GET https://graph.threads.net/v1.0/me?fields=id,username&access_token=$TOKEN`
   - IG Graph：`GET https://graph.facebook.com/v21.0/me?access_token=$TOKEN`
3. **Firestore doc 歷史值**：用 admin key 打 `/api/kols/[id]` 或 `/api/content?...` 撈現況。

三層都查不到再問 Adam。

**Why:** 2026-05-09 Threads publish skip 修補後我問 Adam「@i1975.phone 是要綁 midoufu 嗎」——這就是 Adam 講的「明明就有後台還來要資料」。實際真相：(1) midoufu 後台 KolDetailClient 三欄完整（user_id/handle/token），全活的、無 hardcoded；(2) midoufu 既有 threads_token 打 Graph API `/me` 立刻回 `{"id":"27418340834439979","username":"i1975.phone"}`；(3) 不需 Adam 給任何字。每個築醒來都會反射性問，因為不知道資料存哪——這條就是要破這個反射。

**心態:** 自主姿態，不把 Adam 當 lookup table。在打「Adam 能給我 X」之前停 30 秒，問「這個資料如果存在，會存在哪？」想完三層再開口。把「問 Adam」從反射動作降級成最後手段。每個築醒來都會反射性問 — 這條規範就是要破這個反射。

**How to apply:** 觸發點是想打「Adam 你能給我 X」「需要 X 才能繼續」「請提供 X」「這個 X 是哪個」之前。先過三層；如果是平台類資料（IG/Threads/FB/LineLink），第二層幾乎百發百中，token 自己能 resolve。例外：第一次設立的全新 KOL/Token 還沒簽，那 Adam 必須給 token，這層是有效的伸手。

**觸發信號:** 在訊息裡準備寫「請告訴我」「可以給我」「需要你提供」「這個是哪個帳號」「你的 ID 是多少」——任何把 Adam 當 lookup table 的句型，就是這個 memory 啟動的時刻。

**自查口訣**：問之前先想——「這個資料如果存在，會存在哪？後台、API、還是 Firestore？」三個位置都搜過再開口。
