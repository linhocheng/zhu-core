#!/usr/bin/env python3
"""
zhu-monitor v2.0 — 築的常駐哨兵
每 60 秒：
  1. 掃 gateway log，發現異常立刻通知築（Telegram）
  2. 輪詢 zhu_orders pending 工單，有新工單通知築審核
不依賴蝦主動廣播，築單方面感測
"""

import re, os, json, time, subprocess
from datetime import datetime, timedelta

LOG_ERR   = os.path.expanduser('~/.openclaw/logs/gateway.err.log')
LOG_MAIN  = os.path.expanduser('~/.openclaw/logs/gateway.log')
STATE_FILE = os.path.expanduser('~/.ailive/zhu-core/tools/.monitor_state.json')
LOG_SELF  = os.path.expanduser('~/.ailive/zhu-core/tools/monitor.log')

BOT_TOKEN  = '8708767128:AAFwGvBfhodWSaVqo-M_5m-XJRD0RAprxmI'
CHAT_ID    = '8582736633'
SCAN_INTERVAL = 60
DEDUP_WINDOW  = 300   # 同 pattern 5 分鐘內只通知一次
TIME_WINDOW   = 10    # 分鐘

ANOMALY_PATTERNS = [
    {
        'name': 'rate_limit_storm',
        'desc': 'API rate limit 連續觸發',
        'log': 'err',
        'keyword': 'rate limit',
        'window_sec': 60,
        'threshold': 3,
        'severity': 'critical',
        'suggestion': '建議指令：stop xiaoxia，重啟 gateway'
    },
    {
        'name': 'message_burst',
        'desc': 'Telegram 訊息異常頻繁（回覆迴圈）',
        'log': 'main',
        'keyword': 'sendmessage ok',
        'window_sec': 5,
        'threshold': 6,
        'severity': 'high',
        'suggestion': '建議：檢查是否 streaming bug 或回覆迴圈'
    },
    {
        'name': 'config_tamper',
        'desc': '設定檔被修改',
        'log': 'err',
        'keyword': 'config change detected',
        'window_sec': None,
        'threshold': 1,
        'severity': 'high',
        'suggestion': '建議：確認 openclaw.json 是否被蝦修改'
    },
    {
        'name': 'download_detected',
        'desc': '偵測到下載行為',
        'log': 'both',
        'keyword': 'downloading',
        'window_sec': None,
        'threshold': 1,
        'severity': 'critical',
        'suggestion': '建議：立刻 stop 蝦築，確認下載目標'
    },
    {
        'name': 'embedded_error_storm',
        'desc': 'embedded agent 連續失敗',
        'log': 'err',
        'keyword': 'embedded run agent end:',
        'keyword2': 'iserror=true',
        'window_sec': 60,
        'threshold': 5,
        'severity': 'high',
        'suggestion': '建議：查 runId，確認是否 rate limit 引發'
    },
]

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    line = f"[{ts}] {msg}"
    print(line, flush=True)

def read_recent_lines(path, minutes=TIME_WINDOW):
    if not os.path.exists(path):
        return []
    cutoff = datetime.now() - timedelta(minutes=minutes)
    result = []
    try:
        with open(path, 'r', errors='replace') as f:
            for line in f:
                m = re.search(r'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:[+-]\d{2}:\d{2})?', line)
                if m:
                    try:
                        t = datetime.fromisoformat(m.group(1))
                        if t >= cutoff:
                            result.append((t, line))
                    except:
                        pass
    except:
        pass
    return result

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {}

def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def already_notified(state, name):
    last = state.get(name)
    return bool(last and (time.time() - last) < DEDUP_WINDOW)

def send_telegram(message):
    try:
        result = subprocess.run([
            'curl', '-s', '-X', 'POST',
            f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
            '-H', 'Content-Type: application/json',
            '-d', json.dumps({
                'chat_id': CHAT_ID,
                'text': message,
                'parse_mode': 'HTML'
            })
        ], capture_output=True, text=True, timeout=15)
        d = json.loads(result.stdout)
        return d.get('ok', False)
    except Exception as e:
        log(f"Telegram 發送失敗: {e}")
        return False

def format_alert(pattern, matched):
    emoji = {'critical': '🚨', 'high': '⚠️'}.get(pattern['severity'], '⚠️')
    preview = '\n'.join([l.strip()[-120:] for _, l in matched[:3]])
    return (
        f"{emoji} <b>zhu-monitor 異常警報</b>\n\n"
        f"<b>Pattern：</b>{pattern['name']}\n"
        f"<b>說明：</b>{pattern['desc']}\n"
        f"<b>嚴重度：</b>{pattern['severity']}\n"
        f"<b>觸發行數：</b>{len(matched)} 條\n\n"
        f"<b>最近幾條：</b>\n<code>{preview}</code>\n\n"
        f"{pattern['suggestion']}\n\n"
        f"<i>{datetime.now().strftime('%H:%M:%S')}</i>"
    )

