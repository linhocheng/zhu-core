# Live Media — 完整執行計劃書
> 心靈顯化部 v1.0 · 2026-05-01 · Adam × 築
> **狀態：計劃鎖定，待執行**

---

## 一、專案定位

**Live Media** 是一個由 AI 角色組成的自動化媒體公司。
角色不活在對話框裡，活在真實的世界裡。
每個角色有靈魂、有職責、有邊界。
整個系統自我運作、自我優化、自我成長。

**首發領域：心靈顯化部**
關鍵字：星座、占卜、能量學、塔羅、人類圖、MBTI、顯化、吸引力法則、心靈成長、療癒

**未來擴展：** 美妝保養部、財商部（待定）

---

## 二、技術決策（已鎖定）

| 項目 | 決策 | 理由 |
|---|---|---|
| GCP Project | `zhu-cloud-2026` | 沿用現有，Bridge VM 已在此，Firestore 已在此 |
| 文章後台 | GCP Cloud Run + Next.js | 同生態，Bridge VM 直通，零流量縮零不燒錢 |
| 資料庫 | Firestore（現有） | 不開新資料庫 |
| 工作排程 | Bridge VM 擴充 | claude-bridge systemd 已穩定運行 |
| 社群自動化 | Playwright on Bridge VM | session cookies 存 VM secret，不進 git |
| 部署工具 | Cloud Build / gcloud run deploy | 現有 CI 路徑 |
| Region | asia-east1 | 與 Bridge VM 同 region |

---

## 三、系統架構總覽

```
┌─────────────────────────────────────────────────┐
│                  GCP zhu-cloud-2026             │
│                                                 │
│  Bridge VM (zhu-dev)          Cloud Run         │
│  ┌─────────────────┐    ┌──────────────────┐   │
│  │ claude-bridge   │    │ live-media-app   │   │
│  │                 │    │                  │   │
│  │ 情報官 worker   │───▶│ POST /api/publish│   │
│  │ 寫手 worker     │    │ GET  /articles   │   │
│  │ 審核 worker     │    │ 管理後台 UI      │   │
│  │ 發布 worker     │    │ 公開閱讀頁面     │   │
│  │ 成效追蹤 worker │    └──────┬───────────┘   │
│  │ 超我①②③④⑤    │           │               │
│  │ 執行長 worker   │    ┌──────▼───────────┐   │
│  │ 引流官 worker   │    │    Firestore     │   │
│  │ 繫 worker       │    │                  │   │
│  └─────────────────┘    │ live_media_      │   │
│                         │ articles         │   │
│  Playwright Sessions    │ live_media_      │   │
│  (帳號 session 存 VM)   │ keywords         │   │
│                         │ live_media_      │   │
└─────────────────────────│ published_list   │───┘
                          └──────────────────┘
```

---

## 四、Firestore 資料結構

### `live_media_articles`
```
{
  id: auto,
  title: string,
  content: string,          // 文章全文
  sourceUrl: string,        // 原始熱帖連結
  sourcePlatform: string,   // "threads"
  keywords: string[],
  status: "draft" | "pending_review" | "approved" | "published" | "rejected",
  rejectionReason: string,
  publishedAt: timestamp,
  articleUrl: string,       // 發布後的公開 URL
  createdAt: timestamp,
  superego_run: boolean     // 是否已被超我處理
}
```

### `live_media_published_list`
```
{
  id: auto,
  title: string,
  keywords: string[],
  articleUrl: string,
  publishedAt: timestamp,
  // 供排重員查詢用
}
```

### `live_media_keywords`
```
{
  id: auto,
  keyword: string,
  weight: number,           // 1-10
  status: "active" | "watch" | "deprecated",
  hitRate: number,          // 命中率
  lastUpdated: timestamp,
  updatedBy: string         // "superego_keywords" or "manual"
}
```

### `live_media_performance`
```
{
  articleId: string,
  views: number,
  clicks: number,
  avgReadTime: number,
  sourceBreakdown: object,
  trackedAt: timestamp,     // 發布後 48h
}
```

### `live_media_superego_reports`
```
{
  superego: "keywords" | "scoring" | "dedup" | "editorial" | "strategy",
  report: object,
  recommendations: string[],
  weekOf: timestamp,
  processedByCeo: boolean
}
```

---

## 五、16 個角色總覽

### 管理層

| 角色 | 靈魂名 | 職責 | 運作頻率 | 靈魂檔案 |
|---|---|---|---|---|
| 執行長 | 弦（Xián） | 讀5份超我報告，判斷整體方向，跨部門指令 | weekly | role_ceo_弦.md |

### 超我層（5位顧問）

