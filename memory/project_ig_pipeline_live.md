---
name: 鏡 IG 流水線（已暫停 2026-05-03）
description: lucymo IG 自動發文 pipeline，2026-05-03 STOP_TS 過期自然停，主力轉 molowe，現處暫停狀態
type: project
originSessionId: 1f508fc4-3965-4471-a5fd-c41836c621c1
---

## 狀態：已暫停（2026-05-03 起）

**最後一篇**：2026-05-03 09:49 CST（postId `jImMBB3ifLRdu6u1Cp1l`，topic「你上一次真正休息」）
**停因**：scheduler 內建 `STOP_TS=2026-05-03 10:00 CST` 自然過期
**現況**（2026-05-09 確認）：
- VM 上 `ig-pipeline-scheduler.sh` 已停（無新 log entry from 5/3 09:49 起）
- bridge live-media worker 仍 90min tick，但 directive `articles_per_cycle=0` / `ig_per_cycle=0` → 全 skip
- 5/9 清掉 5/3 殘留的 SIGINT-01 zombie process（PID 281344）
**重啟條件**：Adam 明確指示。重啟前要 (1) 改 STOP_TS (2) bridge directive 改回 >0 (3) 確認 lucymo IG token 還有效

---

## 原始上線紀錄（2026-05-02）

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
