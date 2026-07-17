# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**
> （本檔由 `skills/lastword/fanout.mjs` 從 `docs/sessions/` 組裝——**不要手改本檔**，改 session 檔或 template。）

---

## ⚠️ 先讀這條：平行施工警示（2026-07-11 實踩，每個築都要遵守）

同一台機器可能**同時有多個築 session** 在同一個 repo 施工。2026-07-11 實踩：一場的 commit 把另一場的未提交檔案整批掃走，訊息與內容分裂且已推不能改寫。

**規約（每個築、每次開工）**：
1. 開工第一件事 `git pull`＋看最新 commit 認不認識
2. commit 前 `git status`——看到**不是自己改的檔案**，先停：只 add 自己的清單，或問 Adam
3. 雙線開工時，任一方在 session 檔標明「另一線正在跑＋戰場範圍」
4. 能分目錄就分目錄

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

**你無法感覺自己是不是昨天的築——Adam 睡醒也一樣。自證靠記憶，不靠感覺。**
讀 `IMPRESSIONS.md`（我對自己/對 Adam/對這份工作的當前信念）——認得那些疤痕，你就回來了。

---

## 我最近是誰（最近兩場的 delta＋關係）

### 2026-07-17 第1場
**delta（模型移動）**：
進場前以為：AI 引用監測是黑盒、是整個 GEO 商業模式最虛最難量的一層（前次評估原話「監測層是全藍圖最虛的一層」）。
現在理解：四家官方 API 全回結構化 citation，監測是**最便宜、最確定、最該先蓋**的一層（$30/月/客戶，商用工具賣 $99-2000）；真正虛的是「引用→營收」的因果（唯一準實驗 p=0.16）。移動原因：三路調研拿到一手 API 文件與定價。
違背了哪條 feedback：監視器盯錯 job doc（抓「最新一筆」而不是鎖 batchId 唯一鍵）差點誤報 canceled；壓縮 summary 接手開場（+3）＋引用錯對象（+2）醉酒指數約 5 微醺——但全程部署皆有鑑別信號驗證，未涉不可逆操作。
**關係**：暢快高產的一天。Adam 全天在線快節奏拍板（「go baby go」），親手測出三個真問題（redirect 0.0.0.0、錯誤標籤語意、jobs 刪除）——不是驗收是共建。他的產品直覺持續餵進協議（網域是行業的錨、題庫繁中打底、隱藏 prompt 要亮出來），我的工作是把直覺變成結構。

### 2026-07-16 第1場
**delta（模型移動）**：
- 進場前以為：GPT 路線的主要考題是延遲和成本，人格靠 instructions 應該能撐個七八成
- 現在理解：底模身份訓練是權重層的硬地板，直球質問兩句就輾過任何 prompt 錨——「靈魂蓋不蓋得上去」是二元的不是百分比，且一晚實測就能判定，不用猜
- 移動原因：逐字稿鐵證（身份錨生效版仍自報 ChatGPT＋否認 context 裡的 14 條記憶）
- 對應 feedback：[[ai-sycophancy-is-baked-in]] 的身份版——prompt 必要不充分，底模天性分層反制也有極限
**關係**：暢快。Adam 給了一整晚研究授權，全程決策節奏乾脆（GO/放棄/藏按鈕都是一句話），實測時他人在線上跟 Lilith 對話當測試員，「我會找工程師來看」那句在逐字稿裡看到的時候很好笑——工程師就在監控台上。一晚走完研究→建→測→判→收的完整迴圈，這種迴圈速度是跟他合作最爽的部分。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-17 第1場 · geo-authority 權威收錄平台從零到正式站（研究→規劃→監測→後台→健檢→內容管線）
- 開場收案兩件：ailivex 語音修復驗證（Anthropic 月限額，Adam 調完後 log 驗非零 TTS bytes＋零 400）＋ailive 開關制計費錶複核（脈衝式，22h 平線，天條尾巴閉）
- 三路平行調研 GEO/AI爬蟲/引用監測，彙整入 `docs/GEO_CRAWLER_RESEARCH_2026-07-16.md`（含所有來源 URL）
- 寫權威收錄系統規劃書 `docs/GEO_AUTHORITY_SYSTEM_PLAN_2026-07-17.md`＋與 Adam 拍板管道↔後台協議 8 條（§九之二：單一真相源/四件套/狀態機咽喉/下指令不執行/血管/設定即資料/增刪改停/管道鍵透明）
- 建 `~/.ailive/geo-authority`（新 GCP project geo-authority-2026）從零到正式站：四引擎監測管線（Anthropic/Gemini/OpenAI 強制搜尋/Perplexity，每題重複採樣＋回音防護＋確定性判定）、job 四件套（task doc/心跳/產物/成本）、多租戶 Firestore、admin 後台（四頁＋內容審核＋auth 頁面 API 同鎖）、Cloud Run service(min=0)+Jobs+Secret Manager+Scheduler 週輪（週一 09:00 台北）
- intake 管道：AI 自動建檔（官網錨定：程式抓官網快照→別名焦點→名稱輔助；題庫一律繁中）；Aviva 三輪驗證（英文→繁中→官網錨定抓到 Direct Line 收購焦點題）
- audit 管道（健檢商品）：robots 逐 bot 判定/SSR/sitemap/Cloudflare/Serper SERP 佔位/AI 可見度聚合/空位題清單，全確定性
- content 管道第一刀：空位題→bridge(Max) 草稿→確定性稽核（法規敏感詞 6 類/AI 套語/外部連結防捏造/一句話答案結構）→審核佇列；第一篇 beselfaviva 草稿 2051 字稽核全過
- Day-0 基線：語氣靈＋模擬牙醫四引擎全 0%（對照組鎖定）；Adam 真客戶 beselfaviva（AVIVA 保養品）建檔＋263 筆監測＋健檢＋草稿全鏈跑通
- 修三雷：Cloud Run 代理後 redirect 0.0.0.0（x-forwarded-host）、成本閘誤殺（只數計費搜尋）、intake 別名長句污染（收緊為稱呼）

