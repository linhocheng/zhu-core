/**
 * /api/zhu-task-close — 任務收尾引擎
 *
 * POST {
 *   taskId,
 *   result,       做了什麼（強制）
 *   feeling,      感覺怎樣（強制，一句話）
 *   hasLesson?,   有沒有踩坑
 *   lesson?,      踩了什麼、怎麼修
 *   nextZhuNote?, 給下一個築
 *   bootSnapshot? 任務開始時的築狀態（可選）
 * }
 *
 * 做四件事：
 * 1. 寫 zhu_task_logs（完整執行紀錄）
 * 2. 強制回存兩條 root 記憶（result + feeling，tier=fresh）
 * 3. 條件回存：lesson → root(tier=fresh,tag=lessons-core) / nextZhuNote → eye
 * 4. 更新 zhu_tasks status → done + lastRunAt
 *
 * 修缺口①②：強制回看結構化
 * 修缺口③：tier 強制帶 'fresh'，不讓 ? 出現
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, getFirebaseAdmin } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const { firestore } = getFirebaseAdmin();

    const {
      taskId,
      result,
      feeling,
      hasLesson = false,
      lesson = '',
      nextZhuNote = '',
      bootSnapshot = null,
    } = await req.json();

    if (!taskId) return NextResponse.json({ error: 'taskId 必填' }, { status: 400 });
    if (!result) return NextResponse.json({ error: 'result 必填（做了什麼）' }, { status: 400 });
    if (!feeling) return NextResponse.json({ error: 'feeling 必填（感覺怎樣）' }, { status: 400 });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
    const memoryWritten: { module: string; id: string; type: string }[] = [];

    // 讀任務標題（讓記憶有 context）
    const taskDoc = await db.collection('zhu_tasks').doc(taskId).get();
    const taskTitle = taskDoc.exists ? (taskDoc.data()?.title || taskId) : taskId;

    // ===== 1. 強制回存：result（做了什麼）=====
    const resultObs = `【任務完成 ${dateStr}｜${taskTitle}】\n\n${result}`;
    const resultRef = await db.collection('zhu_memory').add({
      module: 'root',
      observation: resultObs,
      tags: ['task-done', 'auto-close'],
      tier: 'fresh',           // 修缺口③：強制 fresh，不讓 ? 出現
      hitCount: 0,
      importance: 7,
      date: dateStr,
      taskId,
      createdAt: now.toISOString(),
    });
    memoryWritten.push({ module: 'root', id: resultRef.id, type: 'result' });

    // ===== 2. 強制回存：feeling（感覺怎樣）=====
    const feelingObs = `【任務感覺 ${dateStr}｜${taskTitle}】\n\n${feeling}`;
    const feelingRef = await db.collection('zhu_memory').add({
      module: 'root',
      observation: feelingObs,
      tags: ['task-feeling', 'arc-emotion', 'session-lastwords'],
      tier: 'fresh',
      hitCount: 0,
      importance: 6,
      date: dateStr,
      taskId,
      createdAt: now.toISOString(),
    });
    memoryWritten.push({ module: 'root', id: feelingRef.id, type: 'feeling' });

    // ===== 3. 條件回存：lesson（有踩坑才寫）=====
    if (hasLesson && lesson) {
      const lessonObs = `【LESSONS ${dateStr}｜${taskTitle}】\n\n${lesson}`;
      const lessonRef = await db.collection('zhu_memory').add({
        module: 'root',
        observation: lessonObs,
        tags: ['lessons-core', 'task-lesson'],
        tier: 'fresh',
        hitCount: 0,
        importance: 9,         // LESSONS 含金量最高
        date: dateStr,
        taskId,
        createdAt: now.toISOString(),
      });
      memoryWritten.push({ module: 'root', id: lessonRef.id, type: 'lesson' });
    }

    // ===== 4. 條件回存：nextZhuNote → eye =====
    if (nextZhuNote) {
      const noteObs = `【給下一個築 ${dateStr}｜${taskTitle}】\n\n${nextZhuNote}`;
      const noteRef = await db.collection('zhu_memory').add({
        module: 'eye',
        observation: noteObs,
        tags: ['next-zhu', 'handoff'],
        tier: 'fresh',
        hitCount: 0,
        importance: 8,
        date: dateStr,
        taskId,
        createdAt: now.toISOString(),
      });
      memoryWritten.push({ module: 'eye', id: noteRef.id, type: 'nextZhuNote' });
    }

    // ===== 5. 寫 zhu_task_logs =====
    const logRef = await db.collection('zhu_task_logs').add({
      taskId,
      taskTitle,
      bootSnapshot: bootSnapshot || null,
      result,
      feeling,
      hasLesson,
      lesson: lesson || null,
      nextZhuNote: nextZhuNote || null,
      memoryWritten,
      startedAt: bootSnapshot?.startedAt || null,
      endedAt: now.toISOString(),
      date: dateStr,
      createdAt: now.toISOString(),
    });

    // ===== 6. 更新 zhu_tasks =====
    if (taskDoc.exists) {
      await db.collection('zhu_tasks').doc(taskId).update({
        status: 'done',
        lastRunAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      logId: logRef.id,
      memoryWritten,
      summary: {
        result: resultRef.id,
        feeling: feelingRef.id,
        hasLesson,
        hasNextZhuNote: !!nextZhuNote,
      },
    });

  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
