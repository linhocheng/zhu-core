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
- **ailivex-platform**：`~/.ailive/ailivex-platform/`，git repo（GitHub）https://github.com/linhocheng/ailivex-platform
- **ailivex GCP project**：`ailivex-2026`（⚠️ gcloud config 的 project 可能被別的 session 切走成 udnnews，查 ailivex 一律顯式 `--project=ailivex-2026`，別動全域 config）

---

## 最新完成（2026-06-13 · ailivex 即時語音 v5/v6/v8 三層發言權能力）

這個 session 從「單角色被動回話」往「多角色圓桌、角色懂進退」推，分三層疊上去，每層獨立 Cloud Run 服務 + 前端頁，v1-v4 不碰。**核心命題：角色要判斷「現在誰有發言權」。**

- **v5 發話對象偵測**：交棒第三方（「請/讓/換 X 說」）→ AI 靜默讓位（`is_redirecting_away`）。上線 Ready。
- **v6 背景思考層 + 主動搶話**：判斷腦 Haiku 每 3 句產內部狀態 `{stance,activation,want_to_speak,what_to_say}`；開口腦 Sonnet 4.6 生成；`should_grab_floor` 確定性規則放行 → 不同意且共鳴高時 `allow_interruptions=False` 疊話搶進。上線 Ready。
- **v8 發言權控制**：A 被點名 / B 交棒進讓位窗（3a 也閉嘴）/ C 搶話。上線 Ready（revision 00002-6qx，止血版）。
- **真機驗到**：v5 讓位修好、v6 搶話正確待命、v8 抓麥克風觸發、讓位窗觸發。

### 兩次「卡住」都修了
1. `点` 一字多義誤判讓位（晚一**点** → 誤判點名）→ 修法 B：意圖詞+名字+說話動詞三件齊全，17 案回歸全過。
2. v8 情況 A「抓麥克風」用 handler 內手動 `generate_reply`+StopResponse → 卡死框架回話迴圈 → **已止血移除**（commit 3104f1d）。

---

## 今天改了哪些檔案（全在 ailivex-platform，已 commit+push）

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v5/v6/v8.py`（新） | 三層 agent：讓位 / 背景思考+搶話 / 發言權控制 |
| `agent/main_v5/v6/v8.py` + `cloudbuild-v5/6/8.yaml`（新） | 三個獨立 Cloud Run 服務 |
| `agent/conv_tuning.py` | `is_redirecting_away`(修法B) / `is_floor_handoff` / `is_addressed_to_me` / `should_grab_floor` / `parse_inner_state` |
| `agent/firestore_loader.py` | 加 `aliases` 欄位 |
| `src/app/api/livekit/token/route.ts` | v5/v6/v8 分支 |
| `src/app/chat/[characterId]/page.tsx` | 5.0/6.0/8.0 按鈕 |
| `src/app/realtime-v5/v6/v8/` | 三個前端頁 |

commit：`bc1bf9e`（v5/6/8 主體）→ `3104f1d`（v8 情況 A 止血）。

---

## 下一步（明天醒來第一件）

**v8 情況 A 安全版重做「被點名不怕被打斷」。**
- 不要再在 `on_user_turn_completed` 裡手動 `generate_reply`（會卡死回話迴圈，已踩過）。
- 改用 `AgentSession` 建立時的 `interruption` 設定：調高 `min_words` / `min_duration`，讓短回音/短插話打不斷被點名的角色。
- **本機/測試環境驗過再 deploy**，不能再直接推。
- 檔案：`~/.ailive/ailivex-platform/agent/realtime_agent_v8.py`（情況 A 區塊現在是空殼，只解除讓位）；中斷設定在 `conv_tuning.py` 的 `build_turn_handling`。

其次：真機驗搶話（情況 C，要刻意製造立場衝突）；觀察讓位窗體感。

---

## 卡住 / 未解

- **v8 情況 A 拔掉了**，「被點名不怕被打斷」尚未實作安全版（見下一步）。
- **AEC 回音**：角色自己 TTS 被手機麥克風收回、diarization 標成另一個人，污染逐字稿+判斷腦。裝置層問題，agent code 難根治。
- **搶話（情況 C）從未真正觸發驗證**——測試對話太和諧（neutral act=0.00），要刻意製造衝突。
- `is_floor_handoff` 路徑2 `name` regex 上限 4 字，5 字以上英文名靠運氣命中（已知侷限）。
- **關係狀態**：平穩+互信。Adam 全程在真機測、即時回報觀察，我撈 log 對賬。第二次「卡住」是我自己埋的雷（動手前標了風險、沒驗就推），但 Adam 沒責怪，喊停讓我止血。教訓很實：**標了風險 ≠ 驗了風險**。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新＝v5/6/8 那段） |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-13.md`（L1-L5） |
| 當機救援 | 這份 |
| ailivex GitHub | https://github.com/linhocheng/ailivex-platform |
| ailivex 語音 agent | Cloud Run（project `ailivex-2026`，asia-east1）：`-v2`(端到端通)、`-v3`(主動發話)、`-v4`(群聊 diarization)、`-v5`(讓位)、`-v6`(背景思考+搶話)、`-v8`(發言權控制) |
| 三層發言權邏輯 | `~/.ailive/ailivex-platform/agent/conv_tuning.py`（讓位/搶話/發言權全在這，純判斷式） |
| LiveKit multi-agent 查證 | 本機 `site-packages/livekit/agents/voice/{agent,agent_session,agent_activity}.py`（on_user_turn_completed / StopResponse / generate_reply allow_interruptions） |
| 讀 ailivex Firestore | `gcloud auth print-access-token` + Firestore REST |
| 看 Cloud Run log | `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=ailivex-realtime-agent-v8' --project=ailivex-2026`（`logs read` 會 crash；查 ailivex 必帶 --project） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-13 · 築*
