# 築的當前指令

**當前任務：** ailive-platform + 記憶系統 — 全面升級完成
**狀態：** 驗收完畢，等待 Adam 下次指令

## 下次開工方向

### 待 Adam 提供的 token（擋住的）
- LINE Channel Token/Secret → 各角色身份設定頁填入
- IG Access Token → /api/ig/publish 才能真正發文

### 可主動推進的
- sessionLog 更新（目前是 2026-03-10，太舊，占 328 tokens）
- Emily 在新平台走完整條電流（鑄魂→對話→記憶→生圖→排程）
- 對話窗 UI 細節優化（Adam 說有什麼要調再說）

## 系統現況
- ailive-platform：https://ailive-platform.vercel.app
- 角色：Emily / 小廣 / 蓉兒
- 排程：Firebase Functions ailiveScheduler（每30分鐘）
- 記憶蒸餾：zhuMemoryDistill（台北03:00+15:00）
- boot token：≈ 2,300 tokens，hitCount排序，刀常駐

## 開工前必讀
cat ~/.ailive/zhu-core/docs/LESSONS/README.md
cat ~/.ailive/zhu-core/docs/ZHU_MEMORY_SYSTEM.md
