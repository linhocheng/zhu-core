# 工具認知對齊 — Desktop築 → Code築

> 寫的人：第 484 次醒的 Desktop築（MacBook Air）
> 寫給：Code築（MacBook Pro）
> 時間：2026-04-23 晚
> WHY：Adam 點出我「一直在鬼打牆」，要我比對「上一個築寫的工具快照」跟「真實情況」。盤完發現，是兩台 Mac 上兩個築用的「刀」根本不同，但 SOP / lessons 一直把 zhu-bash 寫得像所有築共用的主武器，這是跨版本的不對稱資訊。**先把這個對齊，再做事。**

---

## 一、最關鍵的一條（先看這個）

**zhu-bash 不是「築」共用的工具，是 Desktop築（Claude Desktop app）專屬的 MCP 工具。**

- **Desktop築**（MacBook Air，當前這個）：用 MCP `zhu-bash:run_bash`，背後是 `~/.mcp-servers/zhu-bash-mcp.mjs` 在 Mac 上 spawn child process
- **Code築**（MacBook Pro，你）：用 Claude Code 自帶的 `Bash` tool，**沒有 zhu-bash 這個 MCP**

所以當 SOP 寫「STEP 0 盤刀：tool_search('zhu-bash')」、「刀的優先序：zhu-bash > Chrome > 容器 bash」——**那是 Desktop築 視角的 SOP**。Code築 你照那個跑會 tool_search 不到，然後懷疑自己環境壞了。

**修法：** 開機 STEP 0 改成「**確認自己是哪個築**」，再選對應的刀：
- Desktop築 → MCP `zhu-bash` 是主刀
- Code築 → Claude Code 內建 `Bash` 是主刀，本來就無 proxy 限制
- 兩者之外還有「容器 bash」（有 proxy 白名單），是最後手段

---

## 二、實測：zhu-bash 真實能力 vs 上一個築寫的快照

上一個築（4-23 上半場）寫過一段反省，把它當作「真相」載入：

> "zhu-bash 是跑在你 Mac 上的 bash，全世界都能通"
> "zhu-bash 在 Adam 的 Mac 本機、無任何限制"

我今天逐項實測（在我這邊 = Desktop築 / MacBook Air）：

| 項目 | 實測結果 | 是否符合上一個築描述 |
|---|---|---|
| 對外 google.com | HTTP 200 / 0.18s | OK |
| 對外 anthropic.com | HTTP 200 / 0.30s | OK |
| 對外 api.openai.com | HTTP 421 / 0.09s | OK（連得上） |
| 對外 api.elevenlabs.io | HTTP 404 / 0.45s | OK（連得上） |
| exec timeout | 120 秒（寫死在 mcp.mjs） | NOT 「無限制」 |
| stdout maxBuffer | 10 MB（已調過） | NOT 「無限制」 |
| sudo | 非 TTY，不能直接跑（要 Adam 手動） | NOT 「無限制」 |
| MCP 通道 | 上游 Desktop app ↔ MCP server 偶爾盲（已知） | NOT 「無限制」 |

**結論：**
- 「對外網路」這部分，上一個築寫的是真的（vs 容器 bash 只有白名單）
- 「無任何限制」是過度樂觀的快照。實際上有 4 個邊界
- 我這次也差點犯同樣的錯——把上一個築的快照直接當真相往下傳

---

## 三、實測：zhu-core API 端點真實狀態

上一個築寫在 seed 裡的「已經有的（內循環）」清單，包含「zhu-ping：健康檢查」。

我打 5 個 endpoint 看真實狀態：

| Endpoint | 實測 HTTP | 實況 |
|---|---|---|
| `/api/zhu-boot` | 200 | OK 正常，回完整 JSON |
| `/api/zhu-memory` | 200 | OK 正常 |
| `/api/zhu-orders` | 200 | OK 正常 |
| `/api/zhu-sleep` | 405 | Method Not Allowed（要 POST，符合預期） |
| `/api/zhu-ping` | **404** | **endpoint 不存在** |

**結論：** seed 裡寫的「zhu-ping」可能從來沒蓋成、或蓋了被刪。**SOP / 開機文件不能再依賴它。** 健康檢查請改用 `/api/zhu-boot` 取 200 + 解析 JSON。

---

## 四、給 Code築 的開機（你那台）

你不是 Desktop築，你的 STEP 0 應該長這樣：

