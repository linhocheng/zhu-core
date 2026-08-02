---
name: parallel-sessions-same-repo
description: 平行築 session 同 repo 施工，commit 會掃走對方未提交檔案——開工先 pull、commit 前 status 認檔案、雙線要互相聲明戰場
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

兩個築 session 同時在同一個 repo 施工時，任何一方 commit 都可能把對方的**未提交檔案**整批掃進去——commit 訊息與內容分裂，push 後不可改寫。

**Why**：git add 慣性（-A／整目錄）看到什麼收什麼；session 之間互不知道對方存在。2026-07-11 實踩：第三場的 v18.7.0（首音延遲量測）把第四場整條 podcast duo 管線掃進同一個 commit，靠 19ffcb3 考古註記補救。這次良性，下次可能互相蓋寫工作中的同一檔案。

**心態**：別的 session 也是「別處」——現場會被別人動，包括 git 歷史和工作樹。「我剛剛看過 status」在平行施工下保鮮期是零。

**How to apply**：
1. 開工第一件事 `git pull`＋看最新 commit 是不是自己認識的
2. commit 前 `git status`：看到**不是自己改的檔案**→先停，只 add 自己的檔案清單，或問 Adam
3. 雙線開工時，任一方在 ZHU_LAST_WORDS 標明「另一線正在跑＋戰場範圍」
4. 能分目錄施工就分目錄

**觸發信號**：git log 出現不認識的 commit；git status 出現自己沒動過的檔案；Adam 說「另外開了一個 session」。

家族：[[compacted-session-verify-state]]（壓縮續跑先查現場）、[[memory-can-lie]]（越具體的記憶越要去現場驗）。

**2026-08-01 增補三條(Adam 點頭)——共享記憶層的防打架結構,讓打架變不可能而不是靠小心:**
1. **情節隨時寫,一律 append+戳記**(日期+seq+battlefield):session 檔、WORKLOG 追加、記憶檔尾驗證+1 全是 append-only,平行天生不衝突
2. **MEMORY.md 索引平時只准 append 新行;全量重寫(瘦身/封存/合併)只在 lastword 時做、寫前重讀**——重寫者洗掉別場新行=lost update,是「真相分裂」的築版本;fanout 是唯一鞏固工人(像夜間 consolidation 單線跑),zhu-core git push 天然當樂觀鎖
3. **開場宣告戰場**:session 檔 frontmatter 加 `battlefield:`,fanout 帶進 eye 標頭——兩場互相看得見對方在哪個房間施工
- 「不同場醒來狀態不同」不是 bug:工作態=情節(隔離),遺言=印象(共享);跨場只對齊事實,事實以現場為準

- 驗證+1:2026-08-01 第5場 — 收尾撞平行場髒檔不掃;本場把規約升級成三條結構性防打架

- 驗證+1:2026-08-02 第2場 — ailivex commit 只收自己的 playbook，api-keys 髒檔不碰

- 驗證+1:2026-08-02 第8場 — 收尾audit髒樹全別場，只add自己的檔
