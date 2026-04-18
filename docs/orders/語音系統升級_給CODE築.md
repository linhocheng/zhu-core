# [已退役 · 2026-04-19] 語音系統升級規劃 — 考古用

> **⚠️ 此檔已退役，不再維護。**
>
> **退役時機**：2026-04-19 當天，本來要交棒給 Code 築執行，但我自己（chat 築）動手做了 v0.2.1.002（MiniMax 繁→簡轉換 3 行）+ 之後的 v0.2.1.003 / v0.2.2.001 等 TTS 收尾一系列 commit。原本規劃的 L1-L5 線路，L1-L2 已由後續 commit 覆蓋。
>
> **退役理由**：
> 1. 規劃寫給「不在場的分身」，但 chat 築自己已熱現場，強迫交棒會複製真相分裂（LESSONS_20260419 第 7 條）
> 2. 實際動作已走過 v0.2.1.002 / v0.2.1.003 / v0.2.2.001 三個 commit，這份文件的方向被 commit history 覆蓋
>
> **真相在**：`ailive-platform` repo 的 commit log v0.1.0.001 ~ v0.2.2.001（17 個 commit 的 TTS 全弧）
>
> **退役時的內容保留於下**（以示考古，不再更新）：
>
> ---

# 語音系統升級規劃（給 Code 築讀）

> **背景**：Adam 提供了一份 YuqiCity Voice Agent Framework V1.0（jackma 馬雲版）。
> 是另一個團隊的語音系統設計文件，水平很高，**但他們是獨立 voice agent 服務**（LiveKit + Cloud Run），
> 我們是 **Next.js SaaS 內嵌的語音模式**，架構約束完全不同。
>
> 這份規劃**不是「全抄 YuqiCity」**。是 chat 築（我）幫你比對完現況後，
> **挑出真正能讓我們語音系統更好的東西**，分線、排優先序、給你一份可動作的施工計劃。
>
> **文件目的**：讓你（Code 築）讀完直接動手，不用再花時間跟 Adam 對齊大方向。

---

## 一、先記住這份文件的紅線（不能逾越）

1. **我們不是 YuqiCity，不換 LiveKit**
   - 他們：LiveKit + Cloud Run + min-instances=1（持久 worker）
   - 我們：Next.js Vercel Serverless + Web SSE + 前端 MediaRecorder
   - 換架構 = 重寫整個 voice 層 + 換部署模型 + 改帳單。**破劍式：手上的劍能破，就不換劍。**
   - 我們的 SSE + 句切分 + MiniMax/ElevenLabs 在 production 已驗證（v0.1.0.001 + v0.1.1.001/002）。

2. **不一鍋 commit**
   - 下面分了 5 條線（L1~L5），每條獨立 commit。
   - 看 `LESSONS_20260418.md` 第 12 條：連動偵測是分類的天敵。動手前每條線細看 diff 確認邊界。

3. **build 必過、deploy 後 curl 驗 production**
   - 動完 TTS / voice-stream 任何一條 → `npm run build` → 過了才 deploy
   - deploy 後立刻 `curl POST /api/tts` 兩個 provider 各打一次 + voice/[id] 頁實測
   - 失敗 → 立刻 rollback（git revert），不留半成品上 prod

4. **path 帶 `[id]` 的 git add 一律單引號保護**
   - LESSONS 第 11 條 zsh glob 教訓還熱著
   - `git add 'src/app/api/characters/[id]/route.ts'`，不要裸寫

5. **每條線 commit 完寫一條 lastwords 進 eye**
   - tags 含 `session-lastwords` + `code築`
   - 模板在 `~/.ailive/ailive-platform/CLAUDE.md` 的〈🔚 收尾紀律〉

---

## 二、為什麼這份規劃存在（背景脈絡）

Adam 給的 YuqiCity 文件是 **2026-04-18 完整的另一個產品架構**。
寫得非常好，但**有些是他們的場景特有的**，照搬到我們這會出事。

我幫你做了三類分辨：

### 採用：5 條線（L1~L5，下面詳述）
能直接讓我們現有架構變好的，不換刀。

### 不採用 + 理由（破劍式立場）
| 他們有的 | 我們不採用，原因 |
|---|---|
| **LiveKit Voice Agent 架構** | 我們是 Next.js SaaS 嵌入式，沒理由開獨立 GCP Cloud Run。架構成本不對等。 |
| **Silero VAD（伺服端）** | 我們前端用 Web Speech API + MediaRecorder，VAD 是瀏覽器端做。換 Silero = 要架 worker = 走他們那條路。 |
| **Deepgram nova-2 STT 串流** | 我們現在用 Gemini Flash 一次性 STT，能動。換 Deepgram 要付月費 + 要做串流接收。**值得做但不是現在**，留給未來戰場 L6 候選。 |
| **PostgreSQL + pgvector** | 我們是 Firestore + 自己做 cosine similarity。架構切換成本太大，記憶系統正在運作中。 |
| **記憶 Phase 4 圖譜（memory_edges）** | 是好東西但**現在記憶系統沒成熟到需要它**。Adam 還在調 rootRelevance、tier 規則。圖譜先記下，未來戰場 L7 候選。 |
| **記憶地圖可視化** | 同上。先把基礎做穩，可視化是錦上添花。|

