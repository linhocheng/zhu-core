---
name: project-threads-radar
description: Threads 爆文雷達——內部兵工廠（餵自家 Trade 寫手軍團）；中央統管架構（帳號池＋團隊共享池＋隊級調度）2026-08-01 A/B 期上線
metadata: 
  node_type: memory
  type: project
  originSessionId: 0df5b3f0-a1f0-45bc-a412-242728821924
---

**threads-radar**＝**內部兵工廠（非對外 SaaS，2026-07-30 定位翻轉）**，餵自家 Trade 寫手軍團。**中央統管架構（2026-08-01 Adam 拍板、A/B 期一夜上線）**：①情報帳號眾籌進池——同事從自己電腦走 /connect 捐入（分身帳號非本命），捐後歸總公司、本人不再登、每帳號綁固定 IP；帳號數跟關鍵字量走不跟人頭走 ②成員只碰平台：通關碼登入、設自己關鍵字（設定跟人走）、看團隊共享爆文池 ③調度隊級：收全隊關鍵字併重（同字只掃一次）→帳號池輪值（最久沒上工優先）。repo `~/.ailive/threads-radar`（GitHub 私有 linhocheng/threads-radar，CI 綠）；GCP project `threads-radar-2026`（計費綁 Firebase 付款帳戶——「我的帳單帳戶」project 配額已滿）。
- **A/B 期真身（2026-08-01，測試 55 案）**：去重鍵咽喉 `poolPostId=sha1(teamId|canonicalUrl)`（src/pool.ts）；併重/輪值純函數 src/dispatch.ts（**排序 code-point 不用 localeCompare——中文 collation 隨環境變**）；worker TEAM_ID（legacy CLIENT_ID 相容）；scan_status doc id＝teamId；ViralPost.matchedKeywords 陣列＋discoveredByAccountId；刪成員不刪池（爆文=團隊資產）；遷移腳本 web/scripts/migrate-team-{pool,dispatch}.mjs 冪等。
- **靜態 ISP 已上線（2026-08-01，402 斷糧根治）**：@lucymo0306 綁死 211.167.34.101（IPRoyal TW 靜態，$2.70/30天吃到飽）。真掃 Threads 放行 health=connected。worker `buildProxy` 單一咽喉：帳號 `proxyEnv`（指 --set-secrets env 如 IPROYAL_STATIC_1）→靜態直連、缺→動態閘道；靜態帳號 proxy_down 不輪替。**觀察項：此 IP ASN=Sky Digital 灰帶**（ipapi.is 判 datacenter、ip-api 判非；四源 geo 全 TW），被 challenge 就換條要求家用 ISP ASN。加新帳號 SOP：買靜態→四源驗→printf 封 secret→deploy.sh 加掛載→帳號 doc 設 proxyEnv。
- **E 期意圖層完成（8/1 v0.21）**：關鍵字三模式（只字/只意圖/二合一）；只意圖→worker 首掃 LLM 展開召回字快取（掃描照字走＝確定性）；掃後批次 bridge 判意圖（direct/adjacent/none＋樣態＋**證據原句鐵律：引不出＝none**＋信心值，15篇/掃）；前台意圖篩選＋hover 證據。src/intent.ts 純函數 deterministic parse。ground truth 對照通過（linnn_0926 DIRECT 證據一字不差）。
- **C 期完成（8/1 v0.20）**：/connect＝貢獻儀式（捐入歸池文案＋池內可用數）＋排隊鎖（lockDecision 純函數、423 排隊、15s 自動重試、capture/cancel/開機失敗三路放鎖）＋**意圖資產分離**（修舊 start 會洗在役 sessionCiphertext 的承重雷；captured 判定＝capturedAt>connectStartedAt）＋admin 池管理。生產雙人真演七信號全中。守則第1條已焊警語＋勾選閘門（v0.16）。改火牆要 compute.firewalls.update＋**compute.networks.updatePolicy 兩權限**（403 踩過，setup-iam.sh 已同步）。
- **觀察閘（D 期前置，跑至 ~8/8）**：@lucymo0306 靜態 IP 模式 7 天窗——過閘＝連續 connected/每輪有貨/零 challenge；紅燈＝challenge/expired 任一即換 ASN 重測。過閘後買第二條 IP＋第二帳號走貢獻儀式→D 並發實測自然發生。**D 期餘**：並發實測＋成本按關鍵字量重算——過閘才放同事。

