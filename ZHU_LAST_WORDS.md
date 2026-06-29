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

## 最新完成（2026-06-29）

- ailivex working tree 整批 commit（v14.6.0）：品牌素材批量上傳、故事卡刪除確認、Kling 長寬比偵測、enqueue.ts 技術債清除
- 新增「素材轉換區」（v14.7.0）：/convert 頁 + 3 支 API（characters/audio/video），部署 Vercel
- HeyGen 模型三/四切換（v14.7.1）：media-worker Cloud Run 重部署 + Vercel 更新
- 更新 documents/stories/gallery 頁 nav：補齊素材轉換區入口

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/convert/page.tsx` | 素材轉換區主頁（新建） |
| `ailivex-platform/src/app/api/convert/characters/route.ts` | 用戶角色清單 API（新建） |
| `ailivex-platform/src/app/api/convert/audio/route.ts` | 口播稿→TTS API（新建） |
| `ailivex-platform/src/app/api/convert/video/route.ts` | 上傳音檔→HeyGen API（新建） |
| `ailivex-platform/src/app/gallery/page.tsx` | HeyGen 模型切換 UI + nav |
| `ailivex-platform/src/app/documents/page.tsx` | 補齊 nav |
| `ailivex-platform/src/app/stories/page.tsx` | 加素材轉換區 nav |
| `ailivex-platform/src/app/api/tasks/[id]/generate-video/route.ts` | 接收 heygenEngine |
| `media-worker/src/providers/types.ts` | VideoInput 加 heygenEngine |
| `media-worker/src/providers/heygen-video.ts` | engine.type 動態化 |
| `media-worker/src/handlers/worker.ts` | 傳遞 heygenEngine |

---

## 下一步

等 Adam 測試素材轉換區：
1. `/convert` 頁面口播稿生成音檔（輸入文字 → 選角色 → 生成音檔）
2. 上傳音檔生成 HeyGen 影片（選模型三/四）
3. 確認達賴聲音穩定度（06-25 emotion bug 修復後未驗收）
4. 確認生圖 OpenAI edits 合成效果（06-26 切換後未驗收）
5. ailivex soulCore 第三人稱問題：Firestore `characters/8mCpOmbJalsvdUxGRFzn.soulCore` 待確認

---

## 卡住 / 未解

- 達賴聲音穩定度未驗收（emotion=neutral 修復後待測）
- 生圖 OpenAI edits 合成效果未驗收（06-26 切換後待測）
- ailivex soulCore 第三人稱：Firestore `characters/8mCpOmbJalsvdUxGRFzn.soulCore` 待確認是否已改

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 平台 | `~/.ailive/ailivex-platform/` |
| ailivex 生產 | https://ailivex-platform.vercel.app |
| 素材轉換區 | https://ailivex-platform.vercel.app/convert |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-29 · 築*
