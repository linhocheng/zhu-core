/**
 * AILIVE 跨 Agent 事件流
 * GET  /api/ailive-events?agent=moumou&limit=10 → 讀某 agent 的最近事件
 * POST /api/ailive-events → 寫一條事件
 *
 * 共用 Firestore collection: ailive_events
 * 築和謀謀都能讀寫，讓彼此感知對方在做什麼
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agent = searchParams.get('agent'); // 'zhu' | 'moumou' | null(全部)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    const db = getFirestore();
    let q = db.collection('ailive_events').orderBy('createdAt', 'desc').limit(limit);
    if (agent) {
      q = db.collection('ailive_events').where('agent', '==', agent).orderBy('createdAt', 'desc').limit(limit);
    }

    const snap = await q.get();
    const events = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        agent: data.agent,
        type: data.type,
        summary: data.summary,
        details: data.details || null,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      };
    });

    return NextResponse.json({ count: events.length, events });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const { agent, type, summary, details } = await req.json();

    if (!agent || !type || !summary) {
      return NextResponse.json({ error: 'agent, type, summary 必填' }, { status: 400 });
    }

    const ref = await db.collection('ailive_events').add({
      agent, // 'zhu' | 'moumou'
      type,  // 'deploy' | 'memory' | 'insight' | 'dialogue' | 'letter' | 'soul_proposal' | 'task' | 'image'
      summary,
      details: details || null,
      createdAt: new Date(),
      date: new Date().toISOString().slice(0, 10),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