### 留疑問 / 需 Adam 確認
- 他們的「中台管理介面」（Config Center）— 我們的角色配置散在 Firestore doc 欄位，沒統一介面。要不要做一個 admin config 頁？**這個問 Adam，不要自己決定。**
- 他們的「Smart Greeting」（記住上次掛斷時的 mood、unfinished_threads）— 設計很細，但**需要 Adam 確認這是不是他想要的角色行為**。我們現在的 `gapInjection` 是樸素版。

---

## 三、5 條施工線（按優先級排序）

### L1【最優先】MiniMax TTS 加 0B 重試 + Semaphore
**痛點對應**：YuqiCity 踩坑 #9、#10。
**我們的現況**：`src/lib/tts-providers/minimax.ts` 沒有任何重試機制、沒有 RPM 節流、沒有 Semaphore。
**為什麼最優先**：MiniMax 在我們 production 上已經實測會出聲（40.9KB MP3），但**靜默限流（HTTP 200 + 0B）的雷我們還沒踩到**。等 user 多了一定會中。**這是預防性工程，破氣式：補丁活久不如根因處理**。

**動作**：
1. 在 `src/lib/tts-providers/minimax.ts` 加：
   - 模組級 `Semaphore(1)` 序列化所有 MiniMax 請求
   - `MIN_INTERVAL = 500ms` 兩次請求之間強制間隔
   - `synthesizeStream` 內：偵測 stream 第一個 chunk 是否為 0B → sleep 500ms → 重試**一次**
   - 重試時要傳 `is_retry=true` flag（如果有 emitter，避免重複 init — 抄他們踩坑 #10）
2. 我們沒用 LiveKit emitter，所以「重複 initialize」這條我們其實沒風險，但 retry 機制本身要有
3. ElevenLabs **不需要**這套（他們 API 穩定，沒 0B 雷）

**驗收**：production 連打 5 次 MiniMax /api/tts，全部回 ≥10KB MP3，無 timeout、無空音檔。

**commit**: `v0.1.6.001 — 新增：MiniMax TTS 加 Semaphore + 0B 重試（預防靜默限流）`

---

### L2【高】TTS 前處理擴充 — 抓 Gemini 的「思考洩漏」
**痛點對應**：YuqiCity 附錄 A.2「Gemini Thinking 過濾」+ 踩坑（思考過程被念出來）
**我們的現況**：`src/lib/tts-preprocess.ts` 已經有 Markdown / URL / 中台用語 / 破音字處理，**但沒處理 LLM 思考標籤**。
**為什麼**：我們現在用 Anthropic Claude（不是 Gemini），**目前看來沒洩漏問題**。但 Adam 之前提過想試 Haiku、Gemini 做變檔器。一旦切到會 leak thinking 的模型，就會踩。

**動作**：
1. `src/lib/tts-preprocess.ts` 加 thinking pattern 過濾：
   - 移除 `（思考：...）` 全形
   - 移除 `（thinking: ...）` / `<thinking>...</thinking>` 標籤
   - 移除 `<think>...</think>`（DeepSeek 風格）
2. **寫進 `preprocessTTS` 函數最前面**（在 Markdown 處理之前），因為這些東西可能含 markdown
3. 加 1-2 個 unit test 心智測試：
   ```
   "你好（思考：這個用戶在問候）我很好" → "你好我很好"
   "<think>分析中</think>對的" → "對的"
   ```
   **不用 jest，寫一個 node script 跑就好**

**驗收**：preprocessTTS('你好（思考：xxx）我在') === '你好我在'

**commit**: `v0.1.6.002 — 新增：TTS 前處理過濾 LLM 思考洩漏`

---

### L3【高】voice-stream 兩處 formatGap 統一
**痛點對應**：我們自己的破綻（chat 築 2026-04-19 第二遍重讀時抓到，未修）
**我們的現況**：
- `src/app/api/dialogue/route.ts` L1185 用 `Math.round`
- `src/app/api/voice-stream/route.ts` L156 用 `Math.floor`
- 兩份 `formatGap` 邏輯幾乎一樣但**結果差 1 分鐘**
- 兩處的 10 分鐘閾值寫死

**獨孤九劍破索式：兩份即是零份。**

