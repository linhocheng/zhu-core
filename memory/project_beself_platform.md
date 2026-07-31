---
name: project-beself-platform
description: BeSelf——AI 角色訪談活動站(AVIVA beself by self 首客);訂單白名單一碼一訪+語音訪談+角色開口帶畫面;2026-07-30 草模全環實測通
metadata: 
  node_type: memory
  type: project
  originSessionId: 0eba6e0e-482e-4eda-9a46-516fe92e64b7
---

**BeSelf = 問卷換成 AI 角色訪談**:消費者輸訂單編號(cyberbiz 匯出白名單)→ 語音訪談 10-15 分 → 逐字稿/推薦度/禮物選擇回品牌後台 → 活動報告。憲法:**成果可攜,能力託管**(逐字稿歸品牌;角色靈魂/聲紋/方法論不出門)。

- 真身 `~/.ailive/beself`(有 git!)→ https://beself-two.vercel.app;資料在 ailivex-2026 Firestore `beself_` 前綴;地基帳本 FOUNDATION.md(2026-07-30 Adam 全表點頭)、藍圖 WHITEPAPER.md(優尼過堂七條在第九節)。
- **鐵律同 INLY:只走 /api/v1**,key 藏後端 env(消費者零設定);測試 key 綁寶力(正式角色 Adam 設計後換 .env.local+Vercel env 一行)。
- **角色開口帶畫面(平台沒做過→已做通)**:v21 訪談線 agent(=v20+`show_options`/`record_choice` 工具走 data channel `{type,payload}` topic='ui'+`ui_select` RPC 收前端點選);interview key 派工 v21;訪綱(禮物清單/品項/流程)由 BeSelf 每通經 voice/session `context` 注入——**換活動不換角色**。
- **正典律**(尖刺教訓):LLM 轉手的選項標籤會漂移(簡繁/改寫)——畫面渲染一律用活動正典清單,agent 事件只當觸發器;語音選擇用編號 regex 確定性對映回正典,絕不比對 LLM 字串。
- 2026-07-30 尖刺全環實測(全自動:Web Audio 注入合成語音當假訪客——Chrome `--use-file-for-fake-audio-capture` 是死路,餵出來全靜音):語音進→9 秒格子亮→點選→RPC→角色口頭確認(逐字稿可證)→gift 落庫→掛斷→逐字稿回流 5 句→錄音 31s done。一碼一訪閘實測擋重入。
- 安全閥:人數上限(campaign.maxInterviews)+15 分鐘前端鬧鐘(伺服器硬閘排後)+一碼一訪(transaction)+consent 未勾不建 doc+入口速率粗閘。
- 待辦(帳本排後,正式開跑前):伺服器 15 分鐘硬閘/CSV 匯入/秒數計量匯總 key/失敗通知/生人驗收;報告管線未動工(NPS 訪談內直問,抽取升級 agent 工具直寫是壓底債)。
- 後台 /admin 密碼在 .env.local BESELF_ADMIN_PASSWORD(Vercel env 同步)。
- **2026-07-31 Adam 三裁+量表上線**:①禮物一律 AI 語音操控(點選拆除,record_choice 即定案自動落庫)②分析=摩斯五篩(感官證詞/具體時空/推薦意願四級/抱怨/不經意;規格 docs/ANALYSIS_SPEC.md;走 bridge+程式驗證,再行銷行動=確定性映射)③**評分表禁令**——真角色不打分數,訪綱評分句已拔;「分數是句點不是鑰匙」(Adam 場實證:9分要到但1分扣哪被玩笑擋掉)。量表卡+活動解析 demo 頁上線(真資料);demo 場勾 excluded 硬濾聚合。
- **2026-07-31 深夜:遠端已補(github linhocheng/beself 私有)+企劃書 v1.0(docs/PLATFORM_PLAN.md:四房間/B2B 兩階段/一品牌一 key 建議)+M1 收案**:後台=活動列表→活動室(精靈/上線預檢/狀態機)+名單室(CSV 先預覽再落庫/作廢還原/匯出)+訪談房;入口 `/?c=<campaignId>`;externalUserId=`<campaignId>-<orderNo>`(demo 舊規則不動)。訪綱組裝唯一咽喉 lib/context.ts(評分句禁令釘組裝層)。**新雷**:record_choice 工具開火機率性(嘴說記了沒 call)→確定性兜底 lib/giftmap.ts(選擇對映:中文數字/簡繁漂移;逐字稿受訪者親口「N號」回填,接 complete+admin 對帳兩落地點),production 真訪談 2 場實測通。M1 測試活動 aviva-ms7su5e0 可整檔作廢。待 Adam 裁:企劃書第八章五個裁決點。

- **2026-07-31 白天:M2 報告室+圖片上傳收案(v0.8.0)**:第四房間=批次量表(client 逐場,無背景任務不欠六問)+一頁結論(程式聚合+bridge 歸納段明標 AI;雷:「平均 3.1 分」被讀成評分→facts 寫「通話時長 X 分鐘」)+再行銷/金句 CSV+列印 PDF;圖片上傳走 ailivex-2026-assets 公開桶 beself/ 前綴(4MB 白名單,giftImages 與 gifts 同索引同交易)。**素材桶 IAM 已收權**:allUsers objectViewer→legacyObjectReader(匿名可整桶列舉是真洞;documents/ 公開是功能語意)。訪談角色 Ava 已建全裝,待 Adam 發訪談 key 換 env 撤寶力。

- **2026-08-01 商品庫+兜底雙升級**:①品牌層商品庫(beself_products)上線,品項/禮物單一真相源,活動勾選制+快照凍結;真貨=Vivi(moumou-os platform_products)策展 10 件 AVIVA 商品含圖(圖已重傳自家桶)。②record_choice **四場三失**(升架構警報,治本在平台側工具強制);逐字稿兜底加品名比對(禮物階段後/唯一命中/複述跳過),production 無數字純品名場驗通;**限制**:STT 簡體 vs 繁體品名字形不同時比對不到(安全失敗回 null),根治候選 opencc-js 待 Adam 裁。
- **2026-08-01 Adam 三裁**:①禮物履行(寄送/地址)=**範圍外**,平台只保證「完成+不重複」(一碼一訪);②**觸達層是已知空白**——邀請發送/轉換漏斗(發送→進站→完訪)未規劃,第一檔用品牌自發連結土法,**未來做多品牌或報告要漏斗數字時要回來補**;③法遵頁 /privacy 已上線(v0.9.0,保存 12 個月是築暫定可調)。前台=beself-two.vercel.app/?c=<id>,後台=/admin。

- **2026-08-01 晚:後台換裝 v1.0.0**:Adam 的 claude.ai/design 稿(WeGrowth-AVIVA,經 DesignSync MCP 拉稿)整件實作——襯線+金棕+2px 直角語言;登入/列表/商品庫卡片牆/四分頁(名單/訪談/活動解析/設定)/一頁式報告獨立畫面;brandmark AVIF→PNG 入 public。稿多的去(示範密碼/公開分享連結/刪除鈕),稿少的造(勾選制/CSV 預覽/狀態機/量表卡/匯出/圖上傳)。邏輯零改動,八頁真瀏覽器煙測(圖片驗到 naturalWidth)。雷:煙測探針要兩段等(先等卡片 render 再等圖解碼),搶拍會把好 App 誤診成斷圖。商品「玩美淨顏慕斯花」正名「完美淨顏慕絲花」(Adam 裁)。

相關:[[project-inly-character-api]]、[[project-ailivex-platform]]
