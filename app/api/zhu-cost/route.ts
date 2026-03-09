import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const db = getFirestore();
    // 不用複合索引，直接拿最近 N 條
    const snap = await db.collection('zhu_cost_log')
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
        date: data.date,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      };
    });

    const totalCost = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
    const totalInput = logs.reduce((sum, l) => sum + (l.inputTokens || 0), 0);
    const totalOutput = logs.reduce((sum, l) => sum + (l.outputTokens || 0), 0);
    const haikuCount = logs.filter(l => l.tier === 'haiku').length;
    const sonnetCount = logs.filter(l => l.tier === 'sonnet').length;

    return NextResponse.json({
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
