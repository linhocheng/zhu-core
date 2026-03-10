/**
 * 築的知識心法庫（zhu_xinfa）
 * 不是感受記錄，是可以被調用的架構知識。
 *
 * GET  /api/zhu-xinfa              → 讀最新 10 條
 * GET  /api/zhu-xinfa?topic=xxx    → 按話題找最相關的心法（關鍵字）
 * GET  /api/zhu-xinfa?search=xxx   → 語義搜尋：用意義找心法
 * POST /api/zhu-xinfa              → 存入一條知識心法（自動 embedding + 語義去重 0.85）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { generateEmbedding, docToText } from '@/lib/embeddings';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const topic = req.nextUrl.searchParams.get('topic');
    const searchQuery = req.nextUrl.searchParams.get('search');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const includeEmbedding = req.nextUrl.searchParams.get('includeEmbedding') !== 'false';

    const snap = await db.collection('zhu_xinfa').orderBy('createdAt', 'desc').limit(60).get();
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];

    const stripEmbedding = (items: Record<string, unknown>[]) =>
      includeEmbedding ? items : items.map(({ embedding: _e, ...rest }) => rest);

    // 語義搜尋
    if (searchQuery) {
      const queryEmbedding = await generateEmbedding(searchQuery);
      const withEmb = all.filter(x => x.embedding && Array.isArray(x.embedding));

      if (withEmb.length === 0) {
        return NextResponse.json({ xinfa: [], message: '還沒有心法有 embedding' });
      }

      const scored = withEmb.map(x => {
        const emb = x.embedding as number[];
        let dot = 0, nA = 0, nB = 0;
        for (let i = 0; i < Math.min(emb.length, queryEmbedding.length); i++) {
          dot += emb[i] * queryEmbedding[i];
          nA += emb[i] * emb[i];
          nB += queryEmbedding[i] * queryEmbedding[i];
        }
        const similarity = (nA > 0 && nB > 0) ? dot / (Math.sqrt(nA) * Math.sqrt(nB)) : 0;
        return { ...x, similarity };
      });

      scored.sort((a, b) => b.similarity - a.similarity);
      const results = scored.slice(0, limit).filter(s => s.similarity > 0.3);

      return NextResponse.json({ xinfa: stripEmbedding(results), total_with_embedding: withEmb.length, total: all.length });
    }

    // 關鍵字搜尋
    if (topic) {
      const topicLower = topic.toLowerCase();
      const tokens = topicLower.split(/[\s，。！？、：]+/).filter(t => (t as string).length >= 2);
      const scored = all.map(x => {
        const text = `${x.title || ''} ${x.principle || ''} ${x.tags || ''}`.toLowerCase();
        let score = 0;
        if (text.includes(topicLower)) score += 10;
        tokens.forEach(t => { if (text.includes(t as string)) score += 2; });
        for (let i = 0; i <= topicLower.length - 2; i++) {
          if (text.includes(topicLower.slice(i, i + 2))) score += 1;
        }
        return { x, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const relevant = scored.filter(s => s.score > 0).slice(0, limit).map(s => s.x);
      return NextResponse.json({ xinfa: stripEmbedding(relevant.length > 0 ? relevant : all.slice(0, 3)) });
    }

    return NextResponse.json({ xinfa: stripEmbedding(all.slice(0, limit)) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const { title, principle, application, source, tags = [] } = await req.json();

    if (!title || !principle) {
      return NextResponse.json({ error: 'title 和 principle 必填' }, { status: 400 });
    }

    // 生成語義向量
    const textForEmb = docToText({ title, principle, application });
    let newEmbedding: number[];
    try {
      newEmbedding = await generateEmbedding(textForEmb);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: `Embedding 生成失敗: ${message}` }, { status: 500 });
    }

    // 語義去重（閾值 0.85）
    const existingSnap = await db.collection('zhu_xinfa').limit(200).get();
    const withEmb = existingSnap.docs.filter(d => {
      const emb = d.data().embedding;
      return emb && Array.isArray(emb) && emb.length > 0;
    });

    for (const doc of withEmb) {
      const data = doc.data();
      const emb = data.embedding as number[];
      let dot = 0, nA = 0, nB = 0;
      for (let i = 0; i < Math.min(emb.length, newEmbedding.length); i++) {
        dot += emb[i] * newEmbedding[i];
        nA += emb[i] * emb[i];
        nB += newEmbedding[i] * newEmbedding[i];
      }
      const similarity = (nA > 0 && nB > 0) ? dot / (Math.sqrt(nA) * Math.sqrt(nB)) : 0;

      if (similarity >= 0.85) {
        return NextResponse.json({
          success: true,
          action: 'skipped',
          reason: '語義重複',
          duplicateOf: {
            id: doc.id,
            title: String(data.title || data.principle || '').slice(0, 80),
            similarity: Math.round(similarity * 1000) / 1000,
          },
        });
      }
    }

    // 不重複，寫入
    const now = new Date();
    const ref = await db.collection('zhu_xinfa').add({
      title: String(title).slice(0, 100),
      principle: String(principle),
      application: application || '',
      source: source || '',
      tags,
      createdAt: now,
      date: now.toISOString().slice(0, 10),
      embedding: newEmbedding,
    });

    return NextResponse.json({ success: true, action: 'created', id: ref.id, hasEmbedding: true });
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

    const existing = await db.collection('zhu_xinfa').doc(id).get();
    if (existing.exists) {
      await db.collection('zhu_snapshots').add({
        type: 'xinfa', action: 'patch', docId: id,
        before: existing.data(), timestamp: new Date(),
      });
    }

    const allowed = ['title', 'principle', 'application', 'source', 'tags'];
    const safe: Record<string, unknown> = {};
    for (const k of allowed) { if (k in updates) safe[k] = updates[k]; }
    safe.updatedAt = new Date();

    await db.collection('zhu_xinfa').doc(id).update(safe);
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

    const existing = await db.collection('zhu_xinfa').doc(id).get();
    if (existing.exists) {
      await db.collection('zhu_snapshots').add({
        type: 'xinfa', action: 'delete', docId: id,
        before: existing.data(), timestamp: new Date(),
      });
    }

    await db.collection('zhu_xinfa').doc(id).delete();
    return NextResponse.json({ ok: true, id, deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
