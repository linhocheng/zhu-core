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
- **雲端 VM**：`zhu-dev`，GCP asia-east1-b，RUNNING（claude-bridge systemd，`https://bridge.soul-polaroid.work`；e2-medium，IP 已升靜態 bridge-static）
- **記憶 canonical**：`~/.claude/projects/-Users-adamlin/memory/`
- **zhu-core**：`~/.ailive/zhu-core/`（git repo）
- **監造儀表板**：https://zhu-mid.vercel.app（密碼見 Vercel env `ZHU_MID_PASSWORD`）

---

## 最新完成（2026-07-07 第四場 · UDN 四功能＋ailive 記憶調查）

**一句話**：手機遙控修 UDN 燒錢口＋三個產品功能全上雲，轉場調查 ailive 記憶系統對比 mem0，結論「不用 mem0、只缺矛盾裁決」。

**1. UDN 議題台（repo linhocheng/udnnews-platform，rev 00078 上雲已驗）**
- 防連按閘：dispatch＋generate-audio 雙 409（`hasRunningTask` / `hasRunningAudioForParent`），MiniMax 燒錢口關上
- 純文字來源：DataSource 加 `'text'` 型，建立議題可貼 FB 貼文直送周映辰分析
- 議題回溯編輯：`/projects/[id]/edit`（表單抽共用 ProjectForm），PATCH 擴充全欄位
- 概覽快速補充：`QuickAddSources` + `POST /api/projects/[id]/sources` 增量端點（只收新來源，跨次去重）；收集核心抽 `lib/collect-core.ts`
- **雷區已刻 `platform/AGENTS.md`**：git push≠上雲（無 trigger 必手動 builds submit）、builds submit 打包工作目錄非 commit（髒樹雷）、git root 在上層、tsc 過濾 .next 噪音

**2. ailive 記憶調查（只勘查未動手）**
- 睡眠引擎已有完整園丁：雙門檻去重（cosine≥0.9＋bigram≥0.5）、三層 tier 衰減（30/60/7天）、rootRelevance 護欄、mergedInto 審計鏈
- **結論：不需要 mem0**。唯一缺口=矛盾裁決（「住台北」vs「搬高雄」雙門檻抓不到）
- 提案待 Adam 拍板：sleep-engine 加一步——程式聚類 cosine 0.7-0.9 灰區→LLM 判斷題→程式寫 `supersededBy`＋降 archive
- 隱患觀察：①loadEpisodicBlock 先撈最近 50 條再 RRF（老 core 記憶掉窗=盲區）②task-run 自己撈最近 5 條（與 dialogue 兩條讀路徑，真相分裂種子）

**3. 今日全天四場摘要**（詳見 WORKLOG 四段）
- 第一場：Vercel 全平台安全加固（三平台修復上線）
- 第二場：費用拆磚＋bridge IP 事故修復＋podcast 任務控制（醉酒 16 停手）
- 第三場（別 session）：UDN 額度閘（quota.ts，commit a110efb 已進倉）
- 第四場（本場）：如上

---

## 今天改了哪些檔案（第四場）

| 檔案 | 改了什麼 |
|---|---|
| UDN `lib/firestore.ts` | hasRunningTask / hasRunningAudioForParent 兩查詢 |
| UDN `app/api/tasks/dispatch/route.ts` | 409 防連按閘 |
| UDN `app/api/tasks/[id]/generate-audio/route.ts` | 409 防重複 TTS |
| UDN `lib/types.ts` | DataSourceType 加 'text'＋label? |
| UDN `components/ProjectForm.tsx`（新） | 建立/編輯共用表單 |
| UDN `app/projects/[id]/edit/page.tsx`（新） | 議題編輯頁 |
| UDN `lib/collect-core.ts`（新） | 收集核心（兩入口共用） |
| UDN `app/api/projects/[id]/sources/route.ts`（新） | 增量補充端點 |
| UDN `components/QuickAddSources.tsx`（新） | 概覽快速補充 UI |
| UDN `AGENTS.md` | 部署 SOP＋雷區刻入 |
| 全局記憶 `project_udnnews_platform.md` | 今日追加＋Deploy SOP 修正 |

---

## 下一步

**若 Adam GO ailive 矛盾裁決**：開新 session（生產睡眠引擎，別在疲勞尾盤動）。入口：
1. `cd ~/.ailive/ailive-platform && cat src/lib/sleep-engine.ts`（約 400 行，合併邏輯在 186-222 行附近）
2. 加 step：同 characterId+userId、cosine 0.7-0.9 且未觸發雙門檻的配對 → bridge LLM 判斷題（同件事嗎/矛盾嗎/哪條現況）→ 程式寫 `supersededBy` 欄位＋輸家降 archive（仿 mergedInto 姿勢，永不硬刪）
3. 先 dry-run 一個角色看誤判率再全量（一吋蛋糕）

**否則**：正常醒來全檢。UDN 7/18 上市線由額度閘 session 繼續。

---

## 卡住 / 未解

- ailive 矛盾裁決：等 Adam 拍板，未動手
- ailive 兩隱患（50 條檢索天花板、task-run 讀路徑分裂）：觀察在案未修
- 前場遺留：podcast retry/刪除按鈕實測、AR cleanup 容量驗證（24h 後）、語音 auto-off 自然觸發、UDN 額度閘與 409 閘互動確認
- MOLOWE 5c pending order（2026-05-05 建，molowe 已停）：建議 Adam 作廢或明示復活

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
| UDN 部署雷區 | `~/Documents/UDN NEWS/platform/AGENTS.md` |
| 今日教訓 | `~/.ailive/zhu-core/docs/LESSONS/LESSONS_2026-07-07.md`（L1-L9） |

---

*每次 session 結束前由 /last-words skill 更新。格式版本 v2.0.0。*
*2026-07-07 · 築*
