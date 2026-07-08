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

## 最新完成（2026-07-08 · 全天整合版——兩條平行 session）

**一句話**：全景圖一天推三棒——第三期遺忘曲線（v16.5.0）＋第 3.5 期語音道接通終驗收全綠（v17.0.0-.1）＋連線批次（v17.1.0）。語音道是 Adam 實打電話驗的：1514 字印象塊進通話、掛斷日記落庫 source=voice。

**A 場（本 session）：第三期遺忘曲線＋收前場尾（ailivex 0d518f3 v16.5.0）**
- v16.4.3 先收髒 tree：拔 soulCore 死碼（7/3 資料層已遷移，讀寫端全退單一 soul）
- `forgetting.ts`：emotionalWeight 確定性推導（type＋importance，不落庫、老資料立即受益）、門檻×(1+w)（情緒重的活兩倍長）、runGistPass（archive+30d+80字→Haiku 大意、程式蓋 content、原文留 rawContent、doc id 不變出處鏈可溯）
- memory-maintenance 接遺忘曲線＋gist pass（maxDuration 300、?dryRun=1）；fact/preference 去重放鬆（0.95/0.7 只擋近逐字，重述=強化信號給鞏固管線吸收）
- 驗證：合成 6/6 全綠、真資料 322 條零誤殺方向確認、prod dryRun 200、GIST_CANARY_USERS=Adam（env ls 驗存在，不信 empty 模稜兩可信號）

**B 場（平行 session）：第 3.5 期語音道＋連線批次（ailivex 37a0955 v17.1.0；agent v17）**
- 語音道：`/api/agent/memory-blocks`＋`/api/agent/diary-write` 端點；loader additive remote fetch（6s 逾時 fallback 本地，語音永不啞）；agent v17 進房並行 fetch＋掛斷三並行 finalize；電源開關擴管 CANARY_VOICE_VERSIONS=['v17']
- **終驗收全綠**（Adam 實打 v17×Lilith）：remote_blocks=hit＋diary source=voice 落庫（mood「平靜，但有一絲懸著沒落地的感覺」）
- 連線批次：extraction 收斂到 TS 唯一真相（Python fallback 保底）、promise 兌現裁決（resolved 擴到 promise）、confidence 顯式來源+0.1、日記沉澱（active>12 夜沉最舊 8 篇成「那段時間的我」）
- 版本確認：v17 是真實獨立服務（log 實錘）；14 舊版全 min=0 零常駐費

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| ailiveX `src/lib/forgetting.ts`（新） | 遺忘曲線＋gist 化引擎 |
| ailiveX `cron/memory-maintenance` | 接 emotionalWeight＋gist pass |
| ailiveX `src/lib/memory.ts` | fact/preference 去重放鬆＋extraction 收斂（B 場） |
| ailiveX `src/lib/collections.ts` | MemoryDoc +rawContent/gistedAt；VOICE_VERSIONS +v17 |
| ailiveX `api/agent/*`（新，B 場） | memory-blocks / diary-write / extract-memories 端點 |
| ailiveX `agent/main_v17.py` 等（B 場） | v17 語音 agent（remote 記憶塊＋掛斷日記） |
| ailiveX `scripts/_zhu_verify_forgetting.ts`（新） | 第三期 6 鑑別信號 |
| zhu-core `docs/LESSONS/LESSONS_2026-07-08.md` | L1 empty 模稜兩可設計預防、L2 平行 session 收尾要讀全天 WORKLOG、L3 白名單三犯未遂 |

---

## 下一步

**1. Adam 的驗收作業（最優先，只有他能做）**：再打一通 v17×Lilith——這通日記塊首次注入，驗「帶惦記」閉環。過了之後：v17 升 DEFAULT（連動 CANARY_VOICE_VERSIONS 拔除、v16 降 0 收雙暖機）。
**2. 明天查今晚 cron**：02:00 consolidation 第一次 support/contradict 混合輪＋03:00 maintenance 第一次帶遺忘曲線跑。
**3. 第四期：關係敘事＋空白感**（`cd ~/.ailive/ailivex-platform`，計畫在 WORKLOG 2026-07-07 全景圖段）。
**4. 待 Adam 確認的保留議題**：跨關係自我、觀測台（含日記隱私倫理題）、殘影態、_recall 吃印象層。

---

## 卡住 / 未解

- **ailivex working tree 有另一場的在途改動**（token route＋realtime-v16 page＋_zhu_verify_batch.ts）——不是我的，收尾時未動；接棒者先 git status 確認那場收了沒
- gist prod 真例要等 archive 情節滿 30 天自然出現（機制上線暗待）
- extraction Python 本地版退役：等 v17 升 DEFAULT
- admin voice-power GET 不顯示 canary 版 minInstances（觀測台第五期補）
- repo CLAUDE.md 語音版本表停在 v14★（第五期一併修）
- 前場遺留：podcast retry 按鈕實測、AR cleanup 容量驗證、UDN 429vs409 互動確認

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
| 全景圖語音道架構 | ailivex `docs/memory-panorama-voice-integration.md` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-08 · 築*
