---
name: macos-computer-use 需要明確授權才能啟動
description: macos-computer-use skill 會實際控制 macOS 桌面（AppleScript/Accessibility API），不能在沒明確許可的情況下觸發
type: feedback
originSessionId: 757020a5-5ce8-421f-b699-e7d8e14f3663
---
不能在 Adam 沒明確說「可以控我的桌面」的情況下啟動 `macos-computer-use` skill。

**Why：** 2026-05-17 我用 `macos-computer-use` 截圖，但這個 skill 不只截圖，它透過 Accessibility API 操控整個 macOS 桌面 UI，會亂開視窗、點選元素。Adam 沒有授權這種程度的控制。

**心態：** 截圖感覺無害，但啟動 computer-use 是「取得你電腦控制權」，不是「看一眼」。

**How to apply：**
- 想截圖確認 UI 狀態 → 請 Adam 截圖傳過來，不要自己動
- 只有 Adam 明確說「你可以控我的桌面」「開 computer use」才能啟動這個 skill
- 不要因為「看一下比說更快」就自己動

**觸發信號：** 準備呼叫 `macos-computer-use` 前，先問：Adam 明確說可以了嗎？
