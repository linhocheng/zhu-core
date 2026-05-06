#!/usr/bin/env node
// embed-and-upsert.mjs
// 吃一個 .md 檔 → 偵測類型 → 切 chunks → embed（gemini-embedding-001）→ upsert 到 Firestore
// task #8 雛形。配合 task #10 migration 與 task #11 watch。
//
// Usage:
//   node embed-and-upsert.mjs <path-to-md>
//   ZHU_SELF_DRY_RUN=1 node embed-and-upsert.mjs <path-to-md>

import { readFileSync, statSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

import { parseWorklog } from './parsers/worklog.mjs';
import { parseLastwords } from './parsers/lastwords.mjs';
import { parseMemory } from './parsers/memory.mjs';
import { parseLessons } from './parsers/lessons.mjs';

const DRY_RUN = process.env.ZHU_SELF_DRY_RUN === '1';
const VERBOSE = process.env.ZHU_SELF_VERBOSE === '1';
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

// ── 偵測檔案類型，分派 parser ──
function detectAndParse(absPath, content) {
  const name = basename(absPath);
  const dir = dirname(absPath);

  if (name === 'WORKLOG.md') {
    return parseWorklog(absPath, content);
  }
  if (name === 'ZHU_LAST_WORDS.md') {
    return parseLastwords(absPath, content);
  }
  if (name === 'LESSONS.md' || dir.endsWith('/LESSONS')) {
    return parseLessons(absPath, content);
  }
  if (dir.includes('/memory') || dir.includes('/.claude/projects/')) {
    return parseMemory(absPath, content);
  }
  // 其他 .md 整檔一筆
  return [{
    chunk_index: 0,
    source_anchor: name,
    when: new Date(statSync(absPath).mtimeMs).toISOString(),
    what: name,
    why: '',
    outcome: '',
    lesson: null,
    tags: [],
    actors: [],
    scope: 'self',
    text: content,
  }];
}

// ── Firestore 寫入（lazy init）──
let firestore = null;
async function getFirestore() {
  if (firestore) return firestore;
  if (DRY_RUN) return null;

  const adminMod = await import('firebase-admin');
  const admin = adminMod.default;
  globalThis.__firestoreFieldValue = admin.firestore.FieldValue;
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
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  }
  firestore = admin.firestore();
  return firestore;
}

// ── Embedding（gemini-embedding-001 via REST）──
async function embed(text) {
  if (DRY_RUN) {
    return { embedding: null, model: EMBEDDING_MODEL };
  }
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
  return { embedding: data.embedding?.values, model: EMBEDDING_MODEL };
}

// ── dedup id：source_path + chunk_index 的雜湊 ──
function dedupId(sourcePath, chunkIndex) {
  return createHash('sha256')
    .update(`${sourcePath}::${chunkIndex}`)
    .digest('hex')
    .slice(0, 32);
}

// ── 主流程 ──
async function processFile(absPath) {
  const content = readFileSync(absPath, 'utf8');
  const chunks = detectAndParse(absPath, content);
  if (VERBOSE) console.error(`[parse] ${absPath} → ${chunks.length} chunks`);

  const db = await getFirestore();
  const now = new Date().toISOString();

  for (const c of chunks) {
    const id = dedupId(absPath, c.chunk_index);
    const { embedding, model } = await embed(c.text || c.what);

    const doc = {
      id,
      source_path: absPath,
      source_anchor: c.source_anchor,
      chunk_index: c.chunk_index,
      when: c.when,
      what: c.what,
      why: c.why,
      outcome: c.outcome,
      lesson: c.lesson,
      tags: c.tags || [],
      actors: c.actors || [],
      scope: c.scope || 'self',
      embedding: embedding ? globalThis.__firestoreFieldValue.vector(embedding) : null,
      embedding_model: model,
      embedding_at: embedding ? now : null,
      created_at: now,
      updated_at: now,
      version: 1,
    };

    if (DRY_RUN) {
      console.log(JSON.stringify({ id, anchor: c.source_anchor, what: c.what }, null, 2));
    } else {
      await db.collection('zhu_l2_episodes').doc(id).set(doc, { merge: true });
      if (VERBOSE) console.error(`[upsert] ${id} ${c.source_anchor}`);
    }
  }

  return chunks.length;
}

// ── CLI ──
const filePath = process.argv[2];
if (!filePath) {
  console.error('usage: node embed-and-upsert.mjs <path-to-md>');
  process.exit(2);
}
const abs = resolve(filePath);

processFile(abs)
  .then((n) => {
    console.error(`[done] ${n} chunks ${DRY_RUN ? 'dry-run' : 'upserted'}`);
  })
  .catch((e) => {
    console.error(`[error] ${e.message}`);
    process.exit(1);
  });
