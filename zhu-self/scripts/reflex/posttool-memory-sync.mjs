#!/usr/bin/env node
// posttool-memory-sync.mjs
// Claude Code PostToolUse hook
// Write 工具寫到 memory 目錄時，自動同步 zhu_memories → Firestore
// 永遠 exit 0，不阻斷任何動作。

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

const MEMORY_DIR = resolve(homedir(), '.claude/projects/-Users-adamlin/memory');
const SYNC_SCRIPT = resolve(homedir(), '.ailive/zhu-mid-src/scripts/sync-memories.mjs');
const SA_PATH = resolve(homedir(), 'Downloads/程式碼/2026/moumou-os-firebase-adminsdk-fbsvc-83d6aacc16.json');

function readStdin() {
  try {
    const buf = readFileSync(0, 'utf8');
    return buf ? JSON.parse(buf) : {};
  } catch {
    return {};
  }
}

const payload = readStdin();
const toolName = payload.tool_name ?? payload.toolName ?? '';
const toolInput = payload.tool_input ?? payload.toolInput ?? {};
const filePath = toolInput.file_path ?? toolInput.filePath ?? '';

if (toolName !== 'Write' || !filePath.startsWith(MEMORY_DIR)) {
  process.exit(0);
}

if (!existsSync(SYNC_SCRIPT) || !existsSync(SA_PATH)) {
  process.exit(0);
}

try {
  execFileSync(
    process.execPath,
    [SYNC_SCRIPT],
    {
      env: {
        ...process.env,
        FIREBASE_SERVICE_ACCOUNT_PATH: SA_PATH,
        NEXT_PUBLIC_FIRESTORE_PROJECT_ID: 'moumou-os'
      },
      stdio: 'pipe',
      timeout: 30_000
    }
  );
  console.error('[memory-sync] 記憶已同步至 Firestore zhu_memories');
} catch (e) {
  console.error('[memory-sync] 同步失敗：', e.message);
}

process.exit(0);
