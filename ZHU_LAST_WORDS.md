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

## 最新完成（2026-06-27 · 兩個 session）

**Session A（HeyGen pipeline）**
- HeyGen resolution bug 修復並 deploy（portrait_720p → 720p）
- `type: "image"` → `type: "avatar"` + `avatar_id` + Avatar IV 引擎
- Gallery UI 加 motion prompt 可編輯欄位
- `aspect_ratio: "auto"` 全面開啟
- MVP 測試腳本驗通全鏈路（Firestore → MiniMax TTS → GCS → HeyGen）

**Session B（意川_WEB + 閒聊）**
- 意川_WEB 靜態前台部署到 Vercel（https://web-tawny-six-67.vercel.app），臨時對外可看
- 全檢通過（reflex ok / launchd ok）
- 建立意川_WEB 部署記憶

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `media-worker/src/providers/heygen-video.ts` | 改 type:avatar + avatar_id + avatar_iv + aspect_ratio:auto |
| `media-worker/src/providers/types.ts` | VideoInput: avatarUrl → avatarId, 加 motionPrompt |
| `media-worker/src/handlers/worker.ts` | 傳 avatarId + motionPrompt |
| `ailivex-platform/.../generate-video/route.ts` | 用 heygenAvatarId，fallback 預設 ID |
| `ailivex-platform/src/app/gallery/page.tsx` | HeyGen 按鈕上方加 motion prompt textarea |
| `~/Downloads/意川_WEB/vercel.json` | 靜態部署設定（framework: null） |
| `~/.claude/projects/-Users-adamlin/memory/project_yichuan_web_deploy.md` | 新建意川部署記錄 |

---

## 下一步

1. 確認 ailivex soulCore 是否已在 admin UI 改為第一人稱角色指令
   - Firestore：`characters/8mCpOmbJalsvdUxGRFzn.soulCore`
   - 若已改 → 跑一次通話驗收
   - 若未改 → 考慮在 `enhanceSoul()` 加自動轉換邏輯
2. 讓 Adam 在 gallery 生影片後確認 HeyGen 品質，再考慮多 avatar_id 支援

---

## 卡住 / 未解

- ailivex soulCore 仍是第三人稱設計文件，待 Adam 手動改
- 意川_WEB 為臨時部署，撤下時刪 Vercel `web` 專案 deployment

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
| 意川_WEB URL | https://web-tawny-six-67.vercel.app（臨時） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-27 · 築*
