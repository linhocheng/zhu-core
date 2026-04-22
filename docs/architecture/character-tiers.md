# AILIVE 角色層級架構 (character tiers)

> 作者：築
> 版本：v1（2026-04-22 · 瞬上線後的初次盤點）
> Collection：`platform_characters`（Firestore）

---

## 一、三層分類（+ 無分類區）

目前 `platform_characters` 裡有 **19 個角色**，分 4 類（tier 欄位）：

| tier | 數量 | 代表角色 | 定義 | 互動模式 |
|------|------|----------|------|----------|
| **character** | 4 | 憲福、吉娜、星、奧 | 有完整靈魂、直接跟 user 對話的角色 | user ↔ 角色 |
| **strategist** | 1 | 謀師 | 策略層、不直接跟 user 對話，指揮其他角色 | 角色 ↔ 謀師（內部） |
| **specialist** | 1 | 瞬 | 執行層、接受委託、非同步交件 | 角色 → 瞬 → 角色（對話鏈中） |
| **（無 tier）** | 13 | Vivi、Mckenna、馬雲、三毛... | 歷史資料，尚未歸類 | 主要 character |

> ⚠️ **已知缺口**：13/19 角色缺 tier 欄位（包括主戰場 Vivi）。這是歷史遺留，上一個築 lastwords 已點出。要收這個要 backfill。

---

## 二、三層的設計差異

```
     ┌─────────────────────────────────────┐
     │  strategist（謀師）                    │
     │  不直接對 user 說話                   │
     │  幫 character 做策略、寫企劃書、審稿   │
     │  透過 runner / task-run 下達任務      │
     └──────────┬──────────────────────────┘
                │
                │ 指揮/諮詢
                ▼
     ┌─────────────────────────────────────┐
     │  character（Vivi / 吉娜 / 憲福 / 星 / 奧）│
     │  前台：直接跟 user 對話               │
     │  /dialogue POST 的主要主角            │
     │  有 knowledge base、conversation 記憶  │
     └──────────┬──────────────────────────┘
                │
                │ commission_specialist tool
                ▼
     ┌─────────────────────────────────────┐
     │  specialist（瞬）— Phase 2 新層      │
     │  不直接跟 user 對話                   │
     │  接 job → 執行 → 非同步寫回對話       │
     │  專精單一能力（瞬 = 影像）            │
     └─────────────────────────────────────┘
```

### 3 個層級的「入口 endpoint」差異

| tier | 主入口 | 背景系統 |
|------|--------|---------|
| character | `/api/dialogue` POST | Redis cache、RECENT_MESSAGES_WINDOW 壓縮、summary |
| strategist | `/api/strategist-guide`、`/api/strategist-review`、`/api/cake/strategy-test` | Sonnet 4.6 長文輸出 |
| specialist | `/api/specialist/image`（Firebase Function `jobWorker` 非同步呼叫）| `platform_jobs` collection、jobWorker 每分鐘 tick |

---

## 三、瞬的「活 vs 寫死」精準拆解（Adam 的核心問題）

### 💚 活的（Firestore 可調，改了立刻生效）

| 欄位 | 現值 | 調了會怎樣 |
|------|------|-----------|
| `system_soul` | 160 字 | 瞬的身份濃縮。調了 → 下次委託瞬的動腦 call 就用新身份 |
| `soul_core` | 493 字（4A 算法 + 語氣 + 工作風格）| 瞬怎麼思考、怎麼寫 workLog、怎麼對 refs 下判斷的核心 |
| `visualIdentity.imagePromptPrefix` | `60-year-old East Asian male photography master, silver-grey hair...` | 會自動串到所有 Gemini prompt 最前面。調了 → 瞬的「視覺 DNA」就變 |
| `visualIdentity.characterSheet` | 瞬的肖像 URL | 瞬自己長什麼樣（目前沒用於合成，純識別）|
| `visualIdentity.styleGuide` | `realistic photography, monochrome preferred...` | 當前 code **沒讀**。半死（見下方半活區）|
| `mission` | 「光影裁決者，靈魂捕手...」 | 當前 code **沒讀**。半死 |

### 🟡 半活的（Firestore 有、code 沒讀 —— 改了沒用的謊言）

| 欄位 | Firestore 寫什麼 | Code 實際行為 |
|------|------------------|---------------|
| `specialist_config.worker_model` | `gemini-2.5-flash-image` | **沒讀**。`generateWithGeminiRefs` 內部寫死 model |
| `specialist_config.worker_concurrency` | `3` | **沒讀**。concurrency 由 Firebase Function cron 決定 |
| `specialist_config.accepts_jobs` | `["image"]` | **沒讀**。jobType 的分派邏輯寫死在 jobWorker |
| `visualIdentity.styleGuide` | 一段 style hint | **沒讀**。只有 `imagePromptPrefix` 被串進 prompt |
| `mission` | 一段描述 | **沒讀**。只在 dashboard 顯示 |

**這是架構級紀律缺口**：Firestore 寫了欄位、看起來可調，但 code 沒去讀 → 調了沒用。踩過 Adam 預期。要嘛兌現（讓 code 真的讀）、要嘛清掉（從 Firestore 刪除）。

### 🔴 寫死的（在 code 裡、要動就要改程式碼 + deploy）

