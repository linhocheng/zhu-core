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
- **zhu-core**：`~/.ailive/zhu-core/`（git repo，有 remote）
- **MACS 平台**：`~/.ailive/macs-platform/`（git 本地，**無 remote**）；prod https://macs-platform.vercel.app
  - ⚠️ MACS 跟 ANEWS/moumou **共用 GCP `moumou-os` Firestore**。MACS 已隔離到**專屬 named DB `macs`**；ANEWS/moumou 在 `(default)`。改 MACS 絕不碰 ANEWS。

---

## 最新完成（2026-05-31，全日多場次累積）

- **MACS 獨立化上線並驗證**：① 專屬 Firestore named DB `macs`（隔離 ANEWS/moumou 共用的 default DB；改 `lib/firestore/admin.ts` + Cloud Run `firestore.ts` 兩個 init 點，env `FIRESTORE_DB_ID` default `"macs"`）② prompts 抽 `lib/llm/defaults.ts` 單一真相源 ③ **settings/roles 活中台**（魂/prompt 線上編、11 worker + Cloud Run runtime 讀、60s cache、缺值 fallback、分析師名冊鎖死）。
- **套滿人設**：9 大決策角色內閣（亞當/埃里克/亞瑟/奧斯卡/漢斯/維克多/老馬克斯/克萊兒/維多利亞，v0.3.0.004）+ 6 分析師（雷格/蕾拉/影/埃文/戴維/墨菲，v0.3.0.003）寫進 DEFAULT_PROMPTS / DEFAULT_ROLE_FRAMING。
- **報告模板補齊**（v0.4.0.001）：背景章 / 路線圖獨立章 / 風險紅隊章 / 證據誠實度 + 資料來源附錄。
- **跑通真案**：臻品植萃、太肯（皆舊模板、default DB、done）；**青田茶業**（case-mptmphf0-ff3k7z，新模板、macs DB、done、repair=6、reportHtml 79,662 字、partnerVerdict=revised）。
- **research 上 Cloud Run + 跨專案修復**：燒 key 雷已解（research 不在 Vercel）。青田踩「plan superseded」真因 = worker SA 指錯專案讀錯 Firestore（真相分裂）+ `--update-secrets` 重用舊 image 讀 default DB。建 `macs-firebase-sa`（moumou-os SA）+ grant + **從 source 重 build** → revision `macs-research-worker-00003-lqh`（活、URL 對）。
- **2 根韌性修（已上 prod，未 commit）**：synthesis `drawsFrom: z.array().default([])`（缺 tag 不毀整份）；evidence-alignment pass 改快取成單一 call（防 bridge 524 retry 風暴）。

---

## 今天改了哪些檔案

| 檔案 / 資源 | 改了什麼 | 狀態 |
|---|---|---|
| `lib/firestore/admin.ts` + `cloud-run/research-worker/src/firestore.ts` | 切 named DB `macs`（env 可覆寫） | commit v0.3.0.001 |
| `lib/llm/defaults.ts` | 13 prompt 單一真相源 + 9 內閣人設 | v0.3.0.001/004 |
| `lib/llm/defaults.ts`（ROLE_FRAMING）| 6 分析師人設 | v0.3.0.003 |
| `lib/settings/roles.ts` + `app/api/settings/roles/route.ts` + `app/dashboard/settings/page.tsx` | 活中台 reader + API（isAdmin gate + 伺服器名冊鎖死）+ 編輯頁 | v0.3.0.001/002 |
| 11 worker（briefIntake…reportBuilder）+ `lib/llm/soul.ts` | 改讀 `getRoleSettings()`，withSoul 收 soul 參數 | v0.3.0.001 |
| `cloud-run/research-worker/src/index.ts` | runtime 讀 macs DB settings/roles 的 soul+research | v0.3.0.001 |
| `lib/report/*` | 報告模板補齊（背景/風險/附錄章） | v0.4.0.001 |
| `lib/llm/synthesis.ts` + `app/api/workers/synthesis/route.ts` | drawsFrom default + evidence-alignment 快取 | **未 commit（prod 已上）** |
| GCP `macs-firebase-sa` secret + research worker `00003-lqh` | SA 指對 moumou-os + 從 source 重 build | 已上 prod |
| scratch `scripts/_*.mjs`、`cloud-run/research-worker/inspect-db.mjs`、`scripts/monitor-case.mjs`、`scripts/verify-roles-live.mts` | 監控/驗證腳本 | untracked，待清/留 |

> git HEAD：`v0.4.0.001`。未提交：synthesis.ts + synthesis/route.ts（2 根韌性修）+ 一票 scratch `_*.mjs`。

---

## 下一步（接棒第一件）

1. **Adam 待決：MACS 後台補「Pipeline 參數」tab**（= DNA-2）。把寫死的 fullAuto / 三關 skipGate / workstream 數 / 門檻搬上後台，活中台規矩：每顆旋鈕當場驗哪個 worker runtime 讀它，讀不到不上架。參照 `~/.ailive/anews-platform/app/dashboard/settings/page.tsx` + `app/api/settings/{pipeline,qa-checks}/route.ts`。**Adam 說「先問」，沒說動手前不要建。**
2. **housekeeping**：commit synthesis.ts + route.ts 兩根修（真相分裂小尾巴：prod 有、git 無）；清 scratch `scripts/_*.mjs` + `inspect-db.mjs`。
3. **bridge 524 根因（待決，勿自行動）**：synthesis 級大 prompt 撞 Cloudflare ~130s。已用快取+單 call 緩解，根因要動共用 bridge VM（Sonnet --effort low / 拉 timeout）——先問 Adam。

驗刀（本機走 bridge 不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。
活中台驗（不燒 key）：`… tsx scripts/verify-roles-live.mts`（7/7：寫 override → reader 讀回 → 名冊 fallback）。
讀現場：node 腳本用 `getFirestore(app, "macs")` 讀 named DB；別忘了 ANEWS/moumou 在 `(default)`。

---

## 卡住 / 未解

- **太肯 case-mptjw3s5-9osvkx 是死案**：research_running 但 dossiers=0、凍結 ~4.6 小時、無 repair。應是跨專案 SA bug 修好前的犧牲者。**沒在燒**（佇列 maxAttempts=3 早耗盡）。接棒可放生/刪或重交付，**別貿然 resume**（先確認再動）。注意別跟 default DB 那個已 done 的太肯 case-mptgza2o-sepqlq 搞混。
- **2 根韌性修 prod-only 未 commit** = 真相分裂小尾巴，下次手滑改 synthesis 會蓋掉。
- **bridge 524**：synthesis 大 prompt 撞 Cloudflare ~130s，根因未解（已緩解）。
- macs-platform 無 git remote，commit 推不出去——Adam 待決 remote 放哪。

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
| **MACS 平台** | `~/.ailive/macs-platform/`（prod macs-platform.vercel.app；後台 /dashboard + /dashboard/settings；密碼 env `ADMIN_PASSWORD`）|
| **MACS 活中台** | `lib/settings/roles.ts`（reader）/ `lib/llm/defaults.ts`（真相源）/ `app/dashboard/settings`（UI）|
| **MACS research worker** | `~/.ailive/macs-platform/cloud-run/research-worker/`（Cloud Run，web_search 唯一真相，讀 macs DB）|
| **ANEWS 部署參照** | `~/.ailive/anews-platform/`（settings 三層 + cloud-run/source-worker 範本）|
| MACS 報告產出 | `~/Downloads/MACS/`（青田/臻品 report.html）|

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-31 對齊現場場 · 築*
