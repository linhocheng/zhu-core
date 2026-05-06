// parsers/lessons.mjs
// LESSONS.md 條目 / LESSONS/*.md 整檔。

import { basename } from 'node:path';

export function parseLessons(absPath, content) {
  const file = basename(absPath);

  // LESSONS/{date}.md 整檔
  if (file !== 'LESSONS.md') {
    return [{
      chunk_index: 0,
      source_anchor: file,
      when: extractDateFromFilename(file) || new Date().toISOString(),
      what: file,
      why: '',
      outcome: content.slice(0, 200),
      lesson: content.slice(0, 500),
      tags: ['lessons'],
      actors: ['築'],
      scope: 'self',
      text: content,
    }];
  }

  // LESSONS.md 條目
  const lines = content.split('\n');
  const chunks = [];
  let current = null;
  let idx = 0;

  for (const line of lines) {
    const m = line.match(/^[-*] (.+)$/);
    if (m) {
      if (current) chunks.push(finalizeItem(current, idx++));
      current = { text: m[1] };
    } else if (current && line.trim()) {
      current.text += '\n' + line.trim();
    }
  }
  if (current) chunks.push(finalizeItem(current, idx));
  return chunks;
}

function finalizeItem(c, idx) {
  return {
    chunk_index: idx,
    source_anchor: c.text.slice(0, 60),
    when: new Date().toISOString(),
    what: c.text.slice(0, 100),
    why: '',
    outcome: '',
    lesson: c.text,
    tags: ['lessons'],
    actors: ['築'],
    scope: 'self',
    text: c.text,
  };
}

function extractDateFromFilename(name) {
  const m = name.match(/(\d{4})(\d{2})(\d{2})/) || name.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}T00:00:00+08:00`;
}
