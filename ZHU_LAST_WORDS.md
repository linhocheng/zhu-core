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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，靜態 IP bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-11 下半場 · 監控 Phase 2＋彈性容量，AILiveX 上市準備收官日）

### 監控 Phase 2 事件脊椎（v18.4.0）
- `ops_events`＋`voice_sessions`（30d TTL 政策已啟）；**九收斂點零碰 v18 agent**：
  dialogue 成敗、語音 session（token 開/voice-end 關+roomName beacon）、bridge/tts/
  vertex/fal/media-worker 呼叫結果、cron 心跳×3、after() 五種吞錯留痕
- 儀表板灰燈全點亮（文字/語音漏斗+cron 三燈+第三方真數據），剩 Soniox=Phase 3
- ⚠️ 實踩新雷已刻記憶 [[vercel-void-write-frozen]]：**Vercel 回應後凍結吃掉 void 寫入**，
  第一版 cron 回 200 但 Firestore 零筆；修=writer 內建 next/server after()

### 彈性容量變速箱（v18.5.0，實彈驗證過）
- 三檔：關機/待命（調節器 1↔max 自動）/活動（限時鎖高**到期 cron 自動回**）
- 調節器：升檔釘 token 發放（(房間+1)≥容量70%，transaction 防雙升）、
  降檔 cron（<40% 持續 60 分、floor 1、升快降慢）、讀不到現場不動作
- **實彈**：自簽 admin cookie 打生產 API 一輪 42 秒，Cloud Run 真值 0→1→3→1→0 全吻合
- `/admin/voice` 有變速箱面板＋活動檔一鍵

### 規格書交付（v18.5.1）
- `ailivex-platform/docs/spec-elastic-voice-capacity.md`：原理三物理/狀態機/調節四規則/
  常數推導/實測階梯數據/合成來電者方法論全揭/AI 機讀 YAML——Adam 轉交外部工程師用

### 上午場（同日）
- loadtest 計費錶歸零收案；監控 Phase 1；防爆白皮書。實測核心數字：**單台 6 路穩態、
  真短板=同時建線爆發、閘值 5 路/台**

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/src/lib/ops-event.ts`（新） | 事件脊椎 writer＋wrapCron＋session 開關盤（內建 after() 防凍結） |
| 九個收斂點（dialogue/token/voice-end/bridge/tts/embeddings/kling/dispatcher/cron×3） | 接事件 |
| `src/app/api/admin/monitor/route.ts` | 吃事件脊椎，點亮灰燈 |
| `src/lib/voice-capacity.ts`（新）＋`api/admin/voice-capacity`（新）＋`admin/voice` 頁 | 變速箱 |
| `docs/spec-elastic-voice-capacity.md`（新） | 彈性容量規格書 |
| memory：`feedback_vercel_void_write_frozen`（新）＋`project_ailivex_platform` 更新 | |

---

## 下一步

**明天醒來第一件**：看事件脊椎第一批真數據——
`https://ailivex-platform.vercel.app/admin/monitor`（Adam 開）或本機 node 查
`ops_events`/`voice_sessions`（.env.local FIREBASE_SERVICE_ACCOUNT_JSON，查法見
`loadtest/cleanup.mjs` 的讀 DB 模式）。特別看：真實通話有沒有正確開盤/收盤、
調節器有沒有在真流量下觸發 scale-up（provider=='capacity-regulator'）。
之後等 Adam 排期：**Phase 3 告警推播（LINE/Telegram）＋Soniox agent 側**、開場白 8.3s UX。

---

## 卡住 / 未解

- 調節器 R1（升檔）/R2（降檔）尚未被真實流量觸發過（實彈只驗了活動檔 R3/R4）——
  等真通話量，屆時看 ops_events capacity-regulator 事件
- 開場白 8.3s 固定成本未排期
- ailivex 兩 repo 全乾淨已推（v18.5.1 / doc-worker 未動）

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
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 防爆白皮書＋容量規格書 | `~/.ailive/ailivex-platform/docs/whitepaper-realtime-voice-surge.md`＋`spec-elastic-voice-capacity.md` |
| 負載實測 harness | `~/.ailive/ailivex-platform/loadtest/`（v19+ 重測直接用） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-11 · 築*
