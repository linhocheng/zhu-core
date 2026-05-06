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
  - 同時跑 ailive 的「閾」editor（Live Media）—— 動 VM 不要傷到 ailive
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **molowe-platform**：`https://molowe-platform.vercel.app`（KOL 管理後台 + 三層 AI 編輯部，主戰場）
- **完整開發指南**：`~/.ailive/molowe-platform/MOLOWE_GUIDE.md`

---

## 最新完成（2026-05-06）

**molowe-platform 三層 AI 編輯部 v1.0 正式上線**。一天內收 T1-T10：

- T1 5b 殘留全清乾淨（roles/base 12 檔 + (admin)/company + api/company + api/workflow + base-souls.ts，−4356 行）
- T2-T6 操作層基建：corpus 語料庫 + MCP 工具層 + 改稿循環（cycle 最多 3 輪 + rewrite_corpus 學 Live Media 的 surgical_notes）
- T7 publisher (IG Graph API v21.0) + backlog cron（每 5 分鐘）+ TPE prime time scheduler + PATCH 點記法 fix
- T8 IG insights 回流（hourly cron，inline 寫回 ContentDoc）
- T9 Layer 2 策略層：Kairos（週一）+ J 大（每日）+ writer 接 directive
- T10 Layer 3 監督層：超我聲紋稽核 + Editorial 儀表板（`/dashboard/editorial`）
- 6 個 commit 切完按任務邊界推到 origin/main，working tree clean，0 個 TODO/FIXME

---

## 今天改了哪些檔案

| 檔案 / 範圍 | 改了什麼 |
|---|---|
| `molowe-platform/src/lib/workers/` | 新增 publisher / insights / kairos / jda / superego / cycle / editor / writer / visual / bridge / gcs / types |
| `molowe-platform/src/lib/tools/` | 新增 corpus / rewrite / directive / persona |
| `molowe-platform/src/app/api/cron/` | 新增 5 條 cron 路由 |
| `molowe-platform/src/app/api/{content,corpus,dedup,rewrite-corpus,tools}/` | 新增 HTTP 端點 |
| `molowe-platform/src/app/(admin)/dashboard/editorial/page.tsx` | 新增 三層儀表板 |
| `molowe-platform/vercel.json` | 5 條 cron 排程定案 |
| `molowe-platform/MOLOWE_GUIDE.md` | T7-T10 全部更新 |
| `molowe-platform/{ARCHITECTURE_DECISIONS,NORTH_STAR,VM_INTEL_CURRENT,REJECTION_SPEC_DRAFT,CLEANUP_5B_PLAN}.md` | 5 份設計文件入 git |
| 刪除 | `roles/base/*` 12 檔 + `(admin)/company/*` + `api/company/*` + `api/workflow/*` + `lib/{kol,company}-role-base-souls.ts` |

zhu-core 本體：今天只更新 WORKLOG / ZHU_LAST_WORDS / memory，不動其他。

---

## 下一步

接棒的築醒來，三選一：

1. **第二個 KOL 上線**（最重要——驗證系統不是單例硬寫）
   - midoufu 是唯一 active KOL，所有 path 走過但未驗多例
   - 動手前：把米豆芙的 KOL doc 結構當參考範本（IG token / niche / soul / role_prompts / platforms）
   - 流程：`POST /api/kols` 建檔 → 拿真實 IG token 灌 → 驗一條 cycle 跑通

2. **`/api/persona/calibrate` 端點**（讓超我有準確基準）
   - 目前超我 fallback 純 soul-only，data_flag = `persona_baseline_missing`
   - 設計：抓近 30-90 天 published + insights，跑 LLM 萃出靜態人設錨點，寫 `molowe_kol_personas/{kol_id}`
   - 完成後超我精準度跳一階

3. **Threads 通路串接**
   - ContentDoc 已有 `threads_caption / threads_post_id / threads_status` 欄位佔位
   - publisher 只跑 IG，要擴 threads path + cron 觸發

**首選建議**：先做 1（第二個 KOL），找出單例硬寫的假設。

---

## 卡住 / 未解

- **第二個 KOL 上線前怕有寫死假設**：例如 quota cache、prime time 排程、insights 字段相容
- **米豆芙殘留欄位**：`brief`（已空）/ `workflow_steps`（10 步殘留）還在 Firestore，要不要清沒拍板
- **首輪四 cron 全週期還沒跑過**：明天 5/7 才會看到 insights 補滿 + Kairos 週一 09:00 自動跑 + J 大 06:30 + 超我 13:00（完整 cron 跑一週才能驗）

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
| MOLOWE 完整指南 | `~/.ailive/molowe-platform/MOLOWE_GUIDE.md` |
| MOLOWE 後台 | https://molowe-platform.vercel.app |
| MOLOWE Admin Key | `molowe_a9bd8770aa44c271f571b10584ba0732` |
| Editorial 儀表板 | https://molowe-platform.vercel.app/dashboard/editorial |
| 架構決策 ADR | `~/.ailive/molowe-platform/ARCHITECTURE_DECISIONS.md` |
| MOLOWE 北極星 | `~/.ailive/molowe-platform/NORTH_STAR.md` |
| ailive 後台 | https://ailive-platform.vercel.app/admin |
| ailive Admin Key | `f1359270980fb63fa65eccae40c509290a81c362ddaf51bc` |

---

## 三層 AI 編輯部架構速記

```
Layer 1 操作層（每 5 分鐘 backlog cron 推進）
  pending → writer → drafted → visual → visualized → publisher → published
  cycle 內 writer ↔ editor 最多 3 輪改稿

Layer 2 策略層
  Kairos（週一 09:00 TPE）：讀 7 日 published+insights → 本週方向盤（themes / avoid / tone_shift / primary_metric）
  J 大（每日 06:30 TPE）：讀本週方向盤 + 昨日 published → 今日 directive（focus_topics / tone_hint / avoid_list）
  → directive 注入 writer template

Layer 3 監督層
  超我（週一 13:00 TPE）：比對 KOL.soul + persona baseline vs 7 日 published
                       → 三維度（tone / lexicon / topic_alignment）一致性分數 + 警示
  Editorial 儀表板：每 KOL 一張卡，看本週方向盤 / 今日 J 大 / 超我聲紋 / 7 日表現 Top
```

LLM 路由全走 `zhu-bridge`（Max OAuth），不噴 API key（fallback API key 在 env 但不該觸發）。

---

*2026-05-06 晚 · 築（三層 v1.0 上線收尾）*
*格式版本 v1.2.0。每次 session 結束前由 last-words skill 更新。*
