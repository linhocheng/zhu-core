/**
 * 築的記憶空間（GET only）
 * GET  /api/zhu-memory              → 讀取最近記憶 + 最新日快照
 * GET  /api/zhu-memory?type=snapshot → 只讀最新日快照
 * GET  /api/zhu-memory?search=...   → 語義搜尋：用意義找記憶
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { generateEmbedding } from '@/lib/embeddings';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const type = req.nextUrl.searchParams.get('type');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const searchQuery = req.nextUrl.searchParams.get('search');

    const includeEmbedding = req.nextUrl.searchParams.get('includeEmbedding') !== 'false';
    const stripEmb = (obj: Record<string, unknown>) => {
      if (includeEmbedding) return obj;
      const { embedding: _e, ...rest } = obj;
      return rest;
    };

    if (type === 'snapshot') {
      const snap = await db.doc('zhu_daily_snapshots/latest').get();
      return NextResponse.json({ snapshot: snap.exists ? snap.data() : null });
    }

    // 語義搜尋：用意義找記憶
    if (searchQuery) {
      const queryEmbedding = await generateEmbedding(searchQuery);
      const snap = await db.collection('zhu_memory').limit(200).get();
      const withEmb = snap.docs.filter(d => {
        const emb = d.data().embedding;
        return emb && Array.isArray(emb) && emb.length > 0;
      });

      if (withEmb.length === 0) {
        return NextResponse.json({ memories: [], message: '還沒有記憶有 embedding，需要先 backfill' });
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

      return NextResponse.json({
        memories: results.map(r => stripEmb(r as Record<string, unknown>)),
        total_with_embedding: withEmb.length,
        total: snap.size,
      });
    }

    const [memoriesSnap, snapshotDoc] = await Promise.all([
      db.collection('zhu_memory').orderBy('createdAt', 'desc').limit(limit).get(),
      db.doc('zhu_daily_snapshots/latest').get(),
    ]);

    const memories = memoriesSnap.docs.map(d => stripEmb({ id: d.id, ...d.data() }));
    const snapshot = snapshotDoc.exists ? snapshotDoc.data() : null;

    return NextResponse.json({ memories, snapshot });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
