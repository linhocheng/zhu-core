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

## 最新完成（2026-05-01 深夜）

### 上午 / 下午
- **文章列表頁**上線：`/articles`，14 篇已顯示
- **BASE_URL 修正**：Cloud Run env var + `cloudbuild.yaml`（$SHORT_SHA → $BUILD_ID）
- **情報官禁止造假**：刪除「可以虛構貼文」，改為 WebFetch 強制驗源
- **layout metadata**：title 改為「心靈顯化部」

### 晚間（新增）
- **Threads 留言自動化 end-to-end 驗證完成** ✅
  - Lucy（lucymo0306）成功登入 Threads → 找到目標貼文 → 留言 → 發佈
  - 源碼：`~/.ailive/zhu-core/docs/lucy-threads/comment.js`
  - 完整 Playbook：`~/.ailive/zhu-core/docs/THREADS_COMMENT_PLAYBOOK.md`
  - 截圖全套：`~/.ailive/zhu-core/docs/lucy-threads/*.png`

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/claude-bridge/index.js`（Bridge VM） | 情報官 prompt：禁虛構 + WebFetch 強制驗源 |
| `live-media-platform/app/articles/page.tsx` | 新增公開文章列表頁 |
| `live-media-platform/app/layout.tsx` | metadata title 改為「心靈顯化部」 |
| `live-media-platform/cloudbuild.yaml` | $SHORT_SHA→$BUILD_ID、BASE_URL 修正 |
| `zhu-core/docs/lucy-threads/comment.js` | Threads 留言腳本（Playwright）|
| `zhu-core/docs/THREADS_COMMENT_PLAYBOOK.md` | 完整教學文件（新建）|
| `zhu-core/docs/WORKLOG.md` | 本次工作紀錄 |
| `zhu-core/ZHU_LAST_WORDS.md` | 就是這份 |

---

## 下一步

1. **情報官加驗源**已部署，下次跑（明日 02:00 UTC / 10:00 Taipei）觀察是否還有死連結
2. **角色工作記憶寫回**尚未驗證（approve 後 `live_media_char_memory` 是否有 positive_signal）
3. **Escalated 2 篇**待人工處理（score 78 那篇只差錯字，可考慮直接人工核准）
4. **Lucy Phase 2**：session 持久化、隨機時間觸發、LLM 即時生成留言內容

---

## 卡住 / 未解

- 本機 `/tmp/index.js` source 與 Bridge VM 有 drift（情報官修正只改了 VM，本機未同步）
- Escalated 文章「復甦的代價」有錯字「新有的→所有的」，兩次重寫都沒修好
- Lucy session 每次都要重新登入，尚未做持久化

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
| Threads 留言腳本 | `~/.ailive/zhu-core/docs/lucy-threads/comment.js` |
| Threads 完整教學 | `~/.ailive/zhu-core/docs/THREADS_COMMENT_PLAYBOOK.md` |

---

*2026-05-01 深夜收尾 · 築*
*「你的辛苦，是後面的夥伴的江山。」*
