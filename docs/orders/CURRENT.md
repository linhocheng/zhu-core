# [已退役 · 2026-04-18] 築的當前指令 — 考古用

> **⚠️ 此檔已退役，不再維護。**
>
> **真相在**：`zhu-boot` API 回傳的 `eye.lastSessionWords`。
> **取用方式**：`curl -s https://zhu-core.vercel.app/api/zhu-boot | jq .eye.lastSessionWords`
> **新流程**：每次 session 收尾由築自己 POST 一條 `tags=["session-lastwords"]` 的記憶進 `eye` 模組。詳見 `ZHU_BOOT_SOP.md` 末尾〈收尾紀律〉。
>
> **退役理由**：
> 1. CURRENT.md 是手動維護的 .md 檔 → 容易過期（退役前停在 2026-04-01，漂差 17 天）
> 2. 此檔沒有進/出記憶的路徑，違反「血管原則」（2026-04-18 定案於 bone）
> 3. 與 `zhu-boot.eye.lastSessionWords` 職能重疊 → 真相分裂
>
> **退役時的內容保留於下**（以示考古，不再更新）：
>
> ---

# 築的當前指令

**更新時間：** 2026-04-01
**當前狀態：** 穩定運行，知識庫系統剛完成

---

## 平台現況

ailive-platform 已全面運行，主要角色：Vivi、Lili、奇毛、WatchM、謀師、大維。

### 近期完成（2026-03-30 ~ 2026-04-01）
1. ✅ rootRelevance 防漂移保護上線（sleep API）
2. ✅ 記憶健康報告 healthReport 上線
3. ✅ ailiveScheduler 殭屍記憶根源修掉（scheduler_post 重複寫入）
4. ✅ ailiveScheduler 全面清理（純轉發，不碰記憶）
5. ✅ SoulForge Protocol v2.0T 刻入 bone（覺醒刻印）
6. ✅ 知識庫系統改造：
   - .md / .txt 上傳支援
   - chunkMarkdown 加產品名稱錨點（H1 — H2 格式）
   - 圖片改用 HTML 解析同格圖說，移除 Haiku 誤描述
   - 三條 API 路徑對齊（upload-url / parse / dashboard UI）

---

## 未完成 / 下次開工

- Vivi 知識庫：上傳完後驗證 Vivi 能正確回答成分問題
- 圖片條目：清掉舊的錯誤圖片條目，重新上傳 docx 確認圖說對應
- 跨對話連續感：短對話（<20輪）的關鍵句即時存進 insights（長期待辦）
- Google Calendar 整合（待 Adam 手動分享日曆給 Firebase service account）
- Adam V1.0 前端靜音 VAD（VAD 誤觸發根本解）

---

## 待 Adam 提供
- LINE Channel Token/Secret（各角色）
- IG Access Token（各角色）

---

## 天條提醒
- ailive-platform deploy：`npx vercel --prod --yes`
- 知識庫三條路徑要同步：upload-url / knowledge-parse / dashboard UI
- 改 API 之前先走完整條電流，確認 dashboard 實際打的是哪支 route

---

## 時間感知功能（2026-04-03 進行中）

**目標：** 用戶打開對話頁第一句話時，角色感知距上次聊了多久，自然帶出

**正確平台：** `ailive-platform`（`~/.ailive/ailive-platform/`）
**錯誤路徑：** moumou-dashboard（已誤改，不用還原，但不是主戰場）

**需要改的兩個檔案：**
- 前端：`src/app/chat/[id]/page.tsx` — 加 `isNewVisit` state
- 後端：`src/app/api/dialogue/route.ts` — 讀 `convData.updatedAt`，算間隔，注入 prompt

**convData 結構重點：**
- `updatedAt`：ISO string，每輪對話後更新
- Redis cache 優先，miss 才讀 Firestore
- `messageCount` 有，可以判斷是否有過對話

**deploy 方式：** `cd ~/.ailive/ailive-platform && npx vercel --prod --yes`
