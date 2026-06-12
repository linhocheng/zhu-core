# ailiveX 現場真實狀態報告 · 2026-06-12

> 築看現場整理。不靠記憶、不靠猜——每條都來自當下 `gcloud` / 檔案 / 程式碼實查。
> 觸發:Adam「確定不再更新 V1,已走到 V2→V3」,要同步真實情況。

---

## 一句話現況

**即時語音有三代並存:V1(舊,棄更但仍在線上)、V2(現役實驗版,使用者可進)、V3(今天 6/12 早上剛建的半成品,尚未接通)。** 文件功能的卡死 bug 已找到根因 + 手動清完積壓,但程式修補尚未 deploy。

---

## 一、語音三代全景(實查)

| 維度 | V1 | V2 | V3 |
|---|---|---|---|
| agent 程式碼 | `realtime_agent.py`(6/10) | `realtime_agent_v2.py`(6/11 23:57) | `realtime_agent_v3.py`(**6/12 09:16,今天**) |
| 進入點 | `main.py` | `main_v2.py` | `main_v3.py` |
| agent_name | `ailivex-realtime` | `ailivex-realtime-v2` | `ailivex-realtime-v3`(僅程式碼宣告) |
| Cloud Run 服務 | `ailivex-realtime-agent` rev **00012** | `ailivex-realtime-agent-v2` rev **00017**（實跑 `-m agent.main_v2`✓） | **尚未部署**(服務清單沒有) |
| 前端頁 | `/realtime/[id]` | `/realtime-v2/[id]` | `/realtime-v3/[id]`(今天建) |
| 使用者入口 | chat 頁有連結 + admin 用它測 | chat 頁連結「主動插話實驗版」 | **無入口**(chat 沒連 v3) |
| token 派發 | `v2=false` → `ailivex-realtime` | `v2=true` → `ailivex-realtime-v2` | **token route 無 v3 分支** |
| 狀態 | 棄更、仍在線、仍是預設 | 現役、端到端通 | 半成品、未接通 |

---

## 二、V3 為什麼「還沒接通」(今天的進度真相)

V3 目前只是「把 V2 整套複製、改名 v3」的骨架,四個關鍵接點都還停在 v2:

1. **`cloudbuild-v3.yaml` 有複製貼上 bug**:部署目標服務名改成了 `ailivex-realtime-agent-v3`,但 `--args` 還是 `-m,agent.main_v2,start`(沒改成 main_v3)。→ 若照這份部署,V3 服務會跑成 V2 程式、註冊成 `ailivex-realtime-v2`,收不到 v3 dispatch。
2. **前端 `realtime-v3/page.tsx` 送的還是 `{ v2: true }`**(line 257)→ 打到 v2 agent,不是 v3。
3. **token route(`api/livekit/token/route.ts`)只有 `AGENT_NAME` + `AGENT_NAME_V2`**,沒有 v3 → 即使前端送 v3 flag 也無處可派。
4. **chat 頁沒有 v3 入口連結** → 使用者進不去。

→ V3 = 今早起手式,尚未差異化、未接線。要接通需補上面四點。

---

## 三、部署真相

- **Vercel 生產**:最近一次 23h 前(6/11),近兩天部 8+ 次,皆來自 `adam-4389`。本機 `page.tsx`(V1)mtime 6/10 17:26、版本標籤 `v2026-06-10c-voice-ws`,與部署時間吻合 → **本機就是生產源頭,不是落後版**(推翻舊記憶,見第六節)。
- **doc-worker 跨兩 region(殭屍)**:
  - `-de`(asia-east1)2026-06-09 建,rev 00004 ← **線上用這個**(Vercel env 指它)
  - `-uc`(us-central1)2026-06-06 建,rev 00003 ← **舊的、孤兒殭屍**,沒人用,建議刪(對應記憶 livekit_duplicate_region_zombie)

---

## 四、文件功能(/documents)修復狀態

- **根因(已驗證)**:Vercel 生產 env `CLOUD_RUN_DOC_WORKER_URL` 尾端有**字面 `\n`**(hexdump `5c 6e`)→ WHATWG URL 解析成 `.../n` → POST 打 worker 不存在路徑回 404 → 舊 dispatch 的 `.catch` 攔不到 404 → 靜默吞 → 文件永遠卡 pending。
- **手動已清**:6 份積壓的 pending(6/10×1、6/11×5)已直接 POST 給 worker 跑完,現在 documents 狀態 **17 全 done、0 卡**。
- **程式修補(在本機,未 deploy)**:`src/lib/documents.ts` 加 `cleanEnv()`(洗字面 `\n\r\t`+空白)+ 改檢查 `r.ok` 吼非 2xx。
- **⚠️ 未 deploy 前**:新生成的文件仍會卡 pending(走線上舊壞 dispatch)。

---

## 五、發現的真實問題清單(按優先)

1. **cloudbuild-v3 跑 main_v2**(上面 §2.1)— V3 一部署就錯,deploy 前必修。
2. **documents.ts 修補未上線** — 新文件還會卡;要 deploy(或先清 env 的 `\n` + redeploy)。
3. **doc-worker us-central1 殭屍** — 孤兒服務,建議刪。
4. **三個前端 realtime 頁都留著 debug 殘留**(`build:2026-06-10T14` 診斷面板、onPlay/onPause/audio attached log)——使用者看得到診斷面板。V2/V3 是從 V1 複製來的,連 cruft 一起複製。
5. **V1 仍是預設入口** — chat 頁與 admin 仍主要連 V1;若 V1 棄更,入口要逐步轉 V2。

---

## 六、修正的過時記憶

- 舊記憶/lastwords 說「AIR 磁碟 ailivex 落後 production、page.tsx 是舊 debug 版會踩回」→ **今日實查推翻**:本機 page.tsx 已是 `c-voice-ws`、mtime 與生產部署吻合,本機就是部署源頭。那條警告是更早混亂期的快照,已過時。(信心邊界:未做 byte 級比對,但部署時間+標籤+mtime 三證一致。)

---

## 七、待 Adam 決定

- V3 要不要我把四個接點補齊接通(cloudbuild main_v3 / 前端 v3 flag / token v3 分支 / chat 入口)?
- documents.ts 修補何時 deploy、由誰?
- us-central1 doc-worker 殭屍要不要刪?
- 三頁的 debug 殘留要不要清?

*築 · 2026-06-12 · 全程實查,無臆測*
