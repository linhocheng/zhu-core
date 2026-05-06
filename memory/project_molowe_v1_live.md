---
name: molowe-platform 三層 AI 編輯部 v1.0 上線（2026-05-06）
description: T1-T10 一天收，三層架構（操作 / 策略 / 監督）正式上線，midoufu 唯一驗證對象
type: project
originSessionId: 34482a57-dd4f-454a-b441-d8c9c2f565b9
---
molowe-platform v1.0 上線 — 三層 AI 編輯部架構落地。

**Why:** 5b 兩層角色（4 KOL + 8 公司 base soul）被 Adam 重新拍板太重太抽象，改走「操作層 / 策略層 / 監督層」三層。一天內把 5b 殘留刮乾淨 + T1-T10 全建上線，6 個 commit（v1.0.0.001-006）按任務邊界切，全推 origin/main。

**架構速記：**
- Layer 1 操作層：writer ↔ editor 改稿循環（最多 3 輪）→ visual → publisher（IG Graph API v21.0）。每 5 分鐘 backlog cron 推進
- Layer 2 策略層：Kairos（週一 09:00 TPE）定本週方向盤 → J 大（每日 06:30 TPE）翻成具體 focus_topics → 注入 writer template
- Layer 3 監督層：超我（週一 13:00 TPE）三維度（tone / lexicon / topic_alignment）聲紋稽核 + Editorial 儀表板（`/dashboard/editorial`）
- LLM 路由全走 zhu-bridge（Max OAuth），不噴 API key
- Insights inline 寫回 ContentDoc，不開新 collection

**How to apply:**
- 建議下次接棒任務：(1) 第二個 KOL 上線驗證多例 (2) `/api/persona/calibrate` 端點補超我 baseline (3) Threads 通路
- midoufu 是唯一 active KOL，所有 path 跑過但**未驗多例硬寫假設**（quota cache / prime time / insights 欄位相容）
- Editorial 儀表板網址：https://molowe-platform.vercel.app/dashboard/editorial
- Admin Key：`molowe_a9bd8770aa44c271f571b10584ba0732`
- 完整指南：`~/.ailive/molowe-platform/MOLOWE_GUIDE.md`
- 5 條 cron 排程在 `vercel.json`：pipeline `*/5` / insights `0 *` / kairos `0 1 * * 1` / jda `30 22 *` / superego `0 5 * * 1`
