#!/usr/bin/env node
/**
 * CI manifest + vendor validator. 給 vitals.yml workflow 用。
 *
 * 用法（在 worker repo 根目錄跑）：
 *   node node_modules/zhu-vitals/scripts/check-manifest.mjs
 *   # 或 vendored: node src/zhu-vitals-scripts/check-manifest.mjs
 *
 * 行為（T3.5 strict mode · 2026-05-12）：
 *   1) 找所有 manifest：./manifest.{mjs,js} | **\/manifests/*.mjs
 *      - 0 個 → exit 1（pre-T3.1 grandfathered 規矩已結束）
 *      - 每個 dynamic import → validateManifest → 任何一個 invalid 就 exit 1
 *   2) 找所有 vendored zhu-vitals 目錄（含 index.mjs + manifest.schema.mjs）
 *      - 每個目錄必須有 VENDOR.md（sha256 lock + source commit）→ 缺則 exit 1
 *
 * 排除：node_modules / .next / .git / dist / build
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve, join, basename, dirname } from 'node:path';
import { validateManifest } from '../src/manifest.schema.mjs';

const CWD = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.vercel']);

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

// ── 1. Manifest 搜尋 + 驗證 ──
const manifestRoot = resolve(CWD, 'manifest.mjs');
const manifestRootJs = resolve(CWD, 'manifest.js');
const manifestFiles = walk(CWD, (p) => {
  const dir = basename(dirname(p));
  return dir === 'manifests' && p.endsWith('.mjs');
});
if (existsSync(manifestRoot)) manifestFiles.push(manifestRoot);
if (existsSync(manifestRootJs)) manifestFiles.push(manifestRootJs);

if (manifestFiles.length === 0) {
  console.error('[check-manifest] FAIL: 沒找到任何 manifest（manifest.mjs / manifest.js / **/manifests/*.mjs）');
  console.error('  BUILDING_PROTOCOL v0.2 機制 A 強制：每個 worker 必須有 manifest 聲明');
  process.exit(1);
}

let manifestErrors = 0;
for (const f of manifestFiles) {
  const rel = f.replace(CWD + '/', '');
  let mod;
  try {
    mod = await import(pathToFileURL(f).href);
  } catch (e) {
    console.error(`[check-manifest] FAIL ${rel}: import 失敗 — ${e.message}`);
    manifestErrors++;
    continue;
  }
  const m = mod.manifest ?? mod.default;
  if (!m) {
    console.error(`[check-manifest] FAIL ${rel}: export manifest 不存在`);
    manifestErrors++;
    continue;
  }
  const result = validateManifest(m);
  if (!result.ok) {
    console.error(`[check-manifest] FAIL ${rel}: schema 不合法`);
    for (const e of result.errors) console.error(`    - ${e}`);
    manifestErrors++;
    continue;
  }
  console.log(`[check-manifest] ✓ ${m.worker_id} (${m.env}) — ${rel}`);
}

// ── 2. Vendor lock 檢查 ──
const vendorDirs = new Set(
  walk(CWD, (p) => basename(p) === 'index.mjs' && basename(dirname(p)) === 'zhu-vitals').map(dirname),
);
let vendorErrors = 0;
for (const dir of vendorDirs) {
  const rel = dir.replace(CWD + '/', '');
  if (!existsSync(join(dir, 'VENDOR.md'))) {
    console.error(`[check-manifest] FAIL ${rel}/: 缺 VENDOR.md（vendored zhu-vitals 必須記 source commit + sha256 lock）`);
    vendorErrors++;
  } else {
    console.log(`[check-manifest] ✓ vendor ${rel}/ (VENDOR.md present)`);
  }
}

const total = manifestErrors + vendorErrors;
if (total > 0) {
  console.error(`[check-manifest] ${total} 個錯誤`);
  process.exit(1);
}
console.log(`[check-manifest] OK — ${manifestFiles.length} manifest(s), ${vendorDirs.size} vendor dir(s)`);
process.exit(0);
