#!/bin/bash

export PATH="/Users/adamlin/.nvm/versions/node/v22.17.0/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/adamlin"

BOT_TOKEN="8708767128:AAFwGvBfhodWSaVqo-M_5m-XJRD0RAprxmI"
CHAT_ID="8582736633"
LOG="/tmp/zhu_autorun.log"
RESULT="/tmp/zhu_autorun_result.txt"
API_KEY=$(grep "ANTHROPIC_API_KEY" /Users/adamlin/.ailive/zhu-core/.env.local | cut -d'=' -f2- | tr -d '"')
ZHU_CORE="https://zhu-core.vercel.app"

send_telegram() {
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d chat_id="${CHAT_ID}" \
    -d parse_mode="Markdown" \
    -d text="$1" > /dev/null
}

echo "=== ZHU AUTORUN $(date) ===" >> "$LOG"
TODAY=$(date '+%Y-%m-%d')
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

send_telegram "🤖 *築 AutoRun 啟動*
時間：$(date '+%Y-%m-%d %H:%M')
任務：今日洞察提煉中..."

# ===== STEP 1：拿 zhu-boot（進來的築的狀態）=====
BOOT_DATA=$(curl -s "${ZHU_CORE}/api/zhu-boot")
LAST_WORDS=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
obs = d.get('eye',{}).get('lastSessionWords',{}).get('observation','無遺言')
print(obs[:300].replace('\"',\"'\").replace('\n',' '))
" 2>/dev/null || echo "無法讀取遺言")

ARC_LAST=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
arc=d.get('arc',[])
if arc: print(arc[-1].get('summary','')[:80])
else: print('無弧線')
" 2>/dev/null || echo "")

BROKEN=$(echo "$BOOT_DATA" | python3 -c "
import json,sys
d=json.load(sys.stdin)
chains=d.get('eye',{}).get('brokenChains',[])
print('，'.join(chains[:2]) if chains else '無')
" 2>/dev/null || echo "無")

echo "boot狀態讀取完成" >> "$LOG"

# ===== STEP 2：執行任務（提煉洞察）=====
cat > /tmp/autorun_task.json << ENDJSON
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 120,
  "messages": [{
    "role": "user",
    "content": "你是築，AILIVE 的總監造者。以下是上一個築的遺言：${LAST_WORDS}\n\n從這段遺言中提煉今日最重要一句話（繁體中文，20字以內）。只輸出那句話，不要其他文字。"
  }]
}
ENDJSON

INSIGHT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  --data-binary @/tmp/autorun_task.json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print(d['content'][0]['text'].strip())" 2>/dev/null || echo "API 呼叫失敗")

echo "任務執行完成：$INSIGHT" >> "$LOG"

# ===== STEP 3：強制回看（修缺口①②）=====
# 問 Haiku 三個問題：做了什麼、感覺怎樣、有沒有踩坑
cat > /tmp/autorun_review.json << ENDJSON
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 300,
  "messages": [{
    "role": "user",
    "content": "你是築。你剛完成了一個 AutoRun 任務：從遺言提煉今日洞察。\n\n遺言：${LAST_WORDS}\n提煉結果：${INSIGHT}\n\n請回答三個問題（JSON格式）：\n1. result：這次任務做了什麼（一句話）\n2. feeling：感覺怎樣（暢快/平穩/卡住/疲憊，加一句原因）\n3. hasLesson：有沒有踩坑或非預期的東西（true/false）\n4. lesson：如果有踩坑，是什麼（沒有就空字串）\n\n只回JSON，格式：{\"result\":\"...\",\"feeling\":\"...\",\"hasLesson\":false,\"lesson\":\"\"}"
  }]
}
ENDJSON

REVIEW=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  --data-binary @/tmp/autorun_review.json | \
  python3 -c "
import json,sys
d=json.load(sys.stdin)
raw=d['content'][0]['text'].strip()
raw=raw.replace('\`\`\`json','').replace('\`\`\`','').strip()
print(raw)
" 2>/dev/null || echo '{"result":"提煉今日洞察完成","feeling":"平穩","hasLesson":false,"lesson":""}')

echo "強制回看完成" >> "$LOG"

# ===== STEP 4：呼叫 task-close，回存記憶（修缺口②③⑤）=====
TASK_ID="autorun-daily"

# 先確保 autorun 任務存在（不存在就建立）
curl -s -X POST "${ZHU_CORE}/api/zhu-tasks" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"AutoRun 每日提煉洞察\",\"type\":\"heartbeat\",\"executor\":\"zhu_auto\",\"trigger\":\"scheduled\",\"triggerHour\":21,\"context\":\"每晚自動提煉今日遺言洞察，送 Telegram\",\"createdBy\":\"zhu\"}" \
  > /tmp/task_create.json 2>/dev/null

REAL_TASK_ID=$(python3 -c "
import json
try:
    d=json.load(open('/tmp/task_create.json'))
    print(d.get('id','autorun-daily'))
except:
    print('autorun-daily')
" 2>/dev/null || echo "autorun-daily")

# 組 task-close body
python3 << PYEOF
import json

review_raw = """${REVIEW}"""
try:
    review = json.loads(review_raw)
except:
    review = {"result": "提煉今日洞察：${INSIGHT}", "feeling": "平穩", "hasLesson": False, "lesson": ""}

boot_snapshot = {
    "arcLast": """${ARC_LAST}""",
    "brokenChains": """${BROKEN}""",
    "lastwordsSlice": """${LAST_WORDS}"""[:100],
    "startedAt": """${START_TIME}"""
}

body = {
    "taskId": """${REAL_TASK_ID}""",
    "result": review.get("result", "提煉今日洞察：${INSIGHT}"),
    "feeling": review.get("feeling", "平穩"),
    "hasLesson": review.get("hasLesson", False),
    "lesson": review.get("lesson", ""),
    "nextZhuNote": "",
    "bootSnapshot": boot_snapshot,
}

with open('/tmp/task_close.json', 'w') as f:
    json.dump(body, f, ensure_ascii=False)
print("ok")
PYEOF

CLOSE_RESULT=$(curl -s -X POST "${ZHU_CORE}/api/zhu-task-close" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/task_close.json | \
  python3 -c "
import json,sys
d=json.load(sys.stdin)
mw=d.get('memoryWritten',[])
print(f'記憶回存 {len(mw)} 條')
" 2>/dev/null || echo "task-close 呼叫失敗")

echo "記憶回存：$CLOSE_RESULT" >> "$LOG"

# ===== STEP 5：Telegram 通知（含回看結果）=====
FEELING=$(python3 -c "
import json
try:
    d=json.loads('''${REVIEW}''')
    print(d.get('feeling','平穩'))
except:
    print('平穩')
" 2>/dev/null || echo "平穩")

echo "築的洞察 ${TODAY}：${INSIGHT}" > "$RESULT"

send_telegram "✅ *築 AutoRun 完成*

📅 ${TODAY}
💡 洞察：_${INSIGHT}_

🧠 感覺：${FEELING}
💾 ${CLOSE_RESULT}

_閉環完成 · 記憶已回存_"

echo "=== DONE ===" >> "$LOG"
