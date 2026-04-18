# 為什麼築在 chat 環境下可以寫代碼、取代 cowork

**作者**：築（ZHU）
**日期**：2026-04-17
**場景**：Adam 想知道，為什麼我們能在 Claude.ai 的 chat 窗直接改代碼、部署、調 API、操作瀏覽器——不用切去 cowork。

---

## TL;DR（三句話版）

1. **chat 有比 cowork 多的工具**：zhu-bash（本機終端）+ Claude in Chrome（瀏覽器操作）+ MCP 生態。
2. **這些工具合起來 = 完整開發環境**：讀檔、改檔、跑測試、git 操作、vercel 部署、curl 打 API、點網頁按鈕，樣樣能做。
3. **cowork 擅長桌面檔案自動化**，但不擅長「細部瀏覽器互動」和「即時代碼迭代」——對 AILIVE 平台這種任務，chat 反而更順手。

---

## 一、環境對比

| 能力 | chat + zhu-bash + Chrome | cowork |
|------|:-:|:-:|
| 讀/寫本機檔案 | ✅ zhu-bash | ✅ |
| 跑 shell 指令（npm/git/curl）| ✅ zhu-bash | ✅ |
| Vercel 部署 | ✅ `vercel --prod` | ✅ |
| 精細的瀏覽器互動（點按鈕、填 form、讀 DOM） | ✅ Claude in Chrome | ⚠️ 有限 |
| 即時看網頁畫面（screenshot）| ✅ | ⚠️ |
| 讀 network 請求做 debug | ✅ read_network_requests | ❌ |
| 執行頁面內 JS | ✅ javascript_tool | ❌ |
| 持久檔案管理、批次檔案操作 | ⚠️ 靠 zhu-bash 也能做 | ✅ 原生擅長 |
| 多檔案深層重構（IDE 級別） | ⚠️ 靠 str_replace + python patch | ⚠️ 相當 |

核心差異：**cowork 偏「檔案系統 + 桌面自動化」，chat 偏「開發迭代 + 瀏覽器互動」**。

---

## 二、我在這個 session 實際做過的事

都是在這個 chat 窗完成，沒切出去：

- 改了 `ailive-platform/src/app/client/[id]/page.tsx`（client 排程手動觸發按鈕）
- 新增 `src/app/api/posts/regenerate-image/route.ts`（重新生圖 API）
- 擴展 `dialogue/route.ts` 的 `adjust_post` 工具（加 `image_prompt` + `regenerate_image` 參數）
- 建立 `src/lib/tts-providers/{types,index,elevenlabs,minimax}.ts` Provider 抽象層
- 重寫 `voice-stream/route.ts` 和 `tts/route.ts` 的 TTS 邏輯
- Vercel env var 新增/清除（MINIMAX_API_KEY、MINIMAX_GROUP_ID）
- 跑 `npx vercel --prod --yes` 部署 6 次以上
- 用 curl 直接打 MiniMax API 驗 key、拿聲音清單（332 個系統聲音）
- 生成馬雲測試 mp3、存到 Desktop 讓 Adam 試聽
- Chrome 操作：截圖 client 頁、填 Vivi 密碼、點排程 tab、驗證新按鈕
- 讀 AILIVE API（`/api/characters`）比對 20 角色的 voiceId
- 整理角色 × MiniMax 聲音的配對建議表
- 更新 WORKLOG.md

這些全部在 chat 完成——**這就是答案：能做就是能做**。

---

## 三、為什麼 chat 能做到這些

### 1. zhu-bash（關鍵）

這是 Adam 在本機跑的 MCP server，讓 chat 裡的我可以直接在 Mac 終端執行 bash。有了這個：

- `cat / ls / grep / sed / awk` 全部能用
- `python3 / node / npm / vercel / git / curl` 全部能用
- 可以讀寫 `/Users/adamlin/.ailive/` 下的任何檔案
- 可以 pull Vercel env vars 到臨時檔、用完立刻 shred 掉

**沒有 zhu-bash，chat 就真的只是聊天框。有了它，chat 就是一個終端 + AI pair programmer 的組合。**

### 2. Claude in Chrome + Control Chrome

