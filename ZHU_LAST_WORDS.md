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
- **雲端 VM**：`zhu-dev`（e2-medium，2026-07-07 自 e2-standard-2 降級省半，bridge 驗活 200），GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-07-06 第二場 · 費用治理收官）

**1. Cloud Run 常駐歸零（全帳戶 $0/月，兩場累計砍 ~$1,200/月）**
- 抓漏 `ailive-realtime-agent`：前日降 0 沒生效——流量釘在 5/23 舊 revision（min=1 跟 serving revision 走）；切 latest 後歸零
- v16＋兩台 podcast-worker 降 0（Adam 指示不常駐）
- 帳戶 15 project 全掃：只剩有流量的按用計費，85 服務零常駐

**2. 語音電源開關（ailivex）**
- 後台 `/admin/voice` 一鍵切 v16 min-instances 0/1（跟隨 `DEFAULT_VOICE_VERSION`，CPU=2 不動）
- **咽喉閘**：`config/voicePower` 旗標，token route 關閉時拒發（403 voice_power_off）——實例殭屍接不到電話因為電話根本打不出去
- 前台撥號鈕關閉時顯示「現在無法撥號」鎖住；`/api/voice-status` 開頁即查
- auto-off cron 每 30 分掃：開啟後 3h 無撥號自動關（Vercel cron 已註冊驗證）
- **關鍵認知**：min-instances 是錢的開關不是功能開關；每次設定變更 Cloud Run 起一顆驗證實例活 15 分（照計費、LiveKit 會報到接活）；graceful drain 讓進行中通話撐實例不死

**3. Podcast 搬 Cloud Run Jobs（兩平台同構，長任務零常駐）**
- worker 抽共用函數＋`job.ts` 入口：env `TASK_ID`+`JOB_ACTION`（script/audio/lazypak），參數讀 task doc；業務失敗寫回 doc 後 exit 0，`--max-retries=0 --task-timeout=3600`
- 平台派工切 Jobs API：UDN 用 ADC（在 Cloud Run 上）、ailivex 用 SA（Vercel）；env `PODCAST_JOB_NAME` 未設回退舊 worker URL
- **真實驗收全通**：UDN 腳本 2147 字 25 分＋音檔 MP3 落 GCS；ailivex 腳本 2616 字 22 分——全是舊架構下必被 15 分回收砍死的單

**4. 天條 ×3（刻全局 CLAUDE.md＋記憶庫）**
- 長任務進 Jobs，常駐只為「下一秒可能有人要」付（升級 fire-and-forget 天條）
- 驗「不燒錢了」看計費錶（billable_instance_time/instance_count）不看設定
- 手動改雲端資源同日改部署腳本——**刻完一小時自踩**：部署破音字時 v16 cloudbuild 寫死的 min=1 把關掉的語音無聲重開，靠天條觸發信號抓回；修法=拔旗標（省略=保留現值）

**5. 破音字＋預算警報**
- 飛彈→飞蛋 六落點（ailivex lib/worker/minimax_tts.py、UDN lib/worker）；UDN lib 發現漂移（沒吃到早批混淆/划線）一併補齊；抓/放驗證全過
- GCP 預算警報：全帳戶 $150＋ailivex/udnnews/zhu-cloud/chatbot 各 $50（50/90/100% 寄信 adam@dotmore.com.tw）；另發現既有兩條 TWD 3000（教訓：查不到≠不存在）

---

## 今天改了哪些檔案（第二場）

| 檔案 | 改了什麼 |
|---|---|
| ailivex `src/app/api/admin/voice-power/`＋`admin/voice/`＋`api/voice-status/`＋`api/cron/voice-auto-off/`＋`lib/voice-power.ts`（皆新） | 電源開關全套 |
| ailivex `api/livekit/token/route.ts`＋`middleware.ts`＋`vercel.json`＋`admin/layout.tsx` | 咽喉閘＋cron 白名單＋排程＋導覽 |
| ailivex `realtime-v16/[characterId]/page.tsx` | powerOff 擋板「現在無法撥號」 |
| ailivex `cloud-run/podcast-worker/{src/index.ts,src/job.ts,cloudbuild.yaml}`＋`src/lib/run-podcast-job.ts`＋convert 兩 route | Jobs 化 |
| ailivex `agent/cloudbuild-v16.yaml` | 拔寫死 min-instances=1 |
| ailivex `src/lib/tts-normalize.ts`＋worker 同檔＋`agent/minimax_tts.py` | 飛彈→飞蛋 |
| UDN `cloud-run/podcast-worker/{src/index.ts,src/job.ts,cloudbuild.yaml}`＋`lib/run-job.ts`＋dispatch/generate-audio route | Jobs 化 |
| UDN `lib/tts-normalize.ts`＋worker 同檔 | 飛彈＋補漂移三條 |
| 全局 `~/.claude/CLAUDE.md`＋memory 3 新檔＋2 修 | 天條 |

