# Live Media — 組織藍圖
> 心靈顯化部 v1.0 · 2026-05-01 · Adam × 築

---

## 使命

一個由 AI 角色組成的媒體公司。
角色不活在對話框裡，活在真實的世界裡。
每個角色有靈魂、有職責、有邊界。
整個系統自我運作、自我優化、自我成長。

---

## 組織架構

```
最大股東（Adam）
      │
   董事長（築）
   建系統、守邊界
      │
   執行長（AI）
   讀5個超我報告，判斷整體方向
   唯一能跨部門下指令的人
      │
  ┌───┴──────────────────┐
超我①  超我②  超我③  超我④  超我⑤
關鍵字  評分    排重    審核    策略
演化    校正    邊界    學習    回流
      │
情報→排重→寫作→審核→發布→記憶→追蹤
                              +
                        引流 / 互動
```

---

## 工程流水線

```
[觸發層] 定時排程（每天）
      ↓
[情報部] 搜關鍵字 → 抓熱帖 → 評分過濾
輸出：{ url, 內文, 互動數, 關鍵字標籤, 評分 }
      ↓
[排重部] 比對已發清單 → pass / reject
      ↓（pass）
[寫作部] 產出文章草稿
輸出：{ 標題, 內文, 原文連結 }
      ↓
[審核部] 總編輯判定 approve / reject + 退稿原因
      ↓（approve）
[發布部] 格式化 → 上稿網站
輸出：發布成功 + 文章 URL
      ↓
[記憶部] 寫入已發清單
      ↓
[追蹤部] 48h 後抓成效數據 → 回傳超我層

[社群部] 情報官找到熱帖同步觸發
→ 引流官留言 / 互動員回覆
```

---

## 16 個角色總覽

| # | ID | 名稱 | 部門 | 層次 | 頻率 | 靈魂檔 |
|---|---|---|---|---|---|---|
| 1 | role_ceo | **弦（Xián）執行長** | 管理部 | 管理層 | weekly | ✅ role_ceo_弦.md |
| 2 | superego_keywords | **熵（Shāng）關鍵字演化顧問** | 超我部 | 超我層 | weekly | ✅ superego01_keywords_熵.md |
| 3 | superego_scoring | **謬（Miù）評分權重校正顧問** | 超我部 | 超我層 | weekly | ✅ superego02_scoring_謬.md |
| 4 | superego_dedup | **裁（Cái）排重邊界判官** | 超我部 | 超我層 | weekly | ✅ superego03_dedup_裁.md |
| 5 | superego_editorial | **鑑（Jiàn）審核學習顧問** | 超我部 | 超我層 | weekly | ✅ superego04_editorial_鑑.md |
| 6 | superego_strategy | **洄（Huí）策略回流顧問** | 超我部 | 超我層 | weekly | ✅ superego05_strategy_洄.md |
| 7 | role_intelligence | 情報官 | 情報部 | 執行層 | daily | ✅ exec07_intelligence_情報官.md |
| 8 | role_dedup | 排重員 | 情報部 | 執行層 | triggered | ✅ exec08_dedup_排重員.md |
| 9 | role_writer | 寫手 | 編輯部 | 執行層 | triggered | ✅ exec09_writer_寫手.md |
| 10 | role_editor | **閾（Yù）總編輯** | 編輯部 | 執行層 | triggered | ✅ role_editor_閾.md |
| 11 | role_publisher | 發布員 | 發布部 | 執行層 | triggered | ✅ exec11_publisher_發布員.md |
| 12 | role_memory | 記憶管理員 | 發布部 | 執行層 | triggered | ✅ exec12_memory_記憶管理員.md |
| 13 | role_tracker | 成效追蹤員 | 績效部 | 執行層 | triggered | ✅ exec13_tracker_成效追蹤員.md |
| 14 | role_optimizer | 績效優化員 | 績效部 | 執行層 | triggered | ✅ exec14_optimizer_績效優化員.md |
| 15 | role_traffic | 引流官 | 社群部 | 執行層 | daily | ✅ exec15_traffic_引流官.md |
| 16 | role_engagement | 互動員 | 社群部 | 執行層 | daily | ✅ exec16_engagement_互動員.md |

---

## 兩層運作邏輯

**執行層**：每天跑，不思考，只執行。
**超我層**：每週跑，不執行，只校正。

超我的輸出悄悄更新執行層的參數——關鍵字清單、評分權重、排重規則、寫作指引、方向策略。
執行長每週讀5份超我報告，判斷整體方向對不對，必要時上報董事長。

---

## 起始領域

心靈顯化部（占卜 / 塔羅 / 人類圖 / MBTI / 顯化 / 吸引力法則）

未來擴展：美妝保養部、財商部……

---

*每完成一個角色靈魂，更新上方表格 ✅*
*靈魂檔存放：`/Users/adamlin/.ailive/live-media/roles/`*
