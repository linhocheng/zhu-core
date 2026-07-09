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

## 最新完成（2026-07-10）

### Tracy 方法論全案（17 套）＋知識庫，全平台第二個滿配角色
- 賴婷婷工具包 → Tracy 本人四批共創 17 套方法論（A 對自己 5／B 帶團隊 6／C 溝通 4／D 問題解決 2），每批 Adam 過目才入庫
- 終驗全綠：觸發 17/17、誤觸 0、交叉矩陣對角線全贏；margin 觀察名單四套（恐懼解碼器 0.003 最緊）
- 工具包 9 塊入知識庫（derived），驗收三件套＋方法論並存不互咬
- 觸發 desc 七輪手術淬出規模化心法 → 刻 memory `skill_methodology_trigger_scale` ＋ cocreate skill 規模化章節
- 新雷：gist 批次模型會「反問」不回 JSON → ingest skill 雷區第 9 顆

### 對外交付三件套（給 Adam 工程部朋友的 AI）
- 三管線架構白皮書（原理＋ailivex 參考值＋回寫設計標〔建議〕）
- 方法論共創 runbook＋記憶系統 runbook（含失敗速查表）
- 在 scratchpad：`character-methodology-knowledge-whitepaper.md`、`skill-methodology-authoring.md`、`skill-memory-system.md`，已傳 Adam

### 破音字四落點同步（7/9 場，v17.2.1，b6125c7）
- Python 版補齊 5 條＋年份逐字化，抽出 `agent/tts_normalize.py`；測試向量 TS/Python 各 5 條固化；v16/v17 重部署驗過；兩版字庫文件已交朋友

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| Firestore `methodologies` ×17 | Tracy 方法論全庫（id 見 scratchpad tracy/progress.md） |
| Firestore `knowledge_docs/ccEfRaC126wieiyeY5mZ` | Tracy 工具包 9 塊 |
| `memory/skill_methodology_trigger_scale.md` | 新 memory：觸發區辨規模化 |
| `zhu-core/skills/ailivex-methodology-cocreate.md` | 補規模化章節 |
| `zhu-core/skills/ailivex-knowledge-ingest.md` | 雷區第 9 顆 |
| scratchpad 三件（白皮書＋兩 runbook） | 對外交付，session 清空會消失——內容精華已在兩個 skill 檔＋memory |

---

## 下一步

**Adam 實測 Tracy**：自然帶著觸發態的話去聊（「我手上有兩個 offer 想了三個禮拜」），看遞招→出招→走步→收手整條鏈。遞錯就查 margin 觀察名單四套（恐懼解碼器/員工卡關教練/OS 拆彈術/情緒勒索破解），修它們的 triggerDesc（鎖簽名，不加場景、不動 τ）——修法見 memory `skill_methodology_trigger_scale`。

---

## 卡住 / 未解

- Tracy 工具包附錄實例（MECE 餐廳/5W3H/KISS 烘焙店）未入知識庫，Adam 要再補
- 白皮書第六部「方法論完成→milestone 記憶」回寫是〔建議〕未實作——ailivex 要不要做等 Adam 排
- scratchpad 的三件對外文件是 session 目錄，若要長期保存需搬 repo（Adam 已收到檔案，非阻塞）

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
| 方法論共創 SOP | `~/.ailive/zhu-core/skills/ailivex-methodology-cocreate.md` |
| 知識庫入庫 SOP | `~/.ailive/zhu-core/skills/ailivex-knowledge-ingest.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-10 · 築*
