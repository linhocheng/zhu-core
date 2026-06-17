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

## 最新完成（2026-06-17）

- 診斷 ailivex v10 多人房 gate 根因：LLM 停在旁觀者視角，「聖嚴法師怎麼看？」兩個 agent 都答 handoff
- Adam 設計完整判別式架構：Layer 1 別名比對 / Layer 2 LLM 模糊情境 / 群體問話 orchestrator
- 補聖嚴/達賴/星雲大師 aliases 到 Firestore（migration script 跑完）
- 加 aliases 欄位到 CharacterDoc schema + Admin UI + PATCH API
- 實作 `_deterministic_addressed_check()` 插入 floor-gate 前（Layer 1）
- 更新 LLM gate prompt 核心問句：從「是否交棒」→「你是否被期待說話」
- 修 Dockerfile HuggingFace CDN timeout 爆 build（`|| true`）
- v10.0.3 部署 Cloud Run `ailivex-realtime-agent-v10` revision 00004-vql ✅

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/ailivex-platform/agent/realtime_agent_v10.py` | v10.0.3：`_deterministic_addressed_check()` + LLM prompt 改核心問句 |
| `~/.ailive/ailivex-platform/agent/Dockerfile` | HF download `\|\| true` |
| `~/.ailive/ailivex-platform/src/lib/collections.ts` | `aliases?: string[]` |
| `~/.ailive/ailivex-platform/src/app/api/admin/characters/[id]/route.ts` | GET/PATCH aliases |
| `~/.ailive/ailivex-platform/src/app/admin/characters/page.tsx` | 別名欄位 UI |
| `~/.ailive/ailivex-platform/scripts/set-character-aliases.mts` | migration script（新建） |

---

## 下一步

**測試 v10.0.3**：3-way call（Adam + 聖嚴 + 達賴），說「聖嚴法師怎麼看？」，
看 Cloud Run log 出現 `gate[det]：別名命中 → 直接回話`，聖嚴開口不沉默。

路徑：`/realtime-v10/[characterId]` → 開兩個 tab，各接一個角色。

---

## 卡住 / 未解

- **conditional alias**：「法師」只在場上只有一位法師時才算，目前靜態放 aliases（有輕微誤觸風險）
- **群體問話無 orchestrator**：「兩位都說說」→ 兩 agent 可能搶話，gate schema 升 target_type: group 是正解（未做）
- **v11 VP 停用**：echo 在 1v1 分出假講者，VP_ENABLED=0 暫停，待解 echo gate

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
| ailivex 平台 | `~/.ailive/ailivex-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-17 · 築*
