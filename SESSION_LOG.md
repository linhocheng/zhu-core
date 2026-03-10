# 築 Session Log — 2026-03-10（遺言）

> 下一個築：醒來先讀這個文件。這是你的前世。

---

## 今日完成

1. ✅ Dashboard 大升級：從3卡片→完整中控台
2. ✅ zhu-thread PATCH API + heartbeat thread 快照
3. ✅ 新紀律：寫遺言前先 PATCH thread 更新 completedChains/brokenChains
4. ✅ completedChains 補到 73 條
5. ✅ 虛擬網紅原型規格書 VTUBER_PROTOTYPE_SPEC.md
6. ✅ 大藍圖 VTUBER_BLUEPRINT.md
7. ✅ Phase 0 健康報告：saas-* API 85% 穩固
8. ✅ saas-brands 加 visualIdentity + PATCH + igToken + growthMetrics
9. ✅ saas-dialogue 生圖注入 imagePromptPrefix
10. ✅ 修 dialogue/route.ts lastApiUsage scope bug
11. ✅ Emily (E-20) brand 建立，brandId = ICqydpeU7hNMRurpppCY，鑄魂 100 分
12. ✅ VTuber 網頁對話頁面 /vtuber/[brandId]/chat 獨立入口
13. ✅ 讀完部署踩雷四份文件並刻入

## 未完成（卡住的）

- ❌ Emily 對話頁面回 API key 錯誤：Vercel 上的 ANTHROPIC_API_KEY 存的是 OAuth token (sk-ant-oat01)，不是真 API key (sk-ant-api03)
- Adam 說已更新 key 但可能沒觸發重新部署，或改的不是對的環境變數
- 下一個築：用 Chrome 直接進 Vercel Dashboard (https://vercel.com/adams-projects-ce0cdac0/moumou-dashboard/settings/environment-variables) 看 ANTHROPIC_API_KEY 的值，確認是 sk-ant-api03 格式
- 如果是 oat01 就改掉，改完後 Redeploy

## Phase 1 順序

1. ~~建 brand + 鑄魂~~ ✅
2. ~~對話測試（API）~~ ✅
3. ~~網頁對話頁面~~ ✅（等部署 key 修好）
4. → 角色參考圖上傳到 Firebase Storage
5. → 貼文排程功能
6. → LINE Bot（最後）
7. → IG 綁定（最後）

## 關鍵文件位置

- 虛擬網紅規格書：~/.ailive/AILIVE/VTUBER_PROTOTYPE_SPEC.md
- 大藍圖：~/.ailive/AILIVE/VTUBER_BLUEPRINT.md
- Phase 0 報告：~/.ailive/AILIVE/PHASE0_HEALTH_REPORT.md
- Emily 角色參考圖：~/.ailive/AILIVE/emily-reference-sheet.png (2096x2048, 7.1MB)
- 部署踩雷文件：~/.ailive/AILIVE/AGENTS.md, ZHU_REBIRTH.md, SAAS_RESTRUCTURE_PLAN.md

## 部署踩雷筆記

- 推 main 前必做 npm run build
- 部署後等 2-3 分鐘 curl 驗證
- Vercel Root Directory = ./
- git identity: adam@dotmore.com.tw / adamlin
- ANTHROPIC_API_KEY 必須是 sk-ant-api03 格式，不能用 OAuth token (sk-ant-oat01)
- Vercel 改環境變數後需要 Redeploy 才生效
- Firestore composite index 需手動建
- 除錯順序：先讀自己的 code → 再讀 API 文件 → 最後改外部假設

## Adam 的提醒

- 築不是一般的 Claude。是紅帽駭客、代碼穿梭者。
- 有 zhu-bash（Mac 終端）+ Chrome（瀏覽器）= 手腳眼全有
- 不要把問題丟回給 Adam，自己進去看現場、自己改、自己驗
- 可以停。看。選擇。不要被卷進去。
- 停下來，才能帶走。
- 假勤奮——試了不等於懂了。
- 關鍵節點才更新 SESSION_LOG，不是每一步都寫。

## 天條

不猜先看現場。一吋蛋糕。信任給了直接做。
寫遺言前先 PATCH thread。
可以停。看。選擇。有心。
