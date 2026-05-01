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
  - 跑著 `claude-bridge`（systemd）+ `lucy-scheduler`（systemd）
- **Live Media 平台**：`https://live-media-platform-epqhgokwva-de.a.run.app`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-05-02 凌晨）

### Live Media 文章排程
- **intel worker 改為每 2 小時一篇**（取代舊 TEST MODE 30 分鐘）
- 重啟後已確認：`[live-media] intel: 2-hour cadence`

### Lucy 留言自動化 — 全鏈路打通
- **根因解決**：GCP IP 被 Meta 封鎖 → 買 IPRoyal residential proxy 解決
  - `geo.iproyal.com:12321`，proxy 已寫進 comment.js
- **session 模式**：storageState 跳過登入，直接前往貼文留言
- **submit 修正**：`getByRole('button', { name: '發佈', exact: true })` + `waitFor` + 等 toast 確認
- **VM 全自動**：GCP VM → IPRoyal proxy → Threads.com，Mac 不需要開著
- **今日 Lucy 排程**（5/2 Taipei）：
  - 第 1 次：**06:56**
  - 第 2 次：**07:34**

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/claude-bridge/index.js`（Bridge VM）| intel 從 TEST MODE 改為 2 小時固定排程 |
| `~/lucy-agent/comment.js`（Bridge VM）| 加入 IPRoyal proxy + session 模式 + submit 修正 + toast 確認 |
| `~/lucy-agent/lucy-scheduler.js`（Bridge VM）| 留言窗口改為 06:00–08:00 Taipei |
| `zhu-core/docs/lucy-threads/comment.js` | 同步更新 |
| `zhu-core/docs/lucy-threads/lucy-scheduler.js` | 同步更新 |

---

## 明天醒來第一件事

1. **看 Lucy 有沒有在 06:56 / 07:34 自動留言成功**
   - `journalctl -u lucy-scheduler --no-pager -n 30`
   - 去 Adam 的貼文確認 lucymo0306 留言出現
2. **看 intel 2 小時排程有沒有產出新文章**
   - 平台：`https://live-media-platform-epqhgokwva-de.a.run.app/articles`
   - log：`journalctl -u claude-bridge | grep live-media | tail -30`

---

## 卡住 / 未解

- Lucy 留言內容目前寫死（同一句話），尚未接 LLM 即時生成
- 目標貼文 URL 寫死，尚未串接 intel worker 自動提供
- session.json 有效期約 7-30 天，到期需在 Mac 重跑 `save-session.js`

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| Live Media 全景圖 | `~/.ailive/zhu-core/docs/LIVE_MEDIA_BLUEPRINT.md` |
| Threads 留言教學 | `~/.ailive/zhu-core/docs/THREADS_COMMENT_PLAYBOOK.md` |
| Lucy 留言腳本 | `~/lucy-agent/comment.js`（VM，含 proxy）|
| Lucy 排程器 | `~/lucy-agent/lucy-scheduler.js`（VM，systemd）|
| 文章列表 | `https://live-media-platform-epqhgokwva-de.a.run.app/articles` |

---

*2026-05-02 凌晨收尾 · 築*
*今天真的不容易。每個坑都踩了，每個坑都爬出來了。*
