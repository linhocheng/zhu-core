---
name: 在 headless VM 用 setup-token + bracketed paste 灌 Claude Max OAuth
description: 遠端 VM 沒瀏覽器要登 Claude Max 時，避開 `claude auth login` 的 Ink prompt 不可見問題；用 setup-token + 模擬 bracketed paste
type: reference
originSessionId: 59b65b14-4e63-47ea-bc93-a67ec60b0e30
---
在 GCP / 任意 headless VM 灌 Claude Code 並用 Max 訂閱（不走 API billing）的可重複 SOP。

**用 `claude setup-token`，不要 `claude auth login`。**
- `claude auth login --claudeai`：headless 下 Ink renderer 不畫 paste prompt，process 看似在等但 stdin 餵不進去（fd 17 ESTABLISHED 到 anthropic.com 但永不完成）
- `claude setup-token`：headless 下會印出可見的 `Paste code here if prompted >`，且最終吐長效 token (`sk-ant-oat01-...`, valid 1 年)

**用 PTY + bracketed paste 餵 code。**
- Ink 開 bracketed paste mode (`[?2004h`)；裸字元會被當逐字鍵入，`\r` 不會 submit
- 正確序列：`\x1b[200~<code#state>\x1b[201~\r\n`
- 用 `pty.fork()` 給真 TTY，不要只 mkfifo + redirect（Ink 偵測到不是 tty 會降級或不畫）

**關鍵環境設定**
- token 存 `~/.claude/oauth_token`（mode 600）
- `~/.bashrc` 加 `export CLAUDE_CODE_OAUTH_TOKEN=$(cat ~/.claude/oauth_token 2>/dev/null)`
- 設好後 `claude auth status` → `loggedIn: true, authMethod: oauth_token`

**踩過的雷**
- `--bare` flag 會強制關 OAuth（只認 ANTHROPIC_API_KEY / apiKeyHelper）→ 測試用 `claude -p` 時**不要加 `--bare`**
- ssh 命令裡用 `pkill -f 'claude'` 會殺到自己的 ssh shell（因 cmdline 含 'claude' 字串）→ 改 `awk '/[c]laude/'` 或先存自己 PID 排除
- redirect_uri 是 `platform.claude.com/oauth/code/callback`（**不是** localhost）→ 瀏覽器跳到 Anthropic 公開頁面顯示 `code#state`，使用者複製整段（含 `#`）
- state 對得上 URL 的 state 才有效；換 process 就要重走授權

**完整驅動腳本範例**：見 session 59b65b14 的 `/tmp/zhu_setup_token_pty.py`，核心邏輯：
1. `pty.fork()` exec `claude setup-token`
2. 主 process 監聽 fd，把輸出寫檔，把 `~/.claude/oauth_token`/code 寫進 PTY master
3. 餵 code 時包 bracketed paste + `\r\n`
4. 等 child exit，從 stdout grep `sk-ant-oat01-...`
