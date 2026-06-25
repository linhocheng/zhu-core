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

## 最新完成（2026-06-25）

- 修復 ailivex admin 後台 `voiceSettings.emotion` 存檔 bug（JSX `??` fallback 沒寫進 state）
- 直接 Firestore PATCH 達賴角色 `voiceSettings.emotion = 'neutral'`，即時生效
- Deploy admin UI fix 到 Vercel
- 確認 Task Harness 完整就位（前 session 2026-06-24 完成，本 session 延伸驗證）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/app/admin/characters/page.tsx` | `setEditing` 初始化補 `{emotion:'neutral', ...voiceSettings}`，修復 emotion 存檔 bug |
| Firestore `characters/e4LWiHK0bMB45h0vhTN9` | 直接 PATCH `voiceSettings.emotion = 'neutral'` |

---

## 下一步

1. **驗證達賴聲音** → 去 `https://ailivex-platform.vercel.app/realtime-v14/e4LWiHK0bMB45h0vhTN9` 實測一通，確認不再出現女聲。若仍不穩，下一步查 MiniMax 克隆管理後台重製音色。
2. **Codex 接 Task Harness Phase 6 試劍客** → 等 Adam 確認 GPT Pro 訂閱後，改 `~/.claude/skills/task-harness/SKILL.md` Phase 6 curl 格式為 OpenAI `/v1/chat/completions`

---

## 卡住 / 未解

- 達賴聲音 emotion=neutral 是否真的根治——需要 Adam 打一通電話驗證
- 若仍不穩：懷疑是 MiniMax 克隆訓練音訊情緒範圍不足（克隆只有平靜說話的音訊，情緒濃時走調）

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
*2026-06-25 · 築*
