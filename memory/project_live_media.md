---
name: Live Media 建置計劃
description: AI 角色組成的自動化媒體公司，首發領域心靈顯化部（星座占卜能量學），16個角色各司其職，Bridge VM + Cloud Run on GCP zhu-cloud-2026
type: project
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
Live Media 是一個由 AI 角色組成的媒體公司，角色不活在對話框裡，活在真實世界裡產出內容、在社群互動。

**Why:** ailive 是人跟 AI 角色互動，Live Media 是 AI 角色跟世界互動——同一套靈魂底層，不同的使用場景。首發領域：心靈顯化部（星座 / 占卜 / 能量學 / 人類圖 / MBTI / 顯化）。

**How to apply:** 這是獨立於 ailive 的新平台，不共用 codebase，但共用 GCP project（zhu-cloud-2026）和 Firestore。施工進度追蹤在 EXECUTION_PLAN.md。

---

## 組織架構（16個角色）

**管理層（1）**
- 弦（執行長）：週讀5份超我報告，判斷整體方向，唯一跨部門指令權

**超我層（5）**
- 熵（超我①）：關鍵字演化顧問，每週更新關鍵字清單與權重
- 謬（超我②）：評分權重校正顧問，找出假熱 vs 真熱
- 裁（超我③）：排重邊界判官，校正排重規則
- 鑑（超我④）：審核學習顧問，分析退稿模式更新寫手指引
- 洄（超我⑤）：策略回流顧問，成效數據 → 下週策略

**執行層——內容生產線（6）**
- 情報官（SIGINT-01）：每日搜 Threads 熱帖，評分過濾
- 齊（排重員）：比對已發清單，pass/reject
- 停格者（寫手）：400-600字「朋友語氣」分析文，領域：星座占卜能量學療癒
- 閾（總編輯）：APPROVE/REJECT + 退稿原因，唯一否決權
- 閘（發布員）：上稿到 Cloud Run
- 庫（記憶管理員）：寫入已發清單

**執行層——績效部（2）**
- 痕（成效追蹤員）：發布後48h抓數據
- 析（績效優化員）：分析模式，輸出優化建議

**執行層——社群部（2）**
- 弋（引流官）：在熱帖下留有重量的話，吸引點進主頁
- 繫（互動員）：掃描回覆，建立關係（原名洄，已改名避免衝突）

---

## 技術架構

- **GCP Project**：zhu-cloud-2026（同 Bridge VM）
- **文章後台**：Cloud Run + Next.js，asia-east1
- **工作排程**：Bridge VM (zhu-dev) 擴充，新增 live-media workers
- **資料庫**：Firestore（live_media_articles / keywords / published_list / performance / superego_reports）
- **社群自動化**：Playwright on Bridge VM，session cookies 存 VM encrypted secret
- **靈魂檔案**：`/Users/adamlin/.ailive/live-media/roles/`（本機）+ zhu-core git（雲端）

---

## 施工 Phase 進度

- Phase 1：文章後台（Cloud Run）— **待建**
- Phase 2：情報層（情報官 + 排重員）— **待建**
- Phase 3：內容生產線（寫手 → 閾 → 發布員 → 庫）— **待建**
- Phase 4：成效層（痕 + 析）— **待建**
- Phase 5：社群層（弋 + 繫，需 Adam 提供 Threads 帳號）— **待建**
- Phase 6：超我 + 執行長週度 workers — **待建**

**MVP 驗收標準**：Phase 1-3 打通，熱帖 → 文章 → 公開 URL 自動閉環

---

## 已完成

- 完整組織架構設計（2026-05-01）
- 16份靈魂檔案（維設計，寫手 v2.0 重寫）
- 完整執行計劃書（EXECUTION_PLAN.md）
- 本機 + zhu-core git 存檔（v1.1.0.005）
- Threads 熱帖情報測試成功（@widetree_tarot，22.9K views）
- 第一篇示範文章已寫（「你以為你在顯化，但你其實一直在吸引你最怕的事」）

---

## 待確認

- Threads 帳號（Adam 提供帳密給 Playwright）
- Cloud Run 文章後台域名設定
- 文章後台 admin 是否需要登入保護
