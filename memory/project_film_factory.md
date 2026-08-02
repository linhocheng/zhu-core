---
name: project-film-factory
description: 製片工廠（暫名）——AI 製片公司獨立平台；圓桌二場設計定案、建置規劃書 v1 成卷、等 Adam 三拍板（命名/地基點頭/期0 GO）
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

**狀態（2026-08-02 晚）**：三拍板已落——①命名 **DreamF** ②地基清單 OK ③期 0 改自建測試線（Adam：不用 UDN 歷史單）。**期 0 當日全通**（`~/.ailive/dreamf/poc/`，git 已 init）：黑澤 ground truth 腳本（手沖咖啡考卷版：條紋杯跨三段＋一處硬切）→確定性驗證器→Nano Banana 影格 6 張（Vertex+ADC 走 udnnews，零新密鑰；風格錨鎖住條紋杯）→大圖分鏡表（sharp）→Veo 4 段零 RAI→ffmpeg 成片 32.03s。**接縫像素級驗證**（休止符+共用幀有效）。總帳 $3.43。關鍵發現：①導演 prompt 必含 JSON 骨架逐字（散文描述→LLM 自創 key，blueprint-schema-example 雷重現）②styleBible.colors 改語意色名自由鍵（schema v1.1）③追蹤物件給專屬色＝人眼一致性檢查軸。**下一步：Adam 看片點頭→期 1 開挖**（新 repo+GCP project dreamf、大廳+案子的家+幕1-3）。

**Why**：Adam 從 UDN video 功能抽出的願景；圓桌 R1 走偏（藝術家各秀+UDN 視角），Adam 裁示後 R2 重開才收斂——教訓：跨場大選型先對齊目的再放神。

**How to apply**：動工前先讀 BUILD_SPEC；開工 commit 帶 FOUNDATION.md；期 0 用既有 UDN scene_video 線手動接，不先蓋平台殼。相關：[[project-udnnews-platform]]、[[skill-summon-persona-ritual]]（財神/浩斯/黑澤/優尼四席+圓桌模式首戰檔案）。
