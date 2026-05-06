#!/usr/bin/env node
// watch-and-embed.mjs
// 監控 zhu-core 與 memory 目錄，新增/修改 .md → 自動跑 embed-and-upsert
// task #8 雛形（needs `npm i chokidar` if not available）
//
// Run:
//   node watch-and-embed.mjs
//   ZHU_SELF_DRY_RUN=1 node watch-and-embed.mjs

import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WATCHED = [
  resolve(homedir(), '.ailive/zhu-core/docs/WORKLOG.md'),
  resolve(homedir(), '.ailive/zhu-core/ZHU_LAST_WORDS.md'),
  resolve(homedir(), '.ailive/zhu-core/LESSONS.md'),
  resolve(homedir(), '.ailive/zhu-core/docs/LESSONS'),
  resolve(homedir(), '.claude/projects/-Users-adamlin/memory'),
];

const DEBOUNCE_MS = 1500;
const debouncers = new Map();

async function setup() {
  let chokidar;
  try {
    chokidar = (await import('chokidar')).default;
  } catch {
    console.error('chokidar 沒裝。請在 zhu-self 目錄跑：npm i chokidar');
    console.error('暫時 fallback 到 fswatch（macOS only）...');
    return startFswatchFallback();
  }

  const watcher = chokidar.watch(WATCHED, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('add', (p) => onChange('add', p));
  watcher.on('change', (p) => onChange('change', p));
  console.error('[watch] started, monitoring:');
  for (const p of WATCHED) console.error('  -', p);
}

function startFswatchFallback() {
  const proc = spawn('fswatch', ['-0', ...WATCHED], { stdio: ['ignore', 'pipe', 'inherit'] });
  let buffer = Buffer.alloc(0);
  proc.stdout.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    let idx;
    while ((idx = buffer.indexOf(0)) !== -1) {
      const path = buffer.subarray(0, idx).toString('utf8');
      buffer = buffer.subarray(idx + 1);
      onChange('change', path);
    }
  });
  proc.on('exit', (code) => console.error(`[fswatch] exited ${code}`));
}

function onChange(kind, path) {
  if (!path.endsWith('.md')) return;

  // debounce per-path
  if (debouncers.has(path)) clearTimeout(debouncers.get(path));
  debouncers.set(
    path,
    setTimeout(() => runEmbed(kind, path), DEBOUNCE_MS)
  );
}

function runEmbed(kind, path) {
  const script = resolve(__dirname, 'embed-and-upsert.mjs');
  console.error(`[${kind}] ${path} → embed`);
  const proc = spawn('node', [script, path], {
    stdio: 'inherit',
    env: { ...process.env },
  });
  proc.on('exit', (code) => {
    if (code !== 0) console.error(`[embed] failed code=${code}`);
  });
}

setup();