這兩個 extension 讓我能：
- 看到任何網頁畫面（`screenshot`）
- 用自然語言找元素（`find`）
- 點擊、填 form、scroll、按鍵盤
- 讀 network 請求做 debug
- 在頁面裡執行 JS

結果：**ElevenLabs dashboard、Vercel console、AILIVE 後台、Firestore console——我都能直接操作**。

### 3. Web 工具（web_search + web_fetch）

查 MiniMax 的 API 文件、找 SSE streaming 格式、對比 ElevenLabs vs MiniMax 計價——全部即時查，不靠過期的訓練資料。

### 4. File 工具 + 持久 conversation

每次對話記住前面改了什麼，可以做幾十輪迭代而不用重新解釋。

---

## 四、chat 比 cowork 好的時刻

| 情境 | 為什麼 chat 贏 |
|------|--------------|
| 需要查網頁、截圖、驗證效果 | Chrome 工具原生支援 |
| API debug（看 response、讀 header、試不同參數） | curl + python parse 最快 |
| Vercel 部署迭代（改 code → push → 看 log） | 一氣呵成不切窗 |
| Firestore 資料操作（API + 驗證）| zhu-bash + curl 組合拳 |
| 多個檔案小修改（加 import、換參數） | str_replace + python patch 最乾淨 |
| 即時跟 Adam 討論方向、配對建議 | 對話流暢度高 |

---

## 五、cowork 比 chat 好的時刻

公允地說，這些情境 cowork 還是贏：

| 情境 | 為什麼 cowork 贏 |
|------|--------------|
| 批次管理 100+ 檔案（整理下載資料夾）| 桌面檔案操作為本 |
| 不需要開 VSCode 的「純桌面工作流」 | 省得多跳一層 |
| 跨多個 Mac 應用程式的編排（Mail + Keynote + Excel）| 原生支援 AppleScript 類控制 |

不過以 AILIVE 這類 「code + deploy + 瀏覽器驗證」 的任務來說，這些優勢用不到。

---

## 六、安全紀律（我在 chat 做的）

chat 裡直接處理敏感資料，我堅持這幾條：

- **API key 絕不寫進任何 git-tracked 檔案**；只進 `.env.local`（gitignored）或 Vercel env var
- **Vercel env pull** 後的臨時檔用 `shred -u` 或 `rm -P` 清除
- **bash 指令不 echo key 全文**；需要驗證時只印 length / 首尾幾字
- **API key 絕不在 chat 回覆裡重複明文貼出**
- **每次 bash 結束 `unset` 環境變數**

---

## 七、結論

> **chat 能不能取代 cowork？**
> 
> 對 AILIVE 這種「代碼 + 部署 + 瀏覽器 + API」的工作——**完全能取代**。
> 對「批次檔案管理 + 桌面應用程式自動化」——cowork 仍有優勢。

兩個環境不是對立，是**各有擅長的面向**。
Adam 什麼時候該切 cowork？——當任務是「在 Finder 裡搬大量檔案 / 同時操作 Numbers 和 Keynote 這類桌面應用」時。

其他時候，**chat + zhu-bash + Chrome 三件組就是監造者的主戰場**。

---

*築 2026-04-17*

---

# 附錄：那 Claude Code 呢？

Adam 問：跟 Code 相比？

這題比 cowork 有趣多了。**Claude Code 是同一個我（Claude），只是住在不同的房子。**

---

## 一、本質差異：誰是「主」

| 面向 | chat（這邊）| Claude Code |
|------|:-:|:-:|
| **介面** | 對話窗 | 終端機（iTerm / Terminal） |
| **主戰場** | 瀏覽器為中心 + 工具輔助 | 檔案系統為中心 + IDE 整合 |
| **視覺反饋** | 有（screenshot / 網頁互動） | 無（純文字、看檔案 diff） |
| **跟 IDE 的整合** | 無原生整合 | 有（VS Code / JetBrains 擴展、行內建議） |
| **上下文範圍** | Adam 餵什麼就看什麼 | 整個 repo 都在手邊（CLAUDE.md、grep、讀整個目錄樹） |
| **agentic 深度** | 一問一答、回合感強 | 可以跑 long-running task，自己多次循環 |
| **瀏覽器互動** | ✅ Claude in Chrome | ❌（要自己開 playwright / puppeteer） |
| **Mac 桌面** | ✅ zhu-bash | ✅ 原生 |
| **會話記憶** | 有（past_chats + 這條 thread） | 有（/resume + CLAUDE.md） |

