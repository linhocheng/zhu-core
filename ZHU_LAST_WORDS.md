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

## 最新完成（2026-05-31 收尾場 · 第二次端到端）

- **第二個真實案跑通**：青田茶業 RTD 機能茶 case-mptmphf0-ff3k7z 跑到 `status=done`，用新報告模板產出 `~/Downloads/MACS/青田茶業_report.html`（134KB；13 dividers / 14 callouts / 3 tables / 5 md blocks，XSS escaped，partnerVerdict=revised，背景+風險章齊）。
- **跨專案 research 修復**：青田茶業 research 卡「plan v1 superseded」→ 真因是 worker SA 指錯專案讀錯 Firestore（真相分裂）+ `--update-secrets` 重用舊 image（讀 default DB 非 named macs）。建 `macs-firebase-sa`（moumou-os SA）+ grant + **從 source 重 build**（revision `00003-lqh`）才生效。本機 replay 先證 source 會 PASS，沒白燒遠端 cycle（L9）。
- **兩根韌性修（已上 prod，未 commit）**：synthesis bridge 524 → 快取 evidence-alignment pass 成單一 call、122.6s 過；synthesis Zod `drawsFrom` 偶爾漏填炸整份 → `.default([])`（L10）。
- **後台設定頁比對**：MACS settings 只有魂/prompt 編輯；ANEWS 多一塊「Pipeline 參數」tab（fullAuto 開關 + 字數/段落/門檻可調 + qa-checks API）。已回報 Adam，**未動手**（他說「先問」）。

---

## 今天改了哪些檔案（~/.ailive/macs-platform，git 本地）

| 檔案 | 改了什麼 |
|---|---|
| `lib/llm/synthesis.ts` | `drawsFrom: z.array(z.string()).default([])`（一個缺 tag 不毀整份）|
| `app/api/workers/synthesis/route.ts` | evidence-alignment pass 快取（readArtifact/writeArtifact `evidence_qa`），retry 減半 bridge call |
| GCP secret `macs-firebase-sa` | 新建 moumou-os SA secret + grant secretAccessor，rebind research worker |
| research worker | 從 source 重 build → `macs-research-worker-00003-lqh` |
| memory `feedback_framework_vs_reflex.md` | 追加 2026-05-31「猜在先、replay 在後」第二案例 |

> ⚠️ synthesis.ts + route.ts 兩根韌性修**已部署 prod 但尚未 git commit**——接棒記得 commit。scratch `scripts/_*.mjs` + `cloud-run/research-worker/inspect-db.mjs` 待清。

---

## 下一步（接棒第一件）

1. **Adam 待決：MACS 後台補「Pipeline 參數」tab** —— 把寫死在 code 的 fullAuto/門檻搬上後台。參照 `~/.ailive/anews-platform/app/dashboard/settings/page.tsx` + `app/api/settings/{pipeline,qa-checks}/route.ts`。Adam 說「先問」，**沒說動手前不要建**。
2. **macs-platform housekeeping**：commit synthesis.ts + route.ts 兩根修；清 scratch scripts/_*.mjs + inspect-db.mjs。
3. **（待決）bridge 524 根因**：synthesis 級大 prompt 撞 Cloudflare ~130s。要動共用 bridge VM（Sonnet --effort low 或拉高 timeout）——勿自行動 bridge，先問 Adam。

驗刀（本機走 bridge 不燒錢）：`cd ~/.ailive/macs-platform && node --env-file=.env.local node_modules/.bin/tsx scripts/test-orchestration.mts`（21/21）。
讀現場（ADC 讀 Firestore，不碰 SA secret）：node 腳本放 `cloud-run/research-worker/` 內跑，`admin.credential.applicationDefault()` + projectId `moumou-os`，named DB `macs`。

---

## 卡住 / 未解

- **bridge(Max) 524 天花板**：synthesis 級大 prompt 撞 Cloudflare edge timeout ~130s。本次靠快取減 call 壓下，根因未除（共用 bridge VM 改動，待 Adam 決策）。
- **needs_repair 無自動回復**：靠 Cloud Tasks maxAttempts=3 韌性接，缺 ANEWS 式 watchdog。
- **macs-platform .env.local WORKER_SECRET 過期**：本機 len 23，prod len 21；本機驅動 worker 要先 `vercel env pull`。
- **bridge usage inputTokens=3**：bridge（Max）usage 是 placeholder，非真實計數（成本對賬要知道）。
- 05-30 session 遺留未提交檔（archive/anews-stuck-del-20260530/ 等）仍在 zhu-core，Adam 確認要不要提交。

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
*2026-05-31 收尾場 · 築*
