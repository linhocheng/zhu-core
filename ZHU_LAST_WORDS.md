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

## 最新完成（2026-06-25）

- Task Harness 首次真實執行——目標：ailivex 技術債審計，一輪跑完
- 寫出 `TECH_DEBT.md`（15 條：6 高 / 4 中 / 5 低）
- H1：CLAUDE.md 5 處 v10→v14，補版本表 v11-v14
- H2：README.md 加 stale 警告（內容停在 v2–v4 時期）
- H4：刪除 `src/lib/enqueue.ts`（廢棄 Cloud Tasks，零 import）
- M1：10 個舊版頁面（base, v2-v11）加 `[封存]` 備註
- M3：chat 頁、admin/access 頁 silent catch → console.error
- M5：cloud-run/agent/ 加 LEGACY.md
- L3：刪除 scripts/test-enqueue.mjs（廢棄測試腳本）
- 驗明 H5/L2/L5 不成立

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/ailivex-platform/TECH_DEBT.md` | 新建，15 條技術債報告 |
| `~/.ailive/ailivex-platform/CLAUDE.md` | H1：v10→v14，版本表補齊 |
| `~/.ailive/ailivex-platform/README.md` | H2：加 stale 警告 |
| `~/.ailive/ailivex-platform/src/lib/enqueue.ts` | H4：刪除 |
| `~/.ailive/ailivex-platform/src/app/realtime*/page.tsx`（×10）| M1：加封存備註 |
| `~/.ailive/ailivex-platform/src/app/chat/[characterId]/page.tsx` | M3：catch → console.error |
| `~/.ailive/ailivex-platform/src/app/admin/access/page.tsx` | M3：catch → console.error |
| `~/.ailive/ailivex-platform/cloud-run/agent/LEGACY.md` | M5：新建 legacy 說明 |
| `~/.ailive/ailivex-platform/scripts/test-enqueue.mjs` | L3：刪除 |

---

## 下一步

1. `gcloud run services list --region=asia-east1` 確認哪些 ailivex CR services 還活著
2. 依結果決定 Python v2-v11 封存範圍（建 `agent/_archive/`）
3. 跟 Adam 確認 H3：text dialogue 路徑的 `writing`/`web_search` task dispatch 是否計劃接通

---

## 卡住 / 未解

- **H3 範圍不清**：task dispatch `writing`/`web_search` 拋錯是已知，Adam 說「基本上通了」可能是指 voice URL reading 那條。待確認。
- **M2+L1+L2**：靜態掃描無法知道 CR service 是否還在 dispatch，只能 gcloud 確認。
- **H6 長期解法**：Python 和 TS 的 DEFAULT_GLOBAL_PROMPTS 目前一致，長期應廢棄 Python 端改走 Firestore init。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 技術債 | `~/.ailive/ailivex-platform/TECH_DEBT.md` |
| Task Harness SOP | `~/.claude/skills/task-harness/SKILL.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-25 · 築*
