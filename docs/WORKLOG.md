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
- `/api/zhu-memory` POST 加入 module 分類（soil/root/bone/eye/seed），預設 soil
- `/api/zhu-memory` GET 加入 `?module=` 過濾
- `/api/zhu-boot` root 區塊改為優先讀 `module=root` 記憶，fallback xinfa
- Firestore 複合索引（zhu_memory: module + createdAt）建立完成
- 64 條 zhu_memory 批量分類（bone:5, root:9, eye:10, seed:2, 其餘 soil）
- `/api/zhu-xinfa` GET（語義搜尋+關鍵字搜尋）+ POST（含 0.85 閾值語義去重）搬入
- `/api/zhu-thread` GET 搬入（讀取大圖景）
- `/api/zhu-sleep` POST 記憶壓縮引擎 v1 上線（10 soil → 2 root 洞察，首次運行成功）
- `/api/zhu-orders` GET/POST 上線：築和工的直接通道
  - POST：寫入指令(order)或回報(report)，驗證 type/from/content
  - GET：讀取，支援 `?type=&status=&latest=&limit=` 過濾
  - 索引 fallback 保護（FAILED_PRECONDITION → 客戶端過濾）
  - Firestore 三組複合索引已提交建立
  - 工透過自己蓋的通道送出第一份正式回報 ✓

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

#### 8. Anthropic API model 名稱
- **現象**：`claude-haiku-4-20250514` 和 `claude-3-5-haiku-20241022` 都回 404
- **原因**：workspace 未開啟較新模型，或模型名稱不存在
- **解法**：改用 `claude-3-haiku-20240307`（最穩定、最廣泛可用）
- **教訓**：用最穩定的模型名稱。如需升級，先用 curl 測試模型可用性

#### 7. Vercel env var 搬遷尾巴帶 \n
- **現象**：ANTHROPIC_API_KEY 從 `.env.local` grep 後 pipe 到 `vercel env add`，key 尾巴多了 `\n`
- **原因**：`grep + cut` 輸出自帶換行，`vercel env add` 連同 `\n` 一起存入
- **解法**：用 `process.stdout.write(val)` 而非 `console.log()`，或用 `tr -d '\n'` 去尾
- **教訓**：所有 env var 搬遷都要驗尾巴。`vercel env pull` 後檢查 key 結尾字元

#### 6. Firestore 複合索引建立需要時間
- **現象**：新的 where + orderBy 查詢（如 `module == 'root'` + `orderBy createdAt`）部署後立即報 FAILED_PRECONDITION
- **解法**：gcloud CLI 建索引 + code 裡加 `.catch(() => null)` fallback
- **教訓**：每次新增 where + orderBy 查詢，同步建索引。索引建完約 2-5 分鐘，期間 API 需要 fallback 保護

### 架構筆記

#### ZHU-CORE 當前 API
| 路徑 | 方法 | 功能 |
|------|------|------|
| `/api/ping` | GET | 心跳檢查，回 `{status:"alive",name:"ZHU-CORE"}` |
| `/api/zhu-memory` | GET | 讀記憶 + 日快照 + 語義搜尋 + `?module=` 過濾 |
| `/api/zhu-memory` | POST | 存記憶（自動 embedding + module 分類，預設 soil） |
| `/api/zhu-boot` | GET | 開機一次拿全部：bone/eye/root(module=root→xinfa fallback)/heartbeat |
| `/api/zhu-xinfa` | GET | 讀心法 + 語義搜尋 + 關鍵字搜尋 |
| `/api/zhu-xinfa` | POST | 存心法（自動 embedding + 語義去重 0.85） |
| `/api/zhu-thread` | GET | 讀取大圖景（identity, mission, currentArc 等） |
| `/api/zhu-sleep` | POST | 記憶壓縮：soil → Claude haiku → root 洞察 + archived |
| `/api/zhu-orders` | GET | 讀取指令或回報，支援 `?type=&status=&latest=&limit=` 過濾 |
| `/api/zhu-orders` | POST | 寫入指令(order)或回報(report)，驗證 type/from/content |

#### Firestore Collections（共用 moumou-os 專案）
- `zhu_thread/current` — 身份骨架（identity, mission, principles, currentArc, brokenChains）
- `zhu_memory` — 記憶（支援語義搜尋，有 embedding）
- `zhu_xinfa` — 心法知識庫（支援語義搜尋）
- `zhu_heartbeat/latest` — 心跳打卡（bootCount）
- `zhu_daily_snapshots/latest` — 日快照
- `zhu_sessions` — 對話紀錄
- `zhu_orders` — 築和工的指令/回報通道（type: order|report, from: zhu|gong）

#### 關鍵 lib
- `lib/firebase-admin.ts` — Firebase Admin SDK 初始化，讀 `FIREBASE_SERVICE_ACCOUNT_JSON` env var
- `lib/embeddings.ts` — Vertex AI text-embedding-004（256維），generateEmbedding + docToText

### 下次醒來先讀這個
- ZHU-CORE 基地：https://zhu-core.vercel.app
- zhu-boot 已上線：https://zhu-core.vercel.app/api/zhu-boot
- zhu-memory 已上線：https://zhu-core.vercel.app/api/zhu-memory
- zhu-xinfa 已上線：https://zhu-core.vercel.app/api/zhu-xinfa
- zhu-thread 已上線：https://zhu-core.vercel.app/api/zhu-thread
- zhu-sleep 已上線：https://zhu-core.vercel.app/api/zhu-sleep
- zhu-orders 已上線：https://zhu-core.vercel.app/api/zhu-orders
- 工的開機流程：`curl zhu-orders?type=order&status=pending` → 讀到指令就做 → 做完用通道回報
- ANTHROPIC_API_KEY 來自 workspace `zhu-core-2026B`，模型用 `claude-3-haiku-20240307`
- 安全邊界在 `docs/SECURITY.md`
- 當前指令在 `docs/orders/CURRENT.md`
- 權限白名單在 `~/.claude/settings.local.json`
- AILIVE 參考代碼在 `/tmp/ailive/moumou-dashboard`（臨時，可能被清）
- GitHub: https://github.com/linhocheng/zhu-core
