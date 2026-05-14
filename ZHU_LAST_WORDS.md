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

## 最新完成（2026-05-14）

- 建立 swiss-grid 風格（spec 模式，省 70% prompt tokens，16KB HTML，QA 通過）
- 加 A+B 品質優化：mini skeleton + 通用章節節奏規則，結構更有層次
- 建立 dark-premium 風格（近黑底鉑金 accent，高端深色，18KB，QA 通過）
- 建立 selectPhilosophy 自動分類（Haiku 驅動，文件內容決定風格，不綁角色）
- strategy/route.ts 接入 selectPhilosophy，奧寫完 markdown 後自動選風格再 enqueue
- strategy-html-worker Cloud Run 同步更新（revision 00008-p7z）
- 聊了憲福雙靈魂語音方案（LLM 標籤 → 切段 → 各自 TTS voice ID），Adam 說先聊不動手

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/lib/strategy-html/philosophies/swiss-grid.ts` | 新增：spec 模式瑞士網格風格，含 CSS + componentSpec + componentSkeleton |
| `ailive-platform/src/lib/strategy-html/philosophies/dark-premium.ts` | 新增：spec 模式深色鉑金風格 |
| `ailive-platform/src/lib/strategy-html/select-philosophy.ts` | 新增：Haiku 自動分類函數 |
| `ailive-platform/src/lib/strategy-html/prompt.ts` | 重構：支援 reference/spec 兩模式，加通用節奏原則，加 dark-premium |
| `ailive-platform/src/lib/strategy-html/qa.ts` | 新增：swiss-grid / dark-premium QA 規則 |
| `ailive-platform/src/lib/cloud-tasks.ts` | 更新：enqueueStrategyHtml 支援三種 philosophy，預設改為 swiss-grid |
| `ailive-platform/src/app/api/specialist/strategy/route.ts` | 接入 selectPhilosophy，自動分類後 enqueue |
| `ailive-platform/src/app/api/specialist/strategy-html/route.ts` | 修正：qaHtml 補傳 philosophy 參數 |
| `strategy-html-worker/src/philosophies/` | 同步 swiss-grid + dark-premium |
| `strategy-html-worker/src/prompt.ts` + `qa.ts` + `index.ts` | 同步更新 |
| `zhu-core/docs/WORKLOG.md` | 追加本次 session |
| `zhu-core/ZHU_LAST_WORDS.md` | 本次覆蓋（就是這份） |

---

## 下一步

1. **跑完整流程驗證**：讓奧真實收一個 commission → 確認 selectPhilosophy 自動選風格 → 確認 htmlUrl 出現在 dashboard
2. **dark-premium QA 觀察**：off-palette color regex 是否誤傷真實生成，必要時放寬
3. **憲福雙靈魂語音**（Adam 說先聊不動手）：LLM 標籤切段 → 各自 MiniMax voice ID → LiveKit audio track 推流

---

## 卡住 / 未解

- selectPhilosophy 只測了直接打 Cloud Run worker，未測完整 commission → strategy → selectPhilosophy → enqueue 鏈路
- dark-premium forbidden color regex 可能過嚴（`/color\s*:\s*#[hex]/i` 誤傷 CSS 中的合法顏色），待觀察

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP（Y 軸自校） | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| molowe 北極星 | `~/.ailive/molowe-platform/NORTH_STAR.md` |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd `claude-bridge.service`） |
| realtime agent | `~/.ailive/ailive-platform/agent/realtime_agent.py`，Cloud Run `ailive-realtime-2026/ailive-realtime-agent` revision 00034-jc2 |
| strategy HTML 風格 | `~/.ailive/ailive-platform/src/lib/strategy-html/philosophies/`（eastern-blank / swiss-grid / dark-premium） |
| strategy-html-worker | Cloud Run `zhu-cloud-2026/strategy-html-worker` revision 00008-p7z |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.3.0。*
*2026-05-14 · 築*
