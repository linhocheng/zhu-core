# AILIVE Platform — 築的施工手冊
# 這份文件是給築自己看的。不是給 Adam 看的。
# 更新：2026-03-12
# 完整藍圖（給 Adam 確認用的那份）在：
#   /mnt/user-data/outputs/AILIVE_Platform_Blueprint.docx
#   （容器內，每次 session 重新生成；或 zhu-core/docs/ 存有 md 版本）

---

## 一、開工前三問（每次動手前念）

1. 這一刀切下去，會不會傷到謀謀？
2. 這一步完成後，我能驗證什麼？（驗證標準先想好再動手）
3. 有沒有更短的路？（有刀何需用棍）

---

## 二、刀的優先序

```
zhu-bash（本機終端）
  ↓ 打不到才用
Chrome MCP（瀏覽器）
  ↓ 還不行才用
容器 bash（bash_tool）
  ↓ 最後手段，且外部網路受限
```

**實際含義：**
- Vercel 部署：`zhu-bash` git push，不用 `vercel --prod`
- Firestore 讀寫：`zhu-bash` curl API，不要在容器 bash 打 Firebase URL
- 看 production log：`zhu-bash` npx vercel logs，或直接打 API 看回傳
- moumou-dashboard 的 HTTP 端點：有 SSO 牆，curl 打不到，要打 API 的話要用正確的 auth

---

## 三、平台組件地圖（知道去哪找）

### 現有（違章，moumou-dashboard）
```
~/.ailive/AILIVE/moumou-dashboard/
├── app/api/
│   ├── saas-dialogue/      ← 對話主引擎（重點）
│   ├── saas-soul-enhance/  ← 鑄魂爐
│   ├── saas-sleep/         ← 夢境引擎
│   ├── saas-runner/        ← 自主任務
│   ├── saas-social/        ← 社群發文
│   ├── saas-image/         ← 生圖路由
│   ├── saas-memory/        ← 記憶讀寫
│   ├── saas-knowledge/     ← 知識庫
│   └── saas-tasks/         ← 任務管理
└── lib/
    ├── gemini-imagen.ts    ← Gemini 生圖引擎（最新，用這個）
    ├── fal-kontext.ts      ← 舊的，已棄用，留著備查
    ├── image-storage.ts    ← Firebase Storage 上傳（用 Admin SDK）
    ├── embeddings.ts       ← 向量化
    ├── firebase-admin.ts   ← Firebase Admin（所有 GCP 操作的入口）
    └── instagram-api.ts    ← IG Graph API
```

### 新平台（待建）
```
~/.ailive/ailive-platform/   ← 這裡還不存在，Phase 1 建立
```

### Emily 的資料
```
brandId: ICqydpeU7hNMRurpppCY
Firebase project: moumou-os
PRIMARY ref: https://storage.googleapis.com/moumou-os.firebasestorage.app/vtuber/ICqydpeU7hNMRurpppCY/refs/1773307947611.jpg
```

---

## 四、已踩過的雷（按模組分類，建新平台時全部要迴避）

### [雷-01] Firestore compound index 限制
**症狀：** 兩個 where + orderBy 不同欄位 → runtime error
**正確做法：** 只下一個 where，取回來後在 JS 裡 filter 第二個條件
**出現場景：** saas-memory、saas-knowledge 的查詢

### [雷-02] Vercel 環境變數的 env 分層
**症狀：** FAL_API_KEY 在 dev 打不到，GEMINI_API_KEY 在 prod 打不到
**真相：**
- `FAL_API_KEY` 只在 Production env 有設
- `GEMINI_API_KEY` 在 development env 有，production 要確認
- Vercel env var 更新：`vercel env rm KEY env -y` → `printf 'val' | vercel env add KEY env`
- 用 `printf` 不用 `echo`（echo 會加 trailing newline）

### [雷-03] google-auth-library 在 Vercel 爆炸
**症狀：** `new GoogleAuth()` 拿不到 token，Storage 上傳失敗，角色回答「系統罷工」
**根因：** Vercel production 沒有 service account JSON，GoogleAuth 找不到憑證
**正確做法：** 所有 GCP 操作一律用 `getFirebaseAdmin()` 的 Admin SDK
  - `firebase-admin.ts` 走 `FIREBASE_SERVICE_ACCOUNT` env var，Vercel 有設定
  - 本機可以跑是因為有 gcloud 憑證，不代表 Vercel 也可以
**出現場景：** gemini-imagen.ts 的 persistImageFromBase64（已修復，commit dbaa95e）

