/**
 * 炬的蒸餾引擎
 * POST /api/ju-distill
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

const VALID_LAYERS = ['compass', 'pattern', 'field', 'soil'] as const;

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const { summary, scope, insights } = await req.json();

    if (!summary || !scope) {
      return NextResponse.json({ error: 'summary, scope 必填' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const written: string[] = [];

    const soilRef = await db.collection('JU_memory').add({
      observation: summary,
      layer: 'soil',
      scope,
      tags: ['distill', 'session-summary'],
      importance: 5,
      context: '對話結束蒸餾',
      agent: 'ju',
      hitCount: 0,
      lastHitAt: null,
      tier: 'fresh',
      createdAt: now,
    });
    written.push(`soil: ${soilRef.id}`);

    if (Array.isArray(insights) && insights.length > 0) {
      for (const ins of insights) {
        const { observation, layer, importance, context, tags } = ins;
        if (!observation || !layer || !VALID_LAYERS.includes(layer)) continue;
        const ref = await db.collection('JU_memory').add({
          observation,
          layer,
          scope,
          tags: tags || ['distill'],
          importance: importance ?? 7,
          context: context || '',
          agent: 'ju',
          hitCount: 0,
          lastHitAt: null,
          tier: 'fresh',
          createdAt: now,
        });
        written.push(`${layer}: ${ref.id}`);
      }
    }

    // soil 超過 10 條 → 最舊的 archived
    const soilSnap = await db.collection('JU_memory')
      .where('agent', '==', 'ju')
      .where('layer', '==', 'soil')
      .limit(50)
      .get();

    const activeSoil = soilSnap.docs.filter(d => d.data().tier !== 'archived');
    if (activeSoil.length > 10) {
      const sorted = activeSoil
        .map(d => ({ id: d.id, createdAt: String(d.data().createdAt || '') }))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      for (const doc of sorted.slice(0, sorted.length - 10)) {
        await db.collection('JU_memory').doc(doc.id).update({ tier: 'archived' });
      }
    }

    return NextResponse.json({ success: true, written, summary: summary.slice(0, 80) });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