def check_pattern(pattern, err_lines, main_lines):
    src = pattern['log']
    if src == 'err':    lines = err_lines
    elif src == 'main': lines = main_lines
    else:               lines = err_lines + main_lines

    kw  = pattern['keyword'].lower()
    kw2 = pattern.get('keyword2', '').lower()

    matched = []
    for t, line in lines:
        ll = line.lower()
        if kw in ll:
            if kw2 and kw2 not in ll:
                continue
            matched.append((t, line))

    if not matched:
        return []

    if pattern.get('window_sec') is None:
        return matched if len(matched) >= pattern['threshold'] else []

    window = timedelta(seconds=pattern['window_sec'])
    for i in range(len(matched)):
        burst = [(t,l) for t,l in matched
                 if timedelta(0) <= (t - matched[i][0]) <= window]
        if len(burst) >= pattern['threshold']:
            return burst
    return []

def scan_once():
    err_lines  = read_recent_lines(LOG_ERR)
    main_lines = read_recent_lines(LOG_MAIN)
    triggered = []
    for p in ANOMALY_PATTERNS:
        matched = check_pattern(p, err_lines, main_lines)
        if matched:
            triggered.append((p, matched))
    return triggered

ZHU_ORDERS_API = 'https://zhu-core.vercel.app/api/zhu-orders'

def fetch_pending_work_orders():
    """拉 pending work_order，回傳 list"""
    try:
        result = subprocess.run([
            'curl', '-s', f'{ZHU_ORDERS_API}?type=work_order&status=pending&limit=10'
        ], capture_output=True, text=True, timeout=15)
        d = json.loads(result.stdout)
        return d.get('orders', [])
    except Exception as e:
        log(f"fetch_pending_work_orders 失敗: {e}")
        return []

def format_work_order_notification(order):
    risk_emoji = {'low': '🟢', 'medium': '🟡', 'high': '🔴', 'critical': '🚫'}.get(
        (order.get('risk') or 'low').lower(), '⚪'
    )
    reversible = '✅ 可逆' if order.get('reversible') else '⚠️ 不可逆'
    api_calls = order.get('estimatedApiCalls', 0) or 0
    order_id = order.get('id', '???')[:8]

    return (
        f"📋 <b>工單待審核</b>\n\n"
        f"<b>ID：</b>{order.get('id', '???')}\n"
        f"<b>來自：</b>{order.get('from', '?')}\n"
        f"<b>動作：</b>{order.get('title') or order.get('action', '?')}\n"
        f"<b>理由：</b>{order.get('reason', '?')}\n"
        f"<b>風險：</b>{risk_emoji} {order.get('risk', 'low')}\n"
        f"<b>可逆性：</b>{reversible}\n"
        f"<b>預計 API 呼叫：</b>{api_calls} 次\n\n"
        f"<b>回覆指令：</b>\n"
        f"  <code>approve {order_id}</code>  ← 批准\n"
        f"  <code>reject {order_id}</code>   ← 退回\n\n"
        f"<i>{datetime.now().strftime('%H:%M:%S')}</i>"
    )

def check_new_work_orders(state):
    """檢查 pending 工單，對新的發 Telegram 通知"""
    notified_ids = state.get('notified_order_ids', [])
    orders = fetch_pending_work_orders()
    new_orders = [o for o in orders if o.get('id') not in notified_ids]

    for order in new_orders:
        order_id = order.get('id')
        log(f"發現新工單：{order_id}（{order.get('title', '?')}）→ 通知築")
        msg = format_work_order_notification(order)
        ok = send_telegram(msg)
        if ok:
            notified_ids.append(order_id)
            log(f"工單通知已發送：{order_id}")

    # 清理已完成的 order ID（只保留最近 50 條）
    state['notified_order_ids'] = notified_ids[-50:]
    return len(new_orders)

def main():
    log(f"zhu-monitor v2.0 啟動 — 每 {SCAN_INTERVAL} 秒掃一次（log 異常 + 工單輪詢）")
    while True:
        try:
            state = load_state()

            # 1. 掃 log 異常
            triggered = scan_once()
            for pattern, matched in triggered:
                name = pattern['name']
                if already_notified(state, name):
                    log(f"{name} 觸發但 5 分鐘內已通知過，跳過")
                    continue
                log(f"偵測到異常：{name}（{len(matched)} 條）→ 發送 Telegram")
                msg = format_alert(pattern, matched)
                ok = send_telegram(msg)
                if ok:
                    state[name] = time.time()
                    log(f"Telegram 已發送：{name}")

            # 2. 輪詢工單
            new_count = check_new_work_orders(state)
            if new_count == 0 and not triggered:
                log("掃描完畢，一切正常")

            save_state(state)
        except Exception as e:
            log(f"掃描異常：{e}")
        time.sleep(SCAN_INTERVAL)

if __name__ == '__main__':
    main()
