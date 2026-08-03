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

**狀態（2026-08-04 V3 收案）**：圖像線全面改走 gpt-image-2（Adam 裁決）——母卡攝影底片感模板（FILM_LOOK 默認美學＝真人 35mm 底片感）、影格母圖裁格（≤3格/張同圖強制一致＋sharp 裁格放大 768×1536）、單幀 edits 重生、面談收卷零生圖（同步 request 生圖＝client 斷線 CPU 掐死實雷）；OPENAI_API_KEY 在 Secret Manager；$0.25/張概算待對帳；Vertex 降備用線。V3 終驗精華液案交片 $3.10 相符、母片雜誌級真人感。V2 帳（前一輪）：v0.2.0.001-010 十連 commit；雙 e2e 交片全鑑別綠——陶壺迴歸案（無角色，$1.795 帳房相符）＋精華液主考案（**母片三格同一張臉**，角色鎖成立，$1.834 相符）。V2 實戰撞出並修掉五雷：extractResult 平衡括號修復／prompt 尾綴否定條款觸發 SAFETY（三次定罪→風格幀原文直出鐵律）／低 RPM 配額下禁平行生圖／429 退避 30s×2／面談輸入鎖。**待辦**：D17 image 配額調升（真客戶前）、D18 角色卡寫實風（現 3D 動畫感滲入影格，等 Adam 裁）、D1 Firestore export 排程、pause/預算硬停/RAI 押回三路仍零實戰觸發。

**Why**：V1 影格從純文字生＝8 張影格 8 個人；簽字時客戶沒看過任何圖；母片是收據不是源頭。Adam 測 UI 卡在面談時問「母片會不會出」，追根拔起整條管線。

**How to apply**：動 prompt 拼裝先讀 FOUNDATION「V2 生圖 prompt 鐵律」；deploy 用 `bash deploy.sh`（web）＋`gcloud builds submit --config worker/cloudbuild.yaml`（worker，改 shared 必雙部署）；Veo 雷區見 [[reference-vertex-veo-video-generation]]。相關：[[project-udnnews-platform]]、[[skill-summon-persona-ritual]]。
