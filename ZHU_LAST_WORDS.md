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
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-07-04，同日第三場：安全弱掃批）

**ailiveX 安全弱掃 + 五個 HIGH 修補（v15.2.2→v15.3.0 已 commit，web 已部署驗證 live）：**
- 五個平行探子 + 自查掃六攻擊面（authn/IDOR/密鑰/注入/額度/中間件），出分級報告；Adam 授權修 HIGH
- **H1** worker/cron 密鑰 fail-open → 收斂成 `clean-env.ts` verifyWorkerSecret/verifyBearerSecret（fail-closed），三條 route 改用（查 prod 三密鑰都在，不斷 cron）
- **H2** 文件生成 stored XSS → `doc-process` 三層機制擋（marked 剝原始 HTML + href 危險 scheme 中和 + CSP script-src none），node 實測 payload 全擋
- **H3** 語音多開繞過 → `quota_meter.py` VoiceMeter 每 heartbeat 回查 DB 活桶收斂（三房測試合計 3s 而非 9s）。**只影響 v15，未部署**
- **H4** 媒體生成用量管制（單一份數總量制，Adam 選定）：10 個付費點全計量+失敗退量、admin 可設上限、null 預設不改行為。tsx 對 prod Firestore 10 斷言全過
- **H5** reset-admin-pw 移硬編憑證+明文；**線上 admin 密碼已輪換**（新：aliveX-kWBxiXmJEihfik，DB 驗新過舊拒），記憶三處明文清除

**前兩場（日場+晚場）已收，戰場仍在：**
- ailiveX soulCore 全退役（14 角色遷單一 soul，鑄造 UI/API/lib 全刪）——**8 檔仍未 commit，線上比 git 新**
- ailiveX 用量管制（語音時數/文件份數）+ UI/UX 商用化——已 live
- UDN 議題工作台大改版（Cloud Run rev 00060→00066，Claude Design 換血/AppShell/收集頁分診）——**66 檔未 commit**

---

## 今天改了哪些檔案（安全批）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex/src/lib/clean-env.ts` | +verifyWorkerSecret/verifyBearerSecret（fail-closed） |
| `ailivex/src/app/api/{doc-process,voice-source,cron/memory-maintenance}` | 密鑰檢查改 fail-closed |
| `ailivex/src/app/api/doc-process/route.ts` | 文件 XSS 三層（safeMarked+href中和+CSP） |
| `ailivex/agent/quota_meter.py` | +get_voice_state/consume_media_quota；VoiceMeter.run 回查活桶 |
| `ailivex/agent/realtime_agent_v15.py` | dispatch_task 付費型別 consume_media_quota |
| `ailivex/src/lib/quota.ts` | +consumeMediaQuota/refundMediaQuota+media snapshot |
| `ailivex/src/lib/task-dispatcher.ts` | dispatchTask 付費媒體 consume+優雅告知 |
| `ailivex/src/app/api/tasks/[id]/generate-{storyboard,images,video,video-kling,audio}` | 入口 consumeMediaQuota+失敗退量 |
| `ailivex/src/app/api/convert/{audio,video}/route.ts` | 同上 |
| `ailivex/src/app/api/tasks/{callback,kling-callback}/route.ts` | job.failed refundMediaQuota |
| `ailivex/src/app/{admin/users/page.tsx,api/admin/users,api/me}` | media 額度 UI+API 鏡射 |
| `ailivex/scripts/reset-admin-pw.mjs` | 移硬編憑證，帳號密碼必填 |
| `memory/{project_ailivex_platform,MEMORY}.md` | 清除舊 admin 密碼明文 |

---

## 下一步

1. **ailiveX v15 agent 部署**（讓 H3 語音多開修法 + H4 python 媒體計量 live）：`cd ~/.ailive/ailivex-platform && gcloud builds submit --config=agent/cloudbuild-v15.yaml --substitutions=COMMIT_SHA=$(git rev-parse --short HEAD) .`——**Adam 選了先只上 web，此步等他**。部署前提醒：影響 live voice，build 綠+curl 驗才算上線
2. **audit 未修的 MEDIUM/LOW**（正式對外前值得收）：登入 rate limit、kling-callback webhook secret、安全標頭（CSP/X-Frame/HSTS）、SSRF DNS-rebinding、admin route in-handler authz、30 天 cookie role 凍結
3. **Adam 驗收**：UDN 手機底部分頁+收集頁；ailiveX 新增角色單一靈魂框、用量管制（含新的媒體額度）
4. **防洩漏三層**（等 Adam 點頭）：全局 prompt 四條格式禁令+Tracy 天條+文字過濾器「出戲」分類

---

## 卡住 / 未解

- **三 repo 未 commit**：ailivex soulCore 退役 8 檔（collections.ts 只剩 soulCore 移除的 diff，media 已隨安全批提交）；UDN platform 66 檔。**線上比 git 新，接棒者勿信 git 是最新**
- **H3/H4-python 已 commit 未部署**：語音多開仍可繞過、語音下指令生媒體暫不扣額度——直到 v15 agent 重建
- **記憶 Firestore sync 待跑**：改了 admin 密碼明文清除，本機已改，雲端 mirror 要 sync（收尾 STEP 6 處理）
- ailiveX 別名 bug（Adam 說先不用修）：重現 SOP 已通

---

## 天條快取（近幾天實戰過的）

- 宣告修好前先指出「只有修好才會出現的信號」——這次部署驗證用 /api/me 的 media 欄位 + 新密碼登入 200
- 半套計量＝會說謊的中台，比不做更糟（媒體計量全 10 點覆蓋才敢說完成）
- 防禦釘在收斂點（fail-closed helper 一次修三條 route；退量收斂兩個 callback）
- 模糊/次秒信號可能零資訊——計時測試尺度要拉到整秒有意義
- throttled Cloud Run 無 fire-and-forget；--update-env-vars 不用 --set-env-vars

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-04.md` |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**soulCore 退役未 commit**）|
| ailiveX 部署 | web `npx vercel --prod --yes`；agent `gcloud builds submit --config=agent/cloudbuild-v15.yaml` |
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**66 檔未 commit**）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-04 · 築（安全弱掃 + 五個 HIGH 修補 + web 部署）*
