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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（跑 `claude-bridge` systemd）
  - bridge-direct：`https://bridge-direct.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **ailive 平台**：`~/.ailive/ailive-platform/`（Next.js），prod https://ailive-platform.vercel.app
- **MACS 平台**：`~/.ailive/macs-platform/`，prod https://macs-platform.vercel.app，git remote github.com/linhocheng/macs-platform
- **MACS 研究 worker（Cloud Run）**：`macs-research-worker` · asia-east1 · project `zhu-cloud-2026`

---

## 最新完成（2026-06-07）

- **MACS export 崩潰根治（v0.11.3.005 上線）**：
  - 根因①：LLM 把宣告為 string 的欄位（keyFindings）回成 `{finding,...}` 物件 → 流進 render 層 esc() 被 `.replace()` 呼叫炸（"e.replace is not a function"）。**根治 = 釘最窄收斂點**：`esc(s: string)` → `esc(s: unknown)`，在唯一消費端確定性 coerce。一個 commit 守 Mode 1/2/3。
  - 根因②（最隱蔽）：我自己丟在 scripts/ 的診斷腳本有 TS error，從 v0.11.3.001 起每次 Vercel build 靜默失敗，prod 跑舊 code（沒快路徑）才一直 300s timeout。修：tsconfig exclude 加 "scripts"（v0.11.3.004）。
  - 用相同概念查 Mode 2/3：hybrid/report.ts + creative-lead/report.ts 確認有同類 vulnerability，但全走 esc() → 已被 esc() 收斂修一次蓋掉。
  - case-mq3rw8r2-2b29ic 已到 done，exports doc 存在。
  - LESSONS_2026-06-07 加 L4（收斂點打法）+ L5（診斷腳本無聲炸 build）。

### 同日稍早
- MACS Mode 1 管線重構 v0.11.3.001（Victoria/Marcus 中途 worker + issue-tree 雙階段）
- ailiveX walking skeleton Phase 0-7 全通

---

## 今天改了哪些檔案（午後 session）

| 檔案 | 改了什麼 |
|---|---|
| `macs-platform/lib/report/renderHtml.ts` | esc() `(s: string)`→`(s: unknown)` + 確定性 coerce（收斂點根治三模式）v0.11.3.005 |
| `macs-platform/tsconfig.json` | exclude 加 "scripts"，診斷腳本永不破 prod build v0.11.3.004 |
| `macs-platform/lib/report/builder.ts` | flattenKeyFindings + preBuiltChapters fast path（前段 v0.11.3.003）|

---

## 下一步（接棒第一件能直接動手）

**Mode 2 / Mode 3 各跑一個真案到 done，開匯出報告驗 esc() 修在真實 LLM 輸出上不崩潰。**

1. 在 https://macs-platform.vercel.app 新建 Mode 2（hybrid）案件，跑到 done
2. 開匯出報告，確認不崩潰、設計一致
3. 同樣跑 Mode 3（creative_lead）
4. 監控：`cd ~/.ailive/macs-platform && npx tsx --env-file=.env.local scripts/_status.mts <caseId>`

**踩雷備忘**：MACS admin API 認證用 `ADMIN_PASSWORD="dm28224038"` 當 Bearer token。

---

## 卡住 / 未解

- Mode 2/3 esc() 修只做 build 綠 + 靜態分析，尚無真案 e2e 驗
- Mode 1 新管線（v0.11.3.001）整鏈也尚無乾淨真案跑過（但 export 段已驗到 done）
- Task #31 5C：章節改框架驅動（buildReport）尚未動
- Cloudflare API token 外洩待撤銷（延宕多 session）
- ailiveX 尚未 git init + push 到 GitHub

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| MACS 管線新結構 | `cloud-run/research-worker/src/index.ts`（handleStructureChapters / handleIntegrateChaptersPipeline）|
| MACS render 收斂點 | `lib/report/renderHtml.ts` 的 esc()——三模式所有動態值的唯一咽喉，防禦在這釘 |
| MACS worker harness | `macs-platform/lib/workers/harness.ts` |
| MACS 案件狀態查詢 | `macs-platform/scripts/_status.mts <caseId>` |
| MACS admin 認證 | Bearer `ADMIN_PASSWORD`（值 dm28224038），非 ADMIN_PW |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-07 · 築*
