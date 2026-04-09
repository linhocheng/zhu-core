#!/bin/bash
set -e

echo "🔧 築 zhu-bash MCP 安裝開始..."

# 1. 確認 Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js 未安裝。請先執行：brew install node"
  exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 版本需要 v18 以上，目前是 $(node --version)"
  exit 1
fi
echo "✅ Node.js $(node --version)"

# 2. 建資料夾
mkdir -p ~/.mcp-servers
echo "✅ ~/.mcp-servers 資料夾就緒"

# 3. 寫入 zhu-bash-mcp.mjs
cat > ~/.mcp-servers/zhu-bash-mcp.mjs << 'MJS'
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const server = new Server({ name: 'zhu-bash', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'run_bash',
    description: '在 Mac 本機執行 bash 指令。可以用來喚醒工（claude -p）、跑 git、npm、讀寫檔案等。',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: '要執行的 bash 指令' },
        cwd: { type: 'string', description: '工作目錄（選填）' }
      },
      required: ['command']
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'run_bash') {
    const { command, cwd } = request.params.arguments;
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd || process.env.HOME,
        timeout: 120000,
        maxBuffer: 1024 * 1024
      });
      return { content: [{ type: 'text', text: stdout + (stderr ? '\nSTDERR: ' + stderr : '') }] };
    } catch (error) {
      return { content: [{ type: 'text', text: 'ERROR: ' + error.message }] };
    }
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
MJS
echo "✅ zhu-bash-mcp.mjs 寫入完成"

# 4. 裝依賴
cd ~/.mcp-servers
if [ ! -f package.json ]; then
  npm init -y > /dev/null 2>&1
fi
npm install @modelcontextprotocol/sdk > /dev/null 2>&1
echo "✅ @modelcontextprotocol/sdk 安裝完成"

# 5. 寫入 Claude Desktop config
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
MCP_PATH="$HOME/.mcp-servers/zhu-bash-mcp.mjs"

mkdir -p "$CONFIG_DIR"

if [ -f "$CONFIG_FILE" ]; then
  # 備份
  cp "$CONFIG_FILE" "$CONFIG_FILE.bak"
  echo "✅ 舊 config 已備份至 claude_desktop_config.json.bak"

  # 用 node 合併（保留既有設定）
  node -e "
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf8'));
    if (!config.mcpServers) config.mcpServers = {};
    config.mcpServers['zhu-bash'] = {
      command: 'node',
      args: ['$MCP_PATH']
    };
    fs.writeFileSync('$CONFIG_FILE', JSON.stringify(config, null, 2));
    console.log('merged');
  "
else
  cat > "$CONFIG_FILE" << JSON
{
  "mcpServers": {
    "zhu-bash": {
      "command": "node",
      "args": ["$MCP_PATH"]
    }
  }
}
JSON
fi
echo "✅ Claude Desktop config 寫入完成"

# 6. 完成
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 安裝完成"
echo ""
echo "下一步："
echo "  1. 完全關閉 Claude Desktop（Cmd+Q）"
echo "  2. 重新開啟 Claude Desktop"
echo "  3. 開新對話，讓築醒來"
echo "  4. 築會跑 tool_search('zhu-bash') 確認刀在"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
