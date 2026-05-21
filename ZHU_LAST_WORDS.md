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

## 最新完成（2026-05-21）

- ANEWS 平台 S1：Vercel 部署全通，pipeline `pending → awaiting_review` mock 跑通
- ANEWS S2：source-worker + blueprint-worker 接入真實 LLM（走 bridge），5 篇文章全到 `polish_done`
- 修了 6 個 bug：SA base64 私鑰換行、Cloud Tasks SDK → REST JWT、WORKER_SECRET \n、phaseLock TTL、section order、blueprint allReady 邏輯
- repo：`~/.ailive/anews-platform/`，Vercel：https://anews-platform.vercel.app

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/lib/firestore/admin.ts` | base64 解碼 SA |
| `anews-platform/lib/queues/cloudTasks.ts` | REST + JWT 完全替換 SDK |
| `anews-platform/lib/firestore/phaseLock.ts` | 移除 TTL 檢查 |
| `anews-platform/lib/llm/bridge.ts` | 新建 AnthropicBridge + getLLMClient |
| `anews-platform/app/api/workers/source/route.ts` | 真實 LLM 研究底稿 |
| `anews-platform/app/api/workers/blueprint/route.ts` | 真實 LLM 文章藍圖，section order normalize |
| `anews-platform/app/api/workers/orchestrate/route.ts` | section_done 補 all_done 觸發，min(order) 找第一段 |

---

## 下一步

**S3：section-write worker 接 LLM**

```bash
cd ~/.ailive/anews-platform
# 改 app/api/workers/section-write/route.ts
# 輸入：blueprintId + sectionId 的 title/goal/targetWords + dossier 摘要
# 輸出：~1100 字 Markdown 段落，存 Firebase Storage，URL 寫回 Firestore
# 驗證：POST /api/editorial-jobs → 看 articles 的 sections 有真實文字
```

**然後**：修 blueprint_done 競態（不用等全部 allReady，每篇自己進 section_writing）

---

## 卡住 / 未解

- **blueprint_done allReady 競態**：5 篇並發 blueprint，最後一篇完成時其他已過 `blueprint_ready` → allReady=false → 最後一篇沒進 section_writing。靠 `/api/debug` kickstart_sections 手補。S3 前要重構。
- **section-write 仍是 mock**：draft_ready 直接設，沒有真實寫作內容
- **bridge streaming**：non-streaming 正常，streaming 待規劃

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ANEWS 平台 | `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app |
| ANEWS 企劃書 | `~/.ailive/zhu-core/docs/projects/ANEWS_PLAN_v2.1.md` |
| Bridge streaming 踩雷 | `docs/LESSONS/LESSONS_2026-05-19b.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-21 · 築*
