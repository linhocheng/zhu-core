# Adam V1.0 優化專案 — 工作日誌

> 特殊專案 · 啟動日期：2026-03-24
> 路徑：~/.ailive/adam-v1/Adam_V1.0/
> 生產 API：https://adam-api-560352628733.asia-east1.run.app
> 前端：/#/call（即時通話）/ /#/（登入）

---

## Phase 狀態

| Phase | 目標 | 狀態 |
|---|---|---|
| Phase 1 | 記憶系統全面啟動 | ✅ 完成驗收 |
| Phase 2 | 靈魂動態化 | ✅ 完成驗收 |
| Phase 3 | Interrupt 正確處理 | ✅ 完成（待前端驗收）|
| Phase 4 | Observability | ✅ 完成驗收 |
| Phase 5 | Streaming STT+LLM+TTS | 🔄 進行中 |

---

## Phase 5 進度（Streaming + STT 優化）

### 已完成
- [x] LLM Streaming：`generate_reply_stream`（按句子斷點 yield）
- [x] ws.py 改用 streaming：每句立刻送 TTS，送 `audio_chunk` 事件
- [x] 前端 audio queue：`audioQueueRef` 排隊播放，`interrupted` 清空 queue
- [x] STT 換 Deepgram nova-2-general（zh-tw）：Gemini 3秒 → Deepgram ~150ms
- [x] 靈魂 pattern loop 修復：過濾對話歷史裡的「記憶包收到」重複 pattern
- [x] VAD 閾值調整：0.01 → 0.15，MIN_SPEECH 300 → 800ms

### 當前問題（未解決）
- [ ] **VAD 誤觸發**：TTS 播出的聲音被麥克風收回去 → 觸發 VAD → cancel 當前 turn
  - 現狀：閾值 0.15 上線（00044），待測試
  - 如果 0.15 還不夠：改方案「前端靜音」（AI說話時暫停送音訊給後端）
  - 根本解：AEC + 耳機

### 當前 revision
- `adam-api-00044-72p`（VAD 0.15 + Deepgram + streaming）

---

## 完整施工記錄

### 2026-03-24

**Phase 1：記憶系統**
- info_extractor.py：Gemini → Claude Haiku
- GCP env: ENABLE_AUTO_EXTRACT=true
- 驗收：說「我叫 Adam，38 歲」→ profile 存進 DB ✅

**Phase 2：靈魂動態化**
- 新增 CharacterSoul DB model（character_souls 表）
- 新增 soul.py service（get/upsert/cache）
- 新增 /api/soul/{character_id} CRUD
- llm.py 改為動態載入：`active_prompt = get_soul_prompt("mckenna")`
- 驗收：API 更新靈魂即時生效，不需 redeploy ✅

**Phase 3：Interrupt Manager**
- ws.py 加 current_turn_task，偵測新說話 → cancel → 送 interrupted
- process_turn 加 except asyncio.CancelledError 靜默處理

**Phase 4：Observability**
- TurnMetrics DB model（stt_ms/llm_ms/tts_ms/total_ms）
- turn.py 分段計時
- 新增 /api/metrics endpoint
- 驗收：llm_ms avg=10504ms（瓶頸），tts_ms avg=4662ms ✅

### 2026-03-25

**LLM Streaming**
- llm.py 加 generate_reply_stream（async generator，按句號/問號/換行斷句）
- ws.py 改用 streaming，每句送 TTS，送 audio_chunk 事件（含 index/url）
- tts.py 加 synthesize_sentence
- 前端 audio queue：audioQueueRef / isPlayingRef
- 新增 case：audio_chunk（排隊播放）、audio_done、interrupted（清空 queue）

**Deepgram STT**
- stt.py 完全改寫：Gemini → Deepgram nova-2-general（zh-tw）
- GCP Secret：adam-deepgram-api-key（版本2，乾淨無換行）
- Key：208b1a3d3297fc2ff9226c5ddf6a52bd565c4425
- 坑：版本1 用 echo -n 存入，帶了 `-n ` 前綴和 `\n`，header 非法
- 坑：nova-3 不支援中文，要用 nova-2-general + language=zh-tw

**靈魂 pattern loop 修復**
- 根因：對話歷史裡有舊的 assistant 回覆含「記憶包收到」，LLM 學走了
- 修法：get_recent_conversation_history 過濾含該 pattern 的 assistant 訊息

**VAD 閾值調整**
- 問題：TTS 喇叭聲被麥克風收回 → 觸發 VAD → cancel turn
- 0.01 → 0.05 → 0.15（還在測試中）
- MIN_SPEECH_MS: 300 → 500 → 800ms
- 待驗收：00044 上線，看中斷有沒有改善

---

## 下一步（待處理）

1. **VAD 誤觸發最終解**
   - 如果 0.15 還不夠：前端靜音方案（useElevenLabsConvAI.ts：AI說話時停送音訊）
   - 在 ws.py 加 `is_playing` 狀態，前端根據 speaking/listening 控制 isMutedRef

2. **技術遷移到 AILIVE**（計劃書第四章）
   - STT→LLM→TTS streaming 管線
   - Interrupt 機制
   - 靈魂動態載入架構
   - Observability/metrics

---

## 關鍵教訓（Lessons）

1. **Secret 值要用 printf 存，不要用 echo -n**
   - echo -n 在某些 shell 會把 -n 當成輸出內容
   - 正確：`printf 'key' | gcloud secrets versions add ...`

2. **Deepgram 模型要查語言支援**
   - nova-3 不支援中文，要用 nova-2-general + language=zh-tw
   - 先測 API 再 deploy，省很多來回

3. **VAD 誤觸發是 Voice Agent 的經典問題**
   - 根本解是 AEC（前端回音消除）或前端靜音（AI說話時停止收音）
   - 調高閾值是補丁，不是解法
   - 業界標準做法：AI 說話時前端暫停送音訊

4. **對話歷史 pattern loop**
   - LLM 會從對話歷史裡學走 assistant 的固定開場白
   - 解法：過濾已知 pattern，不帶進 context
   - 更好的解法：system prompt 明確禁止重複開場白

5. **一吋蛋糕原則**
   - 每次改動驗收完再繼續
   - 本次 STT 測試沒有先驗就 deploy，後來才發現語言不對

