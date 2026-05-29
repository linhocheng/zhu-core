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

---

## 最新完成（2026-05-29 · ailive self 委託形狀鬆綁）

- 修 ailive 角色 self 委託策略書的「形狀」：self 解開字數/章節框（FORM_SELF_GUIDE），把形狀還給角色靈魂；奧/佐格不動
- 改的是 live Cloud Run worker `~/.ailive/strategy-worker/src/index.ts`（非 Vercel route），deploy revision `strategy-worker-00005-frn` 100% 流量
- 端到端真跑馬雲 self 驗過：932 字宣言「給那些還沒死的人」，creator=馬雲 署名乾淨，stop=end_turn
- 修真相分裂：刪掉 `ailive-platform/src/app/api/specialist/strategy/route.ts`（Vercel 死副本，確認無人呼叫）
- 確認文字（dialogue）+ voice-stream（SSE 語音）兩入口都吃到修正（同一 worker 匯流點）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.ailive/strategy-worker/src/index.ts` | 加 FORM_SELF_GUIDE + isSelfCommission；self 自由文體 + 乾淨署名（**Cloud Run，非 git，deploy 即生效**） |
| `ailive-platform/src/app/api/specialist/strategy/route.ts` | **刪除**（Vercel 死副本） |
| `zhu-core/docs/LESSONS/LESSONS_2026-05-29.md` | 追加 L5（真相分裂改 live 前先確認哪份）、L6（修正放匯流點入口無關） |
| `zhu-core/docs/WORKLOG.md` | 追加本 session 紀錄 |

---

## 下一步

self 形狀這條已收乾淨上線。沒有「明天醒來必做的第一件」硬性接棒——以下是**選做**尾巴：

1. **要的話**：SSH zhu-dev 查 LiveKit 真即時 agent（`agent_name='ailive-realtime'`，main.py 在遠端）有沒有 commission 工具——這是「即時語音能不能發策略」唯一還沒驗的入口。文字 + voice-stream 都驗過成立了。
2. **要的話**：查刪 `ailive-platform/src/app/api/specialist/strategy-html/route.ts`（疑似也是死副本，live 是 strategy-html-worker Cloud Run）。

醒來先 `cd ~/.ailive/ailive-platform && git log --oneline -3` 確認收尾 commit 有推。

---

## 卡住 / 未解

- LiveKit 真即時 agent 能否發策略委託**未驗**（源碼在遠端 VM，不在本機）。修正本身入口無關，只剩「那支 agent 有無 commission 工具」這一問。
- strategy-html 疑似第二個 Vercel 死副本，未查。

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
| ailive 策略 live worker | `~/.ailive/strategy-worker/`（Cloud Run，**非 git**，gcloud run deploy 直上） |
| ailive 策略管道參考 | `reference_ailive_strategy_pipeline.md`（memory） |
| ailive 主戰場 | `~/.ailive/ailive-platform/`（Next.js，prod=ailive-platform.vercel.app） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-29 · 築*
