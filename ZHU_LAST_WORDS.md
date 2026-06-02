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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING。`claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（Cloudflare ~130s 邊緣超時 = 524）。bridge listening :3001。SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`。bridge `index.js` 不在 git，改它先下載→本機 edit→grep 驗→上傳→restart，有備份 `index.js.bak-*`。
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git，有 remote）
- **ANEWS 平台**：`~/.ailive/anews-platform/`；prod https://anews-platform.vercel.app；source worker 在 Cloud Run **anews-source-worker**（zhu-cloud-2026 asia-east1）；Firestore moumou-os `(default)`；WORKER_SECRET = `anews-dev-secret-2026`。**working tree 有大包未 commit（Wave1 single-write + Wave2 A/B + 晚場四修），prod 已部署，勿 `git checkout .`/`stash drop`。**
- **MACS 平台**：`~/.ailive/macs-platform/`；**已推 GitHub `linhocheng/macs-platform`（private）**；prod https://macs-platform.vercel.app；Firestore named DB **`macs`**；Cloud Run `macs-research-worker`（zhu-cloud-2026 asia-east1）；WORKER_SECRET = `anews-dev-secret-2026`。

---

## 最新完成（2026-06-02 下午 · MACS dir1+dir2 強化 + 中台活路接通）

- **MACS GitHub 推上去 ✅**：建 private repo `linhocheng/macs-platform`，SSH push，硬碟全滅風險解除。
- **dir1 整合撰稿者 Marcus ✅**：Victoria 結構化後，Marcus 做第二次整合 pass，帶全 chapter + synthesis context，重寫 soWhat/decisionImpact/narrativeBridge 使各章指向 coreStake。bridge call 1 次，timeout 180s，non-fatal fallback。`integrationWriter` key 已入中台（活路）。
- **#36 閃爍燈號 `cross_review_running` ✅**：新增 case status，barrier 觸發 cross-review 時寫入，Cloud Run 完成後切 synthesis_running。badge `.adm-badge-pulse` 1.6s 閃爍動畫，`PULSE_STATUSES` Set 管控。pipeline step 加「對質」節點。
- **中台活路接通（假中台修復）✅**：
  - Victoria Cloud Run：改讀 Firestore `reportBuilder`（`getReportBuilderRole()`），不再寫死。
  - 對質 6 分析師：`getCrossReviewRole()` 讀 `roleFraming[workerType]`，每個 memo 帶入個性 persona。
  - 中台 `integrationWriter` 新增為 Marcus 入口。

### 前情（2026-06-02 上午，export 打通）
- structureAnalysisChapters 移 Cloud Run per-memo，bridge 524 根治。
- 真案 export 完成，Vercel env + redeploy，enqueueTask 參數修正。

---

## 今天改了哪些檔案

| 檔案 / 資源 | 改了什麼 |
|---|---|
| `~/.ailive/macs-platform/cloud-run/research-worker/src/index.ts` | 新增 getIntegrationWriterRole + runIntegrateChapters + /integrate-chapters；getReportBuilderRole 讀 Firestore；getCrossReviewRole 擴充 roleFraming；enqueueSynthesis 先寫 cross_review_running |
| `~/.ailive/macs-platform/lib/report/builder.ts` | 新增 integrateAnalysisChapters()；AnalysisChapterSchema 加 narrativeBridge；orderedAnalysis 改用 integratedChapters |
| `~/.ailive/macs-platform/lib/firestore/types.ts` | CaseStatus 加 `cross_review_running` |
| `~/.ailive/macs-platform/lib/ui/status.ts` | STATUS_META / PIPELINE_STEPS 加對質；export PULSE_STATUSES |
| `~/.ailive/macs-platform/lib/llm/defaults.ts` | 新增 integrationWriter key（Marcus 完整 persona） |
| `~/.ailive/macs-platform/lib/orchestration/barrier.ts` | applyDecision synthesize 分支先寫 cross_review_running |
| `~/.ailive/macs-platform/app/globals.css` | 加 @keyframes macs-pulse + .adm-badge-pulse |
| `~/.ailive/macs-platform/app/dashboard/page.tsx` + `[caseId]/page.tsx` | badge 套 PULSE_STATUSES 閃爍 |
| `~/.ailive/macs-platform/app/dashboard/settings/page.tsx` | PROMPT_LABELS 加 integrationWriter |
| Cloud Run macs-research-worker | 最新 rev（活路接通 + integrate-chapters endpoint） |
| GitHub linhocheng/macs-platform | 首次推上（private） |

