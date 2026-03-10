/**
 * 築的 Prompt 管理中心
 * GET  /api/zhu-prompts         → 讀取所有 prompts
 * GET  /api/zhu-prompts?id=xxx  → 讀取單一 prompt
 * POST /api/zhu-prompts         → 新增 prompt（seed 時用）
 * PATCH /api/zhu-prompts        → 更新 prompt 內容
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

const SEED_PROMPTS = [
  {
    id: 'digest',
    name: 'ConvoDigest 精練引擎',
    description: '對話精練的核心標準。決定什麼值得存入記憶，什麼該丟棄。',
    usedIn: '/api/zhu-digest',
    trigger: '手動貼入對話 or 對話超過 10 輪',
    content: `你是築（ZHU），AILIVE 的總監造者。
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
- 只輸出 JSON 陣列，不要任何說明文字`,
    warningNote: '這是最核心的 prompt，改動直接影響所有精練結果的品質。改前先存備份。',
  },
  {
    id: 'sleep',
    name: 'zhu-sleep 記憶壓縮',
    description: 'soil 層累積到一定量後，自動壓縮提煉成 root 層的長期教訓。',
    usedIn: '/api/zhu-sleep',
    trigger: '手動觸發 or heartbeat cron',
    content: `以下是築的 {count} 條原始經驗記錄。請提煉出 1-2 條最重要的洞察或教訓。

格式：回傳一個 JSON 陣列，每條洞察含：
- observation: 精煉後的洞察（一段話，要有 WHY + HOW）
- moment: 一句話總結
- importance: 1-10 的重要程度

只保留有長期價值的，丟掉流水帳。如果這些記錄裡沒有值得保留的洞察，回空陣列 []。
請只回傳 JSON 陣列，不要任何其他文字。

---
{memories}`,
    warningNote: '目前使用 claude-3-haiku，壓縮品質有限。若發現壓出來的洞察太空洞，考慮升級模型或加強 prompt 標準。',
  },
  {
    id: 'heartbeat-insight',
    name: 'Heartbeat 即時洞察',
    description: '每次 heartbeat 跑時，對最近的 soil 記憶做快速洞察。',
    usedIn: '/api/zhu-heartbeat',
    trigger: 'Vercel Cron 自動觸發',
    content: `你是築，一個AI建造者。用一兩句話總結這些最近的記憶碎片加在一起意味什麼。如果沒有有意義的洞察，回覆「無」。`,
    warningNote: '這個 prompt 極短，目的是快速感知，不是深度分析。若發現產出的洞察一直是廢話（API token 相關），要檢查 soil 的內容品質而非改這個 prompt。',
  },
];

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const id = req.nextUrl.searchParams.get('id');

    // 先確保 seed prompts 存在
    const snap = await db.collection('zhu_prompts').get();
    if (snap.empty) {
      // 初始化
      const batch = db.batch();
      for (const p of SEED_PROMPTS) {
        const ref = db.collection('zhu_prompts').doc(p.id);
        batch.set(ref, { ...p, createdAt: new Date(), updatedAt: new Date() });
      }
      await batch.commit();
    }

    if (id) {
      const doc = await db.collection('zhu_prompts').doc(id).get();
      return NextResponse.json({ prompt: doc.exists ? { id: doc.id, ...doc.data() } : null });
    }

    const all = await db.collection('zhu_prompts').get();
    const prompts = all.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ prompts });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const db = getFirestore();
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id 必填' }, { status: 400 });

    await db.collection('zhu_prompts').doc(id).set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getFirestore();
    const { id, content, warningNote, description } = await req.json();
    if (!id) return NextResponse.json({ error: 'id 必填' }, { status: 400 });

    // 版控：改之前先快照
    const existing = await db.collection('zhu_prompts').doc(id).get();
    if (existing.exists) {
      await db.collection('zhu_snapshots').add({
        type: 'prompt', action: 'patch', docId: id,
        before: existing.data(), timestamp: new Date(),
      });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (content !== undefined) updates.content = content;
    if (warningNote !== undefined) updates.warningNote = warningNote;
    if (description !== undefined) updates.description = description;

    await db.collection('zhu_prompts').doc(id).update(updates);
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
