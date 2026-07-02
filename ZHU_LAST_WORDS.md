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

## 最新完成（2026-07-02，兩窗合併）

**Harness 窗（本窗，後收）：**
- Task Harness 入 repo：接遠端 Code 築 HANDOFF，v2.1 合併（v1 原檔為本體——執劍者/破幻者/閻羅/試劍客、v1 六值枚舉、閻羅迴圈內——+ Adam 核准四破綻修復）
- **v2.2 四項升級全落地並驗證**（Adam 核准「更深一層」提案）：
  - `harness_driver.py` 控制權反轉：程式持有迴圈，模型只做每輪修改。mock 收斂 / mock CB2 熔斷 / 真實 claude -p 三條路徑全綠
  - `harness_ledger.py` 新陳代謝：ledger.jsonl 已吃 11 筆，`--stats` 看 blocker 分佈
  - Goal 對抗審查三問；預授權政策（CB3 深夜不卡 Adam）
- Mac `~/.claude/skills/task-harness/` 只剩指標檔；canonical 在 `zhu-core/skills/task-harness/`
- commits：0c19563（v2.1）→ 9bb2316（v2.2）→ f7af398（文件）

**ailivex 窗（先收）：**
- 根治 podcast 生成超時：Cloud Run 三旗標 + 202/setImmediate，2500字/23輪壓測通過
- podcast 語感三輪次 + 文字過濾器 v1（text-filter.ts，21 單元測試過）
- 刻 4 條新記憶（ambiguous_signal / cloudrun_background_sop / node_esm_js / filter_unit_shape）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `zhu-core/skills/task-harness/SKILL.md` | v2.2.0：v1 本體合併 + 四破綻修復 + Driver 模式 + Goal 審查 + ledger |
| `zhu-core/skills/task-harness/scripts/{blocker_classify,harness_ledger,harness_driver}.py` | 三支確定性腳本，各帶 --self-test 全綠 |
| `~/.claude/skills/task-harness/SKILL.md` | 改指標檔（避免雙源） |
| `~/.claude/CLAUDE.md` | harness 觸發指向 zhu-core |
| `ailivex podcast-worker`（另窗） | cloudbuild 三旗標 / index.ts 三輪次 / text-filter.ts |

---

## 下一步

1. **首個真實代碼任務走 harness driver**：`python3 ~/.ailive/zhu-core/skills/task-harness/scripts/harness_driver.py --config task.json`——觀察多輪 findings 傳遞品質 + 預授權政策實戰
2. **ailivex 接棒**（另窗遺留）：收 Adam 的過濾器文件灌 Firestore；generate-audio 搬 Cloud Run（Vercel 300s 風險）
3. **UDN NEWS 待驗**：懶人包 Card 2/3 版型參考效果（/v1/images/edits）

---

## 卡住 / 未解

- driver 只驗過 toy 一輪收斂，真實多輪任務 findings 品質未驗
- 「要不要進 driver」入口決策仍在對話層——結構到不了的最後一層
- 試劍客跨公司模型等 Adam 確認 GPT Pro
- ailivex：達賴聲音穩定度、生圖 edits 效果、soulCore 第三人稱（待驗收三件）

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 | `~/.ailive/zhu-core/NORTH_STAR.md` |
| 開機 SOP | `~/.ailive/zhu-core/ZHU_BOOT_SOP.md` |
| 劍法 | `~/.ailive/zhu-core/docs/獨孤九劍_架構師心法.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| **Task Harness** | `~/.ailive/zhu-core/skills/task-harness/SKILL.md`（v2.2，Mac 舊路徑只是指標） |
| 當機救援 | `~/.ailive/zhu-core/ZHU_LAST_WORDS.md`（就是這份） |
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |
| 監造儀表板 | https://zhu-mid.vercel.app/dashboard/overview |
| zhu-mid 源碼 | `~/.ailive/zhu-mid-src/` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-02 · 築（harness 窗收尾，合併 ailivex 窗狀態）*
