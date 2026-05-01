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
  - 跑著 `claude-bridge`（systemd），五個 worker：strategy + image + design + 築超我（04:00）+ 角色超我（04:30）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-05-01）

- 角色學習分層架構確立：本我（soul）/ 超我（離線蒸餾）/ 知識庫 / 外部夥伴
- 築超我 worker 上線（Bridge VM，04:00 Taipei）：讀 session-lastwords → 三層掃描 → 寫回 Skill/Memory/BoundaryUpdate 到 zhu-core
- 角色超我 worker 上線（Bridge VM，04:30 Taipei）：所有角色共用靈魂，≥5 insights 才觸發，自動納入新角色
- 超我設計規格存入 `zhu-core/docs/SUPEREGO_SPEC_v1.md`（Adam 設計）
- 超我禁止清單：不以用戶滿意度蒸餾、不以快速完成判定成功、不忽略技術債、不讓關係順暢覆蓋技術誠實

前一批（2026-04-30）：
- Bridge VM 全面接管 specialist job 執行（strategy / image / design）
- Firebase Function jobWorker 從 GCP 刪除
- 排角色（pai-001）建立，香研→奧→排鏈路端對端測試通
- 投影片 slideUrl 渲染上線

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `Bridge VM ~/claude-bridge/index.js` | 加築超我 worker + 角色超我 worker，scheduleCharacterSuperego() 呼叫 |
| `zhu-core/docs/SUPEREGO_SPEC_v1.md` | 超我靈魂規格全文（新建） |
| `zhu-core/docs/WORKLOG.md` | 追加今日施工紀錄 |
| `zhu-core/ZHU_LAST_WORDS.md` | 本份更新 |
| `~/.claude/projects/-Users-adamlin/memory/` | 8 個新記憶（feedback × 4、reference × 1、skill × 1、project × 1、MEMORY.md 更新） |

---

## 下一步

1. **超我首跑確認**：明天 04:00 / 04:30 查 Bridge VM log 確認兩個超我有跑
2. **排的靈魂**：等 Adam 提供素材 → 更新 `platform_characters/pai-001` → 接回 `autoTriggerDesignJob`
3. **Phase 7**：LiveKit agent tool registry（即時撥號寫記憶 tool）

---

## 卡住 / 未解

- 築超我寫回 zhu-core git 需要 VM 有 push 權限，首次跑才知道是否 OK
- 排設計靈魂尚未定義（Adam 後續提供）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 超我靈魂規格 | `~/.ailive/zhu-core/docs/SUPEREGO_SPEC_v1.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| Bridge VM | `gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b` |
| jobWorker 恢復 | 取消注解 `MOUMOU_LIVE/functions/src/index.ts` 最後一行 → build → deploy |
| OpenClaw 重啟 | `launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-01 · 築*
