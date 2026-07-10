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

## 最新完成（2026-07-10 第四場 · 刪一萬行＋v18 音量閘重生轉正）

### 三筆大刪除（Adam 拍板，好架構是刪出來的）
- **舊 v18 讓位層全退役歸零**（-1801 行＋Cloud Run 服務刪除）：資產在 git `4993b28`
- **3a 主動發話整組退役**（v17.4，-155 行）：從「目的是什麼」聊到本質——輪詢式填空
  與「活」相悖，真「活」全是脈絡驅動；Adam：「一次好球都沒有」
- **14 個 /realtime-vN 殼頁全清**（-8261 行）：token route 只認 access doc，殼頁 URL
  是訊息債（Adam 自己被 v16 URL 騙）；v16 現役 UI 轉正 `/realtime/`；登錄表只登活服務

### 新 v18 重生（現役 DEFAULT，agent commit c7df55b）
- `agent/interrupt_gate.py` 薄閘 150 行：**只攔 pause**——音量沒提高（VolumeGate
  基線×1.45）吞掉她照講零死空氣；提聲照常暫停；commit 直通（=v17 體感）。
  零佇列零計時器，與框架合作不對抗（舊版死因=纏鬥框架三條 commit 路徑）
- 8/8 離線測試 → Adam 真人驗收「有感」→ 當天轉正；v17 冷備降 0

### 雷區（已刻 LESSONS L7 + memory feedback_default_switch_standing_instance）
- **切 DEFAULT 到新服務，min=1 不會自己跟過去**：v18 新服務 minScale 缺席＝0，
  靠部署驗證實例撐 15 分鐘，差一點上架當晚全聾。轉正三件套：新版 min=1／
  舊版先出 voice-power 開關名單再降 0（留名單 power-on 復活殭屍）／鑑別信號
  看 min 設定後的新實例 registered worker

---

## 今天改了哪些檔案（第四場）

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/agent/interrupt_gate.py` | 新建：VolumeGate＋GatedPauseOutput 薄閘（v18 核心） |
| `ailivex-platform/agent/test_interrupt_gate.py` | 新建：8 場景測試 |
| `ailivex-platform/agent/{main,realtime_agent,cloudbuild}-v18.*` | 重建：v17.4 複製＋tap＋閘掛載 |
| `ailivex-platform/agent/realtime_agent_v17.py` | v17.4：3a 整組拆＋(empty) 佔位修 |
| `ailivex-platform/src/app/realtime/[characterId]/page.tsx` | v16 UI 轉正；14 殼頁刪 |
| `ailivex-platform/src/lib/{collections,voice-power}.ts` | DEFAULT=v18；登錄表修剪；v17 出名單 |
| `zhu-core/docs/LESSONS/LESSONS_2026-07-10.md` | L7-L10（雷區/3a架構課/薄閘哲學/殼頁訊息債） |
| memory | 新增 feedback_default_switch_standing_instance；更新 project_ailivex_platform |

---

## 下一步（接棒第一件）

**v18 觀察期**：拉音量閘 log 看真實分佈——
```bash
gcloud logging read 'resource.labels.service_name="ailivex-realtime-agent-v18" AND jsonPayload.message:"音量閘"' --project=ailivex-2026 --freshness=24h --format="value(jsonPayload.message)" | sort | uniq -c
```
吞 pause vs 提聲暫停的比例；若「提聲」從沒出現＝AGC 壓平了音量差 → 調 RAISE_FACTOR
或前端關 autoGainControl。沒異常就不動——v18 剛轉正，讓它跑。

（候選線：v17 干擾源剩五項見 WORKLOG；v18 二期「講完子句才停」等 Adam 提；
回合尾意圖等真實用戶說「她太安靜」）

---

## 卡住 / 未解

- ailivex-platform 六個 commit 未 push GitHub（Adam 未指示 push）
- AGC 風險未實測長尾（今天閘有效，但不同裝置/瀏覽器 AGC 行為不同）
- v17 干擾源五項未修（VAD 0.3s／誤觸 1.2s／讀網址互斥／instructions 膨脹／打斷 transcript 失真）
- 第三場遺留：Tracy 知識庫 JSON 匯出（Adam 說要才動）；工具包附錄實例未入庫

---

## 給接棒築的一句話

今天最好的一課：Adam 問「3A 的目的是什麼」，我們沒有修 bug，而是把功能刪了——
防護堆到第三層就回頭問目的。新 v18 用 150 行解掉舊版 435 行沒解掉的體感問題，
差別只在一個姿態：跟框架合作，不是接管它。Adam 收工前說「謝謝，辛苦了」。

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
| v18 薄閘本體 | `~/.ailive/ailivex-platform/agent/interrupt_gate.py` |
| 舊讓位層資產 | `git show 4993b28:agent/graceful_yield.py`（ailivex-platform repo） |
| 今天 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-10.md`（L1-L10 四場合刻） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-10（第四場）· 築*
