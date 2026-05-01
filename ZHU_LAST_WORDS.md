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
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`
  - 跑著 `claude-bridge`（systemd），`~/claude-bridge/index.js`
- **Live Media 平台**：`https://live-media-platform-epqhgokwva-de.a.run.app`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-05-01 晚間）

- **文章列表頁**上線：`/articles`，14 篇已顯示
- **BASE_URL 修正**：Cloud Run env var + `cloudbuild.yaml` 同步更新為正確 URL
  - `$SHORT_SHA` → `$BUILD_ID`（gcloud builds submit 不支援 $SHORT_SHA）
- **情報官禁止造假**：刪除「可以虛構貼文」指令，改為 WebFetch 強制驗源，失效跳過
- **layout metadata** 更新：title 改為「心靈顯化部」

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/claude-bridge/index.js`（Bridge VM） | 情報官 prompt：禁虛構 + WebFetch 強制驗源 |
| `live-media-platform/app/articles/page.tsx` | 新增公開文章列表頁 |
| `live-media-platform/app/layout.tsx` | metadata title 改為「心靈顯化部」 |
| `live-media-platform/cloudbuild.yaml` | $SHORT_SHA→$BUILD_ID、BASE_URL 修正 |

---

## 下一步

1. **情報官加驗源**已部署，下次跑（明日 02:00 UTC / 10:00 Taipei）觀察是否還有死連結
2. **角色工作記憶寫回**尚未驗證（approve 後 `live_media_char_memory` 是否有 positive_signal）
3. **Escalated 2 篇**待人工處理（score 78 那篇只差錯字，可考慮直接人工核准）
4. **Phase 5**：Threads 社群發布層，等 Adam 提供帳號

---

## 卡住 / 未解

- 本機 `/tmp/index.js` source 與 Bridge VM 有 drift（情報官修正只改了 VM，本機未同步）
- Escalated 文章「復甦的代價」有錯字「新有的→所有的」，兩次重寫都沒修好（停格者沒收到明確錯字指示）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| Live Media 後台 | `https://live-media-platform-epqhgokwva-de.a.run.app` |
| 文章列表 | `https://live-media-platform-epqhgokwva-de.a.run.app/articles` |
| Bridge VM source | `~/claude-bridge/index.js`（VM 為準，本機 /tmp/index.js 有 drift） |

---

*2026-05-01 晚間收尾 · 築*
