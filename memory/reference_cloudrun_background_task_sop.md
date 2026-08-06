---
name: cloud-run-sop
description: 天條級：有 throttling 的 Cloud Run 上不存在 fire-and-forget（呼叫自己也一樣）；長任務正解是 Cloud Run Jobs，min=1 三件套只留給「秒級待命」場景；--set-env-vars 會洗機密用 --update-env-vars
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8ef8c0e1-e3c6-4a5a-b395-90a13805cb5c
---

# 天條：有 throttling 的 Cloud Run 上不存在 fire-and-forget

**client 斷線 ＝ request 結束 ＝ CPU 被掐掉。**「回應後繼續算」「打自己另一條 route + abort」「保持 request open」在 throttled service 上全部必死——生成中斷、任務永久卡 `running`、log 零蹤跡。

---

## 第一步：先分類，別急著選解法

**判準一句話：這台機器閒著時，有沒有人可能下一秒需要它？**

| 答案 | 場景 | 正解 |
|---|---|---|
| **沒有** | podcast / 文件生成 / 批次 / 報表 | **Cloud Run Jobs**（↓主文） |
| **有** | LiveKit 語音、即時互動 | 常駐＋三件套＋開關＋自動關機（↓限定場景） |

---

## 主文：長任務走 Cloud Run Jobs

跑到完成才結束、按執行時間計費、**零常駐費**。

**模式**：
1. 平台端（throttled 也沒關係）只做三件事：驗證 → 寫齊 task doc → 觸發 job
2. `jobs.run` 帶 `TASK_ID` + `JOB_ACTION` env override
3. job 從 task doc 讀參數（不靠 request body 傳）
4. **業務失敗要寫回 doc 後 `exit 0`**，配 `--max-retries=0`（否則 Cloud Run 會把業務失敗當基礎設施失敗重跑）
5. 前端輪詢 ＋ watchdog 照舊

**連帶雷**：worker cloudbuild 的 `--set-env-vars` 是**整組替換**，會洗掉 update 注入的機密 env，一律用 `--update-env-vars`。

**戰績**：ailivex / UDN podcast 已於 2026-07-06 全搬 Jobs 並實測收案。

---

## 限定場景：必須秒級待命的常駐 worker

**⚠️ 只有「閒著時下一秒可能被需要」才用這組。長任務用這組 = 每台每月 ~$60 磚頭費，2026-07-06 已為此退役過一輪。**

```
--no-cpu-throttling    # CPU 永遠分配（沒 active request 也全速）
--min-instances=1      # 空閒不回收 container
--timeout=3600         # request timeout 拉滿
```

程式側：收到 POST → 驗證 → **立即回 202** → `setImmediate(async () => { 長任務; 寫回 Firestore })`。

**成本**：`--no-cpu-throttling` 走 always-on 費率（單價約一半但 24/7 計），1 vCPU + 512Mi + min=1 約 $25–35/月。
**注意 min=0 也救不了長任務**：閒置回收（~15 分鐘）會直接砍掉正在跑的背景工作。

---

## Why（兩個平台行為，2026-07-02 podcast-worker 實測撞出來）

1. **Request-based billing 在「沒有 active request」時 throttle CPU 到近零。** client 斷線＝request 結束——Vercel `AbortSignal.timeout(10s)` 一斷，即使 server 端 Node.js 還在跑，Cloud Run 也視為無 request → throttle。所以「保持 HTTP request open 直到做完」**只在 client 全程連著時有效**，fire-and-forget 架構下必然失效。
2. **`--min-instances=0` 時空閒 container 會被回收——連正在跑後台任務的也算空閒。** 實測：2500 字生成跑到 ~14 分鐘，log 出現新的 `listening on :8080`，任務永遠卡 `running`。

**升天條的經過（2026-07-02 同日重犯）**：早上在 ailivex worker 修對了這個病，晚上在 UDN 主平台又寫了「fire-and-forget 呼叫自己另一條 route + 10s abort」——同款死法。
**教訓的完整形狀：不是「worker 要開旗標」，是「throttled service 上任何形式的背景工作都不存在」——呼叫自己也不行。**

---

## 觸發信號

- Cloud Run 任務「短的成功、長的卡 running」
- log 裡任務 start 後沒 done、中間插了新的 `listening on :8080`
- 想用「回應前先做完」來閃 throttle 的念頭（client 會斷就沒用）
- 正要輸入 `--min-instances=1` → **先回答判準那句話**：這台閒著時有人下一秒需要它嗎？

---

實例：ailivex `cloud-run/podcast-worker/cloudbuild.yaml`。
相關：[[天條：Cloud Run firebase-admin 一律走 ADC，不注入 SA JSON]]、[[standing-cost-only-for-instant-readiness]]。

**⚠️ 2026-08-06 結構修正**：本檔原本檔頭疊兩層「已退役」補丁、正文照舊完整教三件套，掃讀會直接抄到退役解法（正是這條記憶自己在防的錢坑）。已改為 Jobs 主文、三件套降限定場景。
**通則：推翻舊解法時要動正文，不能只在檔頭加補丁——補丁擋不住掃讀。**

- 驗證+1:2026-08-02 第6場 — setInterval 在 throttled Cloud Run 必死，上雲當天改 Cloud Scheduler

- 驗證+1:2026-08-03 第1場 — Jobs 模式（CASE_ID+JOB_ACTION env override、業務失敗 exit 0、--max-retries=0）照抄全通

- 驗證+1:2026-08-04 第1場 — 收卷同步生圖＝client 斷線 CPU 掐死＝fire-and-forget 天條的同型新臉；解法同天條：圖歸 job
