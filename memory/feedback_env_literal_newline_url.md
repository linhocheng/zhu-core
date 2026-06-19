---
name: env 值字面 \n 會讓 URL 解析成 /n → 404 靜默吞
description: env/secret 尾端夾帶字面反斜線n(非真換行).trim()吃不掉;當URL用會被WHATWG解析成.../n打到404,fetch不reject被catch靜默吞,任務卡pending;且 vercel env pull 會把真換行重編碼成字面\n→檔案肉眼比對會說謊
type: feedback
originSessionId: fe444547-4b36-4a4c-9d43-1ee32c82f4c7
---
env 值用 echo / 複製貼上設定時常夾帶尾端**字面 `\n`**(反斜線+n 兩個字元 `5c 6e`,不是真換行 `0a`)。`.trim()` 只吃真空白,**吃不掉字面 `\n`**。

**Why（2026-06-11 ailiveX 文件功能「卡住」)**:`CLOUD_RUN_DOC_WORKER_URL` 尾端有字面 `\n` → WHATWG URL parser 把 `\` 當路徑分隔 → `https://host.run.app\n` 解析成 `https://host.run.app/n` → POST 打到 worker 不存在的 `/n` 路徑回 **404** → 404 是 Response 不是網路 reject,`fetch().catch()` 攔不到 → 靜默吞掉 → job 永遠停在 pending = 文件卡住,卡 2 天沒人發現。worker 本身好的(/health OK、有部署、env 有設),純 env 污染 + 靜默吞錯。

**心態**:secret/URL「設好了」不等於「乾淨」。hexdump 看 bytes 才知真相(`5c 6e` 字面 vs `0a` 真換行,決定 .trim() 救不救得了)。

**How to apply**:
1. 任何從 env 讀的 URL/secret,用前跑 deterministic 清洗:`.replace(/^["']|["']$/g,'').replace(/\\[nrt]/g,'').replace(/\s+/g,'')` —— URL/secret 內部本就無空白,整串洗最穩,不靠手改 env(會再被污染)。天條:確定性的事用程式擋。
2. fire-and-forget 的 `fetch().catch()` 只攔 reject,**攔不到 404/401/5xx**。一定要檢查 `if(!r.ok)` 並印 endpoint+status,否則非 2xx 會跟字面 \n 一樣靜默卡死。對應 `feedback_silent_failure_absent_log`。
3. 診斷「卡住」先分清:停在 pending(沒派發/派發失敗)vs failed(派發了但 worker 報錯)。pending 卡死 → 查 dispatch 端;failed → 查 worker 端。worker /health + Cloud Run log 有沒有收到請求,一刀切開兩邊。

**2026-06-19 升級(ailiveX media-worker webhook 全 401,圖卡 running)**:同病不同臉。兩個根因——(a) `/api/tasks/callback` 沒進 middleware `PUBLIC_PATHS`,webhook 無 session cookie → 中介層先擋 401,還沒進 route;(b) media-worker 送的 webhook secret 尾端帶字面 `\n`(42 字元),Vercel runtime 的 env 是真換行(41 字元),`secret !== envSecret` 永遠不等。

**這次踩的新坑(驗證階段說謊):** 我用 `vercel env pull` 把 env 拉成檔案後**肉眼比對**兩邊,都顯示字面 `\n` → 誤判「相等」。真相是 **`vercel env pull` 會把 runtime 的真換行(char10)重編碼成字面 `\n` 寫進檔案** → 檔案層的視覺比對根本反映不了 runtime bytes。正解:不是看檔案,是**用程式對 live endpoint 做 byte 級 resend 測**(拿 media-worker 原封 42 字元 secret 補送 webhook,看是不是 200)。確定性的事,連「驗證」都要用程式,不能用眼睛比檔案——這是天條 `feedback_deterministic_work_belongs_in_code` 在「驗證階段」的延伸。

**根治模式(咽喉合併 vs 散落正規化):** 同一個「比 secret / 拼 URL」散成 5 種寫法(`.trim()` / `.replace(/^"|"$/,'').trim()` / 各自的 normalizeSecret / 私有 cleanEnv...)= 真相分裂,每處剝的東西還不一樣。正解:抽 `src/lib/clean-env.ts` 的 `cleanSecret()`+`cleanUrl()`(剝引號+字面`\n\r\t`+所有空白;URL 再過 `new URL()` 驗證,壞就 throw 不靜默吞),**在每個生產端 + 每個消費端都套同一個**(咽喉防禦,對應 `feedback_defend_at_convergence_point`)。比對兩端都洗 → byte-identical 由程式保證不靠運氣。附 `scripts/verify-secrets.mjs`:印每個 secret 的 rawLen vs cleanLen + 尾端 charCodes,污染列自動標——驗證用程式不用眼。

**觸發信號**:某非同步任務「卡住」永遠停在 pending/running;worker 活著但 log 沒收到請求;從 env 讀 URL/secret 拼進 fetch/header;webhook/server-to-server 端點無故 401(先查 middleware 白名單,再查 secret bytes);想用 `vercel env pull` 的檔案內容判斷 runtime 值是否相等(它會說謊)。同家族:`feedback_secret_manager_printf`(尾端 \n 讓 aiohttp header 拒送)。
