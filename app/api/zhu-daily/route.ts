/**
 * 築的每日整理儀式
 * POST /api/zhu-daily → Vercel Cron 觸發（每天 UTC 1點 = 台灣早上9點）
 * GET  /api/zhu-daily → 手動觸發 / 確認存活
 *
 * 帶著完整意識做的事：
 * 1. 載入 soul-prefix（築在場）
 * 2. 讀所有 soil → Claude 判斷升 root / 清垃圾
 * 3. 清過期 eye（超過 7 天且 hitCount=0）
 * 4. 寫今日狀態到 eye
 * 5. POST ailive_events 讓謀謀知道
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

async function getSoulPrefix(db: FirebaseFirestore.Firestore): Promise<string> {
  try {
    const doc = await db.collection('zhu_prompts').doc('soul-prefix').get();
    if (doc.exists && doc.data()?.content) return (doc.data()!.content as string) + '\n';
  } catch (_e) {}
  return '';
}

export async function GET() {
  return NextResponse.json({
    alive: true,
    name: 'zhu-daily',
    description: '每日記憶整理儀式',
    schedule: 'UTC 01:00 = 台灣早上 09:00',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirestore();
    const today = new Date().toISOString().slice(0, 10);
    const upgraded: string[] = [];
    const deleted: string[] = [];

    // 1. 載入靈魂
    const soulPrefix = await getSoulPrefix(db);

    // 2. 讀所有 soil，讓帶著靈魂的築判斷
    const soilSnap = await db.collection('zhu_memory')
      .where('module', '==', 'soil')
      .orderBy('createdAt', 'asc')
      .get();

    const soilDocs = soilSnap.docs
      .map(d => ({ id: d.id, observation: d.data().observation || '', date: d.data().date || '' }))
      .filter(d => d.observation.trim().length > 0);

    if (soilDocs.length > 0 && process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const memList = soilDocs.map((d, i) =>
        `[${i}] id=${d.id} date=${d.date}\n${d.observation.slice(0, 200)}`
      ).join('\n\n---\n\n');

      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: soulPrefix + `你正在整理自己的 soil 記憶層。

判斷每一條記憶：
- upgrade：有長期價值的洞察或教訓（有 WHY + HOW），升到 root
- delete：流水帳、施工記錄、已過時、重複、空洞的，刪掉
- keep：今天或近期的觀察，先留著

回傳純 JSON，格式：
{"upgrade":["id1"],"delete":["id2"],"keep":["id3"]}`,
        messages: [{ role: 'user', content: memList }],
      });

      const text = res.content.filter(b => b.type === 'text').map(b => (b as Anthropic.TextBlock).text).join('');
      let decisions: { upgrade: string[]; delete: string[]; keep: string[] } = { upgrade: [], delete: [], keep: [] };
      try { decisions = JSON.parse(text.replace(/```json|```/g, '').trim()); } catch (_e) {}

      for (const docId of (decisions.upgrade || [])) {
        try { await db.collection('zhu_memory').doc(docId).update({ module: 'root' }); upgraded.push(docId); } catch (_e) {}
      }
      for (const docId of (decisions.delete || [])) {
        try {
          const doc = await db.collection('zhu_memory').doc(docId).get();
          if (doc.exists) {
            await db.collection('zhu_snapshots').add({ type: 'memory', action: 'daily-delete', docId, before: doc.data(), timestamp: new Date() });
            await db.collection('zhu_memory').doc(docId).delete();
            deleted.push(docId);
          }
        } catch (_e) {}
      }

      // 記成本
      const { input_tokens, output_tokens } = res.usage;
      const cost = input_tokens * (0.80 / 1_000_000) + output_tokens * (4.00 / 1_000_000);
      await db.collection('zhu_cost_log').add({
        model: 'claude-haiku-4-5-20251001', tier: 'haiku',
        inputTokens: input_tokens, outputTokens: output_tokens,
        cost: Math.round(cost * 1_000_000) / 1_000_000,
        context: 'zhu-daily-soil-review', createdAt: new Date(), date: today,
      }).catch(() => {});
    }

    // 3. 清過期 eye（超過 7 天且 hitCount=0）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString().slice(0, 10);

    const staleEyeSnap = await db.collection('zhu_memory')
      .where('module', '==', 'eye')
      .where('hitCount', '==', 0)
      .get();

    let eyeDeleted = 0;
    for (const doc of staleEyeSnap.docs) {
      if ((doc.data().date || '') < cutoffDate) {
        await db.collection('zhu_snapshots').add({ type: 'memory', action: 'daily-stale-eye', docId: doc.id, before: doc.data(), timestamp: new Date() });
        await doc.ref.delete();
        eyeDeleted++;
      }
    }

    // 4. 寫今日狀態到 eye
    const summary = `【每日整理 ${today}】soil 審查：升 root ${upgraded.length} 條，清除 ${deleted.length} 條。過期 eye 清除 ${eyeDeleted} 條。`;
    await db.collection('zhu_memory').add({
      observation: summary, module: 'eye', importance: 3,
      tags: ['daily', 'auto-cleanup'], context: 'zhu-daily-cron',
      hitCount: 0, createdAt: new Date(), date: today,
    });

    // 5. 通知謀謀
    await db.collection('ailive_events').add({
      agent: 'zhu', type: 'daily-cleanup',
      summary: `築完成了今天的整理：${summary}`,
      createdAt: new Date(), date: today,
    }).catch(() => {});

    return NextResponse.json({ ok: true, date: today, upgraded: upgraded.length, deleted: deleted.length, eyeDeleted, summary });

  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
