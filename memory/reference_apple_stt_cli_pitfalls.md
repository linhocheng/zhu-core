---
name: apple-stt-cli-pitfalls
description: macOS 本機 SFSpeechRecognizer 做批次轉錄的五顆雷與工作解法（零雲端零費用；ailivex voice-worker 實戰）
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

macOS 15 的 SFSpeechRecognizer（on-device，$0）可以做批次音檔轉錄＋字級時間戳，但 CLI 用法有五顆雷（2026-07-26 ailivex 錄音後處理實戰，全踩過）：

1. **CLI 主執行緒死鎖**：requestAuthorization/辨識回呼要投遞回主執行緒——用 semaphore 堵主執行緒等回呼＝自鎖。正姿：主執行緒跑 `RunLoop.main.run()`，工作丟背景 queue。
2. **長音檔靜默卡死**：單檔超過約 1 分鐘常無聲停擺（daemon CPU 停走、無錯誤無結果）。解法：ffmpeg 50s 切塊逐塊轉，時間戳加位移合併。
3. **逐語句 final，不能收到第一個 isFinal 就退出**：長靜音會切語句，每句一個 final（且可能是空的）；要用時間戳合併所有回呼的 segments，靜默 N 秒才收工。
4. **假時間戳重複回報**：偶發整段內容擠在 0.00–0.3s、每詞 duration 0.01s 的幽靈回報——用「duration < 0.03s 丟棄」過濾。
5. **輸出是繁體**＋標點自動加；跟簡體參照文字比對前必過 opencc（見 [[opencc-s2t-pitfalls]]）。

效能參考：6.5 分鐘音檔約 2 分鐘轉完（M 系晶片）。真身實作：`ailivex-platform/scripts/voice-worker/transcribe.swift`。

**觸發信號**：要在 Mac 上免費轉錄音檔；SFSpeechRecognizer 跑批次；「Apple 語音辨識卡住沒輸出」。macOS 26 起可改用 SpeechAnalyzer（長檔原生支援），這五顆雷屬 15 這代。
