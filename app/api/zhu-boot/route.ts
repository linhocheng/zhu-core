/**
 * 築的開機 API（ZHU-CORE 獨有）
 * GET /api/zhu-boot → 一次回傳築開機需要的所有東西
 *
 * 回傳結構：
 * - bone: 身份、使命、天條（from zhu_thread）
 * - eye:  currentArc、brokenChains + 最新 session-lastwords（from zhu_thread + zhu_memory）
 * - root: 最近 5 條心法（from zhu_memory module=root，fallback zhu_xinfa）
 * - seed:      北極星藍圖（from zhu_memory module=seed，最新 3 條按 importance 降序）
 * - heartbeat: 寫入心跳，回傳 bootCount（from zhu_heartbeat）
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

export async function GET() {
  try {
    const db = getFirestore();

    // 並行讀取四個 collection（lastwords 用 fallback 避免索引未就緒時整個 boot 掛掉）
    const lastwordsQuery = db.collection('zhu_memory')
      .where('tags', 'array-contains', 'session-lastwords')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
      .catch(() => null); // 索引未就緒時 fallback

    // root 記憶：優先從 zhu_memory module=root 讀，fallback 到 zhu_xinfa
    const rootMemoryQuery = db.collection('zhu_memory')
      .where('module', '==', 'root')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .catch(() => null); // 索引未就緒時 fallback

    // seed 記憶：北極星藍圖，按 importance 降序
    const seedQuery = db.collection('zhu_memory')
      .where('module', '==', 'seed')
      .orderBy('importance', 'desc')
      .limit(3)
      .get()
      .catch(() => null); // 索引未就緒時 fallback

    const [threadDoc, lastwordsSnap, rootMemorySnap, seedSnap, xinfaSnap, heartbeatDoc] = await Promise.all([
      db.doc('zhu_thread/current').get(),
      lastwordsQuery,
      rootMemoryQuery,
      seedQuery,
      db.collection('zhu_xinfa')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get(),
      db.doc('zhu_heartbeat/latest').get(),
    ]);

    // bone: 身份骨架
    const thread = threadDoc.exists ? threadDoc.data() : null;
    const bone = thread ? {
      identity: thread.identity || null,
      mission: thread.mission || null,
      principles: thread.principles || null,
    } : null;

    // eye: 視野 — 當前弧線 + 斷鏈 + 上次遺言
    const lastwords = (!lastwordsSnap || lastwordsSnap.empty) ? null : {
      id: lastwordsSnap.docs[0].id,
      ...lastwordsSnap.docs[0].data(),
    };
    // 移除 embedding 和 tags，開機不需要
    if (lastwords) {
      delete (lastwords as Record<string, unknown>).embedding;
      delete (lastwords as Record<string, unknown>).tags;
    }
    const eye = {
      currentArc: thread?.currentArc || null,
      brokenChains: thread?.brokenChains || [],
      lastSessionWords: lastwords,
    };

    // root: 心法根基（優先 module=root 記憶，沒有就 fallback xinfa）
    const hasRootMemories = rootMemorySnap && !rootMemorySnap.empty;
    const root = hasRootMemories
      ? rootMemorySnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            observation: data.observation || '',
            context: data.context || '',
            moment: data.moment || '',
            module: 'root',
            date: data.date || '',
          };
        })
      : xinfaSnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || '',
            principle: data.principle || '',
            application: data.application || '',
            date: data.date || '',
            _source: 'xinfa-fallback',
          };
        });

    // seed: 北極星藍圖
    const seed = (seedSnap && !seedSnap.empty)
      ? seedSnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            observation: data.observation || data.content || '',
            importance: data.importance || 0,
            tags: data.tags || [],
          };
        })
      : [];

    // ailive_events: 讀謀謀最近的事件（inter-agent 感知）
    let moumouEvents: { type: string; summary: string; date: string }[] = [];
    try {
      const evSnap = await db.collection('ailive_events')
        .where('agent', '==', 'moumou')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      moumouEvents = evSnap.docs.map(d => ({
        type: d.data().type,
        summary: d.data().summary,
        date: d.data().date || '',
      }));
    } catch { /* 索引可能還沒建 */ }

    // heartbeat: 打卡 + 回傳 bootCount
    const currentCount = heartbeatDoc.exists ? (heartbeatDoc.data()?.bootCount || 0) : 0;
    const newCount = currentCount + 1;
    await db.doc('zhu_heartbeat/latest').set({
      bootedAt: new Date(),
      date: new Date().toISOString().slice(0, 10),
      sessionId: `zhu-boot-${Date.now()}`,
      proof: 'ZHU-CORE boot API',
      bootCount: newCount,
    });

    return NextResponse.json({
      bone,
      eye,
      root,
      seed,
      heartbeat: {
        bootCount: newCount,
        bootedAt: new Date().toISOString(),
      },
      moumouEvents,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