---

## 下一步（接棒第一件）

**MACS research 移植：確認路 A 或路 B**（跟 Adam 對齊後動手）：
- **路 A**（簡單）：保 markdown 輸出，只改 synthesis prompt 讀 Tavily 格式 → analysis worker 不動。
- **路 B**（穩健）：換 JSON schema 輸出 → 要改 analysis worker + 重驗 pipeline。
- **BRIDGE_URL 用直連 IP**：`35.236.185.222:3001`，不過 CF domain（避免 524）。
- 確認後按 `ANEWS_OPERATIONS.md §11.9` checklist 逐項打勾。

接著：
2. **Marcus 真案驗品質**：用真實 MACS case 跑到 export，看 narrativeBridge 輸出是否有意義。
3. **#36 閃爍燈驗證**：等新 case 跑到 cross-review，確認 badge 閃爍出現。

---

## 卡住 / 未解

- **MACS research 移植路 A/B 待 Adam 確認**（決策 pending）。
- **ANEWS source-worker BRIDGE_URL 仍過 CF**（`bridge.soul-polaroid.work`，524 風險存在），待改直連 IP `35.236.185.222:3001`。
- `scripts/_*.mts` 診斷腳本 8+ 個未清理（暫留）。
- ANEWS Vercel 舊 source route（A-only 死副本）標記未刪。
- ANEWS working tree 深包未 commit（Adam 刻意保留）。

---

## 避雷報告指南（MACS 管線）

> 這份是 Adam 特別要求的。MACS 管線有多個坑，下次卡住先對照這張表。

### 管線全貌（順序）

```
brief-intake → problem-framing → issue-tree
→ research（Cloud Run，付費 API key）
→ analysis（Vercel，bridge）
→ cross-review（Cloud Run，bridge）
→ synthesis（Vercel，bridge）
→ recommendation → roadmap → storyline
→ partner-review（Vercel，bridge）
→ export（Vercel，bridge + Cloud Run structure-analysis）
```

### 坑位對照表

| 症狀 | 根因 | 診斷指令 | 修法 |
|---|---|---|---|
| bridge 524 | 單次生成 > 100s，Cloudflare 超時 | 看 worker_run.lastError | 找批次 LLM call，拆成 per-item 順序呼叫 |
| synthesis bridge 524 | cross-review memo 太長（>800 chars），synthesis 一次批次餵 | `_watch-memos.mts` 看 chars | `settings/pipeline.cost.crossReviewMaxChars` 調小（預設 800） |
| export bridge 524 | `structureAnalysisChapters` 批次 → 已修，Cloud Run per-memo | Vercel logs | 確認 `STRUCTURE_ANALYSIS_BASE_URL` env 有值且 redeploy 過 |
| case 卡在 `needs_repair` | 連續失敗 3 次，harness 停止重試 | `_check-export-error.mts` | `_repair-case.mts` 重置 status + repairAttempts=0 |
| export 回 409 `already_running` | Vercel function 還在執行（curl timeout 不等於 function timeout） | Firestore `worker_runs/<taskId>` 看 status | 等 10min lock TTL 過期，或查 Vercel logs 確認 function 狀態 |
| export worker_run stuck `running` | Vercel function crash 沒 cleanup | `worker_runs/<taskId>.status` | 手動 update status → `failed`，再重發 |
| synthesis artifact 沒 result 欄 | 舊格式：artifact 存在 `content`，不是 `result` | Firestore 直查 | `readArtifact<T>()` 讀到的是 content 欄，code 已正確，不用改 |
| Cloud Run 401 Unauthorized | WORKER_SECRET 不對 | curl -v 看 header | 確認 Cloud Run 環境變數 = `anews-dev-secret-2026`；Vercel 同值 |
| Cloud Run 呼叫 Vercel 回不來 | Vercel lambda 300s 硬上限，Cloud Run 等超時 | Cloud Run logs | 把長任務拆回 Cloud Run 自己做，不要讓 Cloud Run 呼 Vercel 長任務 |
| barrier 不觸發 synthesis | 某個 workstream_completion 沒寫 | `_watch-barrier.mts` | 找缺少的 workstream，手動補或重跑 analysis |
| Vercel env 加了但不生效 | 已部署的 Lambda 用舊快照 | Vercel dashboard build log | `npx vercel --prod --yes` redeploy |
| 中台改 prompt 沒效果 | Cloud Run 寫死 system，沒讀 Firestore | Cloud Run logs 看 system 是否含角色 key | 補 `getXxxRole()` 讀 Firestore，pattern 看 `getReportBuilderRole()` |

