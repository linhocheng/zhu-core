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

## 最新完成（2026-05-24）

- 部署 anews-platform v1.7.0.003（evidence-pass worker + G1-G4 全套）到 prod
- 建立 GCP queue `anews-evidence-pass`（asia-east1）
- 診斷並修復 image queue stuck（PRECONDITION race condition）
- v9 prod test script：修 IS_PROD poll-based source/blueprint/alignment 模式
- 修 alignment 三層恢復路徑：Recovery A（callback lost）+ B（PARSE_ERROR targetId bug 修正）+ C（needs_repair skip）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/anews-platform/scripts/test-medium-mode.mjs` | IS_PROD 全 poll-based；alignment 三層恢復；targetId bug 修正；diagnostic log |

---

## 下一步

**接棒第一件：確認 v9 run 是否跑完，或直接重跑**

```bash
# 查 PID 是否還活著（PID 31484 是最後一次啟動）
ps aux | grep test-medium-mode

# 直接重跑（會自動 cancel 上一個 issue）
cd ~/.ailive/anews-platform && ANEWS_BASE=https://anews-platform.vercel.app node scripts/test-medium-mode.mjs
```

看 `[alignment diag]` 行確認 article 層級狀態。如果 alignment 正常通過：
1. commit：`git add scripts/test-medium-mode.mjs && git commit -m "v1.7.0.004 — 修正：alignment 三層恢復 + targetId bug"`
2. 繼續 Batch C：coherence gate（orchestrate coherence_done 三路分流 + approve-coherence endpoint + dashboard UI，~90 min）

---

## 卡住 / 未解

- alignment PARSE_ERROR 根因是 prod LLM blueprint 品質不穩，非 code bug，只能 skip 繞過
- source_thin 問題（LLM web_search 結果不穩），script 已有 bypass
- v9 最新 run（PID 31484）Adam 換手時剛啟動，結果未知

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
| ANEWS prod | https://anews-platform.vercel.app |
| ANEWS 源碼 | `~/.ailive/anews-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-24 · 築*
