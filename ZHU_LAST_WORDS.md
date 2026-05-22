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

## 最新完成（2026-05-22c）

- 建文章平台前台三頁面（首頁 / 期號頁 / 文章閱讀頁），前衛雜誌設計 + RWD
- 全站設計重寫：editorial red accent + 黑色 masthead + Claude design 後台
- 後台加刪除功能（cascade DELETE）+ 一期鎖（API 層）+ 校對入口
- Dashboard 大白話改版：大白話狀態 + Pipeline 進度條 + 段落色塊
- Kick endpoint：自動偵測卡死段落，打對應事件重啟 pipeline
- 全站角色設定頁（/dashboard/settings）：四個 role prompt 存 Firestore，workers 讀取

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `anews-platform/app/page.tsx` | 小抱報首頁，前衛雜誌設計 |
| `anews-platform/app/issues/[issueId]/page.tsx` | 期號頁 |
| `anews-platform/app/articles/[articleId]/page.tsx` | 文章閱讀頁 + 進度條 |
| `anews-platform/app/dashboard/page.tsx` | 編輯台總覽，stats + 一期鎖 + 刪除 |
| `anews-platform/app/dashboard/[issueId]/page.tsx` | 大白話 + Pipeline bar + Kick 按鈕 |
| `anews-platform/app/dashboard/settings/page.tsx` | 四角色 prompt 設定頁（新建） |
| `anews-platform/app/api/editorial-jobs/[issueId]/approve/route.ts` | T9 核准 endpoint（新建） |
| `anews-platform/app/api/editorial-jobs/[issueId]/kick/route.ts` | Kick 重啟 endpoint（新建） |
| `anews-platform/app/api/editorial-jobs/[issueId]/route.ts` | 加 DELETE cascade |
| `anews-platform/app/api/editorial-jobs/route.ts` | POST 加一期鎖 |
| `anews-platform/app/api/settings/roles/route.ts` | GET/PUT role prompt（新建） |
| `anews-platform/lib/settings/rolePrompts.ts` | Firestore prompt helper，TTL cache（新建） |
| `anews-platform/app/globals.css` | 設計 token 系統 |
| `anews-platform/app/api/articles/[articleId]/route.ts` | 文章內容 API（新建） |
| 4 個 workers | 改讀 Firestore role prompt |

---

## 下一步

**第一件：測試 Kick 能否重啟卡住的 pipeline**

1. 開 https://anews-platform.vercel.app/dashboard/F9u8lHZCief2bTN6ztAO
2. 按「▶ 繼續生成」
3. 確認 kickResult 有輸出（sec# draft_ready→QA 等）
4. 等 10 秒，確認段落狀態從 planned 往前推進

**Kick 成功後接著做：**
- 調 section-qa 嚴格度：`anews-platform/app/api/workers/section-qa/route.ts`，word_count 改 60%，移除 no_unsupported_claims
- 決定圖片生成方向（Gemini image gen vs 繼續用 SVG）

---

## 卡住 / 未解

- **AI 下的設計思考**（F9u8lHZCief2bTN6ztAO）：pipeline 卡死，kick endpoint 已建，未實測
- **QA 過嚴**：word_count 80% + no_unsupported_claims 造成 ~50% 段落 blocked
- **stitch URL 換行**：export 有防護但根源在 stitch worker
- **圖片生成**：SVG placeholder，真實圖片方向未決

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
| ANEWS 後台 | https://anews-platform.vercel.app/dashboard |
| 角色設定 | https://anews-platform.vercel.app/dashboard/settings |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-22c · 築*
