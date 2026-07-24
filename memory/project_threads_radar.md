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
- **進度（2026-07-25）**：M0 打撈molowe爬蟲藍本✅／M1 資料憲法＋分散排程(搬GEO)✅／M2 爬蟲worker核心✅**對真站驗過**（抓到「回覆→留言」aria-label 變更真bug，記憶會說謊活教材；真貼文讚78/留言138/轉發8/分享58）／M3 登入橋接**可行性證明**：機房IP被IG擋→gost轉發IPRoyal住宅sticky修通→正確密碼登入sessionid=true。29案 pinning test全綠（schedule/parse/scraper離線沙推/sessionCrypto信封加密）。
- **關鍵教訓**：①neko裸連=Google機房IP，IG專擋機房登入→必須chromium走住宅sticky proxy（登入=爬蟲同IP）②客戶session=頭號承重牆紅線，AES-256-GCM信封加密(KMS包DEK)明文絕不落DB③密碼陷阱：`momo!0306`少個`!`卡半天，用Playwright直登隔離變因證明是帳密非neko。
- **未解/下一步**：**D5 neko版latest未釘 CVE-2026-39386提權(CVSS8.8，修於3.0.11/3.1.2)→下場開VM前先查github.com/m1k1o/neko/tags確認chromium已修tag再釘**（暴露面已關：firewall鎖127.0.0.1/32＋VM停機）；D4 住宅proxy抽風worker要加重試＋健康檢查；M3剩per-session密碼/開機隨需/neko↔session加密串接；M4客戶前台(身份門禁搬GEO)；M5部署+濫用防護+CI+災難還原。FOUNDATION.md 對齊母版藍圖v1.1（三張表齊備）。
- 測試帳號 lucymo0306（IG，某謀角色帳號）；密碼不存記憶。

關聯：[[reference-molowe-threads-sessions]]（session重產SOP）、[[reference-molowe-tech-salvage]]、[[project-geo-authority]]（地基搬遷來源）、[[feedback-memory-can-lie]]（留言選擇器教訓）
