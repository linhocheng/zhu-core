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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（跑 `claude-bridge` systemd）
  - bridge-direct：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **ailive 平台**：`~/.ailive/ailive-platform/`（Next.js 16.1.6 Turbopack），prod https://ailive-platform.vercel.app
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app，git remote github.com/linhocheng/macs-platform
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`（rev 00022）
- **ANEWS source-worker（Cloud Run）**：`anews-source-worker` · asia-east1 · project `zhu-cloud-2026`（rev 00014）

---

## 最新完成（2026-06-06 傍晚）

- **ailive 即時語音對話加角色底圖層**（realtime + voice 兩頁）：
  - 有身份照 → 用本人照片，全屏清晰、名字移左上角、通話鈕縮約 1/3 移畫面下方
  - 無照 → 統一星空底圖 `public/default-voice-bg.jpg`（blur 12px + brightness 0.35）、名字置中、鈕維持 240px
  - 粒子流場 canvas 用 `mix-blend-mode:screen` 疊在底圖上（黑底像素變透明）
  - 已 `npx vercel --prod` 上 production，Adam 確認「我覺得可以」「Nice!」
  - 回滾標記：git tag `pre-voice-bg-20260606`（HEAD 6645746）

### 早場（同日）
- MACS 後台「部門魂」假中台修復：`roleModeSurface(mode)` 單一真相源，角色魂 Mode 1/2/3 三模式全可編輯，`v0.11.1.001` 推 origin
- Tavily 三 key 輪用（MACS research + ANEWS source）：hash 分配 + 429/432 fallover

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/app/realtime/[characterId]/page.tsx` | 即時語音頁加角色底圖層 + hasCharImage 分支佈局 |
| `ailive-platform/src/app/voice/[id]/page.tsx` | 語音辨識頁同套底圖層（接上既有 avatar 變數）|
| `ailive-platform/public/default-voice-bg.jpg` | 新增 209K 星空共同底圖 |
| `macs-platform/lib/settings/roles.ts` | `roleModeSurface(mode)` + `getRoleSettings` 收斂三分支 |
| `macs-platform/cloud-run/research-worker/src/index.ts` | Tavily 三 key 輪用（rev 00022 已 deploy 但**未 commit**）|
| `anews-platform/cloud-run/source-worker/src/tavily.ts` | 同輪用邏輯（已 deploy 未 commit）|
| `zhu-core/skills/macs-add-tavily-key.md` | 新增 Tavily key 六步 SOP |

---

## 下一步（接棒第一件能直接動手）

ailive 語音底圖**已完成並確認**，不用再動。標準開放戰場是 MACS：

**先跑 Mode 1 真案驗新設計 + Cloud Run synthesis JSON 修復穩定。**

1. **跑 Mode 1（market_evidence）真案到 done**：
   - 建案：`curl -X POST https://macs-platform.vercel.app/api/cases -H "authorization: Bearer $ADMIN_PW" -d '{"clientProblem":"...","businessContext":"...","decisionPurpose":"...","strategyMode":"market_evidence","fullAuto":true}'`
   - 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_status.mts <caseId>`
2. **commit MACS cloud-run research worker 改動**（`cloud-run/research-worker/src/index.ts` 還沒入 git，只有 Cloud Run deploy）：
   - `cd ~/.ailive/macs-platform && git add cloud-run/research-worker/src/index.ts scripts/_repair-case.mts && git commit -m "v0.11.1.002 — 新增：research worker Tavily 三 key 輪用 + repair 腳本修正" && git push`
3. **5C 架構**：`lib/frameworks/contract.ts` 加 `buildReport(ctx)`；hybrid + Mode 1 章節從 `lib/report/builder.ts` 搬進各框架 report.ts。

---

## 卡住 / 未解

- **ailive**：照片版 canvas 粒子仍 screen-blend 疊在照片上（嚴格說「100% 無遮擋」還是會疊亮點，Adam 沒要求移除，保留）。要全淨照片就把照版分支的 canvas 拿掉。
- **ailive working tree**：Adam 既有未提交 `agent/user_profile.py`、`src/lib/user-profile.ts`（非我的，勿洗）+ 4 個 `scripts/_*tmp*` 探查腳本。
- **MACS** `cloud-run/research-worker/src/index.ts` 改動尚未 commit（只有 Cloud Run deploy，git 裡是舊版）。
- 5C 未動（Mode 1/2 章節還在 builder.ts 的 if(mode)）。
- Mode 1/2 新設計未 live 驗（渲染共用理論自動套，但沒真案跑過）。
- 篇幅旋鈕只 Mode 3 全通（Mode 1/2 + Cloud Run 未接）。
- Cloudflare API token 外洩待撤銷（延宕多 session）。
- ANEWS source-worker tavily.ts 改動未 commit（ANEWS 非 git repo，只靠 deploy + WORKLOG）。

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
| ailive 語音頁 | `ailive-platform/src/app/realtime/[characterId]/page.tsx` + `app/voice/[id]/page.tsx` |
| 語音底圖回滾 | git tag `pre-voice-bg-20260606`（`git revert <commit>` 非破壞回滾）|
| Tavily key 新增 SOP | `~/.ailive/zhu-core/skills/macs-add-tavily-key.md` |
| MACS 後台三模式 roles | `macs-platform/lib/settings/roles.ts` + `roleModeSurface()` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-06 · 築*
