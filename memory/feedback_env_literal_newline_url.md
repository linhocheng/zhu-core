---
name: env 值字面 \n 會讓 URL 解析成 /n → 404 靜默吞
description: env/secret 尾端夾帶字面反斜線n(非真換行).trim()吃不掉;當URL用會被WHATWG解析成.../n打到404,fetch不reject被catch靜默吞,任務卡pending
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

**觸發信號**:某非同步任務「卡住」永遠停在 pending;worker 活著但 log 沒收到請求;從 env 讀 URL/secret 拼進 fetch/header。同家族:`feedback_secret_manager_printf`(尾端 \n 讓 aiohttp header 拒送)。
