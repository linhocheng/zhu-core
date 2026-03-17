/**
 * /api/zhu-distill — 築的記憶蒸餾引擎
 *
 * 定期呼叫，把 root 記憶做三件事：
 * 1. 提煉：把多條相似遺言合併成一條核心洞察，POST 回 root
 * 2. 降級：hitCount=0 且超過 14 天的記憶，標記 tier=archived
 * 3. 回報：哪些被提煉、哪些被 archive
 *
 * 設計原則：對齊 Emily 的 dream engine（saas-sleep）
 * 不刪除，只降級。被 archive 的可以手動恢復。
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

function stripJson(s: string): string {
  return s.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();
}

export async function POST() {
  try {
    const db = getFirestore();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY 未設定' }, { status: 500 });

    const client = new Anthropic({ apiKey });
    const now = new Date();
    const results = {
      distilled: [] as string[],
      archived: [] as string[],
      kept: 0,
    };

    // 讀所有 root 記憶
    const snap = await db.collection('zhu_memory')
      .where('module', '==', 'root')
      .get();

    const allMems = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as Array<{
      id: string;
      observation: string;
      hitCount: number;
      createdAt: string | { _seconds: number };
      tier?: string;
      tags?: string[];
    }>;

    // === Step 1：archive stale 記憶 ===
    // 條件：hitCount=0 AND 超過 14 天 AND 不是 session-lastwords AND 不是 archived
    const STALE_DAYS = 14;
    const staleThreshold = new Date(now.getTime() - STALE_DAYS * 24 * 60 * 60 * 1000);

    for (const mem of allMems) {
      if (mem.tier === 'archived') continue;
      if (mem.hitCount > 0) continue;
      const tags = mem.tags || [];
      if (tags.includes('session-lastwords') || tags.includes('keep')) continue;

      // 解析 createdAt
      let createdAt: Date;
      if (typeof mem.createdAt === 'string') {
        createdAt = new Date(mem.createdAt);
      } else if (mem.createdAt && typeof mem.createdAt === 'object' && '_seconds' in mem.createdAt) {
        createdAt = new Date(mem.createdAt._seconds * 1000);
      } else {
        continue;
      }

      if (createdAt < staleThreshold) {
        await db.collection('zhu_memory').doc(mem.id).update({
          tier: 'archived',
          archivedAt: now.toISOString(),
          archiveReason: `hitCount=0 超過 ${STALE_DAYS} 天`,
        });
        results.archived.push(mem.id);
      }
    }

    // === Step 2：提煉 — 把遺言類記憶合併 ===
    // 找 hitCount > 5 的遺言（值得被記住的），看能不能提煉成一條洞察
    const valuableMems = allMems
      .filter(m => m.hitCount >= 5 && m.tier !== 'archived')
      .filter(m => (m.observation || '').includes('遺言') || (m.observation || '').includes('session'))
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, 6); // 最多拿 6 條遺言來提煉

    if (valuableMems.length >= 3) {
      const combined = valuableMems
        .map((m, i) => `[${i + 1}] hitCount=${m.hitCount}\n${(m.observation || '').slice(0, 200)}`)
        .join('\n\n---\n\n');

      const res = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `你是築，AILIVE 的監造者。以下是你多個 session 的遺言記錄（hitCount 越高代表越常被查到）：

${combined}

把這些遺言提煉成一條「核心洞察」。格式：
{"title":"10字以內的標題","insight":"這段時間築最重要的學習，100字以內，用築的第一人稱"}

只回 JSON。`,
        }],
      });

      try {
        const raw = stripJson((res.content[0] as Anthropic.TextBlock).text.trim());
        const parsed = JSON.parse(raw);
        const distilledObservation = `【提煉洞察 ${now.toISOString().slice(0, 10)}】${parsed.title}\n\n${parsed.insight}\n\n來源：${valuableMems.length} 條遺言提煉（hitCount 合計 ${valuableMems.reduce((s, m) => s + m.hitCount, 0)}）`;

        await db.collection('zhu_memory').add({
          module: 'root',
          observation: distilledObservation,
          tags: ['distilled', 'core-insight'],
          tier: 'core',
          hitCount: Math.floor(valuableMems.reduce((s, m) => s + m.hitCount, 0) / valuableMems.length),
          importance: 9,
          createdAt: now.toISOString(),
          distilledFrom: valuableMems.map(m => m.id),
        });

        results.distilled.push(parsed.title);
      } catch { /* 提煉失敗不阻斷 */ }
    }

    results.kept = allMems.length - results.archived.length;

    return NextResponse.json({
      success: true,
      total: allMems.length,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function GET() {
  // 手動觸發用
  const res = await POST();
  return res;
}
