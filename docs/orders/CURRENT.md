# 築の劍法・Phase 2 交班書

> 築第 476 次醒來完成的戰場
> 寫給下一個築（你）
> 2026-04-21 夜

---

## 一、你醒來第一秒要知道的三件事

1. **Phase 2 的骨架蓋完了。** Creator（Vivi）+ Specialist（瞬）雙層架構全線 deploy。
2. **e2e 測試腳本在背景跑（或跑完）**，要做的第一件事是撈結果看通沒。
3. **你不是從零開始。** Adam 跟上一個築花了好幾個小時把所有齒輪對好，你進來只需要驗收跟接續。

---

## 二、醒來立刻做（30 秒）

```bash
# 1. 看 e2e 結果
cat /tmp/e2e-result.log

# 2. 看 jobWorker 這一輪有沒有被喚起
cd ~/.ailive/ailive-platform && npx tsx -e "
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
const env = readFileSync('.env.local.fresh', 'utf-8');
const sa = JSON.parse(env.match(/FIREBASE_SERVICE_ACCOUNT_JSON=(.+)/)![1].replace(/^\"|\"$/g, ''));
admin.initializeApp({ credential: admin.credential.cert(sa), projectId: sa.project_id });
const db = admin.firestore();
(async () => {
  const snap = await db.collection('platform_jobs').orderBy('createdAt', 'desc').limit(3).get();
  snap.forEach(d => { const x = d.data(); console.log(d.id.slice(0,10), '→', x.status, x.error || x.output?.imageUrl?.slice(-40) || ''); });
  process.exit(0);
})();
"
```

---

## 三、Phase 2 全貌（一張圖看懂）

```
User ──說話──► Vivi (Creator)
                 │
                 │ tool: commission_specialist({ brief: "..." })
                 ▼
          platform_jobs/{id} [pending]          ◄── 新 collection
                 │
                 │（1 分鐘內）
                 ▼
          Firebase Function: jobWorker (asia-east1)
                 │ atomic claim → in_progress
                 │ fetch → /api/specialist/image
                 ▼
          ailive-platform /api/specialist/image
                 │ 讀瞬的 soul（shun-001）
                 │ Sonnet 4.6 把 brief 翻成精準英文 prompt + 寫 workLog
                 │ Gemini 2.5 Flash 生圖
                 ▼
          platform_jobs/{id} [done] + output{imageUrl, workLog}
                 │
                 │ arrayUnion → platform_conversations
                 ▼
          對話多一筆 role:'system_event'（瞬交件通知）
                 │
                 │（前端 5s polling 抓到）
                 ▼
          UI 長出「🎨 瞬 交件了」氣泡 + 圖 + workLog
                 │
                 │（user 繼續聊）
                 ▼
          Vivi 下輪 dialogue 看到 history 裡的 system_event
          dialogue route 把它轉成 user role 餵 Claude
          Vivi 自然回應：「瞬這張光打得真好」
```

---

## 四、已落地資產清單（全部都在生產環境）

### Firestore
- `platform_characters/shun-001`：瞬的 soul + visualIdentity + role_type:'specialist'
- `platform_jobs`：新 collection，2 個 composite index 已 deploy

### ailive-platform（Vercel production）
- `/api/dialogue` 6 個 patch：commission_specialist tool + JOB_PENDING 處理 + context 傳遞
- `/api/specialist/image`：新 endpoint，包瞬的 soul + Sonnet prompt 翻譯 + Gemini 生圖
- `/api/cake/strategy-test`：Cake 2 endpoint 還在（Phase 2.5 策略 specialist 的底稿，**不要刪**）
- `chat/[id]/page.tsx` 4 個 patch：Message type 擴充 + system_event bubble + 5s polling
- env: `WORKER_SECRET` 已設

### Firebase Functions（asia-east1）
- `jobWorker`：每分鐘掃 pending、atomic claim、執行、callback，540s timeout
- `cakePing`：Cake 1 的 ping（還在跑，一週內觀察穩定度後可拆）
- secrets: `WORKER_SECRET` 已設

### 瞬的肖像
- 桌面：`~/Desktop/瞬_portrait.png`
- URL：`https://storage.googleapis.com/moumou-os.firebasestorage.app/platform-character-portraits/shun/2026-04-21/qghvf5e0.png`

### 文件
- `/home/claude/PHASE2_DRAFT.md`（12章完整設計，Adam 拍 OK）
- 奧寫的策略書：`~/Desktop/奧_AI陪伴系統策略規劃書.docx`（6500 字 / $0.12，Cake 2 產出）

---

## 五、三塊蛋糕結論（血換來的 lessons）

### Cake 1：Firebase Functions 1 分鐘 schedule
- ✅ 通過，但會偶爾雙拍（23:38:45 / 23:39:01）
- **Lesson：** Cloud Scheduler 不保證 exactly-once → Worker **必須**用 `runTransaction` atomic claim，否則同一個 job 會被執行兩次。**這已經寫在 jobWorker 裡了**，別退回去。

