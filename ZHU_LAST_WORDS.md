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

## 最新完成（2026-07-07 第五場 · 一天三案）

**一句話**：上午修 ailive 矛盾裁決，下午 Adam 拍板北極星路線——ailiveX 記憶全景圖六期施工計畫，當天連打兩期上線。

**1. ailive 睡眠引擎矛盾裁決（f996da7，prod 驗證全綠）**
- step 2b：灰區配對→Haiku 判斷題→supersededBy 降 archive；備忘錄防重審；/api/sleep 補鎖（worker-secret/operator）
- 合成 4/4（含時間線索反向陷阱）＋Vivi 200 條零誤殺

**2. ailiveX 記憶全景圖（北極星設計＋六期計畫，task #1-#5）**
- 終態四層：情節（episodes）→印象（impressions 信念制）→關係敘事→角色自我；夜間鞏固管線像人睡覺消化
- **第一期✅ 角色日記**（c63301b v16.3.0）：對話後角色第一人稱寫日記＋沒說出口＋想跟進，下次注入——「上次我就想問你」。DIARY_CANARY_USERS=Adam
- **第二期✅ 印象層＋鞏固管線**（50e9945→8110f07 v16.4.0-.2）：情節消化成信念、confidence 確定性計算、◆◇～・信心口吻進 prompt、矛盾裁決在信念層 O(n)（不需備忘錄）、cron 台北 02:00。首輪真跑 14 配對 118 情節→58 印象零錯誤；Adam×Lilith 88 情節→35 印象。IMPRESSION_CANARY_USERS=Adam
- 現場事實：ailive（moumou-os）與 ailiveX（ailivex-2026）完全獨立，資料零共享；Adam userId=mX56wM0CxRIMHlKgs2d0

**3. 醉酒指數 4-6 主動停手**：第三期是資料手術（改寫記憶內容），留給神清氣爽的築。

---

## 今天改了哪些檔案（第五場）

| 檔案 | 改了什麼 |
|---|---|
| ailive `src/lib/sleep-engine.ts` | step 2b 矛盾裁決＋judgeContradiction 抽出 |
| ailive `api/sleep`+`runner` route | maxDuration 300＋sleep 補鎖＋task-run 帶 worker-secret |
| ailiveX `src/lib/diary.ts`（新） | 角色日記讀寫＋canary |
| ailiveX `src/lib/impressions.ts`（新） | 印象讀取＋confidence＋信心標記 |
| ailiveX `src/lib/consolidation.ts`（新） | 夜間鞏固引擎（四操作＋watermark） |
| ailiveX `cron/memory-consolidation`（新） | 02:00 管線＋dryRun＋單配對參數 |
| ailiveX `memory.ts`/`collections.ts`/`middleware.ts`/`vercel.json`/`firestore.indexes.json` | 印象模式接線＋schema＋PUBLIC_PATHS＋排程＋兩顆複合索引 |
| 全局記憶 `reference_bridge_v1messages_effort.md` | 補 bridge 延遲實測（冷34s/暖7.5s） |

---

## 下一步

**第三期：遺忘曲線＋模糊化＋信心語氣（開新 session，資料手術級）**
1. `cd ~/.ailive/ailivex-platform`，讀 `src/lib/impressions.ts`（confidence 公式在此）＋`api/cron/memory-maintenance/route.ts`（衰減 cron）
2. 施工項：①emotionalWeight 進衰減公式（情緒記憶衰減慢）②老情節 gist 化（LLM 寫大意、程式蓋 content、原文留出處鏈不硬刪）③寫入去重可放鬆（鞏固管線會吸收近似重複）
3. 全景計畫全文在 WORKLOG 2026-07-07「記憶全景圖施工計畫」段；task 工具裡 #3-#5 排隊中
4. 姿勢沿用：canary env、合成資料驗真陽性、真資料驗零誤殺、私人內容只印結構信號（L13）

**日記/印象驗收（Adam 的作業）**：ailivex 跟 Lilith 文字聊一場→查 diary collection 出現文件→隔天再聊看她帶惦記。

---

## 卡住 / 未解

- ailiveX 第三～六期未動工（遺忘/關係敘事/語音收斂/再鞏固＋回灌 ailive 評估）
- 矛盾裁決 prod 真例未自然出現（兩平台合成例都驗過真陽性）
- 語音路徑的日記/印象未接（留第五期 loader 收斂時一起）
- 前場遺留：podcast retry 按鈕實測、AR cleanup 容量驗證、UDN 429vs409 互動確認
- 今晚 02:00 ailiveX 鞏固 cron 首次自動跑（剩餘配對接棒），明天可查 log 確認

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
| 記憶全景圖計畫 | WORKLOG 2026-07-07 第五場「施工計畫 v1.0」段 |
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-07.md`（L1-L13） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-07 · 築*
