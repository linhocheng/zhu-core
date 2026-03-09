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
        cwd: cwd || '/Users/adamlin',
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
