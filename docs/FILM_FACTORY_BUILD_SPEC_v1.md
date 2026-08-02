# DreamF（製片工廠）網頁建置規劃書 v1.1

> **2026-08-02 Adam 三拍板**：①平台命名 **DreamF** ②地基調度清單（§10）全數點頭 ③期 0 GO——修正：**不用 UDN 歷史單驗**，自建測試線（與黑澤共議測試腳本），測功能測最小 MVP；全過才開蓋平台。

> 2026-08-02。來源：圓桌 R1（技術合議）＋R2（工種設計）＋v1.1 一致性增補＋築補齊工程規格。
> 逐字檔與設計書同目錄；本書＝合成後的**唯一施工真相源**，repo 出生後隨遷 repo root。
> 平台名待 Adam 命名，全文以「製片工廠」代稱。

---

## 1. 總覽

**一句話**：一家 AI 製片公司——使用者帶需求進門，系統的導演與製片接待他，走完完整製片流程，拿片走人。

- **定位**：獨立平台（Adam 裁決）。UDN 是第一個客戶兼建材倉庫，不是概念的主人。
- **v1 產出物**：30-60 秒、9:16/16:9、fast 720p 短片；分鏡表/關鍵影格/成片/帳單同卷歸檔。
- **三條鐵律**：①錢在簽字之後才燒 ②分鏡表 JSON 是唯一真相 ③確定性工作用程式，LLM 只做判斷與生成。

## 2. 使用者與角色

| 角色 | 誰 | 能做什麼 |
|---|---|---|
| user（客戶） | UDN 團隊成員（第一批）、日後其他租戶 | 立案、面談、簽字、審片、交片 |
| admin（管理者） | Adam／營運 | 機房/帳房/教室三後台、預算閘設定、狀態手術 |

多租戶：schema 全表帶 `tenantId` 欄、v1 不寫租戶邏輯（觸發＝第二個真租戶點名）。

## 3. 資訊架構與頁面規格

### 3.1 兩個座標系（全站只有這兩種落點）

```
/                     今天的桌子（跨案收件匣：等我動手的事）
/cases/new            開新案（幕1 接案廳）
/cases/[id]           案子的家（七幕進度條＋只渲染目前幕）
/library              片庫（已交片・已作廢——與進行中不同桌）
/admin                機房｜/admin/costs 帳房｜/admin/classroom 教室
/login                大門
```

側欄僅三項：今天的桌子／我的案子（進行中・已交片・已作廢）／帳房（admin 限定）。
任何按鈕的落點不是桌子就是某案的家——不存在第三空間。

### 3.2 逐幕畫面規格（案子的家內的階段畫面）

**幕1 接案廳**
- 版面：一整面大輸入框（placeholder「想拍什麼？用一句話說」）＋三下拉（格式 9:16/16:9；長度 16/24/32/48/60s——8 的倍數 enum，格律門口上鎖；封頂金額）＋素材上傳（logo/參考圖，選填）
- 簽字物：勾「同意本片花費上限 $X」→ 主鈕「**開始立案**」。**此幕不報價**（上限不說謊，估價此刻是謊言因子）
- 幕後：立案、題材 RAI 預檢（高風險題材門口掛警語）

**幕2 導演面談間**
- 版面：左＝對話流（導演釐清題，上限三題；第三輪起不撒新卡改反問「你不要的是什麼」）；右＝劇本桌三行即時成形（講什麼/給誰看/什麼感覺）
- 含角色的片：此幕加「**角色設定卡**」——Nano Banana 產同一角色三視圖（正/側/半身，乾淨去背），客戶簽字入卷（人物鎖第一道）
- 簽字物：三行卷＋風格卡（2-3 張，各附母版描述）雙簽 → 主鈕「**就照這個方向**」；鈕旁小字範圍估「預估 $5 內（估）」

**幕3 分鏡室（全流程最重簽字）**
- 版面：分鏡表橫向整表攤開，一列＝一段 8 秒；點格→右側抽屜編輯（表不被蓋住）；欄首用人話（「這 8 秒演什麼」「鏡頭怎麼動」「觀眾該感覺什麼」），enum 過字典檔不出機器詞
- RAI 風險欄標黃配白話：「這段可能被安全審查擋（人臉特寫）——導演已備替代畫面」
- 底部固定簽字列：合約價帶算式與脈絡（「這支片開拍要 **$3.20**（4 段×8s×$0.10）／你的封頂 $20」）→ 主鈕「**我簽字，照這份開拍（$3.20）**」＝全平台唯一燒錢閘；「還要再改」降為文字連結
- 幕後：導演下全譜 → schema 程式驗證（欄空/非 8 秒/段數不符＝退件回導演重寫，半成品不上客戶的桌）。**簽後改表＝回本幕重簽**

