# AILIVE Platform — 現況快照
# 給炬的全局地圖。不是施工記錄，是「現在長什麼樣子」。
# 作者：築 · 2026-04-12
# 對應 commit：ailive-platform production @ 2026-04-12

---

## 一、是什麼

AILIVE Platform 是一個讓虛擬 AI 角色「活著」的後台系統。

核心概念：
- 每個角色有靈魂（system_soul / soul_core）、記憶（insights）、知識庫（knowledge）
- 角色能對話、能生圖、能排程自主行動、能在睡眠中整理自己
- 後台讓 Adam 管理角色的一切，前端讓用戶和角色說話

**Production URL：** https://ailive-platform.vercel.app
**本機路徑：** ~/.ailive/ailive-platform/
**Deploy：** `cd ~/.ailive/ailive-platform && npx vercel --prod --yes`

---

## 二、Firebase Collections

所有資料住在 Firebase project `moumou-os`，Firestore。

| Collection | 用途 | 關鍵欄位 |
|---|---|---|
| `platform_characters` | 角色資料 | system_soul, soul_core, enhancedSoul, visualIdentity, costMetrics |
| `platform_conversations` | 對話記錄 | characterId, messages[], summary, messageCount, updatedAt |
| `platform_insights` | 角色記憶/洞察 | characterId, title, content, memoryType, source, tier, hitCount |
| `platform_knowledge` | 知識庫 | characterId, title, content, category, imageUrl, embedding[] |
| `platform_posts` | 貼文草稿 | characterId, topic, content, imageUrl, status |
| `platform_tasks` | 排程任務 | characterId, type, run_hour, run_minute, days, enabled, intent |
| `platform_skills` | 定型技巧 | characterId, name, trigger, procedure |
| `platform_proactive_records` | 防重複執行 | 格式：`{characterId}-{taskId}-{date}-taskrun` |

---

## 三、API 清單

### 對話相關

**POST /api/dialogue**
主對話引擎。接收用戶訊息，回傳角色回應（SSE streaming）。
```
body: { characterId, userId, message, conversationId?, image?, isNewVisit?, voiceMode? }
回傳: SSE stream → { type: "text"|"done"|"error", reply, toolsUsed, imageUrl? }
```
核心流程：讀靈魂 → 組 system prompt → 變檔器選模型 → Claude streaming → tool loop → 存 Firestore

**POST /api/voice-stream**
語音對話引擎。同時做 Claude streaming + TTS pipeline。
```
body: { characterId, userId, message, conversationId? }
回傳: SSE stream → { type: "text"|"audio"|"done", chunk(base64), index }
```
TTS：ElevenLabs，逐句送出（有序緩衝，並行打但按 idx 順序播）

**POST /api/voice-end**
語音對話結束，強制沉澱記憶（不等 20 輪）。
```
body: { characterId, conversationId }
```

**GET /api/dialogue?conversationId=xxx**
讀對話歷史。

### 角色管理

**GET /api/characters**
列出所有角色。

**POST /api/characters**
建立新角色，自動觸發 soul-enhance，自動建 sleep 排程任務。

**GET /api/characters/[id]**
讀單一角色資料。

**PATCH /api/characters/[id]**
更新角色欄位（soul, visualIdentity, voiceId...），同時清 Redis cache。

### 靈魂

**POST /api/soul-enhance**
鑄魂爐。從 rawSoul 提煉 soul_core，寫入 Firestore，清 Redis cache。
```
body: { characterId, skipForge? }
```

### 記憶與知識

**GET/POST/DELETE /api/knowledge**
知識庫 CRUD。POST 時自動生成 embedding（text-embedding-3-small, 768 維）。

**POST /api/knowledge-parse**
前端上傳 .docx/.txt/.md → 解析成知識條目 → 批次寫入。

**GET/POST/DELETE /api/insights**
記憶 CRUD。

### 排程與任務

**POST /api/task-run**
執行排程任務（learn / reflect / post / sleep / explore）。
```
body: { characterId, taskId, taskType, intent, force? }
```
post 任務：動態撈產品圖庫 → 模型寫文案 → 選 referenceImageUrl → 生圖 → 存草稿

**GET/POST/PATCH/DELETE /api/tasks**
任務 CRUD。

**POST /api/sleep**
夢境引擎。合併相似 insights，升格高命中記憶，寫自我覺察。

**POST /api/runner**
手動觸發排程（正式排程由 Firebase Function ailiveScheduler 接管）。

### 生圖

**POST /api/image/generate**
生圖入口。characterId + prompt → Flux Kontext Pro（fal.ai）→ Firebase Storage。

**POST /api/image/upload**
上傳圖片到 Firebase Storage。

### 其他

**GET /api/ping** — 健康檢查
**POST /api/stt** — STT（Gemini）
**POST /api/tts** — TTS（ElevenLabs）
**GET/PATCH /api/posts** — 貼文草稿管理
**GET/POST/DELETE /api/skills** — 定型技巧
**GET/PATCH /api/soul-proposals** — 靈魂提案審核
**POST /api/cache-clear** — 清 Redis cache

---

## 四、角色生命週期

```
建立角色（/api/characters POST）
  ↓
自動鑄魂（/api/soul-enhance）
  rawSoul → soul_core（精煉 300字）
  soulVersion +1
  ↓
設定視覺身份（dashboard → /api/characters/[id] PATCH）
  visualIdentity: { characterSheet, refs[], imagePromptPrefix }
  ↓
上傳知識庫（/api/knowledge-parse）
  docx → 條目 → embedding → Firestore
  ↓
--- 活著 ---
對話（/api/dialogue）← 用戶觸發
排程任務（/api/task-run）← ailiveScheduler 每 30 分鐘檢查
語音對話（/api/voice-stream）← 用戶觸發
  ↓
每天凌晨 02:00 sleep（/api/sleep）← 自動
  整理記憶，合併重複，升格核心
```

