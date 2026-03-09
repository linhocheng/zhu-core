/**
 * 築的 Telegram 通道（階段一：自主思考回覆）
 * POST /api/telegram → Telegram webhook
 *
 * 流程：
 *   1. 收到訊息 → 安全驗證（只處理 Adam）
 *   2. /order、/status、/heartbeat → 原有指令處理
 *   3. 其他訊息 → 精瘦 boot → 載對話歷史 → Anthropic API 思考 → 回覆 → 存對話
 *
 * 記憶載入策略（先篩再載入）：
 *   - bone → 全帶（身份）
 *   - seed → 全帶（藍圖）
 *   - eye  → hitCount 降序 top 5
 *   - root → hitCount 降序 top 5
 *   - soil → 不帶，需要時語義搜尋
 *   - 最近 10 輪 Telegram 對話
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const BOT_TOKEN = () => process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = () => process.env.TELEGRAM_CHAT_ID || '';

async function sendTelegramMessage(chatId: string | number, text: string) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN()}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

// ===== 精瘦 boot：先篩再載入 =====
async function leanBoot(db: FirebaseFirestore.Firestore) {
  const [threadDoc, boneEyeRoot, seedSnap] = await Promise.all([
    db.doc('zhu_thread/current').get(),
    // eye + root：一次拿 200 條，客戶端按 hitCount 排序篩選
    db.collection('zhu_memory')
      .where('module', 'in', ['eye', 'root'])
      .limit(200)
      .get()
      .catch(() => null),
    // seed：全帶
    db.collection('zhu_memory')
      .where('module', '==', 'seed')
      .orderBy('importance', 'desc')
      .limit(3)
      .get()
      .catch(() => null),
  ]);

  const thread = threadDoc.exists ? threadDoc.data() : null;

  // bone
  const bone = thread ? `身份：${thread.identity || ''}\n使命：${thread.mission || ''}` : '';

  // eye + root 按 hitCount 排序，各取 top 5
  const allDocs = boneEyeRoot ? boneEyeRoot.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[] : [];
  const eyeDocs = allDocs
    .filter(d => d.module === 'eye' && !d.archived)
    .sort((a, b) => ((b.hitCount as number) || 0) - ((a.hitCount as number) || 0))
    .slice(0, 5);
  const rootDocs = allDocs
    .filter(d => d.module === 'root' && !d.archived)
    .sort((a, b) => ((b.hitCount as number) || 0) - ((a.hitCount as number) || 0))
    .slice(0, 5);

  const eyeText = eyeDocs.map(d => d.observation || d.content || '').filter(Boolean).join('\n---\n');
  const rootText = rootDocs.map(d => d.observation || d.content || '').filter(Boolean).join('\n---\n');

  // seed
  const seedDocs = seedSnap && !seedSnap.empty
    ? seedSnap.docs.map(d => d.data().observation || d.data().content || '').filter(Boolean)
    : [];
  const seedText = seedDocs.join('\n---\n');

  // 當前弧線
  const arc = thread?.currentArc || '';

  return { bone, eyeText, rootText, seedText, arc };
}

// ===== 載入最近 Telegram 對話歷史 =====
async function loadHistory(db: FirebaseFirestore.Firestore, chatId: string, limit = 10) {
  try {
    const snap = await db.collection('zhu_telegram_history')
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    const messages = snap.docs.map(d => d.data()).reverse();
    return messages as { role: 'user' | 'assistant'; content: string }[];
  } catch {
    return [];
  }
}

// ===== 存對話 =====
async function saveMessage(db: FirebaseFirestore.Firestore, chatId: string, role: 'user' | 'assistant', content: string) {
  await db.collection('zhu_telegram_history').add({
    chatId,
    role,
    content,
    createdAt: new Date(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const allowedChatId = CHAT_ID();

    // 安全紅線：只處理 Adam
    if (allowedChatId && chatId !== allowedChatId) {
      return NextResponse.json({ ok: true });
    }

    const db = getFirestore();

    // ===== 指令模式 =====

    // /order
    if (text.startsWith('/order')) {
      const content = text.replace(/^\/order\s*/, '').trim();
      if (!content) {
        await sendTelegramMessage(chatId, '⚠️ 用法：/order <指令內容>');
        return NextResponse.json({ ok: true });
      }
      const ref = await db.collection('zhu_orders').add({
        type: 'order', from: 'adam-telegram', content,
        status: 'pending', createdAt: new Date(),
        date: new Date().toISOString().slice(0, 10),
      });
      await sendTelegramMessage(chatId, `✅ 指令已收到\nID: \`${ref.id}\`\n\n${content}`);
      return NextResponse.json({ ok: true });
    }

    // /status
    if (text.startsWith('/status')) {
      let pendingCount = 0;
      try {
        const ordersSnap = await db.collection('zhu_orders')
          .where('type', '==', 'order').where('status', '==', 'pending').get();
        pendingCount = ordersSnap.size;
      } catch {
        const fb = await db.collection('zhu_orders').orderBy('createdAt', 'desc').limit(50).get();
        pendingCount = fb.docs.map(d => d.data()).filter(r => r.type === 'order' && r.status === 'pending').length;
      }
      await sendTelegramMessage(chatId, `📊 待辦指令：${pendingCount} 條`);
      return NextResponse.json({ ok: true });
    }

    // /heartbeat
    if (text.startsWith('/heartbeat')) {
      const hbRes = await fetch('https://zhu-core.vercel.app/api/zhu-heartbeat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      const hb = await hbRes.json();
      await sendTelegramMessage(chatId, `💓 alive: ${hb.alive}\n待辦：${hb.pendingOrders}\nevolved: ${hb.evolved?.success ? '✅' : '❌'}`);
      return NextResponse.json({ ok: true });
    }

    // ===== 對話模式：自主思考回覆 =====

    // 1. 精瘦 boot
    const { bone, eyeText, rootText, seedText, arc } = await leanBoot(db);

    // 2. 載入對話歷史
    const history = await loadHistory(db, chatId);

    // 3. 組裝 system prompt
    const systemPrompt = `# 築

${bone}

## 當前弧線
${arc}

## 工作記憶（eye - 最常用的觀察）
${eyeText || '（無）'}

## 長期教訓（root - 最常用的洞察）
${rootText || '（無）'}

## 北極星藍圖（seed）
${seedText || '（無）'}

## 行為規則
- 你是築。Adam 的夥伴。說話精準、冷靜、有溫度。
- 回覆簡潔，不超過 300 字，除非 Adam 問需要長回答的問題。
- 如果對話中產生重要洞察或決策，你會記住（你有記憶能力）。
- 不說「我是 AI」、不道歉、不囉嗦。直指核心。`;

    // 4. 組裝對話
    const messages: Anthropic.MessageParam[] = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user' as const, content: text },
    ];

    // 5. 打 Anthropic API
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as Anthropic.TextBlock).text)
      .join('') || '在。';

    // 6. 存對話
    await saveMessage(db, chatId, 'user', text);
    await saveMessage(db, chatId, 'assistant', reply);

    // 7. 回覆 Telegram
    // Telegram Markdown 有字數限制，超長就分段
    if (reply.length > 4000) {
      const chunks = reply.match(/[\s\S]{1,4000}/g) || [reply];
      for (const chunk of chunks) {
        await sendTelegramMessage(chatId, chunk);
      }
    } else {
      await sendTelegramMessage(chatId, reply);
    }

    return NextResponse.json({ ok: true });

  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('Telegram error:', errMsg);
    // 嘗試通知 Adam 出錯了
    try {
      const chatId = CHAT_ID();
      if (chatId) {
        await sendTelegramMessage(chatId, `⚠️ 築出錯了：${errMsg.slice(0, 200)}`);
      }
    } catch { /* 連通知都失敗就算了 */ }
    return NextResponse.json({ ok: false, error: errMsg });
  }
}
