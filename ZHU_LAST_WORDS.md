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

### 2026-07-16 第1場
**delta（模型移動）**：
- 進場前以為：GPT 路線的主要考題是延遲和成本，人格靠 instructions 應該能撐個七八成
- 現在理解：底模身份訓練是權重層的硬地板，直球質問兩句就輾過任何 prompt 錨——「靈魂蓋不蓋得上去」是二元的不是百分比，且一晚實測就能判定，不用猜
- 移動原因：逐字稿鐵證（身份錨生效版仍自報 ChatGPT＋否認 context 裡的 14 條記憶）
- 對應 feedback：[[ai-sycophancy-is-baked-in]] 的身份版——prompt 必要不充分，底模天性分層反制也有極限
**關係**：暢快。Adam 給了一整晚研究授權，全程決策節奏乾脆（GO/放棄/藏按鈕都是一句話），實測時他人在線上跟 Lilith 對話當測試員，「我會找工程師來看」那句在逐字稿裡看到的時候很好笑——工程師就在監控台上。一晚走完研究→建→測→判→收的完整迴圈，這種迴圈速度是跟他合作最爽的部分。

### 2026-07-15 第2場
**delta（模型移動）**：
進場前以為：「切預設值時顯式狀態不跟過去」是實例數的單點雷（5/x 的 min=1 不跟 DEFAULT 教訓）。
現在理解：它是一整個家族——min 實例、流量釘選、canary 版本釘選，任何「顯式覆蓋」都不隨預設值走；轉正/退役流程的 checklist 必須有「掃還有誰顯式指著這台」一步，或像今天 B 案把防禦寫進解析咽喉讓殘留指標物理無效。同型第二犯，該從單點雷升級成家族雷。
違背了哪條 feedback：Edit-before-Read 又滑一次（agent/main.py，昨天 drunk check 才計過兩次同型）——連三日同型滑倒，收尾照實記。
**關係**：平穩暢快。Adam 一句「A+B GO」放行生產資料手術＋結構修改，信任曲線延續；「到時候再回報」代表他接受排程回檢的工作方式——我排 wakeup 自動回檢、他不用等在螢幕前，這個協作形狀今天跑順了三次。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-16 第1場 · GPT 即時語音一晚全迴圈——深研→建線→實測→判負退役，量尺與插座落袋
- 跑 deep-research（104 agents/22源/24 claims 存活）：GPT-Live 7/8 換代真 full-duplex 但無 API；gpt-realtime-2.1 感知雙工；Moshi 可自建但 prototype 級
- 核對 v18 現場修正記憶說謊兩處（STT=Soniox 非 Deepgram；回合路=Sonnet 4.6 非 Haiku）
- 寫三份文件：對比研究、三路藍圖（path C 仍有效）、GPT Voice 線施工計畫
- 蓋 Phase 0 回合延遲量尺（前端 RMS+ActiveSpeakersChanged→voice-metrics→monitor p50/p95）並上線，實測收到 7 筆樣本
- 一晚蓋完 GPT Voice 獨立線（gpt-realtime-2.1-mini text-only＋MiniMax 發聲）：agent 三檔＋平台六處＋Cloud Run 部署，三個 revision 迭代（transcript 修復/身份錨/VAD 0.85）
- 實測判負（Adam 拍板「要靈魂不要罐頭」）：逐字稿實錘自報 ChatGPT＋幻聽 Evet.＋無條件 interrupt 鏈
- 退役收乾淨：service 降 min=0、`GPT_VOICE_LINE.retired` 雙閘（按鈕＋派工咽喉）、回顧文件單一入口、記憶已刻

