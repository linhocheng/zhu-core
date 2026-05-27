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

## 最新完成（2026-05-27）

- 修復 alignment worker HTTP 500 empty body（harness catch block NOT_FOUND + Firestore undefined 兩個 root cause）
- 修復 orchestrator source_traceable 欄位名不符導致 evidence_pass gate 永遠不觸發
- 新增 Firestore composite index（worker_runs targetId + lockedAt）修復 dashboard 500
- ANEWS 全鏈路首跑完成：issue jyoDNn4Wj1atMuIaTRzO 夜市攤位政治 → status: done（兩篇文、三節、QA/revise/polish/images/coherence 全通）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `app/api/workers/alignment/route.ts` | reasoning: undefined → conditional spread |
| `lib/workers/harness.ts` | catch block docRef.update → set merge:true |
| `app/api/workers/orchestrate/route.ts` | 擴大 source_traceable 判斷 |
| `firestore.indexes.json` | 新增 worker_runs composite index |
| anews-platform Vercel | 兩次 deploy，Firebase indexes deploy |

---

## 下一步

**確認 reader page 能顯示 polished content**：
1. 開 https://anews-platform.vercel.app/articles/zjsVpS9RT1R0dLTniUT9
2. 看有沒有文章內容顯示（sections.draftMarkdown 應該在 reader 上）
3. 如果空白 → 找 reader page 如何讀 finalMarkdownUrl，決定是否需要從 GCS 拉

**加 dashboard auto-polling**：
- `app/dashboard/[issueId]/page.tsx` 加 useEffect + setInterval 5-10s 刷新
- 讓進度條無需手動 F5

---

## 卡住 / 未解

- `polishedMarkdown` 欄位是 empty（polish worker 寫到 `finalMarkdownUrl`，GCS 存儲）— reader 目前用 sections.draftMarkdown，不是最終 polished 版
- auto-kick cron 回 401 — 需查 CRON_SECRET 設定是否在 Vercel env 裡
- dashboard 進度條沒有 auto-update

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
| ANEWS platform | `~/.ailive/anews-platform/` |
| ANEWS 生產 | https://anews-platform.vercel.app |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-27 · 築*
