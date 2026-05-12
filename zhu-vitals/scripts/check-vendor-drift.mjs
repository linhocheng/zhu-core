#!/usr/bin/env node
/**
 * CI vendor sha256 drift check. 給每個 worker repo build / pre-deploy 用。
 *
 * 用法（在 worker repo 根目錄跑）：
 *   node node_modules/zhu-vitals/scripts/check-vendor-drift.mjs
 *   # 或 vendored: node src/zhu-vitals/scripts/check-vendor-drift.mjs
 *
 * 跟 check-manifest 不同：那個只驗 VENDOR.md 存在；這個重算 sha256 對賬。
 *
 * 行為：
 *   1) 找所有 vendored zhu-vitals/ 目錄（含 index.mjs + manifest.schema.mjs）
 *   2) 每個目錄：
 *      a) 讀 VENDOR.md → parse `## sha256 lock` 區塊
 *      b) 對每筆 locked file 重算 sha256
 *      c) 任一不一致 → 印出 (file, expected, actual) + exit 1
 *   3) 若有 ZHU_VITALS_SOURCE_DIR 環境變數 → 同步對 source 對賬（多一層守門）
 *
 * 為什麼：2026-05-12 molowe vendor `bridge-call.mjs` lock 寫 0.1.2 (a0e0a9ff)
 * 但實際檔案是 0.1.1 (02b69a04)，lock 跟事實分離 24h 沒人察覺。本 script 是補這個守門哨。
 *
 * 排除：node_modules / .next / .git / dist / build
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, basename, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';

const CWD = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.vercel']);
const SOURCE_DIR = process.env.ZHU_VITALS_SOURCE_DIR || null;

/**
 * @param {string} root
 * @param {(p: string) => boolean} match
 * @returns {string[]}
 */
function walk(root, match) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try { entries = readdirSync(d); } catch { continue; }
    for (const name of entries) {
      if (SKIP_DIRS.has(name)) continue;
      const full = join(d, name);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) stack.push(full);
      else if (match(full)) out.push(full);
    }
  }
  return out;
}

/** @param {string} path */
function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/**
 * 從 VENDOR.md 拆 sha256 lock 區塊。
 * @param {string} md
 * @returns {{file: string, sha: string}[]}
 */
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

const vendorDirs = new Set(
  walk(CWD, (p) => basename(p) === 'index.mjs' && basename(dirname(p)) === 'zhu-vitals').map(dirname),
);

if (vendorDirs.size === 0) {
  console.log('[check-vendor-drift] 沒找到 vendored zhu-vitals/ 目錄 — 跳過');
  process.exit(0);
}

let totalErrors = 0;
for (const dir of vendorDirs) {
  const rel = relative(CWD, dir) || dir;
  const vendorMd = join(dir, 'VENDOR.md');
  if (!existsSync(vendorMd)) {
    console.error(`[check-vendor-drift] FAIL ${rel}/: 缺 VENDOR.md`);
    totalErrors++;
    continue;
  }
  const md = readFileSync(vendorMd, 'utf8');
  const lock = parseLock(md);
  if (lock.length === 0) {
    console.error(`[check-vendor-drift] FAIL ${rel}/VENDOR.md: 沒 parse 到 sha256 lock 區塊（## sha256 lock + fenced code）`);
    totalErrors++;
    continue;
  }

  let dirErrors = 0;
  const locked = new Set();
  for (const { file, sha } of lock) {
    const full = join(dir, file);
    locked.add(file);
    if (!existsSync(full)) {
      console.error(`[check-vendor-drift] FAIL ${rel}/${file}: lock 有但檔案不存在`);
      dirErrors++;
      continue;
    }
    const actual = sha256(full);
    if (actual !== sha) {
      console.error(`[check-vendor-drift] FAIL ${rel}/${file}: sha256 drift`);
      console.error(`    expected (lock): ${sha}`);
      console.error(`    actual   (file): ${actual}`);
      dirErrors++;
      continue;
    }
    if (SOURCE_DIR) {
      const srcPath = join(SOURCE_DIR, file);
      if (existsSync(srcPath)) {
        const srcSha = sha256(srcPath);
        if (srcSha !== actual) {
          console.error(`[check-vendor-drift] FAIL ${rel}/${file}: source drift`);
          console.error(`    vendor:  ${actual}`);
          console.error(`    source:  ${srcSha} (${srcPath})`);
          dirErrors++;
        }
      }
    }
  }

  const dirFiles = readdirSync(dir).filter(
    (n) => (n.endsWith('.mjs') || n.endsWith('.d.ts')) && !locked.has(n),
  );
  for (const orphan of dirFiles) {
    console.error(`[check-vendor-drift] FAIL ${rel}/${orphan}: 檔案存在但 VENDOR.md lock 沒登錄（unlocked drift）`);
    dirErrors++;
  }

  if (dirErrors === 0) {
    const srcNote = SOURCE_DIR ? ' (+ source 對賬)' : '';
    console.log(`[check-vendor-drift] ✓ ${rel}/ (${lock.length} files locked${srcNote})`);
  }
  totalErrors += dirErrors;
}

if (totalErrors > 0) {
  console.error(`[check-vendor-drift] ${totalErrors} 個 drift 錯誤`);
  process.exit(1);
}
console.log(`[check-vendor-drift] OK — ${vendorDirs.size} vendor dir(s) 全對賬`);
process.exit(0);
