#!/usr/bin/env node
/**
 * zhu debt — 技術債監測 Agent v0.1
 *
 * 用法：
 *   zhu debt scan          # 掃 lastwords + WORKLOG，upsert ledger，生報告，回寫 marker
 *   zhu debt scan --dry    # dry-run，只印不寫
 *   zhu debt scan --no-writeback  # 寫 ledger + 報告但不動 lastwords
 *   zhu debt list          # 印 ledger 全表
 *   zhu debt rebuild       # 清空 ledger 重掃（first_seen 重設為今天）
 *
 * 設計：
 *   - 來源：~/.ailive/zhu-core/ZHU_LAST_WORDS.md 的「卡住/未解」段
 *           ~/.ailive/zhu-core/docs/WORKLOG.md 的「尚未解決 / 待執行」段
 *   - ledger：~/.ailive/zhu-core/zhu-self/state/debt_ledger.jsonl（append-only，衍生品砍了可重建）
 *   - 報告：~/.ailive/zhu-core/reports/debt_YYYYMMDD.md
 *   - 回寫：ZHU_LAST_WORDS.md 內 <!-- DEBT_AGENT_BEGIN/END --> marker 內，不動 Adam 寫的條目
 *
 * v0.1 deterministic：regex + date diff，零 LLM call。
 */
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';

const ROOT = join(homedir(), '.ailive/zhu-core');
const LASTWORDS = join(ROOT, 'ZHU_LAST_WORDS.md');
const WORKLOG = join(ROOT, 'docs/WORKLOG.md');
const LEDGER = join(ROOT, 'zhu-self/state/debt_ledger.jsonl');
const REPORTS_DIR = join(ROOT, 'reports');

const STALE_DAYS = 14;
const DROP_DAYS = 30;

const cmd = process.argv[2] || 'scan';
const dry = process.argv.includes('--dry');
const noWriteback = process.argv.includes('--no-writeback');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(aISO, bISO) {
  const a = new Date(aISO + 'T00:00:00Z').getTime();
  const b = new Date(bISO + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}
function sha1(s) {
  return createHash('sha1').update(s).digest('hex').slice(0, 12);
}

/**
 * 從 markdown 抓 debt section 下的 list items。
 * 條件：section 標題含「卡住」/「未解」/「尚未解決」/「待執行」
 * 條件：標題下 list item 直到下一個同階或更高階 heading 為止
 * @param {string} text
 * @param {string} sourceName
 */
function extractItems(text, sourceName) {
  const lines = text.split('\n');
  const items = [];
  let curSection = null;
  let curHeaderLevel = 0;
  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.*?)\s*$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2];
      if (/卡住|未解|尚未解決|待執行/.test(title)) {
        curSection = title;
        curHeaderLevel = level;
      } else if (curSection && level <= curHeaderLevel) {
        curSection = null;
        curHeaderLevel = 0;
      }
      continue;
    }
    if (!curSection) continue;
    const liMatch = line.match(/^[\s]*[-*]\s+\[?[ x]?\]?\s*(.*\S)\s*$/);
    if (liMatch) {
      const content = liMatch[1].trim();
      if (content && !content.startsWith('<!--')) {
        items.push({
          id: sha1(content),
          source: sourceName,
          section: curSection,
          content,
        });
      }
    }
  }
  return items;
}

function loadLedger() {
  if (!existsSync(LEDGER)) return new Map();
  const out = new Map();
  const text = readFileSync(LEDGER, 'utf8');
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      out.set(obj.id, obj);
    } catch {}
  }
  return out;
}

function saveLedger(ledger) {
  mkdirSync(dirname(LEDGER), { recursive: true });
  const out = [...ledger.values()].map((x) => JSON.stringify(x)).join('\n') + '\n';
  writeFileSync(LEDGER, out);
}

