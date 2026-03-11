# SYSTEM_MAP.md — 環境事實地圖

> **給每一代築：**
> 這份文件記的是「系統長什麼樣子」的基本事實。
> 不是任務、不是教訓，是地圖。
>
> **維護原則（強制）：**
> 從「找到」到「知道」的那一刻，立刻補進來。
> 下次就不用找了。否則是在浪費彼此的 token。
>
> 不用等 session 結束。知道了就寫。

---

## 一、域名與部署

### moumou-dashboard（謀謀 + Emily 的身體）
| 域名 | 用途 | 注意 |
|---|---|---|
| `moumou-dashboard.vercel.app` | **Production**，真實 API 在這裡 | 打 API 一定用這個 |
| `moumou-dashboard-xxx-adams-projects.vercel.app` | Preview / 管理頁預設顯示 | **不是 production**，別用這個打 API |

**部署方式：push to git → Vercel auto-deploy（不需要 `npx vercel --prod`）**

### zhu-core（築的腦）
| 域名 | 用途 |
|---|---|
| `zhu-core.vercel.app` | Production，zhu-boot / zhu-memory / zhu-orders 全在這裡 |

**部署方式：需要手動 `npx vercel --prod`（不會 auto-deploy）**

---

## 二、Repo 對應

| Repo | 本機路徑 | 遠端 | 部署方式 |
|---|---|---|---|
| zhu-core | `~/.ailive/zhu-core/` | `linhocheng/zhu-core` | 手動 `npx vercel --prod` |
| AILIVE / moumou-dashboard | `~/.ailive/AILIVE/moumou-dashboard/` | `linhocheng/AILIVE` | git push → auto |

---

## 三、Firebase / Firestore

- **Project ID：** `moumou-os`
- 謀謀的資料和 Emily 的資料都在同一個 Firebase project
- Emily 用 `brandId` 隔離（Emily 的 brandId = `ICqydpeU7hNMRurpppCY`）
- `FIREBASE_SERVICE_ACCOUNT_JSON` 只在 Vercel Production 環境，本機 `.env.local` 裡沒有

**主要 Collections：**
| Collection | 用途 |
|---|---|
| `saas_brands` | 品牌資料（靈魂、visualIdentity 等） |
| `saas_insights` | Emily 的長期記憶（有 embedding） |
| `saas_conversations` | 對話 session 索引 |
| `saas_conversations/{id}/messages` | 對話訊息 |
| `saas_posts` | 排程貼文 |
| `saas_tasks` | 排程任務 |
| `saas_activity` | 活動 log |
| `ailive_events` | inter-agent 通訊（築 ↔ 謀謀） |

---

## 四、Emily 的路由地圖

| URL | 角色 | 對象 |
|---|---|---|
| `/vtuber/[brandId]/chat` | 對話入口（**唯一**） | 對外（訪客） |
| `/saas/[brandId]/hub` | 管理大廳（人設/記憶/夢） | Adam |
| `/saas/[brandId]/social` | 排程管理 | Adam |
| `/saas/[brandId]/soul` | 靈魂設定 | Adam |
| `/saas/[brandId]/memory` | 記憶管理 | Adam |
| `/saas/[brandId]/knowledge` | 知識庫 | Adam |

**已砍掉（2026-03-11）：**
- `/saas/[brandId]/chat` → 功能重複，砍掉
- `/vtuber/[brandId]/posts` → 功能重複，砍掉

---

## 五、API 端點速查

### moumou-dashboard API
| 端點 | 方法 | 用途 |
|---|---|---|
| `/api/saas-dialogue` | POST | Emily 對話主引擎 |
| `/api/saas-brands` | GET | 所有品牌列表 |
| `/api/saas-brands/[id]` | GET | 單一品牌資料 |
| `/api/saas-memory` | GET/POST/PATCH/DELETE | insight 管理（GET type=insights/conversations/activity） |
| `/api/saas-messages` | GET | 對話訊息（?sessionId=xxx） |
| `/api/saas-social` | GET/POST | 貼文管理 |
| `/api/saas-tasks` | GET/POST/PATCH | 任務管理 |
| `/api/saas-image` | POST | 生圖（有 referenceImageUrl → Kontext Pro；沒有 → MiniMax） |
| `/api/saas-runner` | POST | 執行排程任務 |
| `/api/saas-sleep` | POST | 夢引擎（記憶壓縮） |

### zhu-core API
| 端點 | 方法 | 用途 |
|---|---|---|
| `/api/zhu-boot` | GET | 開機載入（bone/eye/root/seed） |
| `/api/zhu-memory` | GET/POST | 築的記憶 |
| `/api/zhu-orders` | GET/POST/PATCH | 築→工 指令通道 |
| `/api/zhu-thread` | PATCH | 更新 completedChains/brokenChains |
| `/api/zhu-heartbeat` | POST | 心跳快照 |
| `/api/ailive-events` | GET/POST | inter-agent 通訊 |

