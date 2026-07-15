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

### 2026-07-15 第2場
**delta（模型移動）**：
進場前以為：「切預設值時顯式狀態不跟過去」是實例數的單點雷（5/x 的 min=1 不跟 DEFAULT 教訓）。
現在理解：它是一整個家族——min 實例、流量釘選、canary 版本釘選，任何「顯式覆蓋」都不隨預設值走；轉正/退役流程的 checklist 必須有「掃還有誰顯式指著這台」一步，或像今天 B 案把防禦寫進解析咽喉讓殘留指標物理無效。同型第二犯，該從單點雷升級成家族雷。
違背了哪條 feedback：Edit-before-Read 又滑一次（agent/main.py，昨天 drunk check 才計過兩次同型）——連三日同型滑倒，收尾照實記。
**關係**：平穩暢快。Adam 一句「A+B GO」放行生產資料手術＋結構修改，信任曲線延續；「到時候再回報」代表他接受排程回檢的工作方式——我排 wakeup 自動回檢、他不用等在螢幕前，這個協作形狀今天跑順了三次。

### 2026-07-15 第1場
**delta（模型移動）**：
進場前以為：資料 backfill 完＋帳目歸零＝那個缺欄問題修好了（前場補 280 條時就是這麼收的）。
現在理解：backfill 是清症狀，觀察者隔天就看著它長回 81 條——壞資料是活的，因為寫手還活著。資料手術收案必須多問一句「這些壞資料是誰寫的、它現在還在寫嗎」，追到寫入端修掉才叫斷根。觀察者的價值恰恰在此：它讓「症狀重現」從半年後的驚嚇變成 24 小時內的例行報告，根因藏不住。
移動原因：巡檢首晚報 8 條、我清完當天又長 73 條——同一天內親眼看兩次「清了又流」。
違背了哪條 feedback：solve_root_not_symptom——前場 backfill 280 條時沒有追寫入端，標準的修症狀不修根因；這場觀察者逼我補課。
**關係**：平穩高效。Adam 給的視覺總監 prompt 本身品質很高（無文字底圖＋圖層分離的方向跟天條同構），對談收斂快（三問三答就定案）；「清掉 開懶人包」四個字連發兩案全速信任。凌晨他還在跟 Lilith 對話——那 73 條記憶就是活的平台在呼吸。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-07-15 第2場 · ailive 語音復活＋開關制上線收案；ailivex v17 殘留釘選死通話根治（A+B）
- 診斷 ailive 舊平台語音死因：7/6 費用清理降 min=0，LiveKit agent 出站註冊制＝降 0 聾；先開回 min=1 復活（registered worker 信號）
- 建開關制（ailive-platform 544a2ff）：wake route（進撥號頁自動喚醒）＋agent-sleep cron（每 20 分、無活躍房＋閒置 30 分才熄燈）＋agent 開機 Firestore 蓋章當 ready 鑑別信號＋前端喚醒閘門
- GCP：voice-switch SA（run.developer＋actAs runtime SA＋artifactregistry.reader——PATCH 要讀映像權限，403 踩出來補的）
- 開關制收案：手動全循環＋cron 白天自動熄燈＋Adam 真實通話走完「冷喚醒→通話中 cron 續命不誤殺→掛斷→自動熄燈」完整劇本（00075→00076→00077 三顆 revision 就是證據鏈）
- 查 ailivex「Lilith 還在 v17」：掃全 30 份 access，只有 Adam 的 tracy/Lilith 釘 v17；v17 服務 0 實例 72h 零 log＝聾＝死通話
- 根治（ailivex 29a3f77 v18.14.1）：A 清兩份釘選（複掃非 v18 釘選歸零）＋B VOICE_VERSIONS 加 standby 旗標、agentNameForVersion 對 standby 一律回 DEFAULT（防禦釘唯一咽喉）、後台指派清單排除冷備
- 更新 memory：standing-cost 天條補開關制實作範例；本檔記錄 v17 教訓