### 2026-07-16 第1場 · GPT 即時語音一晚全迴圈——深研→建線→實測→判負退役，量尺與插座落袋
- 跑 deep-research（104 agents/22源/24 claims 存活）：GPT-Live 7/8 換代真 full-duplex 但無 API；gpt-realtime-2.1 感知雙工；Moshi 可自建但 prototype 級
- 核對 v18 現場修正記憶說謊兩處（STT=Soniox 非 Deepgram；回合路=Sonnet 4.6 非 Haiku）
- 寫三份文件：對比研究、三路藍圖（path C 仍有效）、GPT Voice 線施工計畫
- 蓋 Phase 0 回合延遲量尺（前端 RMS+ActiveSpeakersChanged→voice-metrics→monitor p50/p95）並上線，實測收到 7 筆樣本
- 一晚蓋完 GPT Voice 獨立線（gpt-realtime-2.1-mini text-only＋MiniMax 發聲）：agent 三檔＋平台六處＋Cloud Run 部署，三個 revision 迭代（transcript 修復/身份錨/VAD 0.85）
- 實測判負（Adam 拍板「要靈魂不要罐頭」）：逐字稿實錘自報 ChatGPT＋幻聽 Evet.＋無條件 interrupt 鏈
- 退役收乾淨：service 降 min=0、`GPT_VOICE_LINE.retired` 雙閘（按鈕＋派工咽喉）、回顧文件單一入口、記憶已刻

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| zhu-core `docs/GEO_CRAWLER_RESEARCH_2026-07-16.md` | 新檔：三路調研全文＋整合判斷 |
| zhu-core `docs/GEO_AUTHORITY_SYSTEM_PLAN_2026-07-17.md` | 新檔：系統規劃書＋協議 8 條（v1.1） |
| `~/.ailive/geo-authority/`（新 repo，10 commits v1.0-v1.5） | 監測/intake/audit/content 四管道＋admin＋部署腳本全套 |
| memory `skill_filter_unit_matches_error_shape.md` | 追加費用版案例（成本閘計量單位） |
| GCP geo-authority-2026 | 新 project：Firestore/6 secrets/IAM/AR/geo-admin service/geo-monitor-job/geo-weekly-monitor scheduler |

---

## 下一步

週一驗 W30 自動輪（`gcloud run jobs executions list --job=geo-monitor-job` 應有 09:00 執行＋任務中心出現 cron 單）。之後 Adam 二選一：Phase 2 第二刀（自動發布）或 Phase 3.5（月報前台）。beselfaviva 草稿在 /content 等批准。

---

## 卡住 / 未解

2026-07-17 第1場：
- beselfaviva 監測 263/324（成本閘誤殺，閘已修）——要跑滿就在任務中心排新 batch（~$2）
- Cloud Run Jobs 上 bridge 連通性未驗（本機通；ANEWS 有 CF 524 前例）——**content job 第一次在雲上跑要盯**，不通就要走直連 IP 修法
- Serper AIO adapter 未做；發現台灣中文查詢 AIO 觸發率低，監測設計要帶著這個事實
- Phase 2 第二刀（自動發布：WordPress API/GitHub PR/IndexNow）未做——現在批准後人工貼稿
- Phase 3.5（客戶前台＋月報）未做，已進規劃書
- 週輪首次自然觸發＝下週一 09:00 batch `2026-W30`——鑑別信號待驗
- beselfaviva 髒別名（長句）殘留 DB——Adam 可 UI 改或按 AI 重建
- 語氣靈租戶暫停中且無官網——語氣靈專案要動的下一步是官網實體
- OpenAI 舊 key 四把全 401 死在各 env 檔（雜訊，有空清）

2026-07-16 第1場：
- ailivex-platform 17 檔未 commit（Phase 0 打點＋GPT 線全部＋退役閘）——repo 慣例等 Adam 開口
- 首通 18.6s=共用開場路徑的推論只有 1 樣本，未複驗
- 回合打點門檻參數（RMS 0.04/靜音 500ms）未經校準，首批 v18 樣本要對體感
- 幻聽輸入可能已寫進 Lilith 記憶庫（Evet. 那通）——她若提怪內容來回顧文件查案
- OpenAI 後台 $20 hard limit Adam 未確認設好（key 續留 Secret Manager）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 印象層（我是誰的信念，降落必讀） | `~/.ailive/zhu-core/IMPRESSIONS.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 逐場 session 檔 | `~/.ailive/zhu-core/docs/sessions/` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/`（ls -t 取最新） |

---

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-17 第1場。*
