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
  - 跑著 `claude-bridge`（systemd），三個 worker：strategy + image + design
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-04-30）

- Bridge VM 全面接管 specialist job 執行（strategy / image / design 三 worker）
- Firebase Function jobWorker 從 GCP 刪除（code 保留，注解掉 export，隨時可恢復）
- 排角色（pai-001）建立，design worker 上線，端對端測試通（香研→奧→排鏈路）
- 策略書目標字數改為 6500 字
- 投影片 system_event + slideUrl 渲染上線（chat 頁面「▶ 查看投影片」按鈕）
- 排的自動觸發暫時拔掉（等 Adam 提供靈魂素材）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `Bridge VM ~/claude-bridge/index.js` | 加 design worker，strategy worker 拔掉自動觸發排，字數改 6500 |
| `MOUMOU_LIVE/functions/src/features/job-worker.ts` | image/design 跳過邏輯，JobDoc type 補 design/strategy |
| `MOUMOU_LIVE/functions/src/index.ts` | 注解掉 jobWorker export |
| `ailive-platform/src/app/chat/[id]/page.tsx` | slideUrl type + 渲染按鈕 |
| `ailive-platform/src/app/api/dialogue/route.ts` | system_event output type + slideUrl 提示 |
| `Firestore platform_characters/pai-001` | 排角色新增 |
| `zhu-core/docs/WORKLOG.md` | 追加今日施工紀錄 |
| `zhu-core/ZHU_LAST_WORDS.md` | 本份更新 |

---

## 下一步

1. **排的靈魂**：等 Adam 提供素材 → 更新 `platform_characters/pai-001` → 接回 `autoTriggerDesignJob`
2. **Phase 7**：LiveKit agent tool registry（即時撥號寫記憶 tool）
3. **記憶系統**：MEMORY_DIAGNOSIS Route A-D

---

## 卡住 / 未解

- 排設計靈魂尚未定義（Adam 會後續提供）
- Firebase Function jobWorker 修改 build 完但未 deploy（已改用刪 Function 替代，無需 deploy）

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
| Bridge VM | `gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b` |
| jobWorker 恢復 | 取消注解 `MOUMOU_LIVE/functions/src/index.ts` 最後一行 → build → deploy |
| OpenClaw 重啟 | `launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-04-30 · 築*
