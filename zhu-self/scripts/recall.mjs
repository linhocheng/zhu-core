#!/usr/bin/env node
// recall.mjs
// retrieval API CLI 雛形：query → embed → vector search → top-k
// task #9
//
// Usage:
//   node recall.mjs "上次蒸餾出什麼規律"
//   node recall.mjs "molowe 三層編輯部" --scope=molowe --top=5
//   node recall.mjs "..." --since=2026-04-01

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const VERBOSE = process.env.ZHU_SELF_VERBOSE === '1';

// ── CLI 參數 ──
function parseArgs(argv) {
  const args = { query: '', scope: null, top: 8, since: null, tags: null };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--scope=')) args.scope = a.slice(8);
    else if (a.startsWith('--top=')) args.top = parseInt(a.slice(6), 10);
    else if (a.startsWith('--since=')) args.since = a.slice(8);
    else if (a.startsWith('--tags=')) args.tags = a.slice(7).split(',');
    else positional.push(a);
  }
  args.query = positional.join(' ').trim();
  return args;
}

// ── Embedding ──
async function embedQuery(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: Number(process.env.ZHU_EMBED_DIM || 768),
      }),
    }
  );
  if (!res.ok) throw new Error(`embed failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.embedding?.values;
}

// ── Firestore ──
async function getFirestore() {
  const admin = (await import('firebase-admin')).default;
  const { readFileSync } = await import('node:fs');
  if (!admin.apps.length) {
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    let cert = null;
    if (saPath) cert = JSON.parse(readFileSync(saPath, 'utf8'));
    else if (saJson) cert = JSON.parse(saJson);
    if (cert) {
      admin.initializeApp({
        credential: admin.credential.cert(cert),
        projectId: cert.project_id,
      });
    } else {
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
    }
  }
  return admin.firestore();
}

// ── 主 ──
async function main() {
  const args = parseArgs(process.argv);
  if (!args.query) {
    console.error('usage: node recall.mjs "<query>" [--scope=<>] [--top=<>] [--since=<ISO>] [--tags=a,b]');
    process.exit(2);
  }

  const vec = await embedQuery(args.query);
  if (VERBOSE) console.error(`[embed] dim=${vec.length}`);

  const db = await getFirestore();
  const FieldValue = (await import('firebase-admin')).default.firestore.FieldValue;

  let q = db.collection('zhu_l2_episodes');
  if (args.scope) q = q.where('scope', '==', args.scope);
  if (args.since) q = q.where('when', '>=', args.since);
  if (args.tags) q = q.where('tags', 'array-contains-any', args.tags);

  // findNearest（需 Firestore vector 已啟用）
  const result = await q.findNearest({
    vectorField: 'embedding',
    queryVector: vec,
    limit: args.top,
    distanceMeasure: 'COSINE',
  }).get();

  if (result.empty) {
    console.log('(no results)');
    return;
  }

  for (const doc of result.docs) {
    const d = doc.data();
    console.log('───');
    console.log(`[${d.when}] ${d.what}  (scope=${d.scope}  tags=${(d.tags || []).join(',')})`);
    console.log(`  source: ${d.source_path}`);
    if (d.why) console.log(`  why:    ${d.why.slice(0, 100)}`);
    if (d.outcome) console.log(`  outcome:${d.outcome.slice(0, 100)}`);
    if (d.lesson) console.log(`  lesson: ${d.lesson.slice(0, 150)}`);
  }
}

main().catch((e) => {
  console.error(`[error] ${e.message}`);
  process.exit(1);
});
