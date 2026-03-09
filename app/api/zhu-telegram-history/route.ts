/**
 * 築的 Telegram 對話歷史 API
 * GET /api/zhu-telegram-history?chatId=xxx&limit=20
 * 
 * 回傳最近的對話歷史（時間正序）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    if (!chatId) {
      return NextResponse.json({ error: 'chatId required' }, { status: 400 });
    }

    const db = getFirestore();
    const snap = await db.collection('zhu_telegram_history')
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const messages = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        role: data.role,
        content: data.content,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      };
    }).reverse(); // 正序

    return NextResponse.json({
      chatId,
      count: messages.length,
      messages,
    });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
