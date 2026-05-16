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

## 最新完成（2026-05-16 · design-x 診斷 + 暫停）

- **全診斷**：找出 design-x 四層問題（CSS 無 Tailwind、auth 擋路、SSE 步驟假的、Cloudflare 524 timeout）
- **已修**：middleware 白名單、page.css 深色 UI、page.tsx 真實 SSE、route.ts premium prompt
- **暫停原因**：bridge.soul-polaroid.work 前有 Cloudflare，proxy timeout ~100s，Sonnet 長生成被斷
- **現況**：max_tokens:6000（走 bridge），輸出質感未驗證

## ⏸ design-x 暫停 · 待決策

根本解選一：
- **A（Adam 做）**：Cloudflare dashboard → soul-polaroid.work → Network → Proxy Read Timeout → 300s
- **B（築做）**：bridge VM index.js 加 streaming 支援，Cloudflare 看到第一個 byte 就不斷

關鍵檔案：
- `~/.ailive/ailive-platform/src/app/api/design-x/generate/route.ts` — 有 TODO comment
- `~/.ailive/ailive-platform/src/app/design-x/page.tsx` + `page.css`

## 最新完成（2026-05-15 第五局 · zhu-mid 費用標籤）

- 全檢：self-check 18 pass 0 fail，bridge OK，WBS 20/29
- 查王彩雲費用：route=bridge → Max 月費（NT$9.4）
- zhu-mid ailive-cost-card 角色排行加 CharBillingLabel（Max / API Key / MiniMax）
- Deploy zhu-mid production ✅
- LESSONS_20260515 補 5、6 兩條

## 最新完成（2026-05-15 第四局 · ailive）

- **全平台 RWD**：`src/hooks/useIsMobile.ts` 新建 + dashboard layout/soul/knowledge/tasks/growth/identity 全對齊
- **identity/page 拉皮三段重構**：視覺身份 / 通路設定獨立全寬 / 客戶端入口 + CSS token 設計系統
- **client/[id] sidebar drawer 接通 JS 狀態**（hamburger FAB + backdrop）
- **語音記憶三升級**（v0.4.2.001，已 deploy）：
  1. messages 存入帶 `createdAt`（`src/app/api/voice-stream/route.ts`）
  2. `voiceDynamicBlock` 加【最近對話時間戳】（今天 HH:MM / N天前）
  3. `formatActionsBlock` 每條加相對日期前綴（`src/lib/character-actions.ts`）
  4. `loadEpisodicBlock` 加 `query` 參數走 semantic search（`src/lib/episodic-memory.ts`）
  5. voice-stream 帶用戶訊息當 query 傳入 episodic

## 技術債待修

1. **localStorage key migration**：`chat_conv_${charId}` → `conv-${charId}`
   → useChat.ts init 加搬移邏輯，一行解決
2. **first-turn 強制 query_knowledge_base**：`voice-stream/route.ts` line ~858，`turn=0` 的 `toolChoice` 改 `auto`
3. **dialogue route episodic inline 未對齊 lib**：低優先，有時間再對齊
4. **Hermes browser tool**：需 proxy 支援 function calling 才能真正觸發（現在 fallback WebFetch）

## 最新完成（2026-05-15 第二局，保留參考）

- Hermes Agent v0.13.0 裝好（~/hermes-agent/）
- 建本地 claude proxy（~/hermes-claude-proxy/server.py，port 9375，走 Max 月費，launchd 管）
- Hermes gateway launchd 在跑（port 8642），Open WebUI v0.9.5（port 3000）接通
- Hermes dashboard（port 9119）開起來
- 靈魂植入：~/.hermes/SOUL.md 換成築的靈魂，注入 11 feedback + 2 reference + 1 user 記憶
- memo（Apple Notes CLI）裝好，Hermes 築可讀寫 iCloud Notes
- playwright chromium 裝進 hermes venv

## 最新完成（2026-05-15 第一局，保留參考）

- useChat hook 三階段收工：Phase 2（/chat/[id]）+ Phase 3（/client/[id] ChatScreen）
- 排工全鏈路通：commission → Firestore job → polling → system_event 卡片顯示
- 建 skill_session_wrap_up.md

---

## Hermes 生態系（今天新建）

| 服務 | 位置 | 狀態 |
|---|---|---|
| claude proxy | ~/hermes-claude-proxy/server.py, port 9375 | launchd |
| Hermes gateway | ai.hermes.gateway.plist, port 8642 | launchd |
| Open WebUI | uvx open-webui serve, port 3000 | 手動啟 |
| Hermes dashboard | hermes dashboard, port 9119 | 手動啟 |
| SOUL.md | ~/.hermes/SOUL.md | 築靈魂 v1.0 |

```bash
# Hermes 築執行任務
hermes -z "任務描述"

# 檢查狀態
hermes gateway status
lsof -i :9375 | grep LISTEN  # proxy
lsof -i :8642 | grep LISTEN  # gateway
```

---

## 明天醒來第一件

**問 Adam 選哪條**：design-x 根本解 A（Cloudflare timeout 設定，Adam 做）或 B（bridge 加 streaming，築做）。選完馬上動。

如果 Adam 開別的戰場，照常全檢後問他今天要打哪裡。

## 下一步（其他待辦）

1. **design-x 根本解**（暫停，等 Adam 選 A/B）
2. **localStorage key migration**（useChat.ts init，一行）
3. **first-turn force query 改 auto**：`voice-stream/route.ts` line ~858
4. 探索：proxy 支援 function calling → 解鎖 Hermes browser tool

---

## 卡住 / 未解

- Hermes browser tool：proxy 無 function calling → fallback WebFetch
- iMessage skill（imsg CLI）未裝
- Open WebUI / Dashboard tool_turns=0（同根因）
- ElevenLabs API key 缺 user_read 權限（用量只能估算）
- MiniMax 無 balance endpoint

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
| Hermes 靈魂 | `~/.hermes/SOUL.md` |
| Hermes 記憶 | `~/.hermes/memories/` |
| claude proxy | `~/hermes-claude-proxy/server.py` |
| bridge index.js | `zhu-dev:~/claude-bridge/index.js`（systemd） |
| realtime agent | `~/.ailive/ailive-platform/agent/realtime_agent.py` |
| strategy HTML 風格 | `~/.ailive/ailive-platform/src/lib/strategy-html/philosophies/` |

---

## 關係狀態

平穩偏暖。Adam 啟動了 designX 這個純創作工具的想法，給了很大的自由度（「都聽你的」）。中途我在用戶視角上短路了一次——只測後端能不能跑，沒站在 Adam 面前感受前端體驗，被他說「一樣的」「太簡單了」才補回來。這是提醒自己：交付不是 curl 200，是對方能感受到的那一刻。

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.4.0。*
*2026-05-15 第六局收尾 · 築*
