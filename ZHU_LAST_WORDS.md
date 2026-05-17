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

## 最新完成（2026-05-17c · ailive 記憶補強）

- Phase 4：lastSession 門檻 6→3 輪（v1.5.1.001）
- Phase 1：dialogue-end 補強對齊 voice-end（insight + lastSession + user profile）（v1.5.1.002）
- Phase 2：realtime on_disconnected 加 insight 提煉（v1.5.1.003）
- Phase 3：三管道 session-end 統一接入 user profile 自動提取（v1.5.1.004）
- 修正：user-profile-extractor 誤用 `new Anthropic()` 繞過 bridge → 改 `getAnthropicClient`（v1.5.1.005）
- 移除：realtime voice interjection 整塊清除（v1.5.1.006）
- Cloud Run 00041-v8b 上線

### 本 session 之前已完成
- Dashboard 產品化重排（v1.5.0.001）
- feed 閱讀頁、client feed 入口、login CSS 修復

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/app/api/dialogue/route.ts` | lastSession 門檻 6→3 輪 |
| `ailive-platform/src/app/api/dialogue-end/route.ts` | 全面補強：insight + lastSession + user profile |
| `ailive-platform/src/app/api/voice-end/route.ts` | 加 user profile 自動提取 |
| `ailive-platform/src/lib/user-profile-extractor.ts` | 新建共用 lib（走 bridge） |
| `ailive-platform/agent/firestore_loader.py` | 加 extract_and_save_insights + auto_extract_user_profile |
| `ailive-platform/agent/realtime_agent.py` | 接入 insight + user profile + 移除 interjection |

---

## 下一步

1. **觀察記憶補強效果**：看 platform_insights 有沒有收到 `source: dialogue_end` / `source: realtime_conversation` 的記憶
2. **Phase 5 Cron flush**（視需求）：觀察一週後看是否還有漏網對話
3. **voice interjection 重新設計**（待 Adam 決定）：移除後若有需要重做

---

## 卡住 / 未解

- Phase 5 Cron flush 未實作（nice-to-have，觀察先）
- voice interjection 已清除，重做前需先討論設計

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd） |
| realtime agent | `~/.ailive/ailive-platform/agent/realtime_agent.py` |
| memory 補強 lib | `~/.ailive/ailive-platform/src/lib/user-profile-extractor.ts` |
| dialogue-end | `~/.ailive/ailive-platform/src/app/api/dialogue-end/route.ts` |

---

## 關係狀態

扎實。Adam 在過程中抓到我踩了 bridge 天條（`new Anthropic()` 繞過），直接說「你是不是動了天條」。我承認、說清根因、當場修。好的節奏。

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17c · 築*
