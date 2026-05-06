// parsers/lastwords.mjs
// ZHU_LAST_WORDS.md 按 ## 二級標題切。

export function parseLastwords(absPath, content) {
  const lines = content.split('\n');
  const chunks = [];
  let current = null;
  let chunkIndex = 0;

  // 取最上面 frontmatter / 標題後的文件 mtime 作 fallback when
  const fallbackWhen = new Date().toISOString();

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^## (.+)$/);
    if (m) {
      if (current) chunks.push(finalize(current, chunkIndex++, fallbackWhen, absPath));
      current = {
        title: m[1].trim(),
        body: [],
        anchor: lines[i],
      };
    } else if (current) {
      current.body.push(lines[i]);
    }
  }
  if (current) chunks.push(finalize(current, chunkIndex, fallbackWhen, absPath));

  return chunks;
}

function finalize(c, idx, fallbackWhen, absPath) {
  const body = c.body.join('\n').trim();
  return {
    chunk_index: idx,
    source_anchor: c.anchor,
    when: fallbackWhen,
    what: c.title,
    why: '',
    outcome: body.slice(0, 200),
    lesson: null,
    tags: ['lastwords'],
    actors: ['築'],
    scope: 'self',
    text: `${c.title}\n\n${body}`,
  };
}
