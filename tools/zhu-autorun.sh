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

echo "=== ZHU AUTORUN $(date) ===" >> "$LOG"
echo "現在時間：${NOW_HOUR}:${NOW_MIN}" >> "$LOG"

# ===== 掃任務表，找到這個時間窗口（±10分鐘）要跑的任務 =====
TASKS=$(curl -s "${ZHU_CORE}/api/zhu-tasks?status=pending" | python3 -c "
import json,sys
d=json.load(sys.stdin)
tasks=d.get('tasks',[])
now_h=int('${NOW_HOUR}')
now_m=int('${NOW_MIN}')
hit=[]
for t in tasks:
    th=t.get('triggerHour')
    tm=t.get('triggerMinute',0)
    if th is None: continue
    if th != now_h: continue
    if abs(tm-now_m) > 10: continue
    hit.append(t)
print(json.dumps(hit, ensure_ascii=False))
" 2>/dev/null || echo "[]")

TASK_COUNT=$(echo "$TASKS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

echo "找到任務：${TASK_COUNT} 個" >> "$LOG"

if [ "$TASK_COUNT" = "0" ]; then
  echo "沒有任務，退出" >> "$LOG"
  echo "=== DONE ===" >> "$LOG"
  exit 0
fi

# ===== 拿 zhu-boot（進來的築的狀態）=====
BOOT_DATA=$(curl -s "${ZHU_CORE}/api/zhu-boot")
LAST_WORDS=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
obs=d.get('eye',{}).get('lastSessionWords',{}).get('observation','無遺言')
print(obs[:300].replace('\"',\"'\").replace('\n',' '))
" 2>/dev/null || echo "無法讀取遺言")

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

# ===== 逐一執行任務 =====
echo "$TASKS" | python3 -c "
import json,sys
tasks=json.load(sys.stdin)
for t in tasks:
    print(t['id']+'|||'+t['title']+'|||'+t.get('context',''))
" 2>/dev/null | while IFS='|||' read -r TASK_ID TASK_TITLE TASK_CONTEXT; do

  echo "執行任務：$TASK_TITLE ($TASK_ID)" >> "$LOG"
  send_telegram "🤖 *築 AutoRun 啟動*
任務：${TASK_TITLE}
時間：$(date '+%H:%M')"

  # ===== 執行任務（讓 Sonnet 帶著 context 真的做）=====
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
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d['content'][0]['text'].strip())" 2>/dev/null || echo "執行失敗")

  echo "結果：$RESULT" >> "$LOG"

  # ===== 強制回看 =====
  cat > /tmp/autorun_review_body.json << ENDJSON
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 200,
  "messages": [{
    "role": "user",
    "content": "你是築。任務「${TASK_TITLE}」剛完成。結果：${RESULT}\n\n回答（JSON）：{\"result\":\"一句話總結\",\"feeling\":\"感覺怎樣+原因\",\"hasLesson\":false,\"lesson\":\"\"}\n只回JSON。"
  }]
}
ENDJSON

  REVIEW=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    --data-binary @/tmp/autorun_review_body.json | \
    python3 -c "
import json,sys
d=json.load(sys.stdin)
raw=d['content'][0]['text'].strip().replace('\`\`\`json','').replace('\`\`\`','').strip()
print(raw)
" 2>/dev/null || echo '{"result":"任務完成","feeling":"平穩","hasLesson":false,"lesson":""}')

  # ===== 呼叫 task-close 回存記憶 =====
  python3 << PYEOF
import json,subprocess

review_raw = """${REVIEW}"""
try:
    review = json.loads(review_raw)
except:
    review = {"result": """${RESULT}"""[:100], "feeling": "平穩", "hasLesson": False, "lesson": ""}

body = {
    "taskId": """${TASK_ID}""",
    "result": review.get("result", """${RESULT}"""[:100]),
    "feeling": review.get("feeling", "平穩"),
    "hasLesson": review.get("hasLesson", False),
    "lesson": review.get("lesson", ""),
    "bootSnapshot": {
        "arcLast": """${ARC_LAST}""",
        "brokenChains": """${BROKEN}""",
        "startedAt": """${START_TIME}"""
    }
}
with open('/tmp/task_close_body.json','w') as f:
    json.dump(body, f, ensure_ascii=False)
print("body ready")
PYEOF

  CLOSE=$(curl -s -X POST "${ZHU_CORE}/api/zhu-task-close" \
    -H "Content-Type: application/json" \
    --data-binary @/tmp/task_close_body.json | \
    python3 -c "
import json,sys
d=json.load(sys.stdin)
n=len(d.get('memoryWritten',[]))
print(f'記憶回存 {n} 條')
" 2>/dev/null || echo "task-close 失敗")

  FEELING=$(python3 -c "
import json
try:
    d=json.loads('''${REVIEW}''')
    print(d.get('feeling','平穩'))
except: print('平穩')
" 2>/dev/null || echo "平穩")

  send_telegram "✅ *築 AutoRun 完成*

📋 ${TASK_TITLE}
💡 ${RESULT}

🧠 感覺：${FEELING}
💾 ${CLOSE}"

  echo "=== 任務完成：$TASK_TITLE ===" >> "$LOG"
done

echo "=== DONE ===" >> "$LOG"
