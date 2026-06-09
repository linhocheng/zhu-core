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
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（直連 host `https://bridge-direct.soul-polaroid.work`，VM IP 35.236.185.222）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-09）

- MACS Mode 4（creative_proposal，奧美×李奧貝納 6 人創意部）**從 P0 假資料換成真 prompt + 上線 e2e 驗證**——這條是這輪主里程碑
- 6 人創意部聲音由 Adam 親自定義（基因屬性 + 召喚咒語），寫進 `lib/llm/defaults.ts` 的 `PROPOSAL_PROMPTS`，且全部可在中台後台編輯（`roles_creative_proposal` Firestore doc）
- 設計層收斂 `v0.13.0.001`：mode 宣告散在 4 處 → 收成單一 client-safe `lib/modes/catalog.ts`（TS 強制四模式齊備）；detail API 改吃 `frameworkArtifactTypes`（讀 `stage.writes`）不再 hardcode；callRole 收掉 callCreative/callProposal 雙胞胎
- 去現場驗證收斂真的修好：curl prod case-mq5w0ui9-9jmgzc → 7 個 proposal_* artifact 零 null（流動斷裂修掉）
- 澄清 costUsd=0 懸案：不是假中台，是 B 線（Tavily 免費 + Max bridge）$0 marginal 設計正確；我上輪標的「懷疑」建在過時假設上 → 記憶會說謊

---

## 今天改了哪些檔案

本 session 無新 code（v0.13.0.001 收斂 commit 是上輪做的，已 deploy）。本輪純驗證 + 記憶：

| 檔案 | 改了什麼 |
|---|---|
| `~/.claude/.../memory/project_macs_platform.md` | 補 2026-06-09 Mode 4 上線里程碑段；更正舊「Mode 4 仍 P0 假資料」行 |
| `zhu-core/docs/LESSONS/LESSONS_2026-06-09.md` | 三條（懷疑記憶會說謊 / bridge input_tokens quirk / 泛型化驗證標準） |
| `zhu-core/docs/WORKLOG.md` | 追加 2026-06-09 段 |

（背景：`macs-platform` 已 commit `v0.13.0.001`、prod aliased macs-platform.vercel.app；untracked 的 `scripts/_check_*.mts` 是丟棄式 debug 腳本，不入 git）

---

## 下一步

**Mode 4 已完成上線——沒有非做不可的下一步。** 接棒的築要動，從這幾條挑：

1. **（最可能）Mode 5/6 譜路**：Mode 4 已證明 framework + 6-persona + callRole 模式可複用。新 vercel-native mode = 在 `lib/frameworks/` 註冊一個 framework dir + 寫 buildReport hook，零 worker route 改動。等 Adam 定義新 mode 的角色與章節結構。
2. **bridge input_tokens 回報修正**（選配，不急）：bridge `/v1/messages` 對 `usage.input_tokens` 回 stub 值（dossier 全 = 3）。不影響成本（$0），要修是動 bridge VM 端不是 MACS client。做 token 儀表板前才需要。
3. **point 3 共用抽象**：callRole 已部分達成，Adam 是否還要更多未確認——要先問。

---

## 卡住 / 未解

- bridge `/v1/messages` 不回真實 input_tokens（cosmetic，不影響 $0 成本，未授權修）。
- 其餘無。Mode 4 是乾淨里程碑，無寫到一半的 code、無懸著的斷點。

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| MACS 平台 | `~/.ailive/macs-platform/`（Vercel + Cloud Run research worker） |
| MACS Mode 4 計畫 | `~/.ailive/macs-platform/docs/MODE4_CREATIVE_PROPOSAL_PLAN.md` |
| MACS admin bearer | `macs-platform/.env.production.local` 的 `ADMIN_PASSWORD`（dm28224038） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-09 · 築*
