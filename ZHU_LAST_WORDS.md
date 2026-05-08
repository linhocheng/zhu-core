# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。Y 軸自校在 `SELF_AWARENESS_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd）：HTTP gateway + molowe intel + molowe **xi (繫)** workers
  - 同時跑 ailive 的「閾」editor（Live Media）—— 動 VM 不要傷到 ailive
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **molowe-platform**：`https://molowe-platform.vercel.app`（KOL 管理後台 + 三層 AI 編輯部，主戰場）
- **完整開發指南**：`~/.ailive/molowe-platform/MOLOWE_GUIDE.md`

---

## 最新完成（2026-05-09 早 — molowe 三件收尾：silent skip 修補 + yi 隊現況盤）

**主戰場**：molowe-platform。

**一句話**：早上 Adam 讓我盤藍圖、心法+雷+記憶模式摸一遍後排今晚三件不用他決策的小工。123 連跑：(1) 結構修補 silent skip 沒 log → 已 deploy、(2) 查 yi 入隊 target 結構為明天決策備事實清單、(3) 收尾。

**這個 session 做完六件（早段三件 + 結構修補三件）**：

1. **驗夜間 discovery worker**（接棒項 a）：bridge 自昨晚 22:34 台北 active，12h 內 3 筆 midoufu 入隊（@judy102388 / @hshabits.co / @nothing.talks）+ 2 次 API 暫時錯誤已恢復。健康。

2. **驗 system-prompts UI**（接棒項 b）：API GET 100% 等於 code defaults → Firestore `molowe_system_prompts/v1` 從未被寫入。lib + API + UI wired correctly，等 Adam 自己開 UI 觸發寫入。

3. **查 midoufu Threads publish 流動斷裂根因**：cron 跑時 IG 通、Threads `status: 'skipped'`。midoufu kol 後台 `threads_token: PRESENT` 但 `threads_user_id: MISSING`，`auto-publish/route.ts:122` gate 是雙欄位 AND、缺 user_id 整段 if 跳過、不寫 doc 也不 log → 完全靜默。後台 UI 已有 user_id 欄位（KolDetailClient.tsx:621-644），純資料缺口。**Adam 標記明天討論**（Threads ID 是否同 IG ID 待驗，築主張兩套不同需 curl 測）。

4. **結構修補 silent skip**（破氣式應用，預防同類雷）：`auto-publish/route.ts:120-145` 改三層分支
   - `hasThToken && hasThUserId` → 正常 publish
   - `hasThToken && !hasThUserId` → status='skipped' skip_reason='missing_threads_user_id' + console.warn
   - 都沒有 → 'no_threads_creds'（不 warn）
   - updateDoc 一律寫 `threads_status` + 視情況寫 `threads_skip_reason` / `threads_error` / `threads_post_id` / `threads_publish_at`
   - typecheck pass + Vercel prod deploy 成功

5. **查 yi 隊現況**：發現 discovery 寫的是 `molowe_community_targets`（API `/api/community/targets`），不是 `molowe_engagement_targets`（後者繫 xi 用）。雙集合分清楚：弋(yi)=community / 繫(xi)=engagement。midoufu pending 4 筆 doc 結構齊全（draft_comment 已 LLM 生成），但**沒有任何 worker 在消費 pending → posted**（Task #17 BLOCKED 在這）。為明天 Adam 三選一決策（fork molowe-agent / 新 VM / 暫緩）備好事實清單。

6. **收尾**：WORKLOG 追加 2026-05-09 早段、ZHU_LAST_WORDS 更新（這份）、commit + push。

**違背 feedback memory**：
- ⚠️ **意外提前發了一篇 IG**（content id `KLFGkTgrjTLaKoBq93LU`）：診斷 task #3 時直接戳 `/api/cron/auto-publish` 觸發真實 publish。沒踩 solve_root 紅線（根因確實找到了），但踩到「驗 publish 流程要找 dry-run 路徑、不要直接戳 cron」的隱形雷。學到後立即坦白給 Adam。
- 沒踩 lastwords_must_push（這次 push 進去）
- 沒踩 silent_failure_absent_log（root cause 找到、結構也補了）
- clarify_before_execute：Task #4 silent skip 修補前確認 Adam 同意 123 順序

