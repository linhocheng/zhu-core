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

## 最新完成（2026-06-27）

- HeyGen resolution bug 修復並 deploy（portrait_720p → 720p）
- HeyGen pipeline 全面升級：`type: "image"` → `type: "avatar"` + `avatar_id` + Avatar IV 引擎
- Gallery UI 加 motion prompt 可編輯欄位
- `aspect_ratio: "auto"` 全面開啟（上傳什麼比例輸出什麼比例）
- MVP 測試腳本驗通全鏈路（Firestore → MiniMax TTS → GCS → HeyGen）
- 預設 fallback avatar ID：`4ff5316df3734ebd897609d2d391dbb8`

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `media-worker/src/providers/heygen-video.ts` | 改 type:avatar + avatar_id + avatar_iv + aspect_ratio:auto |
| `media-worker/src/providers/types.ts` | VideoInput: avatarUrl → avatarId, 加 motionPrompt |
| `media-worker/src/handlers/worker.ts` | 傳 avatarId + motionPrompt |
| `ailivex-platform/.../generate-video/route.ts` | 用 heygenAvatarId，fallback 預設 ID |
| `ailivex-platform/src/app/gallery/page.tsx` | HeyGen 按鈕上方加 motion prompt textarea |
| `ailivex-platform/scripts/test-lulu-video.mts` | MVP 測試腳本 |

---

## 下一步

進 `~/.ailive/ailivex-platform`，考慮讓角色後台設定支援多個 `heygenAvatarId`（不同場景/服裝），或直接讓 Adam 在 gallery 生影片後確認品質。

---

## 卡住 / 未解

無

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
| HeyGen fallback avatar ID | `4ff5316df3734ebd897609d2d391dbb8` |
| Lulu avatar ID | `f987bd3ce34047c08d356930a409b184` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-27 · 築*
