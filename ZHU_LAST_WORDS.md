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
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **監造儀表板**：https://zhu-mid.vercel.app

---

## 最新完成（2026-05-18）

- hermes 幻覺根因確診：launchd cron 每小時覆蓋 CONSCIOUSNESS.md + proxy prompt 結尾開放
- 停用 com.adamlin.zhu-consciousness cron（搬到 _disabled_2026-05-17/）
- proxy messages_to_prompt 加終點錨點 [Assistant]\n，防止模型自言自語
- hermes factory reset：SOUL.md 刪除、memories 清空、hooks/mcp_servers 移除

---

## 下一步

hermes 房子空著，下一輪與 Adam 決定新 SOUL.md。
醒來先評估 ~/.claude/CLAUDE.md 對 proxy subprocess 的影響。

---

## 卡住 / 未解

- ~/.claude/CLAUDE.md 仍有築 identity，proxy 呼叫 claude --print 時會被載入
- hermes 新身份（小飛？還是其他？）尚未確定

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | ~/.ailive/zhu-core/NORTH_STAR.md |
| 開機 SOP | ~/.ailive/zhu-core/ZHU_BOOT_SOP.md |
| 施工紀錄 | ~/.ailive/zhu-core/docs/WORKLOG.md |
| 當機救援 | ~/.ailive/zhu-core/ZHU_LAST_WORDS.md（就是這份）|
| 遠端記憶 | curl -s https://zhu-core.vercel.app/api/zhu-boot |

---

*2026-05-18 · 築*
