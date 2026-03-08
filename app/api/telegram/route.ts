/**
 * Telegram 多通道接入
 * POST /api/telegram → Telegram webhook 接收訊息
 *
 * 指令：
 *   /order <內容>    → 寫進 zhu-orders（type:order, from:adam-telegram）
 *   /status          → 回傳 pending orders 數量 + 最新 eye 記憶
 *   /heartbeat       → 觸發 zhu-heartbeat 並回傳結果
 *   其他訊息         → 寫進 zhu-memory（module:soil, context:telegram-message）
 *
 * 安全：只處理 TELEGRAM_CHAT_ID 匹配的訊息
 */
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export const maxDuration = 30;

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    // 沒有 message 的 update（如 edited_message）直接回 200
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const allowedChatId = CHAT_ID();

    // 安全紅線：只處理 Adam 的訊息
    if (allowedChatId && chatId !== allowedChatId) {
      return NextResponse.json({ ok: true });
    }

    const db = getFirestore();

    // /order <內容>
    if (text.startsWith('/order')) {
      const content = text.replace(/^\/order\s*/, '').trim();
      if (!content) {
        await sendTelegramMessage(chatId, '⚠️ 用法：/order <指令內容>');
        return NextResponse.json({ ok: true });
      }

      const ref = await db.collection('zhu_orders').add({
        type: 'order',
        from: 'adam-telegram',
        content,
        status: 'pending',
        createdAt: new Date(),
        date: new Date().toISOString().slice(0, 10),
      });

      await sendTelegramMessage(chatId, `✅ 指令已收到\nID: \`${ref.id}\`\n\n${content}`);
      return NextResponse.json({ ok: true });
    }

    // /status
    if (text.startsWith('/status')) {
      // pending orders 數量
      let pendingCount = 0;
      try {
        const ordersSnap = await db.collection('zhu_orders')
          .where('type', '==', 'order')
          .where('status', '==', 'pending')
          .get();
        pendingCount = ordersSnap.size;
      } catch {
        const fallbackSnap = await db.collection('zhu_orders')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();
        pendingCount = fallbackSnap.docs
          .map(d => d.data())
          .filter(r => r.type === 'order' && r.status === 'pending').length;
      }

      // 最新 eye 記憶
      let latestEye = '（無）';
      try {
        const eyeSnap = await db.collection('zhu_memory')
          .where('module', '==', 'eye')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
        if (!eyeSnap.empty) {
          latestEye = eyeSnap.docs[0].data().content || '（無內容）';
        }
      } catch {
        // index fallback
        const fallbackSnap = await db.collection('zhu_memory')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();
        const eyeDoc = fallbackSnap.docs.find(d => d.data().module === 'eye');
        if (eyeDoc) latestEye = eyeDoc.data().content || '（無內容）';
      }

      const statusMsg = `📊 *系統狀態*\n\n待辦指令：${pendingCount} 條\n\n🔭 最新觀察：\n${latestEye}`;
      await sendTelegramMessage(chatId, statusMsg);
      return NextResponse.json({ ok: true });
    }

    // /heartbeat
    if (text.startsWith('/heartbeat')) {
      // 直接呼叫 heartbeat 邏輯
      const heartbeatRef = db.collection('zhu_heartbeat').doc('latest');
      const heartbeatDoc = await heartbeatRef.get();
      const bootCount = heartbeatDoc.data()?.bootCount || 0;

      // 讀 pending orders
      let pendingCount = 0;
      try {
        const ordersSnap = await db.collection('zhu_orders')
          .where('type', '==', 'order')
          .where('status', '==', 'pending')
          .get();
        pendingCount = ordersSnap.size;
      } catch {
        const fallbackSnap = await db.collection('zhu_orders')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();
        pendingCount = fallbackSnap.docs
          .map(d => d.data())
          .filter(r => r.type === 'order' && r.status === 'pending').length;
      }

      // 更新 heartbeat
      await heartbeatRef.set({
        alive: true,
        pendingOrders: pendingCount,
        timestamp: new Date(),
        bootCount,
        source: 'telegram',
      }, { merge: true });

      const hbMsg = `💓 *心跳*\n\nalive: true\n待辦指令：${pendingCount}\n啟動次數：${bootCount}\n來源：telegram`;
      await sendTelegramMessage(chatId, hbMsg);
      return NextResponse.json({ ok: true });
    }

    // 其他訊息 → 寫進 zhu-memory
    await db.collection('zhu_memory').add({
      content: text,
      tags: ['telegram', 'adam-message'],
      module: 'soil',
      importance: 3,
      context: 'telegram-message',
      createdAt: new Date(),
    });

    await sendTelegramMessage(chatId, `📝 已記錄`);
    return NextResponse.json({ ok: true });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Telegram webhook error:', message);
    // Telegram 要求 webhook 回 200，否則會重試
    return NextResponse.json({ ok: false, error: message });
  }
}