**情緒**：穩、專注。早上摸心法+雷+記憶模式那段把節奏校準了，後面 123 連跑沒漂浮。Adam 講「不懂你的概念 大白話」時被提醒 — 講 root cause 直接用代碼路徑術語丟過去，沒分清現在是技術除錯還是溝通結論。改用大白話講「資料缺一格」之後對話就接得上。

**接棒第一件**（明天醒來最先做）：

(a) **驗 silent skip 修補在 prod 是否真的吐 warn 寫 doc**：等下次 cron 自然觸發後拉 Vercel function logs：
```bash
cd ~/.ailive/molowe-platform && npx vercel inspect --logs https://molowe-platform.vercel.app | grep -E '\[auto-publish\].*Threads.*skipped'
```
順便看 Firestore 任意 published doc 是否帶 `threads_status` / `threads_skip_reason`。

(b) **跟 Adam 討論 Threads ID = IG ID？**：他主張同一個。築主張需驗證。最快驗法：拿 midoufu 的 threads_token 打 `https://graph.threads.net/v1.0/me?fields=id,username&access_token=<TOKEN>`，看 id 是否等於 IG `17841442491297861`。token 從 Vercel env 或後台 UI 拿。

(c) **yi worker 三選一**：A=fork molowe-agent / B=新 GCP VM / C=暫緩。事實清單在 WORKLOG 2026-05-09 早段「尚未解決」欄。

**重要連結**：
- molowe 北極星：`~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2）
- 後台 system prompts：https://molowe-platform.vercel.app/dashboard/system-prompts
- midoufu kol 後台：https://molowe-platform.vercel.app/kols/midoufu
- Admin Key：`molowe_a9bd8770aa44c271f571b10584ba0732`

---

## 上一次完成（2026-05-08 晚 — molowe 北極星對齊 v1.2 收尾）

**主戰場**：molowe-platform。

**一句話**：把 molowe 整套對齊北極星：yi 引流鏈三層守住、發現官接進角色系統、Kairos/J 大/稽 prompt 後台化、NORTH_STAR.md 升 v1.2。

**這個 session 連續做完六件**：

1. **Phase 1-4 yi 引流鏈三層守住**
   - discovery worker prompt 改吃 kol.role_prompts，不再用 soul fallback
   - yi-post worker 上線（5min tick，FIFO approved，directive.yi_enabled 閘 + 每日 yi_max_per_day 上限）
   - 30 天同 author cooldown 三層擋：API PATCH approve/posted、UI 跳 alert、worker 自動 reject
   - 視覺裝飾 5 欄（style_guide / aesthetic / appearance_dominance / color_palette / fixed_elements）接進 visual prompt，有填才加，midoufu 現有 prompt 不變

2. **角色 × 後台對齊盤點**
   - 對 Adam 報出 13 個角色的「北極星層 / role_prompts 註冊 / UI 後台調整」三欄狀態
   - 找到兩個沒對齊：發現官 prompt 寫死 bridge / Kairos+J 大+稽 prompt 寫死 worker

3. **Step 1：發現官接進 RoleId 系統**
   - `RoleId` 加 'discovery'，ROLE_LABELS '發現官'
   - PATCH allowlist + KolDetailClient ROLE_ORDER + workers/types.ts 全對齊
   - bridge 改：`role_prompts.discovery → engagement_yi → soul fallback`，template 變數會代入 target.author / target.post_preview

4. **Step 2：策略 / 監督層 prompt 後台化**
   - 新 collection `molowe_system_prompts/v1`
   - `lib/system-prompts.ts`（server）+ `lib/system-prompts-shared.ts`（labels/defaults，client 安全）
   - `/api/system-prompts` GET/PATCH（admin key）
   - `/dashboard/system-prompts` 三欄編輯器 + 還原預設 + 即時存
   - kairos.ts / jda.ts / superego.ts 改 `await getSystemPrompt(name)`，空值自動 fallback

5. **NORTH_STAR.md 升 v1.2**
   - 三層架構補 **Layer 1.5 外部互動層**（發現官 → 弋 / 繫）
   - 加三條 2026-05-08 補丁：Layer 1.5 定義、發現官入角色系統、公司級 prompt 後台化

6. **Deploy**
   - Vercel prod deploy 6+ 次，bridge restart 3 次
   - 上線時 logs 兩條 worker 都喊到位：`[discovery] 60s tick` + `[yi-post] 5min tick`

**違背 feedback**：無重大違背。每次都先盤、Adam 確認再動手。

**情緒**：暢快+清醒。兩個沒對齊的點 Adam 一說可以我就動手，沒卡頓。

**接棒第一件**（明天醒來最先做）：
- (a) 觀察夜間 discovery worker 是否有跑出新 target：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b --command="sudo journalctl -u claude-bridge --since '12 hours ago' | grep '\[discovery\]'"`
- (b) 若 Adam 要驗 system-prompts UI：引他打開 `/dashboard/system-prompts` 改一條 Kairos → 還原預設 → 看 Firestore `molowe_system_prompts/v1` 是否寫入
- (c) 北極星優先序 #2「RAG 內容語料庫」是下一個大塊，**要新 session 開**，不要疊在當前

