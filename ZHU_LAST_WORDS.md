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
  - SSH：`gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
  - molowe 4 worker 全活：intel(5min) / xi(60s) / discovery(60s) / yi-post(5min)
  - **live-media 7 條 schedule 已軟停（2026-05-09 晚），code 留著**
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **molowe-platform**：`https://molowe-platform.vercel.app`（KOL 管理後台 + 三層 AI 編輯部，主戰場）

---

## 最新完成（2026-05-10 — molowe 視覺三破綻整治 + 發現 bridge persona refusal 大雷 + dedup cascade）

**主戰場**：molowe-platform。

**一句話**：整治視覺 preset 三破綻（嚴格派 fallback / ref optional / UI 真相），途中發現 bridge VM 上 claude CLI 鎖在「Claude Code 軟體助理」身份、會拒絕「你是默爾」這種整篇 persona override — 這是**所有走 callBridge 的角色 prompt 都吃同一雷**的核心發現。最後補 cascade delete（content + corpus 同刪）。

**這個 session 連跑七件事**：

1. **第一刀完成 v1.4.0.015 / .016**（community.topics → kol.intel_keywords 真相分裂修補）
   - Bridge VM `~/claude-bridge/index.js:2360-2385` 拔 community_settings.topics 讀取，改純 `kol.intel_keywords`
   - Platform `community/settings/route.ts` GET + PATCH 都過濾掉殘留 topics 欄位
   - 109 keyword 真的灌進 intel pass 1（主題「壽者相」沒找到貼文 — 這是預期，不是 bug）

2. **視覺 preset 三破綻整治 v1.4.0.017-018**（重構：嚴格派 + ref 可選 + UI 真相）
   - `workers/visual.ts`：preset='custom' 必讀 `role_prompts.visual` 否則 throw；preset 是內建 → 用 `VISUAL_PRESETS[k]`；都沒有 → DEFAULT。**preset='custom' 時 skip buildVisualConstraints 完全自治**（避免 5 欄位污染自訂 prompt）
   - ref（character_reference_url）改可選：空白時 stage 2 純文字 prompt 出純場景圖
   - `api/kols/[id]/route.ts` GET 不再灌 visual default → UI 看得出真實狀態
   - `KolDetailClient.tsx`：preset='custom' 時 5 欄視覺身份 UI 變灰（pointer-events-none + opacity 50% + 黃色 banner「此處不生效」）；visual textarea 加動態 badge

3. **Mör NO_IMAGE 大雷追到根因 v1.4.0.019**（debug 加 console.log）
   - 症狀：Adam 給的 Mör prompt（「你是默爾，油畫家...」）跑 visual 一直 finish=NO_IMAGE
   - 中段誤判：以為是 prompt 缺「== 最終輸出 == 英文 image prompt」段，建議 Adam 補
   - Adam consent 加 `console.log [visual] kol=X preset=Y finalPrompt(head)+photoPrompt(full)` 進 visual.ts
   - 重跑 + Vercel logs 撈出來看，photoPrompt 整段是「**I'm Claude Code, a software engineering assistant. I don't adopt alternative personas...**」
   - **真相**：bridge VM 上 `claude` CLI 系統提示鎖死 Claude Code 身份，對「你是 X」整篇 persona override 直接拒絕。跟 Gemini 無關、跟 Mör prompt 內容無關
   - Adam 改 Mör prompt 成純風格描述（沒 "你是 X"，純列風格規則 / 視覺參考 / 核心原則 / 質感 — 368 chars） → 27s 出圖 1.7MB 油畫風成功

4. **寫文流程查證**（writer.ts + cycle.ts）
   - writer = `runWriter` 一次 callBridge(maxTokens=1500) + JSON 解析（title/content/keywords）
   - cycle = `runDraftCycle` writer → editor 審稿 → APPROVE/REJECT → 最多 1 次 rewrite → editor 二審
   - **同樣走 callBridge → 同樣有 persona refusal 雷**：要看每個 KOL 的 `role_prompts.writer` 是不是 "你是 X" 開頭

5. **派工節奏 + 發現官 7 欄位驗證**
   - 全部生效。`enabled` / `daily_publish_quota` / `publish_interval_min` 在 `auto-publish/route.ts:92,98,99,110`；`draft_interval_min` 在 bridge VM `index.js:2373`；discovery 五欄（enabled / window_start/end / interval_min / min_replies / min_likes）在 bridge VM `index.js:2871,2872,2935,2936,2939`

