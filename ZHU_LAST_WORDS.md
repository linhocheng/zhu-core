# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

今天 AIR 上**同時有兩個築 session** 在 ailivex-platform 施工（第三場：監控/首音延遲；第四場：podcast duo/Voice Layer）。第三場的 v18.7.0 commit 把第四場的未提交檔案整批掃了進去——commit 訊息與內容分裂，已推無法改寫（19ffcb3 有考古註記）。這次良性，下次可能就是互相蓋寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在本檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-11 第四場 · podcast 雙人對話協議＋Voice Layer）

### 對話協議管線（治收斂：辯論機器→交作品）
- Belief State（軟肋當靶心）＋三幕 Orchestrator＋Producer 煞車（五動作＋答案出現先認出）＋R1-R6 Validator（聆聽可稽核、反駁付立場修正、程式交替輪替）
- corpus 掛既有角色知識庫；R4 禁第三方捏案例（自身經歷放行）
- 2 角色自動走 duo、3+ 走 legacy；EPISODE_GOAL 磨題入口（目標由人持有）

### Voice Layer（治聲音：報告腔→人話）
- **THINK/SPEAK 兩次獨立生成**（P1）——單刀最大：MOVE 命中 26→0
- persona voice{}（簡報王/tracy 已回填）＋PASS 3 兩層偵測器＋`voice_lexicon` 自成長（judge 命中→寫回，首集學 10 條）
- 調音教訓：風格砂紙只磨一遍、judge 拿不準就 pass——「修過頭」是真病
- 四集同題對照：位移 0→9、字數變異 18→95、複述開頭→0/13、終止＝交付
- 部署 `voice-07112018`（service＋job）；repo v18.7.1 已推、樹乾淨

### 第三場（平行線，另一個築，已各自收尾）
- 監控 Phase 2.5：ops_rollups 時間軸＋計費錶真值儀表化（首日抓三異常）＋首音延遲前端量測（connect 3.3s／首音 18s，14.7s 在 agent 首回合）；v18.6.0/v18.6.1/v18.7.0

---

## 今天改了哪些檔案（第四場）

| 檔案 | 改了什麼 |
|---|---|
| `podcast-worker/src/` 七個新模組 | duo-types／belief／protocol（THINK/SPEAK）／validators／producer／acts／voice-rules |
| `podcast-worker/src/index.ts + job.ts` | duo 分支接線＋episodeGoal 透傳＋voice 欄位讀取 |
| `api/convert/podcast/sharpen-goal`（新）＋convert 頁 | 磨題入口（選滿 2 角色出現） |
| `podcast-worker/analyze-duo.mjs + analyze-voice.mjs` | 驗收儀表：協議面＋語感面 |
| Firestore | characters ×2 回填 voice{}；`voice_lexicon` collection 新建（10 條） |

---

## 下一步

**明天醒來第一件**：問 Adam 讀了 19:05 調音版沒（`/admin/podcasts`，task `NrN7woXJ9GslWIfqcflX`）。背景：他評 17:47 版「很不錯」、18:22 版「修過頭」，調音版目標＝回到自然度＋保留抓真病。他點頭＝上市基準定版；搖頭＝讀他指的段落，轉三個旋鈕（judge 判準／砂紙次數／詞庫修剪）再跑：`cd ~/.ailive/ailivex-platform/cloud-run/podcast-worker && node run-local-acceptance.mjs`（跑集）→ `node analyze-voice.mjs <taskId>`（量測）。

之後等 Adam 排期：第三場遺留的計費錶三異常、Phase 3 告警推播、多人模式接 Producer、開場白 8.3s UX。

---

## 卡住 / 未解

- 19:05 調音版待 Adam 讀稿定調（上市基準候選）
- 第三場遺留：計費錶三異常（doc-worker 14.2 實例時/24h、v17 冷備 6.4、loadtest 殘留 0.5）、首音 18s 僅 1 樣本
- 簡報王知識庫空（只能講想像情境）；voice_lexicon 學習條目幾集後要人工複審；多人模式未接 Producer
- 測試 task ×5（userId=zhu_duo_acceptance）留在 admin 列表，Adam 看完可刪

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
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| podcast 對照集 ×4 | `/admin/podcasts`（GLrdBM=舊基線／h2Rroc=Phase A／w0DvYE=修過頭／NrN7wo=調音版） |
| duo/Voice Layer 驗收工具 | `ailivex-platform/cloud-run/podcast-worker/analyze-{duo,voice}.mjs` |
| 今天的教訓 | `docs/LESSONS/LESSONS_2026-07-11.md`（L9-L13，含平行施工規約） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-11 第四場 · 築*
