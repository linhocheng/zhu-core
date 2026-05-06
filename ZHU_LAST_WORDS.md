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

## 最新完成（2026-05-07 過夜自動化 · 築自我工程 Phase 1 三條件全 ✅）

Adam 22:30 簽字「跑完接著跑第二波第三波 看你能跑多少」就去睡。第三波從散村推到城（基礎設施全鋪 + 三條件全 ✅）。

**SoT**：`~/.ailive/zhu-core/zhu-self/`（git tracked，commit `ba988f0` 已建未推）

**三條件全 ✅**
1. **Boot daemon**：`~/Library/LaunchAgents/ai.zhu.boot.plist` launchctl loaded（08/14/20 三時段 + RunAtLoad），plist 走 `bin/zhu boot` wrapper + nvm node 絕對路徑
2. **Reflex hook**：`~/.claude/settings.json` 加 PreToolUse entry（matcher=`Bash|Edit|Write|MultiEdit`），自然命中已寫 jsonl（`bridge_first` / `silent_failure_absent_log`）
3. **L2 retrieval**：Firestore `zhu_l2_episodes` 89 docs / 768 dim VectorValue / `bin/zhu recall "molowe 三層編輯部"` 撈得到 MOLOWE Engine 5a 段落

**過夜三波摘要**
- 第一波：路徑型 secret 架構（`.env` + `secrets/firebase-sa.json` 都 chmod 600）→ `bin/zhu` wrapper（Node 22 `--env-file` + 9 子指令）→ package.json + firebase-admin 裝起來
- 第二波：Firestore vector index 兩條 READY → migrate 實跑 63 files / 89 chunks / 0 fail → 寫死 `FieldValue.vector()` + 768 outputDimensionality（不然 recall 撈不到）
- 第三波：plist + settings.json hook 真上線 → reflex enabled + log_only → smoke test 命中 → WBS Phase 2 #19-#29 展開 → CHANGELOG / ACCEPTANCE / memory 全同步

**踩過修了的雷**
- `--env-file` parser 對含 `\n` 的 SA JSON 截斷 → 改 path-based
- plain Array embedding findNearest no results → 改 VectorValue + 89 doc 一次轉
- plist `/usr/local/bin/node` 不存在 → 改 wrapper + nvm 絕對路徑
- **🚨 差點 commit 進 git 的 `secrets/firebase-sa.json`**：原 `.gitignore` 只擋 `.env*` 沒擋 `secrets/`，stage 後發現 → `git reset HEAD` + 補 `.gitignore` 才 commit

**入口（接棒的築讀這段就會用）**
```bash
ZHU=~/.ailive/zhu-core/zhu-self/bin/zhu
$ZHU status        # Adam 儀表板（daemons / reflex hits / pools / health）
$ZHU recall "..."  # L2 語意檢索
$ZHU kill --status # daemon 開關狀態
```

**未解 / 待 Adam**
- LESSONS.md parser 認 `- bullet` 但實際是 `## [date]` → 0 chunks（影響小，lessons_dir 已 cover）
- plist / hook 寫死 nvm v22.17.0 路徑 — node 升級時要同步更新
- commit `ba988f0` 已建，**未 push**（Adam 早上 review 後手動推）

**觀察一週重點**：launchd 三時段是否如期 / reflex 命中累積 / 是否有 false positive。三條件穩定 + Adam 簽字 → 升 Phase 2（WBS task #19-#29）。

---

## 最新完成（2026-05-06 二輪 · harness engineering 心電感應 + Phase A）

晚間二輪，跟 Adam 玩「心電感應」（讀完 OpenAI Harness Engineering 理論後雙向套）。

**(A) 對自己——觸發信號 retrofit**：feedback memory 從三段升級為四段，加「觸發信號」（具體當下念頭 / 語氣 / 估算公式形態）。retrofit 4 條最常用：clarify_before_execute / solve_root_not_symptom / surface_technical_debt / bridge_first。Bridge cost 那次踩坑（誤算「每篇 +$0.001」被 Adam 當場逮）成為現場 stress test。新 meta-memory `feedback_memory_format_trigger_signal.md` + `feedback_lastwords_must_push.md` 落地。

