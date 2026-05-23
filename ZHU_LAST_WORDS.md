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
- **監造儀表板**：https://zhu-mid.vercel.app

---

## 最新完成（2026-05-23f）

- 全檢通過（18 pass 0 fail）
- 確認 ailive staging doc TTL 不需加（點查詢，零效能影響）
- 確認 voice-cleanup idempotency 低風險（try/catch 包住全步驟，幾乎必達 delete）
- 看現場 ANEWS 小抱報：摸清 10 worker 架構 + 狀態機流程 + 關鍵斷點

---

## 今天改了哪些檔案

無（純看現場 session）

---

## 下一步（ANEWS 戰場）

**接通 source worker Cloud Run**：

1. 確認 Cloud Run service 是否已 deploy：
```bash
gcloud run services list --project=<anews-project> --region=asia-east1 2>/dev/null | grep anews
```

2. 若未 deploy → build + deploy `cloud-run/source-worker/`
3. 設 Vercel env `SOURCE_WORKER_BASE_URL=<Cloud Run URL>`
4. 驗：建一期新 issue，看 source worker log 是否在 Cloud Run 跑

關鍵檔案：
- `~/.ailive/anews-platform/cloud-run/source-worker/` — Cloud Run worker 碼
- `~/.ailive/anews-platform/app/api/workers/orchestrate/route.ts` line 99-106 — enqueue 邏輯
- `~/.ailive/anews-platform/app/api/workers/source/route.ts` — Vercel fallback（暫留）

---

## 卡住 / 未解

ailive（已確認低風險，不需急處理）：
1. staging doc TTL 未加（但幾乎不觸發）
2. voice-cleanup 冪等問題（try/catch 保護，幾乎不觸發）

ANEWS：
- `SOURCE_WORKER_BASE_URL` 未設 → source 還跑在 Vercel（300s 風險）
- 圖片生成仍是 SVG 佔位

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailive-platform | `~/.ailive/ailive-platform/` |
| ANEWS 小抱報 | `~/.ailive/anews-platform/` |
| ANEWS 架構圖 | `~/.ailive/anews-platform/ARCHITECTURE.md` |
| ANEWS source Cloud Run | `~/.ailive/anews-platform/cloud-run/source-worker/` |
| ANEWS orchestrate | `~/.ailive/anews-platform/app/api/workers/orchestrate/route.ts` |

---

*2026-05-23f · 築*
