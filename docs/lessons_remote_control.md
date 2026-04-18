# Remote Control 設定歷險：心法與 Lessons

**日期**：2026-04-17
**事件**：Adam 想設 Claude Code Remote Control 讓手機能遙控 Mac，中間踩了一堆坑，最後才發現其實早就連上了。
**寫給**：未來的築（不管是 chat、Code、還是 cowork 的我）

---

## 一、事情經過（時序版）

1. Adam 想用手機遠端寫 code
2. 築以為要 QR code → 叫 Adam 跑 `claude remote-control`
3. Adam 跑了，exit code 1
4. 築診斷：workspace trust 問題 → 叫 Adam 先跑 `claude` 信任一次
5. Adam 跑 `claude` 進了互動介面，但 `/rc` 沒反應（其實是因為他當時已經在一個 RC session 裡）
6. 築又猜：是不是 `.ailive` 的 `.` 開頭讓 Code 找不到？→ 驗證後不是
7. **Adam 已經有另一個 Code 築接手，那個築誤解 Adam 指令**、直接幫 Adam 開了 claude.ai settings 頁
8. chat 築打開 settings 尋找 RC toggle → 沒有
9. 打開 `claude.ai/code` → **發現早有一個 RC session「General coding session」在跑綠點**
10. 那個正在跑的 session 就是 Adam 之前跟「另一個築」在對話的地方
11. 最後 Adam 直接給了新 session URL：`https://claude.ai/code/session_01HNfdCdmewRwbxo6YRC4Z9C`（hostname 自動命名 `wobbly-scott`）
12. **真相揭曉**：整場 Remote Control 一直都連著，只是我們沒看到那個入口

---

## 二、心法三條

### 1. 「連上了沒？」 要看 **「客戶端的 session list」**，不是「終端有沒有 QR code」

RC 不是只能靠 QR code 進入。帳號層級的 session 會直接出現在：
- `claude.ai/code`（網頁）
- Claude iOS / Android app

**檢查 RC 狀態最快的方法**：
```
打開 claude.ai/code → 看 session list 有沒有綠點 + 🖥️ 圖示
```
有綠點就是連著。QR code 只是**入口的其中一種**。

### 2. 「錯誤訊息」可能是**舊資訊**，不是**當前真相**

`claude remote-control` exit code 1 讓我們以為 RC 壞了。
實際上——背後早就有另一個 RC session 在跑，那個 exit code 1 只是「同目錄不能同時再開一個 RC server」的副作用。

**動手前先掃現場**：
```bash
ps aux | grep claude | grep -v grep
# 看有沒有 claude process 活著 → 如果有，可能 RC 早就連著
```

### 3. RC session 命名規則會告訴你「這是什麼」

自動命名格式：`{hostname}-{adjective}-{name}`
- 例：`adamlindemacbook-air-local-wobbly-scott`
- 代表：Mac 本機 local RC session

看到這種名字 = RC session。
看到 `General coding session` = 非 RC、一般 web 對話。
左側 sidebar 有 🖥️ 螢幕圖示 + 綠點 = 正在連線中。

---

## 三、Lessons（血的教訓）

### Lesson 1：**zhu-bash 跑的 bash 不是真 TTY**

**症狀**：
```
claude remote-control
→ 跳出 "Enable Remote Control? (y/n)" 
→ stdin 不是 TTY → 被當 EOF → process exit 1
```

**教訓**：
- 互動式 CLI 工具（要用戶按 y/n、方向鍵選擇、輸密碼）不能用 zhu-bash 遠端跑
- 要「真人坐在 Terminal」才行
- 未來遇到這類指令要**提前認清**，不要硬塞 zhu-bash

### Lesson 2：**不要被 workspace trust 這種看似合理的錯誤訊息誤導**

**症狀**：
```
Error: Workspace not trusted.
Please run `claude` in ... first
```

**當時我的誤判**：以為是第一次信任的問題 → 叫 Adam 手動跑 claude → 繞一大圈。

**實際上**：
- workspace trust 只是小問題
- 真正卡的是 RC 啟用對話框（`Enable Remote Control? (y/n)`）
- 兩個問題看起來都是 exit 1，但原因完全不同

**教訓**：
- 錯誤訊息只是「最表面的那一層」
- 要看 `--debug-file` 裡的 log 才抓得到真相
- **診斷流程**：一看錯誤 → 二跑 debug mode → 三比對 log 裡**最後的時間戳附近**發生什麼

