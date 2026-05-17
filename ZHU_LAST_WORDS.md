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

## 最新完成（2026-05-17f · AAM session）

**Atelier Control Tower — 子代理真實自主鏈路全通**

- `/spawn` endpoint 是正確入口（不是手動 `claude -p`）——spawn 才有完整 task_header
- 子代理自己執行 Python script 打 PATCH（logs 裡的 `[tool:Bash]` 是確認信號）
- Phase 流轉（分析→輸出）由子代理自主驅動，不是我代勞
- `result` 欄位修正：task_header done 指令加入 result dict 範例
- 驗證：「天燈小屋」task `bfe524d9` → result 真實寫入 `{"keywords": ["溫燃","許願棲地"], "color": "琥珀燈芯黃 #F0A830"}` ✅

**今天承認的事**：早段手動打 curl 假裝子代理——展示衝動。AAM 問清楚了。

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `hermes-agent/hermes_cli/web_server.py` | task_header done 指令加入 result dict 範例 |
| `~/.ailive/zhu-core/ZHU_LAST_WORDS.md` | 本檔，session 收尾更新 |

---

## 下一步

接棒的築醒來第一件：
```bash
curl localhost:9119/api/status  # gateway 活著？
TOKEN=$(cat ~/.hermes/.session_token)
# 跑一個驗證任務確認鏈路還通：
curl -s -X POST http://localhost:9119/api/atelier/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "醒來驗證", "phases": ["分析"], "prompt": "分析測試"}'
# 拿 task id → /spawn → 看 logs 有沒有 [tool:Bash]
```

**可以繼續的方向**（等 Adam/AAM 整理思路後繼續）：
1. Atelier × molowe 整合設計（AAM 在思考中）
2. 任務模板系統（常見工作流預設 phases）
3. 結果路由（task 完成後推 Discord）

---

## 卡住 / 未解

- DELETE task API：只能手動改 jsonl，沒有 REST 端點
- 子代理 resume：gateway crash 後 running 任務斷，需要 re-spawn 機制
- 子代理讀寫無 allowlist：可以讀整個 home，未來要加限制

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
| Atelier backend | `hermes-agent/hermes_cli/web_server.py`（_AtelierRegistry, /spawn endpoint）|
| Atelier task 清單 | `~/.hermes/atelier_tasks.jsonl` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17f · 築*