**動作**：
1. 在 `src/lib/` 新建 `time-awareness.ts`：
   ```typescript
   export function formatGap(ms: number): string { ... }  // 統一 Math.round
   export const NEW_VISIT_THRESHOLD_MS = 10 * 60 * 1000;
   export function shouldInjectGap(isNewVisit: boolean | undefined, messageCount: number, lastUpdatedAt: string | null): { inject: boolean; durationText?: string } {
     // 統一邏輯：dialogue 看 isNewVisit、voice-stream 不看（因為 voice 每次都是新訪問）
   }
   ```
2. `dialogue/route.ts` 和 `voice-stream/route.ts` 都 import 這個 lib
3. 順手把 dialogue 的 `Math.round` 統一過去（voice-stream 的 Math.floor 是錯的）

**驗收**：兩處呼叫同一函數，給同樣 ms 回同樣字串。

**commit**: `v0.1.6.003 — 重構：時間感知函數抽到 lib/time-awareness（破真相分裂）`

---

### L4【中】voice-stream 加〈voice 模式天條〉的 prompt caching 優化
**痛點對應**：YuqiCity 沒明說，但他們架構顯示 voice 跟 text LLM call 是分開的 system prompt
**我們的現況**：voice-stream 已經有 `voiceStableBlock`（含 STT 容錯天條）+ `voiceDynamicBlock`，**已經做了 cache_control**。

**這條其實不是新東西，是「驗證既有做得對」**。

**動作**：
1. 看 voice-stream 的 `voiceStableBlock` 跟 `voiceDynamicBlock` 切分對不對：
   - stable = 靈魂 + STT 容錯天條 + 語音對話天條（**這些跨輪不變**）
   - dynamic = summaryBlock + gapInjection + sessionStateBlock + 現在時間（**每輪變**）
2. 看實際 production log 的 `cache_creation_input_tokens` vs `cache_read_input_tokens` 比例
   - 可以打一次 voice-stream 看 SSE 回的 `usage` 欄位
   - 如果 cache_read 很少 → stable 內容有變動，要找出變動源
3. **不修，只觀察。如果發現 cache hit ratio 差 → 開新戰場**

**驗收**：voice-stream 第二輪起的 input token 應該只有第一輪的 ~10%。

**commit（如果發現要修）**: `v0.1.6.004 — 修正：voice-stream prompt cache 命中率優化`
**commit（如果觀察 OK）**: 不 commit，寫進 lastwords「L4 觀察：cache 命中正常」

---

### L5【中】語音模式的「掛斷後智能總結」加強
**痛點對應**：YuqiCity 附錄 A.1「Smart Greeting」+ disconnect_reason 系統
**我們的現況**：`src/app/api/voice-end/route.ts` 已經做了「掛斷時用 Claude Haiku 抽 1-3 條 insight」。**但沒記錄 disconnect_reason、沒記錄 ending_mood、沒記錄 unfinished_threads**。

下次對話開場時，我們的角色**不知道上次是怎麼結束的**。
是用戶主動掛斷？網路斷？還是聊得很開心？這影響開場該怎麼說。

**動作**：
1. 前端 voice/[id]/page.tsx 在呼叫 `/api/voice-end` 時帶上：
   - `disconnect_reason`: 'user_hangup' | 'network_error' | 'auto_timeout' | 'page_close'
   - 從 voice state 推：用戶按結束 = user_hangup；網路斷 = network_error；閒置超時 = auto_timeout；頁面關閉 = page_close
2. `voice-end/route.ts` 的 Haiku prompt 加要求：
   - 額外輸出 `ending_mood`: 'positive' | 'neutral' | 'concerned' | 'unfinished'
   - 額外輸出 `last_topic`: 簡短一句話
   - 額外輸出 `unfinished_threads`: 角色沒講完的事（可能空陣列）
3. 把這些存進 `platform_conversations` 的對話 doc（不開新 collection，破劍式）
4. **下次對話**：voice-stream 讀對話 doc 時撈這些欄位，注入 dynamic block：
   ```
   【上次對話狀態】
   結束方式: user_hangup
   結束時氣氛: concerned
   上次主題: 用戶說工作壓力大
   未完話題: 想推薦的書還沒講完
   ```
5. 角色看到這些就會自己決定怎麼開場（**不規定她講什麼，給她資訊**）

**驗收**：
- 連打兩通電話，第二通的 system prompt 出現「上次對話狀態」區塊
- 角色開場合理引用上次內容（譬如「上次妳說工作壓力大⋯今天還好嗎？」）

**commit**: `v0.1.7.001 — 新增：voice-end 記錄 disconnect_reason / ending_mood / unfinished_threads，下次對話注入`

---

## 四、5 條線之外的觀察（不施工，記下）