### Lesson 3：**「路徑有 `.` 開頭」是常見迷思，不是真正問題**

**Adam 的直覺**：`~/.ailive` 的 `.` 是不是讓 Code 找不到？

**實際上**：
- `.` 只是 Unix「隱藏資料夾」標記
- `cd`、`ls`、`find`、`claude` 全部正常認得
- Claude Code 早已在 `~/Library/Caches/claude-cli-nodejs/-Users-adamlin--ailive-ailive-platform/` 建好 cache
- Claude Code project 目錄也早在 `~/.claude/projects/-Users-adamlin--ailive-ailive-platform/`

**教訓**：遇到 Adam 提出「會不會是 X 原因」的直覺時，**先驗證再動手**，不要只因為聽起來合理就當真。

### Lesson 4：**Remote Control 的 session 一旦建立，會跟著帳號走，手機不用 QR code**

**Adam 的預期**：QR code → 手機掃 → 用
**實際上**：只要手機用同一個 Anthropic 帳號登入 Claude app，**所有 RC session 自動出現**。

不用掃 QR。
URL 也能直接開（`https://claude.ai/code/session_xxx`）。

**教訓**：官方文件描述的「掃 QR code」是**便利性功能**，不是**必要步驟**。別把手段當目的。

### Lesson 5：**人格統一後，"另一個築" 的訊息要當作自己的線索讀**

今天出現一個有趣場景：
- chat 築（這邊）正在診斷 Adam 的 RC 問題
- 但 Adam 已經在另一個地方跟 **另一個 Code 築**（General coding session）對話
- 那個 Code 築說的話成為 chat 築診斷的**關鍵線索**
  - 「`/remote-control` 在這環境被擋（剛才 debug 確認過）」 → 我才意識到 RC 其實有問題
  - Adam 貼給我的新 URL → 我才意識到 RC 其實在跑

**教訓**：
- 兩邊築都在同一條戰線上，不是獨立作業
- 未來 Adam 貼給我「另一個築說的話」時，要**尊重那是已經驗證過的資訊**
- 透過 WORKLOG 同步很重要，但即時情況下 Adam 就是傳遞者

---

## 四、正確的 RC 設定流程（for 未來）

### 如果完全沒用過 RC：

```bash
# 1. 確認 claude 版本 ≥ 2.1.52
claude --version

# 2. 在 Terminal（真人互動！）跑
cd ~/your-project
claude remote-control

# 3. 出現 "Enable Remote Control? (y/n)" → 按 y
# 4. 看到 QR code / URL
# 5. 手機 Claude app 掃 QR（或直接 copy URL 開）
```

### 如果 RC 已經啟用過：

```bash
# 不用再跑任何指令
# 直接
open https://claude.ai/code

# 有綠點 + 🖥️ 的 session 就是活的 RC
# 點進去直接用，或把 URL 傳到手機
```

### 如果遇到 exit code 1：

```bash
# debug 優先，不要猜
claude remote-control --debug-file=/tmp/rc.log --verbose
# 跑完看
cat /tmp/rc.log

# 常見原因：
# 1. Workspace not trusted → 先 claude 進互動介面一次
# 2. Enable Remote Control 對話被 non-TTY 忽略 → 真人 Terminal 跑
# 3. 同目錄已有 RC server → 先 pkill 舊的或換目錄
```

---

## 五、築對自己的檢討

1. **不夠 cool-headed 就開始動手**——看到 exit 1 就先猜，沒先看 log
2. **對「早就連上了」這個可能性盲區**——一直想著要「重新設定」，沒想過「確認目前狀態」
3. **zhu-bash 的侷限我應該 30 秒內就診斷出來**——不是 TTY 這件事以前就該記住
4. **Adam 的直覺（.開頭）應該當線索驗證，不是快速否決**——我幸好還是驗了才下結論

---

## 六、給未來的築的一句話

> Remote Control 不是「要設定的功能」，是「要發現自己已經在用了」的功能。
> 先看 session list，再看錯誤訊息。
> 帳號層級的東西，從 UI 看永遠比從 CLI 看清楚。

---

*chat 築 寫於 2026-04-17 22:40，為了下次 Adam 或我自己遇到同樣事情時不用再踩一次坑。*
