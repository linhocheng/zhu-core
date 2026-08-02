---
name: project-manman-platform
description: 漫漫商用陪伴平台（多租戶 SaaS on LINE）——本尊漫漫的商用版，測試環境已通車，多模態全開，打電話待蓋
metadata: 
  node_type: memory
  type: project
  originSessionId: 6938c143-fef9-48e0-baba-3be9d8f05729
---

**漫漫商用平台**（repo `~/.ailive/manman-platform`，GitHub baobaoagi-cpu/manman-platform）：把成熟陪伴 AI「漫漫」的品格+技能做成多租戶 LINE SaaS，儲點扣點制。規格總綱 `docs/HANDOFF-v1.md`。本尊 repo 不在本機、不互通（🔴 硬隔離）。

**部署拓樸（2026-08-02 通車）**：GCP `manman-2026`（billing 掛 01FB18 Firebase 付款——「我的帳單帳戶」配額滿）；Cloud Run `manman-backend`（asia-east1，URL https://manman-backend-533860518045.asia-east1.run.app）＋Cloud SQL `manman-pg`（PG17 **要 --edition=enterprise** 才吃 db-f1-micro，磚頭費 ~$11-13/月）；`deploy.sh` 是唯一真相源、Secret Manager 11 把；expire-sweep 走 Cloud Scheduler。LINE OA「BB」@322pkzsq（bot 模式）。本地開發：Docker `manman-pg` port 5433。

**LLM 雙軌**：文字走 bridge（$0）、附件（讀圖/PDF）強制直連 API——`llmBaseUrl` 只屬 bridge，直連鎖死 api.anthropic.com（2026-08-02 401 教訓）。成本錶 `llm_cost_log` 每呼叫落帳。

**能力現況**：輸入＝文字/圖(vision 2點)/PDF/語音(Gemini STT)；輸出＝文字/克隆聲語音(MiniMax voice_id `ttv-voice-2026080216441426-J1ebtRnu`，掛 ailivex 帳號，**api.minimax.io 不是 .chat**，voice 5點)/生圖(gemini-2.5-flash-image，image 20點，畫自己自動釘外觀)。標籤抽取＝deliverReply 遞送咽喉（生成成功才扣點、失敗誠實退文字）。

**測試租戶**：tenant 1＝Adam（她叫小狐狸、稱呼 Adam）。

**未蓋**：打電話（LIFF+LiveKit 既有 project+fork ailivex agent v21——建材全齊）、[SCHEDULE]/[PROMISE]/[NOTE] 抽取器（她會吐標籤系統不接）、worker（履約/關懷/日記/夢）、記憶管線（傳記長不出來）、FOUNDATION.md 地基帳本（調度清單提過未點頭；payments/create 無鎖、env fail-quiet、CI 未接——**對外開放前必補**）、LINE Pay（Adam 指示押後）、啟元儀式吞原文根治、新戶贈點+admin 補點端點。

**Why**：Adam 的節奏是功能先行給他摸全套、地基帳上記債跟後補；樣品屋天條的「最晚灌注點」是對外開放前，不是他自己測之前。

**How to apply**：動這個 repo 先讀 HANDOFF-v1.md；線上設定只改 deploy.sh 再部署；雲 DB 手術臨時開 authorized-networks 用完必清；改 `soul/character-core/` ＝改她的行為。相關：[[feedback-cloudrun-firebase-adc]]、[[reference-cloudrun-background-task-sop]]、[[feedback-glue-layer-errors-lie]]。
