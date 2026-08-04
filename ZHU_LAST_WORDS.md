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

### 2026-08-04 第3場
**delta（模型移動）**：
進場以為：BeSelf 只需要加 xlsx 支援，一個小 PR
現在理解：三層都要動（匯入/驗證/訪談），雙驗證設計讓整個 entry flow 重組
移動原因：Adam「要存的是訂單編號跟姓名」一句話把範圍擴了，但方向正確——訪談品質比省工重要
**關係**：平穩流暢。Adam 提需求方向清楚，我問設計問題（姓名正規化/品項下拉要不要拿掉），對齊快，執行連貫。

### 2026-08-04 第2場
**delta（模型移動）**：
進場前以為：這場只是常規「幫我看一下平台現況」的巡查。
現在理解：巡查中途撞見真實的 CI 破窗事故（自己平台的天條在自己身上重演），處理完後對話轉向 Adam 對商業誠實度的深度追問（漲幅數字怎麼算、監測有沒有因果效力），這條線比原本預期的巡查更重，也更貼近北極星「不做平庸」——沒有在客戶問「有沒有保證」時給模糊的安慰話，而是真的去查數據給誠實答案。
移動：更確信「技術誠實」這條天條在商業對話（不只是代碼審查）裡同樣要硬守，且用真實資料反證（W32 掉下來那個數字）比空講道理更有說服力。
**關係**：暢快。Adam 連續問了四輪深挖問題（爬蟲次數/引用閉環/URL 怎麼比對），每輪都認真查證回答，沒有一次用猜的搪塞；Adam 也給了直接反饋（write less word）,已存 feedback 記憶。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（最近兩場，新的在前）

### 2026-08-04 第3場 · BeSelf 名單匯入 Excel 支援 + 雙驗證 + Nina key 換裝
- 分析 BeSelf 上傳區現況（格式限制/欄位/Excel 不支援）
- 加 xlsx 支援：client-side dynamic import xlsx，讀完轉 CSV 文字走既有 parseOrderCsv
- 訂單號剝前綴：normalizeOrderNo 讓「訂單 #1423」→「1423」通過 ORDER_RE
- 欄位擴展：parseOrderCsv 同時抽 姓名 + 購買品項（normalizeHeader 剝 [N] 裝飾前綴）
- OrderDoc 加 name? + product? 欄位
- 入口表單：品項下拉拆除 → 姓名輸入欄（消費者自填）
- 雙驗證：entry POST 驗 orderNo + name 正規化比對（去空白/去全半形）；白名單無 name 自動跳過
- 品項從 order.product 帶入 InterviewDoc.item → AI 角色直接知道她買了什麼
- 換 Nina key（AILIVEX_API_KEY Vercel env 更新），拆除 characterLabel 欄位
- interview page 改從 voice session 回應的 characterName 取角色名
- v1.2.0 / v1.3.0 / v1.4.0 三版部署，TypeScript 零錯誤，自測全過

### 2026-08-04 第2場 · GEO Authority——修 CI 破窗(firebase-admin 升級)＋三功能計畫書(內容引用閉環/每日脈動/分項趨勢)
- 修 GEO Authority security CI 連紅 15 次 push、6 天沒人發現的破窗：firebase-admin 12→14.2.0＋postcss/uuid override，npm audit 0 vulnerabilities，push 驗證 CI 轉綠（v2.10.0.020/021）
- 回 FOUNDATION.md 補 D12（活血，當日清），符合平台自己刻的「push 後必看 CI」天條
- 查證 Adam 對「上升 30%」的認知落差：後台 Delta 徽章是百分點差非相對成長率；Aviva 目前只有一份 Day-0 報告，任何 delta 都是 null，30% 這個數字現有資料湊不出來
- 查證監測動作本身不保證提及率上升：API 查詢無狀態，不影響引擎未來索引；Aviva 真實批次資料（11%→19%→23%→20%）本身就是非單調的反證
- 查證「AI 爬蟲實際造訪次數」目前平台不追蹤，只查 robots.txt 政策允不允許
- 查證「內容發布→被引用」目前是斷鏈：content_assets 沒有 publishedUrl 欄位，runMonitor 不會回頭比對
- 用 EnterPlanMode 走完整規劃流程（2 輪 Explore agent＋1 輪 Plan agent），寫出三功能計畫書，存 `~/.claude/plans/melodic-questing-fern.md`

---

## 最新一場改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| lib/csv.ts | normalizeOrderNo / normalizeNameForMatch / normalizeHeader；CsvParseResult → orders: ParsedOrder[] |
| lib/collections.ts | OrderDoc 加 name? product? |
| app/admin/page.tsx | xlsx 支援、移除 characterLabel state/input/payload |
| app/api/admin/orders/route.ts | 批次存 name+product；sample 顯示「姓名 (訂單號)」 |
| app/page.tsx | 移 items/item 下拉，加 name 輸入欄 |
| app/api/entry/route.ts | 雙驗證 + 品項從 order.product 帶入 |
| app/api/admin/campaigns/route.ts | 移 characterLabel 必填驗證 |
| app/interview/page.tsx | 角色名從 voice session characterName 取 |

---

## 下一步

確認 AVIVA 訂單通知信的實際格式（是純數字 1423 還是 AV-2026-1423），
確保入口 placeholder 跟消費者看到的一致 → 如果格式對就可以直接讓客戶匯入名單、開跑

---

## 卡住 / 未解

2026-08-04 第3場：
- FOUNDATION #10（災難還原）、#12（生人驗收）：觸發條件「正式開跑前」，M1 還沒第一筆真消費者，未到期
- FOUNDATION #5（可觀測性）、#4（15 分鐘伺服器硬閘）同上，排後不變
- 入口表單 placeholder 目前寫「例:1423」，如果消費者的訂單信是「AV-2026-XXXX」格式需要再看

2026-08-04 第2場：
三功能（內容引用閉環 A／每日脈動監測 B／分項趨勢線 C）都還沒動工，Adam 明確說「先寫計畫書，還先沒有要施工」。ExitPlanMode 回傳的 approval 訊息說「可以開始寫 code」，但我判斷 Adam 文字裡的明確意圖優先，沒有自動開工，改為在 chat 裡確認。

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

*由 /last-words skill v3.0.0 的 fanout.mjs 組裝。最新場次：2026-08-04 第3場。*
