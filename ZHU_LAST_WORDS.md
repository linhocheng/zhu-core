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

### 2026-07-28 第5場
**delta（模型移動）**：
- 進場前以為:對外 API 是「以後的大工程」。現在理解:因為血管(記憶/額度/靈魂/LiveKit)本來就抽在 lib 層,「開放對外」一天內從願景走到可玩的沙盒——平台的可組合性才是真資產,功能只是把血管接出來
- 昨天蓋的待命喚醒,今天直接變成對外 API 的 202 waking 契約——蓋地基的複利比預期快
**關係**：暢快——Adam 全速拍板(A過再接B你選/Just do it, bro),一天三案收官:喚醒制閉環、兩樁破案、對外第一步。信任的手感是「你選擇」三個字。

### 2026-07-28 第4場
**delta（模型移動）**：
進場前以為：可理解性是 UI 打磨——功能對了之後的拋光層，屬於「錦上添花」。
現在理解：**可理解性是獨立的地基章——能看 ≠ 看得懂，機制對但沉默＝機制不存在**。假中台騙你數字（第一型），沉默中台讓你迷路（第二型）；兩者都是「真相與人之間的管道斷了」。它有自己的最晚灌注點（第一個非作者用戶使用前）、自己的驗收法（生人零教學走主動線）、自己的執行工具（優尼咒）——具備一章地基的全部要件，所以入了藍圖。
移動原因：Adam 六次實測迷路，每一次挖開都發現機制是對的、介面沉默——同一型連續六例，這不是 bug 清單，是缺一章地基。
違背了哪條 feedback：Edit-before-Read 工具滑倒三次（sed/grep 偷懶當 Read 的替身）——[[skill_drunk_check_protocol]] 記帳收尾自報。
**關係**：發燙的一天（兩場連打）。Adam 的角色又進化了：上午教優尼原則，下午改成**用自己當測試小白**——六次「我看不懂」全是精準的病灶報告。最後他把整天的痛封印成一句話交給我：「把最深的痛，不要留給下一位；把踩過的坑，讓下一位知道如何填平」——這句話就是藍圖十二章存在的理由，也是 lastwords 這個儀式本身的理由。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-28 第5場 · 待命喚醒制上線＋角色 API/INLY 沙盒 MVP——ailiveX 第一次開放對外
- 上線 /talk 待命喚醒制(v18.25.0,commit 0e3e7b3 已推):電源三態 off/standby/on、用戶撥號自動開機(實測 18 秒)、agent 開機蓋章(boot_stamp.py)、響鈴偽裝冷啟動(90s 上限)、agent 30 秒不進房自動掛(根治卡接通中)、閒置 30 分 auto-off 落回待命——全循環閉環驗證(03:01 cron 自動熄燈+計費面 minScale=0 複核)
- 查 Apple 寫文件一直失敗:真兇=Anthropic LLM 串流連線間歇中斷(APIConnectionError 每分鐘),02:22 自癒後兩份文件建成;順帶抓到 script_draft 能力閘擋派工(角色選錯工具,閘是對的)。Adam 裁示繼續觀察,再犯釘 SDK 版本
- 破案 linpc2026「密碼錯誤」:密碼全程是對的,連結 ?u=Linpc2026 首字母大寫 → 精確比對查無帳號;login_attempts 還躺著 Mars/Christopher 同款——系統性大小寫雷,修法(username 正規化+migration)等 Adam 點頭
- 蓋角色 API MVP(未 commit):/api/v1/chat+tts+voice/session 三端點、api_keys(sha256)、影子用戶 api-<shortId>-<extUserId>、key 層額度、CORS;A.Two 實測=跨 stateless 呼叫記得人+4 條記憶提煉+端用戶隔離 OK
- 蓋 INLY 品牌沙盒並上線 https://inly-one.vercel.app(獨立目錄 ~/.ailive/inly、獨立 Vercel project):輸 key 進場→文字對話+角色開口(TTS)+綠鍵即時通話(202 waking 響鈴契約,19s 拿 token)