- **定位/路線**：Adam 拍板爬蟲路線＋客戶自備帳密（權責走服務條款）。互動數只有登入爬蟲拿得到（官方 API 不給別人貼文的讚數）。標準＝「只能比對手好」。
- **架構（混合）**：客戶前台 Vercel｜**neko 登入瀏覽器＝VM**（帶畫面 WebRTC 互動、開機隨需）｜**爬蟲 worker＝Cloud Run Jobs**（批次、零常駐）｜Firestore 多租戶｜**選型地雷**：browserless 授權 SSPL 商用要付費→淘汰，改用 **neko(Apache-2.0 可商用)**＋原生 Playwright 爬蟲。
- **成本**：固定 ~$40-55/月（Vercel$20＋VM neko）＋每客戶 ~$3-5（IPRoyal sticky 住宅 IP，唯一線性成本）。neko 開機隨需→閒置只剩磁碟費 ~$2/月。IPRoyal 舊 molowe 憑證仍有效（kiyShyDqbhgJMc1N，出口台灣住宅，憑證不入 repo 走 Secret Manager）。
- **進度（2026-07-25 全上線現場驗通）**：M0-M4 全部真實機驗證。**上線 https://threads-radar-virid.vercel.app**。M3：開VM→neko3.1.4 healthy、gost+neko chromium雙走中華電信住宅IP(板橋)、CDP ws:True、storageState可讀，D5/D7現場清。M4：operator登入/建客戶/配發通關碼/客戶入列(Firestore寫)、capture全鏈(錯secret→401、對的→KMS seal→Firestore health=connected密文418B)、頁面/api同鎖(/→307、/api→401)。**Vercel→GCP走WIF免金鑰**(Adam選)：SA radar-web最小權限+自訂compute角色，零可下載金鑰。掃描worker上線：Cloud Run Job radar-scan冒煙驗通(ADC Firestore讀+控制流+exit0)，D9清。成本清：VM TERMINATED/firewall鎖127.0.0.1/零常駐service。28案 pinning test全綠。
- **關鍵教訓**：①neko裸連=機房IP被IG擋→chromium必走住宅sticky proxy(登入=爬蟲同IP)②客戶session=頭號承重牆，KMS信封加密明文絕不落DB／log③**neko3.1.4 CDP**：不吃NEKO_ARGS/CHROMIUM_FLAGS(launcher line13清空env)→丟/etc/chromium.d/zzz-drop-in旗標+--remote-allow-origins=*(M111+ ws防403)；chromium只綁容器loopback→socat sidecar共用netns聽eth0轉發、host走docker bridge連④**WIF+Firestore踩四坑**：firebase-admin自訂adapter拒／注入authClient撞版本歪斜(gRPC headers.forEach、REST auth.fetch)／firebase-admin external_account檔被parser拒→**定案@google-cloud/firestore(其google-auth ADC支援external_account檔)+GOOGLE_APPLICATION_CREDENTIALS指設定檔+credential_source讀OIDC token檔+每請求現寫token(db()改async)**⑤WIF綁定單一subject用principal://非principalSet://(後者只給attribute/group set)⑥Vercel OIDC真sub=owner:<team>:project:<name>:environment:production⑦GCP新規builds submit需顯式--service-account+compute SA得cloudbuild.builds.builder。
- **M5 五子系統全綠（2026-07-25 seq3）**：①cron分散排程(/api/cron/dispatch，CRON_SECRET，isScanDue+日上限+health precheck+成本錶+WIF觸發，真驗Cloud Run新execution爬2篇)②刪除連帶(7 collection含加密session歸零無孤兒)③rate limit(Firestore固定窗，客戶10/operator5每10min)+成本錶(scan_status.usage月掃描)+D12清④CI四件套(GitHub私有repo+ci.yml gitleaks/Semgrep/npm audit+security-dast.yml ZAP週排程，CI真跑轉綠)⑤PITR(7天)+每日備份(14天)+setup-firestore.sh。**平台自動駕駛**。抓修真bug：runScanJob帶override需run.jobs.runWithOverrides(非run.invoker)、計數燒額度改觸發後記帳、未用firebase-admin拖5傳遞漏洞移除(16→11)、Semgrep 12 findings三真修(GCM authTagLength/Dockerfile非root pwuser/Actions釘SHA)二標註誤報(nosemgrep須同行)。IAM/備份真相源=web/setup-iam.sh+setup-firestore.sh+worker/deploy.sh。
- **未解/下一步**：**D10留言selector登入態回0**(最影響產品體感，下一步優先；讚/轉發/分享都對，改worker/scraper.mjs EXTRACT_METRICS+src/parse.ts兩份，先收登入態真DOM)。餘：ZAP DAST未實跑過(週排程/手動觸發)、還原演練(上線首月)、巡檢sweep(暫緩)、D11 capture CDP重連、人在neko網頁登入純UX未直接驗。測試client qqc2xTNXWMjxmyvJOuDr(lucymo0306 connected)。
- 測試帳號 lucymo0306（IG，某謀角色帳號）；密碼不存記憶。

關聯：[[reference-molowe-threads-sessions]]（session重產SOP）、[[reference-molowe-tech-salvage]]、[[project-geo-authority]]（地基搬遷來源）、[[feedback-memory-can-lie]]（留言選擇器教訓）
