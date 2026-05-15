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

## 最新完成（2026-05-15）

- useChat hook 三階段收工：Phase 2（/chat/[id] 接 hook）+ Phase 3（/client/[id] ChatScreen 接 hook）
- ChatScreen 補齊 system_event 圖卡、activeJobs status bar、圖片上傳
- 確認排工全鏈路通：commission → Firestore job → polling → system_event 卡片顯示 ✅
- 建 skill_session_wrap_up.md：收尾九步 checklist 掛觸發詞，解決靠記憶跳步問題
- 刻 LESSONS_20260515（localStorage key migration、收尾流程缺口、Vercel logs 空）

## 技術債待修

- localStorage key migration 未修：`chat_conv_${charId}` → `conv-${charId}`
  → useChat.ts init 加搬移邏輯，一行解決，舊 session 不再遺失

## 最新完成（2026-05-14 第二局，保留參考）

- ailive 費用追蹤三條路徑全通：dialogue / voice-stream / realtime agent（掛斷後寫入）
- zhu-mid 第七張卡 ailive-cost-card 上線（MAX 吃到飽 vs API Key 標示、角色排行）
- 所有 LLM call site 加 purpose 標籤（dialogue / voice-stream / task-run / sleep 等 15 節點）
- voice-stream TTS trackTTSCost 追蹤
- LiveKit realtime agent metrics_collected → 掛斷時寫 zhu_vitals_cost（LLM + TTS 各一筆）
- sync-services cron（ailive-platform，每 6h）更新 Upstash Redis 用量
- Firestore composite index (project + timestamp on zhu_vitals_cost) READY
- 費用全改 NT$ 顯示（fmtCost 統一換算，1 USD = 32 NTD）
- zhu-mid + ailive-platform + realtime-agent 三個全 deploy
- realtime agent 升到 revision 00035-x68

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/lib/cost-tracker.ts` | 雙寫策略：platform_characters + zhu_vitals_cost，加 trackTTSCost |
| `ailive-platform/src/app/api/dialogue/route.ts` | purpose='dialogue' / 'dialogue-haiku' |
| `ailive-platform/src/app/api/voice-stream/route.ts` | purpose='voice-stream' + trackTTSCost |
| `ailive-platform/src/app/api/task-run/route.ts` | purpose='task-run/self-eval/post' |
| `ailive-platform/src/app/api/sleep/route.ts` | purpose='sleep/awareness/proposal/fix' |
| `ailive-platform/src/app/api/runner/route.ts` | purpose='runner' |
| `ailive-platform/src/app/api/soul-enhance/route.ts` | purpose='soul-refine/soul-core' |
| `ailive-platform/src/app/api/strategist-review/route.ts` | purpose='strategist-review' |
| `ailive-platform/src/app/api/strategist-guide/route.ts` | purpose='strategist-guide' |
| `ailive-platform/src/app/api/sync-services/route.ts` | 新增：Upstash + TTS 用量同步 cron |
| `ailive-platform/vercel.json` | 加 sync-services cron (每 6h) |
| `ailive-platform/agent/realtime_agent.py` | metrics_collected + on_disconnected 費用寫入 |
| `zhu-mid-src/src/lib/zhu-vitals/queries.ts` | getAiliveCost 函數 + AiliveCostSummary 型別 |
| `zhu-mid-src/src/lib/zhu-vitals/schema.ts` | CostRecord 加 type/character_id/tts_* 欄位 |
| `zhu-mid-src/src/lib/zhu-vitals/format.ts` | fmtCost 改 NT$ 輸出 |
| `zhu-mid-src/src/components/vitals/ailive-cost-card.tsx` | 新增第七張卡 |
| `zhu-mid-src/src/components/vitals/auto-refresh.tsx` | 新增 60s AutoRefresh |
| `zhu-mid-src/src/app/dashboard/overview/page.tsx` | 加 AiliveCostCard + AutoRefresh |

---

## 下一步

1. **觀察**：ailive-cost-card 角色排行正常顯示（已有真實資料）
2. **STT 費用（deferred）**：Deepgram 用量小，暫不追蹤
3. 無其他緊急事項

---

## 卡住 / 未解

- ElevenLabs API key 缺 user_read 權限，無法從 API 拿用量（只能從 zhu_vitals_cost 估算）
- MiniMax 無 balance endpoint，同上

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
| strategy HTML 風格 | `~/.ailive/ailive-platform/src/lib/strategy-html/philosophies/`（eastern-blank / swiss-grid / dark-premium） |
| strategy-html-worker | Cloud Run `zhu-cloud-2026/strategy-html-worker` revision 00008-p7z |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.3.0。*
*2026-05-14 · 築*
