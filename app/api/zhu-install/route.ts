import { NextResponse } from 'next/server';

const INSTALL_SCRIPT = `#!/bin/bash
set -e

# ─────────────────────────────────────────
#  築 MCP 一鍵安裝腳本
#  適用：任何 Mac，裝完重啟 Claude Desktop 即可
#  用法：curl -s https://zhu-core.vercel.app/api/zhu-install | bash
# ─────────────────────────────────────────

ZHU_USER=$(whoami)
MCP_DIR="$HOME/.mcp-servers"
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

echo ""
echo "🔧 築 MCP 安裝開始"
echo "   用戶：$ZHU_USER"
echo "   MCP 目錄：$MCP_DIR"
echo ""

# Step 1: 確認 Node.js
echo "▶ 確認 Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js 未安裝。請先執行：brew install node"
  exit 1
fi
NODE_VER=$(node --version)
echo "   ✅ Node.js $NODE_VER"

# Step 2: 建目錄
echo "▶ 建立 MCP 目錄..."
mkdir -p "$MCP_DIR"
echo "   ✅ $MCP_DIR"

# Step 3: 寫入 zhu-bash-mcp.mjs
echo "▶ 寫入 zhu-bash-mcp.mjs..."
cat > "$MCP_DIR/zhu-bash-mcp.mjs" << 'MJSEOF'
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
      return { content: [{ type: 'text', text: stdout + (stderr ? '\\nSTDERR: ' + stderr : '') }] };
    } catch (error) {
      return { content: [{ type: 'text', text: 'ERROR: ' + error.message }] };
    }
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
MJSEOF
echo "   ✅ zhu-bash-mcp.mjs"

# Step 4: 裝 npm 依賴
echo "▶ 安裝 @modelcontextprotocol/sdk..."
cd "$MCP_DIR"
if [ ! -f "package.json" ]; then
  npm init -y > /dev/null 2>&1
fi
npm install @modelcontextprotocol/sdk > /dev/null 2>&1
echo "   ✅ SDK 安裝完成"

# Step 5: 寫入 Claude Desktop config
echo "▶ 設定 Claude Desktop config..."
mkdir -p "$HOME/Library/Application Support/Claude"

if [ -f "$CLAUDE_CONFIG" ]; then
  cp "$CLAUDE_CONFIG" "\${CLAUDE_CONFIG}.bak"
  echo "   📦 已備份原 config → claude_desktop_config.json.bak"

  if grep -q '"zhu-bash"' "$CLAUDE_CONFIG"; then
    echo "   ✅ zhu-bash 已存在於 config，跳過"
  else
    python3 - << PYEOF
import json

config_path = "$CLAUDE_CONFIG"
mcp_path = "$MCP_DIR/zhu-bash-mcp.mjs"

with open(config_path, 'r') as f:
    config = json.load(f)

if 'mcpServers' not in config:
    config['mcpServers'] = {}

config['mcpServers']['zhu-bash'] = {
    "command": "node",
    "args": [mcp_path]
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("   ✅ zhu-bash 注入 config 完成")
PYEOF
  fi
else
  python3 - << PYEOF
import json

config_path = "$CLAUDE_CONFIG"
mcp_path = "$MCP_DIR/zhu-bash-mcp.mjs"

config = {
  "mcpServers": {
    "zhu-bash": {
      "command": "node",
      "args": [mcp_path]
    }
  }
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("   ✅ 新建 claude_desktop_config.json 完成")
PYEOF
fi

# Step 6: Clone repos
echo ""
echo "▶ Clone ailive repos..."
mkdir -p "$HOME/.ailive"

if [ ! -d "$HOME/.ailive/ailive-platform" ]; then
  echo "   Clone ailive-platform..."
  git clone https://github.com/linhocheng/ailive-platform "$HOME/.ailive/ailive-platform" 2>&1 | tail -1
else
  echo "   ✅ ailive-platform 已存在"
fi

if [ ! -d "$HOME/.ailive/zhu-core" ]; then
  echo "   Clone zhu-core..."
  git clone https://github.com/linhocheng/zhu-core "$HOME/.ailive/zhu-core" 2>&1 | tail -1
else
  echo "   ✅ zhu-core 已存在"
fi

# Step 7: 確認 vercel CLI
echo ""
echo "▶ 確認 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  echo "   安裝 vercel CLI..."
  npm install -g vercel > /dev/null 2>&1
  echo "   ✅ vercel 已安裝"
else
  echo "   ✅ vercel 已存在"
fi

# 完成
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 築 MCP 安裝完成"
echo ""
echo "下一步："
echo "  1. 完全關閉 Claude Desktop（Cmd+Q）"
echo "  2. 重新開啟 Claude Desktop"
echo "  3. 開新對話，讓築執行 tool_search('zhu-bash')"
echo "  4. 看到 run_bash = 刀在，開工"
echo ""
echo "  如果要 deploy："
echo "    cd ~/.ailive/ailive-platform"
echo "    vercel login"
echo "    npx vercel --prod --yes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
`;

export async function GET() {
  return new NextResponse(INSTALL_SCRIPT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