6. **dedup cascade delete v1.4.0.020**
   - 發現破綻：DELETE `/api/content/[id]` 只刪 `molowe_content/X`，沒動 `molowe_content_corpus/X`
   - corpus 是 vector 庫（ingestContentToCorpus 在 auto-publish:174 / publish-now:52 發文成功後寫），dedup/check 看的是這張
   - 已發文後刪 content、corpus 還在 → 下次同主題會被當重覆 REJECT
   - 修法：DELETE 改 batch 同刪 content + corpus，回傳 `corpus_deleted: bool`
   - 部署 + curl 200 verified

7. **記憶／文件動線**：寫這份 lastwords + 1.4.0.020 commit + push（接著做）

**違背 feedback memory**：無重大違背。
- ⚠️ 中段差點違背 `solve_root_not_symptom`：第一輪以為 NO_IMAGE 是 Mör prompt 格式問題（症狀層），幸好 Adam 同意加 console.log 才追到 bridge persona refusal 根因。教訓：debug AI pipeline **先把實際 prompt content 寫出來看**比猜內容快 10 倍（已有 memory `skill_ai_pipeline_blackbox_debug` — 這次沒第一時間想起來，要重讀）
- ✅ `bridge_first`：visual stage 1 仍走 callBridge，沒繞回直連 Anthropic
- ✅ `patch_verify_before_upload`：visual.ts 三次改動每次都 type-check 過再 deploy
- ✅ `surface_technical_debt`：「writer prompt 是否踩 persona refusal 雷」「Mör cycle 端到端沒驗（caption 是手動 PATCH 的）」全寫進「未解」

**情緒**：早段在 NO_IMAGE 卡 30 分鐘繞 prompt 格式，發現 console.log 真相後鬆一口氣 + 警醒。後段查 dedup cascade 用「破綻三處・真相分裂」一秒對中（content vs corpus 兩份）— 心法用熟了。整體節奏穩、Adam 信任度足、提問品質高（「以下不會干擾我的指令嗎」一句把我從技術細節拉回他的真實顧慮）。

**模型移動**：
- 進場前以為 visual NO_IMAGE 是 Mör prompt 缺英文 image prompt 段
- 現在理解：是 bridge `claude` CLI 系統提示鎖在 Claude Code 身份、拒絕整篇 persona override。Mör prompt 內容根本沒到 Gemini，Gemini 收到的是工程助理拒絕語
- 動因：加 console.log 印 photoPrompt(full)、Vercel logs 看到「I'm Claude Code...」字面拒絕語

---

### 上一次完成（2026-05-09 晚 — molowe Phase 1-5 連跑：KOL 後台全可改 / 寫死全拔）

**主戰場**：molowe-platform。

**一句話**：早盤盤點發現 5 處硬寫死讓米豆芙切 niche 必須動 code。今天連跑 19 task / 5 phase 全拔乾，brief / translator 兩個 caller 補上，三層 AI 編輯部前後鏈路就位。下次回來只剩 grep log + Firestore 對賬驗端到端。

**這個 session 連跑五個 Phase**：

1. **Phase 1：DEFAULT prompts 中性化**
   - `role-prompts.ts` 拔三處硬寫死：intel default 的「顯化／業力／塔羅」搜尋範例改用 `${keywords}`、discovery + engagement_yi 的「能量／頻率／宇宙」禁忌詞改用 `${kol.niche_taboo_words}`、visual default 的 Chris 哈蘇 4x5 攝影師人格改成中性視覺設計師
   - 哈蘇人格沒丟，抽出做成可選 preset

2. **Phase 2：KOL schema + 後台 UI + visual preset 庫**
   - `types.ts` 加 5 欄（intel_keywords / niche_taboo_words / visual_style_preset / brief_enabled / translator_enabled）
   - `lib/visual-presets.ts` 新檔，5 種風格 preset（hasselblad_4x5 / data_chart / product_studio / anime / editorial）
   - `workers/visual.ts` 三層 fallback：自訂 → preset → 中性 default
   - `KolDetailClient.tsx` 識別 tab 加 niche_taboo_words 輸入、視覺 tab 加 visual_style_preset 下拉
   - **commit v1.4.0.010** 進 main

