#!/usr/bin/env node
/**
 * Bridge VM vendor drift check.
 *
 * Bridge VM 沒 CI（systemd service，手動 scp 部署），所以 drift 守門哨用「本機 ssh 過去算 sha256
 * 加 cat VENDOR.md，本機 parse」的方式。
 *
 * 用法：
 *   node ~/.ailive/zhu-core/zhu-vitals/scripts/check-bridge-vm-drift.mjs
 *   # 任一不一致 → exit 1
 *
 * 設計：
 *   1) gcloud ssh zhu-dev — cat ~/claude-bridge/zhu-vitals/VENDOR.md → parse sha256 lock
 *   2) gcloud ssh zhu-dev — sha256sum ~/claude-bridge/zhu-vitals/*.mjs *.d.ts
 *   3) 本機讀 ~/.ailive/zhu-core/zhu-vitals/src/ 對賬 source（多一層）
 *   4) 三方對賬：lock = file = source
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';

const VM = 'zhu-dev';
const ZONE = 'asia-east1-b';
const PROJECT = 'zhu-cloud-2026';
const REMOTE_DIR = '~/claude-bridge/zhu-vitals';
const SOURCE_DIR = join(homedir(), '.ailive/zhu-core/zhu-vitals/src');

function ssh(cmd) {
  const wrapped = `gcloud compute ssh ${VM} --zone=${ZONE} --project=${PROJECT} --command=${JSON.stringify(cmd)}`;
  return execSync(wrapped, { encoding: 'utf8' });
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** @param {string} md */
function parseLock(md) {
  const out = [];
  const lines = md.split('\n');
  let inLock = false;
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith('## ') && line.toLowerCase().includes('sha256 lock')) { inLock = true; continue; }
    if (inLock && line.startsWith('## ')) { inLock = false; continue; }
    if (!inLock) continue;
    if (line.startsWith('```')) { inFence = !inFence; continue; }
    if (!inFence) continue;
    const m = line.trim().match(/^([0-9a-f]{64})\s+(.+)$/i);
    if (m) out.push({ sha: m[1].toLowerCase(), file: m[2].trim() });
  }
  return out;
}

console.log(`[check-bridge-vm-drift] ssh ${VM} cat VENDOR.md ...`);
const vendorMd = ssh(`cat ${REMOTE_DIR}/VENDOR.md`);
const lock = parseLock(vendorMd);
if (lock.length === 0) {
  console.error('[check-bridge-vm-drift] FAIL: 沒 parse 到 sha256 lock 區塊');
  process.exit(1);
}

console.log(`[check-bridge-vm-drift] ssh ${VM} sha256sum 全檔 ...`);
const shaOutput = ssh(`cd ${REMOTE_DIR} && sha256sum *.mjs *.d.ts 2>/dev/null`);
const actualMap = new Map();
for (const line of shaOutput.split('\n')) {
  const m = line.trim().match(/^([0-9a-f]{64})\s+(.+)$/i);
  if (m) actualMap.set(m[2].trim(), m[1].toLowerCase());
}

let errors = 0;
const locked = new Set();
for (const { file, sha } of lock) {
  locked.add(file);
  const actual = actualMap.get(file);
  if (!actual) {
    console.error(`[check-bridge-vm-drift] FAIL ${file}: lock 有但 VM 上不存在`);
    errors++;
    continue;
  }
  if (actual !== sha) {
    console.error(`[check-bridge-vm-drift] FAIL ${file}: VM sha256 ≠ lock`);
    console.error(`    lock:    ${sha}`);
    console.error(`    VM file: ${actual}`);
    errors++;
    continue;
  }
  const srcPath = join(SOURCE_DIR, file);
  if (existsSync(srcPath)) {
    const srcSha = sha256(srcPath);
    if (srcSha !== actual) {
      console.error(`[check-bridge-vm-drift] FAIL ${file}: VM ≠ source`);
      console.error(`    VM:     ${actual}`);
      console.error(`    source: ${srcSha}`);
      errors++;
    }
  }
}

for (const [file] of actualMap) {
  if (!locked.has(file)) {
    console.error(`[check-bridge-vm-drift] FAIL ${file}: VM 上存在但 VENDOR.md lock 沒登錄`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`[check-bridge-vm-drift] ${errors} 個 drift`);
  process.exit(1);
}
console.log(`[check-bridge-vm-drift] OK — ${lock.length} files 三方對賬全綠（VENDOR.md = VM file = source）`);
process.exit(0);
