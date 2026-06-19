---
name: 自架 mp4 在 Cloud Run/static server 必須支援 HTTP Range(206)
description: 在自己的 Node static server 上供 mp4 給 <video>，Safari/iOS 沒有 206 Range 不播；Drive iframe 嵌入受分享權限影響故改自架
type: reference
originSessionId: 08832aa8-fa1e-4887-af87-a80d97ed776a
---
把影片給 `<video>` 播，**Safari/iOS 沒有 HTTP Range(206) 回應就拒播**（Chrome 寬容、Safari 嚴格）。

- 自寫的 Node static handler（`createReadStream(path).pipe(res)` 回 200 全檔）對 Safari 不夠 → 必須讀 `req.headers.range`，回 `206` + `Content-Range: bytes a-b/total` + `Accept-Ranges: bytes` + 對應 `Content-Length`，用 `createReadStream(path,{start,end})`。non-range 回 200 也要補 `Accept-Ranges: bytes`。
- MIME map 要含 `.mp4→video/mp4`，否則 `application/octet-stream` 會下載而非播放。
- **不要用 Google Drive `/file/d/<id>/preview` iframe 嵌外部 pitch 影片**：沒設「知道連結的任何人可檢視」時，Drive 會在影片框內渲染 Google 登入/要求權限的網頁（看起來像「網頁被塞進影片裡」）。自架到自己的 Cloud Run 一勞永逸。
- **天坑：Cloud Run 單次回應上限 ~32MiB**。瀏覽器播片第一個請求是 `Range: bytes=0-`（開放式到結尾），若 server 老實回整個剩餘內容（>32MiB），Cloud Run 直接回 500，log 寫 `Response size was too large. Please consider reducing response size.` → `<video>` 拿到 `MEDIA_ERR_SRC_NOT_SUPPORTED (err code 4)`「no supported source」→ 看起來像「沒有影片/檔案壞」，但**檔案是好的（本機 file:// 播得動）**。
  - 修法：static handler 把**每次回應封頂在 8MiB**（遠低於 32MiB）。開放式 range `bytes=0-` 與大檔無 Range 請求都只回 8MiB 那一段（206 + 正確 `Content-Range: a-b/total`），瀏覽器會自動續抓後續 range。封閉小 range 照原樣。順手加 stream `.on("error")`+`res.on("close")` 防使用者拖進度條中斷請求 crash process。
  - **驗證一定要測「無 Range」和 `Range: bytes=0-` 兩種**：`curl -H "Range: bytes=0-1023"`（封閉小段）會騙過你回 206，但真正初始請求是開放式的——只測 0-1023 會漏掉這個 bug。正確驗：`curl -o /dev/null -w "%{http_code}" <url>`（無 Range）與 `curl -H "Range: bytes=0-" ...` 都要非 500。
  - 最硬的驗證：headless Chrome 載入頁面讀 `video.readyState`（要到 4）+ `video.error`（要 none），別只看截圖（headless 常不解碼 video 畫面、一律黑，會誤判）。

來源：2026-06-19 udnnews demo 頁，把 3 支講者 mp4 從 Drive iframe 改成自架 + server.js 加 Range，e2e 驗 206 通。後續換成 540x960（42-50MB）後爆 Cloud Run 32MiB 上限，封頂 8MiB 才修好。
