---
name: 鏡 IG 流水線上線（2026-05-02）
description: 靈魂拍立得 lucymo IG 自動發文pipeline，Sonnet Max 生文案 + Gemini 生圖 + IG Graph API 發文
type: project
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---
## 架構

```
VM (zhu-dev)
  └─ ig-pipeline-scheduler.sh
       ├─ claude -p --model claude-sonnet-4-6  ← Max 吃到飽，不計費
       └─ POST /api/ig-pipeline/run { pregenerated: {...} }
            ├─ generateWithGemini(prompt, null)  ← 無 faceRef，純美學攝影圖
            ├─ Firestore: platform_posts
            └─ publishPhoto(igUserId, igAccessToken, imageUrl, caption)
                 └─ IG Graph API v21.0（2步驟：container → publish）
```

## 關鍵設計決策

- **Sonnet 在 VM 跑**：Vercel 無法到 VM 的 port 3001（bridge 不對外），VM 直接用 CLI
- **`pregenerated` 欄位**：Vercel route 接受 VM 預生成的內容，跳過 Haiku fallback
- **Haiku fallback**：Sonnet 失敗時 Vercel 自己用 Haiku 生（降品質但不中斷）
- **無 faceRef 生圖**：靈魂拍立得是物件/光線美學，傳 `null` 給 generateWithGemini 跑純文字模式

## 檔案位置

| 說明 | 路徑 |
|------|------|
| Vercel API 路由 | `~/.ailive/ailive-platform/src/app/api/ig-pipeline/run/route.ts` |
| VM 排程腳本 | `zhu-dev:/home/adam_dotmore_com_tw/ig-pipeline-scheduler.sh` |
| VM 執行 log | `zhu-dev:/home/adam_dotmore_com_tw/ig-pipeline.log` |

## IG 帳號憑證

- **角色**：Vivi（id=`kTwsX44G0ImsApEACDuE`）
- **igUserId**：17841402372820329（lucymo 帳號）
- **igAccessToken**：存於 Firestore `platform_characters/kTwsX44G0ImsApEACDuE`（非 env var）

## 排程規則

- 每 3 小時一篇
- 執行：`nohup ~/ig-pipeline-scheduler.sh > /dev/null 2>&1 &`
- 停止條件：`date +%s` ≥ `2026-05-03 10:00 CST`（下次要改這裡）

**Why:** 頻率決策來自奧的建議：4-5篇/週避免內容工廠效應；測試期先用3h跑一晚驗流水線。

**How to apply:** 下次開新一輪排程前，先改 STOP_TS，再 SCP + 重啟。
