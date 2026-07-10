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

## 最新完成（2026-07-11 · AILiveX 上市準備三連發）

### 語音負載實測（首次，真數據落地）
- 方法：同碼換 agent_name 的 loadtest 服務（min=1/max=1 鎖單台）＋asia-east1 VM 跑合成
  來電者階梯 1→6 路（本機 Mac 到 LiveKit edge TCP 不通——ISP 路由，記進雷區）
- **結果：單台（2CPU）穩態 6 路無劣化（p50 平穩 3.9-4.4s、CPU 66%）；真短板=同時建線
  爆發（15s 內 6 通，首回合 4s→23-27s+1 逾時）；開場白恆定 8.3s（獨立 UX 題）**
- 閘值定案：5 路/台、進線斜率閘 3 通/15s/台、max-instances=⌈目標÷5⌉
- agent 假通話抽了 14 筆「記憶」——測試隔離帳號設計被實證必要；已全清＋服務/VM 已刪

### 監控中台 /admin/monitor Phase 1（已部署，Adam 確認真數字）
- 聚合 API 純讀零管道：燈號真探測（doc-worker /health、Cloud Run API、LiveKit
  listRooms、bridge 可達）＋水位（分母=實測 6 路/台）＋在線（LiveKit 房間現場）＋
  漏斗含卡死偵測（running 超時無錯誤=橘）＋第三方（zhu_vitals_cost 聚合）
- 原則：燈只從證據亮；未接管道灰標 Phase 2 不裝綠（假中台天條）

### 防爆白皮書（給外部團隊建即時語音）
- `ailivex-platform/docs/whitepaper-realtime-voice-surge.md`：三定律/五道閘/記憶庫
  三原則/CPU 遊戲規則/兩層開關/雷區十條/**第六章 AI 機讀 YAML**（對方的 AI 是真實讀者）

### commits（全 push GitHub）
v18.2.0（loadtest 三件套）/ v18.3.0（監控中台）/ v18.3.1（白皮書）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/loadtest/*` | 合成來電者 harness＋seed/cleanup＋實測報告＋原始數據 |
| `ailivex-platform/agent/main_loadtest.py`＋`cloudbuild-loadtest.yaml` | 隔離測試服務（v19+ 重用） |
| `ailivex-platform/src/app/api/admin/monitor/route.ts` | 監控聚合 API |
| `ailivex-platform/src/app/admin/monitor/page.tsx`＋`admin/layout.tsx` | 監控頁＋導覽入口 |
| `ailivex-platform/docs/whitepaper-realtime-voice-surge.md` | 防爆白皮書 v1.0 |
| memory `skill_voice_loadtest_setup_burst.md`（新）＋`project_ailivex_platform.md` | 實測方法＋平台進度 |

---

## 下一步

**明天醒來第一件**：Adam 說計費錶他來驗——若他丟結果，核 `billable_instance_time`
ailivex-realtime-agent-loadtest（ailivex-2026）＋ loadtest-caller VM（zhu-cloud-2026）兩條歸零。
指令：`gcloud monitoring` REST（monitor route 裡有現成 curl 模式）。
然後等 Adam 排期二選一：**監控 Phase 2 事件脊椎**（ops_events：語音 session doc/dialogue
成敗/第三方 wrapper/cron 心跳/after() 吞錯留痕——設計已在 07-10 對話定案）或
**彈性容量施工**（三段變速箱＋水位調節器——升檔釘 token route、重用 voice-power.ts PATCH）。

---

## 卡住 / 未解

- loadtest 計費錶歸零驗證掛帳（資源已刪，指標明日才長出來）
- 開場白 8.3s 固定成本未排期（預載/開場白快取方向）
- 監控 UIUX 稿在 session scratchpad（html mockup，Adam 已確認版面）——正式版已上線，稿可棄

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
| AILiveX 監控中台 | https://ailivex-platform.vercel.app/admin/monitor |
| 語音容量白皮書 | `~/.ailive/ailivex-platform/docs/whitepaper-realtime-voice-surge.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-11 · 築*
