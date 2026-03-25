# Adam V1.0 優化專案 — 工作日誌

> 特殊專案 · 啟動日期：2026-03-24
> 路徑：~/.ailive/adam-v1/Adam_V1.0/
> 生產 API：https://adam-api-560352628733.asia-east1.run.app

---

## Phase 狀態

| Phase | 目標 | 狀態 |
|---|---|---|
| Phase 1 | 記憶系統全面啟動 | ✅ 完成 |
| Phase 2 | 靈魂動態化 | ✅ 完成 |
| Phase 3 | Interrupt 正確處理 | ✅ 完成（待前端驗收）|
| Phase 4 | Observability | ✅ 完成 |

---

## Phase 1 進度

### 目標
- [ ] 開啟 AutoExtract（ENABLE_AUTO_EXTRACT=True）
- [ ] 每輪對話後語意搜尋相關記憶注入 context
- [ ] 驗收：說一件事，下次對話 Adam 記得

### 施工記錄


#### 2026-03-24 施工記錄

**修改 1：info_extractor.py — Gemini → Claude Haiku**
- 移除 `google-generativeai` 依賴
- `_call_extraction_llm` 改用 `anthropic.AsyncAnthropic`，model: `claude-haiku-4-5-20251001`
- 原因：GCP 沒設 Gemini key，且與主 LLM 統一 provider 更省事

**修改 2：ENABLE_AUTO_EXTRACT 透過 GCP env var 開啟**
- 不改程式碼預設值（保持 False 作為安全預設）
- 透過 `gcloud run services update` 注入 `ENABLE_AUTO_EXTRACT=true`

**待驗收：** 說一件事 → 下次對話 Adam 記得

#### 驗收結果 ✅

- 對話說「我叫 Adam，38 歲，住台北」
- 10 秒後查 profile：`name: Adam`, `age: 38`
- logs 顯示：`profile_updates: 5, events_added: 2, actions_added: 3`
- **Phase 1 驗收通過**

---

## Phase 2 進度

### 目標
- [ ] 靈魂文件存進資料庫
- [ ] llm.py 從 DB 動態載入 SYSTEM_PROMPT
- [ ] 加 /api/soul CRUD endpoint
- [ ] 驗收：改靈魂不需要 redeploy

### 施工記錄

#### 2026-03-24 Phase 2 施工記錄

**新增 CharacterSoul DB model**
- `character_souls` 表：character_id, name, soul_prompt, soul_core, version
- `Base.metadata.create_all` 啟動時自動建表

**新增 soul.py service**
- `get_soul_prompt(character_id)` — 記憶體快取 + DB + fallback 硬編碼
- `upsert_soul()` — 新增或更新靈魂，自動清快取
- `invalidate_cache()` — 強制重新載入

**修改 llm.py**
- `generate_reply` 改為動態載入：`active_prompt = get_soul_prompt("mckenna")`

**新增 soul API**
- `GET /api/soul/{character_id}` — 讀靈魂
- `POST /api/soul/{character_id}` — 更新靈魂（即時生效）
- `DELETE /api/soul/{character_id}/cache` — 清快取

**驗收：**
- API 更新靈魂 → 下一輪對話即時生效 ✅
- 不需要 redeploy ✅
- McKenna 完整靈魂已存回 DB ✅


#### 2026-03-24 Phase 3 施工記錄

**修改 ws.py — Interrupt Manager**
- 加 `current_turn_task: Optional[asyncio.Task]` 追蹤正在跑的 turn
- 偵測到新說話開始 → `current_turn_task.cancel()` → 送 `{"type": "interrupted"}` 給前端
- `process_turn` 加 `except asyncio.CancelledError` 靜默處理
- revision `adam-api-00033-khd` 上線

**Phase 3 狀態：** ✅ 程式碼完成，WebSocket 需前端測試驗收

---

## Phase 4 進度

### 目標
- [ ] turn.py 分段計時（STT / LLM / TTS 各自計時）
- [ ] 存進 TurnMetrics DB 表
- [ ] /api/metrics endpoint
- [ ] 驗收：能看到每輪的延遲分佈

### 施工記錄

#### 2026-03-24 已完成
- TurnMetrics DB model 加好（models.py）
- 欄位：stt_ms, llm_ms, tts_ms, total_ms, mode, success, error_stage

#### 下一個 session 繼續
1. turn.py `_generate_response` 加分段計時
2. `process_conversation` 存 TurnMetrics
3. 新建 `/app/api/metrics.py`
4. main.py 掛上 metrics router
5. deploy + 驗收


#### 2026-03-24 Phase 4 施工記錄

**修改 turn.py**
- `_generate_response` 加 `import time`，LLM / TTS 各自計時
- 回傳型別從 `tuple[str, str]` 改為 `tuple[str, str, dict]`
- `process_conversation` 解構三元組，背景呼叫 `_save_turn_metrics`
- 新增 `_save_turn_metrics` 函數存 TurnMetrics

**新增 metrics.py**
- `GET /api/metrics?limit=100`
- 回傳：total_turns, success_rate, latency 統計（avg/p50/p95/min/max）
- 分 llm_ms / tts_ms / stt_ms / total_ms

**驗收結果 ✅**
- 打 3 輪對話 → metrics 立刻有資料
- llm_ms avg=10504ms（瓶頸在 LLM）
- tts_ms avg=4662ms
- total_ms P95=18.9 秒

**revision：adam-api-00034-xsd**

---

## 全部 Phase 完成！🎉

| Phase | 狀態 | revision |
|---|---|---|
| Phase 1 記憶系統 | ✅ 完成驗收 | 00029 |
| Phase 2 靈魂動態化 | ✅ 完成驗收 | 00032 |
| Phase 3 Interrupt Manager | ✅ 程式碼完成（待前端驗收）| 00033 |
| Phase 4 Observability | ✅ 完成驗收 | 00034 |

## 下一步（技術遷移到 AILIVE）

根據計劃書第四章，可以開始把以下模組移植到 ailive-platform：
- 語音管線（STT→LLM→TTS）
- Interrupt 機制
- 靈魂動態載入架構
- Observability/metrics 設計

