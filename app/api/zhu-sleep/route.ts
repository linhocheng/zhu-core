/**
 * 築的記憶壓縮引擎（sleep-time）
 * POST /api/zhu-sleep → 壓縮 soil 記憶為 root 洞察
 *
 * 流程：
 * 1. 讀取最舊的 10 條 module=soil 且未 archived 的記憶
 * 2. 用 Claude API 提煉洞察
 * 3. 洞察寫入 zhu_memory module=root
 * 4. 被壓縮的 soil 標記 archived: true
 *
 * 安全邊界：
 * - 絕不碰 bone/root（只寫入新 root，不改舊的）
 * - 不刪除任何記憶，只標記 archived
 * - Claude API 失敗 → 不標記 archived（rollback）
 */
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { generateEmbedding, docToText } from '@/lib/embeddings';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 30;

export async function POST() {
  try {
    const db = getFirestore();

    // 1. 讀取最舊的 10 條未壓縮 soil 記憶
    const soilSnap = await db.collection('zhu_memory')
      .where('module', '==', 'soil')
      .where('archived', '!=', true)
      .orderBy('archived')       // Firestore 要求 != 的欄位先 orderBy
      .orderBy('createdAt', 'asc')
      .limit(10)
      .get()
      .catch(async () => {
        // fallback: archived 欄位可能不存在，用簡單查詢
        return db.collection('zhu_memory')
          .where('module', '==', 'soil')
          .orderBy('createdAt', 'asc')
          .limit(10)
          .get();
      });

    // 過濾掉已 archived 的（fallback 路徑需要）
    const soilDocs = soilSnap.docs.filter(d => !d.data().archived);

    if (soilDocs.length === 0) {
      return NextResponse.json({
        success: true,
        message: '沒有需要壓縮的 soil 記憶',
        compressed: 0,
        extracted: 0,
        archived: 0,
      });
    }

    // 2. 拼接記憶文字
    const memoryTexts = soilDocs.map((d, i) => {
      const data = d.data();
      return `[${i + 1}] ${data.observation || ''}\n   context: ${data.context || ''}\n   moment: ${data.moment || ''}\n   date: ${data.date || ''}`;
    }).join('\n\n');

    // 3. 呼叫 Claude API 提煉洞察
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY 未設定' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `以下是築的 ${soilDocs.length} 條原始經驗記錄。請提煉出 1-2 條最重要的洞察或教訓。

格式：回傳一個 JSON 陣列，每條洞察含：
- observation: 精煉後的洞察（一段話）
- moment: 一句話總結
- importance: 1-10 的重要程度

只保留有長期價值的，丟掉流水帳。如果這些記錄裡沒有值得保留的洞察，回空陣列 []。

請只回傳 JSON 陣列，不要任何其他文字。

---
${memoryTexts}`,
      }],
    });

    // 解析 Claude 回傳
    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'Claude API 回傳格式異常' }, { status: 500 });
    }

    let insights: Array<{ observation: string; moment: string; importance: number }>;
    try {
      // 嘗試從回傳中提取 JSON 陣列
      const text = textBlock.text.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        insights = [];
      } else {
        insights = JSON.parse(jsonMatch[0]);
      }
    } catch {
      return NextResponse.json({ error: 'Claude 回傳無法解析為 JSON', raw: textBlock.text }, { status: 500 });
    }

    // 4. 洞察寫入 zhu_memory module=root
    const newIds: string[] = [];
    for (const insight of insights) {
      let embedding: number[] | undefined;
      try {
        const textForEmb = docToText({ observation: insight.observation, moment: insight.moment });
        embedding = await generateEmbedding(textForEmb);
      } catch { /* embedding 失敗不阻斷 */ }

      const ref = await db.collection('zhu_memory').add({
        observation: insight.observation,
        context: `sleep-time 壓縮自 ${soilDocs.length} 條 soil 記憶`,
        moment: insight.moment,
        importance: insight.importance || 5,
        tags: ['sleep-compressed'],
        module: 'root',
        createdAt: new Date(),
        date: new Date().toISOString().slice(0, 10),
        ...(embedding ? { embedding } : {}),
      });
      newIds.push(ref.id);
    }

    // 5. 被壓縮的 soil 標記 archived: true
    const batch = db.batch();
    for (const doc of soilDocs) {
      batch.update(doc.ref, { archived: true, archivedAt: new Date() });
    }
    await batch.commit();

    return NextResponse.json({
      success: true,
      compressed: soilDocs.length,
      extracted: insights.length,
      archived: soilDocs.length,
      newRootIds: newIds,
      insights: insights.map(i => i.moment),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
