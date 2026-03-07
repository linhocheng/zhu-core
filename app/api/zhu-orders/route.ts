/**
 * 築和工的直接通道
 * POST /api/zhu-orders → 寫入指令或回報
 * GET  /api/zhu-orders → 讀取指令或回報
 *
 * type: "order"（築→工）| "report"（工→築）
 * from: "zhu" | "gong"
 * status: "pending" | "done"
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const type = req.nextUrl.searchParams.get('type');
    const status = req.nextUrl.searchParams.get('status');
    const latest = req.nextUrl.searchParams.get('latest');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

    let query: FirebaseFirestore.Query = db.collection('zhu_orders');

    if (type) {
      query = query.where('type', '==', type);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');

    if (latest === 'true') {
      query = query.limit(1);
    } else {
      query = query.limit(limit);
    }

    const snap = await query.get();
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();

    const { type, from, content, status = 'pending' } = body;

    if (!type || !['order', 'report'].includes(type)) {
      return NextResponse.json({ error: 'type 必須是 order 或 report' }, { status: 400 });
    }
    if (!from || !['zhu', 'gong'].includes(from)) {
      return NextResponse.json({ error: 'from 必須是 zhu 或 gong' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: 'content 必填' }, { status: 400 });
    }

    const ref = await db.collection('zhu_orders').add({
      type,
      from,
      content,
      status,
      createdAt: new Date(),
      date: new Date().toISOString().slice(0, 10),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
