# 平台地基藍圖（母版）v1.1

> **定位**：以後 Adam 說「蓋平台」，這整份**默認全含**；哪塊不蓋要顯式說、他點頭才能砍。
> 跟舊模式反過來——舊模式是「提到才蓋」，本藍圖生效後是「砍掉才不蓋」。
> 樣品屋 vs 真房子：功能是皮，地基是管道間、水錶、門禁、消防。皮蓋得再漂亮，
> 沒有這些就是樣品屋（Adam，2026-07-19）。
>
> **跟一吋蛋糕不衝突**：地基是施工單位的靈活調度，不是第一天全灌。每項地基有
> 「最晚灌注點」（觸發條件），蛋糕照最短路徑跑，但過觸發點沒灌＝違章。
> 調度清單開工時列給 Adam 過目，他點頭才動工。
>
> 執行 SOP 在同目錄 `SKILL.md`。每個平台實例化一份 `FOUNDATION.md` 帳本進 repo root。

---

## 一、身份與門禁

誰能進來、進來是誰、能動什麼。

- 標配：帳號體系（密碼 scrypt/argon 級雜湊）、session 機制（簽名 cookie 或同級）、
  角色分層（至少 user/admin）、資源級授權（allowlist / ownership check）
- **頁面和 API 同鎖**：middleware 擋頁面 ≠ 擋 `/api`；後端每條路由自己重驗，UI 隱藏不是安全
- 內部呼叫（worker/cron）用 secret header 或 OIDC，不搭人類登入的便車
- 最晚灌注點：**第一個非內部用戶進來之前**
- 來源教訓：UDN「登入只擋頁面不擋 /api」（skill_public_page_open_api_hardening）

## 二、資料憲法

每個概念只有一個家；兩份即是零份。

- 標配：collections/schema 有一份 authoritative 文件（如 ailiveX 的 `collections.ts`）、
  綁定關係寫死（誰屬於誰）、命名一致
- **資料生命週期四動作都要有答案**：建立、修改、封存、刪除——不能只設計「寫進去」。
  刪除要想連帶（子集合、關聯 doc、儲存桶檔案）
- 狀態欄是狀態機不是自由字串；不同軸不混用（如 tier vs status）
- 資料層 deny-by-default 保險：應用層授權之外，DB 層預設全拒（Firestore rules 鎖死、
  只走 admin SDK；或 RLS enable 不給 policy）——應用層漏了還有一道
- 最晚灌注點：**第一筆真資料寫入之前**（schema 文件）；封存/刪除路徑可排後但要有觸發條件
- 來源教訓：真相分裂系（feedback_anews 兩-worker 分裂、假中台 ANEWS）

## 三、安全與威脅防禦

動工前做一次窮人版威脅模型，三問：**誰會想搞這個平台？攻擊面在哪？破了最壞怎樣？**

- 標配：secrets 全進 Secret Manager／env，永不落 git（推前 `git ls-files` 驗）；
  一切外部輸入不可信（injection、SSRF 防護——url-reader 的私有 IP／metadata 封鎖是範本）；
  最小權限 IAM（SA 只拿需要的角色）；公開 endpoint 一律 rate limiting；
  審計信號（誰在何時動了什麼，至少 admin 寫操作要留痕）
- **機器把關，不靠自律——安全掃描四件套接 CI**：SAST（Semgrep）＋套件掃描（Dependabot／
  `npm audit --audit-level=high`）＋祕密掃描（gitleaks + GitHub push protection）＋
  DAST（ZAP baseline 打 staging；active scan 永不打生產）。節奏：每 PR 跑前三種、
  nightly ZAP 被動、發版前 ZAP 主動掃 staging。「人會忘記檢查，工具不會」
- 供應鏈：裝任何套件前查證真實存在、知名、有維護——AI 會掰出不存在的套件名，
  駭客搶注放毒（slopsquatting）
- 錯誤不洩內部：stack trace／版本／SQL／路徑不回給用戶（通用錯誤訊息）；
  log 不進明文個資與 token（識別碼雜湊後記）
