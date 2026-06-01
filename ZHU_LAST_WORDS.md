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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，對外 `https://bridge.soul-polaroid.work`，behind Cloudflare ~130s 邊緣超時 = 524）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git，有 remote）
- **ANEWS 平台**：`~/.ailive/anews-platform/`；prod https://anews-platform.vercel.app；source worker 在 Cloud Run **zhu-cloud-2026**（asia-east1），Firestore 在 moumou-os `(default)`。
- **MACS 平台**：`~/.ailive/macs-platform/`（git 本地，**無 remote**）；prod https://macs-platform.vercel.app；Firestore named DB **`macs`**（與 ANEWS/moumou 的 default 隔離）；research+cross-review 在 Cloud Run `macs-research-worker`（zhu-cloud-2026）。

---

## 最新完成（2026-06-01 下午場 · ANEWS source A/B 雙管道）

- **B 管道後端＋前端全寫完並上線**：source 步驟加第二條管道。A=Haiku 直連 Anthropic web_search（付費 key，唯一 pay-per-use）；B=Max 生查詢→真 Tavily 免費搜→Max 綜述（走 bridge）。**per-issue 建立時選，預設 A**，兩條並行，B 失靈 A 照用。
- 程式：`cloud-run/source-worker/src/{schema,tavily,index}.ts`（schema 抽共用、provider 分支）+ `app/api/editorial-jobs/route.ts`（寫 sourceProvider）+ `app/dashboard/page.tsx`（A/B radio）。兩邊 typecheck exit=0。
- 部署：Cloud Run 從 source 重 build → `anews-source-worker-00009-f9k`，health 200；新 secret TAVILY_API_KEY + grant SA + 掛 BRIDGE_URL/SECRET/TAVILY；Vercel anews-platform 也 deploy 過。
- **needs_repair 不 fallback 設計實戰驗證 ✅**：B 失敗時沒偷燒付費 key。

### 早上/上午場 · MACS dir2 對質一輪 + 成本 + Cloud Run 硬化（已全 commit 乾淨）
- **dir2 對質一輪上線並驗有效**：barrier 收斂 → cross-review（各分析師看別人發現、修訂一次、攤矛盾、禁磨鈍）→ synthesis 收尾。真案 tension map 直接點名 Murphy/Evan/Kage，洞察更尖沒鈍。
- **對質搬 Cloud Run（零停頓硬化）**：N 趟序列 bridge 在 Vercel 撞 300s 卡死 → 搬 Cloud Run（research-worker 同 service 加 endpoint）。skip-done + reconciler 自癒雙保險。
- **research 真實成本計算**：Cloud Run 取 usage 算 costUsd，dashboard 列表 $badge + 詳情明細，一案 ≈ $1。
- **已 commit**：`v0.6.0.001`（成本顯示）+ `v0.7.0.001`（dir2+CloudRun+成本捕捉）。working tree 只剩 scratch。**先前「11 檔未提交」風險已解除。**

---

## 今天改了哪些檔案（下午場 · ~/.ailive/anews-platform，已部署 prod）

| 檔案 / 資源 | 改了什麼 |
|---|---|
| `cloud-run/source-worker/src/schema.ts` | 新：SourceDossierSchema + CollectInput/Result 抽共用 |
| `cloud-run/source-worker/src/tavily.ts` | 新：B 三段（Max 生查詢→Tavily→Max 綜述）+ Zod + 幻覺 URL 過濾 |
| `cloud-run/source-worker/src/index.ts` | 抽 collectViaAnthropic + provider 分支 + artifact 記 provider |
| `app/api/editorial-jobs/route.ts` | body 取 sourceProvider 寫進 issue doc |
| `app/dashboard/page.tsx` | 新建表單加 A/B radio（預設 A）|
| Cloud Run + Vercel | source-worker 00009-f9k；TAVILY_API_KEY secret；anews-platform prod deploy |
| memory `reference_anews_source_worker_deploy.md` | 新：部署拓樸 + A/B 設計（已進 MEMORY.md）|

> 計畫定稿：`~/.ailive/anews-platform/SOURCE_B_PIPELINE_PLAN.md`。

---

## 下一步（接棒第一件）

1. **Adam 要先調一條「支線」**（這場結束時他轉去處理的另一條，先問他是哪條再動）。
2. **ANEWS B 綜述修穩**：首跑兩篇 source 各掛——一篇 `bridge 524`（撞 CF ~130s）、一篇 `B_PARSE_ERROR` JSON 截斷（疑 Sonnet extended thinking 吃 output budget）。建議先試 **②綜述加 --effort low + Tavily max_results 砍量**（輕、不碰共用 bridge）；不夠再 **①繞 CF 直連 bridge VM IP**（動共用基建，要先問 Adam）。改 `cloud-run/source-worker/src/tavily.ts` 的 bridgeCreate / max_results。修好重跑一個 B issue 驗 provider=B + 下游。
3. **決定刪 needs_repair 的 B issue `lLFmHhF00JfbBGUqrfbt`**（佔一期鎖）。
4. **MACS 後續**（那批已 commit v0.6/v0.7，風險解除）：① 真案驗 A5 零停頓（開 ~5 條工作流真案，確認 Cloud Run 對質一次跑完不卡 300s，bridge-from-CloudRun 實 revise 尚未真案驗，~$1）② dir1 整合撰稿(#35)③ #36 對質中狀態+閃爍燈。

驗刀（本機不燒錢）：MACS `cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。

---

## 卡住 / 未解

- **ANEWS B 綜述跳不穩**：bridge 524（latency 逼近天花板，harness 109.5s 壓線過、prod 真量翻過）+ JSON 截斷。計畫 §5「撞到再處理」的點，已撞，待修（見下一步 2）。
- 本機 `.env.local` WORKER_SECRET/BRIDGE_SECRET 跟 prod 漂移（已證實不同）；要戳 prod worker 用 `vercel env pull` 的值，別用本機那把。
- MACS A5 bridge-from-Cloud-Run 未真案驗（管道驗過 health200/route401）；dir1(#35)/#36 未做。MACS 仍無 git remote。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 / 劍法 | `NORTH_STAR.md` / `ZHU_BOOT_SOP.md` / `docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新 ANEWS A/B 段）|
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-01.md`（L1-L4 MACS dir2/Vercel300s｜L5-L7 ANEWS A/B）|
| **MACS 對質+research** | `cloud-run/research-worker/src/index.ts`（Cloud Run，bridge對質+web_search）｜活中台 `lib/settings/{roles,pipeline}.ts` + `app/dashboard/settings` |
| 當機救援 | 這份 |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| **ANEWS 平台** | `~/.ailive/anews-platform/`（B 計畫 SOURCE_B_PIPELINE_PLAN.md；source worker cloud-run/source-worker）|
| **ANEWS 部署拓樸** | memory `reference_anews_source_worker_deploy.md` |
| **MACS 平台** | `~/.ailive/macs-platform/`（prod macs-platform.vercel.app）|
| **MACS 管線編排** | `lib/orchestration/barrier.ts`（fan-out→barrier→cross-review→synthesis）|

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-01 ANEWS A/B 場 · 築*
