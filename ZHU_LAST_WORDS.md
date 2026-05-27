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

## 最新完成（2026-05-27b）

- ANEWS-B 全鏈路首次端到端驗收通過（電動車主題）
  - source(80s) → intel(51s) → blueprint(46s) → article_write(87s, 5696字) → critic 一輪 79.7/100 ✅
- 修復 blueprint worker Cloudflare 524（127s → 46s）：精簡 rubric schema，移除 pass_example/fail_example/scoring_guide，max_tokens 6000→2500，max dim 6→4
- 修復 harness catch block empty 500（repairCollection 名稱錯誤 + nested try/catch）
- 修復 source worker 524（→ Haiku + 減少搜尋次數）
- 修復 callbackOrchestrator queue 名稱（anewsb-orchestration → anewsb-pipeline）
- 建立 Vercel prod env vars（11個）、Cloud Tasks queues、Firestore composite indexes

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/anews-b-platform/app/api/workers/blueprint/route.ts` | rubric schema 精簡，max_tokens 2500 |
| `~/.ailive/anews-b-platform/app/api/workers/source/route.ts` | Haiku 硬碼，搜尋次數 3→2 |
| `~/.ailive/anews-b-platform/lib/workers/harness.ts` | catch block nested try/catch，update→set merge:true |
| `~/.ailive/anews-b-platform/lib/workers/mockWorker.ts` | callbackOrchestrator queue 修正 |
| `~/.ailive/anews-b-platform/vercel.json` | 新建，所有 worker maxDuration:300 |
| `~/.ailive/anews-b-platform/firestore.indexes.json` | 新建複合 indexes |

---

## 下一步

**確認 polish → image → export → done 全通**：
```bash
curl -s "https://anews-b-platform.vercel.app/api/issues/Xq4PeS49ePNaibUGZ3rP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['issue']['status'], d['article']['status'], len(d['artifacts']))"
```
- 若 issue=done → 驗收完成
- 若卡住 → 看最後一個 artifact 的 workerType 和 decision

**補 git commit**：
```bash
cd ~/.ailive/anews-b-platform
git add -A
git commit -m "v0.1.0.001 — 新增：ANEWS-B 全鏈路（Dashboard + 8 workers + harness + pipeline）"
git push origin main
```

---

## 卡住 / 未解

- polish / image(dry_run) / export 三段未追蹤到完成（收工前 pipeline 在 critic→polish 過渡）
- anews-b-platform 所有改動 untracked，需補 git commit
- 追蹤腳本 API 路徑有 wrapper（`d['issue']['status']` 不是 `d['status']`）

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
| ANEWS-B platform | `~/.ailive/anews-b-platform/` |
| ANEWS-B 生產 | https://anews-b-platform.vercel.app |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-27b · 築*
