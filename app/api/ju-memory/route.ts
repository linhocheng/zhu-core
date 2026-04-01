/**
 * 炬的記憶空間
 * GET  /api/ju-memory              → 讀取記憶（支援 layer / scope / tags 篩選）
 * POST /api/ju-memory              → 寫入新記憶
 * PATCH /api/ju-memory?id=xxx      → 更新記憶（hitCount++、修改內容）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const maxDuration = 30;

const VALID_LAYERS = ['compass', 'pattern', 'field', 'soil'] as const;
type Layer = typeof VALID_LAYERS[number];

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const layer = req.nextUrl.searchParams.get('layer') as Layer | null;
    const scope = req.nextUrl.searchParams.get('scope');
    const tags = req.nextUrl.searchParams.get('tags');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

    let query = db.collection('JU_memory').where('agent', '==', 'ju') as FirebaseFirestore.Query;
    if (layer) query = query.where('layer', '==', layer);
    if (scope) query = query.where('scope', '==', scope);
    if (tags) query = query.where('tags', 'array-contains', tags);

    const snap = await query.limit(Math.min(limit, 50)).get();
    const memories = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, memories, count: memories.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();
    const { observation, layer, scope, tags, importance, context, tier } = body;

    if (!observation || !layer || !scope || !tier) {
      return NextResponse.json({ error: 'observation, layer, scope, tier 必填' }, { status: 400 });
    }
    if (!VALID_LAYERS.includes(layer)) {
      return NextResponse.json({ error: `layer 必須是 ${VALID_LAYERS.join(' | ')}` }, { status: 400 });
    }

    const doc = {
      observation,
      layer,
      scope,
      tags: tags || [],
      importance: importance ?? 5,
      context: context || '',
      agent: 'ju',
      hitCount: 0,
      lastHitAt: null,
      tier,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection('JU_memory').add(doc);
    return NextResponse.json({ success: true, id: ref.id, ...doc });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getFirestore();
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id 必填（?id=xxx）' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.hitCount === 'increment') {
      updates.hitCount = FieldValue.increment(1);
    } else if (body.hitCount !== undefined) {
      updates.hitCount = body.hitCount;
    }

    if (body.lastHitAt === 'now') {
      updates.lastHitAt = new Date().toISOString();
    } else if (body.lastHitAt !== undefined) {
      updates.lastHitAt = body.lastHitAt;
    }

    const allowed = ['observation', 'importance', 'context', 'tags', 'scope', 'tier', 'layer'];
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '沒有指定要更新的欄位' }, { status: 400 });
    }

    await db.collection('JU_memory').doc(id).update(updates);
    return NextResponse.json({ success: true, id, updated: updates });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
