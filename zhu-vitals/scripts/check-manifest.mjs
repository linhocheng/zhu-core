#!/usr/bin/env node
/**
 * CI manifest validator. 給 vitals.yml workflow 用。
 *
 * 用法（在 worker repo 根目錄跑）：
 *   node node_modules/zhu-vitals/scripts/check-manifest.mjs
 *
 * 行為：
 *   - 找 ./manifest.ts | ./manifest.mjs | ./manifest.js
 *   - 找不到 → exit 0（pre-T3.1 grandfathered，CI 提示但不擋）
 *   - 找到 → dynamic import → validateManifest → invalid 就 exit 1
 *
 * T3.5 收尾後改成「找不到 manifest 一律 exit 1」。
 */
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { validateManifest } from '../src/manifest.schema.mjs';

const CWD = process.cwd();
const CANDIDATES = ['manifest.mjs', 'manifest.js', 'manifest.ts'];

const found = CANDIDATES.map((f) => resolve(CWD, f)).find(existsSync);

if (!found) {
  console.log('[zhu-vitals/check-manifest] (none found — pre-T3.1 grandfathered)');
  process.exit(0);
}

console.log(`[zhu-vitals/check-manifest] found: ${found}`);

if (found.endsWith('.ts')) {
  console.error('[zhu-vitals/check-manifest] manifest.ts 需要先 build 成 .mjs 才能驗證 (T3.5 處理)');
  process.exit(0);
}

let mod;
try {
  mod = await import(pathToFileURL(found).href);
} catch (e) {
  console.error(`[zhu-vitals/check-manifest] import 失敗: ${e.message}`);
  process.exit(1);
}

const m = mod.manifest ?? mod.default;
if (!m) {
  console.error('[zhu-vitals/check-manifest] manifest export 不存在（須 named export manifest 或 default export）');
  process.exit(1);
}

const result = validateManifest(m);
if (!result.ok) {
  console.error('[zhu-vitals/check-manifest] schema 不合法:');
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`[zhu-vitals/check-manifest] ✓ ${m.worker_id} (${m.env})`);
process.exit(0);