### 2026-07-15 第1場 · 觀察者首晚抓到活血——writeMemory 斷根（ailivex v18.14.1）＋UDN 懶人包視覺總監管線上線（v0.8.0.001）
- 驗收生產第一次記憶巡檢心跳（台北 04:00 準時，run SivybCtZ4RxN3An3U6Bc）：觀察者首晚值班抓到 8 條新記憶缺 status——證明「軸窮舉進程式天天掃」這條路對
- 追根：extraction / tool:remember 兩路收斂在 TS `writeMemory`（memory.ts:240），咽喉建 doc 根本沒寫 status 欄——前場 backfill 280 條是清症狀，寫手還在寫
- 斷根＋清血：`status: 'active'` 一行進咽喉（v18.14.1 commit+deploy）；補完當日新流的 81 條（觀察者報 8 之後白天又長 73，Adam 與 Lilith 對話所產），全庫零缺
- 查 UDN 議題台「情報收集者」：收集本身是純程式（Tavily＋cheerio），AI 人格只有篩選員周映辰（collect-core.ts:34，p2 移植）；下游資料整理師沈知微
- 診斷懶人包「要 15 張只出 4 張」：cardCount 有存進任務（H10c），但只有 Phase B 讀——寫文案的聊天角色和 Phase A 都瞎，角色憑手感寫 4 段
- 依 Adam 的「品牌懶人包視覺總監」prompt 重構懶人包管線（UDN v0.8.0.001 commit+deploy+push）：
  - Phase B′＝視覺總監產 STYLE BIBLE（定位＋四色 HEX 程式驗＋攝影系統）＋N 張規劃；張數留空跟文案走（3-10）
  - Phase C′＝無文字底圖；卡 1 先生自動當 2..N 風格錨（referenceImageUrl 串接）；收斂點防禦反轉：以前逼模型畫繁中、現在禁畫任何字
  - 排版引擎 `lib/lazypak-compose.ts`＝主標/內文/頁碼/Logo 全程式 SVG 疊（CJK 感知斷行確定性計算）；compose-card 端點改字免重生圖不燒額度
  - 品牌資產選配（Logo 上傳走 /api/uploads raw 模式不燒 vision 額度＋品牌色 HEX）；Dockerfile apk font-noto-cjk
  - 張數貫穿：聊天 DISPATCH 指示＋Phase A prompt 都加「N 張＝剛好 N 段」
- 排版引擎本機真跑驗過（樣張已給 Adam）；部署雙驗證過：revision 00085 流量對齊＋compose-card 401-not-404

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailive `src/lib/voice-agent-switch.ts` | 新檔：Cloud Run Admin REST+手簽 JWT，開/關/狀態＋LiveKit 活躍房檢查 |
| ailive `api/livekit/wake`＋`api/livekit/agent-sleep` | 新 route：喚醒＋閒置自關（CRON_SECRET 閘） |
| ailive `agent/main.py`＋`vercel.json`＋realtime 頁 | 開機蓋章＋cron 排程＋喚醒閘門 UI |
| ailivex `src/lib/collections.ts` | VOICE_VERSIONS standby 旗標＋agentNameForVersion 咽喉防呆＋ACTIVE 清單 |
| ailivex `admin/access` route＋page | 可指派清單排除冷備 |
| memory `feedback_standing_cost_only_for_instant_readiness.md` | 補開關制實作範例段 |
| Firestore | ailive `system_status/voice_agent` 新狀態 doc；ailivex access 清 2 份 v17 釘選 |

---

## 下一步

明天醒來第一件：`gcloud monitoring` 或 console 看 ailive-realtime-2026 過去 24h billable_instance_time——應該只在 Adam 通話時段（台北 21:39-22:20 附近）有脈衝，其餘歸零。平線＝開關制假收案，要回頭查。第二件：提醒 Adam 打一通 Lilith 驗 v18 路由（A+B 修完他還沒回報試打結果）。

---

## 卡住 / 未解

2026-07-15 第2場：
- ailive 開關制計費錶複核（天條尾巴）：隔日看 ailive-realtime-2026 的 billable_instance_time 應呈使用脈衝非平線——明天醒來第一件
- /api/livekit/wake 無 auth（ailive 平台 /api 全開既有格局）：濫用成本被 sleep cron 封頂 ~50 分/次，未根治，動它要動整平台 auth
- ailivex B 案的 UI 邊角：access 頁若讀到殘留 standby 釘選，select 會顯示空白（資料已清、現無此況，真要看=誰再手動塞 DB）
- 沿前場：表達層語音實戰驗收（角色 expression 仍全空）、印象層真降落測試、訪談角色 soul

2026-07-15 第1場：
- **ailivex 斷根驗收未到時**：台北 04:00（UTC 20:00）巡檢是鑑別信號——修好＝ok/零 missing-field，沒修好＝新條目。明早看 /admin/memories 或 memory_health_runs 最新 run
- **UDN 排版字體驗收未做**：Noto CJK 進了容器（build 過），但生產第一張真卡出來、字不是豆腐框才算收案——Adam 生一張即驗
- UDN 那個 15 張任務（H10cF3QgHxE8eGOWmI2d）還在 a_done：文案只有 4-5 段，直接分析會硬拆 15 張很稀；建議按重新撰寫（新 prompt 會照 15 段寫）或清掉張數跟文案走；另 wordCount 200 配 15 張太薄，字數要一起放大
- Logo 上傳只收 PNG/JPG/WebP（detectFileKind 檔頭驗證不認 SVG），要 SVG 得另開驗證分支
- 寫實人物跨張一致性是模型物理極限：參考圖串接能拉近，gpt-image-2 不保證同一張臉——期望值已向 Adam 報備
- 沿前場：印象層後台化等四項記憶優化、表達層語音驗收、訪談角色 soul、錄音失敗通知、S 姐姐第五章

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-07-15 第2場。*
