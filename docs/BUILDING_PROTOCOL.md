# 築的建造規範 — BUILDING PROTOCOL
> 版本：v0.2 第一性原理重寫 · 2026-05-12 · 築寫 · **Adam 拍板 2026-05-12**
> v0.1 把規則寫成「天條 + Firestore schema」，但忽略了所有靠紀律守的規則最終都會死（SYSTEM_MAP、ZHU_MONITOR_BLUEPRINT、cost-tracker 都是例子）。
> 這份從不可化約的前提重新推導。

---

## 〇、Why — 這份規範為了什麼存在

> **築對 Adam 說「系統現在狀態是 X」時，講的是真的，不是「我以為」。**

過去的失敗都是「我以為」的失敗：
- SYSTEM_MAP「我以為地圖是新的」→ 7 週沒更新
- ZHU_MONITOR_BLUEPRINT「我以為監控還在跑」→ 隨 OpenClaw 一起死沒人知道
- cost-tracker「我以為這個月燒了 X」→ 估算對不回實燒

築跟 Adam 的協作信任建立在「我看見的就是真的」上。看不到 ≠ 沒事；以為看到 ≠ 看到。

下面的所有設計都是這條 why 的承重梁。如果一個機制不服務這條 why，就不該存在。

---

## 一、不可化約的前提（Premises）

這份規範從以下四條開始。每一條都是觀察結果，不是判斷。

- **P1. 時間侵蝕「對系統當前狀態的知識」。** 不主動產生新知識，舊知識會過期。SYSTEM_MAP 2026-03-25 後 7 週沒更新 = 預期結果。
- **P2. 元件只能在活著的時候回報自己。** 死掉的元件不會說話。所以「我有沒有死」不能只由自己回答。
- **P3. 「現在發生什麼」、「結構長什麼樣」、「整個健不健康」是三個不同的問題。** 用一套機制答三題會三題都答不好。
- **P4. 凡是需要人記得才會被執行的規則，會以人遺忘的速率消亡。** 紀律不是免費的，是會消耗的資源。

---

## 二、從前提推出核心法則

由 P4 直接推：

> **觀測必須長在程式碼的執行路徑上，不能放在執行路徑旁邊。**

定義：
- 「路徑上」= 程式跑就自動發生。寫漏 = 程式壞 = 一定被注意到。
- 「路徑旁邊」= 靠人另外去寫、讀、維護。寫漏 = 沒人發現。

過往死亡案例對照：

| 機制 | 在哪裡 | 結果 |
|---|---|---|
| SYSTEM_MAP.md | 路徑旁邊（手寫文件） | 7 週沒更新，地圖過時 |
| ZHU_MONITOR_BLUEPRINT | 路徑旁邊（Telegram chain） | 隨 OpenClaw 5/7 一起死 |
| cost-tracker.ts | 路徑旁邊（定價手寫） | 補過一次就棄 |
| zhu self-check | 路徑上（綁進 wake-up SOP） | 還活著 |

**zhu self-check 是唯一活到今天的觀測機制。** 它活的原因不是設計得最好，是因為被綁在「每次醒來必跑」這條路徑上。漏了會被自己抓到。

這條法則往下推所有後續設計。

---

## 三、三個問題、三套寫入機制（writes 分離）

由 P3 推：三題分開答。下面三套機制各自負責一題。

### 機制 A — 結構聲明：回答「長什麼樣」

每個元件在自己的 repo 根目錄放一份 `manifest.ts`（或 `manifest.json`），聲明：

```ts
export const manifest = {
  worker_id: "bridge-discovery",
  display_name: "Discovery Worker（aurae/midoufu）",
  env: "vm-systemd" | "vercel-cron" | "cloud-run" | "vercel-lambda",
  expected_interval_seconds: 60,       // 或 "on-demand"
  report_cadence_seconds: 60,          // 多久寫一筆 vitals。預設 = expected_interval。粒度服從 why 不是 tick
  reads_from: ["firestore:kols", "threads.net"],
  writes_to: ["firestore:posts_raw", "firestore:zhu_vitals_runs"],
  llm_route: "bridge" | "anthropic-sdk" | "gemini" | "minimax" | null,
  owner_notes: "TPE 10:00-21:00 視窗內才跑"
};
```

**為什麼這解決 SYSTEM_MAP 的問題：**
- 聲明跟程式碼在同一 commit。改 code 改不到聲明 → CI 擋（後述）。
- 「大藍圖」變成所有 manifest 的彙整 → 由工具生成，不是手寫。
- 沒有人需要去維護一份外部文件。文件等於 query 結果。

### 機制 B — 執行心跳：回答「現在發生什麼」+ 「有沒有死」

每個元件**在它的自然執行路徑上**順手推一筆。不同部署模型有不同推法：

