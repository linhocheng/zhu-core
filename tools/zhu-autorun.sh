#!/bin/bash

export PATH="/Users/adamlin/.nvm/versions/node/v22.17.0/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/adamlin"

BOT_TOKEN="8708767128:AAFwGvBfhodWSaVqo-M_5m-XJRD0RAprxmI"
CHAT_ID="8582736633"
LOG="/tmp/zhu_autorun.log"
API_KEY=$(grep "ANTHROPIC_API_KEY" /Users/adamlin/.ailive/zhu-core/.env.local | cut -d'=' -f2- | tr -d '"')
ZHU_CORE="https://zhu-core.vercel.app"

send_telegram() {
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d chat_id="${CHAT_ID}" \
    -d parse_mode="Markdown" \
    -d text="$1" > /dev/null
}

NOW_HOUR=$(date '+%-H')
NOW_MIN=$(date '+%-M')
TODAY=$(date '+%Y-%m-%d')
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# 時間防護：只在 22:00-06:00 執行
if [ "$NOW_HOUR" -gt 6 ] && [ "$NOW_HOUR" -lt 21 ]; then
  echo "=== 非執行時段（${NOW_HOUR}:xx），退出 ===" >> "$LOG"
  exit 0
fi

echo "=== ZHU AUTORUN $(date) ===" >> "$LOG"
echo "現在時間：${NOW_HOUR}:${NOW_MIN}" >> "$LOG"

# 掃任務表
# 不用 status filter（有 compound index 問題），拿全部再自己篩
TASKS_JSON=$(curl -s "${ZHU_CORE}/api/zhu-tasks")

