// parsers/memory.mjs
// memory/*.md（含 frontmatter）整檔一筆。

import { basename } from 'node:path';

export function parseMemory(absPath, content) {
  const fm = parseFrontmatter(content);
  const body = fm.body;
  const file = basename(absPath, '.md');

  // type → scope
  const scope = inferScopeFromType(fm.type) || 'self';

  // tags 從 frontmatter type + 檔名推
  const tags = [fm.type, ...inferTagsFromFilename(file)].filter(Boolean);

  return [{
    chunk_index: 0,
    source_anchor: fm.name || file,
    when: new Date().toISOString(),
    what: fm.name || file,
    why: fm.description || '',
    outcome: body.slice(0, 200),
    lesson: fm.type === 'feedback' ? extractFeedbackLesson(body) : null,
    tags,
    actors: ['築', 'Adam'],
    scope,
    text: `${fm.name}\n${fm.description}\n\n${body}`,
  }];
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return { body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { body: content };
  const fmText = content.slice(3, end).trim();
  const body = content.slice(end + 4).trim();
  const fm = {};
  for (const line of fmText.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  fm.body = body;
  return fm;
}

function inferScopeFromType(type) {
  if (type === 'feedback') return 'self';
  if (type === 'project') return 'self';
  if (type === 'reference') return 'self';
  if (type === 'user') return 'self';
  return null;
}

function inferTagsFromFilename(name) {
  const out = [];
  if (name.includes('molowe')) out.push('molowe');
  if (name.includes('ailive')) out.push('ailive');
  if (name.includes('bridge')) out.push('bridge');
  if (name.includes('midoufu')) out.push('midoufu');
  if (name.includes('livekit')) out.push('livekit');
  if (name.includes('firestore')) out.push('firestore');
  if (name.includes('superego')) out.push('superego');
  return out;
}

function extractFeedbackLesson(body) {
  // 取第一行非空非 heading 的內容當 lesson 摘要
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('**')) continue;
    return t.slice(0, 150);
  }
  return null;
}