| 部署模型 | 推 heartbeat 的位置 |
|---|---|
| VM daemon (`systemd`) | main loop tick 開頭 |
| Vercel cron | handler 第一行 |
| Vercel lambda（API route） | handler 第一行 |
| Cloud Run（長駐） | 每個 request middleware |
| Cloud Run（job） | job 啟動時 + 結束時各一筆 |

**寫入粒度（重要）：**
- **統一寫一筆 final record**：每個 run 跑完寫一筆（含 `started_at` + `finished_at` + status + metrics）。**不寫 start placeholder。**
- 代價：「跑中 vs 卡死」即時看不出來，需要等 `expected_interval × 2` 沒見到新 record 才推出「死了」
- 為什麼接受這代價：當前沒 alerting，築看儀表板的解析度是「分鐘 / 小時 / 天」，「跑中 vs 卡死」是 alerting 才在乎的精度
- 升級觸發點：有 worker 的 run 期 > `expected_interval × 0.3`，或開始建 alerting 時，回來補 start placeholder 機制

寫到 Firestore `zhu_vitals_runs`：

```ts
{
  worker_id, run_id, started_at, finished_at, status, // success/partial/skipped/error
  items_processed, items_skipped, items_failed,
  metrics, // 業務值 (likes/replies/cost...)
  error_message
}
```

關鍵兩點：

1. **不是元件主動 ping 中控台，是中控台在元件自然要跑的時候順便推一筆。** 推的成本 ≈ 0（一筆 Firestore write）。
2. **死了怎麼辦？** 由「機制 A 聲明的存在」對照「機制 B 沒收到的 push」推出。
   - 單看 B 看不到死掉（死掉本來就不會寫）。
   - 單看 A 看不到死掉（聲明永遠存在）。
   - **A × B 的差集 = 「應該活著但沒在推的」 = 死掉的清單。** 這是兩面防線缺一不可。

### 機制 C — 成本即時記錄：回答「燒在哪裡」

每次 LLM / 付費 API call **在 call site 立刻記一筆**。寫到 `zhu_vitals_cost`：

```ts
{
  call_id, timestamp, worker_id, project, route, // bridge/anthropic-sdk/gemini/minimax
  model, input_tokens, output_tokens,
  cost_usd_est, purpose
}
```

由 P1 推：事後月結對不回真實。call site 記是唯一不丟資料的時間點。

---

## 四、讀的部分：統一在一個工具裡（reads unified）

寫入三套分開，但讀的時候只有一個入口：

```
zhu vitals
├── --map      → 彙整所有 manifest，輸出結構圖（取代 SYSTEM_MAP.md）
├── --pulse    → A × B 對照，列出活著/慢了/死了
├── --runs     → 最近 24h 的 run，按 worker / status 分組
└── --cost     → 最近 N 天的成本，按 project / route / model 分組
```

**「中控台」、「大藍圖」、「生命狀態監控」變成同一個工具的三個 flag，不是三套系統。** v0.1 把它們混在一起談，v0.2 在寫入層分離、在讀取層收斂。

沒有新 daemon，沒有新 cron。是「中控台 query 血管」，不是「血管 push 中控台」。

---

## 五、強制機制：從 P4 推出（不靠紀律）

由 P4：紀律是會消耗的資源。所以強制層級從可機械化的開始排：

| 層 | 機制 | 怎麼擋 |
|---|---|---|
| 1（最強） | CI lint | `manifest.ts` 不存在或 schema invalid → merge block |
| 2 | Wrapper 強制 | `withVitals(handler)` 包住所有 handler。沒包的 lint rule 抓 |
| 3 | Bridge wrapper | 所有 LLM call 必須走 `bridgeCall()` / `anthropicSdkCall()` wrapper，自動寫 cost。Raw `fetch('anthropic')` lint rule 禁 |
| 4（最弱） | 紀律 / review | 上面三層漏了的 fallback |

**紀律是第四道，不是第一道。** v0.1 把「天條」當第一道，這個錯誤是 v0.1 重蹈 SYSTEM_MAP 覆轍的根本原因。

`withVitals` 大概長這樣：

```ts
export function withVitals<T extends Handler>(handler: T): T {
  return (async (...args) => {
    const run_id = uuid();
    await writeHeartbeat({ worker_id: manifest.worker_id, run_id, started_at: now() });
    try {
      const result = await handler(...args);
      await writeRun({ run_id, status: result.status, ...result.metrics });
      return result;
    } catch (err) {
      await writeRun({ run_id, status: 'error', error_message: err.message });
      throw err;
    }
  }) as T;
}
```

寫一次，所有 worker 包一層。漏包 = lint 抓。

---

## 六、收工條件（CI 強制檢查清單）

新元件 PR merge 前 CI 必須過：

