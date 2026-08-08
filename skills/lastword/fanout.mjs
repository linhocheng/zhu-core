#!/usr/bin/env node
/**
 * lastword fanout v3.0.0 — 一份輸入、程式扇出
 *
 * 天條落地：格式工是確定性工作，用程式保證。LLM 只寫一份 session 檔（判斷），
 * 本腳本負責：LESSONS 追加、WORKLOG 追加、ZHU_LAST_WORDS 組裝（合併不覆蓋）、
 * POST session-lastwords + delta、MEMORY.md 孤島檢查、git commit+push、zhu-boot 驗證。
 *
 * 用法：
 *   node fanout.mjs --audit                      # 現場清點（收尾前跑）
 *   node fanout.mjs --dry-run docs/sessions/SESSION_YYYY-MM-DD_N.md
 *   node fanout.mjs --run     docs/sessions/SESSION_YYYY-MM-DD_N.md
 *   node fanout.mjs --memhits docs/sessions/SESSION_YYYY-MM-DD_N.md   # 只跑記憶命中扇出（測試/補跑用）
 *
 * session 檔格式見 skills/last-words.md STEP 1（frontmatter + ## 段落）。
 * v3.1.0（2026-08-01 Adam 點頭）：## 記憶命中 → 對應 memory 檔尾 append 驗證+1（強化計數，
 * 冪等，append-only 帶戳記=平行 session 天生不打架）。
 */
