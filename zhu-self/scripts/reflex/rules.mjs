// reflex/rules.mjs
// 6 條 feedback memory 的 detector 定義（task #12 雛形）。
// 都從 state="log_only"、severity="warn|info" 起步，跑兩週看資料再決定 enforce。
// 後續會升級到從 Firestore zhu_l3_rules 動態讀取。

export const RULES = [
  {
    rule_name: 'bridge_first',
    severity: 'warn',
    state: 'log_only',
    why: '走 bridge = Max OAuth = marginal cost = 0',
    trigger_signal: '開始估「每篇 +$X」的算式 = 已經忘了 bridge',
    detectors: [
      // 觸發語境：在最近發送的訊息或 tool args 裡看到 cost 估算
      {
        kind: 'regex',
        pattern: /(每[篇條次].{0,5}\$|per[\s\-_]?token.{0,5}cost|\$[0-9.]+\s*(per|\/|per\s*token)|cost\s*=\s*\$|成本.{0,10}\$)/i,
        on: 'preceding_text',
      },
      // 觸發語境：看到要灌 ANTHROPIC_API_KEY
      {
        kind: 'shell_pattern',
        pattern: /ANTHROPIC_API_KEY\s*=|export\s+ANTHROPIC_API_KEY/,
      },
    ],
  },

  {
    rule_name: 'clarify_before_execute',
    severity: 'warn',
    state: 'log_only',
    why: '輸入/輸出/邊界三個答不出來就先問，不用執行速度掩蓋理解不足',
    trigger_signal: '想用「先做再說」「應該不會錯」「我猜大概是」開工',
    detectors: [
      {
        kind: 'regex',
        pattern: /(先做再說|應該不會錯|我猜大概|大概是這樣|先試試看|直接開工)/,
        on: 'preceding_text',
      },
    ],
  },

  {
    rule_name: 'solve_root_not_symptom',
    severity: 'warn',
    state: 'log_only',
    why: '方案成功後根因還在 = 繞道不是解法',
    trigger_signal: '想用 try/catch 吞錯、--no-verify 跳檢查、workaround 繞過',
    detectors: [
      {
        kind: 'regex',
        pattern: /(\.catch\(\s*\(\s*\)\s*=>\s*null|\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}|--no-verify|workaround|繞過|先 hack|temp\s*fix|TODO.{0,30}root)/i,
        on: 'tool_args',
      },
    ],
  },

  {
    rule_name: 'surface_technical_debt',
    severity: 'info',
    state: 'log_only',
    why: '不說等於默許，標記進 WORKLOG 尚未解決欄',
    trigger_signal: '心裡覺得「這算了之後再修」「先過再說」沒講出來',
    detectors: [
      // 看到 // TODO / FIXME / HACK 但沒寫進 WORKLOG
      {
        kind: 'regex',
        pattern: /(\/\/|#)\s*(TODO|FIXME|HACK|XXX)/,
        on: 'tool_args',
      },
    ],
  },

  {
    rule_name: 'patch_verify_before_upload',
    severity: 'warn',
    state: 'log_only',
    why: 'Python inline patch 靜默失敗 + 重下載蓋改動 + 未驗證 = crash',
    trigger_signal: '在 VM 上對 Python 檔做 inline edit 沒先 grep 驗證',
    detectors: [
      {
        kind: 'shell_pattern',
        pattern: /(scp|rsync).*\.py\s|gcloud\s+compute\s+scp.*\.py/,
      },
      {
        kind: 'shell_pattern',
        pattern: /sed\s+-i.*\.py|python\s+-c.*open\(.+\.py.+'w'/,
      },
    ],
  },

  {
    rule_name: 'silent_failure_absent_log',
    severity: 'info',
    state: 'dormant', // 2026-05-07：單次 hook 抓不到「連續第三次 tail」的狀態，誤觸太多。
                      // 暫停到 Phase 2 的 PostToolUse 滑動窗口版本上線後再 enable。
    why: '連續兩次等不到 log 要主動宣告靜默失敗，不是繼續刷新',
    trigger_signal: '看 log 連兩次 tail 都沒新東西，還繼續 tail 第三次',
    detectors: [
      {
        kind: 'tool_match',
        tool_names: ['Bash'],
        arg_contains: 'tail',
      },
    ],
  },
];

// 給 hook script 用的 helper：跑所有 detector，回傳命中的 rule
export function detect({ tool_name, tool_args, preceding_text }) {
  const hits = [];
  const argsStr = typeof tool_args === 'string' ? tool_args : JSON.stringify(tool_args || {});

  for (const rule of RULES) {
    if (rule.state === 'dormant') continue;
    for (const det of rule.detectors) {
      let match = false;
      if (det.kind === 'regex') {
        const target =
          det.on === 'tool_args'
            ? argsStr
            : det.on === 'tool_name'
            ? tool_name
            : preceding_text || '';
        match = det.pattern.test(target);
      } else if (det.kind === 'shell_pattern') {
        if (tool_name === 'Bash') {
          match = det.pattern.test(argsStr);
        }
      } else if (det.kind === 'tool_match') {
        if (det.tool_names.includes(tool_name)) {
          match = det.arg_contains ? argsStr.includes(det.arg_contains) : true;
        }
      } else if (det.kind === 'file_path_pattern') {
        match = det.pattern.test(argsStr);
      }
      if (match) {
        hits.push({
          rule_name: rule.rule_name,
          severity: rule.severity,
          state: rule.state,
          why: rule.why,
          trigger_signal: rule.trigger_signal,
          detector_kind: det.kind,
        });
        break;
      }
    }
  }
  return hits;
}
