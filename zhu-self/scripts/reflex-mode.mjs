#!/usr/bin/env node
// reflex-mode.mjs — 全域 mode 切換 (kill switch)
//
// usage:
//   zhu reflex active     # 全域開啟 active mode（active 規則會擋）
//   zhu reflex log-only   # 全域降級成 log-only（緊急 kill switch）
//   zhu reflex status     # 印當前 mode + active 規則清單
//
// 全域 mode = log-only 時，所有 rule.state='active' 都被降級成 log，hook 不擋。
// 個別 rule.state 由 rules.mjs 控制（要動規則粒度去那邊改）。

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { RULES } from './reflex/rules.mjs';

const STATE = resolve(homedir(), '.ailive/zhu-core/zhu-self/state/reflex.json');

const sub = process.argv[2] || 'status';

if (sub === 'status') {
  const s = JSON.parse(readFileSync(STATE, 'utf8'));
  const activeRules = RULES.filter(r => r.state === 'active').map(r => r.rule_name);
  console.log(`reflex.enabled = ${s.enabled}`);
  console.log(`reflex.mode    = ${s.mode}`);
  console.log(`active rules   = ${activeRules.length ? activeRules.join(', ') : '(none)'}`);
  if (s.mode === 'log_only' && activeRules.length) {
    console.log(`\n⚠ 全域 mode=log_only，${activeRules.length} 條 active 規則被降級成 log。`);
    console.log(`  開啟：zhu reflex active`);
  }
  process.exit(0);
}

if (sub === 'active' || sub === 'log-only' || sub === 'log_only') {
  const next = sub === 'active' ? 'active' : 'log_only';
  const s = JSON.parse(readFileSync(STATE, 'utf8'));
  const prev = s.mode;
  s.mode = next;
  s.updated_at = new Date().toISOString();
  writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');
  console.log(`reflex.mode: ${prev} → ${next}`);
  if (next === 'active') {
    const activeRules = RULES.filter(r => r.state === 'active').map(r => r.rule_name);
    console.log(`active 規則：${activeRules.join(', ') || '(none)'}`);
  } else {
    console.log(`所有 active 規則暫時降級成 log（緊急 kill switch）`);
  }
  process.exit(0);
}

console.error(`unknown subcommand: ${sub}`);
console.error(`usage: zhu reflex <active|log-only|status>`);
process.exit(2);
