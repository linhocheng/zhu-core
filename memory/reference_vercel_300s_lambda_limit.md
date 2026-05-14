---
name: Vercel lambda 300s 硬上限不適合長生成任務
description: Sonnet 4.6 產 30-40KB HTML 需 200-310s，Vercel maxDuration=300s 會被殺；長任務改 Cloud Run / Firebase Functions / 串流分段
type: reference
originSessionId: a4e715dd-34d5-4035-a1d9-29960e200739
---
# 觸發信號

- 「跑成功率不穩」「有時通有時超時」「max_tokens 調了還是踩雷」
- Vercel 路由 maxDuration 設 300，curl 測偶爾 290s timeout 偶爾通
- 調 max_tokens：調低 → output 截斷 / QA fail；調高 → lambda 被殺
- 兩個失敗模式之間擺盪 = 架構不對，不是參數不對

# 實測數據（2026-05-11，strategy-html worker）

- **任務**：Sonnet 4.6 (`claude-sonnet-4-6`) 吃 5000-7000 字 markdown + 24KB reference HTML，產 30-40KB 設計版 HTML
- **max_tokens=12000** → 250s 完成、output 在 12K token 切掉、HTML 缺 `</html>` 收尾、QA fail
- **max_tokens=16000** → 290s+ 才能寫完整、Vercel 300s hard cap → lambda 被殺，Firestore 連 htmlError 都來不及寫（update 死在 lambda 裡）
- **結論**：Sonnet 4.6 產 30-40KB HTML 內容生成本身要 200-310s，不是 prompt 問題不是參數問題

# Why

Vercel serverless lambda hard cap = 300s（Pro plan），這個是平台限制不是 config。
單一 LLM call 產 16K token 的內容生成需要的時間大致：
- Sonnet 4.6 ≈ 60-70 token/s output speed
- 16000 token ≈ 230-270s 純生成
- 加上 prompt 處理 + bridge / SDK overhead → 250-310s

任何想用 Vercel 跑「output > 12K token 的單次 LLM call」都會撞牆。

# How to apply

**長任務 routing 決策表**：

| 預估時長 | 平台 | 備註 |
|---|---|---|
| < 60s | Vercel route | 預設 |
| 60-240s | Vercel route + maxDuration=300 | 留 60s buffer |
| **> 240s** | **Cloud Run / Firebase Functions** | 預設配 600s+，已有 jianbin-v2 / livekit 先例 |
| 串流即時回 | Vercel + SSE | dialogue / voice-stream 那條路徑 |
| 巨大 batch | 排隊 + worker poll | 別硬塞單一 request |

**動手前先估時長的兩個門檻**：
1. 預期 output token > 12000 → 警鈴（≈ 200s+）
2. prompt 長 > 30KB + output > 8K token → 警鈴

**踩到後別調參數兩次**：第一次調是探索、第二次調進「兩個失敗模式擺盪」就是架構不對的訊號，停手 escalate 給 Adam 換平台。對齊 `feedback_solve_root_not_symptom`。

# 反例提醒

- Vercel 短任務（< 60s）不要因此搬走，搬了反而增加架構複雜度
- bridge call 透過 zhu-bridge 不解決這問題（bridge 也是同一個 lambda 內 await）
- 串流分段（chunked save）能繞過 lambda timeout 但是 prompt engineering 複雜度高，先評估換平台是不是更直接

# 正解落地（2026-05-11 strategy job 全鏈路）

ailive-platform `strategy` job pipeline 已完整搬離 Vercel lambda：
- **trigger 端**（dialogue/voice-stream）：寫 `platform_jobs` doc + enqueue Cloud Tasks
- **worker 端**：Cloud Run service（VPC egress 走 bridge VM :3002 吃到飽，零 API key 燒）
- **enqueue 實作**：`ailive-platform/src/lib/cloud-tasks.ts` ── 純 fetch + node:crypto JWT，無 SDK 依賴
- **端到端驗證**：job `tNf5zGfLY2ERSFaUPIvH`，9607 字 markdown + docx + HTML，~5 min 完成

相關 reference：
- `reference_google_cloud_sdk_no_bundle` ── Turbopack 不要 bundle GCP SDK，第一秒走 fetch+REST
- `reference_gcp_self_actAs_binding` ── SA mint OIDC token 給自己也要 grant
