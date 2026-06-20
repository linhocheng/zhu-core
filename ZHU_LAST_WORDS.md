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

## 最新完成（2026-06-20 第九 session）

- v14.2.5：移除 client-side Phase B 自動觸發，修掉重複/掉圖根因（已 deploy）
- 確認 v14 語音 agent 從未 deploy 到 Cloud Run（/realtime-v14/ 空房間的真相）
- 確認語音版本記憶架構：v10 現役，lastSession + 記憶提煉全有；v14 多 dispatch_task 工具但沒跑

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/stories/[id]/page.tsx` | 移除 phaseBTriggered client-side fallback（v14.2.5）|

---

## 下一步

1. **確認 v11-v13 Cloud Run 服務狀態**：
   ```bash
   gcloud run services list --project=ailivex-2026 --region=asia-east1
   ```
2. **決定是否 deploy v14 語音 agent**：
   ```bash
   SHA=$(git rev-parse --short HEAD)
   gcloud builds submit --config=agent/cloudbuild-v14.yaml --substitutions=COMMIT_SHA=$SHA --project=ailivex-2026 .
   ```
3. **驗 v14.2.5 故事板**：發新故事確認無重複/掉圖

---

## 卡住 / 未解

- v14 語音 agent 未 deploy：/realtime-v14/ 無 agent，lastSession 在 v10 才有效
- v11/v12/v13 Cloud Run 是否真的活著，未查

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailivex 主戰場 | `~/.ailive/ailivex-platform/` |
| prod | https://ailivex-platform.vercel.app |

---

*2026-06-20 第九 session · 築*
