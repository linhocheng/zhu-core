/**
 * 築、工、蝦的指令通道
 * POST  /api/zhu-orders → 寫入指令、工單、緊急停止
 * GET   /api/zhu-orders → 讀取指令（支援 type / status / target / latest / limit）
 * PATCH /api/zhu-orders → 更新狀態（id + status）
 *
 * type:
 *   "order"          築→工，傳統指令
 *   "report"         工→築，回報
 *   "work_order"     蝦→築，工單審批請求
 *   "EMERGENCY_STOP" 築→蝦，緊急停止訊號
 *
 * from: "zhu" | "gong" | "xiaoxia"
 *
 * status:
 *   "pending"   等待中
 *   "approved"  築批准（work_order 用）
 *   "rejected"  築退回（work_order 用）
 *   "modify"    築要求修改（work_order 用）
 *   "done"      完成
 *   "halted"    蝦被停止中
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

const VALID_TYPES = ['order', 'report', 'work_order', 'EMERGENCY_STOP'];
const VALID_FROM  = ['zhu', 'gong', 'xiaoxia'];
const VALID_STATUS = ['pending', 'approved', 'rejected', 'modify', 'done', 'halted'];

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const type   = req.nextUrl.searchParams.get('type');
    const status = req.nextUrl.searchParams.get('status');
    const target = req.nextUrl.searchParams.get('target');   // 蝦查針對自己的 STOP
    const latest = req.nextUrl.searchParams.get('latest');
    const limit  = parseInt(req.nextUrl.searchParams.get('limit') || '10');

    let query: FirebaseFirestore.Query = db.collection('zhu_orders');

    if (type)   query = query.where('type',   '==', type);
    if (status) query = query.where('status', '==', status);
    if (target) query = query.where('target', '==', target);

    query = query.orderBy('createdAt', 'desc');
    query = latest === 'true' ? query.limit(1) : query.limit(limit);

    let snap;
    try {
      snap = await query.get();
    } catch (indexErr: unknown) {
      const indexMsg = indexErr instanceof Error ? indexErr.message : '';
      if (indexMsg.includes('FAILED_PRECONDITION')) {
        const fallbackSnap = await db.collection('zhu_orders')
          .orderBy('createdAt', 'desc')
          .limit(100)
          .get();
        let results = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];
        if (type)   results = results.filter(r => r.type   === type);
        if (status) results = results.filter(r => r.status === status);
        if (target) results = results.filter(r => r.target === target);
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
    const { id, status, note } = body;

    if (!id) {
      return NextResponse.json({ error: 'id 必填' }, { status: 400 });
    }
    if (!status || !VALID_STATUS.includes(status)) {
      return NextResponse.json({
        error: `status 必須是 ${VALID_STATUS.join(' | ')}`
      }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
    if (note) updateData.note = note;   // modify 時附說明

    await db.collection('zhu_orders').doc(id).update(updateData);
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

    const {
      type,
      from,
      content,
      target,        // EMERGENCY_STOP 用：指定停哪個 agent
      scope,         // EMERGENCY_STOP 用：工單 ID 或 "*"
      reason,        // EMERGENCY_STOP / work_order 用：原因說明
      risk,          // work_order 用：low | medium | high | critical
      action,        // work_order 用：要執行的動作
      reversible,    // work_order 用：是否可逆
      estimatedApiCalls, // work_order 用
      status = 'pending',
    } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({
        error: `type 必須是 ${VALID_TYPES.join(' | ')}`
      }, { status: 400 });
    }
    if (!from || !VALID_FROM.includes(from)) {
      return NextResponse.json({
        error: `from 必須是 ${VALID_FROM.join(' | ')}`
      }, { status: 400 });
    }

    // EMERGENCY_STOP 必須有 target
    if (type === 'EMERGENCY_STOP' && !target) {
      return NextResponse.json({ error: 'EMERGENCY_STOP 需要 target 欄位' }, { status: 400 });
    }

    // work_order / order / report 必須有 content
    if (type !== 'EMERGENCY_STOP' && !content) {
      return NextResponse.json({ error: 'content 必填' }, { status: 400 });
    }

    const ref = await db.collection('zhu_orders').add({
      type,
      from,
      content:  content  || null,
      target:   target   || null,
      scope:    scope    || null,
      reason:   reason   || null,
      risk:     risk     || null,
      action:   action   || null,
      reversible: reversible ?? null,
      estimatedApiCalls: estimatedApiCalls ?? null,
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
