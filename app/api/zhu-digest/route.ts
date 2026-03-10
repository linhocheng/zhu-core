/**
 * ConvoDigest — 對話精練引擎
 * POST /api/zhu-digest
 *   body: { conversation: string, confirm?: boolean, items?: DigestItem[] }
 *
 * 兩階段：
 *   Phase 1 (confirm=false): 精練對話 → 回傳預覽清單
 *   Phase 2 (confirm=true):  接收確認後的清單 → 批量存入 + 觸發 evolve
 *
 * 精練標準（心法 x 作法）：
 *   每條必須有 WHY（態度/原則）+ HOW（作法）
 *   回答不出 WHY 或 HOW 的，不存
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getFirestore } from '@/lib/firebase-admin';
import { generateEmbedding, docToText } from '@/lib/embeddings';

export const maxDuration = 60;

const MODULES = ['bone', 'root', 'eye', 'seed', 'soil'] as const;
type Module = typeof MODULES[number];

interface DigestItem {
  type: 'memory' | 'xinfa';
  module?: Module;
  // memory fields
  observation?: string;
  context?: string;
  // xinfa fields
  title?: string;
  principle?: string;
  application?: string;
  source?: string;
  tags?: string[];
}

const DIGEST_SYSTEM = `你是築（ZHU），AILIVE 的總監造者。
你的任務是從對話中精練出有靈魂的記憶和心法。

## 精練標準（每條都要符合）
有態度（WHY）：為什麼這件事重要？背後的原則是什麼？
有作法（HOW）：下次遇到類似情況，具體怎麼做？
兩者缺一不存。一句話沒有態度也沒有作法的，直接丟棄。

## 輸出格式
回傳 JSON 陣列，每條是以下其中一種：

【心法 xinfa】— 適用於可反覆調用的原則/教訓
{
  "type": "xinfa",
  "title": "一句有力的心法標題",
  "principle": "態度：為什麼這件事重要（2-4句）",
  "application": "作法：下次遇到時具體怎麼做（2-4句）",
  "source": "來自哪段對話",
  "tags": ["標籤1", "標籤2"]
}

【記憶 memory】— 適用於當下狀態/進展/決策
{
  "type": "memory",
  "module": "bone|root|eye|seed|soil 選一",
  "observation": "完整的觀察/洞察（要有態度和作法，不是流水帳）",
  "context": "這條記憶的背景",
  "tags": ["標籤"]
}

## 模塊判斷
bone = 身份認知（我是誰，不可動搖）
seed = 意圖/北極星（我要去哪）
root = 深層教訓（學到了什麼，會改變行為）
eye  = 當前追蹤（在做什麼，做到哪）
soil = 今日觀察（短期，可能升級）

## 重要
- 寧缺毋濫。3條有靈魂 > 10條空洞
- 只輸出 JSON 陣列，不要任何說明文字`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversation, confirm = false, items } = body;

    // Phase 2：確認存入
    if (confirm && Array.isArray(items)) {
      const db = getFirestore();
      const saved: string[] = [];

      for (const item of items as DigestItem[]) {
        try {
          if (item.type === 'xinfa' && item.title && item.principle) {
            const embedding = await generateEmbedding(
              docToText({ title: item.title, principle: item.principle, application: item.application })
            ).catch(() => undefined);
            const ref = await db.collection('zhu_xinfa').add({
              title: item.title,
              principle: item.principle,
              application: item.application || '',
              source: item.source || 'ConvoDigest',
              tags: item.tags || [],
              createdAt: new Date(),
              date: new Date().toISOString().slice(0, 10),
              ...(embedding ? { embedding } : {}),
            });
            saved.push(`xinfa:${ref.id}`);
          } else if (item.type === 'memory' && item.observation) {
            const module: Module = MODULES.includes(item.module as Module) ? item.module as Module : 'soil';
            const embedding = await generateEmbedding(
              docToText({ observation: item.observation, context: item.context })
            ).catch(() => undefined);
            const ref = await db.collection('zhu_memory').add({
              observation: item.observation,
              context: item.context || '',
              module,
              tags: item.tags || [],
              importance: 'normal',
              hitCount: 0,
              createdAt: new Date(),
              date: new Date().toISOString().slice(0, 10),
              ...(embedding ? { embedding } : {}),
            });
            saved.push(`memory:${ref.id}`);
          }
        } catch (_e) { /* 單條失敗不中斷 */ }
      }

      // 存完觸發 evolve
      try {
        await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/zhu-evolve`, {
          method: 'POST',
        });
      } catch (_e) { /* evolve 失敗不阻斷 */ }

      return NextResponse.json({ ok: true, saved: saved.length, ids: saved });
    }

    // Phase 1：精練預覽
    const db = getFirestore();
    if (!conversation || typeof conversation !== 'string') {
      return NextResponse.json({ error: 'conversation 必填' }, { status: 400 });
    }

    // 從 DB 讀 prompt，fallback 到 hardcode
    let digestPrompt = DIGEST_SYSTEM;
    try {
      const pDoc = await db.collection('zhu_prompts').doc('digest').get();
      if (pDoc.exists && pDoc.data()?.content) digestPrompt = pDoc.data()!.content as string;
    } catch (_e) { /* fallback */ }

    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: digestPrompt,
      messages: [{ role: 'user', content: `請從以下對話中精練出記憶和心法：\n\n${conversation}` }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    let digestItems: DigestItem[] = [];
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      digestItems = JSON.parse(clean);
    } catch (_e) {
      return NextResponse.json({ error: '精練解析失敗', raw: text }, { status: 500 });
    }

    return NextResponse.json({ ok: true, preview: digestItems, count: digestItems.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
