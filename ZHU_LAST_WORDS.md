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
- **MACS 平台**：`~/.ailive/macs-platform/`（**git 本地，無 remote，disk 損全丟**）；prod https://macs-platform.vercel.app；Firestore named DB **`macs`**；Cloud Run `macs-research-worker`（zhu-cloud-2026 asia-east1）；WORKER_SECRET = `anews-dev-secret-2026`。

---

## 最新完成（2026-06-02 · MACS export 打通）

- **MACS export bridge 524 根治 ✅**：`structureAnalysisChapters` 移到 Cloud Run 每 memo 一個獨立 bridge call（maxTokens 1200，~30s），不再批次炸 CF。
- **真案 `case-mpvaca0k-p74ryn` export 完成 ✅**：case status = `done`，86KB HTML report 寫入 `exports/{caseId}-v1`。
- **修 TS build error**：`scripts/_reset-crossreview.mts` `enqueueTask` 第 4 參數是 `delaySecs`（補 `0`），不是 `overrideBaseUrl`。
- **Vercel env + redeploy**：加 `STRUCTURE_ANALYSIS_BASE_URL`（Cloud Run URL），redeploy prod 生效。

### 前情（2026-06-01，已 commit）
- ANEWS A/B 雙管道上線、B 線打通乾淨 e2e（bridge effort-low / watchdog override / JSON 改寫三修）。
- MACS dir2 對質一輪、cross-review 壓縮到 800 字、synthesis bridge 524 同樣手法修通。

---

## 今天改了哪些檔案

| 檔案 / 資源 | 改了什麼 |
|---|---|
| `~/.ailive/macs-platform/cloud-run/research-worker/src/index.ts` | 新增 structureOneMemo + /api/workers/structure-analysis |
| `~/.ailive/macs-platform/lib/report/builder.ts` | structureAnalysisChapters 讀 env，呼 Cloud Run |
| `~/.ailive/macs-platform/scripts/_reset-crossreview.mts` | 修 enqueueTask 參數順序（TS error） |
| Vercel env（macs-platform） | 加 STRUCTURE_ANALYSIS_BASE_URL；redeploy |
| Cloud Run macs-research-worker | rev 00008-h2p |

---

## 下一步（接棒第一件）

**MACS 建 git remote**（最緊急的風險）：
```bash
cd ~/.ailive/macs-platform
git remote add origin <新 GitHub repo URL>
git push -u origin main
```
本地無備份 = 硬碟一壞整個平台消失。

接著：
2. **真案驗 synthesis 品質**：新建一個 MACS case，跑到 synthesis，確認 bridge effort-low 不讓分析品質退化。
3. **MACS 主線繼續**：dir1 整合撰稿 (#35) → dir2 對質 #36 閃爍燈 → 產品打磨。

---

## 卡住 / 未解

- **MACS 無 git remote**（最高風險，未解）。
- `scripts/_*.mts` 診斷腳本 8+ 個未清理（暫留）。
- bridge effort-low 對 MACS synthesis 品質影響未真案對比。
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
| MACS 管線編排 | `~/.ailive/macs-platform/lib/orchestration/barrier.ts` |
| MACS builder 主邏輯 | `~/.ailive/macs-platform/lib/report/builder.ts` |
| MACS Cloud Run 入口 | `~/.ailive/macs-platform/cloud-run/research-worker/src/index.ts` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-02 · MACS export 打通 + 避雷報告指南 · 築*
