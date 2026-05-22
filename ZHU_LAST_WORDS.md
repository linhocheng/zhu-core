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

## 最新完成（2026-05-22）

### ANEWS S3（前半段，其他 session）
- section-write revise mode + previousSectionSummary context
- section-qa 7項品管 + qa_blocked auto-skip
- stitch / polish / coherence / image / export 全通
- Pipeline pending → done 全通

### ailive 平台（本 session）
- Vivi 知識庫圖片顯示修復（.k-thumb 條件渲染）
- 知識庫上傳卡住修復（移除 Gemini summary，改 slice(0,30)）
- 新建 `/api/knowledge-image` 端點（Firebase Storage + makePublic）
- 客戶端 + Dashboard 加圖片上傳 UI + 分類 pill 篩選
- 即時語音 Anthropic API key 超額換新 key（Secret Manager）
- STT `language="zh"` → `detect_language=True`（commit c778556，ailive-platform）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/app/client/[id]/page.tsx` | catFilter、uploadImage()、圖片 tab |
| `ailive-platform/src/app/client/[id]/client-v2.css` | .k-thumb CSS |
| `ailive-platform/src/app/api/knowledge/route.ts` | 移除 Gemini summary call |
| `ailive-platform/src/app/api/knowledge-image/route.ts` | 新建圖片上傳 API |
| `ailive-platform/src/app/dashboard/[id]/knowledge/page.tsx` | 同步加圖片上傳 UI |
| `ailive-platform/agent/realtime_agent.py` | STT detect_language=True |

---

## 下一步

**馬雲雙語 STT — Cloud Run 重部署**（最急，Adam 測試前要先跑）

```bash
# 在 ~/.ailive/ailive-platform 跑
gcloud builds submit \
  --config=agent/cloudbuild.yaml \
  --project=ailive-realtime-2026 \
  --region=asia-east1

gcloud run services update ailive-realtime-agent \
  --image=asia-east1-docker.pkg.dev/ailive-realtime-2026/ailive-agents/realtime-agent:latest \
  --region=asia-east1 \
  --project=ailive-realtime-2026
```

做完後接：
1. T9：ANEWS Dashboard 加 Human Review Gate 按鈕
2. 調 section-qa 嚴格度（word_count 60%，移除 no_unsupported_claims）

---

## 卡住 / 未解

- **STT detect_language 未 deploy**：改動在 git 但 Cloud Run 還跑舊版；Adam 要手動跑 build+deploy
- **ANEWS qa_blocked skip**：需移到 worker 層，不依賴 orchestrator callback
- **QA 過嚴**：5/8 段 blocked；調鬆前先做 T9

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailive 平台 | `~/.ailive/ailive-platform/`，prod：https://ailive-platform.vercel.app |
| ANEWS 平台 | `~/.ailive/anews-platform/`，prod：https://anews-platform.vercel.app |
| Bridge streaming 踩雷 | `docs/LESSONS/LESSONS_2026-05-19b.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-22b · 築*
