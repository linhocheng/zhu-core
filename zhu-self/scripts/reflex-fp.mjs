#!/usr/bin/env node
// reflex-fp.mjs — false positive 救命稻草
//
// usage:
//   zhu fp <rule_name>           # 下一次該規則命中時放行（once，消費後清掉）
//   zhu fp <rule_name> --always  # 永久放行（標記到刪除為止）
//   zhu fp --list                # 列出當前 fp 標記
//   zhu fp --clear               # 清空所有 fp 標記
//
// 設計：active 規則誤觸時 Adam 喊一聲，下次跳過。
// hook 讀 state/false_positives.json，命中時看 rule_name 是否在 once/always 列表。

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { RULES } from './reflex/rules.mjs';

const FP_FILE = resolve(homedir(), '.ailive/zhu-core/zhu-self/state/false_positives.json');

function load() {
  if (!existsSync(FP_FILE)) return { once: [], always: [] };
  try { return JSON.parse(readFileSync(FP_FILE, 'utf8')); }
  catch { return { once: [], always: [] }; }
}

function save(s) {
  writeFileSync(FP_FILE, JSON.stringify(s, null, 2) + '\n');
}

const args = process.argv.slice(2);

if (args[0] === '--list' || args.length === 0) {
  const s = load();
  console.log(`once   : ${s.once.length ? s.once.join(', ') : '(none)'}`);
  console.log(`always : ${s.always.length ? s.always.join(', ') : '(none)'}`);
  process.exit(0);
}

if (args[0] === '--clear') {
  save({ once: [], always: [] });
  console.log('cleared all fp marks');
  process.exit(0);
}

const ruleName = args[0];
const isAlways = args.includes('--always');

const validRules = RULES.map(r => r.rule_name);
if (!validRules.includes(ruleName)) {
  console.error(`unknown rule: ${ruleName}`);
  console.error(`valid rules: ${validRules.join(', ')}`);
  process.exit(2);
}

const s = load();
const bucket = isAlways ? 'always' : 'once';
if (!s[bucket].includes(ruleName)) s[bucket].push(ruleName);
save(s);
console.log(`fp marked: ${ruleName} (${bucket})`);
process.exit(0);
