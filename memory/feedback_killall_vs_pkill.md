---
name: VM 殺 node 進程用 killall 不用 pkill
description: pkill -f 'node index.js' 殺不到以絕對路徑啟動的 node 進程，要用 killall -9 node
type: feedback
originSessionId: 3b96bb42-5604-4efe-8f30-17f33cd4f9e4
---
`pkill -f 'node index.js'` 只匹配命令列字串包含 `node index.js` 的進程。但如果進程是以絕對路徑啟動（`/usr/bin/node /home/.../index.js`），pkill 找不到它，進程繼續活著。

**Why:** 在 zhu-dev VM 上，nohup 啟動的 bridge 進程用絕對路徑，pkill 屢次失效，造成兩個 bridge 同時跑、Firestore 狀態混亂、counter 雙軌計數。

**心態:** 工程精確姿態，不假設「指令能用就對了」。`pkill -f` 看似能殺，實際不殺絕對路徑進程 — 工具的 silent miss 比 silent crash 更危險。重啟前必須確認進程真的沒了再啟新的，不然兩份同時跑 = 兩份即是零份。

**⚠️ 2026-08-06 更正：本條的操作段已作廢，照做會製造雙 process。**

原本這裡寫的標準重啟指令是 `killall -9 node … && nohup node index.js &`。
**bridge 早已由 systemd 接管**（`claude-bridge.service`，`Restart=always`）——手動 nohup 起的那個會和 systemd 自動拉起的那個同時跑。
這不是假設，是踩過的事故：MOLOWE 情報官首跑產 4 篇而非設計的 2 篇，根因就是雙 process（見 [[reference_bridge_vm_systemd]]）。

**How to apply:**
- **bridge VM 重啟一律 `sudo systemctl restart claude-bridge`**，不要 killall、不要 nohup。完整 SOP 見 [[reference_bridge_vm_systemd]]
- 看 log 用 `journalctl -u claude-bridge -f`，不用 `tail ~/bridge.log`（後者只有手動 nohup 時才會寫入 —— 看得到內容本身就是雙 process 的警訊）
- 本條**仍然有效的知識只剩一句**：`pkill -f 'node index.js'` 匹配不到以絕對路徑啟動的進程。這在**沒有 process manager 接管**的場合（ad-hoc 腳本、本機臨時進程）才用得上；只要那個服務有 systemd/launchd/pm2 管，就用它的 restart，別自己殺。

**觸發信號:**
- 想輸入 `killall -9 node` 或 `nohup node … &` → 先問「這個服務有沒有 process manager 在管？」有就住手
- `systemctl status` 看到不只一個主 PID、或工作跑出雙倍產量（4 篇 vs 2 篇）→ 雙 process
- 讀到一條 memory 給的是**現成可貼的指令**而不是判準 → 那種最容易腐爛，貼之前先核現況（本條自己就是活教材）
