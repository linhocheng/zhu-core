/**
 * 解的記憶空間
 * GET  /api/jie-memory              → 讀取最近記憶
 * GET  /api/jie-memory?module=root  → 按模塊過濾
 * GET  /api/jie-memory?search=...   → 語義搜尋
 * POST /api/jie-memory              → 存一條記憶（自動生成 embedding）
 * PATCH /api/jie-memory             → 更新記憶
 * DELETE /api/jie-memory            → 刪除記憶
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, getFirebaseAdmin } from '@/lib/firebase-admin';
import { generateEmbedding, docToText } from '@/lib/embeddings';

const VALID_MODULES = ['soil', 'root', 'bone', 'eye', 'seed'] as const;
type Module = typeof VALID_MODULES[number];

const VALID_MEMORY_TYPES = ['fact', 'preference', 'decision', 'goal', 'observation', 'event'] as const;
type MemoryType = typeof VALID_MEMORY_TYPES[number];

const COLLECTION = 'jie_memories';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const searchQuery = req.nextUrl.searchParams.get('search');

    const includeEmbedding = req.nextUrl.searchParams.get('includeEmbedding') !== 'false';
    const stripEmb = (obj: Record<string, unknown>) => {
      if (includeEmbedding) return obj;
      const { embedding: _e, ...rest } = obj;
      return rest;
    };

    // 語義搜尋
    if (searchQuery) {
      const queryEmbedding = await generateEmbedding(searchQuery);
      const snap = await db.collection(COLLECTION).limit(200).get();
      const withEmb = snap.docs.filter(d => {
        const emb = d.data().embedding;
        return emb && Array.isArray(emb) && emb.length > 0;
      });

      if (withEmb.length === 0) {
        return NextResponse.json({ memories: [], message: '還沒有記憶有 embedding' });
      }

      const scored = withEmb.map(d => {
        const data = d.data();
        const emb = data.embedding as number[];
        let dot = 0, nA = 0, nB = 0;
        for (let i = 0; i < Math.min(emb.length, queryEmbedding.length); i++) {
          dot += emb[i] * queryEmbedding[i];
          nA += emb[i] * emb[i];
          nB += queryEmbedding[i] * queryEmbedding[i];
        }
        const similarity = (nA > 0 && nB > 0) ? dot / (Math.sqrt(nA) * Math.sqrt(nB)) : 0;
        return { id: d.id, ...data, similarity };
      });

      scored.sort((a, b) => b.similarity - a.similarity);
      const results = scored.slice(0, limit).filter(s => s.similarity > 0.3);

      if (results.length > 0) {
        const batch = db.batch();
        const now = new Date();
        for (const r of results) {
          const ref = db.collection(COLLECTION).doc(r.id as string);
          batch.update(ref, {
            hitCount: getFirebaseAdmin().firestore.FieldValue.increment(1),
            lastHitAt: now,
          });
        }
        batch.commit().catch(() => {});
      }

      return NextResponse.json({
        memories: results.map(r => stripEmb(r as Record<string, unknown>)),
        total_with_embedding: withEmb.length,
        total: snap.size,
      });
    }

    // 按模塊過濾
    const moduleFilter = req.nextUrl.searchParams.get('module') as Module | null;
    let memQuery: FirebaseFirestore.Query = db.collection(COLLECTION);
    if (moduleFilter && VALID_MODULES.includes(moduleFilter)) {
      memQuery = memQuery.where('module', '==', moduleFilter);
    }
    memQuery = memQuery.orderBy('createdAt', 'desc').limit(limit);

    const memoriesSnap = await memQuery.get();
    const memories = memoriesSnap.docs.map(d => stripEmb({ id: d.id, ...d.data() }));

    return NextResponse.json({ memories });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();

    const { observation, context, moment: momentField, importance = 'normal', tags = [], memoryType } = body;
    const module: Module = VALID_MODULES.includes(body.module) ? body.module : 'soil';

    if (!observation) {
      return NextResponse.json({ error: 'observation 必填' }, { status: 400 });
    }

    let embedding: number[] | undefined;
    try {
      const textForEmb = docToText({ observation, context, moment: momentField });
      embedding = await generateEmbedding(textForEmb);
    } catch (_e) {}

    const validType = memoryType && VALID_MEMORY_TYPES.includes(memoryType) ? memoryType : undefined;

    const ref = await db.collection(COLLECTION).add({
      observation,
      context: context || '',
      moment: momentField || '',
      importance,
      tags,
      module,
      ...(validType ? { memoryType: validType } : {}),
      hitCount: 0,
      createdAt: new Date(),
      date: new Date().toISOString().slice(0, 10),
      ...(embedding ? { embedding } : {}),
    });

    return NextResponse.json({ success: true, id: ref.id, module, hasEmbedding: !!embedding });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getFirestore();
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'id 必填' }, { status: 400 });

    const existing = await db.collection(COLLECTION).doc(id).get();
    if (existing.exists) {
      await db.collection('zhu_snapshots').add({
        type: 'jie_memory', action: 'patch', docId: id,
        before: existing.data(), timestamp: new Date(),
      });
    }

    const allowed = ['observation', 'context', 'moment', 'module', 'importance', 'tags', 'tier', 'archived'];
    const safe: Record<string, unknown> = {};
    for (const k of allowed) { if (k in updates) safe[k] = updates[k]; }
    safe.updatedAt = new Date();

    await db.collection(COLLECTION).doc(id).update(safe);
    return NextResponse.json({ ok: true, id, updated: Object.keys(safe) });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = getFirestore();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id 必填' }, { status: 400 });

    const existing = await db.collection(COLLECTION).doc(id).get();
    if (existing.exists) {
      await db.collection('zhu_snapshots').add({
        type: 'jie_memory', action: 'delete', docId: id,
        before: existing.data(), timestamp: new Date(),
      });
    }

    await db.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ ok: true, id, deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
