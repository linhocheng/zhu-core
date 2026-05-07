---
name: dialogue route 改完要對齊 voice-stream（兩條鏈共用對話歷史）
description: ailive-platform 的 dialogue 跟 voice-stream 是兩條獨立 route，但讀同一個 platform_conversations，任何 history 處理改動都要兩邊同步
type: feedback
originSessionId: 43998a4d-b567-4e17-8762-b3273804909d
---
ailive-platform 的 `src/app/api/dialogue/route.ts` 跟 `src/app/api/voice-stream/route.ts` 是兩條獨立的 LLM 鏈，但**讀寫同一個 platform_conversations collection**。任何「組 messages 給 Anthropic」的處理改動，必須兩邊同步，否則只修一條等於沒修。

**Why（2026-05-07 踩過）：**
specialist/strategy 完成後寫 `role: 'system_event'` 進對話。dialogue route 1521-1549 早就把 system_event 轉成 assistant 口吻通知（不轉 → Anthropic 400 "Unexpected role"）。但 voice-stream:758 用 `as 'user' | 'assistant'` 強轉型，沒做轉換。結果 user 在語音對話時收到 specialist 交件 → 400 崩潰。修了 voice-stream 才對齊。

**How to apply：**
- 改 dialogue route 的 history.map / messages 組裝邏輯時，先 grep `voice-stream/route.ts` 同樣位置確認要不要同步
- 反向也成立：改 voice-stream 也要看 dialogue
- 兩邊處理本質一樣的東西 → 考慮抽成 `src/lib/build-anthropic-history.ts` 共用，但抽之前先看兩邊細節差異（voice 不送 base64 image、dialogue 會送）
- 同樣需要對齊的還有：靈魂優先序（system_soul → soul_core → enhancedSoul → soul，已記在 ailive-platform/CLAUDE.md「技術教訓」）、tool list、systemBlocks 結構

**觸發信號：**
- 改 dialogue/route.ts 的 history.map / Anthropic.MessageParam 組裝
- 改 voice-stream/route.ts 同類邏輯
- specialist 系列 route（strategy / image / 任何 pushSystemEvent）新增 `role: '...'` 種類
- platform_conversations 寫入新的 message schema（新 role / 新欄位）
- 看到 dialogue 有處理但 voice 沒有的 if 分支 → 大概率是漏修
