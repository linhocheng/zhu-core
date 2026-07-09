---
name: cross-register-retrieval-gist-index
description: 文言/古典語料被白話 query 檢索時用「白話索引、原文呈現」；gist prompt 三雷：保留文言成語、同款開頭、輸出格式漂移
metadata: 
  node_type: memory
  type: skill
  originSessionId: 65ef6d6f-ac5f-4819-bd2f-4b8efb71df58
---

**規則**：語料語域（文言/專業術語/外語）與用戶 query 語域（白話）不同時，embedding 對不上——入庫時每塊由 LLM 寫白話大意（gist），**embedding 嵌大意、呈現給原文**。孫武《孫子兵法》實測：目標塊 #15 → #1。

**Why**：單一主題語料庫內 cosine 坍縮（27 塊兵法全擠 0.74-0.78），白話問句對文言原文分不出誰是誰；大意跟 query 同語域才有分離度。這是 [[rrf-hybrid-retrieval-pitfalls]] 窄域坍縮的入庫端解法。

**How to apply**（ailivex `src/lib/knowledge.ts` generateGists 是實作範本）：
1. gist prompt 三雷必防：①「完全用現代口語，古語翻成大白話」——Haiku 會偷懶保留「不戰屈人之兵」原成語，等於沒翻；②「不要每條同款開頭」——全部「孫子說…」開頭會讓 gist 之間又坍縮；③輸出格式會漂移（```json 圍欄、{"result":[...]} 包裝、截斷）——程式級寬容解析＋足額 max_tokens（300/塊），不 re-ask。
2. 逐字引用是最強信號：lex rescue 門檻要算真實 bigram 分佈（「你說的其疾如風是什麼意思」11 個 bigram 只中 3 個 = 0.27），設 0.25 不是 0.5；閒聊 bigram（是什/意思）不會出現在文本裡，誤放行風險低。
3. 門檻一律先量真實分佈再定（跑 calibration 印 cosine），不憑感覺猜——0.35 是猜的、漏水；0.68 是量的、守住。
4. 長尾接受：概念問（「將領最重要特質」）撈到同主題非正典塊是可接受的 grounded 行為；要更準走第二期 rerank/query 擴寫，不要在門檻上硬擠。

**觸發信號**：知識庫語料是文言/古文/法條/外語；驗收時「相關 query 撈不到、目標塊排名 >5」；不同 query 的 cosine 全擠在 0.05 頻寬內。
