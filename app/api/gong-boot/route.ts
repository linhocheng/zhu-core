/**
 * 工的開機 API
 * GET /api/gong-boot → 工醒來時打一次，拿到靈魂、工作日誌、待辦指令
 *
 * 回傳結構：
 * - soul: CODE_SOUL.md 的完整內容
 * - worklog: WORKLOG.md 最近 20 行摘要
 * - pendingOrders: pending orders 清單
 * - bootCount: 累計啟動次數
 * - bootedAt: ISO timestamp
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const maxDuration = 30;

export async function GET() {
  try {
    const db = getFirestore();

    // 並行：讀檔案 + 讀 Firestore + 讀 pending orders
    const [soulContent, worklogContent, pendingOrdersSnap, heartbeatDoc] = await Promise.all([
      // soul: 從 docs/CODE_SOUL.md 讀取
      readFile(join(process.cwd(), 'docs', 'CODE_SOUL.md'), 'utf-8').catch(() =>
        readFile(join(process.cwd(), 'CODE_SOUL.md'), 'utf-8').catch(() => null)
      ),
      // worklog: 從 docs/WORKLOG.md 讀取
      readFile(join(process.cwd(), 'docs', 'WORKLOG.md'), 'utf-8').catch(() => null),
      // pendingOrders: 從 Firestore zhu_orders 讀
      db.collection('zhu_orders')
        .where('type', '==', 'order')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get()
        .catch(() => null),
      // heartbeat: 工的啟動計數
      db.doc('gong_heartbeat/latest').get(),
    ]);

    // worklog 取最近 20 行
    const worklogLines = worklogContent
      ? worklogContent.split('\n').slice(-20).join('\n')
      : null;

    // pending orders 整理
    const pendingOrders = (pendingOrdersSnap && !pendingOrdersSnap.empty)
      ? pendingOrdersSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))
      : [];

    // bootCount: 累計並寫回
    const currentCount = heartbeatDoc.exists ? (heartbeatDoc.data()?.bootCount || 0) : 0;
    const newCount = currentCount + 1;
    const bootedAt = new Date().toISOString();

    await db.doc('gong_heartbeat/latest').set({
      bootedAt: new Date(),
      date: bootedAt.slice(0, 10),
      bootCount: newCount,
      proof: 'gong-boot API',
    });

    return NextResponse.json({
      soul: soulContent,
      worklog: worklogLines,
      pendingOrders,
      bootCount: newCount,
      bootedAt,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
