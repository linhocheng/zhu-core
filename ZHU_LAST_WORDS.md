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
- **ailivex GCP project**：`ailivex-2026`（⚠️ gcloud config 的 project 會被別的 session 切走成 udnnews，查 ailivex 一律顯式 `--project=ailivex-2026`，別動全域 config）

---

## 最新完成（2026-06-14 · ailivex 反討好 + 全局Prompt後台 + v9 LLM floor-gate）

核心命題：**一個焦點 AI 對多個真人**（不是多 AI 群聊）。今天三條線：

1. **反討好（v8.1）**：底模 RLHF 的討好天性，分兩刀壓。
   - 開口腦：全局天條【比討好更重要的事】緊貼 soul_text（定目標：在乎對方長期不是此刻舒服；風格讓給角色個性，溫柔角色不變杠精）。**真機驗證成功**——張立會頂回「刷流量比做好重要」的價值觀挑釁，Adam：「很漂亮」。
   - 判斷腦（Haiku）：reframe 克服 default 中性。但小模型討好頑固，搶話還沒驗到觸發。
2. **全局 Prompt 後台可改（v8.1）**：4 結點抽出 Firestore `config/globalPrompts`，admin `/admin/global-prompts` 改完下一通生效不用 deploy。fallback 寫死預設不裸奔。
3. **v9 LLM floor-gate**：發言權判斷（叫我/交棒/彼此聊）regex → Haiku。分層守延遲（一對一快路徑不喚 LLM；多人才喚）+ fallback 絕不凍。天然解星雲卡住的兩個 bug（名字變體 + 邀請句型誤判）。

### 星雲卡住的診斷（重要）
Adam 用星雲+達賴兩個 AI 測「焦點 AI 在多人房」。星雲卡住＝兩 bug：①「星雲大師」認不得「星云法师」（簡繁+稱謂變體）②「我很期待听你说」被 regex 誤判成交棒第三方。根因：regex 處理開放式自然語言是錯工具 → v9 升 LLM。

---

## 今天改了哪些檔案（全在 ailivex-platform，已 commit+push）

| 檔案 | 改了什麼 |
|---|---|
| `agent/firestore_loader.py` | 反討好開口腦天條 + `DEFAULT_GLOBAL_PROMPTS` + `load_global_prompts()`（4 結點 Firestore 可改） |
| `agent/realtime_agent_v9.py`（新） | v9 LLM floor-gate：`AilivexAgentV9` + `_floor_gate_llm`（Haiku 2s timeout）+ 多人 latch |
| `agent/realtime_agent_v8.py` | 判斷腦反討好 reframe |
| `agent/main_v9.py` + `cloudbuild-v9.yaml`（新） | v9 獨立服務 |
| `src/app/admin/global-prompts/`（新） | 全局 Prompt 後台頁 |
| `src/app/api/admin/global-prompts/route.ts`（新） | GET/PUT |
| `src/app/admin/layout.tsx` | nav 加「全局 Prompt」 |
| `src/app/realtime-v9/`（新）+ `token/route.ts` + chat 頁 | v9 前端入口 + 9.0 按鈕 |

commit：`3eedb3f`（反討好+全局Prompt）→ `dee4560`（v9 floor-gate）。

---

## 下一步（明天醒來第一件）

**真機驗 v9。** 重現星雲+達賴圓桌（v9 按鈕），確認 LLM gate 解掉卡住：
- 達賴邀星雲講 → log 應出 `v9 gate[LLM]：被點名 → 正常回話`（星雲不再卡死）
- 人跟人彼此聊、沒叫星雲 → `非對我（多人彼此聊）→ 靜默`（不插嘴）
- 觀察多人 turn 的延遲體感（多了 Haiku call）；一對一有沒有正確走快路徑不喚 LLM

撈 log：`gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=ailivex-realtime-agent-v9' --project=ailivex-2026 --freshness=10m`

若 v9 穩 → 設為主線，舊版收掉。

---

## 卡住 / 未解

- **v9 真機未驗**（最重要，見上）。
- **判斷腦搶話沒驗到觸發**：Haiku default 中性比開口腦頑固，即使 reframe 踩價值觀還是 act=0.00。要刻意製造「AI 旁聽 + 有人講錯話」場景。
- **v8 情況 A（被點名不怕被打斷）仍空殼**：安全版（session 中斷門檻 min_words/min_duration）沒做，要本機驗過再上（別再 handler 手動 generate_reply，會凍）。
- **AEC 回音**：角色自己 TTS 被麥克風收回標成另一人，裝置層，難根治。
- **關係狀態**：暢快+互信。今天節奏好——Adam 提概念（反討好）、我給架構、他拍板、我蓋、真機驗、他喊「很漂亮」。中間他一句「nonono 焦點在一個 AI 對多真人」精準把我從離題的架構分析拉回。誠實面：我一開始把「兩個 AI」腦補成「多 AI 群聊需求」，框錯了。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新＝v9 那段） |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-14.md`（L1-L4） |
| 昨日踩雷 | `LESSONS_2026-06-13.md`（generate_reply-in-handler 卡死等） |
| 當機救援 | 這份 |
| ailivex GitHub | https://github.com/linhocheng/ailivex-platform |
| ailivex 語音 agent | Cloud Run（project `ailivex-2026`，asia-east1）：v2-v9。**v9 = 最新主力**（LLM floor-gate）。v8=發言權控制、v6=背景思考+搶話、v5=讓位、v4=群聊 diarization |
| 發言權/搶話/反討好邏輯 | `agent/conv_tuning.py`（regex 判斷式）+ `agent/realtime_agent_v9.py`（LLM gate）+ `firestore_loader.py build_system_prompt`（反討好天條 + 全局 Prompt） |
| 全局 Prompt 後台 | `ailivex-platform.vercel.app/admin/global-prompts`（4 結點即時調，不用 deploy） |
| 看 Cloud Run log | `gcloud logging read ... --project=ailivex-2026`（`logs read` 會 crash；查 ailivex 必帶 --project） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-14 · 築*
