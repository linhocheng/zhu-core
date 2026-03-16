/**
 * 築和工的直接通道
 * POST  /api/zhu-orders → 寫入指令或回報
 * GET   /api/zhu-orders → 讀取指令或回報
 * PATCH /api/zhu-orders → 更新指令狀態（id + status）
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

    // 索引可能尚未建完，fallback 到無過濾查詢 + 客戶端過濾
    let snap;
    try {
      snap = await query.get();
    } catch (indexErr: unknown) {
      const indexMsg = indexErr instanceof Error ? indexErr.message : '';
      if (indexMsg.includes('FAILED_PRECONDITION')) {
        // 索引尚未建好，fallback: 全取 + 客戶端過濾
        const fallbackSnap = await db.collection('zhu_orders')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();
        let results = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];
        if (type) results = results.filter(r => r.type === type);
        if (status) results = results.filter(r => r.status === status);
        const finalLimit = latest === 'true' ? 1 : limit;
        return NextResponse.json({ orders: results.slice(0, finalLimit), _fallback: true });
      }
      throw indexErr;
    }

    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'id 必填' }, { status: 400 });
    }
    if (!status || !['pending', 'done'].includes(status)) {
      return NextResponse.json({ error: 'status 必須是 pending 或 done' }, { status: 400 });
    }

    await db.collection('zhu_orders').doc(id).update({ status, updatedAt: new Date() });

    return NextResponse.json({ success: true, id, status });
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