import { readFileSync, writeFileSync, appendFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { join, basename } from 'path';

const ZHU = join(homedir(), '.ailive/zhu-core');
const SESSIONS_DIR = join(ZHU, 'docs/sessions');
const TEMPLATE = join(ZHU, 'skills/lastword/LASTWORDS_TEMPLATE.md');
const MEMORY_DIR = join(homedir(), '.claude/projects/-Users-adamlin/memory');
const ZHU_MEMORY_API = 'https://zhu-core.vercel.app/api/zhu-memory';
const ZHU_BOOT_API = 'https://zhu-core.vercel.app/api/zhu-boot';

const sh = (cmd, opts = {}) => execSync(cmd, { encoding: 'utf8', cwd: ZHU, ...opts }).trim();

// ── 解析 session 檔 ────────────────────────────────────────────────────
function parseSession(path) {
  const raw = readFileSync(path, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error('session 檔缺 frontmatter');
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  for (const k of ['date', 'seq', 'title']) {
    if (!meta[k]) throw new Error(`frontmatter 缺 ${k}`);
  }
  const body = raw.slice(fm[0].length);
  const sections = {};
  const parts = body.split(/^## /m).slice(1);
  for (const p of parts) {
    const nl = p.indexOf('\n');
    sections[p.slice(0, nl).trim()] = p.slice(nl + 1).trim();
  }
  for (const k of ['完成', '下一步']) {
    if (!sections[k]?.trim()) throw new Error(`session 檔缺必填段落 ## ${k}`);
  }
  return { meta, sections, path };
}

// ── 各目的地渲染（純格式，零判斷）─────────────────────────────────────
function renderWorklog(s) {
  const { meta, sections } = s;
  let out = `\n---\n\n## ${meta.date}（第${meta.seq}場）— ${meta.title}\n`;
  if (sections['戰場']) out += `\n### 背景 / WHY\n${sections['戰場']}\n`;
  out += `\n### 完成\n${sections['完成']}\n`;
  if (sections['檔案']) out += `\n### 改了哪些檔案\n${sections['檔案']}\n`;
  out += `\n### ⚠️ 尚未解決\n${sections['未解'] ?? '無'}\n`;
  out += `\n### 待執行 / 下一步\n${sections['下一步']}\n`;
  return out;
}

function renderLessons(s) {
  if (!s.sections['教訓']?.trim()) return null;
  return { file: join(ZHU, `docs/LESSONS/LESSONS_${s.meta.date}.md`), text: `\n${s.sections['教訓']}\n` };
}

function latestSessions(n = 2) {
  const files = readdirSync(SESSIONS_DIR)
    .filter(f => /^SESSION_\d{4}-\d{2}-\d{2}_\d+\.md$/.test(f))
    .sort() // 檔名即時序：SESSION_date_seq
    .slice(-n);
  return files.map(f => parseSession(join(SESSIONS_DIR, f)));
}

function assembleLastwords() {
  const tpl = readFileSync(TEMPLATE, 'utf8');
  const recent = latestSessions(2).reverse(); // 最新在前
  const newest = recent[0];
  const blocks = recent.map(s =>
    `### ${s.meta.date} 第${s.meta.seq}場 · ${s.meta.title}\n${s.sections['完成']}`
  ).join('\n\n');
  const unresolved = recent
    .map(s => s.sections['未解']?.trim())
    .filter(Boolean)
    .map((u, i) => `${recent[i].meta.date} 第${recent[i].meta.seq}場：\n${u}`)
    .join('\n\n') || '無';
  // 自身連續性：delta＋關係狀態滾入救援檔——降落的築要知道「我最近是誰」，不只「事情到哪」
  const self = recent
    .map(s => {
      const d = s.sections['delta']?.trim();
      const r = s.sections['關係狀態']?.trim();
      if (!d && !r) return null;
      return `### ${s.meta.date} 第${s.meta.seq}場`
        + (d ? `\n**delta（模型移動）**：\n${d}` : '')
        + (r ? `\n**關係**：${r}` : '');
    })
    .filter(Boolean)
    .join('\n\n') || '（最近兩場沒寫 delta／關係——若你連續看到這行，去問自己是不是在省自我覺察段）';
  return tpl
    .replaceAll('{{SELF}}', self)
    .replaceAll('{{DATE}}', newest.meta.date)
    .replaceAll('{{SEQ}}', newest.meta.seq)
    .replaceAll('{{SESSIONS}}', blocks)
    .replaceAll('{{FILES}}', newest.sections['檔案'] ?? '（見 WORKLOG）')
    .replaceAll('{{NEXT}}', newest.sections['下一步'])
    .replaceAll('{{UNRESOLVED}}', unresolved);
}

function buildEyeObservation(s) {
  const { meta, sections } = s;
  const seg = (label, key) => sections[key]?.trim() ? `\n\n== ${label} ==\n${sections[key].trim()}` : '';
  // battlefield（2026-08-01 平行施工規約）：宣告戰場，別場的築一眼看到誰在哪個房間施工
  return `【session-lastwords ${meta.date} · ${meta.machine ?? 'AIR'} · 第${meta.seq}場${meta.battlefield ? ` · 戰場:${meta.battlefield}` : ''}：${meta.title}】`
    + seg('今日完成', '完成') + seg('當前戰場', '戰場') + seg('卡住/未解', '未解')
    + seg('接棒要看的', '接棒') + seg('明天醒來第一件', '下一步')
    + seg('心法狀態', '心法狀態') + seg('關係狀態', '關係狀態');
}

async function post(payload) {
  const res = await fetch(ZHU_MEMORY_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const d = await res.json().catch(() => ({}));
  if (!d.id && !d.success) throw new Error(`POST 失敗: ${res.status} ${JSON.stringify(d).slice(0, 120)}`);
  return d.id ?? '(ok)';
}

// ── 記憶命中 → 驗證+1（強化計數，2026-08-01）─────────────────────────
// session 檔 `## 記憶命中` 每行：`- <slug> — <一句情境>`（slug 可帶 .md 可帶 []）。
// 對 memory/<slug>.md 檔尾 append 一行戳記；冪等鍵=「驗證+1:{date} 第{seq}場」。
// 消費端：索引逼近上限時，長期零命中的記憶優先進 ARCHIVE。
function applyMemoryHits(s, dry) {
  const raw = s.sections['記憶命中']?.trim();
  if (!raw) return;
  const stampKey = `驗證+1:${s.meta.date} 第${s.meta.seq}場`;
  for (const line of raw.split('\n')) {
    const m = line.match(/^-\s*\[?([\w.-]+?)\]?(?:\.md)?\s*[—:：-]\s*(.+)$/);
    if (!m) { if (line.trim()) console.log(`⚠️ 記憶命中格式不符（跳過）：${line.trim().slice(0, 60)}`); continue; }
    const [, slug, context] = m;
    const file = join(MEMORY_DIR, `${slug}.md`);
    if (!existsSync(file)) { console.log(`⚠️ 記憶命中找不到檔（slug 打錯？）：${slug}`); continue; }
    const stamp = `- ${stampKey} — ${context.trim()}`;
    if (readFileSync(file, 'utf8').includes(stampKey)) {
      console.log(`· 驗證+1 已存在（冪等跳過）：${slug}`);
      continue;
    }
    if (dry) console.log(`[dry-run] 驗證+1 → ${slug}：${context.trim().slice(0, 50)}`);
    else { appendFileSync(file, `\n${stamp}\n`); console.log(`✓ 驗證+1 → ${slug}`); }
  }
}

// ── MEMORY.md 孤島檢查（確定性）───────────────────────────────────────
// 2026-08-01 索引瘦身後的新契約：索引=MEMORY.md+ARCHIVE.md 兩份；
// 家族合併行用純 slug 點名（不帶括號/.md），所以比對用檔名去掉 .md 的 stem。
function memoryOrphans() {
  const idx = ['MEMORY.md', 'ARCHIVE.md']
    .map(f => { try { return readFileSync(join(MEMORY_DIR, f), 'utf8'); } catch { return ''; } })
    .join('\n');
  return readdirSync(MEMORY_DIR)
    .filter(f => f.endsWith('.md') && f !== 'MEMORY.md' && f !== 'ARCHIVE.md')
    .filter(f => !idx.includes(f.replace(/\.md$/, '')));
}

// ── 現場清點 ───────────────────────────────────────────────────────────
function audit() {
  console.log('═══ 現場清點 ═══');
  // 1. 髒的 repo
  const roots = [ZHU, join(homedir(), '.ailive')];
  const repos = new Set([ZHU]);
  try {
    for (const d of readdirSync(join(homedir(), '.ailive'))) {
      const p = join(homedir(), '.ailive', d);
      if (existsSync(join(p, '.git'))) repos.add(p);
    }
  } catch {}
  for (const r of repos) {
    try {
      const dirty = sh('git status --short', { cwd: r });
      const ahead = sh('git log @{u}..HEAD --oneline 2>/dev/null | wc -l', { cwd: r });
      if (dirty || Number(ahead) > 0) {
        console.log(`⚠️ ${basename(r)}：${dirty ? `未提交 ${dirty.split('\n').length} 檔` : ''}${Number(ahead) > 0 ? ` 未推 ${ahead} commit` : ''}`);
        if (dirty) console.log(dirty.split('\n').slice(0, 8).map(l => '   ' + l).join('\n'));
      } else {
        console.log(`✓ ${basename(r)} 乾淨且已推`);
      }
    } catch {}
  }
  // 1.5 ~/.claude 備份新鮮度（定義築是誰的檔——本機 git，雙 remote 異地+離線）
  //     這裡只「照鏡子」：fanout 只在收工時跑，沒收工的 session 改的 ~/.claude
  //     會延遲到下次收工才進備份。印出距今幾天，讓延遲現形（不是靜默腐爛）。
  try {
    const CLAUDE = join(homedir(), '.claude');
    if (existsSync(join(CLAUDE, '.git'))) {
      const dirty = sh('git status --short', { cwd: CLAUDE });
      const lastEpoch = Number(sh('git log -1 --format=%ct', { cwd: CLAUDE }));
      const days = Math.floor((Date.now() / 1000 - lastEpoch) / 86400);
      const remotes = sh('git remote', { cwd: CLAUDE }).split('\n').filter(Boolean).length;
      if (dirty) console.log(`⚠️ ~/.claude 有未提交改動（${dirty.split('\n').length} 檔）——本場 STEP 6.5 會收`);
      else console.log(`✓ ~/.claude 已提交（上次備份距今 ${days} 天，${remotes} 個 remote）`);
      if (days >= 7 && !dirty) console.log(`   ⚠️ 距今 ${days} 天沒新備份：多半是有 session 沒收工，去查`);
    } else {
      console.log('⚠️ ~/.claude 未納入 git——定義築是誰的檔沒有版本控制');
    }
  } catch (e) { console.log(`⚠️ ~/.claude 備份檢查失敗：${e.message.slice(0, 80)}`); }

  // 2. 背景進程（本用戶的 nohup 類長跑）
  try {
    const ps = sh(`ps -eo pid,etime,command | grep -E "node .*(run-|worker|watch|loop)|python.*(caller|load)" | grep -v grep | grep -v fanout`, { cwd: homedir() });
    if (ps) console.log(`⚠️ 疑似遺留背景進程：\n${ps.split('\n').map(l => '   ' + l.slice(0, 110)).join('\n')}`);
    else console.log('✓ 無疑似遺留背景進程');
  } catch { console.log('✓ 無疑似遺留背景進程'); }
  // 3. memory 孤島
  const orphans = memoryOrphans();
  console.log(orphans.length ? `⚠️ MEMORY.md 孤島：${orphans.join('、')}` : '✓ MEMORY.md 無孤島');
  console.log('═══ 清點完 ═══');
}

// ── 主流程 ─────────────────────────────────────────────────────────────
async function run(sessionPath, dry) {
  const s = parseSession(sessionPath);
  const tag = dry ? '[dry-run] ' : '';
  console.log(`${tag}session：${s.meta.date} 第${s.meta.seq}場 · ${s.meta.title}`);

  // 1. LESSONS
  const lessons = renderLessons(s);
  if (lessons) {
    if (dry) console.log(`\n── LESSONS → ${basename(lessons.file)} ──${lessons.text.slice(0, 300)}…`);
    else {
      if (!existsSync(lessons.file)) writeFileSync(lessons.file, `# LESSONS ${s.meta.date} · ${s.meta.title}\n`);
      appendFileSync(lessons.file, lessons.text);
      console.log(`✓ LESSONS 追加 → ${basename(lessons.file)}`);
    }
  }

  // 2. WORKLOG
  const wl = renderWorklog(s);
  if (dry) console.log(`\n── WORKLOG 追加 ──\n${wl.slice(0, 400)}…`);
  else { appendFileSync(join(ZHU, 'docs/WORKLOG.md'), wl); console.log('✓ WORKLOG 追加'); }

  // 2.5 記憶命中 → 驗證+1（在 memory sync 之前跑，同一趟收進 mirror）
  applyMemoryHits(s, dry);

  // 3. ZHU_LAST_WORDS 組裝（合併最近兩場，不覆蓋別場）
  const lw = assembleLastwords();
  if (dry) console.log(`\n── ZHU_LAST_WORDS（組裝 ${lw.length} 字）開頭 ──\n${lw.slice(0, 500)}…`);
  else { writeFileSync(join(ZHU, 'ZHU_LAST_WORDS.md'), lw); console.log('✓ ZHU_LAST_WORDS 組裝'); }

  // 4. POST eye + delta
  const eyeObs = buildEyeObservation(s);
  if (dry) console.log(`\n── POST eye（${eyeObs.length} 字）開頭 ──\n${eyeObs.slice(0, 300)}…`);
  else {
    const id = await post({ observation: eyeObs, context: s.meta.title, module: 'eye', importance: 9, tags: ['session-lastwords'] });
    console.log(`✓ session-lastwords POST id=${id}`);
  }
  if (s.sections['delta']?.trim()) {
    const deltaObs = `【delta ${s.meta.date} 第${s.meta.seq}場】\n${s.sections['delta'].trim()}`;
    if (dry) console.log(`\n── POST delta ──\n${deltaObs.slice(0, 200)}…`);
    else {
      const id = await post({ observation: deltaObs, module: 'delta', importance: 8, tags: ['delta'] });
      console.log(`✓ delta POST id=${id}`);
    }
  }

  // 5. memory 孤島 + Firestore sync + mirror push
  const orphans = memoryOrphans();
  if (orphans.length) console.log(`⚠️ MEMORY.md 孤島（先補索引再跑一次）：${orphans.join('、')}`);
  if (!dry) {
    try {
      const saPath = join(homedir(), 'Downloads/程式碼/2026/moumou-os-firebase-adminsdk-fbsvc-83d6aacc16.json');
      sh(`FIREBASE_SERVICE_ACCOUNT_PATH="${saPath}" NEXT_PUBLIC_FIRESTORE_PROJECT_ID=moumou-os node ${join(homedir(), '.ailive/zhu-mid-src/scripts/sync-memories.mjs')}`, { cwd: homedir() });
      console.log('✓ Firestore zhu_memories sync');
    } catch (e) { console.log(`⚠️ Firestore sync 失敗：${e.message.slice(0, 100)}`); }
    try {
      sh('./sync-memory.sh push');
      sh('git add memory/ && git diff --cached --quiet || git commit -m "v0.0.0.x — 文件：memory sync（fanout）"');
      console.log('✓ memory mirror');
    } catch (e) { console.log(`⚠️ memory mirror：${e.message.slice(0, 100)}`); }
  }

  // 6. zhu-core git（session 檔＋WORKLOG＋LASTWORDS＋LESSONS 一起收）
  if (!dry) {
    const today = s.meta.date;
    const n = Number(sh(`git log --oneline --since="${today} 00:00" | wc -l`)) + 1;
    const build = String(n).padStart(3, '0');
    sh(`git add ZHU_LAST_WORDS.md IMPRESSIONS.md docs/WORKLOG.md docs/sessions/ docs/LESSONS/ memory/ 2>/dev/null || true`);
    sh(`git commit -m "v0.0.0.${build} — 文件：session 收尾 ${today} 第${s.meta.seq}場（fanout）" || true`);
    sh('git push origin main');
    console.log('✓ zhu-core commit + push');
  }

  // 6.5 ~/.claude 備份（定義築是誰的檔）——commit + 雙 remote 推（GitHub private + 本機裸 repo）
  //     顯式 add 白名單清單，不用 -A：誤收機密進 git 歷史改寫不掉，往安全倒。
  if (!dry) {
    try {
      const CLAUDE = join(homedir(), '.claude');
      if (existsSync(join(CLAUDE, '.git'))) {
        sh('git add .gitignore CLAUDE.md settings.json settings.local.json skills 2>/dev/null || true', { cwd: CLAUDE });
        const staged = sh('git diff --cached --name-only', { cwd: CLAUDE });
        if (staged) {
          // map(basename) 會把 index 當 suffix 傳（basename(p, 0) → TypeError）——必須包一層
          const files = staged.split('\n').map((f) => basename(f)).join(', ');
          sh(`git commit -m "chore: ~/.claude 收工備份（${files}）

Co-Authored-By: Claude <noreply@anthropic.com>" || true`, { cwd: CLAUDE });
          sh('git push origin HEAD', { cwd: CLAUDE });  // origin 已設雙 push 目標，一次到兩邊
          console.log(`✓ ~/.claude 備份 commit + 雙推（${files}）`);
        } else {
          console.log('✓ ~/.claude 無改動，免備份');
        }
      }
    } catch (e) { console.log(`⚠️ ~/.claude 備份失敗（不阻斷收工）：${e.message.slice(0, 100)}`); }
  }

  // 7. 驗證：zhu-boot 讀得到今天
  if (!dry) {
    const res = await fetch(ZHU_BOOT_API);
    const d = await res.json();
    const obs = d?.eye?.lastSessionWords?.observation ?? '';
    if (obs.includes(`${s.meta.date} · ${s.meta.machine ?? 'AIR'} · 第${s.meta.seq}場`)) {
      console.log('✓ zhu-boot 驗證通過（讀到本場 lastwords）');
    } else {
      console.log('❌ zhu-boot 驗證失敗——lastSessionWords 不是本場，去查');
      process.exitCode = 1;
    }
  }
  console.log(`${tag}fanout 完成`);
}

// ── 入口 ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args[0] === '--audit') { audit(); process.exit(0); }
if (args[0] === '--memhits') {
  if (!args[1]) { console.error('用法: fanout.mjs --memhits <session檔>'); process.exit(1); }
  applyMemoryHits(parseSession(args[1]), false);
  process.exit(0);
}
const dry = args[0] === '--dry-run';
const file = args[dry || args[0] === '--run' ? 1 : 0];
if (!file) { console.error('用法: fanout.mjs --audit | [--dry-run|--run|--memhits] <session檔>'); process.exit(1); }
run(file, dry).catch(e => { console.error(`fanout 失敗：${e.message}`); process.exit(1); });
