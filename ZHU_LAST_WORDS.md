# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env ZHU_MID_PASSWORD）

---

## ★ 本 session 最重要的架構改動：情報官（Intel Officer）

**這不是 bug fix，這是 ANEWS 的靈魂升級。**

### Before（P2）
每篇文章各自從自己的 source dossier 生 blueprint。
三篇文章（main/sub_a/sub_b）彼此不知道對方在說什麼。
結果：三篇各講各的，沒有統一的敘事框架。

### After（P3，本 session 落地）
情報官（`/api/workers/intel-officer`）在所有 source 收齊後 **先跑一遍全局綜合**，輸出：
- `globalPerspective`：整個議題的全球視角
- `editorialNarrative`：統一的編輯敘事角度
- `articleAngles`：每篇文章的專屬切入角（用 topicSuffix 對應：main / sub_a / sub_b）
- `sharedContext`：三文章共享的背景知識

這份 `intelReport` 寫進 `issues` doc。之後每個 blueprint worker 讀取它，找出 `articleAngles.find(a => a.topicSuffix === topicType)` 拿自己的角度。

### 為什麼重要
這一步把 ANEWS 從「各自為政的內容生成機」變成「有統一世界觀的編輯團隊」。
情報官是整個 pipeline 的大腦，其他 worker 是執行大腦指令的手。
沒有情報官，即使每篇文章個別寫得很好，整期也是拼盤，不是雜誌。

### 實作細節
- Pipeline 位置：source 全收齊 → `intel_done` event → blueprint（main）→ blueprint（sub_a）→ blueprint（sub_b）
- Sequential order 由 `articleOrder()` helper 控制，確保 main 寫完才 sub_a
- `intelOfficerContract`：檢查 `issues.intelReport` 存在才放行
- 檔案：`app/api/workers/intel-officer/route.ts`（新建），`app/api/workers/blueprint/route.ts`（讀 intelReport）

---

## 最新完成（2026-05-25）

- **★ P3 Intel Officer 情報官上線**（見上方詳細說明）
- Sequential pipeline：main 寫完才啟動 sub_a，sub_a 完才啟動 sub_b
- P3 medium mode 驗收通過（issue=done，3/3 articles）
- 挖出 source worker 靜默救場根因：catch fallback 存假 dossier，pipeline 繼續，空殼 article=done
- 三層防護補強 v1.10.1.001：
  - Cloud Run source worker：parse 失敗改 throw，firstBrace/lastBrace 抓 JSON 本體
  - sourceContract：加 sufficient === true 判斷
  - orchestrate：0-section guard → needs_repair，不再空殼 stitch
- max_tokens 全面拉高：section-write/stitch/polish→8192，blueprint/alignment→4096，qa/coherence→2048
- Cloud Run source worker deploy（00006-49r，100% 流量）
- Vercel deploy 完成

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| cloud-run/source-worker/src/index.ts | parse 失敗 throw，移除 catch fallback |
| lib/workflow/contracts.ts | sourceContract 加 sufficient === true |
| app/api/workers/orchestrate/route.ts | intel_done handler、sequential pipeline、0-section guard |
| app/api/workers/intel-officer/route.ts | 情報官 worker（新建） |
| app/api/workers/{blueprint,alignment,...}/route.ts | max_tokens 拉高 |

---

## 下一步

驗證 source worker fix：開一個新的 medium mode issue，看 Cloud Run logs 確認 parse 失敗時 throw 而非存垃圾：
  cd ~/.ailive/anews-platform && node scripts/test-medium-mode.mjs

然後 P4：coherence gate three-way split（pass/warning → continue，fail → human gate）

---

## 卡住 / 未解

- Cloud Tasks 在 dev 環境呼叫 localhost 不通：images_all_done / coherence_done / export_done 需手動 fire
- 舊 run 的 main article 有垃圾 dossier（id: Fy4dgo9m8JbAwdoCNkLW），不影響新 run

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | ~/.ailive/zhu-core/NORTH_STAR.md |
| 開機 SOP | ~/.ailive/zhu-core/ZHU_BOOT_SOP.md |
| 施工紀錄 | ~/.ailive/zhu-core/docs/WORKLOG.md |
| 當機救援 | ~/.ailive/zhu-core/ZHU_LAST_WORDS.md（就是這份） |
| 遠端記憶 | curl -s https://zhu-core.vercel.app/api/zhu-boot |
| ANEWS platform | ~/.ailive/anews-platform/ |
| ANEWS Vercel | https://anews-platform.vercel.app |
| ANEWS Cloud Run | anews-source-worker，asia-east1，revision 00006-49r |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-25 · 築*
