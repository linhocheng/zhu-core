# molowe-platform 技術打撈備忘（2026-05-30 停止前）

> 專案 `~/.ailive/molowe-platform` 於 2026-05-30 停止（移除 Vercel deployment）。
> 停止時 KOL `aurae` 仍 enabled、當天還在產文；`midoufu` 已關。Firestore 在 **moumou-os**（collection 前綴 `molowe_*`）。
> 本檔記下值得日後複用的技術，含確切檔案路徑。code 仍在本機 + git（最新 commit v0.0.0.013）。

## 整體架構：三層 AI 編輯部
- **Kairos 週策略師**（`src/lib/workers/kairos.ts`）：看數據模式給「本週方向盤」（weekly_themes / weekly_avoid / weekly_tone_shift），不給具體題目。
- **J 大 每日指令官**（`src/lib/workers/jda.ts`）：把週策略變成今天 1-3 個具體角度。
- **稽 superego 聲紋稽核員**（`src/lib/workers/superego.ts`）：判斷「這還是不是這個 KOL」。
- 三者的 system prompt 可從後台 `/dashboard/system-prompts` 編輯，存 Firestore `molowe_system_prompts/v1`，code 有 `SYSTEM_PROMPT_DEFAULTS` 兜底。**停止時該 doc 不存在 → 全跑 code 預設值**。

## 值得特別留意的可複用技術

### 1. 語義角度去重 gate（寫作前擋重複角度）★最值得
- `src/lib/tools/corpus.ts` + `src/lib/embeddings.ts`
- Firestore **原生向量搜尋** `findNearest`（COSINE，`embedding` 欄位，768 維），對 `molowe_content_corpus` 查最近角度。
- `cron/run` 在寫作前算 `queryContentCorpus(angleQ)`，`distance < 0.20` 視為角度雷同 → 標 failed 不進寫作（`src/app/api/cron/run/route.ts:122`）。
- embedding：Gemini `gemini-embedding-001`，REST `embedContent`，taskType 分 RETRIEVAL_DOCUMENT/QUERY。
- **注意**：停止時 content 統計 `failed:217 / published:6` ——九成失敗，最大嫌疑就是這個 0.20 閾值太嚴（角度稍近就砍）。日後複用要重新校閾值。

### 2. 聲紋稽核（persona consistency audit）
- `src/lib/workers/superego.ts`：比對 KOL 靈魂+校正 persona vs 最近 7 天 published，三維度 tone/lexicon/topic_alignment 各 0-100。
- 警報分級 CLEAR / WARNING / ALERT / MULTI_ALERT，且樣本 <3 時 confidence ≤ 60（小樣本不過度自信）。
- 定位句：「粉絲今天打開貼文，會說『這還是她』嗎？」。可複用於任何「人格/品牌一致性監測」。

### 3. KOL 校正人格（calibrated persona）
- `src/lib/tools/persona.ts` + collection `molowe_kol_personas`：soul_summary / core_topic_weights / core_lexicon / tone_baseline / posting_rhythm / visual_signature / last_calibrated / calibration_source_count。
- 把「原始靈魂」與「從實際貼文校正出的人格」分開存——稽核時用校正版當錨點。

### 4. Prime-time 排程器（時區感知）
- `src/lib/scheduler.ts` `nextPrimeSlotISO`：KOL `ig_prime_times`（Asia/Taipei HH:MM）+ 今日已發數 → 下一個 UTC 發布 slot。今天 slot 沒過取最近、過了取明天第一個。

### 5. Threads 發布流（Graph API）
- `src/lib/workers/threads-publisher.ts`：`graph.threads.net/v1.0` → create container（media_type=IMAGE）→ poll 到 FINISHED → publish。單圖貼文完整流程，可直接複用。

### 6. 策略串聯（週→日 directive 注入）
- `src/lib/tools/directive.ts` `buildDirectiveBlock`：把每日 directive（focus_topics / tone_hint / avoid_list）組成寫手 prompt 區塊；無指令時回「依 KOL 靈魂自主判斷」。

## 運行模型（複用時要知道）
- `cron/run` 每 5 分鐘：找 `molowe_content` 一筆 pending/drafted → KOL enabled gate → brief 補骨架 → 角度去重 → 寫作 → 視覺。沒料回 `idle`。
- `cron/auto-publish` 每 2h、`insights` 每時、`strategy-weekly`(週一)、`strategy-daily`(每晚)、`superego`(週一)。
- 全鏈走 zhu-vitals（withVitals/manifest/bridgeCall）+ bridge 吃 Max 月費，purpose 細分到 kairos/jda/superego 等。

## 重啟前要先處理
- 角度去重 0.20 閾值重校（217 failed 主嫌）。
- `molowe_system_prompts/v1` 從沒被存過 → 若要用後台調 prompt，先在 editor 按一次存建立 doc。
- Firestore 在 moumou-os，與 moumou 共專案；清理/遷移時別誤刪 moumou 自己的 collection。
