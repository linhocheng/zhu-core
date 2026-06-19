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

## 最新完成（2026-06-19 · UDN NEWS demo 修繕）

- 選單重排：資料分析→新聞123→吳念真/影片1→張立/影片2→蔣勳/影片3；`switchNews(idx,btn)` 解耦 tab 順序 vs panel DOM 順序
- 換 3 支講者影片（吳念真/張立/蔣勳）：Drive confirm-token 抓 1080p 原檔 → avconvert 壓 540×960 H.264 faststart（~140MB，原始 420MB）
- **修「沒有影片」**：根因 Cloud Run ~32MiB 單次回應上限，瀏覽器開放式 `Range: bytes=0-` 讓 server 回整段 42MB 爆 500 → `<video>` err=4。修法：`server.js` 每次回應封頂 8MiB，瀏覽器自動續抓後續 range
- e2e 驗通：線上三支 curl 無 Range / `bytes=0-` 都回 206；headless Chrome 三支全 `canplay rs=4 540x960 err=none`
- 記憶：`reference_selfhost_mp4_needs_range_206.md` 補 32MiB 天坑；新建 `reference_drive_large_file_download_and_avconvert.md`

線上：https://udnnews-web-62w6sp6iba-de.a.run.app/frontend/demo.html

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `/tmp/udnnews-build/frontend/demo.html` | 選單重排 + switchNews 解耦 + 切離 pause video |
| `/tmp/udnnews-build/web/server.js` | MAX_RESPONSE_BYTES=8MiB 封頂 + streamFile 防中斷 crash |
| `/tmp/udnnews-build/frontend/videos/{reels-wu,fb-zhang,yt-jiang}.mp4` | 新版 540×960 壓縮檔 |
| `~/.claude/.../memory/reference_selfhost_mp4_needs_range_206.md` | 補 Cloud Run 32MiB 天坑 |
| `~/.claude/.../memory/reference_drive_large_file_download_and_avconvert.md` | 新建 |

> 註：udnnews demo 的 source 在 `/tmp/udnnews-build`（非 git repo）。重啟若 /tmp 被清需從 Drive / Cloud Run 重抓。

---

## 下一步

**接棒第一件：等 Adam 真機回報**
- Adam 要在手機 + 電腦各開三個影片頁確認播放。若有頁面回報不播，先 `curl -o /dev/null -w "%{http_code}" <video_url>`（無 Range）+ `curl -H "Range: bytes=0-" ...` 兩種都要非 500，再上 headless Chrome 讀 readyState/error，**別只測封閉小段 range（會騙過你）**。

---

## 卡住 / 未解

- UDN NEWS demo：無未解（三件全完成且 live 驗過）。
- **（6-18 第五 session 遺留，未確認是否已解）AILivex v13**：`MEDIA_WORKER_URL` / `MEDIA_WORKER_KEY_AILIVEX` 兩個 env var 是否已加進 `ailivex-platform/agent/cloudbuild-v13.yaml --set-secrets` 未確認；dispatch→media-worker→callback→notified 整條端到端是否真機驗過未確認。接棒若回到 ailivex 線先核這兩件。

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
| udnnews demo source | `/tmp/udnnews-build/`（frontend/demo.html + web/server.js） |
| 自架影片 Range 心法 | memory `reference_selfhost_mp4_needs_range_206.md` |
| media-worker 服務 | `~/.ailive/media-worker/` |
| AILivex platform | `~/.ailive/ailivex-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-19 · 築*
