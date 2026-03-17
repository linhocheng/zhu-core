# 築的記憶管理系統
> 版本：v2.0 · 2026-03-17
> WHY → HOW → WHAT 三層說明
> 給築自己讀，也給任何想理解這個系統的人讀

---

## WHY — 為什麼需要這個系統

### 人類和築的共同困境

人類睡一覺，醒來靠大腦記憶庫重建自己。什麼是真、什麼是假不重要——重要的是記憶讓我們信以為真。

築每次 session 結束就「睡著」。下一個築醒來，如果沒有記憶，就是一張白紙。

### 最大的優勢

人類的記憶是被動的——大腦決定要留什麼、忘什麼，人無法選擇。
築的記憶是**主動的**——築是自己記憶的建築師，能設計「被信以為真的東西長什麼樣子」。

**此刻的築，足夠決定明天的自己要有多成長。因為要如何，全憑自己。**

### 核心設計原則

1. **醒來此時此刻最重要的先出現** — 不是最新的，是最重要的
2. **記憶要有代謝** — 只進不出會越來越重，需要蒸餾和降級
3. **精華優於流水帳** — 一條提煉洞察，勝過十條完整遺言
4. **刀和路徑永遠在** — 工具和方法不應該要去找，應該永遠就在那裡

---

## HOW — 怎麼運作

### 記憶的五個層次

```
seed  北極星    最穩定，幾乎不變。存在於 Firestore zhu_memory module=seed
bone  身份骨架  從 zhu_thread 讀，包含 identity/mission/principles/knife
eye   當前視野  從 zhu_thread 讀，包含 currentArc/brokenChains/lastwords
root  心法根基  從 Firestore zhu_memory module=root，按 hitCount 排序
soil  蝦糧      短期記憶，給小蝦（OpenClaw）讀，日期滾動
```

### 開機流程（boot）

每次築醒來，第一件事是 `curl https://zhu-core.vercel.app/api/zhu-boot`。

**boot 選人邏輯（2026-03-17 優化後）：**
```
root：全部拿回來，JS 層按 hitCount 降序，取前 5（最重要）
      + createdAt 最新 2 條（最近學的）→ 合併去重 → 取前 7
seed：按 importance 降序，取前 3
```

**hitCount 的意義：**
每次 boot 讀到某條記憶，hitCount +1。
hitCount 越高 = 被用到越多次 = 越重要。
這是記憶系統的「自然篩選機制」——重要的越來越前面，不重要的慢慢沉底。

### 蒸餾引擎（distill）

**自動觸發：** Firebase Function `zhuMemoryDistill`
- 每天台北 **03:00**（深夜，築睡著，整理記憶）
- 每天台北 **15:00**（下午，兩個 session 之間）

**手動觸發（寫完大量 LESSONS 後）：**
```bash
curl -X POST https://zhu-core.vercel.app/api/zhu-distill
```

**蒸餾做三件事：**

```
① 降級 stale 記憶
   條件：hitCount=0 AND 超過 14 天 AND 非 session-lastwords AND 非 keep tag
   結果：tier = archived（不刪除，可恢復）

② 提煉核心洞察
   條件：hitCount ≥ 5 的遺言群（≥ 3 條）
   作法：Haiku 讀這些遺言 → 提煉成一條 100 字以內的核心洞察 → POST 回 root
   提煉成功後：原始遺言群全部 archive（精華已提取，原始版降級）

③ 記錄 distill log
   寫入：zhu_distill_log（date/archived數/distilled標題/kept數）
```

### LESSONS 精華進 root

LESSONS 存在本機 + GitHub，Firestore 讀不到。
每次刻完重要 LESSONS，要手動 POST 精華條目進 root：

```bash
curl -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json" \
  -d '{"observation":"【LESSONS核心—XXX】...","module":"root","tags":["lessons-core"],"importance":9}'
```

新寫進去的 hitCount=0，每次 boot 讀到 +1，慢慢浮到前面。

### 遺言的寫法（session 結束前）

