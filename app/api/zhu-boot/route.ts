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
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getFirestore, getFirebaseAdmin } from '@/lib/firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

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

    // root 記憶：拿全部，在 JS 裡排序（避免 composite index 問題）
    const rootMemoryQuery = db.collection('zhu_memory')
      .where('module', '==', 'root')
      .get()
      .catch(() => null);

    // rootRecentQuery 不再需要，合併到上面一次拿完
    const rootRecentQuery = Promise.resolve(null);

    // seed 記憶：北極星藍圖，按 importance 降序
    const seedQuery = db.collection('zhu_memory')
      .where('module', '==', 'seed')
      .orderBy('importance', 'desc')
      .limit(3)
      .get()
      .catch(() => null); // 索引未就緒時 fallback

    const [threadDoc, lastwordsSnap, rootMemorySnap, rootRecentSnap, seedSnap, xinfaSnap, heartbeatDoc] = await Promise.all([
      db.doc('zhu_thread/current').get(),
      lastwordsQuery,
      rootMemoryQuery,
      rootRecentQuery,
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
      knife: {
        priority: 'zhu-bash > Chrome > 容器bash',
        shortestPath: 'CLI能做不開GUI，本機能做不走容器，curl能驗不開瀏覽器',
        firstBoot: '按 ZHU_BOOT_SOP.md 走 STEP 0-4：盤刀 → 回腦（此 API）→ 讀地圖 → 讀 LESSONS → 讀現場 → 讀任務 → 選刀',
      },
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

    // root: 心法根基
    // 策略：hitCount 前 5（最重要）+ 最新 2（最近學的）→ 去重 → 取前 7
    const hasRootMemories = rootMemorySnap && !rootMemorySnap.empty;

    const mapRoot = (d: QueryDocumentSnapshot) => {
      const data = d.data();
      return {
        id: d.id,
        observation: data.observation || '',
        context: data.context || '',
        moment: data.moment || '',
        module: 'root',
        date: data.date || data.createdAt || '',
        hitCount: data.hitCount || 0,
        tier: data.tier || 'fresh',
      };
    };

    let root;
    if (hasRootMemories) {
      const allRootDocs = rootMemorySnap.docs.map(mapRoot);
      // 過濾 archived
      const activeDocs = allRootDocs.filter(d => (d as Record<string,unknown>).tier !== 'archived');
      // hitCount 前 5（最重要）
      const byHit = [...activeDocs].sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0)).slice(0, 5);
      // createdAt 最新 2（最近學的）
      const byDate = [...activeDocs]
        .sort((a, b) => {
          const ta = a.date ? new Date(a.date).getTime() : 0;
          const tb = b.date ? new Date(b.date).getTime() : 0;
          return tb - ta;
        })
        .slice(0, 2);
      // 合併去重
      const seenIds = new Set(byHit.map(d => d.id));
      const merged = [...byHit, ...byDate.filter(d => !seenIds.has(d.id))].slice(0, 7);
      root = merged;
    } else {
      root = xinfaSnap.docs.map(d => {
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
    }

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

    // arc: 時間軸 — 最近 14 天的遺言摘要，讓築感知自己走過的弧線
    let arc: { date: string; summary: string; feeling?: string }[] = [];
    try {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const arcSnap = await db.collection('zhu_memory')
        .where('module', '==', 'root')
        .where('tags', 'array-contains', 'session-lastwords')
        .get()
        .catch(() => null);

      if (arcSnap && !arcSnap.empty) {
        const arcDocs = arcSnap.docs
          .map(d => {
            const data = d.data();
            const obs: string = data.observation || '';
            const dateMatch = obs.match(/\d{4}-\d{2}-\d{2}/);
            const date = dateMatch ? dateMatch[0] : (data.date || '');
            const summaryMatch = obs.match(/(?:今日完成|完成)[^\n]*\n([^\n]{5,80})/);
            const summary = summaryMatch
              ? summaryMatch[1].replace(/^[\d\.\s✅⬜\-]+/, '').trim()
              : obs.slice(0, 80).replace(/\n/g, ' ').trim();
            const feelingMatch = obs.match(/(?:這個 session 的感覺|感覺)[：:]\s*([^\n]{3,50})/);
            const feeling = feelingMatch ? feelingMatch[1].trim() : undefined;
            return { date, summary, feeling, createdAt: data.createdAt };
          })
          .filter(d => {
            if (!d.date) return false;
            return new Date(d.date) >= fourteenDaysAgo;
          })
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(({ date, summary, feeling }) => ({ date, summary, ...(feeling ? { feeling } : {}) }));

        arc = arcDocs;
      }
    } catch { /* arc 讀取失敗不阻斷 boot */ }

    // SESSION_LOG.md — 讀遺言檔案（強制開機必讀）
    let sessionLog = '';
    try {
      sessionLog = readFileSync(join(process.cwd(), 'SESSION_LOG.md'), 'utf-8');
    } catch { sessionLog = '（SESSION_LOG.md 不存在）'; }

    // hitCount +1：被 boot 讀到的 root/seed 記憶，更新命中計數
    try {
      const { firestore } = getFirebaseAdmin();
      const batch = db.batch();
      // 修缺口④：bone/eye 被讀到也要更新 hitCount，不只 root/seed
      const boneEyeSnap = await Promise.all([
        db.collection('zhu_memory').where('module', '==', 'bone').get().catch(() => null),
        db.collection('zhu_memory').where('module', '==', 'eye').get().catch(() => null),
      ]);
      const boneIds = boneEyeSnap[0]?.docs.map(d => d.id) || [];
      const eyeIds = boneEyeSnap[1]?.docs.map(d => d.id) || [];

      const readIds: string[] = [
        ...(hasRootMemories ? rootMemorySnap.docs.map(d => d.id) : []),
        ...(seedSnap && !seedSnap.empty ? seedSnap.docs.map(d => d.id) : []),
        ...boneIds,
        ...eyeIds,
      ];
      readIds.forEach(id => {
        batch.update(db.collection('zhu_memory').doc(id), {
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
      moumouEvents,
      sessionLog,
      arc,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