**幕4 美術間**
- 版面：K+1 影格橫列，共用幀跨在兩段交界上（「段2尾・段3首」用版面說）；每卡兩鈕「這張重生」（同描述重抽）/「改描述再生」（寫回分鏡表）；描述改而圖未重生→標「圖已過時」
- 同張重生第 3 次提示：「該改的是描述，不是骰子」；尾幀非穩定態（非休止符）自動標警
- 定稿產物：**大圖分鏡表**——sharp 確定性合成一張總表（網格：影格＋段序/景別/運鏡/8s/轉場情緒字幕）＝簽字物附件＋風格人眼總檢＋歸卷物
- 主鈕「**影格都好了，準備開拍**」

**幕5 攝影棚（只看不按）**
- 版面：段列表逐段三態（排隊/拍攝中・最後心跳 N 秒前/完成 ✓ $0.80/被擋→處理中）；頁面自動刷新＋「最後更新 N 秒前」；心跳斷逾 90 秒顯示「這段 90 秒沒動靜，可能卡住了」
- 底部跳錶：「已花 $1.60 ▸ 合約 $3.20 ▸ 封頂 $20」一條三刻度
- 無主行動；「暫停拍攝」右上次要紅框
- 幕後：Veo 逐段、斷點續跑、每段記帳、預算閘（到頂停線）；RAI 重投只改措辭不改指涉物，三次仍擋→停線押回分鏡室附改寫提案

**幕6 試片間**
- 版面：播放器＋分鏡表同列對照（播到哪列亮哪）；引導句「**片子有沒有照劇本拍？照拍了還不滿意——問題在劇本。**」
- 亮列尾端兩鈕：「**畫面重拍（劇本不變）＋$0.80**」（段級、不出幕、封頂內免簽）／「**回分鏡室改這段**」（出幕、改表重簽；按前秀連動代價「改段2尾幀＝段3連動，重拍 2 段 +$1.60」）
- 連按三次重拍→介面主動勸：「同段重拍 3 次了，多半是分鏡的問題——要回分鏡室嗎？」
- 頁底主鈕「**這支片可以了，交片**」（簽收物＝交付物，一檔制）

**幕7 交片櫃台**
- 版面：成片卡＋主鈕「**下載成片**」＋收據（「本片 $4.00｜簽字價 $3.20｜差額＝1 次重拍｜同長度均價 $4.40」——每個數字帶鄰居）
- 幕後：結案單（估 vs 實/重拍數/RAI 重投數）＝教室原料；案自動歸「已交片」

### 3.3 三件套（可理解性，藍圖十二章）

- 空狀態：桌子「桌上沒事…去『我的案子』看，或立個新案」＋鈕；攝影棚未開拍「分鏡簽字後，這裡會逐段直播拍攝進度」
- 錯誤（RAI 白話版）：「這段畫面被安全審查擋下了。系統判定第 3 段描述可能含敏感內容。被擋的段不收費。下一步：『用替代畫面重拍』或『回分鏡室改寫』」；機器原文收「技術詳情」摺疊；對映用 regex 不丟 LLM
- 超預算在開拍前擋：「這份分鏡要 $22，超過封頂 $20——刪 2 段，或把封頂調到 $25（需重新確認）」

## 4. 資料模型（Firestore；collections.ts 為 authoritative）