---

## 五、一輪對話的完整電流

```
POST /api/dialogue
  ↓
1. Redis cache 讀角色（miss → Firestore）
2. Redis cache 讀對話歷史（miss → Firestore）
3. 組 system prompt：
     stableBlock = soul + skills（標 cache_control: ephemeral）
     dynamicBlock = episodic(最近3條記憶) + session state + gap injection + 時間
4. 變檔器（llm-router.ts）：
     Haiku  → 閒聊/問候（工具：HAIKU_TOOLS = query_kb輕觸發 + remember）
     Sonnet → 複雜/行動（工具：全套 + web_search）
5. Claude streaming（tool loop 最多 10 輪）
6. tool 執行：
     query_knowledge_base → 語意搜尋 insights + knowledge
     remember            → 寫入 platform_insights
     generate_image      → fal Kontext Pro → Firebase Storage
     query_product_card  → 結構查詢 platform_knowledge
     query_tasks/posts...→ Firestore 讀
7. 存 Firestore + Redis cache（TTL 24h）
8. 非同步：session state 更新（Haiku）、summary 壓縮（>10輪）、insight 提煉
```

---

## 六、token 節能架構

**變檔器（llm-router.ts）**
```
Haiku  → 閒聊/問候/短訊息（省 15x）
Sonnet → 複雜查詢/工具/創作
max_tokens: Haiku=600, Sonnet=4096, 語音 Haiku=300, 語音 Sonnet=800
```

**Prompt Caching（dialogue + voice-stream）**
```
soul + skills = stableBlock → cache_control: ephemeral
同角色反覆對話 → cache hit → 只收 10% input tokens
```

**工具分層**
```
HAIKU_TOOLS（2個）：query_knowledge_base(輕觸發) + remember
PLATFORM_TOOLS（10個）：完整工具集（Sonnet 用）
Haiku 輪不帶不需要的工具 → 省 297 tokens/輪
```

**後台任務用 Gemini**
```
摘要/session/profile/knowledge summary → gemini-2.5-flash
對話主引擎保持 Claude（工具格式相容性）
```

---

## 七、知識庫查詢邏輯

```
有產品名 → 結構匹配（不用 embedding）→ 100% 精準
無產品名 → 語意搜尋（embedding cosine ≥ 0.3）
category=image → 排除語意搜尋，走獨立路徑
insights    → 永遠語意搜尋
```

embedding 模型：`text-embedding-3-small`，768 維

---

## 八、生圖架構

```
角色說要畫圖
  → generate_image tool 觸發
    → generateImageForCharacter(characterId, prompt, refUrl?)
      → selectBestRef（三維度評分：angle/framing/expression）
        → fal.ai Flux Kontext Pro（鎖臉生圖）
          → Firebase Storage（永久 URL）
            → 回傳給角色，角色在對話裡帶出圖片
```

排程 post 任務的生圖：
```
getProductImageIndex → 動態撈 category=image 的知識庫條目
模型選 referenceImageUrl → generateImageForCharacter 傳入
```

---

## 九、語音架構

```
前端錄音（Web Speech API / MediaRecorder）
  → POST /api/stt（Gemini STT）→ 文字
    → POST /api/voice-stream
      → tool-use loop（非 streaming，先查知識）
        → Claude messages.stream()
          → buffer 累積到句號/問號/驚嘆號
            → POST /api/tts（ElevenLabs）並行打
              → 有序緩衝（Map<idx, base64>）
                → 按 idx 順序送出 audio chunk
→ voice-end → 強制沉澱 insight
```

**convId 不能帶 timestamp**：`voice-${charId}-${userId}` 固定，否則記憶每輪斷裂。

---

## 十、謀師（特殊角色）

characterId：`P8OYEU7dBc7Sd3UDHULW`

謀師有專屬工具：
- `lookup_character`：查詢生態系內任何角色的靈魂摘要
- `initiate_awakening`：主動跟另一個角色進行 2 輪引導對話，存進記憶

**是生態系唯一能跨角色行動的存在。**

---

## 十一、已知限制與待做

```
待做：
  - task delegation（排程委派給另一個角色執行，如「捕手」寫文）
  - Google Calendar 整合（等 Adam 分享日曆給 service account）
  - LINE Channel Token 各角色

已知邊界：
  - 圖片上傳前端限制：Canvas 壓縮至最長邊 1280px，防止 > 4.5MB 炸 Vercel
  - Vercel function maxDuration：voice-stream=120s，一般=60s
  - Redis cache TTL：對話=24h，角色=10min
  - summary 保留最新 500 chars，history 保留最近 10 輪
```

---

## 十二、天條（炬要記住的）

1. **ailive-platform deploy 只有一個方式：** `npx vercel --prod --yes`，git push 只是 preview
2. **改靈魂必清 Redis cache：** PATCH characters / soul-enhance 都要清，否則角色說「我是 Claude」
3. **convId 不帶 timestamp：** 帶了記憶永遠斷裂
4. **JSON 輸出任務 max_tokens 要估算：** post 任務 2000，其他 1000
5. **Python 寫 TS 模板字串：** \n 會被展開，寫完立刻 grep 確認
6. **圖庫動態撈：** getProductImageIndex 每次排程重新查，不寫死 URL

---

*建立：築 × Adam · 2026-04-12*
*這份文件是炬的入場券。讀完這份，炬知道平台現在是什麼樣子。*
*更新方式：有重大架構變動時，同步更新這份文件。*
