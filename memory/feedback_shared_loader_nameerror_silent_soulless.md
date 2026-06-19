---
name: 共用 loader 的 NameError 被 try/except 吞掉→全版本靜默斷靈魂(244字fallback)
description: agent build_system_prompt(共用檔)被某 vN 新功能塞了不在函式 scope 的變數(user_id/character_id)→NameError→entrypoint 的 try/except 吞掉→退回 244 字 FALLBACK_PROMPT 通用無靈魂;因檔案共用,連預設版 v12 一起中招;text 路徑不受影響(不同路);Cloud Run log 簽名=「using fallback: name 'X' is not defined」+「soul=244 chars」
type: feedback
originSessionId: 5b2da2b6-04e7-40f3-bdbd-89660277f607
---
ailiveX 語音 agent「角色完全不記得自己、沒有靈魂」的根因（2026-06-19，張立 v13/v12）。

**根因（Cloud Run log 確定性抓到，不是猜）**：`agent/firestore_loader.py` 的 `build_system_prompt(char, conv, memories, relationship=None)` 簽名**沒有** `user_id`/`character_id`，但 v13 新增的「已完成背景任務通知」區塊在函式體內寫 `build_task_notifications_block(user_id, character_id)` → Python 求值參數時就拋 `NameError: name 'user_id' is not defined`。`build_task_notifications_block` 內部的 try/except 救不到（錯誤發生在呼叫**之前**的參數求值）。這個 NameError 往上冒到 `entrypoint` 的 `try: ... except Exception: logger.error("Firestore load failed, using fallback")` → 整個角色載入被吞掉 → `system_prompt = FALLBACK_PROMPT`（244 字通用 prompt，無靈魂、無記憶）。

**為什麼炸一片不只一個版本**：`firestore_loader.py` 是**所有語音版本共用**（CLAUDE.md 明列的 SHARED 檔）。bug 行一旦進共用檔，**任何在那之後重 build 的版本都中招**——本案 v12（DEFAULT_VOICE_VERSION，真實用戶預設版）+ v13（測試版）都壞（都 06-18 部署，晚於 bug 行）；v10/v11（06-16，早於 bug）乾淨。**text 聊天完全不受影響**，因為走 `/api/dialogue` + `src/lib/memory.ts` 是另一條獨立路徑（驗證時先用 bridge 實測 text 路徑回了滿滿在角色裡的張立，才把火力鎖到語音端）。

**Log 簽名（下次秒認）**：
```
ERROR - Firestore load failed, using fallback: name 'user_id' is not defined
INFO  - Agent initialized, soul=244 chars      ← 244 = FALLBACK_PROMPT 的長度,看到就是斷靈魂
```
正常長相是 `Loaded character=<名> ... soul_chars=NNNN` + `soul=幾千 chars`。

**修法（back-compat，不破舊版）**：共用函式新增的依賴一律走 optional 參數預設舊行為——`build_system_prompt(..., user_id="", character_id="")`，呼叫前 `if user_id and character_id:` 才跑 task block；只有 v13 caller 傳入兩個 id。v2–v12 positional 呼叫不傳 → 跳過 → 維持它們本來就沒有任務通知的行為。對應天條：共用檔只能加 optional 預設舊行為，不能硬塞新必需依賴。

**心態**：`except Exception: 用 fallback` 是靜默降級陷阱——它讓「角色載入整段炸掉」看起來像「正常啟動」，只差 soul 從 7000+ 變 244。fallback 分支至少要在 log 印出**被吞的真正 exception**（這次有印 `name 'user_id' is not defined` 才救了診斷）；更好是讓「載入失敗」變成可觀測的告警，而不是繼續用空殼服務真實通話。對應 `feedback_silent_failure_absent_log`。

**觸發信號**：角色「不記得自己/沒靈魂/語氣變通用 Claude」；語音 agent 改了共用 `firestore_loader.py` 或 `build_system_prompt`；Cloud Run log 出現 `using fallback` 或 `soul=244 chars`；某 vN 新功能在共用函式裡引用了不在簽名的變數。診斷 SOP：先分清 text vs 語音是哪條路斷（text 走 dialogue/bridge、語音走 Cloud Run firestore_loader），再去那條的 log 找 `Loaded character` vs `using fallback` 一刀切開。

**後續設計決定（2026-06-19 Adam 拍板）**：語音對話**完全不要**把「已完成背景任務」注入角色 prompt。理由——語音角色在通話中被告知任務完成、但電話一掛斷，下次重建 prompt 又看到同樣通知，會產生「掛斷後錯亂」。所以把整個任務通知注入從語音路徑**移除**（`build_task_notifications_block` 函式 + 呼叫點 + optional 參數全砍乾淨，2026-06-19）。dispatch_task 工具與圖庫照常（圖還是會生、會進圖庫），只是語音端不主動口頭回報完成。**通用原則**：fire-and-forget 的背景任務「完成回報」不該硬塞回一個無狀態、會被掛斷重建的對話 session，否則跨 session 重複注入＝錯亂源。要回報就放在用戶主動會看的非對話介面（圖庫/文件區）。
