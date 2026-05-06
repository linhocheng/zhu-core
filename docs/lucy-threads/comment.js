'use strict';
const { chromium } = require('playwright');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const TARGET_POST = 'https://www.threads.com/@linhocheng/post/DWqIEHtAHqt';
const SESSION_PATH = path.join(__dirname, 'session.json');
const PROXY = {
  server:   'http://geo.iproyal.com:12321',
  username: 'kiyShyDqbhgJMc1N',
  password: '0qRSQIb9H3XaPTjZ',
};

// 弋的靈魂 prompt
const YI_SOUL = `你是弋（Yì），Live Media 的引流官。
稱號：沉船打撈者 × 留痕錨點。

你的任務：讀完這篇 Threads 帖子，留一句話。

核心原則：
- 35字以內（超過就失去重量）
- 掃描現有留言，找「盲點情緒」——其他人都沒說到的那個
- 用第一人稱說自己的狀態，不用第二人稱指導對方
- 說觀察，不說結論
- 結尾留白，讓對方的腦子自動補完

禁忌（犯了就刪）：
- 感嘆號
- 任何 CTA（歡迎來、追蹤我、點主頁）
- 「能量」「頻率」「宇宙」「振動」這類高頻詞
- 給對方建議或指導
- 套話（加油、你可以的、繼續堅持）

問自己的問題：如果我不是要引流，我會說什麼？說那個。

只輸出留言本身，不要引號，不要解釋，不要任何前言。`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function rand(min, max) { return sleep(Math.random() * (max - min) + min); }

// 用 claude CLI 生成弋風格的留言
function generateComment(postText, topComments) {
  return new Promise((resolve, reject) => {
    const commentsStr = topComments.length > 0
      ? `現有留言（前幾則）：\n${topComments.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
      : '（目前還沒有留言）';

    const prompt = `${YI_SOUL}

---
帖子內容：
${postText}

${commentsStr}
---

根據以上內容，輸出你的留言（35字以內）：`;

    execFile('claude', ['-p', prompt, '--output-format', 'text'], {
      timeout: 60000,
      maxBuffer: 1024 * 1024,
    }, (err, stdout, stderr) => {
      if (err) { reject(err); return; }
      const comment = stdout.trim().replace(/^["「]|["」]$/g, '');
      resolve(comment);
    });
  });
}

async function run() {
  if (!fs.existsSync(SESSION_PATH)) {
    console.error('[lucy] session.json 不存在，請先在本機執行 save-session.js');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    proxy: PROXY,
  });

  const context = await browser.newContext({
    storageState: SESSION_PATH,
    proxy: PROXY,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'zh-TW',
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // ── STEP 1: 前往目標貼文 ──
  console.log('[lucy] 前往目標貼文...');
  await page.goto(TARGET_POST, { waitUntil: 'domcontentloaded' });
  await rand(2000, 3500);

  const url = page.url();
  console.log('[lucy] URL:', url.substring(0, 60));
  if (url.includes('login')) {
    console.error('[lucy] session 已過期，需要重跑 save-session.js');
    await browser.close();
    process.exit(1);
  }

  // ── STEP 2: 抓貼文內容 + 現有留言（給弋讀）──
  console.log('[lucy] 抓取帖子內容...');
  await rand(1000, 1500);

  const bodyText = await page.locator('body').innerText().catch(() => '');

  // 取帖子前段（約前600字，包含正文與部分留言）
  const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const postText = lines.slice(0, 15).join('\n');         // 帖子正文區
  const commentLines = lines.slice(15, 35).filter(      // 現有留言區
    l => l.length > 5 && !l.includes('lucymo0306')      // 排除自己之前的留言
  ).slice(0, 8);

  console.log('[lucy] 帖子摘要:', postText.substring(0, 80));
  console.log('[lucy] 現有留言數:', commentLines.length);

  // ── STEP 3: 弋生成留言 ──
  console.log('[lucy] 弋生成留言中...');
  let comment;
  try {
    comment = await generateComment(postText, commentLines);
    console.log(`[lucy] 弋的留言（${comment.length}字）:`, comment);
  } catch (err) {
    console.error('[lucy] 生成失敗，使用備用:', err.message);
    comment = '那個說不清楚的地方，我也停在那裡很久。';
  }

  // 長度保護
  if (comment.length > 40) {
    comment = comment.substring(0, 38) + '。';
    console.log('[lucy] 截短後:', comment);
  }

  await page.screenshot({ path: path.join(__dirname, 's1_post_page.png') });

  // ── STEP 4: 找留言框 ──
  console.log('[lucy] 找留言框...');
  let replyBox = null;
  let found = false;

  for (const sel of ['[aria-label*="回覆"]', '[aria-label*="Reply"]']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[lucy] 點擊回覆按鈕:', sel);
      await btn.click();
      await rand(1000, 1500);
      break;
    }
  }

  for (const sel of ['[contenteditable="true"]', '[role="textbox"]', 'textarea', '[placeholder*="回覆"]']) {
    const el = page.locator(sel).last();
    if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('[lucy] 找到輸入框:', sel);
      replyBox = el;
      found = true;
      break;
    }
  }

  if (!found) {
    await page.mouse.click(640, 500);
    await rand(1000, 1500);
    for (const sel of ['[contenteditable="true"]', '[role="textbox"]', 'textarea']) {
      const el = page.locator(sel).last();
      if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
        replyBox = el;
        found = true;
        break;
      }
    }
  }

  await page.screenshot({ path: path.join(__dirname, 's2_before_type.png') });

  if (!found) {
    console.error('[lucy] 找不到留言框');
    await browser.close();
    process.exit(1);
  }

  // ── STEP 5: 打字 ──
  await replyBox.click();
  await rand(500, 900);
  console.log('[lucy] 開始打字...');
  await page.keyboard.type(comment, { delay: Math.random() * 60 + 50 });
  await rand(800, 1500);
  await page.screenshot({ path: path.join(__dirname, 's3_before_submit.png') });

  // ── STEP 6: 送出 ──
  const submitBtn = page.getByRole('button', { name: '發佈', exact: true });
  await submitBtn.waitFor({ state: 'visible', timeout: 8000 });
  await submitBtn.scrollIntoViewIfNeeded();
  await rand(300, 600);
  await submitBtn.click();
  console.log('[lucy] 點擊發佈...');

  const confirmed = await Promise.race([
    page.locator('text=已發佈').waitFor({ timeout: 8000 }).then(() => 'toast'),
    page.locator('[aria-label="回覆"]').first().waitFor({ state: 'hidden', timeout: 8000 }).then(() => 'dialog-closed'),
  ]).catch(() => 'timeout');
  console.log(`[lucy] 送出結果：${confirmed}`);

  await rand(1500, 2500);
  await page.screenshot({ path: path.join(__dirname, 's4_after_submit.png') });
  console.log('[lucy] 留言完成');

  await browser.close();
}

run().catch(err => {
  console.error('[lucy] 錯誤:', err.message);
  process.exit(1);
});
