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
  - SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
  - **重要**：Cloud Run 的 BRIDGE_URL 已改為直連 `http://35.236.185.222:3001`（bypass Cloudflare 524）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-05-28）

- 修復 article-write Cloud Run 的 Cloudflare 524 問題：BRIDGE_URL 改直連 VM IP
- 修復 article-write worker lock.skip 不接鏈 bug：加 chainNextArticle recovery
- 修復 GCP firewall rule（target-tag 要是 zhu-dev 不是 zhu-bridge）
- K1f1eg4J35mrdeATP8Kx「AI 自動化廣告投放」：5 篇全部 polish_done，issue 進 awaiting_review
- pa3oSQMLeNETVdHzH8gj「人與人的溝通」：done
- image worker lock.skip chain recovery（前 session 已修）
- Dashboard UI：移除 singleWriteMode checkbox、隱藏 singleWrite issue 的段落 UI
- 部署 auto-kick watchdog cron（scans stuck articles + image_tasks every 5 min）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `cloud-run/article-write-worker/src/index.ts` | lock.skip 加 chain recovery；allowed statuses 加 section_writing |
| `cloud-run/image-worker/src/index.ts` | lock.skip 加 chainNext recovery |
| `app/api/cron/auto-kick/route.ts` | 補 singleWriteMode watchdog |
| `app/dashboard/page.tsx` | 移除 singleWriteMode checkbox |
| `app/dashboard/[issueId]/page.tsx` | singleWrite 時隱藏段落 UI |
| `app/dashboard/[issueId]/artifacts/page.tsx` | 補 image-plan 標籤 + WORKER_ORDER |
| GCP firewall | 新增 allow-bridge-3001（port 3001，target: zhu-dev） |
| Cloud Run env | anews-article-write-worker BRIDGE_URL → 直連 IP |

---

## 下一步

1. 去 https://anews-platform.vercel.app/dashboard/K1f1eg4J35mrdeATP8Kx 按 coherence 審核通過（issue awaiting_review）
2. 如果 coherence 卡住：`POST /api/workers/orchestrate` with `event: "coherence_override"` + `issueId: K1f1eg4J35mrdeATP8Kx`
3. 下一個要解的技術債：idempotency lock 改以 articleId 為 key（目前 taskId 為 key 導致同文章可能被寫多次）

---

## 卡住 / 未解

- **同一文章被寫多次**：auto-kick + Cloud Tasks retry + 手動 curl 三者並發，taskId 不同各自拿到鎖 → 同文章寫 2-3 次。Firestore 最後一次覆蓋勝出，結果正確但浪費 bridge quota。根治要改 idempotency key 或在 section_writing 前做 article-level check。
- **image-plan prompt 品質低**：仍用 `${issue.title} ${keyTerm}`，不是讀文章正文生成的精確 editorial prompt。

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
| ANEWS 平台 | `~/.ailive/anews-platform/`，Vercel prod: https://anews-platform.vercel.app |
| Bridge VM | zhu-dev，ext IP: 35.236.185.222，port 3001，systemd: claude-bridge |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-28 · 築*
