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

## 最新完成（2026-06-20）

- story_draft 加進文字對話 DISPATCH 標記（tool-tags.ts + TOOL_INSTRUCTIONS）
- ui.tsx 補 5 個缺 icon（refresh / chevron-left / chevron-right / edit / close）
- dialogue/route.ts 把 dispatchTask 移進 after()，確保 lambda 存活
- generate-story Phase A+B 合一 after()，消除 HTTP 鏈（v14.2.4 已 deploy）
- Vercel env 新增 PLATFORM_URL

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `src/lib/tool-tags.ts` | 加 story_draft 到 VALID_CAPABILITIES + TOOL_INSTRUCTIONS |
| `src/app/_components/ui.tsx` | 補 5 個 icon |
| `src/app/api/dialogue/route.ts` | dispatchTask 移進 after() |
| `src/app/api/tasks/[id]/generate-story/route.ts` | Phase A+B 合一 after()，v14.2.4 |

---

## 下一步

去文字對話跟角色（開 story_draft capability 的角色）說「幫我做一個故事板，主題是 XXX」，
確認 Firestore 裡這個 story_draft task 的 status 最終到 ready 且 cards.length > 0。
這才算 v14.2.4 端到端驗過。

```
repo: ~/.ailive/ailivex-platform
prod: https://ailivex-platform.vercel.app/stories
```

---

## 卡住 / 未解

- WORKER_SECRET：vercel env pull 拿到的值打 prod 401。runtime 真實值不知道。
  暫不阻塞，用 session-based 認證（瀏覽器登入後點「重新分析」）可繞過。
- v14.2.4 A→B 自動鏈未實測（新 story_draft 尚未真實走一遍）

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
| ailivex 主戰場 | `~/.ailive/ailivex-platform/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-20 · 築*
