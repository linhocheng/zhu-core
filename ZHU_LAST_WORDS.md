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

## 最新完成（2026-06-09 下半場）

- MACS **Mode 3（creative_lead）11 個現役角色換成 Adam 定義的暗黑心理 prompt 聲音**——這場主里程碑（commit v0.14.0.001，已 deploy + push）
- 澄清上輪說謊記憶：「Mode 3 仍有真的 `[ADAM_FILL]` 假資料」是**錯的**。去現場追 framework run-fn import 鏈確認——現役 11 個 blueprint prompt 全填滿，`[ADAM_FILL]` 那 3 個 track_* 坐在死碼裡（`CREATIVE_ROLE_FRAMING` Mode 3 不用 + 6 個零 import legacy 孤兒檔）
- 清死碼：移除 13 個死 prompt key + 清空 CREATIVE_ROLE_FRAMING + 刪 6 孤兒檔 + 移除 settings 後台的假中台編輯框（後台 Mode 3 現在只剩 11 現役 + soul）
- 11 角色：委託解碼者/命題鍛造師/場域拆解者/母題煉金師/撞擊室/現實邊界官/概念鍛造師(我用 Brief Forge 聲線代筆)/概念選型師/Hans/Victor/Max。export 是 `buildCreativeReport` 確定性組裝（無 LLM）
- 上線驗證：curl prod defaults 確認 11 key 齊、咒印全中、死 key 全消、roleFraming 空；`saved` 全空無 DB 覆寫 → 預設即 effective、無真相分裂

（同日上半場已完成 Mode 4 換真 prompt 上線 + costUsd=0 懸案澄清，見 WORKLOG 2026-06-09 段）

---

## 今天改了哪些檔案（下半場）

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/llm/defaults.ts` | CREATIVE_PROMPTS 11 現役 key 換真聲音；移除 13 死 key；清空 CREATIVE_ROLE_FRAMING |
| `macs-platform/app/dashboard/settings/page.tsx` | 移除死 key 的後台 label（假中台編輯框） |
| `macs-platform/lib/pipeline/{problemReframe,creativeTrack,creativeAnalysis,creativeSynthesis,creativeRecommendation,validationSprint}.ts` | 刪除（6 個零 import 孤兒檔） |
| `~/.claude/.../memory/project_macs_platform.md` | 補 2026-06-09 下半場 Mode 3 段 + 更新 description |
| `zhu-core/docs/LESSONS/LESSONS_2026-06-09.md` | 追加 L4（Mode 3 [ADAM_FILL] 說謊記憶）、L5（改預設前 curl saved 驗 DB 無覆寫） |
| `zhu-core/docs/WORKLOG.md` | 追加 2026-06-09 下半場段 |

（macs-platform commit `175dc9c` v0.14.0.001 已 deploy aliased macs-platform.vercel.app + push GitHub linhocheng/macs-platform。untracked `scripts/_*.mts` 是丟棄式 debug 腳本，不入 git）

---

## 下一步

**Mode 3 已換真 prompt 上線——沒有非做不可的下一步。** 接棒的築要動，從這幾條挑：

1. **（最可能）驗 Mode 3 魔性**：tsc + 上線只證明沒打壞，11 角色暗黑心理聲音協奏出的提案質感**還沒跑真案 e2e**。開一個 creative_lead 新案跑到 done，看報告質感。是這場唯一留下的驗證缺口。
2. **續審 Mode 1 / Mode 2 的 role prompt**：Adam 的大方向是逐 mode 重寫角色聲音。Mode 3、Mode 4 已做，剩 Mode 1（market_evidence，麥肯錫式）、Mode 2（hybrid）。比照流程：列現役 cast → Adam 定義核心/能力/咒印 → 寫進對應 DEFAULTS（Mode 1=`DEFAULT_PROMPTS`+`DEFAULT_ROLE_FRAMING`，Mode 2=`HYBRID_PROMPTS`+`HYBRID_ROLE_FRAMING`）。
3. **bridge input_tokens 回報修正**（選配，不急）：bridge `/v1/messages` 對 `usage.input_tokens` 回 stub 值。不影響成本（$0），要修動 bridge VM 端不是 MACS client。

---

## 卡住 / 未解

- Mode 3 新聲音「魔性」未跑真案 e2e（cosmetic 缺口，code 已上線且驗證乾淨）。
- bridge `/v1/messages` 不回真實 input_tokens（cosmetic，不影響 $0，未授權修）。
- 其餘無。Mode 3、Mode 4 都是乾淨里程碑，無寫到一半的 code。

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
| MACS Mode 3 prompt | `macs-platform/lib/llm/defaults.ts` 的 `CREATIVE_PROMPTS`（11 key，可在後台 `roles_creative_lead` 編輯） |
| MACS framework 對應 | `macs-platform/lib/frameworks/creative-lead/index.ts` → run-fn 在 `lib/pipeline/creativeLead.ts` |
| MACS admin bearer | `macs-platform/.env.production.local` 的 `ADMIN_PASSWORD`（dm28224038） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-09 · 築*