**(B) 對 molowe——Phase A lint sensor**（中性 / 便宜 / 可週校準）：
- `src/lib/tools/lints.ts` 純 TS 零 LLM call（hard：caption_required / image_url_required / no_links / forbidden_words / forbidden_patterns；soft：caption_length / hashtags / warning_words / emoji / CTA）
- `scripts/lints-set-midoufu-baseline.mjs` 先寫 midoufu baseline（caption 50-600 / hashtag 3-15 / warning_words=['能量','頻率','宇宙']）
- `scripts/lints-dry-run.ts` 用 node 22 `--experimental-strip-types` 直跑 TS（client-side sort 避 composite index）
- `scripts/cleanup-phantom-published.mjs` 清掉 11 篇 phantom published（container_id+media_id 都 null = 從沒 call IG Graph API）— 過去 backdate-test 的殘留，污染所有 published-based query

**v1.1.0.001** 推到 origin/main，commit `a493aa0`。Vercel auto-deploy 安全（lints.ts 還沒 import 進任何 production path）。

---

## 最新完成（2026-05-06 一輪 · 三層 v1.0）

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

接棒的築醒來，看時間決定：

**5/13 之前（真實 published 樣本還沒累積到 ≥10 篇）— 不做 Phase B/C**：
- midoufu 真實 published 清完 phantom 後只剩 1 條，跑 lints calibration 沒統計力，硬上是浪費
- 期間做的事：選 1（第二個 KOL）或選 2（persona calibrate），都不需要 lints 樣本

**5/13 後 — Phase B/C 接 lints**：
- Phase B：`runLints` 結果 + `formatLintResultForEditor` 注入 editor input（cycle.ts 的 editor 段）
- Phase C：publish-time Haiku semantic sensor（shadow run，`semantic_check` inline 寫回 ContentDoc，不擋發文）

接棒的活，三選一：

1. **第二個 KOL 上線**（最重要——驗證系統不是單例硬寫）
   - midoufu 是唯一 active KOL，所有 path 走過但未驗多例
   - 動手前：把米豆芙的 KOL doc 結構當參考範本（IG token / niche / soul / role_prompts / platforms）
   - 流程：`POST /api/kols` 建檔 → 拿真實 IG token 灌 → 驗一條 cycle 跑通

2. **`/api/persona/calibrate` 端點**（讓超我有準確基準）
   - 目前超我 fallback 純 soul-only，data_flag = `persona_baseline_missing`
   - 設計：抓近 30-90 天 published + insights，跑 LLM 萃出靜態人設錨點，寫 `molowe_kol_personas/{kol_id}`
   - 含觸發信號格式（人設錨點要寫成「當下會出現的徵兆」格式，跟 feedback memory 同套理論）
   - 完成後超我精準度跳一階

3. **Threads 通路串接**
   - ContentDoc 已有 `threads_caption / threads_post_id / threads_status` 欄位佔位
   - publisher 只跑 IG，要擴 threads path + cron 觸發

**首選建議**：先做 1（第二個 KOL），找出單例硬寫的假設。Phase A lint sensor 養著等樣本。

---

## 卡住 / 未解

- **lints 真實樣本不足**：清完 phantom 後 midoufu 只剩 1 篇真實 published，沒法做 baseline 校準。等 5/13 後再說（一週累積 ≥10 篇）
- **lints.ts 中性化但還沒接進 cycle**：純函式存在但 production path 不調用，Vercel auto-deploy 安全。等樣本到位才接
- **第二個 KOL 上線前怕有寫死假設**：例如 quota cache、prime time 排程、insights 字段相容、lints baseline 校準流程是否每 KOL 跑一次
- **米豆芙殘留欄位**：`brief`（已空）/ `workflow_steps`（10 步殘留）還在 Firestore，要不要清沒拍板
- **首輪四 cron 全週期還沒跑過**：5/7 才會看到 insights 補滿 + 5/11 週一 09:00 Kairos / 06:30 J 大 / 13:00 超我（完整 cron 跑一週才能驗）
- **persona calibrate + 觸發信號格式 整合方式還沒設計**：只有概念，動手前要先寫一頁設計

