# LESSONS 2026-05-17 · Atelier Subagent 完整架構

## L1：session token 不是給 subagent 用的
- 現象：atelier task 永遠停在 parse_brief，沒有 log
- 根因：`_SESSION_TOKEN` 每次 server 啟動隨機生成，存記憶體，不穩定；subagent 拿到的 token 在 server reload 後即失效，PATCH 回 401 但不報錯，靜默停住
- 下次：subagent 進場一律用 per-task `task_secret`，不用 session token
- 對應 feedback：靜默失敗用「缺席的 log」診斷

## L2：webhook + task_secret 是正確的 dispatch 架構
- 現象：subagent 要怎麼知道任務來了、用什麼 auth？
- 根因：以前沒有 dispatch 機制，全靠手動建 task + 手給 token
- 下次：建 task 時帶 webhook_url → hermes 自動 POST payload（含 task_secret）→ subagent 用 task_secret PATCH 回報，不依賴任何 session 狀態
- 對應 feedback：沒問清楚不開工——Adam 釐清三點（Discord觸發/跑完才知/圖即時看）才開始設計

## L3：launchd 管 server，不用手動啟動
- 現象：atelier-subagent server 之前手動跑，重開機就死
- 下次：任何長駐服務第一天就上 launchd（KeepAlive: true），不要「以後再說」
