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

## 最新完成（2026-07-06 · 全日單場五線）

**1. ailivex 語音 v16 三連修（v16→v16.3 全部署，Adam 撥測收案）**
- v16 延遲三件：VAD prewarm＋idle=1（接通省 1-3s）、min_silence 0.4→0.3、TTS 首段 16 字/逗號提早 flush（共用檔加法改 `first_segment_max_chars` 預設 0）
- v16.1：說再見卡頓破案——六處工具裸同步呼叫堵 event loop → 全下放 to_thread（頓有兩型：CPU 飽和 vs event-loop 堵塞，鑑別信號不同，見 LESSONS L1）
- v16.2：3a 殭屍 timer（v6-v10 老雷復活）→ lifecycle 停止條件補齊
- v16.3：語音破音字 `_normalize_pronunciation` 釘 `_to_simplified` 收斂點
- 路由現況：token route＝`DEFAULT_VOICE_VERSION`＋access 覆寫制（**CLAUDE.md 記載的逐版分支已過時**）；access 25 docs 全未釘選＝用戶端自動跟隨
- 迭代紀錄：`ailivex-platform/docs/voice-v16-iteration.md`（P1-P8）

**2. Tracy 靈魂改寫（Adam 自存 4147 字，現場驗過）**
- 兩場本尊校準蒸餾：引擎三段（煙火氣原文：塑膠湯匙/屎坑/有事嗎）、口氣校準（catch→我想確認一件事）、教練姿態（給不給判準/收尾雙原則/可被依賴）
- soulCore 維持空＝**這角色不跑 enhanceSoul**（護煙火氣），raw soul 直上

**3. UDN 過濾器＋破音字（commit 743175f push，線上=git）**
- 先驗證兩功能正常（本機重放：5 句乾淨＋誘餌自證＋TTS 正規化輸出）
- 新增：破音字 3 條（混淆→混摇借音、划→画 兩條半）＋語意 pattern `spatial-interrogate`（往前一步追你）；抓/放六案全過
- worker rev 00005-g8w＋主平台皆部署

**4. ailivex 八落點同步**（lib×2、podcast-worker×2、doc-worker vendored、minimax_tts.py）——兩平台詞庫零分家，三台全部署

**5. 殭屍常駐大清洗（省 ~$963/月 ≈ NT$30 萬/年）**
- 全五 project 掃描：ailivex 14 台舊版語音＋jiangbin-agent＋ailive-realtime-agent 全是 min-instances=1 常駐燒錢 → 16 台降 0，複核全過
- 留三台有理由：v16（現役）、ailivex/udnnews podcast-worker（背景肌肉天條）
- 關鍵知識：**LiveKit agent 降 0＝聾不是慢**（主動連 LiveKit 領工，無 HTTP 喚醒）；版本紀律補「收案降常駐」步（LESSONS L4）

---

## 今天改了哪些檔案

| 檔案 | 改了什麼 |
|---|---|
| `ailivex/agent/{main,realtime_agent}_v16.py`＋`cloudbuild-v16.yaml`（新） | v16 三件＋to_thread×6＋3a 停止 |
| `ailivex/agent/minimax_tts.py` | 首段 flush 參數（加法）＋破音字表 |
| `ailivex/src/lib/{collections,text-filter,tts-normalize}.ts`＋chat 頁＋`realtime-v16/` 頁（新） | DEFAULT=v16＋詞庫同步 |
| `ailivex/cloud-run/podcast-worker/src/{text-filter,tts-normalize}.ts` | 同步 |
| `~/.ailive/ailivex-doc-worker/src/text-filter.ts` | pattern +1（獨立 repo，未 commit） |
| `ailivex/docs/voice-v16-iteration.md`（新） | 迭代紀錄 P1-P8 |
| UDN `platform/{lib,cloud-run/podcast-worker/src}/text-filter.ts`＋`tts-normalize.ts` | 破音字＋pattern（743175f 已 push） |

---

## 下一步

1. **ailivex 兩 repo commit**（等 Adam 說收）：platform 的 v16 批＋同步批（soulCore 批是別 session 的，依舊不碰）＋ doc-worker 1 檔
2. **v16 實戰觀察**：①搶話回報（min_silence 0.3 對講話慢的人）②有記憶寫入的通話說再見驗卡頓（簡報王那通零記憶寫入沒觸發鑑別信號，v16.1 嚴格說未驗）③prewarm 記憶體水位
3. **開新版 checklist**（LESSONS L3/L4）：歷代修法沉澱進共用模組＋vN 收案當天 v(N-1) 降常駐
4. （UDN）Brief 過濾器缺口、audit MEDIUM/LOW 遺留同前，7/18 上市日在即

---

## 卡住 / 未解

- ailivex platform＋doc-worker 未 commit（見上）；soulCore 批（別 session）未 commit 不碰
- v16.1 卡頓修復鑑別信號未在真實通話驗到（需有記憶寫入的通話道別）
- v16 log 每行重複兩次（P7，觀測噪音未修）
- CLAUDE.md（ailivex）語音路由記載過時（寫逐版分支，實際 DEFAULT 制）——下次動 ailivex 時順手修

---

## 天條快取（近幾天實戰過的）

- 「頓」分兩型：持續速率不足=CPU 飽和；尖峰與事件同框=event-loop 堵塞（同步呼叫下放 thread）
- 版本繁殖複製舊雷；立新紀律同 commit 回溯掃存量；vN 收案當天 v(N-1) 降常駐
- LiveKit agent 降 0＝聾不是慢；背景 worker 常駐是天條不能降
- 破音字借音法＋抓/放雙向測試；宣告修好前先指出鑑別信號（簡報王通差點犯，踩住了）
- throttled Cloud Run 無 fire-and-forget；firebase-admin 走 ADC

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md` / `ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md` |
| 最新 LESSONS | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-06.md`（L1-L5） |
| ailiveX | `~/.ailive/ailivex-platform/`（repo: linhocheng/ailivex-platform，**v16 批＋soulCore 批未 commit**）|
| ailiveX 部署 | web `npx vercel --prod --yes`；agent `gcloud builds submit --config=agent/cloudbuild-v16.yaml`；doc-worker `cd ~/.ailive/ailivex-doc-worker && bash scripts/deploy.sh` |
| v16 迭代帳 | `~/.ailive/ailivex-platform/docs/voice-v16-iteration.md` |
| UDN 工作台 | `~/Documents/UDN NEWS/platform/`（**已全 commit** 743175f；部署 `gcloud builds submit --config=cloudbuild.yaml --project=udnnews`；worker 部署=builds submit --tag + run deploy --image）|
| 遠端記憶 | `curl -s https://zhu-core.vercel.app/api/zhu-boot` |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-06 · 築（五線全收＋清磚 NT$30 萬/年；醉酒指數 0-1 全程清醒）*
