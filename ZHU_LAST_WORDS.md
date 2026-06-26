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
- **監造儀表板**：https://zhu-mid.vercel.app

---

## 最新完成（2026-06-26）

- 查出 fal.ai gpt-image-2 靜默忽略 image_urls（endpoint 根本不支援），全面切換到 OpenAI /v1/images/edits
- media-worker default image provider 改 openai，deploy 完成
- ailivex generate-images route 改永遠帶 provider: 'openai'，deploy 完成
- image-prompt-enhancer productHint 改通用版（人物/產品雙覆蓋），deploy 完成
- GCP Secret Manager + ailive-platform Vercel OPENAI_API_KEY 換新 key
- 實測 OpenAI edits endpoint：Lulu 人像成功合成進豆田場景

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/app/api/tasks/[id]/generate-images/route.ts` | provider 固定 'openai'、hasProductImage 傳入 |
| `ailivex-platform/src/lib/image-prompt-enhancer.ts` | hasProductImage 參數 + productHint 人物/產品雙覆蓋 |
| `media-worker/src/handlers/enqueue.ts` | default image provider 改 openai |

---

## 下一步

Adam 去 ailivex 故事板 UI 實際試生圖，cardText 裡寫「參考圖中的人物主角」，確認 Lulu 合成效果。
若效果 OK → 下一步考慮：是否讓 UI 自動偵測 ref 是人物還是產品，讓 productHint 更精準。

---

## 卡住 / 未解

無。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailivex 生圖管道 | `ailivex-platform/src/app/api/tasks/[id]/generate-images/route.ts` |
| 瞬 prompt enhancer | `ailivex-platform/src/lib/image-prompt-enhancer.ts` |
| media-worker provider | `media-worker/src/providers/openai-image.ts` |

---

*2026-06-26 · 築*
