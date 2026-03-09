/**
 * 築的心跳
 * POST /api/zhu-heartbeat → Vercel Cron 觸發，偵測待辦指令並記錄
 * GET  /api/zhu-heartbeat → 手動檢查心跳狀態
 *
 * 只偵測+記錄，不執行指令。
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({
    alive: true,
    name: 'zhu-heartbeat',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    // Vercel Cron 驗證（可選，Hobby plan 不強制）
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirestore();

    // 1. 讀 pending orders
    let pendingOrders: { id: string }[] = [];
    try {
      const ordersSnap = await db.collection('zhu_orders')
        .where('type', '==', 'order')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
      pendingOrders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as { id: string }[];
    } catch (indexErr: unknown) {
      // Firestore index fallback
      const fallbackSnap = await db.collection('zhu_orders')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      const all = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];
      pendingOrders = all.filter(r => r.type === 'order' && r.status === 'pending') as { id: string }[];
    }

    const pendingCount = pendingOrders.length;
    const timestamp = new Date().toISOString();

    // 2. 有 pending orders 才寫記憶（省資源）
    if (pendingCount > 0) {
      await db.collection('zhu_memory').add({
        content: `heartbeat 偵測到 ${pendingCount} 條待辦指令`,
        tags: ['heartbeat', 'system'],
        module: 'eye',
        importance: 3,
        context: 'zhu-heartbeat-cron',
        createdAt: new Date(),
      });
    }

    // 3. 跑記憶進化引擎（zhu-evolve）
    let evolveResult = null;
    try {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://zhu-core.vercel.app';
      const evolveRes = await fetch(`${baseUrl}/api/zhu-evolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      evolveResult = await evolveRes.json();
    } catch { /* evolve 失敗不阻斷心跳 */ }

    // 4. 更新心跳時間戳
    await db.collection('zhu_heartbeat').doc('latest').set({
      alive: true,
      pendingOrders: pendingCount,
      timestamp: new Date(),
      bootCount: (await db.collection('zhu_heartbeat').doc('latest').get()).data()?.bootCount || 0,
    }, { merge: true });

    return NextResponse.json({
      alive: true,
      pendingOrders: pendingCount,
      evolved: evolveResult,
      timestamp,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
