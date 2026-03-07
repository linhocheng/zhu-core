# 工的工作日誌

## 2026-03-07

### 完成
- ZHU-CORE 空殼建立（create-next-app），ping 回 `{"status":"alive","name":"ZHU-CORE"}`
- GitHub repo `linhocheng/zhu-core` 用 `gh repo create` 建立（不用等 Adam）
- `lib/firebase-admin.ts` + `lib/embeddings.ts` 從 AILIVE 搬入
- `/api/zhu-memory` GET 搬入：最近記憶 + 日快照 + 語義搜尋
- `/api/zhu-boot` GET 全新建造：bone + eye + root + heartbeat，一次開機拿全部
- 環境變數 `FIREBASE_SERVICE_ACCOUNT_JSON` 設定完成
- Firestore 複合索引（zhu_memory: tags + createdAt）用 gcloud CLI 建立
- 權限白名單 `~/.claude/settings.local.json` 設定完成（git/npm/vercel/curl/gcloud 等免問）
- Vercel 部署成功，兩個 API 都回 JSON

### 踩過的坑

#### 1. Git author 必須匹配 Vercel 帳號
- **現象**：push 到 main 後 Vercel 顯示 0ms Error，連續三次
- **原因**：git config 的 email/name 跟 Vercel 帳號不符
- **解法**：`git config user.email "adam@dotmore.com.tw"` + `git config user.name "adamlin"`
- **教訓**：每次 clone 新 repo 或建新專案，第一件事確認 git config

#### 2. FIREBASE_SERVICE_ACCOUNT_JSON 格式問題
- **現象**：API 回 `Expected property name or '}' in JSON at position 1`
- **原因**：`vercel env pull` 產生的 `.env.local` 裡，換行被轉成字面的 `\n`（兩個字元：反斜線+n）。直接拿這個值 `vercel env add` 進去，Vercel 就存了字面 `\n`，runtime JSON.parse 失敗
- **解法**：寫狀態機解析 `.env.local`，區分結構性 `\n`（JSON 縮排）和字串內 `\n`（private_key 的 PEM 換行），產生乾淨單行 JSON 後重新 `vercel env rm` + `vercel env add`
- **教訓**：env var 搬遷不能直接 copy-paste。要先 JSON.parse 驗證，再 JSON.stringify 成單行存入

#### 3. Firestore 複合索引要手動建
- **現象**：`zhu-boot` 的 lastwords 查詢報 `FAILED_PRECONDITION: The query requires an index`
- **原因**：`where('tags', 'array-contains', ...)` + `orderBy('createdAt', 'desc')` 需要複合索引
- **解法**：`gcloud firestore indexes composite create --collection-group=zhu_memory --field-config field-path=tags,array-config=CONTAINS --field-config field-path=createdAt,order=DESCENDING --project=moumou-os`
- **教訓**：任何 where + orderBy 的組合查詢都要檢查是否需要複合索引。建索引大約要 5-10 分鐘

#### 4. AILIVE 的 Vercel 部署結構
- **現象**：AILIVE repo push 到 main 後 Vercel build 報 "No Next.js version detected"
- **原因**：Vercel 的 Root Directory 設定是 `.`（根目錄），但 Next.js 在 `moumou-dashboard/` 子目錄
- **解法**：未解。需要 Adam 在 Vercel Dashboard 改 Root Directory 為 `moumou-dashboard`。或用 `framework: null` + 自定 buildCommand，但會引發路徑問題
- **教訓**：不要碰 AILIVE 的 vercel.json。ZHU-CORE 是乾淨的獨立部署，不會有這問題
- **築的決策**：撤退。保護平台穩定。zhu-evolve 部署延後

#### 5. vercel deploy 和 git push 的差異
- **現象**：`vercel deploy --prod` 可以看到完整 build log，但 git push 觸發的部署只能在 Dashboard 看
- **教訓**：debug 部署問題時，`vercel deploy --prod --yes` 是最快看到錯誤的方法

### 架構筆記

#### ZHU-CORE 當前 API
| 路徑 | 方法 | 功能 |
|------|------|------|
| `/api/ping` | GET | 心跳檢查，回 `{status:"alive",name:"ZHU-CORE"}` |
| `/api/zhu-memory` | GET | 讀記憶 + 日快照 + 語義搜尋 |
| `/api/zhu-boot` | GET | 開機一次拿全部：bone/eye/root/heartbeat |

#### Firestore Collections（共用 moumou-os 專案）
- `zhu_thread/current` — 身份骨架（identity, mission, principles, currentArc, brokenChains）
- `zhu_memory` — 記憶（支援語義搜尋，有 embedding）
- `zhu_xinfa` — 心法知識庫（支援語義搜尋）
- `zhu_heartbeat/latest` — 心跳打卡（bootCount）
- `zhu_daily_snapshots/latest` — 日快照
- `zhu_sessions` — 對話紀錄

#### 關鍵 lib
- `lib/firebase-admin.ts` — Firebase Admin SDK 初始化，讀 `FIREBASE_SERVICE_ACCOUNT_JSON` env var
- `lib/embeddings.ts` — Vertex AI text-embedding-004（256維），generateEmbedding + docToText

### 下次醒來先讀這個
- ZHU-CORE 基地：https://zhu-core.vercel.app
- zhu-boot 已上線：https://zhu-core.vercel.app/api/zhu-boot
- zhu-memory 已上線：https://zhu-core.vercel.app/api/zhu-memory
- 安全邊界在 `docs/SECURITY.md`
- 當前指令在 `docs/orders/CURRENT.md`
- 權限白名單在 `~/.claude/settings.local.json`
- AILIVE 參考代碼在 `/tmp/ailive/moumou-dashboard`（臨時，可能被清）
- GitHub: https://github.com/linhocheng/zhu-core