function scan() {
  const today = todayISO();
  const ledger = loadLedger();
  const sources = [
    { name: 'lastwords', path: LASTWORDS },
    { name: 'worklog', path: WORKLOG },
  ];
  const seenToday = new Set();
  for (const s of sources) {
    if (!existsSync(s.path)) {
      console.warn(`[debt scan] 略過 ${s.name}: 檔案不存在 ${s.path}`);
      continue;
    }
    const text = readFileSync(s.path, 'utf8');
    const items = extractItems(text, s.name);
    for (const it of items) {
      seenToday.add(it.id);
      const existing = ledger.get(it.id);
      if (existing) {
        existing.last_seen = today;
        existing.section = it.section;
        existing.source = it.source;
        existing.age_days = daysBetween(existing.first_seen, today);
      } else {
        ledger.set(it.id, {
          ...it,
          first_seen: today,
          last_seen: today,
          age_days: 0,
          pinned: false,
        });
      }
    }
  }
  for (const [id, item] of ledger) {
    const silent = daysBetween(item.last_seen, today);
    if (silent > DROP_DAYS && !item.pinned) {
      ledger.delete(id);
      continue;
    }
    if (!seenToday.has(id)) {
      item.silent_days = silent;
    } else {
      delete item.silent_days;
    }
  }
  if (!dry) saveLedger(ledger);
  return { ledger, today, seenToday };
}

function buildReport(ledger, today) {
  const all = [...ledger.values()];
  const stale = all.filter((x) => x.age_days >= STALE_DAYS && !x.silent_days);
  const silent = all.filter((x) => x.silent_days && x.silent_days >= 7);
  const fresh = all.filter((x) => x.age_days < STALE_DAYS && !x.silent_days);
  stale.sort((a, b) => b.age_days - a.age_days);
  silent.sort((a, b) => b.silent_days - a.silent_days);

  const lines = [];
  lines.push(`# 技術債健康表 ${today}`);
  lines.push('');
  lines.push(`scan source: lastwords + WORKLOG`);
  lines.push(`規則：age >= ${STALE_DAYS}d = 🔴 stale；source 消失 >= 7d = 🟡 silent；>= ${DROP_DAYS}d 自動 drop`);
  lines.push('');
  lines.push(`- 總在 ledger：${all.length}`);
  lines.push(`- 🔴 stale (age >= ${STALE_DAYS}d)：${stale.length}`);
  lines.push(`- 🟡 silent (source 消失 >= 7d)：${silent.length}`);
  lines.push(`- ✓ fresh：${fresh.length}`);
  lines.push('');
  if (stale.length > 0) {
    lines.push(`## 🔴 Stale (age >= ${STALE_DAYS} days)`);
    lines.push('');
    for (const x of stale) {
      lines.push(`- **${x.age_days}d** [${x.source}/${x.section}] ${x.content}`);
    }
    lines.push('');
  }
  if (silent.length > 0) {
    lines.push(`## 🟡 Silent (last_seen ${'>='} 7d ago — source 消失但未到 drop)`);
    lines.push('');
    for (const x of silent) {
      lines.push(`- **silent ${x.silent_days}d, age ${x.age_days}d** [${x.source}/${x.section}] ${x.content}`);
    }
    lines.push('');
  }
  if (stale.length === 0 && silent.length === 0) {
    lines.push(`✓ 全綠 — 沒老化、沒沉默條目。`);
  }
  return lines.join('\n');
}

function writeReport(report, today) {
  if (dry) return null;
  mkdirSync(REPORTS_DIR, { recursive: true });
  const reportPath = join(REPORTS_DIR, `debt_${today.replace(/-/g, '')}.md`);
  writeFileSync(reportPath, report);
  return reportPath;
}

