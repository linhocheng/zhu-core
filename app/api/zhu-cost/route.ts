import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const db = getFirestore();
    const snap = await db.collection('zhu_cost_log')
      .where('date', '==', date)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const logs = snap.docs.map(d => {
      const data = d.data();
      return {
        model: data.model,
        tier: data.tier,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        cost: data.cost,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      };
    });

    const totalCost = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
    const totalInput = logs.reduce((sum, l) => sum + (l.inputTokens || 0), 0);
    const totalOutput = logs.reduce((sum, l) => sum + (l.outputTokens || 0), 0);
    const haikuCount = logs.filter(l => l.tier === 'haiku').length;
    const sonnetCount = logs.filter(l => l.tier === 'sonnet').length;

    return NextResponse.json({
      date,
      summary: {
        requests: logs.length,
        haiku: haikuCount,
        sonnet: sonnetCount,
        totalInput,
        totalOutput,
        totalCost: Math.round(totalCost * 1_000_000) / 1_000_000,
      },
      logs,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
