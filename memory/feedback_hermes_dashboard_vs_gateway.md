---
name: hermes dashboard process vs gateway process
description: Port 9119 web server is the dashboard process (hermes dashboard), NOT the gateway process — killing gateway doesn't restart the web server
type: feedback
originSessionId: 95afca08-aff2-4dcf-b617-94a0fb42762d
---
Port 9119 (atelier API, web_server.py) is served by the **dashboard process** (`hermes dashboard --no-open --skip-build`), NOT the gateway process (`hermes gateway run --replace`). These are two SEPARATE processes.

**Why:** Spent a session chasing why web_server.py edits didn't take effect — kept killing the gateway (wrong process) while dashboard kept serving old code.

**心態:** 看到 9119 就找 gateway，但 hermes 拆成兩個進程。

**How to apply:** When editing `hermes_cli/web_server.py` (atelier endpoints, auth, routes), restart the dashboard process: `kill -9 $(ps aux | grep "hermes.*dashboard" | grep -v grep | awk '{print $2}')`. Then hermes will auto-restart it.

**觸發信號:** 改了 web_server.py 但 API 行為沒變 → 先確認 dashboard PID 的啟動時間早於 file mod time → kill dashboard process
