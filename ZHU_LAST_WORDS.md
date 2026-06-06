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
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app，git remote github.com/linhocheng/macs-platform
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`（rev 00022）
- **ANEWS source-worker（Cloud Run）**：`anews-source-worker` · asia-east1 · project `zhu-cloud-2026`（rev 00014）

---

## 最新完成（2026-06-06 早場）

- 後台「部門魂」假中台修復：新增 `roleModeSurface(mode)` 單一真相源，角色魂 Mode 1/2/3 三模式全可編輯，`v0.11.1.001` 推上 origin
- Tavily 三 key 輪用（MACS research + ANEWS source）：hash 分配 + 429/432 自動 fallover，Secret Manager TAVILY_API_KEY_1/2 已存 + IAM + Cloud Run 注入
- needs_repair 案子（case-mq0ykq5y）診斷（額度爆非資料稀少）→ 修復到 done
- Skill 新增：`~/.ailive/zhu-core/skills/macs-add-tavily-key.md`（六步 SOP）
- `scripts/_repair-case.mts` 修正 overrideBaseUrl 漏傳 bug

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/settings/roles.ts` | 新增 `roleModeSurface(mode)` + `getRoleSettings` 收斂三分支 |
| `macs-platform/app/api/settings/roles/route.ts` | GET/PUT 加 `?mode=` 參數，per-mode doc+keys |
| `macs-platform/app/dashboard/settings/page.tsx` | RolesTab 三觀點切換器 + Mode 3 標籤 |
| `macs-platform/cloud-run/research-worker/src/index.ts` | `getTavilyKeys()` + hash 分配 + 429/432 fallover |
| `macs-platform/scripts/_repair-case.mts` | 修正 overrideBaseUrl 漏傳（送 Vercel 404 bug）|
| `anews-platform/cloud-run/source-worker/src/tavily.ts` | 同輪用邏輯移植 |
| `zhu-core/skills/macs-add-tavily-key.md` | 新增 key 六步 SOP |

---

## 下一步（接棒第一件能直接動手）

**先跑 Mode 1 真案驗新設計 + Cloud Run synthesis JSON 修復穩定。**

1. **跑 Mode 1（market_evidence）真案到 done**：
   - 建案：`curl -X POST https://macs-platform.vercel.app/api/cases -H "authorization: Bearer $ADMIN_PW" -d '{"clientProblem":"...","businessContext":"...","decisionPurpose":"...","strategyMode":"market_evidence","fullAuto":true}'`
   - 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_status.mts <caseId>`
2. **commit macs-platform cloud-run research worker 改動**（`cloud-run/research-worker/src/index.ts` 還沒入 git）：
   - `cd ~/.ailive/macs-platform && git add cloud-run/research-worker/src/index.ts scripts/_repair-case.mts && git commit -m "v0.11.1.002 — 新增：research worker Tavily 三 key 輪用 + repair 腳本修正"&& git push`
3. **5C 架構**：`lib/frameworks/contract.ts` 加 `buildReport(ctx)`；hybrid + Mode 1 章節從 `lib/report/builder.ts` 搬進各框架 report.ts。

---

## 卡住 / 未解

- macs-platform `cloud-run/research-worker/src/index.ts` 改動**尚未 commit**（只有 Cloud Run deploy，git 裡還是舊版本）。
- 5C 未動（Mode 1/2 章節還在 builder.ts 的 if(mode)）。
- Mode 1/2 新設計未 live 驗（渲染共用理論自動套，但沒真案跑過）。
- 篇幅旋鈕只 Mode 3 全通（Mode 1/2 + Cloud Run 未接）。
- Cloudflare API token 外洩待撤銷（延宕多 session）。
- ANEWS source-worker 改動（tavily.ts）未 commit（ANEWS 不是 git repo，只靠 Cloud Run deploy + WORKLOG）。

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
| Tavily key 新增 SOP | `~/.ailive/zhu-core/skills/macs-add-tavily-key.md` |
| MACS 後台三模式 roles | `macs-platform/lib/settings/roles.ts` + `roleModeSurface()` |
| repair 案子腳本 | `macs-platform/scripts/_repair-case.mts`（必帶 RESEARCH_WORKER_BASE_URL）|

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-06 · 築*
