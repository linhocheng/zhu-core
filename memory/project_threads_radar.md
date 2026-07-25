---
name: project-threads-radar
description: Threads 爆文雷達——對外營運 SaaS，客戶連自己 Threads 帳號設關鍵字＋互動門檻爬爆文；爬蟲路線
metadata: 
  node_type: memory
  type: project
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**threads-radar**＝對外收費 SaaS。客戶連自己的 Threads 帳號（託管瀏覽器登入，密碼不經我方）、設關鍵字＋讚/留言/轉發/分享門檻＋掃描週期，系統按互動數撈爆文進客戶專屬清單。repo `~/.ailive/threads-radar`（本機 git，未推 GitHub）；GCP project `threads-radar-2026`（專屬隔離，計費綁 Firebase 付款帳戶——「我的帳單帳戶」project 配額已滿）。

- **定位/路線**：Adam 拍板爬蟲路線＋客戶自備帳密（權責走服務條款）。互動數只有登入爬蟲拿得到（官方 API 不給別人貼文的讚數）。標準＝「只能比對手好」。
- **架構（混合）**：客戶前台 Vercel｜**neko 登入瀏覽器＝VM**（帶畫面 WebRTC 互動、開機隨需）｜**爬蟲 worker＝Cloud Run Jobs**（批次、零常駐）｜Firestore 多租戶｜**選型地雷**：browserless 授權 SSPL 商用要付費→淘汰，改用 **neko(Apache-2.0 可商用)**＋原生 Playwright 爬蟲。
- **成本**：固定 ~$40-55/月（Vercel$20＋VM neko）＋每客戶 ~$3-5（IPRoyal sticky 住宅 IP，唯一線性成本）。neko 開機隨需→閒置只剩磁碟費 ~$2/月。IPRoyal 舊 molowe 憑證仍有效（kiyShyDqbhgJMc1N，出口台灣住宅，憑證不入 repo 走 Secret Manager）。
- **進度（2026-07-25 全上線現場驗通）**：M0-M4 全部真實機驗證。**上線 https://threads-radar-virid.vercel.app**。M3：開VM→neko3.1.4 healthy、gost+neko chromium雙走中華電信住宅IP(板橋)、CDP ws:True、storageState可讀，D5/D7現場清。M4：operator登入/建客戶/配發通關碼/客戶入列(Firestore寫)、capture全鏈(錯secret→401、對的→KMS seal→Firestore health=connected密文418B)、頁面/api同鎖(/→307、/api→401)。**Vercel→GCP走WIF免金鑰**(Adam選)：SA radar-web最小權限+自訂compute角色，零可下載金鑰。掃描worker上線：Cloud Run Job radar-scan冒煙驗通(ADC Firestore讀+控制流+exit0)，D9清。成本清：VM TERMINATED/firewall鎖127.0.0.1/零常駐service。28案 pinning test全綠。
- **關鍵教訓**：①neko裸連=機房IP被IG擋→chromium必走住宅sticky proxy(登入=爬蟲同IP)②客戶session=頭號承重牆，KMS信封加密明文絕不落DB／log③**neko3.1.4 CDP**：不吃NEKO_ARGS/CHROMIUM_FLAGS(launcher line13清空env)→丟/etc/chromium.d/zzz-drop-in旗標+--remote-allow-origins=*(M111+ ws防403)；chromium只綁容器loopback→socat sidecar共用netns聽eth0轉發、host走docker bridge連④**WIF+Firestore踩四坑**：firebase-admin自訂adapter拒／注入authClient撞版本歪斜(gRPC headers.forEach、REST auth.fetch)／firebase-admin external_account檔被parser拒→**定案@google-cloud/firestore(其google-auth ADC支援external_account檔)+GOOGLE_APPLICATION_CREDENTIALS指設定檔+credential_source讀OIDC token檔+每請求現寫token(db()改async)**⑤WIF綁定單一subject用principal://非principalSet://(後者只給attribute/group set)⑥Vercel OIDC真sub=owner:<team>:project:<name>:environment:production⑦GCP新規builds submit需顯式--service-account+compute SA得cloudbuild.builds.builder。
- **未解/下一步**：**唯一剩真Threads登入→登入態爬蟲**(帳號風險，Adam決；已開好測試client adamtest@radar.app，通關碼在本機lastwords)。KMS unseal半邊待真session doc才完整驗。M5剩：cron排程(搬GEO分散排程觸發radar-scan job)/rate limit/巡檢/CI四件套/PITR備份/刪除連帶。IPRoyal憑證已進Secret Manager(iproyal-proxy)。
- 測試帳號 lucymo0306（IG，某謀角色帳號）；密碼不存記憶。

關聯：[[reference-molowe-threads-sessions]]（session重產SOP）、[[reference-molowe-tech-salvage]]、[[project-geo-authority]]（地基搬遷來源）、[[feedback-memory-can-lie]]（留言選擇器教訓）
