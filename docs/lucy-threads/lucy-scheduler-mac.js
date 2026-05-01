'use strict';
/**
 * Lucy 留言排程器（Mac 本機版）
 * 在 22:00–23:30 Taipei 隨機挑 2 個時間點，間隔 > 20 分鐘
 * 執行：node lucy-scheduler-mac.js
 * 開機自啟：~/Library/LaunchAgents/ai.lucy.scheduler.plist
 */

const { spawn } = require('child_process');
const path = require('path');

const WINDOW_START_H = 22;
const WINDOW_START_M = 0;
const WINDOW_END_H   = 23;
const WINDOW_END_M   = 30;
const MIN_GAP_MIN    = 20;
const TAIPEI_OFFSET  = 8;

const COMMENT_SCRIPT = path.join(__dirname, 'comment.js');

function toMs(h, m) { return (h * 60 + m) * 60 * 1000; }

function pickTwoSeconds(startMin, endMin, minGapMin) {
  const range = endMin - startMin;
  const t1 = startMin + Math.random() * (range - minGapMin);
  const t2 = t1 + minGapMin + Math.random() * (endMin - t1 - minGapMin);
  return [t1 * 60 + Math.random() * 60, t2 * 60 + Math.random() * 60];
}

function todayTaipeiMidnightUTC() {
  const taipeiMs = Date.now() + TAIPEI_OFFSET * 3600 * 1000;
  const d = new Date(taipeiMs);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - TAIPEI_OFFSET * 3600 * 1000;
}

function fmtTaipei(utcTs) {
  const d = new Date(utcTs + TAIPEI_OFFSET * 3600 * 1000);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')}`;
}

function runLucy(index) {
  return new Promise(resolve => {
    console.log(`[lucy-sched] ▶ 第 ${index} 次觸發`);
    const proc = spawn('node', [COMMENT_SCRIPT], { cwd: __dirname, stdio: 'inherit' });
    proc.on('close', code => {
      console.log(`[lucy-sched] 第 ${index} 次 ${code === 0 ? '✓ 完成' : `✗ 失敗 exit ${code}`}`);
      resolve();
    });
  });
}

function scheduleDay() {
  const startMin = WINDOW_START_H * 60 + WINDOW_START_M;
  const endMin   = WINDOW_END_H   * 60 + WINDOW_END_M;
  const [secA, secB] = pickTwoSeconds(startMin, endMin, MIN_GAP_MIN);

  const midnight = todayTaipeiMidnightUTC();
  const fireA = midnight + secA * 1000;
  const fireB = midnight + secB * 1000;
  const now   = Date.now();

  console.log(`\n[lucy-sched] ── 今日排程 ───────────────────`);
  console.log(`[lucy-sched]  第 1 次：${fmtTaipei(fireA)} Taipei`);
  console.log(`[lucy-sched]  第 2 次：${fmtTaipei(fireB)} Taipei`);
  console.log(`[lucy-sched]  間隔：${Math.round((fireB - fireA) / 60000)} 分鐘`);
  console.log(`[lucy-sched] ────────────────────────────────\n`);

  let scheduled = 0;
  [{ fire: fireA, idx: 1 }, { fire: fireB, idx: 2 }].forEach(({ fire, idx }) => {
    const delay = fire - now;
    if (delay < 0) { console.log(`[lucy-sched] 第 ${idx} 次已過，跳過`); return; }
    scheduled++;
    setTimeout(() => runLucy(idx), delay);
  });

  if (scheduled === 0) console.log(`[lucy-sched] 今日窗口已過，等明天`);

  // 明日重算
  const nextMidnight = todayTaipeiMidnightUTC() + 24 * 3600 * 1000;
  setTimeout(scheduleDay, nextMidnight - now + Math.random() * 30000);
}

console.log(`[lucy-sched] 啟動（Mac 本機）— 窗口 ${WINDOW_START_H}:${String(WINDOW_START_M).padStart(2,'0')}–${WINDOW_END_H}:${String(WINDOW_END_M).padStart(2,'0')} Taipei`);
scheduleDay();
