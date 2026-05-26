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

## 最新完成（2026-05-26）

- 清除所有 Firestore 測試資料（`scripts/clear-all-issues.mjs`，10 個 collection）
- 重寫 dashboard UI/UX（Steve Jobs 視角：狀態驅動版面、3 語義色、Action Zone 不可錯過）
- 重寫 artifacts timeline（40px 圓形徽章、中文 initials、決策 pill 顏色語義）
- 新增 `article-write` worker：單篇直寫 MVP，bypasses alignment/section/QA/stitch
- 補齊 TypeScript 型別登記（NodeType / ArtifactWorkerType / NODE_SPECS / CONTRACTS），0 errors

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `app/dashboard/page.tsx` | 重寫：stats 卡頂色帶、issue 左色帶卡片、緊急徽章 nav |
| `app/dashboard/[issueId]/page.tsx` | 重寫：PipelineBar 分段塊、Action Zone、Hero Card |
| `app/dashboard/[issueId]/artifacts/page.tsx` | 重寫：timeline 圓形徽章、中文 initials |
| `app/api/workers/article-write/route.ts` | NEW：單篇直寫 worker |
| `app/api/workers/orchestrate/route.ts` | blueprint_done 分岔 singleWriteMode |
| `app/api/editorial-jobs/route.ts` | 接受 singleWriteMode 參數 |
| `lib/firestore/types.ts` | 補 article_write ArtifactWorkerType |
| `lib/workflow/manifest.ts` | 補 article_write NodeType + NODE_SPECS |
| `lib/workflow/contracts.ts` | 補 article_write 合約 |
| `scripts/clear-all-issues.mjs` | NEW：清空所有 issue 資料腳本 |

---

## 下一步

**第一件**：部署 anews-platform
```bash
cd ~/.ailive/anews-platform
git add -A
git commit -m "v1.12.0.001 — 新增：單篇直寫 MVP + Dashboard UI/UX 全面升級"
npx vercel --prod --yes
```

**第二件**：測試 singleWriteMode
- 開 https://anews-platform.vercel.app/dashboard
- 勾「單篇直寫模式」+ 「小規模模式」建新 issue
- 等 article-write worker 跑完，看 artifacts timeline 確認輸出質量

---

## 卡住 / 未解

- `anews-platform` 有 10 個改過的檔案 + 2 個新增 → **未 commit、未部署**
- singleWriteMode 流程未實測（handler 理論正確，未跑過）
- main article 12000 字超出 max_tokens:8192 → 需 extended output beta（後評估）
- IMAGE_DRY_RUN 只在 `.env.local`，Vercel prod 沒設 → Cloud Tasks 無法自動 fire image workers
- GCP Cloud Scheduler 60s workflow-reconcile 未設定

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
| ANEWS 平台 | `~/.ailive/anews-platform/`（Next.js, Vercel） |
| ANEWS dashboard | https://anews-platform.vercel.app/dashboard |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-26 · 築*