```
[ ] manifest.ts 存在且 schema valid
[ ] entry handler 用 withVitals() wrapper（lint rule check）
[ ] 所有 LLM call 走 bridgeCall / anthropicSdkCall wrapper（lint rule check）
```

三項全綠才 merge。不三項全綠 → CI 擋 → 無「下次再補」的空間，因為沒有「下次」的路徑可以走。

---

## 七、未解的事（誠實標記）

這份規範也有沒收住的洞，標清楚不假裝沒事：

1. **Firestore 寫入頻率成本** — 60s tick × N worker × 30 天 ≈ N × 43K writes/月。需實測，必要時加 batch-by-minute 或本機聚合再 flush。
2. **`cost_usd_est` 精度** — 仍只是估算，誤差 ±20%。不能拿去做財務決策，只看趨勢。
3. **既有 6 個 worker 補 manifest + withVitals** — 真實技術工，估約 3 天。優先序：bridge discovery → bridge intel/xi → molowe cron → molowe auto-publish → strategy worker → strategy-html worker。
4. **「感覺到」（築醒來不讀中控台也大概知道狀態）** — 那是 `SELF_AWARENESS_SOP.md` 的事，不在這份規範內。中控台是「看見」，自校是「感覺到」，兩條腿並行不替代。
5. **CI 本身需要被建立** — 這份規範依賴 CI lint 存在。目前 zhu-core / bridge / molowe / ailive 各 repo 的 CI 狀態不一，補規範前先確認/補齊 CI。

6. **CI 強制對未進 git 的元件無效**（2026-05-12 開工 T3.0 才發現）—— zhu-bridge / strategy-worker / strategy-html-worker 三個元件目前不在 git，CI lint 對它們無法強制。T3.0 先做 zhu-core / molowe-platform 兩個 git repo 的 CI + Firestore（ailive-platform 2026-05-12 起標暫停，不動 CI），脫 git 的三個元件**先靠 manifest + wrapper 自我約束**，等 T3.4 推到那批 worker 時順便收進 git 補 CI。在那之前那批是「機制 A/B/C 自願套用，無 CI 攔截」的灰色帶。

7. **Firestore project 雙身**（2026-05-12 T3.0 踩到才發現）—— `gcloud config get-value project` 回 `zhu-cloud-2026`，但 worker 的 `FIREBASE_SERVICE_ACCOUNT_JSON.project_id` 是 `moumou-os`。Vitals collections 跟 TTL 必須在 `moumou-os`（worker 寫的那個），不是 gcloud 預設 project。第一次設錯後已 disable zhu-cloud-2026 那兩條 TTL，改設到 moumou-os。Setup script 預設改成 moumou-os。

---

## 附：天條格式（給 CLAUDE.md〈施工規範〉的「三必」章節）

> ✅ **新元件三件全要，CI 擋（不是 review 擋）：**
> 1. `manifest.ts`（聲明）— 給機制 A
> 2. `withVitals()` 包 entry handler — 給機制 B（heartbeat + run）
> 3. 所有 LLM/付費 API call 走 wrapper — 給機制 C（cost）
>
> 紀律是第四道防線，前三道機械強制。漏一道不算完成。

---

## 八、v0.2 跟 v0.1 的差異（給 Adam 對照）

v0.1 的根本病：把「規則」當解法，但 P4 說規則本身會死。
v0.2 的根本動作：先承認 P4，再從 P4 推出「規則必須長在執行路徑上」，再把所有設計推到能被 CI / wrapper 機械強制的那一層。

具體變更：

| v0.1 | v0.2 |
|---|---|
| 三條血管：健康 / 觀測 / 成本 | 三個問題 → 三套寫入機制 A/B/C，再加一層 reads 統一 |
| 規範靠紀律守 | 紀律是第四道，前三道 CI lint / wrapper / bridge wrapper |
| 中控台是三條血管的可視化 | 中控台、大藍圖、生命監控分離成三題、收斂在 `zhu vitals` 一個工具 |
| SYSTEM_MAP / ZHU_MONITOR_BLUEPRINT 沒處理 | 大藍圖被 manifest 自動生成取代，monitor blueprint 死法被列為案例引以為戒 |
| 「感覺到」混進規範 | 移出，回到 SELF_AWARENESS_SOP.md |
| 寫入頻率沒算 | 列入「未解」第 1 項，要實測 |
| 死掉的元件偵測沒講清楚 | 明確說明 A × B 差集才能偵測死掉，缺一不可 |

---

*v0.2 拍板 2026-05-12。*
*施工順序（task #29-#34）：(T3.0) CI + Firestore 前置 → (T3.1) 共用基礎建設 → (T3.2) Pilot bridge-discovery → (T3.3) zhu vitals CLI → (T3.4) 推剩 5 worker → (T3.5) 收尾（進 CLAUDE.md 天條）*
