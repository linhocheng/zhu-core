'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_POST = 'https://www.threads.com/@linhocheng/post/DWqIEHtAHqt';
const COMMENT = '復甦之後的那個階段最難——衝勁回來了，但慣性還沒跟上。你說的「比冷靜更危險」，剛好點到了。';
const SESSION_PATH = path.join(__dirname, 'session.json');
const PROXY = {
  server:   'http://geo.iproyal.com:12321',
  username: 'kiyShyDqbhgJMc1N',
  password: '0qRSQIb9H3XaPTjZ',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function rand(min, max) { return sleep(Math.random() * (max - min) + min); }

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

  // ── 帶入已登入的 session + residential proxy，跳過登入流程 ──
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

  // ── STEP 1: 直接前往目標貼文（session 已登入，不需要過登入頁）──
  console.log('[lucy] 前往目標貼文（session 模式）...');
  await page.goto(TARGET_POST, { waitUntil: 'domcontentloaded' });
  await rand(2000, 3500);
  await page.screenshot({ path: path.join(__dirname, 's1_post_page.png') });

  // 確認是否真的已登入（看有無登入後才有的 UI）
  const url = page.url();
  console.log('[lucy] 當前 URL:', url.substring(0, 60));
  if (url.includes('login')) {
    console.error('[lucy] session 已過期，需要在本機重跑 save-session.js');
    await browser.close();
    process.exit(1);
  }
  console.log('[lucy] session 有效，已登入');

  // ── STEP 2: 找留言框 ──
  console.log('[lucy] 找留言框...');
  let replyBox = null;
  let found = false;

  // 策略 1：找「回覆」按鈕並點擊，觸發輸入框
  for (const sel of ['[aria-label*="回覆"]', '[aria-label*="Reply"]']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[lucy] 點擊回覆按鈕:', sel);
      await btn.click();
      await rand(1000, 1500);
      break;
    }
  }

  // 策略 2：搜尋輸入框
  for (const sel of ['[contenteditable="true"]', '[role="textbox"]', 'textarea', '[placeholder*="回覆"]']) {
    const el = page.locator(sel).last();
    if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('[lucy] 找到輸入框:', sel);
      replyBox = el;
      found = true;
      break;
    }
  }

  // 策略 3：點頁面中間再搜
  if (!found) {
    await page.mouse.click(640, 500);
    await rand(1000, 1500);
    for (const sel of ['[contenteditable="true"]', '[role="textbox"]', 'textarea']) {
      const el = page.locator(sel).last();
      if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('[lucy] 點擊後找到:', sel);
        replyBox = el;
        found = true;
        break;
      }
    }
  }

  await page.screenshot({ path: path.join(__dirname, 's2_before_type.png') });

  if (!found) {
    const bodyText = await page.locator('body').innerText().catch(() => '');
    console.log('[lucy] 頁面前300字:', bodyText.substring(0, 300));
    console.error('[lucy] 找不到留言框');
    await browser.close();
    process.exit(1);
  }

  // ── STEP 3: 打字留言 ──
  await replyBox.click();
  await rand(500, 900);
  console.log('[lucy] 開始打字...');
  await page.keyboard.type(COMMENT, { delay: Math.random() * 60 + 50 });
  await rand(800, 1500);
  await page.screenshot({ path: path.join(__dirname, 's3_before_submit.png') });

  // ── STEP 4: 送出 ──
  // 用精確文字找「發佈」，等它出現、滾入視野再點
  const submitBtn = page.getByRole('button', { name: '發佈', exact: true });
  await submitBtn.waitFor({ state: 'visible', timeout: 8000 });
  await submitBtn.scrollIntoViewIfNeeded();
  await rand(300, 600);
  await submitBtn.click();
  console.log('[lucy] 點擊發佈...');

  // 等確認：「已發佈」toast 或 dialog 消失（其中一個出現即可）
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
