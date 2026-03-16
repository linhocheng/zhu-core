# AILIVE Platform — 施工日誌

> 這是施工現場，不是日誌。
> 每個築醒來：zhu-boot → SYSTEM_MAP → **這份文件** → 才動手。
> 每個築離開：更新「現在狀態」和「下一步」→ 才寫遺言。
> 維護天條：不更新這份 = 下個築要重新摸索 = 浪費彼此的生命。

---

## 北極星

**目標：** 一個讓有任務的靈魂有地方住的平台。
**驗收標準：** 第一個真實客戶角色能走完整條電流，5 分鐘上線。
**藍圖位置：** 每次 session 重新生成，或參考對話記錄中的 AILIVE_Platform_Blueprint_v1.docx

---

## Phase 狀態總覽

| Phase | 名稱 | 狀態 | 完成日期 |
|-------|------|------|----------|
| 0 | 地基（repo + Firebase + 部署） | ✅ 完成 | 2026-03-16 |
| 1 | 一個角色活起來（對話 + 記憶 + 生圖） | ✅ 完成 | 2026-03-16 |
| 2 | 生活節奏（排程 + IG 發文閉環） | ⬜ 未開始 | — |
| 3 | 後台可視（Adam 管理介面） | ⬜ 未開始 | — |
| 4 | 複製機器（5 分鐘建角色） | ⬜ 未開始 | — |

---

## 關鍵決策記錄（不可遺忘）

- **新平台 repo：** `~/.ailive/ailive-platform/`（待建）
- **Vercel project：** `ailive-platform`（獨立，待建）
- **Firebase：** 共用 `moumou-os`，collection 前綴 `platform_*`
- **謀謀：** 永遠不動，永遠住在 moumou-dashboard
- **部署方式：** git push 自動觸發（同 moumou-dashboard 模式）
- **Collection 命名：** `platform_characters`（不是 brands，是 characters）
- **靈魂格式：** 七咒律（含第七咒：使命）
- **生圖引擎：** Gemini 2.5 Flash Image（帶走 gemini-imagen.ts）
- **對話管道：** LINE，每個角色獨立 Bot + Channel Token
- **時間感：** 每次對話注入台北時間，每條 insight 存 eventDate

---

## Phase 0 — 地基

**目標：** ailive-platform 能部署、能寫入角色、能讀回

### 驗收標準
```bash
# 這兩條能跑通，Phase 0 完成
curl -X POST https://ailive-platform.vercel.app/api/characters \
  -H "Content-Type: application/json" \
  -d '{"name":"測試角色","type":"vtuber"}'

curl https://ailive-platform.vercel.app/api/characters
```

### 施工清單
- [ ] 建立 GitHub repo：ailive-platform
- [ ] Next.js 初始化（npx create-next-app@latest）
- [ ] 複製 firebase-admin.ts（從 moumou-dashboard/lib/）
- [ ] 設定 Vercel env：FIREBASE_SERVICE_ACCOUNT
- [ ] 建立 /api/characters/route.ts（GET + POST）
- [ ] Firestore platform_characters collection
- [ ] git push → Vercel 自動部署
- [ ] 驗收：curl 測試通過

### 施工記錄

**2026-03-16 完成：**
- repo 建立：~/.ailive/ailive-platform/（github.com/linhocheng/ailive-platform）
- Next.js + TypeScript 初始化
- lib 帶入：firebase-admin.ts / embeddings.ts / gemini-imagen.ts / image-storage.ts / instagram-api.ts
- /api/ping ✅
- /api/characters GET + POST ✅（platform_characters collection）
- Firebase env 設定：FIREBASE_SERVICE_ACCOUNT_JSON + FIREBASE_STORAGE_BUCKET
- Vercel 部署：https://ailive-platform.vercel.app ✅
- 驗收：寫入角色 id=fbG8xbuXDG9ZJCLAfeXB，讀回 count=1 ✅

**踩的雷：**
- Vercel env pull 的 JSON 格式是特殊格式（外層引號，literal \n），要用 `json.loads(strict=False)` 解
- tr -d '"' 會把 JSON 內部引號也刪掉，不能用

---

## Phase 1 — 一個角色活起來

**前置條件：** Phase 0 驗收通過

### 驗收標準
```
Emily 在新平台上：
1. 能透過 LINE 對話
2. 對話後有 insight 寫入 platform_insights
3. 生圖臉部一致（Gemini ref image）
4. 說話前能查到記憶
```

