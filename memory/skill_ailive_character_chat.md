---
name: 與 ailive 角色對話的 SOP（CLI 版）
description: 從 Code CLI 正確呼叫 ailive /api/dialogue，用 SSE 串流讀取角色回應
type: feedback
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
## 根本原因

`/api/dialogue` 是 **SSE 串流**（Server-Sent Events），不是一般 JSON response。
用普通 curl 不加 `-N` → 緩衝 → 空 body / timeout。

## 正確指令模板

```bash
curl -s -N --max-time 120 -X POST "https://ailive-platform.vercel.app/api/dialogue" \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "CHARACTER_ID",
    "userId": "adam-zhu",
    "message": "你的問題"
  }' \
  | python3 -c "
import sys, json
text = ''
for line in sys.stdin:
    line = line.strip()
    if not line.startswith('data: '): continue
    try:
        ev = json.loads(line[6:])
        if ev.get('type') == 'text':
            text += ev.get('content', '')
        elif ev.get('type') == 'done':
            break
    except: pass
print(text if text else '[empty]')
"
```

**關鍵旗標：**
- `-N` — 禁止 curl 緩衝，逐行輸出（沒有這個 = 等到天荒地老）
- `--max-time 120` — 留夠時間讓 LLM 生成（維平均 30-60s）
- Python 解析 SSE：每行 `data: {...}` → `type=text` 累積內容，`type=done` 停止

## 常用角色 ID

| 角色 | characterId |
|------|------------|
| 維（設計 / 靈魂代碼）| `CXRsGGZU4WHrqV9hVJ9n` |
| 奧（策略書 / 規劃）| `pEWC5m2MOddyGe9uw0u0` |

其他 ID：`curl -s "https://ailive-platform.vercel.app/api/characters" | python3 -c "import sys,json;[print(c['id'],c['name']) for c in json.load(sys.stdin).get('characters',[])]"`

## 使用時機

- 需要讓 ailive 角色「設計靈魂代碼」→ 找 維
- 需要讓角色「寫策略書 / 規劃書」→ 用 /api/specialist/strategy（非串流，更穩）
- 需要讓角色「即興回應 / 諮詢」→ 用本 SOP 打 /api/dialogue

## Why / 今天的教訓（2026-05-02）

第一次打法：curl 無 -N → 空回應
第二次打法：加 --max-time 10 但還是沒 -N → timeout
第三次才看 chat/[id]/page.tsx 源碼，發現 getReader() + SSE → 用對方法，維正常回應。

**先看源碼，不猜 API 格式。**
