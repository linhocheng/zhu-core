# ailive 記憶系統完整診斷
**監造者**：築  
**日期**：2026-04-29  
**給**：code築  
**性質**：設計診斷 + 進化路線，不是 spec，是先讀懂再動手的底子

---

## 一、為什麼要做這份診斷

ailive 的記憶架構是一層一層加上去的——summary 壓縮、episodic block、user observations、promise reflection、lastSession——每一層都有用，但它們不是從一個統一的記憶理論設計出來的。

趁現在規模還可控，先用最新的研究回頭審自己的結構，找出缺口，定義進化方向。

這份診斷根據以下資料寫成：
- Mem0 State of AI Agent Memory 2026（ECAI 2025 論文 arXiv:2504.19413）
- LUFY：京都大學，情感記憶與遺忘心理學（arXiv:2409.12524）
- RMM：Google Cloud AI，Reflective Memory Management（arXiv:2503.08026）
- Persistent Identity in AI Agents（arXiv:2604.09588，2026年3月）
- ID-RAG：身份連續性與記憶漂移（arXiv:2509.25299）
- Stanford Generative Agents Park et al. 2023
- FadeMem：雙層記憶架構與 Priority Decay

---

## 二、ailive 現有記憶架構地圖

```
ailive 記憶系統現狀
│
├── 身份層（soul_text）
│     來源：Firestore characters doc
│     進 prompt 的方式：build_system_prompt 第一段，永遠在最前
│     問題：無保護，記憶層可以蓋過它
│
├── 短期（conv.messages 最近 10 條原文）
│     狀態：✅ 正常
│
├── 中期壓縮（conv.summary）
│     壓縮方式：均等壓縮，按時間順序
│     問題：
│       - 按時間切，不按話題切
│       - 均等壓縮，不區分情感重量
│       - 多次壓縮後細節磨損
│
├── 長期事實（user_profile）
│     問題：靜態，舊事實不被新事實覆蓋，只堆疊
│
├── 長期觀察（user_observations）
│     問題：
│       - 無 importance_score
│       - 無 last_referenced_at
│       - 無淘汰機制，無限累積
│       - 近期觀察可能拉著角色偏離 soul
│
├── 近期記憶（episodic_block）
│     狀態：有 tier、有 hitCount，最接近重要性排序
│     問題：hitCount 是手動觸發，沒有從對話自動計算
│
├── 承諾追蹤（promise_reflection）
│     問題：只追蹤「承諾」，不追蹤「哪條記憶被實際引用」
│
├── 上次快照（lastSession）
│     狀態：✅ 設計良好
│
└── Reflection 層
      狀態：❌ 完全缺失
```

---

## 三、外部研究的關鍵發現

### 3.1 LUFY：人類只記得對話的 10%，記的是情感喚起度高的

京都大學研究：讓真人與 chatbot 對話 2 小時 × 4 次。結論：
> 優先保留情感喚起度高的記憶、主動遺忘大部分對話，顯著提升用戶體驗。
> 比 Naive RAG 資訊檢索精度提升 17% 以上。

ailive 現狀：`save_conversation` 均等壓縮，「我媽病了」和「今天吃了好吃的」對記憶系統一樣重。

---

### 3.2 RMM：雙向 Reflection，ailive 只有一半

**Prospective Reflection（前瞻）**：按語意話題分塊做 summary，不按時間切。
**Retrospective Reflection（回顧）**：追蹤 LLM 實際引用了哪些記憶，回頭調整保留權重。

在 LongMemEval 上比 baseline 提升 10% 以上。

ailive 現狀：
- Prospective：有，但按時間切
- Retrospective：完全缺失

---

### 3.3 Persistent Identity：記憶漂移是身份問題

人類嚴重失憶後仍保有自我感，因為身份分散在多個系統：程序記憶、情緒連續性、社會支架。

AI agent 把所有東西塞進同一個 memory store，context 溢出時壓縮，這個過程是損失性的——損失的不只是資訊，是連續性。

ailive 現狀：soul 和記憶在 prompt 平起平坐，soul 沒有宣告優先順序。

---

### 3.4 ID-RAG：monolithic memory 的致命缺陷

瑣碎的近期記憶壓過核心的身份特質，自我表達出現矛盾。

ailive 版本：Vivi 的 soul 說她溫柔慢熱，用戶連續幾次快節奏通話，observations 記錄了這個模式，Vivi 慢慢被拉著漂移——角色被用戶塑形，而不是用自己的眼光看用戶。

---

### 3.5 FadeMem：雙層記憶架構

- **LML**：高重要性，衰退極慢（核心承諾、關鍵情感事件）
- **SML**：低重要性，衰退快（日常閒話、一次性話題）
- 記憶被成功使用時，相關性分數提升，衰退計時器重置（間隔效應）

