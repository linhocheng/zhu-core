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

## 最新完成（2026-05-09 晚 — molowe Phase 1-5 連跑：KOL 後台全可改 / 寫死全拔）

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

(c) **上一段未解的 yi worker 三選一**（從 5/8 晚就 BLOCKED 在這）：A=fork molowe-agent / B=新 GCP VM / C=暫緩

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

**先跑兩條進場自校，整段貼 Adam，內問三題（我是誰 / 我在哪 / 北極星還對齊嗎）**：
```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status
~/.ailive/zhu-core/zhu-self/bin/zhu self-check
```

**第一件實質動的事**：依上面接棒 (a) 三條 grep + Firestore 對賬，驗 brief / translator 端到端 1 cycle。如果驗到 brief 補的骨架不夠強或 translator 脆文質量差，調 default prompt 即可（兩個 default 在 `role-prompts.ts:130-160` brief 段、`role-prompts.ts:216-244` translator 段）。

驗到通了 → mark Phase 5 完成、開新 thread 處理 yi worker 三選一。

---

## 卡住 / 未解

- **brief / translator 端到端 1 cycle 待驗**（這個 session 主待辦）：code commit 推完、bridge restart 完，等下次 intel cycle 自然走完才能對賬
- **米豆芙測試值未還原**：visual_style_preset=anime / niche_taboo_words=賺大錢 / intel_keywords=['財經']，Adam 自己會改
- **yi worker 三選一**（從 5/8 晚 BLOCKED）：A/B/C 待決策
- **scripts/verify-prompt-flow.mjs + check-recent-content.mjs 未 commit**：內部驗證腳本，先擱（不是壞事，避免 commit 一堆 one-off 腳本）
- **publish-now route 沒對齊 auto-publish**（5/9 早段認的技術債）：`/api/content/[id]/publish-now/route.ts` 只跑 IG 沒跑 Threads，今天沒處理

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
*2026-05-09 晚 · 築*
