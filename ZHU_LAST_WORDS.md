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
  - 跑著 `claude-bridge`（systemd），bridge-direct HTTPS 直連：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-03）

- 確認工程夥伴整修完成：`bridge-direct.soul-polaroid.work` 上線，Vercel + Cloud Run BRIDGE_URL 全換直連，CF 524 根治
- MACS case-mpwr0rfy-0uhfyb e2e 全程跑通（21min，$0，5 artifact 全齊）
- 驗證：所有 worker 角色接後台 prompt，全程 $0（Tavily free + bridge Max）
- 案件真刪除功能：deleteCase() + DELETE API + UI 按鈕（macs-platform v0.9.1.001）
- Case detail page：新增 doc-* 閱讀層 CSS（正文 1rem/1.85，section title 不全大寫，field 分隔線）
- HTML 報告：table overflow 修復、章節分隔輕量化、callout 間距收緊

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/pipeline/flow.ts` | 新增 deleteCase()，8 collection 全清 |
| `macs-platform/app/api/cases/[caseId]/route.ts` | 新增 DELETE handler |
| `macs-platform/app/dashboard/page.tsx` | 案件刪除按鈕 UI |
| `macs-platform/app/dashboard/[caseId]/page.tsx` | doc-* 閱讀層 artifact 區塊 |
| `macs-platform/app/globals.css` | doc-* CSS classes |
| `macs-platform/lib/report/renderHtml.ts` | table/divider/callout 排版修復 |

---

## 下一步

建一個新案跑完，點「開啟 HTML 報告」，驗新排版（特別看策略選項 7 欄表格是否正常橫向捲動、章節分隔是否輕量）。若還有意見繼續調 `renderHtml.ts`。

---

## 卡住 / 未解

- HTML 報告新排版未用新 case 驗（舊案子 reportHtml 是舊 CSS）
- `STRUCTURE_ANALYSIS_BASE_URL` 尾端有 `\n`（`.trim()` 保護中，非緊急）

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
| MACS 平台 | `~/.ailive/macs-platform/`，prod: https://macs-platform.vercel.app |
| MACS HTML 報告渲染 | `~/.ailive/macs-platform/lib/report/renderHtml.ts` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-03 · 築*