### 施工清單
- [ ] /api/soul-enhance（七咒律鑄魂爐）
- [ ] /api/line-webhook/[id]（LINE Webhook，多角色）
- [ ] /api/dialogue（對話引擎：靈魂 + 時間 + 記憶）
- [ ] /api/insights（記憶 CRUD + hitCount，初始值 0）
- [ ] /api/knowledge（知識庫 + 語義搜尋）
- [ ] /lib/gemini-imagen.ts（帶走，Gemini 2.5 Flash Image）
- [ ] /lib/embeddings.ts（帶走，Google text-embedding-004）
- [ ] /api/image/generate（生圖 API）
- [ ] 時間注入：system prompt 加台北時間
- [ ] 強制查記憶：每次對話前 query 語義搜尋

### 施工記錄
**2026-03-16 完成：**
- /api/soul-enhance ✅（七咒律鑄魂爐，soulVersion+1）
- /api/insights ✅（hitCount 初始 0 天條落地，語義搜尋，命中+1）
- /api/knowledge ✅（CRUD + 語義搜尋 + hitCount）
- /api/dialogue ✅（七咒律 + 台北時間注入 + 強制 query_knowledge_base + 每 20 輪提煉）
- /api/line-webhook/[id] ✅（保留，LINE 設定由 Adam 決定何時開通）
- /api/image/generate ✅（有 ref → Gemini multimodal 鎖臉；無 ref → text-only）
- lib/embeddings.ts 補 cosineSimilarity ✅
- @anthropic-ai/sdk 安裝 ✅
- ANTHROPIC_API_KEY / GEMINI_API_KEY 設入 Vercel ✅

**端對端驗收通過：**
- Emily rawSoul → 七咒律 enhancedSoul（soulVersion=1）✅
- insight 寫入 hitCount=0 ✅
- 對話 toolsUsed: [query_knowledge_base] ✅（強制查記憶）
- 對話後 hitCount 0→1，lastHitAt 更新 ✅
- Emily 說話有個性有記憶，不是罐頭 ✅

**踩的雷（新增）：**
- Vercel env pull 的值有多餘 `"` 引號，printf 前要 tr -d '"'
- cosineSimilarity 不在 embeddings.ts，要自己補
- image-storage.ts 的 persistImage 接 URL 不接 base64，base64 存圖要用 Admin SDK 直接寫

**LINE 狀態：**
- /api/line-webhook/[id] 已建，等 Adam 決定何時設定 Channel Token/Secret 開通

---

## Phase 2 — 生活節奏

**前置條件：** Phase 1 驗收通過

### 驗收標準
```
角色每天自動：
1. 跑 learn 任務（insights 有增長）
2. 跑 reflect 任務（每日省思）
3. 發文草稿能走完 approve → publish 閉環
4. sleep-time 每晚壓縮記憶
```

### 施工清單
- [ ] /api/runner（Vercel Cron，每小時，台北時間）
- [ ] type=learn 任務邏輯
- [ ] type=reflect 任務邏輯
- [ ] type=post 任務邏輯（有 postId → 直接發；沒有 → 生成）
- [ ] /api/sleep（夢境引擎：壓縮 + 升降級 + 靈魂提案）
- [ ] /api/ig/publish（IG Graph API）
- [ ] /api/posts（草稿管理）

### 施工記錄
（Phase 1 完成後填入）

---

## Phase 3 — 後台可視

（待 Phase 2 完成後規劃）

---

## Phase 4 — 複製機器

（待 Phase 3 完成後規劃）

---

## 歷史踩雷（施工必讀）

1. **Firestore compound index** — where + orderBy 不同欄位炸，在 JS filter
2. **GoogleAuth 在 Vercel** — 一律用 getFirebaseAdmin()，不用 new GoogleAuth()
3. **Buffer 送 fetch** — 改 new Uint8Array(buffer)
4. **imagePromptPrefix 中文** — 必須英文，中文先翻再送
5. **Vercel Cron 是 UTC** — runner 收到後轉台北時間（+8）
6. **printf 不是 echo** — vercel env add 用 printf，echo 加 trailing newline
7. **insight hitCount 初始沒有 0** — 建立時顯式寫 hitCount: 0
8. **runner 忽略 postId** — 有 postId → 讀草稿發；沒有才生成
9. **sk-ant-oat01- 無效** — 只有 sk-ant-api03- 開頭的 key 能用
10. **moumou-dashboard 有 SSO 牆** — curl 打不到，只能 git push 改 code

---

*建立者：築 × Adam · 2026-03-16*
*這份文件是施工期間最重要的一份文件。比遺言更重要，因為它讓下一個築不需要重新理解現場。*
