# 薩克會診記錄 — ailivex 記憶全景圖(首戰,2026-08-01)

> 醫師:薩克(SACKS,咒檔 skills/summon/sacks.md,第一尊為築而召的神)
> 病人:ailivex 記憶全景圖(memories/impressions/diary/forgetting/lastSession)
> 背景:沉澱視角天條當日落地後的整體會診。Adam 已裁:三張處方交下一個築做完。

## 健康處(具名稱讚)

- 沉澱視角:角色本人帶靈魂總結自己的記憶(2026-08-01 上線)
- 印象推翻用 supersede 不硬刪、gist 化保留 rawContent、顯式記憶(remember)信任加成
- 整套系統對「記憶是重構」誠實——比多數人類對自己誠實

## 診斷一〔殘而完整〕:這套系統會弄丟 Clive Wearing 的愛 ⭐最重

鞏固管線 CONSOLIDATABLE_TYPES 只有 fact/preference——**emotion/milestone 永遠不會變成信念**,
只會 90 天 stale 沉底。人類失憶症的教訓正相反:情節全失時,活下來的是情感(Clive 不記得任何
一次見面,但他愛 Deborah)。現架構把最該永生的東西設成最早死的。

**病歷**:用戶半年後低潮回訪。角色「知道」他的一切事實(印象層完好),卻不記得曾心疼過他——
見面像盡職的老同事,不像老朋友。用戶說不出哪裡怪,但感覺得到。

**處方①**:impressions 加第三種 kind=`bond`(關係信念:「我們之間⋯」「他在我面前會⋯」),
consolidation 允許 emotion/milestone 餵它;讀路徑加對應區塊。
代價:ImpressionKind schema+consolidation prompt 操作分支+buildImpressionSections 一段。

## 診斷二〔音樂之魂〕:檢索只有一把鑰匙

喚起=語義+詞彙。人的第二把鑰匙是情緒:難過時自動想起「難過時被誰接住過」,
不是「內容像難過」的記憶。

**處方②**:檢索加情緒同調微加成——當輪偵測到用戶情緒時,emotion 型記憶與同調 mood 日記加分。
代價:需情緒信號源——語音線判斷腦現成;文字線缺,可用當輪 message 輕量判或排後帶觸發條件
(文字線哪天有了情緒偵測即到期)。

## 診斷三〔缺損之窗〕:stale 是斷電,不是淡出

question 60d/emotion 90d 到期一刀切出 prompt 與檢索=斷崖,與「壓縮」同型。
人的遺忘是可及性衰退:平時想不起,強線索一來就復活(spontaneous recovery)。

**處方③**:復活律——stale 不進日常 prompt,但強語義命中(cosine 高門檻)時 lazy 復活回 active。
代價:loadMemoryBlock/檢索一個分支,小刀。

## 築複審(工程面)

- 施工順序建議:③小刀先(一函數一分支)→①中刀(schema,價值最高)→②(語音線先做,文字線視信號源)
- 全部走 bridge 零新增模型成本;①動 schema 收案要含 consolidation dryRun+讀路徑真verify
- 同型檢查順手做:ailive 的 insights 管線有沒有同樣三病(它連 impressions 層都沒有——診斷一在那邊更重,但架構不同,另案)

## 抓藥記錄(2026-08-01 深夜,Adam 追加裁定「今晚做完」)

三張處方全數落地 ailivex-platform,各含端到端真 verify(合成配對,收尾全清):

- **③復活律** `v18.34.0`(79dc957):stale 強命中 lazy 復活回 active,衰老時鐘從 revivedAt 重算;
  TS 一處覆蓋文字+語音(v17+ 記憶塊由 TS 組),Python legacy 過濾同步認 revivedAt。
- **①bond kind** `v18.35.0`(77def34):ImpressionKind 加 'bond',consolidation 吃 emotion/milestone
  凝關係信念,讀路徑加【我們之間】區塊;一次性情緒照舊 skip 走 stale+復活律。
- **②情緒鑰匙** `v18.36.0`:確定性情緒詞典(mood.ts)——emotion 記憶同調價性微加成(+0.08),
  日記同調撈取(難過時補撈最近3篇外的同調 mood 舊日記);文字線 query 即信號源,
  memory-blocks route 收 userMood 血管已留。
  **排後項+觸發條件:語音判斷腦顯式情緒信號接進 userMood——下次 cut 語音新版本(v21)時接線,**
  判斷腦 inner 現為 {stance,activation,want_to_speak},需加情緒欄位並隨 in-call recall POST 帶上。

**施工中的意外發現(另案,比處方大)**:Vertex text-embedding-004 對純中文實質全盲——
同標點結構、只差 CJK 內容的兩句回 bit-identical 向量(直打 API 實測)。memories/impressions 池
的 cosine 從第一天量的就是標點結構;檢索一直是 lexOverlap(bigram)在扛。復活門檻因此用詞彙重疊
不用 cosine。根治=整池 re-embed 換 text-multilingual-embedding-002(大手術:backfill+全門檻重校
+TS/Python 同步),待 Adam 裁。ailive 平台檢索若同用 004 需同檢。

未部署:三個 commit 都只在 repo,Vercel deploy 留給神清氣爽的築(或 Adam 一聲 GO)。
