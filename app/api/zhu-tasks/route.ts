/**
 * /api/zhu-tasks — 築與 Adam 的共用任務排程表
 *
 * GET  ?status=pending        → 任務列表
 * POST { title, type, ... }  → 建立任務
 * PATCH { id, ...fields }    → 更新任務
 *
 * type: dev / review / distill / heartbeat / custom
 * status: pending / doing / done / blocked / waiting_adam
 * executor: zhu_auto / needs_adam
 * trigger: scheduled / manual / condition
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const status = req.nextUrl.searchParams.get('status');
    const executor = req.nextUrl.searchParams.get('executor');

    // orderBy + where 需要 compound index，改為 JS 過濾（SYSTEM_MAP 坑 #9）
    const snap = await db.collection('zhu_tasks').get();
    let tasks = snap.docs.map(d => ({ id: d.id, ...d.data() as Record<string, unknown> }));

    if (status) tasks = tasks.filter(t => t.status === status);
    if (executor) tasks = tasks.filter(t => t.executor === executor);

    tasks.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    tasks = tasks.slice(0, 50);

    return NextResponse.json({ tasks, total: tasks.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();
    const {
      title,
      type = 'custom',
      status = 'pending',
      executor = 'zhu_auto',
      trigger = 'manual',
      triggerHour,
      priority = 'normal',
      context = '',
      createdBy = 'adam',
    } = body;

    if (!title) return NextResponse.json({ error: 'title 必填' }, { status: 400 });

    const ref = await db.collection('zhu_tasks').add({
      title,
      type,
      status,
      executor,
      trigger,
      triggerHour: triggerHour ?? null,
      triggerMinute: body.triggerMinute ?? 0,
      priority,
      context,
      createdBy,
      lastRunAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getFirestore();
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ error: 'id 必填' }, { status: 400 });

    const allowed = ['title', 'status', 'executor', 'trigger', 'triggerHour',
      'priority', 'context', 'lastRunAt'];
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    await db.collection('zhu_tasks').doc(id).update(updates);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
