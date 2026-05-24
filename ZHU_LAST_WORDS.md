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

## 最新完成（2026-05-24）

- Batch A 驗收通過：article.title / section.heading+wordCount / article.stitchedWordCount 全有值
- Batch B 驗收通過：QA retry rate 12.5%（目標 <20%）
- 修 workerCall retry idempotency bug：每次 attempt 產生新 taskId，不再被 already_running 擋住
- 修 stitch precondition：從「全段 qa_passed」改為「無 in-progress 段落」，qa_blocked 可通過
- 修 test script：writeReady=false 跳過的 section 直接寫 Firestore 設 qa_blocked
- v7 手動完整跑完：3 篇 articles 全 done，真實標題 + stitch + export 全驗證
- 讀懂另一個築寫的 G1-G4（evidence-pass 架構）：blocks schema + worker + orchestrate + qaMode

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `app/api/workers/stitch/route.ts` | precondition 改為允許 qa_blocked/qa_failed |
| `scripts/test-medium-mode.mjs` | workerCall fresh taskId retry + skip→qa_blocked + wordTarget 600 |
| `app/api/workers/source/route.ts` | max_tokens: 8192（原 8000，避免截斷）|
| `app/api/workers/section-write/route.ts` | G1 blocks 拆解 + heading/wordCount 寫回 + source 引用規則 |
| `app/api/workers/section-qa/route.ts` | G4 qaMode tracking + qaPassedMarkdownUrl |
| `app/api/workers/orchestrate/route.ts` | G3 evidence_pass_done handler + section_qa_failed 分流 |
| `app/api/workers/evidence-pass/route.ts` | G2 全新 worker（未 commit）|
| `lib/queues/cloudTasks.ts` | 加 anews-evidence-pass queue 名稱 |
| `ISSUES_AND_FIXES.md` | G1-G4 設計稿 + 接棒說明 |

**注意：以上 8 個改動 + evidence-pass 新目錄全部未 commit、未 deploy。**

---

## 下一步

**第一件事（直接動手）**：
```bash
cd ~/.ailive/anews-platform
git add -A
git commit -m "v1.7.0.003 — 新增：G1-G4 evidence-pass + retry idempotency fix + stitch precondition fix"
npx vercel --prod --yes
```

**第二件事**（需 Adam GCP 權限）：
```bash
gcloud tasks queues create anews-evidence-pass --location=asia-east1
```

**第三件事**：診斷 image queue stuck（看 worker_traces 的 image worker errorType）

**第四件事**：v8 medium mode 驗 evidence-pass

---

## 卡住 / 未解

- **image queue stuck**：image tasks 全部卡在 `planned` 或 queue 裡沒跑，v8 跑完整流程前要先解
- **GCP queue 未建**：anews-evidence-pass 需要 Adam 有 GCP 權限才能建，築建不了
- **Batch C 未做**：coherence 閘門（orchestrate 3 路分流 + approve-coherence endpoint + dashboard UI），估 90 min
- **ISSUES_AND_FIXES.md 勾選框**：Batch A/B 的 checkbox 還是空的，下次進來補打勾

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ANEWS 問題清單 | `~/.ailive/anews-platform/ISSUES_AND_FIXES.md` |
| ANEWS 主戰場 | `~/.ailive/anews-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-24 · 築*
