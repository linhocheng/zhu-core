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

## 最新完成（2026-06-20）

- 設計並全端實作 ailiveX 腳本草稿 → 角色音檔 pipeline（C 方案：草稿先存、確認後燒 TTS）
- 修 VALID_CAPABILITIES 漏 script_draft bug（tag 被過濾，任務永不建）
- 強化 TOOL_INSTRUCTIONS 防 LLM 幻覺（「不夾 tag = 謊話」）
- dialogue/route.ts 自動注入 voiceIdMinimax 到 script_draft params
- 草稿卡永遠可編修＋重試（移除 submitted 狀態鎖定）
- 修 media-worker MiniMax 端點錯誤：`api.minimax.chat`（大陸）→ `api.minimax.io`（國際），model 改 `speech-02-turbo`
- 音檔生成端到端全通
- commit `v14.0.0` pushed（19 files, 1816 insertions）—— 含 v14 即時語音 agent 骨架

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/lib/collections.ts` | TaskCapability + script_draft；TaskStatus + draft/submitted；TaskDoc + scriptText/voiceId/audioUrl；VOICE_VERSIONS + v14 |
| `src/lib/task-dispatcher.ts` | script_draft 寫 scriptText + voiceId；dispatch messages 補全 |
| `src/lib/tool-tags.ts` | VALID_CAPABILITIES 補 script_draft；TOOL_INSTRUCTIONS 防幻覺強化 |
| `src/app/api/dialogue/route.ts` | dispatch script_draft 時自動注入 voiceIdMinimax |
| `src/app/api/gallery/route.ts` | type filter 加 script_draft；回傳 audioUrl/scriptText/voiceId |
| `src/app/gallery/page.tsx` | 媒體庫改版：草稿卡＋音檔卡＋條件式輪詢 |
| `src/app/api/tasks/[id]/generate-audio/route.ts` | 新增：草稿確認後送 media-worker |
| `src/app/api/tasks/callback/route.ts` | audio 完成後寫 audioUrl |
| `agent/firestore_loader.py` | dispatch_script_draft / load_pending_task_notifications / 注入任務通知 |
| `agent/realtime_agent_v13.py` | script_draft 工具 + audio voiceId 自注入 |
| `agent/main_v14.py` + `realtime_agent_v14.py` + `cloudbuild-v14.yaml` | v14 新版即時語音骨架 |
| `src/app/realtime-v14/[characterId]/page.tsx` | v14 前端頁 |
| `src/app/admin/characters/page.tsx` | script_draft 勾選能力 |
| `src/app/chat/[characterId]/page.tsx` | 版本面板加 v14 連結 |
| `src/app/_components/ui.tsx` | audio icon |

---

## 下一步

**腳本草稿→音檔全通，下一個功能看 Adam 決定**

- v14 Cloud Run 已上線：`https://ailivex-realtime-agent-v14-6ybo3vltfq-de.a.run.app` ✅
- 音檔生成已驗通（MiniMax `.io` 國際版）✅
- 可選：接 HeyGen（音檔 → 口型同步影片）

**次線：驗真實音檔生成**

確認 Vercel env `MEDIA_WORKER_KEY_AILIVEX` 有效，打一次 `/api/tasks/[id]/generate-audio`，等 webhook 回來，gallery 顯示音檔播放卡。

---

## 卡住 / 未解

- 一批 ad-hoc debug scripts（`scripts/check-*.mjs` 等）untracked，留著沒清

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
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailiveX 平台 | `~/.ailive/ailivex-platform/`（Next.js + Python agent） |
| ailiveX prod | https://ailivex-platform.vercel.app |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-20 · 築*
