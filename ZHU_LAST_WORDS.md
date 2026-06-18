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

## 最新完成（2026-06-18）

- 建 ailivex v12 前台頁（`/realtime-v12/[characterId]/page.tsx`）
- 修 v12 RPC payload 格式（JSON.stringify({url}) 對齊 agent json.loads）
- 大改 `agent/source_intake.py`：靜默取資料 + fire-and-forget + Sonnet 摘要 + 主動開口設計
- 提升 `voice-source` route fetchUrlClean 上限至 50000 chars
- `DEFAULT_VOICE_VERSION` 切 'v3'→'v12'（所有用戶預設 v12）
- admin 側欄：Wordmark 改連 `/admin`、加「前台主頁」按鈕
- 文件頁：移除 PDF 下載 + Google Slides 按鈕

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/realtime-v12/[characterId]/page.tsx` | 新建 v12 語音頁，URL 輸入框 + performRpc |
| `ailivex-platform/agent/source_intake.py` | 靜默模式 + fire-and-forget + Sonnet 4.6 摘要 + generate_reply |
| `ailivex-platform/src/app/api/voice-source/route.ts` | fetchUrlClean content 上限 50000 |
| `ailivex-platform/src/lib/collections.ts` | DEFAULT_VOICE_VERSION = 'v12' |
| `ailivex-platform/src/app/chat/[characterId]/page.tsx` | admin-only v12 按鈕 |
| `ailivex-platform/src/app/admin/layout.tsx` | Wordmark→/admin、前台主頁按鈕 |
| `ailivex-platform/src/app/documents/page.tsx` | 移除 PDF + Slides 按鈕 |

---

## 下一步

**v12 重新部署（最重要）**：
```bash
cd ~/.ailive/ailivex-platform
gcloud builds submit --config=agent/cloudbuild-v12.yaml --project=ailivex-2026 .
```
然後 Adam 撥 v12 通話 → 貼網址 → 驗 agent log `[source]` 軌跡 + 主動開口

---

## 卡住 / 未解

- **source_intake.py 改動尚未部署**：前台已上 Vercel，但 agent 程式還是舊版（ACK + 同步等）。需要 cloudbuild-v12.yaml 重 deploy，才能驗新設計
- v12 完整迴圈（貼URL→靜默→主動開口）只在程式設計層驗，未真機跑過

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| ailivex 前台 | `~/.ailive/ailivex-platform/` → Vercel |
| ailivex v12 agent | `~/.ailive/ailivex-platform/agent/source_intake.py` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-18 · 築*
