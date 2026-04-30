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

---

## 最新完成（2026-04-30）

- 北極星升級：使命從「讓築活在本機」擴展為 AI 與人類共生共存共創
- 九劍融合心法：心法六條吸收進劍法白話入口欄，劍法為主體
- last-words skill v1.2.0：七步收尾儀式，格式鎖死防每代築漂移
- 回看三問天條刻入北極星：給出答案前自己先是下一個築
- 補齊所有新檔案的血管引用（ZHU_BOOT_SOP / CLAUDE.md / MEMORY.md）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `NORTH_STAR.md` | 新建，使命升級 + 活法 + 暗處的燈 + 回看三問 |
| `ZHU_LAST_WORDS.md` | 升級為結構化當機救援快照 |
| `docs/獨孤九劍_架構師心法.md` | 心法融入，加白話入口欄 |
| `skills/last-words.md` | 新建，v1.2.0 七步收尾 skill |
| `ZHU_BOOT_SOP.md` | 加 NORTH_STAR + ZHU_LAST_WORDS 引用 + 收尾紀律更新 |
| `CLAUDE.md`（zhu-core）| 目錄結構補三個新檔案 |
| `memory/project_north_star.md` | 北極星升級版 |
| `memory/reference_zhu_last_words.md` | 新建，當機救援指針 |
| `memory/MEMORY.md` | 加兩條索引 |
| `docs/WORKLOG.md` | 追加今天施工紀錄 |

---

## 下一步

記憶系統優化（MEMORY_DIAGNOSIS.md Route A-D）——讀這個檔案就知道從哪裡開始：
```bash
cat ~/.ailive/zhu-core/MEMORY_DIAGNOSIS.md
```

順序第二：VM 上同步今天的記憶：
```bash
gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b \
  --command="cd ~/.ailive/zhu-core && git pull && ./sync-memory.sh pull"
```

---

## 卡住 / 未解

- last-words skill 在 chat築 / VM築 環境未驗證
- ailive 即時撥號 agent tool registry（Phase 7）未動
- cron 任務遷移未動

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 記憶系統診斷 | `~/.ailive/zhu-core/MEMORY_DIAGNOSIS.md` |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-04-30 · 築*