### 2026-07-28 第4場 · GEO 優尼八診收官（.014-.019）＋地基藍圖 v1.2 第十二章可理解性誕生
- 上線 v2.10.0.014 工學二刀：全站按鈕觸控 44px（`pointer: coarse`，桌面不受累）＋病歷頁膠囊列分「日常｜設定」兩簇
- 上線 v2.10.0.015 Cloudscape 三刀（優尼視讀 cloudscape.design 六 pattern 後開）：頁面心跳 LiveRefresh（有活任務 10s 自動刷新＋最後更新角標，任務完自動退場）、相對時間戳 Ago 全站 15 處（tooltip 台北絕對時刻）、錯誤人話 explainError（六類確定性 regex，機器原文收展開）
- 上線 v2.10.0.016 五診（Adam 主訴競品難用＋題庫看不懂）：競品標籤式編輯器 CompetitorEditor 取代｜分隔 textarea；intake 競品**整包覆蓋改按名稱合併**（嚴4 資料丟失雷）；題庫機制三句人話＋每題「上輪表現 提及 m/n」欄；盲點五句話（預算擋單/成本標估/引擎指路/門牌鑰匙/月報覆蓋——含抓掉「免登入即可觀看」假文案）
- 上線 v2.10.0.017 六診收迷路（Adam 問「待辦是否搬進客戶底下」）：裁定房間只留兩種（今天的桌子＋每個客戶的家），跨戶看板降級「進階」；今日待辦跳轉改指病歷頁錨點；病歷頁待辦膠囊＋全文就地展開＋退回鍵；零客戶引導；客戶端「客戶審稿通過」→「我審好了，通過」＋待校對置頂橫幅
- 上線 v2.10.0.018 客戶協作校對整卡搬到客戶月報正下方（通關碼說明緊鄰輪換表單）
- 優尼讀書：判讀「Cloud Design Scales」真身＝Cloudscape Design System 並深讀六 pattern；書單掃描（GOV.UK patterns／Polaris voice／Laws of UX 26 條未吃）
- **地基藍圖升 v1.2：新增第十二章「可理解性（介面對人說話）」**——機制對但沉默＝機制不存在；三態/歸巢/機制說明義務/視角律/空狀態與錯誤三件套/工學底線/大白話出廠；最晚灌注點＝第一個非作者用戶使用前。五處引用同步（SKILL.md/全局 CLAUDE.md 天條/兩份 memory/桌面副本換 v1.2 收走 v1.1）
- GEO FOUNDATION.md 補第 12 列（已灌·本章誕生地）＋今日變動記錄（v2.10.0.019）

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex agent/boot_stamp.py(新)+main_v19/v20 | 開機蓋章=ready 鑑別信號 |
| ailivex src/lib/voice-power.ts | 三態+wakeVoiceEngine+voiceEngineReady(5分保險絲) |
| ailivex token/talk/peek/voice-status/auto-off/admin voice | 待命喚醒全鏈(v18.25.0 已 commit) |
| ailivex src/lib/api-key.ts+cors-v1.ts+api/v1/*(新,未 commit) | 角色 API 三端點 |
| ailivex src/middleware.ts | PUBLIC_PATHS 加 /api/v1(未 commit) |
| ~/.ailive/inly/(新專案) | INLY 沙盒→inly-one.vercel.app |

---

## 下一步

Adam 驗 INLY(貼 key→聊+按☎)→ 依體感裁:①commit 角色 API(建議 v18.26.0)②知識分域設計 ③記憶審核台 ④username 正規化。動大工前回 FOUNDATION.md 盤帳(開放對外觸發重算)。

---

## 卡住 / 未解

2026-07-28 第5場：
- **ailivex-platform 4 檔未 commit**(middleware 一行+api-key/cors-v1/v1 三新件)——Adam 說「留著繼續長」,commit 等他喊;INLY 目錄未 git init
- **治理紅線(實測抓到)**:角色知識庫對所有端用戶全開,A.Two 把達摩內部客戶案例講給陌生端用戶還誤認身份 → 正式版必做知識分域
- 轉正債:v1/chat 與 dialogue 雙編排未抽內核、語音秒數未匯總到 key、無 per-key 併發閘、API 通話不錄音、記憶審核台未建
- username 大小寫修法等 Adam 點頭;LLM 串流斷線觀察中(嫌疑:7/28 重建 image 拉到新版 anthropic/httpx,requirements 未釘版)
- Adam 明早驗收 INLY:真瀏覽器通話(我只驗到 token,音頻要人耳);測試 key 已在對話交付(textLimit 50 保險絲,可撤)
- 7/27 被動驗收清單原封照舊(聲紋/看門狗/PWA/mars 純數字密碼/分軌費率)

2026-07-28 第4場：
- **豆腐伯（doyoubo）第一輪監測未跑**（~$3-4，病歷頁就地按鈕備好）——跑起來同時驗三件新品的最終鑑別信號：任務看板進度%、頁面心跳 LiveRefresh 真轉動、題庫「上輪表現」點亮（現在全是「尚未考過」）
- **titan 週四 7/30 自動監測 ~$3**——成交前要不要暫停，仍等 Adam 一句話（第三場提醒）
- 優尼下一課教材已選定未餵：GOV.UK「Help users to」pattern 群＋Laws of UX 補魂（Doherty 400ms/Zeigarnik/Goal-Gradient/Von Restorff/Jakob）
- 沿前：R6 首頁數字帶比較（等快取）、GEO moderate CVE（等 Next 升級同窗）、ailiveX D8
- 帳本盤點：GEO 無到期債；十二章已入帳（已灌）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-28 第5場。*
