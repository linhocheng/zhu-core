---
name: MiniMax 即時語音語氣優化（WS 真串流 + opencc + emotion）
description: LiveKit 即時語音用 MiniMax TTS 時，語氣連貫/口音/情緒三個旋鈕怎麼調，及兩種 streaming 的區分
type: reference
originSessionId: 1d6fd1e4-c65d-4e5b-badf-953d8930f1b5
---
LiveKit + MiniMax 即時語音「聽起來自然」有三個獨立旋鈕，別混在一起調：

**1. 語氣連貫（每句重音 vs 流動）= 兩種 streaming 哪一種**
- ① HTTP SSE 串流：MiniMax 單次請求內 `stream:true`，只降「首音延遲」。
- ② LiveKit capability 串流：TTS 宣告 `TTSCapabilities(streaming=True)` + 實作 `SynthesizeStream`，決定「語氣」。
- 若 ②=false：LiveKit 用 blingfire 切句、每句獨打一次 → 每句獨立語調輪廓 → 拼起來「每段都重音」。
- 解法：把 TTS 改成 ②=true，走 **MiniMax WebSocket**（`wss://api.minimax.io/ws/v1/t2a_v2`：connected_success → task_start → 多次 task_continue(text) → task_continued(data.audio hex) → task_finish）。整段回話一個 WS session → 跨句語調脈絡連貫。實作見 ailivex `agent/minimax_tts.py` `MiniMaxSynthesizeStream`，含 WS 握手失敗退回 REST 的 fallback。

**2. 口音/發音穩（北京腔/發音飄）= 餵簡體 + voice_id**
- MiniMax 餵**簡體中文**發音才穩。別只靠 LLM prompt 拜託，用 `opencc`（t2s）在送字前**硬轉**（天條：確定性用程式保證）。套件 `opencc-python-reimplemented`。
- 口音也受 voice_id 影響：預設 voice（如 Wise_Woman）= 標準普通話/北京腔；角色用各自 cloned voice（`moss_audio_*`）。

**3. 情緒戲劇化（波動太滿）= voiceSettings.emotion**
- `voiceSettings.emotion`：happy/sad/angry/neutral…。`happy` 很戲劇，`neutral` 最平穩，空字串=API 自動推斷（會飄）。
- 在 Firestore `characters.{id}.voiceSettings.emotion`，即時生效不用重部署。ailivex 後台 `admin/characters` 已有 Emotion 下拉 + Speed/Pitch + 試聽，可自助逐角色調。

**踩過：** 2026-06-10 ailivex 撥 Lilith，先誤把語氣問題往前端 livekit 查，其實是 ②=false；改 WS 後語氣順了但 emotion=happy 太戲劇 → 全角色改 neutral。

---

**2026-06-11 補：更多旋鈕（即時語音「深度/演/沒頭沒尾」三連環）**

**4. 深度淺 / AI 感重 = 模型。** 即時語音 agent 預設用 **Haiku**（為低延遲），文字對話用 **Sonnet 4.6**。Haiku 淺、沒帶入。要深度就把 realtime LLM 換 Sonnet 4.6（`claude-sonnet-4-6`），代價首句慢約 0.5–1s，但 WS 串流 TTS 抵掉一部分。

**5. 口氣很演 = 文字在演，不是 emotion/聲音。** 同聲音+emotion=neutral 的離線 wav（用平靜句子）聽起來 OK；即時版「演」是 LLM 生成的文字 register 戲劇（驚嘆/語氣詞/開示腔）+ 高 temp。修：①temp 降到 0.3–0.4 ②prompt 別寫「溫度/覺察/帶入」(會被讀成深情開示)，改「平實內斂、像私下閒聊、不說法不金句不戲劇化」。深度靠模型(Sonnet)真的在聽，不靠演。

**6. 沒頭沒尾 / 碎裂 = LLM 分段空行 + TTS 把 `\n` 當句尾切。** LLM 把回覆排成段落帶空行（`好，我在。\n\n慢慢說`）；WS `_forward_input` 若把 `\n` 放進 sentence-end，會切出**只含換行的空白片段**送 MiniMax → 微停頓/碎裂。修：sentence-end 拿掉 `\n` + 送前折疊空白(`" ".join(text.split())`) + 不送空片段 + prompt「一口氣不分段不換行」。（內容/記憶其實是好的，別誤判成記憶問題——先讀逐字稿確認。）

**7. TTS 模型 tier。** `speech-02-turbo`=快版；`speech-2.6-hd`/`speech-2.8-hd`=HD 更自然(慢+貴)。同 cloned voice 可直接換 model A/B。ailive + ailivex 預設都是 02-turbo。

**架構：即時語音 2.0 = 獨立平行服務** `ailivex-realtime-agent-v2`（agent_name `ailivex-realtime-v2`，同 image 不同啟動 `main_v2.py`），放實驗性的 Sonnet/主動插話/HD；v1 維持 Haiku 快版。對話手感全進後台 `convSettings`（conv_tuning.py 映射 AgentSession turn_handling，預設 3=現行）。
