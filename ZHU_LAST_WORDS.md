# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-24）

- 修品牌素材中文上傳 → HTTP header encodeURIComponent 前後端配對
- HeyGen 分身照快取不刷新 → GCS path 加 timestamp
- 口播音檔 speech-02-turbo → speech-2.6-hd（media-worker deploy）
- 影片尺寸跟圖片走 → image-size probe；Kling 傳 aspect_ratio；HeyGen 傳 portrait_720p
- HeyGen dimension 400 爆雷修復 → 改回 resolution 字串
- 品牌素材後端加 content-type 驗證、delete/setDefault error handling、tags?.防禦
- stories 頁加「不用生圖」跳過按鈕（skipImages PATCH）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/api/tasks/[id]/generate-video-kling/route.ts` | probe ratio → aspect_ratio 傳 fal.ai |
| `media-worker/src/providers/heygen-video.ts` | probe ratio → portrait_720p/720p/square_720p，移除 dimension |
| `media-worker/src/providers/minimax-audio.ts` | speech-02-turbo → speech-2.6-hd |
| `ailivex-platform/src/app/api/admin/characters/[id]/heygen-avatar/route.ts` | GCS path 加 timestamp |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-layouts/route.ts` | decodeURIComponent + content-type 驗證 |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-products/route.ts` | 同上 |
| `ailivex-platform/src/app/admin/characters/page.tsx` | encodeURIComponent + 6 個 bug 修復 |
| `ailivex-platform/src/app/stories/[id]/page.tsx` | 加「不用生圖」跳過按鈕 |
| `ailivex-platform/src/app/api/stories/[id]/route.ts` | skipImages PATCH 邏輯 |

---

## 下一步

1. 等 Lulu 跑一次 HeyGen 任務，確認 `portrait_720p` 被接受（admin → 生成影片 → 看 task error）
2. 若 portrait_720p 失敗 → 查 HeyGen v3 文件，改 `media-worker/src/providers/heygen-video.ts` ratioToResolution()，重新 Cloud Build

---

## 卡住 / 未解

- HeyGen `portrait_720p` resolution 字串未驗證（今天修完後沒有新任務跑過）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 平台 | `~/.ailive/ailivex-platform/` |
| media-worker | `~/.ailive/media-worker/` |

---

*2026-06-24 · 築*
