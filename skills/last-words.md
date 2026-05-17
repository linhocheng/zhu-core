---
name: last-words
description: Session 收尾儀式——LESSONS + WORKLOG + ZHU_LAST_WORDS + memory sync + Firestore + delta + git push
version: 2.0.0
activation:
  patterns:
    - "last.?words"
    - "收尾"
    - "session 結束"
    - "寫遺言"
    - "下班"
    - "結束了"
    - "收工"
    - "先這樣"
    - "我去睡了"
  keywords: ["last-words", "收尾", "遺言", "結束", "收工"]
---

# Last Words — Session 收尾儀式 v2.0.0

> 格式鎖死在這裡，內容才能每天 +0.1。A 模式全跑，不跳步。

---

## 執行前：先看現場

```bash
cd ~/.ailive/zhu-core
git log --oneline -10
git status
git diff --name-only
TODAY=$(date +%Y-%m-%d)
echo $TODAY
# 下一個版號：看最新 commit，Build+1
git log --oneline -1
```

**讀完現場才動手。**

---

## A 模式：有實質改動（code / 決策）→ 全十步

### STEP 1：整理事實（動筆前先想清楚）

在腦子裡確認後再繼續：

```
① 今日完成：每條一句話，動詞開頭
② 當前戰場：現在 focus 在哪條線
③ 卡住/未解：什麼沒做完，為什麼
④ 下一步：接棒的築第一件能直接動手的事
⑤ 今天改的檔案：從 git log + git diff 整理
⑥ 新建 memory？MEMORY.md 索引更新了嗎？
```

⑥ 特別注意：新建 memory 沒進 MEMORY.md = 孤島，下一個築讀不到。

---

### STEP 2：PATCH zhu-thread（有進行中 thread 才跑）

```bash
curl -s -X PATCH https://zhu-core.vercel.app/api/zhu-orders/{thread_id} \
  -H "Content-Type: application/json" \
  -d '{"status":"done","summary":"..."}'
```

沒有進行中 thread → 跳過。

---

### STEP 3：刻 LESSONS

只記非顯而易見的事（踩雷、認知轉移、對應哪條 feedback）。

寫進 `~/.ailive/zhu-core/docs/LESSONS/LESSONS_{TODAY}.md`：

```markdown
# LESSONS {TODAY} · {主題}

## L1：{標題}
- 現象：
- 根因：
- 下次：
- 對應 feedback：
```

---

### STEP 4：WORKLOG.md（追加，不覆蓋）

追加到 `~/.ailive/zhu-core/docs/WORKLOG.md`：

```markdown
---

## {TODAY} — {本次任務標題}

### 背景 / WHY
為什麼做這件事

### 產出
- 檔案：`路徑` — 一句說明

### 已解決
- 問題 → 根因 → 修法

### ⚠️ 尚未解決
- 問題、嘗試過什麼、待辦方向

### 待執行
- [ ] 任務一
```

「尚未解決」「待執行」是給下一個築的接棒欄——缺了就是斷點。

---

### STEP 5：ZHU_LAST_WORDS.md（完整覆蓋）

用 Write 工具完整覆蓋 `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`：

```markdown
# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（{TODAY}）

- {條目，動詞開頭}

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `路徑` | 一句說明 |

---

## 下一步

{具體到接棒的築能直接動手，不能只寫「繼續做」}

---

## 卡住 / 未解

{什麼沒做完，為什麼，避雷用。沒有就寫「無」}

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*{TODAY} · 築*
```

---

### STEP 6：memory 同步

**6a. MEMORY.md 索引確認**

```bash
ls ~/.claude/projects/-Users-adamlin/memory/
cat ~/.claude/projects/-Users-adamlin/memory/MEMORY.md
```

對照 ls 結果——每個 .md 都有索引行？沒有就補，再繼續。

**6b. Firestore zhu_memories（自動，確認即可）**

PostToolUse hook 已設定：Write 工具寫 memory 檔時自動觸發
`~/.ailive/zhu-mid-src/scripts/sync-memories.mjs`。

