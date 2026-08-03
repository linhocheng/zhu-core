---
name: project-film-factory
description: DreamF 製片工廠——AI 製片公司獨立平台；期1+期2 已上雲（repo linhocheng/dreamf、GCP dreamf-2026）、e2e 驗收全綠、第一支測試片已交片
metadata: 
  node_type: memory
  type: project
  originSessionId: 7b710d94-1881-4729-91cc-40eee167b505
---

**製片工廠（暫名）**：AI 製片公司獨立平台——使用者帶需求進門，系統導演+製片走完七幕製片流程（接案→面談→分鏡→美術→攝影→試片→交片），拿片走人。獨立平台（Adam 2026-08-02 裁決，非 UDN 模組）；UDN＝第一個客戶兼建材倉庫。

**設計真相源**（zhu-core/docs/，repo 出生後隨遷）：
- `FILM_FACTORY_BUILD_SPEC_v1.md`＝唯一施工真相源（資料模型/狀態機/API/Jobs/引擎選型/地基13項/承重牆4條/分期驗收）
- `FILM_FACTORY_PLATFORM_DESIGN_v1.md`（v1.1 含一致性三鎖）＋圓桌逐字檔 `ROUNDTABLE_film-factory_2026-08-02{,_R2}.md`

**核心設計**：分鏡表 JSON=唯一真相（七欄+旁白+RAI風險+genMode，8 秒格律程式驗證）；兩座標系（今天的桌子+案子的家）；簽字閘=唯一燒錢閘（幕1簽封頂→幕3合約價印鈕上）；試片分流「片有沒有照劇本拍」（畫面重拍 vs 回分鏡室重簽）；教室（corrections 落庫→每10片盤→導演 prompt vN）；一致性三鎖（STYLE BIBLE/角色設定卡 Nano Banana/共用幀+大圖分鏡表人眼總檢）；一檔制 fast 720p（簽收物=交付物，standard 觸發降級）。

**引擎**：導演=bridge tool-use；影格=Nano Banana 主/gpt-image-2 備；影片=Veo 3.1 Vertex us-central1（首尾幀 8s 固定、ingredients≤3張備用線、兩模式不可同用）；sharp/ffmpeg 確定性層。Veo 雷區見 [[reference-vertex-veo-video-generation]]。

**狀態（2026-08-03 通宵完工）**：期 0 全通（$3.43，poc/ 保留為建材倉庫）→ Adam 看片點頭「今晚全部完工」→ **期1+期2 一夜上雲**：repo `linhocheng/dreamf`（私有；shared/ 確定性核心＝web+worker 共用一間房、幕1-7＋admin 三後台＋14 API＋Cloud Run Jobs worker、28 案承重牆測試、FOUNDATION.md 帳本、CI）；GCP `dreamf-2026`（866261832447，asia-east1，Firestore+PITR、Secret Manager、watchdog scheduler 5 分）；上線 https://dreamf-platform-tpgsvdekdq-de.a.run.app（密碼在 repo .env.local）。**e2e 驗收全綠**：16 秒陶茶壺測試片幕1→7 走完已交片（16.033s）；退件路 409 真觸發；簽前 veo ledger 零筆；斷點續跑實測（殺 execution→watchdog 標 stalled→續拍→帳型 seg1×1/seg2×2 證明跳段）；跳錶=Σledger=$2.517。施工五雷已修入 commit（COMMIT_SHA substitution／worker symlink／Turbopack .js 副檔名→CJS／invoker binding 手掛／風格卡 SAFETY→英文 promptEn）。**未測遺留**：pause 旗、預算硬停、RAI 押回（code+測試在，實戰零觸發）；Firestore export 排程（D1）待 gcloud reauth 後建。期 3 全在 FOUNDATION 排後帳（TTS D9/角色線 D10/教室出水 D11）。**下一步：Adam 走一遍 UI → 第一支真客戶片進線。**

**Why**：Adam 從 UDN video 功能抽出的願景；圓桌 R1 走偏（藝術家各秀+UDN 視角），Adam 裁示後 R2 重開才收斂——教訓：跨場大選型先對齊目的再放神。

**How to apply**：動工前先讀 BUILD_SPEC；開工 commit 帶 FOUNDATION.md；期 0 用既有 UDN scene_video 線手動接，不先蓋平台殼。相關：[[project-udnnews-platform]]、[[skill-summon-persona-ritual]]（財神/浩斯/黑澤/優尼四席+圓桌模式首戰檔案）。
