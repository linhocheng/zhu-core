/**
 * 築的記憶進化引擎（evolve-time）
 * POST /api/zhu-evolve → 根據 hitCount 自動升降級記憶
 *
 * 升級規則：
 * - soil hitCount >= 3 → 升 eye
 * - eye  hitCount >= 5 → 升 root
 *
 * 降級規則：
 * - root lastHitAt 超過 90 天（或無 hitCount）→ 降 archived
 *
 * 不動的：
 * - bone（身份記憶，不可動搖）
 * - seed（意圖記憶，只有 Adam 能改）
 *
 * 安全邊界：
 * - 不刪除任何記憶，只改 module 欄位
 * - 降級是標記 archived: true，不是刪除
 * - batch 操作，原子性
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function POST() {
  try {
    const db = getFirestore();
    const now = Date.now();
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    const promoted: { id: string; from: string; to: string; hitCount: number }[] = [];
    const demoted: { id: string; module: string; reason: string }[] = [];

    // === 升級：soil → eye（hitCount >= 3）===
    const soilSnap = await db.collection('zhu_memory')
      .where('module', '==', 'soil')
      .get();

    const soilToPromote = soilSnap.docs.filter(d => {
      const data = d.data();
      return (data.hitCount || 0) >= 3 && !data.archived;
    });

    // === 升級：eye → root（hitCount >= 5）===
    const eyeSnap = await db.collection('zhu_memory')
      .where('module', '==', 'eye')
      .get();

    const eyeToPromote = eyeSnap.docs.filter(d => {
      const data = d.data();
      return (data.hitCount || 0) >= 5 && !data.archived;
    });

    // === 降級：root 超過 90 天沒被命中 → archived ===
    const rootSnap = await db.collection('zhu_memory')
      .where('module', '==', 'root')
      .get();

    const rootToDemote = rootSnap.docs.filter(d => {
      const data = d.data();
      if (data.archived) return false;
      const lastHit = data.lastHitAt?._seconds
        ? data.lastHitAt._seconds * 1000
        : data.lastHitAt instanceof Date
          ? data.lastHitAt.getTime()
          : 0;
      // 從沒被命中過，且建立超過 90 天
      if (!data.hitCount && data.createdAt) {
        const created = data.createdAt._seconds
          ? data.createdAt._seconds * 1000
          : 0;
        return (now - created) > NINETY_DAYS_MS;
      }
      // 有 hitCount 但超過 90 天沒被命中
      if (lastHit > 0) {
        return (now - lastHit) > NINETY_DAYS_MS;
      }
      return false;
    });

    // === 執行 batch ===
    const batch = db.batch();

    for (const doc of soilToPromote) {
      batch.update(doc.ref, { module: 'eye' });
      promoted.push({
        id: doc.id,
        from: 'soil',
        to: 'eye',
        hitCount: doc.data().hitCount || 0,
      });
    }

    for (const doc of eyeToPromote) {
      batch.update(doc.ref, { module: 'root' });
      promoted.push({
        id: doc.id,
        from: 'eye',
        to: 'root',
        hitCount: doc.data().hitCount || 0,
      });
    }

    for (const doc of rootToDemote) {
      batch.update(doc.ref, { archived: true });
      demoted.push({
        id: doc.id,
        module: 'root',
        reason: 'lastHitAt > 90 days or never hit',
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      evolved: {
        promoted: promoted.length,
        demoted: demoted.length,
        details: { promoted, demoted },
      },
      scanned: {
        soil: soilSnap.size,
        eye: eyeSnap.size,
        root: rootSnap.size,
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
