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
- **ailive 平台**：`~/.ailive/ailive-platform/`（Next.js），prod https://ailive-platform.vercel.app
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app，git remote github.com/linhocheng/macs-platform
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`

---

## 最新完成（2026-06-07）

- **MACS Mode 1 管線重構（v0.11.3.001 上線）**：
  - Victoria（structure-chapters）和 Marcus（integrate-chapters）從 export inline call 升格為獨立中途 pipeline worker
  - cross-review 結尾 → enqueue structure-chapters；synthesis（Arthur）讀 Victoria 輸出 + enqueue integrate-chapters
  - Oscar（recommendation）precondition 驗 integrate_chapters artifact
  - export 純渲染：讀 integrate_chapters artifact 傳 preBuiltChapters，跳過 Cloud Run inline call
  - issue-tree 雙階段：Eric（issueTreePrefix）拆解問題 → 配兵官（issueTreeSuffix）從選單指派 workerType
  - tsc + build 全過 + commit v0.11.3.001 + push + Cloud Run deploy（revision 00023-58v）

### 同日稍早（上個 session）
- ailiveX walking skeleton Phase 0-7 全通（dialogue + doc-worker + Cloud Tasks + GCS）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/cloud-run/research-worker/src/index.ts` | handleStructureChapters + handleIntegrateChaptersPipeline + 新 routes；enqueue 鏈調整 |
| `macs-platform/lib/firestore/types.ts` | 新增 CaseStatus（structure_chapters_running / integrate_chapters_running）+ ArtifactType（structure_chapters / integrate_chapters）|
| `macs-platform/app/api/workers/recommendation/route.ts` | Oscar precondition 驗 integrate_chapters |
| `macs-platform/app/api/workers/export/route.ts` | 讀 integrate_chapters → preBuiltChapters 純渲染 |
| `macs-platform/lib/report/builder.ts` | preBuiltChapters fast path；export AnalysisChapter type |
| `macs-platform/lib/pipeline/issueTree.ts` | Eric + 配兵官雙階段（EricIssueTreeSchema + 兩次 callStructured + usage 加總）|

---

## 下一步（接棒第一件能直接動手）

**新起一個 Mode 1 測試案，從頭跑到 done，確認新管線正確。**

1. 在 https://macs-platform.vercel.app 新建 Mode 1 案件
2. 跑到 cross-review 完成後，Firestore 確認 `structure_chapters` artifact 已存入
3. 繼續跑到 integrate-chapters 完成，確認 `integrate_chapters` artifact 已存入
4. 繼續跑到 done，確認 export HTML 正確
5. 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_status.mts <caseId>`

**踩雷備忘**：MACS admin API 認證用 `ADMIN_PASSWORD="dm28224038"` 當 Bearer token。

---

## 卡住 / 未解

- 新管線 e2e 未有真案跑過（code + build + deploy 全過，但 LLM 輸出未驗）
- Cloudflare API token 外洩待撤銷（延宕多 session）
- ailiveX 尚未 git init + push 到 GitHub

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| MACS 管線新結構 | `cloud-run/research-worker/src/index.ts`（handleStructureChapters / handleIntegrateChaptersPipeline）|
| MACS worker harness | `macs-platform/lib/workers/harness.ts` |
| MACS 案件狀態查詢 | `macs-platform/scripts/_status.mts <caseId>` |
| MACS admin 認證 | Bearer `ADMIN_PASSWORD`（值 dm28224038），非 ADMIN_PW |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-07 · 築*