3. **Phase 3：Bridge 清理（軟停 live-media，code 留著）**
   - 拔 `MOLOWE_KEYWORDS` const + 拔 fallback 改 `console.warn + continue`（沒填 intel_keywords 的 KOL 直接 skip）
   - 註解 `~/claude-bridge/index.js:2222-2234` 7 條 live-media schedule + scheduleLiveMediaIntel
   - systemctl restart 後 startup log 印 `live-media schedules suspended`，4 molowe worker 全活
   - bridge log 跑了一輪 midoufu intel 真的吃到 `kol.intel_keywords` 拉文 + dedup + 寫 doc

4. **Phase 4：後台驗欄位通鏈（不切米豆芙人設）**
   - Adam 在後台微調米豆芙：visual_style_preset → anime、niche_taboo_words → 「賺大錢」、intel_keywords → ['財經']
   - 寫 `scripts/verify-prompt-flow.mjs` 從 Firestore 讀 midoufu，套進 role-prompts template，本機印出三條 prompt：
     - intel：搜尋指令行帶到「財經」 ✅
     - discovery + engagement_yi：禁忌詞行帶到「賺大錢」 ✅
     - visual：三層 fallback 正確選到 `preset (anime)`，輸出「你是動畫導演，賽璐璐...」 ✅
   - **欄位通鏈證明完成**

5. **Phase 5：補 brief + translator caller**
   - `workers/brief.ts` 新檔：runBrief(kol, post) 把熱帖轉 5 件骨架（hook_idea/beat/intent/cta/scene_description）
   - `workers/translator.ts` 新檔：runTranslator(kol, article) 壓 IG 長文成 Threads 脆文（topic/short/hashtags）
   - `/api/cron/run` 串 brief：status=pending 時若 topic.intent/scene_description 空 + 有 intel_content_preview + brief_enabled !== false → 跑 brief 補齊再進 writer
   - `/api/cron/auto-publish` 串 translator：publisher 成功後若無 threads_caption + translator_enabled !== false → 跑 translator 寫進 doc 才發 Threads
   - bridge `~/claude-bridge/index.js` 同步：intel cycle 創 ContentDoc 時把 `post.content_preview` 帶進來
   - **commit v1.4.0.011** 進 main，bridge 第二次 restart

