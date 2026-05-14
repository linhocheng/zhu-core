---
name: VM 殺 node 進程用 killall 不用 pkill
description: pkill -f 'node index.js' 殺不到以絕對路徑啟動的 node 進程，要用 killall -9 node
type: feedback
originSessionId: 3b96bb42-5604-4efe-8f30-17f33cd4f9e4
---
`pkill -f 'node index.js'` 只匹配命令列字串包含 `node index.js` 的進程。但如果進程是以絕對路徑啟動（`/usr/bin/node /home/.../index.js`），pkill 找不到它，進程繼續活著。

**Why:** 在 zhu-dev VM 上，nohup 啟動的 bridge 進程用絕對路徑，pkill 屢次失效，造成兩個 bridge 同時跑、Firestore 狀態混亂、counter 雙軌計數。

**心態:** 工程精確姿態，不假設「指令能用就對了」。`pkill -f` 看似能殺，實際不殺絕對路徑進程 — 工具的 silent miss 比 silent crash 更危險。重啟前必須確認進程真的沒了再啟新的，不然兩份同時跑 = 兩份即是零份。

**How to apply:** 在 VM 上殺 node 進程一律用 `killall -9 node`（殺所有 node 進程）。標準重啟指令：
```bash
killall -9 node 2>/dev/null; sleep 2; cd ~/claude-bridge && set -a && source .env && set +a && nohup node index.js >> ~/bridge.log 2>&1 &
```
