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
- **Atelier Control Tower**：`localhost:9119/atelier`（hermes gateway 起著就有）

---

## 最新完成（2026-05-17）

- **Atelier E2E 真正跑通**：create task → POST /spawn → gateway 啟動 Claude Code subprocess → 子代理自打 PATCH 回報 phase → WebSocket → Dashboard 即時更新
- **一念靜所品牌任務完成**：四 phase（parse_brief / extract_brand / generate_concept / deliver），輸出 `/tmp/yinian_brand_brief.txt`
- **Dashboard 視覺大升級**：status dot + phase 進度條 + log 行號 + derived decisions

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `hermes-agent/web/src/pages/AtelierPage.tsx` | 全面視覺重設計（status dot、phase strip、log 行號、Thinking tab derived decisions）|
| `~/.ailive/zhu-core/docs/WORKLOG.md` | 追加兩個 session 條目 |
| `~/.ailive/zhu-core/docs/LESSONS/LESSONS_20260517b.md` | 新建，四條 lessons |

---

## 下一步

1. **清掉多餘架構**：`~/.hermes/atelier-subagent/` 和 `~/Library/LaunchAgents/ai.hermes.atelier-subagent.plist` 是上個 session 建的 webhook server，現在用不到了，清掉
2. **派更多任務**：Atelier 現在可以用了，嘗試讓子代理做真正有產出的事（生成圖片、寫程式、產報告）
3. **task resume**：gateway 重啟後 running task 會斷，考慮 on-startup 重跑 queued 的任務

---

## 卡住 / 未解

- Decisions tab 的「Extracted from logs」只是關鍵詞過濾近似，不是真正的 thinking
- atelier-subagent webhook server 是殭屍，要清

---

## Atelier 快查指令

```bash
# 建 task
TOKEN=$(cat ~/.hermes/session_token)
curl -s -X POST http://localhost:9119/api/atelier/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"任務名","agent":"atelier","phases":["p1","p2","p3"]}'

# spawn（task_id 從建 task response 拿）
curl -s -X POST http://localhost:9119/api/atelier/tasks/{task_id}/spawn \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"子代理 prompt，含 task_id 和 PATCH 指令"}'

# Dashboard 空白 → Hard refresh：Cmd+Shift+R
```

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
| Atelier 源碼 | `~/hermes-agent/hermes_cli/web_server.py`（line 3545 起）|
| Atelier 前端 | `~/hermes-agent/web/src/pages/AtelierPage.tsx` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17 · 築*