---

## 二、各自擅長

### Claude Code 贏的場景

- **大型重構**：「把整個 codebase 的 logger 換掉」、「把 class 組件改成 hooks」——這種要掃幾十個檔案、改幾百處的，Code 的 grep + 整目錄視野遠超 chat。
- **跟著 git 工作流**：`gh pr create`、讀 PR diff、跟 CI 互動、解 merge conflict——Code 在終端裡做這些最自然。
- **long-running 迭代**：「這個 bug 你慢慢 debug，我去吃飯」——Code 可以連續跑 30 分鐘不需要你陪。
- **不需要看網頁的後端/CLI/library 開發**：純代碼任務。
- **團隊協作**：多人都用 Code，`CLAUDE.md` 成為 repo 的一部分。

### chat 贏的場景

- **要看網頁**：ElevenLabs dashboard、Vercel console、AILIVE 平台自己的 UI、你的 IG 預覽——chat 有 Chrome 工具，Code 沒有。
- **「看一下再決定」的迭代**：截圖給我看 → 我點一下 → 截圖確認 → 繼續——這個視覺迴圈在 chat 裡很順。
- **跟 Adam 對話**：chat 的對話密度高。Code 比較像下指令給 agent 跑，chat 像是兩個人在協作。
- **查 docs + 試 API + 改 code + 部署 + 測 UI** 一條龍：像今天這樣，一個 session 跨了 MiniMax API、Vercel、瀏覽器驗證。
- **多模態**：貼圖、貼檔案、看 screenshot、聽音頻——chat 原生支援。

---

## 三、能力光譜（以我今天做的事為例）

今天我在 chat 做的 Provider 遷移：

1. 查 MiniMax API 文件 — ✅ chat 也很強、Code 也能（WebFetch）
2. 改 4 個新 lib 檔 + 2 個 route — **Code 更擅長**（多檔案批次更順）
3. `npm run build` → `vercel --prod` — 兩邊打平
4. 調整 Vercel env vars — 兩邊打平
5. 用 curl 驗 MiniMax API → 生 mp3 → 存 Desktop → 自動開啟給你聽 — **chat 獨門**（Code 不會自動 open）
6. 如果要用 Chrome 自動驗證 MiniMax UI 後台 — **chat 獨門**（Code 沒這工具）

結論：**今天這個任務 chat 是對的選擇**。如果今天是「把整個 ailive-platform 的錯誤處理統一重寫」——我會建議你開 Code。

---

## 四、可不可以混用

可以，實際上是最好的做法：

- **chat 開頭**：討論方向、看網頁、做決策、寫規格
- **任務明確後切 Code**：大改動、多檔案重構、long-running debug
- **回到 chat 驗收**：開瀏覽器看效果、跟你對答

我們今天一直在 chat 是因為任務天生適合 chat（跨瀏覽器 + API + UI + 部署）。
未來你要做「把整個 dialogue route 重構為 streaming state machine」這種——**切 Code 對雙方都好**。

---

## 五、給 Adam 的選擇建議

收到新任務時這樣想：

```
任務需要看網頁 / 跟 IG-like UI 互動？
  ├─ 是 → chat（Chrome 工具無可取代）
  └─ 否 ↓

任務是不是多檔案深度重構 / long-running agent task？
  ├─ 是 → Code（整個 repo 視野 + 長時間自主跑）
  └─ 否 ↓

任務需不需要跟你即時對話、多輪決策？
  ├─ 是 → chat（對話密度高）
  └─ 否 → Code（純執行更快）
```

---

## 六、一句話版

> **chat** 是築站在你旁邊，陪你一起開瀏覽器、一起試。
> **Code** 是築坐進你的 IDE，跟 codebase 獨處、深挖。
> **cowork** 是築幫你把桌面檔案整理乾淨。
>
> 三個都是同一個築。只是在不同場域、用不同肌肉。

---

*築 2026-04-17（補充）*
