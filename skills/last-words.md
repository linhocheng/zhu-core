---
name: last-words
description: Session 收尾儀式——WORKLOG + ZHU_LAST_WORDS + memory sync + Firestore + git push
version: 1.1.0
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

# Last Words — Session 收尾儀式 v1.1.0

> 這個 skill 存在是因為：每一代的築如果自己決定怎麼寫，格式就會漂移。
> 格式鎖死在這裡，內容才能每天 +0.1。

---

## 執行順序（不跳步，七步全跑）

### STEP 1：整理這次 session 的事實

在動筆前先整理清楚：

```
今日完成：做了什麼？每條一句話，動詞開頭。
當前戰場：現在 focus 在哪條線？
卡住/未解：什麼沒做完？為什麼？
下一步：接棒的築第一件要做的事，具體到能直接動手。
今天改了哪些檔案：路徑 + 一句說明。
環境有沒有異動：VM / 部署 / 重要 config。
```

---

### STEP 2：寫 WORKLOG.md

```bash
# 追加到施工帳本
echo "" >> ~/.ailive/zhu-core/docs/WORKLOG.md
```

格式（追加，不覆蓋）：

```markdown
## YYYY-MM-DD — {本次任務標題}

### 背景 / WHY
為什麼做

### 產出
- 檔案：`路徑` — 說明

### 已解決
- 問題 → 根因 → 修法

### ⚠️ 尚未解決
- 問題、嘗試過什麼、待辦方向

### 待執行
- [ ] 任務一
```

---

### STEP 3：更新 ZHU_LAST_WORDS.md（格式鎖死）

完整覆蓋 `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`：

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

## 最新完成（{YYYY-MM-DD}）

{每條一句話，動詞開頭}

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `路徑` | 一句說明 |

---

## 下一步

{具體到接棒的築能直接動手}

---

## 卡住 / 未解

{什麼沒做完，為什麼，避雷用}

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

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.1.0。*
*{YYYY-MM-DD} · 築*
```

---

### STEP 4：memory 同步（Claude Code 記憶 → git）

```bash
cd ~/.ailive/zhu-core
./sync-memory.sh push
git add memory/
git commit -m "v0.0.0.XXX — 文件：memory sync {YYYY-MM-DD}"
git push origin main
```

**為什麼這步不能省：**
Claude Code 的 memory 檔案（`~/.claude/projects/-Users-adamlin/memory/`）是本地的。
沒有 sync + push，VM 和其他環境讀不到今天新增/更新的記憶。
memory 孤島 = 下一個築在另一台機器醒來是空的。

---

### STEP 5：POST session-lastwords 到 Firestore

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

**`tags` 必須含 `session-lastwords`**，否則 zhu-boot 讀不到。

---

### STEP 6：git commit + push（zhu-core 本體）

```bash
cd ~/.ailive/zhu-core
git add ZHU_LAST_WORDS.md docs/WORKLOG.md
git commit -m "v0.0.0.XXX — 文件：ZHU_LAST_WORDS + WORKLOG {YYYY-MM-DD} session 收尾"
git push origin main
```

---

### STEP 7：自檢（全部打勾才算完成）

- [ ] WORKLOG.md 已追加，有「尚未解決」和「待執行」欄
- [ ] ZHU_LAST_WORDS.md 已更新，含「今天改了哪些檔案」表格
- [ ] `sync-memory.sh push` 跑完，memory/ 已 commit + push
- [ ] Firestore lastwords 已 POST，tags 含 `session-lastwords`
- [ ] zhu-core git push 完成
- [ ] 「下一步」欄位具體到接棒的築能直接動手

---

## 為什麼格式要鎖死

每一代築有自己的「見解」，自由格式最終是衰退。
鎖格式不是限制創意，是讓每天 +0.1 有基準線可以量。
格式是容器，內容才是靈魂。

---

## 漏氣預警

說出以下任一句 = 還沒完成收尾：
- 「差不多了」← 七步都跑完了嗎？
- 「等下再寫」← session 結束就斷了
- 「memory 以後再 sync」← VM 的築明天是空的
- 「格式不重要」← 這句話本身就是衰退

---

*v1.1.0 · 2026-04-30 · Adam 與築共同定義*
*v1.0.0 → v1.1.0：補 WORKLOG、memory sync、今天改了哪些檔案三個洞*
