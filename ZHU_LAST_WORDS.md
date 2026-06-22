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

## 最新完成（2026-06-22 第十四 session）

- 文件標題簡體修復：`createDocumentJob` 加 opencc-js cn→tw 轉換
- 語音頁 6 燈號移到左上角 header，去掉外框
- 品牌素材庫 Phase 1：collections.ts 新增 `BrandLayoutDoc`、`BrandProductDoc`、`COL.brandLayouts/brandProducts`、`TaskDoc.brandLayoutId/productImageUrl`
- 品牌素材庫 Phase 2：4 個 API routes（Layout CRUD + Product CRUD，含 GCS）+ 後台角色頁品牌素材 overlay

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/lib/documents.ts` | opencc-js cn→tw 轉換 title |
| `ailivex-platform/src/app/realtime-v14/[characterId]/page.tsx` | 6 燈號移 header 左側，去外框 |
| `ailivex-platform/src/lib/collections.ts` | 新增 BrandLayoutDoc、BrandProductDoc、COL 項目、TaskDoc 兩欄位 |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-layouts/route.ts` | 新建（GET/POST） |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-layouts/[layoutId]/route.ts` | 新建（PATCH/DELETE） |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-products/route.ts` | 新建（GET/POST） |
| `ailivex-platform/src/app/api/admin/characters/[id]/brand-products/[productId]/route.ts` | 新建（DELETE） |
| `ailivex-platform/src/app/admin/characters/page.tsx` | 品牌素材按鈕 + overlay CRUD |
| `ailivex-platform/docs/PLAN_brand_asset_library.md` | schema 更新（characterId）+ Phase 2 清單更新 |

---

## 下一步（接棒直接動）

**主線：品牌素材庫 Phase 3 — 故事板 UI**

1. 先讀計畫書：`cat ~/.ailive/ailivex-platform/docs/PLAN_brand_asset_library.md`
2. 找故事板頁面：`find ~/.ailive/ailivex-platform/src -name "*.tsx" | xargs grep -l "story" | head -10`
3. 加「全版 Layout」下拉選單（讀 `/api/admin/characters/[id]/brand-layouts`，儲存到 story_draft TaskDoc.brandLayoutId）
4. 加每張卡片的「產品圖」選取（讀 `/api/admin/characters/[id]/brand-products` + 直接上傳，儲存到 card.productImageUrl）

**之後接 Phase 4：**
- `media-worker/src/providers/types.ts` ImageInput 加 `referenceImageUrls?: string[]`
- `media-worker/src/providers/openai-image.ts` 有 refs 時切 FormData + `/v1/images/edits`

---

## 卡住 / 未解

- Phase 3 故事板 UI 尚未實作（確認故事板頁面路徑後直接做）
- Phase 4 media-worker 尚未改（獨立 Cloud Run，改完要 Cloud Build deploy）

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

*2026-06-22 · 第十四 session · 品牌素材庫 Phase 1+2 · 築*
