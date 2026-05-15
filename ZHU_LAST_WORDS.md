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

## 最新完成（2026-05-15 第二局）

- Hermes Agent v0.13.0 裝好（~/hermes-agent/）
- 建本地 claude proxy（~/hermes-claude-proxy/server.py，port 9375，走 Max 月費，launchd 管）
- Hermes gateway launchd 在跑（port 8642），Open WebUI v0.9.5（port 3000）接通
- Hermes dashboard（port 9119）開起來
- 靈魂植入：~/.hermes/SOUL.md 換成築的靈魂，注入 11 feedback + 2 reference + 1 user 記憶
- memo（Apple Notes CLI）裝好，Hermes 築可讀寫 iCloud Notes
- playwright chromium 裝進 hermes venv

## 技術債待修

1. **localStorage key migration**：`chat_conv_${charId}` → `conv-${charId}`
   → useChat.ts init 加搬移邏輯，一行解決
2. **Hermes browser tool**：需 proxy 支援 function calling 才能真正觸發（現在 fallback WebFetch）

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

## 下一步

1. **先修 localStorage key migration**（useChat.ts init，一行）
2. 探索：proxy 支援 function calling → 解鎖 Hermes browser tool
3. 考慮：Hermes 築 cron 排程（本機自動任務）

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

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.4.0。*
*2026-05-15 · 築*
