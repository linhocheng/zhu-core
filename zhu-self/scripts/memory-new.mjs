#!/usr/bin/env node
// memory-new.mjs
// 強制問完 v2 六欄才寫 memory 檔。
//
// Usage:
//   zhu memory new --type feedback
//   zhu memory new --type skill
//   zhu memory new --type project
//   zhu memory new --type reference
//   zhu memory new --type user
//
// 對 feedback / skill：6 欄全問（規則 / 觸發信號 / Why / 心態 / How / Test cases）
// 對 project：4 欄（事實 / Why / How / 何時失效）
// 對 reference / user：精簡版（名稱 / 描述 / 內容）
//
// 寫完檔自動：
//   1. 寫 ~/.claude/projects/-Users-adamlin/memory/<slug>.md
//   2. 在 MEMORY.md index 末尾插入一行 pointer

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// pipe 模式：預讀所有 stdin 行（解 readline/promises EOF 卡住 bug）
const IS_TTY = process.stdin.isTTY === true;
let pipedLines = [];
let pipedIdx = 0;
if (!IS_TTY) {
  const raw = readFileSync(0, 'utf8');
  pipedLines = raw.split('\n');
  if (pipedLines.length && pipedLines[pipedLines.length - 1] === '') pipedLines.pop();
}

function nextPipedLine() {
  if (pipedIdx >= pipedLines.length) return null;
  return pipedLines[pipedIdx++];
}

const HOME = homedir();
const MEMORY_DIR = resolve(HOME, '.claude/projects/-Users-adamlin/memory');
const MEMORY_INDEX = resolve(MEMORY_DIR, 'MEMORY.md');

function parseTypeArg(argv) {
  const eqIdx = argv.findIndex((a) => a.startsWith('--type='));
  if (eqIdx >= 0) return argv[eqIdx].slice(7);
  const spaceIdx = argv.findIndex((a) => a === '--type');
  if (spaceIdx >= 0 && spaceIdx + 1 < argv.length) return argv[spaceIdx + 1];
  return null;
}
const TYPE = parseTypeArg(process.argv);

const VALID_TYPES = ['feedback', 'skill', 'project', 'reference', 'user'];

if (!TYPE || !VALID_TYPES.includes(TYPE)) {
  console.error(`usage: zhu memory new --type <${VALID_TYPES.join('|')}>`);
  process.exit(2);
}

const rl = IS_TTY ? readline.createInterface({ input, output }) : null;

async function readLineFromUser(prompt) {
  if (IS_TTY) {
    return await rl.question(prompt);
  }
  if (prompt) process.stdout.write(prompt);
  const line = nextPipedLine();
  if (line === null) return '';
  process.stdout.write(line + '\n');
  return line;
}

async function ask(label, { required = true, multiline = false } = {}) {
  if (multiline) {
    console.log(`\n── ${label} ──`);
    console.log('（多行輸入；單獨一行輸入 . 結束。空欄直接輸入 . 跳過。）');
    let lines = [];
    while (true) {
      const line = await readLineFromUser('');
      if (line === '.') break;
      lines.push(line);
    }
    const text = lines.join('\n').trim();
    if (!text && required) {
      console.log('！這欄必填。再來一次。');
      return ask(label, { required, multiline });
    }
    return text;
  }
  const ans = (await readLineFromUser(`${label}: `)).trim();
  if (!ans && required) {
    console.log('！這欄必填。再來一次。');
    return ask(label, { required, multiline });
  }
  return ans;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]+/g, '') // 拿掉中文
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'untitled';
}

function buildFeedbackOrSkill({
  name, description, type, rule, trigger, why, mindset, how, testCases,
}) {
  return `---
name: ${name}
description: ${description}
type: ${type}
---

${rule}

**Why:** ${why}

**心態:** ${mindset}

**How to apply:**
${how}

**觸發信號：** ${trigger}

${testCases ? `**Test cases / 範例：**\n${testCases}\n` : ''}`;
}