- LLM 平台四規：①用戶文字與檢索內容是**資料不是指令**，不併入 system 塊；
  ②模型輸出不可信，sanitize 後才下游用（不 eval、不當 HTML render）；
  ③模型觸發的不可逆動作必過人閘；④**prompt／persona 改動＝schema 改動**，改了就重跑紅線測試
- 紅線升級清單：碰到**真錢、密碼、個資、付款、檔案上傳、醫療金融**——停，做一次
  安全審查再上線。「能跑」不等於「能安全上線」
- 最晚灌注點：secrets 紀律**第一天**；gitleaks＋audit **repo 建立即開**；
  威脅模型＋rate limiting＋完整掃描鏈**對外開放前**
- 來源教訓：gh push 驗 tracked tree、SSRF guard（url-reader）、密鑰不落地天條；
  David Lo 資安系列＋holygrail2 security-baseline 20 條 invariants（2026-07-19 收編）

## 四、住戶行為與濫用

門禁擋外人，這章管進了門的人。

- 標配：正常動線假設寫下來（用戶會怎麼走）；防呆（重複提交、髒輸入、誤操作可回復）；
  濫用防護（quota／額度制、刷 API 偵測、垃圾資料防灌）；付費資源（生圖、LLM、簡訊）
  一定有用量上限與計數
- 最晚灌注點：**開放註冊／對外公開之前**；付費資源額度制**接上付費 API 的同一天**
- 來源教訓：web_search 無上限重試燒 key（reference_websearch_cloudrun_not_vercel）

## 五、可觀測性

「能跑」不算活著，「知道它跑得對不對」才算活著。

- 標配：結構化 log（含任務完成行——鑑別信號要有地方長）、心跳（withVitals 或同級）、
  成本錶（LLM/API 用量落 DB）、巡檢（窮舉式自動掃描，軸寫進程式天天跑）、
  通知咽喉（失敗要有人知道，不是等人發現）
- 最晚灌注點：log＋心跳**上生產前**；成本錶**第一塊錢燒出去前**；巡檢**首個營運週期內**
- 來源教訓：記憶觀察者首晚抓活血（IMPRESSIONS #6：對齊的帳會讓我停止尋找——
  解法是機器天天掃）；16 台殭屍燒 $963/月

## 六、任務基建

只要有背景工作就逃不掉。

- 標配：Async Worker 六問（status/lease/attemptId 三分、failed≠running、already_running→409、
  watchdog 看 lease、taskId 確定性、父 doc 被刪回 200）；長任務進 Cloud Run Jobs
  不 fire-and-forget；狀態檢查釘在 processJob 咽喉（停＝全停）；佇列設 maxAttempts
- 最晚灌注點：**第一條背景管線動工時**（跟管線同 commit，不是之後補）
- 來源教訓：skill_async_worker_checklist、fire-and-forget 天條、geo「停＝全停」v1.6.1

## 七、後台

沒有後台的平台不算完工——出事時你只能瞎子摸象。

- 標配：管理者能看（真實現場數字，不是 init 後再無寫回的假中台）、能改（狀態手術有 UI
  或腳本）、能追（任務／資料的真相鏈可對賬）；後台數字必反映真實管道
- 最晚灌注點：**第一個真用戶或真任務跑起來之前**（至少唯讀版）
- 來源教訓：假中台天條（sync-truth-principle）、AI pipeline 黑盒除錯 SOP（真相鏈寫回 DB）

## 八、部署與環境

部署腳本就是未來的現場。

- 標配：deploy script／IaC 是唯一真相源（手動改雲端資源**同日**改腳本並 commit）；
  環境分離（dev 不碰生產資料）；env 變數清單有文件；新 relative import 部署前本機起一次；
  部署驗證用鑑別信號（流量 revision 對齊＋功能探針，不是「部署指令跑完」）
