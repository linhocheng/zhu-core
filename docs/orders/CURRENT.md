# 築的當前指令

**當前任務：** ailive-platform — 能力驗收 + 細節調整
**狀態：** Phase 0-4 完成，進入驗收調整期

## Platform 現況
- **deploy：** https://ailive-platform.vercel.app
- **角色：** Emily (fbG8xbuXDG9ZJCLAfeXB) / 小廣 (zjD63GpVTy5neo07IwDa)
- **對話窗：** /chat/[id]（可分享給用戶）
- **後台：** /dashboard

## 明天開工方向

### 優先（能力驗收）
1. 逐一驗收對話中各工具能力：
   - 讀圖（傳圖 → 角色看到並回應）
   - 生圖（對話中說畫圖 → 圖出現在泡泡）✅ 今天已修
   - query_tasks / update_task（查任務、改時間）
   - save_post_draft（存草稿 → 後台看到）
   - web_search（查時事）✅ 今天已驗
2. 對話窗 UI 細節（有什麼需要調的 Adam 說）

### 待建
- /api/ig/publish（IG Graph API 發文，等 Adam 有 IG token）
- LINE 開通（各角色填 Channel Token/Secret 在 identity 頁）
- Emily 在新平台重建（走完整條電流：鑄魂 → 對話 → 記憶 → 生圖）

## 開工前必讀
cat ~/.ailive/zhu-core/docs/AILIVE_BUILD_LOG.md
curl -s https://zhu-core.vercel.app/api/zhu-boot