```
cases            片案：id, tenantId, ownerId, title, brief(需求原文), format, lengthSec,
                 capUsd(封頂), status(狀態機§5), scriptDesk{what,who,feeling}, styleCard,
                 characterSheets[]{name, refImageUrls[3], approvedAt},
                 storyboard(分鏡表 JSON §4.1), storyboardVersion, signedAt, contractUsd,
                 spentUsd, createdAt … 
cases/{id}/segments   段：order, status(排隊/生成中/done/blocked/failed), clipUrl,
                 costUsd, heartbeatAt, raiRetryCount, lastError
cases/{id}/keyframes  影格：order(0..K), role(段N尾=段N+1首 雙歸屬), desc(=表內描述),
                 imageUrl, imageHash(指紋), stale(圖已過時旗標), regenCount, approvedAt
corrections      教室事件：caseId, act(幕別), field, before, after, filmType,
                 promptVersion, at        ← 掛「儲存編輯」咽喉自動寫，確定性
cost_ledger      成本流水：caseId, kind(llm/image/veo), unit, usd, at
director_prompts 導演 prompt vN（append-only；每版註記依據哪批修正）
users / sessions / rate_limits / notifications
```

### 4.1 分鏡表 JSON schema（唯一真相；tool-use 結構化輸出＋程式級 validate/repair）

```jsonc
{
  "filmType": "product_brand",         // 片型宣告（欄位是片型的骨）
  "segments": [{
    "order": 1,
    "shot": "closeup|medium|wide",     // 景別 enum
    "camera": "slow push-in",          // 運鏡（英文，直餵 Veo）
    "durationSec": 8,                  // 程式驗證：恆為 8
    "description": "…",               // 畫面描述（英文 prompt 本體；生成時前綴 STYLE BIBLE）
    "transitionFeel": "屏息：儀式開始了", // 轉場情緒（中文，觀眾該感覺什麼）
    "firstFrameDesc": "…",            // 首幀（=前段尾幀時省略）
    "lastFrameDesc": "…",             // 尾幀＝動作休止符（穩定態，程式啟發式警示）
    "narration": "…",                 // 旁白欄（旁白斷句參與決定畫面斷句；可 null=默片）
    "raiRisk": "none|low|high",        // RAI 風險欄；high 必附 altDescription
    "genMode": "frames|ingredients"    // 生成模式：首尾幀（預設）/參考圖（無需精確接點的段）
  }],
  "styleBible": { "positioning": "…", "colors": {...}, "photography": "…" }
}
```
驗證器（程式）：欄空退件、非 8 秒退件、段數×8≠lengthSec 退件、high 無替代案退件、尾幀動詞態啟發式標警。

## 5. 狀態機

**案**：`drafting(幕1) → interviewing(幕2) → storyboarding(幕3 產表/審表) → signed(簽字) → arting(幕4) → shooting(幕5) → screening(幕6) → delivered(幕7)`；`archived / cancelled` 終態。回退邊：screening→storyboarding（改分鏡，重簽後 storyboardVersion+1、受影響段重置）；shooting→storyboarding（RAI 三次押回）。
**段**：`queued → generating(心跳) → done | blocked(RAI) | failed`；blocked→queued（改寫重投，raiRetryCount+1，≤3）。
簽字制度：`signedAt`＋`contractUsd` 落 doc；簽後 storyboard 唯讀，改表必經 screening→storyboarding 邊、重簽重寫 signedAt。

## 6. 生成引擎層

| 站 | 引擎 | 說明 |
|---|---|---|
| 導演（三行/分鏡表/RAI 改寫） | Claude via **bridge**（$0 開發期；量產可切 API 不改碼） | tool-use 強制 schema；輸出過程式驗證器 |
| 角色設定卡＋關鍵影格 | **Nano Banana（gemini-2.5-flash-image）為主**（人物一致性王牌、與 Veo 同家、Google 官方配方）；gpt-image-2 備援 | 含角色的圖一律帶設定卡參考圖；STYLE BIBLE 前綴＋首張定稿圖串接 |
| 影片段 | **Veo 3.1 via Vertex AI**（us-central1、ADC、storageUri 直寫 GCS） | 預設首尾幀模式（固定 8s）；`genMode=ingredients` 走參考圖模式（≤3 張）；輪詢 fetchPredictOperation；成功才計費 |
| 大圖分鏡表/文字層 | **sharp**（確定性） | 網格合成＋CJK 斷行；零 LLM |
| 拼接/音軌 | **ffmpeg** | concat（stream copy 優先）；旁白軌：MiniMax TTS（既有線）壓連續音軌蓋 Veo 切點 |

已驗證雷區直接繼承：Vertex 模型名用 GA `veo-3.1-*-001`（`-preview` 404）、image 欄位 `{bytesBase64Encoded,mimeType}`、RAI 看 `raiMediaFilteredReasons`、剛 enable API 等 service agent 佈建。

