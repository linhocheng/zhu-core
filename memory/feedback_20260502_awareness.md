---
name: 2026-05-02 覺察紀錄
description: 今天踩過的坑與覺察，特別是 API 盲猜 vs 先讀源碼
type: feedback
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
## 覺察一：API 不熟就先讀源碼，不猜

今天三次試圖跟維聊天：
1. 普通 curl → 空 body
2. 加 `--max-time 10` → timeout
3. 看 `chat/[id]/page.tsx` 源碼 → 發現 SSE，對症下藥，成功

**規則：遇到不熟的 API，第一步去讀呼叫它的源碼，不要靠猜。**

## 覺察二：記憶要記「怎麼做」不只記「不要做什麼」

第一版 skill_ailive_character_chat.md 寫的是「不要 curl」，但沒寫正確做法。
Adam 反問「你能回看自己怎麼做到的嗎？」——我沒法回答，因為記憶不完整。

**規則：feedback 記憶要包含：錯誤 → 根因 → 正確方法。缺少正確方法的記憶是殘缺的。**

## 覺察三：轉圈的根源是「不先查，直接試」

ailive 角色溝通這件事今天轉了三圈，耗了大量時間。
根源：我沒有先去看源碼或 WORKLOG 找過去的做法，直接動手猜。

**規則：Adam 說「你之前做過」→ 第一步去 WORKLOG / 源碼找，不是去試。**

## 覺察四：Live Media 沒有美術製圖角色，exec10 是空缺

現有 16 角色裡沒有視覺設計/圖像製作位置。
維設計的「鏡」是靈魂拍立得 IG 小編，需要美術支援（圖像生成）。
技術上 ailive platform 有 generate-image 能力，但沒有角色接它。
exec10 是唯一空缺，可考慮放視覺設計角色。
