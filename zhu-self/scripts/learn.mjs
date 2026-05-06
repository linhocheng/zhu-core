#!/usr/bin/env node
// learn.mjs
// Learning daemon ingestion pipeline 雛形（task #15）
// Phase 4 才填內容；Phase 1 只先建管線結構：
//   訂閱源 → fetch → 寫 candidate pool（不入主記憶）→ 等 Adam / 築 review。
//
// R3 緩解：所有 ingest 必經 review 才升 L2/L3。
//
// Usage:
//   node learn.mjs --list                 # 看訂閱源
//   node learn.mjs --add <url>            # 加訂閱源
//   node learn.mjs --fetch                # 跑一輪 ingest
//   node learn.mjs --review               # 列出待 review 的候選

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID, createHash } from 'node:crypto';

const HOME = homedir();
const LEARN_DIR = resolve(HOME, '.ailive/zhu-core/zhu-self/learn');
const SOURCES_FILE = resolve(LEARN_DIR, 'sources.json');
const CANDIDATES_DIR = resolve(LEARN_DIR, 'candidates');

if (!existsSync(LEARN_DIR)) mkdirSync(LEARN_DIR, { recursive: true });
if (!existsSync(CANDIDATES_DIR)) mkdirSync(CANDIDATES_DIR, { recursive: true });

// ── 預設訂閱源（Phase 1 占位）──
const DEFAULT_SOURCES = [
  {
    id: 'openai_blog',
    type: 'rss',
    url: 'https://openai.com/blog/rss/',
    enabled: false,
    note: 'OpenAI 官方 blog（Phase 4 啟用）',
  },
  {
    id: 'anthropic_news',
    type: 'rss',
    url: 'https://www.anthropic.com/news/rss.xml',
    enabled: false,
    note: 'Anthropic news（Phase 4 啟用）',
  },
  {
    id: 'claude_code_changelog',
    type: 'web',
    url: 'https://docs.anthropic.com/en/docs/claude-code/changelog',
    enabled: false,
    note: 'Claude Code changelog（會用到的 hooks API 變更）',
  },
];

function loadSources() {
  if (!existsSync(SOURCES_FILE)) {
    writeFileSync(SOURCES_FILE, JSON.stringify(DEFAULT_SOURCES, null, 2));
    return DEFAULT_SOURCES;
  }
  return JSON.parse(readFileSync(SOURCES_FILE, 'utf8'));
}

function saveSources(srcs) {
  writeFileSync(SOURCES_FILE, JSON.stringify(srcs, null, 2));
}

// ── commands ──
function cmdList() {
  const srcs = loadSources();
  console.log(JSON.stringify(srcs, null, 2));
}

function cmdAdd(url) {
  const srcs = loadSources();
  const id = createHash('sha256').update(url).digest('hex').slice(0, 12);
  if (srcs.find((s) => s.id === id)) {
    console.error('already exists');
    return;
  }
  srcs.push({ id, type: 'web', url, enabled: false, note: '' });
  saveSources(srcs);
  console.error(`added ${id}: ${url}`);
}

async function cmdFetch() {
  const srcs = loadSources().filter((s) => s.enabled);
  if (srcs.length === 0) {
    console.error('no sources enabled. Phase 4 才會開啟');
    return;
  }
  for (const src of srcs) {
    try {
      const res = await fetch(src.url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        console.error(`[fail] ${src.id}: HTTP ${res.status}`);
        continue;
      }
      const body = await res.text();
      const candidate = {
        id: randomUUID(),
        source_id: src.id,
        source_url: src.url,
        fetched_at: new Date().toISOString(),
        content_preview: body.slice(0, 2000),
        content_hash: createHash('sha256').update(body).digest('hex').slice(0, 16),
        status: 'pending_review',
      };
      const out = resolve(CANDIDATES_DIR, `${candidate.id}.json`);
      writeFileSync(out, JSON.stringify(candidate, null, 2));
      console.error(`[ok] ${src.id} → ${out}`);
    } catch (e) {
      console.error(`[error] ${src.id}: ${e.message}`);
    }
  }
}

function cmdReview() {
  if (!existsSync(CANDIDATES_DIR)) {
    console.log('(no candidates)');
    return;
  }
  const files = readdirSync(CANDIDATES_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('(no candidates)');
    return;
  }
  for (const f of files) {
    const c = JSON.parse(readFileSync(resolve(CANDIDATES_DIR, f), 'utf8'));
    console.log('───');
    console.log(`id:        ${c.id}`);
    console.log(`source:    ${c.source_id}  (${c.source_url})`);
    console.log(`fetched:   ${c.fetched_at}`);
    console.log(`status:    ${c.status}`);
    console.log(`preview:   ${c.content_preview.slice(0, 200).replace(/\n/g, ' ')}`);
  }
}

// ── 主 ──
const args = process.argv.slice(2);
if (args.includes('--list')) cmdList();
else if (args[0] === '--add' && args[1]) cmdAdd(args[1]);
else if (args.includes('--fetch')) cmdFetch();
else if (args.includes('--review')) cmdReview();
else {
  console.error('usage: node learn.mjs [--list|--add <url>|--fetch|--review]');
  process.exit(2);
}
