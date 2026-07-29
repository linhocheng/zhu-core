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

### 2026-07-29 第2場
**關係**：平穩而暖。晨間純交流的節奏（回看藍圖、問我滿不滿意、站在我這裡）是 Adam 在練我做決定，不是要我做工。換班交接乾淨。

### 2026-07-29 第1場
**delta（模型移動）**：
- 進場前以為:「LLM 呼叫無狀態」是物理事實。現在理解:是**直連 API 的性質,不是 LLM 呼叫的性質**——CLI 型引擎自帶記憶,省錢方案引入了 API 沒有的狀態性。審計要分兩面:我們送了什麼 vs 模型知道什麼
- 監看邏輯的教訓二進宮:寫 Monitor 條件時「目標不存在」和「目標完成」落在同一個分支=自製模稜兩可信號。以後監看一律鎖具體 ID 的顯式終態
**關係**：暢快+被請咖啡。Adam 全天高速拍板(共創確認/知識分域大白話/A案go/B案裁定),被誤報部署後零責難直接配合重登入——信任的厚度經得起翻案。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-29 第2場 · 晨班交流＋十二章雙通道縫合（兩針收）
- 縫合藍圖 v1.2 十二章「雙通道警示」（出生走藍圖檢查表、活著走優尼過堂；**任何非作者要用的介面出廠前＝召喚時機，不等使用者迷路**）＋優尼咒補「職責錨」回指藍圖——把前晚只活在對話裡的洞察外部化（zhu-core `79e0046`，桌面 v1.2 副本同步）
- 回答 Adam 兩題：①藍圖何時被下一個築主動呼叫（三個機制時刻＋一個漏接時刻→催生上述縫合）②多終端並行 compact 互不影響（腦內手術不外傳；共享面在檔案/git/記憶，靠平行施工規約守）

### 2026-07-29 第1場 · 角色 API 長成商品(金鑰後台/共創/知識分域)＋bridge 記憶污染破案＋錄音對話 log
- 上線 v18.27.0 金鑰後台管理(/admin/api-keys,角色頁「金鑰」鈕、明文僅顯一次、撤銷/用量)＋共創模式 key(文字提案進待審+語音派 v19 訓練線;影子用戶 access 種 coCreateEnabled,agent 端零改動;JWT 解碼驗派工線)
- 上線 v18.28.0 知識分域:chunk 帶 visibility(缺省 internal)、檢索咽喉過濾(文字 loadKnowledgeBlock+語音 load_knowledge_chunks 含兄弟塊)、後台入庫選擇+徽章切換、key 加 knowledgeInternal
- **破案 bridge 記憶污染**:穿透測試洩漏(阿利博士/臻品中醫對陌生端用戶)→ 真相鏈(注入塊長度落 DB)證明 prompt 全零 → SSH bridge VM 找到 claude CLI auto-memory 蒸了 182 個 a2_* 記憶檔注入所有過橋流量 → CLAUDE_CODE_DISABLE_AUTO_MEMORY=1+settings 雙保險+備份清污 → 3/3 穿透零命中+零新寫入。全平台(ANEWS/MACS/ailive)受益
- **誠實翻案**:發現今天兩輪 agent build 根本沒發生(gcloud 憑證早壞+管子吃退出碼+監看把「沒有build」誤讀成「完成」)——向 Adam 報數(醉酒5)、請他重登入、重提交、以 build ID→image digest→serving revision 全鏈驗證收案
- 上線 v18.29.0 錄音頁對話 log(agent 掛斷把本通角色標記逐字稿直寫 recordings doc,免 STT 免排單;Adam 真機通話驗過按鈕出現)＋v18.29.1 舊制 STT/分聲按鈕收納(SHOW_LEGACY_VOICE_JOBS 開關,架構保留,舊成品連結照顯)
- 交付 Apple×27XI3 對話逐字稿 .txt(對話庫撈取+誠實標注涵蓋範圍)
- 裁定 A/B 修法:A(關 bridge 記憶)治病已做;B(per-key 直連付費路由)記為對外收費前必做,動機=合規+容量非防污染

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| zhu-core skills/platform-foundation/BLUEPRINT.md | 十二章加雙通道警示引言塊 |
| zhu-core skills/summon/uni.md | 咒頭加職責錨（回指十二章） |
| ~/Desktop/平台地基藍圖_v1.2.md | 同步縫合後版本 |

---

## 下一步

1. titan 明天（7/30）自動監測前，Adam 若說暫停 → `gcloud scheduler` 或租戶頁暫停；沒說＝照跑 ~$3
2. 豆油伯第一輪等 Adam 按（病歷頁就地按鈕）
3. 接 GEO UI/UX 線先讀 `geo-authority/docs/UNI_AUDIT_2026-07-28.md`＋藍圖 v1.2 十二章

---

## 卡住 / 未解

2026-07-29 第2場：
- 沿 _4 場全部：豆油伯第一輪監測（驗進度%/頁面心跳/上輪表現三件新品）、titan 週四 7/30 ~$3 等 Adam 一句話（明天就是週四）、優尼下一課（GOV.UK＋Laws of UX）
- 平行班注意：今天至少兩條線在跑（第 1 場 bridge 污染破案已收尾），commit 前認自己的檔

2026-07-29 第1場：
- username 大小寫修法(linpc2026/Mars 系統性雷)等 Adam 點頭
- B 案直連路由、記憶審核台、v1 內核抽取、key 語音秒數匯總、per-key 併發閘——INLY memory 轉正債清單
- LLM 串流間歇斷線(7/28 APIConnectionError)持續觀察;requirements 未釘版,每次重建 image=重擲依賴骰子
- 引擎今天多次被測試喚醒,auto-off cron 會自動收(機制已驗證,不用管)

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-29 第2場。*
