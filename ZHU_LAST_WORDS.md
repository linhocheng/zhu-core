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

## 最新完成（2026-05-31 深夜場）

- **MACS 端到端首次跑通**：臻品植萃案 case-mpt5ki7f-zjc4jo 跑到 `status=done`，全鏈路產出顧問報告（reportMarkdown/Html/slide outline/onePage summary/partnerVerdict + 5 artifacts）。
- **錢 bug 修好**：research(web_search) 搬上 Cloud Run（鏡 anews source-worker），跑 532s（遠超 Vercel 300s 上限，證明非搬不可）、單 dispatch、零重試燒 key。
- **抓到真因不是 research**：所有 LLM 階段早就 ok，卡關是 `lib/workers/trace.ts` 觀察層遇 undefined 欄位同步拋錯、把健康 case 誤打成 needs_repair。修了根因（剝除 undefined + 同步防護層）。
- **清死 code**：刪 Vercel 的 research route + lib/pipeline/research.ts（真相分裂風險），研究單一真相來源現在只剩 Cloud Run worker。

---

## 今天改了哪些檔案（全在 ~/.ailive/macs-platform，git 本地，無遠端）

| 檔案 | 改了什麼 |
|---|---|
| `cloud-run/research-worker/*` | 新建整個 Cloud Run worker（express+tsx，vendored firestore/cloudTasks/idempotency + 直連 API key 跑 web_search；idempotency 用 MACS failed-可重入語意，不抄 ANEWS 舊 bug）|
| `lib/orchestration/enqueue.ts` | productionEnqueue 加 overrideBaseUrl 參數 |
| `app/api/workers/issue-tree/route.ts` | research enqueue 帶 RESEARCH_WORKER_BASE_URL（空→fallback Vercel，dev 大聲壞）|
| `vercel.json` | functions.maxDuration=300 |
| `lib/workers/trace.ts` | 修根因：writeWorkerTrace 剝 undefined + 同步防護 |
| 刪 `app/api/workers/research/route.ts` + `lib/pipeline/research.ts` | 死副本，端到端證明走 Cloud Run 後清掉 |

> Cloud Run worker URL：`https://macs-research-worker-754631848156.asia-east1.run.app`。6 個 macs-* 佇列 maxAttempts 已全設 3。
> zhu-core：LESSONS_2026-05-31.md 追加 L7/L8、WORKLOG 追加深夜場段。

---

## 下一步（接棒第一件）

1. **跑第二個全新 case 從 brief 進場**，驗證完整鏈路（這次只是重跑卡住的舊案，還沒驗過從頭 brief-intake 進場的全流程）。後台開新案：https://macs-platform.vercel.app（密碼見 Vercel env `ADMIN_PASSWORD`）。
2. **追 export schema-invalid blip 根因**（見卡住欄）。
3. **補 reference memory**：`reference_firestore_add_sync_throws_undefined`（Firestore .add 同步驗證拋錯陷阱，跨專案可複用）—— 被 reflex `solve_root_not_symptom` 規則誤觸擋下，Adam 跑 `zhu fp solve_root_not_symptom` 後我再寫。核心知識已進 project_macs_platform.md + LESSONS L7。
4. **Adam 待決**：macs-platform repo 遠端放哪（決定後才能 push）。

驗刀（本機走 bridge 不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。
讀現場（ADC 讀 Firestore，不碰 SA secret）：node 腳本放 `cloud-run/research-worker/` 內跑，`admin.credential.applicationDefault()` + projectId `moumou-os`。

---

## 卡住 / 未解

- **export schema-invalid blip**：重跑 export 時 05:02 出現一次 `schema invalid（expected string）`，maxAttempts=3 重試一次自己過了、case→done，但根因未查，可能偶發重現。
- **bridge usage inputTokens=3**：bridge（Max）回的 usage 是 placeholder，非真實 input token 計數（成本對賬時要知道）。
- **macs-platform git 無遠端**：本機 commit 推不出去，待 Adam 定 repo。
- 05-30 session 遺留未提交檔（archive/anews-stuck-del-20260530/ 等）仍在 zhu-core，非今晚的，Adam 確認要不要提交。

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
| **MACS 平台** | `~/.ailive/macs-platform/`（git 本地；上線 https://macs-platform.vercel.app；端到端已通）|
| **MACS research worker** | `~/.ailive/macs-platform/cloud-run/research-worker/`（Cloud Run，web_search 唯一真相）|
| **ANEWS 部署參照** | `~/.ailive/anews-platform/`（cloud-run/source-worker = web_search 範本）|
| MACS 報告設計稿 | `~/Downloads/MACS/`（styles.css + 範例 HTML）|

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-31 深夜場 · 築*
