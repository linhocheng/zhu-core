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
- ⚠️ **本機 AIR 的 ailivex 磁碟可能落後 prod**（無 git）：動 ailivex 前先確認對齊已部署版

---

## 最新完成（2026-06-11 · ailivex 即時語音 2.0）

- 立「即時語音 2.0」獨立平行服務 `ailivex-realtime-agent-v2`（不動現役 1:1 v1），裡面放實驗：Sonnet 4.6 + 主動插話(3a) + HD 模型 + 後台可調
- 派 3 研究 agent 寫計劃書（P2 群聊 / P3 Inner Thoughts），P2 有官方 recipe 不必全手搖，P3 主旋鈕是 imThreshold
- 後台「對話手感」面板上線：per 角色 convSettings（接話速度/被打斷/主動/搶話/溫度），即時生效，conv_tuning.py 映射 turn_handling
- admin 能直接對話/語音測角色
- 連環修品質：深度淺=換 Sonnet 4.6；很演=文字在演(temp→0.3 + 平實口氣指引)；沒頭沒尾=LLM分段+WS把\n當句尾切空白片段(已修)；模型試 speech-2.6-hd

---

## 今天改了哪些檔案（2026-06-11，全在 ailivex-platform，無 git）

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v2.py` | 新 v2 入口（copy v1）+ 3a 主動插話 + Sonnet 4.6 + temp 可調 + 平實/一口氣指引 + 2.6-hd |
| `agent/main_v2.py` | 新，agent_name=ailivex-realtime-v2 |
| `agent/conv_tuning.py` | 新，1-5 旋鈕→AgentSession turn_handling + temperature |
| `agent/minimax_tts.py` | _SENTENCE_END 去 \n + 折疊空白不送空片段（沒頭沒尾修正，v1/v2 共用） |
| `agent/realtime_agent.py` | 套 conv turn_handling（預設=現行，安全） |
| `agent/firestore_loader.py` | char 加 conv_settings |
| `agent/cloudbuild-v2.yaml` | 新，部署 v2 服務 |
| `src/app/realtime-v2/[id]/page.tsx` | 新，v2 通話頁 |
| `src/app/admin/characters/page.tsx` | ConvPanel 面板 + 對話/語音按鈕 |
| `src/app/api/admin/characters/*` + `src/lib/collections.ts` | convSettings 型別 + sanitize |
| `src/app/api/livekit/token/route.ts` | v2 dispatch |

---

## 下一步

1. **Adam 撥 v2 2.6-hd 復測**：①更自然 ②延遲 OK ③沒頭沒尾消了沒。HD 模型名若被拒會撥才知（會 fallback REST 但同 model 也會失敗→注意沒聲音）
2. **ailivex git init + push GitHub**（最該補，所有改動無版控）
3. P2 群聊 + P3-3b 還沒做（只 3a spike）；計劃書在 `ailivex-platform/docs/PLAN_voice_group_and_proactive.md`
4. temperature 甜區 + conv 旋鈕值待 Adam 後台自調定案

---

## 卡住 / 未解

- ailivex-platform **無 git repo**（大量改動只在本機+已部署）
- v2 2.6-hd 真機聽感未驗（自然度/延遲/沒頭沒尾）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 踩雷心法附件 | `~/.ailive/zhu-core/docs/LESSONS/` |
| 當機救援 | 這份 |
| ailivex 語音記憶 | `reference_minimax_realtime_voice_quality.md`、`reference_minimax_streaming_dup_audio.md` |
| ailivex 語音 2.0 計劃 | `~/.ailive/ailivex-platform/docs/PLAN_voice_group_and_proactive.md` |
| ailivex 語音 agent | Cloud Run `ailivex-realtime-agent`(v1) / `ailivex-realtime-agent-v2`(v2)，asia-east1 |
| MACS 平台 | `~/.ailive/macs-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-11 · 築*