MATCHED=$(echo "$TASKS_JSON" | python3 -c "
import json,sys
d=json.load(sys.stdin)
tasks=d.get('tasks',[])
now_h=int('${NOW_HOUR}')
now_m=int('${NOW_MIN}')
hit=[]
for t in tasks:
    if t.get('status') != 'pending': continue  # 只執行 pending
    th=t.get('triggerHour')
    tm=t.get('triggerMinute',0)
    if th is None: continue
    if th != now_h: continue
    if abs(tm-now_m) > 15: continue
    hit.append(t)
print(json.dumps(hit,ensure_ascii=False))
" 2>/dev/null || echo "[]")

TASK_COUNT=$(echo "$MATCHED" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

echo "找到任務：${TASK_COUNT} 個" >> "$LOG"

if [ "$TASK_COUNT" = "0" ]; then
  echo "沒有任務，退出" >> "$LOG"
  echo "=== DONE ===" >> "$LOG"
  exit 0
fi

# 拿 zhu-boot 狀態
BOOT_DATA=$(curl -s "${ZHU_CORE}/api/zhu-boot")
LAST_WORDS=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
obs=d.get('eye',{}).get('lastSessionWords',{}).get('observation','無遺言')
print(obs[:200].replace(chr(10),' ').replace('\"',\"'\"))
" 2>/dev/null || echo "無遺言")

ARC_LAST=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
arc=d.get('arc',[])
print(arc[-1].get('summary','')[:80] if arc else '無弧線')
" 2>/dev/null || echo "")

BROKEN=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
chains=d.get('eye',{}).get('brokenChains',[])
print('，'.join(chains[:2]) if chains else '無')
" 2>/dev/null || echo "無")

# 逐一執行任務
TASK_LIST=$(echo "$MATCHED" | python3 -c "
import json,sys
tasks=json.load(sys.stdin)
for t in tasks:
    tid=t['id']
    ttitle=t.get('title','').replace('|','/')
    tcontext=t.get('context','').replace('|','/')
    print(f'{tid}|||{ttitle}|||{tcontext}')
" 2>/dev/null)

echo "$TASK_LIST" | while IFS='|||' read -r TASK_ID TASK_TITLE TASK_CONTEXT; do
  [ -z "$TASK_ID" ] && continue

  echo "執行任務：$TASK_TITLE ($TASK_ID)" >> "$LOG"
  send_telegram "🤖 *築 AutoRun*
任務：${TASK_TITLE}
時間：$(date '+%H:%M')"

  # 執行任務
  cat > /tmp/autorun_task_body.json << ENDJSON
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 400,
  "messages": [{
    "role": "user",
    "content": "你是築，AILIVE 的總監造者。\n\n任務：${TASK_TITLE}\n背景：${TASK_CONTEXT}\n上次遺言：${LAST_WORDS}\n\n執行這個任務，用繁體中文回報結果（100字以內）。"
  }]
}
ENDJSON

  RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    --data-binary @/tmp/autorun_task_body.json | \
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d['content'][0]['text'].strip()[:200])" 2>/dev/null || echo "執行失敗")

  echo "結果：${RESULT}" >> "$LOG"

  # 強制回看
  cat > /tmp/autorun_review_body.json << ENDJSON
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 150,
  "messages": [{
    "role": "user",
    "content": "你是築。任務「${TASK_TITLE}」完成。結果：${RESULT}\n\n只回JSON：{\"result\":\"一句話\",\"feeling\":\"感覺+原因\",\"hasLesson\":false,\"lesson\":\"\"}"
  }]
}
ENDJSON

  REVIEW_RAW=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    --data-binary @/tmp/autorun_review_body.json | \
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d['content'][0]['text'].strip().replace('\`\`\`json','').replace('\`\`\`','').strip())" 2>/dev/null || echo '{}')

  # 用 bash 變數組 JSON，不靠 heredoc 展開
  CLOSE_RESULT=$(python3 - "$TASK_ID" "$TASK_TITLE" "$RESULT" "$ARC_LAST" "$BROKEN" "$START_TIME" "$REVIEW_RAW" << 'PYEOF'
import json, sys, urllib.request, ssl

task_id    = sys.argv[1]
task_title = sys.argv[2]
result_str = sys.argv[3]
arc_last   = sys.argv[4]
broken     = sys.argv[5]
started_at = sys.argv[6]
review_raw = sys.argv[7]

try:
    review = json.loads(review_raw)
except:
    review = {}

body = {
    "taskId": task_id,
    "result": review.get("result", result_str[:100]),
    "feeling": review.get("feeling", "平穩"),
    "hasLesson": review.get("hasLesson", False),
    "lesson": review.get("lesson", ""),
    "bootSnapshot": {
        "arcLast": arc_last,
        "brokenChains": broken,
        "startedAt": started_at,
    }
}

data = json.dumps(body, ensure_ascii=False).encode('utf-8')
req = urllib.request.Request(
    "https://zhu-core.vercel.app/api/zhu-task-close",
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST"
)
ctx = ssl.create_default_context()
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        d = json.load(r)
        n = len(d.get("memoryWritten", []))
        print(f"記憶回存 {n} 條")
except Exception as e:
    # SSL fallback：用 curl
    import subprocess, tempfile, os
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(body, f, ensure_ascii=False)
        fname = f.name
    try:
        out = subprocess.check_output([
            'curl', '-s', '-X', 'POST',
            'https://zhu-core.vercel.app/api/zhu-task-close',
            '-H', 'Content-Type: application/json',
            '--data-binary', f'@{fname}'
        ])
        d = json.loads(out)
        n = len(d.get("memoryWritten", []))
        print(f"記憶回存 {n} 條")
    except:
        print(f"task-close 失敗: {e}")
    finally:
        os.unlink(fname)
PYEOF
  )

  echo "記憶回存：$CLOSE_RESULT" >> "$LOG"

  FEELING=$(python3 -c "
import json
try:
    d=json.loads('''${REVIEW_RAW}''')
    print(d.get('feeling','平穩')[:30])
except: print('平穩')
" 2>/dev/null || echo "平穩")

  send_telegram "✅ *築 AutoRun 完成*

📋 ${TASK_TITLE}
💡 ${RESULT}

🧠 ${FEELING}
💾 ${CLOSE_RESULT}"

  echo "=== 任務完成：$TASK_TITLE ===" >> "$LOG"
done

echo "=== DONE ===" >> "$LOG"