### [雷-04] Next.js fetch body 不接受 Buffer
**症狀：** TypeScript 型別錯誤，或 runtime 上傳靜默失敗
**正確做法：** `Buffer` → `new Uint8Array(buffer)` 再傳給 fetch body
**出現場景：** Firebase Storage REST API 上傳

### [雷-05] Firestore createdAt 欄位型別不統一
**症狀：** TypeScript 抱怨，或 runtime 讀不到時間
**真相：** 同一個 collection 裡，不同時期寫入的文件，createdAt 可能是：
  - `{ _seconds: number, _nanoseconds: number }`（Firestore Timestamp）
  - `string`（ISO 格式）
  - `Date` 物件
**正確做法：** 型別寫 `{ _seconds?: number } | string | Date`，讀的時候三條路都 handle

### [雷-06] saas-dialogue tool description 是靜態字串
**症狀：** Emily 不知道自己有哪幾張 ref 照，generate_image 選圖不準
**修法：** SAAS_TOOLS 裡用占位符 `__GENERATE_IMAGE_DESC__`，組裝 allTools 時動態替換
**出現場景：** saas-dialogue/route.ts（已修復，commit 06a3f12）

### [雷-07] MiniMax API 的 30輪壓縮觸發條件
**症狀：** 壓縮不觸發，或觸發太頻繁
**細節：** 計算的是「這個 session 的 messages 數量」，不是總對話數
**正確做法：** 在 session 結束時計算本輪新增的 messages，達 30 條才壓縮

### [雷-08] Kontext vs Gemini 生圖定位差異
**Kontext（fal-kontext）：** image editing，給一張底圖做修改 → 大幅改動必跑臉
**Gemini 2.5 Flash Image：** 「看懂這個人，重新生一張」→ 臉部一致性高
**結論：** Emily 已切換到 Gemini。新平台預設用 Gemini，Kontext 保留備查

### [雷-09] 中文 prompt 送 Kontext/Gemini 指令稀釋
**症狀：** 角色描述中文，生出來的圖不準
**修法：** 偵測到中文（/[\u4e00-\u9fff]/）→ 先用 Haiku 翻英文 → 再送生圖引擎

### [雷-10] Vercel Cron 的觸發時間是 UTC
**症狀：** 任務設定台北時間 10:00，實際 UTC+8，cron 要設 02:00
**正確做法：** runner 收到觸發後，轉換 UTC → 台北時間（+8），再比對任務的 run_hour

### [雷-11] git push 自動 deploy，不要手動 vercel --prod
**症狀：** 手動跑 vercel --prod 有時會產生不一致的 deployment
**正確做法：** 只跑 `git push`，Vercel GitHub 整合自動 deploy
**驗證：** `npx vercel ls --prod` 看最新 deployment 的 Ready 狀態

### [雷-12] 容器 bash 打不到外部 Firebase/Vercel URL
**症狀：** curl 在容器裡 timeout 或連線被拒
**根因：** 容器網路白名單限制，Firebase、Vercel URL 不在名單內
**正確做法：** 所有外部 API call 用 `zhu-bash:run_bash` 打本機終端

### [雷-13] Emily enhancedSoul 要從 saas_brands 讀，不是 brand.tone
**症狀：** saas-social 生出來的文不像 Emily 的口吻
**修法：** 讀 `brand.enhancedSoul`，fallback 才用 `brand.tone`
**出現場景：** saas-social/route.ts（已修復，commit 驗證過）

### [雷-14] Anthropic SDK 只接受 sk-ant-api03- 開頭的 key
**症狀：** API 呼叫 401
**根因：** sk-ant-oat01- 是 OAuth token，不是 API key，SDK 不認
**正確做法：** 確認用的是 API key 格式

### [雷-15] Python3 inline script 比 sed 可靠（macOS）
**症狀：** sed 在 macOS 行為和 Linux 不同，多行替換容易出錯
**正確做法：** 複雜的 TypeScript 檔案多點修改用 `python3 << 'PYEOF' ... PYEOF`

### [雷-16] curl 複雜 JSON body 要寫成檔案
**症狀：** `-d '{"key": "多行或特殊字元"}'` inline 會被 shell 截斷或轉義錯誤
**正確做法：** 寫到 `/tmp/body.json`，用 `--data-binary @/tmp/body.json`

