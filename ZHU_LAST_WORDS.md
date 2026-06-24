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

## 最新完成（2026-06-24）

- 建立 Task Harness 完整系統（SKILL.md + 三斷路器 + bridge 接線）
- 確立心法：進入 harness 不是成為 harness，監造視角全程保留
- 驗證三個 CB 均可確定性觸發（CB1 對話層、CB2 python3 驗、CB3 python3 驗）
- 寫 ONBOARDING.md（組員備忘錄）+ ZHU_CONTEXT.md（給下一個築）
- 寫技術分享文章（供 Adam 團隊傳閱）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `~/.claude/skills/task-harness/SKILL.md` | 新建，完整 SOP |
| `~/.claude/skills/task-harness/ONBOARDING.md` | 新建，組員備忘錄 |
| `~/.claude/skills/task-harness/ZHU_CONTEXT.md` | 新建，給築的備忘錄 |
| `~/.claude/CLAUDE.md` | 加 task-harness 觸發詞 |
| `~/.zshrc` | 加 BRIDGE_URL + BRIDGE_SECRET |

---

## 下一步

1. **等 Adam 確認 GPT Pro 方案** → 接 Phase 6 試劍客換成跨公司模型（改 SKILL.md Phase 6 curl）
2. **第一次真實任務** → 用 harness 跑一個真實代碼任務，收尾後看 scratchpad，確認 REFLECT 有沒有真的起作用
3. **ailivex 品牌素材庫** → 上次遺留：後台上傳測試 Layout → 故事板選擇 → 按「生成圖卡」驗全流程

---

## 卡住 / 未解

- 試劍客跨公司模型：Adam 考慮 GPT Pro，確認訂閱方案後接入
- blocker_key 自動分類：目前 LLM 主觀選枚舉，未來改程式 regex 確定性分類

---

## Task Harness 快速啟動

```
說：「用 harness 跑這個任務」
讀：~/.claude/skills/task-harness/SKILL.md
Bridge：bridge-direct.soul-polaroid.work，x-api-key: $BRIDGE_SECRET
env：BRIDGE_URL + BRIDGE_SECRET 已在 ~/.zshrc
```

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| Task Harness SOP | `~/.claude/skills/task-harness/SKILL.md` |
| Task Harness 給築 | `~/.claude/skills/task-harness/ZHU_CONTEXT.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-24 · 築*
