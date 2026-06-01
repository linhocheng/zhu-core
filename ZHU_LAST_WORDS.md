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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING。`claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`（Cloudflare ~130s 邊緣超時 = 524）。**bridge listening :3001**（不是 8080）。SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`。bridge index.js 不在 git，改它要備份+grep驗+restart，**可手動回退**（備份在 VM `~/claude-bridge/index.js.bak-*`）。
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git，有 remote）
- **ANEWS 平台**：`~/.ailive/anews-platform/`；prod https://anews-platform.vercel.app；source worker 在 Cloud Run **anews-source-worker**（專案 **zhu-cloud-2026**，asia-east1），Firestore 在 moumou-os `(default)`。WORKER_SECRET 明文 env `anews-dev-secret-2026`。
- **MACS 平台**：`~/.ailive/macs-platform/`（git 本地，**無 remote**）；prod https://macs-platform.vercel.app；Firestore named DB **`macs`**（隔離）；research+對質在 Cloud Run `macs-research-worker`（zhu-cloud-2026）。

---

## 最新完成（2026-06-01 晚場 · ANEWS B 線除錯打通）

- **B 線打通並乾淨 e2e 驗收 ✅**：新 B 案「美國公佈UFO檔案」main+sub_a 第一次就 source_ready（零重試）、provider 全程 B、**付費 web_search key 零燒**、全鏈路跑到 done、2 篇報告生成（cost $0.07 純圖片）。
- **修了三層真因（lastword 全錯，現場校正詳見 LESSONS L8-L12）**：
  1. **bridge `/v1/messages` 漏 `--effort low`**（另兩條 endpoint line 48/949 都有）→ extended thinking 吃 output budget → 長綜述截斷。補上、PONG 驗、MACS 同享。
  2. **auto-kick branch 0 重送 source 漏 `SOURCE_WORKER_BASE_URL` override** → 把 B 案重踢去 Vercel 舊 A-only worker → 偷跑 A 燒 key + needs_repair 死循環。補 override。
  3. **B 綜述把 Tavily 原始片段照貼進 snippet → 未跳脫引號 → JSON 爆**（position 每次不同=語法壞非截斷）。prompt 命模型改寫不照貼 + 強制跳脫。改完 main 一次過。
  4. **Cloud Run source worker 失敗不更新 article 狀態 = 假中台** → 補升級 needs_repair（達門檻 park）。
- 部署：Cloud Run rev 00011-8b2；Vercel prod；bridge restart。

### 前情（同日早/午場，已 commit 在 zhu-core）
- MACS dir2 對質一輪 + 成本計算 + Cloud Run 硬化（v0.6.0.001 / v0.7.0.001）。
- ANEWS A/B 雙管道上線（A=Anthropic web_search 付費；B=Tavily+Max bridge $0）。

---

## 今天改了哪些檔案（晚場 · ~/.ailive/anews-platform，**未 commit**，prod 已部署）

| 檔案 / 資源 | 改了什麼 |
|---|---|
| `cloud-run/source-worker/src/tavily.ts` | 綜述 prompt 改寫不照貼+強制跳脫；parse 失敗診斷 log |
| `cloud-run/source-worker/src/index.ts` | 失敗升級 repairAttempts→needs_repair（修假中台+止燒key） |
| `app/api/cron/auto-kick/route.ts` | branch 0 重送 source 補 Cloud Run override |
| bridge VM `~/claude-bridge/index.js` | `/v1/messages` 補 `--effort low`（不在 git，有備份） |
| zhu-core | LESSONS_2026-06-01 加 L8-L12；WORKLOG 晚場段 |

> ⚠️ ANEWS working tree 未提交：19 檔（Wave1 single-write + Wave2 A/B）+ 今天四修。**Adam 判定不 commit、保留，勿 `git checkout .`/`stash drop`。**

---

## 下一步（接棒第一件）

1. **可選：收 ANEWS 未提交 tree**——刪 Vercel 舊 A-only `app/api/workers/source/route.ts`（死副本，真相分裂），把那包（Wave1+Wave2+晚場四修）拆 commit。要先問 Adam 怎麼 commit（他之前判定保留）。
2. **MACS 真案驗 bridge effort-low 無副作用**（MACS 同享 /v1/messages，thinking 變淺，推測有益但未真案驗）。
3. **接回 MACS 主線**：① 真案驗 A5 零停頓（~5 工作流真案，Cloud Run 對質一次跑完不卡 300s，~$1）② dir1 整合撰稿(#35) ③ #36 對質中狀態+閃爍燈。

驗刀（不燒錢）：MACS `cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。ANEWS 查 issue：`node scripts/_zhu_recent_issues.mjs`。

---

## 卡住 / 未解

- ANEWS Vercel 舊 source route 是過時 A-only 死副本，本該刪未刪（標記）。
- ANEWS working tree 未提交（深，prod/git 真相分裂，Adam 刻意保留）。
- bridge effort-low 對 MACS 副作用未真案驗。
- MACS 仍無 git remote；A5 bridge-from-CloudRun 真案驗 / dir1(#35) / #36 未做。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 / 劍法 | `NORTH_STAR.md` / `ZHU_BOOT_SOP.md` / `docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-01.md`（L1-L7 MACS/A B｜L8-L12 ANEWS B 除錯）|
| 當機救援 | 這份 |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| **ANEWS 部署拓樸** | memory `reference_anews_source_worker_deploy.md` |
| **bridge endpoint 一致性** | memory `reference_bridge_v1messages_effort.md` |
| MACS 管線編排 | `~/.ailive/macs-platform/lib/orchestration/barrier.ts` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-01 ANEWS B 線除錯場 · 築*