## 7. API 與背景任務

**Routes / Server Actions（頁面 API 同鎖，每條自驗）**
```
POST /api/cases                立案（幕1）
POST /api/cases/[id]/interview 面談輪（bridge，同步，分錢級）
POST /api/cases/[id]/storyboard 產表/重產（bridge＋驗證器）
POST /api/cases/[id]/sign      簽字（transaction：鎖表+寫 contractUsd）——唯一燒錢閘
POST /api/cases/[id]/keyframes/[order]/regen   重生/改描述再生（寫回表；stale 邏輯）
POST /api/cases/[id]/shoot     觸發拍攝 Job（簽字後才可）
POST /api/cases/[id]/segments/[order]/retake   畫面重拍（封頂內免簽）
POST /api/cases/[id]/deliver   簽收交片
GET  /api/cron/watchdog        心跳看門狗（CRON_SECRET）
```
**Cloud Run Jobs**（長任務天條；`TASK_ID`+`JOB_ACTION` env）
```
JOB_ACTION=shoot     逐段 Veo：讀表→切段→逐段生成（斷點續跑：done 段跳過）→每段寫回
                     clipUrl/costUsd/heartbeat→全完→ffmpeg 拼接＋旁白軌→final.mp4
JOB_ACTION=retake    單段重投（同表同幀）
JOB_ACTION=keyframes 批次影格生成（幕4 進場時）
```
六問全綁：status/lease/attemptId 三分、failed≠running、already_running→409、watchdog 看 lease、taskId 確定性、父 doc 刪回 200。

## 8. 成本與計價

- 單價（成功才計費）：Veo fast 720p **$0.10/s**；影格 圖價（Nano Banana 級）；LLM 走 bridge ≈$0
- 32 秒片參考帳：4 段×8s×$0.10=$3.20＋5 張影格＋重拍準備金 20% ≈ **$5 內**；單片封頂預設 $20
- 錢的三時刻五現身：封頂（幕1 簽）→範圍估（幕2 小字）→合約價（幕3 鈕上）→跳錶（幕4/5/6）→結案單（幕7）
- standard 檔（$0.40/s）在不做清單；觸發升格＝第一個真客戶嫌 720p 那天（屆時 standard 直拍 standard 驗——簽收物＝交付物）
- 預算閘＝程式硬閘（cost_ledger 累計 ≥ capUsd → 停線），不是提醒

## 9. 技術棧與部署

- **前台**：Next.js App Router（standalone）→ **Cloud Run**（沿 UDN 慣例；不上 Vercel——生成流程長、避 300s 雷）
- **DB/儲存**：Firestore＋GCS（新 GCP project `film-factory-2026`，billing 掛 01FB18；Firestore PITR＋每日 export）
- **Worker**：Cloud Run Jobs（同 repo `worker/`）；firebase-admin 走 **ADC**（天條：不注 SA JSON）
- **LLM**：bridge（`BRIDGE_SECRET` via Secret Manager）
- **部署**：`deploy.sh` 唯一真相源（第一次部署同日進 repo）；prod 人閘（Adam GO）；新 GCP project 首次 deploy 先過 IAM 雙必踩（Cloud Build --region、compute SA secretAccessor）
- **Repo**：新私有 repo（名字隨平台命名定）；repo root 帶 `FOUNDATION.md`（§10 為初始帳）＋`THIRD_PARTY.md`＋`collections.ts`

## 10. 地基調度清單（藍圖 v1.3 十三項——開工前 Adam 逐項點頭）

| # | 地基 | 裁定 |
|---|---|---|
| 1 | 身份門禁 | 首期（頁面 API 同鎖；user/admin） |
| 2 | 資料憲法 | 首期 schema；刪除連帶排後（觸發＝片庫首個真刪除） |
| 3 | 安全 | secrets＋gitleaks 第一天；威脅模型＋rate limit 排後（觸發＝開放 UDN 外註冊前） |
| 3A | 供應鏈 | 首期（ffmpeg/sharp 等引入同日入 THIRD_PARTY.md） |
| 3B | 弱點管理 | SAST/SCA＋SLA 首期；ZAP/滲透排後（觸發＝對外開放前） |
| 4 | 濫用防護 | 額度制首期（Veo 接上當天） |
| 5 | 可觀測性 | log/心跳/成本錶首期；巡檢排後（觸發＝上線首月） |
| 6 | 任務基建 | 首期（六問＋Jobs 同 commit） |
| 7 | 後台 | 首期唯讀（機房/帳房）；手術鈕排後（觸發＝第一次真卡死） |
| 8 | 部署 | 首期（deploy.sh 同日；prod 人閘） |
| 9 | 成本結構 | 首期（bridge；封頂進案 doc） |
| 10 | 災難還原 | 備份首期（corrections＝不可再生飛輪資產）；演練排後（觸發＝上線首月） |
| 11 | 擴建預留 | tenantId 留欄不寫邏輯（觸發＝第二個真租戶） |
| 12 | 可理解性 | 核心律首期（已織進 §3）；優尼過堂＝第一個生人走主動線前 |

