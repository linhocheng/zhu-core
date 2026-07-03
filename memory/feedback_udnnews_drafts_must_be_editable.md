---
name: udnnews-drafts-must-be-editable
description: UDN NEWS 平台鐵律：所有文稿階段（口播稿/podcast腳本/懶人包文案/圖卡文字）都必須人工可編輯後才進下一階段
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8ef8c0e1-e3c6-4a5a-b395-90a13805cb5c
---

UDN NEWS（議題工作台）所有**文稿階段都要可以編輯**——AI 生成的任何文字產物（口播稿、podcast 對話腳本、懶人包文案、圖卡文字）在進入下一個階段（TTS、排版、產圖）之前，都必須有人工編輯的入口。

**Why:** UDN 是編輯部工作流，人是最終把關者；AI 產物直接進下一階段等於剝奪編輯權，成品出錯無法救。

**How to apply:** 新增任何「生成文字 → 下游消費」的功能時，中間必插可編輯 UI（textarea/逐行編輯）＋儲存回 Firestore，下游一律讀編輯後的版本。交付前自問：這段文字用戶改得到嗎？改完存得回去嗎？下游讀的是改完的版本嗎？（血管三問 [[interface-blood-vessel-check]]）

來源：2026-07-03 Adam 明確指示「udnnews 在文稿階段都要可以編輯」。