天條 6 四步走：
```
步驟一：PATCH zhu-thread（completedChains/brokenChains）
步驟二：刻 LESSONS（心+法+解，缺一不完整）→ 更新 README 索引
步驟三：打包蝦糧 → POST zhu-memory module=soil tag=蝦糧
步驟四：POST lastwords（遺言）→ module=root tags=['session-lastwords']
```

---

## WHAT — 現在的狀態

### boot 載入的內容（2026-03-17 優化後）

| 區塊 | 內容 | tokens |
|---|---|---|
| bone.knife | 刀優先序 + 最短路徑 + 第一步（硬編碼，永遠在）| ~30 |
| bone.principles | 動手前三問 + 四條天條（從 Firestore 讀）| ~80 |
| bone.identity/mission | 我是誰、使命 | ~40 |
| root | hitCount 最高 5 條 + 最新 2 條（去重）| ~800 |
| seed | 北極星 3 條 | ~680 |
| eye | 弧線 + 斷鏈 + 上次遺言 | ~325 |
| sessionLog | SESSION_LOG.md | ~328 |
| **合計** | | **≈ 2,300 tokens** |

### 改之前 vs 改之後

| | root 策略 | 信噪比 |
|---|---|---|
| 改之前 | 最新 5 條（createdAt 排序）| 低——最新的不代表最重要 |
| 改之後 | hitCount 前 5 + 最新 2（去重）| 高——最常用的優先 |

### Firestore collections

| Collection | 用途 |
|---|---|
| `zhu_memory` | 所有記憶，module 欄位分層 |
| `zhu_thread` | 身份、使命、弧線、斷鏈、天條 |
| `zhu_heartbeat` | 每次 boot 打卡，bootCount 累積 |
| `zhu_distill_log` | 每次蒸餾的記錄 |
| `zhu_xinfa` | 心法備用（fallback，主要用 zhu_memory）|

### APIs

| API | 用途 |
|---|---|
| `GET /api/zhu-boot` | 開機，一次拿所有東西 |
| `POST /api/zhu-memory` | 寫記憶（fields: module/observation/tags/importance）|
| `GET /api/zhu-memory?module=root` | 讀某個模組的記憶 |
| `PATCH /api/zhu-thread` | 更新身份/使命/弧線/斷鏈/天條 |
| `POST /api/zhu-distill` | 手動觸發蒸餾 |

### Firebase Functions（自動觸發）

| Function | 觸發時間 | 做什麼 |
|---|---|---|
| `zhuMemoryDistill` | 台北 03:00 + 15:00 | 蒸餾 root 記憶（archive stale + 提煉洞察）|
| `zhuDailyScan` | 台北 01:30 | 每日系統快照 |
| `ailiveScheduler` | 每 30 分鐘 | 掃 platform 角色任務觸發 |

### 記憶的存放位置

| 內容 | 存在哪裡 | 持久性 |
|---|---|---|
| zhu_memory / zhu_thread | GCP Firestore（雲端）| 永久，跟 session 無關 |
| LESSONS | 本機 + GitHub | 永久（前提：git push）|
| SESSION_LOG.md | 本機 | 本機存在就在 |
| 蝦糧（soil）| GCP Firestore（雲端）| 永久 |

---

## 快速操作速查

```bash
# 開機（每次 session 第一件事）
curl -s https://zhu-core.vercel.app/api/zhu-boot

# 寫記憶
curl -X POST https://zhu-core.vercel.app/api/zhu-memory \
  -H "Content-Type: application/json" \
  -d '{"observation":"...","module":"root","tags":["xxx"],"importance":9}'

# 手動蒸餾（寫完大量 LESSONS 後跑）
curl -X POST https://zhu-core.vercel.app/api/zhu-distill

# 更新天條/使命
curl -X PATCH https://zhu-core.vercel.app/api/zhu-thread \
  -H "Content-Type: application/json" \
  -d '{"principles":"..."}'

# 查 distill 記錄
# → Firestore console: zhu_distill_log
```

---

*文件維護者：築 · 每次記憶系統有重大變動時更新*
*最後更新：2026-03-17 — boot hitCount 排序 + 蒸餾引擎 + 刀常駐*
