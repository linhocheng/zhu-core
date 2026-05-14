---
name: Sonnet 4.6 長文生成必加 --effort low
description: 不加會被 extended thinking 吃光 32K output budget，剩 ~120 tokens 給 visible result
type: reference
originSessionId: a4e715dd-34d5-4035-a1d9-29960e200739
---
claude CLI 跑 Sonnet 4.6 出長文（HTML / 5000 字 markdown）時：
- 預設 extended thinking 開著，會吃 32K output budget 的絕大部分
- visible `result` 欄位只剩 ~120 tokens（一兩段）
- 表面看起來 model 很笨、輸出截斷，其實是 budget 被 thinking 吞掉

**修法：** claude CLI args 加 `--effort low`（disable extended thinking）

完整建議組合（headless 長文用）：
```js
const args = ['-p', '--output-format', 'json', '--tools', '', '--effort', 'low'];
```
- `--tools ""` disable agentic tool loop（避免無謂的 tool call iteration）
- `--effort low` disable extended thinking

驗證：strategy-html-worker 加上後從 7.8KB / 1043s → 41.8KB / 242s / 16.5K tokens output。

**production 套點（2026-05-13 校正）**：bridge service `ExecStart` 是 `~/claude-bridge/index.js`，**不是** internal-server.js（那是 dead file）。生效需在 index.js 改：
- line 48 `runClaude`：`['-p', '--output-format', 'json', '--effort', 'low']`
- line 949 `runClaudeWithTools`：含 `'--dangerously-skip-permissions', '--effort', 'low'`
- line 2261 stream-json **不加**（dialogue/voice-stream 主串流例外）

驗證效果（5/13 晚段 A/B）：Sonnet 4.6 從 113s（LUCY 504 案）→ 22s（80% ↓）。reflect 從 22.8s → 15s（34% ↓）。post 總時間瓶頸轉到 Haiku 25s + Vercel 處理。
