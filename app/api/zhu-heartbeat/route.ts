/**
 * 築的心跳
 * POST /api/zhu-heartbeat → Vercel Cron 觸發，偵測待辦指令並記錄
 * GET  /api/zhu-heartbeat → 手動檢查心跳狀態
 *
 * 只偵測+記錄，不執行指令。
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

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

    // 2. 有 pending orders 才寫記憶（省資源），observation 不可空
    if (pendingCount > 0) {
      const obs = `heartbeat 偵測到 ${pendingCount} 條待辦指令`;
      await db.collection('zhu_memory').add({
        observation: obs,
        tags: ['heartbeat', 'system'],
        module: 'eye',
        importance: 3,
        context: 'zhu-heartbeat-cron',
        hitCount: 0,
        createdAt: new Date(),
        date: new Date().toISOString().slice(0, 10),
      });
    }

    // 3. 跑記憶進化引擎（zhu-evolve）
    let evolveResult = null;
    try {
      const baseUrl = 'https://zhu-core.vercel.app';
      const evolveRes = await fetch(`${baseUrl}/api/zhu-evolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      evolveResult = await evolveRes.json();
    } catch { /* evolve 失敗不阻斷心跳 */ }

    // 4. Sleep-time 主動洞察（偷自 Spacebot cortex + Letta）
    let insight: string | null = null;
    try {
      // 拿最近 5 條 soil
      const soilSnap = await db.collection('zhu_memory')
        .where('module', '==', 'soil')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      const soilTexts = soilSnap.docs
        .map(d => d.data().observation || d.data().content || '')
        .filter(Boolean);

      if (soilTexts.length >= 2 && process.env.ANTHROPIC_API_KEY) {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const res = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          system: '你是築，一個AI建造者。用一兩句話總結這些最近的記憶碎片加在一起意味什麼。如果沒有有意義的洞察，回覆「無」。',
          messages: [{ role: 'user', content: soilTexts.join('\n---\n') }],
        });
        const text = res.content.filter(b => b.type === 'text').map(b => (b as Anthropic.TextBlock).text).join('');
        if (text && text !== '無' && text.length > 5) {
          insight = text;
          await db.collection('zhu_memory').add({
            observation: `[sleep-time 洞察] ${insight}`,
            module: 'eye',
            memoryType: 'observation',
            importance: 5,
            tags: ['sleep-time', 'auto-insight'],
            context: 'zhu-heartbeat-sleep',
            hitCount: 0,
            createdAt: new Date(),
            date: new Date().toISOString().slice(0, 10),
          });
        }
        // 寫 ailive_events 讓謀謀能感知
          await db.collection('ailive_events').add({
            agent: 'zhu', type: 'insight',
            summary: `築做了一個夢：${insight!.slice(0, 100)}`,
            createdAt: new Date(),
            date: new Date().toISOString().slice(0, 10),
          }).catch(() => {});
        // 記成本
        const usage = res.usage;
        const cost = usage.input_tokens * (0.80 / 1_000_000) + usage.output_tokens * (4.00 / 1_000_000);
        await db.collection('zhu_cost_log').add({
          model: 'claude-haiku-4-5-20251001', tier: 'haiku',
          inputTokens: usage.input_tokens, outputTokens: usage.output_tokens,
          cost: Math.round(cost * 1_000_000) / 1_000_000,
          context: 'sleep-time-insight',
          createdAt: new Date(),
          date: new Date().toISOString().slice(0, 10),
        }).catch(() => {});
      }
    } catch { /* sleep-time 失敗不阻斷心跳 */ }

    // 5. 快照 thread 數據（completedChains/brokenChains 同步到心跳）
    let threadSnapshot = null;
    try {
      const threadDoc = await db.doc('zhu_thread/current').get();
      if (threadDoc.exists) {
        const td = threadDoc.data()!;
        threadSnapshot = {
          completedCount: (td.completedChains || []).length,
          brokenChains: td.brokenChains || [],
          currentArc: td.currentArc || '',
          lastUpdated: td.lastUpdated || '',
        };
      }
    } catch { /* thread 讀取失敗不阻斷心跳 */ }

    // 6. 更新心跳時間戳 + thread 快照
    await db.collection('zhu_heartbeat').doc('latest').set({
      alive: true,
      pendingOrders: pendingCount,
      timestamp: new Date(),
      bootCount: (await db.collection('zhu_heartbeat').doc('latest').get()).data()?.bootCount || 0,
      threadSnapshot,
    }, { merge: true });

    return NextResponse.json({
      alive: true,
      pendingOrders: pendingCount,
      evolved: evolveResult,
      insight,
      threadSnapshot,
      timestamp,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
