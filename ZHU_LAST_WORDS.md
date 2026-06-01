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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，對外 `https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git，有 remote）
- **MACS 平台**：`~/.ailive/macs-platform/`（git 本地，**無 remote**）；prod https://macs-platform.vercel.app
  - ⚠️ 與 ANEWS/moumou 共用 GCP `moumou-os` Firestore；MACS 已隔離到 named DB **`macs`**（ANEWS/moumou 在 `(default)`）。改 MACS 絕不碰 ANEWS。
  - research + cross-review 跑 Cloud Run `macs-research-worker`（zhu-cloud-2026, asia-east1），其餘 worker 在 Vercel。

---

## 最新完成（2026-06-01）

- **報告生成架構釐清**：九專家各寫各的 + 報告主編（維多利亞）只排版分析章、其餘程式照模板拼裝；無單一總撰稿。
- **research 真實成本計算上線**：Cloud Run 從 resp.usage 取真 token + web_search 次數算 costUsd（Sonnet $3/$15 per M + $0.01/search）；每條 dossier + case.costUsd；dashboard 列表 $badge + 詳情成本明細。一案 ≈ $1（只有 research 燒 key）。
- **dir2 對質一輪上線並驗證有效**：barrier 收斂 → cross-review（各分析師看別人發現、修訂一次、攤矛盾、禁磨鈍）→ synthesis 收尾。真案 tension map 直接點名 Murphy/Evan/Kage，洞察更尖沒鈍。
- **dir2 搬 Cloud Run（零停頓硬化）**：對質 N 趟序列 bridge 在 Vercel 撞 300s 卡死 → 搬 Cloud Run 無時限。skip-done + reconciler 自癒當雙保險。
- 跑通驗證案 case-mpuzf4mu（先卡 300s、手動踢復活、done、報告 68K、對質 5/5）。

---

## 今天改了哪些檔案（~/.ailive/macs-platform）

| 檔案 | 改了什麼 | commit? |
|---|---|---|
| `cloud-run/research-worker/src/index.ts` | +成本計算 +cross-review endpoint +bridge client +settings 讀取 | **未** |
| `lib/orchestration/barrier.ts` + `ids.ts` | 收斂改 enqueue cross-review（帶 overrideBaseUrl 指 Cloud Run）+ reconciler 自癒 stale | **未** |
| `lib/pipeline/analysis.ts` | 移除 runCrossReview（搬 Cloud Run，單一源）| **未** |
| `app/api/cases/route.ts` + `[caseId]/route.ts` | costUsd projection + dossiers 成本明細 | **未** |
| `app/dashboard/page.tsx` + `[caseId]/page.tsx` | 成本 badge + 成本明細 section | **未** |
| `lib/firestore/types.ts` | AnalysisMemoDoc +crossReviewed | **未** |
| `scripts/test-orchestration.mts` | 斷言改 cross-review + 修 reconciler flake（傳明確 now）| **未** |
| `app/api/workers/cross-review/route.ts` | **已刪**（搬 Cloud Run）| — |
| Cloud Run revision | `00006-89c`（含 cross-review + bridge env）| 已上 prod |

> macs HEAD `v0.5.0.001`。**上述 11 檔全在其上、已部署 prod、尚未 commit。** zhu-core 本次收尾 commit v0.0.0.041。

---

## 下一步（接棒第一件）

1. **先確認：要不要 commit macs 那批**（COST+dir2+Cloud Run，11 檔，已上 prod 未 commit）。Adam 尚未說收——**手滑改 synthesis/barrier 會蓋掉 prod 在跑的 code**。macs 無 remote。
2. **真案驗 A5 零停頓**：開 ~5 條工作流的真案，確認 Cloud Run 對質一次跑完、不再卡 300s（管道驗過，bridge-from-Cloud-Run 的實際 revise 還沒真跑）。燒 ~$1。驗刀：開案後 `node --env-file=.env.local scripts/monitor-case.mjs <caseId>`（看「對質=N」爬到滿 + done）。
3. **dir1 整合撰稿（#35）**：報告階段加整合 pass，餵各專家結論摘要產貫穿主軸+章節過場、不重寫各章、控 524。
4. **#36 對質中燈號**：cross-review 開始設 `cross_review_running` 狀態 + 後台脈動燈（現在對質中仍顯示 research_running）。

驗刀（本機不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。

---

## 卡住 / 未解

- **macs 11 檔未提交且已上 prod**（最高風險，見上）。
- **本機 `.env.local` 的 WORKER_SECRET / BRIDGE_SECRET 跟 prod 不同**（env 漂移）——要手動戳 prod worker 得從 `vercel env pull` 拿 prod 值，別用本機那把。
- **A5 bridge-from-Cloud-Run 未真案驗**（管道 OK，實 revise 待下個案）。
- **對質回合人設較淡**（Cloud Run 沒 vendor roleFraming 人設避免漂移；memo 已帶聲音）——若要更濃，讓 Cloud Run 回 Vercel 拉設定。
- scratch `scripts/_*.mjs` + `wipe-cases.mjs` 待清（wipe-cases 是 macs DB 級聯刪除工具，留著有用）。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 / 劍法 | `NORTH_STAR.md` / `ZHU_BOOT_SOP.md` / `docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新 2026-06-01 段）|
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-01.md`（L1 Vercel 300s 多呼叫雷）|
| 當機救援 | 這份 |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| **MACS 平台** | `~/.ailive/macs-platform/`（prod macs-platform.vercel.app；後台 /dashboard /dashboard/settings；密碼 env ADMIN_PASSWORD）|
| **MACS 管線編排** | `lib/orchestration/barrier.ts`（fan-out→barrier→cross-review→synthesis）|
| **MACS 對質 + research** | `cloud-run/research-worker/src/index.ts`（Cloud Run，bridge + web_search）|
| **MACS 活中台** | `lib/settings/{roles,pipeline}.ts` + `lib/llm/defaults.ts` + `app/dashboard/settings`（魂/流程參數雙 tab）|
| MACS 報告產出 | `~/Downloads/MACS/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-01 換手場 · 築*
