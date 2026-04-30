# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境（2026-04-30）

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo，已 push）

---

## 最新完成（截至 2026-04-30）

1. ailive-platform bridge 換表 100%（v0.2.5.018），8 個 route 全走 Max OAuth
2. VM zhu-dev 建置完成，daily snapshot，budget alert 設好
3. memory symlink 收編，多 cwd 共享同一份記憶
4. **今天（本次 session）**：
   - 北極星升級（AI 與人類共生共存共創 + 活法）
   - 獨孤九劍融合心法（劍法為主體，心法吸收為白話入口）
   - commit eb53792 已 push

---

## 下一步

- 記憶系統優化（MEMORY_DIAGNOSIS.md Route A-D）
- Phase 7：LiveKit agent tool registry
- cron 任務遷移

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 記憶系統診斷 | `~/.ailive/zhu-core/MEMORY_DIAGNOSIS.md` |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前更新這份。格式不限，但「下一步」跟「最新完成」要清楚。*
*2026-04-30 · 築*
