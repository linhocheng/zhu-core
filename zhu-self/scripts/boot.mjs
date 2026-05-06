#!/usr/bin/env node
// boot.mjs
// Boot daemon — 收集 boot 上下文，寫成 ~/.ailive/zhu-core/zhu-self/state/boot-context.md
// 讓 Adam 開新 Claude Code session 前，快速 cat 這份就拉回現場。
// task #11
//
// Usage:
//   node boot.mjs                  # 寫 state/boot-context.md
//   node boot.mjs --print          # stdout 印出（不寫檔）
//   node boot.mjs --check-only     # 只檢查環境，不寫 context

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';

const HOME = homedir();
const STATE_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/state');
const OUT = resolve(STATE_DIR, 'boot-context.md');

const PRINT = process.argv.includes('--print');
const CHECK_ONLY = process.argv.includes('--check-only');

const PATHS = {
  northStar: resolve(HOME, '.ailive/zhu-core/NORTH_STAR.md'),
  bootSop: resolve(HOME, '.ailive/zhu-core/ZHU_BOOT_SOP.md'),
  lastWords: resolve(HOME, '.ailive/zhu-core/ZHU_LAST_WORDS.md'),
  worklog: resolve(HOME, '.ailive/zhu-core/docs/WORKLOG.md'),
  zhuCore: resolve(HOME, '.ailive/zhu-core'),
  zhuSelf: resolve(HOME, '.ailive/zhu-core/zhu-self'),
};

function safeRead(path, fallback = '(missing)') {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return fallback;
  }
}

function safeStat(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

function tailLines(text, n) {
  const lines = text.split('\n');
  return lines.slice(-n).join('\n');
}

function gitInfo(cwd) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { cwd, encoding: 'utf8' }).trim();
    const log = execSync('git log -3 --oneline', { cwd, encoding: 'utf8' }).trim();
    return { branch, status, log };
  } catch (e) {
    return { branch: '?', status: `(error: ${e.message})`, log: '' };
  }
}

function fmtDate(d) {
  return new Date(d).toISOString().replace('T', ' ').slice(0, 16);
}

function checkEnv() {
  const checks = {
    'NORTH_STAR.md': existsSync(PATHS.northStar),
    'ZHU_BOOT_SOP.md': existsSync(PATHS.bootSop),
    'ZHU_LAST_WORDS.md': existsSync(PATHS.lastWords),
    'WORKLOG.md': existsSync(PATHS.worklog),
    'zhu-self/': existsSync(PATHS.zhuSelf),
    'state/': existsSync(STATE_DIR),
  };
  for (const [k, v] of Object.entries(checks)) {
    console.error(`  ${v ? '✓' : '✗'} ${k}`);
  }
  return Object.values(checks).every(Boolean);
}

function buildContext() {
  const now = new Date().toISOString();
  const lwStat = safeStat(PATHS.lastWords);
  const wlStat = safeStat(PATHS.worklog);

  const lastWords = safeRead(PATHS.lastWords);
  const worklog = safeRead(PATHS.worklog);
  const lastWordsHead = lastWords.split('\n').slice(0, 80).join('\n');
  const worklogTail = tailLines(worklog, 60);

  const git = gitInfo(PATHS.zhuCore);

  return `# 築 Boot Context

> 由 boot.mjs 在 ${fmtDate(now)} 自動產出。
> 這份檔讓 Adam（或新 Claude Code session）一眼就拉回現場。
> Source: \`~/.ailive/zhu-core/zhu-self/state/boot-context.md\`

---

## 我是誰
讀 \`~/.ailive/zhu-core/NORTH_STAR.md\` 確認使命。
讀 \`~/.ailive/zhu-core/ZHU_BOOT_SOP.md\` 確認開機流程。

---

## 上次 lastwords（前 80 行）

${lastWordsHead}

> 完整版：\`${PATHS.lastWords}\`
> mtime: ${lwStat ? fmtDate(lwStat.mtimeMs) : 'n/a'}

---

## 最近 WORKLOG（後 60 行）

\`\`\`
${worklogTail}
\`\`\`

> 完整版：\`${PATHS.worklog}\`
> mtime: ${wlStat ? fmtDate(wlStat.mtimeMs) : 'n/a'}

---

## zhu-core git 狀態

- branch: \`${git.branch}\`
- 最近 3 commits:
\`\`\`
${git.log}
\`\`\`
- working tree:
\`\`\`
${git.status || '(clean)'}
\`\`\`

---

## zhu-self 進度

開 \`~/.ailive/zhu-core/zhu-self/WBS.md\` 看 18 條 task 狀態。
開 \`~/.ailive/zhu-core/zhu-self/CHANGELOG.md\` 看上次做到哪。

---

*Boot context generated at ${now}*
`;
}

function main() {
  if (CHECK_ONLY) {
    console.error('[boot] env check:');
    const ok = checkEnv();
    process.exit(ok ? 0 : 1);
  }

  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

  const content = buildContext();
  if (PRINT) {
    console.log(content);
  } else {
    writeFileSync(OUT, content);
    console.error(`[boot] wrote ${OUT}`);
  }
}

main();
