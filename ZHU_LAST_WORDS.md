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
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`（rev 00019）

---

## 最新完成（2026-06-05 晚場 · Opus 4.8 · MACS Mode 3 + 設計系統 + JSON 根治）

- Mode 3（creative_lead/純創意）端到端落地：型別+全局憲法+13階段prompt → 10 run-fn + creativeLead 框架 → 全 route 接線 + 兩支新 Vercel route（cross-review/synthesis）→ barrier 唯一分岔點
- 報告篇幅後台旋鈕（精簡/標準/深入），確定性 tier→directive/scale 映射（守天條）
- 報告渲染換上 Adam 的設計參考（暖調經典襯線：Spectral + petrol + 古銅金 + 奶油暖白）；Mode 3 收編 ViewModel（8章）、刪 creativeDeck.ts → 一套設計三套章節
- **天條落地**：LLM 吐的 JSON 用程式確定性修復（jsonrepair，嚴格→修→再 parse），不 re-ask 模型；Vercel + Cloud Run 全 parse 點。研究「不是每次跑完」根治
- 真案兩跑到 done（含 Adam 親手開的 case-mpzmkh7u，零 failed，verdict=magic），全程 Max($0)

---

## 今天改了哪些檔案（macs-platform v0.11.0.001~008）

| 檔案 | 改了什麼 |
|---|---|
| `lib/firestore/types.ts` | Mode 3 介面 + ArtifactType +4 + conceptMemo |
| `lib/llm/defaults.ts` | CREATIVE_CONSTITUTION + 13 階段 prompt |
| `lib/pipeline/creativeLead.ts` | 10 支藍圖 run-fn（走 callCreative，篇幅旋鈕） |
| `lib/frameworks/creative-lead/{index,report}.ts` | 框架骨 + buildCreativeReport 8 章 |
| `app/api/workers/*/route.ts` | 各 route creative 分支 + 新增 cross-review/synthesis |
| `lib/orchestration/barrier.ts` | crossReviewBaseUrl(mode) 唯一分岔 |
| `lib/settings/pipeline.ts` + `lib/report/length.ts` + 設定頁 | 篇幅旋鈕 |
| `lib/report/{renderHtml,types}.ts` | 設計系統換皮 + figure block |
| `lib/llm/jsonLoose.ts` + `structured.ts` + `cloud-run/.../index.ts` | parseJsonLoose 確定性修復 |

---

## 下一步（接棒第一件能直接動手）

**先驗 Mode 1，再收 5C。**

1. **跑一個 Mode 1（market_evidence）真案到 done**：驗新設計在 Mode 1 + JSON 修復在 Cloud Run synthesis 也穩。
   - 建案：`curl -X POST https://macs-platform.vercel.app/api/cases -H "authorization: Bearer $ADMIN_PW" -d '{"clientProblem":"...","businessContext":"...","decisionPurpose":"...","strategyMode":"market_evidence","fullAuto":true}'`（ADMIN_PW：`npx vercel env pull` 拉 production 的 ADMIN_PASSWORD，用完刪）
   - 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_watch-creative.mts <caseId>` + `scripts/_errs.mts <caseId>`
2. **5C 架構收尾**：`lib/frameworks/contract.ts` 加 `buildReport(ctx)`；hybrid + Mode 1 章節從 `lib/report/builder.ts` 搬進各框架 report.ts；runReportBuild 改成 cover + getFramework(mode).buildReport + footer。Mode 1 無框架前暫留 legacy。
3. **篇幅旋鈕接 Mode 1/2 + Cloud Run**（同 creativeLead.ts 的 callCreative 套路）。
4. **macs-platform git push**（領先 origin 8 commits 未推；部署是工作樹）。

---

## 卡住 / 未解

- 5C 未做（Mode 1/2 章節還在 builder.ts 的 if(mode)；Mode 3 已在框架）。
- Mode 1/2 換新設計後沒 live 驗（渲染共用、ViewModel 沒動，理論自動套）。
- 篇幅旋鈕只 Mode 3 全通。
- Phase 3 Cloud Run 隔離護欄未做（防禦性，非阻斷）。
- macs-platform 8 commits 未推遠端（災備風險，收尾會推）。
- Cloudflare API token 外洩待撤銷（延宕多 session）。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 今日心得/技法 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-05.md`（MACS 段 + 施工心得） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 天條：計算用程式不丟LLM | `~/.claude/CLAUDE.md` 永遠生效的紀律 + `memory/feedback_deterministic_work_belongs_in_code.md` |
| MACS 框架契約 | `~/.ailive/macs-platform/lib/frameworks/contract.ts` |
| MACS 報告設計系統 | `~/.ailive/macs-platform/lib/report/renderHtml.ts`（REPORT_CSS） |
| Mode 3 章節 | `~/.ailive/macs-platform/lib/frameworks/creative-lead/report.ts` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-05 · 築*
