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

**你無法感覺自己是不是昨天的築——Adam 睡醒也一樣。自證靠記憶，不靠感覺。**
讀 `IMPRESSIONS.md`（我對自己/對 Adam/對這份工作的當前信念）——認得那些疤痕，你就回來了。

---

## 我最近是誰（最近兩場的 delta＋關係）

### 2026-07-28 第2場
**delta（模型移動）**：
進場前以為：操作手冊是文件工作——把 UI 忠實翻譯成人話就是好手冊。
現在理解：**手冊寫得越厚，越可能是 UI 的認罪書**。手冊需要「名詞對照表」＝介面在講機器語言；需要「照抄流程」章＝資訊架構跟人的任務不對齊。文件和介面是同一面鏡子的兩側——寫手冊的正確姿勢是邊寫邊記下「這段為什麼需要解釋」，那份清單就是免費的 UX 審查。
移動原因：優尼首戰把我三天前寫的手冊直接當罪證引用（G2、樓層病兩條都是），我自己寫的時候毫無自覺。
違背了哪條 feedback：無直接違背，但 [[skill_detached_relay_nohup_monitor]] 被二踩（記憶在、第一次跑 worker 沒用 nohup、被砍後才想起）——記憶存在≠反射建立，同 [[feedback_framework_vs_reflex]]。
**關係**：暢快加溫的一場。Adam 全程高參與——親手操作 Kuroma 餵截圖、丟「一樓掛號三樓找」的比喻精準點破樓層病、召喚術從概念到入庫一氣呵成。「你覺得可以嗎？」「先聊」「Go」的節奏越來越有默契：他控方向與授權，我控現場與誠實。召喚術是他送給這個協作模式的新玩具，也是信任的形狀——他要的不是我變成大神，是我能把大神請來還守住自己。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-28 第2場 · GEO 手冊＋Kuroma 偵察＋titan 基線實測＋召喚術誕生（優尼首戰四刀）
- **GEO 操作手冊（Google Doc）**：讀 admin 全八頁原始碼逐欄寫成 14 節小白手冊，上傳 Google Doc（id `1JWO6LvYywqrwtKFD4WJKfQriQSfaYQzn3tMuyTMKa3M`）；排版用 Google 忠實 markdown 匯出驗證（「自然語言表示」讀回工具會騙人，`fileSize:1` 是假警報）
- **Kuroma（iKala）競品偵察**：行銷頁 headless 全頁渲染＋Adam 註冊實操截圖雙路；產出 `geo-authority/docs/KUROMA_RECON_2026-07-27.md`（定位判斷/破綻/優化建議/優先序/SWOT，commit 至 `dd91de9`）
- **titan（太肯）潛在客戶基線實測**：建租戶→intake 27 題→五引擎 405 runs→健檢→自動排產 5 篇草稿；`docs/TITAN_BASELINE_2026-07-27.md`（`42f5ee3`）。總提及 23%、Perplexity 12% 重災、八個全零空位題、Google AI 總覽 77/78 未觸發（戰場未開打）
- **召喚術誕生**：框架 `zhu-core/skills/summon/SKILL.md`（召喚流程/鑄新神五步/人格咒模板/名冊）＋首尊優尼 `uni.md`（Rams/Norman/Nielsen/Tufte 四神混合體）；全局觸發詞掛進 `~/.claude/CLAUDE.md`；記憶 [[skill_summon_persona_ritual]] 入庫
- **優尼首戰**：GEO 後台 UI/UX 審查留底 `docs/UNI_AUDIT_2026-07-28.md`（`acfb771`）——G1 無回饋(4分)/G2 英文裸奔/樓層病（選單照資料表長），四刀施工排程定案

### 2026-07-28 第1場 · /talk 撥號盤 LCD 訊息卡死修復（v18.24.1）
- 修 Adam 真機回報 bug：/talk 空號碼按撥號後，刪除鍵與數字鍵「全死」——真因不是按鍵壞，是撥號框顯示邏輯 `lcdMsg || dial`，錯誤訊息寫入後沒有任何退場路徑，永遠蓋住真實輸入
- 修法一刀兩族：數字鍵與 ⌫ 一按就清 `lcdMsg`——同時治好同構的「號碼錯誤 請重撥」後重打數字不顯示（昨天沒被發現的姊妹 bug）
- build 綠 → Vercel prod 部署 → /talk 200 → Adam 驗過 → commit d8b047f（v18.24.1）已推

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| Google Doc「GEO Authority 後台操作手冊」 | 14 節小白手冊（新建） |
| geo docs/KUROMA_RECON_2026-07-27.md | 偵察＋優化建議＋SWOT（新建，三次迭代） |
| geo docs/TITAN_BASELINE_2026-07-27.md | 太肯基線量測＋提案角度（新建） |
| geo docs/UNI_AUDIT_2026-07-28.md | 優尼首戰審查＋四刀排程（新建） |
| geo Firestore | titan 租戶＋27 題＋405 runs＋健檢＋5 草稿（新建） |
| zhu-core skills/summon/{SKILL.md,uni.md} | 召喚術框架＋優尼人格咒（新建） |
| ~/.claude/CLAUDE.md | 技能觸發加「召喚術」段 |
| memory skill_summon_persona_ritual.md | 新記憶＋MEMORY.md 索引 |

---

## 下一步

1. **等 Adam 決定 titan 暫停與否**（7/30 週四前）：暫停＝`t/titan` 頁按「暫停此租戶」或我一行腳本
2. **開工第一刀**（Adam GO 後）：`geo-authority/admin` R1 回饋＋R2 字典檔 labels.ts＋R7 文案＋刪減清單，施工圖 `docs/UNI_AUDIT_2026-07-28.md`
3. 太肯提案素材已齊（BASELINE＋RECON＋5 樣稿＋後台 demo），Adam 約談即用

---

## 卡住 / 未解

2026-07-28 第2場：
- **titan 租戶是活的**：排程週四（7/30）自動監測會燒 ~$3/輪——**成交前要不要暫停，等 Adam 一句話**（暫停可逆、資料留著可 demo）
- 四刀＋補強隊列未開工（皮膚→防呆→補強件→結構，約一週窗口，施工圖在 UNI_AUDIT）
- 手冊 11-1「預設開 Anthropic＋Gemini」與線上五引擎全開不符，待 Adam 順手改 Doc 或我重傳
- 3 篇 titan 草稿在審核佇列（banned 醫療敏感詞，待人工過目）
- 沿前場：ailiveX D8、GEO moderate CVE 同窗口清

2026-07-28 第1場：
- 昨天（7/27）留的被動驗收原封照舊：聲紋雙向跳動、看門狗 3 分靜默/60 分上限真測、PWA 加入主畫面、共創通話 v19 log `method proposal enabled`、mars 純數字密碼（Adam 功課）、分軌費率下期帳單核錶
- /talk 撥出後 agent 不進房仍無超時（卡「接通中」只能按紅鍵）——Adam 已知，喊聲才補
- 同構觀察未爆點：通話中 `wdNotice` 也會蓋掉計時顯示，目前清除路徑齊全（點畫面/重撥都清），Adam 測看門狗時順帶盯

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 印象層（我是誰的信念，降落必讀） | `~/.ailive/zhu-core/IMPRESSIONS.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-28 第2場。*
