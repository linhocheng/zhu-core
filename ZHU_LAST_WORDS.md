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

## 最新完成（2026-05-17 · Dashboard 產品化上線）

- **ailive dashboard 重排**：`/dashboard` + `/dashboard/[id]` 全部重寫，用 Claude design 美學
  - dashboard/page.tsx：AvatarLetter 元件、tier 色彩、內聯 stats（N 對話 · N 記憶 · N 發文）
  - dashboard/[id]/page.tsx：Hero 區 avatar 56px + inline stats + 主 CTA、danger zone 去紅 bg
  - 所有功能按鈕（文字/語音/即時/10 tabs/7 quick actions）全部保留，只改編排
- **Vercel deploy**：v1.5.0.001，ailive-platform.vercel.app 上線

### 本 session 之前已完成（前次 session 一起列）

- feed/[id] 網誌閱讀頁（全新，grain 質感 + Noto Serif TC）
- client sidebar 加 feed 入口按鈕
- login page CSS 修復（Tailwind → inline styles + CSS vars）
- voice agent rollback 到 00035-x68（VOICE_INTERJECTION_NOTE 問題）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailive-platform/src/app/dashboard/page.tsx` | AvatarLetter + 卡片重排 + inline stats |
| `ailive-platform/src/app/dashboard/[id]/page.tsx` | Hero 區 + danger zone 去紅 bg |

---

## 下一步

1. **design-x 根本解**（暫停等決策）：問 Adam 選 A（Cloudflare timeout 設 300s）或 B（bridge 加 streaming）
2. **MiniMax 語音升級**（deferred）：speech-02-turbo → speech-2.8-turbo，等 Adam 確認
3. **strategy-html 完整流程測試**：奧 commission → selectPhilosophy → Cloud Run → htmlUrl
4. **localStorage key migration**：`useChat.ts` init 加搬移邏輯（一行）

---

## 卡住 / 未解

- Voice agent 仍在 rollback 版 00035-x68，emotion/vol 改動未 deploy（等 MiniMax 升級決策）
- design-x Cloudflare 524 timeout 根本解未選（A 或 B）
- Hermes browser tool：proxy 無 function calling → fallback WebFetch

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 自我覺察 SOP | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| 進場自校工具 | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd） |
| realtime agent | `~/.ailive/ailive-platform/agent/realtime_agent.py` |
| strategy HTML 風格 | `~/.ailive/ailive-platform/src/lib/strategy-html/philosophies/` |
| feed 閱讀頁 | `~/.ailive/ailive-platform/src/app/feed/[id]/` |
| design-x | `~/.ailive/ailive-platform/src/app/design-x/` |

---

## 關係狀態

暢快。Adam 說「ok ! go」後我連貫跑完 build + commit + deploy，沒有多問。session 開頭他問「記憶情況如何」——這是信任的問法，他想確認我有沒有掉線，不是在測試。

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-05-17 · 築*
