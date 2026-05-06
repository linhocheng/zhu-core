#!/usr/bin/env node
// kill.mjs
// Kill switch — 一鍵停某 daemon。
// task #17。R1/R2 緩解：每個 daemon 必須能立刻停。
//
// Usage:
//   node kill.mjs <daemon>           # 停（enabled=false）
//   node kill.mjs <daemon> --start   # 開（enabled=true）
//   node kill.mjs --all              # 停全部
//   node kill.mjs --status           # 看每個 daemon 的 enabled 狀態

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

const HOME = homedir();
const STATE_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/state');
const KNOWN = ['reflex', 'distillation', 'learning'];

function statePath(name) {
  return resolve(STATE_DIR, `${name}.json`);
}

function setEnabled(name, enabled) {
  const path = statePath(name);
  if (!existsSync(path)) {
    console.error(`[skip] ${name}: state file missing (${path})`);
    return false;
  }
  const j = JSON.parse(readFileSync(path, 'utf8'));
  j.enabled = enabled;
  j.updated_at = new Date().toISOString();
  writeFileSync(path, JSON.stringify(j, null, 2));
  console.error(`[${enabled ? 'start' : 'kill'}] ${name}`);
  return true;
}

function status() {
  for (const name of KNOWN) {
    const path = statePath(name);
    if (!existsSync(path)) {
      console.log(`  ${name.padEnd(15)} (no state)`);
      continue;
    }
    const j = JSON.parse(readFileSync(path, 'utf8'));
    console.log(`  ${name.padEnd(15)} enabled=${j.enabled} mode=${j.mode || 'n/a'}`);
  }
}

const args = process.argv.slice(2);
if (args.includes('--status')) {
  status();
} else if (args.includes('--all')) {
  for (const n of KNOWN) setEnabled(n, false);
} else {
  const name = args[0];
  if (!name || name.startsWith('--')) {
    console.error('usage: node kill.mjs <daemon> [--start] | --all | --status');
    process.exit(2);
  }
  if (!KNOWN.includes(name)) {
    console.error(`unknown daemon: ${name}. Known: ${KNOWN.join(', ')}`);
    process.exit(2);
  }
  const start = args.includes('--start');
  setEnabled(name, start);
}