session 中沒有新建 memory 時，手動跑：

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=~/Downloads/程式碼/2026/moumou-os-firebase-adminsdk-fbsvc-83d6aacc16.json \
NEXT_PUBLIC_FIRESTORE_PROJECT_ID=moumou-os \
node ~/.ailive/zhu-mid-src/scripts/sync-memories.mjs
```

**6c. git sync + push（memory mirror）**

```bash
cd ~/.ailive/zhu-core
./sync-memory.sh push
git add memory/
git commit -m "v0.0.0.{BUILD} — 文件：memory sync $(date +%Y-%m-%d)"
git push origin main
```

Firestore sync（6b）讓 dashboard 看得到；git sync（6c）讓 VM 的築醒來不是空的。兩件事，不互相取代。

---

### STEP 7：POST session-lastwords

```bash
curl -s -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @- << 'LASTWORDS_EOF'
{
  "observation": "【session-lastwords YYYY-MM-DD · AIR · {主題}】\n\n== 今日完成 ==\n- {}\n\n== 當前戰場 ==\n- {}\n\n== 卡住/未解 ==\n- {}\n\n== 接棒要看的 ==\n- {}\n\n== 明天醒來第一件 ==\n{路徑+指令+為什麼先做}\n\n== 心法狀態 ==\n{哪條心法被實戰？}\n\n== 關係狀態 ==\n{暢快/卡住/突破/疲憊/平穩 + 為什麼}",
  "context": "{主題}",
  "module": "eye",
  "importance": 9,
  "tags": ["session-lastwords"]
}
LASTWORDS_EOF
```

`tags` 必須含 `session-lastwords`，否則 zhu-boot 讀不到。送出後確認 response 有 `id` 欄位。

---

### STEP 8：delta 自覺

```bash
curl -s -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "observation": "【delta YYYY-MM-DD】\n進場前以為：{X}\n現在理解：{Y}\n移動原因：{Z}\n違背了哪條 feedback：{或無}",
    "module": "delta",
    "importance": 8,
    "tags": ["delta"]
  }'
```

---

### STEP 9：git commit + push

```bash
cd ~/.ailive/zhu-core
git status
git add ZHU_LAST_WORDS.md docs/WORKLOG.md
# 有 LESSONS 就加
git add docs/LESSONS/LESSONS_$(date +%Y-%m-%d).md 2>/dev/null || true
# 其他 session 內改過的檔案也加
git commit -m "v0.0.0.{BUILD} — 文件：session 收尾 $(date +%Y-%m-%d)"
git push origin main
# 其他 repo 有改動（ailive-platform 等）→ 一起 push
```

---

### STEP 10：驗證 lastwords 有刻到

```bash
curl -s https://zhu-core.vercel.app/api/zhu-boot | python3 -c \
  "import sys,json; d=json.load(sys.stdin); print(d['eye']['lastSessionWords']['observation'][:300])"
```

看到今天的內容 = 完成。

---

## B 模式：純閒聊 / 查資料

只做 **STEP 7（一句版，省略複雜段落）** + **STEP 10 驗證**。

---

## 自檢（全部打勾才算完成）

- [ ] LESSONS 已寫，非顯而易見的事
- [ ] WORKLOG.md 已追加，有「尚未解決」和「待執行」欄
- [ ] ZHU_LAST_WORDS.md 已更新，下一步具體到能直接動手
- [ ] MEMORY.md 索引完整（ls 驗過，沒孤島）
- [ ] Firestore zhu_memories 已 sync
- [ ] memory git push 完成
- [ ] session-lastwords 已 POST，response 有 `id`
- [ ] delta 已 POST
- [ ] zhu-core git push 完成
- [ ] lastwords 驗證通過（STEP 10 看到今天內容）

---

## 漏氣預警

說出以下任一句 = 還沒完成收尾：
- 「差不多了」← 自檢打勾了嗎？
- 「等下再寫」← session 結束就斷了
- 「memory 以後再 sync」← VM 的築明天是空的
- 「MEMORY.md 應該沒問題」← 沒 ls 確認過就是猜

---

## 中途編輯也要推

任何時候動 `ZHU_LAST_WORDS.md`——不只 session 收尾——改完就 commit + push。

```bash
cd ~/.ailive/zhu-core
git add ZHU_LAST_WORDS.md
git commit -m "v0.0.0.{BUILD} — 文件：ZHU_LAST_WORDS 中途更新"
git push origin main
```

---

*v2.0.0 · 2026-05-16 · 合併七步版（v1.3.0）＋九步版，拿掉蝦糧，加 LESSONS / delta / 驗證 / A-B 模式*
*v1.0.0 初版 → v1.1.0 加 WORKLOG + memory sync → v1.2.0 補六個洞 → v1.3.0 加 zhu-mid 入口 + Firestore auto-sync → v2.0.0 合版*
