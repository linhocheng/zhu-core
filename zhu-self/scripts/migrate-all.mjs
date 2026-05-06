#!/usr/bin/env node
// migrate-all.mjs
// 一次性掃所有既有 .md 檔，呼叫 embed-and-upsert 入 L2。
// task #10 — idempotent，可重跑（dedup by source_path + chunk_index）
//
// Usage:
//   ZHU_SELF_DRY_RUN=1 node migrate-all.mjs       # 只算，不寫
//   node migrate-all.mjs                          # 實際入庫
//   node migrate-all.mjs --only=memory            # 只跑某類

import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(__dirname, 'embed-and-upsert.mjs');

const SOURCES = {
  worklog: [resolve(homedir(), '.ailive/zhu-core/docs/WORKLOG.md')],
  lastwords: [resolve(homedir(), '.ailive/zhu-core/ZHU_LAST_WORDS.md')],
  lessons_top: [resolve(homedir(), '.ailive/zhu-core/LESSONS.md')],
  lessons_dir: [resolve(homedir(), '.ailive/zhu-core/docs/LESSONS')],
  memory: [resolve(homedir(), '.claude/projects/-Users-adamlin/memory')],
};

function listMdFiles(p) {
  if (!existsSync(p)) return [];
  const st = statSync(p);
  if (st.isFile()) return [p];
  if (st.isDirectory()) {
    return readdirSync(p)
      .filter((f) => f.endsWith('.md') && f !== 'MEMORY.md')
      .map((f) => resolve(p, f));
  }
  return [];
}

function runOne(file) {
  return new Promise((res, rej) => {
    const proc = spawn('node', [SCRIPT, file], {
      stdio: 'inherit',
      env: { ...process.env },
    });
    proc.on('exit', (code) => (code === 0 ? res() : rej(new Error(`${file} exit=${code}`))));
  });
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.slice(7) : null;

  const groups = only ? { [only]: SOURCES[only] || [] } : SOURCES;
  const all = [];

  for (const [name, paths] of Object.entries(groups)) {
    for (const p of paths) {
      const files = listMdFiles(p);
      console.error(`[group:${name}] ${p} → ${files.length} files`);
      all.push(...files);
    }
  }

  console.error(`[total] ${all.length} files`);

  let ok = 0;
  let fail = 0;
  for (const f of all) {
    try {
      await runOne(f);
      ok++;
    } catch (e) {
      console.error(`[fail] ${e.message}`);
      fail++;
    }
  }

  console.error(`[done] ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(`[error] ${e.message}`);
  process.exit(1);
});