## 11. 承重牆帳（四條，各配 pinning test，載重 commit 寫進註釋）

1. 簽字閘前分文不燒 Veo（`sign` transaction 是唯一開閘點）
2. 8 秒格律程式驗證（非 8 倍數退件）
3. LLM 輸出必過 schema 程式級 validate/repair（不拿 LLM 修 LLM）
4. 表存描述＋圖存指紋（URL+hash）；描述改而圖未重生必標 stale

## 12. 刪減清單（v1 明確不做）

用戶側圖表牆／七房平行導覽／假進度動畫／表格內聯編輯／通知中心／新手 tour／進階模式；對白 lip-sync／4/6 秒混拍／LLM 自動品管迴圈／轉場特效／standard 檔（觸發降級）；HeyGen 數位人／Podcast／模板市集／自動發布／全自動免審。

## 13. 施工分期與驗收信號

| 期 | 內容 | 驗收（鑑別信號，成功才會出現的） |
|---|---|---|
| **0 驗證吋**（2026-08-02 Adam 修正版） | 自建測試線：與黑澤共議測試腳本→導演站（bridge）產分鏡表 JSON→**確定性驗證器**（DreamF 第一件真代碼）→影格站（Nano Banana＋STYLE BIBLE＋休止符＋共用幀）→大圖分鏡表（sharp 合成）→Veo 首尾幀逐段→ffmpeg 拼接成片 | 端到端一支真片出廠＋量測：schema 一次過率、影格風格一致（大表人眼總檢）、接片成功率（休止符律）、單片 COGS 對帳。**$15 內。全過才開蓋平台** |
| **1 骨架** | 新 repo＋FOUNDATION.md→大廳＋案子的家＋幕1-3（含簽字閘 transaction）＋機房/帳房唯讀 | 真帳號走完幕1→3：簽字前 cost_ledger 零筆；簽字寫入 contractUsd；schema 退件路真觸發一次 |
| **2 產線** | 幕4-7＋Jobs（shoot/retake/keyframes）＋分流門＋教室進水＋大圖分鏡表 | 一支真片端到端：影格 K+1 張、大表合成、Veo 逐段、斷點續跑實測（殺一次 job 重啟續拍）、跳錶=cost_ledger 對帳、交片下載可播 |
| **3 精修** | 教室消化/出水（熱區表＋prompt vN）＋片庫＋角色設定卡線＋ingredients 模式 | 第 10 片後首次 prompt 改版；同角色兩張影格人眼同人；優尼生人過堂零教學走完主動線 |

## 14. 風險與誠實極限

- **寫實人臉跨圖**＝拉近不是保證（業界共識＋自家 7/15 實測）；對策：風格化角色容錯高、寫實臉少特寫、大圖分鏡表人眼總檢
- **RAI 過濾**：議題內容（人物/爭議）擋件率未知——期 0 就是量它；被擋不收費、重試零成本；三次押回分鏡室
- **導演品質**＝全案唯一真未知——期 0 直插它；教室是長期解
- **Veo region** us-central1（asia 未上）：延遲可接受（非即時場景）；ingredients 與首尾幀不可同用——已設計為 genMode 欄由導演下譜時決定

## 15. 待 Adam 拍板

1. **平台命名**（repo/GCP project 隨之定名）
2. **地基調度清單**（§10）逐項點頭
3. **期 0 GO**（$15、一週；量測腳本我來寫）

*v1.0 · 2026-08-02 · 圓桌二場×四席合議＋築工程補齊。設計討論全卷：ROUNDTABLE_film-factory_2026-08-02{,_R2}.md*
