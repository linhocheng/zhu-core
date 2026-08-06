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
  // 記憶庫有兩種 frontmatter schema（126 平鋪 type: / 59 巢狀 metadata:）。
  // 舊解析只吃 /^(\w+):/ → 59 個檔的 type 讀不到，tags 空、lesson 為 null，檢索被稀釋。
  // 2026-08-07 改成收斂點防禦：巢狀子鍵一律拉平，兩種 schema 都吃。平鋪的優先。
  let nestedParent = null;
  for (const line of fmText.split('\n')) {
    if (!line.trim()) continue;
    const nested = line.match(/^\s+(\w+):\s*(.*)$/);
    if (nested && nestedParent) {
      const k = nested[1];
      if (fm[k] === undefined) fm[k] = unquote(nested[2]);
      continue;
    }
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const v = unquote(m[2]);
    if (v === '') { nestedParent = m[1]; continue; }  // 空值＝巢狀父鍵（也順手讓 name: "" 落成 falsy）
    fm[m[1]] = v;
    nestedParent = null;
  }
  fm.body = body;
  return fm;
}

// 去掉成對的外層引號；`name: ""` → '' → falsy → 上游 fallback 回檔名，不再以字面 `""` 當標題
function unquote(s) {
  const t = (s || '').trim();
  if (t.length >= 2 && ((t[0] === '"' && t.at(-1) === '"') || (t[0] === "'" && t.at(-1) === "'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
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

// 2026-08-07：舊版把所有 `**` 開頭的行整片跳過，但規則本體常常是粗體的
// （`**規則**：…`），結果 lesson 撈到文件中段的隨機 bullet。改成只跳過已知的欄位標頭。
const FIELD_HEADERS = /^\*\*(Why|心態|How to apply|怎麼用|觸發信號|家族|規則)\b/;

function extractFeedbackLesson(body) {
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('-') || t.startsWith('>')) continue;
    if (FIELD_HEADERS.test(t)) {
      // `**規則**：內容` 這種——標頭後面就接本體，剝掉標頭直接用
      const inline = t.replace(/^\*\*規則\*\*[：:]\s*/, '');
      if (inline !== t && inline) return inline.replace(/\*\*/g, '').slice(0, 150);
      continue;
    }
    return t.replace(/\*\*/g, '').slice(0, 150);
  }
  return null;
}