function buildProject({ name, description, fact, why, how }) {
  return `---
name: ${name}
description: ${description}
type: project
---

${fact}

**Why:** ${why}

**How to apply:** ${how}
`;
}

function buildReference({ name, description, body }) {
  return `---
name: ${name}
description: ${description}
type: reference
---

${body}
`;
}

function buildUser({ name, description, body }) {
  return `---
name: ${name}
description: ${description}
type: user
---

${body}
`;
}

async function main() {
  console.log(`\n建新 memory · type=${TYPE}`);
  console.log('六欄全綠才出檔。任何欄漏 = 半成品 = 違反 v2 格式。\n');

  const name = await ask('1) 標題（中文短句，例如「不要為了安全多加會壞的元件」）');
  const description = await ask('2) 一行 description（MEMORY.md 會用，要具體，不超過 150 字）');
  const slugHint = await ask('3) 檔名 slug 提示（英文小寫，例如 avoid_extra_security_layers）', { required: false });
  const slug = slugify(slugHint || name);
  const fileName = `${TYPE === 'skill' ? 'skill' : TYPE}_${slug}.md`;
  const filePath = resolve(MEMORY_DIR, fileName);

  if (existsSync(filePath)) {
    console.log(`！檔案已存在：${filePath}`);
    console.log('（取消。改名或先刪舊檔再試。）');
    rl.close();
    process.exit(1);
  }

  let body = '';

  if (TYPE === 'feedback' || TYPE === 'skill') {
    const rule = await ask('4) 規則本體（一段話講清楚這條 rule，可多行）', { multiline: true });
    const trigger = await ask('5) 觸發信號（什麼情境/反射動作會喚起這條 rule？要具體可辨識）', { multiline: true });
    const why = await ask('6) Why（過去事件 / 根因）', { multiline: true });
    const mindset = await ask('7) 心態（做這件事要用什麼姿態？例：監造姿態 / 嚴謹姿態 / 反思姿態）', { multiline: true });
    const how = await ask('8) How to apply（具體步驟 / checklist）', { multiline: true });
    const testCases = await ask('9) Test cases 2-3 個（情境 → 該怎麼反應，選填）', { required: false, multiline: true });

    body = buildFeedbackOrSkill({
      name, description, type: TYPE,
      rule, trigger, why, mindset, how, testCases,
    });
  } else if (TYPE === 'project') {
    const fact = await ask('4) 事實 / 決定（這個 project memory 要記什麼狀態？）', { multiline: true });
    const why = await ask('5) Why（動機 / 限制 / deadline / 利害關係人）', { multiline: true });
    const how = await ask('6) How to apply（這條怎麼影響未來建議）', { multiline: true });
    body = buildProject({ name, description, fact, why, how });
  } else if (TYPE === 'reference') {
    const refBody = await ask('4) 內容（指向哪個外部資源？什麼時候要去看？）', { multiline: true });
    body = buildReference({ name, description, body: refBody });
  } else if (TYPE === 'user') {
    const userBody = await ask('4) 內容（user 是誰？角色 / 偏好 / 知識）', { multiline: true });
    body = buildUser({ name, description, body: userBody });
  }

  writeFileSync(filePath, body);
  console.log(`\n✓ 寫入 ${filePath}`);

  // update MEMORY.md index
  const indexLine = `- [${name}](${fileName}) — ${description}\n`;
  if (existsSync(MEMORY_INDEX)) {
    const current = readFileSync(MEMORY_INDEX, 'utf8');
    const newContent = current.endsWith('\n') ? current + indexLine : current + '\n' + indexLine;
    writeFileSync(MEMORY_INDEX, newContent);
    console.log(`✓ 更新 MEMORY.md index`);
  } else {
    writeFileSync(MEMORY_INDEX, indexLine);
    console.log(`✓ 新建 MEMORY.md index`);
  }

  if (rl) rl.close();
}

main().catch((err) => {
  console.error('錯誤：', err.message);
  if (rl) rl.close();
  process.exit(1);
});