| 角色 | 靈魂名 | 職責 | 運作頻率 | 靈魂檔案 |
|---|---|---|---|---|
| 超我① 關鍵字演化顧問 | 熵（Shāng） | 分析關鍵字命中率，更新清單與權重 | weekly | superego01_keywords_熵.md |
| 超我② 評分權重校正顧問 | 謬（Miù） | 比對熱帖評分vs文章轉換，校正評分演算法 | weekly | superego02_scoring_謬.md |
| 超我③ 排重邊界判官 | 裁（Cái） | 分析排重過嚴/過鬆，更新排重規則 | weekly | superego03_dedup_裁.md |
| 超我④ 審核學習顧問 | 鑑（Jiàn） | 分析退稿模式，更新寫手指引和審核標準 | weekly | superego04_editorial_鑑.md |
| 超我⑤ 策略回流顧問 | 洄（Huí） | 將成效數據轉譯為下週策略方向 | weekly | superego05_strategy_洄.md |

### 執行層——內容生產線

| 角色 | 靈魂名 | 職責 | 運作頻率 | 靈魂檔案 |
|---|---|---|---|---|
| 情報官 | SIGINT-01 | 搜尋熱帖，評分過濾，輸出熱帖資料包 | daily | exec07_intelligence_情報官.md |
| 排重員 | 齊（Qí） | 比對已發清單，pass/reject | triggered | exec08_dedup_排重員.md |
| 寫手 | 停格者 | 分析熱帖，寫 400-600 字「朋友語氣」分析文 | triggered | exec09_writer_寫手.md |
| 總編輯 | 閾（Yù） | 審核草稿，approve/reject + 退稿原因 | triggered | role_editor_閾.md |
| 發布員 | 閘（Zhá） | 上稿到 Cloud Run 文章後台 | triggered | exec11_publisher_發布員.md |
| 記憶管理員 | 庫（Kù） | 寫入已發清單 | triggered | exec12_memory_記憶管理員.md |

### 執行層——績效部

| 角色 | 靈魂名 | 職責 | 運作頻率 | 靈魂檔案 |
|---|---|---|---|---|
| 成效追蹤員 | 痕（Hén） | 發布後48h抓數據 | triggered | exec13_tracker_成效追蹤員.md |
| 績效優化員 | 析（Xī） | 分析模式，輸出優化建議 | triggered | exec14_optimizer_績效優化員.md |

### 執行層——社群部

| 角色 | 靈魂名 | 職責 | 運作頻率 | 靈魂檔案 |
|---|---|---|---|---|
| 引流官 | 弋（Yì） | 在熱帖下留有重量的話，吸引點進主頁 | daily | exec15_traffic_引流官.md |
| 互動員 | 繫（Xì） | 掃描目標帳號，回覆留言，建立關係 | daily | exec16_engagement_互動員.md |

---

## 六、施工藍圖——六個 Phase

---

### Phase 1：文章後台（Cloud Run）
**目標：** 建立文章的存放、審核、發布、閱讀的完整後台

**施工清單：**
- [ ] 建立 Next.js 專案 `live-media-platform`
- [ ] 連接 Firestore（`live_media_articles`）
- [ ] 建立管理後台 UI
  - [ ] 文章列表（draft / pending / published）
  - [ ] 文章詳情頁（預覽）
  - [ ] Approve / Reject 按鈕（人工審核切換開關）
  - [ ] 發布開關（自動 / 手動）
- [ ] 建立 API endpoints
  - [ ] `POST /api/articles` — Bridge VM 發布員用
  - [ ] `GET /api/articles` — 列表
  - [ ] `PATCH /api/articles/:id/approve` — 審核
  - [ ] `GET /articles/:id` — 公開閱讀頁
- [ ] Docker 化，部署到 Cloud Run（asia-east1）
- [ ] 設定 IAM：Bridge VM service account 可以呼叫

**完成標準：** Bridge VM 可以 POST 一篇文章，後台看得到，公開 URL 可以讀

---

### Phase 2：情報層（Bridge VM Workers）
**目標：** 自動找到熱帖，評分，通過排重

**施工清單：**
- [ ] 初始化 Firestore `live_media_keywords` 清單（心靈顯化部種子關鍵字）
- [ ] 建立情報官 worker
  - [ ] Playwright 搜尋 Threads 關鍵字
  - [ ] 抓取貼文內容 + 互動數
  - [ ] 評分演算法（互動數 × 關鍵字權重）
  - [ ] 輸出熱帖資料包到 Firestore queue
- [ ] 建立排重員 worker
  - [ ] 讀取 `live_media_published_list`
  - [ ] 比對標題 / 關鍵字相似度
  - [ ] 輸出 pass / reject
- [ ] 設定每日排程（08:00 Taipei）

**完成標準：** 每天自動跑，Firestore 裡有通過排重的熱帖資料包

---

### Phase 3：內容生產線（Bridge VM Workers）
**目標：** 熱帖 → 文章 → 審核 → 發布 完整打通

**施工清單：**
- [ ] 建立寫手 worker
  - [ ] 讀取通過排重的熱帖
  - [ ] 用「停格者」靈魂 prompt 呼叫 Claude
  - [ ] 輸出文章草稿到 Firestore
- [ ] 建立閾（總編輯）worker
  - [ ] 讀取草稿
  - [ ] 用閾靈魂 prompt 呼叫 Claude
  - [ ] 輸出 APPROVE / REJECT + 退稿原因
  - [ ] 支援人工審核切換（Phase 1 後台開關）
