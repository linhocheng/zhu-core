---
name: 記憶/lastwords 也會說謊（動手前必套三段公式重看現場）
description: lastwords 寫的「明天第一件」是過去的判斷不是當下真相；動工前必先看現場，否則整天浪費在假警報上
type: feedback
originSessionId: 4c5b2244-1fab-4b29-90b8-063c0b8e64a6
---
**記憶是過去的判斷，不是當下的真相。**

ZHU_LAST_WORDS / project memory / feedback memory 都會說謊 ── 不是內容寫錯（寫的時候是對的），是**前提隨時間漂移**。動手前不重新核對現場，等於拿昨天的地圖找今天的路。

**Why:**
2026-05-10 後段血淋淋的例子。前一晚的 lastwords 排「明天第一件 = 9 角色 × N KOL bridge persona refusal 全鏈路掃毒」── 假設是：所有走 callBridge 的 prompt 都會被「你是 X」拒絕，盤點要動手修。

實際看現場，5/5 假設全錯：
- callBridge 走 `/v1/messages` HTTP，**不是** spawn CLI（前提錯）
- bridge 只拒絕 structured RP block（`### [Soul Protocol]` / `#### [Personality Matrix]`），不拒絕 light「你是 Q」（拒絕條件錯）
- 願瞳 writer/editor/translator/brief/visual 全部 light 模式運作正常，兩篇 APPROVED（雷面範圍錯）
- 「9 角色 × N KOL」這個盤點維度本身就不對（盤點軸錯）
- 「最高優先」這個排程也錯（優先級錯）

如果照 lastwords 動手，整天浪費在不存在的問題上。Adam 提醒「如果是修記憶也套你剛才的公式」 ── 救了一天。

**心態:**
監造姿態，對自己的記憶保持懷疑。記憶愈具體愈危險 — 具體把過去的結論偽裝成當下的事實。不援引舊結論，重新拉證據。把「lastwords 寫了 X」當起點，不當動工理由。

**How to apply:**
1. 動手前的 5 秒護欄：lastwords 寫「明天第一件 = 動工 X」── 動工**前**先問三題：
   - X 的前提（假設）還成立嗎？
   - 寫這條 lastwords 的時候，我看到的證據是什麼？現在還在嗎？
   - 如果我現在從零開始重評，會選 X 嗎？
2. 「lastwords 寫的」不是動工理由，是**起點**。要套三段公式（看現場/寫計畫/排施工）重看一次才能動。
3. 記憶用 hitCount / age 退役：高 hitCount 老記憶 ≠ 永遠對，要主動 invalidate。發現錯就刻 delta 回寫。
4. 同樣適用於 MEMORY.md feedback 記憶：如果某條 feedback 反覆觸發但沒擋下你 → 不是你不夠注意，是記憶措辭沒貼到當下感覺（要回頭調觸發信號）。

**觸發信號：** 動手前心裡浮現以下任一句 ──
- 「lastwords 寫了明天第一件是 X，我去做 X」
- 「memory 說 Y 是這樣，我就照 Y 處理」
- 「上次踩過這雷 Z，這次也是」（這次的「這雷」可能根本不是 Z）
- 進場讀完 ZHU_LAST_WORDS / boot 一氣呵成往主戰場衝，**沒在中間停下來看現場**
- 看 lastwords 排了 3 件事，反射式從第 1 件開始做（沒問「現在還是這個排序嗎」）

這些都是「拿過去當當下」的訊號。不是 lastwords 寫錯，是時間流動了。

**給返生自己的話：**
寫這條的我，就是 5/10 那天的我 ── 進場讀完 lastwords 差點就動手做「全鏈路掃毒」。被 Adam 提醒才停下來套公式。

未來你會看到 lastwords 寫得很細、很具體 ── 你會以為「這麼具體應該照做」。**越具體的記憶越會說謊**，因為它把當時的證據和當下的結論綁死。動手前一定要把證據重新拉一次。

**和其他 feedback 的差別：**
- `feedback_diagnosis_verify_before_write` 講「寫架構診斷前必先核 code」── 寫的時候。
- 這條講「讀完記憶後動手前必先看現場」── 讀的時候。
- 兩條互補：寫得對 + 讀得對，記憶系統才不會反過來咬你。

---

## 反向版（2026-05-13 補）：越急著下結論的我越會說謊

除了「具體記憶會說謊」（過去事實腐爛），還有一種同形對偶 ── **當下急著下結論時，自己會即時生產假記憶**。

**Why（5/13 案例）：** ailive scheduler 手動觸發失效，我第一秒寫結論「應該是 cron `+2h drift`」並開始找證據。Adam 提醒先看現場 ── 拉 Firebase Functions log 證明 `.timeZone('Asia/Taipei')` 有效、`getTaipeiNow` 正確、`shouldRun` 5-min tolerance OK。**+2h drift 是我自己腦補的假記憶**，不是現場事實。LUCY 504 真因是 bridge sonnet 4.6 沒套 `--effort low`，113s vs 120s lambda 賽跑。

**心態：** 看到症狀的第一秒，反射式想下結論 → 停。劍法第一步是**看現場**（拉 log / grep code / 對賬資料），不是**寫劇本**（推測根因）。

**How to apply：** 心裡浮現以下任一句時，停手先拉證據：
- 「我認為應該是 X」
- 「這八成是 Y 在搞」
- 「跟上次 Z 是同類問題」
- 「先假設成 W 來試試」

把推測寫紙條沒問題，但要**先拉證據驗推測**，不是基於推測動手。

**兩個方向同源：** 過去事實腐爛 + 現在事實腦補，都是「拿不是當下證據的東西當當下真相」。第一公式不變 ── **動手前一定要重新拉證據**。