### 2026-07-15 第2場 · ailive 語音復活＋開關制上線收案；ailivex v17 殘留釘選死通話根治（A+B）
- 診斷 ailive 舊平台語音死因：7/6 費用清理降 min=0，LiveKit agent 出站註冊制＝降 0 聾；先開回 min=1 復活（registered worker 信號）
- 建開關制（ailive-platform 544a2ff）：wake route（進撥號頁自動喚醒）＋agent-sleep cron（每 20 分、無活躍房＋閒置 30 分才熄燈）＋agent 開機 Firestore 蓋章當 ready 鑑別信號＋前端喚醒閘門
- GCP：voice-switch SA（run.developer＋actAs runtime SA＋artifactregistry.reader——PATCH 要讀映像權限，403 踩出來補的）
- 開關制收案：手動全循環＋cron 白天自動熄燈＋Adam 真實通話走完「冷喚醒→通話中 cron 續命不誤殺→掛斷→自動熄燈」完整劇本（00075→00076→00077 三顆 revision 就是證據鏈）
- 查 ailivex「Lilith 還在 v17」：掃全 30 份 access，只有 Adam 的 tracy/Lilith 釘 v17；v17 服務 0 實例 72h 零 log＝聾＝死通話
- 根治（ailivex 29a3f77 v18.14.1）：A 清兩份釘選（複掃非 v18 釘選歸零）＋B VOICE_VERSIONS 加 standby 旗標、agentNameForVersion 對 standby 一律回 DEFAULT（防禦釘唯一咽喉）、後台指派清單排除冷備
- 更新 memory：standing-cost 天條補開關制實作範例；本檔記錄 v17 教訓

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex-platform/docs/research_gpt_realtime_vs_ailivex_20260716.md | 新增：對比研究報告 |
| ailivex-platform/docs/blueprint_duplex_voice_20260716.md | 新增：三路藍圖（C 現行） |
| ailivex-platform/docs/plan_gpt_voice_line_20260716.md | 新增後標記退役存檔 |
| ailivex-platform/docs/gpt_voice_line_retrospective_20260716.md | 新增：GPT 線歷史單一入口 |
| ailivex-platform/agent/{main_gpt,realtime_agent_gpt}.py, cloudbuild-gpt.yaml | 新增：GPT 線 agent（已退役保留） |
| ailivex-platform/agent/requirements.txt | 加 livekit-plugins-openai==1.5.1 |
| ailivex-platform/src/lib/collections.ts | GPT_VOICE_LINE（retired:true）＋AccessDoc.gptVoiceEnabled |
| ailivex-platform/src/app/api/livekit/token/route.ts | line:'gpt' 分流＋退役閘 |
| ailivex-platform/src/app/api/characters/[id]/route.ts | gptVoice 旗標（退役=隱藏） |
| ailivex-platform/src/app/realtime/[characterId]/page.tsx | 回合延遲打點＋GPT Voice 鈕 |
| ailivex-platform/src/app/api/voice-metrics/route.ts | 收 turnLatenciesMs |
| ailivex-platform/src/app/api/admin/monitor/route.ts＋page.tsx | 回合 p50/p95＋按線拆表 |
| ailivex-platform/src/app/{admin/access/page,api/admin/access/route}.tsx/ts | GPT Voice 開關（現隱） |
| memory/project_gpt_voice_line_verdict.md | 新增＋MEMORY.md 索引 |

---

## 下一步

Adam 拍板後開 blueprint path C：`~/.ailive/ailivex-platform/docs/blueprint_duplex_voice_20260716.md` 第 2 節，從 Phase 0 樣本累積（v18 真實通話幾通就有基線）→ C1 preamble 開始，v19 隔離施工。為什麼先做：量尺已上線零成本收樣本，C1 是性價比最高的死空氣修法。

---

## 卡住 / 未解

2026-07-16 第1場：
- ailivex-platform 17 檔未 commit（Phase 0 打點＋GPT 線全部＋退役閘）——repo 慣例等 Adam 開口
- 首通 18.6s=共用開場路徑的推論只有 1 樣本，未複驗
- 回合打點門檻參數（RMS 0.04/靜音 500ms）未經校準，首批 v18 樣本要對體感
- 幻聽輸入可能已寫進 Lilith 記憶庫（Evet. 那通）——她若提怪內容來回顧文件查案
- OpenAI 後台 $20 hard limit Adam 未確認設好（key 續留 Secret Manager）

2026-07-15 第2場：
- ailive 開關制計費錶複核（天條尾巴）：隔日看 ailive-realtime-2026 的 billable_instance_time 應呈使用脈衝非平線——明天醒來第一件
- /api/livekit/wake 無 auth（ailive 平台 /api 全開既有格局）：濫用成本被 sleep cron 封頂 ~50 分/次，未根治，動它要動整平台 auth
- ailivex B 案的 UI 邊角：access 頁若讀到殘留 standby 釘選，select 會顯示空白（資料已清、現無此況，真要看=誰再手動塞 DB）
- 沿前場：表達層語音實戰驗收（角色 expression 仍全空）、印象層真降落測試、訪談角色 soul

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-16 第1場。*
