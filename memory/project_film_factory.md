---
name: project-film-factory
description: DreamF 製片工廠——AI 製片公司獨立平台；管線 V3（母資產前移＋圖像全走 gpt-image-2 底片感）已上雲、三 e2e 交片；repo linhocheng/dreamf、GCP dreamf-2026
metadata: 
  node_type: memory
  type: project
  originSessionId: 7b710d94-1881-4729-91cc-40eee167b505
---

**製片工廠 DreamF**：AI 製片公司獨立平台——客戶帶需求進門，AI 導演走完製片流程拿片走人。獨立平台（Adam 2026-08-02 裁決）；UDN＝第一個客戶兼建材倉庫。上線 https://dreamf-platform-tpgsvdekdq-de.a.run.app（密碼在 repo `.env.local`）。

**管線 V2（2026-08-03 重構，Adam 拍板「就是這樣」）**：世界標準「identity before frames, frames before motion」——八幕：接案→面談（收卷抽角色/場景清單）→**美術間**（角色卡三視圖/場景卡無人多機位/風格幀，客戶逐張核准）→分鏡室（segments.assets 引用資產名，外觀禁重述）→**影格間**（影格帶「風格幀＋角色卡＋場景卡」參考生成→自動拼母片）→**簽字閘簽的是母片**（簽字即開拍）→試片→交片。設計依據＝zhu-core `RESEARCH_video_pipeline_survey_2026-08-03.md`（三路調查）＋`DREAMF_PIPELINE_V2_BLUEPRINT.md`。

**真相源**：repo `FOUNDATION.md`（承重牆五條＋排後 D1-D18 帶觸發）；zhu-core `FILM_FACTORY_BUILD_SPEC_v1.md`（V1 架構，V2 差異看藍圖）。

**管線 V4（2026-08-06 通宵重建，Adam「近 90% 重做，都要透過聊天創建所有細節」）**：兩階段對話＋三道閘——立案→【設定對話：導演×客戶聊出 3-5 張參考圖（角色/道具/場景/色調）】→【劇本對話：聊出 6-8 個鏡頭，秒數與接點當場定死】→母片(閘1)→單圖(閘2)→縫合(閘3＝錢閘)→交片。**三角色**：導演／攝影師各有可改人設（`roles` collection，`/admin/roles` 角色房），**製片刻意不是角色**（算錢/閘門＝guards.ts＋cost_ledger，天條）。**分工鐵律：DB 存人設、code 拼協議**（標記語法/JSON schema 在 `shared/roles.ts`，人改人設改不壞它）。導演前台單一窗口，攝影師在後面翻中→英，產出署名可見。標記剝除 `parseMarks` 確定性 regex（UDN `[[DISPATCH]]` 同款），壞標記直接丟不 re-ask。承重牆 #1/#5 moving baseline：錢閘位置從「簽字」搬到「縫合確認」，原則不變。V1/V2/V3 全退役（案子全刪＝無相容包袱）。藍圖＝zhu-core `DREAMF_PIPELINE_V4_BLUEPRINT.md`。**2026-08-07/08 收穫**：V4 上雲全流程實戰通——第一支片（熊片 26s 五鏡 $7.60）交付；**角色模組 v2**（Adam 親筆重寫三角色共 ~18k 字：默/阿光/阿律，四層全活 persona+stages+memories+試說話，行為在 DB、機器契約在 code）；縫合工作台（[[MOTION]]/[[DROP]]/deny 連戲鎖、阿律拆鏡警告權、單圖起動模式）；新 UI 全站（深殼+淺工作區+紫藍強調）；誠實條款（沒夾標記＝沒發生）。

**狀態（2026-08-04 V3 收案）**：圖像線全面改走 gpt-image-2（Adam 裁決）——母卡攝影底片感模板（FILM_LOOK 默認美學＝真人 35mm 底片感）、影格母圖裁格（≤3格/張同圖強制一致＋sharp 裁格放大 768×1536）、單幀 edits 重生、面談收卷零生圖（同步 request 生圖＝client 斷線 CPU 掐死實雷）；OPENAI_API_KEY 在 Secret Manager；$0.25/張概算待對帳；Vertex 降備用線。V3 終驗精華液案交片 $3.10 相符、母片雜誌級真人感。V2 帳（前一輪）：v0.2.0.001-010 十連 commit；雙 e2e 交片全鑑別綠——陶壺迴歸案（無角色，$1.795 帳房相符）＋精華液主考案（**母片三格同一張臉**，角色鎖成立，$1.834 相符）。V2 實戰撞出並修掉五雷：extractResult 平衡括號修復／prompt 尾綴否定條款觸發 SAFETY（三次定罪→風格幀原文直出鐵律）／低 RPM 配額下禁平行生圖／429 退避 30s×2／面談輸入鎖。**待辦**：D17 image 配額調升（真客戶前）、D18 角色卡寫實風（現 3D 動畫感滲入影格，等 Adam 裁）、D1 Firestore export 排程、pause/預算硬停/RAI 押回三路仍零實戰觸發。

**Why**：V1 影格從純文字生＝8 張影格 8 個人；簽字時客戶沒看過任何圖；母片是收據不是源頭。Adam 測 UI 卡在面談時問「母片會不會出」，追根拔起整條管線。

**How to apply**：動 prompt 拼裝先讀 FOUNDATION「V2 生圖 prompt 鐵律」；deploy 用 `bash deploy.sh`（web）＋`gcloud builds submit --config worker/cloudbuild.yaml`（worker，改 shared 必雙部署）；Veo 雷區見 [[reference-vertex-veo-video-generation]]。相關：[[project-udnnews-platform]]、[[skill-summon-persona-ritual]]。
