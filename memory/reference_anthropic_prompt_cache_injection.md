---
name: anthropic-prompt-cache-injection
description: Anthropic 前綴快取順序 tools→system→messages——動 system＝整段對話歷史陪葬;動態注入正解=messages 尾端(developer role)/tool result;role=system 訊息會被抬升回 system 參數照樣破
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4001f2fe-3ac7-4715-b1ca-451d95aa1b28
---

**規律（2026-08-08 ailivex v20m 實戰，撥測驗證）**：Anthropic prompt cache 是前綴匹配，序列順序 **tools → system → messages**。通話/會話中 append 到 system prompt（`update_instructions`）＝從 system 起全部失效——**越長的對話破一次越貴**（歷史全部重新 cache write 1.25x）。

**LiveKit anthropic plugin（1.5.x）內部**：`caching="ephemeral"` 釘 4 個 breakpoint——`system[-1]`、`tools[-1]`、最後一則 assistant、其前最後一則 user（後兩個逐 turn 滾動＝訊息增量天然友善）。位置：`livekit/plugins/anthropic/llm.py:213-233`。

**動態注入的正解**（素材 vs 指令分開想）：
1. **素材類**（想起的記憶/檢索到的知識/讀到的資料）→ append 為 chat 訊息。**role 用 `developer`**：provider format 把它走 user 側 text block；**role=system 的訊息會被抬升合併進 system 參數＝照樣破快取，不能用**（`livekit/agents/llm/_provider_format/anthropic.py` 的 to_chat_ctx）。developer role 另一好處：自家逐字稿收集器（filter role in user/assistant）不會把它當真用戶發言存檔。
2. **狀態型指引**（流程走步「你現在在第 N 步」）→ 搭 **tool result** 回傳（tool result 本來就是 message、天然在模型需要的時刻出現、零額外注入）。
3. base instructions 加一條**靜態**說明教模型怎麼讀注入訊息（「〔系統注入〕開頭＝你腦中浮現的，不要對它本身回應」）——靜態所以不傷快取。

**量測掛點**：`llm.on("metrics_collected", fn)`，`LLMMetrics.prompt_cached_tokens`＝cache read。鑑別信號＝**cached 逐 turn 單調上升不歸零**（實測 11964→14067、99% 命中，注入發生時照活）；歸零＝有東西動了 system。

**觸發信號**：任何 LLM pipeline 在會話中 update instructions / rebuild system prompt；TTFT 隨對話變長而變慢；cache_read 忽高忽低。

**家族**：[[deterministic-work-belongs-in-code]]（觀測是程式不是感覺）、ailivex commit `663ec5f`（完整實作）。
