---
name: bridge /v1/messages 契約 + --effort low（三 endpoint 一致性）
description: zhu-bridge VM 的 /v1/messages 只讀 model/system/messages/stream（忽略 max_tokens）；2026-06-01 補上 --effort low 與另兩條 endpoint 一致，治 Sonnet extended thinking 吃 output budget 截斷
type: reference
originSessionId: f2aa77cd-7ee6-4193-9e0b-b32c6caf3a70
---
**zhu-bridge VM（`zhu-dev`，`~/claude-bridge/index.js`，不在 git，listening :3001，對外 https://bridge.soul-polaroid.work 過 Cloudflare ~130s=524）的 `/v1/messages` 端點契約**：

- **只讀 body 的 `{ model, system, messages, stream }`**。`max_tokens`、`thinking`、`effort` 等欄位**全被忽略**——它把 messages 轉 stdin 餵 `claude` CLI，輸出長度/thinking 由 CLI flag 決定，不是 body。所以「綜述截斷」從 client 端調 max_tokens **沒用**，修點只在 bridge 的 spawn args。
- bridge 內三處 spawn `claude`：line ~48、~949 一直有 `--effort low`；**`/v1/messages`（line ~2261）原本漏掉** → 走它的呼叫（ANEWS B 綜述、MACS research/對質/synthesis 全部）extended thinking 全開吃光 output budget → 長輸出截斷 / 逼近 CF 130s 524。
- **2026-06-01 補上**：`/v1/messages` 的 args 加 `'--effort', 'low'`，與另兩條一致。改後 PONG 驗過、格式（content/usage）完整。**影響所有走此 endpoint 者（含 MACS）**，多半有益（更快、更不截斷），但 thinking 變淺——MACS 真案副作用尚未驗。

**改 bridge SOP**：先 `cp index.js index.js.bak-*` 備份 → sed 精確錨點（先 grep 確認字串唯一）→ `node -c` 語法檢查 → `sudo systemctl restart claude-bridge` → curl :3001 PONG 驗。**可手動回退**（備份檔還原 + restart）；reference_bridge_not_in_git 說的「無 rollback」指無 git 史，不是不能改回。

**觸發信號**：① 走 bridge 的長輸出（綜述/報告/JSON）截斷、JSON 收不了尾 → 先確認 /v1/messages 有沒有 effort low、是不是 thinking 吃 budget。② 想從 client 調 bridge 輸出長度/thinking → 沒用，body 那些欄位被忽略，去改 bridge。③ 動 bridge 前先備份 + grep 唯一 + 改後 PONG 驗。
