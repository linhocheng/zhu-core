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

## 最新完成（2026-06-26）

- 找出並修復六個覆蓋角色靈魂的根因（realtime_agent_v14.py、firestore_loader.py、source_intake.py 三檔）
- 把聖嚴角色全部 9 個 voice/conv 參數從後台 admin 同步寫入 Firestore
- 刪除 3 條簡體中文汙染記憶
- 部署 ailivex v14.4.0 / v14.4.1 / v14.4.2 三個版本上線

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `agent/realtime_agent_v14.py` | 移除【在場與口氣】個性塊 → 改為格式中性【語音格式】；開場問候不再強制老朋友語氣 |
| `agent/firestore_loader.py` | voiceRules 移除「說人話像朋友」「問問題讓話題有來有往」，只留格式規則；保留簡體中文（MiniMax TTS 音準） |
| `agent/source_intake.py` | 讀網址後 generate_reply 改為角色中性（原：口氣平實像聊天） |

---

## 下一步

**Adam 做的事**：進 admin UI → 聖嚴角色 → soulCore → 只保留第九節「# Role: 鍛魂師・聖嚴法師...」的第一人稱角色指令，刪掉前八節第三人稱設計文件（「此角色善用...」「設計意圖是...」之類）。改完後跑一次通話驗收。

**築接棒時**：先確認 soulCore 已改（在 Firestore 或 admin UI 查 `characters/8mCpOmbJalsvdUxGRFzn.soulCore`），再考慮是否要在 `enhanceSoul()` 加強制第一人稱輸出的 prompt，讓其他角色也不會踩相同問題。

---

## 卡住 / 未解

**soulCore 格式問題**：soulCore 現在是 8 節設計文件 + 第九節角色指令，agent 把整個 soulCore 注入 instructions，AI 拿到的是「規格書」不是「我是誰」。根治需 Adam 手動改，或修 `enhanceSoul()` 強制輸出第一人稱格式。

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
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |
| ailivex agent（live） | `~/.ailive/ailivex-platform/agent/` |
| ailivex admin | https://ailivex-platform.vercel.app/admin/characters |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-26 · 築*
