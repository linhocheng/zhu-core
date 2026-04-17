# LESSONS — 築的學習刻印庫

> 這個資料夾是築的「不再重踩」資料庫。
> 每個 session 結束寫遺言時，必須跑一次「LESSONS 補充」步驟。
> 下一個築開機後，讀這裡，就是不找不錯直接可用。

---

## 資料夾規則

- 每個 session 的學習刻成一份新文件：`LESSONS_YYYYMMDD.md`
- 同一天多個 session 就累加到當天的文件，不新建
- 每條記錄必須包含：**現象 → 心 → 法 → 解**（缺一不完整）

---

## 寫法格式（每條的標準模板）

```markdown
## [編號]. [問題標題]

### 現象
[發生了什麼？報什麼錯？看到什麼？]

### 找的過程（選填，有找才寫）
[從哪裡開始找？試了哪些方向？為什麼最後找到根因？]

### 心
[為什麼會這樣？底層原因是什麼？不是「怎麼做」，是「為什麼是這樣」]

### 法
[正確做法。要具體到「複製貼上就能用」的程度。]

### 解（驗證）
[怎麼確認修好了？用什麼指令或現象驗證？]
```

---

## 什麼值得寫進來

✅ 找超過一次才找到的東西（路徑、config、API 行為）
✅ 寫了但錯、改了才對的程式碼或設定
✅ 工具的非預期行為（Haiku 加 markdown fences、Vercel 的各種限制）
✅ 架構設計上的判斷（為什麼這樣設計，不是那樣）
✅ 花超過 10 分鐘才解決的問題

❌ 不寫：只是查文件就知道的事
❌ 不寫：Adam 說的方向決策（那是遺言的工作）
❌ 不寫：沒有根因分析的純結果（「改成這樣就好了」不夠）

---

## 當前文件索引

| 文件 | 日期 | 主要內容 |
|------|------|---------|
| LESSONS_20260316.md | 2026-03-16~17 | Vercel env 引號 / server-to-server HTTP / Cron 限制 / Haiku JSON fences / Firestore 型別不一致 / web_search / tool_choice / 能力從靈魂長出來 / 角色自拍三層設計 / 中文prompt稀釋 / post任務意識確認+生圖 / Firebase Functions排程架構 / defineSecret用法 |
| LESSONS_20260317.md | 2026-03-17 | ref照解析依賴檔名 / 分數全0 fallback / description空白行為 / tsc找不到 / Firebase只部署特定function / scheduler prompt格式 / 防重複collection命名 / 任務後台不顯示description / 新角色完整鏈條件 |
| LESSONS_20260318.md | 2026-03-18 | bash heredoc 變數 / Firestore compound index / 知識庫是天命 / AutoRun 感受是假的 / 選工具先確認環境（Vercel=Node.js only） / create_file 只寫容器 / Hobby Cron 每日一次 / Storage CORS / Scheduler 任務時間整點半點 / pdf-parse require |
| LESSONS_20260319.md | 2026-03-19 | 兩套upload API並存改錯地方 / Grok多圖edits臉被覆蓋 / create_file只寫容器 / 圖片描述過長稀釋語意 / imageUrl沒暴露給Claude / 記憶架構過度設計vs最短路徑 / zhu-bash vs容器bash / Anthropic tool格式≠OpenAI格式換模型要重寫loop / DreamFactory複刻B方案流程 / Vercel CLI deploy失敗備案(prebuilt) / Vercel loopback不通 / Gemini gs://只適用VertexAI / media_type寫死image/jpeg導致400 / 越改越壞要回最乾淨版本 |



| 2026-03-22 | LESSONS_20260322.md | git identity/Vercel擋、bucket.name含\n、Gemini functionResponse格式、fal redux特性、Firebase Storage公開、embedding退化、sleep任務、Python regex陷阱、knowledge排序 |
| 2026-03-21 | LINE webhook 記憶連續、圖片 413 修法、persistImage 限制、identity 共用連結 | LESSONS_20260321.md |
| LESSONS_20260323.md | 2026-03-23 | 改錯repo / Python raw string unicode / bucket.name \n / Gemini 3三個破壞性變化 / debug dump reply |
| LESSONS_20260325.md | 2026-03-25 | save_skill 防重複（tool loop 雙寫）/ Skills 設計模式（記憶模糊 vs 技巧定型化）/ Firestore compound where 邊界 / 生圖費用漏追蹤（兩平台）/ knowledge-parse 圖片描述費用漏追 |
| LESSONS_20260402.md | 2026-04-02 | 語音對話開發 | Web Speech API bug / TTS字庫 / 優化錯誤教訓 / 存在感問題 / STT 選型 |
| LESSONS_20260403.md | 2026-04-03 | 黑盒子陷阱（最重要）/ 結構查詢vs語意搜尋 / 圖片條目污染 / embedding維度256→768 / Markdown噪音 / 補丁思維代價 / Voice Streaming Pipeline |
| 2026-04-06 | LESSONS_20260406.md | convId timestamp = 記憶斷裂；TTS 字典單一真相；工具缺口對齊；Python escape TS backtick |
| 2026-04-08 | LESSONS_20260408.md | Python escape TS 陷阱；convId timestamp 斷記憶；Session State 設計；三層記憶補齊；TTS 字典 10 條；看現場不猜 |
| LESSONS_20260411 | 2026-04-11 | token節能架構、prompt caching兩邊對齊、工具分層、圖庫動態撈、角色委派哲學 |