- env 進程式前過 schema 驗證（Zod 或同級），缺值**啟動就死**（fail loud），
  不跑到一半才炸——env 雷全家（字面 \n、系統 env 蓋 .env、靜默 404）的機制解
- 生產部署是**人的按鈕**：prod deploy 走顯式人閘（manual dispatch／Adam 的 GO），
  staging 可自動、prod 永不自動
- 最晚灌注點：**第一次部署的同一天**（deploy script 進 repo）
- 來源教訓：手動改雲端同日改腳本天條、ADC 天條、traffic 釘舊 revision 真相分裂

## 九、成本結構

這個不先想，帳單會替你想。

- 標配：動工前答三題——哪條路燒錢？磚頭費為誰付（閒著時有沒有人下一秒需要它）？
  帳單怎麼驗（計費錶指標，不是設定畫面）？；LLM 能走 bridge 就不燒 key；
  付費 API 接上前 Adam 知情
- 最晚灌注點：**接上第一個付費資源之前**
- 來源教訓：磚頭費天條、計費錶天條、bridge_first、開發不燒付費 key 天條

## 十、災難與還原

資料誤刪怎麼救？答不出來就是沒有這章。

- 標配：備份（Firestore export 排程或同級，頻率明訂）、還原路徑**演練過一次**
  （沒演練的備份是薛丁格備份）、部署回滾路徑（上一版還能一鍵回去）、
  關鍵 secrets 的災備（bridge 掛了怎辦、SA 洩漏怎麼輪換）
- 最晚灌注點：備份**第一筆不可再生真資料寫入之前**；還原演練**上線後首月**
- 來源教訓：這章是 2026-07-19 立藍圖時發現的裸區——當時誠實答案是
  「ailiveX 被誤刪一個 collection 沒有還原路徑」。同日補課：三平台 PITR 7 天＋每日
  export 排程＋ailiveX drill 庫真還原演練通過。SOP：`docs/FIRESTORE_BACKUP_RESTORE.md`

## 十一、擴建預留

這章要克制——防的是過度設計，不是預測未來。

- 標配：模組邊界清楚（lib 職責表）；版本化紀律（實驗不碰現役版，append-only，
  語音 agent vN 制是範本）；多租戶／多角色若可預見就在 schema 留欄位，不留邏輯；
  「泛型化要泛到葉節點」——重構時 compat 層別殘留舊耦合
- 最晚灌注點：無硬性——**判斷題**，開工調度時跟 Adam 對一次即可
- 來源教訓：voice versioning 紀律、feedback_genericize_to_leaf_nodes

---

## 十二、出廠檢查表（開工調度清單＝帳本初始狀態）

新平台開工時把下表填好給 Adam 過目，**點頭才動工**。每項只有三種狀態：
**已灌／排後（必帶觸發條件）／砍掉（必帶點頭）**——沒有第四種。

| # | 地基 | 默認最晚灌注點 |
|---|---|---|
| 1 | 身份與門禁 | 第一個非內部用戶進來前 |
| 2 | 資料憲法＋生命週期 | 第一筆真資料寫入前（schema）；封存/刪除可排後 |
| 3 | 安全與威脅防禦 | secrets 第一天；威脅模型＋rate limit 對外開放前 |
| 4 | 住戶行為與濫用 | 開放註冊前；付費資源額度制接上當天 |
| 5 | 可觀測性 | log/心跳上生產前；成本錶第一塊錢前；巡檢首月 |
| 6 | 任務基建 | 第一條背景管線同 commit |
| 7 | 後台 | 第一個真用戶/真任務前（至少唯讀） |
| 8 | 部署與環境 | 第一次部署同日 |
| 9 | 成本結構 | 第一個付費資源接上前 |
| 10 | 災難與還原 | 備份在第一筆不可再生資料前；演練上線首月 |
| 11 | 擴建預留 | 判斷題，開工對一次 |

## 技術債規則（帳本第二張表）

**債不看年齡清，看利率清。** 每筆債兩個必填欄位：利率＋清償事件。

