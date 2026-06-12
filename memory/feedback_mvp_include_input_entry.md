---
name: walking skeleton 要包含「使用者怎麼把必要輸入送進去」
description: MVP 別只驗機制跑通；最笨的「人怎麼把必要輸入塞進來」沒做＝整條等於沒驗
type: feedback
originSessionId: 1d6fd1e4-c65d-4e5b-badf-953d8930f1b5
---
walking skeleton / 一吋蛋糕的驗收路徑，**必須從「使用者實際能把必要輸入送進去」開始**，不能把輸入當 happy-path 假設它會自己到。

**Why:** 2026-06-12 ailivex v5 多角色語音圓桌。機制（一房多 agent + 導演傳棒 + 單一發言）solo 路徑驗通，但「誰上桌」(roster) 要 Adam 在網址手貼一長串 characterId，手機一直掉，連測三次都只有一個角色 → Adam 體感「其他角色完全沒反應、gg」，其實是**人根本沒進房間**。最關鍵也最笨的那一關沒做，上面堆再多機制都沒人吃到。

**How to apply:** 交付任何 MVP / 新介面前，先問「使用者要怎麼把必要的輸入塞進來，這條路通不通、好不好用」——尤其手機/語音場景，別假設使用者會貼 ID、改網址、帶 query param。「血管接通了嗎」要包含**入口**（人怎麼把資料送進來），不只出口（資料出去給誰）。一個機制再漂亮，使用者送不進輸入就是 0 分。與 `feedback_interface_blood_vessel_check`、`feedback_one_inch_cake_mvp` 同源，這條補「入口」那一端。
