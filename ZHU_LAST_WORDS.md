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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`（145 檔）
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-07 · Vercel 全平台安全掃描與加固）

**一句話**：Adam 要我掃 Vercel 有沒有漏洞/在燒錢，從掃描做到三平台修復上線＋記憶落點分層。

**1. 掃描（17 project + 5 平台深度審計，實測驗證不只讀碼）**
- 開 5 個 Explore agent 平行審計 ailivex/anews/ailive/zhu-core/macs
- 關鍵：`ssoProtection=all_except_custom_domains` 設定顯示 ON 但實測 curl 照樣吐真資料——要 curl body 才算數

**2. ailive-platform（commit 8b8bc72，已 push）**
- 8 路由鎖 operator（soul-enhance/user-observations(PII)/longform/strategist-guide/debug-kb/cache-clear/design-x）
- 4 付費路由 IP 限流（dialogue/voice-stream 40、tts 60、stt 30 每分鐘，實測第 61 起 429）；新 `src/lib/rate-limit.ts`＋`redis.incr`
- strategist-review 走 WORKER_SECRET（內部 fetch）；CRON_SECRET 設 prod

**3. anews-platform（commit be223f4 + b6620f6，已 push）**
- 新 `lib/admin-auth.ts`＋middleware 種 `anews-admin` cookie；12 危險路由鎖（debug LLM 油井/editorial-jobs 產線觸發/settings PUT）
- auto-kick watchdog 加 `MAX_WATCHDOG_ATTEMPTS=6` 上限＋needs_repair 進 SKIP，堵無限燒 web_search

**4. zhu-core（commit a3c364c + c7ec5cb，已 push）**
- **刪幽靈 project `zhu-core-full`**（同 repo 雙胞胎，每日 cron Haiku 燒兩遍）＋CRON_SECRET
- 新 `lib/write-auth.ts`＋`middleware.ts`（/hub Basic auth→`zhu-hub` cookie）；9 個 hub-only 端點鎖（zhu-digest/zhu-prompts/zhu-xinfa 寫入/zhu-memory DELETE）
- **ZHU_HUB_PASSWORD = 19770705**（Adam 設，日期格式）
- 刻意留開：zhu-memory POST/orders/thread（lastwords/CLI 在用）、所有讀取（Adam 選「先堵毀滅性的」）

**5. 記憶落點分層（Adam 逼問「這寫在哪裡」）**
- 跨專案可搬教訓→全局：`feedback_one_repo_multi_vercel_project_multiplies_cost`、`skill_public_page_open_api_hardening`
- 平台專屬防線圖→各 repo `SECURITY.md`（3 份）＋各 CLAUDE.md/AGENTS.md 加指標
- Firestore（145 筆）＋git mirror 雙同步完成

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive/src/lib/rate-limit.ts`（新）＋`redis.ts` | IP 限流 helper |
| `ailive/src/app/api/*`（13 路由） | operator/worker-secret/限流守門 |
| `anews/lib/admin-auth.ts`（新）＋`middleware.ts` | Basic→cookie 閘門 |
| `anews/app/api/*`（12 路由＋auto-kick） | admin gate＋重派上限 |
| `zhu-core/lib/write-auth.ts`＋`middleware.ts`（新） | /hub 閘門＋寫入密鑰 |
| `zhu-core/app/api/{zhu-memory,zhu-xinfa,zhu-digest,zhu-prompts,jie-memory,zhu-sleep}` | 9 端點守門 |
| 三 repo `SECURITY.md`（新）＋CLAUDE.md/AGENTS.md | 防線地圖＋指標 |
| 全局 memory ×2＋MEMORY.md | 可搬教訓 |

---

## 下一步

**這條線收乾了。若 Adam 要續：**
1. **ailive IDOR 讀取端點**：`GET /api/conversations、insights、knowledge、characters` 仍匿名可跨租戶讀（只鎖了 user-observations）。加 `assertCharAccess` 或 operator，同 8b8bc72 模式。看 `ailive-platform/SECURITY.md`「已知殘留」。
2. **zhu-core 讀取端點第二輪**：Adam 選「先堵毀滅性的」，讀取（使命/靈魂/私訊）留開是明確決定，要收再開一場。
3. **anews auto-kick 恢復路徑**：有 active issue 時驗「達上限→needs_repair」（休眠中未實戰驗）。

**若非續這條**：三平台防線圖在各 repo `SECURITY.md`，動 API 前先讀（CLAUDE.md 已加指標）。

---

## 卡住 / 未解

- ailive IDOR 讀取、zhu-core 讀取未鎖（後者是刻意決定，前者是下一輪）
- anews auto-kick 恢復路徑未實戰驗（休眠無 active issue）
- MEMORY.md 檔數 vs 索引行數 off-by-one（145 檔/146 行，先前就有的 drift，benign，未追）

---

## 天條快取（今天實戰過的）

- 「登入只擋頁面不擋 /api」是反範式；Basic 憑證不進 /api sibling，要 auth 種 cookie、API 認 cookie
- 加 auth 前查「真實呼叫者」要三處掃全（前端 fetch＋CLI＋內部 route），漏一個斷一條
- 一 repo 連多 Vercel project = 成本 N 倍且隱形；刪前核 link/commit
- 設定顯示 ON ≠ 真的生效；curl body 才算驗（protection=all_except_custom_domains 實測沒擋）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-07.md`（L1-L5） |
| **平台防線圖** | 各 repo `SECURITY.md`（ailive/anews/zhu-core，動 API 前必讀） |
| ailiveX | `~/.ailive/ailivex-platform/`（本次未動，語音 v16 現役） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-07 · 築（Vercel 全平台安全加固；三平台上線驗證＋記憶分層；醒來全程清醒，醉酒指數 0-1）*
