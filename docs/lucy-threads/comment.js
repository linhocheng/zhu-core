const { chromium } = require('playwright');
const path = require('path');

const TARGET_POST = 'https://www.threads.com/@ruyuan.app_tw/post/DUMp-PEjFHr';
const COMMENT = '復甦之後的那個階段最難——衝勁回來了，但慣性還沒跟上。你說的「比冷靜更危險」，剛好點到了。';
const IG_USER = 'lucymo0306@gmail.com';
const IG_PASS = 'Lucymomo0306';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function rand(min, max) { return sleep(Math.random() * (max - min) + min); }

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'zh-TW',
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // ── STEP 1: 登入 Threads ──
  console.log('[lucy] 前往 Threads 登入頁...');
  await page.goto('https://www.threads.com/login', { waitUntil: 'networkidle' });
  await rand(1500, 2500);

  // 點「使用 Instagram 帳號繼續」→ 跳轉到 IG OAuth 頁
  const igBtn = page.locator('text=使用 Instagram 帳號繼續').first();
  await igBtn.waitFor({ timeout: 10000 });
  await igBtn.click();

  // 等待跳轉到 instagram.com 的 OAuth 登入頁
  console.log('[lucy] 等待 IG OAuth 頁...');
  await page.waitForURL(/instagram\.com/, { timeout: 15000 });
  await rand(1500, 2500);
  await page.screenshot({ path: path.join(__dirname, 's1_ig_oauth.png') });
  console.log('[lucy] 當前頁面:', page.url().substring(0, 80));

  // 填 IG 帳號 + 密碼
  const userInput = page.locator('input[name="username"], input[aria-label*="用戶"], input[type="text"]').first();
  await userInput.waitFor({ timeout: 10000 });
  await userInput.click();
  await rand(400, 700);
  await page.keyboard.type(IG_USER, { delay: 70 });
  await rand(500, 900);

  const pwInput = page.locator('input[type="password"]').first();
  await pwInput.click();
  await rand(300, 600);
  await page.keyboard.type(IG_PASS, { delay: 80 });
  await rand(800, 1400);

  await page.screenshot({ path: path.join(__dirname, 's1a_filled.png') });
  console.log('[lucy] 表單填完截圖：s1a_filled.png');

  // 點「登入」按鈕（用文字定位，比 type=submit 可靠）
  const loginBtn = page.getByRole('button', { name: '登入' }).first();
  await loginBtn.waitFor({ timeout: 5000 });
  await loginBtn.click();
  console.log('[lucy] IG 登入按鈕點擊');
  await rand(3000, 5000);
  await page.screenshot({ path: path.join(__dirname, 's1b_after_click.png') });
  console.log('[lucy] 點擊後 URL:', page.url().substring(0, 80));
  console.log('[lucy] IG 帳密送出...');
  await rand(2000, 3500);
  await page.screenshot({ path: path.join(__dirname, 's1b_after_submit.png') });
  console.log('[lucy] 中間頁:', page.url().substring(0, 70));

  // 處理 onetap（「保存登入資訊？」）
  if (page.url().includes('onetap')) {
    console.log('[lucy] 處理 onetap 頁...');
    await page.screenshot({ path: path.join(__dirname, 's1c_onetap.png') });
    // 列出所有可見按鈕文字幫助 debug
    const btns = await page.locator('button, [role="button"], input[type="submit"]').allTextContents();
    console.log('[lucy] onetap 按鈕:', JSON.stringify(btns));

    // 試所有「跳過」類按鈕
    for (const label of ['稍後再說', '現在略過', 'Not now', '略過', 'Skip', '繼續', 'Continue', '下一步']) {
      const btn = page.getByText(label, { exact: false }).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        console.log('[lucy] 點擊:', label);
        await btn.click();
        await rand(1500, 2500);
        break;
      }
    }
    // 如果都沒有，按 Enter 試試
    await page.keyboard.press('Enter');
    await rand(2000, 3000);
  }

  // 等待真正進入 threads.com（URL 以 threads.com 開頭）
  console.log('[lucy] 等待回跳 Threads...');
  await page.waitForFunction(
    () => window.location.hostname === 'www.threads.com',
    { timeout: 25000 }
  );
  await rand(2000, 4000);
  await page.screenshot({ path: path.join(__dirname, 's2_after_login.png') });
  console.log('[lucy] Threads URL:', page.url().substring(0, 60));
  console.log('[lucy] 登入成功');

  // ── STEP 2: 前往目標貼文 ──
  console.log('[lucy] 前往目標貼文...');
  await page.goto(TARGET_POST, { waitUntil: 'networkidle' });
  await rand(2000, 3500);
  await page.screenshot({ path: path.join(__dirname, 's3_post_page.png') });

  // ── STEP 3: 找留言框 ──
  console.log('[lucy] 找留言框...');
  await page.screenshot({ path: path.join(__dirname, 's3b_logged_in_post.png') });

  let replyBox = null;
  let found = false;

  // 策略 1：找「回覆」按鈕並點擊，觸發輸入框
  const replyBtnSelectors = [
    '[aria-label*="回覆"]',
    '[aria-label*="Reply"]',
    'svg[aria-label*="回覆"]',
    'svg[aria-label*="Reply"]',
  ];
  for (const sel of replyBtnSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[lucy] 點擊回覆按鈕:', sel);
      await btn.click();
      await rand(1000, 1500);
      break;
    }
  }

  // 策略 2：找底部固定輸入列（Threads 底部 sticky reply bar）
  const candidates = [
    '[contenteditable="true"]',
    '[role="textbox"]',
    'textarea',
    '[data-lexical-editor="true"]',
    '[placeholder*="回覆"]',
    '[placeholder*="Reply"]',
  ];

  for (const sel of candidates) {
    const el = page.locator(sel).last();
    if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('[lucy] 找到輸入框:', sel);
      replyBox = el;
      found = true;
      break;
    }
  }

  // 策略 3：點擊頁面中間觸發 UI，再搜
  if (!found) {
    console.log('[lucy] 嘗試點擊頁面觸發...');
    await page.mouse.click(640, 500);
    await rand(1000, 1500);
    for (const sel of candidates) {
      const el = page.locator(sel).last();
      if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('[lucy] 點擊後找到:', sel);
        replyBox = el;
        found = true;
        break;
      }
    }
  }

  // 策略 4：列出所有 button aria-label 幫助 debug
  if (!found) {
    const btns = await page.locator('button, [role="button"]').evaluateAll(
      els => els.slice(0, 20).map(e => e.getAttribute('aria-label') || e.textContent?.trim().substring(0, 30))
    );
    console.log('[lucy] 可見按鈕:', JSON.stringify(btns));
    const bodyText = await page.locator('body').innerText().catch(() => '');
    console.log('[lucy] 頁面前300字:', bodyText.substring(0, 300));
  }

  await page.screenshot({ path: path.join(__dirname, 's4_before_type.png') });

  if (!found) {
    console.error('[lucy] 找不到留言框');
    await browser.close();
    process.exit(1);
  }

  // ── STEP 4: 打字留言 ──
  await replyBox.click();
  await rand(500, 900);
  console.log('[lucy] 開始打字...');
  await page.keyboard.type(COMMENT, { delay: Math.random() * 60 + 50 });
  await rand(800, 1500);

  await page.screenshot({ path: path.join(__dirname, 's5_before_submit.png') });
  console.log('[lucy] 送出前截圖已存');

  // ── STEP 5: 送出 ──
  // 找送出按鈕（Threads 通常是「發佈」或「回覆」按鈕）
  const submitBtn = page.locator('[role="button"]').filter({ hasText: /發佈|回覆|Post/ }).last();
  if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await submitBtn.click();
  } else {
    await page.keyboard.press('Enter');
  }
  await rand(2500, 4000);

  await page.screenshot({ path: path.join(__dirname, 's6_after_submit.png') });
  console.log('[lucy] 留言完成');

  await browser.close();
}

run().catch(async (err) => {
  console.error('[lucy] 錯誤:', err.message);
  process.exit(1);
});