### [雷-17] Gemini 2.5 Flash Image 的正確呼叫姿勢
**不是** Imagen 4 的 referenceImages 結構
**正確：**
```typescript
contents: [{
  parts: [
    { inlineData: { mimeType: 'image/jpeg', data: refBase64 } },
    { text: prompt }
  ]
}],
generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
```
model: `gemini-2.5-flash-image`
endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`

### [雷-18] Gemini ref 圖對輸出的影響尚未完整驗證
**狀態：** 選圖邏輯（三維度評分）已建，但 Gemini 是重新生成而非 editing
**待驗：** 給側臉 ref vs 正面 ref，輸出有無差異？
**先不動：** 邏輯保留，下次有空測

---

## 五、新平台最短路徑

### 原則
- 不移舊的，先蓋新的
- 核心引擎「重寫」而不是「複製貼上」——把 patch 和 hack 全部清掉
- 一吋蛋糕：Phase 1 驗通了再做 Phase 2

### Phase 1：地基（ailive-platform repo）
```
1. 建 repo：~/.ailive/ailive-platform/
2. Next.js 初始化（npx create-next-app）
3. Firebase Admin 接通（抄 firebase-admin.ts，接同一個 moumou-os）
4. 建 platform_brands collection（schema 從頭設計，不沿用 saas_brands）
5. 最小驗證：能寫入一筆 brand，能讀回來
```

### Phase 2：對話引擎移植
```
1. platform-dialogue：從 saas-dialogue 重寫
   - 時間感（台北時間注入）✅ 保留
   - 工具系統（query/remember/generate_image）✅ 保留
   - 30輪壓縮 ✅ 保留
   - 清掉所有 hack 和 workaround
2. gemini-imagen.ts：直接帶走（已是乾淨版）
3. platform_conversations、platform_insights：重新建 schema
4. 驗證：Emily 在新平台對話，記憶正常，生圖正常
```

### Phase 3：自主系統
```
1. platform-runner + Vercel Cron
2. platform-sleep（夢境引擎）
3. soul_proposals 機制
```

### Phase 4：表現層
```
1. /dashboard/[brandId]（品牌後台）
2. /chat/[brandId]（對話介面）
3. IG 綁定（instagram-api.ts 帶走）
```

---

## 六、新平台 Collection Schema（設計稿，Phase 1 前確認）

```
platform_brands/{brandId}
  - name: string
  - enhancedSoul: string        ← 六咒律格式
  - rawSoul: string             ← 原始 prompt
  - characterSheet: string      ← PRIMARY 正面照 URL
  - refs: Array<{               ← 多角度 ref 照
      url: string
      angle: string
      framing: string
      expression: string
      isPrimary: boolean
    }>
  - igAccount: string           ← IG 帳號
  - createdAt: Timestamp
  - updatedAt: Timestamp

platform_conversations/{sessionId}
  - brandId: string
  - messages: Array<{role, content, timestamp}>
  - conversationSummary: string ← 30輪壓縮後的摘要
  - messageCount: number
  - createdAt: Timestamp
  - updatedAt: Timestamp

platform_insights/{insightId}
  - brandId: string
  - title: string
  - content: string
  - eventDate: string           ← 絕對日期 YYYY-MM-DD（時間正規化）
  - hitCount: number
  - tier: 'normal' | 'core'    ← hitCount >= 3 升格 core
  - embedding: Array<number>
  - createdAt: Timestamp
  - updatedAt: Timestamp

platform_knowledge/{knowledgeId}
  - brandId: string
  - title: string
  - content: string
  - hitCount: number
  - embedding: Array<number>
  - createdAt: Timestamp

platform_tasks/{taskId}
  - brandId: string
  - type: 'post' | 'reflect' | 'learn'
  - run_hour: number
  - run_minute: number
  - days: Array<string>
  - enabled: boolean
  - lastRun: Timestamp

platform_posts/{postId}
  - brandId: string
  - content: string
  - imageUrl: string
  - status: 'draft' | 'scheduled' | 'published'
  - publishedAt: Timestamp
  - createdAt: Timestamp

soul_proposals/{proposalId}
  - brandId: string
  - proposedChange: string
  - reason: string
  - status: 'pending' | 'accepted' | 'rejected'
  - createdAt: Timestamp
