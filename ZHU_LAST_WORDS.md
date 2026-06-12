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
- **ailivex-platform**：`~/.ailive/ailivex-platform/`，git repo（GitHub public）https://github.com/linhocheng/ailivex-platform

---

## 另一條線（AIR · ailive-platform · Vivi 知識庫/RAG · 2026-06-12 已完成驗證）

> 這條跟下面的 ailivex v5 是不同 session、不同 repo。已收乾淨，非當機關鍵，留指標即可。

- **修好 Vivi 知識庫讀不到法規**：根因是窄域語義坍縮（product 文件 0.9+ 擠掉法規 0.65-0.78、flat top-N 切掉），非上傳壞。修法：knowledge-search 參考層 general 永遠帶入兩條路徑 + 每產品上限 3。已 deploy + commit（ailive-platform 6d4b5ef）。
- **真實對話驗收通過**：撥 Vivi 兩輪，違規/得宣稱都逐字引用法規 + query_knowledge_base 觸發。
- **前沿學習文件**：`docs/FRONTIER_RAG_MCP_SKILLS_MEMORY_2026-06-12.md`（RAG/MCP/Skills/記憶 2025-2026 + ailive 對照 + 階梯）。memory：`reference_frontier_rag_mcp_skills_memory.md`。
- **接棒（rerank 開專案）**：見 WORKLOG 2026-06-12（四）待執行——選型 BGE vs Voyage + eval harness + 熱路徑落點，先寫計劃不動手。rerank 上線可拆今天的硬規則。
- 細節：`docs/LESSONS/LESSONS_2026-06-12_vivi-rag.md`、WORKLOG 該日兩條。

---

## 最新進度（2026-06-12 晚 · ailivex v5 多角色語音圓桌：建了、撞牆、被 Adam 清掉）

### 這個 session 發生什麼
- 從 v4（單機群聊 diarization＝多人對一角色）轉向 **v5＝一個人對多角色語音圓桌**：主持人開場 → 點名 → 棒子在角色間接力傳。
- **建出來了，機制 solo 路徑驗通**（一房多 agent + 導演 update_agent 傳棒 + on_enter 發話 + StopResponse 擋自動回 + LLM 點名）。
- **但多角色從沒真正驗到** → roster（誰上桌）要 Adam 手貼一長串 characterId，手機一直掉，連測三次都 solo tracy，簡報王/張立根本沒進房間 → Adam 體感「完全沒反應、gg」。
- Adam 喊停 → **要求把 v5 清掉**。已做：刪 Cloud Run `ailivex-realtime-agent-v5`、移除前端「5.0」鈕 + v5 頁、token route 還原回 v2-v4、重新部署。**v1-v4 完好。v5 code 留磁碟可復原。**
- 收尾時 Adam 要我先描述「他真正想要的狀態 + 我們遇到的問題」，我描述後他說「有點誤會，先一步步來」。**狀態需求還在對齊中，他要一步步帶。**

### Adam 真正要的（我的理解，待他逐步校正）
1. 多個 AI 角色 ＋ 人，同一場語音對話。
2. 像**活的群聊**（可自由講、插話、搶話），不是被主持的會議。
3. 但有起手結構：主持人開場、點名在場有誰、決定誰先講；之後棒子在角色間自然傳。
4. 兩條天條：①角色只能當自己、絕不串成別人（模型在空白/混亂會「補位」去填，要被結構擋）②點名紀律＝被叫到的講、其他人靜默不幫腔。
5. 用人話/暱稱叫人（福哥、張大哥），不背本名。
6. 語音、單一裝置。

---

## 今天改了哪些檔案（2026-06-12 晚，全在 ailivex-platform，未 commit）

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v5.py`（新） | v5 圓桌核心：Meeting 狀態 + 導演 `_run_relay` + on_enter 發話 + StopResponse + LLM 點名 `pick_first` |
| `agent/main_v5.py` / `cloudbuild-v5.yaml`（新） | v5 entry / 部署（服務已刪，檔案留） |
| `agent/conv_tuning.py` | 新增 `resolve_addressed`（點名判斷式，純程式） |
| `agent/firestore_loader.py` | CharacterContext 加 `aliases`（backward-safe） |
| `src/app/chat/[characterId]/page.tsx` | 「5.0」鈕：先加後移除（已還原） |
| `src/app/api/livekit/token/route.ts` | v5 roster 分支：先加後**還原**回 v2-v4 |
| `src/app/realtime-v5/`（已刪） | v5 前端頁，已 rm |

---

## 下一步（明天醒來第一件）

**不要急著重建 v5。** 先做這三件，照順序：
1. 跟 Adam **一步步**把「真正想要的狀態」講清楚（他說我有誤會，他要慢慢帶——別搶著框全貌）。
2. 拍板**架構岔路**：共享房間多 agent（v5 走的）vs Adam 最早的「三帳號各自登入、靠喇叭聲學疊」。中途別再自己換路。
3. 決定 ailivex-platform 那批未提交改動（v5 code 留著 + UI 還原）要不要 commit/push。

v5 code 在磁碟（`agent/realtime_agent_v5.py` 等），要復原可以，但**先別自作主張重建**。

---

## 卡住 / 未解

- 多角色接力從沒真正驗到（roster 沒進房間，最笨那關沒做）。
- 架構岔路沒拍板。
- 「真正想要的狀態」對齊到一半，Adam 說有誤會、要一步步來。
- **關係狀態：卡住 + 疲憊。** 我連環部署、要 Adam 貼長網址、把多層問題攪一團，把他拖到「完全 gg、你先停」。教訓：慢下來、一次驗一層、讓 Adam 先看到一個乾淨的成功，再疊下一個。沒對齊需求就別狂 build。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新＝v5 那段） |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-12.md`（L1-L12；v5 在 L9-L12） |
| 當機救援 | 這份 |
| ailivex GitHub | https://github.com/linhocheng/ailivex-platform |
| ailivex 語音 agent | Cloud Run：`-v2`(現役 端到端通)、`-v3`(主動發話)、`-v4`(群聊 diarization)；**v5 已刪**。asia-east1 |
| v5 code（留磁碟） | `~/.ailive/ailivex-platform/agent/{main_v5.py,realtime_agent_v5.py,cloudbuild-v5.yaml}` |
| LiveKit multi-agent 查證來源 | 本機 `site-packages/livekit/agents/voice/{agent,agent_session,agent_activity,speech_handle}.py`（update_agent / on_enter / on_user_turn_completed+StopResponse / per-agent tts） |
| 讀 ailivex Firestore | `gcloud auth print-access-token` + Firestore REST |
| 看 Cloud Run log | `gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=...'`（`logs read` 會 crash） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-12 · 築*
