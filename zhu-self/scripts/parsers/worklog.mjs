// parsers/worklog.mjs
// WORKLOG.md 按 ## YYYY-MM-DD 切。每個段落 → 一個 chunk。

const HEADING_RE = /^## (\d{4}-\d{2}-\d{2})(?:\s*[—-]\s*(.+))?$/m;

export function parseWorklog(absPath, content) {
  const lines = content.split('\n');
  const chunks = [];
  let current = null;
  let chunkIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(HEADING_RE);
    if (m) {
      if (current) chunks.push(finalize(current, chunkIndex++));
      current = {
        date: m[1],
        title: (m[2] || '').trim(),
        body: [],
        anchor: lines[i],
      };
    } else if (current) {
      current.body.push(lines[i]);
    }
  }
  if (current) chunks.push(finalize(current, chunkIndex));

  return chunks;
}

function finalize(c, idx) {
  const body = c.body.join('\n').trim();

  // 從 body 抽欄位（盡力而為，缺了 distillation daemon 補）
  const why = grabSection(body, /### (背景|WHY|背景\s*\/\s*WHY)/);
  const outcome = grabSection(body, /### (產出|完成|已解決)/);
  const lesson = grabSection(body, /### (LESSON|教訓|LESSONS)/) || null;

  // tags 從 title + body 推
  const tags = extractTags(`${c.title} ${body}`);
  const scope = inferScope(`${c.title} ${body}`);

  return {
    chunk_index: idx,
    source_anchor: c.anchor,
    when: `${c.date}T00:00:00+08:00`,
    what: c.title || `WORKLOG ${c.date}`,
    why,
    outcome,
    lesson,
    tags,
    actors: ['築', 'Adam'],
    scope,
    text: `${c.title}\n\n${body}`,
  };
}

function grabSection(body, headingRe) {
  const lines = body.split('\n');
  const startIdx = lines.findIndex((l) => headingRe.test(l));
  if (startIdx === -1) return '';
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^### /.test(lines[i]) || /^## /.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx + 1, endIdx).join('\n').trim();
}

function extractTags(text) {
  const tags = new Set();
  const known = [
    'molowe', 'ailive', 'bridge', 'midoufu', 'lints', 'vector', 'firestore',
    'phase-A', 'phase-B', 'phase-C', 'sensor', 'kairos', 'jda', 'superego',
    'cron', 'launchd', 'systemd', 'distillation', 'memory', 'hook', 'reflex',
    'livekit', 'minimax', 'deepgram', 'gemini', 'haiku', 'sonnet', 'opus',
  ];
  const lower = text.toLowerCase();
  for (const k of known) if (lower.includes(k.toLowerCase())) tags.add(k);
  return [...tags];
}

function inferScope(text) {
  const lower = text.toLowerCase();
  if (lower.includes('molowe') || lower.includes('midoufu')) return 'molowe';
  if (lower.includes('ailive') || lower.includes('livekit')) return 'ailive';
  if (lower.includes('bridge') || lower.includes('zhu-bridge')) return 'bridge';
  if (lower.includes('zhu-self') || lower.includes('reflex') || lower.includes('daemon')) return 'self';
  return 'other';
}
