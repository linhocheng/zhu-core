/**
 * 築的大圖景（zhu_thread）
 * GET   /api/zhu-thread → 讀取築的當前大圖景
 * PATCH /api/zhu-thread → 更新大圖景欄位（merge，不覆蓋整個 doc）
 */
import { NextRequest, NextResponse } from 'next/server';
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
    }

    const db = getFirestore();
    
    // merge 更新，不覆蓋整個 doc
    await db.doc('zhu_thread/current').set({
      ...body,
      updatedAt: new Date(),
      lastUpdated: new Date().toISOString().slice(0, 10),
    }, { merge: true });

    return NextResponse.json({ ok: true, updated: Object.keys(body) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
