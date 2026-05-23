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

## 最新完成（2026-05-23e）

- ailive `on_disconnected` 改 Cloud Tasks enqueue 架構上線，端到端全通
- 修 `_enqueue_cleanup_job` 漏 `import httpx`（NameError）→ Cloud Run 00066-h4q 重建部署
- 驗證：staging doc 刪除 + conversation saved（messageCount=56, lastSession=YES）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent.py` | `_enqueue_cleanup_job` 補 `import httpx`（第 691 行）|
| `src/app/api/voice-cleanup/route.ts` | 上個 session 建的 Vercel worker（這 session 未改）|

---

## 下一步

觀察幾通正式通話，確認 5 個 cleanup 步驟都有資料：
```bash
# 找最新一通 conv_id，查 insights
# Firestore project: moumou-os
# collections: platform_insights（where conversationId==convId）
# platform_conversations（看 lastSession, messageCount）
```

可選但建議：替 `voice-cleanup` worker 加冪等保護，避免 Cloud Tasks retry 造成 insights 重複寫入。

---

## 卡住 / 未解

1. **staging doc 洩漏**：Cloud Tasks 3 次 retry 全失敗後，`platform_cleanup_queue` doc 留著沒人清。沒 TTL policy。
2. **冪等問題**：`voice-cleanup` worker 沒有 dedup，Cloud Tasks retry 時 insights 會重複寫
3. **costLlm 準確性**：`_cost_llm` 累加器需抽樣驗證是否正確

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| ailive-platform | `~/.ailive/ailive-platform/` |
| voice-cleanup worker | `src/app/api/voice-cleanup/route.ts` |
| Cloud Run agent | `agent/realtime_agent.py`（`_enqueue_cleanup_job` ~L664）|

---

*2026-05-23e · 築*
