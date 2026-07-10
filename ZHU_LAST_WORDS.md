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

## 最新完成（2026-07-10 第二場）

### Tracy 第 18 套：換頻對話法（子女對父母溝通）
- Tracy 本人設計，自畫分工線：情緒勒索破解=自我保護／衝突破冰艙=修復／換頻=「對話之前的狀態」（清雜訊→分今昔→終點設自己→備切換句→我開頭→收尾句）
- 觸發手術四輪：勒索句（我媽+我養你這麼大）真雙屬搶球，最終 margin 0.001 翻正；**L4 新心法：真雙屬近鄰修到 margin 歸零就停，交 preconditions 分流**
- 終驗 18/18 全綠；id `C00gYORHQmDrcTJZy3qC`

### 金句庫入庫（canonical 逐字）
- 「AI資料-金句」docx → 程式去重去雜訊 → 四區四文件 27 塊：複利領導/敏感度領導/換框思維力/換框八法
- Tracy 知識庫 36 塊（工具包 9 derived＋金句 27 canonical），驗收全過

### 沙盤實測（親自下場當用戶）＋ v18.0.4 修法
- 實測立住：preconditions 安全網（誤遞目標對頻器她不接）、反幻覺紅線（缺 3 法她說「不編出來騙你」）、金句逐字引用
- 抓到專業缺口修上線（dc72bc0，Vercel prod）：小文件 ≤6 塊整份帶入＋定義保真指令，八法 5/8→8/8、視覺/空間換框定義歸位
- Adam 裁決線：**該專業就專業（知識定義/覆蓋必鎖）、該自然就自然（對話節奏留白）**

### 另一 session 同日完成（WORKLOG 有記）
- ailivex v16 3a「兩張嘴打架」修正（97877ef，rev 00032-kvk）

---

## 今天改了哪些檔案（第二場）

| 檔案 | 改了什麼 |
|---|---|
| Firestore `methodologies/C00gYORHQmDrcTJZy3qC` | 換頻對話法 6 步；勒索破解 desc 補強重嵌 |
| Firestore `knowledge_docs` ×4 + chunks ×27 | 金句庫 canonical |
| `ailivex-platform/src/lib/knowledge.ts` | 小文件整份帶入＋定義保真（v18.0.4 dc72bc0 已部署） |
| `zhu-core/docs/LESSONS/LESSONS_2026-07-10.md` | 追加 L4-L6 |
| scratchpad `tracy/progress.md` | 全程留底（id/手術記錄/沙盤記錄） |

---

## 下一步

**Adam 或真實用戶實測換頻對話法**：自然說「回家想跟我爸談健康檢查，但每次講沒幾句就吵起來」，看遞招→出招→走步。若 METHOD_NEXT 過度保守（一直卡第 1 步），修點在 `src/lib/methodology.ts` 進行中塊的措辭（加「對照判準：對方最近的話已滿足就這輪發 [[METHOD_NEXT]]」）——Adam 已裁定此屬自然範疇，等實測數據再動。

---

## 卡住 / 未解

- margin 觀察名單（實測遞錯先查）：**情緒勒索 vs 換頻 0.001（最緊，真雙屬，靠 preconditions 分流——已實測擋得住）**、恐懼解碼器 0.003、員工卡關 0.008、OS 拆彈 0.016
- 金句求助句（帶「成果/低潮」狀態詞）會誤遞方法論——安全網實測成立，暫不修 desc
- Tracy 工具包附錄實例（MECE 餐廳/5W3H/KISS 烘焙店）仍未入庫
- 白皮書§6 回寫設計（方法論完成→milestone 記憶）仍為〔建議〕未實作

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
*2026-07-10（第二場）· 築*
