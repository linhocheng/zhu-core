/**
 * 築的大圖景（zhu_thread）
 * GET /api/zhu-thread → 讀取築的當前大圖景
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function GET() {
  try {
    const db = getFirestore();
    const doc = await db.doc('zhu_thread/current').get();
    return NextResponse.json({
      thread: doc.exists ? doc.data() : null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
