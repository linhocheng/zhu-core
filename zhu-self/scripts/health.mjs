#!/usr/bin/env node
// health.mjs
// Health daemon — 巡查城裡的水電網。
// task #14
//
// 巡查項目（v0.1 雛形）：
//   1. zhu-bridge VM 活著嗎？（curl bridge.soul-polaroid.work）
//   2. Max OAuth 還活著嗎？（看 bridge token 是否有效）
//   3. zhu-self 各 daemon 的 enabled / state 狀況
//   4. molowe-platform 的 5 條 cron 最近是否跑（Vercel API or 看 production endpoint）
//   5. AIR 本機磁碟空間
//
// Usage:
//   node health.mjs                     # 跑一次，輸出 state/health.json + log
//   node health.mjs --verbose
//   node health.mjs --json              # stdout 印 JSON

import { writeFileSync, existsSync, mkdirSync, readFileSync, appendFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';

const HOME = homedir();
const STATE_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/state');
const LOG_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/logs');
const HEALTH_OUT = resolve(STATE_DIR, 'health.json');
const HEALTH_LOG = resolve(LOG_DIR, 'health.log');

const VERBOSE = process.argv.includes('--verbose');
const JSON_OUT = process.argv.includes('--json');

if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

const checks = [];

function record(name, status, detail) {
  checks.push({ name, status, detail, ts: new Date().toISOString() });
  if (VERBOSE) console.error(`  [${status}] ${name} — ${detail}`);
}

// ── 1. bridge VM ──
async function checkBridge() {
  const url = process.env.ZHU_BRIDGE_URL || 'https://bridge.soul-polaroid.work';
  try {
    const t0 = Date.now();
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(5000) });
    const dt = Date.now() - t0;
    record('bridge', res.ok ? 'ok' : 'warn', `${url} ${res.status} ${dt}ms`);
  } catch (e) {
    record('bridge', 'fail', `${url} unreachable: ${e.message}`);
  }
}

// ── 2. daemon state 檔 ──
function checkDaemonStates() {
  const daemons = ['reflex', 'distillation'];
  for (const d of daemons) {
    const path = resolve(STATE_DIR, `${d}.json`);
    if (!existsSync(path)) {
      record(`daemon:${d}`, 'warn', 'state file missing');
      continue;
    }
    try {
      const j = JSON.parse(readFileSync(path, 'utf8'));
      record(`daemon:${d}`, 'ok', `enabled=${j.enabled} mode=${j.mode || 'n/a'}`);
    } catch (e) {
      record(`daemon:${d}`, 'fail', `parse error: ${e.message}`);
    }
  }
}

// ── 3. boot context 新鮮度 ──
function checkBootContext() {
  const path = resolve(STATE_DIR, 'boot-context.md');
  if (!existsSync(path)) {
    record('boot_context', 'warn', 'never generated');
    return;
  }
  const ageMs = Date.now() - statSync(path).mtimeMs;
  const ageHours = ageMs / 1000 / 3600;
  if (ageHours > 24) {
    record('boot_context', 'warn', `stale: ${ageHours.toFixed(1)}h`);
  } else {
    record('boot_context', 'ok', `fresh: ${ageHours.toFixed(1)}h`);
  }
}

// ── 4. 磁碟空間 ──
function checkDisk() {
  try {
    const out = execSync('df -h /').toString();
    const lines = out.split('\n');
    const parts = lines[1].split(/\s+/);
    const usePct = parts[4];
    const pct = parseInt(usePct, 10);
    record('disk_root', pct > 90 ? 'warn' : 'ok', `${usePct} used`);
  } catch (e) {
    record('disk_root', 'fail', e.message);
  }
}

// ── 5. zhu-core git 狀態 ──
function checkGit() {
  try {
    const cwd = resolve(HOME, '.ailive/zhu-core');
    const status = execSync('git status --short', { cwd, encoding: 'utf8' }).trim();
    const ahead = execSync('git status -sb', { cwd, encoding: 'utf8' }).trim();
    const dirty = status ? `${status.split('\n').length} files dirty` : 'clean';
    record('zhu_core_git', 'ok', `${dirty} | ${ahead.split('\n')[0]}`);
  } catch (e) {
    record('zhu_core_git', 'warn', e.message);
  }
}

// ── 主 ──
async function main() {
  await checkBridge();
  checkDaemonStates();
  checkBootContext();
  checkDisk();
  checkGit();

  const summary = {
    ts: new Date().toISOString(),
    checks,
    overall: checks.some((c) => c.status === 'fail')
      ? 'fail'
      : checks.some((c) => c.status === 'warn')
      ? 'warn'
      : 'ok',
  };

  writeFileSync(HEALTH_OUT, JSON.stringify(summary, null, 2));
  appendFileSync(HEALTH_LOG, JSON.stringify(summary) + '\n');

  if (JSON_OUT) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.error(`[health] overall=${summary.overall} (${checks.length} checks)`);
    if (summary.overall !== 'ok') {
      for (const c of checks.filter((x) => x.status !== 'ok')) {
        console.error(`  ${c.status.toUpperCase()}: ${c.name} — ${c.detail}`);
      }
    }
  }

  process.exit(summary.overall === 'fail' ? 1 : 0);
}

main().catch((e) => {
  console.error(`[error] ${e.message}`);
  process.exit(2);
});