- **活血**（每天在長：寫手還活著、安全裸奔）→ 立刻清，插隊也清。backfill 收案前必答
  「壞資料誰寫的、還在寫嗎」——修資料和修寫手是兩張工單
- **壓底**（新工程要蓋在它上面）→ 動工前清，否則違章進地基、清除成本翻倍
- **低利**（死代碼、過時文件）→ 順手清（下次路過時），或**顯式養著**（帳本記「不清＋理由」）
- **升級規則**：同一個繞法連續兩場 session 被重新解釋＝高利貸，下場優先清
  （每解釋一遍就是付一次利息；reflex 454 次 solve_root_not_symptom 就是利息帳單）
- **已接受風險雙向規則**（holygrail2 收編）：顯式養著的債受雙向保護——
  不准在不相關的改動裡**順手「修好」它**（每筆要自己的 scoped 討論才能動），
  也不准把它**挖深**；退場條件（什麼時候必須清）跟債一起寫，最好直接寫在 code 註釋裡
- 防腐：清債不掛「今天想清」，掛觸發條件或順手——否則清債變成躲主線的逃避

## 承重牆帳（invariant 表——地基帳的孿生，帳本第三張表）

地基帳管「該蓋的蓋了沒」，承重牆帳管「**蓋好的不被無聲拆掉**」。
血的教訓（holygrail2）：persona 危機紅線在改版中無聲消失**七週**才被發現；
我們自己的同型雷：共用 loader 靜默 fallback 斷靈魂（244 字 soul）、zhTextDirective 家族。

- 格式（每條承重牆一行）：**| invariant | 基線值 | 來源 commit | code anchor | pinning test |**；
  載重 commit hash 直接寫進代碼註釋——「這行為什麼在這、誰立的」一眼可查，比 git blame 快
- **pinning test 變紅＝系統在正常運作**（它抓到你動了不該動的）。
  禁止 skip／xfail／刪測試讓 CI 變綠——那是剪警報線。修 bug 前先寫一個會 fail 的 test
- 動到承重牆檔案的改動必須顯式聲明：`preserved baselines: <list>` 或
  `moving baseline: <哪條> · <為什麼> · <證據>`——承重牆不是不能動，
  是動之前要知道自己在動什麼、並留下痕跡
- 什麼算承重牆：安全 invariant、效能基線、角色靈魂紅線（危機處理段落）、資料綁定鐵律——
  判準一句話：**無聲消失會打到真人的，都算**
- 沒有自動測試守的承重牆標 `prose-pinned`（只剩人眼把關）——這種行要特別小心，
  且是補 pinning test 的優先清單
- 最晚灌注點：第一條「無聲消失會出事」的規則誕生時（通常＝第一次 hardening 或第一條紅線落地時）

## 滾動規則（敏捷的機制版，不是姿態版）

1. **排後不是繞過**：必帶觸發條件＋Adam 點頭。沒有觸發條件的排後＝決定不蓋，必須顯式
2. **需求變動第一動作是回帳本重算**，不是改 code——「開放註冊」一落地，
   濫用防護就從排後跳到期
3. **節拍靠收尾**：lastword 盤點帳本到期項，到期未灌寫進未解、下場優先。滾動不靠自覺，靠儀式

---

*v1.0 · 2026-07-19 · 源自 Adam「樣品屋 vs 真房子」對談：清單裡幾乎每章都是踩雷才變天條的，*
*這份藍圖把「不二踩」升級為「第一次就該有」。天條短版在 `~/.claude/CLAUDE.md`，SOP 在 `SKILL.md`。*
*v1.1 · 同日 · 收編兩批外部文件：David Lo 資安系列（掃描四件套/供應鏈/紅線清單/LLM 四規/*
*env fail-loud/deny-by-default）＋holygrail2 工作原則與 baselines（承重牆帳/pinning test/*
*已接受風險雙向規則/prod 人閘）。原檔存 Drive 資料夾與 davidlo3917/holygrail2 repo。*
