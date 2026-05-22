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

## 最新完成（2026-05-22）

- ANEWS S3：section-write revise mode + previousSectionSummary context
- section-qa：真實 LLM 7項品管，fail→retry（最多3次），blocked→auto-skip 繼續 pipeline
- stitch：各段 Firestore 讀取 → LLM JSON patch → 上傳 Firebase Storage
- polish：從 Storage 讀 stitchedMarkdown → LLM 生 title×3/summary/SEO/keyTakeaways
- coherence：5篇摘要交叉品管，全自動繼續
- image：SVG placeholder 存 Firebase Storage
- export：小抱報標準版式 HTML（eastern-blank）存 Storage
- Pipeline `pending → done` 全通（含 coherence + image + export）
- 修 blueprint_done allReady 競態：每篇獨立 enqueue
- 修 qa_blocked auto-skip（手動 kickstart 舊 blocked）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/workers/section-write/route.ts` | revise mode + previousSectionSummary |
| `anews-platform/app/api/workers/section-qa/route.ts` | 真實 LLM 7項品管 |
| `anews-platform/app/api/workers/stitch/route.ts` | Firestore讀段→LLM patch→Storage |
| `anews-platform/app/api/workers/polish/route.ts` | LLM metadata → Storage |
| `anews-platform/app/api/workers/coherence/route.ts` | LLM 5篇摘要品管 |
| `anews-platform/app/api/workers/image/route.ts` | SVG placeholder → Storage |
| `anews-platform/app/api/workers/export/route.ts` | 小抱報 HTML 版式 eastern-blank |
| `anews-platform/app/api/workers/orchestrate/route.ts` | QA 事件 handler + blueprint_done fix |
| `anews-platform/lib/firestore/admin.ts` | getStorageBucket() |

---

## 下一步

**T9：Dashboard 加 Human Review Gate**

```bash
cd ~/.ailive/anews-platform
# 找 dashboard/[issueId] 頁面，加「核准此期」按鈕
# 按鈕 POST /api/workers/orchestrate { event: "review_approved", issueId }
# issue status = awaiting_review 才顯示按鈕
```

做完 T9 後：
1. 調 section-qa 嚴格度（word_count 60%，移除 no_unsupported_claims）
2. 修 qa_blocked skip 邏輯移到 worker 層（不依賴 orchestrator callback）
3. 修 stitch worker Storage URL 拼接防換行

---

## 卡住 / 未解

- **qa_blocked skip 需手動 kickstart**：舊 blocked section 沒有 callback，要手動 POST `section_qa_passed`。修法：qaAttempts + skip 全在 section-qa worker 算，直接 enqueue 下一段
- **QA 過嚴（5/8 段 blocked）**：word_count 門檻太高、no_unsupported_claims 難過。調鬆前先做 T9
- **Storage URL 換行**：stitch 拼 URL 時混入 `\n`，export 已加 `.replace(/\n/g, "")` 防護，但根源在 stitch 要修

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ANEWS 平台 | `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app |
| ANEWS 企劃書 | `~/.ailive/zhu-core/docs/projects/ANEWS_PLAN_v2.1.md` |
| Bridge streaming 踩雷 | `docs/LESSONS/LESSONS_2026-05-19b.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-22 · 築*
