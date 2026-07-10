---
name: voice-loadtest-setup-burst
description: 即時語音負載實測方法論＋核心發現：真短板是同時建線爆發不是穩態併發；合成來電者階梯法半天可複製
metadata: 
  node_type: memory
  type: reference
  originSessionId: d1be1fc9-5905-4fa1-b92a-07a9c2bc4fb6
---

**即時語音容量實測方法（AILiveX 2026-07-11 首測，v19+ 換版重測直接重用）**

**方法（半天＋幾美金）：**
1. 部署與生產一字不差的測試服務：copy main_vN 只換 `agent_name`（loadtest 隔離派工），min=1/max=1 鎖單台
2. 合成來電者（`loadtest/caller.py`）：本機 mint token＋explicit dispatch（`CreateAgentDispatchRequest`）→ 進房播預錄語音（macOS `say`→afconvert 48kHz mono）→ RMS 能量偵測 agent 回聲首幀 → turn latency
3. 階梯 1→6 路、每階 3 分鐘、stagger 3s；量 p50/p95/卡頓（幀距>250ms）/拒接（dispatch 後 20s 無聲）
4. **p95 膝蓋彎起的那一路＝單台容量**
5. 測試流量掛專屬測試帳號（agent 會把假通話寫成真記憶！14 筆實證）；測完 cleanup＋刪服務＋隔日計費錶歸零

**核心發現（現象通用、數字要自測）：**
- 穩態併發便宜、**建線是 CPU 尖刺**（子行程+載記憶+首輪推理）：6 路同時講沒事，6 路同一刻打進來→首回合 4s 飆 23-27s
- 對策=兩個閘都要：總量閘（rooms ≥ 台數×5 拒發 token）＋**進線斜率閘（3 通新建線/15s/台，超過排隊 5-10s）**
- 爆炸三部曲：延遲爬升→排隊→錯誤；只監控錯誤=只看到第三幕
- 開場白延遲（dispatch→第一聲）與併發無關，是固定成本（AILiveX 8.3s）

**踩過的雷：**
- 本機 Mac 到 LiveKit edge（161.115.163.x）TCP 路由不通（Google/官網皆通）→ 來電者要跑在雲端 VM（asia-east1 e2-standard-2 即可）；**用戶回報「連不上」先讓他換網路排除 ISP 路由**
- Python 腳本 nohup 後 stdout 緩衝，進度看結果 jsonl 不看 run.log
- Adam 問「要往下了嗎」時先查現場進度再答——別把「還在跑」說成「可以往下」

**Why:** 容量數字是水位計分母、併發閘上限、max-instances 公式（⌈目標÷5⌉）三者的共同源頭；沒實測全是沙推。
**How to apply:** 換 agent 版本、換機型（CPU/記憶體）、換 STT/TTS 供應商時重跑；白皮書完整版 `ailivex-platform/docs/whitepaper-realtime-voice-surge.md`。
