/**
 * 解的開機 API
 * GET /api/jie-boot → 一次回傳解開機需要的所有東西
 *
 * 回傳結構：
 * - bone: 身份、使命、天條（from jie_memories module=bone）
 * - eye:  當前追蹤狀態（from jie_memories module=eye）
 * - root: 最近心法（from jie_memories module=root）
 * - seed: 北極星（from jie_memories module=seed）
 * - heartbeat: 寫入心跳，回傳 bootCount（from jie_heartbeat）
 */
import { NextResponse } from 'next/server';
import { getFirestore, getFirebaseAdmin } from '@/lib/firebase-admin';

const COLLECTION = 'jie_memories';

export const maxDuration = 30;

export async function GET() {
  try {
    const db = getFirestore();

    // 並行讀取各模塊記憶
    const [boneSnap, eyeSnap, rootSnap, seedSnap, heartbeatDoc] = await Promise.all([
      db.collection(COLLECTION).where('module', '==', 'bone')
        .get().catch(() => null),
      db.collection(COLLECTION).where('module', '==', 'eye')
        .orderBy('createdAt', 'desc').limit(5).get().catch(() => null),
      db.collection(COLLECTION).where('module', '==', 'root')
        .get().catch(() => null),
      db.collection(COLLECTION).where('module', '==', 'seed')
        .get().catch(() => null),
      db.doc('jie_heartbeat/latest').get(),
    ]);

    const stripEmb = (data: Record<string, unknown>) => {
      const { embedding: _e, ...rest } = data;
      return rest;
    };

    // bone: 解的身份核心（JS 排序，不依賴 composite index）
    const bone = (boneSnap && !boneSnap.empty)
      ? boneSnap.docs
          .map(d => stripEmb({ id: d.id, ...d.data() }))
          .sort((a, b) => ((b.importance as number) || 0) - ((a.importance as number) || 0))
          .slice(0, 5)
      : [];

    // eye: 當前追蹤
    const eye = (eyeSnap && !eyeSnap.empty)
      ? eyeSnap.docs.map(d => stripEmb({ id: d.id, ...d.data() }))
      : [];

    // root: 心法（hitCount 前 5 + 最新 2，去重）
    let root: Record<string, unknown>[] = [];
    if (rootSnap && !rootSnap.empty) {
      const allRoot = rootSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
      const active = allRoot.filter(d => d.tier !== 'archived');
      const byHit = [...active].sort((a, b) => ((b.hitCount as number) || 0) - ((a.hitCount as number) || 0)).slice(0, 5);
      const byDate = [...active].sort((a, b) => {
        const ta = a.date ? new Date(a.date as string).getTime() : 0;
        const tb = b.date ? new Date(b.date as string).getTime() : 0;
        return tb - ta;
      }).slice(0, 2);
      const seenIds = new Set(byHit.map(d => d.id));
      root = [...byHit, ...byDate.filter(d => !seenIds.has(d.id))].slice(0, 7).map(d => stripEmb(d));
    }

    // seed: 北極星（JS 排序）
    const seed = (seedSnap && !seedSnap.empty)
      ? seedSnap.docs
          .map(d => stripEmb({ id: d.id, ...d.data() }))
          .sort((a, b) => ((b.importance as number) || 0) - ((a.importance as number) || 0))
          .slice(0, 3)
      : [];

    // heartbeat: 打卡
    const currentCount = heartbeatDoc.exists ? (heartbeatDoc.data()?.bootCount || 0) : 0;
    const newCount = currentCount + 1;
    await db.doc('jie_heartbeat/latest').set({
      bootedAt: new Date(),
      date: new Date().toISOString().slice(0, 10),
      sessionId: `jie-boot-${Date.now()}`,
      bootCount: newCount,
    });

    // hitCount +1：被 boot 讀到的記憶
    try {
      const { firestore } = getFirebaseAdmin();
      const batch = db.batch();
      const readDocs = [
        ...(boneSnap?.docs || []),
        ...(eyeSnap?.docs || []),
        ...(rootSnap?.docs || []),
        ...(seedSnap?.docs || []),
      ];
      readDocs.forEach(d => {
        batch.update(db.collection(COLLECTION).doc(d.id), {
          hitCount: firestore.FieldValue.increment(1),
          lastHitAt: new Date(),
        });
      });
      await batch.commit();
    } catch { /* hitCount 更新失敗不阻斷 boot */ }

    return NextResponse.json({
      bone,
      eye,
      root,
      seed,
      heartbeat: {
        bootCount: newCount,
        bootedAt: new Date().toISOString(),
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
