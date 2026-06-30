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

## 最新完成（2026-07-01）

- 懶人包 `bodyText`（3-5 句內文）全流程：Phase B 生成、卡片顯示、編輯儲存
- 圖片風格選擇器（真實照片/資訊圖表/插畫圖文/AI決定）接線到 Phase B IMAGE_STYLE_PROMPTS
- 對話角色選擇器（懶人包可獨立選角色，不綁對話角色）
- Phase B done 後文案保留（唯讀顯示在圖卡格網上方）
- 刪除不跳 confirm 警告視窗（移除 4 處 window.confirm）
- 有版型圖 → `/v1/images/edits`（layout.imageUrl 當 image[] 參數）；無版型 → /generations
- layouts POST API + createLayout 補 imageSize 欄位
- 現有 UDN標準版型 Firestore doc 手補 imageSize: "1024x1024"
- 部署至 Cloud Run：00041 → 00042 → 00043

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `platform/app/projects/[id]/assets/AssetsClient.tsx` | bodyText 顯示/編輯、b_done 保留文案、刪除不跳 confirm、角色選擇器、圖片風格 UI |
| `platform/app/api/tasks/[id]/generate-card-image/route.ts` | 有版型走 edits、無版型走 generations |
| `platform/app/api/tasks/[id]/analyze-cards/route.ts` | Phase B 生成 bodyText + IMAGE_STYLE_PROMPTS |
| `platform/lib/firestore.ts` | createLayout 接 imageSize |
| `platform/app/api/layouts/route.ts` | POST 接 imageSize |
| `platform/lib/types.ts` | LazypakCard 加 bodyText、LazypakImageStyle type |

---

## 下一步

1. **讓 Adam 試生 Card 2/3**，確認 `/v1/images/edits` 版型參考效果是否符合預期
2. **評估 Phase A UX**：同步等待 30–90 秒讓 Adam 感覺「卡住」→ 考慮 fire-and-forget + 前端輪詢

主戰場：`~/Documents/UDN NEWS/platform/`
Git remote：`https://github.com/linhocheng/udnnews-platform`
Cloud Run：`udnnews-platform`，`asia-east1`，project `udnnews`

---

## 卡住 / 未解

- `/v1/images/edits` 版型參考效果待實際驗證（Card 1 是舊版生成的，Card 2/3 還沒試）
- Phase A 同步等待 UX 反饋不夠（spinner/progress 待評估）

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

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-01 · 築*
