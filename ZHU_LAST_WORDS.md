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
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-06-05）

- 揭穿自己的假評估：上 session 宣布「沈牧三段靈魂注入成功」是錯的——live 走 single-write，好聲音其實是既有「刺客 Soul Evoker V4」prompt 寫的，我改的三段是孤兒路徑、沒跑。
- 把沈牧靈魂折成整篇單寫版，寫進真正會跑的 `settings/roles.article_write`（Firestore live + code DEFAULT 同步），取代刺客。
- 釐清沈牧＝後台「角色人格→長文寫手」，可編＝改 live。
- 三段寫手整條（section-write/section-qa/evidence-pass/alignment/stitch + write_intro/body/conclusion/qa）標記為技術債，選「標記不刪」，greppable marker `[停用-三段寫手路徑]` 釘兩處 + auto-memory。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/settings/roles/route.ts` | article_write DEFAULT 刺客→沈牧 |
| Firestore `settings/roles.article_write` | 同步推沈牧（Cloud Run 直讀，已驗 match） |
| `anews-platform/app/api/workers/orchestrate/route.ts` | blueprint_done 釘技術債 marker |
| `anews-platform/app/api/workers/section-write/route.ts` | 頂端釘 marker 指回 orchestrate |
| `memory/project_anews_platform.md` | 技術債清單加三段孤兒 + 沈牧位置 |

anews local commit：963eeef（021）、3a49185（022）、822a542（023），**均未推遠端**。

---

## 下一步

1. **Adam 開一篇新 ANEWS issue → 拉 `article_write` 真實輸出**，確認沈牧單寫版聲音/立場對不對。做法：`cd ~/.ailive/anews-platform`，臨時 .cjs 讀 `.env.local` 的 `FIREBASE_SERVICE_ACCOUNT_B64`，找最新 issue 的 articles（topicId endsWith `-main`），blueprint 用 `articleId`（不是 issueId！）查，全文在 GCS `gs://moumou-os.firebasestorage.app/articles/{articleId}/final.md`。
2. 評估是否替 single-write 補「內容複審閘門」——三段的 section-qa 是現成基礎（這就是當初標記不刪的理由）。
3. anews 三個今日 commit push 遠端 `github.com/linhocheng/anews-platform`（PRIVATE）災備。

---

## 卡住 / 未解

- single-write 無內容複審：polish 只產 metadata 不審內文，沈牧自律是唯一把關。
- 沈牧單寫版 prompt 已 live 但未開新 issue e2e 驗收。
- ANEWS pipeline 路徑寫死（single-write vs 三段）在 orchestrate 程式裡，後台無開關。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| ANEWS 沈牧/技術債 | `memory/project_anews_platform.md` + grep `[停用-三段寫手路徑]` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-05 · 築*
