---
name: skill_user_upload_pipeline_pitfalls
description: 「使用者丟任意檔案」管線四雷：大檔第一版就串流／fetch 回應不假設 JSON／allow-unauthenticated 要 curl 200 收案／視覺參數跟素材屬性走；含 Drive 鏡像對賬與零金鑰 SA 模式
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

蓋任何「使用者會丟任意檔案進來」的管線（Drive 同步、上傳站、素材館），四條雷一次記住。UDN demo-gallery 一日建成當日被真實使用炸出來的（2026-07-23）。

**① 大檔第一版就串流，不是等炸。** `Buffer.from(await r.arrayBuffer())` 再上傳＝檔案大小×併發數進 RAM：54MB 測試過了，使用者隨手丟 181MB → Cloud Run 1Gi OOM（1321MiB）殺容器回 503，使用者每重試炸一次。正解：下載 stream 直通上傳（Node fetch `body: r.body, duplex: "half"` ＋ Content-Length=來源 metadata size），峰值恆定。**測試樣本的尺度 ≠ 真實尺度——「使用者第一次亂用」就是最好的模糊測試，設計時直接問：最大可能的檔案是多大？**

**② 前端 fetch 回應永遠不假設是 JSON。** infra 層錯誤（Cloud Run OOM/LB）回純文字 `Service Unavailable`，`r.json()` 炸出天書給使用者。一律 `text()` → try parse → fallback 顯示原文。

**③ `--allow-unauthenticated` 寫在 cloudbuild ≠ 生效。** deploy SUCCESS 但 403（Cloud Run 前門）。要顯式 `add-iam-policy-binding allUsers roles/run.invoker`。收案信號＝curl 200，不是 build SUCCESS（[[feedback_ambiguous_signal_not_proof]] 的部署版）。

**④ 素材驅動的頁面，視覺參數不寫死。** 寫死 `aspect-ratio:1/1` 被第一張直圖打破（裁切）。尺寸跟著素材真實屬性算（naturalWidth/Height），三時機重算：onload／切換／resize，且快取圖不觸發 onload 要 render 後補初始一輪。

**附：兩個可複用模式**
- **鏡像對賬架構**：頁面=資料夾鏡像，每次 Scan 全量對賬（來源有→補、來源沒有→刪、md5 同→跳過；Drive md5Checksum 是 hex、GCS md5Hash 是 base64，統一轉 hex 比）。「自動擴充/自動刪除」是架構天生性質不是功能。資料夾名=渲染指令（含 IG→IG 殼），同仁取名即設定。
- **零金鑰 Drive 存取**：Cloud Run 掛專用 SA → ADC → iamcredentials 自鑄 drive+storage 雙 scope token。self-impersonation 也要顯式 self tokenCreator binding（[[reference_gcp_self_actAs_binding]] 同族）；剛 grant 完 iamcredentials 回 **404 不是 403**（掩蓋存在性）＝propagation 沒到，等 30-60s 重試，不是 URL 錯。

**觸發信號**：需求裡出現「同仁/使用者會不斷丟檔案」「自動同步生成頁面」；或看到管線程式碼裡有 `arrayBuffer()` 接上傳。

完整版（含營運備忘）：UDN repo `demo-gallery/DEVLOG.md`。家族：[[reference_selfhost_mp4_needs_range_206]]（影片走 GCS 直連）、[[feedback_mvp_include_input_entry]]（walking skeleton 要含真實輸入）。
