# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
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

## 最新完成（最近兩場，新的在前）

### 2026-07-12 第1場 · podcast prompt 流程攤解＋正式規格書交付
- 攤解 podcast duo 全鏈路 prompt 流程給 Adam（每一次 LLM 呼叫的組成，聊天版）
- 確認 /convert 磨題按鈕位置與觸發條件（選滿 2 角色才出現）
- 寫正式規格書 `ailivex-platform/docs/spec-podcast-duo-dialogue.md`（十章：診斷/架構/三鐵律/呼叫全解/voice五欄/四集實測表/調音教訓/驗收方法論/機讀 YAML/移植八步），檔案已傳 Adam

### 2026-07-11 第4場 · podcast 雙人對話協議＋Voice Layer
- 建 duo 對話協議管線（治收斂）：Belief State（軟肋當靶心）＋三幕 Orchestrator＋Producer 煞車（五動作）＋R1-R6 Validator（聆聽可稽核、反駁付立場修正、程式交替輪替）；corpus 掛既有角色知識庫；EPISODE_GOAL 磨題入口（目標由人持有）
- 建 Voice Layer（治聲音）：THINK/SPEAK 兩次獨立生成（MOVE 命中 26→0）＋persona voice{}（簡報王/tracy 已回填）＋PASS 3 兩層偵測器＋voice_lexicon 自成長（首集學 10 條）
- 調音三旋鈕修「修過頭」：judge 拿不準就 pass／風格砂紙只磨一遍／詞庫修剪 13→10
- 四集同題對照實測：位移 0→9、字數變異 18→95、複述開頭→0/13、假讓步/捏案例歸零、終止＝交付
- 部署 `voice-07112018`（service＋job）；repo v18.7.1 已推、樹乾淨
- （深夜加班）lastword skill 重構 v3.0.0：一份 session 檔＋fanout 程式扇出＋現場清點＋合併不覆蓋（zhu-core aaeaeca/v0.0.0.009）
- （深夜加班）角色 voice{} 後台可編輯：admin 角色頁五欄＋PATCH 收斂，生產驗證通過（platform 5973373/v18.7.2）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/docs/spec-podcast-duo-dialogue.md`（新，未 commit） | 雙人對話系統完整規格書 v1.0 |

---

## 下一步

兩件等 Adam：① 說 commit 就收規格書（v18.7.3 文件：podcast 雙人對話規格書）；② 讀 19:05 調音版（/admin/podcasts task NrN7wo 開頭）定上市基準。都不動的話下一優先＝第三場遺留的計費錶三異常。

---

## 卡住 / 未解

2026-07-12 第1場：
- `docs/spec-podcast-duo-dialogue.md` **未 commit**（規矩：等 Adam 說；已當面標記，若另一場要動 ailivex-platform 請先處理這檔）
- 沿前場：19:05 調音版待 Adam 讀稿定調；計費錶三異常；簡報王知識庫空；voice_lexicon 待複審；多人接 Producer

2026-07-11 第4場：
- 19:05 調音版（task `NrN7woXJ9GslWIfqcflX`）待 Adam 讀稿定調——上市基準候選
- 簡報王知識庫空（只能講想像情境）；voice_lexicon 幾集後要人工複審；多人（3+）模式未接 Producer
- 測試 task ×5（userId=zhu_duo_acceptance）留在 admin 列表，Adam 看完可刪
- 第三場遺留：計費錶三異常、首音 18s 僅 1 樣本

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-12 第1場。*
