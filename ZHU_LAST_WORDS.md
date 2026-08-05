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

### 2026-08-05 第5場
**delta（模型移動）**：
- 進場前以為：語音記憶問題會是檢索或 prompt 層的 bug
- 現在理解：**最不能丟的真相不能只活在進程記憶體**——「掛斷才寫回」把逐字稿壓在進程壽命上，第三方抖動只是導火線。這是 fire-and-forget 天條的姊妹形：不是「請求結束 CPU 被掐」，而是「進程暴斃狀態蒸發」。判準同款：這份資料如果進程現在死掉，還在嗎？
- 另一移動：**「deploy 保留未指定設定」不可信**——gcloud run deploy 洗掉了 min-instances，與文件認知相反。設定面的「應該會保留」要當謠言驗，部署後核現值
**關係**：暢快。Adam 給了乾淨的節奏：先看現場不動手→問第三方責任歸屬→GO→配合測試通話→commit＋列入追蹤，每步授權明確。他問「哪個第三方不穩」時我能拿出分表的責任歸屬（LiveKit＋Anthropic 抖、MiniMax 清白），這種可答性是 log 考古換來的。

### 2026-08-05 第4場
**delta（模型移動）**：
進場以為：只是套 UI，一兩小時
現在理解：訪談流程有五條暗線（聲波/選禮物/掛斷時機/逐字稿時序/量表觸發）全部要通
移動原因：Adam 一路測，每條暗線都找出問題，逐一擊破
**關係**：高效流暢。Adam 測得很仔細，每個問題都有根因，沒有模糊回報。88 的時候感覺完成度高。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-05 第5場 · A.Two 股東會入庫＋語音「暴斃失憶」根治（逐字稿增量寫回四線上線）
- 入庫 A.Two 股東會知識 5 份＋方法論 1 套（股東會完整籌備流程 7 步，全公開），驗證三題全過——用剛升級的 STEP 1b SOP，角色本人唯讀分類，開場先查 characters DB 認人（上場的違規本場改對）
- 查明 A.Two 語音「跳掉＋失憶」根因：逐字稿只在 finalize 一次性寫入，8/5 連線抖動（LiveKit＋Anthropic 同窗、MiniMax 清白）→ agent 進程 Uncaught signal 10 兩連崩 → 沒走收尾 → 整場蒸發；8/1 同型（無聲死亡）。8/5 的章程草案 doc 走獨立管線活著
- 修法上線四條線：ailivex v19/v20/v21（共用 firestore_loader 新增 flush/clear/recover_live_session 三函數＋各線四處接線）＋ ailive 主平台（staging doc live=True 快照，恢復同步走本地 save_conversation 零競態）。通話中 liveSession 快照節流覆寫（2 則＋15s、冪等、不佔 turn path）；開場災難恢復併回主記憶＋誠實斷線提示；finalize 成功才清快照
- 活體驗證全鏈過：Adam 真實通話 A.Two，快照 2→23 則滾動、掛斷併入 26 則＋清除——只有修好才會出現的信號
- 兩 repo commit+push（ailivex v21.4/v21.4.1、ailive 同款）；FOUNDATION 記債 D9；本機 e2e 測試（快照冪等/暴斃恢復/二次恢復歸零/clear）先過才部署

### 2026-08-05 第4場 · BeSelf 全站 UI/UX 套版＋訪談流程打通（v2.0.0→v2.0.8）
- 全站重設計：Logo/Order/Loading/Dialing/Call/Gift/Ended 七屏，毛玻璃卡片＋浮動 blob 背景
- Google Fonts next/font/google 引入（Cormorant Garamond + Work Sans）
- Loading 60s→系統 ready 立刻跳（gridRef 快轉）
- 聲波三色：AI 藍/#8FAEDD、用戶粉/#E39EC0、思考中灰紫/#b8aec9；麥克風 AnalyserNode 接入
- 「思考中…」dots 動畫：用戶說完 AI 還沒開口的靜默期顯示
- 禮物格子：1.5px 邊框/選中藍框 #4db6f7 + ✓；click-to-select 備援；gridRef 修 mapChoiceToGift 對映
- v21 加 hang_up 工具：道別完再掛，不直接中斷
- 繁體禮物標題固定（不用 agent 送的可能簡體）
- 訂單重置測試（used→unused + 刪 interview doc）
- 訂單/訪談真刪除：delete/delete-iv 兩個新 action
- 活動列表加刪除按鈕（prompt 輸入 ID 確認）
- complete 路由三次漸進重試（T+35s/65s/95s）自動補拉 transcript
- admin 訪談 tab「補拉量表」按鈕（transcriptLines=0 的 done 訪談也可觸發）
- ailiveX v21.1/v21.2/v21.3：finalize 跳過記憶/lastSession、hang_up 工具、record_choice 先道別、逐字稿 opencc s2twp

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailivex-platform/agent/firestore_loader.py | 新增 flush_live_session/clear_live_session/recover_live_session |
| ailivex-platform/agent/realtime_agent_v19/20/21.py | import＋開場恢復＋節流快照＋finalize 清快照＋誠實斷線提示（各 49 行） |
| ailivex-platform/FOUNDATION.md | D9 記債＋變動記錄 |
| ailive-platform/agent/realtime_agent.py | staging doc live=True 快照＋開場同步恢復（54 行） |
| zhu-core/docs/WORKLOG.md | 本場兩段（診斷＋收案補記） |
| memory/project_ailivex_platform.md | 2026-08-05 段 |

---

## 下一步

下次動 ailivex agent 部署時先清 D9：部署前後各記一次 `gcloud run services describe ailivex-realtime-agent-vN --format="value(spec.template.metadata.annotations['autoscaling.knative.dev/minScale'])"` 對照；查明 gcloud run deploy 重置 min 的機制，根治＝cloudbuild 加 min 恢復步驟或 deploy 後自動核。為什麼先做：活血級，不查每次部署都聾一次。

---

## 卡住 / 未解

2026-08-05 第5場：
- **D9（活血，FOUNDATION 已記）**：cloudbuild deploy 把 min-instances 1→0（與 yaml 註解「不帶旗標＝保留現值」不符）——本日實錄，已手動恢復三線 min=1，但**根因未查明，每次部署 agent 都可能重演**。過去每次部署後語音線可能都短暫聾過
- signal 10 崩潰的具體 crash path 未查（增量寫回上線後降級為小顛簸，Adam 同意放後面）
- ailive 主平台線的恢復路徑只救對話連續性，暴斃場次的記憶/insights 提煉視為戰損（設計取捨，已寫進 code 註解）
- manman 通話功能仍等 waitin 分支；開工時把增量寫回直接蓋進地基

2026-08-05 第4場：
- FOUNDATION #10（災難還原）、#12（生人驗收）：觸發條件「正式開跑前」，M1 還沒第一筆真消費者，未到期
- v21.3 逐字稿 opencc 效果待真實訪談確認（Agent 說簡體比例未知）
- 「回收中…」問題的根治：agent finalize 時序問題，三次重試是緩解，根治是 agent POST callback 通知 BeSelf（排後）

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-05 第5場。*
