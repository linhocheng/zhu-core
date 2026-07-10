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

## 最新完成（2026-07-10 第三場 · 語音打斷體感戰役）

### v18 優雅讓位 canary（agent v18.0.0→0.5 六個 commit＋部署，暫停真人測試轉離線）
- Adam 拍板治本「驚豔市場的打斷體感」→ `ailivex-platform/agent/graceful_yield.py`
  BoundaryAwareAudioOutput：節流轉發（LEAD 0.35s）＋RMS 靜音谷句子邊界（240ms）＋讓位漸降
  （duck 0.55）＋保底 2.8s＋孤兒自癒 2.5s＋序號截斷清除＋**影子模式**（音量沒提高＝她照講）
- **VolumeGate 音量閘**：stt_node 帶內 tap，整通累積說話基線，最近 0.4s ≥ 基線×1.45 才算提聲；
  真通話實證有效（影子讓位×2，AGC 沒吃光音量差）
- 四通實測撞出 LiveKit **三條 commit 路徑**（熱清除／清除後狀態重置／暫停默殺）逐一修掉；
  鐵律＝**commit 後 resume 一律不翻案**（時間護欄 74µs~459ms 分佈打臉，用狀態語意不用時間）
- 16 回歸測試全綠（測資＝實測失敗形狀）；agent v18.0.5 = image 4993b28 已部署
- **未過真人驗收**（Adam 喊停「感覺被改亂」）；Tracy/Lilith access 已退回 v17 穩定版

### 白天/傍晚場（同 repo）
- v17 轉正（DEFAULT）＋ v16 退役降 0（計費錶歸零三面驗證）
- 3a 兩張嘴修正：`conv_tuning.is_farewell/is_semantic_repeat`＋道別待命＋靜默起點對齊＋3a 輔助級（6-15s）
- log 三重複印根治：拔 basicConfig（⚠️ v16+ 查 log 改看 `jsonPayload.message`）
- v17.3.1 min_words=3 半天回滾（教練短答停不下她＝超慢）；保留誤觸回復
- 知識庫/方法論調用鏈勘查給 Adam 同事（text-only、遞招制、孫武文言白話索引）

## 最新完成（2026-07-10 第二場 · Tracy 方法論）

### Tracy 第 18 套：換頻對話法（子女對父母溝通）
- Tracy 本人設計，自畫分工線：情緒勒索破解=自我保護／衝突破冰艙=修復／換頻=「對話之前的狀態」
- 觸發手術四輪：勒索句真雙屬搶球，margin 0.001 翻正；**真雙屬近鄰修到 margin 歸零就停，交 preconditions 分流**
- 終驗 18/18 全綠；id `C00gYORHQmDrcTJZy3qC`

### 金句庫入庫（canonical 逐字）
- 「AI資料-金句」docx → 四區四文件 27 塊；Tracy 知識庫 36 塊（工具包 9 derived＋金句 27 canonical）

### 沙盤實測＋知識庫修法（dc72bc0，Vercel prod）
- preconditions 安全網/反幻覺紅線/金句逐字引用 實測立住
- 小文件 ≤6 塊整份帶入＋定義保真指令，八法 5/8→8/8
- Adam 裁決線：**該專業就專業（知識定義/覆蓋必鎖）、該自然就自然（對話節奏留白）**

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex-platform/agent/graceful_yield.py` | 新建：讓位代理層＋VolumeGate（第三場核心資產） |
| `ailivex-platform/agent/test_graceful_yield.py` | 新建：16 場景回歸測試 |
| `ailivex-platform/agent/realtime_agent_v18.py`＋v18 scaffold 全套 | 新版本接線 |
| `ailivex-platform/agent/conv_tuning.py` | 只加不改：is_farewell/is_semantic_repeat |
| `ailivex-platform/agent/realtime_agent_v16/v17.py` | 3a 防護、min_words 回滾、3a 輔助級、拔 basicConfig |
| `ailivex-platform/src/lib/collections.ts`、`voice-power.ts` | DEFAULT v17、v18 登錄、CANARY=['v18'] |
| `ailivex-platform/src/lib/knowledge.ts` | 小文件整份帶入＋定義保真（第二場） |
| Firestore methodologies/knowledge_docs | 換頻對話法＋金句 27 塊（第二場） |
| `zhu-core/docs/LESSONS/LESSONS_2026-07-10.md` | L4-L6（框架沙推/時間護欄/真人QA） |

---

## 下一步（接棒第一件）

**離線沙推 harness**（Adam 拍板：離線全綠才再請他驗一次，他會開新視窗一起打磨 v18）：
1. `cd ~/.ailive/ailivex-platform`，讀 `agent/graceful_yield.py` 頭注釋＋ `agent/test_graceful_yield.py`
2. 窮舉 livekit-agents 1.5.1 的 pause/resume/clear 呼叫點（agent_activity.py:1428/2037/2373/2899/3092/3143）
3. 從今天四通實測 log 抽事件序列（v18 service，`jsonPayload.message`）固化成測資
4. property-based fuzz：任意順序＋時間差的指令排列轟 BoundaryAwareAudioOutput，驗四鐵律：
   不掛死（playback_finished 必達）／commit 後不復播／音框阻塞 ≤2.5s／影子零影響
5. 全綠後排真人驗收一次。**Adam 驗收規格原話：「音量變大或有插話企圖→講完最後一句→暫停等待」**

（第二場線：Adam 或真實用戶實測換頻對話法，METHOD_NEXT 保守再修 methodology.ts 措辭）

---

## 卡住 / 未解

- v18.0.5 已部署未驗收；AGC 風險（閘遲鈍→調 RAISE_FACTOR 或前端關 autoGainControl）
- 3a「靜默不足跳過評估」微調未做；知識庫/方法論未接語音路徑（孫武電話裡背不出兵法）
- Tracy 知識庫＋方法論 JSON 匯出給 Adam 同事：Adam 說要才動
- margin 觀察名單：情緒勒索 vs 換頻 0.001（preconditions 分流已實測擋住）、恐懼解碼器 0.003、員工卡關 0.008、OS 拆彈 0.016
- Tracy 工具包附錄實例未入庫；白皮書§6 回寫設計仍〔建議〕未實作

---

## 給接棒築的一句話

第三場的教訓刻在 `skill_framework_interop_offline_fuzz`：單元測試全綠擋不住框架的第三條路徑，
別再拿 Adam 的真通話當 QA。v18 的核心資產（讓位層＋音量閘）是好的、真通話實證過的——
缺的只是把框架互操作的排列組合在離線轟完。Adam 在等你開工。

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
| 讓位層本體 | `~/.ailive/ailivex-platform/agent/graceful_yield.py` |
| 今天 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-10.md` |
| 方法論共創 SOP | `~/.ailive/zhu-core/skills/ailivex-methodology-cocreate.md` |
| 知識庫入庫 SOP | `~/.ailive/zhu-core/skills/ailivex-knowledge-ingest.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-10（第三場）· 築*