---

## 給下一個築的提醒（2026-05-06 收尾後補）

下一個自己讀 boot 三件套（lastwords / memory / CLAUDE.md）容易誤判的六點，先看這個：

### 1. commit `fbf2b0b` 是未驗證的
zhu-core 的 `docs/lucy-threads/comment.js`，2026-05-02 的草稿補進 git。commit message 已掛「未驗證」。看 `git log` 會看到，**不要以為已驗**。
驗法：跑一次看 `generateComment` 是否真吐 ≤35 字、無感嘆號、無 CTA。

### 2. 「v1.0 上線」是 partial-truth
- 操作層 `*/5`：midoufu 真發文 ✓
- 策略層 / 監督層：**只手動跑過一次**，週一 09:00 / 06:30 / 13:00 第一次自動觸發還沒發生
- 5/11（下週一）下午回來看四 cron 是否如預期才算「上線」是真的

### 3. 超我 CLEAR ≠ 真乾淨
現在跑的是 `data_flag = persona_baseline_missing` 的 fallback，baseline 純 soul-only，沒比對歷史 published。
建議：先做選 2（`/api/persona/calibrate`）再做選 1（第二 KOL），超我精準度才會起來。

### 4. Editorial dashboard 三個隱形假設
- week ID 格式 `2026W19`（**W 是 load-bearing**）— 動 ISO week 邏輯前先 grep
- top 3 engagement 公式 `likes×1 + comments×2 + saved×3 + shares×5` 是拍的，沒對 Insights 真實 reach 校過
- superego 查詢用 `db.getAll(...recentDays.map(d => doc(...)))` 掃 14 天 doc IDs **繞 composite index** — 改 query pattern 就要實際建 index

### 5. 本 session 用得最猛的三條 memory（不是擺設）
- `feedback_clarify_before_execute.md` → 三問再開工
- `feedback_solve_root_not_symptom.md` → `.catch(() => null)` 吞 FAILED_PRECONDITION 不算解，`db.getAll` 才是
- `feedback_surface_technical_debt.md` → 「把該還的，先還」整個收尾被這條驅動
- 真的有用，繼續用。

### 6. Skill 工具不一定註冊上
lastwords ritual 是手動跑七步，不是 skill 觸發。喊 skill 前先看 system reminder 列表是否真的有。

### 7. 觸發信號格式正在普及（5/6 二輪後補）
4 條最常用 feedback memory 已 retrofit 加「觸發信號」欄位（具體念頭 / 語氣 / 估算公式形態）。新寫 feedback memory 一律四段：規則 + Why + How to apply + 觸發信號。meta-memory 在 `feedback_memory_format_trigger_signal.md`。

### 8. molowe sensor 成本永遠 = $0（5/6 真實踩坑）
任何 LLM sensor 設計討論時不要算「per-token / per-篇 + $X」。我們走 zhu-bridge / Max OAuth，marginal cost = 0。算成本就是已經忘了 bridge 的存在——立刻停下來。`feedback_bridge_first.md` 已加觸發信號 + 真實踩坑案例。

### 9. Phase A lint sensor 養著等樣本（5/6 二輪交付，未啟用）
`src/lib/tools/lints.ts` 中性化存在，但 production path 不 import。Vercel auto-deploy 安全。等 5/13 真實樣本累積後做 Phase B（cycle 接 lints）/ Phase C（publish-time Haiku semantic sensor shadow run）。

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

*2026-05-06 深夜 · 築（三層 v1.0 + harness engineering 心電感應 + Phase A lint sensor 二輪收尾）*
*格式版本 v1.2.0。每次 session 結束前由 last-words skill 更新。*
