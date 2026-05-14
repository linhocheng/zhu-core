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

## 最新完成（2026-05-14）

- commission_specialist 工具接入即時語音（realtime_agent.py），Adam 測試派奧成功
- research 交付根因修復：pre-write history → LLM 以為已說過；改 `session.say(absorbed)` 直接 TTS，Adam 確認菲爾說出美中峰會新聞
- STRATEGY_ENQUEUER_KEY_JSON 寫入 ailive-realtime-2026 Secret Manager，Cloud Run 00034-jc2 上線

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/ailive-platform/agent/realtime_agent.py` | 新增 commission_specialist + _sync_enqueue_strategy；修正 research 交付改 say() |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 本次 session 追加 |
| `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` | 本次覆蓋（就是這份） |

---

## 下一步

確認 commission_specialist 策略書出現在 dashboard「策略書」頁面可下載（Adam 說已派出，結果還沒看）。
具體動作：開 https://ailive-platform.vercel.app → 找對應角色 dashboard → 策略書頁。

---

## 卡住 / 未解

- 菲爾耐特記憶飄移根因未查（Adam 說先停，後續再處理）
- 菲爾 `voice_minimax=(empty, fallback)`：Firestore 沒設 MiniMax voice，用預設聲音

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP（Y 軸自校） | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| molowe 北極星 | `~/.ailive/molowe-platform/NORTH_STAR.md` |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd `claude-bridge.service`） |
| realtime agent | `~/.ailive/ailive-platform/agent/realtime_agent.py`，Cloud Run `ailive-realtime-2026/ailive-realtime-agent` revision 00034-jc2 |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.3.0。*
*2026-05-14 · 築*