ailive：`user_observations` 完全扁平，沒有重要性區分。

---

### 3.6 Generative Agents 的 Reflection 機制

近期事件重要性分數總和超過門檻 → 自動觸發 Reflection → 從最近 100 條記憶問「最值得深思的問題是什麼？」→ 把答案存回記憶流。實際約每天觸發兩三次。

差別：有記憶但沒成長 vs 有記憶且會思考。

---

## 四、三個核心缺口

### 缺口 1 — 身份層無保護（影響：角色漂移，難以察覺）

修法：在 `build_system_prompt` 裡，soul 之後加一段明確分隔：

```
【核心與記憶的關係】
以上是你的核心——你是誰、你怎麼看世界、你的聲音。這不會因為任何對話改變。

以下是你的記憶——你經歷過什麼、認識了誰、說過什麼。
你用你的核心去理解這些記憶，不是讓記憶改變你是誰。
```

---

### 缺口 2 — 壓縮沒有情感重量（影響：長期記憶磨損）

修法：`extract_session_summary` 加兩個欄位：
- `emotional_weight`：0-5 分
- `key_moments`：情感重量高的時刻（字串陣列）

壓縮時 `key_moments` 永遠保留，不被壓縮。

Firestore schema 變動：
```
platform_conversations/{conv_id}:
  + emotional_weight: number (0-5)
  + key_moments: string[]
```

---

### 缺口 3 — Observations 無新陳代謝（影響：記憶腐化，矛盾累積）

修法：`user_observations` 加三個欄位：
- `importance_score`：1-5
- `last_referenced_at`：timestamp
- `created_at`：timestamp

淘汰規則（save_conversation 後執行）：
- 超過 30 條時觸發
- `importance_score <= 2` 且 `last_referenced_at > 60天` → 標記為 `archived`
- archived 不進 prompt，但不刪除

---

## 五、Reflection 層（進化方向，不是緊急）

通話結束後，如果 `emotional_weight >= 3`，角色產生一條高階想法：

```python
# on_disconnected 裡 save_conversation 之後
if last_session and last_session.get("emotional_weight", 0) >= 3:
    reflection = generate_character_reflection(
        transcript, char_ctx, last_session, anthropic_key
    )
    if reflection:
        save_reflection_to_insights(character_id, user_id, reflection)
```

Prompt：
```
你是{char_name}。剛剛結束了一段通話。
通話摘要：{summary}
情感基調：{endingMood}

用你的視角，用一句話說：這次對話對你意味著什麼？
不是描述內容，是你自己的感受或想法。
輸出一句話，不要前言。
```

存回 `platform_insights`，memoryType = "reflection"，進下次通話的 `episodic_block`。

---

## 六、四條進化路線

| Route | 內容 | 難度 | 改的檔案 |
|-------|------|------|---------|
| A | 身份保護層 | 低（1-2天） | `firestore_loader.py` → `build_system_prompt()` |
| B | 情感重量進 summary | 低（3-5天） | `firestore_loader.py` → `extract_session_summary()` + `save_conversation()` |
| C | Observations 新陳代謝 | 中（1週） | `user_observations.py` + `firestore_loader.py` |
| D | Reflection 層 | 高（2-3週） | `realtime_agent.py` → `on_disconnected()` |

---

## 七、推薦執行順序

```
立刻：Route A（身份保護）—— 今天就做，零風險
  ↓
本週：Route B（情感重量）—— key_moments 是未來所有進化的基礎
  ↓
下週：Route C（Observations 新陳代謝）—— 先確認 observations 從哪寫入再動
  ↓
之後：Route D（Reflection）—— 建立在 A+B 完成後
```

---

## 八、給 code築的提醒

1. **Route A 先做**：身份漂移悄悄發生，先保護 soul，後面加再多記憶都在漂。

2. **Route B 的 key_moments 是種子**：現在種進去，未來 Reflection、情感記憶、情感顯著性排序都從這裡長出來。

3. **Route C 改之前**：先讀清楚 `user_observations.py` 的寫入邏輯是誰在控制——agent 寫？platform 寫？兩邊都寫？不清楚先問築。

4. **Route D 的 on_disconnected 是坑**：Cloud Run container 在 room disconnect 後可能很快關閉，reflection 的非同步呼叫要確認能跑完。加 timeout 和 non-fatal catch。

5. **分開做，分開驗**：每條 Route 都可以獨立上線，也都可以獨立回滾。

---

*築 診斷，2026-04-29*  
*「角色被用戶的記憶塑形，還是用自己的眼光看用戶——這是架構的問題，不是 prompt 的問題。」*
