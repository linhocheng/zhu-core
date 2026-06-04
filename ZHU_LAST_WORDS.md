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
  - 跑著 `claude-bridge`（systemd），bridge-direct HTTPS 直連：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-04 下午場 · Opus 4.8）

- MACS 策略框架重構 Phase 0-2 落地：把「mode 邏輯散落各檔 if(mode)」這個結構性破綻，改成「每模式一本食譜(framework)」
- Phase 0 安全網：tag `before-framework-refactor`（macs commit fc65959，修真相分裂：prod 曾跑沒進 git 的 702 行 hybrid code）
- Phase 1 契約：`lib/frameworks/contract.ts`，三種 stage 形狀(Singleton/PerUnit/RoundTable)，Adam 看過草稿才落地
- Phase 2：接通 hybrid 分析(根因:analysis route 從沒傳 mode)、各分析師章節改 Mode 2 渲染、research 多收兩格、recommend route 框架 pilot
- 三次真案 e2e 撐證明，不是綠勾（case-mpyzkp95 / mpz4fwjd / mpz5pc0c）

---

## 今天改了哪些檔案（macs-platform，commit v0.10.0.007~011）

| 檔案 | 改了什麼 |
|---|---|
| `lib/frameworks/contract.ts` | 框架契約：StageId/三形狀/ResourceKey/runsOn/control |
| `lib/frameworks/registry.ts` | getFramework 查表，hybrid 已註冊 |
| `lib/frameworks/hybrid/index.ts` | hybrid 7 個 Vercel 單次棒薄包現有函式 |
| `lib/frameworks/orchestrator.ts` | buildStageContext 解析 stage reads |
| `app/api/workers/analysis/route.ts` | 接通 mode + 存 hybridMemo（根因修正） |
| `lib/report/builder.ts` | 各分析師章節從 hybridMemo 直接渲染 Mode 2 |
| `cloud-run/research-worker/src/index.ts` | dossier 多收 consumerLanguage+analogyCandidates（rev 00018） |
| `app/api/workers/recommendation/route.ts` | pilot：hybrid 走框架 stage |

---

## 下一步

**先等 Adam 拍板策略岔路：A(續攻 Phase 3 全遷) vs B(收在這、等 Mode 3 順勢遷)。築傾向 B。**

若走 B / Mode 3：
```bash
cd ~/.ailive/macs-platform
grep -n "creative_lead" lib/firestore/types.ts lib/llm/defaults.ts
ls lib/pipeline/creative*.ts lib/pipeline/problemReframe.ts lib/pipeline/validationSprint.ts
```
Mode 3 的 lib/pipeline 骨架已建（creativeAnalysis/creativeSynthesis/creativeRecommendation/creativeTrack/problemReframe/validationSprint），照框架(`lib/frameworks/hybrid/` 為範本)蓋 + 接 route。記得：**查資料共用不分 mode、Cloud Run 是承重牆(執行搬不動)、改 lib 必同步改 route(心法四)**。

若走 A / Phase 3：route 全改 getFramework、status data-driven 讀 framework.pipeline、建框架執行 instrumentation。

---

## 卡住 / 未解

- Cloud Run 三棒 schema 仍兩份（A+ 的「schema 單一源 vendor 給 Cloud Run」未做）
- 框架執行可觀測性未落地（outputSummary 沒存 Firestore，pilot 是 by-construction 證明）
- Mode 1 框架未註冊，recommend route 還有 legacy 分支（Phase 5 收）
- Cloudflare API token 外洩待撤銷（延宕多 session）
- `STRUCTURE_ANALYSIS_BASE_URL` 尾端有 `\n`（`.trim()` 保護中，非緊急）

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
| MACS 平台 | `~/.ailive/macs-platform/`，prod: https://macs-platform.vercel.app |
| 框架契約 | `~/.ailive/macs-platform/lib/frameworks/contract.ts`（食譜格式） |
| Mode 1→2 踩雷心法 | `~/.ailive/macs-platform/docs/MODE1_TO_MODE2_LESSONS.md` |
| 框架重構教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-04.md`（下午場 L6-L11） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-04 · 築*
