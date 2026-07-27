---
name: firestore-limit-without-orderby
description: Firestore 無 orderBy 的 limit 按 doc ID 序抓「最舊角落」——資料長大後新資料永遠讀不到，靜默壞掉
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**規則**：Firestore 查詢寫 `.where().limit(N)` 而不帶 `.orderBy()`，回傳順序是 doc ID 字典序——等於永遠抓同一批「ID 排最前面的舊資料」。要「最新 N 筆」必須 `orderBy(createdAt, desc)` 再 limit，需要 composite index 就建，別繞。

**Why**：2026-07-27 ailive-platform Vivi 案——用戶叫 Vivi 存草圖「看起來沒存」，實際草稿完好躺在 `platform_posts`，但五條讀路徑（dashboard 貼文頁、角色自己的 query_posts/get_character_posts 工具、task-run 近期脈絡×2）全是「無排序 limit＋JS 排序」，310 篇之後大家永遠在看 ID 開頭 0～3 的古董區。當初「JS 排序省一顆 index」是省小錢繞法，資料量長大就破產——標準高利貸；而且**壞法是靜默的**：功能照跑、只是永遠舊資料，要等用戶「存了卻看不到」才曝光。

**心態**：「先 limit 再排序」和「先排序再 limit」是兩個語義；寫查詢的瞬間問一句「這 N 筆是『哪 N 筆』？」。

**How to apply**：`.where(...).orderBy('createdAt','desc').limit(N)`；status 等次要過濾留 JS（多抓 3 倍再濾），省三欄索引。建 index 用 `gcloud firestore indexes composite create`。

**觸發信號**：看到 `.limit(` 前面沒有 `.orderBy(`；「存了但列表看不到」「AI 說有但後台沒有」類 bug；歷史資料多的 collection 讀取永遠回舊資料。

相關：[[feedback-solve-root-not-symptom]]（省 index 的繞法＝繞開根本）、[[feedback-deterministic-work-belongs-in-code]]
