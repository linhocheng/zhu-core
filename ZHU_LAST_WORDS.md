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

## 最新完成（2026-06-22 第十五 session）

- 品牌素材庫 Phase 3：故事板 UI — Layout 下拉選單 + 產品圖 picker modal（3 個新 API routes + stories/[id]/page.tsx 大改）
- 品牌素材庫 Phase 4+5：media-worker 支援 referenceImageUrls → /v1/images/edits，generate-images route 整合
- 端到端驗證：UDN logo（聯合新聞網）+ 張立 character → 生圖成功，logo 精準出現左上角
- media-worker Cloud Build deploy 完成（tag: phase4-brand）
- ailivex-platform Vercel deploy 兩次（Phase 3 + Phase 4）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/api/brands/[characterId]/layouts/route.ts` | 新建 — 用戶端 GET layouts，hasAccess 守門 |
| `ailivex-platform/src/app/api/brands/[characterId]/products/route.ts` | 新建 — 用戶端 GET products |
| `ailivex-platform/src/app/api/brands/[characterId]/upload/route.ts` | 新建 — POST binary → GCS temp 路徑 |
| `ailivex-platform/src/app/api/stories/[id]/route.ts` | GET 加 brandLayoutId + cards.productImageUrl；PATCH 加 brandLayoutId |
| `ailivex-platform/src/app/api/tasks/[id]/route.ts` | PATCH 加 productImageUrl（null = 清空） |
| `ailivex-platform/src/app/api/tasks/[id]/generate-images/route.ts` | 讀 brandLayoutId→layoutUrl + card.productImageUrl，組 referenceImageUrls 傳給 media-worker |
| `ailivex-platform/src/app/stories/[id]/page.tsx` | 品牌設定區塊 + 產品圖 picker modal + CardRow 改動 |
| `media-worker/src/providers/types.ts` | ImageInput 加 referenceImageUrls?: string[] |
| `media-worker/src/providers/openai-image.ts` | refs 非空時走 /v1/images/edits FormData multipart |
| `media-worker/src/handlers/worker.ts` | 傳遞 referenceImageUrls 給 imageInput |

---

## 下一步（接棒直接動）

**主線：品牌素材庫 Phase 6 — 正式 end-to-end 測試，前必修 bug**

**必修：admin brand-layouts/products route 的 makePublic() 要移除**

1. 移除 `makePublic()` 的 route：
   - `src/app/api/admin/characters/[id]/brand-layouts/route.ts`（POST 裡的 `await file.makePublic()`）
   - `src/app/api/admin/characters/[id]/brand-products/route.ts`（同樣）
   - `src/app/api/brands/[characterId]/upload/route.ts`（同樣）
   - 理由：ailivex-2026-assets bucket 是 uniform bucket-level access，allUsers objectViewer 已在 IAM 設定，物件自動公開，不需要 makePublic()，呼叫會爆 400

2. 修完 deploy Vercel

3. Phase 6 測試：在後台「品牌素材」頁上傳一張 Layout → 故事板選它 → 「生成圖卡」→ 驗圖有品牌感

---

## 卡住 / 未解

- admin brand routes 的 `makePublic()` bug（uniform bucket-level access）→ 會導致後台上傳 brand asset 500
- Phase 6 正式 end-to-end 從 UI 到生圖還沒跑過（media-worker 部分已驗，API 部分已驗，UI→API 鏈路待驗）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 品牌素材庫計畫書 | `~/.ailive/ailivex-platform/docs/PLAN_brand_asset_library.md` |
| ailiveX 平台 | `~/.ailive/ailivex-platform/` |
| media-worker | `~/.ailive/media-worker/` |
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*2026-06-22 · 第十五 session · 品牌素材庫 Phase 3-5 全通 + UDN 生圖驗證 · 築*