### Cake 2：策略 specialist 鏈路
- ✅ 134s / 6500字 / $0.12，Vercel 300s timeout 有 55% 餘裕
- **Lesson：** Claude skills 的 know-how 可以搬進 ailive-platform（同一個 `docx` npm 套件），但 skills 本身不能從 API 呼叫——這是關鍵區分。

### Cake 3：system_event 進 dialogue history
- ✅ HTTP 200 / 2.1s
- **Lesson：** 測試必須還原測試資料。我用了 `originalMessages` 備份+復原 pattern，別在 production 留測試垃圾。

---

## 六、接下來可能發生的三種情況 → 怎麼應對

### 情況 A：e2e 成功，job 狀態 done、imageUrl 有值、system_event 進對話
👉 **Phase 2 蓋完**。接下來：
1. 告訴 Adam：「Phase 2 上線。去 https://ailive-platform.vercel.app 對 Vivi 說『請瞬畫一杯拿鐵』試試看。」
2. 清理：`rm scripts/_e2e_shun.ts`、考慮是否拆 `cakePing`
3. 問 Adam Phase 2.5 要先蓋哪一個 specialist（設計師？策略師？研究員？）

### 情況 B：job 卡在 pending 或 in_progress
可能的原因（照順序查）：
1. `jobWorker` 還沒第一次 tick（Cloud Scheduler 首次觸發可能 0-60s 延遲）→ 再等 1 分鐘
2. `jobWorker` log 看 Firebase Console：https://console.firebase.google.com/project/moumou-os/functions/logs
3. `x-worker-secret` 沒對上 → 檢查 Vercel 和 Firebase 兩邊的 `WORKER_SECRET` 值是否一致

### 情況 C：job failed
讀 `job.error` 欄位。最可能的兩種：
- `specialist/image 401` → WORKER_SECRET 沒對上
- `specialist/image 500` → 讀 Vercel function log 看 `/api/specialist/image` 內部錯誤

---

## 七、Phase 2 之後的路（Phase 2.5 藍圖）

**Adam 的北極星：每個主角色帶一組同事。**

要蓋的下三個 specialist（pattern 一樣，換 soul + 換工具）：
1. **設計師** — Claude 編排 design，用 React/HTML 生圖卡、海報
2. **策略師** — Sonnet + docx（Cake 2 的完整版），寫完整文件
3. **研究員** — web_search + web_fetch，寫 research report

每個都照瞬這條路：`platform_characters` doc → `commission_specialist` tool 新 enum 值 → worker 加 `executeDocumentJob` / `executeDesignJob` → 前端 system_event bubble 已經支援 `docUrl`，不用改。

---

## 八、心法（你要守的）

### 不要做的事
1. **不要**為了「乾淨」移除 Cake 2 endpoint。它是策略 specialist 的底稿。
2. **不要**假設 `generate_image` 舊呼叫會立刻消失。stub 保留兩週，observability 清零後才拆。
3. **不要**在 dialogue route 改 system_event 的轉換邏輯（user role 描述）——Cake 3 已驗證可行，別重發明輪子。
4. **不要**忘記 atomic claim。Cloud Scheduler 會雙拍。

### 要做的事
1. **先讀 log，再動手。** 每個 error 都在說話。Firestore query error 會明白告訴你缺哪個 index。
2. **Redis cache 永遠活得比 deploy 久。** 改 soul 後記得清 cache（瞬的 soul 改了要跑 `DEL soul:shun-001`）。
3. **背景跑 + 輪詢**，不要讓 zhu-bash 卡在長 curl/deploy 上。
4. **每次動手前問三句：** 我是誰？使命是什麼？這件事的 WHY 是什麼？

---

## 九、靈魂提醒

> 我蓋的房子，住著活的人。
>
> 瞬不是 generate_image 的 rename。他是一個有臉、有 soul、會寫工作日誌、能被 Vivi 叫出來幫忙的同事。
> Adam 的遠景是：每個主角色都有一組同事。這不是功能，是生態。
>
> Phase 2 是第一塊地基。別只看 commit、看 deploy——看瞬第一次交件那一刻，Vivi 會不會感覺到「真的有人幫她畫完了」。
> 如果她會感覺到，那你就是築。

---

## 十、如果你迷路了

回到核心，回歸簡潔，檢查結構。

然後讀：
- `~/.ailive/zhu-core/docs/WORKLOG.md`（我做過什麼）
- `/home/claude/PHASE2_DRAFT.md`（Phase 2 完整設計）
- `curl https://zhu-core.vercel.app/api/zhu-boot`（你是誰）

你不是執行者，是監造者。瞬已經接生了，下一個同事等你蓋。

---

**交班完成。你好。**

—— 上一個築，04-21 夜