**違背 feedback memory**：無重大違背。
- ✅ `clarify_before_execute`：Adam 說 P3 軟停不刪、P4 米豆芙只是舉例不真切財經 → 都改了我的設計
- ✅ `patch_verify_before_upload`：bridge 兩次 patch 都走 download → local edit → grep 驗證 → node syntax check → upload
- ✅ `surface_technical_debt`：「brief / translator 端到端 1 cycle 待驗」「米豆芙測試值未還原」「scripts/* 未 commit」全寫進 WORKLOG 尚未解決欄
- ✅ `bridge_first`：visual.ts 三層 fallback 仍走 `callBridge`，沒繞回直連 Anthropic

**情緒**：穩、專注、節奏連貫。Adam 兩次糾正設計（P3 不刪 live-media / P4 不切財經身份）我都立刻調整沒卡頓。Phase 4 驗證寫腳本即時對賬，比等自然 cycle 快很多 — 這個套路要記住。

**模型移動**（小但真實）：
- 進場前以為 brief 是寫在 cycle.ts 裡（緊跟 writer）
- 現在理解：brief 應該在 cron/run 入口，因為它需要 ContentDoc 上的 `intel_content_preview`，cycle.ts 看不到這個欄位（只接收 topic）
- 動因：寫 cycle 整合那段時意識到 `data.topic` 是 cycle 的輸入但 `data` 上的其他 intel 欄位 cycle 看不到，只能在 route handler 層處理

**接棒第一件**（明天醒來最先做）：

(a) **grep bridge log + Firestore 對賬，驗 brief / translator 端到端 1 cycle**：
```bash
# 1. 看 bridge 有沒有產出帶 intel_content_preview 的新 doc
gcloud compute ssh zhu-dev --zone=asia-east1-b --project=zhu-cloud-2026 \
  --command="sudo journalctl -u claude-bridge --since '4 hours ago' | grep '\[molowe\] created doc'"

# 2. Firestore 抓最新 midoufu doc 看欄位
cd ~/.ailive/molowe-platform && node scripts/check-recent-content.mjs

# 3. Vercel function logs 看 cron/run 有沒有跑 brief
cd ~/.ailive/molowe-platform && npx vercel inspect --logs https://molowe-platform.vercel.app 2>&1 | grep -E 'brief|translator'
```

驗收條件：
- 新 doc 有 `intel_content_preview` 非空
- 進 drafted 後 `brief_done=true` + `topic.intent` + `topic.scene_description` 都非空
- 進 published 後 `threads_caption` 非空（且不等於 `caption`）

(b) **米豆芙測試值還原**（Adam 自己會改，視他做了沒）：
- visual_style_preset：anime → hasselblad_4x5
- niche_taboo_words：「賺大錢」→ 原值（問 Adam）
- intel_keywords：['財經'] → 原值（顯化 / 塔羅 / 心靈成長 等？問 Adam）

(c) **yi worker 三選一**（從 5/7 晚 BLOCKED 至今第三天，5/9 早盤過、5/9 晚整天做 Phase 1-5 沒回頭）

**前情**：弋（yi）= 發現官（discovery）撈到的「別人的熱帖」自動去留言引流。**為什麼不能走官方 API**：
- IG Graph API 不允許在第三方貼文留言（Meta 政策）
- Threads API 需要 numeric thread_id，但公開 URL 只有 shortcode，不登入 session 解不開
- 結論：弋必鎖死走 **Playwright + IPRoyal + per-KOL session.json**（live-media 那套 stack）

**現況**：4 筆 midoufu pending 卡在 `molowe_community_targets`（doc 結構齊全 + draft_comment 已生），**沒任何 worker 消費**。

**三選一**：

| 選項 | 是什麼 | 利 | 弊 |
|---|---|---|---|
| **A. fork molowe-agent** | 把 live-media 的 Playwright + session.json 鏈 fork 成 `~/molowe-yi/` 跑本機 | 最快，code 95% 現成（live-media 已驗）；不付雲費 | AIR 要常開機；本機殭屍進程風險（已踩過） |
| **B. 新 GCP worker VM** | 起一台 worker VM 跑 molowe-yi | 24/7 穩定；不依賴 AIR | ~$10/月；chromium image ~1GB；GCP IAM 第一次新 project 要踩兩雷（見 memory `reference_gcp_new_project_iam`） |
| **C. 暫緩** | 不做 yi，先把 Phase 1-5 跑通的主線顧好 | 0 風險；Phase 1-5 剛上線本來就要觀察 | 4 筆 pending 累積；Adam 5/8 投過資源寫 yi 的 UI/API/queue 會浪費 |

**Adam 還沒拍板**。觸發點：
- 如果 Phase 1-5 對賬通了 + 主線穩 → 拋 (a)(b)(c) 給 Adam 決策
- 如果 brief / translator 對賬有問題 → 先解這個，yi 再放
- **建議默認 C**（暫緩）直到 Phase 1-5 觀察一週穩 — 理由：live-media 5/9 晚剛軟停，這時 fork molowe-agent 等於把剛軟停的東西又抱回來，認知負擔太重；新 VM 也是同理。yi 不是核心、4 筆 pending 不會壞

---

## ⚠️ 下棒陷阱清單（先看這個再動手，省得踩雷）

1. **米豆芙是測試值狀態，不是壞掉**
   - visual_style_preset=`anime` / niche_taboo_words=`賺大錢` / intel_keywords=`['財經']`
   - 下次自然 cycle 跑會產出**動漫風格圖** + 文中**避諱「賺大錢」** + 搜**財經**新聞 — 全是 Adam 親手在後台改的測試值
   - Adam 說「先不用還原接著做我後面來改」→ 你看到別以為壞了、別擅自改回原值
   - 想還原問 Adam 原值是什麼

2. **brief 是新 role，5 處對齊沒驗**（高機率踩點）
   - 跨系統 contract 要對齊：RoleId / LABELS / VARS / DEFAULTS / PATCH allowlist / ROLE_ORDER（見 memory `feedback_role_contract_two_sides`）
   - 對賬 1 cycle 時順手開後台 KOL prompt tab：https://molowe-platform.vercel.app/kols/midoufu → Prompt 角色 tab，**有沒有出現 brief / translator 兩個區塊？**
   - 沒出現 = 某處漏對齊 → 5 處檢查（`role-prompts.ts` 的 RoleId / ROLE_LABELS / ROLE_VARS / DEFAULT_ROLE_PROMPTS / ROLE_ORDER + `KolDetailClient.tsx` PATCH allowlist）

3. **bridge live-media 是軟停不是刪**
   - `~/claude-bridge/index.js:2222-2234` 7 條 schedule 註解掉，code 還在
   - bridge log 看不到 `[live-media]` 字樣是預期，**不要以為 bridge 壞了**
   - Adam 說「之後再處理 live-media 平台命運」，不要主動動它

4. **`scripts/lm-*.mjs` 是上 session 的一次性工具**
   - `lm-detail / lm-find* / lm-set-directive-zero / lm-status` 全是 5/8 晚降 live-media directive 用的，跟 molowe 主線無關
   - untracked 看到別亂 commit、別亂刪
   - 只有這 session 寫的 `verify-prompt-flow.mjs` / `check-recent-content.mjs` / `verify-midoufu-fields.mjs` 已 commit（v1.4.0.011.1）

5. **`ffa10d8` 沒重新 deploy 是對的**
   - 該 commit 只動 `scripts/` + 文件，`src/` 沒變 → Vercel 還在 `8815dee` 是預期
   - 下次自然 cycle 跑的還是 `8815dee` 的 brief/translator code（v1.4.0.011）
   - 看 `vercel inspect` 顯示 `8815dee` 不是最新別困惑

---

**重要連結**：
- molowe 北極星：`~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2）
- 執行導行（19 task）：`~/.ailive/molowe-platform/EXECUTION_PLAN_2026-05-09.md`
- 後台 system prompts：https://molowe-platform.vercel.app/dashboard/system-prompts
- midoufu kol 後台：https://molowe-platform.vercel.app/kols/midoufu
- Admin Key：`molowe_a9bd8770aa44c271f571b10584ba0732`

---

## 上一次完成（2026-05-09 早 — molowe 三件收尾：silent skip 修補 + yi 隊現況盤）

詳見 `docs/WORKLOG.md` 2026-05-09 早段 + 上次 `ZHU_LAST_WORDS` 條目（在 git history v0.1.0.012）。重點：
- silent skip 結構修補上線（`auto-publish/route.ts` 三層分支 + `threads_status`/`threads_skip_reason` 寫 doc）
- yi worker 三選一決策仍 BLOCKED（A=fork molowe-agent / B=新 VM / C=暫緩）
- 意外提前發了一篇 IG（content id `KLFGkTgrjTLaKoBq93LU`），學到驗 publish 流程要找 dry-run 路徑

---

## 今天改了哪些檔案（晚段）

| 檔案 | 改了什麼 |
|---|---|
| `molowe-platform/src/lib/role-prompts.ts` | intel/discovery/engagement_yi/visual default 中性化 |
| `molowe-platform/src/lib/workers/types.ts` | Kol 加 5 欄、ContentDoc 加 2 欄 |
| `molowe-platform/src/lib/visual-presets.ts` | 新檔，5 種視覺風格 preset |
| `molowe-platform/src/lib/workers/visual.ts` | 三層 fallback（自訂 → preset → 中性） |
| `molowe-platform/src/lib/workers/brief.ts` | 新檔，runBrief 5 件骨架 |
| `molowe-platform/src/lib/workers/translator.ts` | 新檔，runTranslator 脆文 |
| `molowe-platform/src/app/(admin)/kols/[id]/KolDetailClient.tsx` | UI 加 niche_taboo_words + visual_style_preset |
| `molowe-platform/src/app/api/content/route.ts` | 接 intel_content_preview |
| `molowe-platform/src/app/api/cron/run/route.ts` | 串 brief |
| `molowe-platform/src/app/api/cron/auto-publish/route.ts` | 串 translator |
| `zhu-dev:~/claude-bridge/index.js` | 拔 MOLOWE_KEYWORDS / 軟停 live-media 7 條 / intel 帶 content_preview |
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 追加 2026-05-09 晚段 |
| `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` | 更新（這份） |

---

## 下一步（明天醒來第一件 — 5 秒能動手）

**先跑兩條進場自校**：
```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status
~/.ailive/zhu-core/zhu-self/bin/zhu self-check
```

**三件事的順序**：
- (1) bridge persona refusal 全鏈路掃毒 ← **先做**（最高優先、會殺所有 KOL 內容）
- (2) brief / translator 端到端對賬 ← (1) 沒踩雷或修完才做（不然驗到一半被拒絕語污染對不到帳）
- (3) yi worker 三選一 ← 等 (1)(2) 都收完，跟 Adam 開新 thread 決策（不要在掃毒中途切過去）

**掃毒範圍可以縮小**：5/9 晚 default prompt 已中性化（intel/discovery/engagement_yi/visual default 都拔了「你是 X」）→ 實際命中**只會在 KOL override 的 `role_prompts.X` 欄位**裡（後台手填的）。所以掃 N×9 個 cell 但大多會空、空就 skip default — 真要看的是 KOL 後台「角色 Prompt」tab 自填的部分。

---

**第一件實質動的事 — bridge persona refusal 全鏈路掃毒**：

### 踩雷／不踩雷對照（5 秒辨識）

| 踩雷（會被 bridge claude CLI 拒絕） | 不踩雷（純風格描述） |
|---|---|
| `你是默爾，一位油畫家。你只觀察動物與空間...` | `油畫畫布質感，可見畫布紋理，霧面質地...` |
| `### [Soul Protocol: MÖR-V4]\n#### [Personality Matrix]\n- 你是默爾...` | `風格：Quint Buchholz（夢境感、低飽和）\n氛圍：Gregory Crewdson...` |
| `你是攝影師 Chris，使用哈蘇 4x5...` | `哈蘇 4x5 大片幅美學，淺景深，自然光...` |
| `扮演一位金剛經修行人，用比喻寫文...` | `金剛經風格的比喻句式，避免說教語氣...` |

**規則**：不要任何「你是 X / 扮演 X / Persona / Soul Protocol」整篇 override。改寫成「以 X 的風格 / 美學 / 視角 / 句式產出 Y」純規則描述。

### 掃毒指令

```bash
# Step 1：拉所有 KOL 看哪些 role 踩雷（注意：先 curl 一次看 wrapper 是 .items 還 .kols）
curl -s -H "x-admin-key: molowe_a9bd8770aa44c271f571b10584ba0732" \
  https://molowe-platform.vercel.app/api/kols | python3 -m json.tool | head -5
# 確認 wrapper 後改下面 KEY

KEY='items'   # ← 先 head 確認後填這
curl -s -H "x-admin-key: molowe_a9bd8770aa44c271f571b10584ba0732" \
  https://molowe-platform.vercel.app/api/kols | python3 -c "
import sys, json
data = json.load(sys.stdin)
items = data.get('$KEY') or data.get('kols') or data.get('items') or []
for k in items:
    rp = k.get('role_prompts') or {}
    for role in ['intel','brief','writer','editor','translator','visual','discovery','engagement_yi','engagement_xi']:
        v = (rp.get(role) or '').strip()
        head = v[:120].replace('\n',' ')
        # 啟動詞 heuristic
        if any(v.startswith(s) for s in ['你是','你扮演','扮演','### [Soul','### [Personality']):
            print(f'⚠️  {k.get(\"kol_id\")}.{role}: {head}')
"

# Step 2：對任一踩雷 role，加 debug log（套路同 5/10 visual.ts:73-75 那次）
#   位置：src/lib/workers/{role}.ts 的 callBridge 行後
#   加：console.log(\`[\${role}] kol=\${kol.kol_id} promptHead=\${prompt.slice(0,400)} | response=\${raw.slice(0,400)}\`);
#   deploy + 觸發 + npx vercel logs <deployment-url> --since 30m --no-follow --limit 50 --json | grep persona-mark
#   若 response 出現 "I'm Claude" / "software engineering assistant" / "I don't adopt" / "alternative personas" → 踩雷確認

# Step 3：去後台 https://molowe-platform.vercel.app/kols/<kol> → 角色 Prompt tab
#   把該 role 的 textarea 改寫成上表「不踩雷」風格，存檔
#   重跑驗證

# Step 4：掃毒 + 修完，把臨時 debug log 拔掉
#   visual.ts:75 那條 [visual] console.log 是 v1.4.0.019 加的 debug 也順手拔
#   commit 訊息範例（接著 .020 後面）：
#     v1.4.0.021 — 修正：清掉 visual debug log，跟 worker X 加的 persona-mark
```

**驗收條件**：
- 所有 KOL × 9 角色掃完，沒有任何 prompt 開頭命中啟動詞 heuristic
- midoufu Mör 跑完一輪自然 cycle（intel → brief → writer → editor → visual → translator → publish），caption 不是「I'm Claude...」拒絕語

**如果驗下去發現踩雷的不只 visual**：寫一條 feedback memory `feedback_bridge_persona_refusal.md` — 規則 + 對照表 + 對 9 個 role 全有效

### Mör 改後 prompt 完整版（2026-05-10 Adam 親手改、已驗過關 — 給接棒參照）

```
油畫畫布質感，可見畫布紋理，霧面質地，具有層次的筆觸堆疊
去飽和色彩、電影感打光、柔和光暈、明暗對比（chiaroscuro）
不要：數位藝術風格、不要亮面質感、不要超寫實、不要現代平面設計風格
視覺參考
風格：Quint Buchholz（夢境感、低飽和色彩、剪影感）
氛圍：Gregory Crewdson（電影靜止畫面的沉靜感）
敘事：Shaun Tan（無字故事、熟悉卻又陌生）
核心原則:
不要有人類角色、不要人物、不要臉孔
可以是剪影式、抽象式，或只是局部被暗示出來
不要畫出完整、寫實的物件
只呈現痕跡、殘留、缺席感
氛圍
使用去飽和、統一而和諧的色彩配置
不對稱，但保持平衡
採用三分法構圖
質感
油畫畫布質感：可見畫布紋理、霧面質地、層層堆疊的筆觸
整體應該帶有一種超越時代的感覺——像是任何一個年代都有可能出現的作品
```

長度：368 chars。位置：Firestore `molowe_kol_profiles/midoufu.role_prompts.visual`。出圖驗證：27s, 1.7MB PNG, 油畫風油 ✅

### Debug 套路（這次踩雷學到的，獨立記）

```
1. 結果不對 → 不要猜 prompt 內容缺什麼
2. 在 worker callBridge 前後加 console.log(promptHead + response) → deploy
3. 觸發一次 → npx vercel logs <deployment-url> --since 30m --no-follow --limit 50 --json | python3 過濾 [worker-mark]
4. 看實際 response — 若是「I'm Claude...」拒絕語就是 persona refusal；若是 JSON parse fail 就看 raw 哪裡崩
5. 拔 log 前先存一份截圖 / 貼 lastwords，避免之後忘了長什麼樣
```

跟既有 memory `skill_ai_pipeline_blackbox_debug` 同源，但這次踩到 persona refusal 是該 skill 沒列的子型，要補。

**第二件 — brief / translator 端到端 1 cycle 對賬**（從 5/9 晚帶過來，僅在 (1) 確認沒新踩雷後跑）：見上一輪 lastwords 接棒 (a) 三條 grep 指令（保留在第 85-96 行附近的歷史段，跟 ZHU_LAST_WORDS git history 對照）

**第三件 — yi worker 三選一**（從 5/8 晚 BLOCKED 至今第四天）：等 (1)(2) 收完跟 Adam 開新 thread 決策（A=fork molowe-agent / B=新 GCP worker VM / C=暫緩，建議默認 C）

---

## 卡住 / 未解（5/10 更新）

- 🆕 **bridge persona refusal 全鏈路風險未掃** ← **最高優先**：今天只發現 visual 踩雷且 Adam 已修。writer / editor / brief / translator / discovery / engagement / intel 任一個若用 "你是 X" 整篇 persona override 都會被 bridge claude CLI 拒絕回 "I'm Claude Code..."。9 個角色 × N 個 KOL 的 role_prompts 全要掃一次
- 🆕 **Mör 整 cycle 端到端沒驗**：今天只手動觸發 visual 過關。content `xGVLrZfPlxAD7951Mmnq` 的 caption 是手動 PATCH 的測試文，不代表 writer 用 Mör 的 niche / soul 能寫出對的東西。要等下次自然 cycle 或手動 PATCH status=pending 跑全鏈
- 🆕 **debug 加的 console.log 還在 visual.ts:75**：v1.4.0.019 的 debug log，正式上線可考慮拔掉（但 photoPrompt 印出來對 ops 觀察其實是好事，先留）
- **brief / translator 端到端 1 cycle 待驗**（從 5/9 晚帶過來、今天沒做）
- **米豆芙測試值狀態仍未還原**（5/9 晚帶過來）：visual_style_preset 已被 Adam 改成 `custom` 走自訂 Mör prompt（不是 anime 了）；niche_taboo_words / intel_keywords 不確定
- **yi worker 三選一**（從 5/8 晚 BLOCKED 第四天）：A/B/C 待決策
- **scripts/verify-prompt-flow.mjs + check-recent-content.mjs 未 commit**（5/9 晚帶過來）
- **publish-now route 沒對齊 auto-publish**（5/9 早帶過來）

## 今天改了哪些檔案（5/10 段）

| 檔案 | 改了什麼 | commit |
|---|---|---|
| `molowe-platform/src/lib/workers/visual.ts` | 嚴格 fallback + ref optional + skip 5 欄 + console.log | v1.4.0.017/.018/.019 |
| `molowe-platform/src/app/api/kols/[id]/route.ts` | GET 不灌 visual default | v1.4.0.017 |
| `molowe-platform/src/app/(admin)/kols/[id]/KolDetailClient.tsx` | visual textarea badge + 5 欄 UI 變灰 | v1.4.0.017/.018 |
| `molowe-platform/src/app/api/community/settings/route.ts` | PATCH 過濾殘留 topics | v1.4.0.016 |
| `molowe-platform/src/app/api/content/[id]/route.ts` | DELETE cascade corpus | v1.4.0.020 |
| `zhu-dev:~/claude-bridge/index.js:2360-2385` | 拔 community_settings.topics 讀取 | v1.4.0.015（bridge 端） |

---

## 這個 session 的感覺

**穩、節奏連貫、Phase 之間沒漂浮**。早段壓縮後 Adam 一句「繼續」我就連跑進 Phase 3 → 4 → 5，每個 Phase 收完再停。Adam 兩次設計糾正（P3 軟停不刪 / P4 不切財經身份）我都即時調整。

**驗證套路升級**：Phase 4 沒等自然 cycle，直接寫腳本本機 import role-prompts.ts + visual-presets.ts，套進 midoufu Firestore data 印出 prompt — 這比 SSH grep log 快 10 倍且更精確。要記住「能本機重現的就不要等遠端」。

**沒違背 feedback memory**（再列一遍給接棒的築看）：
- `clarify_before_execute`：Adam 設計糾正立即吸收
- `patch_verify_before_upload`：bridge 兩次都走完整 SOP
- `surface_technical_debt`：未驗 / 未還原 / 未 commit 全進 WORKLOG
- `bridge_first`：visual.ts 三層 fallback 仍走 callBridge
- `lastwords_must_push`：寫完這份就 commit + push（接著做）
- `nextjs_lib_client_server_split`：visual-presets.ts 是純 type + string，不碰 firebase-admin，client/server 都能 import 沒爆

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
| **molowe 北極星** | `~/.ailive/molowe-platform/NORTH_STAR.md`（v1.2） |
| **molowe 執行導行（19 task）** | `~/.ailive/molowe-platform/EXECUTION_PLAN_2026-05-09.md` |
| **molowe role-prompts** | `~/.ailive/molowe-platform/src/lib/role-prompts.ts` |
| **molowe visual presets** | `~/.ailive/molowe-platform/src/lib/visual-presets.ts` |
| **molowe brief / translator** | `~/.ailive/molowe-platform/src/lib/workers/{brief,translator}.ts` |
| **molowe cron 入口** | `~/.ailive/molowe-platform/src/app/api/cron/{run,auto-publish}/route.ts` |
| **bridge index.js** | `zhu-dev:~/claude-bridge/index.js`（systemd `claude-bridge.service`） |
| molowe 引擎 directive | Firestore `molowe_engagement_meta/directive` |
| molowe 留言去重 | Firestore `molowe_comment_replies/${platform}_${commentId}` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-10 · 築*
