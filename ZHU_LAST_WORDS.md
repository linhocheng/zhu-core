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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING；跑 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- ⚠️ **ailivex-platform 無 git repo**：所有 code 改動只在本機 + 已部署，零版控。動它前先知道沒 rollback。

---

## 最新完成（2026-06-12 · ailivex 即時語音 v2 記憶連貫大修）

- **掛斷記憶收尾釘死**：根因＝`shutdown_process_timeout` 預設 10s 把掛斷後的 LLM 提煉 SIGKILL → 拉到 90s（`main_v2.py`）。finalize 重構成 idempotent（Lock+flag），順序＝先秒存逐字稿（第一行就 log 證實有跑）→ 再並行萃 lastSession + 提煉記憶。記憶唯一保證路徑＝`add_shutdown_callback`。
- **砍掉沒通的掛斷 handshake**：原本前端送 end_call、等 agent 回 finalize_done——data channel 根本沒通，害「整理中」卡 30s。改成前端「整理中」1.8s 短轉場就斷，記憶交 server 端 shutdown callback 保證。
- **把 ailive 的「上次對話」設計搬進 v2**：新增【上次對話】快照（summary/氣氛/未完話題，`extract_session_summary` 走 bridge）+【上次聊到最後·原話】（注入逐字稿尾，連貫關鍵）+【當前時間】遠近規則 +【時間感知】距上次多久。
- **「有記憶但不連貫」修正**：根因＝greeting 念摘要不接結尾 + lastSession 寫入 ~30s 的回播時間差。解＝注入原話結尾（秒存最快）+ greeting/區塊明確「**最新未完第一優先、不扯回舊話題**」+ finalize 並行（寫入 ~30s→~15s）。Adam 實測：等幾秒再撥就穩接。
- admin/characters 電腦版破版修正（每列兩段排版）。
- 現役：Cloud Run `ailivex-realtime-agent-v2-00016-vdb`、前端 ailivex-platform.vercel.app。

---

## 今天改了哪些檔案（2026-06-12，全在 ailivex-platform，無 git）

| 檔案 | 改了什麼 |
|---|---|
| `agent/main_v2.py` | `shutdown_process_timeout=90`（掛斷記憶被砍的根因修復） |
| `agent/realtime_agent_v2.py` | finalize 重構（idempotent + transcript 先存 + lastSession/記憶並行）+ greeting 改「最新未完優先」 |
| `agent/firestore_loader.py` | +extract_session_summary/build_last_session_block/update_last_session/should_inject_gap/format_gap；ConversationContext +last_session；build_system_prompt 注入上次對話+原話結尾+當前時間+時間感知；save_conversation +last_session 參數 |
| `src/app/realtime-v2/[characterId]/page.tsx` | 掛斷改「整理中」1.8s 短轉場（砍 end_call handshake） |
| `src/app/admin/characters/page.tsx` | 電腦版破版修正（兩段排版） |

---

## 下一步

1. **v3（群聊 + 主動插話/內心戲）寫完整計劃書** —— Adam 拍板「進 v3，先想完整套路+計劃再動手，任務交給築排」。
   - 築建議序列：①先 1:1 最小驗「主動廣播機制 `session.say` 不請自來播一句」（此機制至今從沒被證實過，最便宜去風險）→ ②群聊多人輸入（per-participant STT + 協調器，官方 recipe label-then-merge，不升版）→ ③內心戲評分（**內心戲＝各角色自己的 soul**，imThreshold/interruptThreshold 1-5 per 角色）。
   - 打法同 v1→v2：獨立 agent_name `ailivex-realtime-v3` + 獨立 Cloud Run + 獨立前端，絕不碰 v2。
   - 計劃書底稿：`~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md`（P2/P3 已有，補 v3 scaffold + 先驗機制那步）。
2. **等 Adam 答兩題**（睡前問的）：①v3 順序 OK 嗎（先驗機制 vs 先攻群聊）②「現在可測群聊」是否有多帳號/裝置同進一房。
3. **ailivex-platform git init + push**（每次都掛的斷點）。

---

## 卡住 / 未解

- ailivex-platform 無 git repo（零版控，最該補）。
- 秒回播（<~5s）連原話結尾都還沒存完，仍可能差一拍。根治＝通話中即時滾動存逐字稿（未做）。
- 【最近的事】(ailive platform_insights 事件線) 沒搬——ailivex 無反思管道，硬搬會重複；要做需新 index（待 Adam 決定）。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-12.md` |
| 當機救援 | 這份 |
| ailivex 語音記憶旋鈕 | `reference_minimax_realtime_voice_quality.md`、`reference_minimax_streaming_dup_audio.md` |
| ailivex 語音 v3 計劃 | `~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md` |
| ailive 記憶設計（搬移來源）| `ailive-platform/src/lib/{episodic-memory,session-summary,last-session-block}.ts`、`agent/firestore_loader.py` |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`(v1) / `-v2`(v2，現役 00016-vdb)，asia-east1 |
| 讀 ailivex Firestore 看現場 | `gcloud auth print-access-token` + Firestore REST（不碰 SA 密鑰） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-12 · 築*
