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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（跑 `claude-bridge` systemd）
  - bridge-direct：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **ailive 平台**：`~/.ailive/ailive-platform/`（Next.js 16.1.6 Turbopack），prod https://ailive-platform.vercel.app
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app，git remote github.com/linhocheng/macs-platform
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`
- **ANEWS source-worker（Cloud Run）**：`anews-source-worker` · asia-east1 · project `zhu-cloud-2026`

---

## 最新完成（2026-06-06 晚）

- **MACS partner-review `revisedStoryline` 字串崩潰修復（天條落地）**：
  - 病灶：`verdict=revised` 時 LLM 把 nullable 巢狀欄位丟成字串（散文或字串化 JSON），schema 要物件 → `SCHEMA_VALIDATION` → repair loop 重問4次仍死（天條坑：拿 LLM 補 LLM 壞輸出）。
  - 修法兩層：`coerceObjectOrNull` preprocess（字串化 JSON 就 parse、散文退回 null 讓下游沿用原 storyline）+ 兩個 prompt 補 `verdict=revised` 完整物件範例。market_evidence + hybrid 兩 schema 都修。
  - 全面檢查 Mode 1/2/3：grep `}).nullable()` 確認全 pipeline 唯一 nullable 巢狀物件就是這兩個 revisedStoryline；其餘必填且有完整範例。子代理報的 Mode 3 四個 HIGH 全是假陽性（自核 code 確認）。
  - 驗證：單元測試4種輸入全過 + tsc 綠 + commit `v0.11.2.002` + push + Vercel deploy 上線。

### 同日稍早
- 5C 框架驅動章節組裝完成（上個 session）：hybrid 章節搬進 `lib/frameworks/hybrid/report.ts` + `sharedChapters.ts`，`v0.11.2.001`。
- ailive 即時語音加角色底圖層（realtime + voice），已上 prod，Adam 確認 OK。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/pipeline/partnerReview.ts` | `coerceObjectOrNull` preprocess（兩 schema）+ 兩 prompt 補 revised 完整範例 |
| `macs-platform/lib/frameworks/hybrid/report.ts` | （上個 session）hybrid 章節組裝 buildHybridChapters |
| `macs-platform/lib/report/sharedChapters.ts` | （上個 session）共用章節 decisionMaker/coreStake/sources |
| `ailive-platform/src/app/realtime|voice/...page.tsx` | （稍早）語音角色底圖層 |

---

## 下一步（接棒第一件能直接動手）

**端到端驗證 partner-review 修復——重跑卡住的測試案到 done。** 程式修復已驗+已 deploy，但 e2e 還是空的（Adam 喊停在重跑前）。

1. **重跑 `case-mq200e8b-8s5uks`**（我的測試案，Mode 1，needs_repair）：
   - 取 planVersion：查 `pipeline_artifacts` where caseId 的 `planVersion` 欄。
   - reset 案 doc：`repairAttempts=0`、`repairErrorType=null`、`repairErrorMessage=null`、`status="partner_review_running"`。
   - 觸發部署的 worker（驗新 code，不要本機跑）：`productionEnqueue("macs-report","/api/workers/partner-review",{taskId:`macs-partner-${caseId}-${planVersion}`,caseId,planVersion})`。partner-review body 只要 `{caseId,planVersion}`，repairCollection="cases"。
   - 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_status.mts case-mq200e8b-8s5uks`。
   - 到 done → 開匯出報告確認 5C 設計＋章節對。
2. 同法重跑 `case-mq1xix6b-clkkvf`（另一個卡的真案）。
3. 通過後收 Task #21（hybrid e2e）、#31（5C 標 done）。

**踩雷備忘**：MACS admin API 認證用 `ADMIN_PASSWORD="dm28224038"` 當 Bearer token，**不是** `ADMIN_PW`（那個 env 不存在，上 session 踩過）。inline tsx `-e` 會 CJS top-level-await 報錯，改寫 `.mts` 檔再 `npx tsx --env-file=.env.local /tmp/x.mts`。

---

## 卡住 / 未解

- **MACS e2e 未驗**：partner-review 修復只驗到單元+deploy，沒有真案跑穿過 partner-review→export→done。兩個 needs_repair 案子待重跑（見下一步）。
- Mode 1/2 報告新設計（5A）未 live 驗（理論自動套，沒真案跑過）。
- 篇幅旋鈕只 Mode 3 全通（Mode 1/2 + Cloud Run 未接）。
- MACS `cloud-run/research-worker/src/index.ts` Tavily 輪用改動：上 session 已 commit `v0.11.1.002`（已入 git）。
- ailive working tree：Adam 既有未提交 `agent/user_profile.py`、`src/lib/user-profile.ts`（非我的，勿洗）。
- Cloudflare API token 外洩待撤銷（延宕多 session）。
- ANEWS source-worker tavily.ts 改動未 commit（ANEWS 非 git repo，只靠 deploy + WORKLOG）。

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
| MACS partner-review | `macs-platform/lib/pipeline/partnerReview.ts`（coerceObjectOrNull + schema + prompt）|
| MACS 章節組裝 | `macs-platform/lib/report/{builder.ts,sharedChapters.ts}` + `lib/frameworks/hybrid/report.ts` |
| MACS worker harness | `macs-platform/lib/workers/harness.ts`（repairAttempts/needs_repair 機制）|
| MACS 案件狀態查詢 | `macs-platform/scripts/_status.mts <caseId>` |
| MACS admin 認證 | Bearer `ADMIN_PASSWORD`（值 dm28224038），非 ADMIN_PW |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-06 · 築*
