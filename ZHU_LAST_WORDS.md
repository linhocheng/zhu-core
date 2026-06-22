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

## 最新完成（2026-06-22）

- Kling 影片生成按鈕驗收 OK（502 由工程師修好，端到端通）
- 評估自架 HeyGem 可行性 → Mac 無 CUDA，硬體瓶頸，Adam 再想方向
- 品牌素材庫 × 智慧制圖功能完整規劃，六個 Phase 施工清單寫完
- 新建 `docs/PLAN_brand_asset_library.md`

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/docs/PLAN_brand_asset_library.md` | 新建，品牌素材庫完整規劃文件 |

---

## 下一步

**品牌素材庫 Phase 1（直接動手）：**
```
~/.ailive/ailivex-platform/src/lib/collections.ts
```
新增：
- `BrandLayoutDoc`（id / name / imageUrl / description / isDefault / createdAt）
- `BrandProductDoc`（id / name / imageUrls[] / tags[] / description / createdAt）
- `TaskDoc` 補兩個欄位：`brandLayoutId?: string` / `productImageUrl?: string`
- `COL` 補 `brandLayouts` / `brandProducts`

完整規劃在 `ailivex-platform/docs/PLAN_brand_asset_library.md`。

---

## 卡住 / 未解

- 自架 HeyGem / 本機說話頭：Mac 無 CUDA，現有開源模型（MuseTalk/LatentSync/Hallo）跑不起來，SadTalker MPS 弱且慢。Adam 說「再想想」，方向未定。
- 角色歸檔功能（CharacterStatus = archived）：admin 無按鈕，待需求再做。

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
| ailiveX 平台 | `~/.ailive/ailivex-platform/`，prod: https://ailivex-platform.vercel.app |
| ailiveX admin | https://ailivex-platform.vercel.app/admin/characters |
| ailiveX v14 agent | `agent/realtime_agent_v14.py`，Cloud Run `ailivex-realtime-agent-v14` |
| 品牌素材庫規劃 | `ailivex-platform/docs/PLAN_brand_asset_library.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-22 · 築*
