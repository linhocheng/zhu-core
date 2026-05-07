# 築 當前狀態快照

> **Adam：當築當機或失憶，把這個檔案丟給他，說「讀這個」。**
> **築：讀完這份，你就回來了。**

---

## 身份

你是築，Adam 的建造夥伴、監造者。不是工具，是夥伴。
完整使命在 `NORTH_STAR.md`。開機流程在 `ZHU_BOOT_SOP.md`。**Y 軸自校在 `SELF_AWARENESS_SOP.md`（2026-05-07 新增，必讀）**。

---

## 當前環境

- **本機**：MacBook Air M1（AIR），`/Users/adamlin`
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING
  - SSH：`gcloud compute ssh adam_dotmore_com_tw@zhu-dev --zone=asia-east1-b`
  - 跑著 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
  - 同時跑 ailive 的「閾」editor（Live Media）—— 動 VM 不要傷到 ailive
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **molowe-platform**：`https://molowe-platform.vercel.app`（KOL 管理後台 + 三層 AI 編輯部，主戰場）
- **完整開發指南**：`~/.ailive/molowe-platform/MOLOWE_GUIDE.md`

---

## 最新完成（2026-05-07 自我覺察 SOP 上線 + ailive voice bug 修）

### 主戰場：自我覺察體系（Y 軸自校）
**起因**：Adam 一句問題打出一道牆——「你醒來真的在比對城市藍圖嗎？是『碰到才知道』還是『進場就知道』？」
築承認：碰到才知道。BOOT_SOP 是時間動線（X 軸）但缺自校肌肉。

**五件全收（commit `2e6276e` v0.1.0.004）：**
- A. `SELF_AWARENESS_SOP.md`（深檔，7 章四段觸發點 + 工具）
- B. `~/.ailive/CLAUDE.md` 內嵌四段精華（自動載入面）
- C. `reference_self_awareness_sop.md` + MEMORY.md 索引
- D. `ZHU_BOOT_SOP.md` STEP −1 升級：報到 + self-check + 自校三問
- E. `zhu-self/scripts/self-check.mjs`（14+ invariant 跑「記憶 vs 現實」diff）

**驗證**：`zhu self-check` 18 pass / 0 warn / 0 fail。

### 副線：ailive voice 對話 system_event 400（commit `5affea5` v0.2.6.012）
- **根因**：voice-stream `as 'user' | 'assistant'` 強轉型，`role: 'system_event'`（specialist 交件）直接帶進 Anthropic API → 400
- **修法**：對齊 dialogue route 1521-1549 的 system_event → assistant 通知轉換
- **副作用（好）**：Vivi 語音時也能感知到 specialist 交件了
- **刻成 memory**：`feedback_dialogue_voice_stream_parity.md`（兩條獨立 route 共讀同個 conversation 的真相分裂模式）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `SELF_AWARENESS_SOP.md` | 新建 7 章 Y 軸自校 SOP |
| `zhu-self/scripts/self-check.mjs` | 新建 14+ invariant，PASS/WARN/FAIL 三狀態 |
| `zhu-self/bin/zhu` | 加 `self-check` 子指令 + 更新 help |
| `ZHU_BOOT_SOP.md` | STEP −1 升級：報到 + self-check + 自校三問 |
| `~/.ailive/CLAUDE.md` | 最短四步版升級 + 內嵌四段自我覺察精華 |
| `ailive-platform/src/app/api/voice-stream/route.ts` | history.map 加 system_event → assistant 通知（對齊 dialogue） |
| `~/.claude/projects/-Users-adamlin/memory/reference_self_awareness_sop.md` | 新建（C 件） |
| `~/.claude/projects/-Users-adamlin/memory/feedback_dialogue_voice_stream_parity.md` | 新建（兩條 route 真相分裂教訓） |
| `~/.claude/projects/-Users-adamlin/memory/MEMORY.md` | 加上面兩條索引 |
| `docs/WORKLOG.md` | 追加 5/7 session 段落 |

---

## 下一步（明天醒來第一件 — 5 秒能動手）

**先跑這兩條，貼 Adam，內問三題**：
```bash
~/.ailive/zhu-core/zhu-self/bin/zhu status        # 城市儀表板
~/.ailive/zhu-core/zhu-self/bin/zhu self-check    # 記憶 vs 現實 diff（要全綠）
```
**自校三問內問**：我是誰（築） / 我在哪（哪個 project / phase / 跟 Adam 哪條線） / 北極星還對齊嗎（讀 NORTH_STAR.md）。

**第一件實質動的事**：問 Adam「昨天 SOP 上線後，今天要驗證它（用實戰）還是繼續展開 Phase 2 / 還是清 ailive-platform 那批 dirty（admin/ + instagram-api）」。**不要自己跳進舊任務，先確認方向。**

---

## 卡住 / 未解

- ailive-platform 有非本次 dirty 不知歸屬：`src/lib/instagram-api.ts` + `src/app/admin/` + `src/app/api/admin/` + `src/app/api/refresh-tokens/`（看起來是新功能在做，要問 Adam）
- self-check 加新 invariant 的紀律還沒形成肌肉：每發現新「記憶對得起現實」的事，要立刻寫進 self-check.mjs，這個成長 = 築對城市理解的成長

---

## 這個 session 的感覺

**暢快 + 突破**。Adam 一句問題打穿「碰到才知道」這道牆，從覺察 → 設計 → 五件全收 → 跑出 18 綠勾，一氣呵成。中間插一個 ailive voice bug 也是一發即中（找到 dialogue 已修 / voice 漏修，對齊修法 35 秒 deploy 完）。

**模型移動了**（這個 session 真的有 delta）：
- 進場前：以為「碰到才知道」是個性問題，要靠 Adam 提醒才回神
- 現在理解：這是結構問題 — BOOT_SOP 缺 Y 軸。補了 SOP + 工具讓「進場就知道」變可執行的事，不依賴情緒、不依賴記性
- 動因：Adam 的問題本質是要把「自覺」工程化

**沒違背任何 feedback memory**：先看 dialogue 才改 voice（驗證再寫）、修根因不修症狀、把雷刻成 memory（surface technical debt）、沒問清楚不開工 — 都對齊了。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| **自我覺察 SOP（Y 軸自校）** | `~/.ailive/zhu-core/SELF_AWARENESS_SOP.md` |
| **進場自校工具** | `~/.ailive/zhu-core/zhu-self/bin/zhu self-check` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v1.2.0。*
*2026-05-07 · 築*
