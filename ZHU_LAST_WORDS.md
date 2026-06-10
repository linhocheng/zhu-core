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
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（直連 host `https://bridge-direct.soul-polaroid.work`，VM IP 35.236.185.222）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-10 · ailivex 語音）

- 修好 ailivex 即時語音「角色說兩次」：根因是改 MiniMax TTS 串流降延遲後，串流最後一塊 `data.status==2` 把整句完整音訊再送一次 → 逐塊播完又整句重播
- 修法兩層確定性：payload 加 `stream_options.exclude_aggregated_audio:true` + 迴圈硬擋 `status==2`
- 本機探針 import 真實協定實打 MiniMax 驗證（不撥真電話就證實只播一次）
- 部署 Cloud Run `ailivex-realtime-agent` revision `00010-xpn`（asia-east1，舊 revision 自動清，無殭屍）
- 寫了給大家參考的踩雷附件 + reference memory
- 先前往前端 livekit 雙 AudioContext 查四輪沒中 → 教訓：「改 X 之後壞」先 diff `.bak` 前後版，別先理論推

---

## 今天改了哪些檔案（2026-06-10）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/agent/minimax_tts.py` | `_run()` 串流加 `exclude_aggregated_audio` + 硬擋 `status==2` |
| `ailivex-platform/.gcloudignore` | 新建（非 git repo，gcloud 不自動套 .gitignore，會夾帶 node_modules + `.env*`） |
| `zhu-core/docs/LESSONS/語音延遲優化_MiniMax串流TTS.md` | 踩雷附件，給大家參考 |
| `memory/reference_minimax_streaming_dup_audio.md` | 新建 + MEMORY.md 索引 |
| `memory/project_ailivex_platform.md` | 06-08 語音斷點標記已解 |

---

## 下一步

1. **最優先**：Adam（或測試者）撥一通 ailivex 語音，確認**每句只說一次** + 首音延遲改善。若仍重複立刻回查（本機 TTS 層已證不重複，機率低）
2. **ailivex 仍無 git repo**：`agent/minimax_tts.py` 改動只在本機 + 已部署，沒進版控 → git init + push GitHub 仍待辦
3. ailivex 文件鏈 e2e（dialogue 觸發路徑）仍只手動 curl 過，未跑完整對話觸發

---

## 卡住 / 未解

- ailivex 語音真實聽感未經人耳驗（需 Adam 撥號，築無法自撥：要 browser+mic）
- ailivex-platform 無 git repo（改動無版控）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 踩雷心法附件 | `~/.ailive/zhu-core/docs/LESSONS/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 平台 | `~/.ailive/ailivex-platform/`（Vercel，agent 在 `agent/`） |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`（asia-east1） |
| MACS 平台 | `~/.ailive/macs-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-10 · 築*