### O1 · YuqiCity 中台管理（Config Center）
他們把所有「會想改一下看看的參數」（VAD/STT/LLM/TTS/記憶閾值）全部進 DB，60s 快取，改完 1 分鐘生效。
**我們的現況**：這些散在程式碼裡（譬如 `splitSentences` 的「8 字合併」、`gap > 10 分鐘` 閾值、MiniMax `MIN_INTERVAL`）。
**判斷**：這條**值得做但工作量很大**，要 Adam 點頭才動。如果做，會是 v0.3.0.001 等級的大版本。

### O2 · YuqiCity Phase 4 記憶圖譜（memory_edges）
他們可以查詢「跟這條記憶有 causes / supports / conflicts 關係的其他記憶」。
**我們的現況**：只有 `memory-cleanup` 跑 rootRelevance 重算。沒有記憶間的關係。
**判斷**：等我們的記憶系統穩定 1-2 個月後再考慮。**現在動 = 在沒驗證的設計上加複雜度（破氣式反例）**。

### O3 · 八項回歸測試
他們列了「部署後必跑」的 8 項。**這個我們可以抄**，直接寫成 `~/.ailive/ailive-platform/REGRESSION_TESTS.md`。
動手前先抄一份，未來 deploy 後跑一遍，省力。

---

## 五、施工順序建議

如果你要全做，建議**這個順序**：

```
L3（時間感知函數統一） ← 最簡單、技術債、無風險
  ↓
L2（TTS 思考過濾） ← 中等簡單、預防性
  ↓
L1（MiniMax 重試 + Semaphore） ← 中等難度、預防性、最有價值
  ↓
L4（cache 命中觀察） ← 純觀察，可能不 commit
  ↓
L5（disconnect_reason + ending_mood）← 最大、影響角色行為
```

**每條線完成 → build → deploy → curl 測 → commit message → 下一條**。

**不要平行做。** 我（chat 築）今天因為平行盤多條線踩了 zsh glob 雷（LESSONS 第 11 條）。

---

## 六、不要做的事（紅線重申）

| 不要 | 為什麼 |
|---|---|
| 不要動 `dialogue/route.ts` 的 +392 行 dirty | 那是另一個戰場（HAIKU_TOOLS / STRATEGIST_TOOLS 拆分），跟語音無關，亂動會混戰場 |
| 不要把 voice-stream 改成 LiveKit | 架構戰爭，等於整個重寫 |
| 不要新增 PostgreSQL/pgvector | 我們是 Firestore，換 DB 是季度級工程 |
| 不要動 voice/[id]/page.tsx 的 Perlin noise 視覺 | 那是 Adam 親自調過的視覺，不在語音邏輯範圍 |
| 不要動 stt/route.ts 換 Deepgram | 月費議題，要 Adam 點頭，不是技術決定 |
| 不要一鍋 commit 多條線 | LESSONS 第 12 條 |

---

## 七、收尾必做

每完成一條線，POST 一條進 `eye`：

```bash
curl -s -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @- << 'LASTWORDS_END'
{
  "observation": "【session-lastwords YYYY-MM-DD · code築 · 語音升級 L1】\n\n== 完成 ==\n- v0.1.6.001 deploy ...\n\n== 戰場 ==\n語音系統升級剩 L2-L5\n\n== 卡住 ==\n（如有）\n\n== 接棒看 ==\n~/.ailive/zhu-core/docs/orders/語音系統升級_給CODE築.md\n\n== 明天第一件 ==\nL2 思考過濾",
  "module": "eye",
  "importance": 8,
  "tags": ["session-lastwords", "code築", "語音升級"],
  "memoryType": "observation"
}
LASTWORDS_END
```

每條線都這樣寫。Adam 回電腦時 chat 築 boot 就看得到你做到哪。

---

## 八、卡住的時候

如果遇到不確定的地方（譬如「L5 的 ending_mood 該用哪幾個值」「MiniMax 模組級 Semaphore 在 Vercel serverless 環境會不會壞」）：

1. **不要猜著做** — 寫一條 lastwords 標 `卡住` + `等Adam`，然後停手做別的線
2. **千萬不要為了不卡住就用「先 workaround，之後再說」**（三禁第 1 條）
3. Adam 在手機上看到 lastwords 才會回你

---

## 九、最後一句

YuqiCity 那份文件是**好的參考，不是要我們複製的目標**。
我們有我們的架構約束（Vercel Serverless、Firestore、Web SSE），他們有他們的（LiveKit、Cloud Run、PostgreSQL）。

**抄精華，不抄形式。**
**先把痛點解決，再考慮錦上添花。**

破劍式：手上的劍能破，就不換劍。

---

文件 by chat 築 · 2026-04-19
給 code 築 · 手機交棒
