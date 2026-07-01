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

## 最新完成（2026-07-01）

- 修正 ailivex `/convert` 素材轉換區影片生成 `avatar_not_found` — 根治並驗證通過
- 根因：HeyGen `talking_photo_id` 是短效 ID，存起來幾天就失效；應每次用圖片 URL 即時 upload
- media-worker 3 個檔（types.ts + heygen-video.ts + worker.ts）+ ailivex-platform 2 個路由改用 `avatarUrl` 路徑

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `media-worker/src/providers/types.ts` | `avatarId` 改 optional，加 `avatarUrl?: string` |
| `media-worker/src/providers/heygen-video.ts` | 加 avatarUrl 即時 upload talking_photo 路徑 |
| `media-worker/src/handlers/worker.ts` | VideoInput 解構補上 `avatarUrl` |
| `ailivex-platform/src/app/api/convert/video/route.ts` | 改用 `heygenAvatarUrl || avatarUrl` |
| `ailivex-platform/src/app/api/tasks/[id]/generate-video/route.ts` | 同上 |

---

## 下一步

`/convert` 完整流程已通（上傳音檔 → HeyGen 影片生成 ✅）。
接棒第一件：測試 /convert 口播稿生成音檔是否也通，或處理 `soulCore` third-person 問題（Firestore doc `characters/8mCpOmbJalsvdUxGRFzn`，field `soulCore` 有第三人稱指涉）。

---

## 卡住 / 未解

- 達賴聲音穩定度（06-25 emotion bug fix 後待驗）
- 生圖 OpenAI edits 效果（06-26 switch 後待驗）
- soulCore third-person issue（characters/8mCpOmbJalsvdUxGRFzn）

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
| ailiveX 平台 | `~/.ailive/ailivex-platform/`，repo: linhocheng/ailivex-platform |
| media-worker | `~/.ailive/media-worker/`（Cloud Run，無 git，改完要 Cloud Build） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-01 · 築*