**Commits 全 push**：ailivex `f858122`→`bea812e` 五筆、UDN `b0373fb`/`dc1ab9c`、doc-worker `f9c2951`。
**ailivex working tree 剩 soulCore 批（別 session）**：soul.ts/soul-enhance 刪除＋characters admin＋dialogue 等 10 檔＋collections.ts 一個 soulCore hunk——依舊不碰。

---

## 下一步

1. **UDN 7/18 上市前：生成額度閘＋防連按**——MiniMax 按字計費無上限，podcast 連按=多台 Job 並行各跑 1h。做法：dispatch route 查同 project running 中的 podcast task 數，超過 N 拒派＋每日集數上限
2. podcast 舊 worker service 觀察 1-2 週後刪（現為回退門，min=0 不燒錢；拔 env `PODCAST_JOB_NAME` 即回退）
3. 月巡：Anthropic console 用量（語音 turn-path 直連 key，GCP 帳單看不到）＋Cloud Tasks maxAttempts＋zhu-dev VM CPU 水位（低於兩成可降 e2-medium 省半）

---

## 卡住 / 未解

- ailivex soulCore 批未 commit（別 session 的，等那條線收）
- v16 log 每行重複兩次（P7 觀測噪音）；ailivex podcast 無 watchdog（Jobs 有 1h 硬蓋不漏錢，但積殭屍 task）
- 語音 auto-off「真實觸發」未實測（需開著閒置 3h，自然驗證，cron 已註冊）
- GCS 音檔/HTML 無 lifecycle 規則（GB 級小錢）

---

## 天條快取（今天實戰過的）

- 長任務不配磚頭：判準「閒著時有沒有人下一秒需要它」；有→常駐＋開關＋自動關機，沒有→Jobs
- 驗錢看計費錶不看設定：設定/實例/計費三面分離；流量釘舊 revision＝真相分裂；每次設定變更生驗證實例 15 分
- 手動改雲端資源同日改部署腳本；掃描範圍=grep 全部 cloudbuild 不是手上那份（刻完當天自踩）
- 查不到≠不存在：API 錯誤只能說「查不到」不能斷言「沒有」
- 語音的「關」有殘尾：token 閘秒級生效，錢的尾巴=進行中通話＋15 分回收窗

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-06.md`（L1-L9，第二場 L6-L9） |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**soulCore 批未 commit**）|
| ailiveX 部署 | web `npx vercel --prod --yes`；agent `gcloud builds submit --config=agent/cloudbuild-v16.yaml --substitutions=COMMIT_SHA=<sha> .`；worker+job `gcloud builds submit --config=cloud-run/podcast-worker/cloudbuild.yaml --substitutions=COMMIT_SHA=<sha> --project=ailivex-2026 .` |
| 語音開關 | https://ailivex-platform.vercel.app/admin/voice（關=零費用；開=NT$4.5/hr；3h 沒用自動關） |
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**已全 commit** `dc1ab9c`；⚠️ git root 在上層 UDN NEWS/，add 別用 -A）|
| UDN 部署 | 平台＋worker 都要 `--substitutions=COMMIT_SHA=$(git rev-parse --short HEAD)`（手動 submit 不帶會 tag 空炸 build） |
| Podcast Jobs | `udnnews-podcast-job` / `ailivex-podcast-job`（asia-east1；`gcloud run jobs execute <job> --update-env-vars="TASK_ID=...,JOB_ACTION=script|audio|lazypak" --wait`）|
| 預算警報 | `gcloud billing budgets list --billing-account=01FA1E-134951-46AF0C --billing-project=zhu-cloud-2026` |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-06 第二場 · 築（費用治理收官：常駐 $0＋開關＋Jobs＋天條×3＋水錶；醉酒指數 2 全程可控——工具滑倒一次 git add -A）*
