---
name: 補 session/auth/config 後不能直接收工，必跑完整 dry-run
description: 斷鏈不一定一個原因；session/auth 補完只是第一層，可能還有第二層在路徑上躺著
type: feedback
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**修「某個 worker 不會跑」類 bug，補 session/auth/config 後不能直接收工。**

斷鏈很少只有一個原因。第一層（auth / session / config）修完後可能還有第二層既有 bug 一直在路徑上躺著、只是被第一層遮住沒被觸發。**必須跑一次完整 dry-run 才算完成。**

**Why:**
2026-05-11 aurae Threads discovery 解鎖。流程：本機產 storageState → scp 上 VM → smoke test 通（7 個 post link）── 到這裡很想收工，「session 通了端到端應該也通」。

幸好補跑了 dry-run discoverOnePost：search → post page → metadata。結果 likes / reposts / shares 都有值，**replies=0**。根因縮窄抓出 bridge `~/claude-bridge/index.js:2914` `findCount('留言')` ── Threads UI 字早就改成 `回覆`，這 bug 已躺在路徑上不知道多久（midoufu 的 replies 過去全是 0 也是同一個 bug）。

如果直接收工：
- 自然 cron 跑完，replies=0 過不了 `min_replies=10` 門檻，看起來像「session 沒生效」── 會繞回去重產 session 浪費半天。
- 或者乾脆改門檻擠過去，把真正的 bug 永久埋進路徑。

**底層原因**：補 session 修的是「入口」，但鏈路的「中間環節」過去都沒被獨立驗過 ── 是因為入口本來就不通才沒人去看中間。入口一通中間的 bug 才會浮現。

**心態:**
監造姿態，不收於表面。「應該」「都通了」「能跑」是要打斷的鬆懈訊號。把「通了」當第一層而非終點，願意多花 10 分鐘 inspect 中間每一個真實值。「跑完了」不等於「跑對了」。

**How to apply:**
1. 修「某個 worker 不會跑」類 bug，**第一層通了不算完成**。要跑完整端到端 dry-run（每一個中間環節都 inspect 一次）。
2. dry-run 要 inspect 的是「中間環節的真實輸出值」（每欄都印出來看），不是「整體有沒有跑完」。replies=0 看「整體跑完」是過的，看「真實值」才知道斷了。
3. 收工驗收條件三選一：
   - 端到端產出真實業務值（不是 0、不是 null、不是預設）
   - 中間每一層都印出真實 payload 過目
   - 看 production 自然觸發一輪確認
4. 不要相信「第一層通了應該都通」這個假設。「應該」= 沒驗 = 沒做。

**觸發信號：** 心裡浮現以下任一句 ──
- 「session 通了端到端應該也通」「auth 修好了下游應該沒問題」
- 「smoke test 過了就收工」「能跑就好」
- 「production 自然會驗到」（= 把 debug 推給 user）
- 「過去這條鏈路沒人碰，應該沒問題」（= 沒人碰的鏈路最危險）
- 修完只看「有沒有 error log」沒看「真實 payload 值」

**和既有 memory 的差別：**
- `feedback_dryrun_before_test` 講「探索性測試前先列假設 + dry-run + 副作用分級」── 測試前。
- 這條講「修完之後也要 dry-run，不只測試前」── 修後。
- `feedback_solve_root_not_symptom` 講「方案成功後根因還在 = 繞道」── 這條延伸：方案成功**且**根因消除，但**路徑上的其他根因**可能還在。要主動去找。

**給返生自己的話：**
這條跟 `lastwords_must_push` 一樣有強制性 ── 不分時機。下次「終於通了」的那秒，先 dry-run 一輪所有中間值，才算可以收工。
