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

## 最新完成（2026-05-23）

- ANEWS 狀態機測試驗收：Round 1 Happy Path + Round 2 Fault Paths，28 assertions 全 pass
- 修 `approve/route.ts` 缺 taskId bug（orchestrate 400 靜默失敗，issue 卡在 awaiting_review）
- 補測試腳本 images_all_done / export_done 手動觸發（Cloud Tasks 本機無效）
- 早上另一 session：ailive librosa 兇手確認，純 numpy 替換，Cloud Run 00059-x6n 穩定

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/editorial-jobs/[issueId]/approve/route.ts` | 補 taskId 到 orchestrate 呼叫 |
| `anews-platform/scripts/test-state-machine.mjs` | 補手動 images_all_done / export_done；Round 1+2 全通 |

---

## 下一步

**ANEWS 主線**：跑 Round 3（全量壓測）
```
cd ~/.ailive/anews-platform
# 修 test script 支援 5 articles × 26 sections × 28 images full run
# 或直接 deploy Vercel + 真實 issue 端對端
```

**ailive 主線**（等 Adam）：
- Adam 申請 Soniox API key → 換 STT 中英文雙語

---

## 卡住 / 未解

- Vercel 300s source worker 風險（記錄在 ARCHITECTURE.md，未動手搬 Cloud Run）
- 圖片生成仍是 SVG placeholder（IMAGE_DRY_RUN=true）
- LLM workers 真實輸出品質未驗（Round 1+2 全用 fake Firestore 寫入）
- Soniox API key 等 Adam 申請

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
| ANEWS 主戰場 | `~/.ailive/anews-platform/` |
| ANEWS 架構圖 | `~/.ailive/anews-platform/ARCHITECTURE.md` |
| ANEWS 測試腳本 | `~/.ailive/anews-platform/scripts/test-state-machine.mjs` |
| ailive agent | `~/.ailive/ailive-platform/agent/` |
| Cloud Run stable | revision `00059-x6n`（純 numpy，無 librosa） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-23b · 築*
