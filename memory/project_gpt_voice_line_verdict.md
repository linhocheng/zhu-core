---
name: gpt-voice-line-verdict
description: ailivex GPT Voice 線一晚 POC 判負（人格保真死穴）；代碼保留為通用第二線插座；抄機制回自家線
metadata: 
  node_type: memory
  type: project
  originSessionId: 1f540ca7-8d44-4614-97c7-1b1abe01b6b0
---

2026-07-16 一晚建線＋實測，Adam 判定：**gpt-realtime 路線放棄——「我們要的不是罐頭，是有靈魂的角色」**。

**判負證據**（逐字稿實錘，非體感）：
- 身份錨（框架級 prompt）已注入仍擋不住：直問「你是誰」→「我是 ChatGPT」，並否認記憶（14 條記憶就在 context）。底模「誠實 AI」訓練輾過角色設定，prompt 是地板不是天花板（[[ai-sycophancy-is-baked-in]] 同構）。
- 幻聽：transcript 出現用戶沒說過的 `[user] Evet.`（土耳其語），她連發 3 則回應幻聽輸入＝「像在跟第三者聊」。
- 「一直跳」鏈路：OpenAI VAD threshold 0.5 → 任何人聲 `speech_started` → framework `agent_activity.py:1301` 無條件 `interrupt()`。v18 三個版本蓋的打斷防護這條線上全沒有。

**可取之處（都已落袋）**：
1. 回合延遲量尺（Phase 0）端到端通：前端 RMS+ActiveSpeakersChanged → voice-metrics → monitor 按線拆表，實測收到 7 筆樣本。
2. 首通首音 GPT 線也是 ~18.6s（配線完全不同）→ 18 秒瓶頸在共用開場路徑（建線/prompt 組裝/agent 首回合），不在 STT→LLM→TTS 選型（樣本 1，待複驗）。
3. 第二線基礎設施是模型無關插座：token route line 分流＋access.gptVoiceEnabled＋admin 鈕＋per-line 監控。未來 GPT-Live API／Gemini Live／開源 S2S 直接插拔評測。
4. 未來 S2S 候選標準驗收法：直問「你是誰」三連＋transcript 幻聽稽核＋打斷率（TTS started vs done 差值）。
5. 體感差距的機制清單照舊走自家線（blueprint path C：semantic endpointing／preamble／搶先生成／應和）。

**現場**：agent 代碼在 ailivex-platform `agent/*_gpt.py`（隔離、min=0 零常駐費）。**歷史單一入口＝`docs/gpt_voice_line_retrospective_20260716.md`**（含全部證據/時間線/復活 SOP/未收尾誠實欄），另有 research/blueprint/plan 三份姊妹文件。按鈕與派工已由 `GPT_VOICE_LINE.retired` 旗標雙閘關閉（collections.ts 單一真相源）。OPENAI_API_KEY 已在 Secret Manager。