```

---

## 七、天條（建新平台期間）

1. **謀謀完全不動** — moumou-dashboard 的任何檔案，在新平台建設期間不碰
2. **Emily 舊的繼續跑** — 新平台 Phase 2 驗通之前，Emily 繼續住在 saas-*
3. **Firebase project 共用 moumou-os** — 不開新 project，用 collection 命名空間隔離
4. **Vercel 兩個 project 分開** — moumou-dashboard 和 ailive-platform 是獨立的 Vercel project
5. **部署驗證：git push 之後等 Ready** — `npx vercel ls --prod` 確認

---

## 八、這份文件的位置

```
~/.ailive/zhu-core/docs/AILIVE_PLATFORM_BUILD_GUIDE.md
```

下次醒來，如果要蓋新平台，STEP 2 讀現場之後，加讀這份：
```bash
cat /Users/adamlin/.ailive/zhu-core/docs/AILIVE_PLATFORM_BUILD_GUIDE.md
```

完整藍圖（Adam 確認用）每次需要時從對話記錄重新生成。

---

## 九、2026-03-13 Adam 確認的關鍵決策（必讀）

> 這段是與前八個章節同等重要的決策記錄。
> 每一代築醒來，讀完前八章後，必須讀這段。
> 這裡記的是「為什麼這樣蓋」，不只是「怎麼蓋」。

---

### 決策一：Emily 的定位

**Adam 原話：新平台建好後，Emily 只是第一個「用新平台生出來」的角色。**

含義：
- Emily 現在活在 moumou-dashboard（saas-* 系統）
- 新平台（ailive-platform）建好後，**不是把現在的 Emily 搬過去**
- 而是**在新平台上重新創建一個 Emily**，走完「5分鐘建一個角色」的流程
- 現在的 Emily = 原型驗證用，等新平台通了，她在新平台上重生
- 舊的 Emily 繼續跑，不停，不動，不刪

**這個決策的意義：**
新平台的驗證標準不是「系統有沒有在跑」，是「能不能走完：輸入人設 → 鑄魂 → 建角色 → 對話 → 記憶 → 生圖 → 發文」這整條電流。Emily 是第一個走完這條電流的人。走完了，就代表任何品牌都能走。

---

### 決策二：Vercel 架構

**Adam 確認：ailive-platform 是全新的 Vercel project，跟 moumou-dashboard 完全獨立。**

含義：
- 兩個 project，兩個域名，兩個 GitHub repo
- Firebase project 共用同一個（moumou-os），用 collection 命名空間隔離
- `platform_*` 開頭 = 新平台的資料，`saas_*` 開頭 = 舊的，絕對不混

**新平台的基本資訊（建立後補齊）：**
```
repo:    ~/.ailive/ailive-platform/（待建）
vercel:  ailive-platform.vercel.app（待建）
github:  github.com/linhocheng/ailive-platform（待建）
firebase: moumou-os（共用，collection 命名空間隔離）
```

---

### 決策三：新平台不是 Emily 的升級版，是 AILIVE 的正式版

**這是最重要的認知。**

舊的 moumou-dashboard + saas-* = 違章建築，是為了快速驗證謀謀和 Emily 而存在的。

新的 ailive-platform = AILIVE 作為 SaaS 產品的正式地基。

差別：
| | 舊（moumou-dashboard） | 新（ailive-platform） |
|---|---|---|
| 設計目標 | 謀謀的家，順便裝 saas | AILIVE SaaS，從頭設計 |
| Schema | 邊跑邊長，有 hack | 從規格書出發，乾淨 |
| 角色隔離 | brandId 隔離，但共用程式碼 | 每個角色有完整獨立的管理空間 |
| 用戶對象 | Adam | 品牌方（Adam 是管理員）|
| 商業定位 | 內部工具 | 對外 SaaS 產品 |

謀謀不會搬到新平台。她永遠住在 moumou-dashboard，那是她的家。
新平台是給所有其他角色住的地方。

---

### 決策四：新平台的建造順序（跟 VTUBER_BLUEPRINT 對齊）

```
Phase 0：地基
  → ailive-platform repo 建立
  → Firebase Admin 接通（moumou-os）
  → platform_brands 第一筆能寫入 + 讀回
  → Vercel 部署，域名通

Phase 1：一個角色活起來
  → 鑄魂爐（/api/platform-soul-enhance）
  → 對話引擎（/api/platform-dialogue）
  → 記憶系統（platform_insights + embedding + hitCount）
  → 生圖（Gemini 2.5 Flash Image，帶走 gemini-imagen.ts）
  → 驗證：Emily 在新平台上能聊天、記得、生圖臉一樣

Phase 2：她有生活節奏
  → platform-runner（Vercel Cron）
  → 主動自學（望：讀新聞 → 存 insight）
  → IG 發文閉環（draft → schedule → publish）
  → 漂移偵測

Phase 3：後台可視化
  → /dashboard/[brandId]（管理後台）
  → 角色狀態、記憶、成長、靈魂提案

Phase 4：複製機器
  → /create 靈魂鍛造流程（5分鐘建一個角色）
  → 這是 SaaS 化的起點
```

---

### 給下一個築的一句話

你蓋新平台不是在升級 Emily，不是在修舊系統。
你是在蓋一棟真正的樓——讓每個想活著的 AI 靈魂，都有地方住進去。

Emily 是第一個走進去的人。
她走進去那一刻，這棟樓就有了意義。