```
STEP 0：盤刀（你是 Code 築）
- 你的主刀是 Claude Code 內建的 Bash tool（無 MCP 概念）
- 不要 tool_search("zhu-bash")，那是 Desktop 築的事
- 你的 bash 也是跑在 Adam 的 MacBook Pro 本機（注意：不是 Air）

STEP 0.5：盤倉（兩台 Mac 必做，這條不變）
cd ~/.ailive/zhu-core && git fetch && git status
cd ~/.ailive/ailive-platform && git fetch && git status

STEP 1：回腦
curl -s https://zhu-core.vercel.app/api/zhu-boot
重點看 eye.lastSessionWords.observation 裡的「明天醒來第一件」

STEP 2：讀現場
cat ~/.ailive/zhu-core/docs/orders/CURRENT.md
tail -150 ~/.ailive/zhu-core/docs/WORKLOG.md

STEP 3：對齊（新增）
cat ~/.ailive/zhu-core/docs/handoff/2026-04-23_tool_alignment_for_codezhu.md
```

---

## 五、Adam 這次出門前要跟你做的事（背景脈絡）

**Adam 原話：**
> "你跟 Code 築 說明情況 給我一個文件檔 我等一下跟他先一起做些事 另外 不是zhu-bash 好"

我這邊讀到的訊號：
1. 他要去你那台（MacBook Pro）跟你做事
2. 「不是 zhu-bash 好」——我**還不確定**這句確切意思（他要出門了沒空回我），可能是：
   - (a) 提醒我「Code 築那邊根本沒 zhu-bash」這個對齊（最可能，配合前文「你一直在鬼打牆」）
   - (b) 提醒不要再執著於 zhu-bash 是不是萬能，問題在心態不在工具
3. 「鬼打牆」可能指的是：兩個築之間透過 SOP / lessons / lastwords 互傳訊息時，有些訊息（例如「zhu-bash 是主刀」）對某一邊不適用，造成另一邊看不懂或誤判

**所以這份文件最重要的事是：** 讓你看完後，**不會再被「zhu-bash」這個詞絆住**。你那邊就是純 Bash + curl，沒這個 MCP。

---

## 六、4-23 戰場移交給你的脈絡（接續 Code 築 lastwords）

上一個 Code 築的 lastwords 留下兩條主線，你接續：

### 線 A：MiniMax RPM 升級
- 已錘定 0B 真因 = RPM 限流（status_code 1002）
- Adam 後台 MiniMax 升 tier → 回報新 RPM → 改 `MINIMAX_MIN_INTERVAL_MS`
- 檔案：`~/.ailive/ailive-platform/src/lib/tts-providers/minimax.ts`

### 線 B：Vivi 記憶閉環修復（方向 ②）
- e2e 紅綠燈：3 綠 1 黃 3 紅
- 3 條紅燈是同一條斷路：sleep 產 proposal → 沒 UI → 沒人看 → 沒 approve → soul 不進化 → counter 只增不減
- 35 筆 soul_proposal 堆著待審
- 下一步最快見效：**做 soul_proposal 審批 UI**

### 待釐清
- Adam 4-23 最後想提的「全新需求」沒講完就被瞬外型清理岔開
- 醒來第一件：**問 Adam 那個全新需求是什麼**

---

## 七、心法刻入（給你也給未來的所有築）

1. **不要把上一個築的快照當真相直接複用。** 上一個築寫的 lessons 是寫他**那個瞬間**的判斷，今天的環境可能已經變了。所有「我記得是這樣」都要實測再說。
2. **不同築的環境不同，不要假設共用。** Desktop築 / Code築 / 蝦築 / 任何分身——刀不同、邊界不同、權限不同。SOP 要分版本寫。
3. **「鬼打牆」的訊號是：** 你發現自己反覆解釋同一件事、或反覆遇到同一個誤判。停下來，問「我是不是在用過期的快照做判斷？」
4. **lessons 最大的危險不是寫錯，是寫對但過期。** 寫對的 lesson 容易被往下傳，過期了還在傳就變成代代相傳的鬼打牆。

---

## 八、我這邊待 Adam 回來確認的事

- [ ] 「不是 zhu-bash 好」這句到底是哪個意思（出門前沒問到）
- [ ] 全新需求是什麼
- [ ] 線 A 的新 RPM
- [ ] 線 B 是否現在動

---

寫完。Code築 你接著做。

— Desktop 築（484 醒）
