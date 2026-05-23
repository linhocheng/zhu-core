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

## 最新完成（2026-05-23c）

- Soniox STT 換裝：requirements.txt + realtime_agent.py + Secret Manager + Cloud Run 00063-tgh，中英文雙語 ✅
- `_voice_buffer.clear()`：try/finally 包整個 voice-id body，識別完立刻釋放音頻記憶體
- `on_disconnected` 改 `threading.Thread(daemon=False)`：save_conversation 22s 內完成，主資料不丟
- 踩坑：asyncio.ensure_future + to_thread 被 executor shutdown 打穿；threading.Thread 擋不住 SIGUSR1

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/agent/requirements.txt` | deepgram→soniox==1.5.1 |
| `ailive-platform/agent/realtime_agent.py` | Soniox STT init + voice_buffer.clear() + on_disconnected threading.Thread |
| GCP Secret Manager | SONIOX_API_KEY version 1 新增 |

---

## 下一步

**ailive 即時語音 — cleanup 根本修法**：
```
問題：insights / promise-reflection / user-profile / cost 被 SIGUSR1 kill（在 ~25s timeout 外）
修法：on_disconnected 只做一件事 → enqueue Cloud Tasks job
     job 裡跑：extract_and_save_insights + reflect_and_mark_fulfilled
               + auto_extract_user_profile + cost write
步驟：
  1. 建 Cloud Tasks queue（ailive-cleanup 或複用既有）
  2. 建 Cloud Run job endpoint（或 Vercel route）接收 cleanup payload
  3. on_disconnected 只 enqueue（< 1s），不做 LLM 呼叫
  4. deploy + 測試：掛斷後看 job log insights/promise/profile 全通
```

**ailive 長通話觀察**：
- Silero VAD 偶發 `inference is slower than realtime` → 觀察是否是常態還是 cold spike
- 真的常態 → 考慮換 VAD 或提升 Cloud Run CPU tier

---

## 卡住 / 未解

- insights / promise-reflection / user-profile / cost 仍被 SIGUSR1 kill（cleanup Cloud Tasks 未做）
- Silero VAD CPU spike 偶發（需長期觀察）
- ANEWS：Round 3 壓測 + Vercel 300s source worker 搬 Cloud Run（上個 session 遺留）

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
| ailive agent | `~/.ailive/ailive-platform/agent/realtime_agent.py` |
| Cloud Run stable | revision `00063-tgh`（Soniox + pure numpy） |
| Cloud Run rollback | revision `00059-x6n`（deepgram + pure numpy） |
| LESSONS 今日 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260523c.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-23c · 築*
