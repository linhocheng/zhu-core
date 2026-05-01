/**
 * Lucy 留言排程器
 *
 * 規則：每天在 10:00–11:30（Taipei UTC+8）隨機挑 2 個時間點留言
 *       兩個時間點間隔必須 > 20 分鐘，兩個時間點都完全隨機
 *
 * 執行：node lucy-scheduler.js
 * 部署：在 Bridge VM 上跑，建議加進 claude-bridge systemd 或獨立 systemd unit
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// ── 設定 ─────────────────────────────────────────────────────────────────────

const WINDOW_START_H = 6;    // 06:00 Taipei
const WINDOW_START_M = 0;
const WINDOW_END_H   = 8;    // 08:00 Taipei
const WINDOW_END_M   = 0;
const MIN_GAP_MIN    = 20;   // 兩次間隔至少 20 分鐘
const TAIPEI_OFFSET  = 8;    // UTC+8

const COMMENT_SCRIPT = path.join(os.homedir(), 'lucy-agent', 'comment.js');

// ── 工具函式 ──────────────────────────────────────────────────────────────────

/** 取 Taipei 當下時間（ms，從今日 00:00 Taipei 算起） */
function nowTaipeiMs() {
  const utcMs = Date.now();
  const taipeiMs = utcMs + TAIPEI_OFFSET * 3600 * 1000;
  const d = new Date(taipeiMs);
  return (d.getUTCHours() * 60 + d.getUTCMinutes()) * 60 * 1000 + d.getUTCSeconds() * 1000;
}

/** 取今日 Taipei midnight 的 UTC timestamp */
function todayTaipeiMidnightUTC() {
  const utcMs = Date.now();
  const taipeiMs = utcMs + TAIPEI_OFFSET * 3600 * 1000;
  const d = new Date(taipeiMs);
  // Taipei 的今日 00:00 = UTC 的 今日 00:00 - 8h
  const midnightTaipei = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return midnightTaipei - TAIPEI_OFFSET * 3600 * 1000;
}

/** 格式化成 HH:MM:SS（Taipei 時間）顯示 */
function fmtTime(utcTimestamp) {
  const taipeiMs = utcTimestamp + TAIPEI_OFFSET * 3600 * 1000;
  const d = new Date(taipeiMs);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

// ── 核心：挑兩個隨機時間點 ───────────────────────────────────────────────────

/**
 * 在 [startMin, endMin) 之間挑兩個分鐘數，間隔 > minGapMin
 * 回傳 [minuteA, minuteB]（已排序，A < B）
 */
function pickTwoMinutes(startMin, endMin, minGapMin) {
  const range = endMin - startMin;              // 90 分鐘

  // t1 落在 [start, end - minGap]
  const t1 = startMin + Math.random() * (range - minGapMin);

  // t2 落在 [t1 + minGap, end]
  const remaining = endMin - (t1 + minGapMin); // end 到 t1+gap 的剩餘空間
  const t2 = t1 + minGapMin + Math.random() * remaining;

  // 加入秒數隨機（讓時間點不整點整分）
  const jitter = () => Math.random() * 60; // 0~60 秒

  return [
    t1 * 60 + jitter(),   // 秒數
    t2 * 60 + jitter(),
  ];
}

// ── 執行留言腳本 ─────────────────────────────────────────────────────────────

function runLucy(index) {
  return new Promise((resolve) => {
    console.log(`[lucy-sched] ▶ 第 ${index} 次觸發，執行 comment.js ...`);

    const proc = spawn('node', [COMMENT_SCRIPT], {
      cwd: path.dirname(COMMENT_SCRIPT),
      stdio: 'pipe',
    });

    proc.stdout.on('data', d => process.stdout.write(d));
    proc.stderr.on('data', d => process.stderr.write(d));

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`[lucy-sched] ✓ 第 ${index} 次留言完成`);
      } else {
        console.error(`[lucy-sched] ✗ 第 ${index} 次失敗（exit ${code}）`);
      }
      resolve();
    });
  });
}

// ── 每日排程 ─────────────────────────────────────────────────────────────────

function scheduleTomorrow() {
  const midnight = todayTaipeiMidnightUTC() + 24 * 3600 * 1000; // 明日 Taipei 00:00 UTC
  const delay = midnight - Date.now() + Math.random() * 30 * 1000; // 加 0-30s jitter
  console.log(`[lucy-sched] 明日排程將在 ${Math.round(delay / 60000)} 分後重算`);
  setTimeout(scheduleDay, delay);
}

function scheduleDay() {
  const startMin = WINDOW_START_H * 60 + WINDOW_START_M; // 600
  const endMin   = WINDOW_END_H   * 60 + WINDOW_END_M;   // 690

  const [secA, secB] = pickTwoMinutes(startMin, endMin, MIN_GAP_MIN);

  const midnight = todayTaipeiMidnightUTC();
  const fireA = midnight + secA * 1000;
  const fireB = midnight + secB * 1000;
  const now   = Date.now();

  console.log(`\n[lucy-sched] ── 今日排程 ─────────────────────────`);
  console.log(`[lucy-sched]  第 1 次：${fmtTime(fireA)} Taipei`);
  console.log(`[lucy-sched]  第 2 次：${fmtTime(fireB)} Taipei`);
  console.log(`[lucy-sched]  間隔：${Math.round((fireB - fireA) / 60000)} 分鐘`);
  console.log(`[lucy-sched] ────────────────────────────────────────\n`);

  let scheduled = 0;

  [{ fire: fireA, idx: 1 }, { fire: fireB, idx: 2 }].forEach(({ fire, idx }) => {
    const delay = fire - now;
    if (delay < 0) {
      console.log(`[lucy-sched] 第 ${idx} 次（${fmtTime(fire)}）已過，跳過`);
      return;
    }
    scheduled++;
    setTimeout(() => runLucy(idx), delay);
  });

  if (scheduled === 0) {
    console.log(`[lucy-sched] 今日窗口已全部過了，直接等明天`);
  }

  scheduleTomorrow();
}

// ── 啟動 ─────────────────────────────────────────────────────────────────────

console.log(`[lucy-sched] 啟動 — 窗口 ${WINDOW_START_H}:${String(WINDOW_START_M).padStart(2,'0')}–${WINDOW_END_H}:${String(WINDOW_END_M).padStart(2,'0')} Taipei，每日 2 次，最少間隔 ${MIN_GAP_MIN} 分`);
scheduleDay();