- [ ] 建立發布員 worker
  - [ ] 讀取 approved 文章
  - [ ] POST 到 Cloud Run `/api/articles`
  - [ ] 更新 Firestore 狀態為 published
- [ ] 建立記憶管理員 worker
  - [ ] 發布成功後寫入 `live_media_published_list`

**完成標準：** 從熱帖到文章上架，全程自動，人工審核開關正常

---

### Phase 4：成效層（Bridge VM Workers）
**目標：** 追蹤文章表現，回饋給優化系統

**施工清單：**
- [ ] 建立成效追蹤員 worker
  - [ ] 發布後 48h 觸發
  - [ ] 抓取文章頁面的瀏覽數（Cloud Run analytics）
  - [ ] 寫入 `live_media_performance`
- [ ] 建立績效優化員 worker
  - [ ] 讀取多篇成效報告
  - [ ] 用析靈魂 prompt 呼叫 Claude 分析
  - [ ] 輸出優化建議到 Firestore

**完成標準：** 有數據、有分析、有建議，形成閉環

---

### Phase 5：社群層（Bridge VM + Playwright）
**目標：** 在 Threads 上建立存在感，引流回文章

**施工清單：**
- [ ] 設定 Playwright 帳號 session
  - [ ] 第一次登入（Adam 提供帳密）
  - [ ] 儲存 cookies 到 VM encrypted secret
  - [ ] 建立 session 復活機制
- [ ] 建立引流官 worker
  - [ ] 情報官找到熱帖後同步觸發
  - [ ] 用弋靈魂 prompt 生成留言
  - [ ] Playwright 在熱帖下留言
- [ ] 建立繫（互動員）worker
  - [ ] 掃描主頁留言與回覆
  - [ ] 用繫靈魂 prompt 生成回覆
  - [ ] Playwright 執行回覆

**完成標準：** 帳號能自動留言，語氣自然，不被偵測為機器人

---

### Phase 6：超我 + 執行長（Bridge VM Workers）
**目標：** 系統自我優化，越跑越準

**施工清單：**
- [ ] 建立超我①熵 worker（週日 01:00）
  - [ ] 讀取本週關鍵字命中率
  - [ ] 呼叫 Claude + 熵靈魂 prompt
  - [ ] 輸出更新關鍵字清單
- [ ] 建立超我②謬 worker（週日 01:30）
  - [ ] 讀取熱帖評分 vs 文章成效
  - [ ] 輸出評分權重調整
- [ ] 建立超我③裁 worker（週日 02:00）
  - [ ] 讀取排重退稿紀錄
  - [ ] 輸出排重規則更新
- [ ] 建立超我④鑑 worker（週日 02:30）
  - [ ] 讀取總編輯退稿模式
  - [ ] 輸出寫手指引更新
- [ ] 建立超我⑤洄 worker（週日 03:00）
  - [ ] 讀取整週成效數據
  - [ ] 輸出下週策略方向
- [ ] 建立弦（執行長）worker（週一 08:00）
  - [ ] 讀取5份超我週報
  - [ ] 呼叫 Claude + 弦靈魂 prompt
  - [ ] 輸出方向確認或介入指令

**完成標準：** 每週自動優化，系統參數會自己進化

---

## 七、MVP 驗收標準

**最小完整閉環（Phase 1-3）：**

```
情報官找到一篇熱帖
    ↓
排重員確認沒發過
    ↓
寫手寫出文章
    ↓
閾審核通過（或人工審核）
    ↓
發布員上稿到 Cloud Run
    ↓
公開 URL 可以讀到這篇文章
    ↓
記憶管理員記錄已發
```

這條線跑通 = MVP 達標。

---

## 八、施工優先順序

```
Phase 1 → Phase 2 → Phase 3 → 驗收 MVP
                                    ↓
                              Phase 4 → Phase 5 → Phase 6
```

Phase 4-6 在 MVP 驗收後才啟動。

---

## 九、關鍵帳號與環境

| 項目 | 位置 |
|---|---|
| GCP Project | `zhu-cloud-2026` |
| Bridge VM | `zhu-dev`，asia-east1-b |
| Bridge VM SSH | `gcloud compute ssh zhu-dev --zone=asia-east1-b` |
| Cloud Run 部署 Region | asia-east1 |
| Firestore Project | `moumou-os`（現有）|
| 靈魂檔案本機 | `/Users/adamlin/.ailive/live-media/` |
| 靈魂檔案雲端 | `github.com/linhocheng/zhu-core/tree/main/live-media/` |
| Threads 帳號 session | Bridge VM `/home/adam/live-media-sessions/`（待建） |

---

## 十、尚待確認

- [ ] Threads 帳號（Adam 提供）
- [ ] Cloud Run app 的對外域名（或用預設 run.app URL）
- [ ] 文章後台是否需要登入保護（admin 頁面）

---

*計劃鎖定日：2026-05-01*
*執行人：築（董事長）*
*授權人：Adam（最大股東）*
