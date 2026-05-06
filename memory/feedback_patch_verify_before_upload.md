---
name: VM patch 後上傳前必須驗證所有依賴函數存在
description: Python inline patch 失敗靜默、重下載蓋掉成功的 edit、未驗證直接上傳，造成 bridge crash
type: feedback
originSessionId: 3b96bb42-5604-4efe-8f30-17f33cd4f9e4
---
改動 bridge index.js 時發生三層連環失誤：

1. 第一輪用 Python inline script 在 VM 上 patch（heredoc 方式）→ shell 跳脫問題造成 patch 失敗，但沒有顯眼報錯
2. 後來重新下載 VM 上的檔案（沒有 patch 的版本）繼續在本機 edit
3. 上傳前只用 grep 驗證了「最新加的函數」，沒有驗證「第一輪 patch 的函數」是否也在
4. 上傳後 bridge 啟動即 crash：`getRecentTitles is not defined`

**Why:** 分多輪 patch、來源檔案不確定是否包含前輪修改，任何一輪漏掉都會炸。

**How to apply:** VM bridge 改動的正確流程：
```
1. 一開始就先下載：gcloud compute scp zhu-dev:~/claude-bridge/index.js /tmp/bridge_index.js
2. 所有修改全在本機 /tmp/bridge_index.js 上做（Read + Edit）
3. 上傳前跑驗證：grep -n '每個新增的函數名' /tmp/bridge_index.js
   → 包含「所有本次新增」+ 「所有本次呼叫」的函數都要出現
4. 確認無缺後才 scp 上傳
5. 重啟後 tail bridge.log 確認沒有 ReferenceError / crash
```

絕對不要在 VM 上用 inline Python/heredoc patch，shell 跳脫太容易靜默失敗。