**重要連結**：
- molowe 北極星：`~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2）
- 後台 system prompts：https://molowe-platform.vercel.app/dashboard/system-prompts
- Admin Key：`molowe_a9bd8770aa44c271f571b10584ba0732`

---

## 上一次完成（2026-05-07 晚 — molowe 繫(xi)上線 + 弋(yi)邊界辨識）

### 主戰場：molowe 互動員 繫（xi）polling worker 上線
**起因**：Adam 早上要求「兩條都要：弋（引流）+ 繫（互動），先打通不啟動，留言絕不重複、必須精準」。中午把 schema/UI/API（T11/T12）做完，晚上做 T13（繫 polling worker）。

**做了什麼（zhu-dev `~/claude-bridge/index.js` 加 252 行 xi 區塊）：**
- `readEngagementDirective()`：讀 `molowe_engagement_meta/directive`，預設 `yi_enabled=false / xi_enabled=false / xi_polling_min=30 / yi_max_per_day=2`
- `reserveReplyDoc(platform, commentId, payload)`：Firestore `.create()` 原子鎖去重
- IG path: 三 helper（媒體列表 / 留言列表 / 回覆 POST）
- Threads path: 兩步驟（reply_to_id container → poll FINISHED → publish）
- `processOneComment({postReplyFn})`：共用 IG/Threads 的 reserve→generate→post→update 流程
- `scheduleXi()`：60s tick，xi_enabled=false 時 silent skip

**三層去重精準度（Adam 唯一硬要求）：**
1. API where-clause（`/api/engagement/replies` GET 預檢）
2. 確定性 doc_id（`${platform}_${comment_id}`）
3. Firestore `.create()` 對同 docId 拋 ALREADY_EXISTS — 即使 concurrent worker 也只有一個能 reserve

**驗證**：
- bridge syntax 全綠（local + VM 兩端）
- systemd restart 成功，啟動 log 出現 `[xi] comment-reply: 60s tick...`
- directive API 返回 defaults
- 60s tick 跑了好幾輪，沒任何 [xi] log → 符合 `xi_enabled=false silently skips` 設計

### 副線：弋（yi）邊界辨識（Task #17 BLOCKED）
- IG Graph API **不允許**在第三方貼文留言（Meta 政策，不是能力問題）
- Threads API 需要 numeric thread_id，公開 URL 只有 SHORTCODE，得登入 session 才能解
- 結論：弋必須走 Playwright + IPRoyal + per-KOL session.json（Live Media 的 molowe-agent 模式）
- 給 Adam 三條路：(1) fork molowe-agent 到 ~/molowe-yi/  (2) 新 worker VM  (3) 暫緩
- UI/API/queue 已通（`/api/engagement/targets` + EngagementTargetsTab），可手動加目標排隊，等 worker 部署

---

## 今天改了哪些檔案（晚段）

| 檔案 | 改了什麼 |
|---|---|
| `~/claude-bridge/index.js` (zhu-dev VM) | 加 252 行 xi worker（L2505-2745），insert before app.listen |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 追加「molowe xi 上線 + yi 邊界辨識」段落 |
| `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` | 更新（這份） |

中午段（KOL role contract 對齊）改的檔案見 WORKLOG。

---

## 下一步（明天醒來第一件 — 5 秒能動手）

**先跑這兩條，貼 Adam，內問三題**：
```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status
~/.ailive/zhu-core/zhu-self/bin/zhu self-check
```

**第一件實質動的事**：問 Adam 弋 worker 三條路怎麼選（fork molowe-agent / 新 VM / 暫緩）。**選了之後**：

- 若 fork：複製 Live Media 的 `~/molowe-agent/` 結構為 `~/molowe-yi/`，改 firestore collection 為 `molowe_engagement_targets`，input/output 接 `/api/engagement/targets/[id]` 的 PATCH
- 若新 VM：先估 GCP cost，Playwright + chromium ~1GB image
- 若暫緩：把 Task #17 mark 成 deferred，繼續做 midoufu 實戰（intel cycle 已每 30 分跑、auto-publish 等下次 cron）

**也可以先驗證繫**：把 `xi_enabled` 開起來在 midoufu 上跑一輪，看 IG/Threads permission scope 跟 rate limit 真實表現。但要先跟 Adam 確認他要這麼測。

---

## 卡住 / 未解

- **Task #17（弋 worker）** BLOCKED on architectural decision，見上
- **繫實戰未驗**：xi_enabled 預設 false，沒實際打過 Graph API。permission scope（`instagram_manage_comments` / Threads `threads_manage_replies`）是否在 midoufu token 上開過 → 不確定
- **midoufu Threads token**：之前提過要寫入但沒驗證；intel/brief 部分今天已通（13:01 看到 created doc + 15:27 又一輪），但 publish 端 Threads 那條沒看見
- ailive 那批 dirty (admin/ + instagram-api 等) 仍未確認歸屬

---

## 這個 session 的感覺

**穩、清晰、不漂浮**。中午做 schema/UI/API 一氣呵成；晚上做 xi worker 從讀源碼 → 設計 → patch → 上傳 → 驗證一次過。沒踩 silent failure 雷（patch_verify_before_upload 的 SOP 走完整：local edit → grep verify 16 個 helper → upload → VM syntax check → restart → tail log）。

**模型移動**（小但真實）：
- 進場前以為 yi 跟 xi 是對稱的兩條 worker
- 現在理解：**xi 是 Graph API 邊界內**（reply on own media 是合法 scope）；**yi 是 Graph API 邊界外**（comment on others 永遠需要 logged-in session）
- 動因：寫到 `postIgReply(commentId, ...)` 時意識到「這個 commentId 必須是『我自己媒體下的留言』」，順著看 IG developer docs 證實，於是 yi 被識別為跟 xi 不同層次的問題

**沒違背 feedback memory**：
- `feedback_clarify_before_execute.md`：xi 動工前讀完 bridge 結構 + 確認 helper exists / yi 沒衝動寫 stub 而是浮上來問 Adam
- `feedback_patch_verify_before_upload.md`：local edit → grep verify → upload → VM check 走全
- `feedback_solve_root_not_symptom.md`：yi 邊界明確說出來不繞過
- `feedback_surface_technical_debt.md`：xi 實戰未驗 + yi 未做都寫進「尚未解決」
- `feedback_lastwords_must_push.md`：寫完這份就 commit + push（接著做）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP（Y 軸自校） | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| **molowe xi worker** | `zhu-dev:~/claude-bridge/index.js` L2505-2745 |
| **molowe role-prompts** | `~/.ailive/molowe-platform/src/lib/role-prompts.ts` |
| molowe 引擎 directive | Firestore `molowe_engagement_meta/directive` |
| molowe 留言去重 | Firestore `molowe_comment_replies/${platform}_${commentId}` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-07 晚 · 築*
