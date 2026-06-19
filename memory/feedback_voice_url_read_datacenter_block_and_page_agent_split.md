---
name: 語音「讀網址」失敗多半是目標站擋機房IP（非手機）＋用戶端語音按鈕走 base 頁不是 vN 頁
description: ailivex 即時語音貼網址「讀不到/沒收到」的三個根因：①看似手機問題實為 Vercel 出口IP被目標站擋(fetch失敗) ②用戶在 /realtime/ base 頁但 agent 是 v13，改 vN 頁不影響用戶 ③抓成功卻不開口=livekit anthropic plugin 對 sonnet-4-6 在 assistant 結尾注入純空格 user 訊息撞 400
type: feedback
originSessionId: 5b2da2b6-04e7-40f3-bdbd-89660277f607
---
ailivex 即時語音「貼網址讓角色讀」失敗的兩個非顯而易見根因（2026-06-19 張立/商周網址案）。

**一、「手機讀不到」常常根本不是手機，是目標網站擋機房 IP。**
診斷鏈（Cloud Run log 是確定性證據）：
- `[source] share_source queued url='...'` → URL 有送到 agent，RPC/手機/傳輸全正常，排除前端。
- `[source] fetch failed: 讀不到或不是網頁` → agent 走 Vercel `/api/voice-source` → `fetchUrlClean`（`src/lib/url-reader.ts`）→ `fetchGuarded` 回 **null**。
- 「讀不到或不是網頁」這串字**只**出現在 `fetchGuarded` 回 null 那條路徑（line 140），代表收到**非 2xx/3xx 回應（多半 403）、content-type 不是 html、或 redirect 異常**。**不是 timeout**——timeout 會 throw AbortError 被外層 try/catch 接住回不同訊息，不會是這串。
- 關鍵驗證：用**一模一樣的 User-Agent**（`ailiveX-link-reader/1.0`）從本機 curl `businessinsider.tw/article/3387` → 200 text/html 正常；同段程式從 Vercel serverless 出口抓 → null。**同程式同網址，本機通、伺服器不通 = 差別只在出口 IP**。商周（很多有反爬的新聞站）對機房 IP 回 403。電腦上也會一樣失敗，跟手機無關。
- 要讓這類站能讀：得換抓取方式（瀏覽器級 UA / headless / 代理），不是改權限。

**二、用戶端「語音通話」按鈕走的是 base `/realtime/` 頁，但 dispatch 的 agent 是 v13——前端頁面與後端 agent 版本完全解耦。**
- `src/app/chat/[characterId]/page.tsx` 主按鈕 `<Link href={/realtime/${characterId}}>`（base 頁），admin-only 面板才有 v2–v13 實驗連結。
- agent 版本由 `src/app/api/livekit/token/route.ts` 決定：非 admin 看 access doc 的 `voiceVersion`，缺省 → `DEFAULT_VOICE_VERSION`（現為 v13）。**所以用戶在 base 頁的 UI，背後接的是 v13 agent。**
- 後果：改某個 vN 頁（v12/v13）的 UI **不會影響用戶看到的東西**，因為用戶在 base 頁。第一次做「沒 web_search 就隱藏貼網址框」時只改了 v12/v13 頁，漏改 base 頁＝對用戶等於沒改。三頁（base + v12 + v13）都要同步改。

**修法（已落地 2026-06-19）**：`/api/livekit/token` 回傳 `webSearch: (char.capabilities||[]).includes('web_search')`；base + v12 + v13 三頁都加 `webSearch` state、從 token 回應 set、用 `{inCall && webSearch && (...)}` gate 貼網址框 + 「讀網址工作臺」標籤。Admin 設的 capability 因此會同步反映到用戶端 base 頁（用戶的心智模型就是「Admin 設定 = base 頁同步」，要守住這個）。

**三、第三張臉：抓成功了但角色「不開口說讀到了」——是 livekit anthropic plugin 對 sonnet-4-6 的空白注入 bug（2026-06-19 udn 案）。**
- 症狀：log 有 `[source] done`（抓成功、有 digest），但用戶覺得「他沒收到」。真相是讀完那句「我剛讀到了…」的 `session.generate_reply` 撞 Anthropic 400 `messages: text content blocks must contain non-whitespace text` 死掉，嘴張了沒聲（`MiniMax WS streaming done: 0 bytes`）。3a 主動閒聊**照樣成功**、甚至講得出文章內容 → 證明角色拿到了內容，只有「讀完播報」這條路炸（3a 走雙腦直連 LLM，不經 plugin）。
- 根因：`livekit-plugins-anthropic==1.5.1` 的 `_provider_format/anthropic.py` line 96-99：對 `_NO_PREFILL_PATTERNS=("claude-sonnet-4-6","claude-opus-4-6")`（4.6 不支援 prefill），只要對話**以 assistant 結尾**就自動 append 一則 `{"role":"user","content":[{"text":" "}]}`——**只有一個空格**，Anthropic 直接拒收。`source_intake` 讀網址前 `session.interrupt()` 打斷角色 → 對話正好停在 assistant 結尾 → 觸發。回歸點：v12.1（c180a34）才加「讀完主動開口」，v12.0 沒這句就不會炸＝「改一改就不能用」。
- 攔在 chat_ctx 的空 block **沒用**（我第一版踩過）——那個空格是 plugin 在 `to_provider_format` 內部才生的，sanitize items 看不到。
- **修法（已落地 v13-00006）**：override `Agent.llm_node`，用 plugin 自己的 `chat_ctx.to_provider_format(format="anthropic")` 判斷「轉換後最後一則是不是 assistant」，是的話搶先 `chat_ctx.add_message(role="user", content=["(empty)"])`（plugin 自家 leading dummy 就用 `(empty)`），plugin 條件不成立就不塞空格。chat_ctx 是 copy（agent_activity.py:1614/1627），不污染存檔歷史。正常對話（結尾 user）完全不動。現場驗：`[source] done`→`streaming started`→`139320 bytes`、無 400。

**觸發信號**：用戶說語音角色「讀不到網址/手機讀不到/沒收到」；Cloud Run log 出現 `share_source queued` 後接 `fetch failed: 讀不到或不是網頁`（抓失敗）**或** `[source] done` 後緊接 `BadRequestError 400 ... non-whitespace text` + `streaming done: 0 bytes`（抓成功但不開口）；或要改用戶端語音 UI 卻只動了某個 realtime-vN 頁。**SOP**：先看 log 分清「URL 有沒有送到 agent」(queued) vs「agent 抓失敗」(fetch failed)；抓失敗就用同 UA 本機 curl 比對，本機通就是出口 IP 被擋。改用戶端 UI 一定回頭確認改的是 base `/realtime/` 頁（用戶實際入口），不是只改 vN 實驗頁。