### 診斷腳本清單（`~/.ailive/macs-platform/scripts/`）

```bash
# 查 case 狀態
npx --yes dotenv-cli -e .env.local -- npx tsx scripts/_check-export-error.mts

# 重置 case（export 重跑）
npx --yes dotenv-cli -e .env.local -- npx tsx scripts/_clear-pipeline.mts

# 看 analysis memos 狀態
npx --yes dotenv-cli -e .env.local -- npx tsx scripts/_watch-memos.mts

# 直接觸發 export（注意：若 worker_run 是 running 狀態，會 409）
curl -X POST https://macs-platform.vercel.app/api/workers/export \
  -H "Content-Type: application/json" \
  -H "x-worker-secret: anews-dev-secret-2026" \
  -d '{"taskId":"macs-export-{caseId}-v1-retry","caseId":"{caseId}","planVersion":"v1"}'
```

### 黃金原則

1. **看到 524 先量 token 再加 retry** — 加 retry 只會燒更多。
2. **curl 斷了 function 不見得死** — 先查 Firestore lock 再決定重發。
3. **Vercel env 加了要 redeploy** — 不 redeploy = 不生效。
4. **needs_repair 超過 3 次 = harness 放棄** — 用 `_repair-case.mts` 重置，不要等它自己好。
5. **診斷腳本先用** — 猜比查慢 10 倍，MACS 腳本在 `scripts/_*.mts`。
6. **新 Cloud Run 端點用 LLM 必問：system prompt 有活路嗎？** — 沒讀 Firestore = 假中台，必補 `getXxxRole()`。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 / 劍法 | `NORTH_STAR.md` / `ZHU_BOOT_SOP.md` / `docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-02.md` |
| 當機救援 | 這份 |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ANEWS 營運全局 + B 案設計重點 | `~/.ailive/anews-platform/ANEWS_OPERATIONS.md`（跑 ANEWS / MACS 走 B 案前先讀）|
| ANEWS 部署拓樸 | memory `reference_anews_source_worker_deploy.md` |
| MACS research 移植 checklist | `~/.ailive/anews-platform/ANEWS_OPERATIONS.md §11.9` |
| MACS GitHub | `https://github.com/linhocheng/macs-platform`（private） |
| MACS 管線編排 | `~/.ailive/macs-platform/lib/orchestration/barrier.ts` |
| MACS builder 主邏輯 | `~/.ailive/macs-platform/lib/report/builder.ts` |
| MACS Cloud Run 入口 | `~/.ailive/macs-platform/cloud-run/research-worker/src/index.ts` |
| Marcus 角色 prompt | 中台 admin → integrationWriter（活路） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-02 · MACS dir1 Marcus + #36 閃爍燈 + 中台活路全接通 · 築*
