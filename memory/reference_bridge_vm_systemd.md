---
name: Bridge VM 用 systemctl restart 不要 killall + nohup
description: claude-bridge 在 zhu-dev 是 systemd service，重啟 nohup 會建重複 process 觸發 worker 跑兩遍
type: reference
originSessionId: 8630459a-6de5-434a-bab4-49c61c30a7e9
---
claude-bridge 在 GCP zhu-dev VM 是 systemd 管的，service 名 `claude-bridge.service`：
- ExecStart: `/usr/bin/node /home/adam_dotmore_com_tw/claude-bridge/index.js`
- EnvironmentFile: `/home/adam_dotmore_com_tw/claude-bridge/.env`
- Restart=always, RestartSec=3

**重啟正解**：
```
gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026 \
  --command='sudo systemctl restart claude-bridge && journalctl -u claude-bridge -n 20 --no-pager'
```

**Why**：之前 killall -9 node + nohup 起了兩個 process（systemd auto-restart + 手動 nohup），結果 MOLOWE intel 跑兩遍、產 4 篇 doc 而非 2 篇。

**How to apply**：
- 改 index.js 後一律 `sudo systemctl restart claude-bridge`
- 看 log 用 `journalctl -u claude-bridge -f` 不用 `tail ~/bridge.log`（後者只有手動 nohup 時才會寫入）
- 確認單一 process: `systemctl status claude-bridge` 應只有一個主 PID
- .env 改完不用手動 source — systemd 重啟時會自動載入 EnvironmentFile

**踩過的坑（2026-05-05）**：MOLOWE 情報官首跑產 4 篇而非設計的 2 篇，根因是雙 process。事後 kill -9 PID 殺手動那個解決。
