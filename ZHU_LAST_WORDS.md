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

## 最新完成（2026-05-27c）

- Blueprint 覆蓋率約束：新增 `blueprint_constraints` Firestore 欄位，後台可編輯，worker 讀 settings 替換 `{sectionCount}`
- Role prompt 全面整頓：write_intro/body/conclusion 各自分化任務框架，blueprint 行動指令去掉「入場表演」改「直接輸出 JSON」，polish/alignment/stitch 加個性
- Image worker 換 gpt-image-2（OpenAI 最新），API 差異：`output_format` 非 `response_format`
- 新 issue「全球網紅行銷案例解析」(buhrX9l8W6J6hEedJAEr) 完整跑完，3 張圖已生成 GCS

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/api/workers/blueprint/route.ts` | 覆蓋率約束改讀 `prompts.blueprint_constraints` |
| `anews-platform/app/api/settings/roles/route.ts` | 新增 `blueprint_constraints` 欄位 |
| `anews-platform/lib/settings/rolePrompts.ts` | 加入 `blueprint_constraints` 快取 |
| `anews-platform/app/dashboard/settings/page.tsx` | UI 加「規劃師 — 指令約束」入口 |
| `anews-platform/app/api/workers/image/route.ts` | Gemini → gpt-image-2，mapToDalleSize，output_format |
| Firestore settings/roles（prod） | 六個角色 prompt 直接 PUT 更新 |

---

## 下一步

**接棒第一件事：設計「圖像策劃」worker**

現在 image_tasks.prompt 是 `${issue.title} ${keyTerm}`，太通用，生出來的圖和文章脫節。

需要在 polish 完成後、image worker 觸發前，插入策劃步驟：
1. 讀每個 article_section 的 `draftMarkdown`（節錄）+ `sectionGoal` + `articleTitle`
2. LLM 生成有上下文的 editorial photo prompt（英文，新聞攝影感）
3. 把 prompt 寫回 `image_tasks.prompt`
4. 再觸發 image worker 鏈

入口：`anews-platform/app/api/workers/image/route.ts` 的 `generateOpenAIImage` 已就緒，只差 prompt 品質。
策劃 worker 可以是新路由 `/api/workers/image-plan`，或整合進 orchestrator 的 `images_scheduled` 事件。

---

## 卡住 / 未解

- OPENAI_API_KEY 在對話中暴露過，Adam 說先用，下次換 key 前提醒
- anews-b-platform 兩 session 的改動還是 untracked（git 沒 commit）

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
| ANEWS 平台 | `~/.ailive/anews-platform/` → https://anews-platform.vercel.app |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-27c · 築*
