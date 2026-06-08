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

## 最新完成（2026-06-08）

- 接通 MACS 報告篇幅旋鈕到三模式：釘 `callStructured` 收斂點一處注入 directive + scale token
- 補上 Mode 1 analysis 的 raw prose call 旁路（繞過 callStructured，手動呼叫 applyLengthControl）
- 拆掉 Mode 3 creativeLead 原本的重複注入，避免雙重注入
- Cloud Run 章節生成透傳 lengthTier：`structureOneMemo` + `runIntegrateChapters` 讀同一 settings/pipeline 並 scale token
- Cloud Run 部署上線：revision **macs-research-worker-00025-tkc** serving 100%

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/report/length.ts` | 新增 applyLengthControl 單一接縫（append directive + scale token） |
| `macs-platform/lib/llm/structured.ts` | callStructured 送 LLM 前呼叫 applyLengthControl（三模式收斂點） |
| `macs-platform/lib/pipeline/analysis.ts` | Mode 1 raw prose call 補注入（唯一繞過 callStructured 的旁路） |
| `macs-platform/lib/pipeline/creativeLead.ts` | callCreative 移除自身注入，去雙重注入 |
| `macs-platform/cloud-run/research-worker/src/index.ts` | getReportLength() + structureOneMemo/runIntegrateChapters 透傳 tier |
| `zhu-core/docs/LESSONS/LESSONS_2026-06-08.md` | L1 收斂點配旁路盤點 + L2 旋鈕只接一 mode = 血管不通 |

commit：macs-platform `v0.11.4.001`（已 push + 雙端部署）

---

## 下一步

**篇幅真案對照驗證**（最該先做、能直接動手）：
1. 去 https://macs-platform.vercel.app/dashboard/settings 把篇幅設「精簡」
2. /dashboard 新建案件、勾「全自動」、選 market_evidence，跑到 done
3. 同題再設「深入」跑一份，比兩份報告字數 → 確認旋鈕真的咬住
   - 注意：cache 60s、只影響之後跑的 run（不回溯既有報告）
4. curl 起案範例見 WORKLOG 2026-06-08

連帶把昨日待辦的 Mode 2/3 真案 e2e（驗 esc() + 設計一致）一起跑掉。

---

## 卡住 / 未解

- 篇幅改動只做到 build 綠 + 雙端部署，**尚無真案 e2e 驗字數真的降**。Adam 收工前我問「要不要起一個全自動案跑到 done」，他選擇收工換手——驗證留給下一棒。
- Task #31（5C 章節改框架驅動 buildReport）仍未動。

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| MACS 平台 | `~/.ailive/macs-platform/`（Vercel + Cloud Run research worker） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-08 · 築*