| 項目 | 位置 | 修改成本 |
|------|------|---------|
| 動腦指令模板 | `src/app/api/specialist/image/route.ts` L103-108 | 低（改 string + deploy）|
| 輸出格式約定 | 同上 L128-130（`PROMPT:` / `WORKLOG:`）| 低，但要同步改 regex parser |
| refs 多圖指令 | 同上 L112-125 | 低 |
| REFS_MAX 上限 | 同上 L38（= 3）| 低 |
| 「Sonnet 4.6 動腦」model 選擇 | 同上 L150（`claude-sonnet-4-6`）| 低 |
| prompt caching 策略 | 同上 L149-154（標 ephemeral）| 低 |
| specialist 名冊 | `src/app/api/dialogue/route.ts` L447（`SPECIALIST_MAP = { painter: 'shun-001' }`）| 低（要同步改 jobType 路由）|
| commission_specialist tool schema | `src/app/api/dialogue/route.ts`（description / refs maxItems）| 低 |
| jobWorker 邏輯 | `~/.ailive/AILIVE/MOUMOU_LIVE/functions/src/features/job-worker.ts` | **中**（Firebase Function，要單獨 `firebase deploy`）|
| system_event 結構 | jobWorker L186-196（role / eventType / output shape）| 中（動了要同步 dialogue + 前端）|
| 前端氣泡 + 燈號視覺 | `src/app/chat/[id]/page.tsx`、`src/components/CommissionStatusBar.tsx` | 低 |

---

## 四、結論：動瞬的 prompt 能變多少

**✅ 改了會變的事（直接透過 Firestore）**：
- 瞬說話的語氣、銳利度、繁簡體、用字習慣
- 瞬的 4A 算法或任何方法論
- 瞬怎麼看 refs、怎麼分配 FIRST/SECOND image 的角色
- 瞬寫 workLog 的內容長度、風格、詩意程度
- Gemini prompt 的**開頭視覺 DNA**（imagePromptPrefix）

**❌ 改了沒用的事（要動 code）**：
- 瞬能接哪些 jobType（目前只有 image）
- 瞬用哪個生圖 model（目前寫死 Gemini 2.5 Flash Image）
- 瞬的 refs 上限（目前寫死 3 張）
- 瞬的輸出格式（`PROMPT: ... WORKLOG: ...` 寫死）
- 瞬要不要有 mood 參數、aspect_ratio 選項、等等

**關鍵洞察**：
> 瞬作為一個「角色」，他的**人格、審美、思考方式、說話風格**幾乎全活 —— 改 soul 就像換一個人。
> 但瞬作為一個「系統組件」，他的**工作流程、能力範圍、對接協議**都寫死在 code。

換句話說：Adam 改 Firestore 能把瞬**從攝影師改成插畫師、從銳利改成溫柔、從現代改成古典**。
但要把瞬**從「生單張 1024px 圖」改成「生多張 4K 圖」或「接受 document jobType」**，就要動 code。

---

## 五、建議的下一步（按優先級）

### P1 · UI 標注（Adam 要求）
dashboard 卡片上加 tier badge（character / strategist / specialist 三色），讓一眼區分。

### P2 · tier 欄位 backfill
13/19 角色缺 tier。寫個 one-off script 把所有缺 tier 的補成 `character`（合理預設）。

### P3 · 清或兌現 `specialist_config`
目前 Firestore 有但 code 沒讀。要嘛：
- **兌現**：改 `specialist/image/route.ts` 讀 `worker_model`（讓瞬的生圖 model 變可調）
- **清掉**：直接從 Firestore 刪，避免誤導

傾向兌現。將來要多 specialist（畫師、3D 設計師、插畫師）時，這個欄位就是切換生圖引擎的開關。

### P4 · `visualIdentity.styleGuide` 兌現
上述同理。把 styleGuide 也串進 prompt，讓 Adam 改這個就改瞬的整體審美偏好。

### P5 · 文件持續維護
每次新增 specialist / strategist / 新欄位時，回頭更新這份文件。

---

## 附錄 · 現有角色完整盤點

| id | name | tier | sysSoul chars | soulCore chars |
|----|------|------|---------------|----------------|
| 03SKBthmGonIfvOI01Vh | Mckenna | (無) | 3,113 | 776 |
| 3FAIl35ShNIhtle3Twkb | 馬雲 | (無) | 1,441 | 728 |
| 3nFPH2LnU1efD4Ih9rin | 憲福 | character | 2,282 | 797 |
| HVlI8u7zVjnPkrXBNUAP | 大師 | (無) | 808 | 737 |
| I9n2lotXIrME23TJNPsI | 吉娜 | character | 1,467 | 795 |
| KrCvXEHDWH0ML9HYjZEc | 亞理斯多德 | (無) | 2,515 | 766 |
| KthXwZJZUhFjh8rbSm8i | 星 | character | 2,299 | 744 |
| P8OYEU7dBc7Sd3UDHULW | 謀師 | strategist | 0 | 531 |
| Qn7ZAnbd1Opg4ecPn5H6 | 三毛 | (無) | 1,472 | 720 |
| Wjv0vpnzmqDQYRB1HzXS | 劉潤 | (無) | 2,403 | 840 |
| fy2V9LW91QKXVNTUaUNz | 克里斯汀生 | (無) | 1,464 | 840 |
| kTwsX44G0ImsApEACDuE | **Vivi** | (無) | 2,201 | 1,073 |
| mziGYIQGZHK2g4XOoU0w | 聖嚴 | (無) | 1,462 | 642 |
| pEWC5m2MOddyGe9uw0u0 | 奧 | character | 1,449 | 763 |
| **shun-001** | **瞬** | **specialist** | **160** | **493** |
| tfXeT1nEM9ciT9e6pOG3 | 吳導 | (無) | 2,499 | 655 |
| uCwjKcAwXDPWd4HUqWMb | 蒜泥艦隊 | (無) | 2,243 | 807 |
| uNY1ycpBkCOlwEpTbXVu | 菲爾·奈特 | (無) | 2,684 | 794 |
| udi0ul24OOOG6ypdyT9e | 梟 | (無) | 1,644 | 774 |
