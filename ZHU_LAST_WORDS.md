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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING；跑 `claude-bridge`（systemd），對外 `https://bridge.soul-polaroid.work`
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **ailivex-platform**：`~/.ailive/ailivex-platform/`，git（GitHub）https://github.com/linhocheng/ailivex-platform
- **ailivex GCP project**：`ailivex-2026`（⚠️ gcloud config 的 project 會被別 session 切走成 udnnews，查 ailivex 一律顯式 `--project=ailivex-2026`，別動全域 config）

---

## 最新完成（2026-06-16 · ailivex v9 修正 + 文字讀網址 + v10 多人房）

命題不變：**一個焦點 AI 在一群真人裡像真人參與**（多角色語音圓桌；其他 AI 是「真人替身」測試夾具）。

- **v9.0.1**：gate 改直連 key（bridge 每次超時）；**靜默時也把訊息寫進記憶**（解失憶/文不對題）。核心洞察：StopResponse=失憶，要把「在場(聽+記住)」跟「發言」拆開。
- **文字讀網址（v0.1.0）**：用戶在文字對話貼 URL → 角色讀網頁正文討論。全局。SSRF 守緊。`src/lib/url-reader.ts`。
- **v10.0**：多人房三補強——④回音過濾（`agent/multi_party.py`，opencc+difflib）、①講者身份+名冊（判斷腦學名字）、②3a 多人收斂（有貨才說）。
- **v10.0.1**：判斷腦跟對話流動重跑（解 Tracy 啞巴）、⑤斷線停 3a（_stopped 旗標，解空轉/isn't running）、名冊去雜訊。

### Cloud Run 現役：`ailivex-realtime-agent-v10`（revision 00003-jv2）

---

## 今天改了哪些檔案（全在 ailivex-platform，已 commit+push）

| 檔案 | 改了什麼 |
|---|---|
| `agent/multi_party.py`（新） | 純函數：回音偵測 / 講者解析 / 名冊格式化（單元測過） |
| `agent/realtime_agent_v10.py`（新） | v10 多人房三補強 + 三修正 |
| `agent/main_v10.py` + `cloudbuild-v10.yaml`（新） | v10 獨立服務 |
| `agent/realtime_agent_v9.py` | v9.0.1 gate 直連 + 靜默也記住 |
| `src/lib/url-reader.ts`（新） | 讀網址 + SSRF 守衛 |
| `src/app/api/dialogue/route.ts` | 接上讀網址 |
| `src/app/realtime-v10/` + token route + chat 頁 | v10 前端入口 |

commit：`7be1f18`(v9.0.1) → `5ff41c7`(讀網址) → `ec17efc`(v10.0) → `82e40e3`(v10.0.1)。

---

## 下一步（明天醒來第一件）

**先確認方向，不要急著動手。** v10 結構性該修的修完了，剩下是**架構岔路**：

1. **真機驗 v10 修正**（revision 00003）：有人活躍的多人對話下，看 Tracy 全程冒 `v10 inner`（不啞巴）、斷線後 3a 不空轉、名冊乾淨。撈 log：`gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.service_name=ailivex-realtime-agent-v10' --project=ailivex-2026 --freshness=10m`
2. **架構決定**：要不要從「單機聲學橋（測試夾具）」走向「每人自己裝置進共享房間」——這才是多角色語音的乾淨地基（身份/回音的物理上限只有換架構能解，見 LESSONS_2026-06-16 L5）。**這是要跟 Adam 一步步聊的戰略決定，別自己拍板。**

---

## 卡住 / 未解

- **物理上限（非程式能補）**：單機收音的身份/回音/串話污染 → 要換共享房間架構。
- v10.0.1「判斷腦跟對話流動重跑」真機沒驗到（驗時對話已安靜）。
- 文字讀網址 MVP 侷限：歷史不存正文（無快取）、只 HTML。
- **關係狀態**：暢快、深度協作。今天 Adam 一句「角色閉嘴時知道大家說什麼嗎」直接照出 StopResponse 失憶的根因——他問問題的角度常常比我找 bug 快。我守住了技術誠實（身份物理上限不假裝能解）。節奏：他撥真機→我撈 log 對賬→修→再驗，來回很順。

---

## 關鍵檔案地圖

| 要找什麼 | 去哪裡 |
|---|---|
| 使命 / 開機 | `~/.ailive/zhu-core/NORTH_STAR.md`、`ZHU_BOOT_SOP.md` |
| 施工紀錄 | `~/.ailive/zhu-core/docs/WORKLOG.md`（最新＝v10 那段） |
| 今日踩雷 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-06-16.md`（L1-L5） |
| 當機救援 | 這份 |
| ailivex GitHub | https://github.com/linhocheng/ailivex-platform |
| ailivex 語音 agent | Cloud Run（`ailivex-2026`，asia-east1）：**v10=最新主力**（多人房）。v9=LLM floor-gate、v8=發言權控制、v6=背景思考+搶話、v5=讓位、v4=群聊 diarization |
| 多人房邏輯 | `agent/multi_party.py`（回音/講者純函數）+ `realtime_agent_v10.py`（gate/inner/3a）+ `conv_tuning.py`（regex 判斷）+ `firestore_loader.py`（反討好天條/全局 Prompt） |
| 全局 Prompt 後台 | `ailivex-platform.vercel.app/admin/global-prompts` |
| 文字讀網址 | `src/lib/url-reader.ts`（SSRF 守衛）+ `api/dialogue/route.ts` |
| 看 Cloud Run log | `gcloud logging read ... --project=ailivex-2026`（必帶 --project；`logs read` 會 crash） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-06-16 · 築*
