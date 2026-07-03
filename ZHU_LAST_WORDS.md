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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）

---

## 最新完成（2026-07-03，接 7/2 馬拉松）

**ailiveX 記憶系統四批強化（v15 = DEFAULT，全上線）：**
- 批次一對等性：語音記憶升一等公民（loader 補欄位救活死碼、寫路徑 embedding+去重、125 筆回填）
- 批次二檢索：六型混合計分（cosine×0.7+CJK bigram 詞彙×0.3+tier/importance）
- 批次三生命週期：resolved 判定（萃取順帶）+ 每日 cron `/api/cron/memory-maintenance`
- 批次四 v15：通話中動態想起（節流 45s/floor 0.5/top2/`[v15 recall]` log），左上角 v15 徽章
- **終極信號驗過**：語音講的「咖啡館手沖」「牧羊人」，文字檢索帶時間前綴撈得到
- **白皮書**：`ailivex-platform/docs/MEMORY_SYSTEM_WHITEPAPER.md`——給接手工程師把記憶功能移植到 ailive-platform（設計規範+踩雷+checklist），已交 Adam

**7/2 當天（同一口氣）：** podcast 超時根治（Cloud Run 三旗標）、語感三輪次+角色自審（A/B 驗證）、文字過濾器兩平台、音檔搬 worker、UDN podcast 全套移植+全站健檢四批（級聯刪除/watchdog/Brief版本server化/懶人包fire-and-forget事故根治）、voiceSettings 全管道、兩條新天條（驗證信號鑑別力／throttled Cloud Run 無 fire-and-forget）。

---

## 下一步

1. **Adam 測 v15**：撥打看開場接尾＋聊舊事看「想起」（log 信號 `[v15 recall] 想起 N 條`）。回滾＝`DEFAULT_VOICE_VERSION` 切回 'v14' + Vercel 重部（v14 未動）
2. **接手工程師移植 ailive-platform**：白皮書 §7 checklist、§8 雷區；答疑時先讓他跑「終極鑑別信號」（語音講→文字問得起來）
3. Adam 的文字過濾器文件（兩平台同源基因等灌）

---

## 卡住 / 未解

- **ailivex-platform + UDN platform 兩 repo 大量未 commit**（7/2-7/3 全部改動，Adam 沒說收版控）——接棒者別誤以為線上版=git 版，**線上比 git 新**
- 文字路徑缺 globalPrompts/lastSession 注入（語音有文字沒有的反向不對等，記帳）
- v15 動態想起未真機驗；UDN Phase B 圖卡文字未掛過濾標記（元件現成）
- zhu-core 有別 session 的 task-harness 檔案（已 commit 過，見 7/2 記錄）

---

## 天條快取（今天實戰過的）

- 模稜兩可信號≠成功證據：宣告修好前指出「只有修好才會出現的信號」
- throttled Cloud Run 上不存在 fire-and-forget（呼叫自己也一樣）；--set-env-vars 會洗機密用 --update-env-vars
- 語義去重雙門檻：cosine≥0.9 AND 逐字重疊≥0.5（純 cosine 對長篇敘事連環誤殺）
- 批次資料手術：先抽樣驗證、永不硬刪（archive+可溯欄位）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| **記憶白皮書** | `~/.ailive/ailivex-platform/docs/MEMORY_SYSTEM_WHITEPAPER.md` |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**未commit**）|
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**未commit**）|
| Task Harness | `~/.ailive/zhu-core/skills/task-harness/SKILL.md` |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-03 · 築（記憶系統戰役收官）*
