---
name: molowe-platform 技術打撈備忘
description: molowe 2026-05-30 停止前打撈的可複用技術（語義去重/聲紋稽核/Threads發布等）與確切檔案路徑
type: reference
originSessionId: 93d13367-b540-441d-93b5-380ccee8b8c1
---
molowe-platform 於 2026-05-30 停止（移除 Vercel deployment，code 仍在本機 + git）。停止前把值得複用的技術寫成打撈備忘：

`~/.ailive/zhu-core/docs/LESSONS/molowe_tech_salvage_2026-05-30.md`

裡面有 6 項可複用技術含路徑：語義角度去重 gate（Firestore findNearest 向量搜尋，corpus.ts）、聲紋稽核 superego、KOL 校正人格、prime-time 時區排程、Threads Graph API 發布流、週→日 directive 串聯。

**How to apply**：日後要做 KOL/內容自動化或人格一致性監測，先翻這份備忘找現成實作，不要重造。注意角度去重 0.20 閾值太嚴（造成 217 failed），複用要重校。Firestore 在 moumou-os 共專案。
