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

## 最新完成（2026-06-21 第十 session）

- 掃描 ailivex-platform 全部 API 呼叫，產出費用地圖（Bridge/直連/第三方三分）
- v14.3.0：v14 語音頁燈號移右上角（9px 圓點無框），search bar 移名字下方（已 deploy）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/realtime-v14/[characterId]/page.tsx` | v14.3.0：右上角狀態圓點 + 名字下方 search bar |

---

## 下一步

1. **確認 Cloud Run 語音服務狀態**：
   ```bash
   gcloud run services list --project=ailivex-2026 --region=asia-east1
   ```
2. **決定是否 deploy v14 語音 agent**（目前 /realtime-v14/ 空房間）：
   ```bash
   SHA=$(cd ~/.ailive/ailivex-platform && git rev-parse --short HEAD)
   gcloud builds submit --config=agent/cloudbuild-v14.yaml --substitutions=COMMIT_SHA=$SHA --project=ailivex-2026 .
   ```
3. **驗 v14.3.0 UI**：開 `/realtime-v14/[characterId]`，確認右上角燈號 + 名字下 search bar 正常

---

## 卡住 / 未解

- v14 語音 agent 未 deploy：/realtime-v14/ 進房間無 agent（語音）
- v11/v12/v13 Cloud Run 存活狀態未確認

---

## ailivex 費用地圖（速查）

**Bridge 吃到飽**：dialogue / doc-process / generate-story / generate-scripts / generate-storyboard / soul-enhance / 記憶提煉 / lastSession 快照 / source_intake 網址摘要

**直連燒 key**：語音 turn-path（需 streaming）/ 語音判斷腦（Haiku floor-gate）

**第三方計費**：LiveKit / Soniox STT / MiniMax TTS / Vertex AI embedding / media-worker

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

*2026-06-21 第十 session · 築*
