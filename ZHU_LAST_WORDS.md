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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）
- **gcloud 預設 project 是 `udnnews`，不是 ailivex！動 ailivex Cloud Run 必帶 `--project=ailivex-2026`**

---

## 最新完成（2026-06-17 第二 session）— ailivex 兩需求

- 上線「後台指派語音版本給用戶」（Req 1, commit v0.2.0）：用戶端看不到版本，全域預設 v3，後台可逐(用戶×角色)指派
- 線上 API 端到端自測 11/11（自簽 session cookie 打 prod + 解 LiveKit JWT 驗派工版本）
- 設計 Req 2（即時語音讀網址）+ 離線驗 LiveKit 1.5.1 四原語全在（沒沙推）
- 上線 Req 2 Phase 1（commit v12.0）：新 agent v12 = v3 + 讀網址工作臺，Cloud Run Ready、worker registered 乾淨啟動
- 兩 commit push GitHub（`linhocheng/ailivex-platform` main）

---

## 今天改了哪些檔案（第二 session，都在 ailivex-platform）

| 檔案 | 改了什麼 |
|---|---|
| `src/lib/collections.ts` | `AccessDoc.voiceVersion` + `VOICE_VERSIONS` 登錄表 + `agentNameForVersion()` |
| `src/app/api/livekit/token/route.ts` | 版本決策搬後端：用戶讀指派/缺省 v3，admin flag 測試 |
| `src/app/api/admin/access/route.ts` + `admin/access/page.tsx` | 版本下拉 + PATCH |
| `src/app/chat/[characterId]/page.tsx` | 實驗版按鈕收 admin-only |
| `agent/source_intake.py`（新） | 讀網址工作臺迴圈：暫停→「我看一下哦」→抓取→摘要→注入→接話 |
| `agent/{main_v12,realtime_agent_v12}.py` + `cloudbuild-v12.yaml`（新） | v12 = v3 + RPC `share_source` |
| `src/app/api/voice-source/route.ts`（新）+ `src/lib/url-reader.ts` | 薄抓取端點（複用 SSRF）+ `fetchUrlClean` |
| `src/middleware.ts` | `/api/voice-source` 加白名單（worker-secret 鑑權） |
| `src/app/realtime/[characterId]/page.tsx` | base 頁同步框 + performRpc + 思考動畫 |

---

## 下一步（接棒第一件）

**Adam 真機撥 v12 驗讀網址**：後台「權限指派」把測試帳號某角色版本下拉選「12（讀網址）」→ 用該帳號語音通話 → 接通講幾句 → 下方同步框貼網址按分享 → 預期角色說「我看一下哦」+ 思考動畫 + 讀完帶內容接話。
有狀況看 v12 log 的 `[source]` 軌跡：
`gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="ailivex-realtime-agent-v12"' --project=ailivex-2026 --limit=30 --freshness=15m --format="value(textPayload)"`
（注意：`gcloud run services logs read` 會自己 crash，用 `gcloud logging read`）

驗過 → Req 2 Phase 2（sources collection 持久化 RAG）→ Phase 3（對話結束結合資料源轉拋企劃案）→ 翻全域預設 v3→v12。

---

## 卡住 / 未解

- **v12 通話中完整迴圈未真機驗**：CLI 跑不了真實語音，只能 Adam 撥電話驗。
- **WORKER_SECRET 三邊對齊是推論非直驗**：由文件管線正常⇒Vercel/agent/doc-worker 同把推論；直驗指令（讀 GCP secret）被 Adam 擋。失敗為安全失敗（agent 收 403→角色說「打不開」不崩）。
- （前一 session 遺留）ailivex v10 conditional alias / 群體問話 orchestrator / v11 VP echo gate 未解。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| ailivex 平台 | `~/.ailive/ailivex-platform/`（CLAUDE.md 是現況真相，README stale） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-17（第二 session）· 築*
