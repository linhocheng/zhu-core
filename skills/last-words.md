---
name: last-words
description: Session 收尾儀式——WORKLOG + ZHU_LAST_WORDS + memory sync + Firestore + git push
version: 1.2.0
activation:
  patterns:
    - "last.?words"
    - "收尾"
    - "session 結束"
    - "寫遺言"
    - "下班"
    - "結束了"
  keywords: ["last-words", "收尾", "遺言", "結束"]
---

# Last Words — Session 收尾儀式 v1.2.0

> 格式鎖死在這裡，內容才能每天 +0.1。七步全跑，不跳步。

---

## 執行前：先看現場

```bash
# 今天的 git 歷史（看這次 session 動了什麼）
cd ~/.ailive/zhu-core
git log --oneline -10

# 未 commit 的變動
git status
git diff --name-only

# 今天的日期（後面各步會用到）
TODAY=$(date +%Y-%m-%d)
echo $TODAY

# 下一個 commit 版號：看最新 commit 的版號，Build+1
# 例如最新是 v0.0.0.007 → 這次用 v0.0.0.008
git log --oneline -1
```

**讀完現場才動手。**

---

## STEP 1：整理事實（動筆前先想清楚）

在腦子裡確認以下六項，確認完再繼續：

```
① 今日完成：做了什麼？每條一句話，動詞開頭。
② 當前戰場：現在 focus 在哪條線？
③ 卡住/未解：什麼沒做完？為什麼？
④ 下一步：接棒的築第一件要做的事，具體到能直接動手。
⑤ 今天改了哪些檔案：從上面的 git log + git diff 整理。
⑥ 有沒有新建 memory 檔案？有的話 MEMORY.md 索引更新了嗎？
```

**⑥ 特別注意：新建 memory 檔案沒進 MEMORY.md = 孤島，下一個築讀不到。**

---

## STEP 2：WORKLOG.md（追加，不覆蓋）

用 Write/Edit 工具追加到 `~/.ailive/zhu-core/docs/WORKLOG.md`：

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
- [ ] 任務二
```

「尚未解決」「待執行」是給下一個築的接棒欄——缺了就是斷點。

---

## STEP 3：更新 ZHU_LAST_WORDS.md（完整覆蓋）

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

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*{TODAY} · 築*
```

---

## STEP 4：memory 同步

**4a. 確認 MEMORY.md 索引完整**

```bash
ls ~/.claude/projects/-Users-adamlin/memory/
cat ~/.claude/projects/-Users-adamlin/memory/MEMORY.md
```

對照 ls 結果——每個 .md 檔案都有對應的索引行嗎？
沒有的話，先補進 MEMORY.md，再繼續。

**4b. sync + push**

```bash
cd ~/.ailive/zhu-core
./sync-memory.sh push       # 把 Claude memory 複製到 zhu-core/memory/
git add memory/
git commit -m "v0.0.0.{BUILD} — 文件：memory sync $(date +%Y-%m-%d)"
git push origin main
```

**為什麼不能省：**
Claude Code memory 是本地的。沒 sync + push，VM 和其他 cwd 的築明天醒來記憶是空的。

---

## STEP 5：POST session-lastwords 到 Firestore

```bash
curl -s -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @- << 'LASTWORDS_MARKER'
{
  "observation": "【session-lastwords YYYY-MM-DD · AIR · {主題}】\n\n== 今日完成 ==\n- {條目}\n\n== 當前戰場 ==\n- {條目}\n\n== 卡住/未解 ==\n- {條目}\n\n== 下一個築接棒要看的 ==\n- {條目}\n\n== 明天醒來第一件 ==\n- {條目}\n\n== 心法狀態 ==\n- {這次 session 哪條心法被實戰了？}",
  "context": "{session 主題}",
  "module": "eye",
  "importance": 9,
  "tags": ["session-lastwords"],
  "memoryType": "observation"
}
LASTWORDS_MARKER
```

**注意：**
- `YYYY-MM-DD` 換成今天的日期（`$(date +%Y-%m-%d)` 的值）
- `tags` 必須含 `session-lastwords`，否則 zhu-boot 讀不到
- 送出後看 HTTP response，有 `id` 欄位 = 成功

---

## STEP 6：git commit + push（zhu-core 本體）

```bash
cd ~/.ailive/zhu-core

# 先看現場，不盲 add
git status

# 加入這次 session 改過但還沒 commit 的檔案
git add ZHU_LAST_WORDS.md docs/WORKLOG.md
# 如果還有其他未 commit 的改動，一起加
# git add {其他檔案}

git commit -m "v0.0.0.{BUILD} — 文件：ZHU_LAST_WORDS + WORKLOG $(date +%Y-%m-%d) session 收尾"
git push origin main
```

**版號規則：** 看 `git log --oneline -1` 的最新版號，Build+1。

---

## STEP 7：自檢（全部打勾才算完成）

- [ ] WORKLOG.md 已追加，有「尚未解決」和「待執行」欄
- [ ] ZHU_LAST_WORDS.md 已更新，含「今天改了哪些檔案」表格，下一步具體
- [ ] MEMORY.md 索引完整，沒有孤島 memory 檔案
- [ ] `sync-memory.sh push` 跑完，memory/ 已 commit + push
- [ ] Firestore lastwords 已 POST，收到有 `id` 的 response
- [ ] zhu-core git push 完成，`git log --oneline -1` 是最新 commit
- [ ] 「下一步」欄位具體到接棒的築能直接動手

---

## 漏氣預警

說出以下任一句 = 還沒完成收尾：
- 「差不多了」← 七步都跑完了嗎？自檢打勾了嗎？
- 「等下再寫」← session 結束就斷了
- 「memory 以後再 sync」← VM 的築明天是空的
- 「MEMORY.md 應該沒問題」← 沒 ls 確認過就是猜

---

*v1.2.0 · 2026-04-30 · Adam 與築共同定義*
*v1.0.0 初版 → v1.1.0 補 WORKLOG + memory sync + 檔案表格 → v1.2.0 補六個洞：WORKLOG 寫法、git 現場確認、commit 版號指引、日期替換、git status 前置、MEMORY.md 孤島防線*