---

## 六、工具環境事實

### zhu-bash（主武器）
- 本機 Mac 終端，無 proxy 限制
- 可以打所有外部 URL（Vercel、Firebase、API）
- **容器 bash 打不到外部 URL**（`host_not_allowed`），外部請求一律用 zhu-bash

### Vercel CLI
- `vercel logs` 預設顯示 preview domain 的 log
- 要看 production log 要指定 URL 或用 `--url moumou-dashboard.vercel.app`
- `vercel env ls` 看環境變數（值是加密的，看不到內容）

### 生圖系統
- `saas-image` API：有 `referenceImageUrl` 或 `model: 'kontext'` → fal.ai FLUX.1 Kontext Pro
- 否則 → MiniMax image-01
- Kontext Pro endpoint：`https://queue.fal.run/fal-ai/flux-pro/kontext`（async queue + polling）
- Emily 的臉 = `visualIdentity.characterSheet`（PRIMARY 參考照 URL）

---

## 七、常踩的坑（踩過就刻）

### 坑 1：Vercel preview domain ≠ production API
**現象：** curl 打到 `moumou-dashboard-xxx.vercel.app` 拿到舊版或 404
**原因：** Vercel 管理頁和 `vercel logs` 預設顯示 preview domain，不是 production
**正確做法：** 永遠打 `moumou-dashboard.vercel.app`

### 坑 2：str_replace 工具找不到檔案
**現象：** `str_replace` 回傳 `File not found`，但 `zhu-bash ls` 看得到
**原因：** str_replace 工具是容器工具，路徑在容器裡不存在
**正確做法：** 用 `zhu-bash python3` 寫 inline script 做字串替換

### 坑 3：saas-memory PATCH 不存在（已修）
**現象：** 要修改單條 insight 沒有 API
**狀態：** 2026-03-11 已加入 PATCH endpoint（允許更新 hitCount/title/content/tags）

### 坑 4：hitCount = None vs 0
**現象：** `FieldValue.increment(1)` 在 `hitCount: null` 的 doc 上不會產生錯誤，但結果不可預期
**原因：** 存 insight 時沒有設初始值
**正確做法：** 存任何 insight 時一律加 `hitCount: 0`

### 坑 5：semantic search score 門檻
**現象：** 門檻 0.2 太低（無關記憶混入），0.6 太高（相關記憶過不了）
**text-embedding-004 + 256維的實際分佈：** 相關約 0.5-0.7，不相關約 0.1-0.4
**目前設定：** 0.5（2026-03-11 調整）

### 坑 6：多行 TypeScript 字串替換用 sed 不可靠
**現象：** macOS sed 處理多行或特殊字符時出錯
**正確做法：** `python3 << 'EOF'` inline script，直接 read/replace/write

### 坑 7：curl pipe python3 << 'EOF' 在 zhu-bash 會失敗
**現象：** `curl ... | python3 << 'EOF'` 報錯（stdin 衝突）
**正確做法：** 先 `curl -o /tmp/file.json`，再 `python3 -c "..."` 讀檔案

### 坑 8：Emily 的假記憶開場
**現象：** Emily 說「我記得你，你是手工皮件設計師」，但那只是舊的 insight 殘影
**原因：** semantic search 把不相關的舊 insight 帶入，Emily 當作「真實記憶」說話
**修法：** 門檻調高 + system prompt 加記憶誠實原則 + 刪除不正確的 insight

### 坑 9：vtuber/chat 每次新 session
**現象：** 每次進 `/vtuber/chat` Emily 都從零開始，不記得之前聊過什麼
**原因：** sessionId 用 `web-{brandId}-{timestamp}` 每次都是新的
**修法（2026-03-11）：** 進入時先查最近 session，接續對話

---

## 八、Emily 當前狀態（最後更新：2026-03-11）

| 功能 | 狀態 | 備註 |
|---|---|---|
| 靈魂有聲音 | ✅ | enhancedSoul 1631字 |
| 說記下了是真的 | ✅ | remember tool 有明確觸發條件 |
| 開場不假設身份 | ✅ | 記憶誠實原則已注入 |
| 對話接續歷史 | ✅ | vtuber/chat 已修 |
| 對話壓縮摘要 | ✅ | 30輪觸發 MiniMax |
| 夢引擎 | ✅ | saas-sleep |
| 大廳 hub | ✅ | 四個 tab |
| 臉孔鎖定電路 | ✅ | 有 characterSheet → Kontext Pro |
| semantic search | ✅ | 門檻 0.5，256維 |
| hitCount 更新 | 🔄 | 調查中（score 可能沒過門檻） |
| saas-runner 主動自學 | ⬜ | 殼在，魂沒有 |
| 漂移偵測 | ⬜ | 未建 |
| PERSONA_TEMPLATE.md | ⬜ | 未建 |

---

*建立：築 2026-03-11*
*維護原則：從「找到」到「知道」就寫進來。不等 session 結束。*
