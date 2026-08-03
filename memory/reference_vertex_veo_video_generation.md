---
name: vertex-veo-video-generation
description: Veo 3.1 影片生成實戰參考——Vertex vs Gemini API 差異、首尾幀/單圖模式、RAI 過濾、實打驗證的 REST 形狀
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

Veo 3.1 影片生成（2026-07-22 UDN 影音庫實戰全驗證）。

**規則**：平台接 Veo 一律走 Vertex AI 不走 Gemini API key——ADC 零密鑰（天條家族）、帳單歸戶 GCP 專案、`storageUri` 直寫自家 GCS（免下載轉存、免 Google 端 2 天保存期問題）。

**Why**：Gemini API key 的帳單進 key 持有者不進專案；客戶平台的生成成本必須跟平台同一本帳。Adam 一句「為何不用 gcp」點醒，當場換線。

**實打驗證的形狀（文件會騙人，這些是真的）**：
- Vertex 模型 ID 是 GA 版 `veo-3.1-fast-generate-001` / `veo-3.1-generate-001`——Gemini API 的 `-preview` 名稱在 Vertex 上 404
- region：us-central1（asia-east1 未上）
- image/lastFrame 欄位＝`{bytesBase64Encoded, mimeType}` 並列在 `instances[0]`——官方文件範例的 `inlineData` 會被 400 拒絕
- 輪詢是 `POST {model}:fetchPredictOperation` body `{operationName}`，不是 GET operation（Gemini API 才是 GET）
- 輸出在 `response.videos[0].gcsUri`；被 RAI 擋時 videos 缺席、看 `raiMediaFilteredReasons`
- 剛 enable aiplatform API 後 service agent 要幾分鐘佈建，先打會回 error code 9

**模式與限制**：
- 首尾幀（image+lastFrame）＝固定 8 秒，4/6 不支援；單圖 image-to-video 可 4/6/8 秒
- 9:16 直式支援 720p/1080p（1080p 限 8 秒）；4K 不支援直式
- 聲音永遠開啟（原生生成，無開關）；prompt 可控運鏡（中文可用，英文最穩）
- 多段拼接 Veo 不管——ffmpeg concat 自己來（確定性工作用程式）
- 定價（成功才計費）：fast 720p $0.10/s、fast 1080p $0.12/s、standard $0.40/s

**RAI 過濾實戰**：新聞素材（未成年人＋毒品意象）有機率被擋，同圖同判定穩定重現；**被擋的影片 Google 不收費**，重試零成本風險。設計失敗路徑時把 `raiMediaFilteredReasons` 白話寫回任務。

**觸發信號**：要接影片生成 API、看到 `-preview` 模型名 404、`inlineData isn't supported`、Vertex operation 不知道怎麼 poll。

相關：[[cloudrun-firebase-adc]]、[[deterministic-work-belongs-in-code]]、[[cost-on-heartbeat-failure-accounting]]

- 驗證+1:2026-08-02 第8場 — 期0照抄實戰形狀（GA模型名/欄位/輪詢），零踩雷

- 驗證+1:2026-08-03 第1場 — GA 模型名/欄位形狀/輪詢照期0 實戰形狀，雲端零踩雷