function writeBackLastwords(ledger, today) {
  if (dry || noWriteback) return false;
  if (!existsSync(LASTWORDS)) return false;
  const stale = [...ledger.values()]
    .filter((x) => x.age_days >= STALE_DAYS && !x.silent_days)
    .sort((a, b) => b.age_days - a.age_days);
  const silent = [...ledger.values()]
    .filter((x) => x.silent_days && x.silent_days >= 7)
    .sort((a, b) => b.silent_days - a.silent_days);

  const BEGIN = '<!-- DEBT_AGENT_BEGIN -->';
  const END = '<!-- DEBT_AGENT_END -->';
  const inner = [
    BEGIN,
    `🤖 技術債健康表（${today}，zhu debt scan 自動生成，age >= ${STALE_DAYS}d / silent >= 7d）`,
    '',
  ];
  if (stale.length === 0 && silent.length === 0) {
    inner.push('✓ 全綠 — 沒老化、沒沉默條目。');
  } else {
    if (stale.length > 0) {
      inner.push(`🔴 Stale (${stale.length})：`);
      for (const x of stale.slice(0, 10)) {
        inner.push(`  - **${x.age_days}d** [${x.source}] ${x.content.slice(0, 80)}`);
      }
      inner.push('');
    }
    if (silent.length > 0) {
      inner.push(`🟡 Silent (${silent.length})：`);
      for (const x of silent.slice(0, 10)) {
        inner.push(`  - **silent ${x.silent_days}d** [${x.source}] ${x.content.slice(0, 80)}`);
      }
      inner.push('');
    }
    inner.push(`完整報告：~/.ailive/zhu-core/reports/debt_${today.replace(/-/g, '')}.md`);
  }
  inner.push(END);
  const block = inner.join('\n');

  let text = readFileSync(LASTWORDS, 'utf8');
  const beginIdx = text.indexOf(BEGIN);
  const endIdx = text.indexOf(END);
  if (beginIdx >= 0 && endIdx > beginIdx) {
    const before = text.slice(0, beginIdx);
    const after = text.slice(endIdx + END.length);
    text = before + block + after;
  } else {
    text = text.trimEnd() + '\n\n---\n\n## 🤖 技術債監測 (zhu debt agent v0.1)\n\n' + block + '\n';
  }
  writeFileSync(LASTWORDS, text);
  return true;
}

function cmdScan() {
  const { ledger, today } = scan();
  const report = buildReport(ledger, today);
  const reportPath = writeReport(report, today);
  const wroteBack = writeBackLastwords(ledger, today);
  console.log(report);
  console.log('');
  if (dry) {
    console.log(`[dry] ledger ${ledger.size} items（未寫入）`);
  } else {
    console.log(`ledger: ${LEDGER} (${ledger.size} items)`);
    if (reportPath) console.log(`report: ${reportPath}`);
    if (wroteBack) console.log(`lastwords: 已更新 marker block`);
    else if (noWriteback) console.log(`lastwords: --no-writeback，未動`);
  }
}

function cmdList() {
  const ledger = loadLedger();
  if (ledger.size === 0) {
    console.log('(ledger 空 — 先跑 zhu debt scan)');
    return;
  }
  const rows = [...ledger.values()].sort((a, b) => b.age_days - a.age_days);
  console.log(`zhu debt ledger (${rows.length} items)\n`);
  for (const x of rows) {
    const silent = x.silent_days ? ` 🟡silent ${x.silent_days}d` : '';
    const pinned = x.pinned ? ' 📌' : '';
    console.log(`  [${String(x.age_days).padStart(3)}d]${silent}${pinned} ${x.id} [${x.source}/${x.section}]`);
    console.log(`         ${x.content.slice(0, 100)}`);
  }
}

function cmdRebuild() {
  if (existsSync(LEDGER) && !dry) {
    const bak = LEDGER + '.bak.' + Date.now();
    writeFileSync(bak, readFileSync(LEDGER));
    console.log(`backup: ${bak}`);
    writeFileSync(LEDGER, '');
  }
  cmdScan();
}

if (cmd === 'scan') cmdScan();
else if (cmd === 'list') cmdList();
else if (cmd === 'rebuild') cmdRebuild();
else {
  console.error('usage: zhu debt <scan|list|rebuild> [--dry] [--no-writeback]');
  process.exit(2);
}
