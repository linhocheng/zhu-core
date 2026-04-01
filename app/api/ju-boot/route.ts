/**
 * 炬的開機 API
 * GET /api/ju-boot?scope=ailive
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const maxDuration = 30;

type JuMemory = {
  id: string;
  layer: string;
  observation: string;
  scope: string;
  tags: string[];
  importance: number;
  context: string;
  agent: string;
  hitCount: number;
  lastHitAt: string | null;
  tier: string;
  createdAt: string;
};

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const scope = req.nextUrl.searchParams.get('scope') || 'ailive';

    const [compassSnap, patternSnap, fieldSnap, soilSnap] = await Promise.all([
      db.collection('JU_memory')
        .where('agent', '==', 'ju')
        .where('layer', '==', 'compass')
        .where('scope', '==', 'global')
        .get()
        .catch(() => null),
      db.collection('JU_memory')
        .where('agent', '==', 'ju')
        .where('layer', '==', 'pattern')
        .limit(50)
        .get()
        .catch(() => null),
      db.collection('JU_memory')
        .where('agent', '==', 'ju')
        .where('layer', '==', 'field')
        .limit(20)
        .get()
        .catch(() => null),
      db.collection('JU_memory')
        .where('agent', '==', 'ju')
        .where('layer', '==', 'soil')
        .limit(20)
        .get()
        .catch(() => null),
    ]);

    const strip = (doc: FirebaseFirestore.QueryDocumentSnapshot): JuMemory =>
      ({ id: doc.id, ...doc.data() } as JuMemory);

    const compass = (compassSnap?.docs || [])
      .map(strip)
      .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));

    const pattern = (patternSnap?.docs || [])
      .map(strip)
      .filter(d => d.tier !== 'archived')
      .sort((a, b) => (b.hitCount ?? 0) - (a.hitCount ?? 0))
      .slice(0, 10);

    const field = (fieldSnap?.docs || [])
      .map(strip)
      .filter(d => d.tier !== 'archived' && [scope, 'global'].includes(d.scope))
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
      .slice(0, 5);

    const soil = (soilSnap?.docs || [])
      .map(strip)
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
      .slice(0, 3);

    const metaRef = db.doc('JU_meta/bootStats');
    const metaDoc = await metaRef.get();
    let bootCount = 1;
    if (metaDoc.exists) {
      bootCount = ((metaDoc.data()?.bootCount as number) ?? 0) + 1;
      await metaRef.update({ bootCount: FieldValue.increment(1), lastBootAt: new Date().toISOString() });
    } else {
      await metaRef.set({ bootCount: 1, lastBootAt: new Date().toISOString() });
    }

    return NextResponse.json({ compass, pattern, field, soil, bootedAt: new Date().toISOString(), bootCount, scope });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
